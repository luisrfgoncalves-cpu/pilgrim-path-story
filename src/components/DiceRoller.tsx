import { useState } from 'react';
import { Dices } from 'lucide-react';

interface DiceRollerProps {
  onRoll: (value?: number) => void;
  disabled: boolean;
  isMyTurn: boolean;
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function DiceRoller({ onRoll, disabled, isMyTurn }: DiceRollerProps) {
  const [rolling, setRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState<number | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualValue, setManualValue] = useState('');

  const handleRoll = () => {
    if (disabled || rolling) return;
    setRolling(true);

    // Animate dice
    let count = 0;
    const interval = setInterval(() => {
      setCurrentFace(Math.floor(Math.random() * 6));
      count++;
      if (count >= 12) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setCurrentFace(finalValue - 1);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 80);
  };

  const handleManualSubmit = () => {
    const val = parseInt(manualValue);
    if (val >= 1 && val <= 6) {
      setCurrentFace(val - 1);
      onRoll(val);
      setManualValue('');
      setShowManual(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dice display */}
      <button
        onClick={handleRoll}
        disabled={disabled || rolling}
        className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl transition-all
          ${rolling ? 'animate-bounce' : ''}
          ${isMyTurn && !disabled ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 cursor-pointer' : 'bg-muted text-muted-foreground cursor-not-allowed'}
        `}
      >
        {currentFace !== null ? DICE_FACES[currentFace] : <Dices className="w-8 h-8" />}
      </button>

      {isMyTurn && !disabled && (
        <p className="text-xs text-primary font-medium animate-pulse">Sua vez! Toque no dado 🎲</p>
      )}

      {!isMyTurn && !disabled && (
        <p className="text-xs text-muted-foreground">Aguarde sua vez...</p>
      )}

      {/* Manual input toggle */}
      {isMyTurn && !disabled && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-[10px] text-muted-foreground underline hover:text-foreground"
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
