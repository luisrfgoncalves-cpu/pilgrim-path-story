import { SpecialEvent, TrapEvent, RefugeEvent } from './types';

// ═══════════════════════════════════════════════════════
// EVENTOS ESPECIAIS, ARMADILHAS E REFÚGIOS
// ═══════════════════════════════════════════════════════

export const specialEvents: SpecialEvent[] = [
  {
    id: 'se-001', difficulty: 'aprendiz',
    title: 'Encontro com Evangelista',
    narrative: '📜 Evangelista aparece no caminho! Ele olha para vocês com olhos cheios de amor e diz: "Continuem! A Cidade Celestial está mais perto do que pensam! O Rei preparou um lugar para vocês!"',
    effect: { type: 'advance', positions: 2, affectsGroup: true },
    emoji: '📜'
  },
  {
    id: 'se-002', difficulty: 'aprendiz',
    title: 'Provisões do Céu',
    narrative: '🍞 Um anjo desce com provisões! Pão, água e frutas da Árvore da Vida! Vocês se sentem renovados e fortalecidos para a próxima etapa!',
    effect: { type: 'boost', attribute: 'perseveranca', amount: 2, affectsGroup: true },
    emoji: '🍞'
  },
  {
    id: 'se-003', difficulty: 'aprendiz',
    title: 'Companheiro Inesperado',
    narrative: '🤝 Um peregrino experiente se junta a vocês por uma etapa! Ele compartilha sabedoria do caminho e encoraja o grupo com testemunhos de vitórias passadas.',
    effect: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true },
    emoji: '🤝'
  },
  {
    id: 'se-004', difficulty: 'peregrino',
    title: 'Visão da Cidade Celestial',
    narrative: '✨ Por um instante, as nuvens se abrem e vocês vislumbram a Cidade Celestial ao longe! Portões de pérola, ruas de ouro, luz que não vem do sol! A visão renova todas as forças!',
    effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true },
    emoji: '✨',
    soundEffect: 'heavenly_choir'
  },
  {
    id: 'se-005', difficulty: 'peregrino',
    title: 'O Pergaminho Brilha',
    narrative: '📜 O pergaminho de certificação começa a brilhar com luz dourada! Palavras novas aparecem: "Nada vos separará do amor de Deus que está em Cristo Jesus, nosso Senhor!" (Rm 8:39)',
    effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true },
    emoji: '📜',
    soundEffect: 'divine_light'
  },
  {
    id: 'se-006', difficulty: 'aprendiz',
    title: 'Descanso no Caminho',
    narrative: '🌿 Vocês encontram um gazebo sombreado com água fresca e frutas. Uma placa diz: "Descansai um pouco. O Rei cuida dos Seus." Vocês se recuperam completamente!',
    effect: { type: 'boost', attribute: 'perseveranca', amount: 3, affectsGroup: true },
    emoji: '🌿'
  },
  {
    id: 'se-007', difficulty: 'peregrino',
    title: 'Espada Afiada',
    narrative: '⚔️ Vocês encontram uma pedra de amolar celestial! A Espada do Espírito (Palavra de Deus) fica mais afiada que nunca. Discernimento aumentado!',
    effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true },
    emoji: '⚔️',
    soundEffect: 'sword_sharpen'
  },
  {
    id: 'se-008', difficulty: 'veterano',
    title: 'Revelação do Intérprete',
    narrative: '🔮 O Espírito do Intérprete ilumina suas mentes! Vocês compreendem uma verdade profunda que antes era obscura. A conexão entre Antiga e Nova Aliança se torna cristalina!',
    effect: { type: 'boost', attribute: 'discernimento', amount: 4, affectsGroup: true },
    emoji: '🔮',
    soundEffect: 'revelation'
  },
  {
    id: 'se-009', difficulty: 'aprendiz',
    title: 'Chuva de Bênçãos',
    narrative: '🌈 Um arco-íris aparece sobre vocês! Lembrem-se: o arco-íris é o sinal da aliança de Deus com a humanidade. Ele é fiel às Suas promessas!',
    effect: { type: 'advance', positions: 1, affectsGroup: true },
    emoji: '🌈'
  },
  {
    id: 'se-010', difficulty: 'peregrino',
    title: 'Trombeta Celestial',
    narrative: '🎺 Uma trombeta soa do céu! Vocês sentem uma onda de encorajamento sobrenatural. O Rei está observando e aprovando a jornada de vocês!',
    effect: { type: 'boost', attribute: 'coragem', amount: 3, affectsGroup: true },
    emoji: '🎺',
    soundEffect: 'trumpet'
  },
];

export const trapEvents: TrapEvent[] = [
  {
    id: 'trap-001',
    title: 'Rede do Lisonjeiro',
    narrative: '🕸️ Um homem de palavras doces apareceu: "Venham por aqui, eu conheço um atalho!" Vocês seguiram... e caíram em uma REDE! Estão presos!',
    effect: { type: 'retreat', positions: 3, affectsGroup: true },
    escapeChallenge: {
      question: 'Para escapar da rede, completem: "O homem que lisonjeia o próximo arma _____ aos seus pés" (Pv 29:5)',
      options: ['uma escada', 'uma rede', 'um muro', 'uma ponte'],
      correctIndex: 1,
      timerSeconds: 20
    },
    emoji: '🕸️'
  },
  {
    id: 'trap-002',
    title: 'Armadilha da Preguiça',
    narrative: '😴 Uma cama macia e confortável apareceu no caminho com um cartaz: "Descanse aqui, não há pressa." Vocês deitaram e adormeceram profundamente! Perderam tempo precioso!',
    effect: { type: 'stun', stunTurns: 1, affectsGroup: true },
    escapeChallenge: {
      question: '"Até quando ficarás deitado, ó preguiçoso? Quando te levantarás do teu sono?" Qual livro?',
      options: ['Salmos', 'Eclesiastes', 'Provérbios', 'Jó'],
      correctIndex: 2,
      timerSeconds: 15
    },
    emoji: '😴'
  },
  {
    id: 'trap-003',
    title: 'Pântano do Desânimo',
    narrative: '🌊 O chão cedeu e vocês estão afundando no PÂNTANO DO DESÂNIMO! A lama pegajosa puxa vocês para baixo! Cada tentativa de sair parece piorar!',
    effect: { type: 'retreat', positions: 4, affectsGroup: true },
    escapeChallenge: {
      question: 'Quem ajudou Cristão a sair do Pântano do Desânimo na narrativa?',
      options: ['Evangelista', 'Socorro', 'Fiel', 'Esperança'],
      correctIndex: 1,
      timerSeconds: 20
    },
    emoji: '🌊'
  },
  {
    id: 'trap-004',
    title: 'Mina de Prata de Demas',
    narrative: '💰 Demas aparece sorridente: "Venham ver minha mina de prata! Riquezas sem fim!" A ganância brilha nos olhos de vocês...',
    effect: { type: 'retreat', positions: 2, affectsGroup: true },
    escapeChallenge: {
      question: 'Jesus disse: "Não podeis servir a Deus e a _____" (Mt 6:24)',
      options: ['Satanás', 'Mamom (riquezas)', 'ao mundo', 'a si mesmo'],
      correctIndex: 1,
      timerSeconds: 20
    },
    emoji: '💰'
  },
  {
    id: 'trap-005',
    title: 'Calabouço do Castelo da Dúvida',
    narrative: '⛓️ CLANG! As portas de ferro se fecharam! Vocês foram capturados pelo Gigante Desespero! O calabouço é escuro, frio e sem esperança aparente!',
    effect: { type: 'stun', stunTurns: 2, affectsGroup: true },
    escapeChallenge: {
      question: 'Qual "chave" Cristão usou para escapar do Castelo da Dúvida?',
      options: ['Chave de ouro', 'Chave da Promessa', 'Chave da coragem', 'Chave da sabedoria'],
      correctIndex: 1,
      timerSeconds: 20
    },
    emoji: '⛓️'
  },
  {
    id: 'trap-006',
    title: 'Terra Encantada',
    narrative: '🌸 Flores perfumadas, brisa suave, música hipnótica... Os olhos de vocês pesam... tão... sono... lento... ZzZzZ...',
    effect: { type: 'stun', stunTurns: 1, affectsGroup: true },
    escapeChallenge: {
      question: '"Vigiai e orai, para que não entreis em _____" (Mt 26:41)',
      options: ['pecado', 'tentação', 'desespero', 'sono'],
      correctIndex: 1,
      timerSeconds: 15
    },
    emoji: '🌸'
  },
  {
    id: 'trap-007',
    title: 'Desvio pelo Prado',
    narrative: '🌾 "Este prado é tão bonito! Por que não sair do caminho estreito por apenas um momento?" Vocês saíram... e se perderam!',
    effect: { type: 'retreat', positions: 3, affectsGroup: true },
    escapeChallenge: {
      question: '"Não te desvies nem para a _____ nem para a _____" (Pv 4:27)',
      options: ['frente... trás', 'direita... esquerda', 'luz... trevas', 'cidade... campo'],
      correctIndex: 1,
      timerSeconds: 20
    },
    emoji: '🌾'
  },
  {
    id: 'trap-008',
    title: 'Emboscada dos Ladrões',
    narrative: '🗡️ Tímido, Desconfiança e Culpa atacam de surpresa! Eles roubam sua paz e alegria, embora não possam tocar no pergaminho!',
    effect: { type: 'penalty', attribute: 'coragem', amount: -3, affectsGroup: true },
    escapeChallenge: {
      question: 'Qual promessa de Jesus garante que ninguém pode nos tirar de Suas mãos?',
      options: ['Mateus 28:20', 'João 10:28', 'Lucas 10:19', 'Marcos 16:15'],
      correctIndex: 1,
      timerSeconds: 25
    },
    emoji: '🗡️'
  },
];

export const refugeEvents: RefugeEvent[] = [
  {
    id: 'ref-001',
    title: 'Palácio Belo',
    narrative: '🏰 Vocês chegaram ao Palácio Belo! Donzelas chamadas Prudência, Piedade e Caridade os recebem com alegria. Há comida, descanso e a armadura de Deus para vestir!',
    effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true },
    bibleVerse: '"Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei." — Mateus 11:28',
    emoji: '🏰'
  },
  {
    id: 'ref-002',
    title: 'Casa do Intérprete',
    narrative: '🏠 O Intérprete os recebe! Ele mostra visões que revelam verdades profundas sobre a vida cristã. Vocês saem mais sábios e preparados.',
    effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true },
    bibleVerse: '"O Espírito da verdade vos guiará em toda a verdade." — João 16:13',
    emoji: '🏠'
  },
  {
    id: 'ref-003',
    title: 'Montanhas Deleitosas',
    narrative: '⛰️ Os pastores Conhecimento, Experiência, Vigilante e Sincero os acolhem nas Montanhas Deleitosas! Daqui vocês podem ver a Cidade Celestial ao longe!',
    effect: { type: 'boost', attribute: 'perseveranca', amount: 3, affectsGroup: true },
    bibleVerse: '"Levanto os meus olhos para os montes; de onde me vem o socorro? O meu socorro vem do Senhor." — Salmo 121:1-2',
    emoji: '⛰️'
  },
  {
    id: 'ref-004',
    title: 'País de Beulá',
    narrative: '🌸 Vocês entraram no País de Beulá — um lugar de beleza indescritível, onde o sol brilha dia e noite! O ar é perfumado com flores celestiais! A Cidade está TÃO perto!',
    effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true },
    bibleVerse: '"A tua terra se chamará Beulá (Desposada), porque o Senhor se deleitará em ti." — Isaías 62:4',
    emoji: '🌸'
  },
  {
    id: 'ref-005',
    title: 'Fonte de Água Viva',
    narrative: '💧 Uma fonte de água cristalina brota do chão! Vocês bebem e se sentem totalmente restaurados. É a água da vida que Jesus prometeu!',
    effect: { type: 'boost', attribute: 'perseveranca', amount: 2, affectsGroup: true },
    bibleVerse: '"Aquele que beber da água que eu lhe der nunca terá sede." — João 4:14',
    emoji: '💧'
  },
  {
    id: 'ref-006',
    title: 'Hospedaria de Gaio',
    narrative: '🏨 Gaio, o hospitaleiro, os recebe com um banquete! Histórias de peregrinos anteriores são contadas ao redor da mesa. Vocês são fortalecidos pela comunhão!',
    effect: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true },
    bibleVerse: '"Não vos esqueçais da hospitalidade, porque por ela alguns, sem o saberem, hospedaram anjos." — Hebreus 13:2',
    emoji: '🏨'
  },
];
