import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { PostureState } from '@/components/PilgrimAvatar';

/**
 * Central emotional state resolver.
 * Determines the character's emotional posture based on:
 * - Current attributes (fé, coragem, perseverança, discernimento)
 * - Chapter context (id, flags)
 * - Decision history (recent trend)
 */

export interface EmotionalProfile {
  /** One of the 9 posture states */
  posture: PostureState;
  /** 0–1 intensity of the current emotion */
  intensity: number;
  /** Atmosphere line shown in narrative */
  atmosphereLine?: string;
  /** CSS class for scene wrapper */
  sceneClass: string;
  /** Story flag override used (if any) */
  flagOverride?: string;
}

/** Flags that force a specific posture regardless of attributes */
const FLAG_OVERRIDES: Record<string, PostureState> = {
  livre: 'livre',
  vitoria: 'vitoria_final',
  conflito_interno: 'em_conflito',
  recuperacao_espiritual: 'recuperacao',
};

/**
 * Scene-specific posture overrides — ensures the pilgrim avatar
 * matches the narrative context of each chapter, not just attributes.
 */
const SCENE_POSTURE_OVERRIDES: Record<string, PostureState> = {
  // FASE 1 — Cidade da Destruição
  'cena1': 'abatido',
  'cena1b': 'abatido',
  'cena2': 'em_conflito',
  'cena3': 'em_dificuldade',
  'cena4': 'abatido',
  'cena5': 'esperancoso',        // Evangelista appears
  'cena5b': 'confuso',
  'cena6': 'abatido',
  'cena7': 'esperancoso',        // Porta Estreita
  'cena7b': 'em_dificuldade',    // Flechas
  'cena8': 'confuso',            // Prudência Mundana
  'cena9': 'determinado',
  'cena9b': 'determinado',
  'cena10': 'em_dificuldade',    // Monte Sinai
  'cena11': 'em_dificuldade',    // Pântano
  'cena11b': 'em_dificuldade',
  'cena12': 'abatido',           // Afundando
  'cena13': 'abatido',           // Quase morrendo
  'cena14': 'recuperacao',       // Auxílio
  'cena14b': 'recuperacao',
  'cena15': 'livre',             // Cruz!
  'cena15b': 'vitoria_final',    // Três Resplandecentes

  // FASE 2 — Casa do Intérprete
  'fase2-cena1': 'esperancoso',
  'fase2-cena2': 'confuso',
  'fase2-cena3': 'determinado',
  'fase2-cena4': 'confuso',
  'fase2-cena5': 'esperancoso',
  'fase2-cena6': 'determinado',
  'fase2-cena7': 'esperancoso',
  'fase2-cena8': 'em_conflito',   // Homem na Gaiola
  'fase2-cena9': 'determinado',
  'fase2-cena10': 'determinado',  // Armadura
  'fase2-cena11': 'em_dificuldade', // Colina
  'fase2-cena12': 'em_dificuldade',
  'fase2-cena13': 'recuperacao',
  'fase2-cena14': 'em_conflito',  // Leões

  // FASE 3 — Vale da Humilhação
  'fase3-cena1': 'em_dificuldade',
  'fase3-cena2': 'em_conflito',
  'fase3-cena3': 'em_conflito',   // Apolião
  'fase3-cena4': 'recuperacao',
  'fase3-cena5': 'abatido',       // Vale da Sombra
  'fase3-cena6': 'abatido',
  'fase3-cena7': 'recuperacao',
  'fase3-cena8': 'esperancoso',   // Fiel
  'fase3-cena9': 'determinado',
  'fase3-cena10': 'determinado',

  // FASE 4 — Feira da Vaidade
  'fase4-cena1': 'em_conflito',
  'fase4-cena2': 'em_dificuldade',
  'fase4-cena3': 'em_conflito',
  'fase4-cena4': 'em_dificuldade', // Julgamento
  'fase4-cena5': 'determinado',
  'fase4-cena6': 'em_dificuldade',
  'fase4-cena7': 'abatido',       // Morte de Fiel
  'fase4-cena8': 'recuperacao',   // Esperança
  'fase4-cena9': 'determinado',
  'fase4-cena10': 'em_conflito',
  'fase4-cena11': 'em_conflito',
  'fase4-cena11b': 'confuso',
  'fase4-cena12': 'determinado',

  // FASE 5 — Castelo da Dúvida
  'fase5-cena1': 'confuso',
  'fase5-cena2': 'em_dificuldade',
  'fase5-cena3': 'abatido',       // Gigante
  'fase5-cena4': 'abatido',
  'fase5-cena5': 'em_dificuldade',
  'fase5-cena6': 'esperancoso',   // Chave
  'fase5-cena7': 'livre',
  'fase5-cena8': 'determinado',
  'fase5-cena9': 'esperancoso',   // Montanhas
  'fase5-cena10': 'esperancoso',
  'fase5-cena11': 'confuso',
  'fase5-cena12': 'em_dificuldade',
  'fase5-cena13': 'confuso',
  'fase5-cena14': 'esperancoso',

  // FASE 6 — Rio e Cidade Celestial
  'fase6-cena1': 'em_conflito',
  'fase6-cena2': 'em_dificuldade',
  'fase6-cena3': 'esperancoso',
  'fase6-cena4': 'em_dificuldade',
  'fase6-cena5': 'esperancoso',
  'fase6-cena6': 'determinado',
  'fase6-cena7': 'esperancoso',
  'fase6-cena8': 'vitoria_final',
  'fase6-cena9': 'vitoria_final',
};

const atmosphereLines: Record<PostureState, string[]> = {
  abatido: [
    'Um peso invisível pressiona seus ombros.',
    'O ar parece mais denso, mais difícil de respirar.',
    'Sombras parecem se mover nos cantos da sua visão.',
    'Uma voz interior sussurra que talvez não valha a pena.',
    'O silêncio ao redor carrega uma tensão difícil de ignorar.',
  ],
  confuso: [
    'Seus pensamentos se embaralham, sem rumo certo.',
    'Cada caminho à frente parece igualmente incerto.',
    'Algo dentro de você hesita, sem saber o próximo passo.',
  ],
  determinado: [
    'Seus passos ganham firmeza no caminho.',
    'Uma convicção silenciosa pulsa em seu peito.',
    'Você sente que está na direção certa.',
  ],
  em_dificuldade: [
    'O peso do fardo parece maior do que nunca.',
    'Cada passo exige um esforço consciente.',
    'O caminho endurece, mas você ainda segue.',
  ],
  esperancoso: [
    'Uma sensação de esperança aquece seu peito.',
    'O caminho à frente parece mais claro do que nunca.',
    'Algo dentro de você diz: vai dar certo.',
    'A luz ao redor parece mais forte do que antes.',
    'Cada passo traz mais confiança.',
  ],
  livre: [
    'O fardo que carregava já não existe mais.',
    'Seus ombros estão leves como nunca estiveram.',
    'A liberdade corre pelas suas veias.',
  ],
  em_conflito: [
    'Duas forças puxam seu coração em direções opostas.',
    'A tensão dentro de você é quase visível.',
    'Algo precisa ser resolvido antes de seguir.',
  ],
  recuperacao: [
    'A dor começa a ceder. Há luz no horizonte.',
    'Lentamente, suas forças estão voltando.',
    'O pior parece ter ficado para trás.',
  ],
  vitoria_final: [
    'Uma paz profunda envolve todo o seu ser.',
    'A jornada valeu cada passo.',
    'Você chegou. E o que era peso tornou-se testemunho.',
  ],
};

/** Scene CSS class per posture */
const sceneClasses: Record<PostureState, string> = {
  abatido: 'emotional-abatido',
  confuso: 'emotional-confuso',
  determinado: 'emotional-determinado',
  em_dificuldade: 'emotional-dificuldade',
  esperancoso: 'emotional-esperancoso',
  livre: 'emotional-livre',
  em_conflito: 'emotional-conflito',
  recuperacao: 'emotional-recuperacao',
  vitoria_final: 'emotional-vitoria',
};

/**
 * Phase baseline: each story phase has a "gravity" that pulls the emotional state
 * toward certain postures. The attribute average still modulates the final result.
 */
type PhaseBaseline = {
  low: PostureState;   // when avg is below threshold
  high: PostureState;  // when avg is above threshold
  threshold: number;   // attribute avg divider
};

const phaseBaselines: Record<string, PhaseBaseline> = {
  // Fase 1 — Cidade da Destruição (cena1–cena15): início, peso do fardo
  fase1: { low: 'abatido', high: 'abatido', threshold: 99 },
  // Fase 2 — Casa do Intérprete: aprendizado
  fase2: { low: 'confuso', high: 'esperancoso', threshold: 5.5 },
  // Fase 3 — Vale da Humilhação / Apolião: conflito
  fase3: { low: 'em_conflito', high: 'determinado', threshold: 5 },
  // Fase 4 — Feira da Vaidade: pressão social
  fase4: { low: 'em_dificuldade', high: 'determinado', threshold: 5.5 },
  // Fase 5 — Castelo da Dúvida / Gigante Desespero: queda
  fase5: { low: 'abatido', high: 'em_dificuldade', threshold: 4.5 },
  // Fase 6 — Final / Cidade Celestial
  fase6: { low: 'esperancoso', high: 'vitoria_final', threshold: 7 },
};

function getPhaseFromChapter(chapterId: string): string {
  // fase2-cena1 → fase2, fase3-cena5 → fase3, cena1–cena15 → fase1
  if (chapterId.startsWith('fase')) {
    return chapterId.split('-')[0];
  }
  return 'fase1'; // cena1–cena15 are all phase 1
}

/**
 * Emotional progression ladder (ordered weakest → strongest).
 * Decisions shift the player up or down this ladder.
 */
const POSTURE_LADDER: PostureState[] = [
  'abatido',
  'em_dificuldade',
  'confuso',
  'em_conflito',
  'recuperacao',
  'determinado',
  'esperancoso',
  'vitoria_final',
];

function ladderIndex(p: PostureState): number {
  const i = POSTURE_LADDER.indexOf(p);
  return i >= 0 ? i : 3; // default to middle
}

/** Shift a posture up or down the ladder by N steps */
function shiftPosture(base: PostureState, steps: number): PostureState {
  const idx = ladderIndex(base);
  const next = Math.max(0, Math.min(POSTURE_LADDER.length - 1, idx + steps));
  return POSTURE_LADDER[next];
}

/**
 * Recent decision trend: checks if last N choices were mostly positive or negative.
 */
function getDecisionTrend(recentEffects: Array<Record<string, number>>): number {
  if (recentEffects.length === 0) return 0;
  const last = recentEffects.slice(-3);
  const totals = last.map(e => Object.values(e).reduce((s, v) => s + (v || 0), 0));
  return totals.reduce((s, v) => s + v, 0) / totals.length;
}

/**
 * Convert trend magnitude into ladder steps.
 * GROWTH BIAS: positive shifts are stronger than negative ones.
 * - strong positive → +2, mild positive → +1, neutral → +0
 * - mild negative → -1 (capped), strong negative → -1 (capped, NOT -2)
 * This ensures the player always trends upward over time.
 */
function trendToSteps(trend: number): number {
  if (trend >= 2) return 2;
  if (trend >= 0.5) return 1;
  if (trend <= -0.5) return -1; // capped at -1, never -2
  return 0;
}

/**
 * Journey progress bonus: the further into the story, the higher the
 * emotional "floor" — the player cannot stay stuck in the lowest states.
 * Returns minimum ladder index based on phase.
 */
function getPhaseFloor(phase: string): number {
  switch (phase) {
    case 'fase1': return 0; // abatido allowed
    case 'fase2': return 1; // minimum: em_dificuldade
    case 'fase3': return 2; // minimum: confuso
    case 'fase4': return 2; // minimum: confuso
    case 'fase5': return 1; // queda — floor drops, but not to 0
    case 'fase6': return 4; // minimum: recuperacao
    default: return 0;
  }
}

/**
 * Growth momentum: adds a passive +1 step when the player has been
 * in the bottom half of the ladder for too long (based on low avg
 * relative to phase progress). Prevents eternal negative loops.
 */
function getGrowthMomentum(phase: string, avg: number, trend: number): number {
  const phaseNum = parseInt(phase.replace('fase', '')) || 1;
  // Expected minimum avg grows with phase: fase1→2, fase2→3, fase3→3.5...
  const expectedMinAvg = 1.5 + phaseNum * 0.5;

  // If player is below expected AND trend is not already very negative,
  // give a compassionate upward nudge
  if (avg < expectedMinAvg && trend >= -1) {
    return 1; // gentle push upward
  }
  // If player is doing well relative to phase, no extra push needed
  return 0;
}

export function resolveEmotionalState(
  attrs: PlayerAttributes,
  chapterId: string,
  flags: string[],
  recentEffects?: Array<Record<string, number>>,
): EmotionalProfile {
  const { fe, coragem, perseveranca, discernimento } = attrs;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;
  const trend = recentEffects ? getDecisionTrend(recentEffects) : 0;
  const trendSteps = trendToSteps(trend);
  const seed = chapterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  // 1. Flag overrides (highest priority)
  for (const flag of flags) {
    if (FLAG_OVERRIDES[flag]) {
      const posture = FLAG_OVERRIDES[flag];
      const lines = atmosphereLines[posture];
      return {
        posture,
        intensity: 0.9,
        atmosphereLine: lines[seed % lines.length],
        sceneClass: sceneClasses[posture],
        flagOverride: flag,
      };
    }
  }

  // 2. Phase baseline — the story phase sets gravitational pull
  const phase = getPhaseFromChapter(chapterId);
  const baseline = phaseBaselines[phase];

  // 3. Determine base posture from phase + attributes
  let basePosture: PostureState;

  if (baseline) {
    basePosture = avg >= baseline.threshold ? baseline.high : baseline.low;
  } else {
    if (avg >= 7) basePosture = 'esperancoso';
    else if (avg >= 5.5) basePosture = 'determinado';
    else if (avg >= 4) basePosture = 'recuperacao';
    else if (avg >= 3) basePosture = 'confuso';
    else basePosture = 'abatido';
  }

  // 4. Apply decision trend + growth momentum
  const momentum = getGrowthMomentum(phase, avg, trend);
  const totalShift = trendSteps + momentum;
  let posture = shiftPosture(basePosture, totalShift);

  // 5. Enforce phase floor — prevent eternal negative loops
  const floor = getPhaseFloor(phase);
  const postureIdx = ladderIndex(posture);
  if (postureIdx < floor) {
    posture = POSTURE_LADDER[floor];
  }

  const intensity = Math.max(0.2, Math.min(1, 0.3 + Math.abs(avg - 5) / 5 + Math.abs(trend) / 4));

  const lines = atmosphereLines[posture];
  return {
    posture,
    intensity: Math.max(0, Math.min(intensity, 1)),
    atmosphereLine: lines.length > 0 ? lines[seed % lines.length] : undefined,
    sceneClass: sceneClasses[posture],
  };
}

/** Legacy compatibility — maps posture to the old 3-tone system */
export function postureToLegacyTone(posture: PostureState): 'hopeful' | 'neutral' | 'heavy' {
  switch (posture) {
    case 'vitoria_final':
    case 'esperancoso':
    case 'livre':
      return 'hopeful';
    case 'abatido':
    case 'em_dificuldade':
    case 'em_conflito':
      return 'heavy';
    default:
      return 'neutral';
  }
}
