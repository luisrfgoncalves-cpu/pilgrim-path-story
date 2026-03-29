import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { ChoiceEffect } from '@/data/story';

/**
 * Invisible Dice System
 * 
 * For each player decision, rolls an invisible die that modifies
 * the outcome intensity. The player never sees numbers — only feels
 * the effects through narrative and attribute changes.
 * 
 * Probability is influenced by player attributes (fé, coragem, perseverança).
 * Higher attributes → better odds. Lower → harsher outcomes.
 */

export type DiceOutcome = 'muito_positivo' | 'positivo' | 'neutro' | 'negativo' | 'muito_negativo';

/** Multipliers applied to choice effects per outcome tier */
const OUTCOME_MULTIPLIERS: Record<DiceOutcome, number> = {
  muito_positivo: 1.8,
  positivo: 1.3,
  neutro: 1.0,
  negativo: 0.6,
  muito_negativo: 0.3,
};

/** Bonus effects granted on exceptional rolls */
const OUTCOME_BONUS: Record<DiceOutcome, Partial<ChoiceEffect>> = {
  muito_positivo: { fe: 1, coragem: 1 },
  positivo: {},
  neutro: {},
  negativo: {},
  muito_negativo: { perseveranca: -1 },
};

/**
 * Base probability weights for each outcome.
 * Attributes shift these weights dynamically.
 */
const BASE_WEIGHTS: Record<DiceOutcome, number> = {
  muito_positivo: 10,
  positivo: 25,
  neutro: 30,
  negativo: 25,
  muito_negativo: 10,
};

/**
 * Calculate modified weights based on player attributes.
 * High attributes boost positive outcomes; low attributes boost negative.
 */
function getModifiedWeights(attrs: PlayerAttributes): Record<DiceOutcome, number> {
  // Average of the three influencing attributes (scale 0-10 typically)
  const avg = (attrs.fe + attrs.coragem + attrs.perseveranca) / 3;
  // Shift: positive when avg > 5 (baseline), negative when below
  const shift = (avg - 5) * 3; // -15 to +15 range roughly

  return {
    muito_positivo: Math.max(2, BASE_WEIGHTS.muito_positivo + shift * 1.2),
    positivo: Math.max(5, BASE_WEIGHTS.positivo + shift * 0.8),
    neutro: Math.max(10, BASE_WEIGHTS.neutro - Math.abs(shift) * 0.3),
    negativo: Math.max(2, BASE_WEIGHTS.negativo - shift * 0.8),
    muito_negativo: Math.max(1, BASE_WEIGHTS.muito_negativo - shift * 1.2),
  };
}

/**
 * Roll the invisible die. Returns the outcome tier.
 * Uses Math.random() for true unpredictability each time.
 */
export function rollInvisibleDice(attrs: PlayerAttributes): DiceOutcome {
  const weights = getModifiedWeights(attrs);
  const total = Object.values(weights).reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;

  for (const [outcome, weight] of Object.entries(weights) as [DiceOutcome, number][]) {
    roll -= weight;
    if (roll <= 0) return outcome;
  }
  return 'neutro';
}

/**
 * Apply the dice outcome to choice effects.
 * Positive effects are amplified on good rolls, reduced on bad.
 * Negative effects are inverted (bad rolls make penalties worse).
 */
export function applyDiceToEffects(
  baseEffects: ChoiceEffect,
  outcome: DiceOutcome,
): ChoiceEffect {
  const multiplier = OUTCOME_MULTIPLIERS[outcome];
  const bonus = OUTCOME_BONUS[outcome];
  const modified: ChoiceEffect = {};

  for (const [key, val] of Object.entries(baseEffects)) {
    if (val === undefined || val === 0) continue;
    if (val > 0) {
      // Positive effects: amplified by good rolls, reduced by bad
      modified[key as keyof ChoiceEffect] = Math.round(val * multiplier);
    } else {
      // Negative effects: reduced by good rolls, amplified by bad
      const inverseMultiplier = 2 - multiplier; // 0.2 for muito_positivo, 1.7 for muito_negativo
      modified[key as keyof ChoiceEffect] = Math.round(val * Math.max(0.3, inverseMultiplier));
    }
  }

  // Apply bonus effects
  for (const [key, val] of Object.entries(bonus)) {
    if (val) {
      modified[key as keyof ChoiceEffect] = (modified[key as keyof ChoiceEffect] || 0) + val;
    }
  }

  // Ensure at least original keys remain (even if zeroed)
  for (const key of Object.keys(baseEffects)) {
    if (modified[key as keyof ChoiceEffect] === undefined) {
      modified[key as keyof ChoiceEffect] = 0;
    }
  }

  return modified;
}

/**
 * Get a subtle narrative hint about the dice outcome.
 * These are woven into the consequence text so the player
 * "feels" the luck without seeing numbers.
 */
export function getDiceNarrativeHint(outcome: DiceOutcome): string | null {
  const hints: Record<DiceOutcome, string[]> = {
    muito_positivo: [
      'Uma força invisível parece guiar seus passos.',
      'Algo extraordinário acontece — como se o próprio céu sorrisse.',
      'A providência age de maneira surpreendente a seu favor.',
    ],
    positivo: [
      'As circunstâncias parecem favorecer sua decisão.',
      'Um vento favorável acompanha seus passos.',
      'Sua escolha encontra terreno fértil.',
    ],
    neutro: [],
    negativo: [
      'O caminho se mostra mais difícil do que esperava.',
      'Obstáculos inesperados surgem diante de você.',
      'Sua decisão encontra resistência.',
    ],
    muito_negativo: [
      'Uma tempestade interior ameaça consumir sua resolução.',
      'As consequências são mais severas do que qualquer um poderia prever.',
      'O peso desta jornada nunca pareceu tão esmagador.',
    ],
  };

  const pool = hints[outcome];
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
