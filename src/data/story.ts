export interface ChoiceEffect {
  fe?: number;
  perseveranca?: number;
  discernimento?: number;
  coragem?: number;
}

export interface StoryChoice {
  text: string;
  nextChapterId: string;
  consequence?: string;
  effects: ChoiceEffect;
  requires?: Partial<ChoiceEffect>;
}

export interface StoryChapter {
  id: string;
  title: string;
  location: string;
  narrative: string[];
  adaptiveNarrative?: { minAttr: keyof ChoiceEffect; minValue: number; text: string }[];
  choices: StoryChoice[];
  isEnding?: boolean;
  endingType?: 'parte1';
  reflection?: string;
  characters?: string[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  unlockedAtChapter: string;
}

export interface Reflection {
  id: string;
  title: string;
  text: string;
  verse?: string;
  unlockedAtChapter: string;
}

export const characters: Character[] = [
  { id: "cristao", name: "Cristão", description: "Um homem comum que descobre a verdade e parte rumo à Cidade Celestial, carregando o fardo de seus pecados.", role: "Protagonista", unlockedAtChapter: "inicio" },
  { id: "evangelista", name: "Evangelista", description: "Homem sábio que aponta Cristão na direção certa, mostrando a luz do Portão Estreito.", role: "Guia", unlockedAtChapter: "inicio" },
  { id: "obstinado", name: "Obstinado", description: "Vizinho que zomba da decisão de Cristão. Representa quem rejeita a verdade por apego ao conforto.", role: "Antagonista", unlockedAtChapter: "familia-recusa" },
  { id: "flexivel", name: "Flexível", description: "Vizinho curioso que acompanha Cristão, mas desiste no primeiro obstáculo.", role: "Companheiro temporário", unlockedAtChapter: "familia-recusa" },
  { id: "sabedoria-mundana", name: "Sr. Sabedoria Mundana", description: "Homem influente que tenta desviar Cristão do caminho com conselhos aparentemente sensatos.", role: "Antagonista", unlockedAtChapter: "sabedoria-mundana" },
  { id: "socorro", name: "Socorro", description: "Enviado para ajudar peregrinos que caem no Pântano do Desânimo.", role: "Aliado", unlockedAtChapter: "pantano-desanimo" },
  { id: "boa-vontade", name: "Boa Vontade", description: "Guardião do Portão Estreito que recebe os peregrinos com urgência.", role: "Guardião", unlockedAtChapter: "portao-estreito" },
  { id: "interprete", name: "Intérprete", description: "Mestre que revela verdades espirituais através de visões em sua casa.", role: "Mestre", unlockedAtChapter: "casa-interprete" },
  { id: "prudencia", name: "Prudência", description: "Uma das guardiãs do Palácio Belo que examina e encoraja os peregrinos.", role: "Guardiã", unlockedAtChapter: "palacio-belo" },
];

export const reflections: Reflection[] = [
  { id: "r1", title: "O Peso do Pecado", text: "Todos carregamos fardos. A jornada começa quando reconhecemos que não podemos nos libertar sozinhos.", verse: "Mateus 11:28 — \"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.\"", unlockedAtChapter: "inicio" },
  { id: "r2", title: "Nem Todos Ouvirão", text: "O chamado é pessoal. Às vezes devemos seguir mesmo quando os que amamos não nos acompanham.", verse: "Lucas 14:26 — Sobre o custo de seguir o chamado.", unlockedAtChapter: "familia-recusa" },
  { id: "r3", title: "Falsos Conselhos", text: "Nem todo conselho é bom. O mundo oferece soluções fáceis que nos afastam do caminho verdadeiro.", verse: "Provérbios 14:12 — \"Há caminho que ao homem parece direito, mas o seu fim são os caminhos da morte.\"", unlockedAtChapter: "sabedoria-mundana" },
  { id: "r4", title: "O Desânimo no Caminho", text: "O caminho da fé não é isento de desespero. Mas há sempre uma mão estendida para nos erguer.", verse: "Salmos 40:2 — \"Tirou-me de um lago horrível, pôs os meus pés sobre uma rocha.\"", unlockedAtChapter: "pantano-desanimo" },
  { id: "r5", title: "A Humildade Necessária", text: "Aceitar ajuda não é fraqueza — é sabedoria. Deus resiste ao soberbo, mas dá graça ao humilde.", verse: "Tiago 4:6 — \"Deus resiste aos soberbos, mas dá graça aos humildes.\"", unlockedAtChapter: "pantano-orgulho" },
  { id: "r6", title: "A Porta Estreita", text: "A entrada para a vida verdadeira é estreita. Mas quem bate com sinceridade encontrará a porta aberta.", verse: "Mateus 7:13-14 — Sobre o caminho estreito.", unlockedAtChapter: "portao-estreito" },
  { id: "r7", title: "Visões da Verdade", text: "O Espírito revela verdades que os olhos naturais não veem.", verse: "1 Coríntios 2:10 — \"O Espírito sonda todas as coisas.\"", unlockedAtChapter: "casa-interprete" },
  { id: "r8", title: "O Caminho Difícil", text: "O caminho certo raramente é o mais fácil. Atalhos seduzem, mas a subida fortalece.", verse: "Mateus 7:14 — \"Estreita é a porta, e apertado o caminho que leva à vida.\"", unlockedAtChapter: "colina-dificuldade" },
  { id: "r9", title: "Descanso e Preparo", text: "Deus nos dá lugares de descanso antes das grandes batalhas. Aproveite cada pausa para se fortalecer.", verse: "Salmos 23:2-3 — \"Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.\"", unlockedAtChapter: "palacio-belo" },
  { id: "r10", title: "A Libertação na Cruz", text: "O momento mais transformador é quando o fardo cai ao pé da Cruz. A liberdade é um presente, não uma conquista.", verse: "Gálatas 5:1 — \"Foi para a liberdade que Cristo nos libertou.\"", unlockedAtChapter: "cruz-fardo" },
];

export const chapterOrder = [
  "inicio", "familia-recusa", "sabedoria-mundana", "monte-sinai", "evangelista-retorno",
  "pantano-desanimo", "pantano-desanimo-sozinho", "pantano-orgulho",
  "portao-estreito", "casa-interprete",
  "colina-dificuldade", "desvio-colina", "palacio-belo",
  "cruz-fardo", "final-parte1",
];

export const storyChapters: Record<string, StoryChapter> = {
  // === CENA 1 ===
  "inicio": {
    id: "inicio",
    title: "A Cidade da Destruição",
    location: "Cidade da Destruição",
    characters: ["cristao", "evangelista"],
    reflection: "r1",
    narrative: [
      "Cristão carregava um fardo pesado nas costas. Um peso que ninguém via, mas que o esmagava por dentro.",
      "Lendo um livro antigo, descobriu: sua cidade seria destruída.",
      "Desesperado, vagava chorando: \"O que devo fazer?\"",
      "Evangelista apareceu e apontou para uma luz distante. \"Siga aquela luz.\""
    ],
    choices: [
      {
        text: "Seguir a luz agora, deixando tudo para trás",
        nextChapterId: "pantano-desanimo",
        consequence: "A fé o move, mas o caminho será duro.",
        effects: { fe: 5, coragem: 3 }
      },
      {
        text: "Tentar convencer a família a ir junto",
        nextChapterId: "familia-recusa",
        consequence: "Nem todos ouvirão o chamado.",
        effects: { perseveranca: 3, discernimento: 2 }
      }
    ]
  },

  // === CENA 2 ===
  "familia-recusa": {
    id: "familia-recusa",
    title: "A Recusa dos Amados",
    location: "Cidade da Destruição",
    characters: ["cristao", "obstinado", "flexivel"],
    reflection: "r2",
    narrative: [
      "Cristão implorou à família que fugisse com ele. Ninguém acreditou.",
      "\"Você enlouqueceu!\", disseram.",
      "Obstinado zombou dele. Flexível ficou curioso, mas indeciso.",
      "Com o coração partido, Cristão entendeu: precisava seguir."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 15, text: "Algo na convicção de Cristão tocou Flexível. Havia verdade naquele olhar." }
    ],
    choices: [
      {
        text: "Levar Flexível como companheiro",
        nextChapterId: "pantano-desanimo",
        consequence: "Um companheiro pode ser conforto ou provação.",
        effects: { discernimento: 2, perseveranca: 2 }
      },
      {
        text: "Partir sozinho, confiando na providência",
        nextChapterId: "pantano-desanimo-sozinho",
        consequence: "A solidão pode fortalecer ou quebrar.",
        effects: { coragem: 5, fe: 3 }
      },
      {
        text: "Ouvir o conselho de um homem sábio da cidade",
        nextChapterId: "sabedoria-mundana",
        consequence: "Nem todo conselho é bom conselho.",
        effects: { discernimento: 1 }
      }
    ]
  },

  // === CENA 3 ===
  "sabedoria-mundana": {
    id: "sabedoria-mundana",
    title: "O Conselho do Mundo",
    location: "Estrada da Cidade",
    characters: ["cristao", "sabedoria-mundana"],
    reflection: "r3",
    narrative: [
      "No caminho, Cristão encontrou o Sr. Sabedoria Mundana — um homem respeitado e eloquente.",
      "\"Por que carregar esse fardo?\", perguntou. \"Vá à vila da Moralidade. Lá há um homem chamado Legalidade que pode tirá-lo.\"",
      "O conselho parecia sensato. Um caminho mais fácil, sem dor.",
      "Mas algo no fundo de Cristão hesitava."
    ],
    choices: [
      {
        text: "Seguir o conselho e ir à vila da Moralidade",
        nextChapterId: "monte-sinai",
        consequence: "O caminho fácil esconde perigos.",
        effects: { discernimento: -2 }
      },
      {
        text: "Recusar e buscar a luz do Portão Estreito",
        nextChapterId: "portao-estreito",
        consequence: "Nem sempre o conselho dos homens é o conselho de Deus.",
        effects: { fe: 5, discernimento: 4 }
      }
    ]
  },

  // === CENA 4 ===
  "monte-sinai": {
    id: "monte-sinai",
    title: "O Monte da Lei",
    location: "Monte Sinai",
    characters: ["cristao"],
    narrative: [
      "Cristão seguiu o conselho e se aproximou do Monte Sinai.",
      "O monte começou a tremer. Fogo e raios irromperam do topo.",
      "O fardo ficou ainda mais pesado. Cristão caiu de joelhos, aterrorizado.",
      "A Lei não podia salvá-lo — apenas condená-lo."
    ],
    choices: [
      {
        text: "Fugir de volta ao caminho",
        nextChapterId: "evangelista-retorno",
        consequence: "O medo pode nos corrigir.",
        effects: { perseveranca: 2, coragem: 2 }
      }
    ]
  },

  // === CENA 5 ===
  "evangelista-retorno": {
    id: "evangelista-retorno",
    title: "O Retorno de Evangelista",
    location: "Encruzilhada",
    characters: ["cristao", "evangelista"],
    narrative: [
      "Evangelista o encontrou novamente. Seu olhar era sério, mas compassivo.",
      "\"Por que você se desviou? O Portão Estreito é o único caminho.\"",
      "Cristão chorou de vergonha. \"Fui enganado pelo Sr. Sabedoria Mundana.\"",
      "\"Levante-se\", disse Evangelista. \"A misericórdia ainda está disponível.\""
    ],
    choices: [
      {
        text: "Voltar ao caminho do Portão Estreito",
        nextChapterId: "portao-estreito",
        consequence: "Cair faz parte. Levantar é o que importa.",
        effects: { fe: 4, perseveranca: 4, discernimento: 3 }
      }
    ]
  },

  // === CENA 6 ===
  "pantano-desanimo": {
    id: "pantano-desanimo",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao", "flexivel", "socorro"],
    reflection: "r4",
    narrative: [
      "O chão cedeu. Cristão e Flexível afundaram numa lama escura.",
      "Flexível entrou em pânico. \"Isso é loucura!\" Virou as costas e fugiu.",
      "Cristão lutava, mas o fardo o puxava para baixo. Culpa, vergonha, dúvida.",
      "Uma mão firme apareceu. Era Socorro."
    ],
    adaptiveNarrative: [
      { minAttr: "perseveranca", minValue: 10, text: "Mesmo afundando, uma chama dentro de Cristão se recusava a apagar." },
      { minAttr: "coragem", minValue: 10, text: "Socorro ficou impressionado. \"Poucos lutam assim neste lugar.\"" }
    ],
    choices: [
      {
        text: "Aceitar a mão de Socorro",
        nextChapterId: "portao-estreito",
        consequence: "Aceitar ajuda é sinal de sabedoria.",
        effects: { fe: 3, discernimento: 4, perseveranca: 2 }
      },
      {
        text: "Tentar sair sozinho",
        nextChapterId: "pantano-orgulho",
        consequence: "O orgulho pode ser tão perigoso quanto a lama.",
        effects: { coragem: 3, perseveranca: 2 }
      }
    ]
  },

  // === CENA 7 ===
  "pantano-desanimo-sozinho": {
    id: "pantano-desanimo-sozinho",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao", "socorro"],
    reflection: "r4",
    narrative: [
      "Sozinho no caminho, o chão cedeu. O pântano o engoliu.",
      "Sem ninguém por perto, pensamentos sombrios vieram: \"Volte. Desista.\"",
      "Cristão lembrou da luz. Clamou por ajuda. Socorro apareceu."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 12, text: "Socorro sorriu. \"Sua fé já o sustentava antes de eu chegar.\"" }
    ],
    choices: [
      {
        text: "Aceitar a ajuda e seguir renovado",
        nextChapterId: "portao-estreito",
        consequence: "Há força em reconhecer a própria fraqueza.",
        effects: { fe: 4, perseveranca: 5, discernimento: 2 }
      }
    ]
  },

  // === CENA 8 ===
  "pantano-orgulho": {
    id: "pantano-orgulho",
    title: "O Peso do Orgulho",
    location: "Pântano do Desânimo",
    characters: ["cristao", "socorro"],
    reflection: "r5",
    narrative: [
      "\"Eu consigo sozinho!\" Cristão recusou a mão estendida.",
      "Cada movimento o afundava mais. Suas forças se esgotaram.",
      "Exausto, aceitou a ajuda. Socorro disse: \"O orgulho é um fardo que você carrega por escolha.\""
    ],
    choices: [
      {
        text: "Aprender a lição e seguir humildemente",
        nextChapterId: "portao-estreito",
        consequence: "A lição ficará gravada no coração.",
        effects: { discernimento: 5, perseveranca: 3, fe: 2 }
      }
    ]
  },

  // === CENA 9 ===
  "portao-estreito": {
    id: "portao-estreito",
    title: "O Portão Estreito",
    location: "Portão Estreito",
    characters: ["cristao", "boa-vontade"],
    reflection: "r6",
    narrative: [
      "Cristão avistou o Portão Estreito — pequeno e quase escondido.",
      "Boa Vontade o chamou: \"Bata, e se abrirá.\"",
      "Cristão bateu. Boa Vontade o puxou para dentro. \"Rápido! Inimigos atacam os que hesitam.\"",
      "Do outro lado, o Caminho Estreito seguia rumo a uma colina distante."
    ],
    adaptiveNarrative: [
      { minAttr: "discernimento", minValue: 10, text: "Cristão notou marcas de flechas nas paredes. Outros quase não conseguiram entrar." },
      { minAttr: "coragem", minValue: 12, text: "Boa Vontade o observou. \"Poucos chegam aqui com tanta coragem no olhar.\"" }
    ],
    choices: [
      {
        text: "Perguntar sobre o caminho antes de seguir",
        nextChapterId: "casa-interprete",
        consequence: "Conhecimento é um aliado precioso.",
        effects: { discernimento: 6, fe: 2 }
      },
      {
        text: "Seguir imediatamente pelo Caminho Estreito",
        nextChapterId: "colina-dificuldade",
        consequence: "A urgência queima no coração.",
        effects: { coragem: 4, perseveranca: 3 }
      }
    ]
  },

  // === CENA 10 ===
  "casa-interprete": {
    id: "casa-interprete",
    title: "A Casa do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    reflection: "r7",
    narrative: [
      "O Intérprete guiou Cristão por salas cheias de visões.",
      "Na primeira: um retrato de um homem com os olhos no céu. \"Ele é o único guia verdadeiro.\"",
      "Na segunda: um fogo que crescia mesmo com água jogada nele. \"A graça mantém a chama viva.\"",
      "Cada sala preparava Cristão para o que viria."
    ],
    adaptiveNarrative: [
      { minAttr: "discernimento", minValue: 12, text: "O Intérprete sorriu. \"Você enxerga além da superfície. Isso será essencial.\"" }
    ],
    choices: [
      {
        text: "Seguir fortalecido pelas visões",
        nextChapterId: "colina-dificuldade",
        consequence: "As lições iluminarão os dias difíceis.",
        effects: { discernimento: 8, fe: 4, perseveranca: 2 }
      }
    ]
  },

  // === CENA 11 ===
  "colina-dificuldade": {
    id: "colina-dificuldade",
    title: "A Colina da Dificuldade",
    location: "Colina da Dificuldade",
    characters: ["cristao"],
    reflection: "r8",
    narrative: [
      "O caminho chegou a uma colina íngreme. O caminho reto subia direto pelo topo.",
      "Dois caminhos mais fáceis contornavam a colina — um pela esquerda, outro pela direita.",
      "Cristão olhou para cima. A subida seria cansativa, mas o caminho era claro."
    ],
    choices: [
      {
        text: "Subir direto pela colina, mesmo sendo difícil",
        nextChapterId: "palacio-belo",
        consequence: "O caminho difícil fortalece.",
        effects: { perseveranca: 6, coragem: 4, fe: 2 }
      },
      {
        text: "Tomar o caminho mais fácil ao redor",
        nextChapterId: "desvio-colina",
        consequence: "Atalhos nem sempre economizam tempo.",
        effects: { perseveranca: 1 }
      }
    ]
  },

  // === CENA 12 ===
  "desvio-colina": {
    id: "desvio-colina",
    title: "Perdido nos Desvios",
    location: "Caminhos Tortuosos",
    characters: ["cristao"],
    narrative: [
      "O caminho fácil logo se tornou confuso. As trilhas se cruzavam sem direção.",
      "Cristão andou em círculos. O medo cresceu. Estava perdido.",
      "Depois de muito vagar, avistou a colina ao longe. Teria que subir de qualquer forma."
    ],
    choices: [
      {
        text: "Voltar e subir a colina pelo caminho certo",
        nextChapterId: "palacio-belo",
        consequence: "O desvio custou tempo, mas a lição ficou.",
        effects: { discernimento: 4, perseveranca: 3 }
      }
    ]
  },

  // === CENA 13 ===
  "palacio-belo": {
    id: "palacio-belo",
    title: "O Palácio Belo",
    location: "Palácio Belo",
    characters: ["cristao", "prudencia"],
    reflection: "r9",
    narrative: [
      "No topo da colina, Cristão encontrou o Palácio Belo — um lugar de descanso para peregrinos.",
      "Prudência e as outras guardiãs o receberam. Fizeram perguntas sobre sua jornada.",
      "Deram-lhe comida, descanso, e mostraram a armadura de Deus: escudo, capacete, espada e couraça.",
      "\"Vista-se antes de continuar. O caminho à frente exigirá tudo isso.\""
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 15, text: "Prudência notou a fé de Cristão. \"Você já está mais preparado do que imagina.\"" },
      { minAttr: "discernimento", minValue: 15, text: "Cristão reconheceu cada peça da armadura e seu significado. As guardiãs ficaram impressionadas." }
    ],
    choices: [
      {
        text: "Vestir a armadura e seguir em frente",
        nextChapterId: "cruz-fardo",
        consequence: "Bem preparado para o que vem.",
        effects: { coragem: 5, fe: 3, perseveranca: 3 }
      },
      {
        text: "Descansar mais um pouco antes de partir",
        nextChapterId: "cruz-fardo",
        consequence: "O descanso renova as forças.",
        effects: { perseveranca: 5, fe: 3, discernimento: 2 }
      }
    ]
  },

  // === CENA 14 — CLÍMAX DA PARTE 1 ===
  "cruz-fardo": {
    id: "cruz-fardo",
    title: "A Cruz e a Libertação",
    location: "Colina da Cruz",
    characters: ["cristao"],
    reflection: "r10",
    narrative: [
      "Cristão subiu a colina. O fardo nunca pesou tanto.",
      "No topo, viu a Cruz. Simples. Poderosa.",
      "As amarras se soltaram. O fardo caiu e sumiu para sempre.",
      "De joelhos, Cristão chorou de alívio. Recebeu vestes novas e um pergaminho selado.",
      "\"Apresente-o nos portões da Cidade Celestial.\""
    ],
    choices: [
      {
        text: "Seguir em frente, livre e renovado",
        nextChapterId: "final-parte1",
        consequence: "Uma nova vida começa aqui.",
        effects: { fe: 10, perseveranca: 5, coragem: 3, discernimento: 2 }
      }
    ]
  },

  // === FINAL DA PARTE 1 ===
  "final-parte1": {
    id: "final-parte1",
    title: "Fim da Primeira Parte",
    location: "Além da Cruz",
    characters: ["cristao"],
    narrative: [
      "O fardo caiu. As vestes brilham. O pergaminho está guardado.",
      "Cristão olha para o horizonte. O Caminho Estreito continua — há vales, feiras, castelos e gigantes à frente.",
      "Mas agora ele caminha diferente. Livre.",
      "A jornada está apenas começando."
    ],
    choices: [],
    isEnding: true,
    endingType: "parte1"
  }
};

export const getChapter = (id: string): StoryChapter | undefined => storyChapters[id];
export const FIRST_CHAPTER_ID = "inicio";
