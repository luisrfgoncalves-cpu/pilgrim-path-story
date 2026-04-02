// ═══════════════════════════════════════════════════════
// TRILHA SONORA AMBIENTE POR FASE DO TABULEIRO
// Usa Web Audio API com osciladores e filtros
// ═══════════════════════════════════════════════════════

let _ctx: AudioContext | null = null;
let _currentPhase = -1;
let _ambientGain: GainNode | null = null;
let _oscillators: OscillatorNode[] = [];
let _active = false;

function getCtx(): AudioContext | null {
  const AC = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;
  if (!AC) return null;
  if (!_ctx || _ctx.state === 'closed') _ctx = new AC();
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

// Phase musical themes (pentatonic scales for each phase mood)
const PHASE_THEMES: Record<number, { notes: number[]; tempo: number; mood: 'dark' | 'light' | 'tense' | 'epic' | 'serene' | 'triumphant' }> = {
  0: { notes: [220, 261, 293, 349, 392], tempo: 4000, mood: 'light' },    // Início — esperança
  1: { notes: [196, 233, 261, 293, 349], tempo: 3500, mood: 'serene' },   // Casa do Intérprete — aprendizado
  2: { notes: [174, 196, 233, 261, 293], tempo: 2800, mood: 'tense' },    // Vale da Humilhação — tensão
  3: { notes: [146, 174, 196, 220, 261], tempo: 3000, mood: 'dark' },     // Feira da Vaidade — escuridão
  4: { notes: [164, 196, 220, 261, 293], tempo: 2500, mood: 'epic' },     // Castelo da Dúvida — épico
  5: { notes: [293, 349, 392, 440, 523], tempo: 3200, mood: 'triumphant' }, // Cidade Celestial — triunfo
};

const MOOD_PARAMS: Record<string, { type: OscillatorType; filterFreq: number; vol: number; detune: number }> = {
  dark:       { type: 'sawtooth', filterFreq: 400,  vol: 0.04, detune: -5 },
  light:      { type: 'sine',     filterFreq: 2000, vol: 0.05, detune: 0 },
  tense:      { type: 'triangle', filterFreq: 600,  vol: 0.04, detune: -10 },
  epic:       { type: 'square',   filterFreq: 800,  vol: 0.035, detune: 5 },
  serene:     { type: 'sine',     filterFreq: 3000, vol: 0.05, detune: 0 },
  triumphant: { type: 'sine',     filterFreq: 2500, vol: 0.055, detune: 3 },
};

function stopOscillators() {
  _oscillators.forEach(o => {
    try { o.stop(); o.disconnect(); } catch {}
  });
  _oscillators = [];
}

function playPhaseAmbientMusic(phaseIdx: number) {
  const ctx = getCtx();
  if (!ctx || phaseIdx === _currentPhase) return;
  _currentPhase = phaseIdx;
  _active = true;

  stopOscillators();

  const theme = PHASE_THEMES[phaseIdx] || PHASE_THEMES[0];
  const mood = MOOD_PARAMS[theme.mood];

  // Master gain
  if (_ambientGain) { try { _ambientGain.disconnect(); } catch {} }
  _ambientGain = ctx.createGain();
  _ambientGain.gain.setValueAtTime(0, ctx.currentTime);
  _ambientGain.gain.linearRampToValueAtTime(mood.vol, ctx.currentTime + 2); // fade in

  // Low-pass filter for warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(mood.filterFreq, ctx.currentTime);
  filter.Q.setValueAtTime(1, ctx.currentTime);

  _ambientGain.connect(filter);
  filter.connect(ctx.destination);

  // Create drone oscillators (2 detuned for richness)
  const baseNote = theme.notes[0];

  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    osc.type = mood.type;
    osc.frequency.setValueAtTime(baseNote, ctx.currentTime);
    osc.detune.setValueAtTime(mood.detune + (i * 7 - 3.5), ctx.currentTime);
    osc.connect(_ambientGain);
    osc.start(ctx.currentTime);
    _oscillators.push(osc);
  }

  // Melodic arpeggiator — cycles through scale notes
  let noteIdx = 0;
  const arpeggiate = () => {
    if (!_active || _currentPhase !== phaseIdx) return;

    const note = theme.notes[noteIdx % theme.notes.length];
    noteIdx++;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note * 2, ctx.currentTime); // octave up
    g.gain.setValueAtTime(mood.vol * 0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (theme.tempo / 1000) * 0.8);

    osc.connect(g);
    g.connect(filter);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + (theme.tempo / 1000));
    osc.onended = () => { osc.disconnect(); g.disconnect(); };

    setTimeout(arpeggiate, theme.tempo);
  };

  setTimeout(arpeggiate, 1000);
}

export function startAmbientMusic(phaseIdx: number) {
  playPhaseAmbientMusic(Math.min(phaseIdx, 5));
}

export function stopAmbientMusic() {
  _active = false;
  _currentPhase = -1;
  const ctx = getCtx();
  if (ctx && _ambientGain) {
    _ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(stopOscillators, 1200);
  } else {
    stopOscillators();
  }
}

export function updateAmbientPhase(phaseIdx: number) {
  if (phaseIdx !== _currentPhase && _active) {
    // Fade out old, start new
    const ctx = getCtx();
    if (ctx && _ambientGain) {
      _ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    }
    setTimeout(() => playPhaseAmbientMusic(phaseIdx), 600);
  }
}
