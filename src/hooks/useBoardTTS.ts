import { useCallback, useRef } from 'react';
import { useTTS } from './useTTS';
import type { NarrationStyle } from '@/lib/narrator';

type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

/**
 * useBoardTTS — wraps useTTS for the multiplayer board context.
 * Provides convenience methods for narrating tile events, RPG intros, etc.
 * Ensures the same masculine neural voice (AntonioNeural) is used throughout.
 */
export function useBoardTTS() {
  const { speak, stop, isPlaying } = useTTS();
  const lastSpokenRef = useRef('');

  const narrateBoard = useCallback((text: string, emotion: EmotionType = 'dramatic', onEnd?: () => void) => {
    if (!text || text.length < 5) {
      onEnd?.();
      return;
    }
    // Strip emojis for cleaner narration
    const clean = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[«»""]/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean || clean.length < 5) {
      onEnd?.();
      return;
    }

    // Avoid repeating the exact same text
    if (lastSpokenRef.current === clean) {
      onEnd?.();
      return;
    }
    lastSpokenRef.current = clean;

    speak(clean, { emotion, onEnd, allowLocalFallback: false });
  }, [speak]);

  const stopBoard = useCallback(() => {
    lastSpokenRef.current = '';
    stop();
  }, [stop]);

  /** Map tile/event type to emotion */
  const getEmotion = useCallback((tileType: string): EmotionType => {
    switch (tileType) {
      case 'boss': case 'giant': return 'villain';
      case 'trap': case 'back_to_start': return 'urgent';
      case 'refuge': case 'blessing': case 'checkpoint': return 'solemn';
      case 'scripture': return 'solemn';
      case 'finish': case 'beulah_land': case 'delectable_mountains': return 'celestial';
      case 'challenge': case 'riddle': return 'dramatic';
      default: return 'dramatic';
    }
  }, []);

  return { narrateBoard, stopBoard, isPlaying, getEmotion };
}
