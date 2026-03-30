/**
 * Audio pre-warming — creates AudioContext ahead of time
 * so sounds play INSTANTLY with zero delay
 */
import { useEffect, useRef } from 'react';

const AudioCtx = typeof window !== 'undefined'
  ? (window.AudioContext || (window as any).webkitAudioContext)
  : null;

let sharedCtx: AudioContext | null = null;
let isWarmed = false;

/**
 * Get or create a shared, pre-warmed AudioContext
 */
export function getPrewarmedAudioContext(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

/**
 * Pre-warm the audio engine: creates context + plays a silent buffer
 * so subsequent sounds have zero startup latency
 */
function warmUp() {
  if (isWarmed) return;
  const ctx = getPrewarmedAudioContext();
  if (!ctx) return;

  // Play a silent buffer to "unlock" audio on mobile browsers
  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
  isWarmed = true;
}

/**
 * Hook that pre-warms audio on first user interaction
 * Call this once at the game level (e.g., in PresentialMultiplayer)
 */
export function useAudioPrewarm() {
  const listenerAttached = useRef(false);

  useEffect(() => {
    if (listenerAttached.current) return;
    listenerAttached.current = true;

    // Warm up on any user gesture (required by mobile browsers)
    const events = ['touchstart', 'mousedown', 'keydown'];
    const handler = () => {
      warmUp();
      events.forEach(e => document.removeEventListener(e, handler));
    };
    events.forEach(e => document.addEventListener(e, handler, { once: false, passive: true }));

    // Also try to pre-warm immediately (works if autoplay policy allows)
    warmUp();

    return () => {
      events.forEach(e => document.removeEventListener(e, handler));
    };
  }, []);
}

/**
 * Pre-schedule a sound to play after a delay, but create the oscillator NOW
 * so when the time comes there's zero latency
 */
export function scheduleSound(
  freq: number,
  delayMs: number,
  duration: number = 0.15,
  type: OscillatorType = 'sine',
  volume: number = 0.12,
) {
  const ctx = getPrewarmedAudioContext();
  if (!ctx) return;

  const startTime = ctx.currentTime + delayMs / 1000;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}
