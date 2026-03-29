import { MiniGameConfig } from '@/components/MiniGames';

/**
 * Maps chapter IDs to mini-game configs.
 * Mini-games appear BEFORE the choices, adding active gameplay.
 * Coverage: ~30+ scenes across all 6 phases for maximum variety.
 */
export const miniGameMappings: Record<string, MiniGameConfig> = {

  // ╔══════════════════════════════════════╗
  // ║  FASE 1 — Início da Jornada         ║
  // ╚══════════════════════════════════════╝

  // Fuga da Cidade — QTE (correr!)
  'cena2': {
    type: 'qte',
    difficulty: 'easy',
    intro: 'Você precisa correr! Os vizinhos tentam impedi-lo. Toque nos obstáculos para desviar!',
    successBonus: { coragem: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Pântano do Desânimo — Stealth
  'cena4': {
    type: 'stealth',
    difficulty: 'easy',
    intro: 'O Pântano do Desânimo se abre diante de você. Cada passo deve ser calculado para não afundar na lama da dúvida.',
    successBonus: { perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Porta Estreita — Reflexo Divino
  'cena6': {
    type: 'reflex',
    difficulty: 'easy',
    intro: 'A luz da Porta Estreita pulsa em direções. Siga os sinais para encontrar o caminho!',
    successBonus: { fe: 1 },
    failurePenalty: { fe: -1 },
  },

  // Encontro com Prudência Mundana — Swipe
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

  // Monte Sinai — Tremor/Stealth
  'cena10': {
    type: 'stealth',
    difficulty: 'normal',
    intro: 'O Monte Sinai treme! Avance com cuidado pelo caminho instável sem ser engolido pela terra.',
    successBonus: { perseveranca: 1, coragem: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Caça ao Tesouro — antes de chegar à Porta
  'cena12': {
    type: 'treasure',
    difficulty: 'easy',
    intro: 'No caminho, há sinais e provisões divinas escondidas. Encontre-as antes de seguir!',
    successBonus: { discernimento: 1 },
    failurePenalty: {},
  },

  // Auxílio no Pântano — Memória
  'cena13': {
    type: 'memory',
    difficulty: 'easy',
    intro: 'Auxílio te ensina verdades para não afundar novamente. Memorize as lições!',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { discernimento: -1 },
  },

  // ╔══════════════════════════════════════╗
  // ║  FASE 2 — Casa do Intérprete        ║
  // ╚══════════════════════════════════════╝

  // Visões do Intérprete — Memória
  'fase2-cena1': {
    type: 'memory',
    difficulty: 'easy',
    intro: 'O Intérprete revela símbolos sagrados. Memorize as visões para absorver a sabedoria!',
    successBonus: { discernimento: 2 },
    failurePenalty: { discernimento: -1 },
    memorySymbols: ['✝️', '🕊️', '🔥', '💧', '⭐', '📖', '🛡️', '🗝️'],
  },

  // Sala do fogo — Reflexo Divino
  'fase2-cena3': {
    type: 'reflex',
    difficulty: 'easy',
    intro: 'As chamas do Espírito dançam em padrões. Siga os movimentos para não ser queimado!',
    successBonus: { fe: 1, coragem: 1 },
    failurePenalty: { fe: -1 },
  },

  // A Cruz e o Fardo — QTE
  'fase2-cena4': {
    type: 'qte',
    difficulty: 'easy',
    intro: 'As correntes do pecado se rompem! Toque nos grilhões para quebrá-los antes que se fechem novamente!',
    successBonus: { fe: 2 },
    failurePenalty: { fe: -1 },
  },

  // Palácio Belo — Caça ao Tesouro
  'fase2-cena6': {
    type: 'treasure',
    difficulty: 'easy',
    intro: 'O Palácio Belo guarda relíquias sagradas. Explore seus salões!',
    successBonus: { discernimento: 1 },
    failurePenalty: {},
    treasures: [
      { emoji: '🗡️', label: 'Espada do Espírito', bonus: { coragem: 1 } },
      { emoji: '🛡️', label: 'Escudo da Fé', bonus: { fe: 1 } },
      { emoji: '📜', label: 'Pergaminho sagrado', bonus: { discernimento: 1 } },
      { emoji: '⚔️', label: 'Armadura de Deus', bonus: { perseveranca: 1 } },
    ],
  },

  // Homem na Gaiola — Swipe (discernir verdades)
  'fase2-cena8': {
    type: 'swipe',
    difficulty: 'normal',
    intro: 'O Homem na Gaiola profere verdades e mentiras sobre o arrependimento. Discerna!',
    successBonus: { discernimento: 2 },
    failurePenalty: { discernimento: -1 },
    swipeItems: [
      { text: 'Nunca é tarde', emoji: '😢', good: false },
      { text: 'A graça acabou', emoji: '⛓️', good: false },
      { text: 'Não há perdão', emoji: '🔒', good: false },
      { text: 'Deus é misericordioso', emoji: '✨', good: true },
      { text: 'Arrependimento restaura', emoji: '🙏', good: true },
      { text: 'Toda esperança morreu', emoji: '💀', good: false },
      { text: 'A porta ainda está aberta', emoji: '🚪', good: true },
      { text: 'A fé pode salvar', emoji: '🔥', good: true },
    ],
  },

  // Duelo preparatório — recebendo armadura
  'fase2-cena11': {
    type: 'diceduel',
    difficulty: 'easy',
    intro: 'Um treinamento no Palácio Belo! Pratique com as armas espirituais antes do grande combate.',
    successBonus: { coragem: 1 },
    failurePenalty: {},
    duelEnemy: { name: 'Instrutor', emoji: '⚔️', power: 3 },
  },

  // ╔══════════════════════════════════════╗
  // ║  FASE 3 — Vale da Humilhação        ║
  // ╚══════════════════════════════════════╝

  // Descida ao Vale — Stealth
  'fase3-cena1': {
    type: 'stealth',
    difficulty: 'normal',
    intro: 'A descida ao Vale da Humilhação é traiçoeira. Cada passo deve ser dado com cautela.',
    successBonus: { perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Batalha contra Apolião — DUELO DE DADOS
  'fase3-cena3': {
    type: 'diceduel',
    difficulty: 'hard',
    intro: 'Apolião surge das sombras! Enfrente-o em um duelo espiritual — use ataque, defesa e oração!',
    successBonus: { coragem: 2, fe: 1 },
    failurePenalty: { coragem: -2 },
    duelEnemy: { name: 'Apolião', emoji: '🐉', power: 7 },
  },

  // Pós-batalha — Memória (lembrar versículos)
  'fase3-cena4': {
    type: 'memory',
    difficulty: 'normal',
    intro: 'Após a batalha, recorde os versículos que te sustentaram. Sua memória é sua armadura!',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { fe: -1 },
  },

  // Vale da Sombra da Morte — Stealth
  'fase3-cena5': {
    type: 'stealth',
    difficulty: 'hard',
    intro: 'O Vale da Sombra da Morte se estende em trevas. Avance em silêncio — os demônios espreitam.',
    successBonus: { coragem: 1, perseveranca: 1 },
    failurePenalty: { coragem: -1 },
  },

  // QTE no Vale — evitar armadilhas
  'fase3-cena6': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'Armadilhas surgem no caminho escuro! Desvie rapidamente!',
    successBonus: { coragem: 1 },
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

  // Caça ao Tesouro — achados no Vale
  'fase3-cena9': {
    type: 'treasure',
    difficulty: 'normal',
    intro: 'Mesmo no vale escuro, Deus escondeu provisões. Procure com fé!',
    successBonus: { fe: 1 },
    failurePenalty: {},
  },

  // ╔══════════════════════════════════════╗
  // ║  FASE 4 — Feira da Vaidade          ║
  // ╚══════════════════════════════════════╝

  // Tentações da Feira — Swipe
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

  // Confronto na Feira — QTE
  'fase4-cena2': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'A multidão se volta contra vocês! Desvie dos objetos atirados!',
    successBonus: { coragem: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Caça ao tesouro na Feira
  'fase4-cena3': {
    type: 'treasure',
    difficulty: 'normal',
    intro: 'Em meio ao caos da Feira, há tesouros espirituais escondidos. Encontre-os!',
    successBonus: { discernimento: 1 },
    failurePenalty: { discernimento: -1 },
    treasures: [
      { emoji: '📖', label: 'Escritura escondida', bonus: { discernimento: 1 } },
      { emoji: '🕊️', label: 'Pomba da paz', bonus: { fe: 1 } },
      { emoji: '🛡️', label: 'Escudo da fé', bonus: { coragem: 1 } },
      { emoji: '🗝️', label: 'Chave da verdade', bonus: { perseveranca: 1 } },
    ],
  },

  // Julgamento de Fiel — Memória
  'fase4-cena5': {
    type: 'memory',
    difficulty: 'normal',
    intro: 'No tribunal, você deve lembrar as verdades da fé para defender Fiel. Memorize os argumentos!',
    successBonus: { discernimento: 2, coragem: 1 },
    failurePenalty: { discernimento: -1 },
  },

  // Testemunho na Feira — Reflexo Divino
  'fase4-cena7': {
    type: 'reflex',
    difficulty: 'normal',
    intro: 'O Espírito guia suas palavras de testemunho. Siga os sinais para dar um testemunho poderoso!',
    successBonus: { fe: 1, coragem: 1 },
    failurePenalty: { fe: -1 },
  },

  // Duelo com acusadores — Dados
  'fase4-cena9': {
    type: 'diceduel',
    difficulty: 'normal',
    intro: 'Acusadores tentam destruir sua fé com argumentos. Enfrente-os com a verdade!',
    successBonus: { discernimento: 1, fe: 1 },
    failurePenalty: { fe: -1 },
    duelEnemy: { name: 'Acusador', emoji: '⚖️', power: 5 },
  },

  // Fuga da Feira — Stealth
  'fase4-cena11': {
    type: 'stealth',
    difficulty: 'normal',
    intro: 'Vocês precisam escapar da Feira sem serem capturados novamente. Avance em silêncio!',
    successBonus: { perseveranca: 1, coragem: 1 },
    failurePenalty: { coragem: -1 },
  },

  // ╔══════════════════════════════════════╗
  // ║  FASE 5 — Castelo da Dúvida         ║
  // ╚══════════════════════════════════════╝

  // Exploração do Castelo — Caça ao Tesouro
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

  // Swipe — tentações do desespero
  'fase5-cena2': {
    type: 'swipe',
    difficulty: 'hard',
    intro: 'O Gigante Desespero sussurra mentiras para fazê-los desistir. Rejeite as mentiras!',
    successBonus: { perseveranca: 1, fe: 1 },
    failurePenalty: { perseveranca: -2 },
    swipeItems: [
      { text: 'Desista agora', emoji: '💀', good: false },
      { text: 'Não há saída', emoji: '🔒', good: false },
      { text: 'Você é fraco', emoji: '😰', good: false },
      { text: 'Deus esqueceu', emoji: '🌑', good: false },
      { text: 'A promessa é real', emoji: '🌟', good: true },
      { text: 'Deus é fiel', emoji: '✝️', good: true },
      { text: 'Há esperança', emoji: '🕊️', good: true },
      { text: 'Eu perseverarei', emoji: '💪', good: true },
    ],
  },

  // Gigante Desespero — DUELO DE DADOS
  'fase5-cena3': {
    type: 'diceduel',
    difficulty: 'hard',
    intro: 'O Gigante Desespero bloqueia sua fuga! Enfrente-o com coragem e fé!',
    successBonus: { perseveranca: 2, coragem: 1 },
    failurePenalty: { perseveranca: -2 },
    duelEnemy: { name: 'Gigante Desespero', emoji: '👹', power: 7 },
  },

  // Fuga do Castelo — QTE
  'fase5-cena4': {
    type: 'qte',
    difficulty: 'hard',
    intro: 'Corram! O Gigante os persegue! Desvie dos obstáculos na fuga desesperada!',
    successBonus: { coragem: 2 },
    failurePenalty: { coragem: -1, perseveranca: -1 },
  },

  // Montanhas Deleitosas — Reflexo Divino
  'fase5-cena6': {
    type: 'reflex',
    difficulty: 'normal',
    intro: 'Os pastores das Montanhas Deleitosas ensinam gestos sagrados. Repita as direções com precisão!',
    successBonus: { fe: 1, perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Memória dos pastores
  'fase5-cena7': {
    type: 'memory',
    difficulty: 'normal',
    intro: 'Os pastores revelam segredos do caminho adiante. Memorize seus avisos!',
    successBonus: { discernimento: 2 },
    failurePenalty: { discernimento: -1 },
  },

  // Lisonjeiro — Swipe (discernir engano)
  'fase5-cena9': {
    type: 'swipe',
    difficulty: 'normal',
    intro: 'O Lisonjeiro oferece palavras doces que escondem veneno. Discerna verdade de engano!',
    successBonus: { discernimento: 1 },
    failurePenalty: { discernimento: -1 },
    swipeItems: [
      { text: 'Atalho seguro', emoji: '🛤️', good: false },
      { text: 'Caminho mais fácil', emoji: '🌸', good: false },
      { text: 'Confie em mim', emoji: '🎭', good: false },
      { text: 'Sem sofrimento', emoji: '☀️', good: false },
      { text: 'Caminho estreito', emoji: '⛰️', good: true },
      { text: 'Confiar em Deus', emoji: '🙏', good: true },
      { text: 'Perseverar', emoji: '💪', good: true },
    ],
  },

  // Terra Encantada — Stealth
  'fase5-cena12': {
    type: 'stealth',
    difficulty: 'hard',
    intro: 'A Terra Encantada tenta fazê-los dormir! Avance sem ceder ao sono mortal.',
    successBonus: { perseveranca: 2 },
    failurePenalty: { perseveranca: -2 },
  },

  // ╔══════════════════════════════════════╗
  // ║  FASE 6 — Cidade Celestial          ║
  // ╚══════════════════════════════════════╝

  // Rio da Morte — QTE final
  'fase6-cena1': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'O Rio da Morte se interpõe entre você e a Cidade Celestial. Lute para atravessar!',
    successBonus: { fe: 2, perseveranca: 1 },
    failurePenalty: { fe: -1 },
  },

  // Travessia — Duelo Espiritual final
  'fase6-cena2': {
    type: 'diceduel',
    difficulty: 'normal',
    intro: 'As águas da morte tentam afogá-lo com dúvidas finais. Enfrente este último combate!',
    successBonus: { fe: 1, coragem: 1 },
    failurePenalty: { fe: -1 },
    duelEnemy: { name: 'Dúvida Final', emoji: '🌊', power: 5 },
  },

  // Reflexo Divino — Anjos guiando ao portão
  'fase6-cena3': {
    type: 'reflex',
    difficulty: 'hard',
    intro: 'Anjos celestiais guiam seus passos finais com gestos luminosos. Siga-os até o portão!',
    successBonus: { fe: 2, coragem: 1 },
    failurePenalty: { fe: -1 },
    reflexSpeed: 600,
  },

  // Memória — lembrar toda a jornada
  'fase6-cena5': {
    type: 'memory',
    difficulty: 'hard',
    intro: 'Diante dos portões celestiais, recorde os símbolos de toda a sua jornada. Prove sua fidelidade!',
    successBonus: { fe: 2, discernimento: 1 },
    failurePenalty: { fe: -1 },
    memorySymbols: ['✝️', '🗡️', '🛡️', '🔥', '👑', '🕊️', '🌟', '🗝️'],
  },

  // Caça ao Tesouro final — tesouros celestiais
  'fase6-cena7': {
    type: 'treasure',
    difficulty: 'normal',
    intro: 'A Cidade Celestial revela seus tesouros eternos. Descubra as recompensas da sua fidelidade!',
    successBonus: { fe: 1 },
    failurePenalty: {},
    treasures: [
      { emoji: '👑', label: 'Coroa da Vida', bonus: { fe: 2 } },
      { emoji: '🌟', label: 'Estrela da Manhã', bonus: { discernimento: 1 } },
      { emoji: '📖', label: 'Livro da Vida', bonus: { perseveranca: 1 } },
      { emoji: '🏆', label: 'Troféu da Fé', bonus: { coragem: 1 } },
      { emoji: '✨', label: 'Veste Branca', bonus: { fe: 1 } },
    ],
  },
};
