import { useMemo, useEffect } from 'react';
import { StoryProgress, PlayerAttributes, PlayHistory } from '@/hooks/useStoryProgress';
import { eventPools, routeVariants, replayExclusiveEvents } from '@/data/eventPools';
import {
  DynamicEvent,
  DynamicChoice,
  EventSelectionContext,
  generateSeed,
  selectEventsForScene,
  filterDynamicChoices,
  getConsequenceModifiers,
  shuffleMicroEvents,
  PhaseEventPool,
} from '@/lib/dynamicEvents';
import {
  buildPlaythroughMemory,
  calculateIntensity,
  getIntensityMultipliers,
  getReplayNarrative,
  getSeenEventIds,
  markEventsSeen,
  boostUnseenEvents,
  IntensityLevel,
} from '@/lib/replayEngine';

/**
 * Hook that resolves dynamic events for the current scene.
 * Now includes replay memory, adaptive intensity, and unseen-event boosting.
 */
export function useDynamicEvents(progress: StoryProgress, chapterId: string, history?: PlayHistory) {
  const result = useMemo(() => {
    const flagList = Object.entries(progress.flags)
      .filter(([, v]) => v)
      .map(([k]) => k);

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

    // Build merged pool: base + replay-exclusive events (if replay)
    let pool = eventPools[phase];
    if (progress.playthrough > 1 && replayExclusiveEvents[phase]) {
      const replayPool = replayExclusiveEvents[phase];
      pool = pool ? {
        ...pool,
        variableCount: pool.variableCount + replayPool.variableCount,
        events: [...pool.events, ...replayPool.events],
      } : replayPool;
    }

    // Boost unseen events for variety
    if (pool) {
      const seenIds = getSeenEventIds();
      pool = {
        ...pool,
        events: boostUnseenEvents(pool.events, seenIds),
      };
    }

    // Select events
    const events = selectEventsForScene(chapterId, pool, ctx);

    // Replay memory & intensity
    const memory = history ? buildPlaythroughMemory(history) : null;
    const intensity = memory
      ? calculateIntensity(memory, progress.attributes, progress.playthrough)
      : 'normal' as IntensityLevel;
    const intensityInfo = getIntensityMultipliers(intensity);

    // Replay-exclusive narrative
    const replayNarrative = memory
      ? getReplayNarrative(memory, chapterId, progress.playthrough)
      : [];

    // Collect extra narrative
    const eventNarrative = events.flatMap(e => e.narrative);
    const allExtraNarrative = [...replayNarrative, ...eventNarrative];
    if (intensityInfo.extraNarrativeTone) {
      allExtraNarrative.push(intensityInfo.extraNarrativeTone);
    }

    // Choices
    const rawChoices = events.flatMap(e => e.choices || []);
    const extraChoices = filterDynamicChoices(rawChoices, ctx);

    // Consequence modifiers
    const { attrBonus, narrativeHints } = getConsequenceModifiers(consequenceKeys);

    // Shuffle
    const shuffledNarrative = shuffleMicroEvents(allExtraNarrative, seed + chapterId.length);

    // Alternate routes
    const routes = routeVariants[chapterId];
    const alternateRoute = routes?.find(r => r.condition({
      attributes: progress.attributes as unknown as Record<string, number>,
      flags: progress.flags,
      playthrough: progress.playthrough,
    })) || null;

    return {
      extraNarrative: shuffledNarrative,
      extraChoices,
      consequenceHints: narrativeHints,
      consequenceBonus: attrBonus,
      alternateRoute,
      selectedEvents: events,
      seed,
      /** Current intensity level */
      intensity,
      /** Replay memory info */
      memory,
    };
  }, [chapterId, progress.playthrough, progress.choicesMade, progress.flags, progress.visitedChapters, progress.decisions, progress.attributes, history]);

  // Mark selected events as seen for future unseen-boosting
  useEffect(() => {
    if (result.selectedEvents.length > 0) {
      markEventsSeen(result.selectedEvents.map(e => e.id));
    }
  }, [result.selectedEvents]);

  return result;
}
