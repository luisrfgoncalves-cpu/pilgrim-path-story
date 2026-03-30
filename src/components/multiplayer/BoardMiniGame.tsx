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
  const borderColor = isGiant ? 'hsl(0 60% 45%)' : tileType === 'scripture' ? 'hsl(210 60% 55%)' : 'hsl(25 80% 50%)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: isGiant
            ? 'linear-gradient(135deg, hsl(0 25% 10%), hsl(0 15% 6%))'
            : tileType === 'scripture'
            ? 'linear-gradient(135deg, hsl(220 25% 12%), hsl(220 15% 6%))'
            : 'linear-gradient(135deg, hsl(25 25% 12%), hsl(20 15% 6%))',
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 60px ${isGiant ? 'rgba(200,0,0,0.3)' : 'rgba(255,140,40,0.3)'}`,
        }}
      >
        {/* Character image header */}
        {charImg && (
          <div className="relative w-full h-36 overflow-hidden">
            <img src={charImg} alt={config.label} className="w-full h-full object-cover"
              style={{ filter: isGiant ? 'saturate(1.4) contrast(1.3) brightness(0.8)' : 'saturate(1.2)' }}
            />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to top, ${isGiant ? 'hsl(0 25% 10%)' : 'hsl(25 25% 12%)'} 0%, transparent 70%)`,
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
              {isGiant ? 'Batalha contra o Gigante!' : tileType === 'scripture' ? 'Desafio Bíblico!' : 'Desafio!'}
            </h3>
          </div>
          <p className="text-xs text-white/50">{playerName} · {config.label}</p>
          <p className="text-xs text-white/40 mt-1">
            {isGiant ? 'Vença para avançar! Perca e volte...' : 'Prove seu valor, peregrino!'}
          </p>
        </div>

        {/* Mini game content */}
        {tileType === 'scripture' ? (
          <ScriptureQuiz onResult={handleResult} />
        ) : tileType === 'giant' ? (
          <ReactionGame difficulty={difficulty} onResult={handleResult} />
        ) : (
          <MemoryGame difficulty={difficulty} onResult={handleResult} />
        )}
      </div>
    </div>
  );
}
