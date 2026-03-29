import { PlayerAttributes } from '@/hooks/useStoryProgress';

export type EmotionalTone = 'hopeful' | 'neutral' | 'heavy';

interface EmotionalState {
  tone: EmotionalTone;
  /** 0-1 intensity multiplier */
  intensity: number;
  /** Extra narrative line injected automatically */
  atmosphereLine?: string;
}

const atmosphereLines: Record<EmotionalTone, string[]> = {
  hopeful: [
    "Uma sensação de esperança aquece seu peito.",
    "O caminho à frente parece mais claro do que nunca.",
    "Algo dentro de você diz: vai dar certo.",
    "A luz ao redor parece mais forte do que antes.",
    "Cada passo traz mais confiança.",
  ],
  neutral: [],
  heavy: [
    "Um peso invisível pressiona seus ombros.",
    "O ar parece mais denso, mais difícil de respirar.",
    "Sombras parecem se mover nos cantos da sua visão.",
    "Uma voz interior sussurra que talvez não valha a pena.",
    "O silêncio ao redor carrega uma tensão difícil de ignorar.",
  ],
};

/**
 * Evaluates the player's emotional state from their current attributes.
 * Returns tone, intensity, and an optional atmosphere line.
 */
export function getEmotionalState(attrs: PlayerAttributes, chapterId: string): EmotionalState {
  const avg = (attrs.fe + attrs.perseveranca + attrs.discernimento + attrs.coragem) / 4;

  // Use chapterId as seed for deterministic but varied atmosphere selection
  const seed = chapterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  if (avg >= 7) {
    const lines = atmosphereLines.hopeful;
    return {
      tone: 'hopeful',
      intensity: Math.min((avg - 7) / 5, 1),
      atmosphereLine: lines[seed % lines.length],
    };
  }

  if (avg <= 3) {
    const lines = atmosphereLines.heavy;
    return {
      tone: 'heavy',
      intensity: Math.min((4 - avg) / 4, 1),
      atmosphereLine: lines[seed % lines.length],
    };
  }

  return { tone: 'neutral', intensity: 0 };
}

/** CSS classes for the scene wrapper based on emotional tone */
export function getEmotionalClasses(tone: EmotionalTone): string {
  switch (tone) {
    case 'hopeful':
      return 'emotional-hopeful';
    case 'heavy':
      return 'emotional-heavy';
    default:
      return '';
  }
}
