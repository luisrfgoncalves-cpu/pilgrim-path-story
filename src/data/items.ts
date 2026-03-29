export interface StoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const storyItems: Record<string, StoryItem> = {
  pergaminho_verdade: {
    id: 'pergaminho_verdade',
    name: 'Pergaminho da Verdade',
    description: 'Um antigo pergaminho que ilumina caminhos obscuros.',
    icon: '📜',
    rarity: 'rare',
  },
  armadura_fe: {
    id: 'armadura_fe',
    name: 'Armadura da Fé',
    description: 'Proteção espiritual que fortalece nos momentos de dúvida.',
    icon: '🛡️',
    rarity: 'legendary',
  },
  chave_promessa: {
    id: 'chave_promessa',
    name: 'Chave da Promessa',
    description: 'Abre portas que parecem impossíveis de abrir.',
    icon: '🗝️',
    rarity: 'legendary',
  },
  lampada_discernimento: {
    id: 'lampada_discernimento',
    name: 'Lâmpada do Discernimento',
    description: 'Revela o que os olhos não conseguem ver.',
    icon: '🏮',
    rarity: 'rare',
  },
  pedra_memorial: {
    id: 'pedra_memorial',
    name: 'Pedra Memorial',
    description: 'Uma pedra que marca um momento importante da jornada.',
    icon: '🪨',
    rarity: 'common',
  },
  manto_coragem: {
    id: 'manto_coragem',
    name: 'Manto da Coragem',
    description: 'Um manto que aquece e fortalece quem o usa.',
    icon: '🧥',
    rarity: 'rare',
  },
  selo_peregrino: {
    id: 'selo_peregrino',
    name: 'Selo do Peregrino',
    description: 'Marca de quem atravessou o vale e não desistiu.',
    icon: '⭐',
    rarity: 'legendary',
  },
};
