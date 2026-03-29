import { useState, useEffect, useCallback } from 'react';
import { ChoiceEffect } from '@/data/story';

interface TimedChoiceProps {
  timeLimit: number; // seconds
  onTimeout: () => void;
  children: React.ReactNode;
}

export const TimedChoice = ({ timeLimit, onTimeout, children }: TimedChoiceProps) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      onTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 0.1), 100);
    return () => clearInterval(timer);
  }, [timeLeft <= 0]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 0.1)), 100);
    return () => clearInterval(timer);
  }, []);

  const pct = (timeLeft / timeLimit) * 100;
  const urgent = pct < 30;

  return (
    <div className="relative">
      {/* Timer bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            urgent ? 'bg-destructive animate-pulse' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] uppercase tracking-wider ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
          {urgent ? '⚡ Decida agora!' : 'Tempo restante'}
        </span>
        <span className={`text-xs font-mono ${urgent ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      {/* Screen edge glow when urgent */}
      {urgent && (
        <div className="fixed inset-0 pointer-events-none z-50 border-2 border-destructive/20 animate-pulse rounded-none" />
      )}
      {children}
    </div>
  );
};

interface HoldChallengeProps {
  duration: number; // seconds to hold
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
  }, [holding, completed, duration]);

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
        className={`w-full py-6 rounded-lg border-2 transition-all duration-200 select-none ${
          completed
            ? 'border-primary bg-primary/20 text-primary'
            : failed
            ? 'border-destructive bg-destructive/10 text-destructive animate-[shake_0.3s_ease-in-out]'
            : holding
            ? 'border-primary/70 bg-primary/10 scale-[0.98]'
            : 'border-border bg-card hover:border-primary/30'
        }`}
      >
        <div className="relative overflow-hidden rounded">
          {/* Fill progress */}
          <div
            className="absolute inset-0 bg-primary/15 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
          <span className="relative font-display text-sm">
            {completed ? '✓ Concluído!' : failed ? 'Tente novamente...' : holding ? 'Segurando...' : 'Segure para resistir'}
          </span>
        </div>
      </button>
      {/* Circular progress indicator */}
      <div className="flex justify-center">
        <svg width="32" height="32" className="transform -rotate-90">
          <circle cx="16" cy="16" r="12" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
          <circle
            cx="16" cy="16" r="12" fill="none"
            stroke={completed ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.5)'}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 12}`}
            strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress / 100)}`}
            className="transition-all duration-75"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
