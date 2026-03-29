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
      {/* Timer bar - larger and more visible */}
      <div className="h-4 bg-secondary rounded-full overflow-hidden mb-4 border-2 border-border shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            urgent ? 'bg-destructive' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm uppercase tracking-wider font-display ${urgent ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
          {urgent ? '⚡ Decida agora!' : '⏳ Tempo restante'}
        </span>
        <span className={`text-lg font-mono font-bold ${urgent ? 'text-destructive' : 'text-foreground'}`}>
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      {/* Instruction */}
      <div className="bg-card/50 border border-primary/20 rounded-xl p-3 mb-4 text-center">
        <p className="text-sm text-primary font-display">👆 Segure o botão para confirmar sua escolha</p>
        <p className="text-xs text-muted-foreground mt-1">Pressione e mantenha pressionado até completar</p>
      </div>
      {/* Screen pulse when urgent */}
      {urgent && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-pulse">
          <div className="absolute inset-0 border-4 border-destructive/40 rounded-none" />
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
  holdDuration?: number;
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
    if (!completed) setProgress(0);
  }, [completed]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      className={`relative w-full text-left p-5 rounded-xl border-3 transition-all duration-150 select-none overflow-hidden min-h-[72px] ${
        completed
          ? 'border-primary bg-primary/15 scale-[0.98]'
          : holding
          ? 'border-primary/60 bg-card scale-[0.97]'
          : 'border-border bg-card hover:border-primary/30'
      } ${className}`}
      style={{
        boxShadow: holding
          ? '0 2px 0 0 hsl(30 15% 10%), inset 0 2px 8px hsl(var(--primary) / 0.1)'
          : '0 4px 0 0 hsl(30 15% 10%), 0 5px 10px hsl(0 0% 0% / 0.2)',
        transform: holding ? 'translateY(2px)' : completed ? 'translateY(0)' : 'translateY(0)',
      }}
    >
      {/* Fill progress background */}
      <div
        className="absolute inset-0 bg-primary/15 transition-all duration-75 pointer-events-none rounded-xl"
        style={{ width: `${progress}%` }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
      {/* Hold hint - larger and more visible */}
      {!completed && (
        <div className="relative z-10 mt-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-primary/50 flex items-center justify-center bg-card">
            <div
              className="rounded-full bg-primary transition-all duration-75"
              style={{
                width: `${Math.max(4, progress * 0.16)}px`,
                height: `${Math.max(4, progress * 0.16)}px`,
              }}
            />
          </div>
          <span className="text-sm text-primary/80 font-display tracking-wide">
            {holding ? `${Math.round(progress)}% — Continue segurando!` : '👆 Segure para confirmar'}
          </span>
        </div>
      )}
      {completed && (
        <div className="relative z-10 mt-3">
          <span className="text-sm text-primary font-display tracking-wide">✓ Confirmado!</span>
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
        if (next >= 100) { setCompleted(true); onComplete(); return 100; }
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
      setTimeout(() => { setFailed(false); onFail(); }, 800);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-base uppercase tracking-widest text-muted-foreground text-center font-display">{label}</p>
      
      {/* Instruction box */}
      <div className="bg-card/50 border border-primary/20 rounded-xl p-3 text-center">
        <p className="text-sm text-primary font-display">👇 Pressione e segure o botão abaixo</p>
        <p className="text-xs text-muted-foreground mt-1">Não solte até completar — resistir é essencial!</p>
      </div>

      <button
        onMouseDown={() => setHolding(true)}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={() => setHolding(true)}
        onTouchEnd={handleRelease}
        onTouchCancel={handleRelease}
        className={`w-full py-10 rounded-xl border-3 transition-all duration-200 select-none text-lg font-display ${
          completed
            ? 'border-primary bg-primary/20 text-primary'
            : failed
            ? 'border-destructive bg-destructive/10 text-destructive vfx-shake'
            : holding
            ? 'border-primary/70 bg-primary/10 scale-[0.97]'
            : 'border-border bg-card hover:border-primary/30'
        }`}
        style={{
          boxShadow: holding
            ? '0 2px 0 0 hsl(30 15% 10%), inset 0 3px 10px hsl(var(--primary) / 0.15)'
            : '0 5px 0 0 hsl(30 15% 10%), 0 6px 12px hsl(0 0% 0% / 0.3)',
          transform: holding ? 'translateY(3px)' : 'translateY(0)',
        }}
      >
        <div className="relative overflow-hidden rounded">
          <div
            className="absolute inset-0 bg-primary/15 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
          <span className="relative">
            {completed ? '✓ Resistiu!' : failed ? '✗ Cedeu...' : holding ? '🔥 Segurando...' : '⟐ Segure para resistir'}
          </span>
        </div>
      </button>
      {/* Circular progress - larger */}
      <div className="flex justify-center">
        <svg width="56" height="56" className="transform -rotate-90">
          <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
          <circle
            cx="28" cy="28" r="22" fill="none"
            stroke={completed ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.5)'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
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
    <div className="space-y-5">
      {/* Instruction box */}
      <div className="bg-card/50 border border-primary/20 rounded-xl p-3 text-center">
        <p className="text-base text-primary font-display">👆 Arraste o botão para escolher</p>
        <p className="text-sm text-muted-foreground mt-1">Deslize para a esquerda ou direita</p>
      </div>

      {/* Drag indicator - larger */}
      <div className="flex items-center justify-center gap-3 h-10">
        <span className="text-sm text-muted-foreground font-display">◀</span>
        <div className={`h-1 rounded-full bg-primary/40 transition-all duration-150`} style={{ width: `${Math.max(0, -dragX * 0.4)}px` }} />
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
          className={`w-16 h-10 rounded-full border-3 flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
            chosen === 'left' ? 'border-primary bg-primary/20' :
            chosen === 'right' ? 'border-primary bg-primary/20' :
            isDragging ? 'border-primary/60 bg-primary/10' : 'border-border bg-card'
          }`}
          style={{
            transform: `translateX(${chosen ? (chosen === 'right' ? 100 : -100) : dragX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            boxShadow: '0 3px 0 0 hsl(30 15% 10%), 0 4px 8px hsl(0 0% 0% / 0.25)',
          }}
        >
          <span className="text-lg">⚔️</span>
        </div>
        <div className={`h-1 rounded-full bg-primary/40 transition-all duration-150`} style={{ width: `${Math.max(0, dragX * 0.4)}px` }} />
        <span className="text-sm text-muted-foreground font-display">▶</span>
      </div>

      {/* Choice cards - larger */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] ${
            chosen === 'left' ? 'border-primary bg-primary/15 ring-2 ring-primary shadow-lg' : 'border-border bg-card'
          }`}
          style={{ opacity: leftOpacity, transform: `scale(${leftScale})`, transition: isDragging ? 'opacity 0.1s' : 'all 0.3s' }}
        >
          <p className="text-base font-display text-foreground">{leftChoice.label}</p>
          {leftChoice.description && (
            <p className="text-sm text-muted-foreground mt-1">{leftChoice.description}</p>
          )}
        </div>
        <div
          className={`p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] ${
            chosen === 'right' ? 'border-primary bg-primary/15 ring-2 ring-primary shadow-lg' : 'border-border bg-card'
          }`}
          style={{ opacity: rightOpacity, transform: `scale(${rightScale})`, transition: isDragging ? 'opacity 0.1s' : 'all 0.3s' }}
        >
          <p className="text-base font-display text-foreground">{rightChoice.label}</p>
          {rightChoice.description && (
            <p className="text-sm text-muted-foreground mt-1">{rightChoice.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
