import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImmersiveBoard from '@/components/multiplayer/ImmersiveBoard';
import { Dice3D } from '@/components/Dice3D';
import TileEventPopup from '@/components/multiplayer/TileEventPopup';
import BoardMiniGame from '@/components/multiplayer/BoardMiniGame';
import EpicVictoryScreen from '@/components/multiplayer/EpicVictoryScreen';
import PhaseTransition from '@/components/multiplayer/PhaseTransition';
import RiverOfDeath from '@/components/multiplayer/RiverOfDeath';
import GameNotification from '@/components/GameNotification';
import { boardEvents, BoardEvent } from '@/lib/multiplayerTypes';
import {
  IMMERSIVE_BOARD_SIZE, TILES_PER_PHASE, TileType, TILE_TYPES,
  MINI_GAME_TILES, generateImmersiveTiles,
} from '@/components/multiplayer/ImmersiveBoardTypes';
import { getPhaseNarrative } from '@/components/multiplayer/PhaseNarratives';
import {
  playMove, playVictory, playTurnStart,
  playPhaseAmbient, playPhaseTransitionSound,
} from '@/components/multiplayer/BoardSounds';
import { playGameSfx } from '@/lib/gameSfx';
import { ArrowLeft, Users, Trophy, Plus, Minus, Dices, Crown } from 'lucide-react';
import ScreenHero from '@/components/ScreenHero';

const COLORS = ['#E8724A', '#4CAF50', '#42A5F5', '#FFD54F', '#AB47BC', '#EF5350', '#26C6DA', '#FF7043'];
const DEFAULT_NAMES = ['Cristão', 'Fiel', 'Esperança', 'Misericórdia', 'Valente', 'Honesto', 'Prudência', 'Caridade'];

// ─── Stats tracking ───
interface PlayerStats {
  trapsHit: number;
  challengesWon: number;
  challengesLost: number;
  blessingsReceived: number;
  giantsDefeated: number;
  giantsLost: number;
  scripturesCorrect: number;
  scripturesWrong: number;
  tilesVisited: number;
  maxStreak: number;      // consecutive positive outcomes
  currentStreak: number;
  backToStartCount: number;
  shieldsGained: number;
  swapsTriggered: number;
  phasesCompleted: number;
  riverCrossed: boolean;
}

function emptyStats(): PlayerStats {
  return {
    trapsHit: 0, challengesWon: 0, challengesLost: 0,
    blessingsReceived: 0, giantsDefeated: 0, giantsLost: 0,
    scripturesCorrect: 0, scripturesWrong: 0, tilesVisited: 0,
    maxStreak: 0, currentStreak: 0, backToStartCount: 0,
    shieldsGained: 0, swapsTriggered: 0, phasesCompleted: 0,
    riverCrossed: false,
  };
}

interface LocalPlayer {
  id: string;
  name: string;
  color: string;
  position: number;
  attributes: { fe: number; perseveranca: number; discernimento: number; coragem: number };
  lastDice: number | null;
  finished: boolean;
  finishOrder: number | null;
  isStunned: boolean;
  stunTurns: number;
  hasShield: boolean;
  checkpoint: number;
  extraTurn: boolean;
  stats: PlayerStats;
  lastPhase: number; // track which phase they were in
}

function createPlayer(index: number, name?: string): LocalPlayer {
  return {
    id: `p${index}`,
    name: name || DEFAULT_NAMES[index] || `Jogador ${index + 1}`,
    color: COLORS[index % COLORS.length],
    position: 0,
    attributes: { fe: 3, perseveranca: 3, discernimento: 3, coragem: 3 },
    lastDice: null,
    finished: false,
    finishOrder: null,
    isStunned: false,
    stunTurns: 0,
    hasShield: false,
    checkpoint: 0,
    extraTurn: false,
    stats: emptyStats(),
    lastPhase: 0,
  };
}

// ─── Expanded MINI_GAME_TILES ───
const EXPANDED_MINI_GAME_TILES: TileType[] = ['giant', 'challenge', 'scripture', 'surprise', 'blessing'];

// ─── River of Death tiles: last 5 tiles before finish ───
const RIVER_ZONE_START = IMMERSIVE_BOARD_SIZE - 6; // tiles 114-118 are the river zone

// ─── Tile effect resolution with phase narratives ───
function resolveTileEffect(
  tileType: TileType,
  player: LocalPlayer,
  allPlayers: LocalPlayer[],
  seed: number,
  phaseIdx: number,
): {
  posAdjust: number;
  attrChanges: Record<string, number>;
  stun: boolean;
  stunTurns: number;
  shield: boolean;
  extraTurn: boolean;
  resetToCheckpoint: boolean;
  resetToStart: boolean;
  message: string;
  emoji: string;
  statUpdate: Partial<PlayerStats>;
  collectiveEffect?: { type: 'blessing_all' | 'curse_all'; message: string };
} {
  const rng = ((seed * 1103515245 + 12345) & 0x7fffffff) % 100;
  const result: ReturnType<typeof resolveTileEffect> = {
    posAdjust: 0, attrChanges: {} as Record<string, number>,
    stun: false, stunTurns: 0, shield: false, extraTurn: false,
    resetToCheckpoint: false, resetToStart: false, message: '', emoji: '',
    statUpdate: { tilesVisited: 1 },
  };

  const narrative = getPhaseNarrative(phaseIdx, tileType, seed);

  switch (tileType) {
    case 'refuge':
      result.attrChanges = { fe: 1, perseveranca: 1 };
      result.message = narrative || '🏠 Refúgio! Você descansa e recupera forças.';
      result.emoji = '🏠';
      break;
    case 'challenge':
      if (rng >= 40) {
        result.posAdjust = 3;
        result.attrChanges = { coragem: 2 };
        result.message = narrative || '⚔️ Desafio vencido! Avance 3 casas!';
        result.statUpdate.challengesWon = 1;
      } else {
        result.posAdjust = -2;
        result.attrChanges = { coragem: -1 };
        result.message = narrative || '⚔️ Desafio perdido! Recue 2 casas.';
        result.statUpdate.challengesLost = 1;
      }
      result.emoji = '⚔️';
      break;
    case 'surprise':
      if (rng >= 50) {
        result.posAdjust = 2;
        result.attrChanges = { fe: 1 };
        result.message = narrative || '🎁 Surpresa boa! Avance 2 casas!';
        if (rng > 80) {
          result.collectiveEffect = {
            type: 'blessing_all',
            message: '✨ Bênção coletiva! Todos os peregrinos ganham +1 Fé!',
          };
        }
      } else {
        result.posAdjust = -1;
        result.message = narrative || '🎁 Surpresa ruim... Recue 1 casa.';
        if (rng < 15) {
          result.collectiveEffect = {
            type: 'curse_all',
            message: '⚠️ Provação coletiva! Todos os peregrinos perdem -1 Perseverança!',
          };
        }
      }
      result.emoji = '🎁';
      break;
    case 'scripture':
      if (rng >= 35) {
        result.posAdjust = 2;
        result.attrChanges = { discernimento: 2, fe: 1 };
        result.message = narrative || '📖 Palavra acertada! Discernimento +2, avance 2!';
        result.statUpdate.scripturesCorrect = 1;
      } else {
        result.attrChanges = { discernimento: -1 };
        result.message = narrative || '📖 Resposta errada... Discernimento -1.';
        result.statUpdate.scripturesWrong = 1;
      }
      result.emoji = '📖';
      break;
    case 'trap':
      if (player.hasShield) {
        result.message = '🛡️ Seu escudo te protegeu da armadilha!';
        result.emoji = '🛡️';
      } else {
        result.posAdjust = -3;
        result.attrChanges = { perseveranca: -1 };
        result.message = narrative || '🔙 Armadilha! Recue 3 casas!';
        result.emoji = '🔙';
        result.statUpdate.trapsHit = 1;
      }
      break;
    case 'giant':
      if (player.hasShield) {
        result.message = '🛡️ Seu escudo te protegeu do Gigante!';
        result.emoji = '🛡️';
      } else if (rng >= 70) {
        result.stun = true;
        result.stunTurns = 1;
        result.message = narrative || '💀 O Gigante te capturou! Perde 1 turno.';
        result.emoji = '💀';
        result.statUpdate.giantsLost = 1;
      } else {
        result.resetToCheckpoint = true;
        result.attrChanges = { coragem: -2 };
        result.message = narrative || '💀 O Gigante te esmaga! Volta ao checkpoint!';
        result.emoji = '💀';
        result.statUpdate.giantsLost = 1;
      }
      break;
    case 'shield':
      result.shield = true;
      result.attrChanges = { coragem: 1 };
      result.message = narrative || '🛡️ Armadura de Deus! Proteção ativada!';
      result.emoji = '🛡️';
      result.statUpdate.shieldsGained = 1;
      break;
    case 'blessing':
      result.posAdjust = 4;
      result.attrChanges = { fe: 2 };
      result.message = narrative || '⭐ Bênção divina! Avance 4 casas!';
      result.emoji = '⭐';
      result.statUpdate.blessingsReceived = 1;
      if (rng < 25) {
        result.collectiveEffect = {
          type: 'blessing_all',
          message: '🌟 Bênção irradiante! Todos ganham +1 em todos os atributos!',
        };
      }
      break;
    case 'swap':
      result.message = narrative || '🔄 Troca de caminhos! Posições trocadas!';
      result.emoji = '🔄';
      result.statUpdate.swapsTriggered = 1;
      break;
    case 'double_dice':
      result.extraTurn = true;
      result.message = '🎲 Dado duplo! Jogue novamente!';
      result.emoji = '🎲';
      break;
    case 'current':
      if (rng >= 50) {
        result.posAdjust = 3;
        result.message = narrative || '🌊 Correnteza favorável! Avance 3!';
      } else {
        result.posAdjust = -2;
        result.message = narrative || '🌊 Correnteza adversa! Recue 2!';
      }
      result.emoji = '🌊';
      break;
    case 'checkpoint':
      result.attrChanges = { perseveranca: 1 };
      result.message = '🏰 Checkpoint salvo! Perseverança +1.';
      result.emoji = '🏰';
      break;
    case 'back_to_start':
      if (player.hasShield) {
        result.message = '🛡️ Seu escudo te salvou da maldição! Você não voltou ao início!';
        result.emoji = '🛡️';
      } else {
        result.resetToStart = true;
        result.stun = true;
        result.stunTurns = 1;
        result.attrChanges = { coragem: -2, perseveranca: -1 };
        result.message = '☠️ PUNIÇÃO! Uma força sombria te arrasta de volta ao início da jornada!';
        result.emoji = '☠️';
        result.statUpdate.backToStartCount = 1;
      }
      break;
    default:
      result.message = 'Caminho tranquilo...';
      result.emoji = '·';
  }
  return result;
}

const PresentialMultiplayer = () => {
  const navigate = useNavigate();
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

  // New state for phase transitions and River of Death
  const [showPhaseTransition, setShowPhaseTransition] = useState<number | null>(null);
  const [showRiverOfDeath, setShowRiverOfDeath] = useState<{ playerIdx: number; prevPos: number; newPos: number } | null>(null);
  const [phaseTransitionPendingAction, setPhaseTransitionPendingAction] = useState<(() => void) | null>(null);
  const lastPhaseAmbientRef = useRef(-1);

  const addPlayer = () => {
    if (players.length >= 8) return;
    setPlayers(prev => [...prev, createPlayer(prev.length)]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setEditingNames(prev => ({ ...prev, [id]: name }));
  };

  const commitName = (id: string) => {
    const name = editingNames[id];
    if (name && name.trim()) {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: name.trim() } : p));
    }
    setEditingNames(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const startGame = () => {
    const finalPlayers = players.map(p => {
      const editName = editingNames[p.id];
      return editName?.trim() ? { ...p, name: editName.trim() } : p;
    });
    setPlayers(finalPlayers);
    setTileTypes(generateImmersiveTiles(Date.now()));
    setPhase('playing');
    setCurrentTurn(0);
    playTurnStart();
    playGameSfx('gameStart');
    playPhaseAmbient(0);
    lastPhaseAmbientRef.current = 0;
    setTurnAnnounce(`Vez de ${finalPlayers[0].name}!`);
    // Show phase 0 transition
    setShowPhaseTransition(0);
  };

  const handlePhaseTransitionComplete = useCallback(() => {
    setShowPhaseTransition(null);
    if (phaseTransitionPendingAction) {
      phaseTransitionPendingAction();
      setPhaseTransitionPendingAction(null);
    }
  }, [phaseTransitionPendingAction]);

  // Called by ImmersiveBoard when token animation finishes
  const handleTokenArrived = useCallback(() => {
    setIsTokenMoving(false);
    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, []);

  // Update stats helper
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
    if (!player || player.finished || isTokenMoving) return;

    if (player.isStunned) {
      setPlayers(prev => prev.map((p, i) => i === currentTurn ? {
        ...p,
        isStunned: p.stunTurns <= 1 ? false : true,
        stunTurns: Math.max(0, p.stunTurns - 1),
      } : p));
      nextTurn();
      return;
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

    // Move token visually
    setPlayers(prev => prev.map((p, i) => i === turnIdx ? { ...p, position: newPos, lastDice: diceVal } : p));

    // Build the post-animation action
    const postAnimationAction = () => {
      // Check for River of Death zone (last few tiles before finish)
      if (newPos >= RIVER_ZONE_START && newPos < IMMERSIVE_BOARD_SIZE - 1 && !player.stats.riverCrossed) {
        setShowRiverOfDeath({ playerIdx: turnIdx, prevPos, newPos });
        return;
      }

      if (EXPANDED_MINI_GAME_TILES.includes(tileType)) {
        setMiniGame({ tileType, playerIdx: turnIdx, prevPosition: prevPos, newPosition: newPos });
        return;
      }

      const phaseIdx = Math.floor(newPos / TILES_PER_PHASE);
      const effect = resolveTileEffect(tileType, player, players, Date.now() + newPos, phaseIdx);

      // Update stats
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

      // Handle collective effects
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

      // Apply final position + attributes + show popup
      setPlayers(prev => prev.map((p, i) => {
        if (i !== turnIdx) return p;
        const newAttrs = { ...p.attributes };
        for (const [key, val] of Object.entries(effect.attrChanges)) {
          (newAttrs as any)[key] = Math.max(0, ((newAttrs as any)[key] || 0) + val);
        }
        return {
          ...p,
          position: finalPos,
          finished: isFinished,
          finishOrder: isFinished ? newFinishCount : null,
          isStunned: effect.stun,
          stunTurns: effect.stunTurns,
          hasShield: effect.shield ? true : (tileType === 'trap' || tileType === 'giant' ? false : p.hasShield),
          checkpoint: tileType === 'checkpoint' ? finalPos : p.checkpoint,
          extraTurn: effect.extraTurn,
          attributes: newAttrs,
          stats: {
            ...p.stats,
            phasesCompleted: Math.floor(finalPos / TILES_PER_PHASE),
          },
        };
      }));

      // Show tile message for ALL tiles (every tile opens a popup)
      setTileMessage({ message: effect.message, emoji: effect.emoji, tileType, playerName: player.name });
    };

    // Store pending action — if phase changed, show transition first
    pendingActionRef.current = () => {
      if (newPhase > prevPhase && newPhase <= 5) {
        // Play phase ambient and transition sound
        playPhaseTransitionSound(newPhase);
        playPhaseAmbient(newPhase);
        lastPhaseAmbientRef.current = newPhase;
        // Update player's lastPhase
        setPlayers(prev => prev.map((p, i) => i === turnIdx ? { ...p, lastPhase: newPhase } : p));
        // Show phase transition cutscene, then execute tile action
        setPhaseTransitionPendingAction(() => postAnimationAction);
        setShowPhaseTransition(newPhase);
      } else {
        // Play ambient if not already playing for this phase
        if (lastPhaseAmbientRef.current !== newPhase) {
          playPhaseAmbient(newPhase);
          lastPhaseAmbientRef.current = newPhase;
        }
        postAnimationAction();
      }
    };
  }, [players, currentTurn, tileTypes, finishCount, isTokenMoving]);

  // River of Death result
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
        // Failed — go back a few tiles
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
        emoji: '✨',
        tileType: 'blessing',
        playerName: players[playerIdx]?.name,
      });
    } else {
      setTileMessage({
        message: '🌊 As águas te venceram... Você recua, mas a fé ainda te sustenta.',
        emoji: '🌊',
        tileType: 'current',
        playerName: players[playerIdx]?.name,
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
    const { playerIdx, prevPosition, newPosition, tileType } = miniGame;
    const player = players[playerIdx];

    // Update stats
    if (tileType === 'giant') {
      updatePlayerStats(playerIdx, won ? { giantsDefeated: 1 } : { giantsLost: 1 });
    } else if (tileType === 'challenge') {
      updatePlayerStats(playerIdx, won ? { challengesWon: 1 } : { challengesLost: 1 });
    } else if (tileType === 'scripture') {
      updatePlayerStats(playerIdx, won ? { scripturesCorrect: 1 } : { scripturesWrong: 1 });
    }

    setPlayers(prev => prev.map((p, i) => {
      if (i !== playerIdx) return p;
      if (won) {
        const refugePos = Math.min(newPosition + 1, IMMERSIVE_BOARD_SIZE - 1);
        return {
          ...p,
          position: refugePos,
          attributes: {
            ...p.attributes,
            coragem: p.attributes.coragem + 2,
            fe: p.attributes.fe + 1,
          },
          stats: {
            ...p.stats,
            currentStreak: p.stats.currentStreak + 1,
            maxStreak: Math.max(p.stats.maxStreak, p.stats.currentStreak + 1),
          },
        };
      } else {
        return {
          ...p,
          position: prevPosition,
          attributes: {
            ...p.attributes,
            coragem: Math.max(0, p.attributes.coragem - 1),
          },
          stats: { ...p.stats, currentStreak: 0 },
        };
      }
    }));

    setMiniGame(null);
    const resultMsg = won
      ? `⚔️ ${player.name} venceu o ${TILE_TYPES[tileType].label}! Avança para o Refúgio!`
      : `💀 ${player.name} perdeu! Volta para a casa ${prevPosition + 1}...`;
    setTileMessage({
      message: resultMsg,
      emoji: won ? '🏆' : '😢',
      tileType,
      playerName: player.name,
    });
  }, [miniGame, players]);

  const handleTilePopupDismiss = useCallback(() => {
    const currentMsg = tileMessage;
    setTileMessage(null);
    if (currentMsg) {
      const p = players[currentTurn];
      if (p?.extraTurn) {
        setTurnAnnounce(`🎲 ${p.name} joga de novo!`);
      } else {
        nextTurn();
      }
    }
  }, [tileMessage, players, currentTurn, nextTurn]);

  const resetGame = () => {
    setPlayers(prev => prev.map((p, i) => createPlayer(i, p.name)));
    setCurrentTurn(0);
    setFinishCount(0);
    setTileTypes(generateImmersiveTiles(Date.now()));
    setPhase('playing');
    playGameSfx('gameStart');
    playPhaseAmbient(0);
    lastPhaseAmbientRef.current = 0;
    setShowPhaseTransition(0);
  };

  // ─── SETUP ───
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => navigate('/multiplayer')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg text-foreground">Modo Presencial</h1>
          </div>
        </header>

        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6">
          <ScreenHero
            icon={<Dices className="w-full h-full" />}
            name="Jogo Presencial"
            subtitle="Um celular, todos os jogadores reunidos"
            sfx="gameStart"
            size="md"
          />

          <div className="bg-card/50 border border-border rounded-xl p-4 space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              📜 <strong className="text-foreground">Como funciona:</strong> Um celular serve como tabuleiro digital imersivo.
              Cada fase ocupa uma tela inteira com cenários e personagens. Role o dado e explore a jornada do Peregrino!
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              🎮 <strong className="text-foreground">120 casas</strong> em 6 fases: Refúgios, Desafios, Surpresas, Armadilhas, Gigantes, Mini-games e muito mais!
            </p>
          </div>

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-display text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Jogadores ({players.length}/8)
              </span>
              {players.length < 8 && (
                <button onClick={addPlayer} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              )}
            </div>

            {players.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: p.color + '20', border: `2px solid ${p.color}60`, color: p.color }}
                >
                  {(editingNames[p.id] || p.name).charAt(0).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={editingNames[p.id] ?? p.name}
                  onChange={e => updatePlayerName(p.id, e.target.value)}
                  onBlur={() => commitName(p.id)}
                  className="flex-1 bg-transparent border-none text-sm text-foreground font-medium outline-none focus:text-primary"
                  maxLength={20}
                />
                {players.length > 2 && (
                  <button onClick={() => removePlayer(p.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 glow-gold disabled:opacity-50 transition-all"
          >
            <Dices className="w-5 h-5" />
            Começar Partida ({players.length} peregrinos)
          </button>
        </main>
      </div>
    );
  }

  // ─── GAME & FINISHED ───
  const currentPlayer = players[currentTurn];
  const allFinished = players.every(p => p.finished);

  if (allFinished && phase !== 'finished') {
    setPhase('finished');
  }

  if (phase === 'finished') {
    return (
      <EpicVictoryScreen
        players={players.map(p => ({
          ...p,
          stats: p.stats,
        }))}
        onPlayAgain={resetGame}
        onExit={() => navigate('/multiplayer')}
      />
    );
  }

  const boardPlayers = players.map(p => ({
    id: p.id,
    name: p.name,
    color: p.color,
    position: p.position,
    finished: p.finished,
    isStunned: p.isStunned,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Phase Transition Cutscene */}
      {showPhaseTransition !== null && (
        <PhaseTransition
          phaseIdx={showPhaseTransition}
          onComplete={handlePhaseTransitionComplete}
        />
      )}

      {/* River of Death */}
      {showRiverOfDeath && (
        <RiverOfDeath
          playerName={players[showRiverOfDeath.playerIdx]?.name || ''}
          onResult={handleRiverResult}
        />
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

      {/* Collective event notification */}
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

      {/* Tile event popup */}
      <TileEventPopup
        visible={!!tileMessage}
        tileType={tileMessage?.tileType || 'normal'}
        message={tileMessage?.message || ''}
        emoji={tileMessage?.emoji || ''}
        playerName={tileMessage?.playerName}
        onDismiss={handleTilePopupDismiss}
      />

      {/* Board Mini-Game overlay */}
      <BoardMiniGame
        visible={!!miniGame}
        tileType={miniGame?.tileType || 'normal'}
        playerName={players[miniGame?.playerIdx || 0]?.name || ''}
        onResult={handleMiniGameResult}
      />

      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/multiplayer')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-sm text-foreground">
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
          <span className="text-[10px] text-primary font-display bg-card px-2 py-1 rounded-md border border-primary/20">
            🎲 Presencial
          </span>
        </div>
      </header>

      {/* Scrollable player bar */}
      <div className="sticky top-[52px] z-20 bg-card/90 backdrop-blur-sm border-b border-border px-3 py-2 overflow-x-auto">
        <div className="flex gap-2 max-w-lg mx-auto">
          {players.map((p, i) => {
            const isTurn = i === currentTurn;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shrink-0 transition-all ${
                  isTurn ? 'bg-primary/10 border-primary/30' : p.finished ? 'opacity-50 border-border/50' : 'border-border'
                }`}
              >
                <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: p.color, border: `2px solid ${p.color}80` }} />
                <div className="text-[9px] leading-tight">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-muted-foreground">
                    {p.finished ? `🏆${p.finishOrder}º` : p.isStunned ? '😵' : `${p.position + 1}`}
                    {p.hasShield && ' 🛡️'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immersive Board */}
      <main className="flex-1 w-full">
        <ImmersiveBoard
          tileTypes={tileTypes}
          players={boardPlayers}
          currentTurnId={currentPlayer?.id}
          onTileClick={handleTileClick}
          onTokenArrived={handleTokenArrived}
        />

        {/* Dice section */}
        {phase === 'playing' && !currentPlayer?.finished && (
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
                  {/* 3D Dice */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        setDiceRolling(true);
                        const result = Math.floor(Math.random() * 6) + 1;
                        setDiceValue(result);
                        setTimeout(() => {
                          setDiceRolling(false);
                          handleDiceRoll(result);
                        }, 1200);
                      }}
                      className="focus:outline-none active:scale-95 transition-transform"
                      disabled={diceRolling || isTokenMoving}
                    >
                      <Dice3D value={diceValue} rolling={diceRolling} size={90} color="gold" />
                    </button>
                    <p className="text-base font-display font-bold text-foreground tracking-wide"
                      style={{ textShadow: '0 0 10px hsl(40 60% 55% / 0.3)' }}
                    >
                      {diceRolling ? 'Rolando...' : isTokenMoving ? '🚶 Movendo...' : 'Toque no dado para jogar!'}
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
                        className="w-12 h-12 rounded-xl bg-card border-2 border-border text-foreground font-bold text-lg hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all font-display"
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
