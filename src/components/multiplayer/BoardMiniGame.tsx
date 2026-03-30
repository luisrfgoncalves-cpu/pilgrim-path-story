import { useState, useEffect, useCallback } from 'react';
import { X, Swords, BookOpen, Skull } from 'lucide-react';
import { TileType, TILE_TYPES } from './ImmersiveBoardTypes';
import { characterImages } from '@/data/characterImages';
import { playPositiveEvent, playNegativeEvent, playChallengeEvent } from './BoardSounds';

interface BoardMiniGameProps {
  visible: boolean;
  tileType: TileType;
  playerName: string;
  onResult: (won: boolean) => void;
}

// Quick reaction game - tap the target before time runs out
function ReactionGame({ difficulty, onResult }: { difficulty: number; onResult: (won: boolean) => void }) {
  const [phase, setPhase] = useState<'ready' | 'wait' | 'tap' | 'done'>('ready');
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const timeLimit = Math.max(800, 2000 - difficulty * 200); // harder = less time

  useEffect(() => {
    if (phase === 'ready') {
      const t = setTimeout(() => setPhase('wait'), 1000);
      return () => clearTimeout(t);
    }
    if (phase === 'wait') {
      const delay = 1000 + Math.random() * 2000;
      const t = setTimeout(() => {
        setPhase('tap');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(t);
    }
    if (phase === 'tap') {
      const t = setTimeout(() => {
        setPhase('done');
        setResult(false);
        playNegativeEvent();
      }, timeLimit);
      return () => clearTimeout(t);
    }
  }, [phase, timeLimit]);

  const handleTap = () => {
    if (phase === 'wait') {
      // Too early!
      setPhase('done');
      setResult(false);
      playNegativeEvent();
      return;
    }
    if (phase === 'tap') {
      const reaction = Date.now() - startTime;
      const won = reaction < timeLimit;
      setPhase('done');
      setResult(won);
      if (won) playPositiveEvent(); else playNegativeEvent();
    }
  };

  useEffect(() => {
    if (phase === 'done' && result !== null) {
      const t = setTimeout(() => onResult(result), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, result, onResult]);

  return (
    <div className="flex flex-col items-center gap-4 p-6" onClick={handleTap}>
      {phase === 'ready' && (
        <p className="text-lg font-display text-white/80 animate-pulse">Prepare-se...</p>
      )}
      {phase === 'wait' && (
        <div className="w-32 h-32 rounded-full bg-red-900/50 border-4 border-red-500/50 flex items-center justify-center">
          <p className="text-sm font-display text-red-300">ESPERE...</p>
        </div>
      )}
      {phase === 'tap' && (
        <div className="w-32 h-32 rounded-full bg-green-500/30 border-4 border-green-400 flex items-center justify-center animate-pulse cursor-pointer">
          <p className="text-xl font-display font-bold text-green-300">TOQUE!</p>
        </div>
      )}
      {phase === 'done' && (
        <div className="text-center space-y-2">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result ? 'Vitória!' : 'Derrota!'}
          </p>
        </div>
      )}
      {phase !== 'done' && (
        <p className="text-xs text-white/40 mt-4">Toque quando ficar VERDE!</p>
      )}
    </div>
  );
}

// Memory sequence game
function MemoryGame({ difficulty, onResult }: { difficulty: number; onResult: (won: boolean) => void }) {
  const seqLength = Math.min(3 + difficulty, 7);
  const symbols = ['⚔️', '🛡️', '📖', '⭐', '🔥', '💎', '🗝️', '✝️'];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<'show' | 'input' | 'done'>('show');
  const [showIdx, setShowIdx] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    const seq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      seq.push(Math.floor(Math.random() * 4));
    }
    setSequence(seq);
  }, [seqLength]);

  useEffect(() => {
    if (phase !== 'show' || sequence.length === 0) return;
    if (showIdx >= sequence.length) {
      const t = setTimeout(() => setPhase('input'), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowIdx(s => s + 1), 800);
    return () => clearTimeout(t);
  }, [phase, showIdx, sequence]);

  const handleSymbolTap = (idx: number) => {
    if (phase !== 'input') return;
    const newSeq = [...playerSeq, idx];
    setPlayerSeq(newSeq);
    playChallengeEvent();

    const pos = newSeq.length - 1;
    if (newSeq[pos] !== sequence[pos]) {
      setResult(false);
      setPhase('done');
      playNegativeEvent();
      return;
    }
    if (newSeq.length === sequence.length) {
      setResult(true);
      setPhase('done');
      playPositiveEvent();
    }
  };

  useEffect(() => {
    if (phase === 'done' && result !== null) {
      const t = setTimeout(() => onResult(result), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, result, onResult]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {phase === 'show' && (
        <>
          <p className="text-sm font-display text-white/70">Memorize a sequência!</p>
          <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center">
            {showIdx < sequence.length && (
              <span className="text-4xl animate-bounce">{symbols[sequence[showIdx]]}</span>
            )}
          </div>
          <div className="flex gap-1">
            {sequence.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < showIdx ? 'bg-primary' : 'bg-white/20'}`} />
            ))}
          </div>
        </>
      )}
      {phase === 'input' && (
        <>
          <p className="text-sm font-display text-white/70">Repita a sequência! ({playerSeq.length}/{sequence.length})</p>
          <div className="grid grid-cols-2 gap-3">
            {symbols.slice(0, 4).map((sym, i) => (
              <button
                key={i}
                onClick={() => handleSymbolTap(i)}
                className="w-20 h-20 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl
                  hover:bg-white/20 active:scale-90 transition-all"
              >
                {sym}
              </button>
            ))}
          </div>
        </>
      )}
      {phase === 'done' && (
        <div className="text-center space-y-2">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result ? 'Sequência correta!' : 'Sequência errada!'}
          </p>
        </div>
      )}
    </div>
  );
}

// Scripture quiz
function ScriptureQuiz({ onResult }: { onResult: (won: boolean) => void }) {
  const questions = [
    { q: 'Quem enfrentou Golias?', options: ['Moisés', 'Davi', 'Saul', 'Josué'], correct: 1 },
    { q: 'Quantos dias Noé ficou na arca durante o dilúvio?', options: ['7', '40', '100', '150'], correct: 1 },
    { q: 'Quem foi jogado na cova dos leões?', options: ['Jonas', 'Daniel', 'Elias', 'Samuel'], correct: 1 },
    { q: 'Qual fruto a serpente ofereceu?', options: ['Maçã', 'Uva', 'Fruto proibido', 'Figo'], correct: 2 },
    { q: 'Quantos discípulos Jesus teve?', options: ['7', '10', '12', '15'], correct: 2 },
    { q: 'Quem batizou Jesus?', options: ['Pedro', 'João Batista', 'Paulo', 'Tiago'], correct: 1 },
    { q: 'Qual o primeiro livro da Bíblia?', options: ['Êxodo', 'Gênesis', 'Levítico', 'Salmos'], correct: 1 },
    { q: 'Quem construiu a arca?', options: ['Abraão', 'Moisés', 'Noé', 'Davi'], correct: 2 },
  ];
  const [qIdx] = useState(() => Math.floor(Math.random() * questions.length));
  const [answered, setAnswered] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const question = questions[qIdx];

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    const won = idx === question.correct;
    setResult(won);
    if (won) playPositiveEvent(); else playNegativeEvent();
  };

  useEffect(() => {
    if (result !== null) {
      const t = setTimeout(() => onResult(result), 2000);
      return () => clearTimeout(t);
    }
  }, [result, onResult]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <BookOpen className="w-8 h-8 text-blue-400" />
      <p className="text-base font-display text-white/90 text-center">{question.q}</p>
      <div className="w-full space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={answered !== null}
            className={`w-full py-3 px-4 rounded-xl text-sm font-display transition-all
              ${answered === null ? 'bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95' : ''}
              ${answered === i && result ? 'bg-green-500/30 border-2 border-green-400' : ''}
              ${answered === i && !result ? 'bg-red-500/30 border-2 border-red-400' : ''}
              ${answered !== null && i === question.correct && answered !== i ? 'bg-green-500/20 border border-green-400/50' : ''}
              ${answered !== null && i !== question.correct && answered !== i ? 'opacity-40' : ''}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
      {result !== null && (
        <p className="text-lg font-display mt-2" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? '✅ Correto!' : '❌ Errado!'}
        </p>
      )}
    </div>
  );
}

// Swipe dodge quick game — dodge or accept items
function SwipeDodgeGame({ onResult }: { onResult: (won: boolean) => void }) {
  const items = [
    { emoji: '🗡️', label: 'Espada inimiga', good: false },
    { emoji: '🔥', label: 'Fogo do mal', good: false },
    { emoji: '💎', label: 'Tesouro', good: true },
    { emoji: '⭐', label: 'Bênção', good: true },
    { emoji: '☠️', label: 'Caveira', good: false },
    { emoji: '🕊️', label: 'Pomba', good: true },
    { emoji: '🐍', label: 'Serpente', good: false },
    { emoji: '📖', label: 'Escritura', good: true },
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [order] = useState(() => {
    const arr = [...items].sort(() => Math.random() - 0.5);
    return arr.slice(0, 6);
  });
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSwipe = (accepted: boolean) => {
    if (done) return;
    const item = order[currentIdx];
    const correct = item.good === accepted;
    const newScore = score + (correct ? 1 : 0);
    const newTotal = total + 1;
    setScore(newScore);
    setTotal(newTotal);
    
    if (correct) playChallengeEvent();
    
    if (currentIdx >= order.length - 1) {
      const won = newScore >= 4;
      setResult(won);
      setDone(true);
      if (won) playPositiveEvent(); else playNegativeEvent();
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  useEffect(() => {
    if (done && result !== null) {
      const t = setTimeout(() => onResult(result), 1500);
      return () => clearTimeout(t);
    }
  }, [done, result, onResult]);

  if (done) {
    return (
      <div className="text-center p-6 space-y-2">
        <span className="text-5xl block">{result ? '✅' : '❌'}</span>
        <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? `Acertou ${score}/${total}!` : `Apenas ${score}/${total}...`}
        </p>
      </div>
    );
  }

  const item = order[currentIdx];
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm font-display text-white/70">Aceite o BOM, rejeite o MAL! ({currentIdx + 1}/{order.length})</p>
      <div className="text-6xl mb-2" style={{ animation: 'bounce 0.5s' }}>{item.emoji}</div>
      <p className="text-base font-display text-white/80">{item.label}</p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => handleSwipe(false)}
          className="w-20 h-14 rounded-xl bg-red-900/40 border-2 border-red-500/50 text-2xl active:scale-90 transition-all"
        >
          ❌
        </button>
        <button
          onClick={() => handleSwipe(true)}
          className="w-20 h-14 rounded-xl bg-green-900/40 border-2 border-green-500/50 text-2xl active:scale-90 transition-all"
        >
          ✅
        </button>
      </div>
      <p className="text-xs text-white/40">✅ Aceitar · ❌ Rejeitar</p>
    </div>
  );
}

// Treasure hunt quick game
function TreasureHuntGame({ onResult }: { onResult: (won: boolean) => void }) {
  const [boxes] = useState(() => {
    const arr = Array(9).fill(false);
    const treasureCount = 3;
    const positions = new Set<number>();
    while (positions.size < treasureCount) positions.add(Math.floor(Math.random() * 9));
    positions.forEach(p => arr[p] = true);
    return arr;
  });
  const [revealed, setRevealed] = useState<boolean[]>(Array(9).fill(false));
  const [found, setFound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleReveal = (idx: number) => {
    if (done || revealed[idx]) return;
    const newRevealed = [...revealed];
    newRevealed[idx] = true;
    setRevealed(newRevealed);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (boxes[idx]) {
      const newFound = found + 1;
      setFound(newFound);
      playChallengeEvent();
      if (newFound >= 2) {
        setResult(true);
        setDone(true);
        playPositiveEvent();
        return;
      }
    }
    
    if (newAttempts >= maxAttempts) {
      setResult(false);
      setDone(true);
      playNegativeEvent();
    }
  };

  useEffect(() => {
    if (done && result !== null) {
      const t = setTimeout(() => onResult(result), 1500);
      return () => clearTimeout(t);
    }
  }, [done, result, onResult]);

  if (done) {
    return (
      <div className="text-center p-6 space-y-2">
        <span className="text-5xl block">{result ? '✅' : '❌'}</span>
        <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? `Encontrou ${found} tesouros!` : `Apenas ${found} tesouros...`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <p className="text-sm font-display text-white/70">Encontre 2 tesouros! ({attempts}/{maxAttempts} tentativas)</p>
      <div className="grid grid-cols-3 gap-2">
        {boxes.map((isTreasure, i) => (
          <button
            key={i}
            onClick={() => handleReveal(i)}
            disabled={revealed[i]}
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all active:scale-90"
            style={{
              background: revealed[i]
                ? (isTreasure ? 'hsl(45 60% 25%)' : 'hsl(0 0% 15%)')
                : 'hsl(30 20% 18%)',
              border: `2px solid ${revealed[i] ? (isTreasure ? 'hsl(45 60% 50%)' : 'hsl(0 0% 30%)') : 'hsl(30 20% 30%)'}`,
            }}
          >
            {revealed[i] ? (isTreasure ? '💎' : '💨') : '❓'}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/40">Tesouros encontrados: {found}/2</p>
    </div>
  );
}

// Quick courage test — hold button under pressure
function CourageHoldGame({ onResult }: { onResult: (won: boolean) => void }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const holdGoal = 100;
  const intervalRef = useRef<number | null>(null);

  const startHold = () => {
    if (done) return;
    setHolding(true);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const stopHold = () => {
    setHolding(false);
    if (progress < holdGoal && !done) {
      // Reset progress partially
      setProgress(p => Math.max(0, p - 15));
    }
  };

  useEffect(() => {
    if (holding && !done) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          const next = p + 3;
          if (next >= holdGoal) {
            setDone(true);
            setResult(true);
            setHolding(false);
            playPositiveEvent();
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
            return holdGoal;
          }
          return next;
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [holding, done]);

  // Timeout
  useEffect(() => {
    const t = setTimeout(() => {
      if (!done) {
        setDone(true);
        setResult(false);
        playNegativeEvent();
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [done]);

  useEffect(() => {
    if (done && result !== null) {
      const t = setTimeout(() => onResult(result), 1500);
      return () => clearTimeout(t);
    }
  }, [done, result, onResult]);

  if (done) {
    return (
      <div className="text-center p-6 space-y-2">
        <span className="text-5xl block">{result ? '✅' : '❌'}</span>
        <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? 'Coragem mantida!' : 'Você fraquejou...'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm font-display text-white/70">Segure o botão sem soltar!</p>
      <div className="w-full h-4 rounded-full overflow-hidden" style={{
        background: 'hsl(0 0% 15%)',
        border: '1px solid hsl(0 0% 25%)',
      }}>
        <div className="h-full rounded-full transition-all duration-100" style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, hsl(0 60% 45%), hsl(45 70% 55%))`,
          boxShadow: '0 0 10px hsl(45 70% 55% / 0.5)',
        }} />
      </div>
      <button
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onTouchStart={startHold}
        onTouchEnd={stopHold}
        className="w-32 h-32 rounded-full flex items-center justify-center text-4xl transition-transform"
        style={{
          background: holding
            ? 'radial-gradient(circle, hsl(45 60% 35%), hsl(30 40% 15%))'
            : 'radial-gradient(circle, hsl(0 0% 20%), hsl(0 0% 10%))',
          border: `3px solid ${holding ? 'hsl(45 60% 50%)' : 'hsl(0 0% 30%)'}`,
          boxShadow: holding ? '0 0 30px hsl(45 60% 50% / 0.4)' : undefined,
          transform: holding ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        {holding ? '🔥' : '🛡️'}
      </button>
      <p className="text-xs text-white/40">Segure firme para resistir!</p>
    </div>
  );
}

// Quick path choice — choose the right path
function PathChoiceGame({ onResult }: { onResult: (won: boolean) => void }) {
  const paths = [
    { emoji: '🌿', label: 'Caminho Verde', safe: true },
    { emoji: '🌑', label: 'Caminho Escuro', safe: false },
    { emoji: '💧', label: 'Caminho do Rio', safe: true },
    { emoji: '🔥', label: 'Caminho de Fogo', safe: false },
  ];
  const [shuffled] = useState(() => [...paths].sort(() => Math.random() - 0.5).slice(0, 3));
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  const handleChoice = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const won = shuffled[idx].safe;
    setResult(won);
    if (won) playPositiveEvent(); else playNegativeEvent();
  };

  useEffect(() => {
    if (result !== null) {
      const t = setTimeout(() => onResult(result), 1800);
      return () => clearTimeout(t);
    }
  }, [result, onResult]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm font-display text-white/70">Escolha o caminho seguro!</p>
      <div className="w-full space-y-2">
        {shuffled.map((path, i) => (
          <button
            key={i}
            onClick={() => handleChoice(i)}
            disabled={chosen !== null}
            className="w-full py-4 px-5 rounded-xl flex items-center gap-3 text-left transition-all active:scale-95"
            style={{
              background: chosen === i
                ? (path.safe ? 'hsl(120 30% 15%)' : 'hsl(0 30% 15%)')
                : 'hsl(0 0% 12%)',
              border: `2px solid ${chosen === i
                ? (path.safe ? 'hsl(120 50% 45%)' : 'hsl(0 50% 45%)')
                : chosen !== null && path.safe ? 'hsl(120 40% 35% / 0.5)' : 'hsl(0 0% 25%)'}`,
              opacity: chosen !== null && chosen !== i && !path.safe ? 0.4 : 1,
            }}
          >
            <span className="text-3xl">{path.emoji}</span>
            <span className="text-sm font-display text-white/80">{path.label}</span>
            {chosen !== null && i === chosen && (
              <span className="ml-auto text-lg">{path.safe ? '✅' : '❌'}</span>
            )}
          </button>
        ))}
      </div>
      {result !== null && (
        <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? 'Caminho seguro!' : 'Caminho perigoso!'}
        </p>
      )}
    </div>
  );
}

// Rapid tap countdown
function RapidTapGame({ onResult }: { onResult: (won: boolean) => void }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const goal = 12;

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          setDone(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (done && result === null) {
      const won = taps >= goal;
      setResult(won);
      if (won) playPositiveEvent(); else playNegativeEvent();
    }
  }, [done, taps, result]);

  useEffect(() => {
    if (done && result !== null) {
      const t = setTimeout(() => onResult(result), 1500);
      return () => clearTimeout(t);
    }
  }, [done, result, onResult]);

  const handleTap = () => {
    if (done) return;
    setTaps(p => {
      const next = p + 1;
      if (next >= goal) {
        setDone(true);
      }
      if (navigator.vibrate) navigator.vibrate(15);
      return next;
    });
  };

  if (done) {
    return (
      <div className="text-center p-6 space-y-2">
        <span className="text-5xl block">{result ? '✅' : '❌'}</span>
        <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? `${taps} toques! Passou!` : `Apenas ${taps}/${goal}...`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <p className="text-sm font-display text-white/70">Toque rápido {goal} vezes! ⏱ {timeLeft}s</p>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{
        background: 'hsl(0 0% 15%)', border: '1px solid hsl(0 0% 25%)',
      }}>
        <div className="h-full rounded-full transition-all duration-150" style={{
          width: `${(taps / goal) * 100}%`,
          background: 'linear-gradient(90deg, hsl(195 60% 45%), hsl(45 70% 55%))',
        }} />
      </div>
      <button
        onClick={handleTap}
        className="w-28 h-28 rounded-full flex items-center justify-center text-4xl active:scale-90 transition-transform"
        style={{
          background: 'radial-gradient(circle, hsl(195 40% 25%), hsl(195 30% 12%))',
          border: '3px solid hsl(195 50% 45%)',
          boxShadow: `0 0 ${10 + taps * 2}px hsl(195 50% 45% / ${0.2 + taps * 0.03})`,
        }}
      >
        🌊
      </button>
      <p className="text-xs text-white/40">{taps}/{goal}</p>
    </div>
  );
}

export default function BoardMiniGame({ visible, tileType, playerName, onResult }: BoardMiniGameProps) {
  const config = TILE_TYPES[tileType] || TILE_TYPES.normal;
  const charKey = config.characterKey;
  const charImg = charKey ? characterImages[charKey] : null;

  const difficulty = tileType === 'giant' ? 3 : tileType === 'challenge' ? 2 : 1;

  const handleResult = useCallback((won: boolean) => {
    onResult(won);
  }, [onResult]);

  if (!visible) return null;

  const isGiant = tileType === 'giant';
  const isSurprise = tileType === 'surprise';
  const isBlessing = tileType === 'blessing';
  const isTrap = tileType === 'trap';
  const isShield = tileType === 'shield';
  const isCurrent = tileType === 'current';
  const isSwap = tileType === 'swap';
  
  const borderColor = isGiant ? 'hsl(0 60% 45%)'
    : tileType === 'scripture' ? 'hsl(210 60% 55%)'
    : isSurprise ? 'hsl(40 70% 50%)'
    : isBlessing ? 'hsl(45 80% 55%)'
    : isTrap ? 'hsl(270 50% 50%)'
    : isShield ? 'hsl(0 0% 65%)'
    : isCurrent ? 'hsl(195 70% 50%)'
    : isSwap ? 'hsl(330 60% 55%)'
    : 'hsl(25 80% 50%)';

  const bgStyle = isGiant
    ? 'linear-gradient(135deg, hsl(0 25% 10%), hsl(0 15% 6%))'
    : tileType === 'scripture'
    ? 'linear-gradient(135deg, hsl(220 25% 12%), hsl(220 15% 6%))'
    : isSurprise
    ? 'linear-gradient(135deg, hsl(40 25% 12%), hsl(35 15% 6%))'
    : isBlessing
    ? 'linear-gradient(135deg, hsl(45 30% 14%), hsl(40 20% 8%))'
    : isTrap
    ? 'linear-gradient(135deg, hsl(270 25% 12%), hsl(270 15% 6%))'
    : isCurrent
    ? 'linear-gradient(135deg, hsl(195 25% 12%), hsl(195 15% 6%))'
    : 'linear-gradient(135deg, hsl(25 25% 12%), hsl(20 15% 6%))';

  const titleText = isGiant ? 'Batalha contra o Gigante!'
    : tileType === 'scripture' ? 'Desafio Bíblico!'
    : isSurprise ? 'Surpresa! Mini-desafio!'
    : isBlessing ? 'Bênção — Caça ao Tesouro!'
    : isTrap ? 'Armadilha! Escape rápido!'
    : isShield ? 'Prova de Coragem!'
    : isCurrent ? 'Correnteza! Nade rápido!'
    : isSwap ? 'Encruzilhada! Escolha o caminho!'
    : 'Desafio!';

  const subtitleText = isGiant ? 'Vença para avançar! Perca e volte...'
    : isSurprise ? 'Discerna o bem do mal para ganhar!'
    : isBlessing ? 'Encontre os tesouros escondidos!'
    : isTrap ? 'Reaja rápido ou sofra as consequências!'
    : isShield ? 'Segure firme para receber a armadura!'
    : isCurrent ? 'Toque rápido para vencer a corrente!'
    : isSwap ? 'Escolha sabiamente!'
    : 'Prove seu valor, peregrino!';

  // Choose mini-game based on tile type
  const renderMiniGame = () => {
    switch (tileType) {
      case 'scripture': return <ScriptureQuiz onResult={handleResult} />;
      case 'giant': return <ReactionGame difficulty={difficulty} onResult={handleResult} />;
      case 'surprise': return <SwipeDodgeGame onResult={handleResult} />;
      case 'blessing': return <TreasureHuntGame onResult={handleResult} />;
      case 'trap': return <ReactionGame difficulty={3} onResult={handleResult} />;
      case 'shield': return <CourageHoldGame onResult={handleResult} />;
      case 'current': return <RapidTapGame onResult={handleResult} />;
      case 'swap': return <PathChoiceGame onResult={handleResult} />;
      default: return <MemoryGame difficulty={difficulty} onResult={handleResult} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: bgStyle,
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 60px ${isGiant ? 'rgba(200,0,0,0.3)' : 'rgba(255,140,40,0.3)'}`,
        }}
      >
        {/* Character image header */}
        {charImg && (
          <div className="relative w-full h-48 overflow-hidden">
            <img src={charImg} alt={config.label} className="w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'center top',
                filter: isGiant ? 'saturate(1.4) contrast(1.3) brightness(0.8)' : 'saturate(1.2)',
                background: isGiant ? 'hsl(0 15% 6%)' : 'hsl(25 15% 8%)',
              }}
            />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to top, ${isGiant ? 'hsl(0 25% 10%)' : 'hsl(25 25% 12%)'} 0%, transparent 50%)`,
            }} />
            {isGiant && (
              <div className="absolute inset-0 animate-pulse" style={{
                background: 'radial-gradient(circle, transparent 40%, rgba(150,0,0,0.4) 100%)',
              }} />
            )}
          </div>
        )}

        {/* Title */}
        <div className="px-5 pt-3 pb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {isGiant ? <Skull className="w-6 h-6 text-red-400" /> : <Swords className="w-6 h-6 text-orange-400" />}
            <h3 className="text-xl font-display font-bold" style={{ color: borderColor }}>
              {titleText}
            </h3>
          </div>
          <p className="text-xs text-white/50">{playerName} · {config.label}</p>
          <p className="text-xs text-white/40 mt-1">{subtitleText}</p>
        </div>

        {/* Mini game content */}
        {renderMiniGame()}
      </div>
    </div>
  );
}
