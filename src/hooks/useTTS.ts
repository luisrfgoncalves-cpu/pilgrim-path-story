import { useState, useCallback, useRef } from 'react';

/**
 * useTTS — Text-to-Speech com cache inteligente de 3 camadas:
 * 
 * Cache Layer 1: IndexedDB local (celular do usuário — instantâneo)
 * Cache Layer 2: Supabase Storage (global — todos os usuários compartilham)
 * Geração:  ElevenLabs via Edge Function (só na 1ª vez de cada frase)
 * Fallback: FreeTTS.org / eidosSpeech.xyz se ElevenLabs falhar
 * 
 * RESULTADO: Cada frase é gerada UMA VEZ na vida.
 * Depois disso, todos os usuários usam o áudio salvo.
 */

type TTSTier = 'elevenlabs' | 'freetts' | 'eidosspeech' | 'cached';
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

// ─── Play audio from URL/Blob ───
function playAudioUrl(url: string): { audio: HTMLAudioElement; promise: Promise<void> } {
  const audio = new Audio(url);
  const promise = new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio playback failed'));
  });
  return { audio, promise };
}

// ─── Supabase Storage direct URL (public bucket) ───
function getStorageUrl(emotion: string, hash: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/tts-cache/${emotion}/${hash}.mp3`;
}

// ─── FreeTTS.org fallback ───
const FREETTS_VOICES: Record<EmotionType, string> = {
  neutral: 'pt-BR-FranciscaNeural',
  dramatic: 'pt-BR-AntonioNeural',
  solemn: 'pt-BR-FranciscaNeural',
  urgent: 'pt-BR-AntonioNeural',
  celestial: 'pt-BR-FranciscaNeural',
  villain: 'pt-BR-AntonioNeural',
};

async function speakWithFreeTTS(text: string, emotion: EmotionType): Promise<Blob> {
  const voice = FREETTS_VOICES[emotion] || 'pt-BR-FranciscaNeural';
  const response = await fetch('https://freetts.org/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice,
      speed: emotion === 'urgent' ? 1.15 : emotion === 'solemn' ? 0.85 : 1.0,
    }),
  });
  if (!response.ok) throw new Error(`FreeTTS failed: ${response.status}`);
  return await response.blob();
}

// ─── eidosSpeech.xyz fallback ───
async function speakWithEidos(text: string, emotion: EmotionType): Promise<Blob> {
  const voice = emotion === 'villain' || emotion === 'dramatic'
    ? 'pt-BR-AntonioNeural'
    : 'pt-BR-FranciscaNeural';
  const response = await fetch('https://eidosspeech.xyz/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });
  if (!response.ok) throw new Error(`eidosSpeech failed: ${response.status}`);
  return await response.blob();
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

    const { emotion = 'neutral', isEpic = false } = options;

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

    // ═══ LAYER 3: Supabase Storage (global cache — check via direct URL) ═══
    try {
      const hash = await hashKey(cleanText, emotion);
      const storageUrl = getStorageUrl(emotion, hash);
      const headResp = await fetch(storageUrl, { method: 'HEAD' });
      if (headResp.ok) {
        // Audio exists in global cache!
        const audioResp = await fetch(storageUrl);
        const blob = await audioResp.blob();
        const url = URL.createObjectURL(blob);
        memoryCache.set(cacheKey, url);
        await saveToIDB(cacheKey, blob); // Save locally for next time
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

    // ═══ LAYER 4: Generate via API (only happens ONCE per phrase ever) ═══
    const tiers: TTSTier[] = isEpic
      ? ['elevenlabs', 'freetts', 'eidosspeech']
      : ['freetts', 'elevenlabs', 'eidosspeech'];

    for (const tier of tiers) {
      try {
        let blob: Blob;

        if (tier === 'elevenlabs') {
          // This goes through edge function which also saves to Storage
          const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify({ text: cleanText, emotion }),
          });
          if (!response.ok) throw new Error(`ElevenLabs TTS failed: ${response.status}`);
          blob = await response.blob();
        } else if (tier === 'freetts') {
          blob = await speakWithFreeTTS(cleanText, emotion);
        } else {
          blob = await speakWithEidos(cleanText, emotion);
        }

        // Save to local caches
        const url = URL.createObjectURL(blob);
        memoryCache.set(cacheKey, url);
        await saveToIDB(cacheKey, blob);

        const { audio, promise } = playAudioUrl(url);
        audioRef.current = audio;
        setCurrentTier(tier);
        await audio.play();
        await promise;
        setIsPlaying(false);
        setCurrentTier(null);
        return;
      } catch {
        continue;
      }
    }

    // All tiers failed — text remains written only
    setIsPlaying(false);
    setCurrentTier(null);
  }, [stop]);

  return { speak, stop, isPlaying, currentTier };
}
