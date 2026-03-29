import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentEvent, hasClaimedReward } from '@/lib/collectiveEvents';

/**
 * Hook that checks for new support received and event rewards,
 * returning combined attribute bonuses.
 */

const LAST_SUPPORT_CHECK_KEY = 'peregrino-last-support-check';

interface SupportBonus {
  fe: number;
  coragem: number;
  perseveranca: number;
  discernimento: number;
}

export function useSupportBonus(): { bonus: SupportBonus; newSupportCount: number } {
  const { user } = useAuth();
  const checkedRef = useRef(false);
  const bonusRef = useRef<SupportBonus>({ fe: 0, coragem: 0, perseveranca: 0, discernimento: 0 });
  const countRef = useRef(0);

  useEffect(() => {
    if (!user || checkedRef.current) return;
    checkedRef.current = true;

    const lastCheck = localStorage.getItem(LAST_SUPPORT_CHECK_KEY) || new Date(0).toISOString();

    supabase
      .from('pilgrim_support')
      .select('support_type')
      .eq('to_user_id', user.id)
      .gt('created_at', lastCheck)
      .then(({ data }) => {
        const bonus: SupportBonus = { fe: 0, coragem: 0, perseveranca: 0, discernimento: 0 };

        if (data && data.length > 0) {
          for (const s of data) {
            switch (s.support_type) {
              case 'prayer': bonus.fe += 1; break;
              case 'encouragement': bonus.coragem += 1; break;
              case 'blessing': bonus.perseveranca += 1; break;
            }
          }
          countRef.current = data.length;
        }

        // Add event reward bonus if claimed
        const event = getCurrentEvent();
        if (hasClaimedReward(event.id)) {
          const attr = event.reward.attr as keyof SupportBonus;
          if (attr in bonus) {
            bonus[attr] += event.reward.value;
          }
        }

        // Cap bonuses at +5 each (3 support + 2 event max)
        bonusRef.current = {
          fe: Math.min(5, bonus.fe),
          coragem: Math.min(5, bonus.coragem),
          perseveranca: Math.min(5, bonus.perseveranca),
          discernimento: Math.min(5, bonus.discernimento),
        };

        localStorage.setItem(LAST_SUPPORT_CHECK_KEY, new Date().toISOString());
      });
  }, [user]);

  return { bonus: bonusRef.current, newSupportCount: countRef.current };
}
