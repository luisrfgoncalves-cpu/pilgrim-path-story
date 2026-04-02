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
    // ── FASE 1 ──
    // Cidade da Destruição — oppressive tremor
    if (chapterId === 'cena1' || chapterId === 'cena1b') {
      setTimeout(() => triggerEffect('tremor'), 600);
    }
    // O Clamor — dramatic escape
    else if (chapterId === 'cena3') {
      setTimeout(() => triggerEffect('shake'), 400);
      setTimeout(() => triggerEffect('flash-light'), 1000);
    }
    // Fardo Insuportável — heartbeat tension
    else if (chapterId === 'cena4') {
      setTimeout(() => triggerEffect('heartbeat'), 500);
      setTimeout(() => triggerEffect('tremor'), 1500);
    }
    // Evangelista — divine encounter
    else if (chapterId === 'cena5') {
      setTimeout(() => triggerEffect('divine-light'), 800);
    }
    // Sozinho com o fardo — darkness
    else if (chapterId === 'cena6') {
      setTimeout(() => triggerEffect('fade-black'), 500);
      setTimeout(() => triggerEffect('tremor'), 1800);
    }
    // Porta Estreita — divine light at the door
    else if (chapterId === 'cena7') {
      setTimeout(() => triggerEffect('divine-light'), 800);
    }
    // Flechas na Porta — impact and shake
    else if (chapterId === 'cena7b') {
      setTimeout(() => triggerEffect('shake'), 300);
      setTimeout(() => triggerEffect('impact'), 800);
      setTimeout(() => triggerEffect('flash-dark'), 1200);
    }
    // Monte Sinai — earthquake and fire
    else if (chapterId === 'cena10') {
      setTimeout(() => triggerEffect('earthquake'), 500);
      setTimeout(() => triggerEffect('flash-dark'), 1200);
      setTimeout(() => triggerEffect('blood-pulse'), 2000);
    }
    // Pântano — sinking tremor
    else if (chapterId === 'cena11' || chapterId === 'cena11b') {
      setTimeout(() => triggerEffect('tremor'), 600);
      setTimeout(() => triggerEffect('fade-black'), 1500);
    }
    // Afundando — desperate pulse
    else if (chapterId === 'cena13') {
      setTimeout(() => triggerEffect('heartbeat'), 400);
      setTimeout(() => triggerEffect('tremor'), 1000);
      setTimeout(() => triggerEffect('blood-pulse'), 2000);
    }
    // Cruz — golden burst of liberation
    else if (chapterId === 'cena15') {
      setTimeout(() => triggerEffect('golden-burst'), 1000);
      setTimeout(() => triggerEffect('divine-light'), 2500);
    }
    // Três Seres Resplandecentes
    else if (chapterId === 'cena15b') {
      setTimeout(() => triggerEffect('flash-light'), 500);
      setTimeout(() => triggerEffect('golden-burst'), 1200);
      setTimeout(() => triggerEffect('divine-light'), 2500);
    }

    // ── FASE 2 ──
    else if (chapterId === 'fase2-cena1') {
      setTimeout(() => triggerEffect('divine-light'), 1000);
    }
    // Homem na Gaiola
    else if (chapterId === 'fase2-cena8') {
      setTimeout(() => triggerEffect('heartbeat'), 800);
      setTimeout(() => triggerEffect('flash-dark'), 1500);
    }
    // Armadura de Deus
    else if (chapterId === 'fase2-cena9' || chapterId === 'fase2-cena10') {
      setTimeout(() => triggerEffect('golden-burst'), 800);
    }
    // Colina da Dificuldade
    else if (chapterId === 'fase2-cena11' || chapterId === 'fase2-cena12') {
      setTimeout(() => triggerEffect('tremor'), 600);
    }
    // Leões
    else if (chapterId === 'fase2-cena14') {
      setTimeout(() => triggerEffect('shake'), 500);
      setTimeout(() => triggerEffect('impact'), 1000);
    }

    // ── FASE 3 ──
    // Vale da Humilhação
    else if (chapterId === 'fase3-cena1' || chapterId === 'fase3-cena2') {
      setTimeout(() => triggerEffect('tremor'), 500);
      setTimeout(() => triggerEffect('fade-black'), 1200);
    }
    // Apolião — battle
    else if (chapterId === 'fase3-cena3') {
      setTimeout(() => triggerEffect('earthquake'), 800);
      setTimeout(() => triggerEffect('blood-pulse'), 1500);
    }
    // Vale da Sombra da Morte
    else if (chapterId === 'fase3-cena5' || chapterId === 'fase3-cena6') {
      setTimeout(() => triggerEffect('fade-black'), 500);
      setTimeout(() => triggerEffect('tremor'), 1800);
    }

    // ── FASE 4 ──
    // Feira da Vaidade
    else if (chapterId === 'fase4-cena1') {
      setTimeout(() => triggerEffect('flash-light'), 500);
    }
    // Julgamento
    else if (chapterId === 'fase4-cena4' || chapterId === 'fase4-cena6') {
      setTimeout(() => triggerEffect('blood-pulse'), 800);
      setTimeout(() => triggerEffect('shake'), 1500);
    }
    // Morte de Fiel
    else if (chapterId === 'fase4-cena7' || chapterId === 'fase4-cena8') {
      setTimeout(() => triggerEffect('heartbeat'), 800);
      setTimeout(() => triggerEffect('fade-black'), 2000);
      setTimeout(() => triggerEffect('divine-light'), 3800);
    }

    // ── FASE 5 ──
    else if (chapterId === 'fase5-cena1' || chapterId === 'fase5-cena2') {
      setTimeout(() => triggerEffect('tremor'), 800);
    }
    // Gigante Desespero
    else if (chapterId === 'fase5-cena3' || chapterId === 'fase5-cena4') {
      setTimeout(() => triggerEffect('earthquake'), 600);
      setTimeout(() => triggerEffect('impact'), 1200);
    }
    // Chave da Promessa — light breaking through
    else if (chapterId === 'fase5-cena6' || chapterId === 'fase5-cena7') {
      setTimeout(() => triggerEffect('golden-burst'), 800);
      setTimeout(() => triggerEffect('divine-light'), 1800);
    }

    // ── FASE 6 ──
    // Rio da Morte
    else if (chapterId === 'fase6-cena1' || chapterId === 'fase6-cena2') {
      setTimeout(() => triggerEffect('tremor'), 500);
      setTimeout(() => triggerEffect('fade-black'), 1500);
    }
    // Cidade Celestial finale
    else if (chapterId.includes('fase6-cena8') || chapterId.includes('fase6-cena9')) {
      setTimeout(() => triggerEffect('golden-burst'), 500);
      setTimeout(() => triggerEffect('divine-light'), 1500);
      setTimeout(() => triggerEffect('flash-light'), 3000);
    }
    // Storm scenes
    else if (chapterId.includes('tempestade') || chapterId.includes('storm')) {
      setTimeout(() => triggerEffect('lightning'), 700);
      setTimeout(() => triggerEffect('earthquake'), 1200);
    }
  }, [triggerEffect]);

  return { triggerEffect, triggerChoiceEffect, triggerSceneEntryVFX };
};
