import { useMemo } from 'react';
import { StoryProgress, PlayerAttributes } from '@/hooks/useStoryProgress';
import { eventPools, routeVariants } from '@/data/eventPools';
import {
  DynamicEvent,
  DynamicChoice,
  EventSelectionContext,
  generateSeed,
  selectEventsForScene,
  filterDynamicChoices,
  getConsequenceModifiers,
  shuffleMicroEvents,
} from '@/lib/dynamicEvents';

/**
 * Hook that resolves dynamic events for the current scene.
 * Returns extra narrative, extra choices, consequence hints,
 * and alternate route info.
 */
export function useDynamicEvents(progress: StoryProgress, chapterId: string) {
  return useMemo(() => {
    const flagList = Object.entries(progress.flags)
      .filter(([, v]) => v)
      .map(([k]) => k);

    // Consequence keys from previous dynamic choices
    const consequenceKeys = flagList.filter(f =>
      ['mostrou_misericordia', 'foi_corajoso', 'buscou_sabedoria', 'perseverou_na_dor',
       'ignorou_aviso', 'abandonou_companheiro', 'cedeu_tentacao', 'fugiu_do_conflito'].includes(f)
    );

    const seed = generateSeed(progress.playthrough, progress.choicesMade, flagList.length);

    const ctx: EventSelectionContext = {
      playthrough: progress.playthrough,
      attributes: progress.attributes as unknown as Record<string, number>,
      flags: progress.flags,
      visitedChapters: progress.visitedChapters,
      decisions: progress.decisions.map(d => ({ flag: d.flag, effects: d.effects })),
      consequenceKeys,
      seed,
    };

    // Determine phase from chapter ID
    const phase = chapterId.startsWith('fase')
      ? chapterId.split('-')[0]
      : 'fase1';

    const pool = eventPools[phase];

    // Select events for this scene
    const events = selectEventsForScene(chapterId, pool, ctx);

    // Collect extra narrative from events
    const extraNarrative = events.flatMap(e => e.narrative);

    // Collect and filter extra choices from events
    const rawChoices = events.flatMap(e => e.choices || []);
    const extraChoices = filterDynamicChoices(rawChoices, ctx);

    // Get consequence modifiers from past dynamic decisions
    const { attrBonus, narrativeHints } = getConsequenceModifiers(consequenceKeys);

    // Shuffle narrative for micro-variation
    const shuffledNarrative = shuffleMicroEvents(extraNarrative, seed + chapterId.length);

    // Check alternate routes
    const routes = routeVariants[chapterId];
    const alternateRoute = routes?.find(r => r.condition({
      attributes: progress.attributes as unknown as Record<string, number>,
      flags: progress.flags,
      playthrough: progress.playthrough,
    })) || null;

    return {
      /** Extra narrative paragraphs from dynamic events */
      extraNarrative: shuffledNarrative,
      /** Extra choices from dynamic events */
      extraChoices,
      /** Narrative hints from past consequence keys */
      consequenceHints: narrativeHints,
      /** Attribute bonuses/penalties from past dynamic choices */
      consequenceBonus: attrBonus,
      /** Alternate route available for this scene */
      alternateRoute,
      /** All selected events for debugging/tracking */
      selectedEvents: events,
      /** The seed used for this selection */
      seed,
    };
  }, [chapterId, progress.playthrough, progress.choicesMade, progress.flags, progress.visitedChapters, progress.decisions, progress.attributes]);
}
