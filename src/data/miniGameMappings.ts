import { MiniGameConfig } from '@/components/MiniGames';

/**
 * Maps chapter IDs to mini-game configs.
 * Mini-games appear BEFORE the choices, adding active gameplay.
 */
export const miniGameMappings: Record<string, MiniGameConfig> = {
  // ═══ FASE 1 — Início da jornada ═══

  // Pântano do Desânimo — stealth para não afundar
  'cena4': {
    type: 'stealth',
    difficulty: 'easy',
    intro: 'O Pântano do Desânimo se abre diante de você. Cada passo deve ser calculado para não afundar na lama da dúvida.',
    successBonus: { perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Encontro com Prudência Mundana — esquiva de tentações
  'cena8': {
    type: 'swipe',
    difficulty: 'easy',
    intro: 'Prudência Mundana sussurra promessas sedutoras. Discerna entre as mentiras e a verdade!',
    successBonus: { discernimento: 1 },
    failurePenalty: { discernimento: -1 },
    swipeItems: [
      { text: 'Caminho fácil', emoji: '🛤️', good: false },
      { text: 'Riqueza rápida', emoji: '💰', good: false },
      { text: 'Paz sem luta', emoji: '😴', good: false },
      { text: 'Palavra de Deus', emoji: '📖', good: true },
      { text: 'Porta Estreita', emoji: '🚪', good: true },
      { text: 'Conforto vão', emoji: '🍷', good: false },
      { text: 'Oração sincera', emoji: '🙏', good: true },
      { text: 'Fé verdadeira', emoji: '✨', good: true },
    ],
  },

  // ═══ FASE 2 — Casa do Intérprete ═══

  // Visões do Intérprete — sequência de memória
  'fase2-cena1': {
    type: 'memory',
    difficulty: 'easy',
    intro: 'O Intérprete revela símbolos sagrados. Memorize as visões para absorver a sabedoria!',
    successBonus: { discernimento: 2 },
    failurePenalty: { discernimento: -1 },
    memorySymbols: ['✝️', '🕊️', '🔥', '💧', '⭐', '📖', '🛡️', '🗝️'],
  },

  // A Cruz e o Fardo — QTE para libertar-se
  'fase2-cena4': {
    type: 'qte',
    difficulty: 'easy',
    intro: 'As correntes do pecado se rompem! Toque nos grilhões para quebrá-los antes que se fechem novamente!',
    successBonus: { fe: 2 },
    failurePenalty: { fe: -1 },
  },

  // ═══ FASE 3 — Vale da Humilhação ═══

  // Batalha contra Apolião — DUELO DE DADOS
  'fase3-cena3': {
    type: 'diceduel',
    difficulty: 'hard',
    intro: 'Apolião surge das sombras! Enfrente-o em um duelo espiritual — use ataque, defesa e oração!',
    successBonus: { coragem: 2, fe: 1 },
    failurePenalty: { coragem: -2 },
    duelEnemy: { name: 'Apolião', emoji: '🐉', power: 7 },
  },

  // Vale da Sombra da Morte — stealth
  'fase3-cena5': {
    type: 'stealth',
    difficulty: 'normal',
    intro: 'O Vale da Sombra da Morte se estende em trevas. Avance em silêncio — os demônios espreitam.',
    successBonus: { coragem: 1, perseveranca: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Encontro com Fiel — Reflexo Divino
  'fase3-cena8': {
    type: 'reflex',
    difficulty: 'easy',
    intro: 'Fiel compartilha sinais que aprendeu no caminho. Repita os gestos para absorver sua sabedoria!',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { fe: -1 },
  },

  // ═══ FASE 4 — Feira da Vaidade ═══

  // Tentações da Feira — esquiva de tentações
  'fase4-cena1': {
    type: 'swipe',
    difficulty: 'normal',
    intro: 'A Feira da Vaidade bombardeia você com ofertas irresistíveis. Resista às tentações mundanas!',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { fe: -1, discernimento: -1 },
    swipeItems: [
      { text: 'Luxúria', emoji: '💋', good: false },
      { text: 'Poder mundano', emoji: '👑', good: false },
      { text: 'Ouro e prata', emoji: '💰', good: false },
      { text: 'Vingança', emoji: '🗡️', good: false },
      { text: 'Orgulho', emoji: '🦚', good: false },
      { text: 'Humildade', emoji: '🙏', good: true },
      { text: 'Verdade', emoji: '📖', good: true },
      { text: 'Amor fraternal', emoji: '❤️', good: true },
      { text: 'Fidelidade', emoji: '🕊️', good: true },
    ],
  },

  // Caça ao tesouro na Feira
  'fase4-cena3': {
    type: 'treasure',
    difficulty: 'normal',
    intro: 'Em meio ao caos da Feira, há tesouros espirituais escondidos. Encontre-os antes que sejam perdidos para sempre!',
    successBonus: { discernimento: 1 },
    failurePenalty: { discernimento: -1 },
    treasures: [
      { emoji: '📖', label: 'Escritura escondida', bonus: { discernimento: 1 } },
      { emoji: '🕊️', label: 'Pomba da paz', bonus: { fe: 1 } },
      { emoji: '🛡️', label: 'Escudo da fé', bonus: { coragem: 1 } },
      { emoji: '🗝️', label: 'Chave da verdade', bonus: { perseveranca: 1 } },
    ],
  },

  // Julgamento de Fiel — memória
  'fase4-cena5': {
    type: 'memory',
    difficulty: 'normal',
    intro: 'No tribunal, você deve lembrar as verdades da fé para defender Fiel. Memorize os argumentos!',
    successBonus: { discernimento: 2, coragem: 1 },
    failurePenalty: { discernimento: -1 },
  },

  // ═══ FASE 5 — Castelo da Dúvida ═══

  // Prisão do Gigante Desespero — DUELO DE DADOS
  'fase5-cena3': {
    type: 'diceduel',
    difficulty: 'normal',
    intro: 'O Gigante Desespero bloqueia sua fuga! Enfrente-o com coragem e fé!',
    successBonus: { perseveranca: 2, coragem: 1 },
    failurePenalty: { perseveranca: -2 },
    duelEnemy: { name: 'Gigante Desespero', emoji: '👹', power: 6 },
  },

  // Exploração do Castelo — Caça ao tesouro
  'fase5-cena1': {
    type: 'treasure',
    difficulty: 'hard',
    intro: 'O Castelo da Dúvida esconde segredos antigos. Procure itens que podem ajudar na fuga!',
    successBonus: { discernimento: 1 },
    failurePenalty: {},
    treasures: [
      { emoji: '🗝️', label: 'Chave da Promessa', bonus: { fe: 2 } },
      { emoji: '📜', label: 'Mapa secreto', bonus: { discernimento: 1 } },
      { emoji: '🕯️', label: 'Luz na escuridão', bonus: { coragem: 1 } },
      { emoji: '⚗️', label: 'Água revitalizante', bonus: { perseveranca: 1 } },
      { emoji: '💎', label: 'Pedra de esperança', bonus: { fe: 1 } },
    ],
  },

  // Montanhas Deleitosas — Reflexo Divino com pastores
  'fase5-cena6': {
    type: 'reflex',
    difficulty: 'normal',
    intro: 'Os pastores das Montanhas Deleitosas ensinam gestos sagrados. Repita as direções com precisão!',
    successBonus: { fe: 1, perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // ═══ FASE 6 — Cidade Celestial ═══

  // Rio da Morte — QTE final
  'fase6-cena1': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'O Rio da Morte se interpõe entre você e a Cidade Celestial. Lute para atravessar!',
    successBonus: { fe: 2, perseveranca: 1 },
    failurePenalty: { fe: -1 },
  },

  // Reflexo Divino — Anjos guiando ao portão
  'fase6-cena3': {
    type: 'reflex',
    difficulty: 'hard',
    intro: 'Anjos celestiais guiam seus passos finais com gestos luminosos. Siga-os até o portão da Cidade Celestial!',
    successBonus: { fe: 2, coragem: 1 },
    failurePenalty: { fe: -1 },
    reflexSpeed: 600,
  },
};
