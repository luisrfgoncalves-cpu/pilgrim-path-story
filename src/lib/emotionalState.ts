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
 * Recent decision trend: checks if last N choices were mostly positive or negative.
 * Returns a modifier: positive = trending up, negative = trending down.
 */
function getDecisionTrend(recentEffects: Array<Record<string, number>>): number {
  if (recentEffects.length === 0) return 0;
  const last = recentEffects.slice(-3);
  const totals = last.map(e => Object.values(e).reduce((s, v) => s + (v || 0), 0));
  return totals.reduce((s, v) => s + v, 0) / totals.length;
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

  // 2. Resolve from attributes + trend
  let posture: PostureState;
  let intensity: number;

  if (avg >= 8.5 && trend >= 0) {
    posture = 'vitoria_final';
    intensity = Math.min((avg - 8) / 4, 1);
  } else if (avg >= 7 && trend >= 0) {
    posture = 'esperancoso';
    intensity = Math.min((avg - 6.5) / 3.5, 1);
  } else if (avg >= 5.5 && trend >= -0.5) {
    posture = 'determinado';
    intensity = 0.4 + (avg - 5.5) / 5;
  } else if (avg >= 4 && trend < -1) {
    // Declining despite decent attributes → conflict
    posture = 'em_conflito';
    intensity = Math.min(Math.abs(trend) / 3, 1);
  } else if (avg >= 4 && trend >= 0) {
    posture = 'recuperacao';
    intensity = 0.4;
  } else if (avg >= 3) {
    // Individual attribute analysis
    if (fe < 3 && coragem < 3) {
      posture = 'em_dificuldade';
      intensity = Math.min((4 - avg) / 4, 1);
    } else {
      posture = 'confuso';
      intensity = Math.min((4 - avg) / 3, 1);
    }
  } else {
    posture = 'abatido';
    intensity = Math.min((3 - avg) / 3, 1);
  }

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
