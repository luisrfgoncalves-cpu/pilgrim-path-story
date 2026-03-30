// ─── Immersive Board Types & Data ───

import phase1Bg from '@/assets/board/phase1-cidade-destruicao.jpg';
import phase2Bg from '@/assets/board/phase2-pantano-caminho.jpg';
import phase3Bg from '@/assets/board/phase3-vale-sombra.jpg';
import phase4Bg from '@/assets/board/phase4-feira-vaidade.jpg';
import phase5Bg from '@/assets/board/phase5-castelo-duvida.jpg';
import phase6Bg from '@/assets/board/phase6-cidade-celestial.jpg';

// 60 tiles total, 10 per phase
export const IMMERSIVE_BOARD_SIZE = 60;
export const TILES_PER_PHASE = 10;

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
}

export const TILE_TYPES: Record<TileType, TileConfig> = {
  start:       { type: 'start',       label: 'Partida',        emoji: '🏠', color: 'hsl(40 70% 50%)',  glowColor: 'rgba(212,175,55,0.4)', description: 'Início da jornada', sfx: 'gameStart' },
  finish:      { type: 'finish',      label: 'Chegada',        emoji: '🏰', color: 'hsl(40 80% 60%)',  glowColor: 'rgba(255,215,0,0.5)',  description: 'Cidade Celestial!', sfx: 'victory' },
  refuge:      { type: 'refuge',      label: 'Refúgio',        emoji: '🏠', color: 'hsl(140 50% 40%)', glowColor: 'rgba(76,175,80,0.3)',  description: 'Recupera +2 pontos de atributo', sfx: 'heal' },
  challenge:   { type: 'challenge',   label: 'Desafio',        emoji: '⚔️', color: 'hsl(0 60% 50%)',   glowColor: 'rgba(239,83,80,0.4)',  description: 'Mini-game obrigatório!', sfx: 'challenge' },
  surprise:    { type: 'surprise',    label: 'Surpresa',       emoji: '🎁', color: 'hsl(40 80% 55%)',  glowColor: 'rgba(255,213,79,0.4)', description: 'Efeito aleatório — bom ou ruim', sfx: 'surprise' },
  scripture:   { type: 'scripture',   label: 'Escritura',      emoji: '📖', color: 'hsl(210 60% 50%)', glowColor: 'rgba(66,165,245,0.3)', description: 'Pergunta bíblica — acertou = bônus!', sfx: 'scripture' },
  trap:        { type: 'trap',        label: 'Armadilha',      emoji: '🔙', color: 'hsl(270 50% 45%)', glowColor: 'rgba(171,71,188,0.3)', description: 'Volta X casas!', sfx: 'trap' },
  giant:       { type: 'giant',       label: 'Gigante',        emoji: '💀', color: 'hsl(0 0% 25%)',    glowColor: 'rgba(0,0,0,0.5)',      description: 'Perde turno ou volta ao início da fase!', sfx: 'giant' },
  shield:      { type: 'shield',      label: 'Escudo',         emoji: '🛡️', color: 'hsl(0 0% 70%)',   glowColor: 'rgba(192,192,192,0.3)',description: 'Proteção contra próxima armadilha', sfx: 'shield' },
  blessing:    { type: 'blessing',    label: 'Bênção',         emoji: '⭐', color: 'hsl(45 90% 55%)',  glowColor: 'rgba(255,215,0,0.4)',  description: 'Avança X casas extras!', sfx: 'blessing' },
  swap:        { type: 'swap',        label: 'Troca',          emoji: '🔄', color: 'hsl(330 60% 55%)', glowColor: 'rgba(233,30,99,0.3)',  description: 'Troca posição com outro jogador!', sfx: 'swap' },
  double_dice: { type: 'double_dice', label: 'Dado Duplo',     emoji: '🎲', color: 'hsl(25 80% 55%)', glowColor: 'rgba(255,112,67,0.3)', description: 'Joga novamente!', sfx: 'dice' },
  current:     { type: 'current',     label: 'Correnteza',     emoji: '🌊', color: 'hsl(195 70% 50%)',glowColor: 'rgba(38,198,218,0.3)', description: 'Arrasta para frente ou trás aleatoriamente', sfx: 'water' },
  checkpoint:  { type: 'checkpoint',  label: 'Checkpoint',     emoji: '🏰', color: 'hsl(35 70% 45%)', glowColor: 'rgba(212,175,55,0.3)', description: 'Salva posição — não volta antes daqui!', sfx: 'checkpoint' },
  normal:      { type: 'normal',      label: 'Caminho',        emoji: '·',  color: 'hsl(0 0% 40%)',   glowColor: 'rgba(100,100,100,0.1)',description: 'Siga em frente', sfx: undefined },
};

// ─── Phase definitions ───
export interface PhaseConfig {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  bgImage: string;
  accentHue: number;
  characterKey?: string;   // key in characterImages
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
export function generateImmersiveTiles(seed: number): TileType[] {
  const rng = (s: number) => ((s * 1103515245 + 12345) & 0x7fffffff);
  let s = seed;

  const tilePool: TileType[] = [
    'refuge', 'challenge', 'surprise', 'scripture', 'trap', 'giant',
    'shield', 'blessing', 'swap', 'double_dice', 'current', 'checkpoint',
  ];

  const tiles: TileType[] = [];
  for (let i = 0; i < IMMERSIVE_BOARD_SIZE; i++) {
    if (i === 0) { tiles.push('start'); continue; }
    if (i === IMMERSIVE_BOARD_SIZE - 1) { tiles.push('finish'); continue; }

    // Checkpoints at phase boundaries
    if (i % TILES_PER_PHASE === 0) { tiles.push('checkpoint'); continue; }

    // Giants appear once per phase (position 7 of each phase)
    if (i % TILES_PER_PHASE === 7) { tiles.push('giant'); continue; }

    // ~70% chance of special tile, 30% normal
    s = rng(s);
    if ((s % 100) < 70) {
      s = rng(s);
      const idx = s % (tilePool.length - 2); // exclude giant and checkpoint from random pool
      const pool: TileType[] = ['refuge', 'challenge', 'surprise', 'scripture', 'trap',
        'shield', 'blessing', 'swap', 'double_dice', 'current'];
      tiles.push(pool[idx % pool.length]);
    } else {
      tiles.push('normal');
    }
  }
  return tiles;
}

// ─── Trail coordinates for winding path within each phase ───
// Returns CSS positions (%) for each tile within a phase viewport
export function getTrailPositions(tilesCount: number = TILES_PER_PHASE): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < tilesCount; i++) {
    const t = i / (tilesCount - 1);
    const y = 8 + t * 82; // 8% to 90% vertical
    // Serpentine: alternates left-right
    const wave = Math.sin(t * Math.PI * 2.5) * 28;
    const x = 50 + wave;
    positions.push({ x: Math.max(12, Math.min(88, x)), y });
  }
  return positions;
}
