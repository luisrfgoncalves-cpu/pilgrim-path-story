import { useState, useEffect, useRef, useCallback } from 'react';

type PartVoice = 'antonio' | 'francisca';

interface UseNarrationOptions {
  chapterId: string;
  part: PartVoice;
  enabled?: boolean;
}

interface UseNarrationReturn {
  isPlaying: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  error: string | null;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  seekToLine: (lineIndex: number) => void;
}

export const useNarration = ({
  chapterId,
  part,
  enabled = true,
}: UseNarrationOptions): UseNarrationReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio URL
  const audioUrl = enabled
    ? `/audio/${part}/${chapterId}.mp3`
    : '';

  // Create/reset audio element when chapter changes
  useEffect(() => {
    if (!enabled || !audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
      setError(null);
    });

    audio.addEventListener('error', () => {
      setIsLoaded(false);
      setError(`Audio not found: ${chapterId}`);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      setIsPlaying(false);
      setIsLoaded(false);
    };
  }, [chapterId, audioUrl, enabled]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  }, []);

  const seekToLine = useCallback((_lineIndex: number) => {
    // Edge TTS generates a single MP3 per chapter, so seeking by line
    // is not possible. We play the full chapter audio.
    // This is a no-op for now.
  }, []);

  return {
    isPlaying,
    isMuted,
    isLoaded,
    error,
    play,
    pause,
    toggleMute,
    seekToLine,
  };
};
