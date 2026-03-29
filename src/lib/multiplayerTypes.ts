// ─── Multiplayer Types ───

export interface GameRoom {
  id: string;
  code: string;
  host_id: string;
  status: 'waiting' | 'playing' | 'finished';
  max_players: number;
  current_turn_player_id: string | null;
  turn_order: string[];
  board_size: number;
  created_at: string;
}

export interface GamePlayer {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  position: number;
  attributes: { fe: number; coragem: number; perseveranca: number; discernimento: number };
  is_stunned: boolean;
  stun_turns: number;
  finished: boolean;
  finish_order: number | null;
  last_dice_roll: number | null;
  last_event: string | null;
  color: string;
}

export interface BoardEvent {
  id: string;
  type: 'advance' | 'retreat' | 'stun' | 'swap' | 'boost' | 'steal' | 'shield' | 'challenge' | 'safe';
  title: string;
  description: string;
  effect: {
    target: 'self' | 'others' | 'choose' | 'all';
    positions?: number;
    stunTurns?: number;
    attribute?: string;
    amount?: number;
  };
  emoji: string;
}

export interface DiceResult {
  value: number;
  isManual: boolean;
  timestamp: number;
}

// Board: 30 casas, cada uma com um tipo de evento
export const BOARD_SIZE = 30;

export const PLAYER_COLORS = [
  '#D4AF37', // gold
  '#4A90D9', // blue
  '#D94A4A', // red
  '#4AD97A', // green
  '#D9904A', // orange
  '#9B4AD9', // purple
  '#4AD9D9', // cyan
  '#D94A90', // pink
];

// ─── Board Events Pool ───

export const boardEvents: BoardEvent[] = [
  // Positive
  { id: 'ev1', type: 'advance', title: 'Vento Favorável', description: 'O Espírito sopra a seu favor! Avance casas extras.', effect: { target: 'self', positions: 2 }, emoji: '🌬️' },
  { id: 'ev2', type: 'boost', title: 'Pergaminho da Fé', description: 'Você encontra um pergaminho antigo. Sua fé aumenta!', effect: { target: 'self', attribute: 'fe', amount: 2 }, emoji: '📜' },
  { id: 'ev3', type: 'advance', title: 'Atalho Secreto', description: 'Evangelista revela um caminho mais curto!', effect: { target: 'self', positions: 3 }, emoji: '🗺️' },
  { id: 'ev4', type: 'shield', title: 'Armadura de Deus', description: 'Você está protegido do próximo evento negativo.', effect: { target: 'self' }, emoji: '🛡️' },
  { id: 'ev5', type: 'boost', title: 'Auxílio Aparece', description: 'Uma mão amiga te levanta! Coragem aumenta.', effect: { target: 'self', attribute: 'coragem', amount: 2 }, emoji: '🤝' },

  // Negative
  { id: 'ev6', type: 'retreat', title: 'Pântano do Desânimo', description: 'Você afunda no pântano! Recue casas.', effect: { target: 'self', positions: -3 }, emoji: '🌊' },
  { id: 'ev7', type: 'stun', title: 'Gigante Desespero', description: 'O Gigante te captura! Perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '👹' },
  { id: 'ev8', type: 'retreat', title: 'Sabedoria Mundana', description: 'Prudência Mundana te desvia do caminho!', effect: { target: 'self', positions: -2 }, emoji: '🐍' },
  { id: 'ev9', type: 'stun', title: 'Feira da Vaidade', description: 'As tentações da feira te paralisam! Perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '🎪' },
  { id: 'ev10', type: 'boost', title: 'Apolião Ataca', description: 'Apolião fere sua coragem!', effect: { target: 'self', attribute: 'coragem', amount: -2 }, emoji: '🐉' },

  // Affect others
  { id: 'ev11', type: 'retreat', title: 'Terremoto no Caminho', description: 'A terra treme! Todos os outros jogadores recuam.', effect: { target: 'others', positions: -2 }, emoji: '🌋' },
  { id: 'ev12', type: 'stun', title: 'Neblina do Vale', description: 'Uma neblina densa confunde outro jogador! Escolha quem perde a vez.', effect: { target: 'choose', stunTurns: 1 }, emoji: '🌫️' },
  { id: 'ev13', type: 'swap', title: 'Troca de Caminhos', description: 'Uma encruzilhada mística troca sua posição com outro jogador!', effect: { target: 'choose' }, emoji: '🔄' },
  { id: 'ev14', type: 'steal', title: 'Falador Engana', description: 'Falador rouba pontos de fé de outro jogador!', effect: { target: 'choose', attribute: 'fe', amount: 2 }, emoji: '🗣️' },
  { id: 'ev15', type: 'advance', title: 'Bênção Compartilhada', description: 'Todos recebem uma bênção! Todos avançam 1 casa.', effect: { target: 'all', positions: 1 }, emoji: '✨' },

  // Challenge (mini-game moments)
  { id: 'ev16', type: 'challenge', title: 'Desafio da Colina', description: 'Role o dado novamente: 4+ avança 3 casas, senão recua 1.', effect: { target: 'self', positions: 3 }, emoji: '⛰️' },
  { id: 'ev17', type: 'challenge', title: 'Porta Estreita', description: 'Role o dado: precisa tirar 3+ para passar. Senão espera uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '🚪' },

  // Safe
  { id: 'ev18', type: 'safe', title: 'Palácio Belo', description: 'Você descansa no Palácio Belo. Nada acontece, mas está seguro.', effect: { target: 'self' }, emoji: '🏰' },
  { id: 'ev19', type: 'safe', title: 'Montanhas Deleitosas', description: 'Os Pastores te mostram a vista. Paz e descanso.', effect: { target: 'self' }, emoji: '⛰️' },
  { id: 'ev20', type: 'safe', title: 'Casa do Intérprete', description: 'O Intérprete te ensina uma lição. Discernimento +1.', effect: { target: 'self', attribute: 'discernimento', amount: 1 }, emoji: '📖' },
];

// Generate board: assign events to each position (fixed per room)
export function generateBoard(seed: number): string[] {
  const rng = (s: number) => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s;
  };
  let s = seed;
  const board: string[] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    s = rng(s);
    // First and last squares are always safe
    if (i === 0 || i === BOARD_SIZE - 1) {
      board.push('ev18');
    } else {
      const idx = s % boardEvents.length;
      board.push(boardEvents[idx].id);
    }
  }
  return board;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
