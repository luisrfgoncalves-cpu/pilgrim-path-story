import { MoralDilemma } from './types';

// ═══════════════════════════════════════════════════════
// EXPANSÃO DE DILEMAS — LOTE 3
// Meta: atingir 300+ itens totais no banco de conteúdo
// ═══════════════════════════════════════════════════════

export const moralDilemmasExpansion2: MoralDilemma[] = [
  // ═══════ APRENDIZ — LOTE 3 ═══════
  {
    id: 'd-a-011', difficulty: 'aprendiz',
    context: 'Vocês encontram uma fonte de água cristalina ao lado do caminho. Uma placa diz: "Água da Vida — beba gratuitamente." Mas um homem rico ao lado vende garrafas enfeitadas dizendo que a SUA água é melhor.',
    situation: '"A minha água vem em garrafas bonitas e tem gosto melhor!" diz o comerciante. "A água grátis não pode ser tão boa — coisas boas custam caro!"',
    choices: [
      { text: 'Comprar a água enfeitada do comerciante', consequence: 'A água enfeitada tinha gosto doce mas não matou a sede! A graça de Deus é gratuita — e superior a qualquer substituto pago.', effect: { type: 'penalty', attribute: 'discernimento', amount: -1, affectsGroup: true } },
      { text: 'Beber da fonte gratuita', consequence: '"Quem beber desta água nunca mais terá sede!" (Jo 4:14). A água da vida é gratuita porque o preço já foi pago na Cruz.', effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true } },
      { text: 'Beber das duas para comparar', consequence: 'Vocês tentaram misturar graça com obras. "Ninguém pode servir a dois senhores." A confusão enfraqueceu a caminhada.', effect: { type: 'penalty', attribute: 'perseveranca', amount: -1, affectsGroup: true } },
    ],
    bibleReference: 'Apocalipse 22:17', lesson: '"Quem quiser, tome de graça da água da vida." A salvação é gratuita — não porque não tem valor, mas porque o preço já foi pago integralmente por Cristo.',
  },
  {
    id: 'd-a-012', difficulty: 'aprendiz',
    context: 'Um jovem peregrino se junta ao grupo. Ele está animado mas admite que não leu a Bíblia — só ouviu sermões. Ele pede para ficar com vocês.',
    situation: '"Eu sei que Jesus é bom! Ouvi muitos pregadores! Não preciso ler o livro, certo? Vocês me ensinam no caminho!"',
    choices: [
      { text: 'Aceitar e ensinar durante a caminhada', consequence: 'Vocês pararam para estudar juntos! "Examinem as Escrituras." O jovem abriu a Bíblia pela primeira vez e seus olhos brilharam.', effect: { type: 'boost', attribute: 'fe', amount: 1, affectsGroup: true } },
      { text: 'Dizer que ele precisa voltar e ler antes de continuar', consequence: 'Ele voltou... e nunca mais retornou. Vocês puseram uma barreira que Cristo não colocou. O caminho é para caminhar E aprender.', effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true } },
    ],
    bibleReference: 'Atos 8:31', lesson: 'O eunuco etíope perguntou: "Como poderia eu entender, se alguém não me explicar?" Discipulado é caminhar JUNTO, não exigir perfeição antes de começar.',
  },

  // ═══════ PEREGRINO — LOTE 3 ═══════
  {
    id: 'd-p-010', difficulty: 'peregrino',
    context: 'Um dos membros do grupo está exausto e quer descansar em um campo bonito ao lado do caminho. É o terreno do Gigante Desespero, mas vocês não sabem disso.',
    situation: '"Estou tão cansado... só um cochilo neste prado verde. O que pode dar errado?" diz o companheiro.',
    choices: [
      { text: 'Descansar juntos no prado', consequence: 'O Gigante Desespero capturou vocês dormindo! O conforto fora do caminho é uma armadilha. Perderam rodadas enquanto buscavam a chave da Promessa.', effect: { type: 'stun', stunTurns: 2, affectsGroup: true } },
      { text: 'Insistir em continuar até o próximo refúgio oficial', consequence: 'Foi difícil, mas logo encontraram um refúgio verdadeiro! A perseverança os protegeu do Gigante que vigiava o prado.', effect: { type: 'boost', attribute: 'perseveranca', amount: 2, affectsGroup: true } },
      { text: 'Descansar brevemente sem dormir', consequence: 'Vocês descansaram MAS mantiveram vigília. O Gigante apareceu, mas vocês fugiram a tempo! "Vigiai e orai."', effect: { type: 'boost', attribute: 'discernimento', amount: 1, affectsGroup: true } },
    ],
    bibleReference: 'Marcos 14:38', lesson: '"Vigiai e orai para não entrardes em tentação." O descanso é legítimo — mas no lugar errado se torna armadilha.',
    chainTrigger: { flag: 'escaped_despair_giant', description: 'Grupo escapou do Gigante Desespero' },
  },
  {
    id: 'd-p-011', difficulty: 'peregrino',
    context: 'Vocês encontram um grupo de peregrinos que celebra com danças e música — mas algo parece estranho. Eles dizem que "o caminho é festa, não sofrimento" e riem de quem fala em batalhas espirituais.',
    situation: '"Vocês são sérios demais! Deus quer que a gente seja feliz! Venham dançar conosco e esqueçam essas histórias de gigantes e armadilhas!"',
    choices: [
      { text: 'Juntar-se à celebração — Deus realmente quer nossa alegria', consequence: 'Era uma ilusão do Lisonjeiro! A "festa" desviou vocês do caminho e perderam direção. Alegria sem verdade é anestesia.', effect: { type: 'retreat', positions: 3, affectsGroup: true } },
      { text: 'Alertar com amor que a jornada tem celebração E batalha', consequence: '"Chorai com os que choram, alegrai-vos com os que se alegram." Alguns do grupo ouviram e voltaram ao caminho. Verdade com graça!', effect: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true } },
      { text: 'Ignorar e seguir em silêncio', consequence: 'Vocês tinham a verdade mas não a compartilharam. Misericórdia perdida.', effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true } },
    ],
    bibleReference: 'Romanos 12:15', lesson: 'O evangelho inclui celebração E sofrimento, alegria E batalha. Quem prega só um lado oferece um evangelho incompleto.',
  },

  // ═══════ VETERANO — LOTE 3 ═══════
  {
    id: 'd-v-013', difficulty: 'veterano',
    context: 'Vocês descobrem que um líder do grupo esteve mentindo sobre seu passado. Ele nunca passou pela Porta Estreita — entrou pelo muro como Formalista e Hipocrisia. Mas ele tem sido útil e corajoso.',
    situation: '"Sim, entrei pelo muro. Mas olhem minha dedicação! Olhem minhas obras! Isso não prova que sou verdadeiro?"',
    choices: [
      { text: 'Aceitar — as obras dele provam sinceridade', consequence: 'Vocês confundiram performance com transformação. "Nem todo o que me diz Senhor, Senhor..." A entrada importa tanto quanto a jornada.', effect: { type: 'penalty', attribute: 'discernimento', amount: -2, affectsGroup: true } },
      { text: 'Encaminhá-lo de volta à Porta com amor', consequence: 'Com lágrimas, ele voltou à Porta Estreita. Ao passar por ela, sentiu o fardo cair! Era a primeira vez. O grupo chorou junto.', effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true } },
      { text: 'Expulsá-lo imediatamente do grupo', consequence: 'Vocês tinham razão na doutrina mas erraram no tom. "Restaurai o tal em espírito de mansidão." Justiça sem misericórdia é farisaísmo.', effect: { type: 'penalty', attribute: 'coragem', amount: -1, affectsGroup: true } },
    ],
    bibleReference: 'Gálatas 6:1', lesson: 'A verdade sem graça é brutalidade. A graça sem verdade é sentimentalismo. O evangelho é verdade E graça — como Jesus (João 1:14).',
  },
  {
    id: 'd-v-014', difficulty: 'veterano',
    context: 'Um anjo aparece e diz que Deus vai abrir um atalho especial para vocês — mas apenas se concordarem em esquecer TUDO o que aprenderam até aqui. "Memória limpa, caminho rápido."',
    situation: '"Confiem em mim — sou um anjo de luz! Esqueçam as dificuldades, os ensinos, as cicatrizes. Comecem do zero com privilégios!"',
    choices: [
      { text: 'Aceitar — um anjo não mentiria', consequence: 'Era Satanás disfarçado de anjo de luz! (2 Co 11:14). Ao esquecer os ensinos, vocês ficaram vulneráveis novamente. As cicatrizes são diplomas!', effect: { type: 'retreat', positions: 5, affectsGroup: true } },
      { text: 'Testar o anjo: "Se és de Deus, glorifica a Cristo crucificado"', consequence: 'O falso anjo FUGIU ao ouvir o nome de Cristo crucificado! "Provai os espíritos." Discernimento exemplar!', effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true } },
      { text: 'Ignorar sem testar e seguir', consequence: 'Vocês se protegeram, mas não confrontaram. Outros peregrinos atrás de vocês podem cair na mesma armadilha.', effect: { type: 'boost', attribute: 'perseveranca', amount: 1, affectsGroup: true } },
    ],
    bibleReference: '1 João 4:1', lesson: '"Não creiais em todo espírito, mas provai se os espíritos são de Deus." Nem toda mensagem sobrenatural é divina. O critério é SEMPRE a Escritura.',
  },

  // ═══════ APRENDIZ — LOTE 4 ═══════
  {
    id: 'd-a-013', difficulty: 'aprendiz',
    context: 'Vocês encontram uma criança perdida no caminho. Ela diz ser filha de um peregrino que ficou para trás. Ela chora e pede ajuda.',
    situation: '"Meu pai disse para eu seguir em frente, mas estou com medo! Vocês podem me carregar?" A criança está exausta.',
    choices: [
      { text: 'Carregar a criança e caminhar mais devagar', consequence: 'Vocês cuidaram de um dos "pequeninos" de Cristo. "Quem recebe uma criança em meu nome, a mim me recebe!" O grupo é abençoado.', effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true } },
      { text: 'Dizer que ela precisa ser forte e andar sozinha', consequence: 'A criança caiu e ficou mais para trás. Misericórdia é ação, não conselho. "Não impeçais que os pequeninos venham a mim."', effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true } },
      { text: 'Voltar para encontrar o pai e devolver a criança', consequence: 'Vocês encontraram o pai ferido. Cuidaram dos dois! A compaixão completa vai além do pedido. O pai se juntou ao grupo.', effect: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true } },
    ],
    bibleReference: 'Mateus 18:5', lesson: '"Quem recebe uma criança em meu nome, a mim me recebe." Cuidar dos vulneráveis é servir a Cristo diretamente.',
  },
  {
    id: 'd-a-014', difficulty: 'aprendiz',
    context: 'Uma tempestade terrível cai sobre o grupo. Trovões, relâmpagos e chuva fortíssima. Um membro do grupo diz: "Deus está nos punindo!"',
    situation: 'Outro responde: "Não! Deus nos abandonou!" O medo cresce. O grupo precisa de uma resposta.',
    choices: [
      { text: 'Concordar — a tempestade é castigo de Deus', consequence: 'Vocês confundiram provação com punição. A chuva cai sobre justos e injustos (Mt 5:45). Nem toda dificuldade é castigo.', effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true } },
      { text: 'Lembrar do Salmo 46:1 — "Deus é nosso refúgio e fortaleza"', consequence: 'A Escritura acalmou o grupo! "Deus é nosso refúgio, socorro bem presente na angústia." O medo se transformou em confiança.', effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true } },
      { text: 'Correr para se abrigar fora do caminho', consequence: 'Vocês saíram do caminho por medo da tempestade. A tempestade passou, mas agora estão perdidos fora do caminho estreito.', effect: { type: 'retreat', positions: 2, affectsGroup: true } },
    ],
    bibleReference: 'Salmos 46:1', lesson: '"Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia." Tempestades não são sinais de abandono — são oportunidades de fé.',
  },

  // ═══════ PEREGRINO — LOTE 4 ═══════
  {
    id: 'd-p-012', difficulty: 'peregrino',
    context: 'Vocês encontram um peregrino ferido que confessa ter SAÍDO do caminho por orgulho e agora quer voltar. Ele está arrependido, mas outros peregrinos dizem: "Quem sai não volta."',
    situation: '"Eu errei... sei que errei. Mas estou arrependido. O Rei me aceitará de volta?" Ele chora de vergonha.',
    choices: [
      { text: 'Dizer que quem saiu não pode voltar', consequence: 'Vocês negaram a graça restauradora! O filho pródigo voltou e o pai CORREU ao seu encontro. A porta nunca se fecha para quem se arrepende.', effect: { type: 'penalty', attribute: 'fe', amount: -2, affectsGroup: true } },
      { text: 'Acolhê-lo e ajudá-lo a voltar ao caminho', consequence: '"Há alegria no céu por um pecador que se arrepende!" Vocês refletiram o coração do Pai. O peregrino restaurado se tornou um dos mais zelosos do grupo.', effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true } },
      { text: 'Aceitar, mas com condições e período probatório', consequence: 'Vocês impuseram condições que o Pai não impõe. A graça é incondicional. "Trazei o melhor vestido e vesti-o!" — sem condições.', effect: { type: 'penalty', attribute: 'discernimento', amount: -1, affectsGroup: true } },
    ],
    bibleReference: 'Lucas 15:20-24', lesson: 'O pai do filho pródigo não exigiu explicações, período probatório ou penitência. CORREU, abraçou, vestiu e celebrou. A graça restauradora é incondicional.',
    chainTrigger: { flag: 'restored_fallen_pilgrim', description: 'Grupo restaurou um peregrino caído' },
  },

  // ═══════ VETERANO — LOTE 4 ═══════
  {
    id: 'd-v-015', difficulty: 'veterano',
    context: 'Vocês chegam a uma encruzilhada onde AMBOS os caminhos parecem corretos. Há evidências bíblicas para os dois. Outros peregrinos sinceros discordam entre si sobre qual é o certo.',
    situation: 'Um peregrino cita Romanos para justificar o caminho da esquerda. Outro cita Tiago para o da direita. Ambos parecem sinceros e biblicamente fundamentados.',
    choices: [
      { text: 'Seguir o que tem mais argumentos bíblicos', consequence: 'Quantidade de versículos não determina verdade. Satanás citou Escritura para tentar Jesus (Mt 4:6). Discernimento exige mais que contagem de versículos.', effect: { type: 'penalty', attribute: 'discernimento', amount: -1, affectsGroup: true } },
      { text: 'Parar, orar e buscar o Espírito Santo antes de decidir', consequence: '"Se algum de vós tem falta de sabedoria, peça a Deus" (Tg 1:5). Vocês oraram, e a paz de Deus indicou a direção. A oração é o GPS espiritual.', effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true } },
      { text: 'Dividir o grupo — cada um segue o caminho que acha melhor', consequence: 'A divisão enfraqueceu o grupo. "Uma casa dividida contra si mesma não subsistirá." A unanimidade na oração teria mostrado o caminho.', effect: { type: 'penalty', attribute: 'perseveranca', amount: -2, affectsGroup: true } },
    ],
    bibleReference: 'Tiago 1:5', lesson: '"Se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente." Quando a Bíblia parece ambígua, a oração traz clareza. O Espírito Santo é o intérprete final.',
  },
  {
    id: 'd-v-016', difficulty: 'veterano',
    context: 'Um dos membros do grupo está passando por sofrimento intenso — doença na família, perda financeira, solidão. Ele pergunta ao grupo: "Por que Deus permite isso se eu estou no caminho certo?"',
    situation: '"Estou obedecendo! Estou no caminho estreito! Por que a dor só aumenta? Talvez eu esteja no caminho errado..."',
    choices: [
      { text: 'Dizer que sofrimento é sinal de pecado oculto', consequence: 'Vocês cometeram o erro dos amigos de Jó! Sofrimento NÃO é prova de pecado. Jó era "íntegro e reto" e sofreu terrivelmente. Vocês feriram em vez de curar.', effect: { type: 'penalty', attribute: 'fe', amount: -2, affectsGroup: true } },
      { text: 'Sentar ao lado, chorar junto e lembrar de Romanos 8:28', consequence: '"Chorai com os que choram." Vocês não explicaram a dor — compartilharam. Às vezes, presença vale mais que palavras. O amigo sentiu-se amado.', effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true } },
      { text: 'Dar conselhos práticos para resolver os problemas', consequence: 'Bem-intencionado, mas fora de hora. Ele não precisava de soluções — precisava de presença. "Há tempo para calar" (Ec 3:7).', effect: { type: 'boost', attribute: 'discernimento', amount: 1, affectsGroup: true } },
    ],
    bibleReference: 'Romanos 12:15', lesson: '"Chorai com os que choram." O ministério da presença é mais poderoso que o ministério da explicação. Jó melhorou quando Deus apareceu — não quando os amigos explicaram.',
  },
];

