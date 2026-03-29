import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { StoryProgress } from '@/hooks/useStoryProgress';

/**
 * Syncs local story progress to the Supabase profile.
 * Updates current_phase and total_choices so other players can see your progress.
 */
export const useProgressSync = (progress: StoryProgress) => {
  const { user } = useAuth();
  const lastSyncRef = useRef<string>('');

  useEffect(() => {
    if (!user || !progress.started) return;

    // Determine phase from chapter ID
    const chapterId = progress.currentChapterId;
    let phase = 0;
    if (chapterId.startsWith('fase6') || chapterId.startsWith('final')) phase = 6;
    else if (chapterId.startsWith('fase5')) phase = 5;
    else if (chapterId.startsWith('fase4')) phase = 4;
    else if (chapterId.startsWith('fase3')) phase = 3;
    else if (chapterId.startsWith('fase2')) phase = 2;
    else if (chapterId.startsWith('cena')) phase = 1;

    const syncKey = `${phase}-${progress.choicesMade}`;
    if (syncKey === lastSyncRef.current) return;
    lastSyncRef.current = syncKey;

    supabase
      .from('profiles')
      .update({
        current_phase: phase,
        total_choices: progress.choicesMade,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .then(() => {});
  }, [user, progress.currentChapterId, progress.choicesMade, progress.started]);
};
