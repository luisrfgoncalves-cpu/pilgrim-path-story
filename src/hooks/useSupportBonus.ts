import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that checks for new support received and returns attribute bonuses.
 * Clears processed support by tracking last checked timestamp.
 */

const LAST_SUPPORT_CHECK_KEY = 'peregrino-last-support-check';

interface SupportBonus {
  fe: number;
  coragem: number;
  perseveranca: number;
}

export function useSupportBonus(): { bonus: SupportBonus; newSupportCount: number } {
  const { user } = useAuth();
  const checkedRef = useRef(false);
  const bonusRef = useRef<SupportBonus>({ fe: 0, coragem: 0, perseveranca: 0 });
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
        if (!data || data.length === 0) return;

        const bonus: SupportBonus = { fe: 0, coragem: 0, perseveranca: 0 };
        for (const s of data) {
          switch (s.support_type) {
            case 'prayer': bonus.fe += 1; break;
            case 'encouragement': bonus.coragem += 1; break;
            case 'blessing': bonus.perseveranca += 1; break;
          }
        }
        // Cap bonuses at +3 each to prevent abuse
        bonusRef.current = {
          fe: Math.min(3, bonus.fe),
          coragem: Math.min(3, bonus.coragem),
          perseveranca: Math.min(3, bonus.perseveranca),
        };
        countRef.current = data.length;

        localStorage.setItem(LAST_SUPPORT_CHECK_KEY, new Date().toISOString());
      });
  }, [user]);

  return { bonus: bonusRef.current, newSupportCount: countRef.current };
}
