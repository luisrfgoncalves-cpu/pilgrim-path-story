// ═══════════════════════════════════════════════════════
// NARRADOR — Web Speech API
// Voz masculina dramática para o Mestre do Jogo
// ═══════════════════════════════════════════════════════

let narratorEnabled = true;
let selectedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

// Find the best Portuguese male voice
function loadVoice() {
  if (voicesLoaded) return;
  const voices = window.speechSynthesis?.getVoices() || [];
  if (voices.length === 0) return;
  voicesLoaded = true;

  // Priority: pt-BR male > pt-BR any > pt any > any male > default
  const ptBrMale = voices.find(v => v.lang.startsWith('pt') && v.name.toLowerCase().includes('male'));
  const ptBr = voices.find(v => v.lang.startsWith('pt-BR'));
  const pt = voices.find(v => v.lang.startsWith('pt'));
  const anyMale = voices.find(v => v.name.toLowerCase().includes('male'));

  selectedVoice = ptBrMale || ptBr || pt || anyMale || voices[0] || null;
}

// Pre-warm voices (call on user interaction)
export function prewarmNarrator() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  loadVoice();
  // Some browsers need voiceschanged event
  window.speechSynthesis.onvoiceschanged = () => loadVoice();
}

export function setNarratorEnabled(enabled: boolean) {
  narratorEnabled = enabled;
  if (!enabled) {
    window.speechSynthesis?.cancel();
  }
}

export function isNarratorEnabled() {
  return narratorEnabled;
}

export type NarrationStyle = 'dramatic' | 'calm' | 'urgent' | 'whisper' | 'triumphant';

interface NarrationOptions {
  style?: NarrationStyle;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}

const STYLE_PRESETS: Record<NarrationStyle, { rate: number; pitch: number; volume: number }> = {
  dramatic:   { rate: 0.78, pitch: 0.6,  volume: 1.0 },
  calm:       { rate: 0.82, pitch: 0.9,  volume: 1.0 },
  urgent:     { rate: 1.05, pitch: 0.7,  volume: 1.0 },
  whisper:    { rate: 0.7,  pitch: 0.5,  volume: 0.85 },
  triumphant: { rate: 0.75, pitch: 0.8,  volume: 1.0 },
};

export function narrate(text: string, options: NarrationOptions = {}) {
  if (!narratorEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing narration
  window.speechSynthesis.cancel();

  loadVoice();

  const style = STYLE_PRESETS[options.style || 'dramatic'];
  const utterance = new SpeechSynthesisUtterance(text);

  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.lang = 'pt-BR';
  utterance.rate = options.rate ?? style.rate;
  utterance.pitch = options.pitch ?? style.pitch;
  utterance.volume = options.volume ?? style.volume;

  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopNarration() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis?.cancel();
}

// Map tile/event types to narration styles
export function getNarrationStyle(context: string): NarrationStyle {
  if (context.includes('boss') || context.includes('giant') || context.includes('Gigante') || context.includes('Apolião')) return 'urgent';
  if (context.includes('refuge') || context.includes('blessing') || context.includes('Beulá') || context.includes('Palácio')) return 'calm';
  if (context.includes('trap') || context.includes('Sombra') || context.includes('☠️')) return 'whisper';
  if (context.includes('victory') || context.includes('Celestial') || context.includes('🏆')) return 'triumphant';
  return 'dramatic';
}
