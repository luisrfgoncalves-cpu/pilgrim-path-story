import { useState, useRef, useEffect, useCallback } from 'react';
import { playGameSfx } from '@/lib/gameSfx';
import { useTTS } from '@/hooks/useTTS';

interface EpicDefeatScreenProps {
  /** Contextual dramatic text */
  message: string;
  /** Called when player successfully "rises" */
  onRise: () => void;
  /** Optional villain name */
  villain?: string;
}

const EpicDefeatScreen = ({ message, onRise, villain }: EpicDefeatScreenProps) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [risen, setRisen] = useState(false);
  const [entered, setEntered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const HOLD_DURATION = 3000; // 3 seconds
  const { speak, stop: stopTTS } = useTTS();

  useEffect(() => {
    playGameSfx('defeat');
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-narrate defeat message with dramatic emotion
  useEffect(() => {
    const t = setTimeout(() => {
      speak(message, { emotion: villain ? 'villain' : 'dramatic' });
    }, 500);
    return () => { clearTimeout(t); stopTTS(); };
  }, [message]);

  const startHold = useCallback(() => {
    if (risen) return;
    setHolding(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(1, elapsed / HOLD_DURATION);
      setHoldProgress(pct);
      if (pct >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRisen(true);
        playGameSfx('victory');
        setTimeout(onRise, 1200);
      }
    }, 30);
  }, [risen, onRise]);

  const stopHold = useCallback(() => {
    if (risen) return;
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHoldProgress(0);
  }, [risen]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: risen
          ? 'radial-gradient(ellipse at center, hsl(43 40% 15% / 0.95) 0%, hsl(0 0% 0% / 0.97) 100%)'
          : 'radial-gradient(ellipse at center, hsl(0 30% 12% / 0.95) 0%, hsl(0 0% 0% / 0.97) 100%)',
      }}
    >
      {/* Pulsing red overlay */}
      {!risen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsl(0 50% 20% / 0.15) 0%, transparent 70%)',
            animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
          }}
        />
      )}

      {/* Defeat icon */}
      <div className={`text-6xl mb-6 transition-all duration-700 ${risen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        {risen ? '✦' : '💀'}
      </div>

      {/* Victory icon */}
      {risen && (
        <div className="text-6xl mb-6 animate-scale-in" style={{ color: 'hsl(43 80% 65%)' }}>
          ✦
        </div>
      )}

      {/* Message */}
      <div className="max-w-sm mx-6 text-center mb-8">
        {!risen ? (
          <>
            <p
              className="font-display text-2xl font-bold mb-3"
              style={{ color: 'hsl(0 60% 65%)', textShadow: '0 2px 16px hsl(0 60% 30% / 0.6)' }}
            >
              Você caiu.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed italic">{message}</p>
            {villain && (
              <p className="text-xs mt-3 uppercase tracking-widest" style={{ color: 'hsl(0 40% 50%)' }}>
                {villain}
              </p>
            )}
          </>
        ) : (
          <>
            <p
              className="font-display text-2xl font-bold mb-3"
              style={{ color: 'hsl(43 70% 65%)', textShadow: '0 2px 16px hsl(43 60% 40% / 0.6)' }}
            >
              Você se levantou!
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              +1 Perseverança — A queda não define o peregrino, mas sim a coragem de se levantar.
            </p>
          </>
        )}
      </div>

      {/* Hold-to-rise button */}
      {!risen && (
        <div className="relative">
          {/* Circular progress */}
          <svg className="w-28 h-28" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(0 0% 20%)" strokeWidth="4" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={holdProgress > 0.7 ? 'hsl(43 70% 55%)' : 'hsl(0 60% 50%)'}
              strokeWidth="4"
              strokeDasharray={`${holdProgress * 339.3} 339.3`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="transition-colors duration-300"
            />
          </svg>
          <button
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => { e.preventDefault(); startHold(); }}
            onTouchEnd={stopHold}
            onTouchCancel={stopHold}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">🙏</span>
            <span
              className="text-[10px] font-display uppercase tracking-widest"
              style={{ color: holding ? 'hsl(43 70% 65%)' : 'hsl(0 0% 50%)' }}
            >
              {holding ? 'Segure...' : 'Levantar-se'}
            </span>
          </button>
        </div>
      )}

      {/* Hint */}
      {!risen && !holding && (
        <p
          className="text-[9px] mt-4 uppercase tracking-[0.2em] font-display"
          style={{ color: 'hsl(0 0% 35%)' }}
        >
          Segure por 3 segundos
        </p>
      )}
    </div>
  );
};

export default EpicDefeatScreen;
