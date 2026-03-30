// River of Death — final boss encounter before the Celestial City
// Faithful to Bunyan: the river has no bridge, only faith sustains
import { useEffect, useState, useRef } from 'react';
import { characterImages } from '@/data/characterImages';
import { playVictory, playNegativeEvent, playChallengeEvent } from './BoardSounds';

interface RiverOfDeathProps {
  playerName: string;
  onResult: (passed: boolean) => void;
}

const RIVER_PHASES = [
  { text: 'As águas negras do Rio da Morte se abrem diante de você...', emoji: '🌊', duration: 2500 },
  { text: 'Não há ponte. Não há barco. A correnteza é feroz.', emoji: '💀', duration: 2500 },
  { text: 'A água sobe até o peito... até o pescoço...', emoji: '😰', duration: 2500 },
  { text: '«Quando passares pelas águas, eu serei contigo!»', emoji: '✝️', duration: 3000 },
];

export default function RiverOfDeath({ playerName, onResult }: RiverOfDeathProps) {
  const [phase, setPhase] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [result, setResult] = useState<'win' | 'fail' | null>(null);
  const timerRef = useRef<number | null>(null);
  const TAP_GOAL = 15;

  // Progress through narrative phases
  useEffect(() => {
    playChallengeEvent();
    let elapsed = 0;
    const timers: number[] = [];
    RIVER_PHASES.forEach((p, i) => {
      if (i > 0) {
        elapsed += RIVER_PHASES[i - 1].duration;
        timers.push(window.setTimeout(() => setPhase(i), elapsed));
      }
    });
    const totalNarrative = RIVER_PHASES.reduce((s, p) => s + p.duration, 0);
    timers.push(window.setTimeout(() => setShowChallenge(true), totalNarrative));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Countdown timer for challenge
  useEffect(() => {
    if (!showChallenge || result) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setResult('fail');
          playNegativeEvent();
          if (navigator.vibrate) navigator.vibrate([200, 100, 300]);
          setTimeout(() => onResult(false), 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showChallenge, result]);

  const handleTap = () => {
    if (result) return;
    const newTaps = taps + 1;
    setTaps(newTaps);
    if (navigator.vibrate) navigator.vibrate(20);
    if (newTaps >= TAP_GOAL) {
      if (timerRef.current) clearInterval(timerRef.current);
      setResult('win');
      playVictory();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100, 50, 200]);
      setTimeout(() => onResult(true), 3500);
    }
  };

  const charImg = characterImages['esperanca'] || null;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center overflow-hidden">
      {/* Dark water background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, hsl(210 30% 5%), hsl(210 40% 8%), hsl(210 20% 3%))',
      }}>
        {/* Animated water waves */}
        <div className="absolute inset-0 opacity-30" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(30,80,120,0.3) 40px, rgba(30,80,120,0.3) 42px)',
          animation: 'waterFlow 3s linear infinite',
        }} />
      </div>

      {/* Character silhouette */}
      {charImg && (
        <div className="absolute left-0 bottom-0 w-40 h-64 opacity-15 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, black 40%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent)',
          }}
        >
          <img src={charImg} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-sm px-6 text-center space-y-5">
        {/* Title */}
        <h2 className="text-2xl font-display font-bold"
          style={{ color: 'hsl(210 50% 70%)', textShadow: '0 0 30px rgba(40,100,180,0.4)' }}
        >
          🌊 O Rio da Morte
        </h2>
        <p className="text-xs font-display" style={{ color: 'hsl(210 30% 55%)' }}>
          {playerName} enfrenta a travessia final
        </p>

        {/* Narrative phases */}
        {!showChallenge && (
          <div className="min-h-[100px] flex flex-col items-center justify-center gap-3">
            <div className="text-5xl" style={{
              animation: 'shake 0.3s infinite alternate',
              filter: 'drop-shadow(0 0 20px rgba(40,100,180,0.5))',
            }}>
              {RIVER_PHASES[phase].emoji}
            </div>
            <p className="text-base font-display leading-relaxed animate-fade-in"
              style={{ color: 'hsl(0 0% 80%)', textShadow: '0 0 10px rgba(100,150,200,0.3)' }}
            >
              {RIVER_PHASES[phase].text}
            </p>
          </div>
        )}

        {/* Tap challenge */}
        {showChallenge && !result && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm font-display font-bold" style={{ color: 'hsl(45 70% 70%)' }}>
              ✝️ Clame pela fé! Toque rápido para atravessar!
            </p>

            {/* Progress bar */}
            <div className="w-full h-4 rounded-full overflow-hidden" style={{
              background: 'hsl(210 30% 12%)',
              border: '1px solid hsl(210 40% 30%)',
            }}>
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${(taps / TAP_GOAL) * 100}%`,
                  background: 'linear-gradient(90deg, hsl(210 60% 45%), hsl(45 70% 55%))',
                  boxShadow: '0 0 15px hsl(45 70% 55% / 0.5)',
                }}
              />
            </div>
            <p className="text-xs" style={{ color: 'hsl(210 30% 55%)' }}>
              {taps}/{TAP_GOAL} toques · ⏱ {timeLeft}s
            </p>

            {/* Tap button */}
            <button
              onClick={handleTap}
              className="w-40 h-40 rounded-full mx-auto flex items-center justify-center text-5xl active:scale-90 transition-transform"
              style={{
                background: 'radial-gradient(circle, hsl(210 50% 25%), hsl(210 40% 12%))',
                border: '3px solid hsl(210 50% 45%)',
                boxShadow: `0 0 ${30 + taps * 3}px hsl(210 50% 45% / ${0.3 + taps * 0.03})`,
              }}
            >
              🌊
            </button>
          </div>
        )}

        {/* Result */}
        {result === 'win' && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-6xl" style={{
              filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.6))',
              animation: 'bounce 1s infinite',
            }}>
              ✨
            </div>
            <h3 className="text-2xl font-display font-bold" style={{
              color: 'hsl(45 80% 70%)', textShadow: '0 0 30px rgba(255,215,0,0.5)',
            }}>
              Você atravessou!
            </h3>
            <p className="text-sm" style={{ color: 'hsl(45 50% 60%)' }}>
              As águas se abriram pela fé. A Cidade Celestial brilha!
            </p>
          </div>
        )}

        {result === 'fail' && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-6xl" style={{
              filter: 'drop-shadow(0 0 30px rgba(150,30,30,0.5))',
              animation: 'shake 0.3s infinite alternate',
            }}>
              🌊
            </div>
            <h3 className="text-2xl font-display font-bold" style={{
              color: 'hsl(0 60% 65%)', textShadow: '0 0 20px rgba(200,40,40,0.4)',
            }}>
              As águas te venceram...
            </h3>
            <p className="text-sm" style={{ color: 'hsl(0 30% 55%)' }}>
              Você recua, mas a fé ainda te sustenta. Tente novamente.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes waterFlow {
          0% { transform: translateY(0); }
          100% { transform: translateY(42px); }
        }
        @keyframes shake {
          0% { transform: translateX(-2px) rotate(-1deg); }
          100% { transform: translateX(2px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}
