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
      "Cristão vivia na Cidade da Destruição, carregando um fardo pesado nas costas — o peso de seus pecados e angústias. Um dia, enquanto lia um livro antigo, descobriu que sua cidade seria consumida pelo fogo do céu.",
      "Atormentado por essa revelação, Cristão vagava pelos campos, chorando e clamando: \"O que devo fazer para ser salvo?\"",
      "Foi então que encontrou Evangelista, um homem sábio que apontou para uma luz distante brilhando além de um portão estreito. \"Siga aquela luz\", disse Evangelista. \"Ela o guiará ao caminho da salvação.\""
    ],
    choices: [
      {
        text: "Seguir a luz imediatamente, deixando tudo para trás",
        nextChapterId: "pantano-desanimo",
        consequence: "Sua fé o impulsiona adiante, mas o caminho não será fácil.",
        effects: { fe: 5, coragem: 3 }
      },
      {
        text: "Tentar convencer sua família a ir junto",
        nextChapterId: "familia-recusa",
        consequence: "O amor pela família é nobre, mas nem todos ouvirão o chamado.",
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
      "Cristão correu para casa e implorou à sua esposa e filhos que fugissem com ele. Mas eles o olharam com descrença e preocupação.",
      "\"Você enlouqueceu!\", disseram. Vizinhos e amigos tentaram dissuadi-lo, chamando-o de tolo e fanático.",
      "Obstinado e Flexível, dois vizinhos, vieram até ele. Obstinado zombava de sua decisão. Flexível, porém, mostrou-se curioso sobre a jornada.",
      "Com o coração partido, mas determinado, Cristão sabia que precisava seguir em frente."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 15, text: "A fé de Cristão era tão evidente que até Flexível sentiu algo diferente nele — uma convicção que não podia ser fabricada." },
      { minAttr: "discernimento", minValue: 8, text: "Com discernimento aguçado, Cristão percebeu que insistir mais só causaria ressentimento. Era hora de partir." }
    ],
    choices: [
      {
        text: "Partir com Flexível como companheiro",
        nextChapterId: "pantano-desanimo",
        consequence: "Um companheiro pode ser um conforto... ou uma provação.",
        effects: { discernimento: 2, perseveranca: 2 }
      },
      {
        text: "Partir sozinho, confiando apenas na providência",
        nextChapterId: "pantano-desanimo-sozinho",
        consequence: "A solidão no caminho pode fortalecer ou enfraquecer.",
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
      "Cristão e Flexível caminhavam animados quando, sem aviso, o chão cedeu sob seus pés. Afundaram em um pântano escuro e lodoso — o Pântano do Desânimo.",
      "O lodo parecia sugar suas forças. Flexível, tomado de pânico, gritou: \"Isto é loucura!\" e arrastou-se de volta.",
      "Cristão lutava para avançar, mas o fardo o empurrava para baixo. A lama parecia feita de culpa, vergonha e dúvida.",
      "Quando tudo parecia perdido, uma mão firme estendeu-se. Era Socorro."
    ],
    adaptiveNarrative: [
      { minAttr: "perseveranca", minValue: 10, text: "Mesmo afundando, Cristão sentia dentro de si uma chama de perseverança que se recusava a apagar. Cada tentativa de avançar era um ato de resistência." },
      { minAttr: "coragem", minValue: 10, text: "A coragem de Cristão impressionou até Socorro. \"Poucos lutam com tanta determinação neste lugar\", disse ele." }
    ],
    choices: [
      {
        text: "Aceitar a mão de Socorro e seguir em frente",
        nextChapterId: "portao-estreito",
        consequence: "A humildade de aceitar ajuda revela sabedoria.",
        effects: { fe: 3, discernimento: 4, perseveranca: 2 }
      },
      {
        text: "Tentar sair sozinho, provando sua força",
        nextChapterId: "pantano-orgulho",
        consequence: "O orgulho pode ser tão perigoso quanto o próprio pântano.",
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
      "Sozinho no caminho, Cristão avançava com determinação quando o chão cedeu. O Pântano do Desânimo o engoliu sem misericórdia.",
      "Sem ninguém para ajudá-lo, o desespero crescia. Pensamentos sombrios sussurravam: \"Volte. Desista.\"",
      "Mas Cristão lembrou das palavras de Evangelista e da luz distante. Clamou por ajuda, e surgiu Socorro."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 12, text: "A fé de Cristão brilhava mesmo na escuridão do pântano. Socorro sorriu: \"Sua fé já o sustentava antes de eu chegar.\"" }
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
      "Cristão recusou a mão de Socorro. \"Eu consigo sozinho!\", disse, lutando contra o lodo com toda sua força.",
      "Cada movimento o afundava mais. Suas forças se esvaíam.",
      "Finalmente, exausto e humilhado, Cristão aceitou a ajuda de Socorro.",
      "\"O orgulho\", disse Socorro gentilmente, \"é um fardo que você carrega por escolha.\""
    ],
    choices: [
      {
        text: "Aprender com a lição e seguir humildemente",
        nextChapterId: "portao-estreito",
        consequence: "A lição do orgulho ficará gravada no coração.",
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
      "Cristão avistou o Portão Estreito — humilde e quase escondido entre muros altos.",
      "Boa Vontade o esperava. \"Bata, e a porta se abrirá.\"",
      "Cristão bateu. Boa Vontade o puxou para dentro com urgência. \"Entre rápido! Há inimigos que atiram flechas contra os que hesitam.\"",
      "Do outro lado, o Caminho Estreito se estendia rumo a uma colina distante."
    ],
    adaptiveNarrative: [
      { minAttr: "discernimento", minValue: 10, text: "O discernimento de Cristão permitiu-lhe notar marcas de flechas nas paredes do portão — sinais de peregrinos anteriores que quase não conseguiram entrar. Ele agradeceu pela urgência de Boa Vontade." },
      { minAttr: "coragem", minValue: 12, text: "Boa Vontade observou Cristão com admiração: \"Poucos chegam aqui com tanta coragem no olhar. O caminho à frente exigirá cada gota dela.\"" }
    ],
    choices: [
      {
        text: "Perguntar sobre o caminho antes de seguir",
        nextChapterId: "casa-interprete",
        consequence: "Conhecimento é um aliado precioso na jornada.",
        effects: { discernimento: 6, fe: 2 }
      },
      {
        text: "Seguir imediatamente pelo Caminho Estreito",
        nextChapterId: "cruz-fardo",
        consequence: "A urgência da jornada queima no coração.",
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
      "Na Casa do Intérprete, Cristão foi guiado por salas com visões que revelavam verdades profundas.",
      "Na primeira sala, viu um retrato de um homem grave com olhos erguidos ao céu. \"Este é o único homem autorizado a ser seu guia.\"",
      "Na segunda, um fogo que crescia apesar da água jogada nele. \"A graça de Deus mantém a obra viva no coração.\"",
      "Cada sala revelava uma nova verdade, preparando Cristão para os desafios futuros."
    ],
    adaptiveNarrative: [
      { minAttr: "discernimento", minValue: 12, text: "O discernimento aguçado de Cristão permitiu-lhe compreender significados mais profundos nas visões. O Intérprete sorriu: \"Você vê além da superfície. Isso será essencial.\"" }
    ],
    choices: [
      {
        text: "Continuar pelo caminho, fortalecido pelas visões",
        nextChapterId: "cruz-fardo",
        consequence: "As lições do Intérprete iluminarão os dias difíceis.",
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
      "Cristão subiu a colina com dificuldade, o fardo pesando cada vez mais.",
      "No topo, ele a viu — a Cruz. Alta, simples, poderosa.",
      "As amarras do fardo se soltaram. O peso deslizou de suas costas e desapareceu para sempre.",
      "Cristão caiu de joelhos em lágrimas de alegria. Três seres resplandecentes lhe deram vestes novas, um selo e um pergaminho selado.",
      "\"Este pergaminho é sua garantia. Apresente-o nos portões da Cidade Celestial.\""
    ],
    choices: [
      {
        text: "Seguir renovado pelo Caminho Estreito",
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
      "O caminho desceu para um vale escuro e terrível. À direita, um fosso sem fundo. À esquerda, um pântano traiçoeiro.",
      "Demônios sussurravam nas trevas. Chamas irrompiam do chão. Cristão sentia medo como nunca antes.",
      "Vozes blasfemas sussurravam em seus ouvidos. A escuridão era tão densa que ele mal podia ver seus pés.",
      "No meio daquela noite, ouviu outro peregrino citando: \"Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum.\""
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 25, text: "A fé profunda de Cristão era como uma armadura invisível. Os demônios recuavam ao sentir a luz que emanava dele, e o vale pareceu menos aterrador." },
      { minAttr: "coragem", minValue: 18, text: "A coragem forjada nas provações anteriores permitiu a Cristão caminhar com passo firme onde outros teriam paralisado." },
      { minAttr: "perseveranca", minValue: 15, text: "Cada passo era uma escolha de não desistir. A perseverança de Cristão transformava o impossível em inevitável." }
    ],
    choices: [
      {
        text: "Orar em voz alta e avançar com fé",
        nextChapterId: "fiel-encontro",
        consequence: "A oração é uma arma poderosa nas trevas.",
        effects: { fe: 8, coragem: 5, perseveranca: 3 }
      },
      {
        text: "Buscar o peregrino à frente para não estar só",
        nextChapterId: "fiel-encontro",
        consequence: "A comunhão entre peregrinos fortalece a caminhada.",
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
      "A aurora rompeu as trevas. Cristão viu Fiel, um antigo conhecido que também partira da Cidade da Destruição.",
      "Os dois se abraçaram e compartilharam suas histórias. Fiel contou suas provações.",
      "\"O caminho é difícil\", disse Fiel, \"mas a graça é sempre suficiente.\"",
      "Juntos, avistaram no horizonte a Feira da Vaidade."
    ],
    choices: [
      {
        text: "Entrar na Feira da Vaidade com cautela",
        nextChapterId: "feira-vaidade",
        consequence: "A prudência será necessária em um lugar de tantas tentações.",
        effects: { discernimento: 5, fe: 2 }
      },
      {
        text: "Tentar contornar a feira por outro caminho",
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
      "Cristão e Fiel tentaram encontrar outro caminho, mas o Caminho Estreito passava pelo centro da Feira.",
      "\"Não há atalhos na jornada do peregrino\", disse Fiel. \"O Senhor nos dá força para enfrentar, não para fugir.\"",
      "Com essa convicção, os dois se prepararam para entrar na feira."
    ],
    choices: [
      {
        text: "Entrar na feira juntos, fortalecidos pela convicção",
        nextChapterId: "feira-vaidade",
        consequence: "A coragem de enfrentar o inevitável é um sinal de maturidade.",
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
      "A Feira da Vaidade era um espetáculo de tentações. Vendedores ofereciam honras, prazeres, títulos e riquezas.",
      "Quando perguntaram o que desejavam, Cristão e Fiel responderam: \"Nós compramos a Verdade.\"",
      "A resposta causou tumulto. Foram espancados e presos.",
      "Fiel foi condenado e martirizado. Sua morte corajosa inspirou outros. Cristão escapou por providência divina.",
      "Com o coração pesado, mas fortalecido pelo exemplo de Fiel, Cristão sabia que a jornada deveria continuar."
    ],
    adaptiveNarrative: [
      { minAttr: "coragem", minValue: 20, text: "A coragem de Cristão durante o julgamento foi tão evidente que até alguns dos guardas sentiram vergonha do que faziam." },
      { minAttr: "fe", minValue: 30, text: "A fé inabalável de Cristão transformou a prisão em altar. Ele cantava hinos mesmo acorrentado, e as paredes pareciam tremer." }
    ],
    choices: [
      {
        text: "Honrar a memória de Fiel e seguir em frente",
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
      "Cristão foi alcançado por Esperança — um jovem que, testemunhando a coragem de Fiel, decidiu seguir o Caminho Estreito.",
      "\"Se Fiel preferiu morrer a negar a Verdade, essa Verdade vale mais que tudo\", disse Esperança.",
      "Os dois caminharam juntos. Mas ao longe, podiam ver os contornos sombrios do Castelo da Dúvida."
    ],
    choices: [
      {
        text: "Manter-se no Caminho Estreito com disciplina",
        nextChapterId: "cidade-celestial",
        consequence: "A perseverança é a marca dos verdadeiros peregrinos.",
        effects: { perseveranca: 8, fe: 5, discernimento: 3 }
      },
      {
        text: "Tomar um atalho que parece mais fácil",
        nextChapterId: "castelo-duvida",
        consequence: "Os atalhos raramente levam aonde prometem.",
        effects: { coragem: 2 }
      },
      {
        text: "Consultar o pergaminho antes de decidir",
        nextChapterId: "cidade-celestial",
        consequence: "O pergaminho brilhou com uma luz suave, confirmando a direção do Caminho Estreito.",
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
      "O atalho levou Cristão e Esperança para as terras do Gigante Desespero, que os lançou nas masmorras.",
      "O Gigante os atormentou: \"Vocês nunca chegarão à Cidade Celestial. Morram aqui.\"",
      "Esperança manteve-se firme: \"Lembre-se de tudo que você já superou. Deus não nos trouxe até aqui para nos abandonar.\"",
      "Na calada da noite, Cristão lembrou-se da chave chamada Promessa, que abria qualquer fechadura do Castelo."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 35, text: "A fé de Cristão era tão forte que mesmo nas masmorras ele sentia paz. O Gigante, perplexo, não conseguia quebrar seu espírito." },
      { minAttr: "perseveranca", minValue: 20, text: "A perseverança acumulada ao longo da jornada sustentou Cristão nos dias mais escuros do calabouço." }
    ],
    choices: [
      {
        text: "Usar a chave da Promessa e fugir",
        nextChapterId: "cidade-celestial",
        consequence: "A experiência no Castelo ensinou o preço dos desvios.",
        effects: { fe: 5, discernimento: 5, perseveranca: 3 }
      },
      {
        text: "Enfrentar o Gigante com as palavras da Verdade",
        nextChapterId: "cidade-celestial",
        consequence: "O Gigante Desespero tremeu diante das palavras de fé. Suas correntes se partiram.",
        effects: { coragem: 10, fe: 8, perseveranca: 5 },
        requires: { coragem: 25, fe: 30 }
      }
    ]
  },

  // === MULTIPLE ENDINGS ===
  "cidade-celestial": {
    id: "cidade-celestial",
    title: "A Cidade Celestial",
    location: "Cidade Celestial",
    characters: ["cristao", "esperanca"],
    reflection: "r12",
    narrative: [
      "Cristão e Esperança chegaram às Montanhas Deleitosas. Pastores lhes mostraram, ao longe, os portões da Cidade Celestial brilhando como ouro.",
      "O último obstáculo era o Rio da Morte — profundo e sem ponte.",
      "\"Não tema\", disse Esperança. \"As águas são profundas ou rasas conforme a sua fé.\"",
      "Cristão lutou contra as ondas. Do outro lado, anjos o esperavam com trombetas e cânticos.",
      "Os portões se abriram. Cristão apresentou seu pergaminho, e as hostes celestiais proclamaram:",
      "\"Benditos os que lavam as suas vestiduras para que tenham direito à árvore da vida.\"",
      "Cristão entrou na presença do Rei, e todo peso ficou para trás — para sempre."
    ],
    choices: [],
    isEnding: true,
    endingType: "default"
  },

  "cidade-celestial-glorioso": {
    id: "cidade-celestial-glorioso",
    title: "Final Glorioso — O Peregrino de Fé Inabalável",
    location: "Cidade Celestial",
    characters: ["cristao", "esperanca"],
    reflection: "r12",
    narrative: [
      "Cristão e Esperança chegaram às Montanhas Deleitosas sob uma luz dourada que parecia reconhecê-los.",
      "O Rio da Morte se abriu diante deles, e Cristão caminhou sobre águas quase rasas — sua fé era tão profunda que o próprio rio se curvou.",
      "Anjos desceram em fileiras resplandecentes, cantando o nome de Cristão. Os portões da Cidade Celestial se abriram com um trovão de glória.",
      "O Rei em pessoa veio ao seu encontro: \"Bem-vindo, servo bom e fiel. Você caminhou com fé, coragem, discernimento e perseverança. Entre na alegria do seu Senhor.\"",
      "Uma coroa de ouro foi colocada sobre sua cabeça, e todas as hostes celestiais celebraram. Cada provação, cada escolha, cada lágrima — tudo convergiu neste momento de triunfo eterno."
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
      "Cristão chegou às margens do Rio da Morte com um coração tranquilo.",
      "As águas eram profundas, mas ele não temeu. O discernimento adquirido ao longo do caminho lhe mostrava que cada prova tinha sido preparação para este momento.",
      "Atravessou o rio com serenidade. No outro lado, um anjo o recebeu em silêncio e o guiou pelos portões.",
      "Dentro da Cidade, o Rei sorriu: \"Você buscou sabedoria acima de tudo. E a sabedoria o trouxe até aqui.\"",
      "Cristão recebeu um manto tecido com as lições de cada capítulo vivido — cada fio era uma escolha sábia."
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
      "Cristão chegou ao Rio da Morte coberto de cicatrizes — marcas de cada batalha, cada queda, cada desvio.",
      "As águas eram turbulentas e profundas. Cristão quase afundou, mas Esperança o segurou com firmeza: \"Não agora. Não depois de tudo.\"",
      "Com as últimas forças, Cristão alcançou a outra margem. Caiu de joelhos na areia dourada.",
      "Anjos o ergueram e o carregaram até o portão. Suas vestes estavam rasgadas, mas brilhavam com uma luz interior.",
      "O Rei o abraçou: \"Você caiu muitas vezes, mas nunca ficou no chão. Sua perseverança move montanhas. Bem-vindo, meu filho sofrido e fiel.\""
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
