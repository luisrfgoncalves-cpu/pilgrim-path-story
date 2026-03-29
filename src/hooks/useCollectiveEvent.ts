import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  getCurrentEvent,
  getNextEvent,
  getDaysRemaining,
  getWeekStart,
  hasClaimedReward,
  claimReward,
  CollectiveEvent,
} from '@/lib/collectiveEvents';

interface EventProgress {
  current: number;
  target: number;
  percentage: number;
  completed: boolean;
  participants: string[];
}

export function useCollectiveEvent() {
  const [event] = useState<CollectiveEvent>(getCurrentEvent);
  const [nextEvent] = useState<CollectiveEvent>(getNextEvent);
  const [daysLeft] = useState(getDaysRemaining);
  const [progress, setProgress] = useState<EventProgress>({
    current: 0, target: 0, percentage: 0, completed: false, participants: [],
  });
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    const weekStart = getWeekStart();
    const ev = getCurrentEvent();

    try {
      if (ev.type === 'support_goal') {
        // Count supports sent this week
        const supportType = ev.id === 'faith_united' ? 'prayer'
          : ev.id === 'blessing_rain' ? 'blessing'
          : undefined;

        let query = supabase
          .from('pilgrim_support')
          .select('id, from_user_id')
          .gte('created_at', weekStart);

        if (supportType) {
          query = query.eq('support_type', supportType);
        }

        const { data } = await query;
        const count = data?.length || 0;
        const uniqueUsers = [...new Set(data?.map(d => d.from_user_id) || [])];

        setProgress({
          current: count,
          target: ev.targetCount,
          percentage: Math.min(100, Math.round((count / ev.targetCount) * 100)),
          completed: count >= ev.targetCount,
          participants: uniqueUsers,
        });
      } else if (ev.type === 'attribute_goal' && ev.targetAttr) {
        // Count players with attribute above target
        // We read from pilgrim_progress (latest playthrough per user)
        const { data } = await supabase
          .from('pilgrim_progress')
          .select('user_id, attributes')
          .gte('updated_at', weekStart);

        const qualifying = (data || []).filter(d => {
          const attrs = d.attributes as Record<string, number> | null;
          return attrs && (attrs[ev.targetAttr!] || 0) >= (ev.targetValue || 0);
        });

        const uniqueUsers = [...new Set(qualifying.map(d => d.user_id))];

        setProgress({
          current: uniqueUsers.length,
          target: ev.targetCount,
          percentage: Math.min(100, Math.round((uniqueUsers.length / ev.targetCount) * 100)),
          completed: uniqueUsers.length >= ev.targetCount,
          participants: uniqueUsers,
        });
      } else if (ev.type === 'progress_goal') {
        // Count players who made >= 5 choices this week
        const { data } = await supabase
          .from('pilgrim_progress')
          .select('user_id, choices_made')
          .gte('updated_at', weekStart);

        const qualifying = (data || []).filter(d => (d.choices_made || 0) >= 5);
        const uniqueUsers = [...new Set(qualifying.map(d => d.user_id))];

        setProgress({
          current: uniqueUsers.length,
          target: ev.targetCount,
          percentage: Math.min(100, Math.round((uniqueUsers.length / ev.targetCount) * 100)),
          completed: uniqueUsers.length >= ev.targetCount,
          participants: uniqueUsers,
        });
      }
    } catch {
      // Silently fail — events are non-critical
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadProgress();
    const interval = setInterval(loadProgress, 60_000); // refresh every minute
    return () => clearInterval(interval);
  }, [loadProgress]);

  const canClaim = progress.completed && !hasClaimedReward(event.id);

  const claim = useCallback(() => {
    claimReward(event.id);
    return event.reward;
  }, [event]);

  return {
    event,
    nextEvent,
    daysLeft,
    progress,
    loading,
    canClaim,
    claimed: hasClaimedReward(event.id),
    claim,
  };
}
