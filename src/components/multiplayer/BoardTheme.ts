import { BoardEvent } from '@/lib/multiplayerTypes';

// Section themes for the 6 phases of the journey
export const BOARD_SECTIONS = [
  { name: 'A Partida', subtitle: 'Cidade da Destruição', gradient: 'from-amber-900/40 to-stone-900/60', accent: 'hsl(30 50% 35%)', icon: '🏚️' },
  { name: 'O Caminho', subtitle: 'Através do Pântano', gradient: 'from-emerald-900/40 to-stone-900/60', accent: 'hsl(140 40% 30%)', icon: '🗺️' },
  { name: 'O Vale', subtitle: 'Sombra da Morte', gradient: 'from-indigo-900/50 to-stone-900/70', accent: 'hsl(240 35% 30%)', icon: '💀' },
  { name: 'A Feira', subtitle: 'Vaidade e Provação', gradient: 'from-red-900/40 to-stone-900/60', accent: 'hsl(0 45% 35%)', icon: '🎪' },
  { name: 'O Castelo', subtitle: 'Dúvida e Resgate', gradient: 'from-purple-900/40 to-stone-900/60', accent: 'hsl(270 40% 30%)', icon: '🏰' },
  { name: 'O Rio', subtitle: 'Cidade Celestial', gradient: 'from-amber-800/50 to-yellow-900/40', accent: 'hsl(40 60% 45%)', icon: '✨' },
];

// Get tile visual style based on event type
export function getTileStyle(event: BoardEvent | undefined, isStart: boolean, isEnd: boolean) {
  if (isStart) return { bg: 'bg-amber-900/60', ring: 'ring-amber-500/50', glow: 'shadow-amber-500/20', symbol: '🏠' };
  if (isEnd) return { bg: 'bg-amber-700/60', ring: 'ring-amber-400/60', glow: 'shadow-amber-400/30', symbol: '🏰' };
  if (!event) return { bg: 'bg-card/40', ring: 'ring-border', glow: '', symbol: '·' };

  switch (event.type) {
    case 'advance': return { bg: 'bg-emerald-900/50', ring: 'ring-emerald-500/40', glow: 'shadow-emerald-500/15', symbol: '↑' };
    case 'boost': return { bg: 'bg-sky-900/50', ring: 'ring-sky-500/40', glow: 'shadow-sky-500/15', symbol: '★' };
    case 'retreat': return { bg: 'bg-red-900/50', ring: 'ring-red-500/40', glow: 'shadow-red-500/15', symbol: '↓' };
    case 'stun': return { bg: 'bg-purple-900/50', ring: 'ring-purple-500/40', glow: 'shadow-purple-500/15', symbol: '⚡' };
    case 'challenge': return { bg: 'bg-amber-900/50', ring: 'ring-amber-500/40', glow: 'shadow-amber-500/15', symbol: '⚔' };
    case 'safe': return { bg: 'bg-primary/20', ring: 'ring-primary/40', glow: 'shadow-primary/15', symbol: '🛡' };
    case 'swap': return { bg: 'bg-pink-900/50', ring: 'ring-pink-500/40', glow: 'shadow-pink-500/15', symbol: '⟳' };
    case 'steal': return { bg: 'bg-orange-900/50', ring: 'ring-orange-500/40', glow: 'shadow-orange-500/15', symbol: '✋' };
    case 'shield': return { bg: 'bg-primary/30', ring: 'ring-primary/50', glow: 'shadow-primary/20', symbol: '🛡' };
    default: return { bg: 'bg-card/40', ring: 'ring-border', glow: '', symbol: '·' };
  }
}

// Get section index for a tile position
export function getSectionIndex(position: number, boardSize: number): number {
  return Math.min(5, Math.floor((position / boardSize) * 6));
}

// Generate serpentine path coordinates
export function getSerpentineLayout(boardSize: number, cols: number = 5) {
  const positions: { row: number; col: number; reversed: boolean }[] = [];
  for (let i = 0; i < boardSize; i++) {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const reversed = row % 2 === 1;
    const col = reversed ? (cols - 1 - colInRow) : colInRow;
    positions.push({ row, col, reversed });
  }
  return positions;
}
