import { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, ResponseMode, ScriptureQuestion, Riddle, MoralDilemma, ActiveChallenge, BossEncounter, SpecialEvent, TrapEvent, RefugeEvent } from '@/data/rpg/types';
import {
  getRandomQuestion, getRandomRiddle,
  getRandomDilemma, getRandomChallenge, getRandomBoss,
  getRandomSpecialEvent, getRandomTrap, getRandomRefuge,
  getRandomResponseMode, getResponseModeLabel, getTileEventLabel,
  RotationState,
} from '@/data/rpg/rotationEngine';
import { TileEventType } from '@/data/rpg/types';
import { playGameSfx, GameSfx } from '@/lib/gameSfx';
import { Clock, PlayCircle } from 'lucide-react';

// Map RPG sound intents to available GameSfx types
const rpgSfx = (intent: string): GameSfx => {
  const map: Record<string, GameSfx> = {
    trap: 'wrong', blessing: 'correct', challenge: 'attack',
    giant: 'critical', victory: 'victory',
  };
  return map[intent] || 'accept';
};

interface RPGEventPopupProps {
  visible: boolean;
  difficulty: Difficulty;
  playerNames: string[];
  currentPlayerIdx: number;
  tileEventType: TileEventType;
  onResult: (result: {
    success: boolean;
    posAdjust?: number;
    attrChanges?: Record<string, number>;
    stun?: boolean;
    stunTurns?: number;
    affectsGroup?: boolean;
    message: string;
    emoji: string;
  }) => void;
  onDismiss: () => void;
  rotationState: React.MutableRefObject<RotationState>;
}

type PopupPhase = 'context' | 'mode_reveal' | 'player_select' | 'challenge' | 'result';

export default function RPGEventPopup({
  visible, difficulty, playerNames, currentPlayerIdx,
  tileEventType, onResult, onDismiss, rotationState,
}: RPGEventPopupProps) {
  const [phase, setPhase] = useState<PopupPhase>('context');
  const [responseMode, setResponseMode] = useState<ResponseMode>('group_consensus');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ success: boolean; message: string; emoji: string } | null>(null);

  // Current content
  const [question, setQuestion] = useState<ScriptureQuestion | null>(null);
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [dilemma, setDilemma] = useState<MoralDilemma | null>(null);
  const [challenge, setChallenge] = useState<ActiveChallenge | null>(null);
  const [boss, setBoss] = useState<BossEncounter | null>(null);
  const [specialEvent, setSpecialEvent] = useState<SpecialEvent | null>(null);
  const [trapEvent, setTrapEvent] = useState<TrapEvent | null>(null);
  const [refugeEvent, setRefugeEvent] = useState<RefugeEvent | null>(null);
  const [bossPhaseIdx, setBossPhaseIdx] = useState(0);
  const [bossWins, setBossWins] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Load content when popup becomes visible
  useEffect(() => {
    if (!visible) return;
    setPhase('context');
    setSelectedAnswer(null);
    setShowResult(false);
    setResultData(null);
    setTimerActive(false);
    setHintIndex(0);
    setBossPhaseIdx(0);
    setBossWins(0);

    // Clear all content
    setQuestion(null); setRiddle(null); setDilemma(null);
    setChallenge(null); setBoss(null);
    setSpecialEvent(null); setTrapEvent(null); setRefugeEvent(null);

    const state = rotationState.current;
    const mode = getRandomResponseMode();
    setResponseMode(mode);

    // Select player for individual modes
    if (mode === 'individual_solo' || mode === 'individual_group_help') {
      const randomIdx = Math.floor(Math.random() * playerNames.length);
      setSelectedPlayer(playerNames[randomIdx]);
    } else if (mode === 'group_picks_one') {
      setSelectedPlayer('');
    } else {
      setSelectedPlayer('');
    }

    // Load content based on tile type
    let hasContent = false;
    switch (tileEventType) {
      case 'scripture':
        { const q = getRandomQuestion(state, difficulty); setQuestion(q); hasContent = !!q; }
        break;
      case 'riddle':
        { const r = getRandomRiddle(state, difficulty); setRiddle(r); hasContent = !!r; }
        break;
      case 'dilemma':
        { const d = getRandomDilemma(state, difficulty); setDilemma(d); hasContent = !!d; }
        break;
      case 'challenge':
        { const c = getRandomChallenge(state, difficulty); setChallenge(c); hasContent = !!c; }
        break;
      case 'boss':
        { const b = getRandomBoss(state, difficulty); setBoss(b); hasContent = !!b; }
        break;
      case 'special':
        { const s = getRandomSpecialEvent(state, difficulty); setSpecialEvent(s); hasContent = !!s; }
        break;
      case 'trap':
        { const t = getRandomTrap(state); setTrapEvent(t); hasContent = !!t; }
        break;
      case 'refuge':
        { const r = getRandomRefuge(state); setRefugeEvent(r); hasContent = !!r; }
        break;
      default:
        break;
    }

    // Fallback: if no content available, auto-resolve with neutral result
    if (!hasContent) {
      setShowResult(true);
      setResultData({
        success: tileEventType === 'refuge' || tileEventType === 'special',
        message: tileEventType === 'refuge' || tileEventType === 'special'
          ? '🏠 Um momento de paz no caminho. Vocês descansam brevemente.'
          : '⚡ Algo estranho acontece... mas logo passa.',
        emoji: tileEventType === 'refuge' ? '🏠' : '⚡',
      });
    }
  }, [visible, tileEventType, difficulty, playerNames, rotationState]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          // Time's up!
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const handleTimeUp = useCallback(() => {
    playGameSfx(rpgSfx('trap'));
    setShowResult(true);
    setResultData({
      success: false,
      message: '⏰ Tempo esgotado! A resposta não veio a tempo...',
      emoji: '⏰',
    });
  }, []);

  const startTimer = useCallback((seconds: number) => {
    setTotalTime(seconds);
    setTimeLeft(seconds);
    setTimerActive(true);
    setPhase('challenge');
    playGameSfx(rpgSfx('challenge'));
  }, []);

  const handleAnswer = useCallback((answerIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIdx);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (question) {
      const correct = answerIdx === question.correctIndex;
      playGameSfx(rpgSfx(correct ? 'blessing' : 'trap'));
      setShowResult(true);
      setResultData({
        success: correct,
        message: correct
          ? `✅ Correto! ${question.explanation}`
          : `❌ Resposta errada. A correta era: "${question.options[question.correctIndex]}". ${question.explanation}`,
        emoji: correct ? '✅' : '❌',
      });
    }
  }, [selectedAnswer, question]);

  const handleDilemmaChoice = useCallback((choiceIdx: number) => {
    if (!dilemma || selectedAnswer !== null) return;
    setSelectedAnswer(choiceIdx);
    setTimerActive(false);

    const choice = dilemma.choices[choiceIdx];
    const isPositive = choice.effect.type === 'advance' || choice.effect.type === 'boost';
    playGameSfx(rpgSfx(isPositive ? 'blessing' : 'trap'));
    setShowResult(true);
    setResultData({
      success: isPositive,
      message: `${choice.consequence}\n\n📖 ${dilemma.bibleReference}: ${dilemma.lesson}`,
      emoji: isPositive ? '✨' : '😔',
    });
  }, [dilemma, selectedAnswer]);

  const handleBossPhaseAnswer = useCallback((answerIdx: number) => {
    if (!boss || selectedAnswer !== null) return;
    setSelectedAnswer(answerIdx);
    setTimerActive(false);

    const currentPhase = boss.phases[bossPhaseIdx];
    const correct = answerIdx === currentPhase.correctIndex;

    if (correct) {
      const newWins = bossWins + 1;
      setBossWins(newWins);

      if (bossPhaseIdx + 1 >= boss.phases.length) {
        // Boss defeated!
        playGameSfx('victory');
        setShowResult(true);
        setResultData({
          success: true,
          message: boss.victoryNarrative,
          emoji: '🏆',
        });
      } else {
        // Next phase
        playGameSfx(rpgSfx('blessing'));
        setTimeout(() => {
          setBossPhaseIdx(prev => prev + 1);
          setSelectedAnswer(null);
          setTimerActive(false);
          setPhase('context'); // Show next phase context
        }, 1500);
      }
    } else {
      // Failed this phase
      playGameSfx(rpgSfx('giant'));
      setShowResult(true);
      setResultData({
        success: false,
        message: boss.defeatNarrative,
        emoji: '💀',
      });
    }
  }, [boss, bossPhaseIdx, bossWins, selectedAnswer]);

  const handleFinalDismiss = useCallback(() => {
    if (!resultData) { onDismiss(); return; }

    let posAdjust = 0;
    let attrChanges: Record<string, number> = {};
    let stun = false;
    let stunTurns = 0;
    let affectsGroup = false;

    if (question) {
      if (resultData.success) {
        posAdjust = 2;
        attrChanges = { discernimento: 2, fe: 1 };
      } else {
        attrChanges = { discernimento: -1 };
      }
    } else if (riddle) {
      if (resultData.success) {
        posAdjust = 3;
        attrChanges = { discernimento: 3 };
      } else {
        posAdjust = -1;
      }
    } else if (dilemma && selectedAnswer !== null) {
      const effect = dilemma.choices[selectedAnswer].effect;
      posAdjust = effect.positions || 0;
      if (effect.type === 'retreat' && posAdjust > 0) posAdjust = -posAdjust;
      if (effect.attribute && effect.amount) attrChanges[effect.attribute] = effect.amount;
      stun = effect.type === 'stun';
      stunTurns = effect.stunTurns || 0;
      affectsGroup = effect.affectsGroup || false;
    } else if (challenge) {
      const effect = resultData.success ? challenge.reward : challenge.penalty;
      posAdjust = effect.positions || 0;
      if (effect.type === 'retreat' && posAdjust > 0) posAdjust = -posAdjust;
      if (effect.attribute && effect.amount) attrChanges[effect.attribute] = effect.amount;
      affectsGroup = effect.affectsGroup || false;
    } else if (boss) {
      if (resultData.success) {
        posAdjust = 4;
        attrChanges = { coragem: 3, fe: 2 };
      } else {
        posAdjust = -3;
        attrChanges = { coragem: -2 };
        stun = true;
        stunTurns = 1;
      }
      affectsGroup = true;
    }

    onResult({
      success: resultData.success,
      posAdjust,
      attrChanges,
      stun,
      stunTurns,
      affectsGroup,
      message: resultData.message,
      emoji: resultData.emoji,
    });
  }, [resultData, question, riddle, dilemma, challenge, boss, selectedAnswer, onResult]);

  if (!visible) return null;

  const tileInfo = getTileEventLabel(tileEventType);

  // ─── RENDER ───
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-2 bg-card"
        style={{ borderColor: tileInfo.color, boxShadow: `0 0 40px ${tileInfo.color}40` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tileInfo.emoji}</span>
            <span className="font-display font-bold text-foreground">{tileInfo.label}</span>
          </div>
          {timerActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: timeLeft <= 10 ? 'hsl(0 60% 20%)' : 'hsl(210 30% 15%)',
                border: `1px solid ${timeLeft <= 10 ? 'hsl(0 60% 40%)' : 'hsl(210 30% 30%)'}`,
              }}
            >
              <Clock className="w-4 h-4" style={{ color: timeLeft <= 10 ? 'hsl(0 60% 60%)' : 'hsl(210 50% 60%)' }} />
              <span className="font-mono font-bold text-sm" style={{ color: timeLeft <= 10 ? 'hsl(0 60% 70%)' : 'hsl(210 50% 70%)' }}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* CONTEXT PHASE */}
          {phase === 'context' && !showResult && (
            <>
              {/* Response mode badge */}
              <div className="p-3 rounded-xl text-center text-sm font-display font-bold"
                style={{
                  background: 'hsl(40 30% 12%)',
                  border: '1px solid hsl(40 50% 30%)',
                  color: 'hsl(40 60% 70%)',
                }}
              >
                {getResponseModeLabel(responseMode)}
              </div>

              {/* Selected player */}
              {selectedPlayer && (responseMode === 'individual_solo' || responseMode === 'individual_group_help') && (
                <div className="p-3 rounded-xl text-center space-y-1" style={{
                  background: 'hsl(270 30% 12%)', border: '1px solid hsl(270 40% 30%)',
                }}>
                  <p className="text-xs text-muted-foreground">
                    {responseMode === 'individual_solo' ? '🎯 Sorteado para responder SOZINHO:' : '🤝 Sorteado (grupo pode ajudar):'}
                  </p>
                  <p className="text-lg font-display font-bold text-foreground">{selectedPlayer}</p>
                </div>
              )}

              {/* Context text */}
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {question?.context || riddle?.context || dilemma?.context || challenge?.context || (boss && (bossPhaseIdx > 0 ? boss.phases[bossPhaseIdx]?.description : boss.narrative)) || ''}
                </p>
              </div>

              {/* Start timer button */}
              <button
                onClick={() => {
                  const time = question?.timerSeconds || riddle?.timerSeconds || challenge?.timerSeconds || boss?.phases[bossPhaseIdx]?.timerSeconds || 60;
                  if (dilemma) {
                    setPhase('challenge'); // dilemmas don't need timer countdown first
                  } else {
                    startTimer(time);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-display font-bold text-sm transition-all"
                style={{
                  background: `linear-gradient(135deg, ${tileInfo.color}, ${tileInfo.color}CC)`,
                  color: 'white',
                  boxShadow: `0 0 20px ${tileInfo.color}40`,
                }}
              >
                <PlayCircle className="w-5 h-5" />
                {dilemma ? 'Revelar Dilema' : '⏱️ Iniciar Cronômetro — Pesquisem na Bíblia!'}
              </button>
            </>
          )}

          {/* CHALLENGE PHASE — Question */}
          {phase === 'challenge' && !showResult && question && (
            <div className="space-y-4">
              <p className="text-sm font-display font-bold text-foreground">{question.question}</p>
              <div className="grid gap-2">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 rounded-xl border text-left text-sm transition-all ${
                      selectedAnswer === i
                        ? i === question.correctIndex ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'
                        : selectedAnswer !== null && i === question.correctIndex ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-card/50 border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="font-bold text-muted-foreground mr-2">{String.fromCharCode(65 + i)})</span>
                    <span className="text-foreground">{opt}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center">📖 {question.bibleReference}</p>
            </div>
          )}

          {/* CHALLENGE PHASE — Riddle */}
          {phase === 'challenge' && !showResult && riddle && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm font-display font-bold text-foreground text-center">{riddle.riddle}</p>
              </div>
              {/* Hints */}
              <div className="space-y-2">
                {riddle.hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <div key={i} className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    💡 Dica {i + 1}: {hint}
                  </div>
                ))}
                {hintIndex < riddle.hints.length - 1 && (
                  <button onClick={() => setHintIndex(prev => prev + 1)}
                    className="w-full py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground">
                    Pedir dica ({riddle.hints.length - hintIndex - 1} restantes)
                  </button>
                )}
              </div>
              {/* Answer buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {
                  playGameSfx(rpgSfx('blessing'));
                  setShowResult(true);
                  setResultData({ success: true, message: `✅ Correto! A resposta é: "${riddle.answer}"\n\n${riddle.explanation}`, emoji: '✅' });
                }} className="py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-sm font-display font-bold text-green-400">
                  ✅ Acertou!
                </button>
                <button onClick={() => {
                  playGameSfx(rpgSfx('trap'));
                  setShowResult(true);
                  setResultData({ success: false, message: `❌ Não acertaram. A resposta era: "${riddle.answer}"\n\n${riddle.explanation}`, emoji: '❌' });
                }} className="py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-display font-bold text-red-400">
                  ❌ Errou
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                O Mestre (quem segura o celular) julga se a resposta está correta.
              </p>
            </div>
          )}

          {/* CHALLENGE PHASE — Dilemma */}
          {phase === 'challenge' && !showResult && dilemma && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-foreground leading-relaxed">{dilemma.situation}</p>
              </div>
              <div className="grid gap-2">
                {dilemma.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleDilemmaChoice(i)}
                    disabled={selectedAnswer !== null}
                    className="p-3 rounded-xl border border-border bg-card/50 text-left text-sm text-foreground hover:border-primary/30 transition-all"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CHALLENGE PHASE — Active Challenge */}
          {phase === 'challenge' && !showResult && challenge && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-foreground text-center">{challenge.title}</h3>
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <p className="text-sm text-foreground leading-relaxed">{challenge.description}</p>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground"><strong>Critério:</strong> {challenge.successCriteria}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {
                  playGameSfx(rpgSfx('blessing'));
                  setShowResult(true);
                  setResultData({ success: true, message: '🏆 Desafio cumprido com sucesso! O grupo celebra!', emoji: '🏆' });
                }} className="py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-sm font-display font-bold text-green-400">
                  ✅ Completou!
                </button>
                <button onClick={() => {
                  playGameSfx(rpgSfx('trap'));
                  setShowResult(true);
                  setResultData({ success: false, message: '😔 O desafio não foi completado. A jornada continua...', emoji: '😔' });
                }} className="py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-display font-bold text-red-400">
                  ❌ Falhou
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                O Mestre julga se o desafio foi cumprido conforme os critérios.
              </p>
            </div>
          )}

          {/* CHALLENGE PHASE — Boss */}
          {phase === 'challenge' && !showResult && boss && boss.phases[bossPhaseIdx] && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-red-400">{boss.bossName}</h3>
                <p className="text-xs text-muted-foreground">Fase {bossPhaseIdx + 1}/{boss.phases.length}</p>
              </div>
              <p className="text-sm font-display font-bold text-foreground">{boss.phases[bossPhaseIdx].question}</p>
              {boss.phases[bossPhaseIdx].options && (
                <div className="grid gap-2">
                  {boss.phases[bossPhaseIdx].options!.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleBossPhaseAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`p-3 rounded-xl border text-left text-sm transition-all ${
                        selectedAnswer === i
                          ? i === boss.phases[bossPhaseIdx].correctIndex ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'
                          : 'bg-card/50 border-border hover:border-red-500/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESULT PHASE */}
          {showResult && resultData && (
            <div className="space-y-4">
              <div className="text-center text-4xl">{resultData.emoji}</div>
              <div className={`p-4 rounded-xl border ${resultData.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{resultData.message}</p>
              </div>
              <button
                onClick={handleFinalDismiss}
                className={`w-full py-4 rounded-xl font-display font-bold text-sm ${
                  resultData.success ? 'bg-green-600 text-white' : 'bg-red-900/50 text-red-200 border border-red-500/30'
                }`}
              >
                {resultData.success ? '✨ Continuar a Jornada' : '😔 Aceitar e Continuar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
