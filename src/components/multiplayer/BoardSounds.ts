// Board sound effects using Web Audio API — uses pre-warmed shared context
import { getPrewarmedAudioContext } from '@/hooks/useAudioPrewarm';

function getCtx(): AudioContext | null {
  return getPrewarmedAudioContext();
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

// Shield acquired — bright ascending chime
export function playShieldAcquired() {
  playTone(660, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(880, 0.12, 'sine', 0.12), 80);
  setTimeout(() => playTone(1100, 0.15, 'sine', 0.15), 160);
}

// Swap event — swirling descend-ascend
export function playSwapEvent() {
  playTone(800, 0.1, 'triangle', 0.1);
  setTimeout(() => playTone(400, 0.1, 'triangle', 0.1), 100);
  setTimeout(() => playTone(600, 0.1, 'triangle', 0.1), 200);
  setTimeout(() => playTone(900, 0.15, 'triangle', 0.12), 300);
}

// Current/water — wavy tones
export function playCurrentEvent() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      playTone(300 + Math.sin(i * 1.5) * 150, 0.15, 'sine', 0.08);
    }, i * 120);
  }
}

// Surprise — mystery chime
export function playSurpriseEvent() {
  playTone(440, 0.08, 'sine', 0.1);
  setTimeout(() => playTone(554, 0.08, 'sine', 0.1), 100);
  setTimeout(() => playTone(659, 0.08, 'sine', 0.1), 200);
  setTimeout(() => playTone(880, 0.2, 'sine', 0.12), 350);
}

// Checkpoint saved — warm confirmation
export function playCheckpointEvent() {
  playTone(523, 0.12, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.1), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 200);
}

// Back to start — dramatic doom
export function playBackToStartEvent() {
  playTone(200, 0.4, 'sawtooth', 0.1);
  setTimeout(() => playTone(150, 0.4, 'sawtooth', 0.08), 200);
  setTimeout(() => playTone(100, 0.6, 'sawtooth', 0.06), 400);
  setTimeout(() => playTone(60, 0.8, 'sawtooth', 0.05), 650);
}

export function playStun() {
  playTone(150, 0.5, 'sawtooth', 0.06);
  setTimeout(() => playTone(120, 0.5, 'sawtooth', 0.05), 200);
}

export function playTurnStart() {
  playTone(880, 0.08, 'sine', 0.1);
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.12), 60);
}

// ─── Per-phase ambient drones ───
// Each phase has a distinct ambient tone/chord that plays briefly when entering

const PHASE_AMBIENTS: { freq: number; freq2: number; type: OscillatorType; vol: number }[] = [
  { freq: 220, freq2: 330, type: 'sine', vol: 0.04 },      // Phase 0 — warm, hopeful
  { freq: 196, freq2: 294, type: 'triangle', vol: 0.04 },   // Phase 1 — mysterious swamp
  { freq: 146, freq2: 185, type: 'sawtooth', vol: 0.03 },   // Phase 2 — dark valley
  { freq: 262, freq2: 392, type: 'sine', vol: 0.04 },       // Phase 3 — bustling fair
  { freq: 165, freq2: 208, type: 'sawtooth', vol: 0.03 },   // Phase 4 — ominous castle
  { freq: 330, freq2: 440, type: 'sine', vol: 0.05 },       // Phase 5 — celestial glory
];

let currentAmbientOsc: OscillatorNode[] = [];

export function playPhaseAmbient(phaseIdx: number) {
  stopPhaseAmbient();
  const c = getCtx();
  if (!c) return;
  const cfg = PHASE_AMBIENTS[phaseIdx] || PHASE_AMBIENTS[0];

  const createDrone = (freq: number) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = cfg.type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(cfg.vol, c.currentTime + 1.5);
    gain.gain.linearRampToValueAtTime(cfg.vol * 0.6, c.currentTime + 6);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 8);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 8);
    return osc;
  };

  currentAmbientOsc = [createDrone(cfg.freq), createDrone(cfg.freq2)];
}

export function stopPhaseAmbient() {
  currentAmbientOsc.forEach(osc => {
    try { osc.stop(); } catch {}
  });
  currentAmbientOsc = [];
}

// Phase transition dramatic sound
export function playPhaseTransitionSound(phaseIdx: number) {
  const c = getCtx();
  if (!c) return;
  // Deep drum hit
  playTone(80, 0.5, 'sine', 0.15);
  setTimeout(() => playTone(60, 0.8, 'sine', 0.12), 200);
  // Ethereal chime
  setTimeout(() => {
    const freq = 400 + phaseIdx * 80;
    playTone(freq, 0.4, 'sine', 0.08);
    setTimeout(() => playTone(freq * 1.5, 0.5, 'sine', 0.06), 150);
  }, 500);
}

// River of Death ambient
export function playRiverAmbient() {
  const c = getCtx();
  if (!c) return;
  // Low rumble
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 55;
  gain.gain.setValueAtTime(0.03, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.06, c.currentTime + 3);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 10);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 10);
}
