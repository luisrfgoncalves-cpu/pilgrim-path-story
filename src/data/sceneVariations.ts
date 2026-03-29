import { PlayHistory } from '@/hooks/useStoryProgress';

export interface SceneVariation {
  /** Extra paragraph added to the scene */
  text: string;
  /** Condition to show this variation */
  condition: (ctx: VariationContext) => boolean;
}

export interface VariationContext {
  playthrough: number;
  history: PlayHistory;
  flags: Record<string, boolean>;
  visitedChapters: string[];
  attributes: { fe: number; perseveranca: number; discernimento: number; coragem: number };
}

/**
 * Scene variations keyed by chapter ID.
 * Each chapter can have multiple variations that appear based on player history.
 */
export const sceneVariations: Record<string, SceneVariation[]> = {

  // ── FASE 1 ──
  "cena1": [
    {
      text: "Algo sussurra no fundo da sua mente: \"Você já esteve aqui antes.\" O fardo parece... familiar.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "O livro se abre numa página diferente desta vez. As palavras brilham com uma intensidade que você não notou antes.",
      condition: (ctx) => ctx.playthrough >= 3,
    },
    {
      text: "Na última vez, você ignorou o chamado. O peso daquele erro ainda ecoa.",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.flags.includes('ignorou_inquietacao')),
    },
  ],

  "cena2": [
    {
      text: "Obstinado olha para você com desprezo renovado: \"Outra vez? Pensei que já tivesse aprendido.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "cena3": [
    {
      text: "Seu grito soa diferente agora — não é desespero cego, mas determinação afiada pela experiência.",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.attributes.fe >= 6,
    },
  ],

  "cena5": [
    {
      text: "Evangelista hesita ao vê-lo: \"Peregrino... seus olhos carregam a memória de caminhos já percorridos.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "\"Da última vez, você escolheu o atalho de Prudência Mundana\", diz Evangelista com pesar. \"Desta vez, preste atenção.\"",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.flags.includes('atalho_mundano')),
    },
  ],

  "cena7": [
    {
      text: "A Porta Estreita parece diferente. Marcas na madeira lembram mãos que a empurraram antes — suas mãos.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "cena11": [
    {
      text: "O pântano já não o surpreende. Você conhece o cheiro, a textura da lama. Mas saber o que vem não torna mais fácil.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Na travessia anterior, você quase se afogou. Desta vez, seus passos são mais firmes.",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.choicesMade > 10) && ctx.playthrough >= 2,
    },
  ],

  "cena15": [
    {
      text: "Ao pé da cruz, lágrimas diferentes escorrem — não de surpresa, mas de gratidão renovada. O fardo cai mais uma vez, e a graça nunca envelhece.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  // ── FASE 2 ──
  "fase2-cena1": [
    {
      text: "O Intérprete abre a porta e sorri: \"Ah, você voltou. Desta vez, talvez veja o que seus olhos não estavam prontos para ver.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "fase2-cena5": [
    {
      text: "O homem na gaiola de ferro o reconhece: \"Você... eu vi você passar antes. E mesmo assim, cá estou eu ainda.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  // ── FASE 3 ──
  "fase3-cena3": [
    {
      text: "Apolião ri com escárnio: \"De novo você? Pensei que a derrota anterior tivesse sido suficiente.\"",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.history.playthroughs.some(p => p.result !== 'complete'),
    },
    {
      text: "Apolião recua um passo ao vê-lo: \"Você... está diferente. Mais forte.\"",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.history.playthroughs.some(p => p.result === 'complete'),
    },
  ],

  "fase3-cena7": [
    {
      text: "No vale mais escuro, uma voz que não é sua sussurra: \"Você já sobreviveu a isto antes. E sobreviverá de novo.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  // ── FASE 4 ──
  "fase4-cena1": [
    {
      text: "A Feira da Vaidade fervilha como sempre. Mas desta vez, você reconhece os rostos dos vendedores. Suas armadilhas já não são surpresa.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "fase4-cena5": [
    {
      text: "\"Fiel morreu aqui na última vez\", pensa você. \"Desta vez, as coisas podem ser diferentes — ou talvez o martírio seja inevitável.\"",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.history.playthroughs.some(p => p.flags.includes('fiel_martir')),
    },
  ],

  // ── FASE 5 ──
  "fase5-cena1": [
    {
      text: "O Prado Agradável é tão sedutor quanto da última vez. Você sabe o que vem depois — mas saber não elimina a tentação.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "fase5-cena4": [
    {
      text: "O Gigante Desespero range os dentes: \"Outro que pensa que pode escapar? Quantas vezes precisa falhar para aprender?\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Seus dedos procuram no bolso. Sim — a Chave da Promessa. Desta vez, você lembra que ela está lá.",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.history.playthroughs.some(p => p.flags.includes('chave_promessa')),
    },
  ],

  // ── FASE 2 (novas cenas: Colina e Leões) ──
  "fase2-cena12": [
    {
      text: "A colina parece familiar. Seus pés conhecem essas pedras — porque você já as subiu antes.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Da última vez, você dormiu no caramanchão e perdeu o pergaminho. Desta vez, seus olhos ficam abertos.",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.flags.includes('dormiu_caramanchao')),
    },
  ],

  "fase2-cena14": [
    {
      text: "Os leões rugem, mas suas correntes brilham sob a luz. Você já passou por aqui — sabe que são inofensivos para quem mantém o centro.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "fase4-cena11b": [
    {
      text: "A mina de Demas brilha como da última vez. Mas agora você reconhece o brilho falso — prata que custa a alma.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Da última vez, a curiosidade te levou perto demais. A mina quase engoliu você.",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.flags.includes('cedeu_demas')),
    },
  ],

  // ── FASE 4 (novas cenas) ──
  "fase4-cena11": [
    {
      text: "Interesses sorri ao vê-lo: \"Ah, outro viajante pragmático! Sabia que voltaria a me encontrar.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Da última vez, você caiu no discurso de Interesses. Agora, suas palavras soam ocas.",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.flags.includes('cedeu_tentacao')),
    },
  ],

  "fase4-cena12": [
    {
      text: "Pequena-Fé jaz no caminho, ferido. Você reconhece o cenário — os ladrões Coração-Fraco, Desconfiança e Culpa.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Sua coragem anterior o prepara: desta vez, os ladrões hesitam ao vê-lo.",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.attributes.coragem >= 7,
    },
  ],

  // ── FASE 5 (novas cenas) ──
  "fase5-cena11": [
    {
      text: "O Lisonjeiro se aproxima, mas algo no seu olhar o faz hesitar. \"Você... já me viu antes?\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Os pastores das Montanhas Deleitosas avisaram sobre esse homem. Seu discernimento acende como uma chama.",
      condition: (ctx) => ctx.attributes.discernimento >= 7,
    },
  ],

  "fase5-cena12": [
    {
      text: "O Ser Resplandecente que os libertou da rede olha para você com reconhecimento: \"Não é a primeira vez que te resgato, peregrino.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "fase5-cena13": [
    {
      text: "A Terra Encantada sussurra convites ao sono. Mas a memória de jornadas passadas mantém seus olhos abertos — pelo menos por enquanto.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Esperançoso nota sua resistência: \"Você parece mais forte que da última vez. O sono não tem poder sobre quem já despertou.\"",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.attributes.perseveranca >= 8,
    },
  ],

  "fase5-cena14": [
    {
      text: "O País de Beulá se abre como um abraço. O perfume das flores é o mesmo, mas mais doce — porque agora você sabe o que significa.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "As árvores carregadas de frutos parecem se inclinar em sua direção. A terra reconhece quem já a visitou.",
      condition: (ctx) => ctx.playthrough >= 3,
    },
  ],

  // ── FASE 6 ──
  "fase6-cena1": [
    {
      text: "O rio se estende à sua frente. Da última vez, a travessia foi difícil. Mas a margem oposta brilha com uma luz que você reconhece — e que chama pelo seu nome.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "fase6-cena3": [
    {
      text: "À beira do rio, memórias de todas as jornadas se entrelaçam. Cada escolha, cada queda, cada vitória — tudo converge neste momento.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Esperançoso percebe lágrimas nos seus olhos: \"São lágrimas de quem já conhece estas águas. Elas não te afogarão.\"",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.result === 'complete'),
    },
  ],

  "fase6-cena9": [
    {
      text: "A cena de Ignorância se repete — e a cada vez que você a testemunha, o peso da graça se torna mais claro.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Você lembra: na primeira jornada, essa cena te chocou. Agora, ela te humilha. A diferença entre você e Ignorância não é mérito — é graça recebida.",
      condition: (ctx) => ctx.playthrough >= 3 && ctx.attributes.fe >= 7,
    },
  ],

  // ══════════════════════════════════════════
  // PARTE II — Scene Variations
  // ══════════════════════════════════════════

  "p2-cena1": [
    {
      text: "O sonho de Cristão é mais vívido desta vez. Ele fala diretamente a você: \"Não cometa meu erro. Traga todos.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "A carta do Rei contém uma frase que você não notou antes: \"O caminho é mais gentil para quem traz outros.\"",
      condition: (ctx) => ctx.playthrough >= 3,
    },
  ],

  "p2-cena2": [
    {
      text: "Misericórdia hesita menos desta vez. Ela sabe o que vem — e escolhe ir mesmo assim.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Da última vez, você hesitou em aceitar Misericórdia. A culpa daquela hesitação ainda pesa.",
      condition: (ctx) => ctx.history.playthroughs.some(p => p.flags.includes('hesitou_misericordia')),
    },
  ],

  "p2-cena3": [
    {
      text: "O pântano parece mais raso. As pedras de promessa que estavam submersas agora aparecem — como se alguém as tivesse limpado.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-cena4": [
    {
      text: "O portão se abre mais rápido desta vez. O guardião sorri: \"Ah, de novo. Eu esperava por você.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Desta vez, quando Misericórdia desmaia, você já sabe o que fazer. A experiência é uma forma de graça.",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.history.playthroughs.some(p => p.flags.includes('intercedeu_por_misericordia')),
    },
  ],

  "p2-fase2-cena1": [
    {
      text: "Grande-Coração olha para você com reconhecimento: \"Você parece alguém que já percorreu este caminho. Seus olhos conhecem a estrada.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase2-cena2": [
    {
      text: "Ao pé da Cruz, a experiência é diferente. Não é surpresa — é reencontro. A graça não envelhece.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase3-cena1": [
    {
      text: "O Vale da Humilhação está ainda mais florido. Os lírios parecem crescer com cada peregrino que passa.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase3-cena3": [
    {
      text: "O Gigante Maul parece menor desta vez. Ou talvez Grande-Coração pareça maior.",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.attributes.coragem >= 7,
    },
  ],

  "p2-fase3-cena4": [
    {
      text: "Gaio prepara um prato especial: \"Para os que retornam, sirvo o melhor vinho. A segunda visita merece celebração dobrada.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase4-cena3": [
    {
      text: "Valente-pela-Verdade limpa a espada e olha para você: \"Já nos vimos antes, não é? Há algo nos seus olhos que diz que você já conhece esta luta.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase5-cena2": [
    {
      text: "O Gigante Desespero parece mais fraco. Cada jornada que destrói seu castelo enfraquece a dúvida em todos os mundos.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Da última vez, a batalha foi mais difícil. Desta vez, Grande-Coração ataca com a certeza de quem já venceu.",
      condition: (ctx) => ctx.playthrough >= 2 && ctx.history.playthroughs.some(p => p.flags.includes('entrou_castelo_destruido')),
    },
  ],

  "p2-fase5-cena4": [
    {
      text: "As ruínas do castelo são mais completas. Cada jornada que o destrói torna mais difícil reconstruí-lo.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase6-cena1": [
    {
      text: "Firme levanta mais rápido ao ver o grupo. \"Vocês de novo? Desta vez, a oração foi mais curta. Madame Bolha está perdendo poder.\"",
      condition: (ctx) => ctx.playthrough >= 2,
    },
  ],

  "p2-fase6-cena5": [
    {
      text: "O rio é mais raso a cada travessia. A fé acumulada de todas as jornadas pavimenta o leito com pedras de promessa.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Cristão, do outro lado, sorri com o reconhecimento de quem já recebeu sua esposa antes: \"Outra vez, meu amor. E sempre.\"",
      condition: (ctx) => ctx.playthrough >= 3,
    },
  ],

  "p2-fase6-cena6": [
    {
      text: "Os portões se abrem antes mesmo de Cristã bater. O Rei já sabe que ela vem — e quantas vezes veio.",
      condition: (ctx) => ctx.playthrough >= 2,
    },
    {
      text: "Desta vez, ao entrar, Cristã percebe rostos de peregrinos de todas as suas jornadas passadas, celebrando juntos.",
      condition: (ctx) => ctx.playthrough >= 3 && ctx.attributes.fe >= 8,
    },
  ],
};

/**
 * Replay incentive messages shown on the Index page based on history.
 */
export const getReplayIncentive = (history: PlayHistory, playthrough: number): string | null => {
  if (playthrough <= 1) return null;

  const lastRun = history.playthroughs[history.playthroughs.length - 1];
  if (!lastRun) return null;

  // Specific incentives based on past performance
  if (lastRun.result === 'incomplete') {
    return "Sua última jornada foi interrompida. O caminho ainda está lá, esperando por você. Desta vez, pode ser diferente.";
  }

  if (lastRun.result === 'difficult') {
    return "Você completou a jornada, mas com cicatrizes profundas. Há caminhos que levam a menos dor — se você souber encontrá-los.";
  }

  if (lastRun.result === 'complete' && playthrough === 2) {
    return "Parabéns pela jornada completa! Mas sabia que há cenas secretas, diálogos ocultos e caminhos que só aparecem quando você já conhece a estrada?";
  }

  if (playthrough === 3) {
    return "Terceira peregrinação. Os personagens começam a reconhecê-lo. O caminho muda para quem já o percorreu.";
  }

  if (playthrough >= 4) {
    return `Peregrinação #${playthrough}. Você é um veterano do caminho. Cada retorno revela camadas que estavam ocultas nas primeiras jornadas.`;
  }

  return "Cada nova jornada revela algo que estava escondido. Os personagens reagem diferente, os caminhos se abrem de formas inesperadas.";
};

/**
 * Get unlockable content hints based on what the player hasn't seen yet.
 */
export const getUnlockableHints = (history: PlayHistory): string[] => {
  const hints: string[] = [];
  const allFlags = history.playthroughs.flatMap(p => p.flags);
  const uniqueFlags = new Set(allFlags);

  if (!uniqueFlags.has('chave_promessa')) {
    hints.push("🔑 Há uma chave escondida que pode mudar tudo no Castelo da Dúvida...");
  }
  if (!uniqueFlags.has('ajudou_fiel')) {
    hints.push("🤝 Fiel pode ter um destino diferente se você fizer as escolhas certas...");
  }
  if (!uniqueFlags.has('atalho_mundano')) {
    hints.push("🛤️ Há um atalho tentador que Prudência Mundana oferece. O que acontece se você aceitar?");
  }
  if (!uniqueFlags.has('enfrentou_apolion')) {
    hints.push("⚔️ Apolião pode ser enfrentado de mais de uma maneira...");
  }
  if (history.totalPlaythroughs < 3) {
    hints.push("🌟 Na terceira jornada, os personagens começam a reconhecê-lo e reagir diferente.");
  }

  return hints.slice(0, 3);
};
