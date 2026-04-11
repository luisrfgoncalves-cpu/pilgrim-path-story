import { useState, useCallback, useRef } from 'react';
import { narrate, stopNarration, type NarrationStyle } from '@/lib/narrator';

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

type TTSTier = 'elevenlabs' | 'freetts' | 'eidosspeech' | 'cached' | 'local';
type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

interface TTSOptions {
  emotion?: EmotionType;
  isEpic?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const memoryCache = new Map<string, string>();
let globalAudio: HTMLAudioElement | null = null;
let globalPlaybackToken = 0;

const PROVIDER_PRIORITY = ['elevenlabs', 'freetts', 'eidosspeech'] as const;

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

function getNarrationStyle(emotion: EmotionType): NarrationStyle {
  switch (emotion) {
    case 'urgent':
    case 'villain':
      return 'urgent';
    case 'solemn':
      return 'calm';
    case 'celestial':
      return 'triumphant';
    case 'dramatic':
    default:
      return 'dramatic';
  }
}

function stopGlobalAudio() {
  stopNarration();
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.currentTime = 0;
    globalAudio = null;
  }
}

function playAudioUrl(url: string): { audio: HTMLAudioElement; promise: Promise<void> } {
  const audio = new Audio(url);
  audio.preload = 'auto';
  const promise = new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio playback failed'));
  });
  return { audio, promise };
}

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTier, setCurrentTier] = useState<TTSTier | null>(null);
  const tokenRef = useRef(0);

  const stop = useCallback(() => {
    globalPlaybackToken += 1;
    tokenRef.current = globalPlaybackToken;
    stopGlobalAudio();
    setIsPlaying(false);
    setCurrentTier(null);
  }, []);

  const finalizeIfCurrent = useCallback((token: number, tier: TTSTier | null = null) => {
    if (token !== globalPlaybackToken) return false;
    setIsPlaying(false);
    setCurrentTier(tier);
    return true;
  }, []);

  const playResolvedUrl = useCallback(async (url: string, token: number, tier: TTSTier, cacheKey?: string, blob?: Blob) => {
    if (token !== globalPlaybackToken) return false;
    const { audio, promise } = playAudioUrl(url);
    stopGlobalAudio();
    globalAudio = audio;
    setCurrentTier(tier);
    if (cacheKey && blob) {
      memoryCache.set(cacheKey, url);
      saveToIDB(cacheKey, blob);
    }
    await audio.play();
    await promise;
    if (token === globalPlaybackToken) {
      globalAudio = null;
      setIsPlaying(false);
      setCurrentTier(null);
    }
    return true;
  }, []);

  const playLocalFallback = useCallback(async (text: string, token: number, emotion: EmotionType) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || token !== globalPlaybackToken) {
      return false;
    }

    stopGlobalAudio();
    setCurrentTier('local');

    return await new Promise<boolean>((resolve) => {
      let finished = false;
      const estimatedDuration = Math.max(3000, Math.min(45000, Math.round(text.length * 85)));
      const finish = (ok: boolean) => {
        if (finished) return;
        finished = true;
        window.clearTimeout(safetyTimer);
        if (token === globalPlaybackToken) {
          setIsPlaying(false);
          setCurrentTier(null);
        }
        resolve(ok);
      };

      const safetyTimer = window.setTimeout(() => {
        finish(token === globalPlaybackToken);
      }, estimatedDuration);

      try {
        narrate(text, {
          force: true,
          style: getNarrationStyle(emotion),
          onEnd: () => finish(token === globalPlaybackToken),
        });
      } catch {
        finish(false);
      }
    });
  }, []);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    stop();

    const { emotion = 'neutral' } = options;
    const cleanText = text.replace(/\{\{\/?\w+\}\}/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const token = globalPlaybackToken;
    tokenRef.current = token;
    setIsPlaying(true);
    const cacheKey = getCacheKey(cleanText, emotion);

    if (memoryCache.has(cacheKey)) {
      try {
        const ok = await playResolvedUrl(memoryCache.get(cacheKey)!, token, 'cached');
        if (ok) return;
      } catch {}
    }

    try {
      const cachedBlob = await getFromIDB(cacheKey);
      if (cachedBlob) {
        const url = URL.createObjectURL(cachedBlob);
        const ok = await playResolvedUrl(url, token, 'cached', cacheKey, cachedBlob);
        if (ok) return;
      }
    } catch {}

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
              const ok = await playResolvedUrl(url, token, provider as TTSTier, cacheKey, blob);
              if (ok) return;
            }
          }
        } catch {}
      }
    } catch {}

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
        const source = (response.headers.get('X-TTS-Source') || 'unknown') as TTSTier;
        const blob = await response.blob();
        if (blob.size > 100) {
          const url = URL.createObjectURL(blob);
          const ok = await playResolvedUrl(url, token, source, cacheKey, blob);
          if (ok) return;
        }
      }
    } catch {}

    const localOk = await playLocalFallback(cleanText, token, emotion);
    if (localOk) return;

    console.log('[TTS] All providers unavailable. Text-only mode.');
    finalizeIfCurrent(token, null);
  }, [finalizeIfCurrent, playLocalFallback, playResolvedUrl, stop]);

  return { speak, stop, isPlaying, currentTier };
}
