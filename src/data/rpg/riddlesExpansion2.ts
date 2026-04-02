import { Riddle } from './types';

// ═══════════════════════════════════════════════════════
// EXPANSÃO DE CHARADAS — LOTE 3
// Meta: atingir 300+ itens totais no banco de conteúdo
// ═══════════════════════════════════════════════════════

export const riddlesExpansion2: Riddle[] = [
  // ═══════ APRENDIZ — LOTE 3 ═══════
  {
    id: 'r-a-020', difficulty: 'aprendiz',
    context: 'Cristão recebeu algo no Palácio Belo que foi essencial para sobreviver...',
    riddle: 'Não sou de ferro, mas protejo. Não sou de tecido, mas visto. Sou completa, e quem me usa inteira não é ferido. Mas se faltar uma peça, o inimigo encontra brecha. O que sou?',
    hints: ['Paulo escreveu sobre mim', 'Tenho 6 peças', 'Cristão me recebeu antes de enfrentar Apolião'],
    answer: 'A Armadura de Deus (Efésios 6)',
    bibleReference: 'Efésios 6:11', explanation: '"Revesti-vos de toda a armadura de Deus." TODA — nenhuma peça é opcional.', timerSeconds: 40,
  },
  {
    id: 'r-a-021', difficulty: 'aprendiz',
    context: 'Na história, há um lugar de descanso após muita luta...',
    riddle: 'Sou belo por fora e seguro por dentro. Tenho donzelas que ensinam e um quarto chamado Paz. Antes de mim há uma colina dura, depois de mim há um vale sombrio. O que sou?',
    hints: ['Sou um edifício no caminho do peregrino', 'Cristão descansou em mim', 'Meu nome reflete minha aparência'],
    answer: 'O Palácio Belo',
    bibleReference: 'Salmos 27:4', explanation: '"Uma coisa pedi ao Senhor: habitar na casa do Senhor todos os dias da minha vida." O Palácio Belo representa a igreja — lugar de ensino, comunhão e preparo.', timerSeconds: 40,
  },
  {
    id: 'r-a-022', difficulty: 'aprendiz',
    context: 'Um companheiro de viagem falava muito sobre Deus, mas algo estava errado...',
    riddle: 'Minha boca é cheia de Deus, mas meu coração está vazio. Sei citar versículos, mas não os vivo. Uma pergunta simples me desmascara. Quem sou?',
    hints: ['Fiel me descobriu', 'Meu nome descreve o que faço', 'Falar é fácil, viver é difícil'],
    answer: 'Falador',
    bibleReference: 'Tiago 1:22', explanation: '"Sede praticantes da palavra e não somente ouvintes." Falador é o cristão nominal — muita teoria, zero prática.', timerSeconds: 35,
  },

  // ═══════ PEREGRINO — LOTE 3 ═══════
  {
    id: 'r-p-016', difficulty: 'peregrino',
    context: 'Na Feira da Vaidade, algo dramático aconteceu com um dos companheiros de Cristão...',
    riddle: 'Fui condenado por um júri de vícios. Morri em praça pública. Mas minha morte foi minha maior vitória — uma carruagem me buscou antes que a dor terminasse. Quem sou?',
    hints: ['Sou amigo de Cristão', 'Meu nome é uma virtude', 'Paulo disse que morrer é lucro'],
    answer: 'Fiel — que foi martirizado na Feira da Vaidade e levado ao céu',
    bibleReference: 'Apocalipse 2:10', explanation: '"Sê fiel até à morte e dar-te-ei a coroa da vida." A morte de Fiel é o retrato do martírio cristão — perda terrena, ganho eterno.', timerSeconds: 50,
  },
  {
    id: 'r-p-017', difficulty: 'peregrino',
    context: 'Um gigante capturou peregrinos e os trancou em seu castelo...',
    riddle: 'Sou grande, sou forte, mas uma chave me derrota. Minha esposa me aconselha o mal. Meu nome é o que causo. Uma noite de oração me enfraquece. Quem sou?',
    hints: ['Moro em um castelo', 'Meu nome é um sentimento', 'Uma chave chamada Promessa me vence'],
    answer: 'O Gigante Desespero — vencido pela chave da Promessa de Deus',
    bibleReference: '2 Coríntios 1:20', explanation: '"Todas as promessas de Deus são SIM e AMÉM." O desespero é um gigante, mas as promessas de Deus são mais fortes.', timerSeconds: 50,
  },
  {
    id: 'r-p-018', difficulty: 'peregrino',
    context: 'No Vale da Sombra da Morte, Cristão ouviu coisas perturbadoras...',
    riddle: 'Não sou real, mas pareço verdadeiro. Entro pela mente, não pelos ouvidos. Faço o santo pensar que é ímpio. O que sou?',
    hints: ['Cristão ouviu vozes no Vale', 'Não eram dele, mas pareciam ser', 'Satanás é mestre nisso'],
    answer: 'Pensamentos blasfemos soprados pelo inimigo — que parecem nossos, mas não são',
    bibleReference: '2 Coríntios 10:5', explanation: '"Levando cativo todo pensamento à obediência de Cristo." Nem todo pensamento que entra na mente é nosso. Discernir a origem é sabedoria.', timerSeconds: 55,
  },

  // ═══════ VETERANO — LOTE 3 ═══════
  {
    id: 'r-v-021', difficulty: 'veterano',
    context: 'Bunyan criou um personagem que é talvez o mais trágico de toda a obra...',
    riddle: 'Caminhei o caminho inteiro sem nunca ter entrado pela porta. Cheguei à Cidade e bati com confiança. Mas os anjos me levaram — não para cima, mas para o portão no lado da colina. A porta do céu tem uma porta para o inferno. Quem sou e qual é a lição mais terrível do livro?',
    hints: ['Meu nome é o oposto de sabedoria', 'Entrei no caminho por um atalho', 'Sou o último personagem mencionado'],
    answer: 'Ignorância — que foi levado ao inferno APÓS chegar à porta do céu. A lição: proximidade com Deus não é intimidade com Deus.',
    bibleReference: 'Mateus 7:21-23', explanation: '"Nunca vos conheci." A tragédia de Ignorância é que ele ACREDITAVA genuinamente que estava salvo. Auto-engano espiritual é o erro mais fatal.', timerSeconds: 70,
  },
  {
    id: 'r-v-022', difficulty: 'veterano',
    context: 'Bunyan usou um recurso literário que conecta sua obra ao mais antigo livro da literatura mundial...',
    riddle: 'Uma jornada que transforma. Obstáculos que testam. Companheiros que ensinam. Inimigos que tentam. Um lar que é destino. Sou a estrutura de duas grandes obras — uma grega, uma inglesa. Que estrutura sou?',
    hints: ['Homero usou essa estrutura', 'Bunyan também, séculos depois', 'É uma estrutura narrativa clássica'],
    answer: 'A Jornada do Herói (monomito) — estrutura presente na Odisseia e em O Peregrino',
    bibleReference: 'Hebreus 11:13-16', explanation: 'Os heróis da fé são todos "peregrinos e estrangeiros na terra." A estrutura da jornada é universal porque reflete a condição humana — somos todos viajantes em busca de um lar.', timerSeconds: 65,
  },
  {
    id: 'r-v-023', difficulty: 'veterano',
    context: 'No livro, há um personagem que representa algo que todo cristão deve ter mas poucos cultivam...',
    riddle: 'Meu nome é o que sustento. Sem mim, Cristão teria se afogado no Rio. Com mim, o rio ficou mais raso. Fui o companheiro final. Na teologia, sou uma das três virtudes teologais. Quem sou?',
    hints: ['Sou o último companheiro de Cristão', 'Meu nome é uma virtude bíblica', 'Paulo me menciona em 1 Coríntios 13:13'],
    answer: 'Esperança — a virtude teologal que sustenta na travessia da morte',
    bibleReference: 'Romanos 5:5', explanation: '"A esperança não decepciona." Esperança não é otimismo humano — é certeza divina de que o que Deus prometeu, cumprirá.', timerSeconds: 60,
  },

  // ═══════ APRENDIZ — LOTE 4 ═══════
  {
    id: 'r-a-024', difficulty: 'aprendiz',
    context: 'Dois animais guardavam a entrada de um lugar seguro...',
    riddle: 'Rugimos com força, mas não podemos morder. Assustamos quem passa, mas somos prisioneiros. Nosso mestre nos acorrentou para testar os corajosos. Quem somos e o que ensinamos?',
    hints: ['Estamos na porta do Palácio Belo', 'Somos dois', 'Cristão teve medo de nós'],
    answer: 'Os dois leões acorrentados — que representam o medo: parece real, mas não pode ferir quem avança com fé',
    bibleReference: '1 Pedro 5:8-9', explanation: 'O diabo ruge como leão, mas está acorrentado pelo poder de Deus. O medo é a corrente que ele usa para nos parar — mas não tem dentes reais contra quem avança em fé.', timerSeconds: 40,
  },
  {
    id: 'r-a-025', difficulty: 'aprendiz',
    context: 'Algo misterioso aconteceu ao pé de uma cruz antiga...',
    riddle: 'Carregado por anos, perdido em segundos. Não foi tirado — caiu. Não foi jogado — rolou. Entrou num buraco e nunca mais voltou. O que aconteceu?',
    hints: ['Aconteceu ao pé da Cruz', 'Era algo que Cristão carregava', 'Desapareceu dentro de um sepulcro'],
    answer: 'O fardo do pecado de Cristão caiu e rolou para dentro do sepulcro ao pé da Cruz',
    bibleReference: 'Colossenses 2:14', explanation: '"Tendo cancelado o escrito de dívida que era contra nós... cravando-o na cruz." O fardo não foi removido por esforço — caiu pela graça.', timerSeconds: 35,
  },

  // ═══════ PEREGRINO — LOTE 4 ═══════
  {
    id: 'r-p-019', difficulty: 'peregrino',
    context: 'Na Casa do Intérprete, um cômodo cheio de pó quase sufocou todos...',
    riddle: 'Quanto mais me varrem, mais sufoco. Quanto mais me limpam com força, mais cresço. Só uma coisa me acalma — e não é esforço. O que sou e o que me vence?',
    hints: ['Estou em uma sala do Intérprete', 'A vassoura sou a Lei', 'O que me vence é líquido'],
    answer: 'O pecado (a poeira) — vencido pela água do evangelho, não pela vassoura da Lei',
    bibleReference: 'Romanos 3:20', explanation: '"Pela lei vem o conhecimento do pecado" — mas não a limpeza. Só o evangelho (a água da graça) limpa de verdade. A Lei mostra a sujeira; a graça a remove.', timerSeconds: 50,
  },
  {
    id: 'r-p-020', difficulty: 'peregrino',
    context: 'Um personagem entrou no caminho pela porta errada e chegou ao destino final...',
    riddle: 'Andei o caminho certo, mas não entrei pela porta certa. Cheguei ao final, mas não tinha a chave. Bati com confiança, mas ninguém me conhecia. Minha história é a mais triste de todas. Quem sou e por que sou triste?',
    hints: ['Sou o último personagem do livro', 'Meu nome é o oposto de sabedoria', 'Cheguei ao céu mas fui levado ao inferno'],
    answer: 'Ignorância — que foi levado ao inferno após chegar à porta da Cidade Celestial, porque nunca passou pela Porta Estreita (Cristo)',
    bibleReference: 'Mateus 7:21-23', explanation: '"Nunca vos conheci." A história de Ignorância é um aviso eterno: religiosidade sem regeneração é a tragédia suprema.', timerSeconds: 55,
  },

  // ═══════ VETERANO — LOTE 4 ═══════
  {
    id: 'r-v-024', difficulty: 'veterano',
    context: 'Bunyan construiu sua obra sobre uma estrutura que conecta o Antigo e o Novo Testamento...',
    riddle: 'Israel saiu do Egito (Cidade da Destruição), atravessou o Mar Vermelho (a Cruz), vagou no deserto (os Vales), recebeu a Lei no Sinai (desvio de Sabedoria Mundana), e entrou em Canaã (Cidade Celestial). Que princípio hermenêutico Bunyan usou para construir O Peregrino?',
    hints: ['É um método de interpretação bíblica', 'Conecta AT e NT', 'Cada evento histórico prefigura uma realidade espiritual'],
    answer: 'A tipologia bíblica — onde eventos do Antigo Testamento são "tipos" (sombras) de realidades do Novo Testamento e da vida cristã',
    bibleReference: '1 Coríntios 10:11', explanation: '"Estas coisas aconteceram como exemplo e foram escritas para advertência nossa." Bunyan leu toda a Escritura como um mapa espiritual — e criou O Peregrino como sua aplicação prática.', timerSeconds: 70,
  },
  {
    id: 'r-v-025', difficulty: 'veterano',
    context: 'Um elemento literário sutil percorre TODO o livro de O Peregrino...',
    riddle: 'Estou no início e no fim. Começo na caverna e termino na caverna. Tudo que aconteceu foi dentro de mim. Sou o recurso literário mais antigo da humanidade. O que sou?',
    hints: ['Bunyan dormiu e me teve', 'José no AT era famoso por me interpretar', 'Sou o enquadramento narrativo do livro inteiro'],
    answer: 'O sonho — toda a história de O Peregrino é contada como um sonho de Bunyan, enquadrada por uma narrativa de vigília',
    bibleReference: 'Joel 2:28', explanation: '"Vossos velhos sonharão sonhos." O sonho como recurso literário dá a Bunyan liberdade para a alegoria — e conecta com a tradição bíblica de revelação através de sonhos (José, Daniel, João em Apocalipse).', timerSeconds: 65,
  },
];

