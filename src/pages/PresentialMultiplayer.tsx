import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImmersiveBoard from '@/components/multiplayer/ImmersiveBoard';
import BoardStats from '@/components/multiplayer/BoardStats';
import { Dice3D } from '@/components/Dice3D';
import TileEventPopup from '@/components/multiplayer/TileEventPopup';
import BoardMiniGame from '@/components/multiplayer/BoardMiniGame';
import EpicVictoryScreen from '@/components/multiplayer/EpicVictoryScreen';
import PhaseTransition from '@/components/multiplayer/PhaseTransition';
import RiverOfDeath from '@/components/multiplayer/RiverOfDeath';
import GameNotification from '@/components/GameNotification';
import RPGBriefing, { GameMode } from '@/components/multiplayer/RPGBriefing';
import RPGEventPopup from '@/components/multiplayer/RPGEventPopup';
import AttributePanel from '@/components/multiplayer/AttributePanel';
import ResultFeedback from '@/components/multiplayer/ResultFeedback';
import { getCharacter, checkPassive } from '@/data/rpg/characters';
import { saveGame, loadGame, clearSave, BoardSaveData } from '@/lib/boardSaveSystem';
import { Difficulty, TileEventType as RPGTileEventType, ChainState } from '@/data/rpg/types';
import { createRotationState, RotationState } from '@/data/rpg/rotationEngine';
import { createChainState } from '@/data/rpg/chainSystem';
import {
  IMMERSIVE_BOARD_SIZE, TILES_PER_PHASE, TileType, TILE_TYPES,
  MINI_GAME_TILES, generateImmersiveTiles,
} from '@/components/multiplayer/ImmersiveBoardTypes';
import {
  playMove, playVictory, playTurnStart,
  playPhaseAmbient, playPhaseTransitionSound,
} from '@/components/multiplayer/BoardSounds';
import { startAmbientMusic, stopAmbientMusic, updateAmbientPhase } from '@/components/multiplayer/AmbientMusic';
import { playGameSfx } from '@/lib/gameSfx';
import { preloadRealSfx, playRealSfx } from '@/lib/realSfx';
import { useAudioPrewarm } from '@/hooks/useAudioPrewarm';
import { ArrowLeft } from 'lucide-react';

// ─── Extracted modules ───
import { PlayerStats, LocalPlayer, createPlayer, emptyStats } from '@/lib/boardPlayerTypes';
import { resolveTileEffect, TILE_TO_RPG_EVENT, RIVER_ZONE_START, getMiniGameEventKey, getRpgEventKey } from '@/lib/boardTileEffects';

const PresentialMultiplayer = () => {
  const navigate = useNavigate();
  useAudioPrewarm();
  preloadRealSfx();
  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [players, setPlayers] = useState<LocalPlayer[]>([createPlayer(0), createPlayer(1)]);
  const [editingNames, setEditingNames] = useState<Record<string, string>>({});
  const [currentTurn, setCurrentTurn] = useState(0);
  const [tileTypes, setTileTypes] = useState<TileType[]>([]);
  const [tileMessage, setTileMessage] = useState<{ message: string; emoji: string; tileType: TileType; playerName?: string } | null>(null);
  const [diceValue, setDiceValue] = useState(1);
  const [diceRolling, setDiceRolling] = useState(false);
  const [turnAnnounce, setTurnAnnounce] = useState<string | null>(null);
  const [finishCount, setFinishCount] = useState(0);
  const [collectiveMsg, setCollectiveMsg] = useState<string | null>(null);
  const [miniGame, setMiniGame] = useState<{ tileType: TileType; playerIdx: number; prevPosition: number; newPosition: number } | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const [isTokenMoving, setIsTokenMoving] = useState(false);
  const [returnMoveInfo, setReturnMoveInfo] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showAttrPanel, setShowAttrPanel] = useState(false);
  const [resultFeedback, setResultFeedback] = useState<{
    visible: boolean; success: boolean; message: string; emoji: string;
    posAdjust?: number; attrChanges?: Record<string, number>;
  } | null>(null);
  const tokenMovingTimerRef = useRef<number | null>(null);
  const handledMiniGameResultKeyRef = useRef<string | null>(null);
  const handledRpgResultKeyRef = useRef<string | null>(null);
  const rpgFeedbackTimerRef = useRef<number | null>(null);
  const rpgResolutionTimerRef = useRef<number | null>(null);

  const pendingMoveAfterPopup = useRef<{
    playerIdx: number;
    targetPos: number;
    attrs: Record<string, number>;
    shield?: boolean;
    stats: Partial<PlayerStats>;
    isReturnMove?: boolean;
  } | null>(null);

  // Safety: auto-reset isTokenMoving if stuck
  useEffect(() => {
    if (isTokenMoving) {
      if (tokenMovingTimerRef.current) clearTimeout(tokenMovingTimerRef.current);
      tokenMovingTimerRef.current = window.setTimeout(() => {
        setIsTokenMoving(false);
        setReturnMoveInfo(null);
        if (pendingActionRef.current) {
          const action = pendingActionRef.current;
          pendingActionRef.current = null;
          action();
        }
      }, 20000);
    } else {
      if (tokenMovingTimerRef.current) {
        clearTimeout(tokenMovingTimerRef.current);
        tokenMovingTimerRef.current = null;
      }
      setReturnMoveInfo(null);
    }
    return () => {
      if (tokenMovingTimerRef.current) clearTimeout(tokenMovingTimerRef.current);
    };
  }, [isTokenMoving]);

  useEffect(() => {
    if (miniGame) handledMiniGameResultKeyRef.current = null;
  }, [miniGame]);

  useEffect(() => {
    return () => {
      if (rpgFeedbackTimerRef.current) clearTimeout(rpgFeedbackTimerRef.current);
      if (rpgResolutionTimerRef.current) clearTimeout(rpgResolutionTimerRef.current);
    };
  }, []);

  const [showPhaseTransition, setShowPhaseTransition] = useState<number | null>(null);
  const [showRiverOfDeath, setShowRiverOfDeath] = useState<{ playerIdx: number; prevPos: number; newPos: number } | null>(null);
  const [phaseTransitionPendingAction, setPhaseTransitionPendingAction] = useState<(() => void) | null>(null);
  const lastPhaseAmbientRef = useRef(-1);

  // ─── RPG System State ───
  const [rpgDifficulty, setRpgDifficulty] = useState<Difficulty>('peregrino');
  const [rpgGameMode, setRpgGameMode] = useState<GameMode>('cooperative');
  const [rpgHostIndex, setRpgHostIndex] = useState(0);
  const rotationStateRef = useRef<RotationState>(createRotationState());
  const chainStateRef = useRef<ChainState>(createChainState());
  const [streakAnnounce, setStreakAnnounce] = useState<string | null>(null);
  const [rpgPassiveMsg, setRpgPassiveMsg] = useState<string | null>(null);
  const [rpgEvent, setRpgEvent] = useState<{
    tileType: RPGTileEventType;
    sourceTileType: TileType;
    playerIdx: number;
    prevPosition: number;
    newPosition: number;
  } | null>(null);

  useEffect(() => {
    if (rpgEvent) handledRpgResultKeyRef.current = null;
  }, [rpgEvent]);

  const startGame = (config?: { difficulty: Difficulty; gameMode: GameMode; playerNames: string[]; hostPlayerIndex: number; characterIds?: string[] }) => {
    let finalPlayers: LocalPlayer[];
    if (config) {
      setRpgDifficulty(config.difficulty);
      setRpgGameMode(config.gameMode);
      setRpgHostIndex(config.hostPlayerIndex);
      rotationStateRef.current = createRotationState();
      finalPlayers = config.playerNames.map((name, i) => createPlayer(i, name, config.characterIds?.[i]));
    } else {
      finalPlayers = players.map(p => {
        const editName = editingNames[p.id];
        return editName?.trim() ? { ...p, name: editName.trim() } : p;
      });
    }
    setPlayers(finalPlayers);
    const tiles = generateImmersiveTiles(Date.now());
    setTileTypes(tiles);
    setPhase('playing');
    setCurrentTurn(0);
    playTurnStart();
    playGameSfx('gameStart');
    playRealSfx('bell', 0.4);
    playPhaseAmbient(0);
    startAmbientMusic(0);
    lastPhaseAmbientRef.current = 0;
    setTurnAnnounce(`Vez de ${finalPlayers[0].name}!`);
    setShowPhaseTransition(0);
  };

  const resumeGame = useCallback((save: BoardSaveData) => {
    setRpgDifficulty(save.difficulty as Difficulty);
    setRpgGameMode(save.gameMode as GameMode);
    setRpgHostIndex(save.hostIndex);
    rotationStateRef.current = createRotationState();
    const restoredPlayers: LocalPlayer[] = save.players.map((p, i) => ({
      ...p,
      stats: emptyStats(),
      extraTurn: p.extraTurn || false,
      characterId: p.characterId,
      shieldHits: p.shieldHits || 0,
    }));
    setPlayers(restoredPlayers);
    setTileTypes(save.tileTypes as TileType[]);
    setCurrentTurn(save.currentTurn);
    setFinishCount(save.finishCount);
    setPhase('playing');
    playTurnStart();
    playGameSfx('gameStart');
    const currentPhase = Math.floor(Math.max(...restoredPlayers.map(p => p.position)) / TILES_PER_PHASE);
    playPhaseAmbient(currentPhase);
    startAmbientMusic(currentPhase);
    lastPhaseAmbientRef.current = currentPhase;
    setTurnAnnounce(`Partida retomada! Vez de ${restoredPlayers[save.currentTurn]?.name}!`);
    clearSave();
  }, []);

  // Auto-save every turn change
  useEffect(() => {
    if (phase !== 'playing' || players.length === 0 || tileTypes.length === 0) return;
    saveGame({
      version: 1,
      savedAt: new Date().toISOString(),
      difficulty: rpgDifficulty,
      gameMode: rpgGameMode,
      hostIndex: rpgHostIndex,
      tileTypes,
      currentTurn,
      finishCount,
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color,
        position: p.position,
        attributes: p.attributes,
        lastDice: p.lastDice,
        finished: p.finished,
        finishOrder: p.finishOrder,
        isStunned: p.isStunned,
        stunTurns: p.stunTurns,
        hasShield: p.hasShield,
        checkpoint: p.checkpoint,
        extraTurn: p.extraTurn,
        lastPhase: p.lastPhase,
        characterId: p.characterId,
        shieldHits: p.shieldHits,
      })),
    });
  }, [currentTurn, phase]);

  const handlePhaseTransitionComplete = useCallback(() => {
    setShowPhaseTransition(null);
    if (phaseTransitionPendingAction) {
      phaseTransitionPendingAction();
      setPhaseTransitionPendingAction(null);
    }
  }, [phaseTransitionPendingAction]);

  const handleTokenArrived = useCallback(() => {
    setIsTokenMoving(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(() => { action(); }, 2000);
    }
  }, []);

  const updatePlayerStats = (playerIdx: number, updates: Partial<PlayerStats>) => {
    setPlayers(prev => prev.map((p, i) => {
      if (i !== playerIdx) return p;
      const newStats = { ...p.stats };
      for (const [key, val] of Object.entries(updates)) {
        if (typeof val === 'number') {
          (newStats as any)[key] = ((newStats as any)[key] || 0) + val;
        } else if (typeof val === 'boolean') {
          (newStats as any)[key] = val;
        }
      }
      return { ...p, stats: newStats };
    }));
  };

  const handleDiceRoll = useCallback((value?: number) => {
    const player = players[currentTurn];
    if (!player || player.finished || isTokenMoving || !!tileMessage || !!miniGame || !!rpgEvent || !!resultFeedback || showRiverOfDeath || showPhaseTransition !== null) return;

    if (player.isStunned) {
      setPlayers(prev => prev.map((p, i) => i === currentTurn ? {
        ...p,
        isStunned: p.stunTurns <= 1 ? false : true,
        stunTurns: Math.max(0, p.stunTurns - 1),
      } : p));
      nextTurn();
      return;
    }

    if (player.extraTurn) {
      setPlayers(prev => prev.map((p, i) => i === currentTurn ? { ...p, extraTurn: false } : p));
    }
    const diceVal = value || (Math.floor(Math.random() * 6) + 1);
    let newPos = Math.min(player.position + diceVal, IMMERSIVE_BOARD_SIZE - 1);
    playMove();
    setIsTokenMoving(true);

    const tileType = tileTypes[newPos] || 'normal';
    const turnIdx = currentTurn;
    const prevPos = player.position;
    const prevPhase = Math.floor(prevPos / TILES_PER_PHASE);
    const newPhase = Math.floor(newPos / TILES_PER_PHASE);

    if (rpgGameMode === 'cooperative') {
      setPlayers(prev => prev.map(p => ({ ...p, position: newPos, lastDice: diceVal })));
    } else {
      setPlayers(prev => prev.map((p, i) => i === turnIdx ? { ...p, position: newPos, lastDice: diceVal } : p));
    }
    playGameSfx('diceRoll');

    const postAnimationAction = () => {
      if (newPos >= RIVER_ZONE_START && newPos < IMMERSIVE_BOARD_SIZE - 1 && !player.stats.riverCrossed) {
        setShowRiverOfDeath({ playerIdx: turnIdx, prevPos, newPos });
        return;
      }

      if (tileType === 'double_dice') {
        setPlayers(prev => prev.map((p, i) => {
          const shouldApply = rpgGameMode === 'cooperative' || i === turnIdx;
          if (!shouldApply) return p;
          return { ...p, extraTurn: true };
        }));
        playGameSfx('diceRoll');
        setTurnAnnounce(`🎲 Dado Duplo! ${player.name} joga novamente!`);
        return;
      }

      const rpgEventType = TILE_TO_RPG_EVENT[tileType] as RPGTileEventType | undefined;
      if (rpgEventType) {
        setRpgEvent({
          tileType: rpgEventType,
          sourceTileType: tileType,
          playerIdx: turnIdx,
          prevPosition: prevPos,
          newPosition: newPos,
        });
        return;
      }

      const phaseIdx = Math.floor(newPos / TILES_PER_PHASE);
      const effect = resolveTileEffect(tileType, player, players, Date.now() + newPos, phaseIdx);

      updatePlayerStats(turnIdx, effect.statUpdate);

      let finalPos = newPos;
      if (effect.resetToStart) {
        finalPos = 0;
      } else if (effect.resetToCheckpoint) {
        finalPos = player.checkpoint;
      } else {
        finalPos = Math.max(0, Math.min(newPos + effect.posAdjust, IMMERSIVE_BOARD_SIZE - 1));
      }

      const isFinished = finalPos >= IMMERSIVE_BOARD_SIZE - 1;
      const newFinishCount = isFinished ? finishCount + 1 : finishCount;
      if (isFinished) {
        setFinishCount(newFinishCount);
      }

      if (effect.collectiveEffect) {
        setCollectiveMsg(effect.collectiveEffect.message);
        setPlayers(prev => prev.map(p => {
          if (effect.collectiveEffect!.type === 'blessing_all') {
            return { ...p, attributes: {
              fe: p.attributes.fe + 1,
              perseveranca: p.attributes.perseveranca + 1,
              discernimento: p.attributes.discernimento + 1,
              coragem: p.attributes.coragem + 1,
            }};
          } else {
            return { ...p, attributes: {
              ...p.attributes,
              perseveranca: Math.max(0, p.attributes.perseveranca - 1),
            }};
          }
        }));
        setTimeout(() => setCollectiveMsg(null), 4000);
      }

      if (finalPos !== newPos) {
        setPlayers(prev => prev.map((p, i) => {
          const shouldApply = rpgGameMode === 'cooperative' || i === turnIdx;
          if (!shouldApply) return p;
          const newAttrs = { ...p.attributes };
          for (const [key, val] of Object.entries(effect.attrChanges)) {
            (newAttrs as any)[key] = Math.max(0, ((newAttrs as any)[key] || 0) + val);
          }
          return {
            ...p,
            isStunned: effect.stun,
            stunTurns: effect.stunTurns,
            hasShield: effect.shield ? true : (tileType === 'trap' || tileType === 'giant' ? false : p.hasShield),
            checkpoint: tileType === 'checkpoint' ? newPos : p.checkpoint,
            extraTurn: effect.extraTurn,
            attributes: newAttrs,
            stats: { ...p.stats, phasesCompleted: Math.floor(finalPos / TILES_PER_PHASE) },
          };
        }));

        pendingMoveAfterPopup.current = {
          playerIdx: turnIdx,
          targetPos: finalPos,
          attrs: {},
          stats: {},
          isReturnMove: finalPos < newPos || effect.resetToStart || effect.resetToCheckpoint,
        };
        if (isFinished) {
          if (rpgGameMode === 'cooperative') {
            setPlayers(prev => prev.map(p => ({ ...p, finished: true, finishOrder: 1 })));
          } else {
            setPlayers(prev => prev.map((p, i) => i !== turnIdx ? p : { ...p, finished: true, finishOrder: newFinishCount }));
          }
        }
      } else {
        setPlayers(prev => prev.map((p, i) => {
          const shouldApply = rpgGameMode === 'cooperative' || i === turnIdx;
          if (!shouldApply) return p;
          const newAttrs = { ...p.attributes };
          for (const [key, val] of Object.entries(effect.attrChanges)) {
            (newAttrs as any)[key] = Math.max(0, ((newAttrs as any)[key] || 0) + val);
          }
          return {
            ...p,
            position: finalPos,
            finished: isFinished,
            finishOrder: isFinished ? (rpgGameMode === 'cooperative' ? 1 : newFinishCount) : null,
            isStunned: effect.stun,
            stunTurns: effect.stunTurns,
            hasShield: effect.shield ? true : (tileType === 'trap' || tileType === 'giant' ? false : p.hasShield),
            checkpoint: tileType === 'checkpoint' ? finalPos : p.checkpoint,
            extraTurn: effect.extraTurn,
            attributes: newAttrs,
            stats: { ...p.stats, phasesCompleted: Math.floor(finalPos / TILES_PER_PHASE) },
          };
        }));
      }

      if (effect.passiveTriggered) {
        setStreakAnnounce(effect.passiveTriggered);
        setTimeout(() => setStreakAnnounce(null), 5000);
      }

      const passivePrefix = effect.passiveTriggered ? `\n\n${effect.passiveTriggered}` : '';
      setTileMessage({ message: effect.message + passivePrefix, emoji: effect.emoji, tileType, playerName: player.name });
    };

    pendingActionRef.current = () => {
      if (newPhase > prevPhase && newPhase <= 5) {
        playPhaseTransitionSound(newPhase);
        playPhaseAmbient(newPhase);
        updateAmbientPhase(newPhase);
        lastPhaseAmbientRef.current = newPhase;
        setPlayers(prev => prev.map((p, i) => i === turnIdx ? { ...p, lastPhase: newPhase } : p));
        setPhaseTransitionPendingAction(() => postAnimationAction);
        setShowPhaseTransition(newPhase);
      } else {
        if (lastPhaseAmbientRef.current !== newPhase) {
          playPhaseAmbient(newPhase);
          lastPhaseAmbientRef.current = newPhase;
        }
        postAnimationAction();
      }
    };
  }, [players, currentTurn, tileTypes, finishCount, isTokenMoving, tileMessage, miniGame, showRiverOfDeath, showPhaseTransition]);

  const handleRiverResult = useCallback((passed: boolean) => {
    if (!showRiverOfDeath) return;
    const { playerIdx, prevPos, newPos } = showRiverOfDeath;

    setPlayers(prev => prev.map((p, i) => {
      if (i !== playerIdx) return p;
      if (passed) {
        return {
          ...p,
          stats: { ...p.stats, riverCrossed: true },
          attributes: { ...p.attributes, fe: p.attributes.fe + 3, coragem: p.attributes.coragem + 2 },
        };
      } else {
        const retreatPos = Math.max(RIVER_ZONE_START - 3, 0);
        return {
          ...p,
          position: retreatPos,
          stats: { ...p.stats },
          attributes: { ...p.attributes, perseveranca: Math.max(0, p.attributes.perseveranca - 1) },
        };
      }
    }));

    setShowRiverOfDeath(null);

    if (passed) {
      setTileMessage({
        message: '✨ Você atravessou o Rio da Morte! A Cidade Celestial está próxima! Fé +3, Coragem +2!',
        emoji: '✨', tileType: 'blessing', playerName: players[playerIdx]?.name,
      });
    } else {
      setTileMessage({
        message: '🌊 As águas te venceram... Você recua, mas a fé ainda te sustenta.',
        emoji: '🌊', tileType: 'current', playerName: players[playerIdx]?.name,
      });
    }
  }, [showRiverOfDeath, players]);

  const nextTurn = useCallback(() => {
    setPlayers(current => {
      const activePlayers = current.filter(p => !p.finished);
      if (activePlayers.length === 0) {
        setPhase('finished');
        return current;
      }

      let next = (currentTurn + 1) % current.length;
      let tries = 0;
      while (current[next].finished && tries < current.length) {
        next = (next + 1) % current.length;
        tries++;
      }

      setCurrentTurn(next);
      playTurnStart();
      setTurnAnnounce(`Vez de ${current[next].name}!`);
      return current;
    });
  }, [currentTurn]);

  const handleTileClick = (position: number, tileType: TileType) => {
    const config = TILE_TYPES[tileType];
    setTileMessage({ message: `Casa ${position + 1}: ${config.label} — ${config.description}`, emoji: config.emoji, tileType });
  };

  const handleMiniGameResult = useCallback((won: boolean) => {
    if (!miniGame) return;

    const miniGameKey = getMiniGameEventKey(miniGame);
    if (handledMiniGameResultKeyRef.current === miniGameKey) return;
    handledMiniGameResultKeyRef.current = miniGameKey;

    const { playerIdx, prevPosition, newPosition, tileType } = miniGame;
    const player = players[playerIdx];

    if (tileType === 'giant') {
      updatePlayerStats(playerIdx, won ? { giantsDefeated: 1 } : { giantsLost: 1 });
    } else if (tileType === 'challenge') {
      updatePlayerStats(playerIdx, won ? { challengesWon: 1 } : { challengesLost: 1 });
    } else if (tileType === 'scripture') {
      updatePlayerStats(playerIdx, won ? { scripturesCorrect: 1 } : { scripturesWrong: 1 });
    }

    if (won) {
      setPlayers(prev => prev.map((p, i) => {
        if (i !== playerIdx) return p;
        return {
          ...p,
          attributes: { ...p.attributes, coragem: p.attributes.coragem + 2, fe: p.attributes.fe + 1 },
          stats: {
            ...p.stats,
            currentStreak: (p.stats.currentStreak || 0) + 1,
            maxStreak: Math.max(p.stats.maxStreak, (p.stats.currentStreak || 0) + 1),
          },
        };
      }));
      pendingMoveAfterPopup.current = null;
    } else {
      pendingMoveAfterPopup.current = {
        playerIdx,
        targetPos: prevPosition,
        attrs: { coragem: -1 },
        stats: { currentStreak: 0 },
        isReturnMove: true,
      };
    }

    setMiniGame(null);

    const winMessages: Record<string, string> = {
      scripture: `📖 ${player.name} respondeu corretamente a Escritura! A Palavra ilumina o caminho!`,
      giant: `⚔️ ${player.name} derrotou o ${TILE_TYPES[tileType].label}! Avança para o Refúgio!`,
      challenge: `⚔️ ${player.name} superou o Desafio com bravura! Avança para o Refúgio!`,
      surprise: `🎁 ${player.name} discerniu bem a Surpresa! Avança para o Refúgio!`,
      blessing: `⭐ ${player.name} encontrou a Bênção! Avança para o Refúgio!`,
      trap: `🔙 ${player.name} escapou da Armadilha a tempo!`,
      shield: `🛡️ ${player.name} manteve a coragem e recebeu o Escudo!`,
      current: `🌊 ${player.name} venceu a Correnteza! Avança para o Refúgio!`,
      swap: `🔄 ${player.name} escolheu o caminho certo na Encruzilhada!`,
    };
    const loseMessages: Record<string, string> = {
      scripture: `📖 ${player.name} errou a resposta... A Palavra é profunda. Volta para a casa ${prevPosition + 1}.`,
      giant: `💀 ${player.name} foi derrotado pelo Gigante! Volta para a casa ${prevPosition + 1}...`,
      challenge: `💀 ${player.name} não superou o Desafio... Volta para a casa ${prevPosition + 1}.`,
      surprise: `🎁 ${player.name} não discerniu bem... Volta para a casa ${prevPosition + 1}.`,
      blessing: `⭐ ${player.name} não encontrou os tesouros... Volta para a casa ${prevPosition + 1}.`,
      trap: `🔙 ${player.name} caiu na armadilha! Volta para a casa ${prevPosition + 1}.`,
      shield: `🛡️ ${player.name} fraquejou... Sem escudo desta vez. Volta para a casa ${prevPosition + 1}.`,
      current: `🌊 ${player.name} foi levado pela correnteza! Volta para a casa ${prevPosition + 1}.`,
      swap: `🔄 ${player.name} escolheu o caminho errado! Volta para a casa ${prevPosition + 1}.`,
    };
    const resultMsg = won
      ? (winMessages[tileType] || `✅ ${player.name} venceu! Avança para o Refúgio!`)
      : (loseMessages[tileType] || `❌ ${player.name} não conseguiu... Volta para a casa ${prevPosition + 1}.`);
    setTileMessage({ message: resultMsg, emoji: won ? '🏆' : '😢', tileType, playerName: player.name });
  }, [miniGame, players]);

  const handleTilePopupDismiss = useCallback(() => {
    const currentMsg = tileMessage;
    setTileMessage(null);

    const pendingMove = pendingMoveAfterPopup.current;
    if (pendingMove) {
      pendingMoveAfterPopup.current = null;
      const { playerIdx, targetPos, attrs, stats, shield, isReturnMove } = pendingMove;

      if (isReturnMove) {
        const currentPos = players[playerIdx]?.position ?? 0;
        const casasDiff = Math.abs(currentPos - targetPos);
        setReturnMoveInfo(`↩️ Voltando ${casasDiff} casa${casasDiff > 1 ? 's' : ''}...`);
      }

      setIsTokenMoving(true);
      setPlayers(prev => prev.map((p, i) => {
        const shouldMove = rpgGameMode === 'cooperative' || i === playerIdx;
        if (!shouldMove) return p;
        const newAttrs = { ...p.attributes };
        for (const [key, val] of Object.entries(attrs)) {
          (newAttrs as any)[key] = Math.max(0, ((newAttrs as any)[key] || 0) + val);
        }
        return {
          ...p,
          position: targetPos,
          attributes: newAttrs,
          hasShield: shield !== undefined ? shield : p.hasShield,
          stats: { ...p.stats, ...stats },
        };
      }));

      pendingActionRef.current = () => {
        const p = players[playerIdx];
        if (p?.extraTurn) {
          setTurnAnnounce(`🎲 ${p.name} joga de novo!`);
        } else {
          nextTurn();
        }
      };
      return;
    }

    if (currentMsg) {
      const p = players[currentTurn];
      if (p?.extraTurn) {
        setTurnAnnounce(`🎲 ${p.name} joga de novo!`);
      } else {
        nextTurn();
      }
    }
  }, [tileMessage, players, currentTurn, nextTurn, tileTypes]);

  const resetGame = () => {
    setPlayers(prev => prev.map((p, i) => createPlayer(i, p.name, p.characterId)));
    setCurrentTurn(0);
    setFinishCount(0);
    setTileTypes(generateImmersiveTiles(Date.now()));
    rotationStateRef.current = createRotationState();
    chainStateRef.current = createChainState();
    setRpgEvent(null);
    setPhase('playing');
    clearSave();
    playGameSfx('gameStart');
    playPhaseAmbient(0);
    lastPhaseAmbientRef.current = 0;
    setShowPhaseTransition(0);
  };

  // ─── RPG Event Popup result handler ───
  const handleRpgEventResult = useCallback((result: {
    success: boolean;
    posAdjust?: number;
    attrChanges?: Record<string, number>;
    stun?: boolean;
    stunTurns?: number;
    affectsGroup?: boolean;
    message: string;
    emoji: string;
  }) => {
    if (!rpgEvent) return;

    const rpgEventKey = getRpgEventKey(rpgEvent);
    if (handledRpgResultKeyRef.current === rpgEventKey) return;
    handledRpgResultKeyRef.current = rpgEventKey;

    const { playerIdx, prevPosition, newPosition } = rpgEvent;

    if (result.success) {
      updatePlayerStats(playerIdx, { challengesWon: 1 });
    } else {
      updatePlayerStats(playerIdx, { challengesLost: 1 });
    }

    // ─── Apply character passives to RPG event results ───
    const player = players[playerIdx];
    const char = player?.characterId ? getCharacter(player.characterId) : undefined;
    const passive = char?.passive.effect;
    let passiveMsg: string | null = null;

    if (result.success && passive?.type === 'scripture_bonus' && rpgEvent.tileType === 'scripture') {
      result.attrChanges = { ...result.attrChanges, discernimento: ((result.attrChanges?.discernimento) || 0) + passive.extraAttr };
      passiveMsg = `✨ ${char!.passive.name}: ${char!.name} ganha +${passive.extraAttr} Discernimento extra pela maestria nas Escrituras!`;
    }

    if (result.success && passive?.type === 'courage_aura' && rpgEvent.tileType === 'boss') {
      result.attrChanges = { ...result.attrChanges, coragem: ((result.attrChanges?.coragem) || 0) + passive.groupBonus };
      result.affectsGroup = true;
      passiveMsg = `🔥 ${char!.passive.name}: A coragem de ${char!.name} inspira TODO o grupo! +${passive.groupBonus} Coragem para todos!`;
    }

    if (result.stun && result.stunTurns && passive?.type === 'stun_reduction') {
      result.stunTurns = Math.max(0, result.stunTurns - passive.amount);
      if (result.stunTurns === 0) result.stun = false;
      passiveMsg = `🌟 ${char!.passive.name}: A luz de ${char!.name} brilha nas trevas! Paralisia reduzida!`;
    }

    if (passive?.type === 'shield_keeper' && player?.hasShield && !result.success) {
      const currentHits = player.shieldHits || 0;
      if (currentHits < passive.shieldDurability - 1) {
        passiveMsg = `🗡️ ${char!.passive.name}: O Escudo Reforçado de ${char!.name} resiste ao golpe! (${currentHits + 1}/${passive.shieldDurability} impactos)`;
      }
    }

    if (passiveMsg) {
      setRpgPassiveMsg(passiveMsg);
      setTimeout(() => setRpgPassiveMsg(null), 8000);
    }

    if (result.attrChanges) {
      setPlayers(prev => prev.map((p, i) => {
        if (i !== playerIdx && !result.affectsGroup) return p;
        if (i !== playerIdx && result.affectsGroup) {
          if (rpgGameMode !== 'cooperative') return p;
        }
        const newAttrs = { ...p.attributes };
        for (const [key, val] of Object.entries(result.attrChanges!)) {
          if (key in newAttrs) {
            (newAttrs as any)[key] = Math.max(0, Math.min(12, ((newAttrs as any)[key] || 0) + val));
          }
        }
        return { ...p, attributes: newAttrs };
      }));
    }

    const posAdj = result.posAdjust || 0;
    if (result.success && posAdj >= 0) {
      setPlayers(prev => prev.map((p, i) => {
        if (i !== playerIdx) return p;
        return {
          ...p,
          isStunned: result.stun || false,
          stunTurns: result.stunTurns || 0,
          stats: { ...p.stats, currentStreak: (p.stats.currentStreak || 0) + 1, maxStreak: Math.max(p.stats.maxStreak, (p.stats.currentStreak || 0) + 1) },
        };
      }));
      pendingMoveAfterPopup.current = posAdj > 0 ? {
        playerIdx,
        targetPos: Math.min(newPosition + posAdj, IMMERSIVE_BOARD_SIZE - 1),
        attrs: {},
        stats: {},
        isReturnMove: false,
      } : null;
    } else {
      const retreatPos = Math.max(0, newPosition + posAdj);
      setPlayers(prev => prev.map((p, i) => {
        if (i !== playerIdx) return p;
        return {
          ...p,
          isStunned: result.stun || false,
          stunTurns: result.stunTurns || 0,
          stats: { ...p.stats, currentStreak: 0 },
        };
      }));
      if (posAdj < 0) {
        pendingMoveAfterPopup.current = {
          playerIdx,
          targetPos: retreatPos,
          attrs: {},
          stats: {},
          isReturnMove: true,
        };
      }
    }

    // Streak feedback
    if (result.success) {
      const currentPlayer = players[playerIdx];
      const newStreak = (currentPlayer?.stats.currentStreak || 0) + 1;
      if (newStreak === 3) {
        setStreakAnnounce(`🔥 ${currentPlayer.name} — Sequência de Fé! 3 acertos seguidos! O Mestre está impressionado!`);
        playRealSfx('crowd_cheer', 0.5);
        setTimeout(() => setStreakAnnounce(null), 5000);
      } else if (newStreak === 5) {
        setStreakAnnounce(`⚡ ${currentPlayer.name} — INABALÁVEL! 5 acertos! "Mais que vencedores!" (Rm 8:37)`);
        playRealSfx('victory', 0.5);
        setTimeout(() => setStreakAnnounce(null), 6000);
      } else if (newStreak === 7) {
        setStreakAnnounce(`👑 ${currentPlayer.name} — LENDÁRIO! 7 acertos seguidos! O grupo celebra este momento épico!`);
        playRealSfx('fireworks', 0.6);
        setTimeout(() => setStreakAnnounce(null), 7000);
      } else if (newStreak >= 10) {
        setStreakAnnounce(`🏆 ${currentPlayer.name} — IMBATÍVEL! ${newStreak} acertos! "Tudo posso naquele que me fortalece!" (Fp 4:13)`);
        playRealSfx('fireworks', 0.7);
        setTimeout(() => setStreakAnnounce(null), 8000);
      }
    }

    if (rpgFeedbackTimerRef.current) clearTimeout(rpgFeedbackTimerRef.current);
    if (rpgResolutionTimerRef.current) clearTimeout(rpgResolutionTimerRef.current);

    setRpgEvent(null);

    const pendingMove = pendingMoveAfterPopup.current;
    const rpgPlayerIdx = playerIdx;
    rpgResolutionTimerRef.current = window.setTimeout(() => {
      if (pendingMove) {
        const { playerIdx: pIdx, targetPos, attrs, stats, shield, isReturnMove } = pendingMove;
        pendingMoveAfterPopup.current = null;
        if (isReturnMove) {
          const currentPos = players[pIdx]?.position ?? 0;
          const casasDiff = Math.abs(currentPos - targetPos);
          setReturnMoveInfo(`↩️ Voltando ${casasDiff} casa${casasDiff > 1 ? 's' : ''}...`);
        }
        setIsTokenMoving(true);
        setPlayers(prev => prev.map((p, i) => {
          const shouldMove = rpgGameMode === 'cooperative' || i === pIdx;
          if (!shouldMove) return p;
          const newAttrs = { ...p.attributes };
          for (const [key, val] of Object.entries(attrs)) {
            (newAttrs as any)[key] = Math.max(0, ((newAttrs as any)[key] || 0) + val);
          }
          return { ...p, position: targetPos, attributes: newAttrs, hasShield: shield !== undefined ? shield : p.hasShield };
        }));
        pendingActionRef.current = () => {
          if (isReturnMove) { nextTurn(); return; }
          const p2 = players[pIdx];
          if (p2?.extraTurn) { setTurnAnnounce(`🎲 ${p2.name} joga de novo!`); } else { nextTurn(); }
        };
      } else {
        const p = players[rpgPlayerIdx];
        if (p?.extraTurn) {
          setTurnAnnounce(`🎲 ${p.name} joga de novo!`);
        } else {
          nextTurn();
        }
      }
    }, 800);
  }, [rpgEvent, players, rpgGameMode]);

  // ─── SETUP ───
  if (phase === 'setup') {
    return (
      <RPGBriefing
        onStart={startGame}
        onResume={resumeGame}
        onBack={() => navigate('/multiplayer')}
      />
    );
  }

  // ─── GAME & FINISHED ───
  const currentPlayer = players[currentTurn];
  const allFinished = players.every(p => p.finished);

  if (allFinished && phase !== 'finished') {
    setPhase('finished');
    clearSave();
  }

  if (phase === 'finished') {
    return (
      <EpicVictoryScreen
        players={players.map(p => ({ ...p, stats: p.stats }))}
        onPlayAgain={resetGame}
        onExit={() => navigate('/multiplayer')}
      />
    );
  }

  const boardPlayers = players.map(p => ({
    id: p.id, name: p.name, color: p.color,
    position: p.position, finished: p.finished, isStunned: p.isStunned,
  }));

  if (showStats) {
    return <BoardStats players={players} onClose={() => setShowStats(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showPhaseTransition !== null && (
        <PhaseTransition phaseIdx={showPhaseTransition} onComplete={handlePhaseTransitionComplete} />
      )}

      {showRiverOfDeath && (
        <RiverOfDeath playerName={players[showRiverOfDeath.playerIdx]?.name || ''} onResult={handleRiverResult} />
      )}

      <GameNotification visible={!!turnAnnounce} onDismiss={() => setTurnAnnounce(null)} duration={4000} position="top-offset">
        <div className="px-6 py-3 rounded-2xl font-display text-lg" style={{
          background: 'linear-gradient(135deg, hsl(40 60% 20%), hsl(40 50% 15%))',
          border: '1px solid hsl(40 60% 55% / 0.5)',
          color: 'hsl(40 80% 70%)',
          boxShadow: '0 0 40px hsl(40 60% 55% / 0.2)',
        }}>
          🎲 {turnAnnounce}
        </div>
      </GameNotification>

      <GameNotification visible={!!streakAnnounce} onDismiss={() => setStreakAnnounce(null)} duration={6000} position="top-offset">
        <div className="px-6 py-3 rounded-2xl font-display text-base" style={{
          background: 'linear-gradient(135deg, hsl(25 80% 20%), hsl(15 70% 15%))',
          border: '1px solid hsl(30 80% 55% / 0.6)',
          color: 'hsl(40 90% 80%)',
          boxShadow: '0 0 50px hsl(30 80% 50% / 0.3)',
        }}>
          {streakAnnounce}
        </div>
      </GameNotification>

      <GameNotification visible={!!collectiveMsg} onDismiss={() => setCollectiveMsg(null)} duration={4000} position="top-offset">
        <div className="px-6 py-3 rounded-2xl font-display text-base" style={{
          background: 'linear-gradient(135deg, hsl(270 40% 20%), hsl(270 30% 12%))',
          border: '1px solid hsl(270 50% 55% / 0.5)',
          color: 'hsl(270 60% 80%)',
          boxShadow: '0 0 40px hsl(270 50% 55% / 0.2)',
        }}>
          {collectiveMsg}
        </div>
      </GameNotification>

      <TileEventPopup
        visible={!!tileMessage}
        tileType={tileMessage?.tileType || 'normal'}
        message={tileMessage?.message || ''}
        emoji={tileMessage?.emoji || ''}
        playerName={tileMessage?.playerName}
        onDismiss={handleTilePopupDismiss}
      />

      <BoardMiniGame
        visible={!!miniGame}
        tileType={miniGame?.tileType || 'normal'}
        playerName={players[miniGame?.playerIdx || 0]?.name || ''}
        onResult={handleMiniGameResult}
        phaseIdx={miniGame ? Math.floor(miniGame.newPosition / TILES_PER_PHASE) : 0}
      />

      <RPGEventPopup
        visible={!!rpgEvent}
        eventKey={rpgEvent ? getRpgEventKey(rpgEvent) : 'idle'}
        difficulty={rpgDifficulty}
        playerNames={players.map(p => p.name)}
        currentPlayerIdx={rpgEvent?.playerIdx || currentTurn}
        tileEventType={rpgEvent?.tileType || 'scripture'}
        sourceTileType={rpgEvent?.sourceTileType}
        currentCharacterId={rpgEvent ? players[rpgEvent.playerIdx]?.characterId : undefined}
        passiveMessage={rpgPassiveMsg || undefined}
        onResult={handleRpgEventResult}
        onDismiss={() => { setRpgEvent(null); nextTurn(); }}
        rotationState={rotationStateRef}
        chainState={chainStateRef}
        currentTurn={currentTurn}
      />

      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/multiplayer')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-sm text-foreground flex items-center gap-1.5">
                {currentPlayer?.characterId && (() => {
                  const c = getCharacter(currentPlayer.characterId!);
                  return c ? <span>{c.emoji}</span> : null;
                })()}
                {`Vez de ${currentPlayer?.name || '...'}`}
              </h1>
              {currentPlayer && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPlayer.color }} />
                  <span className="text-[9px] text-muted-foreground">
                    Casa {currentPlayer.position + 1}/{IMMERSIVE_BOARD_SIZE} · Fase {Math.floor(currentPlayer.position / TILES_PER_PHASE) + 1}/6
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/multiplayer')}
              className="text-xs text-muted-foreground font-display bg-card px-3 py-2 rounded-lg border border-border hover:border-primary/30 active:scale-95 transition-all"
              title="Sair e salvar"
            >
              💾 Pausar
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="text-sm text-primary font-display font-bold bg-card px-4 py-2 rounded-lg border border-primary/30 hover:bg-primary/10 active:scale-95 transition-all"
            >
              Placar
            </button>
          </div>
        </div>
      </header>

      <div className="sticky top-[52px] z-20 bg-card/90 backdrop-blur-sm border-b border-border px-3 py-2 space-y-1.5">
        <div className="max-w-lg mx-auto">
          <AttributePanel
            players={players.map(p => ({
              name: p.name, color: p.color, attributes: p.attributes,
              hasShield: p.hasShield, isStunned: p.isStunned, finished: p.finished,
            }))}
            currentPlayerIdx={currentTurn}
            expanded={showAttrPanel}
            onToggle={() => setShowAttrPanel(prev => !prev)}
          />
        </div>
      </div>

      {resultFeedback && (
        <ResultFeedback
          visible={resultFeedback.visible}
          success={resultFeedback.success}
          message={resultFeedback.message}
          emoji={resultFeedback.emoji}
          posAdjust={resultFeedback.posAdjust}
          attrChanges={resultFeedback.attrChanges}
          onComplete={() => setResultFeedback(null)}
        />
      )}

      <main className="flex-1 w-full">
        <ImmersiveBoard
          tileTypes={tileTypes}
          players={boardPlayers}
          currentTurnId={currentPlayer?.id}
          onTileClick={handleTileClick}
          onTokenArrived={handleTokenArrived}
        />

        {phase === 'playing' && !currentPlayer?.finished && !tileMessage && !miniGame && !rpgEvent && !resultFeedback && !showRiverOfDeath && showPhaseTransition === null && (
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-5 px-4">
            <div className="max-w-lg mx-auto">
              {currentPlayer?.isStunned ? (
                <div className="text-center p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-lg text-destructive font-display font-bold">😵 {currentPlayer.name} está paralisado!</p>
                  <button onClick={() => handleDiceRoll(0)} className="mt-3 px-5 py-3 rounded-lg bg-card border border-border text-sm text-foreground font-display">
                    Passar a vez
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        playGameSfx('diceRoll');
                        setDiceRolling(true);
                        const result = Math.floor(Math.random() * 6) + 1;
                        setDiceValue(result);
                        setTimeout(() => {
                          setDiceRolling(false);
                          handleDiceRoll(result);
                        }, 1200);
                      }}
                      className="focus:outline-none active:scale-95 transition-transform"
                      disabled={diceRolling || isTokenMoving || !!tileMessage || !!miniGame || !!rpgEvent || !!resultFeedback || showRiverOfDeath !== null || showPhaseTransition !== null}
                    >
                      <Dice3D value={diceValue} rolling={diceRolling} size={90} color="gold" />
                    </button>
                    <p className="text-base font-display font-bold text-foreground tracking-wide"
                      style={{ textShadow: '0 0 10px hsl(40 60% 55% / 0.3)' }}
                    >
                      {diceRolling ? 'Rolando...' : isTokenMoving ? (returnMoveInfo || '🚶 Movendo...') : 'Toque no dado para jogar!'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-display">dado físico</span>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <button
                        key={n}
                        onClick={() => handleDiceRoll(n)}
                        disabled={diceRolling || isTokenMoving || !!tileMessage || !!miniGame || !!rpgEvent || !!resultFeedback || showRiverOfDeath !== null || showPhaseTransition !== null}
                        className="w-12 h-12 rounded-xl bg-card border-2 border-border text-foreground font-bold text-lg hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all font-display disabled:opacity-40"
                        style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PresentialMultiplayer;
