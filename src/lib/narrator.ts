// ═══════════════════════════════════════════════════════
// NARRADOR — Web Speech API
// Voz dramática e envolvente para o Mestre do Jogo
// ═══════════════════════════════════════════════════════

let narratorEnabled = true;
let selectedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;
let isSpeaking = false;
let utteranceQueue: { text: string; style: NarrationStyle; onEnd?: () => void }[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Find the best Portuguese voice
function loadVoice() {
  if (voicesLoaded) return;
  const voices = window.speechSynthesis?.getVoices() || [];
  if (voices.length === 0) return;
  voicesLoaded = true;

  // Priority: Natural/Premium voices > Google > Microsoft > any pt-BR > pt > default
  // Filter pt-BR voices first
  const ptBrVoices = voices.filter(v => v.lang.startsWith('pt-BR'));
  const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
  
  // Prefer "natural", "premium", "enhanced", "neural" voices (more realistic)
  const naturalKeywords = ['natural', 'premium', 'enhanced', 'neural', 'wavenet', 'online'];
  const findNatural = (list: SpeechSynthesisVoice[]) =>
    list.find(v => naturalKeywords.some(k => v.name.toLowerCase().includes(k)));
  
  const ptBrGoogle = ptBrVoices.find(v => v.name.includes('Google'));
  const ptBrMicrosoft = ptBrVoices.find(v => v.name.includes('Microsoft'));
  const ptBrNatural = findNatural(ptBrVoices);
  const ptBrMale = ptBrVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('luciano'));
  const ptBr = ptBrVoices[0];
  const ptNatural = findNatural(ptVoices);
  const pt = ptVoices[0];

  selectedVoice = ptBrNatural || ptBrGoogle || ptBrMicrosoft || ptBrMale || ptBr || ptNatural || pt || voices[0] || null;
  
  if (selectedVoice) {
    console.log(`[Narrator] Voice selected: ${selectedVoice.name} (${selectedVoice.lang})`);
  }
}

export function prewarmNarrator() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  loadVoice();
  window.speechSynthesis.onvoiceschanged = () => loadVoice();
}

export function setNarratorEnabled(enabled: boolean) {
  narratorEnabled = enabled;
  if (!enabled) stopNarration();
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
  force?: boolean; // if true, cancels current speech
}

const STYLE_PRESETS: Record<NarrationStyle, { rate: number; pitch: number; volume: number }> = {
  dramatic:   { rate: 0.88, pitch: 0.80, volume: 1.0 },
  calm:       { rate: 0.85, pitch: 1.05, volume: 0.95 },
  urgent:     { rate: 1.02, pitch: 0.75, volume: 1.0 },
  whisper:    { rate: 0.82, pitch: 0.65, volume: 0.85 },
  triumphant: { rate: 0.85, pitch: 0.90, volume: 1.0 },
};

// Chrome has a bug where utterances >~15s get paused/killed.
// Split long text into sentence chunks and chain them.
function splitIntoChunks(text: string): string[] {
  // Split on sentence-ending punctuation, keeping chunks ≤ 180 chars
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if (current.length + trimmed.length > 180 && current.length > 0) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? ' ' : '') + trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

function speakChunk(text: string, style: NarrationStyle, onEnd?: () => void) {
  if (!window.speechSynthesis) return;
  loadVoice();

  const preset = STYLE_PRESETS[style];
  const utterance = new SpeechSynthesisUtterance(text);

  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.lang = 'pt-BR';
  utterance.rate = preset.rate;
  utterance.pitch = preset.pitch;
  utterance.volume = preset.volume;

  currentUtterance = utterance;
  isSpeaking = true;

  utterance.onend = () => {
    currentUtterance = null;
    isSpeaking = false;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    // 'interrupted' and 'canceled' are expected when we stop narration
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      console.warn('Speech error:', e.error);
    }
    currentUtterance = null;
    isSpeaking = false;
  };

  // Chrome workaround: resume if paused
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  window.speechSynthesis.speak(utterance);

  // Chrome anti-pause workaround: periodically resume
  const keepAlive = setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearInterval(keepAlive);
      return;
    }
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 10000);

  utterance.onend = () => {
    clearInterval(keepAlive);
    currentUtterance = null;
    isSpeaking = false;
    if (onEnd) onEnd();
  };
}

function speakChunksSequentially(chunks: string[], style: NarrationStyle, onAllDone?: () => void) {
  if (chunks.length === 0) {
    onAllDone?.();
    return;
  }

  const [first, ...rest] = chunks;
  speakChunk(first, style, () => {
    speakChunksSequentially(rest, style, onAllDone);
  });
}

export function narrate(text: string, options: NarrationOptions = {}) {
  if (!narratorEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

  const cleanText = text
    .replace(/[✅❌🏆😔⏰✨🎭📖⚔️🎵⚡🦁✏️⚖️🔑🔍🛡️💡🙏😨☠️⚠️🏠🔮]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText || cleanText.length < 3) return;

  // If force mode or nothing is currently speaking, cancel and start fresh
  if (options.force || !isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    currentUtterance = null;

    const style = options.style || 'dramatic';
    const chunks = splitIntoChunks(cleanText);
    speakChunksSequentially(chunks, style, options.onEnd);
  }
  // If already speaking, just ignore (don't cut off current narration)
}

export function stopNarration() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis?.cancel();
  isSpeaking = false;
  currentUtterance = null;
  utteranceQueue = [];
}

export function isCurrentlySpeaking(): boolean {
  return isSpeaking || (typeof window !== 'undefined' && window.speechSynthesis?.speaking === true);
}

// Map tile/event types to narration styles
export function getNarrationStyle(context: string): NarrationStyle {
  if (context.includes('boss') || context.includes('giant') || context.includes('Gigante') || context.includes('Apolião')) return 'urgent';
  if (context.includes('refuge') || context.includes('blessing') || context.includes('Beulá') || context.includes('Palácio')) return 'calm';
  if (context.includes('trap') || context.includes('Sombra') || context.includes('☠️')) return 'whisper';
  if (context.includes('victory') || context.includes('Celestial') || context.includes('🏆')) return 'triumphant';
  return 'dramatic';
}
