import { useCallback, useRef } from 'react';

type EffectType = 'shake' | 'flash-light' | 'flash-dark' | 'fade-dramatic';

export const useVisualEffects = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const triggerEffect = useCallback((type: EffectType) => {
    const el = document.getElementById('scene-container');
    if (!el) return;

    switch (type) {
      case 'shake':
        el.classList.add('vfx-shake');
        setTimeout(() => el.classList.remove('vfx-shake'), 500);
        break;
      case 'flash-light':
        el.classList.add('vfx-flash-light');
        setTimeout(() => el.classList.remove('vfx-flash-light'), 600);
        break;
      case 'flash-dark':
        el.classList.add('vfx-flash-dark');
        setTimeout(() => el.classList.remove('vfx-flash-dark'), 600);
        break;
      case 'fade-dramatic':
        el.classList.add('vfx-dramatic-fade');
        setTimeout(() => el.classList.remove('vfx-dramatic-fade'), 1200);
        break;
    }
  }, []);

  /** Trigger effect based on choice consequences */
  const triggerChoiceEffect = useCallback((effects: Record<string, number>) => {
    const totalEffect = Object.values(effects).reduce((sum, v) => sum + (v || 0), 0);
    if (totalEffect >= 3) {
      triggerEffect('flash-light');
    } else if (totalEffect <= -2) {
      triggerEffect('shake');
      setTimeout(() => triggerEffect('flash-dark'), 200);
    } else if (totalEffect >= 1) {
      triggerEffect('flash-light');
    } else if (totalEffect < 0) {
      triggerEffect('shake');
    }
  }, [triggerEffect]);

  return { triggerEffect, triggerChoiceEffect };
};
