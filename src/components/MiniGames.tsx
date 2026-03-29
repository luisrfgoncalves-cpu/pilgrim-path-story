import { useState, useEffect, useCallback, useRef } from 'react';
import { ChoiceEffect } from '@/data/story';
import { Dice3D } from '@/components/Dice3D';

/**
 * 4 Active Gameplay Mechanics:
 * 1. QTE (Quick-Time Events) — tap targets before they vanish
 * 2. SwipeDodge — dodge temptations, accept blessings
 * 3. MemorySequence — memorize and repeat symbol patterns
 * 4. StealthTiming — tap in the safe zone to advance
 */

// ═══════════════════════════════════════════
// Shared types
// ═══════════════════════════════════════════

export type MiniGameType = 'qte' | 'swipe' | 'memory' | 'stealth' | 'diceduel' | 'treasure' | 'reflex' | 'wordpuzzle' | 'pathchoice';

export interface MiniGameConfig {
  type: MiniGameType;
  difficulty?: 'easy' | 'normal' | 'hard';
  /** Narrative context shown before the mini-game */
  intro: string;
  /** Bonus on success */
  successBonus: ChoiceEffect;
  /** Penalty on failure */
  failurePenalty: ChoiceEffect;
  /** Custom items for swipe game */
  swipeItems?: { text: string; emoji: string; good: boolean }[];
  /** Custom symbols for memory game */
  memorySymbols?: string[];
  /** Enemy config for dice duel */
  duelEnemy?: { name: string; emoji: string; power: number };
  /** Hidden treasures for treasure hunt */
  treasures?: { emoji: string; label: string; bonus: ChoiceEffect }[];
  /** Reflex directions config */
  reflexSpeed?: number;
}

export interface MiniGameResult {
  success: boolean;
  score: number; // 0-100
  effects: ChoiceEffect;
}

interface MiniGameProps {
  config: MiniGameConfig;
  onComplete: (result: MiniGameResult) => void;
}

// ═══════════════════════════════════════════
// 1. QTE — Quick-Time Events
// ═══════════════════════════════════════════

interface QTETarget {
  id: number;
  x: number;
  y: number;
  symbol: string;
  timeLeft: number;
}

const QTE_SYMBOLS = ['⚔️', '🛡️', '🔥', '✝️', '⚡', '🗡️', '💫', '🌟'];

function QTEGame({ config, onComplete }: MiniGameProps) {
  const diff = config.difficulty || 'normal';
  const maxTargets = diff === 'easy' ? 8 : diff === 'hard' ? 15 : 10;
  const spawnInterval = diff === 'easy' ? 1200 : diff === 'hard' ? 700 : 900;
  const targetLifespan = diff === 'easy' ? 2500 : diff === 'hard' ? 1400 : 1800;

  const [targets, setTargets] = useState<QTETarget[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [spawned, setSpawned] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const nextId = useRef(0);

  // Spawn targets
  useEffect(() => {
    if (phase !== 'playing' || spawned >= maxTargets) return;
    const timer = setTimeout(() => {
      const id = nextId.current++;
      setTargets(prev => [...prev, {
        id,
        x: 10 + Math.random() * 75,
        y: 15 + Math.random() * 60,
        symbol: QTE_SYMBOLS[Math.floor(Math.random() * QTE_SYMBOLS.length)],
        timeLeft: targetLifespan,
      }]);
      setSpawned(s => s + 1);
    }, spawnInterval);
    return () => clearTimeout(timer);
  }, [phase, spawned, maxTargets, spawnInterval, targetLifespan]);

  // Decay targets
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      setTargets(prev => {
        const next = prev.map(t => ({ ...t, timeLeft: t.timeLeft - 50 }));
        const expired = next.filter(t => t.timeLeft <= 0);
        if (expired.length > 0) setMisses(m => m + expired.length);
        return next.filter(t => t.timeLeft > 0);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  // End game
  useEffect(() => {
    if (phase === 'playing' && spawned >= maxTargets && targets.length === 0) {
      setPhase('result');
    }
  }, [phase, spawned, maxTargets, targets.length]);

  const hitTarget = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(s => s + 1);
  };

  const finalScore = maxTargets > 0 ? Math.round((score / maxTargets) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="game-card text-center space-y-4 animate-scale-in">
        <div className="text-5xl" style={{ filter: 'drop-shadow(0 0 12px hsl(40 60% 50% / 0.5))' }}>⚔️</div>
        <h3 className="game-title">Reflexos de Batalha</h3>
        <p className="game-subtitle">{config.intro}</p>
        <p className="game-text-muted">Toque nos alvos antes que desapareçam!</p>
        <button onClick={() => setPhase('playing')} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="game-card text-center space-y-4 animate-scale-in">
        <div className="text-5xl" style={{ filter: `drop-shadow(0 0 15px ${success ? 'hsl(40 70% 50% / 0.5)' : 'hsl(0 60% 50% / 0.4)'})` }}>{success ? '🏆' : '💔'}</div>
        <h3 className="game-title">
          {success ? 'Vitória!' : 'Derrotado...'}
        </h3>
        <p className="game-subtitle">
          Acertou {score} de {maxTargets} alvos ({finalScore}%)
        </p>
        <div className="game-progress-bar">
          <div
            className={success ? 'game-progress-fill-success' : 'game-progress-fill-fail'}
            style={{ width: `${finalScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{
      height: '300px',
      background: 'linear-gradient(180deg, hsl(0 30% 10%) 0%, hsl(30 20% 8%) 100%)',
      border: '3px solid hsl(40 60% 45%)',
      boxShadow: '0 0 20px hsl(40 60% 40% / 0.15)',
    }}>
      {/* Score HUD */}
      <div className="absolute top-2 left-3 right-3 flex justify-between z-10">
        <span className="game-hud-tag">✓ {score}</span>
        <span className="game-hud-tag">{spawned}/{maxTargets}</span>
        <span className="game-hud-tag" style={{ borderColor: 'hsl(0 50% 40%)', color: 'hsl(0 60% 65%)' }}>✗ {misses}</span>
      </div>

      {/* Targets */}
      {targets.map(t => {
        const opacity = Math.min(1, t.timeLeft / 500);
        const scale = t.timeLeft < 400 ? 0.7 : 1;
        return (
          <button
            key={t.id}
            onClick={() => hitTarget(t.id)}
            className="absolute transition-all duration-150 active:scale-75"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
              background: 'radial-gradient(circle, hsl(40 60% 30%) 0%, hsl(40 40% 18%) 100%)',
              border: '3px solid hsl(40 70% 55%)',
              boxShadow: '0 0 15px hsl(40 60% 50% / 0.4), inset 0 1px 3px hsl(0 0% 100% / 0.2)',
            }}>
              <span className="text-2xl">{t.symbol}</span>
            </div>
          </button>
        );
      })}

      {/* Pulse background effect */}
      <div className="absolute inset-0 pointer-events-none animate-pulse" style={{
        background: 'radial-gradient(circle at center, hsl(40 60% 40% / 0.05) 0%, transparent 70%)',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════
// 2. SwipeDodge — Dodge temptations
// ═══════════════════════════════════════════

interface FlyingItem {
  id: number;
  text: string;
  emoji: string;
  good: boolean;
  x: number;
  speed: number;
}

const DEFAULT_SWIPE_ITEMS = [
  { text: 'Riqueza fácil', emoji: '💰', good: false },
  { text: 'Prazer vão', emoji: '🍷', good: false },
  { text: 'Fama mundana', emoji: '👑', good: false },
  { text: 'Mentira sutil', emoji: '🐍', good: false },
  { text: 'Atalho tentador', emoji: '🔮', good: false },
  { text: 'Oração', emoji: '🙏', good: true },
  { text: 'Versículo', emoji: '📖', good: true },
  { text: 'Graça', emoji: '✨', good: true },
  { text: 'Compaixão', emoji: '❤️', good: true },
];

function SwipeDodgeGame({ config, onComplete }: MiniGameProps) {
  const items = config.swipeItems || DEFAULT_SWIPE_ITEMS;
  const diff = config.difficulty || 'normal';
  const totalRounds = diff === 'easy' ? 8 : diff === 'hard' ? 15 : 10;
  const itemSpeed = diff === 'easy' ? 3000 : diff === 'hard' ? 1500 : 2200;

  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentItem, setCurrentItem] = useState<FlyingItem | null>(null);
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [itemY, setItemY] = useState(50);
  const dragStartY = useRef(0);
  const nextId = useRef(0);

  // Spawn items
  useEffect(() => {
    if (phase !== 'playing' || round >= totalRounds) {
      if (phase === 'playing' && round >= totalRounds) setPhase('result');
      return;
    }
    if (currentItem) return;

    const timer = setTimeout(() => {
      const item = items[Math.floor(Math.random() * items.length)];
      setCurrentItem({
        id: nextId.current++,
        ...item,
        x: 50,
        speed: itemSpeed,
      });
      setItemY(50);
    }, 600);
    return () => clearTimeout(timer);
  }, [phase, round, currentItem, totalRounds, items, itemSpeed]);

  // Auto-expire item
  useEffect(() => {
    if (!currentItem || phase !== 'playing') return;
    const timer = setTimeout(() => {
      // Didn't act — counts as miss
      setRound(r => r + 1);
      setCurrentItem(null);
      setFeedback('⏳ Tarde demais!');
      setTimeout(() => setFeedback(null), 600);
    }, itemSpeed);
    return () => clearTimeout(timer);
  }, [currentItem, phase, itemSpeed]);

  const handleSwipe = (direction: 'up' | 'down') => {
    if (!currentItem) return;
    const dodged = direction === 'up';
    const correct = (dodged && !currentItem.good) || (!dodged && currentItem.good);

    if (correct) {
      setCorrectCount(c => c + 1);
      setFeedback(dodged ? '🛡️ Esquivou!' : '✨ Aceitou!');
    } else {
      setFeedback(dodged ? '❌ Era bênção!' : '💔 Era tentação!');
    }
    setRound(r => r + 1);
    setCurrentItem(null);
    setTimeout(() => setFeedback(null), 600);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = dragStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 30) {
      handleSwipe(diff > 0 ? 'up' : 'down');
    }
  };

  const finalScore = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">🌪️</div>
        <h3 className="font-display text-xl text-primary">Esquiva de Tentações</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>⬆️ Deslize para <strong>CIMA</strong> para <strong>esquivar</strong> tentações</p>
          <p>⬇️ Deslize para <strong>BAIXO</strong> para <strong>aceitar</strong> bênçãos</p>
        </div>
        <button onClick={() => setPhase('playing')} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '🛡️' : '😔'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Resistiu com firmeza!' : 'As tentações prevaleceram...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Acertou {correctCount} de {totalRounds} ({finalScore}%)
        </p>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-card/50 border-2 border-primary/20 rounded-2xl overflow-hidden select-none"
      style={{ height: '250px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD */}
      <div className="absolute top-2 left-3 right-3 flex justify-between z-10">
        <span className="text-xs font-display text-primary bg-card/80 px-2 py-1 rounded-lg">
          ✓ {correctCount}
        </span>
        <span className="text-xs font-display text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">
          {round}/{totalRounds}
        </span>
      </div>

      {/* Direction hints */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs text-primary/40 font-display">⬆️ Esquivar</div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-primary/40 font-display">⬇️ Aceitar</div>

      {/* Current item */}
      {currentItem && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-scale-in">
          <div className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 ${
            currentItem.good
              ? 'border-primary/50 bg-primary/10'
              : 'border-destructive/50 bg-destructive/10'
          }`}>
            <span className="text-4xl">{currentItem.emoji}</span>
            <span className="text-sm font-display text-foreground">{currentItem.text}</span>
          </div>
        </div>
      )}

      {/* Desktop buttons */}
      {currentItem && (
        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
          <button
            onClick={() => handleSwipe('up')}
            className="flex-1 py-2 rounded-xl bg-primary/20 border border-primary/30 text-sm font-display text-primary active:scale-95"
          >
            ⬆️ Esquivar
          </button>
          <button
            onClick={() => handleSwipe('down')}
            className="flex-1 py-2 rounded-xl bg-primary/20 border border-primary/30 text-sm font-display text-primary active:scale-95"
          >
            ⬇️ Aceitar
          </button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <span className="text-2xl font-display text-foreground bg-card/90 px-4 py-2 rounded-xl animate-fade-in">
            {feedback}
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// 3. MemorySequence — Memorize symbols
// ═══════════════════════════════════════════

const DEFAULT_SYMBOLS = ['✝️', '🕊️', '🔥', '💧', '⭐', '🗝️', '📖', '🛡️'];

function MemoryGame({ config, onComplete }: MiniGameProps) {
  const symbols = config.memorySymbols || DEFAULT_SYMBOLS;
  const diff = config.difficulty || 'normal';
  const startLen = diff === 'easy' ? 3 : diff === 'hard' ? 4 : 3;
  const maxRounds = diff === 'easy' ? 4 : diff === 'hard' ? 7 : 5;

  const [phase, setPhase] = useState<'intro' | 'showing' | 'input' | 'feedback' | 'result'>('intro');
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(-1);
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const generateSequence = useCallback((length: number) => {
    const seq: string[] = [];
    for (let i = 0; i < length; i++) {
      seq.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return seq;
  }, [symbols]);

  const startRound = useCallback(() => {
    const len = startLen + round;
    const seq = generateSequence(len);
    setSequence(seq);
    setPlayerInput([]);
    setPhase('showing');
    setCurrentShowIndex(-1);
  }, [round, startLen, generateSequence]);

  // Show sequence animation
  useEffect(() => {
    if (phase !== 'showing') return;
    if (currentShowIndex >= sequence.length - 1) {
      const timer = setTimeout(() => {
        setPhase('input');
        setCurrentShowIndex(-1);
      }, 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setCurrentShowIndex(i => i + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [phase, currentShowIndex, sequence.length]);

  const handleSymbolTap = (symbol: string) => {
    if (phase !== 'input') return;
    const newInput = [...playerInput, symbol];
    setPlayerInput(newInput);

    const idx = newInput.length - 1;
    if (newInput[idx] !== sequence[idx]) {
      // Wrong!
      setFeedbackText('❌ Sequência errada!');
      setPhase('feedback');
      setTimeout(() => {
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound >= maxRounds) {
          setPhase('result');
        } else {
          startRound();
        }
      }, 1200);
      return;
    }

    if (newInput.length === sequence.length) {
      // Correct!
      setWins(w => w + 1);
      setFeedbackText('✨ Correto!');
      setPhase('feedback');
      setTimeout(() => {
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound >= maxRounds) {
          setPhase('result');
        } else {
          startRound();
        }
      }, 1200);
    }
  };

  const finalScore = maxRounds > 0 ? Math.round((wins / maxRounds) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">🧠</div>
        <h3 className="font-display text-xl text-primary">Sequência de Memória</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <p className="text-xs text-muted-foreground">Memorize a sequência de símbolos e repita na ordem correta!</p>
        <button onClick={() => { setPhase('showing'); startRound(); }} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '🧠' : '😵'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Mente afiada!' : 'A memória falhou...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Acertou {wins} de {maxRounds} rodadas ({finalScore}%)
        </p>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 border-2 border-primary/20 rounded-2xl p-4 space-y-4">
      {/* HUD */}
      <div className="flex justify-between text-xs font-display">
        <span className="text-primary bg-card/80 px-2 py-1 rounded-lg">Rodada {round + 1}/{maxRounds}</span>
        <span className="text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">✓ {wins}</span>
      </div>

      {/* Showing phase */}
      {phase === 'showing' && (
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground font-display">Memorize...</p>
          <div className="flex justify-center gap-2 flex-wrap min-h-[60px] items-center">
            {sequence.map((s, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                  i <= currentShowIndex
                    ? 'border-primary bg-primary/20 scale-110'
                    : 'border-border bg-card opacity-30 scale-90'
                }`}
              >
                <span className="text-xl">{i <= currentShowIndex ? s : '?'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input phase */}
      {phase === 'input' && (
        <div className="text-center space-y-3">
          <p className="text-sm text-primary font-display">Sua vez! Repita a sequência</p>
          {/* Progress */}
          <div className="flex justify-center gap-2 min-h-[40px] items-center">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                  i < playerInput.length
                    ? 'border-primary bg-primary/20'
                    : 'border-border bg-card/50'
                }`}
              >
                <span className="text-lg">{i < playerInput.length ? playerInput[i] : '·'}</span>
              </div>
            ))}
          </div>
          {/* Symbol buttons */}
          <div className="grid grid-cols-4 gap-2">
            {symbols.slice(0, 8).map((s, i) => (
              <button
                key={i}
                onClick={() => handleSymbolTap(s)}
                className="w-full py-3 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/10 active:scale-90 transition-all"
              >
                <span className="text-xl">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {phase === 'feedback' && (
        <div className="text-center py-6 animate-scale-in">
          <span className="text-2xl font-display">{feedbackText}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// 4. StealthTiming — Tap in the safe zone
// ═══════════════════════════════════════════

function StealthGame({ config, onComplete }: MiniGameProps) {
  const diff = config.difficulty || 'normal';
  const totalAttempts = diff === 'easy' ? 5 : diff === 'hard' ? 8 : 6;
  const safeZoneSize = diff === 'easy' ? 30 : diff === 'hard' ? 15 : 22;
  const speed = diff === 'easy' ? 2000 : diff === 'hard' ? 1000 : 1500;

  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [indicator, setIndicator] = useState(0); // 0-100
  const [safeStart, setSafeStart] = useState(35);
  const [attempt, setAttempt] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const animRef = useRef<number>();

  // Animate indicator
  useEffect(() => {
    if (phase !== 'playing') return;
    let pos = indicator;
    let dir = direction;
    const step = () => {
      pos += dir * (100 / (speed / 16));
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      setIndicator(pos);
      setDirection(dir);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [phase, attempt]); // restart animation each attempt

  const handleTap = () => {
    if (phase !== 'playing' || feedback) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const inSafe = indicator >= safeStart && indicator <= safeStart + safeZoneSize;
    if (inSafe) {
      setSuccesses(s => s + 1);
      setFeedback('🤫 Passou!');
    } else {
      setFeedback('⚠️ Detectado!');
    }

    setTimeout(() => {
      setFeedback(null);
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);
      if (nextAttempt >= totalAttempts) {
        setPhase('result');
      } else {
        // Randomize safe zone
        setSafeStart(10 + Math.random() * (80 - safeZoneSize));
        setIndicator(0);
        setDirection(1);
      }
    }, 800);
  };

  const finalScore = totalAttempts > 0 ? Math.round((successes / totalAttempts) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">🤫</div>
        <h3 className="font-display text-xl text-primary">Furtividade</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <p className="text-xs text-muted-foreground">Toque quando o indicador estiver na zona segura (verde)!</p>
        <button onClick={() => setPhase('playing')} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '🤫' : '🚨'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Passou despercebido!' : 'Foi descoberto...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Conseguiu {successes} de {totalAttempts} passagens ({finalScore}%)
        </p>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 border-2 border-primary/20 rounded-2xl p-4 space-y-4">
      {/* HUD */}
      <div className="flex justify-between text-xs font-display">
        <span className="text-primary bg-card/80 px-2 py-1 rounded-lg">Passagem {attempt + 1}/{totalAttempts}</span>
        <span className="text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">✓ {successes}</span>
      </div>

      {/* Timing bar */}
      <div className="relative h-12 bg-secondary/50 rounded-xl overflow-hidden border-2 border-border">
        {/* Safe zone */}
        <div
          className="absolute top-0 bottom-0 bg-green-500/30 border-x-2 border-green-500/50"
          style={{ left: `${safeStart}%`, width: `${safeZoneSize}%` }}
        />
        {/* Danger zones */}
        <div className="absolute top-0 bottom-0 left-0 bg-destructive/10" style={{ width: `${safeStart}%` }} />
        <div className="absolute top-0 bottom-0 right-0 bg-destructive/10" style={{ left: `${safeStart + safeZoneSize}%` }} />

        {/* Moving indicator */}
        <div
          className="absolute top-1 bottom-1 w-2 bg-foreground rounded-full shadow-lg transition-none"
          style={{ left: `${indicator}%` }}
        />
      </div>

      {/* Tap button */}
      <button
        onClick={handleTap}
        disabled={!!feedback}
        className="w-full py-5 rounded-xl border-3 border-primary/40 bg-card text-lg font-display text-primary active:scale-95 active:bg-primary/10 transition-all disabled:opacity-50"
        style={{
          boxShadow: '0 4px 0 0 hsl(30 15% 10%), 0 5px 10px hsl(0 0% 0% / 0.2)',
        }}
      >
        {feedback || '👆 TOQUE AGORA'}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════
// 5. DiceDuel — Spiritual dice combat
// ═══════════════════════════════════════════

interface DiceState {
  player: number;
  enemy: number;
  rolling: boolean;
}

function DiceDuelGame({ config, onComplete }: MiniGameProps) {
  const enemy = config.duelEnemy || { name: 'Inimigo', emoji: '👹', power: 5 };
  const diff = config.difficulty || 'normal';
  const totalRounds = diff === 'easy' ? 5 : diff === 'hard' ? 8 : 6;
  const maxHP = diff === 'easy' ? 12 : diff === 'hard' ? 8 : 10;

  const [phase, setPhase] = useState<'intro' | 'choose' | 'rolling' | 'result' | 'final'>('intro');
  const [round, setRound] = useState(0);
  const [playerHP, setPlayerHP] = useState(maxHP);
  const [enemyHP, setEnemyHP] = useState(maxHP);
  const [dice, setDice] = useState<DiceState>({ player: 1, enemy: 1, rolling: false });
  const [action, setAction] = useState<'attack' | 'defend' | 'pray' | null>(null);
  const [roundLog, setRoundLog] = useState('');
  const [combo, setCombo] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [criticalHit, setCriticalHit] = useState(false);
  const rollInterval = useRef<ReturnType<typeof setInterval>>();

  const rollDice = (chosenAction: 'attack' | 'defend' | 'pray') => {
    setAction(chosenAction);
    setPhase('rolling');
    setDice({ player: 1, enemy: 1, rolling: true });

    // Animate dice
    let ticks = 0;
    rollInterval.current = setInterval(() => {
      setDice({
        player: Math.ceil(Math.random() * 6),
        enemy: Math.ceil(Math.random() * 6),
        rolling: true,
      });
      ticks++;
      if (ticks >= 15) {
        if (rollInterval.current) clearInterval(rollInterval.current);
        // Final rolls
        const pRoll = Math.ceil(Math.random() * 6);
        const eRoll = Math.ceil(Math.random() * 6);
        setDice({ player: pRoll, enemy: eRoll, rolling: false });
        resolveCombat(pRoll, eRoll, chosenAction);
      }
    }, 100);
  };

  const resolveCombat = (pRoll: number, eRoll: number, act: 'attack' | 'defend' | 'pray') => {
    let pDmg = 0;
    let eDmg = 0;
    let log = '';
    let isCrit = false;

    // Combo bonus: same action 2+ times in a row
    const comboMultiplier = (lastAction === act) ? 1 + combo * 0.15 : 1;
    if (lastAction === act) {
      setCombo(c => c + 1);
    } else {
      setCombo(0);
    }
    setLastAction(act);

    if (act === 'attack') {
      if (pRoll >= eRoll) {
        eDmg = Math.ceil(pRoll * comboMultiplier);
        isCrit = pRoll === 6;
        if (isCrit) {
          eDmg = Math.ceil(eDmg * 1.5);
          log = `🌟 CRÍTICO! Ataque devastador! ${eDmg} de dano!`;
        } else {
          log = `⚔️ Ataque certeiro! ${eDmg} de dano no inimigo!`;
        }
      } else {
        pDmg = Math.ceil(eRoll / 2);
        log = `💥 Contra-ataque! Você sofreu ${pDmg} de dano.`;
      }
    } else if (act === 'defend') {
      const incoming = eRoll;
      const blocked = Math.min(incoming, Math.ceil(pRoll * comboMultiplier));
      pDmg = Math.max(0, incoming - blocked);
      if (pDmg === 0) {
        log = `🛡️ Defesa perfeita! Bloqueou todo o dano!`;
        if (pRoll === 6) {
          eDmg = 2;
          log += ` Ripostou ${eDmg}!`;
          isCrit = true;
        }
      } else {
        log = `🛡️ Bloqueou ${blocked}, mas sofreu ${pDmg}.`;
      }
    } else {
      const heal = Math.ceil(pRoll * comboMultiplier / 2);
      setPlayerHP(h => Math.min(maxHP, h + heal));
      if (pRoll >= 5) {
        eDmg = Math.ceil((pRoll - 2) * comboMultiplier);
        isCrit = pRoll === 6;
        log = `🙏 Oração poderosa! Curou ${heal} e causou ${eDmg} de dano espiritual!`;
      } else {
        log = `🙏 Oração suave. Curou ${heal} pontos.`;
      }
    }

    setCriticalHit(isCrit);
    if (combo >= 2) log += ` 🔥Combo x${combo + 1}!`;

    setPlayerHP(h => Math.max(0, h - pDmg));
    setEnemyHP(h => Math.max(0, h - eDmg));
    setRoundLog(log);
    setRound(r => r + 1);

    setTimeout(() => {
      setCriticalHit(false);
      setPhase(round + 1 >= totalRounds || playerHP - pDmg <= 0 || enemyHP - eDmg <= 0 ? 'final' : 'choose');
      setAction(null);
    }, 2500);
  };

  useEffect(() => {
    return () => { if (rollInterval.current) clearInterval(rollInterval.current); };
  }, []);

  const success = enemyHP <= 0 || (playerHP > 0 && playerHP > enemyHP);
  const finalScore = Math.round((Math.max(0, playerHP) / maxHP) * 100);

  useEffect(() => {
    if (phase === 'final') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const diceEmoji = (n: number) => ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][n - 1] || '⚀';

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-5xl">{enemy.emoji}</div>
        <h3 className="font-display text-xl text-primary">Duelo Espiritual</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>⚔️ <strong>Atacar</strong> — dano alto, risco de contra-ataque</p>
          <p>🛡️ <strong>Defender</strong> — bloqueia dano inimigo</p>
          <p>🙏 <strong>Orar</strong> — cura + chance de dano espiritual</p>
        </div>
        <button onClick={() => setPhase('choose')} className="btn-medieval w-full">
          Enfrentar {enemy.name}!
        </button>
      </div>
    );
  }

  if (phase === 'final') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '🏆' : '😢'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? `${enemy.name} foi derrotado!` : `${enemy.name} prevaleceu...`}
        </h3>
        <p className="text-sm text-foreground/80">
          Sua vida: {Math.max(0, playerHP)}/{maxHP} · {enemy.name}: {Math.max(0, enemyHP)}/{maxHP}
        </p>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 space-y-5" style={{
      background: 'linear-gradient(180deg, hsl(0 30% 12%) 0%, hsl(30 20% 10%) 100%)',
      border: '3px solid hsl(40 60% 45%)',
      boxShadow: '0 0 20px hsl(40 60% 40% / 0.2), inset 0 1px 0 hsl(40 60% 60% / 0.1)',
    }}>
      {/* HP bars */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold" style={{ textShadow: '0 0 8px hsl(40 60% 50% / 0.5)' }}>⚔️</span>
          <div className="flex-1 h-5 rounded-full overflow-hidden" style={{
            background: 'hsl(0 0% 8%)',
            border: '2px solid hsl(120 40% 35%)',
            boxShadow: '0 0 8px hsl(120 50% 40% / 0.3)',
          }}>
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${(playerHP / maxHP) * 100}%`,
              background: 'linear-gradient(90deg, hsl(120 60% 35%), hsl(90 70% 45%))',
              boxShadow: 'inset 0 1px 2px hsl(0 0% 100% / 0.3), 0 0 6px hsl(120 60% 45% / 0.4)',
            }} />
          </div>
          <span className="text-sm font-display font-bold min-w-[2rem] text-right" style={{ color: 'hsl(120 60% 55%)' }}>{playerHP}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">{enemy.emoji}</span>
          <div className="flex-1 h-5 rounded-full overflow-hidden" style={{
            background: 'hsl(0 0% 8%)',
            border: '2px solid hsl(0 50% 40%)',
            boxShadow: '0 0 8px hsl(0 60% 45% / 0.3)',
          }}>
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${(enemyHP / maxHP) * 100}%`,
              background: 'linear-gradient(90deg, hsl(0 70% 40%), hsl(350 80% 50%))',
              boxShadow: 'inset 0 1px 2px hsl(0 0% 100% / 0.3), 0 0 6px hsl(0 70% 50% / 0.4)',
            }} />
          </div>
          <span className="text-sm font-display font-bold min-w-[2rem] text-right" style={{ color: 'hsl(0 60% 60%)' }}>{enemyHP}</span>
        </div>
      </div>

      {/* 3D Dice display */}
      {(phase === 'rolling' || roundLog) && (
        <div className="flex items-center justify-center gap-8 py-4">
          <div className="text-center">
            <Dice3D value={dice.player} rolling={dice.rolling} size={72} color="gold" />
            <p className="text-xs font-display font-bold mt-2" style={{ color: 'hsl(40 70% 65%)' }}>Você</p>
          </div>
          <span className="text-2xl font-display font-bold" style={{
            color: 'hsl(0 60% 55%)',
            textShadow: '0 0 12px hsl(0 60% 50% / 0.5)',
          }}>VS</span>
          <div className="text-center">
            <Dice3D value={dice.enemy} rolling={dice.rolling} size={72} color="red" />
            <p className="text-xs font-display font-bold mt-2" style={{ color: 'hsl(0 60% 60%)' }}>{enemy.name}</p>
          </div>
        </div>
      )}

      {/* Critical hit flash */}
      {criticalHit && (
        <div className="text-center animate-pulse">
          <span className="text-2xl font-display font-bold" style={{
            color: 'hsl(40 80% 60%)',
            textShadow: '0 0 20px hsl(40 80% 50% / 0.8)',
          }}>🌟 GOLPE CRÍTICO! 🌟</span>
        </div>
      )}

      {/* Round log */}
      {roundLog && phase === 'choose' && (
        <p className="text-sm text-center font-display rounded-xl px-4 py-3 animate-fade-in" style={{
          background: 'hsl(30 20% 15%)',
          border: '2px solid hsl(40 50% 35%)',
          color: 'hsl(40 50% 80%)',
          boxShadow: '0 0 10px hsl(40 50% 30% / 0.2)',
        }}>{roundLog}</p>
      )}

      {/* Action buttons */}
      {phase === 'choose' && (
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => rollDice('attack')}
            className="py-5 rounded-xl transition-all active:scale-90 text-center" style={{
              background: 'linear-gradient(180deg, hsl(0 40% 25%) 0%, hsl(0 35% 18%) 100%)',
              border: '3px solid hsl(0 50% 45%)',
              boxShadow: '0 4px 0 0 hsl(0 40% 15%), 0 0 12px hsl(0 50% 40% / 0.3)',
            }}>
            <span className="text-3xl block">⚔️</span>
            <span className="text-xs font-display font-bold block mt-1" style={{ color: 'hsl(0 60% 70%)' }}>Atacar</span>
          </button>
          <button onClick={() => rollDice('defend')}
            className="py-5 rounded-xl transition-all active:scale-90 text-center" style={{
              background: 'linear-gradient(180deg, hsl(220 40% 25%) 0%, hsl(220 35% 18%) 100%)',
              border: '3px solid hsl(220 50% 50%)',
              boxShadow: '0 4px 0 0 hsl(220 40% 15%), 0 0 12px hsl(220 50% 45% / 0.3)',
            }}>
            <span className="text-3xl block">🛡️</span>
            <span className="text-xs font-display font-bold block mt-1" style={{ color: 'hsl(220 60% 70%)' }}>Defender</span>
          </button>
          <button onClick={() => rollDice('pray')}
            className="py-5 rounded-xl transition-all active:scale-90 text-center" style={{
              background: 'linear-gradient(180deg, hsl(40 40% 25%) 0%, hsl(40 35% 18%) 100%)',
              border: '3px solid hsl(40 60% 50%)',
              boxShadow: '0 4px 0 0 hsl(40 40% 15%), 0 0 12px hsl(40 60% 45% / 0.3)',
            }}>
            <span className="text-3xl block">🙏</span>
            <span className="text-xs font-display font-bold block mt-1" style={{ color: 'hsl(40 70% 70%)' }}>Orar</span>
          </button>
        </div>
      )}

      {phase === 'rolling' && (
        <p className="text-center text-lg font-display font-bold animate-pulse" style={{
          color: 'hsl(40 70% 60%)',
          textShadow: '0 0 10px hsl(40 70% 50% / 0.5)',
        }}>⚡ Rolando dados... ⚡</p>
      )}

      <p className="text-xs text-center font-display font-bold" style={{
        color: 'hsl(40 50% 55%)',
        background: 'hsl(30 15% 12%)',
        border: '1px solid hsl(40 40% 30%)',
        borderRadius: '8px',
        padding: '4px 8px',
      }}>Rodada {Math.min(round + 1, totalRounds)}/{totalRounds}</p>
    </div>
  );
}

// ═══════════════════════════════════════════
// 6. TreasureHunt — Hidden clickable areas
// ═══════════════════════════════════════════

interface HiddenItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  label: string;
  bonus: ChoiceEffect;
  found: boolean;
  hint: boolean;
}

function TreasureHuntGame({ config, onComplete }: MiniGameProps) {
  const defaultTreasures = [
    { emoji: '📜', label: 'Pergaminho antigo', bonus: { discernimento: 1 } },
    { emoji: '🗝️', label: 'Chave dourada', bonus: { fe: 1 } },
    { emoji: '⚗️', label: 'Frasco de cura', bonus: { perseveranca: 1 } },
    { emoji: '💎', label: 'Pedra preciosa', bonus: { coragem: 1 } },
    { emoji: '🕯️', label: 'Vela sagrada', bonus: { fe: 1 } },
  ];
  const treasures = config.treasures || defaultTreasures;
  const timeLimit = config.difficulty === 'easy' ? 20 : config.difficulty === 'hard' ? 10 : 15;

  const [phase, setPhase] = useState<'intro' | 'hunting' | 'result'>('intro');
  const [items, setItems] = useState<HiddenItem[]>([]);
  const [found, setFound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [lastFound, setLastFound] = useState<string | null>(null);

  const initItems = useCallback(() => {
    const placed: HiddenItem[] = treasures.map((t, i) => ({
      id: i,
      x: 8 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      ...t,
      found: false,
      hint: false,
    }));
    setItems(placed);
  }, [treasures]);

  // Timer
  useEffect(() => {
    if (phase !== 'hunting') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Show hints periodically
  useEffect(() => {
    if (phase !== 'hunting') return;
    const hint = setInterval(() => {
      setItems(prev => {
        const unfound = prev.filter(i => !i.found);
        if (unfound.length === 0) return prev;
        const target = unfound[Math.floor(Math.random() * unfound.length)];
        return prev.map(i => i.id === target.id ? { ...i, hint: true } : i);
      });
      // Remove hint after 1s
      setTimeout(() => {
        setItems(prev => prev.map(i => ({ ...i, hint: false })));
      }, 1000);
    }, 3000);
    return () => clearInterval(hint);
  }, [phase]);

  const findItem = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, found: true } : i));
    const item = items.find(i => i.id === id);
    if (item) {
      setFound(f => f + 1);
      setLastFound(`${item.emoji} ${item.label}`);
      setTimeout(() => setLastFound(null), 1500);
    }
    // Check if all found
    if (found + 1 >= treasures.length) {
      setTimeout(() => setPhase('result'), 800);
    }
  };

  const finalScore = treasures.length > 0 ? Math.round((found / treasures.length) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        // Merge all found bonuses
        const mergedEffects: ChoiceEffect = {};
        items.filter(i => i.found).forEach(i => {
          Object.entries(i.bonus).forEach(([k, v]) => {
            (mergedEffects as any)[k] = ((mergedEffects as any)[k] || 0) + (v || 0);
          });
        });
        // Add failure penalty if didn't find enough
        if (!success) {
          Object.entries(config.failurePenalty).forEach(([k, v]) => {
            (mergedEffects as any)[k] = ((mergedEffects as any)[k] || 0) + (v || 0);
          });
        }
        onComplete({ success, score: finalScore, effects: Object.keys(mergedEffects).length > 0 ? mergedEffects : (success ? config.successBonus : config.failurePenalty) });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">🔍</div>
        <h3 className="font-display text-xl text-primary">Caça ao Tesouro</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <p className="text-xs text-muted-foreground">Encontre os tesouros escondidos antes do tempo acabar! Fique atento às dicas ✨</p>
        <button onClick={() => { initItems(); setPhase('hunting'); }} className="btn-medieval w-full">
          Começar a busca!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '🎉' : '😞'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Bela exploração!' : 'Tesouros ficaram para trás...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Encontrou {found} de {treasures.length} tesouros
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {items.map(i => (
            <span key={i.id} className={`text-2xl ${i.found ? '' : 'opacity-20 grayscale'}`}>{i.emoji}</span>
          ))}
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-card/30 border-2 border-primary/20 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
      {/* HUD */}
      <div className="absolute top-2 left-3 right-3 flex justify-between z-10">
        <span className="text-xs font-display text-primary bg-card/80 px-2 py-1 rounded-lg">
          🔍 {found}/{treasures.length}
        </span>
        <span className={`text-xs font-display bg-card/80 px-2 py-1 rounded-lg ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
          ⏳ {timeLeft}s
        </span>
      </div>

      {/* Hidden items */}
      {items.map(item => !item.found ? (
        <button
          key={item.id}
          onClick={() => findItem(item.id)}
          className={`absolute transition-all duration-300 ${item.hint ? 'scale-125' : 'scale-100'}`}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            item.hint
              ? 'bg-primary/30 border-2 border-primary shadow-lg shadow-primary/30 animate-pulse'
              : 'bg-card/20 border border-border/30 hover:bg-card/50'
          }`}>
            <span className={`text-lg ${item.hint ? 'opacity-80' : 'opacity-10'}`}>{item.emoji}</span>
          </div>
        </button>
      ) : (
        <div key={item.id} className="absolute animate-fade-in" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="text-lg">{item.emoji}</span>
          </div>
        </div>
      ))}

      {/* Found toast */}
      {lastFound && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
          <span className="bg-card/90 border border-primary/30 px-3 py-2 rounded-xl text-sm font-display text-primary shadow-lg">
            ✨ {lastFound}!
          </span>
        </div>
      )}

      {/* Ambient sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i * 17) % 80}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 7. DivineReflex — Simon Says with directions
// ═══════════════════════════════════════════

type Direction = '⬆️' | '⬇️' | '⬅️' | '➡️';
const DIRECTIONS: Direction[] = ['⬆️', '⬇️', '⬅️', '➡️'];

function ReflexGame({ config, onComplete }: MiniGameProps) {
  const diff = config.difficulty || 'normal';
  const maxRounds = diff === 'easy' ? 4 : diff === 'hard' ? 7 : 5;
  const baseSpeed = config.reflexSpeed || (diff === 'easy' ? 900 : diff === 'hard' ? 500 : 700);

  const [phase, setPhase] = useState<'intro' | 'showing' | 'input' | 'feedback' | 'result'>('intro');
  const [sequence, setSequence] = useState<Direction[]>([]);
  const [showIndex, setShowIndex] = useState(-1);
  const [playerInput, setPlayerInput] = useState<Direction[]>([]);
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeDir, setActiveDir] = useState<Direction | null>(null);

  const generateSequence = useCallback((len: number) => {
    return Array.from({ length: len }, () => DIRECTIONS[Math.floor(Math.random() * 4)]);
  }, []);

  const startRound = useCallback(() => {
    const len = 3 + round; // starts at 3, grows each round
    const seq = generateSequence(len);
    setSequence(seq);
    setPlayerInput([]);
    setShowIndex(-1);
    setPhase('showing');
  }, [round, generateSequence]);

  // Show sequence with decreasing speed
  useEffect(() => {
    if (phase !== 'showing') return;
    if (showIndex >= sequence.length - 1) {
      const timer = setTimeout(() => {
        setPhase('input');
        setShowIndex(-1);
        setActiveDir(null);
      }, 400);
      return () => clearTimeout(timer);
    }
    const speed = Math.max(300, baseSpeed - round * 60);
    const timer = setTimeout(() => {
      const nextIdx = showIndex + 1;
      setShowIndex(nextIdx);
      setActiveDir(sequence[nextIdx]);
      // Clear active briefly for visual pulse
      setTimeout(() => setActiveDir(null), speed * 0.6);
    }, speed);
    return () => clearTimeout(timer);
  }, [phase, showIndex, sequence, baseSpeed, round]);

  const handleInput = (dir: Direction) => {
    if (phase !== 'input') return;
    setActiveDir(dir);
    setTimeout(() => setActiveDir(null), 150);

    const newInput = [...playerInput, dir];
    setPlayerInput(newInput);
    const idx = newInput.length - 1;

    if (newInput[idx] !== sequence[idx]) {
      setFeedbackText('❌ Sequência errada!');
      setPhase('feedback');
      setTimeout(() => {
        const next = round + 1;
        setRound(next);
        if (next >= maxRounds) setPhase('result');
        else startRound();
      }, 1200);
      return;
    }

    if (newInput.length === sequence.length) {
      setWins(w => w + 1);
      setFeedbackText('✨ Perfeito!');
      setPhase('feedback');
      setTimeout(() => {
        const next = round + 1;
        setRound(next);
        if (next >= maxRounds) setPhase('result');
        else startRound();
      }, 1200);
    }
  };

  const finalScore = maxRounds > 0 ? Math.round((wins / maxRounds) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">👼</div>
        <h3 className="font-display text-xl text-primary">Reflexo Divino</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <p className="text-xs text-muted-foreground">Observe a sequência de direções e repita! A cada rodada fica mais rápido.</p>
        <button onClick={() => { startRound(); }} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '👼' : '😵‍💫'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Reflexos abençoados!' : 'Precisa de mais prática...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Acertou {wins} de {maxRounds} rodadas ({finalScore}%)
        </p>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }} />
        </div>
      </div>
    );
  }

  const dirStyle = (dir: Direction) =>
    `w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all duration-150 active:scale-90 ${
      activeDir === dir
        ? 'border-primary bg-primary/30 scale-110 shadow-lg shadow-primary/20'
        : 'border-border bg-card hover:border-primary/30'
    }`;

  return (
    <div className="bg-card/50 border-2 border-primary/20 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between text-xs font-display">
        <span className="text-primary bg-card/80 px-2 py-1 rounded-lg">Rodada {round + 1}/{maxRounds}</span>
        <span className="text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">
          {phase === 'showing' ? '👀 Observe...' : phase === 'input' ? '👆 Sua vez!' : ''}
        </span>
        <span className="text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">✓ {wins}</span>
      </div>

      {/* Progress dots */}
      {phase === 'input' && (
        <div className="flex justify-center gap-1">
          {sequence.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${
              i < playerInput.length ? 'bg-primary' : 'bg-secondary'
            }`} />
          ))}
        </div>
      )}

      {/* Direction pad */}
      <div className="flex flex-col items-center gap-2">
        <button onClick={() => handleInput('⬆️')} disabled={phase !== 'input'} className={dirStyle('⬆️')}>⬆️</button>
        <div className="flex gap-2">
          <button onClick={() => handleInput('⬅️')} disabled={phase !== 'input'} className={dirStyle('⬅️')}>⬅️</button>
          <div className="w-16 h-16 rounded-2xl border-2 border-border/30 bg-card/30 flex items-center justify-center">
            <span className="text-lg">{phase === 'showing' ? '👀' : '✋'}</span>
          </div>
          <button onClick={() => handleInput('➡️')} disabled={phase !== 'input'} className={dirStyle('➡️')}>➡️</button>
        </div>
        <button onClick={() => handleInput('⬇️')} disabled={phase !== 'input'} className={dirStyle('⬇️')}>⬇️</button>
      </div>

      {/* Feedback */}
      {phase === 'feedback' && (
        <div className="text-center py-2 animate-scale-in">
          <span className="text-xl font-display">{feedbackText}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Main MiniGame Dispatcher
// ═══════════════════════════════════════════

import { ScripturePuzzle } from '@/components/games/ScripturePuzzle';
import { PathOfFaith } from '@/components/games/PathOfFaith';

export function MiniGame({ config, onComplete }: MiniGameProps) {
  switch (config.type) {
    case 'qte':
      return <QTEGame config={config} onComplete={onComplete} />;
    case 'swipe':
      return <SwipeDodgeGame config={config} onComplete={onComplete} />;
    case 'memory':
      return <MemoryGame config={config} onComplete={onComplete} />;
    case 'stealth':
      return <StealthGame config={config} onComplete={onComplete} />;
    case 'diceduel':
      return <DiceDuelGame config={config} onComplete={onComplete} />;
    case 'treasure':
      return <TreasureHuntGame config={config} onComplete={onComplete} />;
    case 'reflex':
      return <ReflexGame config={config} onComplete={onComplete} />;
    case 'wordpuzzle':
      return <ScripturePuzzle config={config} onComplete={onComplete} />;
    case 'pathchoice':
      return <PathOfFaith config={config} onComplete={onComplete} />;
    default:
      return null;
  }
}
