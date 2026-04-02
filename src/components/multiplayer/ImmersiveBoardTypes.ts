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

// 120 tiles total, 20 per phase (each phase = ~2 phone screens)
export const IMMERSIVE_BOARD_SIZE = 120;
export const TILES_PER_PHASE = 20;

// ─── 20+ Tile Types (including narrative locations) ───
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
  | 'enchanted_ground' | 'beulah_land';

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
// Strategic placement: traps at positions 6 and 18 (penultimate) of each phase,
// giants at position 13, refuges right after giants/challenges
export function generateImmersiveTiles(seed: number): TileType[] {
  const rng = (s: number) => ((s * 1103515245 + 12345) & 0x7fffffff);
  let s = seed;

  const tiles: TileType[] = [];

  // Fixed narrative tile positions (story-accurate order across 120 tiles)
  const NARRATIVE_TILES: Record<number, TileType> = {
    0: 'start',
    4: 'wicket_gate',           // Phase 0: Porta Estreita (Boa Vontade)
    8: 'interpreter_house',     // Phase 0: Casa do Intérprete
    14: 'hill_difficulty',       // Phase 0: Monte Dificuldade
    19: 'palace_beautiful',      // Phase 0→1: Palácio Formoso (checkpoint)
    24: 'valley_humiliation',    // Phase 1: Vale da Humilhação (Apolião)
    33: 'valley_shadow',         // Phase 1: Vale da Sombra da Morte
    40: 'checkpoint',            // Phase 2 boundary
    48: 'vanity_fair',           // Phase 2: Feira da Vaidade
    60: 'checkpoint',            // Phase 3 boundary
    68: 'doubting_castle',       // Phase 3: Castelo da Dúvida (Gigante Desespero)
    80: 'checkpoint',            // Phase 4 boundary
    85: 'delectable_mountains',  // Phase 4: Montanhas Deleitosas
    95: 'enchanted_ground',      // Phase 4: Terra Encantada
    100: 'checkpoint',           // Phase 5 boundary
    108: 'beulah_land',          // Phase 5: Terra de Beulá
    119: 'finish',               // Cidade Celestial
  };

  for (let i = 0; i < IMMERSIVE_BOARD_SIZE; i++) {
    // Fixed narrative positions take priority
    if (NARRATIVE_TILES[i] !== undefined) {
      tiles.push(NARRATIVE_TILES[i]);
      continue;
    }

    const localIdx = i % TILES_PER_PHASE;
    const phaseIdx = Math.floor(i / TILES_PER_PHASE);

    // Checkpoints at phase boundaries
    if (localIdx === 0) { tiles.push('checkpoint'); continue; }

    // Strategic trap at position 6 of each phase
    if (localIdx === 5) { tiles.push('trap'); continue; }

    // Challenge at midpoint (position 10)
    if (localIdx === 9) { tiles.push('challenge'); continue; }
    // Refuge right after challenge
    if (localIdx === 10) { tiles.push('refuge'); continue; }

    // Giant at position 14
    if (localIdx === 13) { tiles.push('giant'); continue; }
    // Refuge right after giant
    if (localIdx === 14) { tiles.push('refuge'); continue; }

    // Strategic trap at penultimate position (18)
    if (localIdx === 17) { tiles.push('trap'); continue; }

    // Back to start — rare, from phase 2 onward
    if (localIdx === 18 && phaseIdx >= 2) { tiles.push('back_to_start'); continue; }

    // Scripture near end of phase
    if (localIdx === 15) { tiles.push('scripture'); continue; }

    // Shield early in phase
    if (localIdx === 3) { tiles.push('shield'); continue; }

    // ~60% chance of special tile, 40% normal (more normal = better spacing)
    s = rng(s);
    if ((s % 100) < 55) {
      s = rng(s);
      const pool: TileType[] = ['surprise', 'blessing', 'swap', 'double_dice', 'current', 'scripture', 'challenge', 'normal'];
      tiles.push(pool[s % pool.length]);
    } else {
      tiles.push('normal');
    }
  }
  return tiles;
}

// ─── Trail coordinates for winding path within each phase ───
// 20 tiles spanning ~500svh (~5 phone screens per phase) for generous card spacing
export function getTrailPositions(tilesCount: number = TILES_PER_PHASE): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < tilesCount; i++) {
    const t = i / (tilesCount - 1);
    const y = 3 + t * 94; // 3% to 97% — safe margin to stay inside phase
    // Serpentine: alternates left-right
    const wave = Math.sin(t * Math.PI * 3.5) * 26;
    const x = 50 + wave;
    positions.push({ x: Math.max(16, Math.min(84, x)), y });
  }
  return positions;
}
