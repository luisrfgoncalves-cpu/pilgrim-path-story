export interface ChoiceEffect {
  fe?: number;
  perseveranca?: number;
  discernimento?: number;
  coragem?: number;
}

/** Conditional bonus/penalty applied on top of base effects */
export interface ConditionalEffect {
  /** Attribute to check */
  attr: keyof ChoiceEffect;
  /** Minimum value to trigger (if met, apply bonus; if not met, apply penalty) */
  threshold: number;
  /** Extra effects when player meets the threshold */
  bonus?: ChoiceEffect;
  /** Extra effects when player is below the threshold */
  penalty?: ChoiceEffect;
}

export interface StoryChoice {
  text: string;
  nextChapterId: string;
  consequence?: string;
  effects: ChoiceEffect;
  requires?: Partial<ChoiceEffect>;
  flag?: string;
  requiresFlag?: string;
  excludesFlag?: string;
  conditionalEffects?: ConditionalEffect[];
  /** Item granted when this choice is made */
  item?: string;
}

/** Tone variation: shows different text based on whether an attribute is high or low */
export interface ToneNarrative {
  attr: keyof ChoiceEffect;
  highThreshold: number;
  highText: string;
  lowThreshold: number;
  lowText: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  location: string;
  narrative: string[];
  adaptiveNarrative?: { minAttr: keyof ChoiceEffect; minValue: number; text: string }[];
  flagNarrative?: { flag: string; text: string }[];
  noFlagNarrative?: { flag: string; text: string }[];
  toneNarrative?: ToneNarrative[];
  /** Text shown only on replays (playthrough > 1) */
  replayNarrative?: string[];
  choices: StoryChoice[];
  isEnding?: boolean;
  endingType?: 'parte1' | 'final_good' | 'final_bad';
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
  "fase3-cena1", "fase3-cena2", "fase3-cena3", "fase3-cena4", "fase3-cena5",
  "fase3-cena6", "fase3-cena7", "fase3-cena8", "fase3-cena9", "fase3-cena10",
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
    replayNarrative: [
      "Você já esteve aqui antes. O peso é familiar. Mas desta vez, você sabe que há um caminho — e que suas escolhas fazem diferença."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Mesmo assim, há uma certeza silenciosa dentro de você. Você sabe que precisa agir.", lowThreshold: 3, lowText: "A dúvida te consome. Será que esse sentimento é real ou apenas medo?" }
    ],
    choices: [
      {
        text: "Ignorar esse sentimento",
        nextChapterId: "cena2",
        effects: { fe: -1, discernimento: -1 },
        flag: "ignorou_inquietacao"
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
    replayNarrative: [
      "Você já conhece essa encruzilhada. Da última vez, fez uma escolha. Desta vez, pode fazer outra."
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 6, highText: "Seu discernimento te permite ver além das aparências. O caminho fácil esconde armadilhas.", lowThreshold: 3, lowText: "Os dois parecem iguais. Você não consegue distinguir qual é melhor." },
      { attr: "coragem", highThreshold: 6, highText: "Algo dentro de você se inclina para o desafio. O difícil não te assusta.", lowThreshold: 3, lowText: "O medo te puxa para o caminho mais seguro. Será que vale arriscar?" }
    ],
    choices: [
      {
        text: "Caminho fácil",
        nextChapterId: "cena8",
        effects: { discernimento: -1 },
        flag: "escolheu_caminho_facil"
      },
      {
        text: "Caminho estreito",
        nextChapterId: "cena9",
        effects: { fe: 2 },
        flag: "escolheu_caminho_estreito",
        item: "pergaminho_verdade"
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
    toneNarrative: [
      { attr: "perseveranca", highThreshold: 6, highText: "Você já superou desafios antes. Seus pés encontram apoio onde outros escorregariam.", lowThreshold: 3, lowText: "Cada passo é um esforço enorme. Você se pergunta se deveria ter vindo até aqui." }
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
        effects: { fe: 2 },
        flag: "pediu_ajuda_pantano"
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
    replayNarrative: [
      "A casa é a mesma, mas você é diferente. O que descobrirá desta vez?"
    ],
    choices: [
      {
        text: "Entrar",
        nextChapterId: "fase2-cena2",
        effects: { fe: 1 },
        flag: "entrou_casa_interprete",
        item: "lampada_discernimento"
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
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Você sente que esse encontro não é por acaso. Sua fé te diz: ouça com atenção.", lowThreshold: 3, lowText: "Você desconfia. Será que esse homem realmente pode te ajudar?" },
      { attr: "discernimento", highThreshold: 6, highText: "Seus olhos percebem detalhes que outros não veriam. Há sabedoria neste lugar.", lowThreshold: 3, lowText: "Tudo parece confuso. Você mal consegue prestar atenção nas palavras dele." }
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
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "Você se lembra do pântano. Lá também precisou de ajuda. A lição se repete." },
      { flag: "escolheu_caminho_facil", text: "Você pensa no caminho fácil que escolheu antes. Talvez essa seja a diferença: entender, não apenas seguir." }
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
    flagNarrative: [
      { flag: "ignorou_inquietacao", text: "Você lembra que já ignorou algo importante antes. Dessa vez, presta mais atenção." }
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
    flagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "\"Você já fez a escolha difícil antes\", ele diz. \"Continue assim.\"" },
      { flag: "entrou_casa_interprete", text: "\"Foi sábio ter entrado aqui. Muitos passam direto e perdem o que é essencial.\"" }
    ],
    noFlagNarrative: [
      { flag: "entrou_casa_interprete", text: "Mesmo sem ter escolhido entrar de início, as lições chegaram até você." }
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
    choices: [
      {
        text: "Seguir em frente",
        nextChapterId: "fase3-cena1",
        effects: { fe: 1 }
      }
    ]
  },

  // === FASE 3: VALE DA HUMILHAÇÃO ===

  "fase3-cena1": {
    id: "fase3-cena1",
    title: "O Vale Escuro",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "O caminho desce para um vale escuro. O ambiente muda. Tudo parece mais pesado."
    ],
    replayNarrative: [
      "O vale é o mesmo. Mas as decisões que te trouxeram aqui são diferentes. O que mudará desta vez?"
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As lições da casa ecoam na sua mente. Você sabe que precisará delas aqui." }
    ],
    choices: [
      {
        text: "Continuar mesmo assim",
        nextChapterId: "fase3-cena2",
        effects: { coragem: 1 },
        flag: "enfrentou_vale"
      },
      {
        text: "Hesitar",
        nextChapterId: "fase3-cena2",
        effects: { fe: -1 }
      }
    ]
  },

  "fase3-cena2": {
    id: "fase3-cena2",
    title: "O Silêncio Perturbador",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "O silêncio do vale é perturbador. Você sente que está sendo observado."
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 7, highText: "Mas o silêncio não te intimida. Você já enfrentou coisas piores.", lowThreshold: 3, lowText: "Seu coração dispara. O silêncio parece gritar que você não deveria estar aqui." },
      { attr: "fe", highThreshold: 7, highText: "Uma paz inexplicável te acompanha, mesmo na escuridão.", lowThreshold: 3, lowText: "Você se sente completamente sozinho. Será que alguém sabe que você está aqui?" }
    ],
    choices: [
      {
        text: "Permanecer firme",
        nextChapterId: "fase3-cena3",
        effects: { fe: 1 }
      },
      {
        text: "Olhar para trás",
        nextChapterId: "fase3-cena3",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase3-cena3": {
    id: "fase3-cena3",
    title: "A Presença",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "Uma presença surge à sua frente. Algo tenta te impedir de continuar."
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 8, highText: "Você ergue a cabeça. Seja o que for, não vai te parar.", lowThreshold: 3, lowText: "Suas pernas tremem. Tudo dentro de você grita para fugir." }
    ],
    choices: [
      {
        text: "Enfrentar",
        nextChapterId: "fase3-cena4",
        effects: { coragem: 2 },
        flag: "enfrentou_presenca",
        item: "manto_coragem",
        conditionalEffects: [
          { attr: "fe", threshold: 8, bonus: { coragem: 1 }, penalty: { coragem: -1 } }
        ]
      },
      {
        text: "Evitar confronto",
        nextChapterId: "fase3-cena5",
        effects: { discernimento: -1 },
        conditionalEffects: [
          { attr: "coragem", threshold: 6, bonus: { fe: 1 }, penalty: { fe: -1 } }
        ]
      }
    ]
  },

  "fase3-cena4": {
    id: "fase3-cena4",
    title: "A Resistência",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "Você decide enfrentar. A resistência é forte, mas você não recua."
    ],
    adaptiveNarrative: [
      { minAttr: "perseveranca", minValue: 8, text: "Sua perseverança acumulada sustenta cada passo. A resistência parece menor." },
      { minAttr: "coragem", minValue: 3, text: "" }
    ],
    noFlagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "Sem a experiência do caminho difícil, a resistência parece esmagadora." }
    ],
    choices: [
      {
        text: "Persistir",
        nextChapterId: "fase3-cena6",
        effects: { perseveranca: 2 },
        conditionalEffects: [
          { attr: "perseveranca", threshold: 8, bonus: { perseveranca: 2, fe: 1 }, penalty: { perseveranca: -1 } }
        ]
      },
      {
        text: "Recuar",
        nextChapterId: "fase3-cena5",
        effects: { coragem: -2 }
      }
    ]
  },

  "fase3-cena5": {
    id: "fase3-cena5",
    title: "A Fraqueza",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "Ao evitar o confronto, o medo aumenta. A sensação de fraqueza cresce."
    ],
    choices: [
      {
        text: "Tentar recuperar a coragem",
        nextChapterId: "fase3-cena4",
        effects: { fe: 1 }
      },
      {
        text: "Continuar evitando",
        nextChapterId: "fase3-cena7",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase3-cena6": {
    id: "fase3-cena6",
    title: "Força Além de Você",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "Mesmo sob pressão, você se mantém firme. A força vem de algo além de você."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 8, text: "Sua fé acumulada brilha neste momento. A força parece mais acessível." }
    ],
    choices: [
      {
        text: "Confiar",
        nextChapterId: "fase3-cena8",
        effects: { fe: 2 },
        conditionalEffects: [
          { attr: "fe", threshold: 10, bonus: { fe: 2, perseveranca: 1 }, penalty: { fe: -1 } }
        ]
      },
      {
        text: "Duvidar",
        nextChapterId: "fase3-cena7",
        effects: { fe: -1 },
        conditionalEffects: [
          { attr: "fe", threshold: 5, bonus: {}, penalty: { coragem: -1 } }
        ]
      }
    ]
  },

  "fase3-cena7": {
    id: "fase3-cena7",
    title: "A Dúvida",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "A dúvida começa a dominar. O caminho parece incerto."
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "Você lembra que já escolheu o caminho difícil antes. Conseguiu. Pode conseguir de novo." }
    ],
    choices: [
      {
        text: "Reafirmar decisão",
        nextChapterId: "fase3-cena6",
        effects: { discernimento: 1 }
      },
      {
        text: "Se entregar ao medo",
        nextChapterId: "fase3-cena9",
        effects: { fe: -2 }
      }
    ]
  },

  "fase3-cena8": {
    id: "fase3-cena8",
    title: "A Presença Recua",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "A presença que te ameaçava recua. Você percebe que resistir fez diferença."
    ],
    choices: [
      {
        text: "Seguir adiante",
        nextChapterId: "fase3-cena10",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "fase3-cena9": {
    id: "fase3-cena9",
    title: "Paralisado",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "O medo paralisa você. Avançar parece impossível."
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "Você se lembra: no pântano, pedir ajuda salvou você. Talvez seja hora de confiar novamente." }
    ],
    choices: [
      {
        text: "Buscar força",
        nextChapterId: "fase3-cena6",
        effects: { fe: 1 },
        conditionalEffects: [
          { attr: "perseveranca", threshold: 7, bonus: { coragem: 2 }, penalty: {} }
        ]
      },
      {
        text: "Permanecer parado",
        nextChapterId: "fase3-cena9",
        effects: { coragem: -1 },
        conditionalEffects: [
          { attr: "fe", threshold: 4, bonus: {}, penalty: { fe: -1 } }
        ]
      }
    ]
  },

  "fase3-cena10": {
    id: "fase3-cena10",
    title: "Transformado",
    location: "Saída do Vale",
    characters: ["cristao"],
    narrative: [
      "Você sai do vale mais forte do que entrou. Algo mudou dentro de você."
    ],
    flagNarrative: [
      { flag: "enfrentou_presenca", text: "Você enfrentou o que tentou te parar. Essa coragem agora faz parte de quem você é." }
    ],
    choices: [
      {
        text: "Seguir em frente",
        nextChapterId: "fase4-cena1",
        effects: { perseveranca: 1 }
      }
    ]
  },

  // ========== FASE 4: FEIRA DA VAIDADE ==========

  "fase4-cena1": {
    id: "fase4-cena1",
    title: "A Feira",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Você chega a um lugar movimentado. Pessoas, ofertas e distrações estão por toda parte."
    ],
    replayNarrative: [
      "A feira continua a mesma — barulhenta, sedutora. Mas você já sabe o que ela esconde. Ou será que sabe?"
    ],
    flagNarrative: [
      { flag: "enfrentou_vale", text: "Depois do vale escuro, a luz e o barulho da feira são quase um alívio — mas algo parece errado." }
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Com olhos atentos, você percebe que cada oferta aqui tem um preço oculto.", lowThreshold: 3, lowText: "Tudo parece fascinante. É difícil não se deixar levar pela energia do lugar." },
      { attr: "fe", highThreshold: 7, highText: "Sua fé te mantém centrado. Você sabe por que está aqui.", lowThreshold: 3, lowText: "Você se questiona: será que o que busca realmente vale mais que tudo isso?" }
    ],
    noFlagNarrative: [
      { flag: "enfrentou_vale", text: "O contraste com o caminho anterior é impressionante. A feira pulsa com vida e energia." }
    ],
    choices: [
      {
        text: "Observar com cuidado",
        nextChapterId: "fase4-cena2",
        effects: { discernimento: 1 },
        flag: "observou_feira",
        conditionalEffects: [
          { attr: "discernimento", threshold: 6, bonus: { discernimento: 1 }, penalty: {} }
        ]
      },
      {
        text: "Se envolver",
        nextChapterId: "fase4-cena3",
        effects: { fe: -1 },
        flag: "envolveu_feira"
      }
    ]
  },

  "fase4-cena2": {
    id: "fase4-cena2",
    title: "A Armadilha Disfarçada",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Você percebe que tudo ali tenta desviar sua atenção do caminho."
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "Ter escolhido o caminho estreito antes te ajuda a ver: este lugar é feito para quem busca atalhos." }
    ],
    choices: [
      {
        text: "Permanecer atento",
        nextChapterId: "fase4-cena4",
        effects: { fe: 1 }
      },
      {
        text: "Relaxar",
        nextChapterId: "fase4-cena3",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase4-cena3": {
    id: "fase4-cena3",
    title: "Envolvido",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Você começa a se distrair. O ambiente é envolvente e difícil de resistir."
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 8, text: "Mesmo assim, algo dentro de você resiste. Sua fé é forte demais para ceder facilmente." }
    ],
    choices: [
      {
        text: "Continuar",
        nextChapterId: "fase4-cena5",
        effects: { fe: -1 }
      },
      {
        text: "Tentar sair",
        nextChapterId: "fase4-cena4",
        effects: { coragem: 1 }
      }
    ]
  },

  "fase4-cena4": {
    id: "fase4-cena4",
    title: "Foco Mantido",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Você decide manter o foco, mesmo com tudo ao redor tentando te puxar."
    ],
    flagNarrative: [
      { flag: "enfrentou_presenca", text: "Você já enfrentou algo muito pior no vale. A feira não se compara àquela escuridão." }
    ],
    choices: [
      {
        text: "Seguir firme",
        nextChapterId: "fase4-cena6",
        effects: { perseveranca: 1 },
        conditionalEffects: [
          { attr: "perseveranca", threshold: 7, bonus: { fe: 1 }, penalty: {} }
        ]
      },
      {
        text: "Questionar sua decisão",
        nextChapterId: "fase4-cena5",
        effects: { fe: -1 }
      }
    ]
  },

  "fase4-cena5": {
    id: "fase4-cena5",
    title: "Pressão Social",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "A pressão aumenta. Pessoas começam a notar que você não pertence àquele lugar."
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 7, highText: "Você sustenta o olhar deles. Não vai se esconder.", lowThreshold: 3, lowText: "Você abaixa a cabeça. A vontade de desaparecer é quase insuportável." }
    ],
    noFlagNarrative: [
      { flag: "observou_feira", text: "Sem ter observado com cuidado antes, é difícil entender o que está acontecendo ao redor." }
    ],
    choices: [
      {
        text: "Se adaptar",
        nextChapterId: "fase4-cena7",
        effects: { discernimento: -1 }
      },
      {
        text: "Permanecer diferente",
        nextChapterId: "fase4-cena6",
        effects: { coragem: 2 },
        flag: "permaneceu_diferente",
        item: "pedra_memorial",
        conditionalEffects: [
          { attr: "coragem", threshold: 6, bonus: { perseveranca: 1 }, penalty: {} }
        ]
      }
    ]
  },

  "fase4-cena6": {
    id: "fase4-cena6",
    title: "Resistência",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Você mantém sua posição. Isso chama atenção e gera resistência ao seu redor."
    ],
    flagNarrative: [
      { flag: "permaneceu_diferente", text: "Sua decisão de permanecer diferente não passou despercebida. Alguns olham com desprezo, outros com admiração." }
    ],
    choices: [
      {
        text: "Continuar",
        nextChapterId: "fase4-cena8",
        effects: { fe: 1 }
      },
      {
        text: "Recuar",
        nextChapterId: "fase4-cena7",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase4-cena7": {
    id: "fase4-cena7",
    title: "Afastamento",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Ao tentar se adaptar, você sente que está se afastando do propósito."
    ],
    adaptiveNarrative: [
      { minAttr: "discernimento", minValue: 7, text: "Seu discernimento grita: isso não é quem você é. Ainda há tempo de voltar." }
    ],
    choices: [
      {
        text: "Retornar ao caminho",
        nextChapterId: "fase4-cena6",
        effects: { fe: 1 }
      },
      {
        text: "Permanecer assim",
        nextChapterId: "fase4-cena9",
        effects: { fe: -2 }
      }
    ]
  },

  "fase4-cena8": {
    id: "fase4-cena8",
    title: "O Custo",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "A oposição aumenta. Você percebe que manter sua posição tem um custo."
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As lições do Intérprete ecoam: o caminho verdadeiro nunca foi fácil. Mas vale a pena." }
    ],
    choices: [
      {
        text: "Aceitar o custo",
        nextChapterId: "fase4-cena10",
        effects: { perseveranca: 2 },
        flag: "aceitou_custo_feira",
        conditionalEffects: [
          { attr: "fe", threshold: 6, bonus: { coragem: 1 }, penalty: { coragem: -1 } }
        ]
      },
      {
        text: "Evitar conflito",
        nextChapterId: "fase4-cena7",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase4-cena9": {
    id: "fase4-cena9",
    title: "Perdido",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Você se perde entre as distrações. O caminho já não é claro."
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, você aprendeu a pedir ajuda. Talvez seja hora de fazer isso novamente." }
    ],
    choices: [
      {
        text: "Recomeçar foco",
        nextChapterId: "fase4-cena6",
        effects: { discernimento: 1 }
      },
      {
        text: "Permanecer perdido",
        nextChapterId: "fase4-cena9",
        effects: {}
      }
    ]
  },

  "fase4-cena10": {
    id: "fase4-cena10",
    title: "Firme na Jornada",
    location: "Saída da Feira",
    characters: ["cristao"],
    narrative: [
      "Mesmo sob pressão, você permanece firme. Isso fortalece sua jornada."
    ],
    flagNarrative: [
      { flag: "aceitou_custo_feira", text: "Aceitar o custo foi difícil, mas te transformou. Você sai da feira mais forte e mais decidido." }
    ],
    choices: [
      {
        text: "Seguir em frente",
        nextChapterId: "fase5-cena1",
        effects: { fe: 1 }
      }
    ]
  },

  // ========== FASE 5: CASTELO DA DÚVIDA ==========

  "fase5-cena1": {
    id: "fase5-cena1",
    title: "O Erro",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Após um caminho aparentemente mais fácil, você percebe que tomou uma decisão errada."
    ],
    replayNarrative: [
      "O castelo te prendeu antes. Desta vez, você sabe o que espera — mas será que isso é suficiente?"
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Seu discernimento grita: você sabia que algo estava errado, mas ignorou os sinais.", lowThreshold: 3, lowText: "Você nem consegue entender onde errou. Tudo parece confuso demais." }
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_facil", text: "Não é a primeira vez que o caminho fácil te engana. A lição se repete." }
    ],
    choices: [
      {
        text: "Reconhecer o erro",
        nextChapterId: "fase5-cena2",
        effects: { discernimento: 1 },
        flag: "reconheceu_erro_castelo"
      },
      {
        text: "Ignorar",
        nextChapterId: "fase5-cena3",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase5-cena2": {
    id: "fase5-cena2",
    title: "Sem Volta",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Você tenta voltar, mas já está longe demais. O caminho se torna confuso."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Mesmo perdido, uma voz interior te diz: há saída. Sempre há.", lowThreshold: 3, lowText: "O pânico começa a crescer. Você não sabe mais o que fazer." }
    ],
    choices: [
      {
        text: "Procurar saída",
        nextChapterId: "fase5-cena4",
        effects: { fe: 1 }
      },
      {
        text: "Desanimar",
        nextChapterId: "fase5-cena3",
        effects: { fe: -1 }
      }
    ]
  },

  "fase5-cena3": {
    id: "fase5-cena3",
    title: "A Dúvida Cresce",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "A dúvida começa a crescer. Você já não tem certeza de onde está."
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 6, highText: "Mas algo dentro de você se recusa a parar. Você já passou por coisas piores.", lowThreshold: 3, lowText: "Cada sombra parece uma ameaça. O medo é seu companheiro constante agora." }
    ],
    flagNarrative: [
      { flag: "enfrentou_presenca", text: "No vale, você enfrentou algo muito mais assustador. Isso te dá uma faísca de coragem." }
    ],
    choices: [
      {
        text: "Continuar mesmo sem certeza",
        nextChapterId: "fase5-cena4",
        effects: { coragem: 1 }
      },
      {
        text: "Parar",
        nextChapterId: "fase5-cena5",
        effects: { perseveranca: -1 }
      }
    ]
  },

  "fase5-cena4": {
    id: "fase5-cena4",
    title: "Aprisionado",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Um lugar fechado surge à frente. Antes que perceba, você está preso."
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Você analisa as paredes, a porta, os detalhes. Deve haver uma lógica aqui.", lowThreshold: 3, lowText: "Tudo parece igual. Paredes, escuridão, silêncio. Você não sabe por onde começar." }
    ],
    choices: [
      {
        text: "Tentar entender a situação",
        nextChapterId: "fase5-cena6",
        effects: { discernimento: 1 },
        conditionalEffects: [
          { attr: "discernimento", threshold: 6, bonus: { fe: 1 }, penalty: {} }
        ]
      },
      {
        text: "Entrar em desespero",
        nextChapterId: "fase5-cena5",
        effects: { fe: -2 }
      }
    ]
  },

  "fase5-cena5": {
    id: "fase5-cena5",
    title: "Desespero",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "O desespero domina. Pensamentos negativos começam a surgir."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 6, highText: "Mas no fundo, uma chama ainda resiste. Você sabe que já superou momentos assim.", lowThreshold: 3, lowText: "A escuridão interior é pior que a exterior. Você se sente completamente abandonado." },
      { attr: "perseveranca", highThreshold: 6, highText: "Sua persistência te impede de desistir completamente. Ainda há luta dentro de você.", lowThreshold: 3, lowText: "Você está exausto. A vontade de desistir é quase irresistível." }
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, a ajuda veio quando você pediu. Talvez não esteja tão sozinho quanto pensa." }
    ],
    choices: [
      {
        text: "Lutar contra isso",
        nextChapterId: "fase5-cena6",
        effects: { fe: 1 },
        conditionalEffects: [
          { attr: "fe", threshold: 5, bonus: { coragem: 1 }, penalty: { coragem: -1 } }
        ]
      },
      {
        text: "Se entregar",
        nextChapterId: "fase5-cena7",
        effects: { fe: -2 }
      }
    ]
  },

  "fase5-cena6": {
    id: "fase5-cena6",
    title: "Reflexão",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Mesmo preso, você começa a refletir sobre tudo que aprendeu até aqui."
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "As lições do caminho ganham novo significado. Você começa a ver um padrão.", lowThreshold: 3, lowText: "Você tenta lembrar, mas tudo parece distante e desconexo." }
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As visões do Intérprete voltam à sua mente: a poeira, o fogo, a perseverança. Tudo faz sentido agora." },
      { flag: "reconheceu_erro_castelo", text: "Reconhecer o erro foi o primeiro passo. Agora você precisa encontrar o próximo." }
    ],
    choices: [
      {
        text: "Relembrar ensinamentos",
        nextChapterId: "fase5-cena8",
        effects: { discernimento: 2 },
        conditionalEffects: [
          { attr: "perseveranca", threshold: 7, bonus: { fe: 1 }, penalty: {} }
        ]
      },
      {
        text: "Focar no problema",
        nextChapterId: "fase5-cena7",
        effects: { fe: -1 }
      }
    ]
  },

  "fase5-cena7": {
    id: "fase5-cena7",
    title: "Sem Saída",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "A dúvida aumenta. A saída parece impossível."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Mas impossível não é o mesmo que sem esperança. Você ainda acredita.", lowThreshold: 2, lowText: "Você não acredita mais em nada. O castelo venceu?" }
    ],
    choices: [
      {
        text: "Buscar esperança",
        nextChapterId: "fase5-cena6",
        effects: { fe: 1 }
      },
      {
        text: "Permanecer assim",
        nextChapterId: "fase5-cena7",
        effects: {}
      }
    ]
  },

  "fase5-cena8": {
    id: "fase5-cena8",
    title: "A Chave",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Você percebe que a saída não depende da situação, mas da sua decisão."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "A clareza é absoluta. Você sempre teve o que precisava. Só faltava decidir.", lowThreshold: 3, lowText: "A ideia é frágil, mas é tudo que você tem. Talvez seja suficiente." }
    ],
    flagNarrative: [
      { flag: "aceitou_custo_feira", text: "Na feira, você aceitou o custo. Aqui, a decisão é parecida: agir apesar da incerteza." }
    ],
    choices: [
      {
        text: "Agir com fé",
        nextChapterId: "fase5-cena9",
        effects: { fe: 2 },
        flag: "escapou_castelo_fe",
        item: "chave_promessa",
        conditionalEffects: [
          { attr: "fe", threshold: 6, bonus: { perseveranca: 2 }, penalty: {} }
        ]
      },
      {
        text: "Hesitar",
        nextChapterId: "fase5-cena7",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase5-cena9": {
    id: "fase5-cena9",
    title: "A Saída",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Você encontra uma saída que antes não conseguia ver."
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 6, highText: "Sem hesitar, você avança. A luz do lado de fora nunca pareceu tão real.", lowThreshold: 3, lowText: "Com as mãos tremendo, você se arrasta em direção à luz. Cada passo é uma vitória." }
    ],
    choices: [
      {
        text: "Sair imediatamente",
        nextChapterId: "fase5-cena10",
        effects: { coragem: 1 }
      }
    ]
  },

  "fase5-cena10": {
    id: "fase5-cena10",
    title: "A Lição",
    location: "Saída do Castelo",
    characters: ["cristao"],
    narrative: [
      "Você deixa o lugar com uma lição importante: decisões erradas têm consequências, mas é possível se recuperar."
    ],
    flagNarrative: [
      { flag: "escapou_castelo_fe", text: "A fé foi sua chave. Não a certeza, não a força — a fé. Isso muda tudo." },
      { flag: "reconheceu_erro_castelo", text: "Reconhecer o erro no início fez toda a diferença. Humildade abre portas que orgulho fecha." }
    ],
    choices: [
      {
        text: "Seguir em frente",
        nextChapterId: "fase6-cena1",
        effects: { perseveranca: 1 }
      }
    ]
  },

  // ========== FASE 6: RIO E CIDADE CELESTIAL ==========

  "fase6-cena1": {
    id: "fase6-cena1",
    title: "O Destino à Vista",
    location: "Rio e Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Após uma longa jornada, você avista o destino final. Mas ainda há um último desafio."
    ],
    replayNarrative: [
      "Você já viu a cidade antes — ou talvez nunca tenha chegado tão longe. De qualquer forma, este momento é diferente. Você é diferente."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "Seu coração se enche de expectativa. Tudo pelo que lutou está ali, do outro lado.", lowThreshold: 3, lowText: "Você olha para o destino sem conseguir acreditar. Será que merece chegar até lá?" },
      { attr: "perseveranca", highThreshold: 8, highText: "Cada cicatriz da jornada conta uma história. Você não desistiu. Chegou até aqui.", lowThreshold: 3, lowText: "A exaustão é quase insuportável. Suas pernas mal sustentam o peso do caminho percorrido." }
    ],
    flagNarrative: [
      { flag: "escapou_castelo_fe", text: "Depois do castelo, você aprendeu: a fé abre caminhos que os olhos não veem." },
      { flag: "enfrentou_presenca", text: "Você enfrentou a escuridão no vale. O que resta agora é a luz." }
    ],
    choices: [
      {
        text: "Avançar com confiança",
        nextChapterId: "fase6-cena2",
        effects: { fe: 1 },
        flag: "avancou_confiante_rio"
      },
      {
        text: "Sentir medo",
        nextChapterId: "fase6-cena2",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase6-cena2": {
    id: "fase6-cena2",
    title: "O Rio",
    location: "Rio e Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Um rio bloqueia o caminho. Não há ponte. É necessário atravessar."
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 7, highText: "Você olha para a água sem medo. Já enfrentou coisas piores.", lowThreshold: 3, lowText: "A correnteza parece furiosa. Tudo dentro de você grita para não entrar." }
    ],
    choices: [
      {
        text: "Entrar no rio",
        nextChapterId: "fase6-cena3",
        effects: { fe: 2 },
        flag: "entrou_rio",
        conditionalEffects: [
          { attr: "fe", threshold: 8, bonus: { coragem: 2 }, penalty: {} }
        ]
      },
      {
        text: "Hesitar",
        nextChapterId: "fase6-cena4",
        effects: { fe: -1 }
      }
    ]
  },

  "fase6-cena3": {
    id: "fase6-cena3",
    title: "A Travessia",
    location: "Rio e Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Ao entrar no rio, você sente dificuldade. A travessia exige tudo de você."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "Mas cada passo na água te aproxima. A fé sustenta onde os pés não alcançam.", lowThreshold: 3, lowText: "A água sobe. O medo é real. Você não sabe se vai conseguir." },
      { attr: "perseveranca", highThreshold: 8, highText: "Sua perseverança é como uma âncora. Você não veio até aqui para desistir agora.", lowThreshold: 3, lowText: "Seu corpo implora para parar. A jornada cobrou um preço alto demais." }
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, a ajuda veio. Aqui, no rio, você sabe: não está sozinho." },
      { flag: "aceitou_custo_feira", text: "Na feira, você pagou o preço. Aqui, o preço final é confiar." }
    ],
    choices: [
      {
        text: "Confiar até o fim",
        nextChapterId: "fase6-cena5",
        effects: { fe: 2 },
        flag: "confiou_rio",
        item: "selo_peregrino",
        conditionalEffects: [
          { attr: "fe", threshold: 7, bonus: { perseveranca: 2, coragem: 1 }, penalty: {} }
        ]
      },
      {
        text: "Duvidar",
        nextChapterId: "fase6-cena4",
        effects: { fe: -2 }
      }
    ]
  },

  "fase6-cena4": {
    id: "fase6-cena4",
    title: "A Dúvida Final",
    location: "Rio e Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "A dúvida torna a travessia mais difícil. O caminho parece desaparecer."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Mas lá no fundo, algo resiste. Uma faísca que se recusa a apagar.", lowThreshold: 2, lowText: "A escuridão é total. Você não consegue ver nada além da água." }
    ],
    choices: [
      {
        text: "Reafirmar sua decisão",
        nextChapterId: "fase6-cena3",
        effects: { fe: 1 }
      },
      {
        text: "Recuar",
        nextChapterId: "fase6-cena6",
        effects: { coragem: -2 }
      }
    ]
  },

  "fase6-cena5": {
    id: "fase6-cena5",
    title: "O Outro Lado",
    location: "Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Você atravessa o rio. Do outro lado, tudo muda. Há paz e clareza."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "A paz que te envolve é absoluta. Você sabe, com cada fibra do ser: valeu a pena.", lowThreshold: 4, lowText: "A paz te surpreende. Depois de tudo, você não esperava sentir algo assim." }
    ],
    choices: [
      {
        text: "Avançar",
        nextChapterId: "fase6-cena7",
        effects: {}
      }
    ]
  },

  "fase6-cena6": {
    id: "fase6-cena6",
    title: "A Jornada Interrompida",
    location: "Rio e Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Você não consegue atravessar. A jornada se interrompe antes do final."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Mas mesmo neste momento, algo te diz que haverá outra chance.", lowThreshold: 2, lowText: "O silêncio é ensurdecedor. A cidade brilha ao longe, inalcançável." }
    ],
    flagNarrative: [
      { flag: "reconheceu_erro_castelo", text: "No castelo, você aprendeu que erros podem ser corrigidos. Talvez essa lição se aplique aqui também." }
    ],
    choices: [],
    isEnding: true,
    endingType: "final_bad"
  },

  "fase6-cena7": {
    id: "fase6-cena7",
    title: "A Cidade Celestial",
    location: "Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Você vê a Cidade Celestial. O destino da jornada está diante de você."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "As portas se abrem como se estivessem te esperando. Você pertence a este lugar.", lowThreshold: 4, lowText: "Você mal acredita. Depois de tudo, chegou." }
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As lições do Intérprete ganham sentido pleno. Cada visão era um preparo para este momento." },
      { flag: "permaneceu_diferente", text: "Na feira, você se recusou a ser como todos. Agora, diante da cidade, sabe por quê." }
    ],
    choices: [
      {
        text: "Entrar",
        nextChapterId: "fase6-cena8",
        effects: {}
      }
    ]
  },

  "fase6-cena8": {
    id: "fase6-cena8",
    title: "O Fim da Jornada",
    location: "Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Você chega ao final da jornada. Suas decisões te trouxeram até aqui."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "Cada decisão de fé construiu a ponte que te trouxe até este momento. Não foi sorte — foi escolha.", lowThreshold: 4, lowText: "O caminho foi tortuoso, cheio de dúvidas. Mas você chegou. Isso basta." }
    ],
    choices: [],
    isEnding: true,
    endingType: "final_good"
  }
};

export const getChapter = (id: string): StoryChapter | undefined => storyChapters[id];
export const FIRST_CHAPTER_ID = "cena1";
