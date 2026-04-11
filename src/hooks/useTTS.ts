import { useState, useCallback, useRef } from 'react';
import { narrate, stopNarration, type NarrationStyle } from '@/lib/narrator';

/**
 * useTTS — Text-to-Speech com cache inteligente + narração neural.
 *
 * Para garantir consistência vocal na jornada, o cliente trava a narração
 * em um único provedor/voz masculina (FreeTTS AntonioNeural) e só cai para
 * a voz local masculina em caso extremo.
 */

type TTSTier = 'elevenlabs' | 'freetts' | 'eidosspeech' | 'cached' | 'local';
type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

interface TTSOptions {
  emotion?: EmotionType;
  isEpic?: boolean;
  onEnd?: () => void;
  allowLocalFallback?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const LOCKED_PROVIDER: Extract<TTSTier, 'freetts'> = 'freetts';

const memoryCache = new Map<string, string>();
let globalAudio: HTMLAudioElement | null = null;
let globalPlaybackToken = 0;
let sessionVoiceMode: Extract<TTSTier, 'freetts' | 'local'> | null = null;

const PROVIDER_PRIORITY = [LOCKED_PROVIDER] as const;

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
  return `${LOCKED_PROVIDER}:${emotion}:${text.slice(0, 200)}`;
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

function getEstimatedNarrationMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2200, Math.min(18000, words * 340));
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

  const playResolvedUrl = useCallback(async (url: string, token: number, tier: TTSTier, cacheKey?: string, blob?: Blob, onEnd?: () => void, textLength = 0) => {
    if (token !== globalPlaybackToken) return false;
    const { audio, promise } = playAudioUrl(url);
    stopGlobalAudio();
    globalAudio = audio;
    setCurrentTier(tier);
    if (cacheKey && blob) {
      memoryCache.set(cacheKey, url);
      saveToIDB(cacheKey, blob);
    }

    const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();

    try {
      await audio.play();
      if (tier === LOCKED_PROVIDER) {
        sessionVoiceMode = LOCKED_PROVIDER;
      }
      await promise;
    } catch {
      return false;
    }

    const endedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsedMs = endedAt - startedAt;
    const suspiciouslyShort = textLength > 60 && elapsedMs < 1400;

    if (token === globalPlaybackToken) {
      globalAudio = null;
      setIsPlaying(false);
      setCurrentTier(null);
      if (!suspiciouslyShort) {
        onEnd?.();
      }
    }

    return !suspiciouslyShort;
  }, []);

  const playLocalFallback = useCallback(async (text: string, token: number, emotion: EmotionType, onEnd?: () => void) => {
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
        if (ok) {
          sessionVoiceMode = 'local';
        }
        if (token === globalPlaybackToken) {
          setIsPlaying(false);
          setCurrentTier(null);
          onEnd?.();
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

    const { emotion = 'neutral', onEnd, allowLocalFallback = sessionVoiceMode !== LOCKED_PROVIDER } = options;
    const cleanText = text.replace(/\{\{\/?\w+\}\}/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanText) {
      onEnd?.();
      return;
    }

    const token = globalPlaybackToken;
    tokenRef.current = token;
    setIsPlaying(true);
    const cacheKey = getCacheKey(cleanText, emotion);
    const canUseRemote = sessionVoiceMode !== 'local';

    if (canUseRemote && memoryCache.has(cacheKey)) {
      try {
        const ok = await playResolvedUrl(memoryCache.get(cacheKey)!, token, LOCKED_PROVIDER, undefined, undefined, onEnd, cleanText.length);
        if (ok) return;
      } catch {}
    }

    try {
      if (canUseRemote) {
        const cachedBlob = await getFromIDB(cacheKey);
        if (cachedBlob) {
          const url = URL.createObjectURL(cachedBlob);
          const ok = await playResolvedUrl(url, token, LOCKED_PROVIDER, cacheKey, cachedBlob, onEnd, cleanText.length);
          if (ok) return;
        }
      }
    } catch {}

    if (canUseRemote) {
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
                const ok = await playResolvedUrl(url, token, provider, cacheKey, blob, onEnd, cleanText.length);
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
          body: JSON.stringify({ text: cleanText, emotion, forceProvider: LOCKED_PROVIDER }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 100) {
            const url = URL.createObjectURL(blob);
            const ok = await playResolvedUrl(url, token, LOCKED_PROVIDER, cacheKey, blob, onEnd, cleanText.length);
            if (ok) return;
          }
        }
      } catch {}
    }

    if (allowLocalFallback && sessionVoiceMode !== LOCKED_PROVIDER) {
      const localOk = await playLocalFallback(cleanText, token, emotion, onEnd);
      if (localOk) return;
    }

    console.log('[TTS] Locked voice unavailable. Maintaining cinematic flow without switching voices.');
    const delay = getEstimatedNarrationMs(cleanText);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        if (!finalizeIfCurrent(token, null)) return;
        onEnd?.();
      }, delay);
      return;
    }

    finalizeIfCurrent(token, null);
    onEnd?.();
  }, [finalizeIfCurrent, playLocalFallback, playResolvedUrl, stop]);

  return { speak, stop, isPlaying, currentTier };
}
