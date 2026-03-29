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
  { id: "cristao", name: "Cristão", description: "Um homem comum que sente um peso invisível e parte em busca de respostas.", role: "Protagonista", unlockedAtChapter: "cena1" },
  { id: "evangelista", name: "Evangelista", description: "Alguém que aponta um caminho diferente. Surge quando você aceita buscar ajuda.", role: "Guia", unlockedAtChapter: "cena5" },
];

export const reflections: Reflection[] = [
  { id: "r1", title: "O Peso Invisível", text: "Todos carregamos algo que não conseguimos ver. Reconhecer esse peso é o primeiro passo.", verse: "Mateus 11:28 — \"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.\"", unlockedAtChapter: "cena1" },
  { id: "r2", title: "Ignorar Não Resolve", text: "Fingir que está tudo bem não faz o problema desaparecer. O peso só cresce.", verse: "Provérbios 28:13 — \"O que encobre as suas transgressões nunca prosperará.\"", unlockedAtChapter: "cena2" },
  { id: "r3", title: "O Despertar", text: "Perceber que algo está errado é doloroso, mas necessário.", verse: "João 8:32 — \"Conhecereis a verdade, e a verdade vos libertará.\"", unlockedAtChapter: "cena3" },
  { id: "r4", title: "O Caminho Estreito", text: "O caminho certo raramente é o mais fácil. Mas é o único que leva a algum lugar.", verse: "Mateus 7:14 — \"Estreita é a porta, e apertado o caminho que leva à vida.\"", unlockedAtChapter: "cena9" },
  { id: "r5", title: "Terreno Instável", text: "Há momentos em que o chão cede. A escolha é afundar ou pedir ajuda.", verse: "Salmos 40:2 — \"Tirou-me de um lago horrível, pôs os meus pés sobre uma rocha.\"", unlockedAtChapter: "cena11" },
  { id: "r6", title: "O Início da Jornada", text: "Sair da zona de conforto é o verdadeiro começo. A jornada começou.", verse: "Hebreus 11:8 — \"Pela fé Abraão obedeceu, indo para um lugar que havia de receber.\"", unlockedAtChapter: "cena15" },
];

export const chapterOrder = [
  "cena1", "cena2", "cena3", "cena4", "cena5",
  "cena6", "cena7", "cena8", "cena9", "cena10",
  "cena11", "cena12", "cena13", "cena14", "cena15",
  "fase2-cena1", "fase2-cena2", "fase2-cena3", "fase2-cena4", "fase2-cena5",
  "fase2-cena6", "fase2-cena7", "fase2-cena8", "fase2-cena9", "fase2-cena10",
  "fase2-cena11",
];

export const storyChapters: Record<string, StoryChapter> = {
  "cena1": {
    id: "cena1",
    title: "A Inquietação",
    location: "Cidade da Destruição",
    characters: ["cristao"],
    reflection: "r1",
    narrative: [
      "Você vive na Cidade da Destruição. Tudo parece normal, mas algo dentro de você está inquieto."
    ],
    choices: [
      {
        text: "Ignorar esse sentimento",
        nextChapterId: "cena2",
        effects: { fe: -1, discernimento: -1 }
      },
      {
        text: "Tentar entender o que está acontecendo",
        nextChapterId: "cena3",
        effects: { discernimento: 1 }
      }
    ]
  },

  "cena2": {
    id: "cena2",
    title: "O Peso Silencioso",
    location: "Cidade da Destruição",
    characters: ["cristao"],
    reflection: "r2",
    narrative: [
      "Você decide ignorar o incômodo. A vida continua, mas o peso parece crescer silenciosamente."
    ],
    choices: [
      {
        text: "Continuar ignorando",
        nextChapterId: "cena4",
        effects: { fe: -1 }
      },
      {
        text: "Começar a questionar",
        nextChapterId: "cena3",
        effects: { discernimento: 1 }
      }
    ]
  },

  "cena3": {
    id: "cena3",
    title: "O Despertar",
    location: "Cidade da Destruição",
    characters: ["cristao"],
    reflection: "r3",
    narrative: [
      "Você percebe que algo está errado. Um peso invisível começa a incomodar profundamente."
    ],
    choices: [
      {
        text: "Buscar ajuda",
        nextChapterId: "cena5",
        effects: { fe: 1 }
      },
      {
        text: "Tentar resolver sozinho",
        nextChapterId: "cena6",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "cena4": {
    id: "cena4",
    title: "O Fardo Insuportável",
    location: "Cidade da Destruição",
    characters: ["cristao"],
    narrative: [
      "O peso se torna insuportável. Você já não consegue fingir que está tudo bem."
    ],
    choices: [
      {
        text: "Admitir que precisa de ajuda",
        nextChapterId: "cena5",
        effects: { fe: 1 }
      },
      {
        text: "Continuar resistindo",
        nextChapterId: "cena6",
        effects: { coragem: -1 }
      }
    ]
  },

  "cena5": {
    id: "cena5",
    title: "O Encontro",
    location: "Cidade da Destruição",
    characters: ["cristao", "evangelista"],
    narrative: [
      "Você encontra alguém que aponta um caminho diferente. Ele diz que há uma saída."
    ],
    choices: [
      {
        text: "Ouvir atentamente",
        nextChapterId: "cena7",
        effects: { discernimento: 1 }
      },
      {
        text: "Desconfiar",
        nextChapterId: "cena6",
        effects: { fe: -1 }
      }
    ]
  },

  "cena6": {
    id: "cena6",
    title: "Sozinho no Peso",
    location: "Cidade da Destruição",
    characters: ["cristao"],
    narrative: [
      "Tentar sozinho se mostra difícil. O peso não diminui."
    ],
    choices: [
      {
        text: "Aceitar ajuda",
        nextChapterId: "cena7",
        effects: { fe: 1 }
      },
      {
        text: "Insistir sozinho",
        nextChapterId: "cena8",
        effects: { perseveranca: -1 }
      }
    ]
  },

  "cena7": {
    id: "cena7",
    title: "A Encruzilhada",
    location: "Fora da Cidade",
    characters: ["cristao"],
    reflection: "r4",
    narrative: [
      "Você vê dois caminhos: um fácil e outro estreito e difícil."
    ],
    choices: [
      {
        text: "Caminho fácil",
        nextChapterId: "cena8",
        effects: { discernimento: -1 }
      },
      {
        text: "Caminho estreito",
        nextChapterId: "cena9",
        effects: { fe: 2 }
      }
    ]
  },

  "cena8": {
    id: "cena8",
    title: "O Caminho Sem Destino",
    location: "Caminho Largo",
    characters: ["cristao"],
    narrative: [
      "O caminho fácil parece confortável, mas não leva a lugar algum."
    ],
    choices: [
      {
        text: "Voltar e escolher novamente",
        nextChapterId: "cena7",
        effects: { discernimento: 1 }
      },
      {
        text: "Continuar assim mesmo",
        nextChapterId: "cena10",
        effects: { fe: -1 }
      }
    ]
  },

  "cena9": {
    id: "cena9",
    title: "O Caminho Certo",
    location: "Caminho Estreito",
    characters: ["cristao"],
    narrative: [
      "O caminho estreito é difícil, mas você sente que está no rumo certo."
    ],
    choices: [
      {
        text: "Continuar",
        nextChapterId: "cena11",
        effects: { perseveranca: 1 }
      },
      {
        text: "Desistir",
        nextChapterId: "cena8",
        effects: { coragem: -1 }
      }
    ]
  },

  "cena10": {
    id: "cena10",
    title: "Perdido",
    location: "Caminho Largo",
    characters: ["cristao"],
    narrative: [
      "Você percebe que está perdido. O caminho fácil não resolve seu problema."
    ],
    choices: [
      {
        text: "Recomeçar",
        nextChapterId: "cena7",
        effects: { fe: 1 }
      }
    ]
  },

  "cena11": {
    id: "cena11",
    title: "Terreno Instável",
    location: "Pântano do Desânimo",
    characters: ["cristao"],
    reflection: "r5",
    narrative: [
      "O terreno começa a ficar instável. Você entra em uma área difícil de atravessar."
    ],
    choices: [
      {
        text: "Avançar com cuidado",
        nextChapterId: "cena12",
        effects: { discernimento: 1 }
      },
      {
        text: "Tentar atravessar rápido",
        nextChapterId: "cena13",
        effects: { coragem: 1 }
      }
    ]
  },

  "cena12": {
    id: "cena12",
    title: "Paciência no Lodo",
    location: "Pântano do Desânimo",
    characters: ["cristao"],
    narrative: [
      "O cuidado ajuda, mas o progresso é lento."
    ],
    choices: [
      {
        text: "Continuar com paciência",
        nextChapterId: "cena14",
        effects: { perseveranca: 1 }
      },
      {
        text: "Desanimar",
        nextChapterId: "cena13",
        effects: { fe: -1 }
      }
    ]
  },

  "cena13": {
    id: "cena13",
    title: "Afundando",
    location: "Pântano do Desânimo",
    characters: ["cristao"],
    narrative: [
      "Você começa a afundar. O terreno era mais perigoso do que parecia."
    ],
    choices: [
      {
        text: "Pedir ajuda",
        nextChapterId: "cena14",
        effects: { fe: 2 }
      },
      {
        text: "Tentar sair sozinho",
        nextChapterId: "cena15",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "cena14": {
    id: "cena14",
    title: "Não Está Sozinho",
    location: "Saída do Pântano",
    characters: ["cristao"],
    narrative: [
      "Você consegue sair da situação difícil e percebe que não está sozinho."
    ],
    choices: [
      {
        text: "Seguir em frente",
        nextChapterId: "cena15",
        effects: { fe: 1 }
      }
    ]
  },

  "cena15": {
    id: "cena15",
    title: "O Início da Jornada",
    location: "Além da Cidade",
    characters: ["cristao"],
    reflection: "r6",
    narrative: [
      "Você saiu da Cidade da Destruição. A jornada começou."
    ],
    choices: [
      {
        text: "Continuar jornada",
        nextChapterId: "fase2-cena1",
        effects: { fe: 1 }
      }
    ]
  },

  // === FASE 2: CASA DO INTÉRPRETE ===

  "fase2-cena1": {
    id: "fase2-cena1",
    title: "Uma Casa Diferente",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Após avançar no caminho, você encontra uma casa diferente. Há algo especial naquele lugar."
    ],
    choices: [
      {
        text: "Entrar",
        nextChapterId: "fase2-cena2",
        effects: { fe: 1 }
      },
      {
        text: "Ignorar e seguir",
        nextChapterId: "fase2-cena3",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena2": {
    id: "fase2-cena2",
    title: "O Anfitrião",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Um homem te recebe e diz que ali você verá coisas importantes para sua jornada."
    ],
    choices: [
      {
        text: "Ouvir com atenção",
        nextChapterId: "fase2-cena4",
        effects: { discernimento: 1 }
      },
      {
        text: "Duvidar do que vê",
        nextChapterId: "fase2-cena3",
        effects: { fe: -1 }
      }
    ]
  },

  "fase2-cena3": {
    id: "fase2-cena3",
    title: "Seguir Sem Entender",
    location: "Caminho Estreito",
    characters: ["cristao"],
    narrative: [
      "Você decide não entrar. Segue o caminho, mas sente que perdeu algo importante."
    ],
    choices: [
      {
        text: "Voltar e entrar",
        nextChapterId: "fase2-cena2",
        effects: { discernimento: 1 }
      },
      {
        text: "Continuar sem entender",
        nextChapterId: "fase2-cena6",
        effects: { fe: -1 }
      }
    ]
  },

  "fase2-cena4": {
    id: "fase2-cena4",
    title: "A Sala da Poeira",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Ele te leva a uma sala onde alguém tenta limpar o chão, mas a poeira só aumenta."
    ],
    choices: [
      {
        text: "Observar",
        nextChapterId: "fase2-cena5",
        effects: { discernimento: 1 }
      },
      {
        text: "Tentar ajudar",
        nextChapterId: "fase2-cena5",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "fase2-cena5": {
    id: "fase2-cena5",
    title: "A Lição da Água",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Quando água é lançada, a poeira se assenta. Você percebe que esforço sozinho não resolve tudo."
    ],
    choices: [
      {
        text: "Refletir sobre isso",
        nextChapterId: "fase2-cena6",
        effects: { discernimento: 2 }
      },
      {
        text: "Ignorar a lição",
        nextChapterId: "fase2-cena6",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena6": {
    id: "fase2-cena6",
    title: "O Fogo que Não Apaga",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Em outra sala, você vê um fogo sendo apagado, mas ele continua queimando."
    ],
    choices: [
      {
        text: "Investigar",
        nextChapterId: "fase2-cena7",
        effects: { discernimento: 1 }
      },
      {
        text: "Apenas observar",
        nextChapterId: "fase2-cena7",
        effects: {}
      }
    ]
  },

  "fase2-cena7": {
    id: "fase2-cena7",
    title: "O Segredo do Fogo",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Você descobre que há alguém alimentando o fogo por trás."
    ],
    choices: [
      {
        text: "Entender o significado",
        nextChapterId: "fase2-cena8",
        effects: { discernimento: 2 }
      },
      {
        text: "Não se aprofundar",
        nextChapterId: "fase2-cena8",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena8": {
    id: "fase2-cena8",
    title: "A Base Frágil",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Em outra sala, alguém tenta construir algo, mas a base não é firme."
    ],
    choices: [
      {
        text: "Avisar sobre a base",
        nextChapterId: "fase2-cena9",
        effects: { discernimento: 1 }
      },
      {
        text: "Deixar como está",
        nextChapterId: "fase2-cena9",
        effects: {}
      }
    ]
  },

  "fase2-cena9": {
    id: "fase2-cena9",
    title: "Fundamentos",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Você percebe que sem uma base correta, tudo desmorona."
    ],
    choices: [
      {
        text: "Aplicar isso à sua jornada",
        nextChapterId: "fase2-cena10",
        effects: { fe: 1 }
      },
      {
        text: "Ignorar",
        nextChapterId: "fase2-cena10",
        effects: {}
      }
    ]
  },

  "fase2-cena10": {
    id: "fase2-cena10",
    title: "Palavras Finais",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "O homem te diz que entender essas coisas é essencial para continuar."
    ],
    choices: [
      {
        text: "Agradecer",
        nextChapterId: "fase2-cena11",
        effects: { fe: 1 }
      },
      {
        text: "Permanecer indiferente",
        nextChapterId: "fase2-cena11",
        effects: {}
      }
    ]
  },

  "fase2-cena11": {
    id: "fase2-cena11",
    title: "Nova Compreensão",
    location: "Saída da Casa",
    characters: ["cristao"],
    narrative: [
      "Você sai da casa com uma nova compreensão. Sua jornada continua."
    ],
    choices: [],
    isEnding: true,
    endingType: "parte1"
  }
};

export const getChapter = (id: string): StoryChapter | undefined => storyChapters[id];
export const FIRST_CHAPTER_ID = "cena1";
