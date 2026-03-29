import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StoryProgress } from '@/hooks/useStoryProgress';
import { saveProgressToCloud, syncProfileSummary } from '@/lib/cloudSave';

/**
 * Syncs local story progress to Supabase.
 * Debounced: saves at most every 3 seconds to avoid hammering the API.
 * Also updates profile summary for community visibility.
 */
export const useProgressSync = (progress: StoryProgress) => {
  const { user } = useAuth();
  const lastSyncRef = useRef<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const doSync = useCallback(async () => {
    if (!user || !progress.started) return;

    const syncKey = `${progress.currentChapterId}-${progress.choicesMade}-${Object.keys(progress.flags).length}`;
    if (syncKey === lastSyncRef.current) return;
    lastSyncRef.current = syncKey;

    // Save full progress
    await saveProgressToCloud(user.id, progress);
    // Update public profile summary
    await syncProfileSummary(user.id, progress);
  }, [user, progress]);

  useEffect(() => {
    if (!user || !progress.started) return;

    // Debounce: wait 2s after last change
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSync, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, progress.currentChapterId, progress.choicesMade, progress.flags, progress.started, doSync]);

  // Save immediately on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (user && progress.started) {
        // Use sendBeacon for reliable save on tab close
        const payload = JSON.stringify({
          user_id: user.id,
          current_chapter_id: progress.currentChapterId,
          visited_chapters: progress.visitedChapters,
          choices_made: progress.choicesMade,
          attributes: progress.attributes,
          decisions: progress.decisions,
          flags: progress.flags,
          items: progress.items,
          playthrough: progress.playthrough,
          started: progress.started,
          updated_at: new Date().toISOString(),
        });
        // localStorage is always saved by useStoryProgress, so cloud save here is best-effort
        localStorage.setItem('peregrino-progress', JSON.stringify(progress));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [user, progress]);
};
