/**
 * Lightweight SFX player for mini-games
 * Uses pre-warmed shared AudioContext for zero-delay playback
 */
import { getPrewarmedAudioContext } from '@/hooks/useAudioPrewarm';

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const getCtx = (): AudioContext => {
  const ctx = getPrewarmedAudioContext();
  if (!ctx) throw new Error('No audio context');
  return ctx;
};

function note(ctx: AudioContext, dest: AudioNode, freq: number, start: number, dur: number, vol = 0.05) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = Math.min(freq * 3, 2500);
  filter.Q.value = 0.5;
  const g = ctx.createGain();
  const atk = Math.min(0.3, dur * 0.2);
  const rel = Math.min(0.5, dur * 0.3);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + atk);
  g.gain.setValueAtTime(vol, start + dur - rel);
  g.gain.linearRampToValueAtTime(0, start + dur);
  osc.connect(filter);
  filter.connect(g);
  g.connect(dest);
  osc.start(start);
  osc.stop(start + dur + 0.1);
}

export type GameSfx =
  | 'attack' | 'defend' | 'pray' | 'critical' | 'miss' | 'heal' | 'combo'
  | 'victory' | 'defeat' | 'diceRoll' | 'itemFound' | 'timerTick'
  | 'gameStart' | 'dodge' | 'accept' | 'correct' | 'wrong'
  | 'stealthPass' | 'stealthFail' | 'hit' | 'block'
  | 'charRevealHero' | 'charRevealVillain' | 'charRevealAlly' | 'suspense';

export function playGameSfx(type: GameSfx) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    switch (type) {
      case 'attack':
        note(ctx, ctx.destination, midiToFreq(40), now, 0.25, 0.08);
        note(ctx, ctx.destination, midiToFreq(47), now + 0.02, 0.2, 0.06);
        note(ctx, ctx.destination, midiToFreq(52), now + 0.04, 0.15, 0.05);
        note(ctx, ctx.destination, midiToFreq(28), now, 0.12, 0.09);
        break;
      case 'defend':
        note(ctx, ctx.destination, midiToFreq(76), now, 0.5, 0.06);
        note(ctx, ctx.destination, midiToFreq(79), now + 0.03, 0.4, 0.05);
        note(ctx, ctx.destination, midiToFreq(83), now + 0.06, 0.3, 0.03);
        break;
      case 'pray':
        [60, 64, 67, 72, 76].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.18, 1.8, 0.03);
        });
        note(ctx, ctx.destination, midiToFreq(48), now, 2.2, 0.02);
        break;
      case 'critical':
        note(ctx, ctx.destination, midiToFreq(36), now, 0.2, 0.1);
        [60, 64, 67, 72, 76, 79].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + 0.08 + i * 0.07, 0.5, 0.06);
        });
        break;
      case 'miss':
        [65, 60, 55].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.1, 0.35, 0.03);
        });
        break;
      case 'heal':
        [48, 55, 60, 64, 67].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.2, 1.2, 0.035);
        });
        break;
      case 'combo':
        [60, 62, 64, 67, 69, 72, 76].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.05, 0.3, 0.045);
        });
        break;
      case 'victory':
        [48, 55, 60, 64, 67].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.08, 2, 0.04);
        });
        [72, 76, 79, 84].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + 0.5 + i * 0.12, 1.5, 0.05);
        });
        break;
      case 'defeat':
        [63, 60, 58, 55, 51].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.25, 1.2, 0.03);
        });
        break;
      case 'diceRoll':
        for (let i = 0; i < 10; i++) {
          note(ctx, ctx.destination, midiToFreq(78 + Math.floor(Math.random() * 12)), now + i * 0.06, 0.04, 0.05);
        }
        break;
      case 'itemFound':
        [72, 76, 79, 84, 88].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + i * 0.1, 0.4, 0.045);
        });
        break;
      case 'timerTick':
        note(ctx, ctx.destination, midiToFreq(80), now, 0.04, 0.06);
        break;
      case 'gameStart':
        note(ctx, ctx.destination, midiToFreq(36), now, 1, 0.05);
        [48, 55, 60, 64, 67, 72].forEach((n, i) => {
          note(ctx, ctx.destination, midiToFreq(n), now + 0.2 + i * 0.12, 0.7, 0.04);
        });
        break;
      case 'dodge':
        note(ctx, ctx.destination, midiToFreq(55), now, 0.12, 0.05);
        note(ctx, ctx.destination, midiToFreq(67), now + 0.04, 0.12, 0.04);
        note(ctx, ctx.destination, midiToFreq(79), now + 0.08, 0.15, 0.03);
        break;
      case 'accept':
        note(ctx, ctx.destination, midiToFreq(72), now, 0.4, 0.05);
        note(ctx, ctx.destination, midiToFreq(76), now + 0.08, 0.35, 0.04);
        break;
      case 'correct':
        note(ctx, ctx.destination, midiToFreq(72), now, 0.25, 0.06);
        note(ctx, ctx.destination, midiToFreq(79), now + 0.05, 0.25, 0.05);
        break;
      case 'wrong':
        note(ctx, ctx.destination, midiToFreq(50), now, 0.35, 0.045);
        note(ctx, ctx.destination, midiToFreq(49), now + 0.05, 0.35, 0.04);
        break;
      case 'stealthPass':
        note(ctx, ctx.destination, midiToFreq(84), now, 0.25, 0.02);
        note(ctx, ctx.destination, midiToFreq(88), now + 0.08, 0.2, 0.015);
        break;
      case 'stealthFail':
        note(ctx, ctx.destination, midiToFreq(72), now, 0.12, 0.055);
        note(ctx, ctx.destination, midiToFreq(76), now + 0.1, 0.12, 0.055);
        note(ctx, ctx.destination, midiToFreq(72), now + 0.2, 0.12, 0.045);
        break;
      case 'hit':
        note(ctx, ctx.destination, midiToFreq(55), now, 0.15, 0.07);
        note(ctx, ctx.destination, midiToFreq(48), now + 0.03, 0.2, 0.06);
        break;
      case 'block':
        note(ctx, ctx.destination, midiToFreq(76), now, 0.3, 0.06);
        note(ctx, ctx.destination, midiToFreq(80), now + 0.02, 0.25, 0.04);
        break;
      // Character entrance sounds
      case 'charRevealHero':
        // Heroic fanfare — ascending bright notes
        note(ctx, ctx.destination, midiToFreq(60), now, 0.4, 0.06);
        note(ctx, ctx.destination, midiToFreq(64), now + 0.15, 0.35, 0.06);
        note(ctx, ctx.destination, midiToFreq(67), now + 0.3, 0.4, 0.07);
        note(ctx, ctx.destination, midiToFreq(72), now + 0.5, 0.6, 0.08);
        break;
      case 'charRevealVillain':
        // Dark menacing — low descending tritone
        note(ctx, ctx.destination, midiToFreq(48), now, 0.5, 0.07);
        note(ctx, ctx.destination, midiToFreq(42), now + 0.2, 0.6, 0.08);
        note(ctx, ctx.destination, midiToFreq(36), now + 0.45, 0.7, 0.07);
        note(ctx, ctx.destination, midiToFreq(30), now + 0.7, 0.8, 0.06);
        break;
      case 'charRevealAlly':
        // Warm welcoming — gentle ascending
        note(ctx, ctx.destination, midiToFreq(64), now, 0.5, 0.05);
        note(ctx, ctx.destination, midiToFreq(67), now + 0.2, 0.4, 0.05);
        note(ctx, ctx.destination, midiToFreq(71), now + 0.4, 0.5, 0.06);
        break;
      case 'suspense':
        // Tension build — tremolo low note
        note(ctx, ctx.destination, midiToFreq(36), now, 0.3, 0.06);
        note(ctx, ctx.destination, midiToFreq(37), now + 0.25, 0.3, 0.05);
        note(ctx, ctx.destination, midiToFreq(36), now + 0.5, 0.3, 0.06);
        note(ctx, ctx.destination, midiToFreq(37), now + 0.75, 0.4, 0.05);
        break;
    }
  } catch {
    // Audio not available
  }
}