import { ActiveChallenge } from './types';

// ═══════════════════════════════════════════════════════
// BANCO DE DESAFIOS ATIVOS — FÍSICOS E INTERATIVOS
// O grupo faz coisas REAIS: mímica, recitar, debater, cantar
// ═══════════════════════════════════════════════════════

export const activeChallenges: ActiveChallenge[] = [
  // ═══════ APRENDIZ ═══════
  {
    id: 'ch-a-001', difficulty: 'aprendiz', type: 'mime',
    context: 'Cristão carregou um fardo pesadíssimo nas costas por toda a jornada. Na Cruz, o fardo caiu!',
    title: '🎭 Mímica: O Fardo Caindo',
    description: 'O jogador sorteado deve fazer uma MÍMICA de alguém carregando um peso enorme nas costas, caminhando com dificuldade, e depois o alívio quando o peso cai. O grupo deve adivinhar que cena do Peregrino é!',
    successCriteria: 'O grupo acerta que é "o fardo caindo na Cruz" em até 60 segundos.',
    timerSeconds: 60,
    reward: { type: 'advance', positions: 2, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'perseveranca', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-a-002', difficulty: 'aprendiz', type: 'recite',
    context: 'O Salmo 23 é o salmo do peregrino — Cristão o recitou no Vale da Sombra da Morte.',
    title: '📖 Recitar: Salmo 23',
    description: 'O jogador sorteado deve recitar o Salmo 23 de memória (ou o máximo que conseguir). Pode consultar a Bíblia se travar, mas perde pontos!',
    successCriteria: 'Recitar pelo menos os versículos 1-4 corretamente.',
    timerSeconds: 90,
    reward: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-a-003', difficulty: 'aprendiz', type: 'find_verse',
    context: 'Cristão usou a Espada do Espírito (a Palavra de Deus) para derrotar Apolion!',
    title: '⚔️ Corrida Bíblica: Ache o Versículo!',
    description: 'O Mestre vai dizer uma referência bíblica. O jogador sorteado deve ENCONTRAR NA BÍBLIA (física ou app) e LER EM VOZ ALTA o versículo antes do tempo acabar!',
    successCriteria: 'Encontrar e ler Efésios 6:17 ("a espada do Espírito, que é a Palavra de Deus") em até 45 segundos.',
    timerSeconds: 45,
    reward: { type: 'advance', positions: 2, affectsGroup: true },
    penalty: { type: 'retreat', positions: 1, affectsGroup: true }
  },
  {
    id: 'ch-a-004', difficulty: 'aprendiz', type: 'sing',
    context: 'Cristão cantava hinos de louvor para espantar o medo no Vale da Sombra da Morte!',
    title: '🎵 Cantar: Hino de Coragem',
    description: 'O jogador sorteado (ou o grupo inteiro!) deve cantar um trecho de um hino cristão ou louvor. Pelo menos um verso completo!',
    successCriteria: 'Cantar pelo menos um verso inteiro de qualquer hino/louvor cristão.',
    timerSeconds: 60,
    reward: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'coragem', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-a-005', difficulty: 'aprendiz', type: 'rapid_fire',
    context: 'Na Casa do Intérprete, verdades eram reveladas rapidamente em sequência!',
    title: '⚡ Rodada Rápida: Livros da Bíblia',
    description: 'O jogador sorteado deve falar o MÁXIMO de livros da Bíblia que conseguir em 30 segundos! Cada livro correto = 1 ponto.',
    successCriteria: 'Dizer pelo menos 15 livros da Bíblia corretamente em 30 segundos.',
    timerSeconds: 30,
    reward: { type: 'advance', positions: 3, affectsGroup: true },
    penalty: { type: 'retreat', positions: 1, affectsGroup: true }
  },
  {
    id: 'ch-a-006', difficulty: 'aprendiz', type: 'mime',
    context: 'Cristão enfrentou leões rugindo no caminho do Palácio Belo. Ele precisou de coragem!',
    title: '🦁 Mímica: Passando pelos Leões',
    description: 'O jogador sorteado deve encenar com mímica alguém caminhando com medo entre dois leões rugindo (pode rugir!). O grupo deve adivinhar a cena!',
    successCriteria: 'O grupo identifica "os leões antes do Palácio Belo" em até 45 segundos.',
    timerSeconds: 45,
    reward: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'coragem', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-a-007', difficulty: 'aprendiz', type: 'draw',
    context: 'A armadura de Deus tem 6 peças distintas que Cristão vestiu no Palácio Belo.',
    title: '✏️ Desenho: A Armadura de Deus',
    description: 'O jogador sorteado deve DESENHAR (com dedo no ar ou em papel) as 6 peças da armadura de Deus enquanto o grupo tenta adivinhar cada peça!',
    successCriteria: 'O grupo identifica pelo menos 4 das 6 peças da armadura.',
    timerSeconds: 90,
    reward: { type: 'advance', positions: 2, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-a-008', difficulty: 'aprendiz', type: 'rapid_fire',
    context: 'Cristão encontrou muitos personagens na jornada — cada um com um nome significativo.',
    title: '⚡ Rodada Rápida: Personagens do Peregrino',
    description: 'O grupo todo participa! Cada um deve dizer o nome de um personagem do Peregrino em sequência. Quem repetir ou travar, perde!',
    successCriteria: 'O grupo cita pelo menos 10 personagens diferentes sem repetir.',
    timerSeconds: 60,
    reward: { type: 'advance', positions: 2, affectsGroup: true },
    penalty: { type: 'retreat', positions: 1, affectsGroup: true }
  },

  // ═══════ PEREGRINO ═══════
  {
    id: 'ch-p-001', difficulty: 'peregrino', type: 'debate',
    context: 'Na Feira da Vaidade, Cristão e Fiel foram chamados a se defender diante de um tribunal hostil.',
    title: '⚖️ Debate: Defenda a Fé!',
    description: 'O Mestre fará uma acusação contra a fé cristã (exemplo: "A fé cristã é intolerante"). O jogador sorteado tem 90 segundos para DEFENDER a fé usando argumentos bíblicos. O grupo vota se a defesa foi convincente!',
    successCriteria: 'Maioria do grupo vota que a defesa foi bíblica e convincente.',
    timerSeconds: 90,
    reward: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'discernimento', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-p-002', difficulty: 'peregrino', type: 'find_verse',
    context: 'O Gigante Desespero tentou convencer Cristão de que não havia esperança. A chave era lembrar das promessas!',
    title: '🔑 Corrida Bíblica: Promessas de Deus',
    description: 'O Mestre dará um TEMA (ex: "promessa de proteção"). O jogador deve encontrar NA BÍBLIA um versículo que contenha uma promessa de Deus sobre esse tema. Tempo correndo!',
    successCriteria: 'Encontrar e ler um versículo relevante em até 60 segundos.',
    timerSeconds: 60,
    reward: { type: 'advance', positions: 3, affectsGroup: true },
    penalty: { type: 'retreat', positions: 2, affectsGroup: true }
  },
  {
    id: 'ch-p-003', difficulty: 'peregrino', type: 'recite',
    context: 'A armadura de Deus é essencial para todo peregrino. Paulo detalhou cada peça.',
    title: '🛡️ Recitar: A Armadura Completa',
    description: 'O jogador sorteado deve recitar de memória Efésios 6:13-17, nomeando TODAS as 6 peças da armadura e o que cada uma representa.',
    successCriteria: 'Nomear corretamente as 6 peças: cinto, couraça, calçados, escudo, capacete e espada.',
    timerSeconds: 90,
    reward: { type: 'boost', attribute: 'coragem', amount: 3, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'coragem', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-p-004', difficulty: 'peregrino', type: 'mime',
    context: 'Apolion atacou Cristão furiosamente no Vale da Humilhação. A batalha foi épica!',
    title: '🎭 Mímica Épica: A Batalha contra Apolion',
    description: 'DOIS jogadores devem encenar a batalha: um é Cristão (com espada imaginária) e outro é Apolion (com garras e asas). O grupo deve reconhecer a cena!',
    successCriteria: 'O grupo identifica "a batalha contra Apolion" e o grupo aprova a performance.',
    timerSeconds: 90,
    reward: { type: 'advance', positions: 3, affectsGroup: true },
    penalty: { type: 'retreat', positions: 1, affectsGroup: true }
  },
  {
    id: 'ch-p-005', difficulty: 'peregrino', type: 'debate',
    context: 'Ignorância argumentava que seguir o coração era suficiente para ser salvo.',
    title: '⚖️ Debate: Coração vs Escritura',
    description: 'O Mestre defenderá a posição de Ignorância: "Basta seguir o coração!" O jogador sorteado deve refutar usando PELO MENOS 2 versículos bíblicos.',
    successCriteria: 'Citar pelo menos 2 versículos que mostrem que o coração é enganoso (ex: Jr 17:9) e que a Escritura é o padrão.',
    timerSeconds: 120,
    reward: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'discernimento', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-p-006', difficulty: 'peregrino', type: 'rapid_fire',
    context: 'O Peregrino é cheio de referências bíblicas. Cada cena tem uma conexão com a Bíblia.',
    title: '⚡ Rodada Rápida: Conexões Bíblicas',
    description: 'O Mestre dirá nomes de personagens/lugares do Peregrino. O jogador deve responder RAPIDAMENTE qual referência bíblica corresponde. Ex: "Pântano?" → "Salmo 40:2".',
    successCriteria: 'Acertar pelo menos 5 de 8 conexões em 60 segundos.',
    timerSeconds: 60,
    reward: { type: 'advance', positions: 2, affectsGroup: true },
    penalty: { type: 'retreat', positions: 1, affectsGroup: true }
  },
  {
    id: 'ch-p-007', difficulty: 'peregrino', type: 'sing',
    context: 'Cristão cantou após seu fardo cair na Cruz — um cântico de libertação e alegria!',
    title: '🎵 Compor: Cântico do Peregrino',
    description: 'O grupo tem 2 minutos para COMPOR juntos um cântico curto (4 linhas) sobre a jornada do Peregrino. Depois, devem CANTAR juntos!',
    successCriteria: 'O grupo cria e canta um cântico de pelo menos 4 linhas sobre o tema do Peregrino.',
    timerSeconds: 150,
    reward: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'perseveranca', amount: -1, affectsGroup: true }
  },

  // ═══════ VETERANO ═══════
  {
    id: 'ch-v-001', difficulty: 'veterano', type: 'debate',
    context: 'Na Casa do Intérprete, Cristão aprendeu que a Lei (vassoura) não pode limpar, só a Graça (água) pode.',
    title: '⚖️ Debate Teológico: Lei vs Graça',
    description: 'O Mestre apresentará uma situação: "Se a graça é gratuita, por que obedecer a Lei?" O jogador deve explicar a relação entre Lei e Graça usando Romanos e Gálatas.',
    successCriteria: 'Explicar que a Lei revela o pecado, a Graça salva, e a obediência é fruto da gratidão (não da obrigação). Citar pelo menos 2 versículos.',
    timerSeconds: 150,
    reward: { type: 'boost', attribute: 'discernimento', amount: 4, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'discernimento', amount: -2, affectsGroup: true }
  },
  {
    id: 'ch-v-002', difficulty: 'veterano', type: 'recite',
    context: 'Paulo escreveu sobre a luta da fé. Cristão viveu cada palavra.',
    title: '📖 Recitar: O Bom Combate',
    description: 'O jogador deve recitar de memória 2 Timóteo 4:7-8 ("Combati o bom combate, completei a carreira, guardei a fé...") E explicar como isso se aplica à jornada de Cristão.',
    successCriteria: 'Recitar o texto corretamente E fazer uma aplicação válida à narrativa do Peregrino.',
    timerSeconds: 120,
    reward: { type: 'boost', attribute: 'perseveranca', amount: 3, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'perseveranca', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-v-003', difficulty: 'veterano', type: 'debate',
    context: 'Cristão deixou família para seguir o caminho. A esposa pensou que ele enlouqueceu.',
    title: '⚖️ Dilema Pastoral: Família vs Chamado',
    description: 'O Mestre propõe: "Cristão abandonou a família para seguir a Deus. Isso é bíblico?" O jogador deve argumentar COM EQUILÍBRIO, usando Lucas 14:26 E 1 Timóteo 5:8.',
    successCriteria: 'Demonstrar que Jesus exige prioridade absoluta (Lc 14:26) sem negar a responsabilidade familiar (1 Tm 5:8). Explicar a tensão com maturidade.',
    timerSeconds: 180,
    reward: { type: 'boost', attribute: 'discernimento', amount: 4, affectsGroup: true },
    penalty: { type: 'penalty', attribute: 'discernimento', amount: -1, affectsGroup: true }
  },
  {
    id: 'ch-v-004', difficulty: 'veterano', type: 'find_verse',
    context: 'Na alegoria de Bunyan, cada personagem e lugar tem uma raiz bíblica. O veterano deve conhecer essas raízes profundamente.',
    title: '🔍 Arqueologia Bíblica: Encontre a Raiz',
    description: 'O Mestre dará 3 elementos do Peregrino (ex: "Rio da Morte", "Gigante Desespero", "Feira da Vaidade"). Para cada um, o jogador deve encontrar NA BÍBLIA a passagem que Bunyan usou como base.',
    successCriteria: 'Encontrar as referências bíblicas corretas para pelo menos 2 dos 3 elementos.',
    timerSeconds: 180,
    reward: { type: 'advance', positions: 4, affectsGroup: true },
    penalty: { type: 'retreat', positions: 2, affectsGroup: true }
  },
];
