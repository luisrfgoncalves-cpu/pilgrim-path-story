import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadProgressFromCloud, loadHistoryFromCloud } from '@/lib/cloudSave';
import { toast } from 'sonner';

/**
 * Hook that loads cloud save data when a user logs in.
 * Call this in the main page that uses useStoryProgress.
 * Pass the loadFromCloud function from useStoryProgress.
 */
export function useCloudSync(loadFromCloud: (userId: string) => Promise<{ hasCloudSave: boolean; error: Error | null }>) {
  const { user } = useAuth();
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || loadedRef.current === user.id) return;
    loadedRef.current = user.id;

    loadFromCloud(user.id).then(({ hasCloudSave, error }) => {
      if (hasCloudSave && !error) {
        toast.success('Progresso restaurado da nuvem ☁️');
      }
    });
  }, [user, loadFromCloud]);
}
