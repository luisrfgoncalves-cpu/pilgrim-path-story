export interface StoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const storyItems: Record<string, StoryItem> = {
  // ── Itens originais ──
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
    description: 'A chave que Cristão encontrou em seu peito e que abriu todas as portas do Castelo da Dúvida. "Eu tenho no meu peito uma chave chamada Promessa."',
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

  // ── Armadura de Deus (Efésios 6:10-18) ──
  cinturao_verdade: {
    id: 'cinturao_verdade',
    name: 'Cinturão da Verdade',
    description: 'O cinturão que cinge os lombos com a verdade. "Estai, pois, firmes, tendo cingidos os vossos lombos com a verdade." (Ef 6:14)',
    icon: '⚔️',
    rarity: 'rare',
  },
  couraca_justica: {
    id: 'couraca_justica',
    name: 'Couraça da Justiça',
    description: 'A couraça que protege o coração do peregrino com a justiça de Cristo. "Vestidos com a couraça da justiça." (Ef 6:14)',
    icon: '🦺',
    rarity: 'rare',
  },
  sandalias_evangelho: {
    id: 'sandalias_evangelho',
    name: 'Sandálias do Evangelho da Paz',
    description: 'Calçados que firmam os pés na prontidão do evangelho da paz. "Calçados os pés na preparação do evangelho da paz." (Ef 6:15)',
    icon: '👣',
    rarity: 'rare',
  },
  escudo_fe: {
    id: 'escudo_fe',
    name: 'Escudo da Fé',
    description: 'O escudo com o qual o peregrino apaga todos os dardos inflamados do maligno. Cristão o usou contra Apolião. (Ef 6:16)',
    icon: '🛡️',
    rarity: 'legendary',
  },
  capacete_salvacao: {
    id: 'capacete_salvacao',
    name: 'Capacete da Salvação',
    description: 'O capacete que protege a mente do peregrino, assegurando a certeza da salvação. "Tomai o capacete da salvação." (Ef 6:17)',
    icon: '⛑️',
    rarity: 'legendary',
  },
  espada_espirito: {
    id: 'espada_espirito',
    name: 'Espada do Espírito',
    description: 'A Palavra de Deus, a única arma ofensiva da armadura. Cristão a usou para ferir Apolião no Vale da Humilhação. "A espada do Espírito, que é a palavra de Deus." (Ef 6:17)',
    icon: '⚔️',
    rarity: 'legendary',
  },

  // ── Itens simbólicos da obra ──
  pergaminho_selado: {
    id: 'pergaminho_selado',
    name: 'Pergaminho Selado',
    description: 'O certificado dado pelos Três Seres Resplandecentes ao pé da Cruz. É o passaporte de Cristão para entrar na Cidade Celestial. Quase o perdeu na Colina da Dificuldade.',
    icon: '📋',
    rarity: 'legendary',
  },
  vestes_novas: {
    id: 'vestes_novas',
    name: 'Vestes Novas',
    description: 'As roupas brilhantes que Cristão recebeu em troca de seus trapos quando seu fardo caiu ao pé da Cruz. Símbolo da justiça imputada.',
    icon: '👘',
    rarity: 'rare',
  },
  marca_na_testa: {
    id: 'marca_na_testa',
    name: 'Marca na Testa',
    description: 'O sinal colocado na testa de Cristão por um dos Seres Resplandecentes, indicando que ele pertence ao Rei.',
    icon: '✝️',
    rarity: 'rare',
  },
  folhas_arvore_vida: {
    id: 'folhas_arvore_vida',
    name: 'Folhas da Árvore da Vida',
    description: 'Folhas curativas encontradas após a batalha com Apolião. Cristão as aplicou às feridas e foi imediatamente curado.',
    icon: '🌿',
    rarity: 'rare',
  },
  trombeta_celestial: {
    id: 'trombeta_celestial',
    name: 'Trombeta Celestial',
    description: 'As trombetas que soaram quando Cristão e Esperançoso atravessaram o Rio da Morte e foram recebidos nos portões da Cidade Celestial.',
    icon: '📯',
    rarity: 'legendary',
  },
};
