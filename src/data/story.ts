export interface StoryChoice {
  text: string;
  nextChapterId: string;
  consequence?: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  location: string;
  narrative: string[];
  choices: StoryChoice[];
  isEnding?: boolean;
}

export const storyChapters: Record<string, StoryChapter> = {
  "inicio": {
    id: "inicio",
    title: "A Cidade da Destruição",
    location: "Cidade da Destruição",
    narrative: [
      "Cristão vivia na Cidade da Destruição, carregando um fardo pesado nas costas — o peso de seus pecados e angústias. Um dia, enquanto lia um livro antigo, descobriu que sua cidade seria consumida pelo fogo do céu.",
      "Atormentado por essa revelação, Cristão vagava pelos campos, chorando e clamando: \"O que devo fazer para ser salvo?\"",
      "Foi então que encontrou Evangelista, um homem sábio que apontou para uma luz distante brilhando além de um portão estreito. \"Siga aquela luz\", disse Evangelista. \"Ela o guiará ao caminho da salvação.\""
    ],
    choices: [
      {
        text: "Seguir a luz imediatamente, deixando tudo para trás",
        nextChapterId: "pantano-desanimo",
        consequence: "Sua fé o impulsiona adiante, mas o caminho não será fácil."
      },
      {
        text: "Tentar convencer sua família a ir junto",
        nextChapterId: "familia-recusa",
        consequence: "O amor pela família é nobre, mas nem todos ouvirão o chamado."
      }
    ]
  },

  "familia-recusa": {
    id: "familia-recusa",
    title: "A Recusa dos Amados",
    location: "Cidade da Destruição",
    narrative: [
      "Cristão correu para casa e implorou à sua esposa e filhos que fugissem com ele. Mas eles o olharam com descrença e preocupação.",
      "\"Você enlouqueceu!\", disseram. \"Esta cidade sempre esteve aqui. Nada vai acontecer.\" Vizinhos e amigos tentaram dissuadi-lo, chamando-o de tolo e fanático.",
      "Obstinado e Flexível, dois vizinhos, vieram até ele. Obstinado zombava de sua decisão. Flexível, porém, mostrou-se curioso sobre a jornada.",
      "Com o coração partido, mas determinado, Cristão sabia que precisava seguir em frente — com ou sem aqueles que amava."
    ],
    choices: [
      {
        text: "Partir com Flexível como companheiro",
        nextChapterId: "pantano-desanimo",
        consequence: "Um companheiro pode ser um conforto... ou uma provação."
      },
      {
        text: "Partir sozinho, confiando apenas na providência",
        nextChapterId: "pantano-desanimo-sozinho",
        consequence: "A solidão no caminho pode fortalecer ou enfraquecer."
      }
    ]
  },

  "pantano-desanimo": {
    id: "pantano-desanimo",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    narrative: [
      "Cristão e Flexível caminhavam animados quando, sem aviso, o chão cedeu sob seus pés. Afundaram em um pântano escuro e lodoso — o Pântano do Desânimo.",
      "O lodo parecia sugar suas forças. Cada passo era uma luta. Flexível, tomado de pânico, gritou: \"Isto é loucura! Eu volto para casa!\" — e com grande esforço, arrastou-se de volta para a margem de onde vieram.",
      "Cristão, porém, lutava para avançar, mas o fardo em suas costas o empurrava cada vez mais para baixo. A lama parecia feita de culpa, vergonha e dúvida.",
      "Quando tudo parecia perdido, uma mão firme estendeu-se. Era Socorro, enviado para ajudar os peregrinos naquele lugar terrível."
    ],
    choices: [
      {
        text: "Aceitar a mão de Socorro e seguir em frente",
        nextChapterId: "portao-estreito",
        consequence: "A humildade de aceitar ajuda revela sabedoria."
      },
      {
        text: "Tentar sair sozinho, provando sua força",
        nextChapterId: "pantano-orgulho",
        consequence: "O orgulho pode ser tão perigoso quanto o próprio pântano."
      }
    ]
  },

  "pantano-desanimo-sozinho": {
    id: "pantano-desanimo-sozinho",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    narrative: [
      "Sozinho no caminho, Cristão avançava com determinação quando o chão cedeu. O Pântano do Desânimo o engoliu sem misericórdia.",
      "Sem ninguém para ajudá-lo, o desespero crescia. O fardo nas costas o arrastava para baixo. Pensamentos sombrios sussurravam: \"Volte. Desista. Você não é digno deste caminho.\"",
      "Mas Cristão lembrou das palavras de Evangelista e da luz distante. Clamou por ajuda, e do nada surgiu Socorro, com braços fortes e palavras de encorajamento."
    ],
    choices: [
      {
        text: "Aceitar a ajuda e seguir renovado",
        nextChapterId: "portao-estreito",
        consequence: "Há força em reconhecer a própria fraqueza."
      }
    ]
  },

  "pantano-orgulho": {
    id: "pantano-orgulho",
    title: "O Peso do Orgulho",
    location: "Pântano do Desânimo",
    narrative: [
      "Cristão recusou a mão de Socorro. \"Eu consigo sozinho!\", disse, lutando contra o lodo com toda sua força.",
      "Cada movimento parecia afundá-lo mais. O fardo ficava mais pesado. Suas forças se esvaíam.",
      "Finalmente, exausto e humilhado, Cristão ergueu os olhos e viu Socorro ainda ali, esperando pacientemente com a mão estendida. Com lágrimas nos olhos, Cristão aceitou a ajuda.",
      "\"O orgulho\", disse Socorro gentilmente, \"é um fardo que você carrega por escolha. O Senhor do caminho deseja que você caminhe em humildade.\""
    ],
    choices: [
      {
        text: "Aprender com a lição e seguir humildemente",
        nextChapterId: "portao-estreito",
        consequence: "A lição do orgulho ficará gravada no coração."
      }
    ]
  },

  "portao-estreito": {
    id: "portao-estreito",
    title: "O Portão Estreito",
    location: "Portão Estreito",
    narrative: [
      "Após deixar o pântano para trás, Cristão avistou o Portão Estreito. Era menor do que imaginava — humilde e quase escondido entre muros altos.",
      "Diante do portão, um homem chamado Boa Vontade o esperava. \"Bata, e a porta se abrirá\", ele disse.",
      "Cristão bateu. A porta se abriu, e Boa Vontade o puxou para dentro com urgência. \"Entre rápido! Há inimigos que atiram flechas contra os que hesitam diante deste portão.\"",
      "Do outro lado, Cristão viu o Caminho Estreito estendendo-se diante dele — reto, cercado por muros de cada lado, subindo em direção a uma colina distante."
    ],
    choices: [
      {
        text: "Perguntar sobre o caminho antes de seguir",
        nextChapterId: "casa-interprete",
        consequence: "Conhecimento é um aliado precioso na jornada."
      },
      {
        text: "Seguir imediatamente pelo Caminho Estreito",
        nextChapterId: "cruz-fardo",
        consequence: "A urgência da jornada queima no coração."
      }
    ]
  },

  "casa-interprete": {
    id: "casa-interprete",
    title: "A Casa do Intérprete",
    location: "Casa do Intérprete",
    narrative: [
      "Boa Vontade orientou Cristão a visitar a Casa do Intérprete antes de prosseguir. Ali, Cristão foi guiado por várias salas, cada uma contendo uma visão que revelava verdades profundas.",
      "Na primeira sala, viu um retrato de um homem grave, com olhos erguidos ao céu e um livro nas mãos. \"Este\", disse o Intérprete, \"é o único homem autorizado a ser seu guia.\"",
      "Na segunda sala, viu um fogo ardendo contra uma parede. Um homem jogava água nele, mas as chamas só cresciam. Atrás da parede, outro homem alimentava o fogo com óleo secretamente. \"A graça de Deus\", explicou o Intérprete, \"mantém a obra viva no coração, mesmo quando o mundo tenta apagá-la.\"",
      "Cada sala revelava uma nova verdade, preparando Cristão para os desafios que viria a enfrentar."
    ],
    choices: [
      {
        text: "Continuar pelo caminho, fortalecido pelas visões",
        nextChapterId: "cruz-fardo",
        consequence: "As lições do Intérprete iluminarão os dias difíceis."
      }
    ]
  },

  "cruz-fardo": {
    id: "cruz-fardo",
    title: "A Cruz e a Libertação",
    location: "Colina da Cruz",
    narrative: [
      "Cristão subiu a colina com dificuldade, o fardo pesando cada vez mais. O suor escorria, as pernas tremiam, mas ele não parava.",
      "Então, no topo da colina, ele a viu — a Cruz. Alta, simples, poderosa.",
      "No momento em que seus olhos encontraram a Cruz, algo extraordinário aconteceu. As amarras do fardo se soltaram. O peso que carregara por toda a vida deslizou de suas costas e rolou colina abaixo, caindo em um sepulcro aberto, desaparecendo para sempre.",
      "Cristão caiu de joelhos, lágrimas de alegria banhando seu rosto. Três seres resplandecentes apareceram: o primeiro declarou que seus pecados estavam perdoados, o segundo lhe deu vestes novas e brilhantes, o terceiro colocou um selo em sua testa e lhe entregou um pergaminho selado.",
      "\"Este pergaminho\", disseram, \"é sua garantia. Apresente-o nos portões da Cidade Celestial.\""
    ],
    choices: [
      {
        text: "Seguir renovado pelo Caminho Estreito",
        nextChapterId: "vale-sombra",
        consequence: "A jornada continua, mas agora você caminha livre."
      }
    ]
  },

  "vale-sombra": {
    id: "vale-sombra",
    title: "O Vale da Sombra da Morte",
    location: "Vale da Sombra da Morte",
    narrative: [
      "O caminho desceu para um vale escuro e terrível. À direita, um fosso sem fundo. À esquerda, um pântano traiçoeiro. O caminho entre eles era tão estreito que cada passo exigia cuidado absoluto.",
      "Demônios sussurravam nas trevas. Chamas irrompiam do chão. Gritos ecoavam de lugares invisíveis. Cristão sentia medo como nunca antes.",
      "Vozes blasfemas sussurravam em seus ouvidos, e Cristão temeu que fossem seus próprios pensamentos. A escuridão era tão densa que ele mal podia ver seus próprios pés.",
      "No meio daquela noite sem fim, Cristão ouviu a voz de outro peregrino à frente, citando um salmo: \"Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum.\""
    ],
    choices: [
      {
        text: "Orar em voz alta e avançar com fé",
        nextChapterId: "fiel-encontro",
        consequence: "A oração é uma arma poderosa nas trevas."
      },
      {
        text: "Buscar o peregrino à frente para não estar só",
        nextChapterId: "fiel-encontro",
        consequence: "A comunhão entre peregrinos fortalece a caminhada."
      }
    ]
  },

  "fiel-encontro": {
    id: "fiel-encontro",
    title: "O Encontro com Fiel",
    location: "Saída do Vale",
    narrative: [
      "Quando a aurora finalmente rompeu as trevas do vale, Cristão viu à frente um homem caminhando com passo firme. Era Fiel, um antigo conhecido da Cidade da Destruição que também partira em busca da Cidade Celestial.",
      "Os dois se abraçaram e compartilharam suas histórias. Fiel contou sobre suas próprias provações — como enfrentou Descontentamento, Vergonha e a tentação de Adão Primeiro.",
      "\"O caminho é difícil\", disse Fiel, \"mas cada prova me ensinou que a graça é sempre suficiente.\"",
      "Juntos, os dois peregrinos seguiram fortalecidos, e logo avistaram no horizonte uma cidade brilhante sob o sol — a Feira da Vaidade."
    ],
    choices: [
      {
        text: "Entrar na Feira da Vaidade com cautela",
        nextChapterId: "feira-vaidade",
        consequence: "A prudência será necessária em um lugar de tantas tentações."
      },
      {
        text: "Tentar contornar a feira por outro caminho",
        nextChapterId: "feira-inevitavel",
        consequence: "Alguns caminhos não podem ser evitados."
      }
    ]
  },

  "feira-inevitavel": {
    id: "feira-inevitavel",
    title: "Sem Desvios",
    location: "Arredores da Feira da Vaidade",
    narrative: [
      "Cristão e Fiel tentaram encontrar um caminho alternativo, mas logo perceberam que o Caminho Estreito passava diretamente pelo centro da Feira da Vaidade.",
      "\"Não há atalhos na jornada do peregrino\", disse Fiel sabiamente. \"O Senhor nos dá força para enfrentar, não para fugir.\"",
      "Com essa convicção, os dois se prepararam para entrar na feira."
    ],
    choices: [
      {
        text: "Entrar na feira juntos, fortalecidos pela convicção",
        nextChapterId: "feira-vaidade",
        consequence: "A coragem de enfrentar o inevitável é um sinal de maturidade."
      }
    ]
  },

  "feira-vaidade": {
    id: "feira-vaidade",
    title: "A Feira da Vaidade",
    location: "Feira da Vaidade",
    narrative: [
      "A Feira da Vaidade era um espetáculo de cores, sons e tentações. Vendedores ofereciam de tudo: honras, prazeres, títulos, reinos, riquezas e até vidas.",
      "Quando os mercadores perguntaram o que desejavam comprar, Cristão e Fiel responderam: \"Nós compramos a Verdade.\"",
      "A resposta causou tumulto. Os comerciantes se enfureceram. Os peregrinos foram espancados, enlameados e presos em uma jaula para serem exibidos como loucos.",
      "Um julgamento injusto foi organizado. Fiel foi condenado e martirizado diante da multidão, mas sua morte corajosa inspirou outros na cidade. Cristão, por providência divina, conseguiu escapar.",
      "Com o coração pesado pela perda de seu amigo, mas fortalecido pelo exemplo de Fiel, Cristão sabia que a jornada deveria continuar."
    ],
    choices: [
      {
        text: "Honrar a memória de Fiel e seguir em frente",
        nextChapterId: "esperanca-encontro",
        consequence: "O sacrifício de Fiel não será em vão."
      }
    ]
  },

  "esperanca-encontro": {
    id: "esperanca-encontro",
    title: "Um Novo Companheiro",
    location: "Além da Feira da Vaidade",
    narrative: [
      "Após a Feira da Vaidade, Cristão foi alcançado por Esperança — um jovem que, testemunhando a coragem de Fiel, decidiu também seguir o Caminho Estreito.",
      "\"O que vi na feira mudou minha vida\", disse Esperança. \"Se Fiel preferiu morrer a negar a Verdade, então essa Verdade vale mais que tudo o que a feira oferece.\"",
      "Os dois caminharam juntos, partilhando histórias e fortalecendo-se mutuamente. Mas o caminho reservava mais provações.",
      "Diante deles, o Caminho Estreito seguia por terrenos difíceis. E ao longe, podiam ver os contornos sombrios do Castelo da Dúvida."
    ],
    choices: [
      {
        text: "Manter-se no Caminho Estreito com disciplina",
        nextChapterId: "cidade-celestial",
        consequence: "A perseverança é a marca dos verdadeiros peregrinos."
      },
      {
        text: "Tomar um atalho que parece mais fácil",
        nextChapterId: "castelo-duvida",
        consequence: "Os atalhos raramente levam aonde prometem."
      }
    ]
  },

  "castelo-duvida": {
    id: "castelo-duvida",
    title: "O Castelo da Dúvida",
    location: "Castelo da Dúvida",
    narrative: [
      "O atalho levou Cristão e Esperança direto para as terras do Gigante Desespero, que os capturou e os lançou nas masmorras do Castelo da Dúvida.",
      "Por dias, o Gigante os espancou e atormentou, sugerindo que acabassem com suas próprias vidas. \"Vocês nunca chegarão à Cidade Celestial\", rugia ele. \"Morram aqui e acabem com seu sofrimento.\"",
      "Esperança manteve-se firme: \"Lembre-se de tudo que você já superou — o Pântano, o Vale, a Feira. Deus não nos trouxe até aqui para nos abandonar.\"",
      "Na calada da noite, Cristão lembrou-se de algo: ele carregava uma chave chamada Promessa, que abria qualquer fechadura do Castelo da Dúvida. Com ela, abriram as portas e fugiram para a liberdade."
    ],
    choices: [
      {
        text: "Voltar ao Caminho Estreito, mais sábio e humilde",
        nextChapterId: "cidade-celestial",
        consequence: "A experiência no Castelo ensinou o preço dos desvios."
      }
    ]
  },

  "cidade-celestial": {
    id: "cidade-celestial",
    title: "A Cidade Celestial",
    location: "Cidade Celestial",
    narrative: [
      "Após muitas provações, Cristão e Esperança chegaram às Montanhas Deleitosas, onde pastores lhes mostraram, ao longe, os portões da Cidade Celestial brilhando como ouro sob o sol eterno.",
      "O último obstáculo era o Rio da Morte — profundo e sem ponte. Cristão sentiu o medo apertar seu coração enquanto as águas subiam ao seu redor.",
      "\"Não tema\", disse Esperança, segurando-o firme. \"As águas são profundas ou rasas conforme a sua fé no Rei da cidade.\"",
      "Lutando contra as ondas e os pensamentos sombrios, Cristão finalmente encontrou chão firme. Do outro lado, anjos resplandecentes os esperavam com trombetas e cânticos.",
      "Os portões da Cidade Celestial se abriram. Uma luz gloriosa envolveu tudo. Cristão apresentou seu pergaminho selado, e as hostes celestiais proclamaram:",
      "\"Benditos os que lavam as suas vestiduras para que tenham direito à árvore da vida e possam entrar na cidade pelas portas.\"",
      "Cristão entrou na presença do Rei, e todo peso, toda dor, toda lágrima ficou para trás — para sempre."
    ],
    choices: [],
    isEnding: true
  }
};

export const getChapter = (id: string): StoryChapter | undefined => {
  return storyChapters[id];
};

export const FIRST_CHAPTER_ID = "inicio";
