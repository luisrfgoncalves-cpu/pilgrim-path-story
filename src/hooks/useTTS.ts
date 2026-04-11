import { useState, useCallback, useRef } from 'react';

/**
 * useTTS — Text-to-Speech com cache inteligente de 3 camadas:
 * 
 * Cache Layer 1: Memória (sessão)
 * Cache Layer 2: IndexedDB (persistente no celular)
 * Cache Layer 3: Supabase Storage (global — todos compartilham)
 * Geração:  ElevenLabs via Edge Function (só na 1ª vez)
 * Fallback: Web Speech API (offline, sempre disponível)
 */

type TTSTier = 'elevenlabs' | 'webspeech' | 'cached';
type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

interface TTSOptions {
  emotion?: EmotionType;
  isEpic?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// In-memory cache (session lifetime)
const memoryCache = new Map<string, string>();

// ─── IndexedDB persistent cache ───
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
    // Silently fail — cache is optional
  }
}

// ─── Hash function (matches edge function) ───
async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCacheKey(text: string, emotion: string): string {
  return `${emotion}:${text.slice(0, 200)}`;
}

// ─── Play audio from URL ───
function playAudioUrl(url: string): { audio: HTMLAudioElement; promise: Promise<void> } {
  const audio = new Audio(url);
  const promise = new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio playback failed'));
  });
  return { audio, promise };
}

// ─── Web Speech API fallback (always available, no network) ───
const SPEECH_RATES: Record<EmotionType, number> = {
  neutral: 0.9,
  dramatic: 0.85,
  solemn: 0.8,
  urgent: 1.05,
  celestial: 0.85,
  villain: 0.8,
};

function speakWithWebSpeech(text: string, emotion: EmotionType): { cancel: () => void; promise: Promise<void> } {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = SPEECH_RATES[emotion] || 0.9;
  utterance.pitch = emotion === 'villain' ? 0.7 : emotion === 'celestial' ? 1.2 : 1.0;

  // Try to find a pt-BR voice
  const voices = speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt-BR')) || voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utterance.voice = ptVoice;

  const promise = new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(e.error || 'Speech failed'));
  });

  speechSynthesis.speak(utterance);

  return {
    cancel: () => speechSynthesis.cancel(),
    promise,
  };
}

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTier, setCurrentTier] = useState<TTSTier | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechCancelRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (speechCancelRef.current) {
      speechCancelRef.current();
      speechCancelRef.current = null;
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

    // ═══ LAYER 1: Memory cache (instant) ═══
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

    // ═══ LAYER 2: IndexedDB cache (persistent on device) ═══
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

    // ═══ LAYER 3: Supabase Storage (global cache) ═══
    try {
      const hash = await hashKey(cleanText, emotion);
      const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/tts-cache/${emotion}/${hash}.mp3`;
      // Use GET with small timeout instead of HEAD (HEAD returns 400 on missing files)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(storageUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok && resp.headers.get('content-type')?.includes('audio')) {
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        memoryCache.set(cacheKey, url);
        saveToIDB(cacheKey, blob); // fire-and-forget
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

    // ═══ LAYER 4: Generate via ElevenLabs Edge Function ═══
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
        const blob = await response.blob();
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          memoryCache.set(cacheKey, url);
          saveToIDB(cacheKey, blob); // fire-and-forget
          const { audio, promise } = playAudioUrl(url);
          audioRef.current = audio;
          setCurrentTier('elevenlabs');
          await audio.play();
          await promise;
          setIsPlaying(false);
          setCurrentTier(null);
          return;
        }
      }
    } catch { /* fall through */ }

    // ═══ FALLBACK: Web Speech API (always works, no network needed) ═══
    try {
      if ('speechSynthesis' in window) {
        setCurrentTier('webspeech');
        const { cancel, promise } = speakWithWebSpeech(cleanText, emotion);
        speechCancelRef.current = cancel;
        await promise;
        setIsPlaying(false);
        setCurrentTier(null);
        return;
      }
    } catch { /* fall through */ }

    // All failed silently
    setIsPlaying(false);
    setCurrentTier(null);
  }, [stop]);

  return { speak, stop, isPlaying, currentTier };
}
