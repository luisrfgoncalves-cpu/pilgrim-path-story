import { useState, useCallback, useRef } from 'react';

/**
 * useTTS — Text-to-Speech com cache inteligente + narração neural.
 * 
 * Cache paths por provedor: elevenlabs/ > freetts/ > eidosspeech/
 * O client tenta o melhor provedor primeiro (ElevenLabs),
 * depois fallback para FreeTTS e eidosSpeech.
 * 
 * Cache:
 *   1. Memória (sessão)
 *   2. IndexedDB (persistente no celular)
 *   3. Supabase Storage (global — separado por provedor)
 *   4. Edge Function gera e salva automaticamente
 */

type TTSTier = 'elevenlabs' | 'freetts' | 'eidosspeech' | 'cached';
type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

interface TTSOptions {
  emotion?: EmotionType;
  isEpic?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const memoryCache = new Map<string, string>();

// Provider priority: best first
const PROVIDER_PRIORITY = ['elevenlabs', 'freetts', 'eidosspeech'] as const;

// ─── IndexedDB ───
const DB_NAME = 'peregrino-tts-cache';
const DB_VERSION = 1;
const STORE_NAME = 'audio';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getFromIDB(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveToIDB(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, key);
  } catch {
    // Cache is optional
  }
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCacheKey(text: string, emotion: string): string {
  return `${emotion}:${text.slice(0, 200)}`;
}

function playAudioUrl(url: string): { audio: HTMLAudioElement; promise: Promise<void> } {
  const audio = new Audio(url);
  const promise = new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio playback failed'));
  });
  return { audio, promise };
}

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTier, setCurrentTier] = useState<TTSTier | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTier(null);
  }, []);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    stop();

    const { emotion = 'neutral' } = options;

    const cleanText = text
      .replace(/\{\{\/?\w+\}\}/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    setIsPlaying(true);

    const cacheKey = getCacheKey(cleanText, emotion);

    // ═══ LAYER 1: Memory cache ═══
    if (memoryCache.has(cacheKey)) {
      try {
        const { audio, promise } = playAudioUrl(memoryCache.get(cacheKey)!);
        audioRef.current = audio;
        setCurrentTier('cached');
        await audio.play();
        await promise;
        setIsPlaying(false);
        setCurrentTier(null);
        return;
      } catch { /* fall through */ }
    }

    // ═══ LAYER 2: IndexedDB ═══
    try {
      const cachedBlob = await getFromIDB(cacheKey);
      if (cachedBlob) {
        const url = URL.createObjectURL(cachedBlob);
        memoryCache.set(cacheKey, url);
        const { audio, promise } = playAudioUrl(url);
        audioRef.current = audio;
        setCurrentTier('cached');
        await audio.play();
        await promise;
        setIsPlaying(false);
        setCurrentTier(null);
        return;
      }
    } catch { /* fall through */ }

    // ═══ LAYER 3: Supabase Storage — try best provider first ═══
    try {
      const hash = await hashKey(cleanText, emotion);
      for (const provider of PROVIDER_PRIORITY) {
        const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/tts-cache/${provider}/${emotion}/${hash}.mp3`;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);
          const resp = await fetch(storageUrl, { signal: controller.signal });
          clearTimeout(timeout);
          if (resp.ok && resp.headers.get('content-type')?.includes('audio')) {
            const blob = await resp.blob();
            if (blob.size > 100) {
              const url = URL.createObjectURL(blob);
              memoryCache.set(cacheKey, url);
              saveToIDB(cacheKey, blob);
              const { audio, promise } = playAudioUrl(url);
              audioRef.current = audio;
              setCurrentTier(provider as TTSTier);
              await audio.play();
              await promise;
              setIsPlaying(false);
              setCurrentTier(null);
              return;
            }
          }
        } catch { /* try next provider */ }
      }
    } catch { /* fall through */ }

    // ═══ LAYER 4: Edge Function (generates + caches) ═══
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ text: cleanText, emotion }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const source = response.headers.get('X-TTS-Source') || 'unknown';
        const blob = await response.blob();
        if (blob.size > 100) {
          const url = URL.createObjectURL(blob);
          memoryCache.set(cacheKey, url);
          saveToIDB(cacheKey, blob);
          const { audio, promise } = playAudioUrl(url);
          audioRef.current = audio;
          setCurrentTier(source as TTSTier);
          await audio.play();
          await promise;
          setIsPlaying(false);
          setCurrentTier(null);
          return;
        }
      }
    } catch { /* fall through */ }

    // All failed — no audio (no robotic voice)
    console.log('[TTS] All providers unavailable. Text-only mode.');
    setIsPlaying(false);
    setCurrentTier(null);
  }, [stop]);

  return { speak, stop, isPlaying, currentTier };
}
