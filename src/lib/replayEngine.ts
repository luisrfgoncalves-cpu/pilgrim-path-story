import { PlayerAttributes, PlayHistory, PlaythroughRecord } from '@/hooks/useStoryProgress';
import { ChoiceEffect } from '@/data/story';

/**
 * Replayability Engine
 * 
 * Cross-playthrough memory, adaptive intensity, and variation
 * to make every replay feel meaningfully different.
 */

// ─── Cross-Playthrough Memory ───

export interface PlaythroughMemory {
  /** Which consequence keys were triggered across ALL playthroughs */
  allConsequenceKeys: Set<string>;
  /** Flags seen in any playthrough */
  allFlags: Set<string>;
  /** Average final attributes across playthroughs */
  avgAttributes: PlayerAttributes;
  /** Dominant play style */
  playStyle: 'compassionate' | 'brave' | 'wise' | 'enduring' | 'balanced';
  /** How many times each phase was visited */
  phaseVisitCounts: Record<string, number>;
  /** Best and worst results */
  bestResult: 'complete' | 'difficult' | 'incomplete' | null;
  worstResult: 'complete' | 'difficult' | 'incomplete' | null;
  /** Total playthroughs */
  totalRuns: number;
}

export function buildPlaythroughMemory(history: PlayHistory): PlaythroughMemory {
  const allFlags = new Set<string>();
  const allConsequenceKeys = new Set<string>();
  const phaseVisitCounts: Record<string, number> = {};
  const consequenceKeyNames = [
    'mostrou_misericordia', 'foi_corajoso', 'buscou_sabedoria', 'perseverou_na_dor',
    'ignorou_aviso', 'abandonou_companheiro', 'cedeu_tentacao', 'fugiu_do_conflito',
  ];

  const sumAttrs: PlayerAttributes = { fe: 0, perseveranca: 0, discernimento: 0, coragem: 0 };
  let bestResult: PlaythroughMemory['bestResult'] = null;
  let worstResult: PlaythroughMemory['worstResult'] = null;

  const resultRank = { complete: 3, difficult: 2, incomplete: 1 };

  for (const run of history.playthroughs) {
    for (const flag of run.flags) {
      allFlags.add(flag);
      if (consequenceKeyNames.includes(flag)) allConsequenceKeys.add(flag);
    }

    sumAttrs.fe += run.attributes.fe;
    sumAttrs.perseveranca += run.attributes.perseveranca;
    sumAttrs.discernimento += run.attributes.discernimento;
    sumAttrs.coragem += run.attributes.coragem;

    if (!bestResult || resultRank[run.result] > resultRank[bestResult]) bestResult = run.result;
    if (!worstResult || resultRank[run.result] < resultRank[worstResult]) worstResult = run.result;
  }

  const n = Math.max(1, history.playthroughs.length);
  const avgAttributes: PlayerAttributes = {
    fe: Math.round(sumAttrs.fe / n),
    perseveranca: Math.round(sumAttrs.perseveranca / n),
    discernimento: Math.round(sumAttrs.discernimento / n),
    coragem: Math.round(sumAttrs.coragem / n),
  };

  // Determine play style from average attributes
  const styleScores = {
    compassionate: avgAttributes.fe,
    brave: avgAttributes.coragem,
    wise: avgAttributes.discernimento,
    enduring: avgAttributes.perseveranca,
  };
  const topStyle = Object.entries(styleScores).sort((a, b) => b[1] - a[1]);
  const playStyle: PlaythroughMemory['playStyle'] =
    topStyle[0][1] - topStyle[1][1] >= 2
      ? topStyle[0][0] as any
      : 'balanced';

  return {
    allConsequenceKeys,
    allFlags,
    avgAttributes,
    playStyle,
    phaseVisitCounts,
    bestResult,
    worstResult,
    totalRuns: history.totalPlaythroughs,
  };
}

// ─── Adaptive Intensity ───

export type IntensityLevel = 'easy' | 'normal' | 'hard' | 'brutal';

/**
 * Calculate intensity for the current playthrough based on history.
 * - First run: normal
 * - After a complete run: harder challenges
 * - After failures: slightly easier to avoid frustration
 * - Veteran players: brutal mode available
 */
export function calculateIntensity(
  memory: PlaythroughMemory,
  currentAttrs: PlayerAttributes,
  playthrough: number,
): IntensityLevel {
  if (playthrough <= 1) return 'normal';

  const avg = (currentAttrs.fe + currentAttrs.coragem + currentAttrs.perseveranca + currentAttrs.discernimento) / 4;

  // After multiple failures, ease up
  if (memory.worstResult === 'incomplete' && memory.bestResult !== 'complete') {
    return avg < 4 ? 'easy' : 'normal';
  }

  // Veteran with completions: ramp up
  if (memory.totalRuns >= 3 && memory.bestResult === 'complete') {
    return avg >= 7 ? 'brutal' : 'hard';
  }

  // Second playthrough after completion
  if (memory.bestResult === 'complete') return 'hard';

  return 'normal';
}

/**
 * Get effect multipliers based on intensity.
 * Higher intensity = bigger swings (both positive and negative effects amplified).
 */
export function getIntensityMultipliers(intensity: IntensityLevel): {
  positiveMultiplier: number;
  negativeMultiplier: number;
  extraNarrativeTone: string | null;
} {
  switch (intensity) {
    case 'easy':
      return { positiveMultiplier: 1.3, negativeMultiplier: 0.5, extraNarrativeTone: null };
    case 'normal':
      return { positiveMultiplier: 1.0, negativeMultiplier: 1.0, extraNarrativeTone: null };
    case 'hard':
      return { positiveMultiplier: 1.0, negativeMultiplier: 1.4, extraNarrativeTone: 'O caminho parece mais estreito desta vez.' };
    case 'brutal':
      return { positiveMultiplier: 0.8, negativeMultiplier: 1.8, extraNarrativeTone: 'Cada passo é uma prova. O caminho não perdoa hesitação.' };
  }
}

/**
 * Apply intensity to choice effects.
 */
export function applyIntensityToEffects(effects: ChoiceEffect, intensity: IntensityLevel): ChoiceEffect {
  const { positiveMultiplier, negativeMultiplier } = getIntensityMultipliers(intensity);
  const modified: ChoiceEffect = {};

  for (const [key, val] of Object.entries(effects)) {
    if (val === undefined || val === 0) continue;
    if (val > 0) {
      modified[key as keyof ChoiceEffect] = Math.round(val * positiveMultiplier);
    } else {
      modified[key as keyof ChoiceEffect] = Math.round(val * negativeMultiplier);
    }
  }

  return modified;
}

// ─── Replay-Exclusive Content ───

/**
 * Get narrative additions that only appear on replays,
 * based on what the player did (or didn't do) in previous runs.
 */
export function getReplayNarrative(
  memory: PlaythroughMemory,
  chapterId: string,
  playthrough: number,
): string[] {
  if (playthrough <= 1) return [];

  const lines: string[] = [];

  // Style-based flavor
  if (playthrough === 2) {
    switch (memory.playStyle) {
      case 'compassionate':
        lines.push('Seu coração misericordioso deixou marcas neste caminho. Elas ainda são visíveis.');
        break;
      case 'brave':
        lines.push('A coragem que demonstrou antes ecoa nestas pedras. O caminho se lembra.');
        break;
      case 'wise':
        lines.push('Seus olhos veem mais agora. A sabedoria acumulada ilumina detalhes antes ocultos.');
        break;
      case 'enduring':
        lines.push('Cada cicatriz de antes é uma armadura agora. Você conhece a dor deste caminho.');
        break;
      case 'balanced':
        lines.push('Você percorreu este caminho com equilíbrio. Mas equilíbrio pode significar que não se aprofundou em nada.');
        break;
    }
  }

  // Consequence echoes from past runs
  if (memory.allConsequenceKeys.has('abandonou_companheiro') && chapterId.includes('fase3')) {
    lines.push('Uma culpa antiga acompanha seus passos pelo vale. Rostos que você deixou para trás.');
  }
  if (memory.allConsequenceKeys.has('cedeu_tentacao') && chapterId.includes('fase4')) {
    lines.push('A feira parece mais sedutora desta vez. Ou talvez você esteja mais consciente da tentação.');
  }
  if (memory.allConsequenceKeys.has('foi_corajoso') && chapterId.includes('fase3')) {
    lines.push('Sua bravura anterior deixou uma marca aqui. Até as sombras hesitam.');
  }
  if (memory.allConsequenceKeys.has('mostrou_misericordia') && chapterId.includes('fase5')) {
    lines.push('A misericórdia que demonstrou antes ressoa. No escuro da masmorra, ela é uma luz tênue.');
  }

  // Veteran-specific
  if (playthrough >= 3) {
    lines.push('O caminho parece diferente — não porque mudou, mas porque você mudou.');
  }
  if (playthrough >= 4) {
    lines.push('Poucos peregrinos percorreram este caminho tantas vezes. Os guardiões o observam com respeito.');
  }

  return lines;
}

// ─── Unseen Content Tracking ───

/**
 * Track which events the player has seen across playthroughs
 * to prioritize showing unseen content.
 */
const SEEN_EVENTS_KEY = 'peregrino-seen-events';

export function getSeenEventIds(): Set<string> {
  try {
    const saved = localStorage.getItem(SEEN_EVENTS_KEY);
    if (saved) return new Set(JSON.parse(saved));
  } catch {}
  return new Set();
}

export function markEventsSeen(eventIds: string[]): void {
  const seen = getSeenEventIds();
  for (const id of eventIds) seen.add(id);
  localStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify([...seen]));
}

/**
 * Boost weight of unseen events to prioritize fresh content.
 * Events the player has never seen get 3x weight boost.
 */
export function boostUnseenEvents<T extends { id: string; weight?: number }>(
  events: T[],
  seenIds: Set<string>,
): T[] {
  return events.map(e => ({
    ...e,
    weight: seenIds.has(e.id) ? (e.weight || 1) : (e.weight || 1) * 3,
  }));
}
