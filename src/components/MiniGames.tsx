import { useState, useEffect, useCallback, useRef } from 'react';
import { ChoiceEffect } from '@/data/story';

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

export type MiniGameType = 'qte' | 'swipe' | 'memory' | 'stealth';

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
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">⚔️</div>
        <h3 className="font-display text-xl text-primary">Reflexos de Batalha</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <p className="text-xs text-muted-foreground">Toque nos alvos antes que desapareçam!</p>
        <button onClick={() => setPhase('playing')} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-4xl">{success ? '🏆' : '💔'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Vitória!' : 'Derrotado...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Acertou {score} de {maxTargets} alvos ({finalScore}%)
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
    <div className="relative bg-card/50 border-2 border-primary/20 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
      {/* Score HUD */}
      <div className="absolute top-2 left-3 right-3 flex justify-between z-10">
        <span className="text-xs font-display text-primary bg-card/80 px-2 py-1 rounded-lg">
          ✓ {score}
        </span>
        <span className="text-xs font-display text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">
          {spawned}/{maxTargets}
        </span>
        <span className="text-xs font-display text-destructive bg-card/80 px-2 py-1 rounded-lg">
          ✗ {misses}
        </span>
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
            <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/30">
              <span className="text-2xl">{t.symbol}</span>
            </div>
          </button>
        );
      })}

      {/* Pulse background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none animate-pulse" />
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
// Main MiniGame Dispatcher
// ═══════════════════════════════════════════

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
    default:
      return null;
  }
}
