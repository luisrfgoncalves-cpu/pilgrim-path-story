// ─── Immersive Board Types & Data ───

import phase1Bg from '@/assets/board/phase1-cidade-destruicao.jpg';
import phase2Bg from '@/assets/board/phase2-pantano-caminho.jpg';
import phase3Bg from '@/assets/board/phase3-vale-sombra.jpg';
import phase4Bg from '@/assets/board/phase4-feira-vaidade.jpg';
import phase5Bg from '@/assets/board/phase5-castelo-duvida.jpg';
import phase6Bg from '@/assets/board/phase6-cidade-celestial.jpg';

// Tile-specific images (environments & contexts)
import tileStart from '@/assets/board/tile-start.jpg';
import tileFinish from '@/assets/board/tile-finish.jpg';
import tileRefuge from '@/assets/board/tile-refuge.jpg';
import tileTrap from '@/assets/board/tile-trap.jpg';
import tileShield from '@/assets/board/tile-shield.jpg';
import tileBlessing from '@/assets/board/tile-blessing.jpg';
import tileSurprise from '@/assets/board/tile-surprise.jpg';
import tileScripture from '@/assets/board/tile-scripture.jpg';
import tileSwap from '@/assets/board/tile-swap.jpg';
import tileDoubleDice from '@/assets/board/tile-double-dice.jpg';
import tileCurrent from '@/assets/board/tile-current.jpg';
import tileCheckpoint from '@/assets/board/tile-checkpoint.jpg';
import tileNormal from '@/assets/board/tile-normal.jpg';
import tileBackToStart from '@/assets/board/tile-back-to-start.jpg';

// 210 tiles total, 35 per phase (richer narrative, slower progression)
export const IMMERSIVE_BOARD_SIZE = 210;
export const TILES_PER_PHASE = 35;

// ─── 30+ Tile Types (gameplay + narrative locations) ───
export type TileType =
  | 'start' | 'finish'
  | 'refuge' | 'challenge' | 'surprise' | 'scripture'
  | 'trap' | 'giant' | 'shield' | 'blessing'
  | 'swap' | 'double_dice' | 'current' | 'checkpoint'
  | 'back_to_start' | 'normal'
  // Narrative/story locations from The Pilgrim's Progress
  | 'wicket_gate' | 'interpreter_house' | 'hill_difficulty'
  | 'palace_beautiful' | 'valley_humiliation' | 'valley_shadow'
  | 'vanity_fair' | 'doubting_castle' | 'delectable_mountains'
  | 'enchanted_ground' | 'beulah_land'
  // NEW narrative locations for richer storytelling
  | 'slough_despond' | 'cross_sepulchre' | 'simple_sloth_presumption'
  | 'hill_lucre' | 'by_path_meadow' | 'flatterer_net'
  | 'atheist_encounter' | 'ignorance_path' | 'little_faith'
  | 'river_of_life';

export interface TileConfig {
  type: TileType;
  label: string;
  emoji: string;
  color: string;        // HSL accent
  glowColor: string;    // glow rgba
  description: string;
  sfx?: string;
  characterKey?: string; // character image (only for character encounters)
  tileImage?: string;    // environment/context image for the tile
  isNarrative?: boolean; // story location tile
}

export const TILE_TYPES: Record<TileType, TileConfig> = {
  start:       { type: 'start',       label: 'Partida',        emoji: '🏠', color: 'hsl(40 70% 50%)',  glowColor: 'rgba(212,175,55,0.4)', description: 'Início da jornada', sfx: 'gameStart', tileImage: tileStart },
  finish:      { type: 'finish',      label: 'Chegada',        emoji: '🏰', color: 'hsl(40 80% 60%)',  glowColor: 'rgba(255,215,0,0.5)',  description: 'Cidade Celestial!', sfx: 'victory', tileImage: tileFinish },
  refuge:      { type: 'refuge',      label: 'Refúgio',        emoji: '🏠', color: 'hsl(140 50% 40%)', glowColor: 'rgba(76,175,80,0.3)',  description: 'Recupera +2 pontos de atributo', sfx: 'heal', tileImage: tileRefuge },
  challenge:   { type: 'challenge',   label: 'Desafio',        emoji: '⚔️', color: 'hsl(0 60% 50%)',   glowColor: 'rgba(239,83,80,0.4)',  description: 'Mini-game obrigatório!', sfx: 'challenge', characterKey: 'apolion' },
  surprise:    { type: 'surprise',    label: 'Surpresa',       emoji: '🎁', color: 'hsl(40 80% 55%)',  glowColor: 'rgba(255,213,79,0.4)', description: 'Efeito aleatório — bom ou ruim', sfx: 'surprise', tileImage: tileSurprise },
  scripture:   { type: 'scripture',   label: 'Escritura',      emoji: '📖', color: 'hsl(210 60% 50%)', glowColor: 'rgba(66,165,245,0.3)', description: 'Pergunta bíblica — acertou = bônus!', sfx: 'scripture', tileImage: tileScripture },
  trap:        { type: 'trap',        label: 'Armadilha',      emoji: '🔙', color: 'hsl(270 50% 45%)', glowColor: 'rgba(171,71,188,0.3)', description: 'Volta X casas!', sfx: 'trap', tileImage: tileTrap },
  giant:       { type: 'giant',       label: 'Gigante',        emoji: '💀', color: 'hsl(0 0% 25%)',    glowColor: 'rgba(0,0,0,0.5)',      description: 'Derrote o Gigante ou sofra!', sfx: 'giant', characterKey: 'gigante_desespero' },
  shield:      { type: 'shield',      label: 'Escudo',         emoji: '🛡️', color: 'hsl(0 0% 70%)',   glowColor: 'rgba(192,192,192,0.3)',description: 'Proteção contra próxima armadilha', sfx: 'shield', tileImage: tileShield },
  blessing:    { type: 'blessing',    label: 'Bênção',         emoji: '⭐', color: 'hsl(45 90% 55%)',  glowColor: 'rgba(255,215,0,0.4)',  description: 'Avança X casas extras!', sfx: 'blessing', tileImage: tileBlessing },
  swap:        { type: 'swap',        label: 'Troca',          emoji: '🔄', color: 'hsl(330 60% 55%)', glowColor: 'rgba(233,30,99,0.3)',  description: 'Troca posição com outro jogador!', sfx: 'swap', tileImage: tileSwap },
  double_dice: { type: 'double_dice', label: 'Dado Duplo',     emoji: '🎲', color: 'hsl(25 80% 55%)', glowColor: 'rgba(255,112,67,0.3)', description: 'Joga novamente!', sfx: 'dice', tileImage: tileDoubleDice },
  current:     { type: 'current',     label: 'Correnteza',     emoji: '🌊', color: 'hsl(195 70% 50%)',glowColor: 'rgba(38,198,218,0.3)', description: 'Arrasta para frente ou trás aleatoriamente', sfx: 'water', tileImage: tileCurrent },
  checkpoint:  { type: 'checkpoint',  label: 'Checkpoint',     emoji: '🏰', color: 'hsl(35 70% 45%)', glowColor: 'rgba(212,175,55,0.3)', description: 'Salva posição — não volta antes daqui!', sfx: 'checkpoint', tileImage: tileCheckpoint },
  back_to_start: { type: 'back_to_start', label: 'Volta ao Início', emoji: '☠️', color: 'hsl(0 70% 40%)', glowColor: 'rgba(200,20,20,0.5)', description: 'Punição suprema — volta à casa 1!', sfx: 'trap', tileImage: tileBackToStart },
  normal:      { type: 'normal',      label: 'Caminho',        emoji: '·',  color: 'hsl(0 0% 40%)',   glowColor: 'rgba(100,100,100,0.1)',description: 'Siga em frente', sfx: undefined, tileImage: tileNormal },

  // ─── Narrative Story Tiles ───
  wicket_gate:         { type: 'wicket_gate',         label: 'Porta Estreita',          emoji: '🚪', color: 'hsl(35 60% 45%)',  glowColor: 'rgba(180,140,60,0.4)',  description: 'Boa Vontade abre a porta — entrem com fé!', isNarrative: true, characterKey: 'boa_vontade', tileImage: tileCheckpoint },
  interpreter_house:   { type: 'interpreter_house',   label: 'Casa do Intérprete',      emoji: '🏛️', color: 'hsl(220 50% 45%)', glowColor: 'rgba(80,120,180,0.4)',  description: 'O Intérprete revela verdades profundas', isNarrative: true, characterKey: 'interprete', tileImage: tileRefuge },
  hill_difficulty:     { type: 'hill_difficulty',      label: 'Monte Dificuldade',       emoji: '⛰️', color: 'hsl(20 50% 40%)',  glowColor: 'rgba(150,100,60,0.4)',  description: 'A subida é íngreme — perseverança é necessária!', isNarrative: true, tileImage: tileNormal },
  palace_beautiful:    { type: 'palace_beautiful',     label: 'Palácio Formoso',         emoji: '🏰', color: 'hsl(280 40% 50%)', glowColor: 'rgba(150,80,200,0.4)',  description: 'Prudência, Piedade e Caridade acolhem vocês', isNarrative: true, characterKey: 'prudencia', tileImage: tileRefuge },
  valley_humiliation:  { type: 'valley_humiliation',   label: 'Vale da Humilhação',      emoji: '⚔️', color: 'hsl(0 50% 35%)',   glowColor: 'rgba(180,40,40,0.4)',   description: 'Apolião bloqueia o caminho — confronto inevitável!', isNarrative: true, characterKey: 'apolion', tileImage: tileTrap },
  valley_shadow:       { type: 'valley_shadow',        label: 'Vale da Sombra da Morte', emoji: '💀', color: 'hsl(260 40% 20%)', glowColor: 'rgba(50,20,80,0.5)',    description: 'Trevas densas — caminhem pela fé, não pela vista!', isNarrative: true, tileImage: tileTrap },
  vanity_fair:         { type: 'vanity_fair',          label: 'Feira da Vaidade',        emoji: '🎪', color: 'hsl(350 60% 50%)', glowColor: 'rgba(220,50,60,0.4)',   description: 'Tentações por toda parte — Fiel enfrenta o tribunal!', isNarrative: true, characterKey: 'falador', tileImage: tileSurprise },
  doubting_castle:     { type: 'doubting_castle',      label: 'Castelo da Dúvida',       emoji: '🏴', color: 'hsl(0 0% 30%)',    glowColor: 'rgba(40,40,40,0.5)',    description: 'Gigante Desespero aprisiona os peregrinos!', isNarrative: true, characterKey: 'gigante_desespero', tileImage: tileTrap },
  delectable_mountains:{ type: 'delectable_mountains', label: 'Montanhas Deleitosas',    emoji: '🏔️', color: 'hsl(140 40% 45%)', glowColor: 'rgba(60,160,80,0.4)',   description: 'Pastores mostram visões da Cidade Celestial', isNarrative: true, tileImage: tileBlessing },
  enchanted_ground:    { type: 'enchanted_ground',     label: 'Terra Encantada',         emoji: '😴', color: 'hsl(270 30% 40%)', glowColor: 'rgba(120,80,150,0.3)',  description: 'Cuidado! O sono aqui é fatal — mantenham-se acordados!', isNarrative: true, tileImage: tileSurprise },
  beulah_land:         { type: 'beulah_land',          label: 'Terra de Beulá',          emoji: '🌸', color: 'hsl(320 50% 55%)', glowColor: 'rgba(200,100,150,0.4)', description: 'Ar doce, flores eternas — a Cidade está próxima!', isNarrative: true, tileImage: tileBlessing },
  // NEW narrative tiles
  slough_despond:             { type: 'slough_despond',             label: 'Pântano do Desânimo',     emoji: '🏚️', color: 'hsl(120 20% 30%)',  glowColor: 'rgba(80,100,60,0.4)',   description: 'Lama espessa puxa para baixo — não desista!', isNarrative: true, tileImage: tileTrap },
  cross_sepulchre:            { type: 'cross_sepulchre',            label: 'Cruz e Sepulcro',         emoji: '✝️',  color: 'hsl(45 70% 55%)',   glowColor: 'rgba(200,180,60,0.5)',  description: 'A carga cai aos pés da Cruz — liberdade!', isNarrative: true, tileImage: tileBlessing },
  simple_sloth_presumption:   { type: 'simple_sloth_presumption',   label: 'Dormentes do Caminho',    emoji: '😴', color: 'hsl(30 40% 35%)',   glowColor: 'rgba(150,110,70,0.3)',  description: 'Simples, Preguiça e Presunção dormem acorrentados', isNarrative: true, tileImage: tileNormal },
  hill_lucre:                 { type: 'hill_lucre',                 label: 'Mina de Demas',           emoji: '💰', color: 'hsl(40 60% 45%)',   glowColor: 'rgba(180,160,60,0.4)',  description: 'A prata reluz, mas o chão é traiçoeiro!', isNarrative: true, tileImage: tileTrap },
  by_path_meadow:             { type: 'by_path_meadow',             label: 'Prado do Atalho',         emoji: '🌿', color: 'hsl(110 40% 40%)',  glowColor: 'rgba(80,150,60,0.3)',   description: 'O caminho parece fácil, mas leva ao perigo!', isNarrative: true, tileImage: tileSurprise },
  flatterer_net:              { type: 'flatterer_net',              label: 'Rede do Lisonjeiro',      emoji: '🕸️', color: 'hsl(300 30% 40%)',  glowColor: 'rgba(150,60,130,0.3)',  description: 'Palavras doces escondem uma armadilha!', isNarrative: true, tileImage: tileTrap },
  atheist_encounter:          { type: 'atheist_encounter',          label: 'O Ateu',                  emoji: '🤷', color: 'hsl(0 0% 45%)',     glowColor: 'rgba(120,120,120,0.3)', description: 'O Ateu zomba da jornada — mantenha a fé!', isNarrative: true, tileImage: tileNormal },
  ignorance_path:             { type: 'ignorance_path',             label: 'Ignorância',              emoji: '🚶', color: 'hsl(30 30% 40%)',   glowColor: 'rgba(140,120,90,0.3)',  description: 'Ignorância segue seu próprio caminho tortuoso', isNarrative: true, tileImage: tileNormal },
  little_faith:               { type: 'little_faith',               label: 'Pouca-Fé',               emoji: '😰', color: 'hsl(200 30% 40%)',  glowColor: 'rgba(80,120,150,0.3)',  description: 'Ladrões roubaram sua paz — mas não a salvação!', isNarrative: true, tileImage: tileSurprise },
  river_of_life:              { type: 'river_of_life',              label: 'Rio da Vida',             emoji: '💧', color: 'hsl(195 60% 50%)',  glowColor: 'rgba(60,180,200,0.4)',  description: 'Águas cristalinas que restauram a alma!', isNarrative: true, tileImage: tileRefuge },
};

// Tiles that trigger mini-games (boss/challenge encounters)
export const MINI_GAME_TILES: TileType[] = ['giant', 'challenge', 'scripture'];

// ─── Phase definitions ───
export interface PhaseConfig {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  bgImage: string;
  accentHue: number;
  characterKey?: string;
  characterName?: string;
}

export const PHASES: PhaseConfig[] = [
  { id: 0, name: 'A Partida',   subtitle: 'Cidade da Destruição',  icon: '🏚️', bgImage: phase1Bg, accentHue: 30,  characterKey: 'evangelista',       characterName: 'Evangelista' },
  { id: 1, name: 'O Caminho',   subtitle: 'Pântano e Provações',   icon: '🗺️', bgImage: phase2Bg, accentHue: 140, characterKey: 'apolion',           characterName: 'Apolião' },
  { id: 2, name: 'O Vale',      subtitle: 'Sombra da Morte',       icon: '💀', bgImage: phase3Bg, accentHue: 260, characterKey: 'gigante_desespero', characterName: 'Gigante Desespero' },
  { id: 3, name: 'A Feira',     subtitle: 'Vaidade e Provação',    icon: '🎪', bgImage: phase4Bg, accentHue: 0,   characterKey: 'falador',           characterName: 'Falador' },
  { id: 4, name: 'O Castelo',   subtitle: 'Dúvida e Resgate',     icon: '🏰', bgImage: phase5Bg, accentHue: 270, characterKey: 'grande_coracao',    characterName: 'Grande-Coração' },
  { id: 5, name: 'O Rio',       subtitle: 'Cidade Celestial',     icon: '✨', bgImage: phase6Bg, accentHue: 45,  characterKey: 'esperanca',         characterName: 'Esperança' },
];

// ─── Generate immersive board tile types ───
// Strategic placement across 210 tiles (35 per phase) for richer narrative pacing
// Each phase has a CURATED pool of tiles that fit its thematic identity

// Phase-specific random tile pools — each phase emphasizes different teachings
const PHASE_TILE_POOLS: Record<number, { tiles: TileType[]; weights: number[] }> = {
  // Phase 0 — A Partida (Cidade da Destruição): aprendizado, primeiros passos, escrituras básicas
  0: {
    tiles:   ['scripture', 'refuge',  'surprise', 'shield',  'normal'],
    weights: [30,          20,        15,         10,        25],
  },
  // Phase 1 — O Caminho (Pântano e Provações): desafios crescentes, correntezas, armadilhas
  1: {
    tiles:   ['challenge', 'trap',    'scripture', 'current',  'shield',  'normal'],
    weights: [20,          20,        15,          15,         10,        20],
  },
  // Phase 2 — O Vale (Sombra da Morte): gigantes, armadilhas pesadas, dilemas morais
  2: {
    tiles:   ['giant',  'trap',    'challenge', 'scripture', 'surprise', 'normal'],
    weights: [15,       25,        20,          15,          5,          20],
  },
  // Phase 3 — A Feira (Vaidade e Provação): trocas, surpresas traiçoeiras, tentações
  3: {
    tiles:   ['swap',   'surprise', 'trap',    'scripture', 'challenge', 'normal'],
    weights: [20,       20,         15,        15,          10,          20],
  },
  // Phase 4 — O Castelo (Dúvida e Resgate): gigantes + bosses, escrituras difíceis, escudos
  4: {
    tiles:   ['giant',  'challenge', 'scripture', 'shield',  'trap',    'normal'],
    weights: [20,       20,          20,          10,        10,        20],
  },
  // Phase 5 — O Rio (Cidade Celestial): bênçãos, refúgios, escrituras finais, recompensas
  5: {
    tiles:   ['blessing', 'refuge',  'scripture', 'double_dice', 'normal'],
    weights: [25,         20,        20,          10,            25],
  },
};

function pickFromWeightedPool(pool: { tiles: TileType[]; weights: number[] }, rngValue: number): TileType {
  const total = pool.weights.reduce((a, b) => a + b, 0);
  let roll = rngValue % total;
  for (let i = 0; i < pool.tiles.length; i++) {
    roll -= pool.weights[i];
    if (roll < 0) return pool.tiles[i];
  }
  return pool.tiles[pool.tiles.length - 1];
}

export function generateImmersiveTiles(seed: number): TileType[] {
  const rng = (s: number) => ((s * 1103515245 + 12345) & 0x7fffffff);
  let s = seed;

  const tiles: TileType[] = [];

  // Fixed narrative tile positions (story-accurate order across 210 tiles)
  const NARRATIVE_TILES: Record<number, TileType> = {
    0: 'start',
    5: 'slough_despond',              // Phase 0: Pântano do Desânimo
    12: 'cross_sepulchre',            // Phase 0: Cruz e Sepulcro
    17: 'wicket_gate',                // Phase 0: Porta Estreita
    22: 'interpreter_house',          // Phase 0: Casa do Intérprete
    27: 'simple_sloth_presumption',   // Phase 0: Dormentes do Caminho
    30: 'hill_difficulty',            // Phase 0: Monte Dificuldade
    34: 'palace_beautiful',           // Phase 0→1: Palácio Formoso
    35: 'checkpoint',                 // Phase 1 start
    42: 'valley_humiliation',         // Phase 1: Vale da Humilhação
    50: 'little_faith',              // Phase 1: Pouca-Fé
    58: 'valley_shadow',             // Phase 1: Vale da Sombra da Morte
    65: 'river_of_life',             // Phase 1: Rio da Vida
    70: 'checkpoint',                // Phase 2 start
    78: 'vanity_fair',               // Phase 2: Feira da Vaidade
    88: 'hill_lucre',                // Phase 2: Mina de Demas
    98: 'by_path_meadow',            // Phase 2: Prado do Atalho
    105: 'checkpoint',               // Phase 3 start
    115: 'doubting_castle',           // Phase 3: Castelo da Dúvida
    140: 'checkpoint',               // Phase 4 start
    148: 'delectable_mountains',      // Phase 4: Montanhas Deleitosas
    155: 'flatterer_net',             // Phase 4: Rede do Lisonjeiro
    162: 'enchanted_ground',          // Phase 4: Terra Encantada
    168: 'atheist_encounter',         // Phase 4: O Ateu
    175: 'checkpoint',               // Phase 5 start
    185: 'ignorance_path',            // Phase 5: Ignorância
    195: 'beulah_land',               // Phase 5: Terra de Beulá
    209: 'finish',                    // Cidade Celestial
  };

  for (let i = 0; i < IMMERSIVE_BOARD_SIZE; i++) {
    // Fixed narrative positions take priority
    if (NARRATIVE_TILES[i] !== undefined) {
      tiles.push(NARRATIVE_TILES[i]);
      continue;
    }

    const localIdx = i % TILES_PER_PHASE;
    const phaseIdx = Math.min(Math.floor(i / TILES_PER_PHASE), 5);

    // Checkpoints at phase boundaries
    if (localIdx === 0) { tiles.push('checkpoint'); continue; }

    // ─── FIXED STRATEGIC POSITIONS (same every game, phase-aware) ───

    // Shield early in phase — prepare for what's ahead
    if (localIdx === 4) { tiles.push('shield'); continue; }

    // Trap early — first test of the phase
    if (localIdx === 6) { tiles.push('trap'); continue; }

    // Scripture — foundational teaching moment
    if (localIdx === 10) { tiles.push('scripture'); continue; }

    // Challenge at midpoint — the phase's main trial
    if (localIdx === 15) { tiles.push('challenge'); continue; }

    // Refuge right after challenge — rest and recovery
    if (localIdx === 16) { tiles.push('refuge'); continue; }

    // Giant encounter — major obstacle
    if (localIdx === 22 && phaseIdx >= 1) { tiles.push('giant'); continue; }
    // Refuge right after giant
    if (localIdx === 23 && phaseIdx >= 1) { tiles.push('refuge'); continue; }
    // Phase 0 doesn't have giants yet — use scripture instead
    if (localIdx === 22 && phaseIdx === 0) { tiles.push('scripture'); continue; }
    if (localIdx === 23 && phaseIdx === 0) { tiles.push('refuge'); continue; }

    // Second scripture — deeper teaching
    if (localIdx === 24) { tiles.push('scripture'); continue; }

    // Trap near end — last test before next phase
    if (localIdx === 30) { tiles.push('trap'); continue; }

    // Back to start — rare punishment, only from phase 2+ (after players understand the game)
    if (localIdx === 32 && phaseIdx >= 2) { tiles.push('back_to_start'); continue; }

    // ─── PHASE-THEMATIC RANDOM TILES ───
    // ~45% chance of phase-specific tile, 55% normal (breathing room)
    s = rng(s);
    if ((s % 100) < 45) {
      s = rng(s);
      const pool = PHASE_TILE_POOLS[phaseIdx] || PHASE_TILE_POOLS[0];
      tiles.push(pickFromWeightedPool(pool, s));
    } else {
      tiles.push('normal');
    }
  }
  return tiles;
}

// ─── Trail coordinates for winding path within each phase ───
// 35 tiles per phase for generous card spacing
export function getTrailPositions(tilesCount: number = TILES_PER_PHASE): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < tilesCount; i++) {
    const t = i / (tilesCount - 1);
    const y = 2 + t * 96; // 2% to 98%
    // Wider, slower wave for more organic path with less repetition
    const wave = Math.sin(t * Math.PI * 3.5) * 28 + Math.sin(t * Math.PI * 7) * 8;
    const x = 50 + wave;
    positions.push({ x: Math.max(14, Math.min(86, x)), y });
  }
  return positions;
}
