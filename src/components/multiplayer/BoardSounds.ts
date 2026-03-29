// Board sound effects using Web Audio API
const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!ctx || ctx.state === 'closed') ctx = new AudioCtx();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

export function playDiceRoll() {
  const c = getCtx();
  if (!c) return;
  // Multiple short clicks simulating dice rolling
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      playTone(200 + Math.random() * 400, 0.05, 'square', 0.08);
    }, i * 60);
  }
}

export function playDiceLand() {
  playTone(300, 0.15, 'triangle', 0.2);
  setTimeout(() => playTone(500, 0.1, 'triangle', 0.15), 50);
}

export function playPositiveEvent() {
  playTone(523, 0.15, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.15), 200);
}

export function playNegativeEvent() {
  playTone(392, 0.2, 'sawtooth', 0.08);
  setTimeout(() => playTone(311, 0.2, 'sawtooth', 0.08), 150);
  setTimeout(() => playTone(261, 0.4, 'sawtooth', 0.06), 300);
}

export function playChallengeEvent() {
  playTone(440, 0.1, 'square', 0.1);
  setTimeout(() => playTone(440, 0.1, 'square', 0.1), 200);
  setTimeout(() => playTone(554, 0.1, 'square', 0.1), 400);
  setTimeout(() => playTone(440, 0.1, 'square', 0.1), 600);
}

export function playChallengeWin() {
  playTone(523, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 80);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.15), 160);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.2), 240);
}

export function playChallengeFail() {
  playTone(392, 0.15, 'sawtooth', 0.1);
  setTimeout(() => playTone(349, 0.15, 'sawtooth', 0.1), 120);
  setTimeout(() => playTone(261, 0.4, 'sawtooth', 0.08), 240);
}

export function playVictory() {
  const notes = [523, 659, 784, 1047, 784, 1047, 1318];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.25, 'sine', 0.12), i * 120);
  });
}

export function playMove() {
  playTone(600, 0.06, 'triangle', 0.1);
}

export function playStun() {
  playTone(150, 0.5, 'sawtooth', 0.06);
  setTimeout(() => playTone(120, 0.5, 'sawtooth', 0.05), 200);
}

export function playTurnStart() {
  playTone(880, 0.08, 'sine', 0.1);
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.12), 60);
}
