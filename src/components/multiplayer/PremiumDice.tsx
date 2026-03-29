import { useState, useEffect, useRef } from 'react';
import { playDiceRoll, playDiceLand, playTurnStart } from './BoardSounds';

interface PremiumDiceProps {
  onRoll: (value?: number) => void;
  disabled: boolean;
  isMyTurn: boolean;
}

const DICE_DOTS: Record<number, number[][]> = {
  1: [[1,1]],
  2: [[0,0],[2,2]],
  3: [[0,0],[1,1],[2,2]],
  4: [[0,0],[0,2],[2,0],[2,2]],
  5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
  6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
};

export default function PremiumDice({ onRoll, disabled, isMyTurn }: PremiumDiceProps) {
  const [rolling, setRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);
  const [finalValue, setFinalValue] = useState<number | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualValue, setManualValue] = useState('');
  const diceRef = useRef<HTMLDivElement>(null);
  const hasPlayedTurnSound = useRef(false);

  useEffect(() => {
    if (isMyTurn && !disabled && !hasPlayedTurnSound.current) {
      playTurnStart();
      hasPlayedTurnSound.current = true;
    }
    if (!isMyTurn) hasPlayedTurnSound.current = false;
  }, [isMyTurn, disabled]);

  const handleRoll = () => {
    if (disabled || rolling) return;
    setRolling(true);
    setFinalValue(null);
    playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      setCurrentValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 14) {
        clearInterval(interval);
        const result = Math.floor(Math.random() * 6) + 1;
        setCurrentValue(result);
        setFinalValue(result);
        setRolling(false);
        playDiceLand();
        setTimeout(() => onRoll(result), 300);
      }
    }, 70);
  };

  const handleManualSubmit = () => {
    const val = parseInt(manualValue);
    if (val >= 1 && val <= 6) {
      setCurrentValue(val);
      setFinalValue(val);
      playDiceLand();
      setTimeout(() => onRoll(val), 200);
      setManualValue('');
      setShowManual(false);
    }
  };

  const dots = DICE_DOTS[currentValue] || DICE_DOTS[1];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3D Dice */}
      <div className="relative" style={{ perspective: '600px' }}>
        <button
          ref={diceRef}
          onClick={handleRoll}
          disabled={disabled || rolling}
          className={`relative w-24 h-24 rounded-2xl transition-all duration-300
            ${isMyTurn && !disabled
              ? 'cursor-pointer hover:scale-110 active:scale-95'
              : 'cursor-not-allowed opacity-40'
            }
          `}
          style={{
            background: isMyTurn && !disabled
              ? 'linear-gradient(145deg, hsl(38 35% 22%), hsl(30 25% 15%))'
              : 'linear-gradient(145deg, hsl(30 10% 18%), hsl(30 10% 12%))',
            boxShadow: isMyTurn && !disabled
              ? `0 8px 32px rgba(0,0,0,0.5), 
                 inset 0 1px 0 hsl(40 40% 30%),
                 0 0 40px hsl(40 60% 55% / 0.15)`
              : '0 4px 16px rgba(0,0,0,0.3)',
            border: `2px solid ${isMyTurn && !disabled ? 'hsl(40 50% 35%)' : 'hsl(30 10% 22%)'}`,
            transform: rolling
              ? `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`
              : finalValue
              ? 'rotateX(0deg) rotateY(0deg) scale(1.05)'
              : 'rotateX(-5deg) rotateY(5deg)',
            transition: rolling ? 'transform 0.07s linear' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Dice face dots */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const hasDot = dots.some(d => d[0] === row && d[1] === col);
              return (
                <div key={i} className="flex items-center justify-center">
                  {hasDot && (
                    <div
                      className="rounded-full"
                      style={{
                        width: '10px',
                        height: '10px',
                        background: isMyTurn
                          ? 'radial-gradient(circle at 35% 35%, hsl(40 70% 65%), hsl(40 50% 40%))'
                          : 'radial-gradient(circle at 35% 35%, hsl(30 10% 50%), hsl(30 10% 30%))',
                        boxShadow: isMyTurn
                          ? '0 1px 3px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.2)'
                          : '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Shine overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
            }}
          />
        </button>

        {/* Glow effect when it's your turn */}
        {isMyTurn && !disabled && (
          <div
            className="absolute -inset-3 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(40 60% 55% / 0.12) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Status text */}
      {isMyTurn && !disabled && (
        <div className="text-center space-y-1">
          <p className="text-sm text-primary font-display" style={{ animation: 'pulse 2s infinite' }}>
            Sua vez!
          </p>
          <p className="text-[10px] text-muted-foreground">Toque no dado para jogar</p>
        </div>
      )}

      {!isMyTurn && !disabled && (
        <p className="text-xs text-muted-foreground">Aguarde sua vez...</p>
      )}

      {/* Final value flash */}
      {finalValue && !rolling && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 border border-primary/20">
          <span className="text-lg font-display text-primary">{finalValue}</span>
          <span className="text-xs text-muted-foreground">· {finalValue === 1 ? 'casa' : 'casas'}</span>
        </div>
      )}

      {/* Manual dice toggle */}
      {isMyTurn && !disabled && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground underline"
          >
            {showManual ? 'Usar dado virtual' : 'Usar dado físico'}
          </button>
          {showManual && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="6"
                value={manualValue}
                onChange={e => setManualValue(e.target.value)}
                placeholder="1-6"
                className="w-14 h-9 rounded-lg bg-card border border-border text-center text-sm text-foreground"
              />
              <button
                onClick={handleManualSubmit}
                className="px-3 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
