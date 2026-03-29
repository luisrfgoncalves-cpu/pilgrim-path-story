import { useState, useEffect, useCallback, useRef } from 'react';

/* ───────────────────────────────────────────
   Scene event types that can be attached to chapters
   ─────────────────────────────────────────── */

export type SceneEventType = 'sinking' | 'tension' | 'suspense';

export interface SceneEvent {
  type: SceneEventType;
  /** Delay before event starts (ms) */
  delay?: number;
  /** Duration for sinking (ms before drowning) */
  duration?: number;
  /** Message shown during event */
  message?: string;
}

/* ───────────────────────────────────────────
   1. SINKING — screen slides down, tap rapidly to escape
   ─────────────────────────────────────────── */

interface SinkingEventProps {
  duration?: number;
  onEscape: () => void;
  onDrown: () => void;
  message?: string;
}

export const SinkingEvent = ({ duration = 8000, onEscape, onDrown, message }: SinkingEventProps) => {
  const [sinkLevel, setSinkLevel] = useState(0);
  const [taps, setTaps] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [drowned, setDrowned] = useState(false);
  const tapsNeeded = 12;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Continuous sinking
  useEffect(() => {
    if (escaped || drowned) return;
    intervalRef.current = setInterval(() => {
      setSinkLevel(prev => {
        const next = prev + (100 / (duration / 80));
        if (next >= 100) {
          setDrowned(true);
          vibrate([100, 50, 100]);
          setTimeout(onDrown, 600);
          return 100;
        }
        return next;
      });
    }, 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [escaped, drowned, duration, onDrown]);

  const handleTap = useCallback(() => {
    if (escaped || drowned) return;
    vibrate([30]);
    setTaps(prev => {
      const next = prev + 1;
      // Each tap pushes back the sink
      setSinkLevel(lvl => Math.max(0, lvl - 8));
      if (next >= tapsNeeded) {
        setEscaped(true);
        vibrate([50, 30, 50, 30, 100]);
        setTimeout(onEscape, 400);
      }
      return next;
    });
  }, [escaped, drowned, onEscape]);

  const waterColor = drowned ? 'bg-destructive/30' : 'bg-blue-900/40';

  return (
    <div className="relative">
      {/* Sinking water overlay */}
      <div
        className="fixed inset-0 z-30 pointer-events-none transition-all duration-200"
        style={{ background: `linear-gradient(to top, hsl(220 40% 15% / ${sinkLevel * 0.006}) ${sinkLevel}%, transparent ${sinkLevel + 10}%)` }}
      />

      {/* Tap area */}
      <div
        onClick={handleTap}
        onTouchStart={handleTap}
        className="relative z-40 bg-card border-2 border-border rounded-xl p-6 text-center cursor-pointer select-none active:scale-[0.97] transition-transform"
        style={{ transform: `translateY(${sinkLevel * 0.5}px)` }}
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
          {message || 'Você está afundando!'}
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: tapsNeeded }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-150 ${
                i < taps ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {escaped ? (
          <p className="font-display text-primary text-sm">✓ Você escapou!</p>
        ) : drowned ? (
          <p className="font-display text-destructive text-sm">Você afundou...</p>
        ) : (
          <>
            <p className="font-display text-foreground text-lg animate-pulse">
              Toque rápido para sair!
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              {tapsNeeded - taps} toques restantes
            </p>
          </>
        )}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   2. SUSPENSE DELAY — deliberate pause before choice result
   ─────────────────────────────────────────── */

interface SuspenseDelayProps {
  duration?: number;
  message?: string;
  onComplete: () => void;
}

export const SuspenseDelay = ({ duration = 2500, message, onComplete }: SuspenseDelayProps) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setDone(true);
        vibrate([40, 20, 40]);
        setTimeout(onComplete, 300);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="py-8 text-center space-y-4 animate-fade-in">
      <div className="flex justify-center">
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 48 48" className="w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
          {!done && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic font-body animate-pulse">
        {message || 'O destino pondera sua escolha...'}
      </p>
    </div>
  );
};

/* ───────────────────────────────────────────
   3. TENSION PULSE — screen vibrates + visual tension
   ─────────────────────────────────────────── */

interface TensionPulseProps {
  intensity?: number; // 1-3
  duration?: number; // ms
  onComplete?: () => void;
}

export const TensionPulse = ({ intensity = 2, duration = 3000, onComplete }: TensionPulseProps) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Trigger device vibration pattern
    const pattern = intensity >= 3
      ? [100, 50, 100, 50, 200, 100, 100]
      : intensity >= 2
      ? [50, 30, 50, 30, 80]
      : [30, 50, 30];
    vibrate(pattern);

    const timer = setTimeout(() => {
      setActive(false);
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [intensity, duration, onComplete]);

  if (!active) return null;

  const shakeIntensity = intensity >= 3 ? '3px' : intensity >= 2 ? '1.5px' : '0.8px';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        animation: `tensionShake ${0.15 / intensity}s ease-in-out infinite`,
        ['--shake-amount' as string]: shakeIntensity,
      }}
    >
      {/* Red edge pulse */}
      <div
        className="absolute inset-0 border-2 border-destructive/20 rounded-none"
        style={{ animation: 'pulse 1s ease-in-out infinite' }}
      />
    </div>
  );
};

/* ───────────────────────────────────────────
   Haptic helper (safe cross-browser)
   ─────────────────────────────────────────── */
function vibrate(pattern: number[]) {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {}
}
