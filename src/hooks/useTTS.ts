import { useState, useCallback, useRef } from 'react';

/**
 * useTTS — Text-to-Speech system with 3-tier fallback:
 * 1. ElevenLabs (epic moments only, limited monthly credits)
 * 2. Google Cloud TTS WaveNet (main narration, 1M chars/month free)
 * 3. Web Speech API (free, always available, fallback)
 *
 * API keys are stored as secrets and accessed via edge functions.
 * Without edge functions deployed, falls back to Web Speech API.
 */

type TTSTier = 'elevenlabs' | 'google' | 'webspeech';
type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

interface TTSOptions {
  emotion?: EmotionType;
  /** Force a specific tier */
  tier?: TTSTier;
  /** Is this an epic moment? If true, tries ElevenLabs first */
  isEpic?: boolean;
  /** Speech rate for Web Speech API (0.5-2) */
  rate?: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// In-memory audio cache
const audioCache = new Map<string, string>();

function getCacheKey(text: string, tier: string): string {
  return `${tier}:${text.slice(0, 100)}`;
}

/** Try Web Speech API synthesis */
function speakWithWebSpeech(text: string, rate = 0.9): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not supported'));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = 1;

    // Try to find a PT-BR voice
    const voices = speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt')) || voices[0];
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.speak(utterance);
  });
}

/** Try Google Cloud TTS via edge function */
async function speakWithGoogle(text: string, emotion: EmotionType): Promise<string> {
  const cacheKey = getCacheKey(text, 'google');
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

  const response = await fetch(`${SUPABASE_URL}/functions/v1/google-tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ text, emotion }),
  });

  if (!response.ok) throw new Error(`Google TTS failed: ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(cacheKey, url);
  return url;
}

/** Try ElevenLabs TTS via edge function */
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
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentTier(null);
  }, []);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    // Stop any current playback
    stop();

    const { emotion = 'neutral', isEpic = false, rate = 0.9 } = options;

    // Strip markup tags for TTS
    const cleanText = text
      .replace(/\{\{\/?\w+\}\}/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    setIsPlaying(true);

    // Tier cascade
    const tiers: TTSTier[] = isEpic
      ? ['elevenlabs', 'google', 'webspeech']
      : ['google', 'webspeech'];

    for (const tier of tiers) {
      try {
        if (tier === 'elevenlabs') {
          const url = await speakWithElevenLabs(cleanText, emotion);
          const audio = new Audio(url);
          audioRef.current = audio;
          setCurrentTier('elevenlabs');
          await audio.play();
          await new Promise<void>((resolve) => { audio.onended = () => resolve(); });
          setIsPlaying(false);
          return;
        }

        if (tier === 'google') {
          const url = await speakWithGoogle(cleanText, emotion);
          const audio = new Audio(url);
          audioRef.current = audio;
          setCurrentTier('google');
          await audio.play();
          await new Promise<void>((resolve) => { audio.onended = () => resolve(); });
          setIsPlaying(false);
          return;
        }

        if (tier === 'webspeech') {
          setCurrentTier('webspeech');
          await speakWithWebSpeech(cleanText, rate);
          setIsPlaying(false);
          return;
        }
      } catch {
        // Try next tier
        continue;
      }
    }

    // All tiers failed
    setIsPlaying(false);
  }, [stop]);

  return { speak, stop, isPlaying, currentTier };
}
