import { sceneImages } from '@/data/sceneImages';
import type { NarrativeBeat } from '@/hooks/useNarrativeBeats';

interface ResolveSceneBeatVisualKeyInput {
  chapterId: string;
  beat: NarrativeBeat | null;
  beatCount: number;
  beatIndex: number;
}

/**
 * Resolves the best visual key for a given narrative beat.
 * Priority order:
 * 1. Explicit beat key: chapterId__beat{N}
 * 2. Explicit startIndex key: chapterId__{startIndex}
 * 3. Base scene key: chapterId
 * 
 * No keyword fallback — all scenes now have explicit beat mappings.
 */
export function resolveSceneBeatVisualKey({ chapterId, beat, beatCount, beatIndex }: ResolveSceneBeatVisualKeyInput): string {
  if (!beat) return chapterId;

  // 1. Try explicit beat key (1-indexed)
  const beatKey = `${chapterId}__beat${beatIndex + 1}`;
  if (sceneImages[beatKey]) return beatKey;

  // 2. Try startIndex key
  const startKey = `${chapterId}__${beat.startIndex}`;
  if (sceneImages[startKey]) return startKey;

  // 3. Fall back to base scene key
  return chapterId;
}
