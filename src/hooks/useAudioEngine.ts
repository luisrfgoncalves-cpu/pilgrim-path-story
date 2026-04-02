import { useRef, useCallback, useEffect } from 'react';
import { EmotionalTone } from '@/lib/emotionalIntensity';

/**
 * Melodic Audio Engine — Game Soundtrack Style
 * 
 * Generates gentle, melodic ambient music that varies per scene.
 * Each ambience type has its own musical character:
 *  - Uses warm tones (sine waves only, no harsh oscillators)
 *  - Very low volume with long attack/release envelopes
 *  - Breathing pattern: music plays for ~6-10s then rests for 6-12s
 *  - Each scene gets a unique seed so the melody is always fresh
 *  - No sharp/agudo sounds — everything is filtered through a lowpass
 */

export type AmbienceType = 'pastoral' | 'solemn' | 'shadow' | 'glory' | 'contemplative' | 'silence';
export type SfxType = 'decision' | 'positive' | 'negative' | 'attack' | 'defend' | 'pray' | 'critical' | 'miss' | 'heal' | 'combo' | 'victory' | 'defeat' | 'diceRoll' | 'itemFound' | 'timerTick' | 'gameStart' | 'swipeDodge' | 'swipeAccept' | 'memoryCorrect' | 'memoryWrong' | 'stealthPass' | 'stealthFail';

const FADE = 2.5;
const MASTER_VOL = 0.08; // very quiet — background music level

let _ctx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
};

/* ── Musical Scales (semitone offsets from root) ── */
const PENTATONIC_MAJOR = [0, 2, 4, 7, 9];     // warm, open
const AEOLIAN = [0, 2, 3, 5, 7, 8, 10];       // natural minor, melancholic
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10];    // heroic, warm
const PHRYGIAN = [0, 1, 3, 5, 7, 8, 10];      // dark, exotic
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];        // bright, dreamy
const DORIAN = [0, 2, 3, 5, 7, 9, 10];        // gentle minor

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Play a single very gentle note through a lowpass filter */
function playMelodicNote(
  ctx: AudioContext, dest: AudioNode,
  freq: number, startTime: number, duration: number,
  vol = 0.04
) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  // Lowpass filter to remove any harshness
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = Math.min(freq * 3, 2000); // never above 2kHz
  filter.Q.value = 0.5;

  const g = ctx.createGain();
  const attack = Math.min(0.8, duration * 0.25);
  const release = Math.min(1.5, duration * 0.4);

  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(vol, startTime + attack);
  g.gain.setValueAtTime(vol, startTime + duration - release);
  g.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(filter);
  filter.connect(g);
  g.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.2);
}

/** Play a soft pad chord (multiple notes layered) */
function playPadChord(
  ctx: AudioContext, dest: AudioNode,
  notes: number[], startTime: number, duration: number,
  vol = 0.025
) {
  notes.forEach((midi, i) => {
    playMelodicNote(ctx, dest, midiToFreq(midi), startTime + i * 0.1, duration - i * 0.1, vol);
  });
}

interface AmbienceState {
  gain: GainNode;
  timeoutId: ReturnType<typeof setTimeout>;
  stopped: boolean;
  phraseCount: number;
}

// Track per-scene seed for variety
let sceneSeed = 0;

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

    // Global lowpass to ensure nothing is ever harsh
    const globalFilter = ctx.createBiquadFilter();
    globalFilter.type = 'lowpass';
    globalFilter.frequency.value = 2500;
    globalFilter.Q.value = 0.3;

    g.connect(globalFilter);
    globalFilter.connect(ctx.destination);
    masterGain.current = g;
    return g;
  }, []);

  const stopAmbience = useCallback((fadeTime = FADE) => {
    if (!currentAmbience.current) return;
    const state = currentAmbience.current;
    state.stopped = true;
    clearTimeout(state.timeoutId);
    const ctx = getCtx();
    state.gain.gain.setTargetAtTime(0, ctx.currentTime, fadeTime / 3);
    currentAmbience.current = null;
    currentType.current = null;
    setTimeout(() => {
      try { state.gain.disconnect(); } catch {}
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

    // Soft delay for depth
    const delay = ctx.createDelay(0.6);
    delay.delayTime.value = 0.35;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.12;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 900;
    g.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);

    const playPhrase = () => {
      if (state.stopped) return;
      const now = ctx.currentTime;
      state.phraseCount++;
      // Vary the musical phrase on each repeat
      const variation = state.phraseCount + sceneSeed;

      switch (type) {
        case 'pastoral': {
          // Warm, open, like walking through fields — pentatonic major
          const root = pick([55, 57, 60]); // G3, A3, C4
          const scale = PENTATONIC_MAJOR;
          const noteCount = 3 + (variation % 3);
          for (let i = 0; i < noteCount; i++) {
            const degree = scale[(i + variation) % scale.length];
            const octave = i === noteCount - 1 ? 12 : 0;
            const freq = midiToFreq(root + degree + octave);
            const start = now + i * rand(1.0, 1.8);
            const dur = rand(2.5, 4.5);
            playMelodicNote(ctx, g, freq, start, dur, rand(0.025, 0.04));
          }
          // Occasional soft pad underneath
          if (variation % 3 === 0) {
            playPadChord(ctx, g, [root, root + 7, root + 12], now + 0.5, 6, 0.015);
          }
          break;
        }
        case 'solemn': {
          // Thoughtful, minor — dorian mode, measured pace
          const root = pick([48, 50, 53]); // C3, D3, F3
          const scale = DORIAN;
          const noteCount = 2 + (variation % 2);
          for (let i = 0; i < noteCount; i++) {
            const degree = scale[(i + variation) % scale.length];
            const freq = midiToFreq(root + degree);
            const start = now + i * rand(1.5, 2.5);
            const dur = rand(3, 5);
            playMelodicNote(ctx, g, freq, start, dur, rand(0.02, 0.035));
          }
          // Low sustained note for gravity
          playMelodicNote(ctx, g, midiToFreq(root - 12), now, rand(5, 8), 0.02);
          break;
        }
        case 'shadow': {
          // Dark but melodic — phrygian, very slow, sparse
          const root = pick([43, 45, 48]); // G2, A2, C3
          const scale = PHRYGIAN;
          // Just 1-2 notes, long and haunting
          const degree = scale[(variation) % scale.length];
          playMelodicNote(ctx, g, midiToFreq(root + degree), now, rand(5, 8), rand(0.02, 0.03));
          // A distant high harmonic — very quiet
          if (variation % 2 === 0) {
            const hiDegree = scale[(variation + 3) % scale.length];
            playMelodicNote(ctx, g, midiToFreq(root + hiDegree + 24), now + rand(2, 4), rand(3, 5), 0.01);
          }
          break;
        }
        case 'glory': {
          // Triumphant, bright — lydian/mixolydian, ascending motifs
          const root = pick([60, 62, 64]); // C4, D4, E4
          const scale = variation % 2 === 0 ? LYDIAN : MIXOLYDIAN;
          const noteCount = 4 + (variation % 3);
          for (let i = 0; i < noteCount; i++) {
            const degree = scale[i % scale.length];
            const octave = i >= scale.length ? 12 : 0;
            const freq = midiToFreq(root + degree + octave);
            const start = now + i * rand(0.7, 1.2);
            const dur = rand(2, 3.5);
            playMelodicNote(ctx, g, freq, start, dur, rand(0.03, 0.045));
          }
          // Warm chord pad
          playPadChord(ctx, g, [root - 12, root - 5, root], now, 5, 0.02);
          break;
        }
        case 'contemplative': {
          // Aeolian (natural minor), gentle, reflective
          const root = pick([55, 57, 59]); // G3, A3, B3
          const scale = AEOLIAN;
          const noteCount = 3 + (variation % 2);
          // Arpeggio-like pattern
          for (let i = 0; i < noteCount; i++) {
            const idx = (i + variation) % scale.length;
            const freq = midiToFreq(root + scale[idx]);
            const start = now + i * rand(1.0, 1.6);
            const dur = rand(2.5, 4);
            playMelodicNote(ctx, g, freq, start, dur, rand(0.025, 0.038));
          }
          break;
        }
      }
    };

    // Breathing: phrase (6-10s) then silence (6-12s)
    const phraseDuration = type === 'shadow' ? 10000 : type === 'glory' ? 7000 : 8000;
    const silenceMin = 6000;
    const silenceMax = 12000;

    const scheduleNext = () => {
      if (state.stopped) return;
      playPhrase();
      const silence = rand(silenceMin, silenceMax);
      state.timeoutId = setTimeout(scheduleNext, phraseDuration + silence);
    };

    const state: AmbienceState = {
      gain: g,
      timeoutId: setTimeout(scheduleNext, 800),
      stopped: false,
      phraseCount: 0,
    };

    currentAmbience.current = state;
    currentType.current = type;
  }, [getMaster, stopAmbience]);

  /** One-shot SFX — distinct sounds for every action */
  const playSfx = useCallback((type: SfxType) => {
    if (!enabled.current) return;
    const ctx = getCtx();
    const master = getMaster();
    const now = ctx.currentTime;

    switch (type) {
      case 'decision': {
        // Soft bell: two notes
        playMelodicNote(ctx, master, midiToFreq(67), now, 0.8, 0.06);
        playMelodicNote(ctx, master, midiToFreq(72), now + 0.08, 0.7, 0.04);
        break;
      }
      case 'positive': {
        // Ascending warm chord — harp strum
        [60, 64, 67, 72].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + i * 0.1, 1.0 - i * 0.1, 0.05);
        });
        break;
      }
      case 'negative': {
        // Gentle descending minor
        [65, 63, 60, 58].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + i * 0.15, 0.8, 0.035);
        });
        break;
      }
      case 'attack': {
        // Fast aggressive downstroke — power chord hit
        playMelodicNote(ctx, master, midiToFreq(40), now, 0.3, 0.09);
        playMelodicNote(ctx, master, midiToFreq(47), now + 0.02, 0.25, 0.07);
        playMelodicNote(ctx, master, midiToFreq(52), now + 0.04, 0.2, 0.05);
        // Impact thump
        playMelodicNote(ctx, master, midiToFreq(28), now, 0.15, 0.1);
        break;
      }
      case 'defend': {
        // Metallic shield clang — bright, resonant
        playMelodicNote(ctx, master, midiToFreq(76), now, 0.6, 0.07);
        playMelodicNote(ctx, master, midiToFreq(79), now + 0.03, 0.5, 0.05);
        playMelodicNote(ctx, master, midiToFreq(83), now + 0.06, 0.4, 0.03);
        break;
      }
      case 'pray': {
        // Ethereal ascending — choir-like
        [60, 64, 67, 72, 76].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + i * 0.2, 2.0, 0.035);
        });
        // Low hum underneath
        playMelodicNote(ctx, master, midiToFreq(48), now, 2.5, 0.025);
        break;
      }
      case 'critical': {
        // Explosive impact + ascending fanfare
        playMelodicNote(ctx, master, midiToFreq(36), now, 0.2, 0.12);
        playMelodicNote(ctx, master, midiToFreq(48), now + 0.05, 0.3, 0.09);
        [60, 64, 67, 72, 76, 79].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + 0.1 + i * 0.08, 0.6, 0.06);
        });
        break;
      }
      case 'miss': {
        // Sad whoosh — descending
        playMelodicNote(ctx, master, midiToFreq(65), now, 0.4, 0.04);
        playMelodicNote(ctx, master, midiToFreq(60), now + 0.1, 0.4, 0.03);
        playMelodicNote(ctx, master, midiToFreq(55), now + 0.2, 0.5, 0.02);
        break;
      }
      case 'heal': {
        // Warm rising glow — major chord arpeggiated slowly
        [48, 55, 60, 64, 67].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + i * 0.25, 1.5, 0.04);
        });
        break;
      }
      case 'combo': {
        // Fast ascending power scale
        [60, 62, 64, 67, 69, 72, 76].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + i * 0.06, 0.4, 0.05);
        });
        break;
      }
      case 'victory': {
        // Triumphant fanfare — major chord spread
        playPadChord(ctx, master, [48, 55, 60, 64, 67], now, 3, 0.04);
        [72, 76, 79, 84].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + 0.5 + i * 0.15, 1.5, 0.05);
        });
        break;
      }
      case 'defeat': {
        // Solemn minor — slow descending
        playPadChord(ctx, master, [48, 51, 55], now, 3, 0.03);
        [63, 60, 58, 55].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + 0.3 + i * 0.3, 1.2, 0.03);
        });
        break;
      }
      case 'diceRoll': {
        // Rattling percussive clicks
        for (let i = 0; i < 8; i++) {
          const freq = midiToFreq(80 + Math.floor(Math.random() * 15));
          playMelodicNote(ctx, master, freq, now + i * 0.07, 0.05, 0.06);
        }
        break;
      }
      case 'itemFound': {
        // Sparkle discovery — bright ascending
        [72, 76, 79, 84, 88].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + i * 0.12, 0.5, 0.05);
        });
        break;
      }
      case 'timerTick': {
        // Single sharp tick
        playMelodicNote(ctx, master, midiToFreq(80), now, 0.05, 0.07);
        break;
      }
      case 'gameStart': {
        // Dramatic intro — low rumble + ascending
        playMelodicNote(ctx, master, midiToFreq(36), now, 1.5, 0.06);
        [48, 55, 60, 64, 67, 72].forEach((n, i) => {
          playMelodicNote(ctx, master, midiToFreq(n), now + 0.3 + i * 0.15, 0.8, 0.04);
        });
        break;
      }
      case 'swipeDodge': {
        // Quick whoosh up
        playMelodicNote(ctx, master, midiToFreq(55), now, 0.15, 0.06);
        playMelodicNote(ctx, master, midiToFreq(67), now + 0.05, 0.15, 0.05);
        playMelodicNote(ctx, master, midiToFreq(79), now + 0.1, 0.2, 0.04);
        break;
      }
      case 'swipeAccept': {
        // Gentle chime
        playMelodicNote(ctx, master, midiToFreq(72), now, 0.5, 0.05);
        playMelodicNote(ctx, master, midiToFreq(76), now + 0.1, 0.4, 0.04);
        break;
      }
      case 'memoryCorrect': {
        // Quick bright ding
        playMelodicNote(ctx, master, midiToFreq(72), now, 0.3, 0.06);
        playMelodicNote(ctx, master, midiToFreq(79), now + 0.05, 0.3, 0.05);
        break;
      }
      case 'memoryWrong': {
        // Flat buzz
        playMelodicNote(ctx, master, midiToFreq(50), now, 0.4, 0.05);
        playMelodicNote(ctx, master, midiToFreq(49), now + 0.05, 0.4, 0.04);
        break;
      }
      case 'stealthPass': {
        // Very quiet whisper — soft high notes
        playMelodicNote(ctx, master, midiToFreq(84), now, 0.3, 0.02);
        playMelodicNote(ctx, master, midiToFreq(88), now + 0.1, 0.2, 0.015);
        break;
      }
      case 'stealthFail': {
        // Alarm-like — fast alternating
        playMelodicNote(ctx, master, midiToFreq(72), now, 0.15, 0.06);
        playMelodicNote(ctx, master, midiToFreq(76), now + 0.12, 0.15, 0.06);
        playMelodicNote(ctx, master, midiToFreq(72), now + 0.24, 0.15, 0.05);
        break;
      }
    }
  }, [getMaster]);

  /** Map scene/tone to the right ambience — each scene sounds unique */
  const setAmbienceForScene = useCallback((chapterId: string, tone: EmotionalTone) => {
    // Change seed per scene so phrases are different
    sceneSeed = chapterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    // ── Scene-specific ambience for maximum immersion ──
    const sceneAmbience: Record<string, AmbienceType> = {
      // Cidade da Destruição — oppressive
      'cena1': 'solemn', 'cena1b': 'solemn', 'cena2': 'solemn',
      'cena3': 'solemn', 'cena4': 'solemn',
      // Evangelista — hope
      'cena5': 'contemplative',
      // Dorminhocoes — eerie
      'cena5b': 'shadow', 'cena6': 'shadow',
      // Porta Estreita — glory
      'cena7': 'glory', 'cena7b': 'solemn',
      // Prudência Mundana — temptation
      'cena8': 'contemplative',
      // Sinai — dark
      'cena10': 'shadow',
      // Pântano — dread
      'cena11': 'shadow', 'cena11b': 'shadow',
      'cena12': 'shadow', 'cena13': 'shadow',
      // Auxílio
      'cena14': 'contemplative', 'cena14b': 'pastoral',
      // Cruz — glory!
      'cena15': 'glory', 'cena15b': 'glory',
      // Casa do Intérprete
      'fase2-cena1': 'contemplative', 'fase2-cena8': 'shadow',
      'fase2-cena9': 'glory', 'fase2-cena10': 'glory',
      // Colina + Leões
      'fase2-cena11': 'solemn', 'fase2-cena14': 'solemn',
      // Vale da Humilhação + Apolião
      'fase3-cena1': 'shadow', 'fase3-cena2': 'shadow',
      'fase3-cena3': 'shadow', 'fase3-cena4': 'contemplative',
      'fase3-cena5': 'shadow', 'fase3-cena6': 'shadow',
      'fase3-cena8': 'pastoral',
      // Feira da Vaidade
      'fase4-cena1': 'solemn', 'fase4-cena4': 'shadow',
      'fase4-cena6': 'shadow', 'fase4-cena7': 'solemn',
      'fase4-cena8': 'contemplative',
      // Castelo da Dúvida
      'fase5-cena3': 'shadow', 'fase5-cena4': 'shadow',
      'fase5-cena5': 'shadow',
      'fase5-cena6': 'glory', 'fase5-cena7': 'glory',
      'fase5-cena9': 'pastoral', 'fase5-cena14': 'pastoral',
      // Rio + Celestial
      'fase6-cena1': 'solemn', 'fase6-cena2': 'shadow',
      'fase6-cena3': 'contemplative',
      'fase6-cena5': 'glory', 'fase6-cena7': 'glory',
      'fase6-cena8': 'glory', 'fase6-cena9': 'glory',
    };

    // Check scene-specific first
    if (sceneAmbience[chapterId]) {
      startAmbience(sceneAmbience[chapterId]);
      return;
    }

    // Fallback: Map by phase + tone
    if (chapterId.startsWith('fase6')) { startAmbience('glory'); return; }
    if (chapterId.startsWith('fase5')) {
      startAmbience(tone === 'hopeful' ? 'contemplative' : 'solemn');
      return;
    }
    if (chapterId.startsWith('fase4')) { startAmbience('solemn'); return; }
    if (chapterId.startsWith('fase3')) { startAmbience('shadow'); return; }
    if (chapterId.startsWith('fase2')) {
      startAmbience(tone === 'heavy' ? 'contemplative' : 'pastoral');
      return;
    }

    // Fase 1 and others
    if (tone === 'heavy') startAmbience('solemn');
    else if (tone === 'hopeful') startAmbience('pastoral');
    else startAmbience('contemplative');
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
