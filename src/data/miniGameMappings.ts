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

  // O Fardo Despertado — Resistência Física (QTE)
  'cena1': {
    type: 'qte',
    difficulty: 'easy',
    intro: 'O fardo nas suas costas é esmagador! Para não ser esmagado, clique rapidamente nos pontos de tensão que aparecerão na tela!',
    successBonus: { perseveranca: 1, coragem: 1 },
    failurePenalty: { fe: -1 },
  },

  // Fuga da Cidade — QTE (correr!)
  'cena2': {
    type: 'qte',
    difficulty: 'easy',
    intro: 'Você precisa correr! Os vizinhos tentam impedi-lo. Toque nos obstáculos para desviar!',
    successBonus: { coragem: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Pressão da Família — Filtrar vozes
  'cena3': {
    type: 'wordpuzzle',
    difficulty: 'easy',
    intro: 'Para abafar os gritos terríveis da sua família chamando você de louco, monte a Escritura da Verdade no meio do caos e recupere seu foco!',
    successBonus: { discernimento: 2, fe: 1 },
    failurePenalty: { discernimento: -1, coragem: -1 },
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
    duelEnemy: { name: 'Discrição', emoji: '⚔️', power: 3 },
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

  // ╔══════════════════════════════════════╗
  // ║  NOVOS — Puzzle de Escrituras        ║
  // ╚══════════════════════════════════════╝

  // Fase 1 — Aprendendo versículos no início
  'cena5': {
    type: 'wordpuzzle',
    difficulty: 'easy',
    intro: 'Antes de seguir, monte o versículo que guiará seus passos na jornada.',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { discernimento: -1 },
  },

  // Fase 2 — Estudando na Casa do Intérprete
  'fase2-cena2': {
    type: 'wordpuzzle',
    difficulty: 'easy',
    intro: 'O Intérprete te desafia a montar as Escrituras de memória. Prove seu conhecimento!',
    successBonus: { discernimento: 2 },
    failurePenalty: { discernimento: -1 },
  },

  // Fase 3 — Fortalecendo-se com versículos após Apolião
  'fase3-cena7': {
    type: 'wordpuzzle',
    difficulty: 'normal',
    intro: 'Após a batalha, as Escrituras te fortalecem. Monte os versículos que restauram sua alma.',
    successBonus: { fe: 1, perseveranca: 1 },
    failurePenalty: { fe: -1 },
  },

  // Fase 4 — Defesa no tribunal com as Escrituras
  'fase4-cena6': {
    type: 'wordpuzzle',
    difficulty: 'normal',
    intro: 'No tribunal, use as Escrituras como defesa! Monte os versículos da verdade!',
    successBonus: { discernimento: 2, coragem: 1 },
    failurePenalty: { discernimento: -1 },
  },

  // Fase 5 — Chave da Promessa é um versículo
  'fase5-cena5': {
    type: 'wordpuzzle',
    difficulty: 'hard',
    intro: 'A Chave da Promessa é um versículo! Monte-o corretamente para abrir as portas do calabouço!',
    successBonus: { fe: 2, perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Fase 6 — Últimos versículos antes da glória
  'fase6-cena4': {
    type: 'wordpuzzle',
    difficulty: 'hard',
    intro: 'Diante da Cidade Celestial, recite os versículos que marcaram sua jornada inteira.',
    successBonus: { fe: 2, discernimento: 1 },
    failurePenalty: { fe: -1 },
  },

  // ╔══════════════════════════════════════╗
  // ║  NOVOS — Caminho da Fé (RPG Path)   ║
  // ╚══════════════════════════════════════╝

  // Fase 1 — Primeiros passos no caminho
  'cena9': {
    type: 'pathchoice',
    difficulty: 'easy',
    intro: 'O caminho se divide à frente. Cada trilha esconde perigos e bênçãos. Escolha com sabedoria!',
    successBonus: { coragem: 1, perseveranca: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Fase 2 — Explorando após o Palácio Belo
  'fase2-cena9': {
    type: 'pathchoice',
    difficulty: 'easy',
    intro: 'Após o Palácio Belo, encruzilhadas surgem. Sua fé e coragem definirão o caminho.',
    successBonus: { fe: 1, coragem: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Fase 3 — Navegando o Vale
  'fase3-cena2': {
    type: 'pathchoice',
    difficulty: 'normal',
    intro: 'O Vale da Humilhação apresenta trilhas perigosas. Cada decisão pode custar sua vida.',
    successBonus: { coragem: 2, perseveranca: 1 },
    failurePenalty: { coragem: -1, perseveranca: -1 },
  },

  // Fase 4 — Fugindo da Feira
  'fase4-cena10': {
    type: 'pathchoice',
    difficulty: 'normal',
    intro: 'Escapando da Feira da Vaidade, cada rua é uma armadilha. Escolha o caminho certo!',
    successBonus: { perseveranca: 1, discernimento: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Fase 5 — Dentro do Castelo da Dúvida
  'fase5-cena10': {
    type: 'pathchoice',
    difficulty: 'hard',
    intro: 'Os corredores do Castelo da Dúvida se ramificam em infinitas possibilidades. Encontre a saída!',
    successBonus: { perseveranca: 2, fe: 1 },
    failurePenalty: { perseveranca: -2 },
  },

  // Fase 6 — Últimos passos antes do portão
  'fase6-cena6': {
    type: 'pathchoice',
    difficulty: 'hard',
    intro: 'Os últimos passos antes da Cidade Celestial. Cada escolha ecoa na eternidade.',
    successBonus: { fe: 2, coragem: 1 },
    failurePenalty: { fe: -1 },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  PARTE II — A PEREGRINA (Cristã)                    ║
  // ║  Mini-games exclusivos da jornada de Cristã          ║
  // ╚══════════════════════════════════════════════════════╝

  // ── FASE 1: A Partida de Cristã ──

  // Cena 1 — O Sonho e a Carta: Memória (lembrar o sonho)
  'p2-cena1': {
    type: 'memory',
    difficulty: 'easy',
    intro: 'O sonho de Cristã revelou imagens do marido na Cidade Celestial. Memorize os símbolos do sonho!',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { discernimento: -1 },
    memorySymbols: ['👼', '✉️', '🌟', '🕊️', '👑', '💌', '🔔', '✨'],
  },

  // Cena 3 — O Pântano com Misericórdia: Stealth
  'p2-cena3': {
    type: 'stealth',
    difficulty: 'easy',
    intro: 'O Pântano do Desânimo ameaça engolir Misericórdia! Avance com cuidado pelas pedras de promessa.',
    successBonus: { perseveranca: 1, fe: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Cena 4 — O Portão Estreito: QTE (bater insistentemente)
  'p2-cena4': {
    type: 'qte',
    difficulty: 'easy',
    intro: 'Bata no Portão Estreito com insistência! Não pare até que ele se abra!',
    successBonus: { fe: 1, perseveranca: 1 },
    failurePenalty: { fe: -1 },
  },

  // Cena 5 — Os Mal-Encarados: Swipe (desviar dos ataques)
  'p2-cena5': {
    type: 'swipe',
    difficulty: 'easy',
    intro: 'Os Mal-Encarados atacam logo após o portão! Desvie das ameaças e proteja os filhos!',
    successBonus: { coragem: 1 },
    failurePenalty: { coragem: -1 },
    swipeItems: [
      { text: 'Pedra atirada', emoji: '🪨', good: false },
      { text: 'Ameaça verbal', emoji: '😡', good: false },
      { text: 'Proteção do guardião', emoji: '🛡️', good: true },
      { text: 'Insulto cruel', emoji: '🗣️', good: false },
      { text: 'Oração de proteção', emoji: '🙏', good: true },
      { text: 'Medo paralisante', emoji: '😨', good: false },
      { text: 'Coragem maternal', emoji: '💪', good: true },
      { text: 'Fé no guardião', emoji: '✨', good: true },
    ],
  },

  // Cena 6 — O Banho e as Vestes: Reflexo Divino
  'p2-cena6': {
    type: 'reflex',
    difficulty: 'easy',
    intro: 'O Intérprete marca o selo do Rei em suas testas. Siga os sinais sagrados para receber a bênção!',
    successBonus: { fe: 2 },
    failurePenalty: { fe: -1 },
  },

  // ── FASE 2: Com Grande-Coração ──

  // Cena 1 — Grande-Coração: Duelo de Dados (treinamento)
  'p2-fase2-cena1': {
    type: 'diceduel',
    difficulty: 'easy',
    intro: 'Grande-Coração testa suas habilidades com um treino de combate espiritual. Mostre sua coragem!',
    successBonus: { coragem: 1 },
    failurePenalty: {},
    duelEnemy: { name: 'Grande-Coração', emoji: '⚔️', power: 3 },
  },

  // Cena 2 — A Cruz: Puzzle de Escritura
  'p2-fase2-cena2': {
    type: 'wordpuzzle',
    difficulty: 'easy',
    intro: 'Ao pé da Cruz, monte o versículo que libertou Cristão do seu fardo.',
    successBonus: { fe: 2, discernimento: 1 },
    failurePenalty: { fe: -1 },
  },

  // Cena 3 — Colina da Dificuldade: Stealth (subida cuidadosa)
  'p2-fase2-cena3': {
    type: 'stealth',
    difficulty: 'normal',
    intro: 'A Colina da Dificuldade exige cada gota de energia. Suba com cautela — os filhos dependem de você!',
    successBonus: { perseveranca: 2 },
    failurePenalty: { perseveranca: -1 },
  },

  // Cena 4 — Os Leões: QTE (passar pelos leões)
  'p2-fase2-cena4': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'Os leões rugem! Grande-Coração abre caminho — corra pelo centro antes que avancem!',
    successBonus: { coragem: 2 },
    failurePenalty: { coragem: -1 },
  },

  // Cena 5 — Palácio Belo: Caça ao Tesouro
  'p2-fase2-cena5': {
    type: 'treasure',
    difficulty: 'easy',
    intro: 'O Palácio Belo guarda as relíquias que Cristão usou. Explore e descubra a herança dele!',
    successBonus: { discernimento: 1 },
    failurePenalty: {},
    treasures: [
      { emoji: '🗡️', label: 'Espada de Cristão', bonus: { coragem: 1 } },
      { emoji: '🛡️', label: 'Escudo da Fé', bonus: { fe: 1 } },
      { emoji: '📜', label: 'Pergaminho do marido', bonus: { discernimento: 1 } },
      { emoji: '💊', label: 'Pílula de arrependimento', bonus: { perseveranca: 1 } },
    ],
  },

  // ── FASE 3: Os Vales e Encontros ──

  // Cena 1 — Vale da Humilhação: Caminho da Fé
  'p2-fase3-cena1': {
    type: 'pathchoice',
    difficulty: 'easy',
    intro: 'O Vale da Humilhação revela trilhas inesperadas. Sem Apolião, há paz — mas as escolhas importam.',
    successBonus: { fe: 1, discernimento: 1 },
    failurePenalty: { discernimento: -1 },
  },

  // Cena 2 — Vale da Sombra: Stealth (atravessar com o pilar de fogo)
  'p2-fase3-cena2': {
    type: 'stealth',
    difficulty: 'hard',
    intro: 'O Vale da Sombra da Morte é escuro. Siga o pilar de fogo e proteja as crianças dos sussurros!',
    successBonus: { coragem: 1, perseveranca: 1 },
    failurePenalty: { coragem: -1 },
  },

  // Cena 3 — Gigante Maul: Duelo de Dados
  'p2-fase3-cena3': {
    type: 'diceduel',
    difficulty: 'normal',
    intro: 'O Gigante Maul bloqueia o caminho! Grande-Coração precisa da sua fé para vencer!',
    successBonus: { coragem: 2, fe: 1 },
    failurePenalty: { coragem: -1 },
    duelEnemy: { name: 'Gigante Maul', emoji: '👹', power: 5 },
  },

  // Cena 4 — Hospedaria de Gaio: Memória (ancestralidade de Cristão)
  'p2-fase3-cena4': {
    type: 'memory',
    difficulty: 'easy',
    intro: 'Gaio revela a linhagem espiritual de Cristão. Memorize os nomes dos ancestrais da fé!',
    successBonus: { discernimento: 1, fe: 1 },
    failurePenalty: { discernimento: -1 },
    memorySymbols: ['👤', '📖', '⭐', '🕊️', '💒', '🔥', '👑', '✝️'],
  },

  // Cena 5 — Gigante Mata-Bons: Duelo de Dados
  'p2-fase3-cena5': {
    type: 'diceduel',
    difficulty: 'hard',
    intro: 'O Gigante Mata-Bons é brutal! Grande-Coração enfrenta o monstro — sua oração fortalece a espada!',
    successBonus: { coragem: 2, perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
    duelEnemy: { name: 'Gigante Mata-Bons', emoji: '💀', power: 6 },
  },

  // Cena 6 — Feira da Vaidade (diferente): Swipe
  'p2-fase3-cena6': {
    type: 'swipe',
    difficulty: 'normal',
    intro: 'A Feira da Vaidade mudou desde Fiel, mas as tentações permanecem. Discerna o que aceitar!',
    successBonus: { discernimento: 1, fe: 1 },
    failurePenalty: { fe: -1 },
    swipeItems: [
      { text: 'Respeito fingido', emoji: '🎭', good: false },
      { text: 'Paz aparente', emoji: '☮️', good: false },
      { text: 'Mercadoria vã', emoji: '💰', good: false },
      { text: 'Memória de Fiel', emoji: '✝️', good: true },
      { text: 'Oração em grupo', emoji: '🙏', good: true },
      { text: 'Entretenimento', emoji: '🎪', good: false },
      { text: 'Palavra de Deus', emoji: '📖', good: true },
      { text: 'Testemunho sincero', emoji: '💡', good: true },
    ],
  },

  // ── FASE 4: Novos Companheiros ──

  // Cena 1 — Pronto-para-Parar: Reflexo Divino
  'p2-fase4-cena1': {
    type: 'reflex',
    difficulty: 'easy',
    intro: 'Pronto-para-Parar ensina a perseverar mesmo com dor. Siga o ritmo dos seus passos corajosos!',
    successBonus: { perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Cena 2 — Mina de Demas: Swipe (resistir à ganância)
  'p2-fase4-cena2': {
    type: 'swipe',
    difficulty: 'normal',
    intro: 'A mina de Demas brilha com falsa riqueza. Ensine os filhos — rejeite a ganância!',
    successBonus: { discernimento: 2 },
    failurePenalty: { discernimento: -1 },
    swipeItems: [
      { text: 'Ouro brilhante', emoji: '✨', good: false },
      { text: 'Prata fácil', emoji: '🪙', good: false },
      { text: 'Promessa de riqueza', emoji: '💎', good: false },
      { text: 'Contentamento', emoji: '😊', good: true },
      { text: 'Fé verdadeira', emoji: '🔥', good: true },
      { text: 'Tesouros eternos', emoji: '👑', good: true },
      { text: 'Poder mundano', emoji: '💰', good: false },
      { text: 'Gratidão simples', emoji: '🙏', good: true },
    ],
  },

  // Cena 3 — Valente-pela-Verdade: Duelo de Dados
  'p2-fase4-cena3': {
    type: 'diceduel',
    difficulty: 'normal',
    intro: 'Valente-pela-Verdade acabou de lutar contra três bandidos! Ajude-o a derrotar o último!',
    successBonus: { coragem: 2 },
    failurePenalty: { coragem: -1 },
    duelEnemy: { name: 'Coração-Fraco', emoji: '🗡️', power: 4 },
  },

  // Cena 4 — Prado Agradável: Caminho da Fé
  'p2-fase4-cena4': {
    type: 'pathchoice',
    difficulty: 'normal',
    intro: 'O Prado Agradável seduz com conforto. Cada trilha pode levar à armadilha — escolha sabiamente!',
    successBonus: { discernimento: 1, perseveranca: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // ── FASE 5: O Castelo Destruído ──

  // Cena 1 — Portas do Castelo: QTE (arrombar portões)
  'p2-fase5-cena1': {
    type: 'qte',
    difficulty: 'hard',
    intro: 'Grande-Coração arromba os portões do Castelo da Dúvida! Ajude a derrubar cada barreira!',
    successBonus: { coragem: 2 },
    failurePenalty: { coragem: -1 },
  },

  // Cena 2 — Gigante Desespero: Duelo de Dados ÉPICO
  'p2-fase5-cena2': {
    type: 'diceduel',
    difficulty: 'hard',
    intro: 'O Gigante Desespero emerge! Grande-Coração e Valente-pela-Verdade atacam — sua fé é a arma decisiva!',
    successBonus: { coragem: 2, fe: 2 },
    failurePenalty: { coragem: -2, fe: -1 },
    duelEnemy: { name: 'Gigante Desespero', emoji: '👹', power: 8 },
  },

  // Cena 3 — Masmorras: Caça ao Tesouro (libertar prisioneiros)
  'p2-fase5-cena3': {
    type: 'treasure',
    difficulty: 'normal',
    intro: 'As masmorras do castelo escondem prisioneiros e relíquias. Encontre-os antes que o castelo desabe!',
    successBonus: { fe: 1, perseveranca: 1 },
    failurePenalty: {},
    treasures: [
      { emoji: '🗝️', label: 'Chave da cela', bonus: { fe: 1 } },
      { emoji: '🕯️', label: 'Luz na masmorra', bonus: { coragem: 1 } },
      { emoji: '💊', label: 'Remédio para os feridos', bonus: { perseveranca: 1 } },
      { emoji: '📖', label: 'Bíblia escondida', bonus: { discernimento: 1 } },
      { emoji: '🔓', label: 'Correntes quebradas', bonus: { fe: 1 } },
    ],
  },

  // Cena 4 — Demolição do Castelo: QTE (destruir muralhas)
  'p2-fase5-cena4': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'Pedra por pedra, destrua o Castelo da Dúvida! Toque em cada ponto fraco para derrubá-lo!',
    successBonus: { perseveranca: 1, coragem: 1 },
    failurePenalty: { perseveranca: -1 },
  },

  // Cena 5 — Montanhas Deleitosas: Memória (avisos dos pastores)
  'p2-fase5-cena5': {
    type: 'memory',
    difficulty: 'normal',
    intro: 'Os pastores das Montanhas Deleitosas revelam segredos do caminho final. Memorize seus avisos!',
    successBonus: { discernimento: 2, fe: 1 },
    failurePenalty: { discernimento: -1 },
    memorySymbols: ['⛰️', '🔭', '👁️', '🌊', '🏔️', '👑', '⚠️', '🌟'],
  },

  // ── FASE 6: A Terra Encantada e o Rio ──

  // Cena 1 — Firme e Madame Bolha: Swipe (resistir tentações)
  'p2-fase6-cena1': {
    type: 'swipe',
    difficulty: 'hard',
    intro: 'Madame Bolha oferece ouro, prazer e conforto. Ajude Firme a resistir — rejeite cada tentação!',
    successBonus: { fe: 2, discernimento: 1 },
    failurePenalty: { fe: -1, discernimento: -1 },
    swipeItems: [
      { text: 'Bolsa de ouro', emoji: '💰', good: false },
      { text: 'Cama de seda', emoji: '🛏️', good: false },
      { text: 'Beleza sedutora', emoji: '💋', good: false },
      { text: 'Conforto eterno', emoji: '🍷', good: false },
      { text: 'Oração fervorosa', emoji: '🙏', good: true },
      { text: 'Fé inabalável', emoji: '🔥', good: true },
      { text: 'Palavra de Deus', emoji: '📖', good: true },
      { text: 'Resistência santa', emoji: '🛡️', good: true },
    ],
  },

  // Cena 2 — País de Beulá: Reflexo Divino (anjos guiando)
  'p2-fase6-cena2': {
    type: 'reflex',
    difficulty: 'easy',
    intro: 'No País de Beulá, anjos dançam em padrões de luz. Siga seus movimentos de pura alegria!',
    successBonus: { fe: 1, perseveranca: 1 },
    failurePenalty: {},
  },

  // Cena 3 — O Chamado Individual: Puzzle de Escritura
  'p2-fase6-cena3': {
    type: 'wordpuzzle',
    difficulty: 'normal',
    intro: 'A carta do Rei contém um versículo sagrado. Monte-o para aceitar o chamado final.',
    successBonus: { fe: 2, discernimento: 1 },
    failurePenalty: { fe: -1 },
  },

  // Cena 4 — As Despedidas: Memória (palavras dos companheiros)
  'p2-fase6-cena4': {
    type: 'memory',
    difficulty: 'hard',
    intro: 'Cada companheiro se despede com palavras eternas. Memorize suas últimas mensagens!',
    successBonus: { fe: 1, coragem: 1, perseveranca: 1 },
    failurePenalty: { fe: -1 },
    memorySymbols: ['⚔️', '🙏', '💪', '🕊️', '👑', '🎵', '❤️', '✨'],
  },

  // Cena 5 — A Travessia de Cristã: QTE final (atravessar o rio)
  'p2-fase6-cena5': {
    type: 'qte',
    difficulty: 'normal',
    intro: 'O Rio da Morte se abre diante de Cristã. Cada passo firme a leva mais perto de Cristão!',
    successBonus: { fe: 2, perseveranca: 1 },
    failurePenalty: { fe: -1 },
  },

  // Cena 6 — Cidade Celestial: Caça ao Tesouro (recompensas eternas)
  'p2-fase6-cena6': {
    type: 'treasure',
    difficulty: 'easy',
    intro: 'A Cidade Celestial revela seus tesouros eternos! O reencontro com Cristão é a maior recompensa.',
    successBonus: { fe: 2 },
    failurePenalty: {},
    treasures: [
      { emoji: '👑', label: 'Coroa da Vida', bonus: { fe: 2 } },
      { emoji: '🤝', label: 'Reencontro com Cristão', bonus: { perseveranca: 1 } },
      { emoji: '🎵', label: 'Canção dos anjos', bonus: { coragem: 1 } },
      { emoji: '✨', label: 'Veste de glória', bonus: { fe: 1 } },
      { emoji: '🏠', label: 'Morada eterna', bonus: { discernimento: 1 } },
    ],
  },
};
