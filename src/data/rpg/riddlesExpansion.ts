import { Riddle } from './types';

// ═══════════════════════════════════════════════════════
// EXPANSÃO DE CHARADAS — LOTE 2
// Charadas adicionais com narrativas mais elaboradas
// ═══════════════════════════════════════════════════════

export const riddlesExpansion: Riddle[] = [
  // ═══════ APRENDIZ — EXPANSÃO ═══════
  {
    id: 'r-a-014', difficulty: 'aprendiz',
    context: 'Cristão saiu correndo da Cidade da Destruição gritando "Vida! Vida!"...',
    riddle: 'Quando saí, todos riram. Quando corri, me chamaram de louco. Mas os que ficaram... esses sim morreram. Quem sou eu e por que fugi?',
    hints: ['Sou o protagonista', 'Fugi de uma cidade condenada', 'A esposa de Ló também tinha que fugir'],
    answer: 'Cristão fugindo da Cidade da Destruição — porque sabia que ela seria destruída pelo julgamento de Deus',
    bibleReference: '2 Pedro 3:9-10',
    explanation: 'O mundo ri de quem busca a salvação. Mas "o dia do Senhor virá como ladrão." Quem foge para Deus não é louco — é sábio.',
    timerSeconds: 40,
  },
  {
    id: 'r-a-015', difficulty: 'aprendiz',
    context: 'No Palácio Belo, Cristão passou uma noite em um quarto especial...',
    riddle: 'Meu nome é Paz. Quem dorme em mim acorda sem medo. Tenho janela que aponta para o leste, onde o sol da justiça nasce. Onde estou?',
    hints: ['Sou um quarto no Palácio Belo', 'Meu nome é uma qualidade de Deus', 'Cristão dormiu em mim antes da batalha'],
    answer: 'O quarto chamado Paz no Palácio Belo — representando a paz de Deus que guarda nosso coração antes das batalhas',
    bibleReference: 'Filipenses 4:7',
    explanation: '"A paz de Deus, que excede todo o entendimento, guardará os vossos corações." Antes de enfrentar Apolion, Cristão descansou em Paz.',
    timerSeconds: 45,
  },
  {
    id: 'r-a-016', difficulty: 'aprendiz',
    context: 'Um personagem oferecia sempre caminhos mais fáceis e "sensatos"...',
    riddle: 'Meu conselho parece sábio, meu caminho parece lógico. Nunca menciono a cruz. Nunca falo de sofrimento. Ofereço religião sem dor. Quem sou?',
    hints: ['Meu nome tem a ver com sabedoria', 'Sou do mundo, não do céu', 'Enviei Cristão para um lugar errado'],
    answer: 'Sabedoria Mundana — que oferece moralidade sem Cristo, religião sem cruz',
    bibleReference: '1 Coríntios 1:18-25',
    explanation: '"A mensagem da cruz é loucura para os que se perdem." A sabedoria mundana evita a cruz — e por isso é a mais perigosa das tentações.',
    timerSeconds: 45,
  },

  // ═══════ PEREGRINO — EXPANSÃO ═══════
  {
    id: 'r-p-011', difficulty: 'peregrino',
    context: 'Um personagem tinha grande conhecimento, mas algo essencial faltava...',
    riddle: 'Sei tudo sobre Deus mas não conheço Deus. Falo de regeneração sem ser regenerado. Cito livros que nunca mudaram meu coração. Uma pergunta simples me desmascara. Quem sou eu e qual foi a pergunta?',
    hints: ['Meu nome descreve alguém que fala muito', 'Fiel me desmascarou', 'A pergunta era sobre prática, não teoria'],
    answer: 'Falador — e a pergunta foi: "Como a graça se manifesta na sua vida prática, no lar e nos negócios?"',
    bibleReference: 'Tiago 1:22',
    explanation: '"Sede praticantes da palavra e não somente ouvintes." Falador é o retrato da ortodoxia morta — sabe tudo, vive nada.',
    timerSeconds: 55,
  },
  {
    id: 'r-p-012', difficulty: 'peregrino',
    context: 'Dois personagens tinham muito em comum, mas destinos completamente opostos...',
    riddle: 'Caminhamos o mesmo caminho, cruzamos os mesmos vales, enfrentamos os mesmos gigantes. Mas um de nós entrou pela porta; o outro, pelo muro. Quando chegamos ao fim, um recebeu coroa; o outro, condenação. Quem somos?',
    hints: ['Somos Cristão e Ignorância', 'A diferença não é o caminho, mas a entrada', 'Jesus falou sobre entrar pela porta'],
    answer: 'Cristão (entrou pelo Portão Estreito) e Ignorância (entrou por atalho). Mesmo caminho aparente, destinos opostos — porque a ENTRADA importa tanto quanto a jornada.',
    bibleReference: 'Mateus 7:13-14',
    explanation: 'Bunyan ensina que não basta "estar no caminho." É preciso ter entrado PELO PORTÃO — pela fé genuína em Cristo, não por atalhos de moralidade.',
    timerSeconds: 60,
  },
  {
    id: 'r-p-013', difficulty: 'peregrino',
    context: 'Uma armadilha sutil quase capturou Cristão e Esperança perto do fim...',
    riddle: 'Minha rede é feita de palavras doces. Meu sorriso é minha arma. Digo o que vocês querem ouvir. Por fora sou guia; por dentro sou caçador. Provérbios me descreveu antes que Bunyan me criasse. Quem sou?',
    hints: ['Uso lisonja como armadilha', 'Provérbios 29:5 fala sobre mim', 'Capturei Cristão e Esperança em uma rede'],
    answer: 'O Lisonjeiro — que usa elogios e palavras agradáveis para desviar peregrinos do caminho correto',
    bibleReference: 'Provérbios 29:5',
    explanation: '"O homem que lisonjeia o próximo arma uma rede aos seus pés." Cuidado com quem só fala o que você quer ouvir — pode ser uma rede.',
    timerSeconds: 50,
  },

  // ═══════ VETERANO — EXPANSÃO ═══════
  {
    id: 'r-v-017', difficulty: 'veterano',
    context: 'Bunyan estruturou a jornada de Cristão em fases que espelham a ordem da salvação...',
    riddle: 'Sete estágios tem minha jornada: convicção (fardo), conversão (portão), iluminação (intérprete), libertação (cruz), armamento (palácio), combate (vale) e glorificação (cidade). Qual doutrina teológica minha jornada inteira ilustra, e quem a sistematizou?',
    hints: ['É uma sequência teológica latim', 'Os reformados a sistematizaram', 'Romanos 8:30 resume parte dela'],
    answer: 'A Ordo Salutis (Ordem da Salvação) sistematizada pelos teólogos reformados, especialmente por Turretini e depois por Charles Hodge. Bunyan a narrativizou para o povo.',
    bibleReference: 'Romanos 8:29-30',
    explanation: 'Bunyan transformou teologia acadêmica em narrativa popular. Cada fase de O Peregrino corresponde a um estágio da ordo salutis reformada.',
    timerSeconds: 90,
  },
  {
    id: 'r-v-018', difficulty: 'veterano',
    context: 'Cristão ouviu blasfêmias no Vale da Sombra e pensou que eram seus próprios pensamentos...',
    riddle: 'Sou pensamento que não é meu, mas parece ser. Causo horror em quem me ouve, mas esse horror é prova de inocência. Se eu não te incomodasse, aí sim haveria perigo. Lutero me chamou de Anfechtung. Bunyan me viveu por anos. O que sou teologicamente?',
    hints: ['Satanás me injeta na mente', 'Lutero sofreu comigo intensamente', 'Sou diferente de tentação comum'],
    answer: 'Anfechtung — o assalto espiritual onde Satanás planta pensamentos blasfemos na mente do crente para causar desespero. A angústia que causam é evidência de fé, não de apostasia.',
    bibleReference: 'Apocalipse 12:10',
    explanation: 'Satanás é o "acusador dos irmãos." O paradoxo: se pensamentos blasfemos te horrorizam, é porque o Espírito Santo habita em você. O verdadeiro apóstata não se incomoda.',
    timerSeconds: 90,
  },
];
