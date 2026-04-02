import { BossEncounter } from './types';

// ═══════════════════════════════════════════════════════
// CONFRONTOS COM ANTAGONISTAS (BOSSES)
// Batalhas temáticas épicas em múltiplas fases
// ═══════════════════════════════════════════════════════

export const bossEncounters: BossEncounter[] = [
  {
    id: 'boss-001', difficulty: 'aprendiz',
    bossName: 'Apolion, o Destruidor',
    narrative: '⚔️ O chão treme! Das sombras do Vale da Humilhação surge uma criatura terrível — escamas de dragão, asas de morcego, boca de leão e olhos de fogo! É APOLION, o anjo do abismo! Ele bloqueia o caminho e ruge: "VOCÊS SÃO MEUS! JÁ ME SERVIRAM ANTES! VOLTEM OU SERÃO DESTRUÍDOS!"',
    phases: [
      {
        description: '🔥 Apolion lança dardos inflamados contra vocês! Ele grita: "Vocês são fracos demais para este caminho!"',
        question: 'Qual peça da armadura de Deus apaga os dardos inflamados do maligno?',
        options: ['O capacete da salvação', 'A couraça da justiça', 'O escudo da fé', 'O cinto da verdade'],
        correctIndex: 2,
        timerSeconds: 30,
        failPenalty: { type: 'penalty', attribute: 'coragem', amount: -2 }
      },
      {
        description: '😈 Apolion lista os pecados do passado de vocês: "Eu sei o que vocês fizeram! Vocês não merecem o perdão do Rei!"',
        question: 'Qual versículo responde à acusação de Apolion sobre nossos pecados passados?',
        options: [
          '"Não há condenação para os que estão em Cristo Jesus" (Rm 8:1)',
          '"Sede fortes e corajosos" (Js 1:9)',
          '"Tudo posso naquele que me fortalece" (Fp 4:13)',
          '"O Senhor é meu pastor" (Sl 23:1)'
        ],
        correctIndex: 0,
        timerSeconds: 30,
        failPenalty: { type: 'penalty', attribute: 'fe', amount: -2 }
      },
      {
        description: '⚔️ Apolion avança para o golpe final! Cristão caiu de joelhos mas agarrou a espada! É agora ou nunca!',
        question: 'A "Espada do Espírito" em Efésios 6:17 é:',
        options: ['A oração fervorosa', 'A Palavra de Deus', 'O louvor a Deus', 'A comunhão dos santos'],
        correctIndex: 1,
        timerSeconds: 25,
        failPenalty: { type: 'retreat', positions: 3 }
      }
    ],
    defeatNarrative: '💀 Apolion rugiu em triunfo temporário! Vocês recuaram feridos, mas não derrotados. A batalha continua...',
    victoryNarrative: '🏆 COM UM GOLPE DA ESPADA DO ESPÍRITO, APOLION FOI FERIDO E FUGIU! Folhas curativas caíram da Árvore da Vida! Vocês estão restaurados! "Em todas estas coisas somos MAIS QUE VENCEDORES!" (Rm 8:37)',
    bibleReference: 'Apocalipse 9:11 e Efésios 6:10-18'
  },
  {
    id: 'boss-002', difficulty: 'peregrino',
    bossName: 'Gigante Desespero',
    narrative: '🏰 O céu escurece! Vocês foram capturados pelo GIGANTE DESESPERO e trancados no calabouço do Castelo da Dúvida! As paredes são úmidas, o ar é pesado, e o gigante desce as escadas com um porrete nas mãos. Sua esposa Desconfiança sussurra do andar de cima: "Bata neles até que desistam de viver!"',
    phases: [
      {
        description: '⛓️ O Gigante Desespero tranca a porta e diz: "Vocês NUNCA sairão daqui! Deus os abandonou!" A escuridão é total.',
        question: 'Qual salmo Cristão poderia recitar neste momento de total escuridão e abandono?',
        options: [
          'Salmo 88 — "Ó Senhor, clamo a ti de dia e de noite"',
          'Salmo 150 — "Louvai ao Senhor com instrumentos"',
          'Salmo 1 — "Bem-aventurado o homem que não anda no conselho dos ímpios"',
          'Salmo 100 — "Celebrai com júbilo ao Senhor"'
        ],
        correctIndex: 0,
        timerSeconds: 40,
        failPenalty: { type: 'penalty', attribute: 'perseveranca', amount: -2 }
      },
      {
        description: '🗣️ Desconfiança desce e sussurra: "Por que não acabam com isso? Vocês nunca serão bons o suficiente para o Rei. Desistam!"',
        question: 'Qual é a resposta bíblica para a voz da Desconfiança que diz "você não é bom o suficiente"?',
        options: [
          '"Somos salvos pela graça, não por obras" (Ef 2:8-9)',
          '"Sede perfeitos como o Pai é perfeito" (Mt 5:48)',
          '"Trabalhai na vossa salvação" (Fp 2:12)',
          '"A fé sem obras é morta" (Tg 2:17)'
        ],
        correctIndex: 0,
        timerSeconds: 40,
        failPenalty: { type: 'penalty', attribute: 'fe', amount: -2 }
      },
      {
        description: '🔑 Cristão subitamente lembra: "Que tolo sou! Tenho uma chave chamada PROMESSA que abre qualquer porta deste castelo!" Mas qual promessa usar?',
        question: 'Complete a promessa: "Aquele que começou a boa obra em vós há de _______ até ao dia de Cristo Jesus" (Fp 1:6)',
        options: ['abandoná-la', 'completá-la', 'esquecê-la', 'recompensá-la'],
        correctIndex: 1,
        timerSeconds: 30,
        failPenalty: { type: 'stun', stunTurns: 1 }
      }
    ],
    defeatNarrative: '⛓️ O gigante bateu a porta do calabouço. Vocês continuam presos, mas uma luz fraca brilha pela fresta — a esperança não morreu totalmente...',
    victoryNarrative: '🗝️ A CHAVE DA PROMESSA ABRIU TODAS AS PORTAS! O calabouço, o portão principal, o portão de ferro — TODOS SE ABRIRAM! O Gigante Desespero tentou perseguir mas a luz do sol o enfraqueceu! VOCÊS SÃO LIVRES! "Se o Filho vos libertar, verdadeiramente sereis livres!" (Jo 8:36)',
    bibleReference: 'Filipenses 1:6 e João 8:36'
  },
  {
    id: 'boss-003', difficulty: 'veterano',
    bossName: 'O Tribunal da Feira da Vaidade',
    narrative: '⚖️ SILÊNCIO NO TRIBUNAL! Vocês foram arrastados perante o Senhor Ódio-ao-Bem, juiz da Feira da Vaidade! As acusações: "Perturbação da feira, recusa em comprar mercadorias, e declaração de que o Rei é superior ao Príncipe deste mundo!" Doze jurados com nomes terríveis — Cego, Malícia, Luxúria, Presunção — já tomaram seus assentos. O povo da feira grita: "CULPADOS! CULPADOS!"',
    phases: [
      {
        description: '📜 O promotor acusa: "Estes peregrinos dizem que só há UM caminho para a salvação! Isso é arrogância e intolerância!" O juiz olha para vocês: "O que dizem em sua defesa?"',
        question: 'Qual a melhor defesa bíblica para a exclusividade de Cristo como caminho de salvação?',
        options: [
          '"Na verdade todos os caminhos são válidos, desculpem a confusão"',
          '"Jesus disse: Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim" (Jo 14:6)',
          '"Nós somos melhores que todos vocês"',
          '"Isso é uma questão de opinião pessoal"'
        ],
        correctIndex: 1,
        timerSeconds: 45,
        failPenalty: { type: 'penalty', attribute: 'discernimento', amount: -3 }
      },
      {
        description: '😤 O jurado Malícia grita: "Se seu Deus é tão bom, por que permite sofrimento?" A multidão aplaude. O juiz espera sua resposta.',
        question: 'Como responder biblicamente à questão do sofrimento diante de um Deus bom?',
        options: [
          '"O sofrimento é castigo por pecados específicos"',
          '"O sofrimento existe porque vivemos em um mundo caído, mas Deus usa todas as coisas para o bem dos que O amam (Rm 8:28) e um dia enxugará toda lágrima (Ap 21:4)"',
          '"Deus não se importa com o sofrimento"',
          '"O sofrimento não existe, é ilusão"'
        ],
        correctIndex: 1,
        timerSeconds: 60,
        failPenalty: { type: 'penalty', attribute: 'fe', amount: -2 }
      },
      {
        description: '🔥 O veredicto se aproxima. O juiz pergunta pela última vez: "Neguem seu Rei e serão libertos. Mantenham sua fé e serão condenados." O que vocês escolhem?',
        question: 'Qual exemplo bíblico de fidelidade até a morte inspira esta decisão?',
        options: [
          'Jonas fugindo de Nínive',
          'Sadraque, Mesaque e Abede-Nego na fornalha ardente (Dn 3:16-18)',
          'Balaão seguindo o dinheiro',
          'Pedro negando Jesus três vezes'
        ],
        correctIndex: 1,
        timerSeconds: 45,
        failPenalty: { type: 'retreat', positions: 4 }
      }
    ],
    defeatNarrative: '😔 O tribunal rugiu em celebração. Vocês recuaram da Feira envergonhados. Mas como Pedro após negar Jesus, há espaço para arrependimento e restauração...',
    victoryNarrative: '👑 VOCÊS MANTIVERAM A FÉ! Como Fiel, vocês não negaram o Rei mesmo diante da morte! E como Fiel, uma carruagem celestial desceu para honrar sua coragem! "Sê fiel até à morte e dar-te-ei a COROA DA VIDA!" (Ap 2:10) O céu celebra vocês!',
    bibleReference: 'Daniel 3:16-18 e Apocalipse 2:10'
  },
  {
    id: 'boss-004', difficulty: 'peregrino',
    bossName: 'O Vale da Sombra da Morte',
    narrative: '💀 A escuridão é absoluta. Vocês não conseguem ver nem as próprias mãos. Sons horríveis ecoam — gemidos, gargalhadas demoníacas, sussurros blasfemos. O caminho tem um abismo à esquerda e um pântano à direita. Um passo em falso e vocês caem. E o pior: vocês começam a ouvir SEUS PRÓPRIOS pensamentos se tornando blasfêmias!',
    phases: [
      {
        description: '🌑 Uma voz sussurra no escuro: "Deus não está aqui. Ele te abandonou neste vale. Você está sozinho." A escuridão parece confirmar a mentira.',
        question: 'Qual promessa bíblica contradiz diretamente a mentira de que Deus nos abandona?',
        options: [
          '"Deus ajuda quem se ajuda"',
          '"Nunca te deixarei, nunca te abandonarei" (Hb 13:5)',
          '"Deus só ajuda os merecedores"',
          '"Busque a Deus quando estiver bem"'
        ],
        correctIndex: 1,
        timerSeconds: 35,
        failPenalty: { type: 'penalty', attribute: 'fe', amount: -2 }
      },
      {
        description: '😱 Pensamentos blasfemos invadem a mente de vocês! Parecem ser seus, mas não são! Vocês começam a duvidar da própria fé.',
        question: 'Por que os pensamentos blasfemos no Vale NÃO eram de Cristão, e como sabemos isso?',
        options: [
          'Porque Cristão era perfeito e não pecava',
          'Porque Satanás pode injetar pensamentos na mente — ter um pensamento blasfemo não é o mesmo que concordar com ele',
          'Porque os pensamentos não existiam de verdade',
          'Porque Cristão estava sonhando'
        ],
        correctIndex: 1,
        timerSeconds: 45,
        failPenalty: { type: 'penalty', attribute: 'perseveranca', amount: -2 }
      },
      {
        description: '🌅 Uma luz fraca aparece ao longe! Cristão ouviu alguém à frente recitando um versículo! É a voz de outro peregrino!',
        question: 'Qual versículo Cristão ouviu que lhe deu coragem para continuar andando na escuridão?',
        options: [
          '"Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque Tu estás comigo" (Sl 23:4)',
          '"Louvai ao Senhor com harpa" (Sl 150:3)',
          '"No princípio criou Deus os céus e a terra" (Gn 1:1)',
          '"Amai os vossos inimigos" (Mt 5:44)'
        ],
        correctIndex: 0,
        timerSeconds: 30,
        failPenalty: { type: 'retreat', positions: 2 }
      }
    ],
    defeatNarrative: '🌑 A escuridão persistiu. Vocês pararam no meio do vale, paralisados pelo medo. Mas o amanhecer sempre chega...',
    victoryNarrative: '🌅 O SOL NASCEU! A luz revelou que os monstros eram sombras, os abismos estavam cercados, e Deus esteve com vocês TODO O TEMPO! "A luz brilha nas trevas, e as trevas não prevaleceram contra ela!" (Jo 1:5)',
    bibleReference: 'Salmos 23:4 e João 1:5'
  },
  {
    id: 'boss-005', difficulty: 'aprendiz',
    bossName: 'O Rio da Morte',
    narrative: '🌊 Vocês chegaram ao último obstáculo antes da Cidade Celestial — O RIO DA MORTE! Não há ponte, não há barco. As águas são negras e frias. Do outro lado, vocês podem VER os portões dourados brilhando! Anjos esperam com trombetas! Mas o rio... o rio é aterrorizante.',
    phases: [
      {
        description: '🌊 Ao entrar na água, Cristão começou a afundar! O medo da morte o consumia! Esperança gritou: "SEGURE-SE NAS PROMESSAS!"',
        question: 'Qual versículo Paulo escreveu sobre a vitória sobre a morte?',
        options: [
          '"O salário do pecado é a morte" (Rm 6:23)',
          '"Onde está, ó morte, a tua vitória? Onde está, ó morte, o teu aguilhão?" (1 Co 15:55)',
          '"Todos pecaram" (Rm 3:23)',
          '"Está consumado" (Jo 19:30)'
        ],
        correctIndex: 1,
        timerSeconds: 30,
        failPenalty: { type: 'penalty', attribute: 'fe', amount: -2 }
      },
      {
        description: '💪 Esperança segurou Cristão e disse: "Sinto chão firme!" As águas começaram a recuar! A margem celestial se aproxima!',
        question: 'Jesus disse: "Eu sou a ressurreição e a _____. Quem crê em mim, ainda que morra, _____."',
        options: [
          'esperança... descansará', 'vida... viverá', 'luz... brilhará', 'verdade... entenderá'
        ],
        correctIndex: 1,
        timerSeconds: 25,
        failPenalty: { type: 'retreat', positions: 2 }
      }
    ],
    defeatNarrative: '🌊 As águas subiram e vocês recuaram para a margem. O rio continua ali, esperando... Mas a Cidade brilha mais forte que nunca!',
    victoryNarrative: '🏆✨ VOCÊS ATRAVESSARAM O RIO! As águas se acalmaram sob seus pés! Do outro lado, ANJOS com trombetas de ouro os receberam! As portas da CIDADE CELESTIAL se abriram! "BEM-AVENTURADOS OS QUE LAVAM AS SUAS VESTES NO SANGUE DO CORDEIRO, PARA QUE LHES ASSISTA O DIREITO À ÁRVORE DA VIDA!" (Ap 22:14)',
    bibleReference: '1 Coríntios 15:55 e João 11:25-26'
  },
];
