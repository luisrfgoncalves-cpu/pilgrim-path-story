import { useState, useEffect, useCallback, useRef } from 'react';
import { ChoiceEffect } from '@/data/story';

/* ───────────────────────────────────────────
   1. TIMED CHOICE — countdown forces urgency
   ─────────────────────────────────────────── */

interface TimedChoiceProps {
  timeLimit: number;
  onTimeout: () => void;
  children: React.ReactNode;
}

export const TimedChoice = ({ timeLimit, onTimeout, children }: TimedChoiceProps) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const expired = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0 && !expired.current) {
          expired.current = true;
          setTimeout(() => onTimeout(), 0);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onTimeout]);

  const pct = (timeLeft / timeLimit) * 100;
  const urgent = pct < 30;

  return (
    <div className="relative">
      {/* Timer bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            urgent ? 'bg-destructive' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] uppercase tracking-wider font-medium ${urgent ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
          {urgent ? '⚡ Decida agora!' : '⏳ Tempo restante'}
        </span>
        <span className={`text-sm font-mono font-bold ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      {/* Screen pulse when urgent */}
      {urgent && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-pulse">
          <div className="absolute inset-0 border-2 border-destructive/30 rounded-none" />
          <div className="absolute inset-0 bg-destructive/5" />
        </div>
      )}
      {children}
    </div>
  );
};

/* ───────────────────────────────────────────
   2. HOLD TO CONFIRM — press & hold a choice
   ─────────────────────────────────────────── */

interface HoldButtonProps {
  holdDuration?: number; // seconds, default 1.5
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
}

export const HoldButton = ({ holdDuration = 1.5, onConfirm, children, className = '' }: HoldButtonProps) => {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = useCallback(() => {
    if (completed) return;
    setHolding(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + (100 / (holdDuration * 30));
        if (next >= 100) {
          setCompleted(true);
          setHolding(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => onConfirm(), 150);
          return 100;
        }
        return next;
      });
    }, 33);
  }, [holdDuration, onConfirm, completed]);

  const endHold = useCallback(() => {
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!completed) {
      setProgress(0);
    }
  }, [completed]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      className={`relative w-full text-left p-4 rounded-lg border-2 transition-all duration-150 select-none overflow-hidden ${
        completed
          ? 'border-primary bg-primary/15 scale-[0.98]'
          : holding
          ? 'border-primary/60 bg-card scale-[0.97]'
          : 'border-border bg-card hover:border-primary/30'
      } ${className}`}
    >
      {/* Fill progress background */}
      <div
        className="absolute inset-0 bg-primary/10 transition-all duration-75 pointer-events-none"
        style={{ width: `${progress}%` }}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      {/* Hold hint */}
      {!completed && (
        <div className="relative z-10 mt-2 flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-muted-foreground/40 flex items-center justify-center">
            <div
              className="rounded-full bg-primary transition-all duration-75"
              style={{
                width: `${Math.max(2, progress * 0.1)}px`,
                height: `${Math.max(2, progress * 0.1)}px`,
              }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
            {holding ? `${Math.round(progress)}%` : 'Segure para confirmar'}
          </span>
        </div>
      )}
      {completed && (
        <div className="relative z-10 mt-2">
          <span className="text-[9px] text-primary uppercase tracking-wider font-medium">✓ Confirmado</span>
        </div>
      )}
    </button>
  );
};

/* ───────────────────────────────────────────
   3. HOLD CHALLENGE — resist/endure mechanic
   ─────────────────────────────────────────── */

interface HoldChallengeProps {
  duration: number;
  onComplete: () => void;
  onFail: () => void;
  label: string;
}

export const HoldChallenge = ({ duration, onComplete, onFail, label }: HoldChallengeProps) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!holding || completed) return;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + (100 / (duration * 20));
        if (next >= 100) {
          setCompleted(true);
          onComplete();
          return 100;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [holding, completed, duration, onComplete]);

  const handleRelease = () => {
    setHolding(false);
    if (!completed && progress > 10) {
      setProgress(0);
      setFailed(true);
      setTimeout(() => {
        setFailed(false);
        onFail();
      }, 800);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">{label}</p>
      <button
        onMouseDown={() => setHolding(true)}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={() => setHolding(true)}
        onTouchEnd={handleRelease}
        onTouchCancel={handleRelease}
        className={`w-full py-8 rounded-lg border-2 transition-all duration-200 select-none ${
          completed
            ? 'border-primary bg-primary/20 text-primary'
            : failed
            ? 'border-destructive bg-destructive/10 text-destructive vfx-shake'
            : holding
            ? 'border-primary/70 bg-primary/10 scale-[0.97]'
            : 'border-border bg-card hover:border-primary/30'
        }`}
      >
        <div className="relative overflow-hidden rounded">
          <div
            className="absolute inset-0 bg-primary/15 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
          <span className="relative font-display text-sm">
            {completed ? '✓ Resistiu!' : failed ? '✗ Cedeu...' : holding ? 'Segurando...' : '⟐ Segure para resistir'}
          </span>
        </div>
      </button>
      {/* Circular progress */}
      <div className="flex justify-center">
        <svg width="36" height="36" className="transform -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke={completed ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.5)'}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 14}`}
            strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
            className="transition-all duration-75"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   4. DRAG TO CHOOSE — swipe/drag between paths
   ─────────────────────────────────────────── */

interface DragChoice {
  label: string;
  description?: string;
}

interface DragToChooseProps {
  leftChoice: DragChoice;
  rightChoice: DragChoice;
  onChoose: (side: 'left' | 'right') => void;
  threshold?: number;
}

export const DragToChoose = ({ leftChoice, rightChoice, onChoose, threshold = 80 }: DragToChooseProps) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [chosen, setChosen] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    if (chosen) return;
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || chosen) return;
    const diff = clientX - startX.current;
    setDragX(Math.max(-150, Math.min(150, diff)));
  };

  const handleEnd = () => {
    if (!isDragging || chosen) return;
    setIsDragging(false);
    if (Math.abs(dragX) >= threshold) {
      const side = dragX > 0 ? 'right' : 'left';
      setChosen(side);
      setTimeout(() => onChoose(side), 300);
    } else {
      setDragX(0);
    }
  };

  const leftOpacity = Math.min(1, Math.max(0.3, 1 + dragX / 100));
  const rightOpacity = Math.min(1, Math.max(0.3, 1 - dragX / 100));
  const leftScale = dragX < -30 ? 1.05 : 1;
  const rightScale = dragX > 30 ? 1.05 : 1;

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center font-medium">
        ← Arraste para escolher →
      </p>

      {/* Drag indicator */}
      <div className="flex items-center justify-center gap-2 h-6">
        <div className={`h-0.5 rounded-full bg-primary/40 transition-all duration-150`} style={{ width: `${Math.max(0, -dragX * 0.3)}px` }} />
        <div
          ref={containerRef}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          className={`w-12 h-6 rounded-full border-2 flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
            chosen === 'left' ? 'border-primary bg-primary/20' :
            chosen === 'right' ? 'border-primary bg-primary/20' :
            isDragging ? 'border-primary/60' : 'border-border'
          }`}
          style={{ transform: `translateX(${chosen ? (chosen === 'right' ? 100 : -100) : dragX}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }}
        >
          <div className="w-2 h-2 rounded-full bg-foreground/50" />
        </div>
        <div className={`h-0.5 rounded-full bg-primary/40 transition-all duration-150`} style={{ width: `${Math.max(0, dragX * 0.3)}px` }} />
      </div>

      {/* Choice cards */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            chosen === 'left' ? 'border-primary bg-primary/15 ring-1 ring-primary' : 'border-border bg-card'
          }`}
          style={{ opacity: leftOpacity, transform: `scale(${leftScale})`, transition: isDragging ? 'opacity 0.1s' : 'all 0.3s' }}
        >
          <p className="text-sm font-medium text-foreground">{leftChoice.label}</p>
          {leftChoice.description && (
            <p className="text-[10px] text-muted-foreground mt-1">{leftChoice.description}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            chosen === 'right' ? 'border-primary bg-primary/15 ring-1 ring-primary' : 'border-border bg-card'
          }`}
          style={{ opacity: rightOpacity, transform: `scale(${rightScale})`, transition: isDragging ? 'opacity 0.1s' : 'all 0.3s' }}
        >
          <p className="text-sm font-medium text-foreground">{rightChoice.label}</p>
          {rightChoice.description && (
            <p className="text-[10px] text-muted-foreground mt-1">{rightChoice.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
