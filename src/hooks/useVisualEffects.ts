import { useCallback, useRef } from 'react';

type EffectType =
  | 'shake' | 'flash-light' | 'flash-dark' | 'fade-dramatic'
  | 'earthquake' | 'golden-burst' | 'blood-pulse' | 'lightning'
  | 'divine-light' | 'impact' | 'fade-black' | 'heartbeat' | 'tremor';

const VFX_CLASS_MAP: Record<EffectType, { cls: string; dur: number }> = {
  'shake':         { cls: 'vfx-shake',        dur: 500 },
  'flash-light':   { cls: 'vfx-flash-light',  dur: 600 },
  'flash-dark':    { cls: 'vfx-flash-dark',   dur: 600 },
  'fade-dramatic': { cls: 'vfx-dramatic-fade', dur: 1200 },
  'earthquake':    { cls: 'vfx-earthquake',    dur: 800 },
  'golden-burst':  { cls: 'vfx-golden-burst',  dur: 1200 },
  'blood-pulse':   { cls: 'vfx-blood-pulse',   dur: 800 },
  'lightning':     { cls: 'vfx-lightning',      dur: 400 },
  'divine-light':  { cls: 'vfx-divine-light',  dur: 2000 },
  'impact':        { cls: 'vfx-impact',         dur: 600 },
  'fade-black':    { cls: 'vfx-fade-black',     dur: 1500 },
  'heartbeat':     { cls: 'vfx-heartbeat',      dur: 1000 },
  'tremor':        { cls: 'vfx-tremor',         dur: 2000 },
};

export const useVisualEffects = () => {
  const activeRef = useRef<Set<string>>(new Set());

  const triggerEffect = useCallback((type: EffectType) => {
    const el = document.getElementById('scene-container');
    if (!el) return;
    const info = VFX_CLASS_MAP[type];
    if (!info || activeRef.current.has(info.cls)) return;

    activeRef.current.add(info.cls);
    el.classList.add(info.cls);
    setTimeout(() => {
      el.classList.remove(info.cls);
      activeRef.current.delete(info.cls);
    }, info.dur);
  }, []);

  /** Trigger effect based on choice consequences — more dramatic */
  const triggerChoiceEffect = useCallback((effects: Record<string, number>) => {
    const totalEffect = Object.values(effects).reduce((sum, v) => sum + (v || 0), 0);
    if (totalEffect >= 4) {
      triggerEffect('golden-burst');
    } else if (totalEffect >= 2) {
      triggerEffect('flash-light');
    } else if (totalEffect >= 1) {
      triggerEffect('divine-light');
    } else if (totalEffect <= -3) {
      triggerEffect('earthquake');
      setTimeout(() => triggerEffect('blood-pulse'), 300);
    } else if (totalEffect <= -1) {
      triggerEffect('shake');
      setTimeout(() => triggerEffect('flash-dark'), 200);
    }
  }, [triggerEffect]);

  /** Auto-trigger scene entry VFX based on chapter context */
  const triggerSceneEntryVFX = useCallback((chapterId: string) => {
    // Battle scenes
    if (chapterId.includes('fase3-cena3')) {
      setTimeout(() => triggerEffect('earthquake'), 800);
      setTimeout(() => triggerEffect('blood-pulse'), 1500);
    }
    // Vale da Sombra
    else if (chapterId.includes('fase3-cena5')) {
      setTimeout(() => triggerEffect('fade-black'), 500);
      setTimeout(() => triggerEffect('tremor'), 1800);
    }
    // Cruz / Libertação
    else if (chapterId.includes('fase2-cena4')) {
      setTimeout(() => triggerEffect('golden-burst'), 1000);
      setTimeout(() => triggerEffect('divine-light'), 2500);
    }
    // Gigante Desespero
    else if (chapterId.includes('fase5-cena3')) {
      setTimeout(() => triggerEffect('earthquake'), 600);
      setTimeout(() => triggerEffect('impact'), 1200);
    }
    // Feira da Vaidade
    else if (chapterId.includes('fase4-cena1')) {
      setTimeout(() => triggerEffect('flash-light'), 500);
    }
    // Morte de Fiel
    else if (chapterId.includes('fase4-cena8')) {
      setTimeout(() => triggerEffect('heartbeat'), 800);
      setTimeout(() => triggerEffect('fade-black'), 2000);
      setTimeout(() => triggerEffect('divine-light'), 3800);
    }
    // Rio da Morte
    else if (chapterId.includes('fase6-cena1')) {
      setTimeout(() => triggerEffect('tremor'), 500);
      setTimeout(() => triggerEffect('fade-black'), 1500);
    }
    // Cidade Celestial finale
    else if (chapterId.includes('fase6-cena9') || chapterId.includes('fase6-cena8')) {
      setTimeout(() => triggerEffect('golden-burst'), 500);
      setTimeout(() => triggerEffect('divine-light'), 1500);
    }
    // Castelo da Dúvida
    else if (chapterId.startsWith('fase5-cena1') || chapterId.startsWith('fase5-cena2')) {
      setTimeout(() => triggerEffect('tremor'), 800);
    }
    // Pântano do Desânimo
    else if (chapterId === 'cena4') {
      setTimeout(() => triggerEffect('tremor'), 600);
    }
    // Homem na Gaiola de Ferro
    else if (chapterId === 'fase2-cena8') {
      setTimeout(() => triggerEffect('heartbeat'), 800);
      setTimeout(() => triggerEffect('flash-dark'), 1500);
    }
    // Storm scenes
    else if (chapterId.includes('tempestade') || chapterId.includes('storm')) {
      setTimeout(() => triggerEffect('lightning'), 700);
      setTimeout(() => triggerEffect('earthquake'), 1200);
    }
  }, [triggerEffect]);

  return { triggerEffect, triggerChoiceEffect, triggerSceneEntryVFX };
};
