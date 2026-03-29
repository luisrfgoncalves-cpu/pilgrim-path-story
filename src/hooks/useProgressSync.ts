import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StoryProgress } from '@/hooks/useStoryProgress';
import { saveProgressToCloud, syncProfileSummary } from '@/lib/cloudSave';
import { saveToIndexedDB } from '@/lib/localBackup';

/**
 * Dual auto-save system:
 * 1. IndexedDB — immediate local backup (survives cache clears better than localStorage)
 * 2. Supabase cloud — debounced every 3s when online + logged in
 * localStorage is already saved by useStoryProgress itself (triple redundancy).
 */
export const useProgressSync = (progress: StoryProgress) => {
  const { user } = useAuth();
  const lastSyncRef = useRef<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Always save to IndexedDB (works offline, no login needed)
  useEffect(() => {
    if (!progress.started) return;
    saveToIndexedDB('peregrino-progress', progress);
  }, [progress.currentChapterId, progress.choicesMade, progress.flags, progress.items, progress.started]);

  const doSync = useCallback(async () => {
    if (!user || !progress.started) return;

    const syncKey = `${progress.currentChapterId}-${progress.choicesMade}-${Object.keys(progress.flags).length}`;
    if (syncKey === lastSyncRef.current) return;
    lastSyncRef.current = syncKey;

    // Save full progress to cloud
    await saveProgressToCloud(user.id, progress);
    // Update public profile summary
    await syncProfileSummary(user.id, progress);
  }, [user, progress]);

  useEffect(() => {
    if (!user || !progress.started) return;

    // Debounce: wait 3s after last change to save to cloud
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSync, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, progress.currentChapterId, progress.choicesMade, progress.flags, progress.started, doSync]);

  // Save immediately on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (progress.started) {
        localStorage.setItem('peregrino-progress', JSON.stringify(progress));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [progress]);
};
