// ─── Immersive Board Types & Data ───

import phase1Bg from '@/assets/board/phase1-cidade-destruicao.jpg';
import phase1bBg from '@/assets/board/phase1b-cidade-destruicao.jpg';
import phase2Bg from '@/assets/board/phase2-pantano-caminho.jpg';
import phase2bBg from '@/assets/board/phase2b-pantano-caminho.jpg';
import phase3Bg from '@/assets/board/phase3-vale-sombra.jpg';
import phase3bBg from '@/assets/board/phase3b-vale-sombra.jpg';
import phase4Bg from '@/assets/board/phase4-feira-vaidade.jpg';
import phase4bBg from '@/assets/board/phase4b-feira-vaidade.jpg';
import phase5Bg from '@/assets/board/phase5-castelo-duvida.jpg';
import phase5bBg from '@/assets/board/phase5b-castelo-duvida.jpg';
import phase6Bg from '@/assets/board/phase6-cidade-celestial.jpg';
import phase6bBg from '@/assets/board/phase6b-cidade-celestial.jpg';

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

// 120 tiles total, 20 per phase (each phase = ~2 phone screens)
export const IMMERSIVE_BOARD_SIZE = 120;
export const TILES_PER_PHASE = 20;

// ─── 12 Tile Types ───
export type TileType =
  | 'start' | 'finish'
  | 'refuge' | 'challenge' | 'surprise' | 'scripture'
  | 'trap' | 'giant' | 'shield' | 'blessing'
  | 'swap' | 'double_dice' | 'current' | 'checkpoint'
  | 'normal';

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
  normal:      { type: 'normal',      label: 'Caminho',        emoji: '·',  color: 'hsl(0 0% 40%)',   glowColor: 'rgba(100,100,100,0.1)',description: 'Siga em frente', sfx: undefined },
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
  bgImage2: string; // second bg to avoid stretching
  accentHue: number;
  trailStyle: 'stone' | 'dirt' | 'forest' | 'dark' | 'golden' | 'mystic';
  characterKey?: string;
  characterName?: string;
}

export const PHASES: PhaseConfig[] = [
  { id: 0, name: 'A Partida',   subtitle: 'Cidade da Destruição',  icon: '🏚️', bgImage: phase1Bg, bgImage2: phase1bBg, accentHue: 30,  trailStyle: 'stone',  characterKey: 'evangelista',       characterName: 'Evangelista' },
  { id: 1, name: 'O Caminho',   subtitle: 'Pântano e Provações',   icon: '🗺️', bgImage: phase2Bg, bgImage2: phase2bBg, accentHue: 140, trailStyle: 'forest', characterKey: 'apolion',           characterName: 'Apolião' },
  { id: 2, name: 'O Vale',      subtitle: 'Sombra da Morte',       icon: '💀', bgImage: phase3Bg, bgImage2: phase3bBg, accentHue: 260, trailStyle: 'dark',   characterKey: 'gigante_desespero', characterName: 'Gigante Desespero' },
  { id: 3, name: 'A Feira',     subtitle: 'Vaidade e Provação',    icon: '🎪', bgImage: phase4Bg, bgImage2: phase4bBg, accentHue: 0,   trailStyle: 'stone',  characterKey: 'falador',           characterName: 'Falador' },
  { id: 4, name: 'O Castelo',   subtitle: 'Dúvida e Resgate',     icon: '🏰', bgImage: phase5Bg, bgImage2: phase5bBg, accentHue: 270, trailStyle: 'mystic', characterKey: 'grande_coracao',    characterName: 'Grande-Coração' },
  { id: 5, name: 'O Rio',       subtitle: 'Cidade Celestial',     icon: '✨', bgImage: phase6Bg, bgImage2: phase6bBg, accentHue: 45,  trailStyle: 'golden', characterKey: 'esperanca',         characterName: 'Esperança' },
];

// ─── Generate immersive board tile types ───
// Strategic placement: traps at positions 6 and 18 (penultimate) of each phase,
// giants at position 13, refuges right after giants/challenges
export function generateImmersiveTiles(seed: number): TileType[] {
  const rng = (s: number) => ((s * 1103515245 + 12345) & 0x7fffffff);
  let s = seed;

  const tiles: TileType[] = [];
  for (let i = 0; i < IMMERSIVE_BOARD_SIZE; i++) {
    const localIdx = i % TILES_PER_PHASE;

    if (i === 0) { tiles.push('start'); continue; }
    if (i === IMMERSIVE_BOARD_SIZE - 1) { tiles.push('finish'); continue; }

    // Checkpoints at phase boundaries (every 20 tiles)
    if (localIdx === 0) { tiles.push('checkpoint'); continue; }

    // Strategic trap at position 6 of each phase (catches players who roll 6 twice)
    if (localIdx === 5) { tiles.push('trap'); continue; }

    // Challenge/scripture at position 10 (midpoint of each phase)
    if (localIdx === 9) { tiles.push('challenge'); continue; }
    // Refuge right after challenge (win reward)
    if (localIdx === 10) { tiles.push('refuge'); continue; }

    // Giant at position 14 of each phase
    if (localIdx === 13) { tiles.push('giant'); continue; }
    // Refuge right after giant (win reward)
    if (localIdx === 14) { tiles.push('refuge'); continue; }

    // Strategic trap at penultimate position (18) of each phase
    if (localIdx === 17) { tiles.push('trap'); continue; }

    // Scripture near end of phase
    if (localIdx === 15) { tiles.push('scripture'); continue; }

    // Shield early in phase
    if (localIdx === 3) { tiles.push('shield'); continue; }

    // ~65% chance of special tile, 35% normal
    s = rng(s);
    if ((s % 100) < 65) {
      s = rng(s);
      const pool: TileType[] = ['surprise', 'blessing', 'swap', 'double_dice', 'current', 'scripture', 'challenge'];
      tiles.push(pool[s % pool.length]);
    } else {
      tiles.push('normal');
    }
  }
  return tiles;
}

// ─── Trail coordinates for winding path within each phase ───
// 20 tiles spanning ~200svh (2 phone screens per phase)
export function getTrailPositions(tilesCount: number = TILES_PER_PHASE): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < tilesCount; i++) {
    const t = i / (tilesCount - 1);
    const y = 4 + t * 92; // 4% to 96% vertical
    // Serpentine: alternates left-right with more pronounced waves
    const wave = Math.sin(t * Math.PI * 3.5) * 30;
    const x = 50 + wave;
    positions.push({ x: Math.max(14, Math.min(86, x)), y });
  }
  return positions;
}
