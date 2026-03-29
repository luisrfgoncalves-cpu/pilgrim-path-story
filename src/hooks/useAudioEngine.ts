import { useRef, useCallback, useEffect } from 'react';
import { EmotionalTone } from '@/lib/emotionalIntensity';

/**
 * Procedural audio engine using Web Audio API.
 * Generates ambient soundscapes and SFX without external files.
 *
 * Ambiences:
 *  - wind: filtered noise for open areas (fase 1)
 *  - tense: low drone + dissonance for difficult moments (fase 2)
 *  - dark: rumble + eerie harmonic for shadow valleys (fase 3)
 *  - peaceful: warm pad for hopeful moments
 *  - silence: fade everything out
 *
 * SFX:
 *  - decision: short tonal hit on choice
 *  - positive: upward arpeggio
 *  - negative: descending minor tone
 */

export type AmbienceType = 'wind' | 'tense' | 'dark' | 'peaceful' | 'silence';
export type SfxType = 'decision' | 'positive' | 'negative';

const FADE = 1.5; // seconds

// Lazy-init AudioContext (needs user gesture)
let _ctx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
};

/* ---- Noise buffer (cached) ---- */
let _noiseBuf: AudioBuffer | null = null;
const getNoiseBuf = (ctx: AudioContext): AudioBuffer => {
  if (_noiseBuf) return _noiseBuf;
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  _noiseBuf = buf;
  return buf;
};

interface AmbienceNodes {
  gain: GainNode;
  sources: AudioNode[];
}

export function useAudioEngine() {
  const currentAmbience = useRef<AmbienceNodes | null>(null);
  const currentType = useRef<AmbienceType | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const enabled = useRef(true);

  const getMaster = useCallback((): GainNode => {
    if (masterGain.current) return masterGain.current;
    const ctx = getCtx();
    const g = ctx.createGain();
    g.gain.value = 0.35;
    g.connect(ctx.destination);
    masterGain.current = g;
    return g;
  }, []);

  const stopAmbience = useCallback((fadeTime = FADE) => {
    if (!currentAmbience.current) return;
    const { gain, sources } = currentAmbience.current;
    const ctx = getCtx();
    gain.gain.setTargetAtTime(0, ctx.currentTime, fadeTime / 3);
    const ref = currentAmbience.current;
    currentAmbience.current = null;
    currentType.current = null;
    setTimeout(() => {
      sources.forEach(s => { try { (s as any).stop?.(); } catch {} });
      try { gain.disconnect(); } catch {}
    }, fadeTime * 1000 + 500);
  }, []);

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

    const sources: AudioNode[] = [];

    if (type === 'wind') {
      // Filtered white noise
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuf(ctx);
      noise.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 800;
      lp.Q.value = 0.7;
      // LFO modulating filter freq for wind gusts
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(lp.frequency);
      lfo.start();
      noise.connect(lp);
      lp.connect(g);
      noise.start();
      sources.push(noise, lfo as any);
    }

    if (type === 'tense') {
      // Low drone
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = 55;
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.25;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 200;
      osc1.connect(lp);
      lp.connect(droneGain);
      droneGain.connect(g);
      osc1.start();
      // Dissonant minor second
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 58.27; // ~minor second above A1
      const dissGain = ctx.createGain();
      dissGain.gain.value = 0.08;
      osc2.connect(dissGain);
      dissGain.connect(g);
      osc2.start();
      // Subtle noise bed
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuf(ctx);
      noise.loop = true;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.06;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2000;
      noise.connect(hp);
      hp.connect(noiseGain);
      noiseGain.connect(g);
      noise.start();
      sources.push(osc1, osc2, noise);
    }

    if (type === 'dark') {
      // Deep rumble
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 35;
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.3;
      osc.connect(rumbleGain);
      rumbleGain.connect(g);
      osc.start();
      // Eerie harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 220;
      const eerieGain = ctx.createGain();
      eerieGain.gain.value = 0.04;
      // Slow vibrato
      const vib = ctx.createOscillator();
      vib.type = 'sine';
      vib.frequency.value = 3;
      const vibGain = ctx.createGain();
      vibGain.gain.value = 8;
      vib.connect(vibGain);
      vibGain.connect(osc2.frequency);
      vib.start();
      osc2.connect(eerieGain);
      eerieGain.connect(g);
      osc2.start();
      sources.push(osc, osc2, vib as any);
    }

    if (type === 'peaceful') {
      // Warm pad (stacked fifths)
      [261.63, 329.63, 392.0].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const padGain = ctx.createGain();
        padGain.gain.value = 0.08;
        osc.connect(padGain);
        padGain.connect(g);
        osc.start();
        sources.push(osc);
      });
    }

    currentAmbience.current = { gain: g, sources };
    currentType.current = type;
  }, [getMaster, stopAmbience]);

  /** One-shot SFX */
  const playSfx = useCallback((type: SfxType) => {
    if (!enabled.current) return;
    const ctx = getCtx();
    const master = getMaster();
    const now = ctx.currentTime;

    if (type === 'decision') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 440;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    if (type === 'positive') {
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const t = now + i * 0.08;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    }

    if (type === 'negative') {
      [392, 311, 261].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 600;
        const g = ctx.createGain();
        const t = now + i * 0.1;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(lp);
        lp.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    }
  }, [getMaster]);

  /** Derive ambience from chapter id + emotional tone */
  const setAmbienceForScene = useCallback((chapterId: string, tone: EmotionalTone) => {
    if (tone === 'heavy') {
      startAmbience('tense');
      return;
    }
    if (tone === 'hopeful') {
      startAmbience('peaceful');
      return;
    }
    if (chapterId.startsWith('fase3')) {
      startAmbience('dark');
    } else if (chapterId.startsWith('fase2')) {
      startAmbience('tense');
    } else {
      startAmbience('wind');
    }
  }, [startAmbience]);

  /** Derive SFX from choice effects */
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbience(0.1);
    };
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
