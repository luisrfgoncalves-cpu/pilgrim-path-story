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
  // ═══ Positivos ═══
  { id: 'ev1', type: 'advance', title: 'Vento Favorável', description: 'O Espírito sopra a seu favor! Avance casas extras.', effect: { target: 'self', positions: 2 }, emoji: '🌬️' },
  { id: 'ev2', type: 'boost', title: 'Pergaminho da Fé', description: 'Você encontra um pergaminho antigo. Sua fé aumenta!', effect: { target: 'self', attribute: 'fe', amount: 2 }, emoji: '📜' },
  { id: 'ev3', type: 'advance', title: 'Evangelista Aponta o Caminho', description: 'Evangelista aparece e revela um atalho seguro!', effect: { target: 'self', positions: 3 }, emoji: '🗺️' },
  { id: 'ev4', type: 'shield', title: 'Armadura de Deus', description: 'Você veste a armadura completa de Efésios 6. Protegido do próximo evento negativo!', effect: { target: 'self' }, emoji: '🛡️' },
  { id: 'ev5', type: 'boost', title: 'Auxílio no Pântano', description: 'Auxílio estende a mão e te levanta! Coragem aumenta.', effect: { target: 'self', attribute: 'coragem', amount: 2 }, emoji: '🤝' },
  { id: 'ev21', type: 'advance', title: 'Cruz do Calvário', description: 'Seu fardo cai ao pé da Cruz! Três Seres Resplandecentes te dão vestes novas. Avance!', effect: { target: 'self', positions: 3 }, emoji: '✝️' },
  { id: 'ev22', type: 'boost', title: 'Espada do Espírito', description: 'Você encontra a Espada do Espírito — a Palavra de Deus. Sua fé e coragem aumentam!', effect: { target: 'self', attribute: 'fe', amount: 1 }, emoji: '⚔️' },
  { id: 'ev23', type: 'boost', title: 'Hospedaria de Gaio', description: 'Gaio te recebe com pão e vinho. Perseverança restaurada!', effect: { target: 'self', attribute: 'perseveranca', amount: 2 }, emoji: '🍷' },
  { id: 'ev24', type: 'advance', title: 'Grande-Coração Escolta', description: 'O valente Grande-Coração te escolta pelo trecho perigoso! Avance com segurança.', effect: { target: 'self', positions: 2 }, emoji: '⚔️' },
  { id: 'ev25', type: 'boost', title: 'Chave da Promessa', description: 'Você encontra a Chave da Promessa no seu peito! Discernimento aumenta.', effect: { target: 'self', attribute: 'discernimento', amount: 2 }, emoji: '🗝️' },

  // ═══ Negativos ═══
  { id: 'ev6', type: 'retreat', title: 'Pântano do Desânimo', description: 'Você afunda no pântano onde pecadores perdem a esperança! Recue casas.', effect: { target: 'self', positions: -3 }, emoji: '🌊' },
  { id: 'ev7', type: 'stun', title: 'Gigante Desespero', description: 'O Gigante Desespero te tranca no Castelo da Dúvida! Perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '👹' },
  { id: 'ev8', type: 'retreat', title: 'Prudência Mundana', description: 'O Sr. Prudência Mundana te desvia para o vilarejo da Moralidade!', effect: { target: 'self', positions: -2 }, emoji: '🐍' },
  { id: 'ev9', type: 'stun', title: 'Feira da Vaidade', description: 'As tentações da Feira da Vaidade te paralisam! Perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '🎪' },
  { id: 'ev10', type: 'boost', title: 'Apolião Ataca', description: 'O terrível Apolião te ataca no Vale da Humilhação! Coragem diminui.', effect: { target: 'self', attribute: 'coragem', amount: -2 }, emoji: '🐉' },
  { id: 'ev26', type: 'retreat', title: 'Rede do Lisonjeiro', description: 'O Lisonjeiro te engana com palavras doces e te prende numa rede! Recue casas.', effect: { target: 'self', positions: -3 }, emoji: '🕸️' },
  { id: 'ev27', type: 'stun', title: 'Terra Encantada', description: 'O ar da Terra Encantada te faz adormecer! Perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '😴' },
  { id: 'ev28', type: 'boost', title: 'Pequena-Fé Assaltado', description: 'Ladrões te atacam como fizeram com Pequena-Fé! Fé diminui.', effect: { target: 'self', attribute: 'fe', amount: -2 }, emoji: '🔪' },
  { id: 'ev29', type: 'stun', title: 'Presunção, Preguiça e Simples', description: 'Você adormece à beira do caminho como os três tolos! Perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '💤' },
  { id: 'ev30', type: 'boost', title: 'Vergonha Confronta', description: 'Vergonha te ataca dizendo que religião é coisa de fracos! Perseverança diminui.', effect: { target: 'self', attribute: 'perseveranca', amount: -2 }, emoji: '😤' },
  { id: 'ev31', type: 'retreat', title: 'Atalho do Prado Agradável', description: 'Você sai do caminho estreito para o Prado Agradável — o Castelo da Dúvida te espera!', effect: { target: 'self', positions: -4 }, emoji: '🌿' },

  // ═══ Afetam outros ═══
  { id: 'ev11', type: 'retreat', title: 'Vale da Sombra da Morte', description: 'As trevas do Vale envolvem todos! Os outros jogadores recuam.', effect: { target: 'others', positions: -2 }, emoji: '💀' },
  { id: 'ev12', type: 'stun', title: 'Neblina do Vale', description: 'Neblina densa confunde outro jogador! Escolha quem perde a vez.', effect: { target: 'choose', stunTurns: 1 }, emoji: '🌫️' },
  { id: 'ev13', type: 'swap', title: 'Troca de Caminhos', description: 'Uma encruzilhada mística troca sua posição com outro jogador!', effect: { target: 'choose' }, emoji: '🔄' },
  { id: 'ev14', type: 'steal', title: 'Falador Rouba', description: 'Falador ilude outro jogador com palavras vazias e rouba sua fé!', effect: { target: 'choose', attribute: 'fe', amount: 2 }, emoji: '🗣️' },
  { id: 'ev15', type: 'advance', title: 'Bênção Compartilhada', description: 'As donzelas do Palácio Belo abençoam todos! Todos avançam 1 casa.', effect: { target: 'all', positions: 1 }, emoji: '✨' },
  { id: 'ev32', type: 'steal', title: 'Interesses Manipula', description: 'Interesses convence outro jogador a seguir um desvio! Rouba perseverança.', effect: { target: 'choose', attribute: 'perseveranca', amount: 2 }, emoji: '💰' },
  { id: 'ev33', type: 'stun', title: 'Madame Bolha Seduz', description: 'Madame Bolha tenta seduzir outro jogador com ouro e prazeres! Escolha quem perde a vez.', effect: { target: 'choose', stunTurns: 1 }, emoji: '💋' },
  { id: 'ev34', type: 'retreat', title: 'Julgamento na Feira', description: 'O Juiz Ódio-ao-Bem persegue a todos! Todos os outros recuam 1 casa.', effect: { target: 'others', positions: -1 }, emoji: '⚖️' },

  // ═══ Desafios ═══
  { id: 'ev16', type: 'challenge', title: 'Colina da Dificuldade', description: 'Subir direto ou pegar os atalhos Perigo/Destruição? Role 4+ para subir e avançar 3!', effect: { target: 'self', positions: 3 }, emoji: '⛰️' },
  { id: 'ev17', type: 'challenge', title: 'Porta Estreita', description: 'Boa-Vontade abre a porta — mas você precisa tirar 3+ para entrar!', effect: { target: 'self', stunTurns: 1 }, emoji: '🚪' },
  { id: 'ev35', type: 'challenge', title: 'Batalha com Apolião', description: 'Apolião bloqueia o caminho! Role 4+ para vencê-lo com a Espada do Espírito e avançar 4!', effect: { target: 'self', positions: 4 }, emoji: '🐉' },
  { id: 'ev36', type: 'challenge', title: 'Travessia do Rio da Morte', description: 'O Rio Final está diante de você! Role 3+ para atravessar com fé. Senão, perde uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '🌊' },
  { id: 'ev37', type: 'challenge', title: 'Fuga do Castelo da Dúvida', description: 'Lembra da Chave da Promessa? Role 3+ para escapar e avançar 3!', effect: { target: 'self', positions: 3 }, emoji: '🗝️' },

  // ═══ Seguros ═══
  { id: 'ev18', type: 'safe', title: 'Palácio Belo', description: 'Discrição, Prudência, Piedade e Caridade te recebem. Descanse em paz.', effect: { target: 'self' }, emoji: '🏰' },
  { id: 'ev19', type: 'safe', title: 'Montanhas Deleitosas', description: 'Os Pastores Conhecimento, Experiência, Vigilante e Sincero te mostram a Cidade Celestial ao longe.', effect: { target: 'self' }, emoji: '🏔️' },
  { id: 'ev20', type: 'safe', title: 'Casa do Intérprete', description: 'O Intérprete te mostra visões de verdades espirituais. Discernimento +1.', effect: { target: 'self', attribute: 'discernimento', amount: 1 }, emoji: '📖' },
  { id: 'ev38', type: 'safe', title: 'País de Beulá', description: 'Você chega à terra de paz e abundância, às portas da Cidade Celestial. O ar é doce e as flores perfumam.', effect: { target: 'self', attribute: 'fe', amount: 1 }, emoji: '🌸' },
  { id: 'ev39', type: 'safe', title: 'Folhas da Árvore da Vida', description: 'Você encontra folhas curativas e restaura suas forças. Perseverança +1.', effect: { target: 'self', attribute: 'perseveranca', amount: 1 }, emoji: '🌿' },
  { id: 'ev40', type: 'safe', title: 'Companhia de Fiel', description: 'Fiel caminha ao seu lado e compartilha seu testemunho. Coragem +1.', effect: { target: 'self', attribute: 'coragem', amount: 1 }, emoji: '🤝' },

  // ═══ Parte II — Eventos extras ═══
  { id: 'ev41', type: 'advance', title: 'Cristã e Misericórdia', description: 'Cristã e Misericórdia te encorajam no caminho! O testemunho delas te impulsiona.', effect: { target: 'self', positions: 2 }, emoji: '👩' },
  { id: 'ev42', type: 'boost', title: 'Valente-pela-Verdade', description: 'Valente-pela-Verdade aparece coberto de sangue da batalha: "Eu venci! E você também vencerá!" Coragem +2.', effect: { target: 'self', attribute: 'coragem', amount: 2 }, emoji: '⚔️' },
  { id: 'ev43', type: 'stun', title: 'Gigante Mata-Bons', description: 'O Gigante Mata-Bons bloqueia o caminho! Perde uma rodada até Grande-Coração te resgatar.', effect: { target: 'self', stunTurns: 1 }, emoji: '👹' },
  { id: 'ev44', type: 'retreat', title: 'Ateísmo Zomba', description: 'Ateísmo aparece rindo: "Não existe Cidade Celestial! Eu busquei por 20 anos!" Sua dúvida te faz recuar.', effect: { target: 'self', positions: -2 }, emoji: '😂' },
  { id: 'ev45', type: 'challenge', title: 'Resistir a Madame Bolha', description: 'Madame Bolha oferece ouro e conforto! Role 4+ para resistir como Firme e avançar 3.', effect: { target: 'self', positions: 3 }, emoji: '💰' },
  { id: 'ev46', type: 'advance', title: 'Velho Honesto Conta Histórias', description: 'Velho Honesto compartilha sabedoria da Cidade da Estupidez. Surpreendentemente, você aprende algo. Avance!', effect: { target: 'self', positions: 1 }, emoji: '👴' },
  { id: 'ev47', type: 'boost', title: 'Mente-Fraca Inspira', description: 'Mesmo frágil, Mente-Fraca não desiste. Sua determinação inspira todos. Perseverança +1.', effect: { target: 'all', attribute: 'perseveranca', amount: 1 }, emoji: '💪' },
  { id: 'ev48', type: 'stun', title: 'Volta-Atrás Capturado', description: 'Você vê Volta-Atrás sendo arrastado por demônios. O horror te paralisa por uma rodada.', effect: { target: 'self', stunTurns: 1 }, emoji: '😱' },
  { id: 'ev49', type: 'challenge', title: 'Grande-Coração Mata o Gigante', description: 'Grande-Coração lidera ataque ao Castelo da Dúvida! Role 3+ para ajudar e avançar 4!', effect: { target: 'self', positions: 4 }, emoji: '🗡️' },
  { id: 'ev50', type: 'safe', title: 'Pronto-para-Parar Caminha', description: 'Pronto-para-Parar caminha com muletas, mas não desiste. Se ele pode, você também pode. Fé +1.', effect: { target: 'self', attribute: 'fe', amount: 1 }, emoji: '🩼' },

  // ═══ Parte II — Eventos adicionais ═══
  { id: 'ev56', type: 'advance', title: 'Banho Cerimonial', description: 'O Intérprete prepara um banho cerimonial para Cristã. Vestes novas e o selo do Rei! Avance!', effect: { target: 'self', positions: 2 }, emoji: '🛁' },
  { id: 'ev57', type: 'challenge', title: 'Gigante Maul', description: 'O Gigante Maul bloqueia o caminho! Role 4+ para que Grande-Coração o derrote e avance 3!', effect: { target: 'self', positions: 3 }, emoji: '👹' },
  { id: 'ev58', type: 'boost', title: 'Casamento na Hospedaria', description: 'Gaio organiza o casamento de Mateus com Misericórdia! A alegria fortalece todos. Fé +2.', effect: { target: 'all', attribute: 'fe', amount: 1 }, emoji: '💒' },
  { id: 'ev59', type: 'advance', title: 'Demolição do Castelo', description: 'Grande-Coração destrói o Castelo da Dúvida pedra por pedra! Nenhum peregrino será preso aqui de novo. Avance 4!', effect: { target: 'self', positions: 4 }, emoji: '🏚️' },
  { id: 'ev60', type: 'retreat', title: 'Mal-Encarados Atacam', description: 'Os Mal-Encarados, servos de Belzebu, atacam logo após o Portão! Recue enquanto o guardião os afugenta.', effect: { target: 'self', positions: -2 }, emoji: '👿' },
  { id: 'ev61', type: 'boost', title: 'Misericórdia Aceita', description: 'Misericórdia é aceita no Portão mesmo sem carta do Rei! Seu amor é carta suficiente. Discernimento +2.', effect: { target: 'self', attribute: 'discernimento', amount: 2 }, emoji: '💝' },
  { id: 'ev62', type: 'challenge', title: 'Resistir ao Sono Encantado', description: 'A Terra Encantada sussurra sonhos doces! Role 4+ para resistir e avançar, senão perde a vez.', effect: { target: 'self', stunTurns: 1 }, emoji: '😴' },
  { id: 'ev63', type: 'safe', title: 'Sr. Desânimo Livre', description: '"Adeus, noite. Bem-vindo, dia." Sr. Desânimo deixa o desânimo na margem do rio. Perseverança +2.', effect: { target: 'self', attribute: 'perseveranca', amount: 2 }, emoji: '🌅' },
  { id: 'ev64', type: 'advance', title: 'Muito-Medo Canta', description: 'Muito-Medo entra no rio cantando! Ela que viveu em terror morre com um hino. Todos avançam inspirados.', effect: { target: 'all', positions: 1 }, emoji: '🎵' },
  { id: 'ev65', type: 'boost', title: 'Pilar de Fogo', description: 'Um pilar de fogo ilumina o Vale da Sombra para o grupo de Cristã! Os demônios recuam. Coragem +2.', effect: { target: 'self', attribute: 'coragem', amount: 2 }, emoji: '🔥' },

  // ═══ Episódios faltantes da Parte I ═══
  { id: 'ev51', type: 'challenge', title: 'Colina da Dificuldade', description: 'A colina é íngreme! Suba direto ou tente o atalho Perigo? Role 4+ para subir e avançar 2!', effect: { target: 'self', positions: 2 }, emoji: '⛰️' },
  { id: 'ev52', type: 'stun', title: 'Sono no Caramanchão', description: 'Você adormeceu no caramanchão e perdeu o pergaminho! Perde uma rodada buscando-o.', effect: { target: 'self', stunTurns: 1 }, emoji: '😴' },
  { id: 'ev53', type: 'challenge', title: 'Leões Acorrentados', description: 'Dois leões bloqueiam o caminho! Role 3+ para passar no centro — eles estão acorrentados!', effect: { target: 'self', positions: 2 }, emoji: '🦁' },
  { id: 'ev54', type: 'retreat', title: 'Mina de Demas', description: 'Demas te convida a ver prata na mina! A ganância te desvia. Recue casas.', effect: { target: 'self', positions: -2 }, emoji: '💎' },
  { id: 'ev55', type: 'boost', title: 'Porteiro Vigilante', description: 'Vigilante te encoraja: "Não tema! Os leões estão presos!" Coragem +2.', effect: { target: 'self', attribute: 'coragem', amount: 2 }, emoji: '👁️' },
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
