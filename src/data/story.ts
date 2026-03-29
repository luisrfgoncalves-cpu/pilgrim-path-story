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
  /** If set, this choice only appears when the player meets these minimum attributes */
  requires?: Partial<ChoiceEffect>;
}

export interface StoryChapter {
  id: string;
  title: string;
  location: string;
  narrative: string[];
  /** Dynamic narrative segments that appear based on attributes */
  adaptiveNarrative?: { minAttr: keyof ChoiceEffect; minValue: number; text: string }[];
  choices: StoryChoice[];
  isEnding?: boolean;
  endingType?: 'glorioso' | 'humilde' | 'sofrido' | 'default';
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
  { id: "cristao", name: "Cristão", description: "O protagonista. Um homem comum que descobre a verdade sobre a destruição iminente de sua cidade e parte numa jornada rumo à Cidade Celestial, carregando o fardo de seus pecados.", role: "Protagonista", unlockedAtChapter: "inicio" },
  { id: "evangelista", name: "Evangelista", description: "Um homem sábio que aponta Cristão na direção certa, mostrando-lhe a luz do Portão Estreito. Representa aqueles que pregam o evangelho.", role: "Guia", unlockedAtChapter: "inicio" },
  { id: "obstinado", name: "Obstinado", description: "Vizinho de Cristão que zomba de sua decisão de deixar a Cidade da Destruição. Representa aqueles que rejeitam a verdade por apego ao conforto.", role: "Antagonista", unlockedAtChapter: "familia-recusa" },
  { id: "flexivel", name: "Flexível", description: "Vizinho curioso que acompanha Cristão no início, mas desiste ao primeiro obstáculo. Representa a fé superficial que não resiste às provações.", role: "Companheiro temporário", unlockedAtChapter: "familia-recusa" },
  { id: "socorro", name: "Socorro", description: "Enviado para ajudar peregrinos que caem no Pântano do Desânimo. Representa a graça divina que nos resgata em momentos de fraqueza.", role: "Aliado", unlockedAtChapter: "pantano-desanimo" },
  { id: "boa-vontade", name: "Boa Vontade", description: "O guardião do Portão Estreito que recebe os peregrinos com urgência e proteção. Representa Cristo abrindo a porta da salvação.", role: "Guardião", unlockedAtChapter: "portao-estreito" },
  { id: "interprete", name: "Intérprete", description: "Mestre que revela verdades espirituais através de visões e parábolas em sua casa. Representa o Espírito Santo iluminando o entendimento.", role: "Mestre", unlockedAtChapter: "casa-interprete" },
  { id: "fiel", name: "Fiel", description: "Companheiro leal de Cristão que é martirizado na Feira da Vaidade. Sua coragem diante da morte inspira outros a seguir o caminho.", role: "Companheiro e Mártir", unlockedAtChapter: "fiel-encontro" },
  { id: "esperanca", name: "Esperança", description: "Jovem convertido após testemunhar o martírio de Fiel. Torna-se o companheiro fiel de Cristão até o fim da jornada.", role: "Companheiro", unlockedAtChapter: "esperanca-encontro" },
  { id: "gigante-desespero", name: "Gigante Desespero", description: "O terrível dono do Castelo da Dúvida. Aprisiona e tormenta os peregrinos que se desviam do caminho, tentando levá-los à destruição.", role: "Antagonista", unlockedAtChapter: "castelo-duvida" },
];

export const reflections: Reflection[] = [
  { id: "r1", title: "O Peso do Pecado", text: "Todos nós carregamos fardos. A jornada começa quando reconhecemos que não podemos nos libertar sozinhos e buscamos o caminho da redenção.", verse: "Mateus 11:28 — \"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.\"", unlockedAtChapter: "inicio" },
  { id: "r2", title: "Nem Todos Ouvirão", text: "Nem todos ao nosso redor compreenderão ou aceitarão a verdade. O chamado é pessoal, e às vezes devemos seguir mesmo quando os que amamos não nos acompanham.", verse: "Lucas 14:26 — Sobre o custo de seguir o chamado.", unlockedAtChapter: "familia-recusa" },
  { id: "r3", title: "O Desânimo no Caminho", text: "O caminho da fé não é isento de momentos de desespero. O Pântano do Desânimo representa as dúvidas e culpas que nos assaltam. Mas há sempre uma mão estendida para nos erguer.", verse: "Salmos 40:2 — \"Tirou-me de um lago horrível, de um atoleiro de lama; pôs os meus pés sobre uma rocha.\"", unlockedAtChapter: "pantano-desanimo" },
  { id: "r4", title: "A Humildade Necessária", text: "O orgulho nos afunda mais do que qualquer lama. Aceitar ajuda não é fraqueza — é sabedoria. Deus resiste ao soberbo, mas dá graça ao humilde.", verse: "Tiago 4:6 — \"Deus resiste aos soberbos, mas dá graça aos humildes.\"", unlockedAtChapter: "pantano-orgulho" },
  { id: "r5", title: "A Porta Estreita", text: "A entrada para a vida verdadeira é estreita e muitos a ignoram. Mas aqueles que batem com sinceridade encontrarão a porta aberta e um guardião pronto a recebê-los.", verse: "Mateus 7:13-14 — Sobre o caminho estreito e a porta estreita.", unlockedAtChapter: "portao-estreito" },
  { id: "r6", title: "Visões da Verdade", text: "O Espírito revela verdades que os olhos naturais não veem. A graça mantém o fogo aceso mesmo quando o mundo tenta apagá-lo.", verse: "1 Coríntios 2:10 — \"O Espírito sonda todas as coisas, até mesmo as coisas mais profundas de Deus.\"", unlockedAtChapter: "casa-interprete" },
  { id: "r7", title: "A Libertação na Cruz", text: "O momento mais transformador da jornada é quando o fardo cai ao pé da Cruz. Não por nosso mérito, mas pela graça. A liberdade é um presente, não uma conquista.", verse: "Gálatas 5:1 — \"Foi para a liberdade que Cristo nos libertou.\"", unlockedAtChapter: "cruz-fardo" },
  { id: "r8", title: "Nas Trevas, a Fé", text: "O Vale da Sombra da Morte é inevitável. Mas mesmo nas trevas mais densas, a oração é uma espada e a fé é um escudo.", verse: "Salmos 23:4 — \"Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.\"", unlockedAtChapter: "vale-sombra" },
  { id: "r9", title: "Companheiros de Jornada", text: "Deus coloca pessoas em nosso caminho nos momentos certos. A comunhão entre peregrinos fortalece e encoraja.", verse: "Eclesiastes 4:9-10 — \"Melhor é serem dois do que um, pois se caírem, um levanta o outro.\"", unlockedAtChapter: "fiel-encontro" },
  { id: "r10", title: "O Preço da Verdade", text: "A Feira da Vaidade oferece tudo, menos o que realmente importa. O mundo pode nos perseguir por escolhermos a Verdade, mas o sacrifício nunca é em vão.", verse: "Filipenses 3:8 — \"Considero tudo como perda por causa da excelência do conhecimento de Cristo Jesus.\"", unlockedAtChapter: "feira-vaidade" },
  { id: "r11", title: "O Perigo dos Atalhos", text: "Os desvios do caminho nos levam ao Castelo da Dúvida. Mas até nos piores calabouços, a chave da Promessa pode nos libertar.", verse: "2 Timóteo 2:13 — \"Se somos infiéis, ele permanece fiel, pois não pode negar-se a si mesmo.\"", unlockedAtChapter: "castelo-duvida" },
  { id: "r12", title: "A Chegada Gloriosa", text: "A jornada tem um destino certo para aqueles que perseveram. As lágrimas serão enxugadas, os fardos desaparecerão, e a presença do Rei será eterna.", verse: "Apocalipse 21:4 — \"Ele enxugará toda lágrima dos seus olhos. Não haverá mais morte, nem tristeza, nem choro, nem dor.\"", unlockedAtChapter: "cidade-celestial" },
];

export const chapterOrder = [
  "inicio", "familia-recusa", "pantano-desanimo", "pantano-desanimo-sozinho",
  "pantano-orgulho", "portao-estreito", "casa-interprete", "cruz-fardo",
  "vale-sombra", "fiel-encontro", "feira-inevitavel", "feira-vaidade",
  "esperanca-encontro", "castelo-duvida",
  "cidade-celestial-glorioso", "cidade-celestial-humilde", "cidade-celestial-sofrido", "cidade-celestial",
];

export const storyChapters: Record<string, StoryChapter> = {
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
      "Evangelista apareceu e apontou para uma luz distante. \"Siga aquela luz. Ela levará você ao caminho certo.\""
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
      "Com o coração partido, Cristão entendeu: precisava seguir sozinho ou com quem quisesse ir."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 15, text: "Algo na convicção de Cristão tocou Flexível. Havia verdade naquele olhar." },
      { minAttr: "discernimento", minValue: 8, text: "Cristão percebeu que insistir só geraria mais raiva. Era hora de partir." }
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
      }
    ]
  },

  "pantano-desanimo": {
    id: "pantano-desanimo",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao", "flexivel", "socorro"],
    reflection: "r3",
    narrative: [
      "O chão cedeu. Cristão e Flexível afundaram numa lama escura e pesada.",
      "Flexível entrou em pânico. \"Isso é loucura!\" Virou as costas e fugiu.",
      "Cristão lutava, mas o fardo o puxava para baixo. Culpa, vergonha, dúvida — tudo pesava.",
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

  "pantano-desanimo-sozinho": {
    id: "pantano-desanimo-sozinho",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao", "socorro"],
    reflection: "r3",
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

  "pantano-orgulho": {
    id: "pantano-orgulho",
    title: "O Peso do Orgulho",
    location: "Pântano do Desânimo",
    characters: ["cristao", "socorro"],
    reflection: "r4",
    narrative: [
      "\"Eu consigo sozinho!\" Cristão recusou a mão estendida.",
      "Cada movimento o afundava mais. Suas forças se esgotaram.",
      "Exausto, aceitou a ajuda. Socorro disse com gentileza: \"O orgulho é um fardo que você carrega por escolha.\""
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

  "portao-estreito": {
    id: "portao-estreito",
    title: "O Portão Estreito",
    location: "Portão Estreito",
    characters: ["cristao", "boa-vontade"],
    reflection: "r5",
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
        nextChapterId: "cruz-fardo",
        consequence: "A urgência queima no coração.",
        effects: { coragem: 4, perseveranca: 3 }
      }
    ]
  },

  "casa-interprete": {
    id: "casa-interprete",
    title: "A Casa do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    reflection: "r6",
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
        nextChapterId: "cruz-fardo",
        consequence: "As lições iluminarão os dias difíceis.",
        effects: { discernimento: 8, fe: 4, perseveranca: 2 }
      }
    ]
  },

  "cruz-fardo": {
    id: "cruz-fardo",
    title: "A Cruz e a Libertação",
    location: "Colina da Cruz",
    characters: ["cristao"],
    reflection: "r7",
    narrative: [
      "Cristão subiu a colina. O fardo nunca pesou tanto.",
      "No topo, viu a Cruz. Simples. Poderosa.",
      "As amarras se soltaram. O fardo caiu e sumiu para sempre.",
      "De joelhos, Cristão chorou de alívio. Recebeu vestes novas e um pergaminho selado.",
      "\"Apresente-o nos portões da Cidade Celestial.\""
    ],
    choices: [
      {
        text: "Seguir renovado, livre do fardo",
        nextChapterId: "vale-sombra",
        consequence: "A jornada continua, mas agora você caminha livre.",
        effects: { fe: 10, perseveranca: 5, coragem: 3, discernimento: 2 }
      }
    ]
  },

  "vale-sombra": {
    id: "vale-sombra",
    title: "O Vale da Sombra da Morte",
    location: "Vale da Sombra da Morte",
    characters: ["cristao"],
    reflection: "r8",
    narrative: [
      "O caminho desceu para um vale de trevas. Fosso à direita. Pântano à esquerda.",
      "Sussurros, chamas, vozes acusadoras. A escuridão era completa.",
      "Cristão sentiu medo como nunca.",
      "No fundo do vale, ouviu outro peregrino recitando: \"Não temerei mal algum, porque Tu estás comigo.\""
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 25, text: "A fé de Cristão era como uma armadura. Os demônios recuavam diante dele." },
      { minAttr: "coragem", minValue: 18, text: "A coragem forjada nas provações fez Cristão caminhar firme onde outros paralisariam." },
      { minAttr: "perseveranca", minValue: 15, text: "Cada passo era uma escolha de não desistir." }
    ],
    choices: [
      {
        text: "Orar em voz alta e avançar",
        nextChapterId: "fiel-encontro",
        consequence: "A oração é uma arma nas trevas.",
        effects: { fe: 8, coragem: 5, perseveranca: 3 }
      },
      {
        text: "Buscar o peregrino à frente",
        nextChapterId: "fiel-encontro",
        consequence: "A companhia fortalece a caminhada.",
        effects: { discernimento: 5, perseveranca: 5, fe: 3 }
      }
    ]
  },

  "fiel-encontro": {
    id: "fiel-encontro",
    title: "O Encontro com Fiel",
    location: "Saída do Vale",
    characters: ["cristao", "fiel"],
    reflection: "r9",
    narrative: [
      "A aurora rompeu as trevas. Cristão encontrou Fiel — um conhecido que também saíra da Cidade da Destruição.",
      "Os dois se abraçaram. Compartilharam suas histórias.",
      "\"O caminho é difícil\", disse Fiel, \"mas a graça é suficiente.\"",
      "No horizonte, avistaram a Feira da Vaidade."
    ],
    choices: [
      {
        text: "Entrar na Feira com cautela",
        nextChapterId: "feira-vaidade",
        consequence: "Prudência será necessária entre tantas tentações.",
        effects: { discernimento: 5, fe: 2 }
      },
      {
        text: "Tentar contornar a feira",
        nextChapterId: "feira-inevitavel",
        consequence: "Alguns caminhos não podem ser evitados.",
        effects: { perseveranca: 3, discernimento: 2 }
      }
    ]
  },

  "feira-inevitavel": {
    id: "feira-inevitavel",
    title: "Sem Desvios",
    location: "Arredores da Feira da Vaidade",
    characters: ["cristao", "fiel"],
    narrative: [
      "Não havia outro caminho. O Caminho Estreito passava pelo centro da Feira.",
      "Fiel disse: \"O Senhor nos dá força para enfrentar, não para fugir.\"",
      "Os dois se prepararam para entrar."
    ],
    choices: [
      {
        text: "Entrar juntos, com coragem",
        nextChapterId: "feira-vaidade",
        consequence: "Enfrentar o inevitável é sinal de maturidade.",
        effects: { coragem: 5, perseveranca: 3, fe: 2 }
      }
    ]
  },

  "feira-vaidade": {
    id: "feira-vaidade",
    title: "A Feira da Vaidade",
    location: "Feira da Vaidade",
    characters: ["cristao", "fiel"],
    reflection: "r10",
    narrative: [
      "A Feira oferecia tudo: honras, prazeres, riquezas, títulos.",
      "\"O que desejam comprar?\", perguntaram. \"A Verdade\", responderam.",
      "A resposta causou fúria. Foram espancados e presos.",
      "Fiel foi condenado e morto. Sua coragem inspirou outros.",
      "Com o coração pesado, Cristão escapou. A jornada precisava continuar."
    ],
    adaptiveNarrative: [
      { minAttr: "coragem", minValue: 20, text: "A coragem de Cristão no julgamento fez até os guardas sentirem vergonha." },
      { minAttr: "fe", minValue: 30, text: "Mesmo acorrentado, Cristão cantava hinos. As paredes pareciam tremer." }
    ],
    choices: [
      {
        text: "Honrar Fiel e seguir em frente",
        nextChapterId: "esperanca-encontro",
        consequence: "O sacrifício de Fiel não será em vão.",
        effects: { fe: 5, perseveranca: 5, coragem: 5 }
      }
    ]
  },

  "esperanca-encontro": {
    id: "esperanca-encontro",
    title: "Um Novo Companheiro",
    location: "Além da Feira da Vaidade",
    characters: ["cristao", "esperanca"],
    narrative: [
      "Esperança alcançou Cristão — um jovem tocado pela coragem de Fiel.",
      "\"Se ele preferiu morrer a negar a Verdade, essa Verdade vale tudo.\"",
      "Juntos, seguiram. Mas ao longe, os contornos sombrios do Castelo da Dúvida apareceram."
    ],
    choices: [
      {
        text: "Manter-se no Caminho Estreito",
        nextChapterId: "cidade-celestial",
        consequence: "Perseverança é a marca dos verdadeiros peregrinos.",
        effects: { perseveranca: 8, fe: 5, discernimento: 3 }
      },
      {
        text: "Tomar um atalho que parece mais fácil",
        nextChapterId: "castelo-duvida",
        consequence: "Atalhos raramente levam aonde prometem.",
        effects: { coragem: 2 }
      },
      {
        text: "Consultar o pergaminho antes de decidir",
        nextChapterId: "cidade-celestial",
        consequence: "O pergaminho brilhou, confirmando a direção certa.",
        effects: { discernimento: 8, fe: 5, perseveranca: 3 },
        requires: { discernimento: 20 }
      }
    ]
  },

  "castelo-duvida": {
    id: "castelo-duvida",
    title: "O Castelo da Dúvida",
    location: "Castelo da Dúvida",
    characters: ["cristao", "esperanca", "gigante-desespero"],
    reflection: "r11",
    narrative: [
      "O atalho os levou às terras do Gigante Desespero. Foram presos nas masmorras.",
      "O Gigante os torturava: \"Vocês nunca chegarão lá. Desistam.\"",
      "Esperança o encorajou: \"Deus não nos trouxe até aqui para nos abandonar.\"",
      "Na calada da noite, Cristão lembrou da chave chamada Promessa."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 35, text: "A fé de Cristão era tão forte que o Gigante não conseguia quebrar seu espírito." },
      { minAttr: "perseveranca", minValue: 20, text: "A perseverança acumulada sustentou Cristão nos dias mais escuros." }
    ],
    choices: [
      {
        text: "Usar a chave da Promessa e fugir",
        nextChapterId: "cidade-celestial",
        consequence: "A experiência ensinou o preço dos desvios.",
        effects: { fe: 5, discernimento: 5, perseveranca: 3 }
      },
      {
        text: "Enfrentar o Gigante com palavras de fé",
        nextChapterId: "cidade-celestial",
        consequence: "O Gigante tremeu. As correntes se partiram.",
        effects: { coragem: 10, fe: 8, perseveranca: 5 },
        requires: { coragem: 25, fe: 30 }
      }
    ]
  },

  // === FINAIS ===
  "cidade-celestial": {
    id: "cidade-celestial",
    title: "A Cidade Celestial",
    location: "Cidade Celestial",
    characters: ["cristao", "esperanca"],
    reflection: "r12",
    narrative: [
      "Cristão e Esperança chegaram às Montanhas Deleitosas. Ao longe, os portões brilhavam como ouro.",
      "O último obstáculo: o Rio da Morte. Profundo, sem ponte.",
      "\"Não tema\", disse Esperança. \"As águas são rasas ou profundas conforme a sua fé.\"",
      "Cristão atravessou. Anjos o esperavam com cânticos.",
      "Apresentou o pergaminho. Os portões se abriram.",
      "Cristão entrou na presença do Rei. Todo peso ficou para trás — para sempre."
    ],
    choices: [],
    isEnding: true,
    endingType: "default"
  },

  "cidade-celestial-glorioso": {
    id: "cidade-celestial-glorioso",
    title: "Final Glorioso",
    location: "Cidade Celestial",
    characters: ["cristao", "esperanca"],
    reflection: "r12",
    narrative: [
      "Uma luz dourada envolveu Cristão e Esperança nas Montanhas Deleitosas.",
      "O Rio da Morte se acalmou. Cristão caminhou sobre águas quase rasas.",
      "Anjos desceram em fileiras, cantando seu nome. Os portões se abriram com um trovão de glória.",
      "O Rei veio ao encontro: \"Bem-vindo, servo bom e fiel. Entre na alegria do seu Senhor.\"",
      "Uma coroa de ouro foi colocada sobre sua cabeça. Cada provação, cada lágrima — tudo valeu a pena."
    ],
    choices: [],
    isEnding: true,
    endingType: "glorioso"
  },

  "cidade-celestial-humilde": {
    id: "cidade-celestial-humilde",
    title: "Final do Peregrino Sábio",
    location: "Cidade Celestial",
    characters: ["cristao", "esperanca"],
    reflection: "r12",
    narrative: [
      "Cristão chegou ao Rio da Morte com o coração tranquilo.",
      "As águas eram profundas, mas ele não temeu. O discernimento lhe mostrava: cada prova foi preparação.",
      "Atravessou com serenidade. Um anjo o guiou pelos portões.",
      "O Rei sorriu: \"Você buscou sabedoria acima de tudo. E a sabedoria o trouxe até aqui.\"",
      "Cristão recebeu um manto tecido com as lições de cada escolha sábia."
    ],
    choices: [],
    isEnding: true,
    endingType: "humilde"
  },

  "cidade-celestial-sofrido": {
    id: "cidade-celestial-sofrido",
    title: "Final do Peregrino Perseverante",
    location: "Cidade Celestial",
    characters: ["cristao", "esperanca"],
    reflection: "r12",
    narrative: [
      "Cristão chegou ao Rio coberto de cicatrizes. Marcas de cada batalha, cada queda.",
      "As águas eram turbulentas. Quase afundou. Esperança o segurou: \"Não agora. Não depois de tudo.\"",
      "Com as últimas forças, alcançou a outra margem.",
      "O Rei o abraçou: \"Você caiu muitas vezes, mas nunca ficou no chão. Bem-vindo, meu filho.\"",
      "Suas vestes estavam rasgadas, mas brilhavam."
    ],
    choices: [],
    isEnding: true,
    endingType: "sofrido"
  }
};

export const getChapter = (id: string): StoryChapter | undefined => storyChapters[id];
export const FIRST_CHAPTER_ID = "inicio";

/**
 * Determines the ending chapter based on player attributes
 */
export const getEndingChapterId = (attrs: ChoiceEffect): string => {
  const fe = attrs.fe || 0;
  const coragem = attrs.coragem || 0;
  const discernimento = attrs.discernimento || 0;
  const perseveranca = attrs.perseveranca || 0;
  const total = fe + coragem + discernimento + perseveranca;

  // Glorioso: all attributes high
  if (total >= 120 && fe >= 30 && coragem >= 20) return "cidade-celestial-glorioso";
  // Humilde/Wise: discernimento dominant
  if (discernimento >= 25 && discernimento >= coragem) return "cidade-celestial-humilde";
  // Sofrido: perseverança dominant but lower overall
  if (perseveranca >= 20 && total < 100) return "cidade-celestial-sofrido";
  
  return "cidade-celestial";
};
