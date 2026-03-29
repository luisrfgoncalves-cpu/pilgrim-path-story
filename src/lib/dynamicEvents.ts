import { ChoiceEffect, StoryChoice, SceneEventConfig } from '@/data/story';

/**
 * Dynamic Event System
 * 
 * Each phase has a pool of events. On each playthrough, a subset is selected
 * based on randomness seeded by playthrough number + player decisions.
 * Events can be fixed (always appear) or variable (randomly selected).
 */

// ─── Types ───

export interface DynamicEvent {
  id: string;
  /** Fixed events always appear; variable ones are randomly selected */
  type: 'fixed' | 'variable';
  /** Narrative paragraphs injected into the scene */
  narrative: string[];
  /** Extra choices added to the scene */
  choices?: DynamicChoice[];
  /** Minimum attributes to trigger this event */
  requires?: Partial<ChoiceEffect>;
  /** Required flag */
  requiresFlag?: string;
  /** Excluded if player has this flag */
  excludesFlag?: string;
  /** Emotional weight: affects intensity of atmosphere */
  emotionalWeight?: number;
  /** Scene event overlay (tension, etc.) */
  sceneEvent?: SceneEventConfig;
  /** Priority: higher = more likely to be selected from pool */
  weight?: number;
}

export interface DynamicChoice extends Omit<StoryChoice, 'nextChapterId'> {
  /** If set, overrides the next chapter. Otherwise follows default scene flow. */
  nextChapterId?: string;
  /** Probability 0-1 of this choice appearing (default 1) */
  appearance?: number;
  /** Dynamic consequence key — affects future event availability */
  consequenceKey?: string;
}

export interface PhaseEventPool {
  phaseId: string;
  /** How many variable events to pick per playthrough */
  variableCount: number;
  events: DynamicEvent[];
}

// ─── Seeded Random ───

/** Simple seeded PRNG for deterministic but varied selections */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

/** Generate a playthrough-specific seed from multiple factors */
export function generateSeed(playthrough: number, choicesMade: number, flagCount: number): number {
  return (playthrough * 7919) + (choicesMade * 104729) + (flagCount * 31) + Date.now() % 10000;
}

// ─── Event Selection ───

export interface EventSelectionContext {
  playthrough: number;
  attributes: Record<string, number>;
  flags: Record<string, boolean>;
  visitedChapters: string[];
  decisions: Array<{ flag?: string; effects: ChoiceEffect }>;
  /** Consequence keys from previous dynamic choices */
  consequenceKeys: string[];
  seed: number;
}

/**
 * Select events for a chapter from the phase pool.
 * Fixed events always included; variable events randomly picked.
 */
export function selectEventsForScene(
  chapterId: string,
  pool: PhaseEventPool | undefined,
  ctx: EventSelectionContext,
): DynamicEvent[] {
  if (!pool) return [];

  const rng = seededRandom(ctx.seed + chapterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));

  // Always include fixed events that pass conditions
  const fixed = pool.events.filter(e =>
    e.type === 'fixed' && passesConditions(e, ctx)
  );

  // Filter eligible variable events
  const eligible = pool.events.filter(e =>
    e.type === 'variable' && passesConditions(e, ctx)
  );

  // Weighted random selection of variable events
  const selected = weightedSample(eligible, pool.variableCount, rng);

  // Combine and sort: fixed first, then variable by weight
  return [...fixed, ...selected];
}

/**
 * Filter dynamic choices: some appear randomly, some based on conditions.
 */
export function filterDynamicChoices(
  choices: DynamicChoice[],
  ctx: EventSelectionContext,
): DynamicChoice[] {
  const rng = seededRandom(ctx.seed + 999);

  return choices.filter(c => {
    // Check appearance probability
    if (c.appearance !== undefined && c.appearance < 1) {
      if (rng() > c.appearance) return false;
    }
    // Check attribute requirements
    if (c.requires) {
      for (const [key, val] of Object.entries(c.requires)) {
        if (val && (ctx.attributes[key] || 0) < val) return false;
      }
    }
    // Check flag requirements
    if (c.requiresFlag && !ctx.flags[c.requiresFlag]) return false;
    if (c.excludesFlag && ctx.flags[c.excludesFlag]) return false;
    return true;
  });
}

// ─── Consequence System ───

/**
 * Dynamic consequences: past choices make future events easier or harder.
 * Returns effect modifiers based on consequence keys accumulated so far.
 */
export function getConsequenceModifiers(
  consequenceKeys: string[],
): { attrBonus: Partial<ChoiceEffect>; narrativeHints: string[] } {
  const bonus: ChoiceEffect = {};
  const hints: string[] = [];

  for (const key of consequenceKeys) {
    switch (key) {
      case 'mostrou_misericordia':
        bonus.fe = (bonus.fe || 0) + 1;
        hints.push('Sua misericórdia anterior ecoa neste momento.');
        break;
      case 'foi_corajoso':
        bonus.coragem = (bonus.coragem || 0) + 1;
        hints.push('A coragem que demonstrou antes lhe dá forças agora.');
        break;
      case 'buscou_sabedoria':
        bonus.discernimento = (bonus.discernimento || 0) + 1;
        hints.push('O conhecimento que buscou ilumina este momento.');
        break;
      case 'perseverou_na_dor':
        bonus.perseveranca = (bonus.perseveranca || 0) + 1;
        hints.push('A perseverança que cultivou sustenta seus passos.');
        break;
      case 'ignorou_aviso':
        bonus.discernimento = (bonus.discernimento || 0) - 1;
        hints.push('Ter ignorado aquele aviso cobra seu preço agora.');
        break;
      case 'abandonou_companheiro':
        bonus.fe = (bonus.fe || 0) - 1;
        hints.push('A culpa de ter abandonado alguém pesa em seu coração.');
        break;
      case 'cedeu_tentacao':
        bonus.perseveranca = (bonus.perseveranca || 0) - 1;
        hints.push('A tentação a que cedeu enfraqueceu sua resolução.');
        break;
      case 'fugiu_do_conflito':
        bonus.coragem = (bonus.coragem || 0) - 1;
        hints.push('Ter fugido antes torna este confronto mais difícil.');
        break;
    }
  }

  return { attrBonus: bonus, narrativeHints: hints };
}

// ─── Route Variation ───

export interface RouteVariant {
  /** Condition to use this route */
  condition: (ctx: EventSelectionContext) => boolean;
  /** Override next chapter ID */
  nextChapterId: string;
  /** Narrative hint about the path */
  hint?: string;
}

/**
 * Check if alternate routes are available for a chapter.
 * Returns the alternate next chapter or null for default.
 */
export function getAlternateRoute(
  chapterId: string,
  routes: RouteVariant[],
  ctx: EventSelectionContext,
): RouteVariant | null {
  // Shuffle routes with seeded random so different paths appear on different plays
  const rng = seededRandom(ctx.seed + 777);
  const shuffled = [...routes].sort(() => rng() - 0.5);
  return shuffled.find(r => r.condition(ctx)) || null;
}

// ─── Micro-event Randomization ───

/**
 * Shuffle narrative paragraphs and micro-events within a scene
 * while keeping the first and last paragraphs anchored.
 */
export function shuffleMicroEvents(
  narrative: string[],
  seed: number,
): string[] {
  if (narrative.length <= 3) return narrative;

  const rng = seededRandom(seed);
  const first = narrative[0];
  const last = narrative[narrative.length - 1];
  const middle = narrative.slice(1, -1);

  // Fisher-Yates shuffle on middle paragraphs
  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [middle[i], middle[j]] = [middle[j], middle[i]];
  }

  return [first, ...middle, last];
}

// ─── Helpers ───

function passesConditions(event: DynamicEvent, ctx: EventSelectionContext): boolean {
  if (event.requires) {
    for (const [key, val] of Object.entries(event.requires)) {
      if (val && (ctx.attributes[key] || 0) < val) return false;
    }
  }
  if (event.requiresFlag && !ctx.flags[event.requiresFlag]) return false;
  if (event.excludesFlag && ctx.flags[event.excludesFlag]) return false;
  return true;
}

function weightedSample<T extends { weight?: number }>(
  items: T[],
  count: number,
  rng: () => number,
): T[] {
  if (items.length <= count) return items;

  const weighted = items.map(item => ({
    item,
    sortKey: rng() * (item.weight || 1),
  }));

  weighted.sort((a, b) => b.sortKey - a.sortKey);
  return weighted.slice(0, count).map(w => w.item);
}
