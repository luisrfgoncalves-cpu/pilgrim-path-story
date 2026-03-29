import { supabase } from '@/lib/supabase';
import { StoryProgress, PlayerAttributes, PlayHistory, PlaythroughRecord } from '@/hooks/useStoryProgress';

/**
 * Cloud Save System
 * 
 * Saves/loads full player progress to Supabase.
 * localStorage remains as immediate cache; Supabase is source of truth for logged-in users.
 */

export interface CloudProgress {
  current_chapter_id: string;
  visited_chapters: string[];
  choices_made: number;
  attributes: PlayerAttributes;
  decisions: any[];
  flags: Record<string, boolean>;
  items: string[];
  emotional_state: string;
  playthrough: number;
  started: boolean;
}

/** Save progress to Supabase */
export async function saveProgressToCloud(
  userId: string,
  progress: StoryProgress,
  emotionalState?: string,
): Promise<{ error: Error | null }> {
  const payload = {
    user_id: userId,
    current_chapter_id: progress.currentChapterId,
    visited_chapters: progress.visitedChapters,
    choices_made: progress.choicesMade,
    attributes: progress.attributes,
    decisions: progress.decisions,
    flags: progress.flags,
    items: progress.items,
    emotional_state: emotionalState || 'neutro',
    playthrough: progress.playthrough,
    started: progress.started,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('pilgrim_progress')
    .upsert(payload, { onConflict: 'user_id,playthrough' });

  return { error: error as Error | null };
}

/** Load progress from Supabase */
export async function loadProgressFromCloud(
  userId: string,
): Promise<{ data: StoryProgress | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('pilgrim_progress')
    .select('*')
    .eq('user_id', userId)
    .order('playthrough', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { data: null, error: error as Error | null };
  }

  const progress: StoryProgress = {
    currentChapterId: data.current_chapter_id,
    visitedChapters: data.visited_chapters as string[],
    choicesMade: data.choices_made,
    attributes: data.attributes as PlayerAttributes,
    decisions: data.decisions as any[],
    flags: data.flags as Record<string, boolean>,
    items: data.items as string[],
    started: data.started,
    playthrough: data.playthrough,
    campaign: (data as any).campaign || 'part1',
  };

  return { data: progress, error: null };
}

/** Save completed playthrough to history */
export async function savePlaythroughToCloud(
  userId: string,
  record: PlaythroughRecord,
  playthrough: number,
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('pilgrim_history')
    .insert({
      user_id: userId,
      result: record.result,
      attributes: record.attributes,
      choices_made: record.choicesMade,
      flags: record.flags,
      playthrough,
    });

  return { error: error as Error | null };
}

/** Load play history from Supabase */
export async function loadHistoryFromCloud(
  userId: string,
): Promise<{ data: PlayHistory | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('pilgrim_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: true });

  if (error) return { data: null, error: error as Error | null };

  const playthroughs: PlaythroughRecord[] = (data || []).map(d => ({
    completedAt: new Date(d.completed_at).getTime(),
    result: d.result as 'complete' | 'difficult' | 'incomplete',
    attributes: d.attributes as PlayerAttributes,
    choicesMade: d.choices_made,
    flags: (d.flags as string[]) || [],
  }));

  return {
    data: {
      playthroughs,
      totalPlaythroughs: playthroughs.length,
    },
    error: null,
  };
}

/** Sync profile summary (visible to other players) */
export async function syncProfileSummary(
  userId: string,
  progress: StoryProgress,
): Promise<void> {
  let phase = 0;
  const id = progress.currentChapterId;
  if (id.startsWith('fase6') || id.startsWith('final')) phase = 6;
  else if (id.startsWith('fase5')) phase = 5;
  else if (id.startsWith('fase4')) phase = 4;
  else if (id.startsWith('fase3')) phase = 3;
  else if (id.startsWith('fase2')) phase = 2;
  else if (id.startsWith('cena')) phase = 1;

  await supabase
    .from('profiles')
    .update({
      current_phase: phase,
      total_choices: progress.choicesMade,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}
