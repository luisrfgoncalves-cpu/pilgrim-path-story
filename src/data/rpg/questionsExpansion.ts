import { ScriptureQuestion } from './types';

// ═══════════════════════════════════════════════════════
// EXPANSÃO DE PERGUNTAS — LOTE 2
// Perguntas adicionais para atingir meta de 300+ itens totais
// ═══════════════════════════════════════════════════════

export const scriptureQuestionsExpansion: ScriptureQuestion[] = [
  // ═══════ APRENDIZ — EXPANSÃO ═══════
  {
    id: 'q-a-031', difficulty: 'aprendiz',
    context: 'Cristão precisou deixar a Cidade da Destruição às pressas, tapando os ouvidos e gritando "Vida! Vida! Vida eterna!"',
    question: 'Qual personagem bíblico também precisou fugir de uma cidade condenada sem olhar para trás?',
    options: ['Abraão', 'Ló', 'Noé', 'Moisés'],
    correctIndex: 1,
    bibleReference: 'Gênesis 19:17',
    explanation: '"Escapa-te por tua vida; não olhes para trás!" Ló fugiu de Sodoma. Sua esposa olhou para trás e virou estátua de sal.',
    timerSeconds: 25,
    chainTrigger: { flag: 'knowledge_of_lot', description: 'Grupo sabe sobre Ló e Sodoma' },
  },
  {
    id: 'q-a-032', difficulty: 'aprendiz',
    context: 'Cristão encontrou dois homens dormindo com correntes nos pés: Simples e Presunção. Ele os avisou do perigo, mas eles riram.',
    question: 'Em Provérbios, Deus compara a preguiça espiritual a qual animal que é sábio apesar de pequeno?',
    options: ['Águia', 'Formiga', 'Leão', 'Coruja'],
    correctIndex: 1,
    bibleReference: 'Provérbios 6:6',
    explanation: '"Vai ter com a formiga, ó preguiçoso; olha para os seus caminhos e sê sábio." A formiga trabalha sem precisar de supervisor.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-033', difficulty: 'aprendiz',
    context: 'Na Casa do Intérprete, Cristão viu um homem em uma gaiola de ferro, completamente desesperado.',
    question: 'Qual pecado o homem na gaiola disse ter cometido para ficar naquela situação?',
    options: ['Roubo', 'Assassinato', 'Rejeitou repetidamente a graça de Deus', 'Idolatria'],
    correctIndex: 2,
    bibleReference: 'Hebreus 6:4-6',
    explanation: 'O homem na gaiola havia rejeitado tantas vezes a graça que perdeu a capacidade de arrependimento. Um aviso solene contra brincar com Deus.',
    timerSeconds: 30,
  },
  {
    id: 'q-a-034', difficulty: 'aprendiz',
    context: 'Cristão subiu a Colina da Dificuldade ofegante e cansado, mas continuou. Outros tomaram caminhos mais fáceis.',
    question: 'Os dois peregrinos que desviaram na Colina se chamavam Formalista e Hipocrisia. O que aconteceu com eles?',
    options: ['Chegaram primeiro', 'Se perderam e pereceram', 'Voltaram para o portão', 'Encontraram um atalho válido'],
    correctIndex: 1,
    bibleReference: 'João 10:1',
    explanation: '"O que não entra pela porta é ladrão." Formalista e Hipocrisia representam religião sem conversão verdadeira.',
    timerSeconds: 30,
  },
  {
    id: 'q-a-035', difficulty: 'aprendiz',
    context: 'Cristão dormiu no Caramanchão na Colina da Dificuldade e perdeu seu pergaminho! Precisou voltar para buscá-lo.',
    question: 'O que o pergaminho de Cristão representava?',
    options: ['Um mapa do caminho', 'A certeza da salvação', 'Uma carta de recomendação', 'Um feitiço de proteção'],
    correctIndex: 1,
    bibleReference: 'Efésios 1:13-14',
    explanation: 'O pergaminho é a garantia da salvação, selada pelo Espírito Santo. Cristão perdeu a CONSCIÊNCIA da certeza, não a salvação em si.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-036', difficulty: 'aprendiz',
    context: 'No Palácio Belo, três donzelas ensinaram Cristão: Prudência, Piedade e Caridade.',
    question: 'Qual dessas três virtudes Paulo disse que é a maior de todas?',
    options: ['Prudência', 'Piedade', 'Caridade (amor)', 'Fé'],
    correctIndex: 2,
    bibleReference: '1 Coríntios 13:13',
    explanation: '"Agora permanecem a fé, a esperança e o amor; porém o maior deles é o amor." O amor é a maior virtude cristã.',
    timerSeconds: 25,
  },
  {
    id: 'q-a-037', difficulty: 'aprendiz',
    context: 'Esperança foi convertido após ver a coragem de Fiel no martírio. A morte de Fiel gerou vida em Esperança.',
    question: 'Qual pai da igreja disse que "o sangue dos mártires é a semente da igreja"?',
    options: ['Agostinho', 'Tertuliano', 'Orígenes', 'Policarpo'],
    correctIndex: 1,
    bibleReference: 'Atos 7:59-8:1',
    explanation: 'Tertuliano observou que cada martírio gerava mais conversões. A morte de Estêvão influenciou a conversão de Paulo.',
    timerSeconds: 30,
  },
  {
    id: 'q-a-038', difficulty: 'aprendiz',
    context: 'Cristão passou por dois leões rugindo no caminho do Palácio Belo. Eles pareciam terríveis!',
    question: 'Por que os leões não puderam atacar Cristão?',
    options: ['Estavam dormindo', 'Estavam acorrentados', 'Tinham medo de Cristão', 'Eram ilusões'],
    correctIndex: 1,
    bibleReference: '1 Pedro 5:8-9',
    explanation: 'Os leões estavam acorrentados — limitados por Deus. O diabo ruge mas está limitado. O teste era de CORAGEM, não de força.',
    timerSeconds: 20,
    chainTrigger: { flag: 'passed_lions', description: 'Grupo entendeu sobre os leões acorrentados' },
  },
  {
    id: 'q-a-039', difficulty: 'aprendiz',
    context: 'Falador impressionava todos com seu conhecimento bíblico, mas Fiel o desmascarou com uma pergunta simples.',
    question: 'Tiago ensina que a fé sem obras é:',
    options: ['Suficiente', 'Forte', 'Morta', 'Rara'],
    correctIndex: 2,
    bibleReference: 'Tiago 2:17',
    explanation: '"A fé, se não tiver obras, é morta em si mesma." Falador tinha discurso sem prática — fé de boca, não de vida.',
    timerSeconds: 20,
  },
  {
    id: 'q-a-040', difficulty: 'aprendiz',
    context: 'Na Cidade Celestial, Cristão e Esperança foram recebidos por anjos com trombetas de ouro e vestes brancas.',
    question: 'Apocalipse descreve as vestes dos salvos como:',
    options: ['Vermelhas como fogo', 'Brancas, lavadas no sangue do Cordeiro', 'Douradas como o sol', 'Azuis como o céu'],
    correctIndex: 1,
    bibleReference: 'Apocalipse 7:14',
    explanation: '"Lavaram as suas vestes e as branquearam no sangue do Cordeiro." Paradoxo: sangue que branqueia! Só o sangue de Cristo purifica.',
    timerSeconds: 25,
  },

  // ═══════ PEREGRINO — EXPANSÃO ═══════
  {
    id: 'q-p-030', difficulty: 'peregrino',
    context: 'Cristão lutou contra Apolion por quase um dia inteiro. Quando estava quase derrotado, agarrou a espada e atacou.',
    question: 'Em Mateus 4, Jesus enfrentou Satanás no deserto. Quantas vezes Jesus respondeu com "Está escrito"?',
    options: ['Uma vez', 'Duas vezes', 'Três vezes', 'Quatro vezes'],
    correctIndex: 2,
    bibleReference: 'Mateus 4:1-11',
    explanation: 'Jesus usou a Escritura 3 vezes contra 3 tentações. A Palavra é a arma. Cristão venceu Apolion da mesma forma.',
    timerSeconds: 35,
    chainCondition: { requiredFlag: 'passed_lions', altContext: 'Após vencer os leões acorrentados com coragem, agora Cristão enfrenta algo muito pior — Apolion em pessoa. Mas quem venceu o medo dos leões já sabe: o inimigo tem limites.' },
  },
  {
    id: 'q-p-031', difficulty: 'peregrino',
    context: 'Fiel enfrentou três tentações antes de encontrar Cristão: Lascívia, Velho-Adão e Moisés (a Lei).',
    question: 'Por que Moisés (representando a Lei) atacou Fiel violentamente?',
    options: [
      'Porque Fiel quebrou os mandamentos',
      'Porque a Lei condena quem ainda não está sob a graça — a Lei não perdoa, apenas pune',
      'Porque Moisés era mau',
      'Porque Fiel era orgulhoso'
    ],
    correctIndex: 1,
    bibleReference: 'Gálatas 3:10',
    explanation: 'A Lei não pode salvar — apenas condena. "Maldito todo aquele que não permanece em todas as coisas da Lei." Só a graça nos livra.',
    timerSeconds: 45,
  },
  {
    id: 'q-p-032', difficulty: 'peregrino',
    context: 'Quando Cristão perdeu o pergaminho na Colina da Dificuldade, ele teve que voltar em prantos para buscá-lo.',
    question: 'Qual é a diferença entre PERDER a certeza da salvação e PERDER a salvação, segundo a teologia reformada?',
    options: [
      'São a mesma coisa',
      'A certeza (segurança subjetiva) pode oscilar; a salvação (realidade objetiva) nunca se perde',
      'Ambas podem ser perdidas',
      'Nenhuma pode ser perdida'
    ],
    correctIndex: 1,
    bibleReference: 'Romanos 8:38-39',
    explanation: 'Cristão perdeu o pergaminho (certeza) temporariamente, mas nunca deixou de pertencer ao Rei. A salvação é irrevogável.',
    timerSeconds: 45,
  },
  {
    id: 'q-p-033', difficulty: 'peregrino',
    context: 'Os pastores das Montanhas Deleitosas mostraram o Erro — um abismo onde peregrinos desviados haviam caído.',
    question: 'Pedro adverte sobre falsos mestres que "introduzem encobertamente heresias destruidoras." Como reconhecê-los?',
    options: [
      'Eles se vestem diferente',
      'Eles falam coisas agradáveis que distorcem sutilmente a verdade bíblica',
      'Eles são sempre agressivos',
      'Eles não citam a Bíblia'
    ],
    correctIndex: 1,
    bibleReference: '2 Pedro 2:1-3',
    explanation: 'Falsos mestres são perigosos justamente porque parecem bíblicos. A distorção SUTIL é mais perigosa que a negação ABERTA.',
    timerSeconds: 40,
  },
  {
    id: 'q-p-034', difficulty: 'peregrino',
    context: 'Na Terra Encantada, perto do final, o sono era quase irresistível. Esperança manteve Cristão acordado.',
    question: 'Paulo diz em 1 Coríntios 9:27 que ele "esmurra o próprio corpo." O que ele quis dizer?',
    options: [
      'Automutilação religiosa',
      'Disciplina pessoal rigorosa para não ser desqualificado após pregar a outros',
      'Exercícios físicos',
      'Punição por pecados'
    ],
    correctIndex: 1,
    bibleReference: '1 Coríntios 9:27',
    explanation: 'A disciplina espiritual é especialmente crucial perto do fim. Muitos "pregadores" foram desqualificados por falta de vigilância pessoal.',
    timerSeconds: 40,
  },

  // ═══════ VETERANO — EXPANSÃO ═══════
  {
    id: 'q-v-030', difficulty: 'veterano',
    context: 'Bunyan escreveu a Parte II de O Peregrino, onde Cristiana (esposa de Cristão) faz a mesma jornada com seus filhos.',
    question: 'Qual diferença fundamental entre a jornada de Cristão (Parte I) e de Cristiana (Parte II) reflete duas perspectivas teológicas sobre a santificação?',
    options: [
      'Não há diferença',
      'Cristão viaja sozinho e enfrenta tudo individualmente (santificação como luta pessoal); Cristiana viaja em comunidade com proteção (santificação no contexto da igreja)',
      'Cristiana enfrenta mais perigos',
      'Cristão chega mais rápido'
    ],
    correctIndex: 1,
    bibleReference: 'Hebreus 10:24-25',
    explanation: 'Bunyan equilibrou duas verdades: a fé é pessoal (Parte I) e comunitária (Parte II). "Não deixemos de congregar-nos."',
    timerSeconds: 75,
  },
  {
    id: 'q-v-031', difficulty: 'veterano',
    context: 'Apolion afirmou ter direito sobre Cristão porque ele "nasceu em meus domínios." Cristão retrucou que o Rei o redimiu.',
    question: 'Qual conceito legal-teológico está em jogo neste diálogo: a disputa entre dois "senhores" sobre a alma de uma pessoa?',
    options: [
      'Predestinação vs. livre arbítrio',
      'Redenção — o pagamento de resgate que transfere propriedade. Cristo "comprou" Cristão com Seu sangue, anulando a posse de Apolion',
      'Justificação forense',
      'Imputação da justiça'
    ],
    correctIndex: 1,
    bibleReference: '1 Coríntios 6:19-20',
    explanation: '"Fostes comprados por preço." A redenção é uma transação: Cristo pagou o resgate, e Satanás perdeu a posse. Apolion sabe disso, mas luta mesmo assim.',
    timerSeconds: 75,
  },
  {
    id: 'q-v-032', difficulty: 'veterano',
    context: 'O julgamento de Fiel na Feira da Vaidade é uma das cenas mais longas e detalhadas de O Peregrino.',
    question: 'Bunyan usou quais três testemunhas de acusação contra Fiel, e o que cada uma representa teologicamente?',
    options: [
      'Inveja, Superstição e Bajulação — representam os três motores da perseguição religiosa: ciúme clerical, tradição vazia e hipocrisia política',
      'Raiva, Orgulho e Avareza',
      'Dúvida, Medo e Ignorância',
      'Cobiça, Luxúria e Gula'
    ],
    correctIndex: 0,
    bibleReference: 'Atos 13:45',
    explanation: 'Os judeus de Antioquia "cheios de inveja, contradiziam o que Paulo dizia." A perseguição religiosa é quase sempre motivada por inveja, superstição ou oportunismo político.',
    timerSeconds: 75,
  },
  {
    id: 'q-v-033', difficulty: 'veterano',
    context: 'No país de Beulá, os peregrinos podiam ver a Cidade Celestial e ouvir os sinos tocando. A atmosfera era de antecipação gloriosa.',
    question: 'O nome Beulá (Isaías 62:4) significa "Desposada." Qual doutrina escatológica esta metáfora nupcial ilustra?',
    options: [
      'A destruição do mundo',
      'O casamento do Cordeiro — a união final entre Cristo (o Noivo) e a Igreja (a Noiva) descrita em Apocalipse 19:7-9',
      'A segunda vinda visível',
      'O milênio literal'
    ],
    correctIndex: 1,
    bibleReference: 'Apocalipse 19:7',
    explanation: '"Alegremo-nos e regozijemo-nos, porque são chegadas as bodas do Cordeiro." Beulá é o último estágio antes do casamento eterno.',
    timerSeconds: 75,
  },
  {
    id: 'q-v-034', difficulty: 'veterano',
    context: 'Bunyan coloca a Terra Encantada DEPOIS de Beulá — o perigo da apatia está mais perto do destino, não mais longe.',
    question: 'Qual conceito da psicologia espiritual puritana explica por que a apatia espiritual é mais perigosa perto do fim da jornada?',
    options: [
      'Cansaço físico',
      'A presunção espiritual — o crente que "quase chegou" relaxa prematuramente, achando que o destino está garantido independente de vigilância',
      'Falta de companhia',
      'Tédio'
    ],
    correctIndex: 1,
    bibleReference: 'Apocalipse 3:15-16',
    explanation: '"Nem frio nem quente! Oxalá foras frio ou quente!" A mornidão de Laodiceia é a Terra Encantada — apatia travestida de segurança.',
    timerSeconds: 75,
  },
];
