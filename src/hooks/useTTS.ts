import { useState, useCallback, useRef } from 'react';

/**
 * useTTS — Text-to-Speech com 3 camadas de vozes neurais PT-BR:
 * 
 * 1. ElevenLabs (3 API keys em rotação via Edge Function)
 *    - Vozes neurais premium, usadas para momentos épicos
 *    - 10k chars/mês por key = 30k total
 * 
 * 2. FreeTTS.org (vozes Microsoft Neural, gratuito, sem key)
 *    - Narração principal, sem limite declarado
 *    - 20 req/min rate limit
 * 
 * 3. eidosSpeech.xyz (vozes Edge Neural, 30 req/dia grátis)
 *    - Fallback final de qualidade neural
 * 
 * SEM Web Speech API — nenhuma voz robótica de celular.
 * Se todas as APIs falharem, o texto permanece apenas escrito.
 */

type TTSTier = 'elevenlabs' | 'freetts' | 'eidosspeech';
type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

interface TTSOptions {
  emotion?: EmotionType;
  /** Is this an epic moment? If true, tries ElevenLabs first */
  isEpic?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// In-memory audio cache to avoid repeated API calls
const audioCache = new Map<string, string>();

function getCacheKey(text: string, tier: string): string {
  return `${tier}:${text.slice(0, 100)}`;
}

// ─── FreeTTS.org — Microsoft Neural voices, free, no key ───
const FREETTS_VOICES: Record<EmotionType, string> = {
  neutral: 'pt-BR-FranciscaNeural',
  dramatic: 'pt-BR-AntonioNeural',
  solemn: 'pt-BR-FranciscaNeural',
  urgent: 'pt-BR-AntonioNeural',
  celestial: 'pt-BR-FranciscaNeural',
  villain: 'pt-BR-AntonioNeural',
};

async function speakWithFreeTTS(text: string, emotion: EmotionType): Promise<string> {
  const cacheKey = getCacheKey(text, 'freetts');
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

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

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(cacheKey, url);
  return url;
}

// ─── eidosSpeech.xyz — Edge Neural voices, 30 req/day free ───
async function speakWithEidos(text: string, emotion: EmotionType): Promise<string> {
  const cacheKey = getCacheKey(text, 'eidosspeech');
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

  const voice = emotion === 'villain' || emotion === 'dramatic'
    ? 'pt-BR-AntonioNeural'
    : 'pt-BR-FranciscaNeural';

  const response = await fetch('https://eidosspeech.xyz/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) throw new Error(`eidosSpeech failed: ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(cacheKey, url);
  return url;
}

// ─── ElevenLabs via Edge Function (3 keys rotation server-side) ───
async function speakWithElevenLabs(text: string, emotion: EmotionType): Promise<string> {
  const cacheKey = getCacheKey(text, 'elevenlabs');
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

  const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ text, emotion }),
  });

  if (!response.ok) throw new Error(`ElevenLabs TTS failed: ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(cacheKey, url);
  return url;
}

// ─── Play audio from URL with Promise ───
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

    const { emotion = 'neutral', isEpic = false } = options;

    // Strip markup tags for TTS
    const cleanText = text
      .replace(/\{\{\/?\w+\}\}/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    setIsPlaying(true);

    // Tier cascade — all neural, no robotic voices
    const tiers: TTSTier[] = isEpic
      ? ['elevenlabs', 'freetts', 'eidosspeech']
      : ['freetts', 'elevenlabs', 'eidosspeech'];

    for (const tier of tiers) {
      try {
        let url: string;

        if (tier === 'elevenlabs') {
          url = await speakWithElevenLabs(cleanText, emotion);
        } else if (tier === 'freetts') {
          url = await speakWithFreeTTS(cleanText, emotion);
        } else {
          url = await speakWithEidos(cleanText, emotion);
        }

        const { audio, promise } = playAudioUrl(url);
        audioRef.current = audio;
        setCurrentTier(tier);
        await audio.play();
        await promise;
        setIsPlaying(false);
        setCurrentTier(null);
        return;
      } catch {
        // Try next tier
        continue;
      }
    }

    // All tiers failed — text remains written only, no robotic fallback
    setIsPlaying(false);
    setCurrentTier(null);
  }, [stop]);

  return { speak, stop, isPlaying, currentTier };
}
