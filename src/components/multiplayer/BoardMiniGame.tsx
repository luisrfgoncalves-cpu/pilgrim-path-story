import { useState, useEffect, useCallback, useRef } from 'react';
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
    // Antigo Testamento
    { q: 'Quem enfrentou Golias com uma funda e cinco pedras?', options: ['Moisés', 'Davi', 'Saul', 'Josué'], correct: 1 },
    { q: 'Quantos dias e noites durou o dilúvio de chuva?', options: ['7', '40', '100', '150'], correct: 1 },
    { q: 'Quem foi jogado na cova dos leões?', options: ['Jonas', 'Daniel', 'Elias', 'Samuel'], correct: 1 },
    { q: 'Quantos discípulos Jesus escolheu?', options: ['7', '10', '12', '15'], correct: 2 },
    { q: 'Quem batizou Jesus no rio Jordão?', options: ['Pedro', 'João Batista', 'Paulo', 'Tiago'], correct: 1 },
    { q: 'Qual o primeiro livro da Bíblia?', options: ['Êxodo', 'Gênesis', 'Levítico', 'Salmos'], correct: 1 },
    { q: 'Quem construiu a arca?', options: ['Abraão', 'Moisés', 'Noé', 'Davi'], correct: 2 },
    { q: 'Quem libertou o povo de Israel do Egito?', options: ['Abraão', 'Moisés', 'José', 'Josué'], correct: 1 },
    { q: 'Quantos mandamentos Deus deu a Moisés?', options: ['5', '7', '10', '12'], correct: 2 },
    { q: 'Quem foi vendido como escravo pelos próprios irmãos?', options: ['Davi', 'Moisés', 'José', 'Daniel'], correct: 2 },
    { q: 'Quem foi engolido por um grande peixe?', options: ['Jonas', 'Pedro', 'Paulo', 'Elias'], correct: 0 },
    { q: 'Quantos dias Jesus ficou no deserto sendo tentado?', options: ['7', '21', '30', '40'], correct: 3 },
    { q: 'Quem negou Jesus três vezes?', options: ['Judas', 'Tomé', 'Pedro', 'João'], correct: 2 },
    { q: 'Qual era a profissão de Jesus antes do ministério?', options: ['Pescador', 'Carpinteiro', 'Pastor', 'Agricultor'], correct: 1 },
    { q: 'Em que cidade Jesus nasceu?', options: ['Nazaré', 'Jerusalém', 'Belém', 'Cafarnaum'], correct: 2 },
    { q: 'Quem traiu Jesus por trinta moedas de prata?', options: ['Pedro', 'Judas', 'Tomé', 'Tiago'], correct: 1 },
    { q: 'Quantos livros tem a Bíblia?', options: ['39', '52', '66', '73'], correct: 2 },
    { q: 'Qual o menor livro da Bíblia?', options: ['Judas', '3 João', '2 João', 'Filemom'], correct: 2 },
    { q: 'Quem escreveu a maioria das epístolas do Novo Testamento?', options: ['Pedro', 'João', 'Paulo', 'Tiago'], correct: 2 },
    { q: 'Qual o último livro da Bíblia?', options: ['Judas', 'Atos', 'Apocalipse', 'Malaquias'], correct: 2 },
    { q: 'Quem matou o gigante Golias?', options: ['Sansão', 'Josué', 'Davi', 'Saul'], correct: 2 },
    { q: 'Em qual monte Moisés recebeu os Dez Mandamentos?', options: ['Carmelo', 'Sinai', 'Sião', 'Nebo'], correct: 1 },
    { q: 'Quem era o irmão de Moisés?', options: ['Arão', 'Calebe', 'Josué', 'Levi'], correct: 0 },
    { q: 'Quantos filhos Jacó teve?', options: ['7', '10', '12', '14'], correct: 2 },
    { q: 'Quem foi o primeiro rei de Israel?', options: ['Davi', 'Saul', 'Salomão', 'Samuel'], correct: 1 },
    { q: 'Quem escreveu o livro de Provérbios?', options: ['Davi', 'Moisés', 'Salomão', 'Isaías'], correct: 2 },
    { q: 'Qual profeta enfrentou os profetas de Baal no Monte Carmelo?', options: ['Eliseu', 'Elias', 'Isaías', 'Jeremias'], correct: 1 },
    { q: 'Jesus transformou água em vinho em qual cidade?', options: ['Belém', 'Caná', 'Nazaré', 'Jerusalém'], correct: 1 },
    { q: 'Quantos pães e peixes Jesus usou para alimentar 5000?', options: ['3 pães e 2 peixes', '5 pães e 2 peixes', '7 pães e 3 peixes', '2 pães e 5 peixes'], correct: 1 },
    { q: 'Quem disse: "Eu sou o caminho, a verdade e a vida"?', options: ['Moisés', 'Paulo', 'Jesus', 'Pedro'], correct: 2 },
    // Peregrino de Bunyan
    { q: 'No livro O Peregrino, de onde Cristão fugiu?', options: ['Cidade Celestial', 'Feira da Vaidade', 'Cidade da Destruição', 'Vale da Morte'], correct: 2 },
    { q: 'Quem orientou Cristão a buscar a Porta Estreita?', options: ['Fiel', 'Evangelista', 'Grande-Coração', 'Intérprete'], correct: 1 },
    { q: 'Em qual lugar o fardo de Cristão caiu de suas costas?', options: ['Porta Estreita', 'Ao pé da Cruz', 'Palácio Belo', 'Casa do Intérprete'], correct: 1 },
    { q: 'Quem foi companheiro de Cristão na Feira da Vaidade?', options: ['Esperança', 'Fiel', 'Grande-Coração', 'Misericórdia'], correct: 1 },
    { q: 'Qual gigante prendeu Cristão no Castelo da Dúvida?', options: ['Golias', 'Gigante Orgulho', 'Gigante Desespero', 'Gigante Medo'], correct: 2 },
    { q: 'Com que chave Cristão escapou do Castelo da Dúvida?', options: ['Chave de Ouro', 'Chave da Fé', 'Chave da Promessa', 'Chave da Esperança'], correct: 2 },
    { q: 'Qual era o último obstáculo antes da Cidade Celestial?', options: ['A Feira', 'O Vale', 'O Rio da Morte', 'O Castelo'], correct: 2 },
  ];
  const [usedQuestions] = useState(() => {
    // Pick 1 random question from the pool
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled[0];
  });
  const [answered, setAnswered] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const question = usedQuestions;

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
          {result ? '✅ Correto! A Palavra ilumina o caminho!' : '❌ A resposta correta era outra...'}
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

// Fortress Defense — tap enemies approaching from different directions (replaces simple hold)
function FortressDefenseGame({ difficulty, onResult }: { difficulty: number; onResult: (won: boolean) => void }) {
  const totalEnemies = 6 + difficulty * 2;
  const [enemies, setEnemies] = useState<{ id: number; side: 'left' | 'right' | 'center'; emoji: string; alive: boolean }[]>([]);
  const [wave, setWave] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const spawnTimer = useRef<number | null>(null);

  const enemyTypes = ['🐍', '🦇', '🐺', '👹', '💀', '🕷️', '☠️', '🔥'];

  useEffect(() => {
    let spawned = 0;
    const spawn = () => {
      if (spawned >= totalEnemies || done) return;
      const sides: ('left' | 'right' | 'center')[] = ['left', 'right', 'center'];
      const enemy = {
        id: spawned,
        side: sides[Math.floor(Math.random() * 3)],
        emoji: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
        alive: true,
      };
      setEnemies(prev => [...prev.slice(-5), enemy]);
      setWave(spawned + 1);
      spawned++;
      const delay = Math.max(600, 1500 - difficulty * 150);
      spawnTimer.current = window.setTimeout(spawn, delay);
    };
    spawn();
    return () => { if (spawnTimer.current) clearTimeout(spawnTimer.current); };
  }, [totalEnemies, difficulty, done]);

  // Auto-end after all spawned + grace period
  useEffect(() => {
    if (wave >= totalEnemies && !done) {
      const t = setTimeout(() => {
        setDone(true);
        const won = score >= Math.ceil(totalEnemies * 0.6);
        setResult(won);
        if (won) playPositiveEvent(); else playNegativeEvent();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [wave, totalEnemies, done, score]);

  const handleTapEnemy = (id: number) => {
    if (done) return;
    setEnemies(prev => prev.map(e => e.id === id ? { ...e, alive: false } : e));
    setScore(s => s + 1);
    playChallengeEvent();
    if (navigator.vibrate) navigator.vibrate(20);
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
          {result ? `Fortaleza defendida! ${score}/${totalEnemies}` : `Fortaleza caiu... ${score}/${totalEnemies}`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <p className="text-sm font-display text-white/70">🏰 Defenda a Fortaleza! Toque nos inimigos!</p>
      <p className="text-xs text-white/40">Derrotados: {score} · Onda: {wave}/{totalEnemies}</p>
      <div className="relative w-full h-40 rounded-xl overflow-hidden" style={{
        background: 'linear-gradient(180deg, hsl(220 20% 12%), hsl(220 15% 8%))',
        border: '2px solid hsl(0 0% 25%)',
      }}>
        {/* Castle */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl">🏰</div>
        {/* Enemies */}
        {enemies.filter(e => e.alive).map(e => (
          <button
            key={e.id}
            onClick={() => handleTapEnemy(e.id)}
            className="absolute text-3xl transition-all active:scale-75"
            style={{
              left: e.side === 'left' ? '10%' : e.side === 'right' ? '75%' : '42%',
              top: `${15 + (e.id % 3) * 25}%`,
              animation: 'bounce 0.8s infinite',
            }}
          >
            {e.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

// Group Vote Game — all players vote, majority wins (GROUP RPG MECHANIC)
function GroupVoteGame({ onResult }: { onResult: (won: boolean) => void }) {
  const dilemmas = [
    {
      situation: 'Um estranho na estrada pede ajuda. Parece ferido, mas pode ser uma armadilha.',
      optionA: { text: 'Ajudar o estranho', emoji: '🤝', biblical: true },
      optionB: { text: 'Seguir em frente', emoji: '🚶', biblical: false },
      verse: 'Mateus 25:40',
    },
    {
      situation: 'O rei oferece riquezas em troca de negar sua fé publicamente.',
      optionA: { text: 'Aceitar as riquezas', emoji: '💰', biblical: false },
      optionB: { text: 'Recusar com firmeza', emoji: '✝️', biblical: true },
      verse: 'Mateus 6:24',
    },
    {
      situation: 'Seus companheiros querem usar um atalho proibido pelo mapa.',
      optionA: { text: 'Seguir pelo atalho', emoji: '⚡', biblical: false },
      optionB: { text: 'Manter o caminho certo', emoji: '🛤️', biblical: true },
      verse: 'Provérbios 14:12',
    },
    {
      situation: 'Um prisioneiro implora para ser solto. O guarda está dormindo.',
      optionA: { text: 'Soltar o prisioneiro', emoji: '🔓', biblical: true },
      optionB: { text: 'Não interferir', emoji: '🤷', biblical: false },
      verse: 'Isaías 61:1',
    },
    {
      situation: 'Na Feira da Vaidade, vendem um mapa que promete mostrar a Cidade Celestial.',
      optionA: { text: 'Comprar o mapa', emoji: '🗺️', biblical: false },
      optionB: { text: 'Confiar na Palavra', emoji: '📖', biblical: true },
      verse: 'Salmos 119:105',
    },
  ];

  const [dilemma] = useState(() => dilemmas[Math.floor(Math.random() * dilemmas.length)]);
  const [votes, setVotes] = useState<Record<string, 'A' | 'B'>>({});
  const [phase, setPhase] = useState<'discuss' | 'vote' | 'result'>('discuss');
  const [result, setResult] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(15);

  // Discussion countdown
  useEffect(() => {
    if (phase !== 'discuss') return;
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { setPhase('vote'); return 20; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Vote countdown
  useEffect(() => {
    if (phase !== 'vote') return;
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) {
          // Auto-resolve
          const votesA = Object.values(votes).filter(v => v === 'A').length;
          const votesB = Object.values(votes).filter(v => v === 'B').length;
          const majorityA = votesA >= votesB;
          const won = majorityA ? dilemma.optionA.biblical : dilemma.optionB.biblical;
          setResult(won);
          setPhase('result');
          if (won) playPositiveEvent(); else playNegativeEvent();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, votes, dilemma]);

  const handleVote = (choice: 'A' | 'B', voterIdx: number) => {
    if (phase !== 'vote') return;
    setVotes(prev => ({ ...prev, [`p${voterIdx}`]: choice }));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleResolve = () => {
    const votesA = Object.values(votes).filter(v => v === 'A').length;
    const votesB = Object.values(votes).filter(v => v === 'B').length;
    const majorityA = votesA >= votesB;
    const won = majorityA ? dilemma.optionA.biblical : dilemma.optionB.biblical;
    setResult(won);
    setPhase('result');
    if (won) playPositiveEvent(); else playNegativeEvent();
  };

  useEffect(() => {
    if (phase === 'result' && result !== null) {
      const t = setTimeout(() => onResult(result), 3000);
      return () => clearTimeout(t);
    }
  }, [phase, result, onResult]);

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      {phase === 'discuss' && (
        <>
          <p className="text-xs font-display text-amber-400 uppercase tracking-widest">⚖️ Dilema Moral</p>
          <p className="text-sm font-display text-white/90 text-center leading-relaxed">{dilemma.situation}</p>
          <p className="text-xs text-white/40 italic">Discutam em grupo! ⏱ {countdown}s</p>
          <div className="w-full space-y-2 mt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-2xl">{dilemma.optionA.emoji}</span>
              <p className="text-xs text-white/70 mt-1">{dilemma.optionA.text}</p>
            </div>
            <p className="text-center text-xs text-white/30">— ou —</p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-2xl">{dilemma.optionB.emoji}</span>
              <p className="text-xs text-white/70 mt-1">{dilemma.optionB.text}</p>
            </div>
          </div>
          <button onClick={() => { setPhase('vote'); setCountdown(20); }} className="mt-2 px-6 py-2 rounded-lg bg-primary/20 border border-primary/40 text-sm font-display text-primary active:scale-95 transition-transform">
            Votar agora
          </button>
        </>
      )}
      {phase === 'vote' && (
        <>
          <p className="text-xs font-display text-amber-400 uppercase tracking-widest">🗳️ Hora de votar! ⏱ {countdown}s</p>
          <p className="text-xs text-white/50">Cada jogador toque em sua escolha:</p>
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <button onClick={() => handleVote('A', Object.keys(votes).length)} className="py-4 rounded-xl bg-blue-900/30 border-2 border-blue-500/40 text-center active:scale-95 transition-all">
              <span className="text-3xl block">{dilemma.optionA.emoji}</span>
              <p className="text-xs text-white/70 mt-1">{dilemma.optionA.text}</p>
              <p className="text-xs text-blue-300 mt-1">{Object.values(votes).filter(v => v === 'A').length} voto(s)</p>
            </button>
            <button onClick={() => handleVote('B', Object.keys(votes).length)} className="py-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/40 text-center active:scale-95 transition-all">
              <span className="text-3xl block">{dilemma.optionB.emoji}</span>
              <p className="text-xs text-white/70 mt-1">{dilemma.optionB.text}</p>
              <p className="text-xs text-purple-300 mt-1">{Object.values(votes).filter(v => v === 'B').length} voto(s)</p>
            </button>
          </div>
          {Object.keys(votes).length >= 2 && (
            <button onClick={handleResolve} className="mt-2 px-6 py-2 rounded-lg bg-amber-900/30 border border-amber-500/40 text-sm font-display text-amber-300 active:scale-95">
              Revelar resultado
            </button>
          )}
        </>
      )}
      {phase === 'result' && (
        <div className="text-center space-y-3">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result ? 'O grupo escolheu com sabedoria!' : 'O grupo se desviou do caminho...'}
          </p>
          <p className="text-xs text-white/50 italic">📖 {dilemma.verse}</p>
        </div>
      )}
    </div>
  );
}

// Duel Game — two players compete in quick reflex (GROUP RPG MECHANIC)
function DuelGame({ onResult }: { onResult: (won: boolean) => void }) {
  const [phase, setPhase] = useState<'ready' | 'wait' | 'strike' | 'done'>('ready');
  const [striker, setStriker] = useState<'left' | 'right' | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (phase === 'ready') {
      const t = setTimeout(() => setPhase('wait'), 2000);
      return () => clearTimeout(t);
    }
    if (phase === 'wait') {
      const delay = 1500 + Math.random() * 3000;
      const t = setTimeout(() => setPhase('strike'), delay);
      return () => clearTimeout(t);
    }
    if (phase === 'strike') {
      // Auto-timeout — nobody struck in time
      const t = setTimeout(() => {
        setPhase('done');
        setResult(false);
        playNegativeEvent();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleStrike = (side: 'left' | 'right') => {
    if (phase === 'wait') {
      // Too early — penalty
      setPhase('done');
      setStriker(side);
      setResult(false);
      playNegativeEvent();
      return;
    }
    if (phase === 'strike') {
      setPhase('done');
      setStriker(side);
      setResult(true); // First to tap wins
      playPositiveEvent();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    }
  };

  useEffect(() => {
    if (phase === 'done' && result !== null) {
      const t = setTimeout(() => onResult(result), 2000);
      return () => clearTimeout(t);
    }
  }, [phase, result, onResult]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-xs font-display text-red-400 uppercase tracking-widest">⚔️ Duelo de Reflexo!</p>
      <p className="text-xs text-white/50">Dois jogadores: cada um toca um lado. Primeiro a tocar quando aparecer ⚔️ vence!</p>
      
      {phase === 'ready' && (
        <p className="text-lg font-display text-white/80 animate-pulse">Preparem-se...</p>
      )}
      
      <div className="w-full flex gap-3">
        <button
          onClick={() => handleStrike('left')}
          disabled={phase === 'done'}
          className="flex-1 h-32 rounded-2xl flex items-center justify-center text-4xl transition-all active:scale-90"
          style={{
            background: phase === 'strike' ? 'hsl(120 40% 20%)' : phase === 'wait' ? 'hsl(0 40% 15%)' : 'hsl(0 0% 12%)',
            border: `3px solid ${phase === 'strike' ? 'hsl(120 50% 45%)' : phase === 'wait' ? 'hsl(0 50% 40%)' : 'hsl(0 0% 25%)'}`,
            boxShadow: phase === 'strike' ? '0 0 30px hsl(120 50% 45% / 0.4)' : undefined,
          }}
        >
          {phase === 'strike' ? '⚔️' : phase === 'wait' ? '🛑' : '🗡️'}
        </button>
        <button
          onClick={() => handleStrike('right')}
          disabled={phase === 'done'}
          className="flex-1 h-32 rounded-2xl flex items-center justify-center text-4xl transition-all active:scale-90"
          style={{
            background: phase === 'strike' ? 'hsl(120 40% 20%)' : phase === 'wait' ? 'hsl(0 40% 15%)' : 'hsl(0 0% 12%)',
            border: `3px solid ${phase === 'strike' ? 'hsl(120 50% 45%)' : phase === 'wait' ? 'hsl(0 50% 40%)' : 'hsl(0 0% 25%)'}`,
            boxShadow: phase === 'strike' ? '0 0 30px hsl(120 50% 45% / 0.4)' : undefined,
          }}
        >
          {phase === 'strike' ? '⚔️' : phase === 'wait' ? '🛑' : '🗡️'}
        </button>
      </div>

      {phase === 'wait' && <p className="text-sm text-red-300 font-display animate-pulse">ESPEREM... Não toquem ainda!</p>}
      {phase === 'strike' && <p className="text-lg text-green-300 font-display font-bold animate-bounce">⚔️ AGORA! TOQUEM!</p>}
      
      {phase === 'done' && (
        <div className="text-center space-y-2">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result
              ? `${striker === 'left' ? 'Jogador da esquerda' : 'Jogador da direita'} venceu o duelo!`
              : striker ? 'Tocou cedo demais! Penalidade!' : 'Ninguém reagiu a tempo!'
            }
          </p>
        </div>
      )}
    </div>
  );
}

// Riddle Game — biblical riddle with timer (more engaging than hold)
function BibleRiddleGame({ onResult }: { onResult: (won: boolean) => void }) {
  const riddles = [
    { riddle: 'Tenho espada mas não sou guerreiro. Sou mais afiado que qualquer lâmina. O que sou?', answer: 'A Palavra de Deus', options: ['A Palavra de Deus', 'Um anjo', 'O vento', 'Uma rocha'] },
    { riddle: 'Sou estreita e poucos me encontram, mas levo à vida eterna. O que sou?', answer: 'A Porta Estreita', options: ['A Porta Estreita', 'O Rio Jordão', 'A Escada de Jacó', 'O Monte Sinai'] },
    { riddle: 'Caí de suas costas ao pé de um madeiro. Pesava mais que o mundo. O que sou?', answer: 'O fardo do pecado', options: ['Uma pedra', 'O fardo do pecado', 'Uma armadura', 'Um livro'] },
    { riddle: 'Prendo com correntes de dúvida e moro num castelo sombrio. Quem sou?', answer: 'Gigante Desespero', options: ['Apolion', 'Gigante Desespero', 'O Dragão', 'Rei Herodes'] },
    { riddle: 'Abro todas as portas, inclusive calabouços. Sou feita de palavras divinas. O que sou?', answer: 'A Chave da Promessa', options: ['A Espada', 'O Escudo', 'A Chave da Promessa', 'A Coroa'] },
    { riddle: 'Tudo parece brilhante e desejável em mim, mas sou apenas vaidade. Onde estou?', answer: 'Feira da Vaidade', options: ['Cidade Celestial', 'Feira da Vaidade', 'Jardim do Éden', 'Palácio do Rei'] },
  ];

  const [riddle] = useState(() => riddles[Math.floor(Math.random() * riddles.length)]);
  const [shuffledOptions] = useState(() => [...riddle.options].sort(() => Math.random() - 0.5));
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (result !== null) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { setResult(false); playNegativeEvent(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [result]);

  const handleAnswer = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const won = shuffledOptions[idx] === riddle.answer;
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
    <div className="flex flex-col items-center gap-3 p-4">
      <p className="text-xs font-display text-amber-400 uppercase tracking-widest">🧩 Enigma Bíblico · ⏱ {timeLeft}s</p>
      <p className="text-sm font-display text-white/90 text-center leading-relaxed italic">"{riddle.riddle}"</p>
      <div className="w-full space-y-2 mt-2">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={chosen !== null}
            className="w-full py-3 px-4 rounded-xl text-sm font-display transition-all active:scale-95"
            style={{
              background: chosen === i
                ? (opt === riddle.answer ? 'hsl(120 30% 15%)' : 'hsl(0 30% 15%)')
                : 'hsl(0 0% 12%)',
              border: `2px solid ${chosen === i
                ? (opt === riddle.answer ? 'hsl(120 50% 45%)' : 'hsl(0 50% 45%)')
                : chosen !== null && opt === riddle.answer ? 'hsl(120 40% 35% / 0.5)' : 'hsl(0 0% 25%)'}`,
              opacity: chosen !== null && i !== chosen && opt !== riddle.answer ? 0.4 : 1,
            }}
          >
            {opt}
            {chosen !== null && opt === riddle.answer && <span className="ml-2">✅</span>}
          </button>
        ))}
      </div>
      {result !== null && (
        <p className="text-base font-display mt-1" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
          {result ? '🧠 Sabedoria revelada!' : `A resposta era: "${riddle.answer}"`}
        </p>
      )}
    </div>
  );
}

// Simon Says — follow the pattern (harder than memory)
function SimonSaysGame({ difficulty, onResult }: { difficulty: number; onResult: (won: boolean) => void }) {
  const colors = [
    { color: 'hsl(0 60% 45%)', emoji: '🔴', label: 'Vermelho' },
    { color: 'hsl(120 50% 40%)', emoji: '🟢', label: 'Verde' },
    { color: 'hsl(210 60% 50%)', emoji: '🔵', label: 'Azul' },
    { color: 'hsl(45 80% 50%)', emoji: '🟡', label: 'Amarelo' },
  ];
  const seqLength = Math.min(3 + difficulty, 8);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<'show' | 'input' | 'done'>('show');
  const [showIdx, setShowIdx] = useState(-1);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
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
      const t = setTimeout(() => { setShowIdx(-1); setPhase('input'); }, 600);
      return () => clearTimeout(t);
    }
    if (showIdx === -1) {
      const t = setTimeout(() => setShowIdx(0), 800);
      return () => clearTimeout(t);
    }
    setActiveBtn(sequence[showIdx]);
    const t1 = setTimeout(() => setActiveBtn(null), 500);
    const t2 = setTimeout(() => setShowIdx(s => s + 1), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, showIdx, sequence]);

  const handleTap = (idx: number) => {
    if (phase !== 'input') return;
    const newSeq = [...playerSeq, idx];
    setPlayerSeq(newSeq);
    setActiveBtn(idx);
    setTimeout(() => setActiveBtn(null), 200);

    if (navigator.vibrate) navigator.vibrate(20);
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
        <p className="text-sm font-display text-white/70 animate-pulse">
          Observe a sequência de cores!
        </p>
      )}
      {phase === 'input' && (
        <p className="text-sm font-display text-white/70">
          Repita! ({playerSeq.length}/{sequence.length})
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            disabled={phase !== 'input'}
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl transition-all active:scale-90"
            style={{
              background: activeBtn === i ? c.color : `${c.color}30`,
              border: `3px solid ${activeBtn === i ? 'white' : c.color}`,
              boxShadow: activeBtn === i ? `0 0 30px ${c.color}` : 'none',
              transform: activeBtn === i ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {c.emoji}
          </button>
        ))}
      </div>
      {phase === 'done' && (
        <div className="text-center space-y-2">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result ? 'Sequência perfeita!' : 'Sequência errada!'}
          </p>
        </div>
      )}
    </div>
  );
}

// Word Scramble — unscramble a biblical word
function WordScrambleGame({ difficulty, onResult }: { difficulty: number; onResult: (won: boolean) => void }) {
  const wordPool = [
    // Easy
    { word: 'FÉ', hint: 'Confiança em Deus' },
    { word: 'PAZ', hint: 'Fruto do Espírito' },
    { word: 'LUZ', hint: 'Jesus é a...' },
    { word: 'AMOR', hint: 'O maior mandamento' },
    // Normal
    { word: 'GRAÇA', hint: 'Favor imerecido' },
    { word: 'CRUZ', hint: 'Onde Cristo morreu' },
    { word: 'FIEL', hint: 'Companheiro de Cristão' },
    { word: 'PORTA', hint: 'Estreita é a...' },
    // Hard
    { word: 'ESCUDO', hint: 'Armadura da fé' },
    { word: 'ESPADA', hint: 'A Palavra de Deus' },
    { word: 'CORAGEM', hint: 'Para enfrentar gigantes' },
    { word: 'PROMESSA', hint: 'Chave do calabouço' },
  ];
  const validWords = wordPool.filter(w => {
    if (difficulty <= 1) return w.word.length <= 4;
    if (difficulty <= 2) return w.word.length <= 5;
    return true;
  });
  const [target] = useState(() => validWords[Math.floor(Math.random() * validWords.length)]);
  const [scrambled] = useState(() => {
    const letters = target.word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // Ensure it's actually scrambled
    if (letters.join('') === target.word) {
      [letters[0], letters[letters.length - 1]] = [letters[letters.length - 1], letters[0]];
    }
    return letters;
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(difficulty <= 1 ? 15 : difficulty <= 2 ? 12 : 10);

  useEffect(() => {
    if (result !== null) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          setResult(false);
          playNegativeEvent();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [result]);

  const handleLetterTap = (idx: number) => {
    if (result !== null || selected.includes(idx)) return;
    const newSelected = [...selected, idx];
    setSelected(newSelected);
    if (navigator.vibrate) navigator.vibrate(15);

    if (newSelected.length === scrambled.length) {
      const formed = newSelected.map(i => scrambled[i]).join('');
      const won = formed === target.word;
      setResult(won);
      if (won) playPositiveEvent(); else playNegativeEvent();
    }
  };

  const handleUndo = () => {
    if (result !== null || selected.length === 0) return;
    setSelected(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (result !== null) {
      const t = setTimeout(() => onResult(result), 1800);
      return () => clearTimeout(t);
    }
  }, [result, onResult]);

  const formedWord = selected.map(i => scrambled[i]).join('');

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <p className="text-sm font-display text-white/70">Monte a palavra! ⏱ {timeLeft}s</p>
      <p className="text-xs text-white/40 italic">Dica: {target.hint}</p>

      {/* Formed word display */}
      <div className="flex gap-1 min-h-[48px] items-center">
        {target.word.split('').map((_, i) => (
          <div key={i} className="w-10 h-12 rounded-lg flex items-center justify-center text-xl font-display font-bold"
            style={{
              background: i < formedWord.length ? 'hsl(45 60% 25%)' : 'hsl(0 0% 12%)',
              border: `2px solid ${i < formedWord.length ? 'hsl(45 60% 50%)' : 'hsl(0 0% 25%)'}`,
              color: 'hsl(45 80% 80%)',
            }}
          >
            {formedWord[i] || ''}
          </div>
        ))}
      </div>

      {/* Scrambled letters */}
      <div className="flex gap-2 flex-wrap justify-center">
        {scrambled.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetterTap(i)}
            disabled={selected.includes(i) || result !== null}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-display font-bold transition-all active:scale-90"
            style={{
              background: selected.includes(i) ? 'hsl(0 0% 8%)' : 'hsl(220 20% 18%)',
              border: `2px solid ${selected.includes(i) ? 'hsl(0 0% 15%)' : 'hsl(220 30% 40%)'}`,
              color: selected.includes(i) ? 'hsl(0 0% 30%)' : 'hsl(0 0% 90%)',
              opacity: selected.includes(i) ? 0.3 : 1,
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {selected.length > 0 && result === null && (
        <button onClick={handleUndo} className="text-xs text-white/50 underline">Desfazer</button>
      )}

      {result !== null && (
        <div className="text-center space-y-1">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result ? `"${target.word}" — Correto!` : `Era "${target.word}"...`}
          </p>
        </div>
      )}
    </div>
  );
}

// Timing Bar — stop the bar at the right zone
function TimingBarGame({ difficulty, onResult }: { difficulty: number; onResult: (won: boolean) => void }) {
  const speed = 2 + difficulty * 1.5; // faster = harder
  const targetZone = { start: 35, end: 65 - difficulty * 5 }; // narrower = harder
  const [barPos, setBarPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const [stopped, setStopped] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (stopped) return;
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 16;
      lastTimeRef.current = time;
      
      setBarPos(prev => {
        let next = prev + direction * speed * delta;
        if (next >= 100) { next = 100; setDirection(-1); }
        if (next <= 0) { next = 0; setDirection(1); }
        return next;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [stopped, direction, speed]);

  const handleStop = () => {
    if (stopped) return;
    setStopped(true);
    const won = barPos >= targetZone.start && barPos <= targetZone.end;
    setResult(won);
    if (won) {
      playPositiveEvent();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    } else {
      playNegativeEvent();
      if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
    }
  };

  useEffect(() => {
    if (result !== null) {
      const t = setTimeout(() => onResult(result), 1800);
      return () => clearTimeout(t);
    }
  }, [result, onResult]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm font-display text-white/70">Pare na zona dourada!</p>
      
      {/* Bar track */}
      <div className="relative w-full h-10 rounded-full overflow-hidden" style={{
        background: 'hsl(0 0% 10%)',
        border: '2px solid hsl(0 0% 25%)',
      }}>
        {/* Target zone */}
        <div className="absolute top-0 bottom-0 rounded" style={{
          left: `${targetZone.start}%`,
          width: `${targetZone.end - targetZone.start}%`,
          background: 'hsl(45 60% 30% / 0.5)',
          border: '1px solid hsl(45 60% 50% / 0.6)',
        }} />
        {/* Moving indicator */}
        <div className="absolute top-0 bottom-0 w-3 rounded-full transition-none" style={{
          left: `${barPos}%`,
          transform: 'translateX(-50%)',
          background: stopped
            ? (result ? 'hsl(120 60% 50%)' : 'hsl(0 60% 50%)')
            : 'hsl(0 0% 90%)',
          boxShadow: `0 0 12px ${stopped
            ? (result ? 'hsl(120 60% 50% / 0.6)' : 'hsl(0 60% 50% / 0.6)')
            : 'hsl(0 0% 90% / 0.4)'}`,
        }} />
      </div>

      {!stopped ? (
        <button
          onClick={handleStop}
          className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-display font-bold active:scale-90 transition-transform"
          style={{
            background: 'radial-gradient(circle, hsl(45 40% 25%), hsl(45 30% 12%))',
            border: '3px solid hsl(45 50% 45%)',
            boxShadow: '0 0 20px hsl(45 50% 45% / 0.3)',
            color: 'hsl(45 80% 80%)',
          }}
        >
          PARE!
        </button>
      ) : (
        <div className="text-center space-y-2">
          <span className="text-5xl block">{result ? '✅' : '❌'}</span>
          <p className="text-lg font-display" style={{ color: result ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)' }}>
            {result ? 'Precisão divina!' : 'Fora do alvo...'}
          </p>
        </div>
      )}
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

export default function BoardMiniGame({ visible, tileType, playerName, onResult, phaseIdx = 0 }: BoardMiniGameProps & { phaseIdx?: number }) {
  const config = TILE_TYPES[tileType] || TILE_TYPES.normal;
  const charKey = config.characterKey;
  const charImg = charKey ? characterImages[charKey] : null;

  // Difficulty scales with phase: phases 0-1 = easy, 2-3 = medium, 4-5 = hard
  const baseDifficulty = tileType === 'giant' ? 3 : tileType === 'challenge' ? 2 : 1;
  const difficulty = Math.min(baseDifficulty + Math.floor(phaseIdx / 2), 5);

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

  // Choose mini-game based on tile type — rotates by phase for variety
  const renderMiniGame = () => {
    switch (tileType) {
      case 'scripture': return <ScriptureQuiz onResult={handleResult} />;
      case 'giant':
        // Rotate: reaction, simon says, duel, fortress defense
        if (phaseIdx % 4 === 0) return <ReactionGame difficulty={difficulty} onResult={handleResult} />;
        if (phaseIdx % 4 === 1) return <SimonSaysGame difficulty={difficulty} onResult={handleResult} />;
        if (phaseIdx % 4 === 2) return <DuelGame onResult={handleResult} />;
        return <FortressDefenseGame difficulty={difficulty} onResult={handleResult} />;
      case 'challenge':
        // Rotate between memory, word scramble, timing bar, group vote
        if (phaseIdx % 4 === 0) return <MemoryGame difficulty={difficulty} onResult={handleResult} />;
        if (phaseIdx % 4 === 1) return <WordScrambleGame difficulty={difficulty} onResult={handleResult} />;
        if (phaseIdx % 4 === 2) return <TimingBarGame difficulty={difficulty} onResult={handleResult} />;
        return <GroupVoteGame onResult={handleResult} />;
      case 'surprise':
        return phaseIdx % 3 === 0
          ? <SwipeDodgeGame onResult={handleResult} />
          : phaseIdx % 3 === 1
          ? <WordScrambleGame difficulty={difficulty} onResult={handleResult} />
          : <BibleRiddleGame onResult={handleResult} />;
      case 'blessing':
        return phaseIdx % 3 === 0
          ? <TreasureHuntGame onResult={handleResult} />
          : phaseIdx % 3 === 1
          ? <SimonSaysGame difficulty={Math.max(1, difficulty - 1)} onResult={handleResult} />
          : <BibleRiddleGame onResult={handleResult} />;
      case 'trap':
        return phaseIdx % 4 === 0
          ? <ReactionGame difficulty={Math.min(difficulty + 1, 5)} onResult={handleResult} />
          : phaseIdx % 4 === 1
          ? <TimingBarGame difficulty={Math.min(difficulty + 1, 5)} onResult={handleResult} />
          : phaseIdx % 4 === 2
          ? <RapidTapGame onResult={handleResult} />
          : <FortressDefenseGame difficulty={Math.min(difficulty + 1, 5)} onResult={handleResult} />;
      case 'shield':
        // Bible riddle or fortress defense instead of simple hold
        return phaseIdx % 2 === 0
          ? <BibleRiddleGame onResult={handleResult} />
          : <FortressDefenseGame difficulty={difficulty} onResult={handleResult} />;
      case 'current':
        return phaseIdx % 3 === 0
          ? <RapidTapGame onResult={handleResult} />
          : phaseIdx % 3 === 1
          ? <TimingBarGame difficulty={difficulty} onResult={handleResult} />
          : <DuelGame onResult={handleResult} />;
      case 'swap':
        return phaseIdx % 3 === 0
          ? <PathChoiceGame onResult={handleResult} />
          : phaseIdx % 3 === 1
          ? <GroupVoteGame onResult={handleResult} />
          : <WordScrambleGame difficulty={difficulty} onResult={handleResult} />;
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
