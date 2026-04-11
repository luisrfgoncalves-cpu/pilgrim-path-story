// ═══════════════════════════════════════════════════════
// PERSONAGENS DO PEREGRINO — Habilidades Passivas Únicas
// Cada peregrino tem uma identidade e poder especial
// ═══════════════════════════════════════════════════════

export interface PilgrimCharacter {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  passive: {
    name: string;
    description: string;
    /** Applied during game logic */
    effect: PassiveEffect;
  };
  startingBonus: Partial<Record<'fe' | 'coragem' | 'perseveranca' | 'discernimento', number>>;
  color: string;
}

export type PassiveEffect =
  | { type: 'trap_resistance'; chance: number }       // % chance to ignore traps
  | { type: 'stun_reduction'; amount: number }         // reduce stun turns
  | { type: 'scripture_bonus'; extraAttr: number }     // extra attr on scripture success
  | { type: 'courage_aura'; groupBonus: number }       // group gets courage bonus on boss win
  | { type: 'healing_touch'; attrRestore: number }     // restore attrs at refuges
  | { type: 'wisdom_insight'; hintChance: number }     // % chance to get a hint on riddles
  | { type: 'shield_keeper'; shieldDurability: number } // shield lasts N extra hits
  | { type: 'faithful_stride'; extraMove: number };     // +N extra tiles on blessing tiles

export const PILGRIM_CHARACTERS: PilgrimCharacter[] = [
  {
    id: 'cristao',
    name: 'Cristão',
    title: 'O Peregrino',
    emoji: '⚔️',
    description: 'O protagonista da jornada. Determinado e resiliente, avança mesmo quando tudo parece perdido.',
    passive: {
      name: 'Fardo Liberto',
      description: 'Ao cair em armadilha, 30% de chance de ignorar o efeito (o fardo já caiu na Cruz).',
      effect: { type: 'trap_resistance', chance: 30 },
    },
    startingBonus: { perseveranca: 1 },
    color: '#E8724A',
  },
  {
    id: 'fiel',
    name: 'Fiel',
    title: 'O Mártir Corajoso',
    emoji: '🔥',
    description: 'Fiel até a morte. Sua coragem inspira o grupo e enfrenta gigantes sem hesitar.',
    passive: {
      name: 'Testemunho Inabalável',
      description: 'Quando o grupo vence um Boss, todos ganham +1 Coragem extra.',
      effect: { type: 'courage_aura', groupBonus: 1 },
    },
    startingBonus: { coragem: 2 },
    color: '#EF5350',
  },
  {
    id: 'esperanca',
    name: 'Esperança',
    title: 'O Companheiro Leal',
    emoji: '🌟',
    description: 'Otimista incurável. Onde outros veem derrota, ele vê oportunidade de aprender.',
    passive: {
      name: 'Luz na Escuridão',
      description: 'Tempo de paralisia (stun) reduzido em 1 turno.',
      effect: { type: 'stun_reduction', amount: 1 },
    },
    startingBonus: { fe: 1, perseveranca: 1 },
    color: '#FFD54F',
  },
  {
    id: 'prudencia',
    name: 'Prudência',
    title: 'A Sábia Conselheira',
    emoji: '📖',
    description: 'Estudiosa das Escrituras. Seu conhecimento é arma e escudo contra as trevas.',
    passive: {
      name: 'Discípula da Palavra',
      description: 'Ao acertar Escritura, ganha +1 Discernimento extra.',
      effect: { type: 'scripture_bonus', extraAttr: 1 },
    },
    startingBonus: { discernimento: 2 },
    color: '#AB47BC',
  },
  {
    id: 'caridade',
    name: 'Caridade',
    title: 'A Curandeira',
    emoji: '💝',
    description: 'Seu amor pelos outros cura feridas invisíveis. Nos refúgios, sua presença é multiplicada.',
    passive: {
      name: 'Mãos que Curam',
      description: 'Em casas de Refúgio, restaura +2 em todos os atributos (ao invés de +1).',
      effect: { type: 'healing_touch', attrRestore: 2 },
    },
    startingBonus: { fe: 1, coragem: 1 },
    color: '#4CAF50',
  },
  {
    id: 'evangelista',
    name: 'Evangelista',
    title: 'O Guia Profético',
    emoji: '🗺️',
    description: 'Conhece os caminhos como ninguém. Seus avisos já salvaram muitos peregrinos.',
    passive: {
      name: 'Visão Profética',
      description: 'Em bênçãos, avança +1 casa extra.',
      effect: { type: 'faithful_stride', extraMove: 1 },
    },
    startingBonus: { discernimento: 1, fe: 1 },
    color: '#42A5F5',
  },
  {
    id: 'valente',
    name: 'Valente-pela-Verdade',
    title: 'O Guerreiro',
    emoji: '🗡️',
    description: 'Coberto de cicatrizes de batalha, mas cada uma conta uma vitória. Seu escudo dura mais.',
    passive: {
      name: 'Escudo Reforçado',
      description: 'O Escudo da Fé protege contra 2 ataques ao invés de 1.',
      effect: { type: 'shield_keeper', shieldDurability: 2 },
    },
    startingBonus: { coragem: 2 },
    color: '#FF7043',
  },
  {
    id: 'misericordia',
    name: 'Misericórdia',
    title: 'A Intercessora',
    emoji: '🕊️',
    description: 'Sua fé simples mas profunda move montanhas. Nos desafios, recebe pistas do Alto.',
    passive: {
      name: 'Sussurro do Espírito',
      description: '25% de chance de receber uma dica extra em charadas e desafios.',
      effect: { type: 'wisdom_insight', hintChance: 25 },
    },
    startingBonus: { fe: 2 },
    color: '#26C6DA',
  },
];

/** Get character by id */
export function getCharacter(id: string): PilgrimCharacter | undefined {
  return PILGRIM_CHARACTERS.find(c => c.id === id);
}

/** Check if a passive effect triggers (RNG-based) */
export function checkPassive(effect: PassiveEffect, type: string): boolean {
  if (effect.type === type) {
    if ('chance' in effect) return Math.random() * 100 < effect.chance;
    if ('hintChance' in effect) return Math.random() * 100 < effect.hintChance;
    return true;
  }
  return false;
}
