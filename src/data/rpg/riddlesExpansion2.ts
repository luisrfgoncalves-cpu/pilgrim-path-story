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
];
