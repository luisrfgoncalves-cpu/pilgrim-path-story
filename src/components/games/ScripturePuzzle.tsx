import { useState, useEffect, useCallback } from 'react';
import { ChoiceEffect } from '@/data/story';
import { MiniGameResult } from '@/components/MiniGames';

/**
 * Scripture Puzzle — Reassemble scrambled biblical verses
 * Drag/tap words into correct order
 */

interface ScripturePuzzleProps {
  config: {
    intro: string;
    difficulty?: 'easy' | 'normal' | 'hard';
    successBonus: ChoiceEffect;
    failurePenalty: ChoiceEffect;
  };
  onComplete: (result: MiniGameResult) => void;
}

const VERSES = [
  { text: 'O Senhor é meu pastor nada me faltará', ref: 'Salmo 23:1' },
  { text: 'Ainda que eu ande pelo vale da sombra da morte não temerei mal algum', ref: 'Salmo 23:4' },
  { text: 'Porque Deus amou o mundo de tal maneira que deu seu Filho unigênito', ref: 'João 3:16' },
  { text: 'Eu sou o caminho a verdade e a vida', ref: 'João 14:6' },
  { text: 'Tudo posso naquele que me fortalece', ref: 'Filipenses 4:13' },
  { text: 'Sede fortes e corajosos não temais porque o Senhor vai convosco', ref: 'Deuteronômio 31:6' },
  { text: 'Buscareis e me encontrareis quando me buscardes de todo vosso coração', ref: 'Jeremias 29:13' },
  { text: 'Confia no Senhor de todo o teu coração', ref: 'Provérbios 3:5' },
  { text: 'O Senhor é a minha luz e a minha salvação a quem temerei', ref: 'Salmo 27:1' },
  { text: 'Combati o bom combate acabei a carreira guardei a fé', ref: '2 Timóteo 4:7' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ScripturePuzzle({ config, onComplete }: ScripturePuzzleProps) {
  const diff = config.difficulty || 'normal';
  const totalRounds = diff === 'easy' ? 2 : diff === 'hard' ? 4 : 3;
  const timePerRound = diff === 'easy' ? 30 : diff === 'hard' ? 18 : 24;

  const [phase, setPhase] = useState<'intro' | 'playing' | 'feedback' | 'result'>('intro');
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(VERSES[0]);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [feedbackText, setFeedbackText] = useState('');
  const [combo, setCombo] = useState(0);
  const [usedVerses, setUsedVerses] = useState<number[]>([]);

  const startRound = useCallback(() => {
    // Pick unused verse
    const available = VERSES.map((_, i) => i).filter(i => !usedVerses.includes(i));
    const idx = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : Math.floor(Math.random() * VERSES.length);
    
    const verse = VERSES[idx];
    setCurrentVerse(verse);
    setUsedVerses(prev => [...prev, idx]);
    
    const words = verse.text.split(' ');
    setScrambledWords(shuffle(words));
    setPlacedWords([]);
    setTimeLeft(timePerRound);
    setPhase('playing');
  }, [usedVerses, timePerRound]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time out — fail this round
          setFeedbackText('⏳ Tempo esgotado!');
          setCombo(0);
          setPhase('feedback');
          setTimeout(() => {
            const next = round + 1;
            setRound(next);
            if (next >= totalRounds) setPhase('result');
            else startRound();
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, round, totalRounds, startRound]);

  const placeWord = (word: string, idx: number) => {
    if (phase !== 'playing') return;
    const correctWords = currentVerse.text.split(' ');
    const nextIdx = placedWords.length;

    if (word === correctWords[nextIdx]) {
      const newPlaced = [...placedWords, word];
      setPlacedWords(newPlaced);
      setScrambledWords(prev => prev.filter((_, i) => i !== idx));

      if (newPlaced.length === correctWords.length) {
        // Completed verse!
        setWins(w => w + 1);
        setCombo(c => c + 1);
        const comboText = combo >= 2 ? ` 🔥 Combo x${combo + 1}!` : '';
        setFeedbackText(`✨ "${currentVerse.ref}" completo!${comboText}`);
        setPhase('feedback');
        setTimeout(() => {
          const next = round + 1;
          setRound(next);
          if (next >= totalRounds) setPhase('result');
          else startRound();
        }, 2000);
      }
    } else {
      // Wrong word — shake feedback
      setFeedbackText('❌ Palavra errada!');
      setTimeout(() => setFeedbackText(''), 800);
    }
  };

  const removeWord = () => {
    if (placedWords.length === 0) return;
    const last = placedWords[placedWords.length - 1];
    setPlacedWords(prev => prev.slice(0, -1));
    setScrambledWords(prev => [...prev, last]);
  };

  const finalScore = totalRounds > 0 ? Math.round((wins / totalRounds) * 100) : 0;
  const success = finalScore >= 50;

  useEffect(() => {
    if (phase === 'result') {
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

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-5xl">📖</div>
        <h3 className="font-display text-xl text-primary">Puzzle das Escrituras</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Monte o versículo na ordem correta!</p>
          <p>Toque nas palavras para colocá-las em ordem.</p>
          <p className="text-primary/60">⏰ {timePerRound}s por versículo · {totalRounds} versículos</p>
        </div>
        <button onClick={startRound} className="btn-medieval w-full">
          Começar!
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-5xl">{success ? '📖✨' : '📖😔'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Conhecedor das Escrituras!' : 'Continue estudando...'}
        </h3>
        <p className="text-sm text-foreground/80">
          Completou {wins} de {totalRounds} versículos ({finalScore}%)
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

  const correctWords = currentVerse.text.split(' ');

  return (
    <div className="bg-card/50 border-2 border-primary/20 rounded-2xl p-4 space-y-3">
      {/* HUD */}
      <div className="flex justify-between text-xs font-display">
        <span className="text-primary bg-card/80 px-2 py-1 rounded-lg">
          📖 {round + 1}/{totalRounds}
        </span>
        {combo >= 2 && (
          <span className="text-primary bg-primary/20 px-2 py-1 rounded-lg animate-pulse">
            🔥 x{combo}
          </span>
        )}
        <span className={`bg-card/80 px-2 py-1 rounded-lg ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
          ⏳ {timeLeft}s
        </span>
      </div>

      {/* Reference hint */}
      <p className="text-center text-xs text-primary/60 italic font-display">{currentVerse.ref}</p>

      {/* Placed words area */}
      <div
        className="min-h-[60px] p-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-wrap gap-1.5 items-start"
        onClick={removeWord}
      >
        {placedWords.length === 0 ? (
          <span className="text-xs text-muted-foreground italic w-full text-center py-2">
            Toque nas palavras abaixo para montar o versículo...
          </span>
        ) : (
          placedWords.map((word, i) => (
            <span
              key={`placed-${i}`}
              className="px-2.5 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-sm font-display text-primary animate-scale-in"
            >
              {word}
            </span>
          ))
        )}
        {/* Ghost slots for remaining */}
        {Array.from({ length: correctWords.length - placedWords.length }).map((_, i) => (
          <span
            key={`ghost-${i}`}
            className="px-2.5 py-1.5 rounded-lg border border-dashed border-border/40 text-sm text-transparent"
          >
            ___
          </span>
        ))}
      </div>

      {/* Scrambled words */}
      <div className="flex flex-wrap gap-2 justify-center">
        {scrambledWords.map((word, i) => (
          <button
            key={`word-${i}-${word}`}
            onClick={() => placeWord(word, i)}
            className="px-3 py-2 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/10 active:scale-90 transition-all text-sm font-display text-foreground"
            style={{
              boxShadow: '0 2px 0 0 hsl(30 15% 10%), 0 3px 6px hsl(0 0% 0% / 0.2)',
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedbackText && phase === 'playing' && (
        <div className="text-center animate-scale-in">
          <span className="text-sm font-display text-destructive">{feedbackText}</span>
        </div>
      )}
      {phase === 'feedback' && (
        <div className="text-center py-2 animate-scale-in">
          <span className="text-lg font-display">{feedbackText}</span>
        </div>
      )}
    </div>
  );
}
