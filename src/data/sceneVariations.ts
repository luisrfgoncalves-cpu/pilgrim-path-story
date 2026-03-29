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

  // ── FASE 6 ──
  "fase6-cena1": [
    {
      text: "O rio se estende à sua frente. Da última vez, a travessia foi difícil. Mas a margem oposta brilha com uma luz que você reconhece — e que chama pelo seu nome.",
      condition: (ctx) => ctx.playthrough >= 2,
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
