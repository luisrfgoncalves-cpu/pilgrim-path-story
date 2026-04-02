import { ScriptureQuestion } from './types';

// ═══════════════════════════════════════════════════════
// EXPANSÃO DE PERGUNTAS — LOTE 3
// Meta: atingir 300+ itens totais no banco de conteúdo
// ═══════════════════════════════════════════════════════

export const scriptureQuestionsExpansion2: ScriptureQuestion[] = [
  // ═══════ APRENDIZ — LOTE 3 ═══════
  {
    id: 'q-a-046', difficulty: 'aprendiz',
    context: 'Cristão precisou descer ao Vale da Humilhação, onde encontrou Apolião bloqueando o caminho. Era um lugar baixo e sombrio.',
    question: 'Qual discípulo negou Jesus três vezes, mostrando que até os mais corajosos podem cair no vale da humilhação?',
    options: ['João', 'Pedro', 'Tomé', 'André'],
    correctIndex: 1, bibleReference: 'Lucas 22:54-62',
    explanation: 'Pedro chorou amargamente após negar Jesus. A humilhação nos lembra que sem Deus, até os fortes falham.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-047', difficulty: 'aprendiz',
    context: 'Os pastores nas Montanhas Deleitáveis mostraram a Cristão quatro visões. Uma delas era terrível: um portão no lado da colina.',
    question: 'Para onde levava o portão que os pastores mostraram a Cristão como aviso?',
    options: ['Para um atalho seguro', 'Para o inferno', 'Para a Cidade da Destruição', 'Para o Pântano'],
    correctIndex: 1, bibleReference: 'Mateus 7:13',
    explanation: '"Larga é a porta e espaçoso o caminho que conduz à perdição." Os pastores mostraram o destino dos hipócritas.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-048', difficulty: 'aprendiz',
    context: 'Quando Cristão chegou ao Rio da Morte, ficou com muito medo. A profundidade da água variava.',
    question: 'Segundo o Salmo 23, o que Deus promete quando passamos pelo "vale da sombra da morte"?',
    options: ['Que não sofreremos', 'Que Ele estará conosco', 'Que morreremos em paz', 'Que seremos transportados'],
    correctIndex: 1, bibleReference: 'Salmos 23:4',
    explanation: '"Não temerei mal algum, porque Tu estás comigo." Deus não promete remover o vale — promete CAMINHAR conosco.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-049', difficulty: 'aprendiz',
    context: 'O Peregrino recebeu uma armadura completa no Palácio Belo antes de enfrentar o Vale.',
    question: 'Em Efésios 6, qual peça da armadura de Deus protege a cabeça?',
    options: ['O escudo da fé', 'O capacete da salvação', 'A couraça da justiça', 'O cinto da verdade'],
    correctIndex: 1, bibleReference: 'Efésios 6:17',
    explanation: 'O capacete da salvação protege a MENTE — nossos pensamentos. A certeza da salvação guarda contra dúvidas e medo.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-050', difficulty: 'aprendiz',
    context: 'Na Casa do Intérprete, Cristão viu um fogo que nunca se apagava, mesmo com água sendo jogada nele.',
    question: 'O que representava o óleo que alimentava o fogo secretamente por trás da parede?',
    options: ['A força humana', 'A graça de Cristo que sustenta a fé', 'A oração dos santos', 'Os anjos protetores'],
    correctIndex: 1, bibleReference: 'Filipenses 1:6',
    explanation: '"Aquele que em vós começou a boa obra a aperfeiçoará." A graça de Cristo sustenta nossa fé, mesmo quando o diabo tenta apagá-la.',
    timerSeconds: 30,
  },

  // ═══════ PEREGRINO — LOTE 3 ═══════
  {
    id: 'q-p-040', difficulty: 'peregrino',
    context: 'Cristão e Esperança foram capturados pelo Gigante Desespero. Passaram dias no calabouço do Castelo da Dúvida.',
    question: 'A esposa do Gigante Desespero tinha um nome significativo. Qual era e o que representa teologicamente?',
    options: ['Orgulho — a arrogância', 'Amargura — o ressentimento', 'Desconfiança — a incredulidade', 'Preguiça — a acomodação'],
    correctIndex: 2, bibleReference: 'Hebreus 3:12',
    explanation: 'Desconfiança (Diffidence) representa a incredulidade que alimenta o desespero. É a voz que diz: "Deus não se importa."',
    timerSeconds: 35,
  },
  {
    id: 'q-p-041', difficulty: 'peregrino',
    context: 'Fiel morreu na Feira da Vaidade, condenado por um júri composto por personagens com nomes alegóricos.',
    question: 'Qual dos seguintes NÃO era nome de um jurado no julgamento de Fiel?',
    options: ['Sr. Ódio-à-Luz', 'Sr. Amor-ao-Prazer', 'Sr. Inveja-Secreta', 'Sr. Sabedoria-Piedosa'],
    correctIndex: 3, bibleReference: 'João 15:18-19',
    explanation: 'Bunyan criou nomes que representam vícios que condenam a fé: luxúria, crueldade, ódio à luz. "Se o mundo vos odeia, sabei que primeiro me odiou a mim."',
    timerSeconds: 40,
  },
  {
    id: 'q-p-042', difficulty: 'peregrino',
    context: 'Evangelista aparecia em momentos cruciais para recolocar Cristão no caminho.',
    question: 'Quantas vezes Evangelista aparece no livro O Peregrino (Parte 1)?',
    options: ['Apenas 1', '3 vezes', '5 vezes', '7 vezes'],
    correctIndex: 1, bibleReference: '2 Timóteo 4:2',
    explanation: 'Evangelista aparece 3 vezes: no início, antes da Feira e antes do final. Ele representa o ministério pastoral que corrige e encoraja nos momentos certos.',
    timerSeconds: 40,
  },
  {
    id: 'q-p-043', difficulty: 'peregrino',
    context: 'Os Montes Deleitáveis tinham pastores com nomes significativos que guiaram Cristão nas últimas etapas.',
    question: 'Os quatro pastores dos Montes Deleitáveis se chamavam:',
    options: ['Fé, Esperança, Amor e Paz', 'Conhecimento, Experiência, Vigilância e Sinceridade', 'Moisés, Elias, Isaías e Daniel', 'Graça, Verdade, Justiça e Misericórdia'],
    correctIndex: 1, bibleReference: '1 Pedro 5:2',
    explanation: 'Conhecimento, Experiência, Vigilância e Sinceridade — as quatro qualidades essenciais de um líder espiritual saudável.',
    timerSeconds: 45,
  },
  {
    id: 'q-p-044', difficulty: 'peregrino',
    context: 'O Lisonjeiro apareceu vestido com roupas brancas e prendeu os peregrinos com uma rede.',
    question: 'Quem libertou Cristão e Esperança da rede do Lisonjeiro?',
    options: ['Um anjo com chicote', 'Evangelista', 'Os pastores', 'Eles mesmos'],
    correctIndex: 0, bibleReference: 'Hebreus 12:6',
    explanation: '"O Senhor corrige a quem ama." O anjo os libertou MAS também os disciplinou, porque eles tinham desprezado os avisos anteriores.',
    timerSeconds: 35,
  },

  // ═══════ VETERANO — LOTE 3 ═══════
  {
    id: 'q-v-039', difficulty: 'veterano',
    context: 'Bunyan descreve Apolião com detalhes que refletem a iconografia medieval do demônio.',
    question: 'Em Apocalipse 9:11, Apolião/Abadom é chamado de "anjo do abismo." O nome grego Apollyon significa literalmente:',
    options: ['Acusador', 'Destruidor', 'Enganador', 'Devorador'],
    correctIndex: 1, bibleReference: 'Apocalipse 9:11',
    explanation: 'Apollyon = "O Destruidor." Bunyan usou exatamente o nome bíblico para o inimigo que Cristão enfrenta no Vale — conectando ficção à Escritura.',
    timerSeconds: 50,
  },
  {
    id: 'q-v-040', difficulty: 'veterano',
    context: 'O homem na gaiola de ferro na Casa do Intérprete é uma das cenas mais perturbadoras do livro.',
    question: 'A "gaiola de ferro" que aprisiona o desesperado é uma metáfora teológica para qual conceito puritano?',
    options: ['Condenação eterna', 'Desespero final (apostasia irreversível)', 'Prisão literal de cristãos', 'Disciplina eclesiástica'],
    correctIndex: 1, bibleReference: 'Hebreus 6:4-6',
    explanation: 'A gaiola representa o estado daquele que, tendo conhecido a graça, a rejeitou persistentemente até não conseguir mais se arrepender — o desespero final.',
    timerSeconds: 60,
  },
  {
    id: 'q-v-041', difficulty: 'veterano',
    context: 'Bunyan escreveu O Peregrino sob forte influência da teologia puritana do séc. XVII.',
    question: 'Qual dos seguintes teólogos NÃO foi influência direta reconhecida sobre Bunyan?',
    options: ['Martin Luther (Lutero)', 'John Calvin (Calvino)', 'Thomas Aquinas (Aquino)', 'William Perkins'],
    correctIndex: 2, bibleReference: '2 Timóteo 2:15',
    explanation: 'Tomás de Aquino era católico medieval. Bunyan foi influenciado pelos reformadores protestantes: Lutero (comentário de Gálatas) e a tradição calvinista puritana.',
    timerSeconds: 60,
  },
  {
    id: 'q-v-042', difficulty: 'veterano',
    context: 'A cena final do livro mostra Ignorância sendo levado por dois seres para um lugar terrível.',
    question: 'Ignorância tinha consigo um certificado falso. De onde vinha a falsa certeza de salvação dele?',
    options: ['De um pregador falso', 'Do seu próprio coração', 'De uma visão que teve', 'De uma tradição familiar'],
    correctIndex: 1, bibleReference: 'Jeremias 17:9',
    explanation: '"Enganoso é o coração, mais do que todas as coisas." Ignorância confiava no seu próprio coração como prova de salvação — o erro mais perigoso.',
    timerSeconds: 55,
  },
  {
    id: 'q-v-043', difficulty: 'veterano',
    context: 'O Rio da Morte no final tem profundidade variável — para alguns era raso, para outros profundo.',
    question: 'Qual fator determinava a profundidade do Rio da Morte para cada peregrino em Bunyan?',
    options: ['A quantidade de pecados', 'O nível de fé e confiança em Cristo', 'A duração da jornada', 'A quantidade de obras feitas'],
    correctIndex: 1, bibleReference: 'Salmos 23:4',
    explanation: 'Esperança passou mais facilmente que Cristão porque confiava mais em Cristo naquele momento. A morte é menos terrível para quem confia mais plenamente.',
    timerSeconds: 55,
  },
];
