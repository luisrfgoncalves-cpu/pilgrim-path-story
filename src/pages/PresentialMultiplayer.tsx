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
import { Difficulty, TileEventType as RPGTileEventType } from '@/data/rpg/types';
import { createRotationState, RotationState } from '@/data/rpg/rotationEngine';
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
import { startAmbientMusic, stopAmbientMusic, updateAmbientPhase } from '@/components/multiplayer/AmbientMusic';
import { playGameSfx } from '@/lib/gameSfx';
import { preloadRealSfx, playRealSfx } from '@/lib/realSfx';
import { useAudioPrewarm } from '@/hooks/useAudioPrewarm';
import { prewarmNarrator, setNarratorEnabled, stopNarration } from '@/lib/narrator';
import { ArrowLeft, Users, Trophy, Plus, Minus, Dices, Crown, Volume2, VolumeX } from 'lucide-react';
import ScreenHero from '@/components/ScreenHero';

const COLORS = ['#E8724A', '#4CAF50', '#42A5F5', '#FFD54F', '#AB47BC', '#EF5350', '#26C6DA', '#FF7043'];
const DEFAULT_NAMES = ['Cristão', 'Fiel', 'Esperança', 'Prudência', 'Caridade', 'Piedade', 'Evangelista', 'Socorro'];

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

// Now ALL special tiles trigger mini-games (more interactive!)
const EXPANDED_MINI_GAME_TILES: TileType[] = ['giant', 'challenge', 'scripture', 'surprise', 'blessing', 'trap', 'shield', 'current', 'swap'];

// Map board tile types to RPG event types for the RPG popup
const TILE_TO_RPG_EVENT: Partial<Record<TileType, RPGTileEventType>> = {
  scripture: 'scripture',
  challenge: 'challenge',
  giant: 'boss',
  surprise: 'special',
  blessing: 'refuge',
  trap: 'trap',
  // Narrative story tiles → RPG events based on story context
  wicket_gate: 'scripture',
  interpreter_house: 'riddle',
  hill_difficulty: 'challenge',
  palace_beautiful: 'refuge',
  valley_humiliation: 'boss',
  valley_shadow: 'dilemma',
  vanity_fair: 'dilemma',
  doubting_castle: 'boss',
  delectable_mountains: 'refuge',
  enchanted_ground: 'trap',
  beulah_land: 'special',
  // New narrative tiles
  slough_despond: 'dilemma',
  cross_sepulchre: 'refuge',
  simple_sloth_presumption: 'riddle',
  hill_lucre: 'dilemma',
  by_path_meadow: 'dilemma',
  flatterer_net: 'trap',
  atheist_encounter: 'riddle',
  ignorance_path: 'dilemma',
  little_faith: 'scripture',
  river_of_life: 'refuge',
};

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
    // Narrative story tiles — handled by RPG popup, but fallback here
    case 'wicket_gate':
      result.attrChanges = { fe: 1 }; result.message = '🚪 A Porta Estreita! Boa Vontade os recebe.'; result.emoji = '🚪'; break;
    case 'interpreter_house':
      result.attrChanges = { discernimento: 2 }; result.message = '🏛️ O Intérprete revela verdades profundas!'; result.emoji = '🏛️'; break;
    case 'hill_difficulty':
      result.attrChanges = { perseveranca: 1 }; result.message = '⛰️ Monte Dificuldade — a subida fortalece!'; result.emoji = '⛰️'; break;
    case 'palace_beautiful':
      result.attrChanges = { fe: 1, coragem: 1 }; result.message = '🏰 Palácio Formoso! Prudência, Piedade e Caridade acolhem vocês.'; result.emoji = '🏰'; break;
    case 'valley_humiliation':
      result.attrChanges = { coragem: -1 }; result.message = '⚔️ Vale da Humilhação — Apolião se aproxima!'; result.emoji = '⚔️'; break;
    case 'valley_shadow':
      result.attrChanges = { fe: -1 }; result.message = '💀 Vale da Sombra da Morte — trevas envolvem!'; result.emoji = '💀'; break;
    case 'vanity_fair':
      result.message = '🎪 Feira da Vaidade — tentações por toda parte!'; result.emoji = '🎪'; break;
    case 'doubting_castle':
      result.attrChanges = { coragem: -2 }; result.stun = true; result.stunTurns = 1;
      result.message = '🏴 Castelo da Dúvida — Gigante Desespero captura os peregrinos!'; result.emoji = '🏴'; break;
    case 'delectable_mountains':
      result.attrChanges = { fe: 2, discernimento: 1 }; result.message = '🏔️ Montanhas Deleitosas! Os pastores mostram a Cidade Celestial ao longe.'; result.emoji = '🏔️'; break;
    case 'enchanted_ground':
      result.stun = true; result.stunTurns = 1;
      result.message = '😴 Terra Encantada — o sono tenta vencê-los!'; result.emoji = '😴'; break;
    case 'beulah_land':
      result.attrChanges = { fe: 2, coragem: 2, perseveranca: 1 };
      result.message = '🌸 Terra de Beulá! Ar doce, flores eternas — a Cidade está próxima!'; result.emoji = '🌸'; break;
    case 'slough_despond':
      result.attrChanges = { perseveranca: -1 }; result.posAdjust = -2;
      result.message = '🏚️ Pântano do Desânimo — a lama da dúvida puxa para baixo!'; result.emoji = '🏚️'; break;
    case 'cross_sepulchre':
      result.attrChanges = { fe: 3, perseveranca: 1 };
      result.message = '✝️ A Cruz! Sua carga pesada finalmente cai — liberdade em Cristo!'; result.emoji = '✝️'; break;
    case 'simple_sloth_presumption':
      result.stun = true; result.stunTurns = 1;
      result.message = '😴 Simples, Preguiça e Presunção dormem acorrentados à beira do caminho!'; result.emoji = '😴'; break;
    case 'hill_lucre':
      result.attrChanges = { discernimento: -1 }; result.posAdjust = -2;
      result.message = '💰 A Mina de Demas! A prata brilha, mas o chão é traiçoeiro!'; result.emoji = '💰'; break;
    case 'by_path_meadow':
      result.posAdjust = -3;
      result.message = '🌿 Prado do Atalho — o caminho fácil leva ao perigo!'; result.emoji = '🌿'; break;
    case 'flatterer_net':
      result.posAdjust = -2; result.attrChanges = { discernimento: -1 };
      result.message = '🕸️ A Rede do Lisonjeiro! Palavras doces escondem armadilhas!'; result.emoji = '🕸️'; break;
    case 'atheist_encounter':
      result.attrChanges = { fe: -1 };
      result.message = '🤷 O Ateu zomba da jornada — mas a fé permanece firme!'; result.emoji = '🤷'; break;
    case 'ignorance_path':
      result.attrChanges = { discernimento: -1 };
      result.message = '🚶 Ignorância segue seu próprio caminho tortuoso!'; result.emoji = '🚶'; break;
    case 'little_faith':
      result.attrChanges = { fe: -1, coragem: -1 };
      result.message = '😰 Pouca-Fé! Ladrões roubaram sua paz — mas não a salvação!'; result.emoji = '😰'; break;
    case 'river_of_life':
      result.attrChanges = { fe: 1, perseveranca: 1 };
      result.message = '💧 Rio da Vida! Águas cristalinas restauram a alma!'; result.emoji = '💧'; break;
    default:
      result.message = 'Caminho tranquilo...';
      result.emoji = '·';
  }
  return result;
}

const PresentialMultiplayer = () => {
  const navigate = useNavigate();
  useAudioPrewarm();
  prewarmNarrator();
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
  const [returnMoveInfo, setReturnMoveInfo] = useState<string | null>(null); // show "Voltando X casas..."
  const [showStats, setShowStats] = useState(false);
  const [showAttrPanel, setShowAttrPanel] = useState(false);
  const [resultFeedback, setResultFeedback] = useState<{
    visible: boolean; success: boolean; message: string; emoji: string;
    posAdjust?: number; attrChanges?: Record<string, number>;
  } | null>(null);
  const tokenMovingTimerRef = useRef<number | null>(null);
  const [narrationEnabled, setNarrationEnabledState] = useState(true);

  // Deferred move after mini-game popup closes
  const pendingMoveAfterPopup = useRef<{
    playerIdx: number;
    targetPos: number;
    attrs: Record<string, number>;
    shield?: boolean;
    stats: Partial<PlayerStats>;
    isReturnMove?: boolean; // true = retreat/penalty move, don't trigger tile events at destination
  } | null>(null);

  // Safety: auto-reset isTokenMoving if stuck for too long
  useEffect(() => {
    if (isTokenMoving) {
      if (tokenMovingTimerRef.current) clearTimeout(tokenMovingTimerRef.current);
      tokenMovingTimerRef.current = window.setTimeout(() => {
        setIsTokenMoving(false);
        setReturnMoveInfo(null);
        // If there's a pending action, execute it
        if (pendingActionRef.current) {
          const action = pendingActionRef.current;
          pendingActionRef.current = null;
          action();
        }
      }, 20000); // 20s max
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

  // New state for phase transitions and River of Death
  const [showPhaseTransition, setShowPhaseTransition] = useState<number | null>(null);
  const [showRiverOfDeath, setShowRiverOfDeath] = useState<{ playerIdx: number; prevPos: number; newPos: number } | null>(null);
  const [phaseTransitionPendingAction, setPhaseTransitionPendingAction] = useState<(() => void) | null>(null);
  const lastPhaseAmbientRef = useRef(-1);

  // ─── RPG System State ───
  const [rpgDifficulty, setRpgDifficulty] = useState<Difficulty>('peregrino');
  const [rpgGameMode, setRpgGameMode] = useState<GameMode>('cooperative');
  const [rpgHostIndex, setRpgHostIndex] = useState(0);
  const rotationStateRef = useRef<RotationState>(createRotationState());
  const [rpgEvent, setRpgEvent] = useState<{
    tileType: RPGTileEventType;
    sourceTileType: TileType;
    playerIdx: number;
    prevPosition: number;
    newPosition: number;
  } | null>(null);

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

  const startGame = (config?: { difficulty: Difficulty; gameMode: GameMode; playerNames: string[]; hostPlayerIndex: number }) => {
    let finalPlayers: LocalPlayer[];
    if (config) {
      // From RPGBriefing
      setRpgDifficulty(config.difficulty);
      setRpgGameMode(config.gameMode);
      setRpgHostIndex(config.hostPlayerIndex);
      rotationStateRef.current = createRotationState();
      finalPlayers = config.playerNames.map((name, i) => createPlayer(i, name));
    } else {
      finalPlayers = players.map(p => {
        const editName = editingNames[p.id];
        return editName?.trim() ? { ...p, name: editName.trim() } : p;
      });
    }
    setPlayers(finalPlayers);
    setTileTypes(generateImmersiveTiles(Date.now()));
    setPhase('playing');
    setCurrentTurn(0);
    playTurnStart();
    playGameSfx('gameStart');
    playPhaseAmbient(0);
    startAmbientMusic(0);
    lastPhaseAmbientRef.current = 0;
    setTurnAnnounce(`Vez de ${finalPlayers[0].name}!`);
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
  // Adds a 2s suspense delay before triggering the event popup
  const handleTokenArrived = useCallback(() => {
    setIsTokenMoving(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      // 2 second suspense delay — player sees the tile, feels the tension
      setTimeout(() => {
        action();
      }, 2000);
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
    if (!player || player.finished || isTokenMoving || !!tileMessage || !!miniGame || !!rpgEvent || showRiverOfDeath || showPhaseTransition !== null) return;

    if (player.isStunned) {
      setPlayers(prev => prev.map((p, i) => i === currentTurn ? {
        ...p,
        isStunned: p.stunTurns <= 1 ? false : true,
        stunTurns: Math.max(0, p.stunTurns - 1),
      } : p));
      nextTurn();
      return;
    }

    // Reset extraTurn — this roll IS the extra turn
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

    // Move token(s) visually — cooperative = ALL move together
    if (rpgGameMode === 'cooperative') {
      setPlayers(prev => prev.map(p => ({ ...p, position: newPos, lastDice: diceVal })));
    } else {
      setPlayers(prev => prev.map((p, i) => i === turnIdx ? { ...p, position: newPos, lastDice: diceVal } : p));
    }
    playGameSfx('diceRoll');

    // Build the post-animation action
    const postAnimationAction = () => {
      // Check for River of Death zone (last few tiles before finish)
      if (newPos >= RIVER_ZONE_START && newPos < IMMERSIVE_BOARD_SIZE - 1 && !player.stats.riverCrossed) {
        setShowRiverOfDeath({ playerIdx: turnIdx, prevPos, newPos });
        return;
      }

      // Auto-resolve double_dice — no popup, just extra turn
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

      // Check if this tile should use the RPG popup
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

      // If position changes (posAdjust, reset, etc.), defer move until popup closes
      if (finalPos !== newPos) {
        // Apply attrs and state at CURRENT position, defer movement
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
            stats: {
              ...p.stats,
              phasesCompleted: Math.floor(finalPos / TILES_PER_PHASE),
            },
          };
        }));

        // Store pending move — mark retreats so they don't trigger tile events
        pendingMoveAfterPopup.current = {
          playerIdx: turnIdx,
          targetPos: finalPos,
          attrs: {},
          stats: {},
          isReturnMove: finalPos < newPos || effect.resetToStart || effect.resetToCheckpoint,
        };
        // Also handle finish after move
        if (isFinished) {
          if (rpgGameMode === 'cooperative') {
            // All finish together
            setPlayers(prev => prev.map((p, i) => ({ ...p, finished: true, finishOrder: 1 })));
          } else {
            setPlayers(prev => prev.map((p, i) => {
              if (i !== turnIdx) return p;
              return { ...p, finished: true, finishOrder: newFinishCount };
            }));
          }
        }
      } else {
        // No position change — apply everything now
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
            stats: {
              ...p.stats,
              phasesCompleted: Math.floor(finalPos / TILES_PER_PHASE),
            },
          };
        }));
      }

      // Show tile message for ALL tiles (every tile opens a popup)
      setTileMessage({ message: effect.message, emoji: effect.emoji, tileType, playerName: player.name });
    };

    // Store pending action — if phase changed, show transition first
    pendingActionRef.current = () => {
      if (newPhase > prevPhase && newPhase <= 5) {
        // Play phase ambient and transition sound
        playPhaseTransitionSound(newPhase);
        playPhaseAmbient(newPhase);
        updateAmbientPhase(newPhase);
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
  }, [players, currentTurn, tileTypes, finishCount, isTokenMoving, tileMessage, miniGame, showRiverOfDeath, showPhaseTransition]);

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

    // DON'T move the token yet — defer until popup closes
    if (won) {
      // Player STAYS on current tile after winning — like a real board game
      // Apply attribute bonuses without moving
      setPlayers(prev => prev.map((p, i) => {
        if (i !== playerIdx) return p;
        return {
          ...p,
          attributes: {
            ...p.attributes,
            coragem: p.attributes.coragem + 2,
            fe: p.attributes.fe + 1,
          },
          stats: {
            ...p.stats,
            currentStreak: (p.stats.currentStreak || 0) + 1,
            maxStreak: Math.max(p.stats.maxStreak, (p.stats.currentStreak || 0) + 1),
          },
        };
      }));
      // No pending move — turn ends after popup
      pendingMoveAfterPopup.current = null;
    } else {
      pendingMoveAfterPopup.current = {
        playerIdx,
        targetPos: prevPosition,
        attrs: { coragem: -1 },
        stats: { currentStreak: 0 },
        isReturnMove: true, // This is a retreat — don't trigger events at destination
      };
    }

    setMiniGame(null);

    // Context-appropriate messages
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

    // If there's a pending move from a mini-game, apply it NOW (after popup closed)
    const pendingMove = pendingMoveAfterPopup.current;
    if (pendingMove) {
      pendingMoveAfterPopup.current = null;
      const { playerIdx, targetPos, attrs, stats, shield, isReturnMove } = pendingMove;

      // Show return move info for user feedback
      if (isReturnMove) {
        const currentPos = players[playerIdx]?.position ?? 0;
        const casasDiff = Math.abs(currentPos - targetPos);
        setReturnMoveInfo(`↩️ Voltando ${casasDiff} casa${casasDiff > 1 ? 's' : ''}...`);
      }

      // Move the token visually — cooperative = ALL move
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

      // After token arrives at destination
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

    // No pending move — standard dismiss behavior
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
    setPlayers(prev => prev.map((p, i) => createPlayer(i, p.name)));
    setCurrentTurn(0);
    setFinishCount(0);
    setTileTypes(generateImmersiveTiles(Date.now()));
    rotationStateRef.current = createRotationState(); // Reset RPG rotation
    setRpgEvent(null);
    setPhase('playing');
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
    const { playerIdx, prevPosition, newPosition } = rpgEvent;
    const player = players[playerIdx];

    // Update stats
    if (result.success) {
      updatePlayerStats(playerIdx, { challengesWon: 1 });
    } else {
      updatePlayerStats(playerIdx, { challengesLost: 1 });
    }

    // Apply attribute changes
    if (result.attrChanges) {
      setPlayers(prev => prev.map((p, i) => {
        if (i !== playerIdx && !result.affectsGroup) return p;
        if (i !== playerIdx && result.affectsGroup) {
          // Apply reduced effect to group in cooperative mode
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

    // Handle position adjustment
    const posAdj = result.posAdjust || 0;
    if (result.success && posAdj >= 0) {
      // Won — stay or advance, apply stun if any
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
      // Lost — retreat
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

    setRpgEvent(null);

    // Show dramatic result feedback overlay
    setResultFeedback({
      visible: true,
      success: result.success,
      message: result.message,
      emoji: result.emoji,
      posAdjust: result.posAdjust,
      attrChanges: result.attrChanges,
    });

    // RPG popup already showed the result — skip redundant TileEventPopup
    // Just process pending moves or go to next turn
    const pendingMove = pendingMoveAfterPopup.current;
    if (pendingMove) {
      // There's a pending move — trigger it
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
      // No pending move — just next turn
      const p = players[rpgEvent.playerIdx];
      if (p?.extraTurn) {
        setTurnAnnounce(`🎲 ${p.name} joga de novo!`);
      } else {
        nextTurn();
      }
    }
  }, [rpgEvent, players, rpgGameMode]);

  // ─── SETUP ───
  if (phase === 'setup') {
    return (
      <RPGBriefing
        onStart={startGame}
        onBack={() => navigate('/multiplayer')}
      />
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

  // Stats overlay
  if (showStats) {
    return (
      <BoardStats
        players={players}
        onClose={() => setShowStats(false)}
      />
    );
  }

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
        phaseIdx={miniGame ? Math.floor(miniGame.newPosition / TILES_PER_PHASE) : 0}
      />

      {/* RPG Event Popup */}
      <RPGEventPopup
        visible={!!rpgEvent}
        difficulty={rpgDifficulty}
        playerNames={players.map(p => p.name)}
        currentPlayerIdx={rpgEvent?.playerIdx || currentTurn}
        tileEventType={rpgEvent?.tileType || 'scripture'}
        sourceTileType={rpgEvent?.sourceTileType}
        onResult={handleRpgEventResult}
        onDismiss={() => {
          setRpgEvent(null);
          nextTurn();
        }}
        rotationState={rotationStateRef}
      />

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newState = !narrationEnabled;
                setNarrationEnabledState(newState);
                setNarratorEnabled(newState);
                if (!newState) stopNarration();
              }}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors active:scale-95"
              title={narrationEnabled ? 'Desativar narração' : 'Ativar narração'}
            >
              {narrationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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

      {/* Attribute Panel + Player Bar */}
      <div className="sticky top-[52px] z-20 bg-card/90 backdrop-blur-sm border-b border-border px-3 py-2 space-y-1.5">
        <div className="max-w-lg mx-auto">
          <AttributePanel
            players={players.map(p => ({
              name: p.name,
              color: p.color,
              attributes: p.attributes,
              hasShield: p.hasShield,
              isStunned: p.isStunned,
              finished: p.finished,
            }))}
            currentPlayerIdx={currentTurn}
            expanded={showAttrPanel}
            onToggle={() => setShowAttrPanel(prev => !prev)}
          />
        </div>
      </div>

      {/* Result Feedback Overlay */}
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
        {phase === 'playing' && !currentPlayer?.finished && !tileMessage && !miniGame && !rpgEvent && !showRiverOfDeath && showPhaseTransition === null && (
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
                      disabled={diceRolling || isTokenMoving || !!tileMessage || !!miniGame || !!rpgEvent || showRiverOfDeath !== null || showPhaseTransition !== null}
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
                        disabled={diceRolling || isTokenMoving || !!tileMessage || !!miniGame || !!rpgEvent || showRiverOfDeath !== null || showPhaseTransition !== null}
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
