import { HiddenRevelation } from './types';

// ═══════════════════════════════════════════════════════
// REVELAÇÕES OCULTAS — Desbloqueadas após acerto
// Ensino profundo, contexto histórico, aplicação prática
// ═══════════════════════════════════════════════════════

/** 
 * Mapa de revelações por ID do conteúdo.
 * Estas são desbloqueadas quando o grupo acerta a resposta.
 */
export const revelationMap: Record<string, HiddenRevelation> = {
  // ═══════ PERGUNTAS ═══════
  'q-a-001': {
    title: '🔓 Revelação: O Peso Invisível',
    deepTeaching: 'Na época de Bunyan (séc. XVII), prisioneiros na Inglaterra carregavam literalmente correntes de ferro. Bunyan escreveu O Peregrino na prisão e entendeu fisicamente o que significa carregar um peso. O fardo de Cristão não era apenas pecado — era a CONSCIÊNCIA do pecado. Muitas pessoas vivem com pecado sem sentir peso. Cristão sentiu o peso porque o Espírito Santo abriu seus olhos.',
    historicalContext: 'Bunyan passou 12 anos preso por pregar sem licença. Ele escolheu ficar na prisão ao invés de parar de pregar.',
    practicalApplication: 'Pergunte ao grupo: "Existe algo que vocês carregam que ainda não entregaram na Cruz?"',
    bibleDeepDive: 'Compare Mateus 11:28-30 com 1 João 1:9 — o peso é real, mas o alívio é instantâneo.',
  },
  'q-a-002': {
    title: '🔓 Revelação: A Ciência do Pântano',
    deepTeaching: 'Bunyan baseou o Pântano do Desânimo em um pântano real perto de Bedford, Inglaterra, onde ele vivia. As pessoas literalmente afundavam na lama. Mas note: no livro, existem DEGRAUS firmes sob a lama, colocados por ordem do Rei. Eles representam as promessas de Deus. Estão lá — mas o desânimo nos impede de vê-los.',
    historicalContext: 'A região de Bedford era pantanosa no séc. XVII. Bunyan usou sua paisagem local como metáfora espiritual.',
    practicalApplication: 'Quando alguém do grupo estiver desanimado, lembrem: os degraus (promessas) estão sob os pés — só é difícil enxergá-los na lama.',
    bibleDeepDive: 'Leia Salmos 40:1-3 completo — "Esperai pacientemente pelo Senhor; Ele se inclinou para mim e ouviu o meu clamor."',
  },
  'q-a-006': {
    title: '🔓 Revelação: A Chave Esquecida',
    deepTeaching: 'O detalhe mais genial de Bunyan: Cristão SEMPRE teve a chave da Promessa no bolso do peito! Ele esqueceu que a tinha. Isso é revolucionário — muitos cristãos vivem no calabouço do desespero tendo todas as promessas de Deus disponíveis. O problema não é falta de promessa, é falta de MEMÓRIA.',
    practicalApplication: 'Desafie cada pessoa do grupo a memorizar UMA promessa de Deus esta semana. Quando o desespero bater, vocês terão a "chave" no bolso.',
    bibleDeepDive: '2 Pedro 1:4 — "Pelas quais nos têm sido concedidas as suas preciosas e grandíssimas promessas."',
  },
  'q-a-007': {
    title: '🔓 Revelação: O Vale Real',
    deepTeaching: 'O Vale da Sombra da Morte em O Peregrino combina dois terrores: escuridão total E vozes blasfemas que Cristão pensava serem seus próprios pensamentos. Bunyan sofria de ataques de pânico e pensamentos intrusivos — ele escreveu sobre isso em sua autobiografia "Grace Abounding". Este trecho é parcialmente autobiográfico.',
    historicalContext: 'Em "Grace Abounding to the Chief of Sinners" (1666), Bunyan descreve anos de tormento mental antes de encontrar paz em Cristo.',
    practicalApplication: 'Ensine ao grupo: pensamentos blasfemos que causam HORROR são evidência de fé, não de falta dela. Se não incomodassem, seria indiferença espiritual.',
    bibleDeepDive: 'Romanos 7:15-25 — Paulo descreve a mesma luta interna entre o que queremos e o que pensamos.',
  },
  'q-a-010': {
    title: '🔓 Revelação: Os Dois Rios',
    deepTeaching: 'O Rio da Morte em Bunyan é diferente para cada peregrino. Cristão afundou quase até o fundo — Esperança caminhou facilmente. A profundidade não depende da quantidade de pecado, mas da quantidade de FÉ no momento. Cristão lembrou dos pecados; Esperança lembrou das promessas. Ambos chegaram ao outro lado.',
    practicalApplication: 'A morte cristã não é uma penalidade, é uma passagem. O que determina a experiência é onde fixamos os olhos: nos pecados ou nas promessas.',
    bibleDeepDive: 'Compare Josué 3:15-17 (Jordão a pé enxuto) com Salmos 23:4 (vale da sombra). Ambos são travessias de fé.',
  },

  // ═══════ CHARADAS ═══════
  'r-a-001': {
    title: '🔓 Revelação: O Fardo na Arte',
    deepTeaching: 'Em todas as ilustrações clássicas de O Peregrino, o fardo nas costas de Cristão é desenhado como um saco pesado e escuro. Mas Bunyan nunca descreve sua aparência — apenas seu PESO. O fardo é invisível para quem olha de fora. Assim é o pecado: outros não veem, mas quem carrega sente o peso esmagador.',
    practicalApplication: 'Nunca julgue alguém dizendo "parece estar tudo bem." Muitas pessoas carregam fardos invisíveis.',
    bibleDeepDive: 'Gálatas 6:2 — "Levai as cargas uns dos outros e assim cumprireis a lei de Cristo."',
  },
  'r-a-005': {
    title: '🔓 Revelação: A Armadura Incompleta',
    deepTeaching: 'Detalhe surpreendente: a armadura de Deus em Efésios 6 NÃO tem proteção para as costas! As 6 peças protegem frente e cabeça. Isso significa que o cristão NUNCA deve fugir — deve enfrentar o inimigo de frente. Cristão quase perdeu a batalha contra Apolion quando pensou em fugir; venceu quando enfrentou de frente.',
    historicalContext: 'A armadura romana que Paulo descreve era projetada para formação em falange — ninguém ficava de costas para o inimigo.',
    practicalApplication: 'Quando estiverem com medo, não corram. Virem de frente, segurem a Espada (a Palavra) e resistam.',
    bibleDeepDive: 'Tiago 4:7 — "Resisti ao diabo e ele fugirá de vós." Note: RESISTI, não FUGI.',
  },
  'r-p-001': {
    title: '🔓 Revelação: O Fogo e o Óleo',
    deepTeaching: 'Esta é uma das visões mais profundas de Bunyan. O fogo é a graça no coração. A água é Satanás tentando apagá-la. O óleo é Cristo sustentando POR TRÁS — invisivelmente. O homem com a vassoura (Satanás) não consegue ver de onde vem o óleo. Isso ensina que Cristo age SECRETAMENTE em nós, por caminhos que nem nós nem o inimigo percebemos.',
    practicalApplication: 'Quando parecer que a fé está apagando, lembre-se: há Alguém alimentando o fogo por trás, mesmo que você não veja.',
    bibleDeepDive: 'João 10:27-29 — "As minhas ovelhas ouvem a minha voz... ninguém as arrebatará da minha mão."',
  },
  'r-v-001': {
    title: '🔓 Revelação: A Gaiola Mais Terrível',
    deepTeaching: 'O homem na gaiola de ferro é a visão mais aterrorizante do livro. Ele diz: "Eu rejeitei a graça tantas vezes que ela me deixou. Não há mais arrependimento para mim." Os teólogos debatem se isso é possível (Hebreus 6:4-6). Bunyan não resolve o debate — ele ASSUSTA intencionalmente para que ninguém brinque com a graça.',
    historicalContext: 'Bunyan teve períodos em que temia ser o homem na gaiola. Isso mostra que o MEDO de ter pecado contra o Espírito é, paradoxalmente, evidência de que NÃO pecou — pois quem realmente apostatou não se importa mais.',
    practicalApplication: 'Se alguém do grupo tem medo de ter pecado contra o Espírito Santo, tranquilize: o fato de se importar é prova de que ainda está sob a graça.',
    bibleDeepDive: 'Compare Hebreus 6:4-6 com 1 João 2:1 — "Se alguém pecar, temos um Advogado junto ao Pai."',
  },
  'r-v-007': {
    title: '🔓 Revelação: A Ordo Salutis em Três Presentes',
    deepTeaching: 'Bunyan comprimiu toda a teologia da salvação em três presentes na Cruz: a MARCA (justificação — Deus declara justo), as VESTES (santificação — nova vida), e o PERGAMINHO (glorificação — garantia do destino). Passado, presente e futuro da salvação em um único momento dramático.',
    historicalContext: 'Os puritanos debatiam intensamente a ordo salutis (ordem da salvação). Bunyan simplificou para leigos o que Calvino e Owen escreviam em latim.',
    practicalApplication: 'Pergunte ao grupo: "Vocês vivem na marca (perdão passado), nas vestes (vida nova presente) ou no pergaminho (esperança futura)?" Precisamos dos três.',
    bibleDeepDive: 'Romanos 8:30 — "Os que predestinou, também chamou; os que chamou, também justificou; os que justificou, também glorificou."',
  },

  // ═══════ DILEMAS ═══════
  'd-a-001': {
    title: '🔓 Revelação: O Teste do Caminho',
    deepTeaching: 'Bunyan ensina algo radical: NÃO saia do caminho para ajudar. Isso parece cruel, mas tem profundidade. Ele não diz "não ajude" — diz "não SAIA do caminho." Você pode estender a mão sem sair do caminho estreito. Jesus ajudou multidões sem nunca comprometer sua missão. A diferença é sutil mas vital.',
    practicalApplication: 'Como ajudar pessoas em dificuldade sem comprometer seus próprios valores? Discutam situações reais.',
    bibleDeepDive: 'Gálatas 6:1 — "Se alguém for surpreendido em pecado, vós que sois espirituais, corrigi-o com espírito de mansidão; e olha por ti mesmo, para que não sejas também tentado."',
  },
  'd-p-001': {
    title: '🔓 Revelação: A Sabedoria do Mundo vs. a Sabedoria de Deus',
    deepTeaching: 'Sabedoria Mundana é o personagem mais PERIGOSO do livro — porque parece razoável. Ele não oferece pecado; oferece MORALIDADE sem Cristo. É mais difícil resistir a um conselho "sensato" do que a uma tentação óbvia. Bunyan sabia que a maior ameaça à fé não é o pecado grosseiro, mas a religiosidade confortável.',
    historicalContext: 'Na Inglaterra puritana, muitos pastores anglicanos pregavam moralidade sem regeneração. Bunyan os criticava diretamente neste personagem.',
    practicalApplication: 'Cuidado com conselhos que parecem sábios mas evitam a cruz. "O caminho fácil" geralmente é o caminho errado.',
    bibleDeepDive: '1 Coríntios 1:18-25 — "A loucura de Deus é mais sábia que a sabedoria dos homens."',
  },
  'd-v-001': {
    title: '🔓 Revelação: Verdade em Amor',
    deepTeaching: 'Bunyan apresenta TRÊS respostas ao pluralismo: aceitar (errado), rejeitar com raiva (errado) e rejeitar com graça usando as Escrituras (certo). O segredo está em Efésios 4:15: "falando a verdade EM AMOR." A verdade sem amor é brutalidade; o amor sem verdade é sentimentalismo. Os dois juntos são o evangelho.',
    practicalApplication: 'Pratiquem: como dizer a verdade difícil sem perder o amor? Simulem uma situação onde alguém defende algo antibíblico.',
    bibleDeepDive: 'Colossenses 4:6 — "A vossa palavra seja sempre agradável, temperada com sal, para saberdes como deveis responder a cada um."',
  },

  // ═══════ BOSSES ═══════
  'boss-001': {
    title: '🔓 Revelação: A Estratégia de Apolion',
    deepTeaching: 'Apolion usou 3 táticas em sequência: INTIMIDAÇÃO (sou mais forte), ACUSAÇÃO (você é pecador), e VIOLÊNCIA (vou destruir você). É exatamente a estratégia de Satanás: primeiro assusta, depois acusa, depois ataca. Mas note — Apolion NUNCA negou que Cristão pertencia ao Rei. Ele sabia que era verdade. Ele só queria que Cristão desistisse voluntariamente.',
    practicalApplication: 'Identifiquem: em qual fase vocês estão enfrentando o inimigo? Intimidação? Acusação? Ataque direto? A resposta é a mesma em todas: a Palavra.',
    bibleDeepDive: 'Apocalipse 12:10-11 — "Eles o venceram pelo sangue do Cordeiro e pela palavra do testemunho que deram."',
  },
  'boss-002': {
    title: '🔓 Revelação: O Gigante que Deus Permite',
    deepTeaching: 'Por que Deus permite que o Gigante Desespero capture peregrinos? Porque Cristão e Esperança SAÍRAM do caminho por vontade própria. Eles viram um prado bonito e pensaram: "Esse caminho é mais confortável." O Gigante não os caçou — ele os encontrou fora do caminho. A lição: o desespero geralmente começa com um desvio "pequeno."',
    historicalContext: 'Bunyan se desviou espiritualmente antes de sua conversão. Ele conhecia pessoalmente o "castelo da dúvida."',
    practicalApplication: 'Examinem: houve algum "prado bonito" — um desvio aparentemente inofensivo — que levou vocês a um lugar de dúvida?',
    bibleDeepDive: 'Provérbios 14:12 e Hebreus 12:1 — "Corramos com perseverança a carreira que nos está proposta."',
  },
};

/** Get revelation for a content ID, if exists */
export function getRevelation(contentId: string): HiddenRevelation | null {
  return revelationMap[contentId] || null;
}
