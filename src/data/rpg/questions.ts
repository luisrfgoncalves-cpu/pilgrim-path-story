import { ScriptureQuestion } from './types';

// ═══════════════════════════════════════════════════════
// BANCO DE PERGUNTAS BÍBLICAS — CONTEXTUALIZADAS COM O PEREGRINO
// 60+ perguntas por nível × 3 níveis = 180+ perguntas
// ═══════════════════════════════════════════════════════

export const scriptureQuestions: ScriptureQuestion[] = [
  // ═══════ APRENDIZ (13+) ═══════
  // Perguntas mais diretas, referências conhecidas
  {
    id: 'q-a-001', difficulty: 'aprendiz',
    context: 'Cristão descobriu que carregava um fardo pesado nas costas — o peso dos seus pecados. Ele precisava encontrar alguém que pudesse tirá-lo.',
    question: 'Quem é o único que pode tirar o fardo do pecado das nossas costas?',
    options: ['Um anjo poderoso', 'Jesus Cristo', 'Um profeta sábio', 'Nós mesmos com boas obras'],
    correctIndex: 1,
    bibleReference: '1 João 1:7',
    explanation: 'O sangue de Jesus Cristo nos purifica de todo pecado. Assim como Cristão foi liberto na Cruz, só Jesus pode nos libertar.',
    timerSeconds: 30,
    narrativeLink: 'cena15'
  },
  {
    id: 'q-a-002', difficulty: 'aprendiz',
    context: 'O Peregrino caiu no Pântano do Desânimo logo no início da jornada. Um lugar escuro e pegajoso que quase o engoliu.',
    question: 'Qual sentimento o Pântano do Desânimo representa na vida cristã?',
    options: ['Alegria excessiva', 'Desânimo e dúvida', 'Orgulho espiritual', 'Preguiça física'],
    correctIndex: 1,
    bibleReference: 'Salmos 40:2',
    explanation: '"Tirou-me de um poço de destruição, de um atoleiro de lama." O desânimo é como lama que nos prende, mas Deus nos levanta.',
    timerSeconds: 30,
    narrativeLink: 'cena11'
  },
  {
    id: 'q-a-003', difficulty: 'aprendiz',
    context: 'Cristão encontrou um portão estreito no caminho. Era a única entrada para o caminho correto.',
    question: 'Jesus disse: "Eu sou a porta; quem entrar por mim será salvo." Em qual livro da Bíblia está esta frase?',
    options: ['Mateus', 'João', 'Lucas', 'Marcos'],
    correctIndex: 1,
    bibleReference: 'João 10:9',
    explanation: 'Jesus é a porta estreita. Não há outro caminho para a salvação senão por Ele.',
    timerSeconds: 30,
    narrativeLink: 'cena7'
  },
  {
    id: 'q-a-004', difficulty: 'aprendiz',
    context: 'Na Feira da Vaidade, tudo era oferecido para venda — prazeres, riquezas, honras. Os mercadores tentaram seduzir Cristão.',
    question: 'Qual mandamento nos ensina a não cobiçar o que é dos outros?',
    options: ['5º mandamento', '8º mandamento', '10º mandamento', '3º mandamento'],
    correctIndex: 2,
    bibleReference: 'Êxodo 20:17',
    explanation: '"Não cobiçarás." A Feira da Vaidade representa tudo que o mundo oferece para nos desviar de Deus.',
    timerSeconds: 30,
    narrativeLink: 'fase4-cena1'
  },
  {
    id: 'q-a-005', difficulty: 'aprendiz',
    context: 'Fiel, o companheiro de Cristão, foi martirizado na Feira da Vaidade por não negar sua fé.',
    question: 'Qual discípulo de Jesus também foi martirizado por sua fé, sendo o primeiro dos apóstolos a morrer?',
    options: ['Pedro', 'Paulo', 'Tiago', 'João'],
    correctIndex: 2,
    bibleReference: 'Atos 12:2',
    explanation: 'Tiago, irmão de João, foi morto à espada por ordem de Herodes. Assim como Fiel, manteve sua fé até o fim.',
    timerSeconds: 30,
    narrativeLink: 'fase4-cena6'
  },
  {
    id: 'q-a-006', difficulty: 'aprendiz',
    context: 'Cristão enfrentou o gigante Desespero no Castelo da Dúvida. Parecia impossível escapar daquele calabouço escuro.',
    question: 'Qual rei da Bíblia enfrentou um gigante famoso e o derrotou com uma pedra?',
    options: ['Saul', 'Salomão', 'Davi', 'Josué'],
    correctIndex: 2,
    bibleReference: '1 Samuel 17:50',
    explanation: 'Davi derrotou Golias não com armas, mas com fé em Deus. Assim Cristão venceu o Desespero com a chave da Promessa.',
    timerSeconds: 30,
    narrativeLink: 'fase5-cena3'
  },
  {
    id: 'q-a-007', difficulty: 'aprendiz',
    context: 'No Vale da Sombra da Morte, Cristão caminhou em trevas absolutas, ouvindo vozes demoníacas.',
    question: 'Qual salmo diz "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum"?',
    options: ['Salmo 1', 'Salmo 23', 'Salmo 91', 'Salmo 119'],
    correctIndex: 1,
    bibleReference: 'Salmos 23:4',
    explanation: 'O Salmo 23 é o salmo do pastor. Deus está conosco mesmo nos vales mais escuros da vida.',
    timerSeconds: 25,
    narrativeLink: 'fase3-cena5'
  },
  {
    id: 'q-a-008', difficulty: 'aprendiz',
    context: 'Cristão recebeu uma armadura completa para se proteger dos ataques do inimigo.',
    question: 'Em Efésios 6, qual peça da armadura de Deus protege o coração?',
    options: ['O capacete da salvação', 'A couraça da justiça', 'O escudo da fé', 'O cinto da verdade'],
    correctIndex: 1,
    bibleReference: 'Efésios 6:14',
    explanation: 'A couraça da justiça protege nosso coração. Viver em retidão nos guarda contra os ataques do maligno.',
    timerSeconds: 30,
    narrativeLink: 'fase2-cena9'
  },
  {
    id: 'q-a-009', difficulty: 'aprendiz',
    context: 'Evangelista apareceu para Cristão várias vezes, sempre apontando o caminho certo quando ele se perdia.',
    question: 'O que a palavra "Evangelho" significa literalmente?',
    options: ['Lei de Deus', 'Boa notícia', 'Caminho reto', 'Palavra santa'],
    correctIndex: 1,
    bibleReference: 'Marcos 1:15',
    explanation: 'Evangelho significa "boa notícia" — a boa nova de que Jesus salva. Evangelista levava essa notícia a Cristão.',
    timerSeconds: 25
  },
  {
    id: 'q-a-010', difficulty: 'aprendiz',
    context: 'Cristão atravessou o Rio da Morte no final da jornada para chegar à Cidade Celestial.',
    question: 'Na Bíblia, qual rio o povo de Israel precisou atravessar para entrar na Terra Prometida?',
    options: ['Rio Nilo', 'Rio Eufrates', 'Rio Jordão', 'Rio Tigre'],
    correctIndex: 2,
    bibleReference: 'Josué 3:17',
    explanation: 'Assim como Israel cruzou o Jordão para a Terra Prometida, Cristão cruzou o Rio da Morte para a Cidade Celestial.',
    timerSeconds: 25,
    narrativeLink: 'fase6-cena1'
  },
  {
    id: 'q-a-011', difficulty: 'aprendiz',
    context: 'Na Casa do Intérprete, Cristão viu várias visões que ensinavam verdades espirituais profundas.',
    question: 'Quem Jesus prometeu enviar para nos ensinar toda a verdade?',
    options: ['Anjos guardiões', 'O Espírito Santo', 'Profetas modernos', 'Sacerdotes especiais'],
    correctIndex: 1,
    bibleReference: 'João 16:13',
    explanation: 'O Espírito Santo é nosso Intérprete — Ele nos guia em toda a verdade, assim como a Casa do Intérprete ensinou Cristão.',
    timerSeconds: 30,
    narrativeLink: 'fase2-cena1'
  },
  {
    id: 'q-a-012', difficulty: 'aprendiz',
    context: 'Cristão e Esperança descansaram nas Montanhas Deleitosas, onde pastores cuidavam de ovelhas.',
    question: 'Jesus disse "Eu sou o bom pastor." O que o bom pastor faz pelas ovelhas?',
    options: ['Vende as ovelhas', 'Dá a vida pelas ovelhas', 'Abandona as ovelhas', 'Conta as ovelhas'],
    correctIndex: 1,
    bibleReference: 'João 10:11',
    explanation: 'Jesus deu Sua vida por nós. Os pastores das Montanhas Deleitosas representam os cuidadores espirituais.',
    timerSeconds: 25,
    narrativeLink: 'fase5-cena9'
  },
  {
    id: 'q-a-013', difficulty: 'aprendiz',
    context: 'Flexível abandonou Cristão logo no início quando as coisas ficaram difíceis no Pântano.',
    question: 'Na parábola do semeador, o que representa a semente que caiu em solo pedregoso?',
    options: ['Quem ouve e pratica', 'Quem ouve com alegria mas desiste na tribulação', 'Quem nunca ouviu', 'Quem espalha a Palavra'],
    correctIndex: 1,
    bibleReference: 'Mateus 13:20-21',
    explanation: 'Flexível é como a semente em solo pedregoso — recebeu a Palavra com alegria mas desistiu na primeira dificuldade.',
    timerSeconds: 30,
    narrativeLink: 'cena12'
  },
  {
    id: 'q-a-014', difficulty: 'aprendiz',
    context: 'O Senhor Sabedoria Mundana aconselhou Cristão a buscar um caminho mais fácil, pelo vilarejo da Moralidade.',
    question: 'Qual provérbio diz que "há caminho que parece certo ao homem, mas o seu fim são caminhos de morte"?',
    options: ['Provérbios 10:12', 'Provérbios 14:12', 'Provérbios 3:5', 'Provérbios 22:6'],
    correctIndex: 1,
    bibleReference: 'Provérbios 14:12',
    explanation: 'Nem todo caminho que parece bom é o caminho de Deus. Sabedoria Mundana oferecia atalhos perigosos.',
    timerSeconds: 30,
    narrativeLink: 'cena5'
  },
  {
    id: 'q-a-015', difficulty: 'aprendiz',
    context: 'Na Cruz, o fardo de Cristão caiu de suas costas e rolou para dentro do sepulcro. Ele ficou livre!',
    question: 'Quantos dias Jesus ficou no sepulcro antes de ressuscitar?',
    options: ['1 dia', '2 dias', '3 dias', '7 dias'],
    correctIndex: 2,
    bibleReference: 'Mateus 12:40',
    explanation: 'Jesus ressuscitou ao terceiro dia, vencendo a morte. Na Cruz, o fardo do pecado de Cristão foi destruído.',
    timerSeconds: 20,
    narrativeLink: 'cena15'
  },
  {
    id: 'q-a-016', difficulty: 'aprendiz',
    context: 'Apolion atacou Cristão no Vale da Humilhação, um demônio terrível com escamas e asas.',
    question: 'Qual livro da Bíblia descreve a batalha final contra o dragão, a antiga serpente?',
    options: ['Gênesis', 'Daniel', 'Apocalipse', 'Ezequiel'],
    correctIndex: 2,
    bibleReference: 'Apocalipse 12:7-9',
    explanation: 'Apocalipse revela que o dragão (Satanás) será derrotado definitivamente. Apolion é uma representação desse inimigo.',
    timerSeconds: 25
  },
  {
    id: 'q-a-017', difficulty: 'aprendiz',
    context: 'Cristão precisou subir a Colina da Dificuldade. Era íngreme e cansativa, mas era o único caminho.',
    question: 'Jesus disse: "No mundo tereis tribulações, mas tende bom ânimo." Por que devemos ter ânimo?',
    options: ['Porque somos fortes', 'Porque Jesus venceu o mundo', 'Porque as tribulações acabam rápido', 'Porque temos amigos'],
    correctIndex: 1,
    bibleReference: 'João 16:33',
    explanation: 'Nossa esperança não está em nossas forças, mas na vitória de Jesus. A Colina é difícil, mas o caminho é certo.',
    timerSeconds: 30,
    narrativeLink: 'fase2-cena11'
  },
  {
    id: 'q-a-018', difficulty: 'aprendiz',
    context: 'Ignorância tentou entrar na Cidade Celestial por um atalho, sem passar pelo Portão Estreito.',
    question: 'Jesus disse que Ele é o caminho, a verdade e a vida. Ninguém vem ao Pai senão por quem?',
    options: ['Pelos anjos', 'Por Jesus', 'Pelas boas obras', 'Pela igreja'],
    correctIndex: 1,
    bibleReference: 'João 14:6',
    explanation: 'Não há atalhos para o céu. Ignorância tentou um caminho alternativo e foi rejeitado. Só Jesus é o caminho.',
    timerSeconds: 25
  },
  {
    id: 'q-a-019', difficulty: 'aprendiz',
    context: 'Os leões rugiam no caminho para o Palácio Belo, mas estavam acorrentados. Cristão precisava de coragem para passar.',
    question: 'A Bíblia compara o diabo a qual animal que "anda em derredor, rugindo"?',
    options: ['Urso', 'Lobo', 'Leão', 'Serpente'],
    correctIndex: 2,
    bibleReference: '1 Pedro 5:8',
    explanation: 'O diabo ruge como leão, mas está limitado por Deus. Os leões acorrentados mostram que o mal tem limites.',
    timerSeconds: 25,
    narrativeLink: 'fase2-cena14'
  },
  {
    id: 'q-a-020', difficulty: 'aprendiz',
    context: 'Esperança se tornou o novo companheiro de Cristão após a morte de Fiel na Feira da Vaidade.',
    question: 'Qual versículo diz que "a esperança não decepciona, porque o amor de Deus é derramado em nossos corações"?',
    options: ['Romanos 5:5', 'Hebreus 11:1', 'Filipenses 4:13', '1 Coríntios 13:13'],
    correctIndex: 0,
    bibleReference: 'Romanos 5:5',
    explanation: 'A esperança cristã nunca decepciona porque é fundamentada no amor de Deus, não em circunstâncias.',
    timerSeconds: 30,
    narrativeLink: 'fase4-cena8'
  },

  // Mais aprendiz
  {
    id: 'q-a-021', difficulty: 'aprendiz',
    context: 'Cristão partiu da Cidade da Destruição porque leu no livro que a cidade seria destruída pelo fogo.',
    question: 'Qual cidade bíblica foi destruída por fogo e enxofre por causa da maldade de seus habitantes?',
    options: ['Jericó', 'Sodoma', 'Babilônia', 'Nínive'],
    correctIndex: 1,
    bibleReference: 'Gênesis 19:24',
    explanation: 'Sodoma foi destruída por fogo. A Cidade da Destruição representa o mundo sob juízo de Deus.',
    timerSeconds: 25
  },
  {
    id: 'q-a-022', difficulty: 'aprendiz',
    context: 'Obstinado tentou convencer Cristão a voltar para casa, dizendo que a jornada era loucura.',
    question: 'A Bíblia diz que a mensagem da cruz é loucura para quem?',
    options: ['Para os sábios', 'Para os que se perdem', 'Para as crianças', 'Para os profetas'],
    correctIndex: 1,
    bibleReference: '1 Coríntios 1:18',
    explanation: 'Para os que estão perecendo, o evangelho parece loucura. Obstinado não conseguia ver a verdade.',
    timerSeconds: 30
  },
  {
    id: 'q-a-023', difficulty: 'aprendiz',
    context: 'No Palácio Belo, Cristão descansou e foi alimentado antes de continuar sua jornada.',
    question: 'Qual salmo fala sobre Deus preparar uma mesa para nós na presença dos nossos inimigos?',
    options: ['Salmo 23', 'Salmo 91', 'Salmo 1', 'Salmo 150'],
    correctIndex: 0,
    bibleReference: 'Salmos 23:5',
    explanation: 'O Palácio Belo representa a igreja — um lugar de descanso, alimento e comunhão antes das próximas batalhas.',
    timerSeconds: 25
  },
  {
    id: 'q-a-024', difficulty: 'aprendiz',
    context: 'Cristão recebeu um pergaminho com um selo — sua certeza de entrada na Cidade Celestial.',
    question: 'Na Bíblia, o que sela os crentes como garantia da salvação?',
    options: ['O batismo', 'O Espírito Santo', 'As boas obras', 'A frequência na igreja'],
    correctIndex: 1,
    bibleReference: 'Efésios 1:13-14',
    explanation: 'O Espírito Santo é o selo e a garantia da nossa herança. O pergaminho de Cristão simboliza essa certeza.',
    timerSeconds: 30
  },
  {
    id: 'q-a-025', difficulty: 'aprendiz',
    context: 'Demas tentou desviar Cristão para uma mina de prata, prometendo riqueza fácil.',
    question: 'Jesus disse que não podemos servir a dois senhores. Quais são esses dois senhores?',
    options: ['Deus e o diabo', 'Deus e as riquezas (Mamom)', 'A igreja e o mundo', 'O bem e o mal'],
    correctIndex: 1,
    bibleReference: 'Mateus 6:24',
    explanation: 'Mamom (riquezas) compete com Deus pelo nosso coração. Demas representa a armadilha da ganância.',
    timerSeconds: 30
  },
  {
    id: 'q-a-026', difficulty: 'aprendiz',
    context: 'Cristão quase adormeceu na Terra Encantada, um lugar que fazia os viajantes dormirem para sempre.',
    question: 'Jesus disse aos discípulos no Getsêmani: "Vigiai e orai, para que não entreis em ___."',
    options: ['Pecado', 'Tentação', 'Desespero', 'Sono'],
    correctIndex: 1,
    bibleReference: 'Mateus 26:41',
    explanation: 'A Terra Encantada representa a sonolência espiritual. Precisamos vigiar para não sermos vencidos pela apatia.',
    timerSeconds: 25
  },
  {
    id: 'q-a-027', difficulty: 'aprendiz',
    context: 'Na Cidade Celestial, Cristão recebeu uma coroa de ouro e vestes brancas.',
    question: 'O livro de Apocalipse promete uma coroa a quem for fiel até a morte. Qual coroa é essa?',
    options: ['Coroa de espinhos', 'Coroa da vida', 'Coroa de flores', 'Coroa de prata'],
    correctIndex: 1,
    bibleReference: 'Apocalipse 2:10',
    explanation: 'A coroa da vida é prometida aos que perseveram. Cristão completou sua peregrinação e recebeu o prêmio.',
    timerSeconds: 25
  },
  {
    id: 'q-a-028', difficulty: 'aprendiz',
    context: 'Socorro ajudou Cristão a sair do Pântano do Desânimo, estendendo-lhe a mão.',
    question: 'Jesus estendeu a mão para salvar qual discípulo que estava afundando na água?',
    options: ['João', 'Tiago', 'Pedro', 'André'],
    correctIndex: 2,
    bibleReference: 'Mateus 14:31',
    explanation: 'Pedro afundou quando tirou os olhos de Jesus. Socorro representa a graça de Deus que nos resgata.',
    timerSeconds: 25
  },
  {
    id: 'q-a-029', difficulty: 'aprendiz',
    context: 'Os três dorminhocoes — Simples, Preguiça e Presunção — dormiam à beira do caminho, acorrentados.',
    question: 'O livro de Provérbios adverte muito contra qual desses vícios?',
    options: ['A raiva', 'A preguiça', 'A mentira', 'A gula'],
    correctIndex: 1,
    bibleReference: 'Provérbios 6:9-11',
    explanation: '"Até quando ficarás deitado, ó preguiçoso?" A preguiça espiritual nos prende em correntes invisíveis.',
    timerSeconds: 25
  },
  {
    id: 'q-a-030', difficulty: 'aprendiz',
    context: 'Cristão e Esperança encontraram um prado aparentemente agradável ao lado do caminho e decidiram andar por ele.',
    question: 'O que aconteceu quando eles saíram do caminho estreito?',
    options: ['Encontraram um atalho', 'Foram capturados pelo Gigante Desespero', 'Acharam um tesouro', 'Nada aconteceu'],
    correctIndex: 1,
    bibleReference: 'Provérbios 4:27',
    explanation: '"Não te desvies nem para a direita nem para a esquerda." Sair do caminho de Deus sempre traz consequências.',
    timerSeconds: 25,
    narrativeLink: 'fase5-cena1'
  },

  // ═══════ PEREGRINO (18+) ═══════
  // Perguntas com mais profundidade teológica
  {
    id: 'q-p-001', difficulty: 'peregrino',
    context: 'Na Casa do Intérprete, Cristão viu uma sala cheia de poeira. Quando varreram, a poeira sufocava. Mas quando borrifaram água, a sala ficou limpa.',
    question: 'O que a poeira e a água representam nesta alegoria de Bunyan?',
    options: [
      'A poeira é a ignorância e a água é o conhecimento',
      'A poeira é o pecado que a Lei agita, e a água é a graça do Evangelho que limpa',
      'A poeira é a tristeza e a água é a alegria',
      'A poeira é a dúvida e a água é a certeza'
    ],
    correctIndex: 1,
    bibleReference: 'Romanos 5:20',
    explanation: 'A Lei revela o pecado mas não pode limpá-lo — só o agita. A graça do Evangelho é que purifica. "Onde o pecado abundou, superabundou a graça."',
    timerSeconds: 45,
    narrativeLink: 'fase2-cena2'
  },
  {
    id: 'q-p-002', difficulty: 'peregrino',
    context: 'Cristão viu na Casa do Intérprete um fogo que ardia contra uma parede. Um homem jogava água, mas o fogo não apagava. Havia alguém atrás da parede alimentando o fogo com óleo.',
    question: 'O que o fogo, a água e o óleo representam nesta visão?',
    options: [
      'O fogo é a raiva, a água é a calma, o óleo é a paciência',
      'O fogo é a graça no coração, a água são as tentações, o óleo é Cristo sustentando secretamente',
      'O fogo é o inferno, a água é o batismo, o óleo é a unção',
      'O fogo é a fé, a água é a dúvida, o óleo é a oração'
    ],
    correctIndex: 1,
    bibleReference: '2 Coríntios 12:9',
    explanation: 'Cristo mantém a graça viva em nossos corações mesmo quando o diabo tenta apagá-la. "Minha graça te basta."',
    timerSeconds: 45,
    narrativeLink: 'fase2-cena4'
  },
  {
    id: 'q-p-003', difficulty: 'peregrino',
    context: 'Apolion disse a Cristão: "Você já foi meu servo. Você pertence a mim. Volte ou eu te destruirei."',
    question: 'Com qual armamento espiritual Cristão finalmente derrotou Apolion?',
    options: [
      'Com uma espada física e escudo de metal',
      'Com a espada do Espírito, que é a Palavra de Deus',
      'Com a ajuda de outros peregrinos',
      'Fugindo para um refúgio seguro'
    ],
    correctIndex: 1,
    bibleReference: 'Efésios 6:17',
    explanation: 'A espada do Espírito — a Palavra de Deus — é nossa arma ofensiva contra o inimigo. Jesus também usou as Escrituras para vencer Satanás no deserto.',
    timerSeconds: 40,
    narrativeLink: 'fase3-cena4'
  },
  {
    id: 'q-p-004', difficulty: 'peregrino',
    context: 'O Gigante Desespero trancou Cristão e Esperança no calabouço do Castelo da Dúvida e os espancava diariamente.',
    question: 'Qual foi a "chave" que Cristão descobriu ter em seu bolso e que abriu todas as portas do calabouço?',
    options: [
      'A chave da sabedoria humana',
      'A chave da Promessa (as promessas de Deus)',
      'A chave da coragem própria',
      'A chave da paciência'
    ],
    correctIndex: 1,
    bibleReference: '2 Pedro 1:4',
    explanation: 'As promessas de Deus são "grandíssimas e preciosas." Quando lembramos das promessas divinas, nenhuma prisão de dúvida pode nos segurar.',
    timerSeconds: 40,
    narrativeLink: 'fase5-cena7'
  },
  {
    id: 'q-p-005', difficulty: 'peregrino',
    context: 'Na Feira da Vaidade, Cristão e Fiel foram presos e julgados. O juiz se chamava Senhor Ódio-ao-Bem.',
    question: 'Jesus avisou que os discípulos seriam odiados. Por que o mundo odeia os seguidores de Cristo?',
    options: [
      'Porque são arrogantes',
      'Porque não são do mundo, assim como Cristo não é do mundo',
      'Porque são fracos',
      'Porque fazem barulho demais'
    ],
    correctIndex: 1,
    bibleReference: 'João 15:18-19',
    explanation: '"Se o mundo vos odeia, sabei que primeiro me odiou a mim." O ódio do mundo é consequência de pertencermos a Cristo.',
    timerSeconds: 40,
    narrativeLink: 'fase4-cena4'
  },
  {
    id: 'q-p-006', difficulty: 'peregrino',
    context: 'Cristão perdeu seu pergaminho de certificação enquanto dormia na Colina da Dificuldade e precisou voltar para buscá-lo.',
    question: 'Na parábola de Jesus, o que o homem fez quando encontrou um tesouro escondido num campo?',
    options: [
      'Contou para todos e dividiu',
      'Vendeu tudo que tinha e comprou o campo',
      'Deixou o tesouro onde estava',
      'Pegou o tesouro e fugiu'
    ],
    correctIndex: 1,
    bibleReference: 'Mateus 13:44',
    explanation: 'A salvação é tão preciosa que vale tudo. Cristão voltou para buscar seu pergaminho porque sabia seu valor inestimável.',
    timerSeconds: 40,
    narrativeLink: 'fase2-cena13'
  },
  {
    id: 'q-p-007', difficulty: 'peregrino',
    context: 'Cristão foi armado com a armadura completa no Palácio Belo antes de descer ao Vale da Humilhação.',
    question: 'Por que a armadura de Deus em Efésios 6 não tem proteção para as costas?',
    options: [
      'Porque foi um erro de design',
      'Porque Deus protege nossas costas diretamente',
      'Porque o cristão nunca deve fugir ou dar as costas ao inimigo',
      'Porque a capa já cobre as costas'
    ],
    correctIndex: 2,
    bibleReference: 'Efésios 6:13',
    explanation: '"Tendo feito tudo, ficai firmes." A armadura é para quem enfrenta o inimigo de frente, não para quem foge.',
    timerSeconds: 45
  },
  {
    id: 'q-p-008', difficulty: 'peregrino',
    context: 'Ignorância seguia o mesmo caminho que Cristão, mas havia entrado por um atalho lateral, não pelo Portão Estreito.',
    question: 'Qual é a diferença entre a fé verdadeira e a fé de Ignorância segundo a Bíblia?',
    options: [
      'Não há diferença, toda fé é válida',
      'A fé verdadeira produz arrependimento e frutos; a falsa é só intelectual',
      'A fé verdadeira é mais emocional',
      'A fé verdadeira requer mais estudo'
    ],
    correctIndex: 1,
    bibleReference: 'Tiago 2:17',
    explanation: '"A fé sem obras é morta." Ignorância tinha uma fé superficial, sem arrependimento genuíno nem transformação.',
    timerSeconds: 45
  },
  {
    id: 'q-p-009', difficulty: 'peregrino',
    context: 'Volúvel acompanhou Cristão por um tempo mas desistiu porque o caminho incluía um lugar chamado Pântano do Desânimo.',
    question: 'Jesus contou a parábola do semeador. A qual tipo de solo Volúvel corresponde?',
    options: [
      'O solo à beira do caminho — nunca entendeu a Palavra',
      'O solo pedregoso — recebeu com alegria mas não tinha raiz',
      'O solo entre espinhos — sufocado pelas preocupações',
      'O solo bom — deu frutos'
    ],
    correctIndex: 1,
    bibleReference: 'Mateus 13:20-21',
    explanation: 'Volúvel recebeu a mensagem com entusiasmo mas não tinha raiz. Na primeira tribulação, desistiu.',
    timerSeconds: 40
  },
  {
    id: 'q-p-010', difficulty: 'peregrino',
    context: 'Nas Montanhas Deleitosas, os pastores mostraram a Cristão o Erro — um abismo onde falsos peregrinos haviam caído.',
    question: 'Qual carta do Novo Testamento foi escrita especificamente para alertar contra falsos mestres que desviam os crentes?',
    options: ['Filemom', '2 Pedro', 'Tito', '3 João'],
    correctIndex: 1,
    bibleReference: '2 Pedro 2:1',
    explanation: '"Houve falsos profetas entre o povo, assim como haverá falsos mestres entre vós." A vigilância é essencial.',
    timerSeconds: 40,
    narrativeLink: 'fase5-cena10'
  },
  {
    id: 'q-p-011', difficulty: 'peregrino',
    context: 'Cristão encontrou Ateu no caminho, que ria dele dizendo que a Cidade Celestial não existia.',
    question: 'O Salmo 14 começa com: "Disse o _____ no seu coração: Não há Deus."',
    options: ['Sábio', 'Ímpio', 'Insensato', 'Pecador'],
    correctIndex: 2,
    bibleReference: 'Salmos 14:1',
    explanation: 'Negar Deus é insensatez, não sabedoria. Ateu rejeitava a realidade da Cidade Celestial por incredulidade.',
    timerSeconds: 35
  },
  {
    id: 'q-p-012', difficulty: 'peregrino',
    context: 'O Senhor Legalidade e seu filho Civilidade moravam na aldeia da Moralidade. Sabedoria Mundana enviou Cristão para lá.',
    question: 'Por que confiar na moralidade e nas boas obras sem Cristo é perigoso segundo Paulo?',
    options: [
      'Porque as obras são más',
      'Porque a salvação é pela graça mediante a fé, não por obras, para que ninguém se glorie',
      'Porque Deus não vê as obras',
      'Porque as obras são desnecessárias'
    ],
    correctIndex: 1,
    bibleReference: 'Efésios 2:8-9',
    explanation: 'A moralidade sem Cristo é como um curativo sobre uma ferida mortal. Só a graça de Deus pode nos salvar.',
    timerSeconds: 45
  },
  {
    id: 'q-p-013', difficulty: 'peregrino',
    context: 'Na Rede do Lisonjeiro, Cristão e Esperança foram capturados por um homem de palavras suaves que os desviou.',
    question: 'Provérbios adverte sobre pessoas de palavras lisonjeiras. Qual é o perigo da lisonja segundo a Bíblia?',
    options: [
      'Nos faz felizes demais',
      'Arma uma rede aos nossos pés',
      'Nos torna famosos',
      'Nos faz ricos'
    ],
    correctIndex: 1,
    bibleReference: 'Provérbios 29:5',
    explanation: '"O homem que lisonjeia o próximo arma uma rede aos seus pés." A lisonja é uma armadilha disfarçada de elogio.',
    timerSeconds: 40,
    narrativeLink: 'fase5-cena11'
  },
  {
    id: 'q-p-014', difficulty: 'peregrino',
    context: 'O Rio da Morte separava os peregrinos da Cidade Celestial. Cristão afundou quase até o fundo, cheio de medo.',
    question: 'Qual versículo Paulo escreveu sobre a morte que se aplica à travessia do rio por Cristão?',
    options: [
      '"O salário do pecado é a morte" (Rm 6:23)',
      '"Onde está, ó morte, a tua vitória?" (1 Co 15:55)',
      '"Todos pecaram" (Rm 3:23)',
      '"O justo viverá pela fé" (Rm 1:17)'
    ],
    correctIndex: 1,
    bibleReference: '1 Coríntios 15:55',
    explanation: 'A morte foi vencida por Cristo. Mesmo afundando no rio, Cristão emergiu do outro lado — na eternidade.',
    timerSeconds: 40,
    narrativeLink: 'fase6-cena2'
  },
  {
    id: 'q-p-015', difficulty: 'peregrino',
    context: 'Pequena-Fé foi assaltado por três ladrões — Tímido, Desconfiança e Culpa — que roubaram seu dinheiro mas não conseguiram tomar seu pergaminho.',
    question: 'O que este episódio ensina sobre a segurança eterna do crente?',
    options: [
      'Que podemos perder a salvação facilmente',
      'Que podemos perder a paz e a alegria, mas não a salvação em si',
      'Que ladrões são mais fortes que Deus',
      'Que a fé pequena não vale nada'
    ],
    correctIndex: 1,
    bibleReference: 'João 10:28-29',
    explanation: '"Ninguém pode arrebatá-las da minha mão." O inimigo pode roubar nossa paz temporariamente, mas não pode tirar nossa salvação.',
    timerSeconds: 45
  },
  {
    id: 'q-p-016', difficulty: 'peregrino',
    context: 'O País de Beulá era um lugar de beleza e paz próximo à Cidade Celestial, onde os peregrinos podiam ver a cidade ao longe.',
    question: 'O nome "Beulá" vem de Isaías e significa:',
    options: ['Paraíso', 'Desposada/Casada', 'Sagrada', 'Iluminada'],
    correctIndex: 1,
    bibleReference: 'Isaías 62:4',
    explanation: '"A tua terra se chamará Beulá (Desposada)." Representa a intimidade crescente com Deus à medida que nos aproximamos d\'Ele.',
    timerSeconds: 40
  },
  {
    id: 'q-p-017', difficulty: 'peregrino',
    context: 'Cristão e Esperança foram recebidos na Cidade Celestial com trombetas, cânticos e vestes de ouro.',
    question: 'Em 1 Tessalonicenses 4, Paulo descreve a vinda de Cristo. O que acompanhará sua chegada?',
    options: [
      'Silêncio total',
      'Palavra de ordem, voz de arcanjo e trombeta de Deus',
      'Um terremoto global',
      'Uma chuva de estrelas'
    ],
    correctIndex: 1,
    bibleReference: '1 Tessalonicenses 4:16',
    explanation: 'A chegada à Cidade Celestial será acompanhada de trombetas e glória — exatamente como Bunyan descreveu.',
    timerSeconds: 40
  },
  {
    id: 'q-p-018', difficulty: 'peregrino',
    context: 'Cristão deixou sua família na Cidade da Destruição. Eles pensaram que ele estava louco.',
    question: 'Jesus disse que veio trazer divisão. O que Ele quis dizer com isso?',
    options: [
      'Que devemos brigar com a família',
      'Que seguir a Cristo pode custar relacionamentos quando outros rejeitam a verdade',
      'Que a família não importa',
      'Que devemos abandonar todos'
    ],
    correctIndex: 1,
    bibleReference: 'Lucas 12:51-53',
    explanation: 'Seguir Cristo tem um custo relacional quando entes queridos rejeitam o evangelho. Cristão experimentou isso.',
    timerSeconds: 45
  },
  {
    id: 'q-p-019', difficulty: 'peregrino',
    context: 'O Monte Sinai tremia e lançava fogo quando Cristão se aproximou, fazendo-o temer pela vida.',
    question: 'O Monte Sinai representa a Lei de Deus. Por que a Lei fazia Cristão tremer de medo?',
    options: [
      'Porque a Lei era injusta',
      'Porque a Lei mostra nosso pecado e nossa condenação sem Cristo',
      'Porque Moisés era severo',
      'Porque o monte era muito alto'
    ],
    correctIndex: 1,
    bibleReference: 'Gálatas 3:10',
    explanation: '"Maldito todo aquele que não permanece em todas as coisas escritas no livro da Lei." Sem Cristo, a Lei só condena.',
    timerSeconds: 45,
    narrativeLink: 'cena10'
  },
  {
    id: 'q-p-020', difficulty: 'peregrino',
    context: 'Cristão encontrou Fiel no caminho. Fiel contou que quase foi seduzido por uma mulher chamada Lascívia.',
    question: 'Qual personagem bíblico fugiu literalmente da sedução de uma mulher, deixando sua capa para trás?',
    options: ['Davi', 'Sansão', 'José do Egito', 'Salomão'],
    correctIndex: 2,
    bibleReference: 'Gênesis 39:12',
    explanation: 'José fugiu da esposa de Potifar. A Bíblia nos manda fugir da imoralidade, não negociar com ela.',
    timerSeconds: 35
  },

  // ═══════ VETERANO (25+) ═══════
  // Perguntas profundas, teológicas, requerem estudo
  {
    id: 'q-v-001', difficulty: 'veterano',
    context: 'Na alegoria de Bunyan, Cristão carregou seu fardo desde a Cidade da Destruição até a Cruz. O fardo representa a convicção de pecado.',
    question: 'Qual conceito teológico descreve o ato de Deus declarar o pecador justo com base na obra de Cristo, não em mérito próprio?',
    options: ['Santificação', 'Regeneração', 'Justificação pela fé', 'Glorificação'],
    correctIndex: 2,
    bibleReference: 'Romanos 3:24',
    explanation: 'A justificação pela fé é o ato judicial de Deus que declara justo aquele que crê. O fardo caiu na Cruz porque ali Cristo pagou a dívida.',
    timerSeconds: 60,
    narrativeLink: 'cena15'
  },
  {
    id: 'q-v-002', difficulty: 'veterano',
    context: 'Bunyan escreveu O Peregrino enquanto estava preso. Sua fé foi testada no cárcere por 12 anos.',
    question: 'Em qual prisão e por qual motivo John Bunyan foi preso?',
    options: [
      'Torre de Londres, por traição',
      'Prisão de Bedford, por pregar sem licença da Igreja Anglicana',
      'Prisão de Newgate, por heresia',
      'Prisão de Oxford, por escrever livros proibidos'
    ],
    correctIndex: 1,
    bibleReference: '2 Timóteo 2:9',
    explanation: 'Bunyan foi preso por pregar o evangelho sem autorização oficial. Como Paulo, a Palavra de Deus não pode ser acorrentada.',
    timerSeconds: 60
  },
  {
    id: 'q-v-003', difficulty: 'veterano',
    context: 'Bunyan estruturou a jornada de Cristão como uma peregrinação individual, onde cada desafio testa um aspecto diferente da fé.',
    question: 'O conceito de "peregrinação" como metáfora da vida cristã aparece em qual epístola e de que forma?',
    options: [
      'Romanos — os cristãos são atletas',
      'Hebreus 11:13-16 — os patriarcas se declararam "peregrinos e estrangeiros na terra", buscando uma pátria celestial',
      'Gálatas — os cristãos são soldados',
      '1 Pedro — os cristãos são sacerdotes'
    ],
    correctIndex: 1,
    bibleReference: 'Hebreus 11:13-16',
    explanation: 'Bunyan fundamentou toda sua alegoria nesta metáfora bíblica: somos peregrinos rumo à pátria celestial, "estrangeiros e peregrinos sobre a terra."',
    timerSeconds: 60
  },
  {
    id: 'q-v-004', difficulty: 'veterano',
    context: 'O Castelo da Dúvida era governado pelo Gigante Desespero e sua esposa Desconfiança. Cristão ficou preso lá por dias.',
    question: 'Qual doutrina bíblica a "chave da Promessa" que libertou Cristão melhor exemplifica?',
    options: [
      'A doutrina da providência',
      'A perseverança dos santos — as promessas de Deus garantem que Ele completará a obra',
      'A doutrina da eleição',
      'A doutrina da criação'
    ],
    correctIndex: 1,
    bibleReference: 'Filipenses 1:6',
    explanation: '"Aquele que começou a boa obra em vós há de completá-la." As promessas de Deus são a chave contra o desespero.',
    timerSeconds: 60,
    narrativeLink: 'fase5-cena7'
  },
  {
    id: 'q-v-005', difficulty: 'veterano',
    context: 'Ignorância foi levado para o inferno mesmo estando diante dos portões da Cidade Celestial, porque não tinha o pergaminho.',
    question: 'Jesus falou sobre pessoas que fariam milagres em Seu nome mas seriam rejeitadas. Em qual passagem e o que Ele dirá?',
    options: [
      'Lucas 13:27 — "Não sei de onde vocês são"',
      'Mateus 7:21-23 — "Nunca vos conheci; apartai-vos de mim"',
      'João 3:3 — "É necessário nascer de novo"',
      'Marcos 10:21 — "Vai, vende tudo"'
    ],
    correctIndex: 1,
    bibleReference: 'Mateus 7:21-23',
    explanation: 'Não basta parecer cristão. É preciso ter um relacionamento genuíno com Cristo. Ignorância tinha aparência de piedade sem realidade.',
    timerSeconds: 60
  },
  {
    id: 'q-v-006', difficulty: 'veterano',
    context: 'Cristão foi tentado por Demas a entrar na mina de prata Lucro. Demas era descendente de Geazi e Judas.',
    question: 'Geazi, servo de Eliseu, foi punido com lepra por sua ganância. O que especificamente ele fez?',
    options: [
      'Roubou ofertas do templo',
      'Correu atrás de Naamã para pedir presentes que Eliseu havia recusado',
      'Vendeu segredos do profeta',
      'Cobrou pelo milagre de Eliseu'
    ],
    correctIndex: 1,
    bibleReference: '2 Reis 5:20-27',
    explanation: 'Geazi cobiçou o que Deus deu de graça. Demas representa a ganância que corrompe mesmo aqueles que estão perto dos servos de Deus.',
    timerSeconds: 60
  },
  {
    id: 'q-v-007', difficulty: 'veterano',
    context: 'Na visão do fogo atrás da parede, o Intérprete mostrou que Cristo sustenta a graça no coração contra os ataques do diabo.',
    question: 'Qual heresia do século IV negava a divindade plena de Cristo, e por que isso seria fatal para a alegoria de Bunyan?',
    options: [
      'Pelagianismo — negava o pecado original',
      'Arianismo — Cristo seria uma criatura, não podendo sustentar a graça como Deus',
      'Gnosticismo — negava a humanidade de Cristo',
      'Docetismo — Cristo só parecia humano'
    ],
    correctIndex: 1,
    bibleReference: 'Colossenses 2:9',
    explanation: 'Se Cristo não fosse plenamente Deus, não poderia sustentar eternamente a graça no coração do crente. A divindade de Cristo é essencial.',
    timerSeconds: 75
  },
  {
    id: 'q-v-008', difficulty: 'veterano',
    context: 'O Peregrino de Bunyan é considerado o segundo livro mais vendido da história, depois da Bíblia.',
    question: 'Em qual tradição teológica Bunyan se inseria, e como isso influenciou sua visão da salvação na alegoria?',
    options: [
      'Anglicanismo liberal — salvação universal',
      'Puritanismo calvinista — ênfase na graça soberana, eleição e perseverança dos santos',
      'Catolicismo medieval — salvação por sacramentos',
      'Arminianismo — ênfase na livre vontade humana'
    ],
    correctIndex: 1,
    bibleReference: 'Efésios 1:4-5',
    explanation: 'Bunyan era um pastor batista puritano. Sua teologia enfatizava a graça soberana de Deus, refletida em cada aspecto da jornada de Cristão.',
    timerSeconds: 75
  },
  {
    id: 'q-v-009', difficulty: 'veterano',
    context: 'Quando Cristão e Fiel passaram pela Feira da Vaidade, eles foram perseguidos por não comprarem as mercadorias mundanas.',
    question: 'Bunyan baseou a Feira da Vaidade em três referências bíblicas sobre os desejos do mundo. Quais são?',
    options: [
      'Gn 3:6, Mt 4:8-9, 1 Jo 2:16',
      'Rm 1:18, Gl 5:19, Ap 17:4',
      'Pv 7:10, Ec 1:2, Is 55:2',
      'Jr 17:9, Ez 28:13, Dn 4:30'
    ],
    correctIndex: 0,
    bibleReference: '1 João 2:16',
    explanation: 'A concupiscência da carne (Gn 3:6), a concupiscência dos olhos (Mt 4:8-9) e a soberba da vida (1 Jo 2:16) — os três eixos da tentação mundana.',
    timerSeconds: 75
  },
  {
    id: 'q-v-010', difficulty: 'veterano',
    context: 'Cristão atravessou o Vale da Sombra da Morte, onde até sua própria voz parecia proferir blasfêmias que vinham dos demônios.',
    question: 'Qual estratégia satânica específica este episódio ilustra, e como Martinho Lutero descreveu esta mesma experiência?',
    options: [
      'Possessão demoníaca — Lutero fez exorcismo',
      'Acusação — Satanás planta pensamentos blasfemos para fazer o crente duvidar da própria fé. Lutero chamou de Anfechtung',
      'Tentação carnal — Lutero jejuou',
      'Ilusão visual — Lutero orou em latim'
    ],
    correctIndex: 1,
    bibleReference: 'Apocalipse 12:10',
    explanation: 'Satanás é o "acusador dos irmãos." Anfechtung (assalto espiritual) é quando o crente é assaltado por dúvidas e blasfêmias que não são suas.',
    timerSeconds: 75
  },
  {
    id: 'q-v-011', difficulty: 'veterano',
    context: 'A jornada de Cristão passa por estágios que correspondem à doutrina reformada da "ordo salutis" (ordem da salvação).',
    question: 'Coloque em ordem correta os estágios da ordo salutis reformada:',
    options: [
      'Justificação → Regeneração → Chamado → Santificação → Glorificação',
      'Chamado eficaz → Regeneração → Fé/Arrependimento → Justificação → Santificação → Glorificação',
      'Fé → Batismo → Obras → Perseverança → Céu',
      'Eleição → Predestinação → Salvação → Obras → Morte'
    ],
    correctIndex: 1,
    bibleReference: 'Romanos 8:30',
    explanation: '"Os que predestinou, também chamou; os que chamou, também justificou; os que justificou, também glorificou." A jornada de Cristão espelha esta ordem.',
    timerSeconds: 90
  },
  {
    id: 'q-v-012', difficulty: 'veterano',
    context: 'Cristão perdeu a paz mas não perdeu a salvação quando foi preso no Castelo da Dúvida.',
    question: 'Qual a diferença teológica entre a "segurança da salvação" (certeza subjetiva) e a "perseverança dos santos" (realidade objetiva)?',
    options: [
      'São a mesma coisa',
      'Segurança é o sentimento de estar salvo (pode oscilar); perseverança é a garantia de Deus de que completará a obra (nunca falha)',
      'Segurança é para todos; perseverança é só para pastores',
      'Perseverança depende de nós; segurança depende de Deus'
    ],
    correctIndex: 1,
    bibleReference: 'Romanos 8:38-39',
    explanation: 'Cristão perdeu sua segurança subjetiva no Castelo, mas nunca perdeu sua salvação objetiva. As promessas de Deus são irrevogáveis.',
    timerSeconds: 75
  },
  {
    id: 'q-v-013', difficulty: 'veterano',
    context: 'Bunyan descreve a Cruz como o lugar onde o fardo cai. O fardo não é removido gradualmente — cai de uma vez.',
    question: 'Isto reflete qual aspecto da doutrina da justificação que os reformadores enfatizavam contra Roma?',
    options: [
      'A justificação é um processo gradual de santificação',
      'A justificação é um ato declarativo instantâneo — Deus declara justo o pecador no momento da fé',
      'A justificação depende de penitências',
      'A justificação é conferida pelo batismo'
    ],
    correctIndex: 1,
    bibleReference: 'Romanos 5:1',
    explanation: '"Justificados pela fé, temos paz com Deus." A justificação não é progressiva (isso é santificação) — é instantânea e completa.',
    timerSeconds: 75
  },
  {
    id: 'q-v-014', difficulty: 'veterano',
    context: 'Os pastores das Montanhas Deleitosas mostraram quatro vistas: o Erro, a Precaução, o Abismo e a Porta da Cidade.',
    question: 'Em termos de ofícios bíblicos, qual é a tríplice função pastoral que estes pastores exercem?',
    options: [
      'Profeta, Sacerdote e Rei',
      'Ensinar, governar e pastorear (alimentar, proteger e guiar o rebanho)',
      'Pregar, cantar e administrar',
      'Evangelizar, batizar e comungar'
    ],
    correctIndex: 1,
    bibleReference: '1 Pedro 5:2-3',
    explanation: 'Os pastores alimentam (ensinar), protegem (alertar contra erros) e guiam (mostrar o destino). As quatro vistas exemplificam estas funções.',
    timerSeconds: 60
  },
  {
    id: 'q-v-015', difficulty: 'veterano',
    context: 'Vigilante, o porteiro do Palácio Belo, acolheu Cristão e chamou as donzelas Prudência, Piedade e Caridade para ensiná-lo.',
    question: 'As donzelas fizeram perguntas profundas a Cristão antes de recebê-lo. Qual princípio eclesiológico isso reflete?',
    options: [
      'Que a igreja deve rejeitar novos membros',
      'Que a igreja deve examinar a fé dos que buscam comunhão, discernindo a sinceridade do arrependimento antes de acolher',
      'Que a igreja é apenas para pessoas perfeitas',
      'Que a igreja deve aceitar todos sem questionamento'
    ],
    correctIndex: 1,
    bibleReference: 'Atos 2:41-42',
    explanation: 'As donzelas representam o discipulado pastoral: examinar, ensinar e fortalecer. A igreja primitiva devotava-se ao ensino antes de acolher plenamente.',
    timerSeconds: 60
  },
  {
    id: 'q-v-016', difficulty: 'veterano',
    context: 'Bunyan usa alegorias onde personagens TÊM nomes que definem seu caráter: Cristão, Fiel, Esperança, Ignorância.',
    question: 'Este recurso literário tem um nome técnico. Qual é, e qual outro autor puritano famoso o utilizou extensivamente?',
    options: [
      'Metáfora — C.S. Lewis',
      'Nomes alegóricos (personificação) — era recurso comum nos morality plays medievais e usado por Edmund Spenser em "A Rainha das Fadas"',
      'Pseudônimo — John Milton',
      'Alegoria — William Shakespeare'
    ],
    correctIndex: 1,
    bibleReference: 'Provérbios 1:20',
    explanation: 'Bunyan herdou esta tradição dos morality plays e de Spenser. A Sabedoria personificada em Provérbios é um precedente bíblico deste recurso.',
    timerSeconds: 75
  },
  {
    id: 'q-v-017', difficulty: 'veterano',
    context: 'Apolion citou os pecados passados de Cristão para desencorajá-lo. "Você já me serviu. Você é infiel."',
    question: 'Qual é a diferença bíblica entre a convicção do Espírito Santo e a condenação/acusação de Satanás?',
    options: [
      'Não há diferença, ambos apontam o pecado',
      'O Espírito convence de pecado específico levando ao arrependimento e esperança; Satanás acusa genericamente levando ao desespero e paralisação',
      'O Espírito é mais brando; Satanás é mais direto',
      'O Espírito atua na mente; Satanás no corpo'
    ],
    correctIndex: 1,
    bibleReference: 'João 16:8 e Apocalipse 12:10',
    explanation: 'O Espírito convence para restaurar; Satanás acusa para destruir. Apolion queria destruir Cristão com condenação, não levá-lo ao arrependimento.',
    timerSeconds: 75
  },
  {
    id: 'q-v-018', difficulty: 'veterano',
    context: 'O rio que separava os peregrinos da Cidade Celestial não tinha ponte. A profundidade variava conforme a fé do peregrino.',
    question: 'Bunyan faz a profundidade da água variar com a fé. Qual doutrina sobre a morte cristã isso reflete?',
    options: [
      'Que a morte é igual para todos',
      'Que a experiência da morte varia — para o crente confiante, é um sono; para o crente duvidoso, é terrificante, mas ambos chegam ao outro lado',
      'Que alguns não morrem',
      'Que a fé elimina a morte'
    ],
    correctIndex: 1,
    bibleReference: 'Filipenses 1:21',
    explanation: '"Para mim, o viver é Cristo e o morrer é lucro." A morte física é inevitável, mas a experiência dela é transformada pela fé.',
    timerSeconds: 75
  },
  {
    id: 'q-v-019', difficulty: 'veterano',
    context: 'Cristão recebeu três selos na Cruz: o perdão (marca na testa), as vestes novas e o pergaminho.',
    question: 'Estes três presentes correspondem a quais três aspectos da salvação na teologia reformada?',
    options: [
      'Perdão, santificação e glorificação — passado, presente e futuro da salvação',
      'Fé, esperança e caridade',
      'Batismo, ceia e confirmação',
      'Oração, jejum e esmola'
    ],
    correctIndex: 0,
    bibleReference: 'Romanos 8:30',
    explanation: 'A marca = justificação (perdão passado). As vestes = santificação (vida nova presente). O pergaminho = glorificação (garantia futura).',
    timerSeconds: 75
  },
  {
    id: 'q-v-020', difficulty: 'veterano',
    context: 'A Terra Encantada, perto do fim da jornada, fazia os peregrinos adormecerem. Quanto mais perto do destino, maior o perigo.',
    question: 'Qual advertência apostólica se aplica diretamente à Terra Encantada, e por que a apatia espiritual é mais perigosa perto do fim?',
    options: [
      'Gálatas 6:9 — "Não nos cansemos de fazer o bem, pois no tempo certo colheremos, se não desanimarmos"',
      '1 Coríntios 9:27 — "Esmurro o meu corpo e o reduzo à escravidão, para que, tendo pregado a outros, não venha eu mesmo a ser desqualificado"',
      'Ambos se aplicam',
      'Nenhum se aplica'
    ],
    correctIndex: 2,
    bibleReference: 'Gálatas 6:9 e 1 Coríntios 9:27',
    explanation: 'Perto do fim, o perigo de relaxar é maior. A apatia espiritual é o último ataque do inimigo contra quem quase completou a corrida.',
    timerSeconds: 75
  },
];
