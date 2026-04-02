import { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, ResponseMode, ScriptureQuestion, Riddle, MoralDilemma, ActiveChallenge, BossEncounter, SpecialEvent, TrapEvent, RefugeEvent, HiddenRevelation, ChainState } from '@/data/rpg/types';
import {
  getRandomQuestion, getRandomRiddle,
  getRandomDilemma, getRandomChallenge, getRandomBoss,
  getRandomSpecialEvent, getRandomTrap, getRandomRefuge,
  getRandomResponseMode, getResponseModeLabel, getTileEventLabel,
  RotationState,
} from '@/data/rpg/rotationEngine';
import { TileEventType } from '@/data/rpg/types';
import { TileType, TILE_TYPES } from './ImmersiveBoardTypes';
import { playGameSfx, GameSfx } from '@/lib/gameSfx';
// Narration removed — text-only experience
import {
  playEvilLaugh, playCrowdCheer, playTensionDrum,
  playHolyChime, playDramaticReveal, playNarrativeChime,
} from './BoardSounds';
import { playRealSfx, getSfxForTileEvent, playNarrativeSfx } from '@/lib/realSfx';
import { getRevelation } from '@/data/rpg/revelations';
import { setChainFlag, hasChainFlag, applyChainCondition, getChainNarrativeModifier } from '@/data/rpg/chainSystem';
import { Clock, PlayCircle, BookOpen, Sparkles } from 'lucide-react';

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
  sourceTileType?: TileType;
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
  chainState?: React.MutableRefObject<ChainState>;
  currentTurn?: number;
}

type PopupPhase = 'suspense_intro' | 'context' | 'mode_reveal' | 'player_select' | 'challenge' | 'result' | 'revelation';

export default function RPGEventPopup({
  visible, difficulty, playerNames, currentPlayerIdx,
  tileEventType, sourceTileType, onResult, onDismiss, rotationState,
  chainState, currentTurn,
}: RPGEventPopupProps) {
  const [phase, setPhase] = useState<PopupPhase>('suspense_intro');
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
  const [riddleAnswerRevealed, setRiddleAnswerRevealed] = useState(false);
  const [currentRevelation, setCurrentRevelation] = useState<HiddenRevelation | null>(null);
  const [narrativeStage, setNarrativeStage] = useState(0); // 0=intro dramática, 1=contexto, 2=pergunta retórica

  const timerRef = useRef<number | null>(null);
  const narratedKeyRef = useRef('');

  // Load content when popup becomes visible
  useEffect(() => {
    if (!visible) {
      narratedKeyRef.current = '';
      
      return;
    }

    setPhase('suspense_intro');
    setSelectedAnswer(null);
    setShowResult(false);
    setResultData(null);
    setTimerActive(false);
    setHintIndex(0);
    setRiddleAnswerRevealed(false);
    setBossPhaseIdx(0);
    setBossWins(0);
    narratedKeyRef.current = '';
    setCurrentRevelation(null);
    setNarrativeStage(0);

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

    return () => 
  }, [visible, tileEventType, difficulty, playerNames, rotationState]);

  // ─── STAGED NARRATIVE: Dramatic suspense intro before context ───
  const getSuspenseText = (): { emoji: string; text: string } => {
    const playerName = playerNames[currentPlayerIdx] || 'Peregrino';
    switch (tileEventType) {
      case 'boss': return { emoji: '👹', text: `${playerName}... algo terrível se aproxima...` };
      case 'trap': return { emoji: '⚠️', text: 'O chão treme sob seus pés...' };
      case 'scripture': return { emoji: '📖', text: 'O Mestre abre o Livro Sagrado...' };
      case 'riddle': return { emoji: '🧩', text: 'Uma voz enigmática ecoa no ar...' };
      case 'challenge': return { emoji: '⚔️', text: `${playerName}, prepare-se para a provação...` };
      case 'dilemma': return { emoji: '⚖️', text: 'Uma escolha impossível se apresenta...' };
      case 'refuge': return { emoji: '🏰', text: 'Uma luz quente brilha adiante...' };
      case 'special': return { emoji: '✨', text: 'Algo inesperado acontece...' };
      default: return { emoji: '📜', text: 'O Mestre prepara suas palavras...' };
    }
  };

  // Auto-transition from suspense_intro to context
  useEffect(() => {
    if (!visible || phase !== 'suspense_intro') return;
    
    // Play dramatic sound for suspense
    playTensionDrum();
    if (tileEventType === 'boss') playRealSfx('trap', 0.3);
    else if (tileEventType === 'refuge' || tileEventType === 'special') playRealSfx('chime', 0.3);
    else playRealSfx('bell', 0.2);

    // Narrate the suspense text
    const suspense = getSuspenseText();
    const timer = window.setTimeout(() => {
      setPhase('context');
      // Play the main contextual SFX when transitioning
      playContextSfx(tileEventType);
    }, 2500); // 2.5 second dramatic buildup
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, phase]);

  // Build dramatic RPG master intro for the context (staged — more elaborate)
  const buildRPGIntro = (baseContext: string): string => {
    const playerName = playerNames[currentPlayerIdx] || 'Peregrino';
    const chainMod = chainState ? getChainNarrativeModifier(chainState.current) : '';

    // Intros diferenciadas por tipo de evento para máxima imersão
    const introsByType: Record<string, string[]> = {
      boss: [
        `O chão estremece. Uma presença maligna envolve o ar. O Mestre grita: "PREPAREM-SE! Algo terrível se aproxima..." `,
        `As tochas bruxuleiam e quase se apagam. Uma sombra gigantesca se projeta nas paredes. O Mestre sussurra com voz trêmula: "Ele está aqui..." `,
        `Um rugido ensurdecedor ecoa pelo vale! O Mestre ergue o cajado e brada: "${playerName}, esta é a hora da provação suprema!" `,
      ],
      scripture: [
        `O Mestre abre solenemente o Livro Sagrado. Suas páginas brilham como se iluminadas por dentro. "Está escrito..." ele começa com voz firme: `,
        `Um silêncio sagrado cai sobre o grupo. O Mestre ajoelha, beija o Livro e declara: "A Palavra do Rei tem uma pergunta para vocês..." `,
        `O Mestre ergue as Escrituras acima da cabeça. "Esta Palavra é espada e escudo. Mas só para quem a CONHECE. Provem seu conhecimento!" `,
      ],
      riddle: [
        `O Mestre inclina a cabeça e um sorriso enigmático cruza seu rosto. "Tenho uma charada para vocês... e somente os sábios desvendará..." `,
        `Uma voz antiga ecoa como se viesse das próprias pedras do caminho. O Mestre traduz: "Decifrem isto, peregrinos..." `,
        `O Mestre traça símbolos no ar com o cajado. "O Intérprete deixou este enigma para os dignos. Vocês são dignos?" `,
      ],
      challenge: [
        `O Mestre bate palmas TRÊS VEZES. "Chega de palavras! Agora é hora de AÇÃO! ${playerName}, prove sua fé com obras!" `,
        `"A fé sem obras é morta!" declara o Mestre, apontando o cajado. "Este desafio exige mais que conhecimento — exige CORAGEM!" `,
        `O Mestre cruza os braços e olha fixamente para o grupo. "Qualquer um pode falar de fé. Mas quem pode DEMONSTRÁ-LA?" `,
      ],
      dilemma: [
        `O Mestre fecha os olhos como se carregasse um peso. "O caminho se divide diante de vocês. Não há resposta fácil. Cada escolha tem seu preço..." `,
        `"Antes de decidir," o Mestre adverte com gravidade, "saibam: esta decisão deixará marcas. Pensem com o coração E com as Escrituras." `,
        `O Mestre olha para cada um do grupo, um por um. "O que vocês fariam se ninguém estivesse olhando? Pois Deus está. Decidam..." `,
      ],
      refuge: [
        `Uma brisa suave toca os rostos cansados. O Mestre sorri pela primeira vez em muito tempo. "Descansem, peregrinos. O Rei preparou um refúgio..." `,
        `A luz muda. O ar fica mais doce. O Mestre fala com ternura: "Nem tudo nesta jornada é luta. Às vezes, Deus simplesmente abraça..." `,
      ],
      trap: [
        `O Mestre grita: "CUIDADO! O chão não é o que parece!" Mas é tarde demais — `,
        `Um estalo sinistro ecoa no ar. O Mestre empalidece. "Vocês ativaram algo... que Deus tenha misericórdia!" `,
      ],
      special: [
        `Os olhos do Mestre se arregalam. "Isso... isso eu não esperava. Algo extraordinário está acontecendo!" `,
        `O Mestre ri — uma risada de pura alegria e surpresa. "O Rei tem um presente inesperado para vocês!" `,
      ],
    };

    const typeIntros = introsByType[tileEventType] || [
      `O Mestre ergue a voz e o silêncio pesa como chumbo. "${playerName}, ouça bem..." `,
      `Uma sombra cai sobre o grupo. O ar fica denso. O Mestre fala com gravidade: `,
      `Todos se aproximam, os rostos iluminados pela luz trêmula. O Mestre anuncia: `,
    ];

    const intro = typeIntros[Math.floor(Math.random() * typeIntros.length)];
    const chainPrefix = chainMod ? `${chainMod} ` : '';
    return `${chainPrefix}${intro}${baseContext}`;
  };

  // Apply chain conditions to modify context
  const getContextWithChain = () => {
    const item = question || riddle || dilemma;
    if (item && 'chainCondition' in item && item.chainCondition && chainState) {
      const result = applyChainCondition(chainState.current, item.chainCondition);
      if (result.modified && result.altContext) {
        return result.altContext;
      }
    }
    return null;
  };

  const getContextNarrationText = () => {
    // Check for chain-modified context first
    const chainContext = getContextWithChain();
    const raw = chainContext || question?.context || riddle?.context || dilemma?.context || challenge?.context
      || (boss && (bossPhaseIdx > 0 ? boss.phases[bossPhaseIdx]?.description : boss.narrative))
      || specialEvent?.narrative || trapEvent?.narrative || refugeEvent?.narrative || '';
    return raw ? buildRPGIntro(raw) : '';
  };

  const getChallengeNarrationText = () => {
    if (question) return question.question;
    if (riddle) return riddle.riddle;
    if (dilemma) return dilemma.situation;
    if (challenge) return `${challenge.title}. ${challenge.description}. Critério: ${challenge.successCriteria}`;
    if (boss?.phases[bossPhaseIdx]) {
      return `${boss.phases[bossPhaseIdx].description} ${boss.phases[bossPhaseIdx].question}`;
    }
    return '';
  };

  // Play contextual SFX based on event type
  const playContextSfx = useCallback((eventType: string) => {
    switch (eventType) {
      case 'boss': playEvilLaugh(); break;
      case 'trap': playTensionDrum(); break;
      case 'refuge': case 'special': playHolyChime(); break;
      case 'scripture': playNarrativeChime(); break;
      case 'riddle': playDramaticReveal(); break;
      case 'challenge': playTensionDrum(); break;
      default: playNarrativeChime();
    }
  }, []);

  // Narrate context when entering context phase
  useEffect(() => {
    if (!visible || phase !== 'context' || showResult) return;

    const text = getContextNarrationText();
    if (!text) return;

    const key = `context:${tileEventType}:${text.slice(0, 50)}`;
    if (narratedKeyRef.current === key) return;
    narratedKeyRef.current = key;

    // Play real narrative SFX based on context text
    const rawContext = question?.context || riddle?.context || dilemma?.context || challenge?.context
      || specialEvent?.narrative || trapEvent?.narrative || refugeEvent?.narrative || '';
    if (rawContext) playNarrativeSfx(rawContext);

    const timer = window.setTimeout(() => {
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, phase, question, riddle, dilemma, challenge, boss, specialEvent, trapEvent, refugeEvent]);

  // Narrate challenge text when entering challenge phase
  useEffect(() => {
    if (!visible || phase !== 'challenge' || showResult) return;

    const text = getChallengeNarrationText();
    if (!text) return;

    const key = `challenge:${bossPhaseIdx}:${text.slice(0, 50)}`;
    if (narratedKeyRef.current === key) return;
    narratedKeyRef.current = key;

    const timer = window.setTimeout(() => {
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, phase, bossPhaseIdx, showResult]);

  // Narrate result when shown + SFX
  useEffect(() => {
    if (!visible || !showResult || !resultData?.message) return;

    const key = `result:${resultData.message.slice(0, 50)}`;
    if (narratedKeyRef.current === key) return;
    narratedKeyRef.current = key;

    // Play result SFX (synth + real)
    if (resultData.success) {
      playCrowdCheer();
      const realSfx = getSfxForTileEvent(tileEventType, true);
      if (realSfx) playRealSfx(realSfx, 0.5);
    } else {
      if (boss) playEvilLaugh();
      const realSfx = getSfxForTileEvent(tileEventType, false);
      if (realSfx) playRealSfx(realSfx, 0.4);
    }

    const timer = window.setTimeout(() => {
      }, 200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, showResult, resultData]);

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
    // For riddles: reveal the answer instead of auto-failing
    if (riddle) {
      setRiddleAnswerRevealed(true);
      
      return;
    }
    playGameSfx(rpgSfx('trap'));
    setShowResult(true);
    setResultData({
      success: false,
      message: '⏰ Tempo esgotado! A resposta não veio a tempo...',
      emoji: '⏰',
    });
  }, [riddle]);

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
    } else if (specialEvent) {
      const e = specialEvent.effect;
      posAdjust = e.positions || 0;
      if (e.attribute && e.amount) attrChanges[e.attribute] = e.amount;
      affectsGroup = e.affectsGroup || false;
    } else if (trapEvent) {
      const e = trapEvent.effect;
      posAdjust = e.positions || 0;
      if (e.type === 'retreat' && posAdjust > 0) posAdjust = -posAdjust;
      if (e.type === 'stun') { stun = true; stunTurns = e.stunTurns || 1; }
      if (e.attribute && e.amount) attrChanges[e.attribute] = e.amount;
    } else if (refugeEvent) {
      const e = refugeEvent.effect;
      if (e.attribute && e.amount) attrChanges[e.attribute] = e.amount;
      posAdjust = e.positions || 0;
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
  }, [resultData, question, riddle, dilemma, challenge, boss, specialEvent, trapEvent, refugeEvent, selectedAnswer, onResult]);

  if (!visible) return null;

  const tileInfo = sourceTileType ? TILE_TYPES[sourceTileType] : getTileEventLabel(tileEventType);

  const isBoss = !!boss;
  const isBossContext = isBoss && phase === 'context' && !showResult;

  // ─── RENDER ───
  // Get content ID for revelation lookup
  const getContentId = () => question?.id || riddle?.id || dilemma?.id || boss?.id || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      style={isBossContext ? { animation: 'bossScreenShake 0.5s ease-in-out 3' } : undefined}
    >
      {/* Boss VFX overlay */}
      {isBossContext && (
        <>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle, transparent 30%, hsl(0 70% 10% / 0.6) 100%)',
            animation: 'bossPulse 2s ease-in-out infinite',
          }} />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="absolute w-1 rounded-full" style={{
                height: `${20 + Math.random() * 40}px`,
                left: `${Math.random() * 100}%`,
                bottom: '-10px',
                background: `linear-gradient(to top, hsl(${15 + Math.random() * 20} 90% 50%), transparent)`,
                animation: `bossFlame ${1 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6 + Math.random() * 0.4,
              }} />
            ))}
          </div>
        </>
      )}

      {/* ═══ SUSPENSE INTRO PHASE ═══ */}
      {phase === 'suspense_intro' && (
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
          <div className="relative">
            <div className="text-7xl" style={{
              animation: 'shake 0.15s infinite alternate',
              filter: `drop-shadow(0 0 30px ${tileInfo.color}60)`,
            }}>
              {getSuspenseText().emoji}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 animate-ping opacity-30"
                style={{ borderColor: tileInfo.color }} />
            </div>
          </div>
          <p className="text-lg font-display font-bold tracking-wider uppercase animate-pulse"
            style={{ color: tileInfo.color, textShadow: `0 0 20px ${tileInfo.color}60` }}
          >
            {getSuspenseText().text}
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                style={{ background: tileInfo.color, animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ MAIN POPUP (context, challenge, result, revelation) ═══ */}
      {phase !== 'suspense_intro' && (
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-2 bg-card"
        style={{
          borderColor: isBoss ? 'hsl(0 70% 45%)' : tileInfo.color,
          boxShadow: isBoss
            ? '0 0 60px hsl(0 70% 30% / 0.5), 0 0 120px hsl(0 50% 20% / 0.3)'
            : `0 0 40px ${tileInfo.color}40`,
          animation: 'scaleReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
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
                  {(() => {
                    const raw = question?.context || riddle?.context || dilemma?.context || challenge?.context
                      || (boss && (bossPhaseIdx > 0 ? boss.phases[bossPhaseIdx]?.description : boss.narrative))
                      || specialEvent?.narrative || trapEvent?.narrative || refugeEvent?.narrative
                      || '';
                    return raw;
                  })()}
                </p>
                {refugeEvent?.bibleVerse && (
                  <p className="mt-2 text-xs text-primary italic">📖 {refugeEvent.bibleVerse}</p>
                )}
              </div>

              {/* Special/Trap/Refuge: auto-resolve button (no timer needed) */}
              {(specialEvent || trapEvent || refugeEvent) ? (
                <button
                  onClick={() => {
                    const isPositive = !!specialEvent || !!refugeEvent;
                    playGameSfx(rpgSfx(isPositive ? 'blessing' : 'trap'));

                    const resolvedMessage = specialEvent
                      ? `${specialEvent.narrative}\n\nEfeito: ${specialEvent.title}`
                      : trapEvent
                        ? `${trapEvent.narrative}${trapEvent.escapeChallenge ? `\n\nDesafio de fuga: ${trapEvent.escapeChallenge.question}` : ''}`
                        : `${refugeEvent!.narrative}\n\n📖 ${refugeEvent!.bibleVerse}`;

                    setShowResult(true);
                    setResultData({
                      success: isPositive,
                      message: resolvedMessage,
                      emoji: specialEvent?.emoji || trapEvent?.emoji || refugeEvent?.emoji || '✨',
                    });
                  }}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-display font-bold text-sm transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${tileInfo.color}, ${tileInfo.color}CC)`,
                    color: 'white',
                    boxShadow: `0 0 20px ${tileInfo.color}40`,
                  }}
                >
                  {specialEvent ? '✨ Aceitar Bênção' : trapEvent ? '😨 Enfrentar!' : '🙏 Descansar'}
                </button>
              ) : (
                /* Start timer button for questions/riddles/challenges/bosses */
                <button
                  onClick={() => {
                    const time = question?.timerSeconds || riddle?.timerSeconds || challenge?.timerSeconds || boss?.phases[bossPhaseIdx]?.timerSeconds || 60;
                    if (dilemma) {
                      setPhase('challenge');
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
              )}
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
                {hintIndex < riddle.hints.length - 1 && !riddleAnswerRevealed && (
                  <button onClick={() => setHintIndex(prev => prev + 1)}
                    className="w-full py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground">
                    Pedir dica ({riddle.hints.length - hintIndex - 1} restantes)
                  </button>
                )}
              </div>
              {/* Answer revealed (after timer or manual reveal) */}
              {riddleAnswerRevealed && (
                <div className="p-4 rounded-xl bg-blue-500/15 border border-blue-500/30 text-center space-y-2">
                  <p className="text-xs text-blue-300 font-display">📜 A resposta correta é:</p>
                  <p className="text-lg font-display font-bold text-foreground">"{riddle.answer}"</p>
                  <p className="text-xs text-muted-foreground italic">{riddle.explanation}</p>
                  <p className="text-xs text-muted-foreground">📖 {riddle.bibleReference}</p>
                </div>
              )}
              {/* Reveal answer button (phone holder can reveal early) */}
              {!riddleAnswerRevealed && (
                <button
                  onClick={() => {
                    setRiddleAnswerRevealed(true);
                    setTimerActive(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                    
                  }}
                  className="w-full py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-sm text-blue-300 font-display hover:bg-blue-500/30 transition-all"
                >
                  👁️ Revelar Resposta
                </button>
              )}
              {/* Acertou / Errou buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {
                  playGameSfx(rpgSfx('blessing'));
                  setShowResult(true);
                  setResultData({ success: true, message: `✅ Correto! A resposta é: "${riddle.answer}"\n\n${riddle.explanation}`, emoji: '✅' });
                }} className="py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-sm font-display font-bold text-green-400 hover:bg-green-500/30 transition-all">
                  ✅ Acertou!
                </button>
                <button onClick={() => {
                  playGameSfx(rpgSfx('trap'));
                  setShowResult(true);
                  setResultData({ success: false, message: `❌ Não acertaram. A resposta era: "${riddle.answer}"\n\n${riddle.explanation}`, emoji: '❌' });
                }} className="py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-display font-bold text-red-400 hover:bg-red-500/30 transition-all">
                  ❌ Errou
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                {riddleAnswerRevealed
                  ? 'Alguém acertou? O Mestre julga e clica acima.'
                  : 'Clique em "Revelar Resposta" ou espere o tempo acabar para ver a resposta.'}
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
          {showResult && resultData && !currentRevelation && (
            <div className="space-y-4">
              <div className="text-center text-4xl">{resultData.emoji}</div>
              <div className={`p-4 rounded-xl border ${resultData.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{resultData.message}</p>
              </div>
              {/* Revelation button — only on success */}
              {resultData.success && getRevelation(getContentId()) && (
                <button
                  onClick={() => {
                    const rev = getRevelation(getContentId());
                    if (rev) {
                      setCurrentRevelation(rev);
                      playRealSfx('blessing', 0.5);
                      playHolyChime();
                      // Set chain flag if applicable
                      const item = question || riddle || dilemma;
                      if (item && 'chainTrigger' in item && item.chainTrigger && chainState) {
                        setChainFlag(chainState.current, item.chainTrigger.flag, currentTurn || 0, playerNames[currentPlayerIdx] || '');
                      }
                      
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-sm transition-all"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 80% 25%), hsl(30 70% 20%))',
                    border: '1px solid hsl(45 60% 40%)',
                    color: 'hsl(45 80% 80%)',
                    boxShadow: '0 0 20px hsl(45 60% 30% / 0.4)',
                    animation: 'goldenPulse 2s ease-in-out infinite',
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  🔓 Desbloquear Revelação Oculta
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
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

          {/* REVELATION PHASE — Deep biblical teaching */}
          {showResult && currentRevelation && (
            <div className="space-y-4">
              <div className="text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(45 80% 60%)' }} />
                <h3 className="font-display font-bold text-foreground text-lg">{currentRevelation.title}</h3>
              </div>
              <div className="p-4 rounded-xl border" style={{
                background: 'linear-gradient(135deg, hsl(45 30% 10%), hsl(30 20% 8%))',
                borderColor: 'hsl(45 40% 30%)',
              }}>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(45 30% 80%)' }}>
                  {currentRevelation.deepTeaching}
                </p>
              </div>
              {currentRevelation.historicalContext && (
                <div className="p-3 rounded-xl bg-background/50 border border-border">
                  <p className="text-xs text-muted-foreground"><strong>📚 Contexto Histórico:</strong> {currentRevelation.historicalContext}</p>
                </div>
              )}
              {currentRevelation.practicalApplication && (
                <div className="p-3 rounded-xl" style={{ background: 'hsl(120 20% 10%)', border: '1px solid hsl(120 30% 25%)' }}>
                  <p className="text-xs" style={{ color: 'hsl(120 40% 70%)' }}><strong>💡 Para o Grupo:</strong> {currentRevelation.practicalApplication}</p>
                </div>
              )}
              {currentRevelation.bibleDeepDive && (
                <p className="text-xs text-muted-foreground text-center italic">📖 Aprofundamento: {currentRevelation.bibleDeepDive}</p>
              )}
              <button
                onClick={() => { setCurrentRevelation(null); handleFinalDismiss(); }}
                className="w-full py-4 rounded-xl bg-green-600 text-white font-display font-bold text-sm"
              >
                ✨ Continuar a Jornada Iluminado
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes bossScreenShake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-4px, -2px); }
          30% { transform: translate(4px, 2px); }
          50% { transform: translate(-3px, 3px); }
          70% { transform: translate(3px, -3px); }
          90% { transform: translate(-2px, 1px); }
        }
        @keyframes bossPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes bossFlame {
          0% { transform: translateY(0) scaleY(1); opacity: 0.6; }
          50% { transform: translateY(-30px) scaleY(1.3); opacity: 1; }
          100% { transform: translateY(-60px) scaleY(0.5); opacity: 0; }
        }
        @keyframes shake {
          0% { transform: translateX(-3px) rotate(-2deg); }
          100% { transform: translateX(3px) rotate(2deg); }
        }
        @keyframes scaleReveal {
          0% { transform: scale(0.3) rotate(-3deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes goldenPulse {
          0%, 100% { box-shadow: 0 0 20px hsl(45 60% 30% / 0.4); }
          50% { box-shadow: 0 0 40px hsl(45 70% 40% / 0.6); }
        }
      `}</style>
    </div>
  );
}
