import { useRef, useCallback, useEffect } from 'react';
import { EmotionalTone } from '@/lib/emotionalIntensity';

/**
 * Procedural audio engine — Game Soundtrack Style
 * 
 * Instead of continuous drones, this engine plays:
 * - Musical phrases that breathe (play → silence → play)
 * - Gentle ambient pads with slow LFO volume modulation (swell in/out)
 * - Melodic motifs based on pentatonic/modal scales
 * - Much lower master volume to stay non-intrusive
 * 
 * Ambiences cycle between 8-15s of soft music and 4-8s of silence,
 * so the sound never becomes irritating or monotonous.
 */

export type AmbienceType = 'wind' | 'tense' | 'dark' | 'peaceful' | 'silence';
export type SfxType = 'decision' | 'positive' | 'negative';

const FADE = 2; // slower fades for smoother transitions
const MASTER_VOL = 0.12; // much quieter overall

let _ctx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
};

/* Musical scales */
const PENTATONIC_MINOR = [0, 3, 5, 7, 10]; // semitones
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Play a single gentle note */
function playNote(
  ctx: AudioContext, dest: AudioNode,
  freq: number, startTime: number, duration: number,
  type: OscillatorType = 'sine', vol = 0.06
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = ctx.createGain();
  const attack = Math.min(0.4, duration * 0.2);
  const release = Math.min(0.8, duration * 0.4);
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(vol, startTime + attack);
  g.gain.setValueAtTime(vol, startTime + duration - release);
  g.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(g);
  g.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
}

interface AmbienceState {
  gain: GainNode;
  intervalId: ReturnType<typeof setTimeout>;
  stopped: boolean;
}

export function useAudioEngine() {
  const currentAmbience = useRef<AmbienceState | null>(null);
  const currentType = useRef<AmbienceType | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const enabled = useRef(true);

  const getMaster = useCallback((): GainNode => {
    if (masterGain.current) return masterGain.current;
    const ctx = getCtx();
    const g = ctx.createGain();
    g.gain.value = MASTER_VOL;
    g.connect(ctx.destination);
    masterGain.current = g;
    return g;
  }, []);

  const stopAmbience = useCallback((fadeTime = FADE) => {
    if (!currentAmbience.current) return;
    const state = currentAmbience.current;
    state.stopped = true;
    clearInterval(state.intervalId);
    const ctx = getCtx();
    state.gain.gain.setTargetAtTime(0, ctx.currentTime, fadeTime / 3);
    currentAmbience.current = null;
    currentType.current = null;
    setTimeout(() => {
      try { state.gain.disconnect(); } catch {}
    }, fadeTime * 1000 + 500);
  }, []);

  /**
   * Each ambience type defines a "playPhrase" function that schedules
   * a short musical phrase (3-8s), then returns. The engine calls it
   * periodically with silence gaps in between.
   */
  const startAmbience = useCallback((type: AmbienceType) => {
    if (!enabled.current) return;
    if (type === currentType.current) return;
    stopAmbience();

    if (type === 'silence') {
      currentType.current = 'silence';
      return;
    }

    const ctx = getCtx();
    const master = getMaster();
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(master);
    g.gain.setTargetAtTime(1, ctx.currentTime, FADE / 3);

    // Add a gentle reverb-like effect via delay
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.3;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.15;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1200;
    g.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);

    const playPhrase = () => {
      if (state.stopped) return;
      const now = ctx.currentTime;

      switch (type) {
        case 'wind': {
          // Gentle wind-like pad with slow melody — pentatonic, airy
          const root = 60; // C4
          const scale = PENTATONIC_MINOR;
          const noteCount = 3 + Math.floor(Math.random() * 3);
          for (let i = 0; i < noteCount; i++) {
            const degree = pickRandom(scale);
            const octave = pickRandom([0, 0, 12, -12]);
            const freq = midiToFreq(root + degree + octave);
            const start = now + i * (1.2 + Math.random() * 1.5);
            const dur = 2 + Math.random() * 3;
            playNote(ctx, g, freq, start, dur, 'sine', 0.04 + Math.random() * 0.03);
          }
          break;
        }
        case 'tense': {
          // Low minor notes, sparse, with occasional dissonance
          const root = 48; // C3
          const scale = DORIAN;
          const noteCount = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < noteCount; i++) {
            const degree = pickRandom(scale);
            const freq = midiToFreq(root + degree);
            const start = now + i * (1.5 + Math.random() * 2);
            const dur = 3 + Math.random() * 3;
            playNote(ctx, g, freq, start, dur, 'triangle', 0.03 + Math.random() * 0.02);
          }
          // Occasional low rumble note
          if (Math.random() > 0.5) {
            playNote(ctx, g, midiToFreq(36), now + 1, 5, 'sine', 0.025);
          }
          break;
        }
        case 'dark': {
          // Very low, sparse, haunting — single long notes
          const notes = [36, 38, 41, 43]; // C2, D2, F2, G2
          const midi = pickRandom(notes);
          playNote(ctx, g, midiToFreq(midi), now, 6 + Math.random() * 4, 'sine', 0.03);
          // Eerie high harmonic (barely audible)
          if (Math.random() > 0.4) {
            const hiNote = pickRandom([72, 74, 77, 79]);
            playNote(ctx, g, midiToFreq(hiNote), now + 2, 4, 'sine', 0.012);
          }
          break;
        }
        case 'peaceful': {
          // Warm major arpeggios, lydian mode, gentle
          const root = 60;
          const scale = LYDIAN;
          const noteCount = 4 + Math.floor(Math.random() * 3);
          for (let i = 0; i < noteCount; i++) {
            const degree = scale[i % scale.length];
            const octave = i < 4 ? 0 : 12;
            const freq = midiToFreq(root + degree + octave);
            const start = now + i * (0.8 + Math.random() * 0.6);
            const dur = 2.5 + Math.random() * 2;
            playNote(ctx, g, freq, start, dur, 'sine', 0.05 + Math.random() * 0.02);
          }
          break;
        }
      }
    };

    // Breathing pattern: play phrase, then wait silence, repeat
    const phraseDuration = type === 'dark' ? 10000 : 8000;
    const silenceMin = type === 'peaceful' ? 3000 : 5000;
    const silenceMax = type === 'peaceful' ? 6000 : 10000;

    const scheduleNext = () => {
      if (state.stopped) return;
      playPhrase();
      const silence = silenceMin + Math.random() * (silenceMax - silenceMin);
      state.intervalId = setTimeout(scheduleNext, phraseDuration + silence);
    };

    const state: AmbienceState = {
      gain: g,
      intervalId: setTimeout(scheduleNext, 500), // start after brief pause
      stopped: false,
    };

    currentAmbience.current = state;
    currentType.current = type;
  }, [getMaster, stopAmbience]);

  /** One-shot SFX — short, musical, non-harsh */
  const playSfx = useCallback((type: SfxType) => {
    if (!enabled.current) return;
    const ctx = getCtx();
    const master = getMaster();
    const now = ctx.currentTime;

    if (type === 'decision') {
      // Gentle bell-like chime
      playNote(ctx, master, midiToFreq(72), now, 0.6, 'sine', 0.08); // C5
      playNote(ctx, master, midiToFreq(76), now + 0.05, 0.5, 'sine', 0.05); // E5
    }

    if (type === 'positive') {
      // Ascending major triad — gentle harp-like
      const notes = [60, 64, 67, 72]; // C E G C
      notes.forEach((n, i) => {
        playNote(ctx, master, midiToFreq(n), now + i * 0.12, 0.8 - i * 0.1, 'sine', 0.07);
      });
    }

    if (type === 'negative') {
      // Descending minor — soft, not harsh
      const notes = [67, 63, 60, 56]; // G Eb C Ab
      notes.forEach((n, i) => {
        playNote(ctx, master, midiToFreq(n), now + i * 0.15, 0.6, 'triangle', 0.05);
      });
    }
  }, [getMaster]);

  const setAmbienceForScene = useCallback((chapterId: string, tone: EmotionalTone) => {
    if (tone === 'heavy') { startAmbience('tense'); return; }
    if (tone === 'hopeful') { startAmbience('peaceful'); return; }
    if (chapterId.startsWith('fase3')) startAmbience('dark');
    else if (chapterId.startsWith('fase2')) startAmbience('tense');
    else startAmbience('wind');
  }, [startAmbience]);

  const sfxForChoice = useCallback((effects: Record<string, number>) => {
    const total = Object.values(effects).reduce((a, b) => a + (b || 0), 0);
    if (total > 0) playSfx('positive');
    else if (total < 0) playSfx('negative');
    else playSfx('decision');
  }, [playSfx]);

  const toggleAudio = useCallback((on: boolean) => {
    enabled.current = on;
    if (!on) stopAmbience(0.3);
  }, [stopAmbience]);

  useEffect(() => {
    return () => { stopAmbience(0.1); };
  }, [stopAmbience]);

  return {
    startAmbience,
    stopAmbience,
    playSfx,
    setAmbienceForScene,
    sfxForChoice,
    toggleAudio,
    isEnabled: () => enabled.current,
  };
}
