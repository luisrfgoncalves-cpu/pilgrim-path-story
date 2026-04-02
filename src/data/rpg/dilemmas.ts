import { MoralDilemma } from './types';

// ═══════════════════════════════════════════════════════
// BANCO DE DILEMAS MORAIS COM CONSEQUÊNCIAS OCULTAS
// 30+ dilemas baseados no Peregrino e na Bíblia
// ═══════════════════════════════════════════════════════

export const moralDilemmas: MoralDilemma[] = [
  // ═══════ APRENDIZ ═══════
  {
    id: 'd-a-001', difficulty: 'aprendiz',
    context: 'Vocês estão no caminho quando encontram um viajante caído, ferido e suplicando por ajuda. Mas ele está fora do caminho estreito, em uma trilha lateral perigosa.',
    situation: 'O viajante implora: "Por favor, saiam do caminho para me ajudar!" Mas Evangelista avisou para NUNCA deixar o caminho estreito.',
    choices: [
      {
        text: 'Sair do caminho para ajudar o viajante',
        consequence: 'Era uma armadilha do Lisonjeiro! Vocês caíram em uma rede e perderam tempo precioso.',
        effect: { type: 'retreat', positions: 3, affectsGroup: true }
      },
      {
        text: 'Gritar palavras de encorajamento sem sair do caminho',
        consequence: 'O viajante se levantou sozinho! Era um teste de obediência. Vocês foram sábios.',
        effect: { type: 'boost', attribute: 'discernimento', amount: 2, affectsGroup: true }
      },
      {
        text: 'Ignorar completamente e seguir em frente',
        consequence: 'Vocês passaram por alguém que realmente precisava de uma palavra. Misericórdia foi perdida.',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Provérbios 4:27',
    lesson: 'Podemos ajudar sem abandonar o caminho de Deus. Sabedoria é saber como ajudar sem se comprometer.'
  },
  {
    id: 'd-a-002', difficulty: 'aprendiz',
    context: 'Na Feira da Vaidade, um comerciante oferece a vocês um mapa que mostra um atalho para a Cidade Celestial, pulando metade do caminho.',
    situation: '"Este mapa custa apenas uma pequena mentira — digam que não são peregrinos e eu dou o atalho!" diz o comerciante sorrindo.',
    choices: [
      {
        text: 'Aceitar o mapa e mentir',
        consequence: 'O mapa era falso e levava a um abismo! Mentir sempre tem consequências.',
        effect: { type: 'retreat', positions: 5, affectsGroup: true }
      },
      {
        text: 'Recusar e declarar "Somos peregrinos do Rei!"',
        consequence: 'O comerciante ficou furioso, mas outros peregrinos ouviram e se juntaram a vocês! Coragem recompensada.',
        effect: { type: 'boost', attribute: 'coragem', amount: 2, affectsGroup: true }
      },
      {
        text: 'Recusar silenciosamente e ir embora',
        consequence: 'Prudência! Não compraram a mentira, mas perderam a oportunidade de testemunhar.',
        effect: { type: 'advance', positions: 1, affectsGroup: true }
      }
    ],
    bibleReference: 'Provérbios 12:22',
    lesson: 'Nunca existe atalho legítimo para o Reino de Deus. "Os lábios mentirosos são abominação ao Senhor."'
  },
  {
    id: 'd-a-003', difficulty: 'aprendiz',
    context: 'Estão descansando quando chega um peregrino exausto dizendo que largou tudo para seguir o Rei, mas agora está com fome e frio.',
    situation: 'Vocês têm provisões limitadas. Compartilhar significa que vocês passarão fome na próxima etapa.',
    choices: [
      {
        text: 'Compartilhar metade das provisões',
        consequence: 'O peregrino recuperou forças e revelou um caminho mais seguro adiante! Deus supriu a necessidade.',
        effect: { type: 'advance', positions: 2, affectsGroup: true }
      },
      {
        text: 'Dar todas as provisões',
        consequence: 'Generosidade extrema! Vocês ficaram sem nada, mas encontraram um Refúgio logo adiante. Deus honrou a fé.',
        effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true }
      },
      {
        text: 'Não compartilhar para se proteger',
        consequence: 'O peregrino se foi triste. Vocês tinham provisões, mas o peso da culpa os fez andar mais devagar.',
        effect: { type: 'penalty', attribute: 'perseveranca', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Lucas 6:38',
    lesson: '"Dai e dar-se-vos-á." A generosidade nunca empobrece quem confia em Deus.'
  },
  {
    id: 'd-a-004', difficulty: 'aprendiz',
    context: 'Vocês ouvem gritos de socorro vindos do Castelo da Dúvida. Parece que outros peregrinos estão presos lá dentro.',
    situation: 'O Gigante Desespero está dormindo. Vocês podem tentar resgatar os presos, mas há risco de serem capturados também.',
    choices: [
      {
        text: 'Entrar no castelo para resgatar os presos',
        consequence: 'Vocês usaram a chave da Promessa e libertaram 3 peregrinos! Mas o gigante acordou e vocês precisaram correr!',
        effect: { type: 'boost', attribute: 'coragem', amount: 3, affectsGroup: true }
      },
      {
        text: 'Orar pelos presos e seguir em frente',
        consequence: 'Vocês oraram fervorosamente e um anjo foi enviado para libertá-los. A oração é poderosa!',
        effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true }
      },
      {
        text: 'Passar ao largo com medo do gigante',
        consequence: 'O medo venceu. Vocês ouvem os gritos se tornarem silêncio...',
        effect: { type: 'penalty', attribute: 'coragem', amount: -2, affectsGroup: true }
      }
    ],
    bibleReference: 'Hebreus 13:3',
    lesson: '"Lembrai-vos dos presos, como se estivésseis presos com eles." Nunca ignore quem sofre quando você pode agir.'
  },
  {
    id: 'd-a-005', difficulty: 'aprendiz',
    context: 'Um jovem peregrino quer se juntar ao grupo, mas ele confessa que roubou antes de começar a jornada.',
    situation: '"Eu me arrependi! Deus me perdoou! Posso caminhar com vocês?" ele pergunta com lágrimas nos olhos.',
    choices: [
      {
        text: 'Aceitar o jovem no grupo',
        consequence: 'O jovem se tornou o mais zeloso do grupo! A graça transforma vidas.',
        effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true }
      },
      {
        text: 'Recusar porque ele é um ladrão',
        consequence: 'O jovem se afastou triste e voltou para a Cidade da Destruição. Vocês negaram a graça que receberam.',
        effect: { type: 'penalty', attribute: 'fe', amount: -2, affectsGroup: true }
      }
    ],
    bibleReference: 'Efésios 2:8-9',
    lesson: 'Nenhum de nós merece a graça. Se Deus nos perdoou, quem somos nós para rejeitar quem se arrepende?'
  },

  // ═══════ PEREGRINO ═══════
  {
    id: 'd-p-001', difficulty: 'peregrino',
    context: 'Vocês encontram Sabedoria Mundana, que os aconselha a passar pela vila da Moralidade em vez de enfrentar o Vale da Humilhação.',
    situation: '"O caminho pela Moralidade é mais seguro, mais confortável e leva ao mesmo destino. Por que sofrer desnecessariamente?"',
    choices: [
      {
        text: 'Seguir pelo caminho da Moralidade',
        consequence: 'O Monte Sinai tremeu sobre vocês! O caminho da moralidade sem Cristo leva à condenação da Lei.',
        effect: { type: 'retreat', positions: 4, affectsGroup: true }
      },
      {
        text: 'Rejeitar o conselho e enfrentar o Vale',
        consequence: 'O vale foi duro, mas vocês saíram mais fortes. Cristão teria aprovado!',
        effect: { type: 'boost', attribute: 'perseveranca', amount: 2, affectsGroup: true }
      },
      {
        text: 'Debater com Sabedoria Mundana usando as Escrituras',
        consequence: 'Sabedoria Mundana ficou sem resposta e fugiu! A Palavra é mais afiada que espada!',
        effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true }
      }
    ],
    bibleReference: 'Colossenses 2:8',
    lesson: '"Cuidado para que ninguém vos engane com filosofias e vãs sutilezas." A sabedoria do mundo é inimiga da cruz.'
  },
  {
    id: 'd-p-002', difficulty: 'peregrino',
    context: 'Vocês descobrem que um membro do grupo escondeu um ídolo de ouro encontrado na Feira da Vaidade.',
    situation: 'O ídolo é valioso e bonito. "Não é um ídolo de verdade, é apenas uma lembrança!" ele argumenta.',
    choices: [
      {
        text: 'Deixar ele ficar com o ídolo, não é para adoração',
        consequence: 'O ídolo atraiu ladrões durante a noite. O grupo perdeu provisões e atrasou.',
        effect: { type: 'retreat', positions: 3, affectsGroup: true }
      },
      {
        text: 'Pedir gentilmente que abandone o ídolo',
        consequence: 'Ele entendeu e jogou o ídolo fora. O grupo ficou mais leve e mais unido.',
        effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true }
      },
      {
        text: 'Expulsar o membro do grupo imediatamente',
        consequence: 'Dureza sem graça! Ele se foi amargo. Vocês tinham razão na doutrina mas falharam no amor.',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Josué 7:1-12',
    lesson: 'Acã escondeu despojos proibidos e todo Israel sofreu. O pecado oculto afeta toda a comunidade.'
  },
  {
    id: 'd-p-003', difficulty: 'peregrino',
    context: 'Vocês chegam a uma bifurcação. O caminho da direita tem uma placa: "Caminho fácil — sem gigantes, sem vales." O da esquerda: "Caminho do Rei — perigos adiante."',
    situation: 'Um peregrino antigo diz: "Eu fui pela esquerda e perdi um olho para o gigante. A direita é mais sábia."',
    choices: [
      {
        text: 'Ir pela direita (caminho fácil)',
        consequence: 'Era o Prado do Engano! Vocês foram capturados pelo Gigante Desespero. Pior do que o caminho difícil!',
        effect: { type: 'stun', stunTurns: 2, affectsGroup: true }
      },
      {
        text: 'Ir pela esquerda (caminho do Rei)',
        consequence: 'Enfrentaram o gigante COM a armadura de Deus e venceram! As cicatrizes da batalha são medalhas de honra.',
        effect: { type: 'advance', positions: 3, affectsGroup: true }
      }
    ],
    bibleReference: 'Mateus 7:13-14',
    lesson: 'O caminho largo que parece fácil leva à destruição. O caminho estreito que parece difícil leva à vida.'
  },
  {
    id: 'd-p-004', difficulty: 'peregrino',
    context: 'Na Terra Encantada, um sono irresistível começa a tomar vocês. Flores perfumadas e música suave enchem o ar.',
    situation: 'Um membro do grupo sussurra: "Só cinco minutinhos... estamos tão perto da Cidade Celestial, um cochilo não faz mal..."',
    choices: [
      {
        text: 'Descansar cinco minutos',
        consequence: 'Cinco minutos viraram cinco horas! Acordaram com o sol se pondo e perderam tempo crucial.',
        effect: { type: 'stun', stunTurns: 1, affectsGroup: true }
      },
      {
        text: 'Rezar em voz alta e marchar cantando hinos',
        consequence: 'Os cânticos quebraram o encanto! Vocês atravessaram a Terra Encantada sem dormir.',
        effect: { type: 'advance', positions: 2, affectsGroup: true }
      },
      {
        text: 'Beliscar uns aos outros para ficar acordados',
        consequence: 'Funcionou! Incomodante mas eficaz. O grupo se manteve alerta com um pouco de dor.',
        effect: { type: 'boost', attribute: 'perseveranca', amount: 1, affectsGroup: true }
      }
    ],
    bibleReference: '1 Tessalonicenses 5:6',
    lesson: '"Não durmamos como os demais, mas vigiemos e sejamos sóbrios." A vigilância é especialmente crucial perto do fim.'
  },
  {
    id: 'd-p-005', difficulty: 'peregrino',
    context: 'Vocês encontram o Ateu, que ri dizendo: "Eu procurei a Cidade Celestial por 20 anos e ela não existe! Voltem para casa!"',
    situation: 'Ele parece sincero e experiente. Alguns no grupo começam a duvidar.',
    choices: [
      {
        text: 'Ouvir o Ateu e considerar voltar',
        consequence: 'Quase caíram! Um anjo apareceu e disse: "Ele nunca esteve no caminho certo." A dúvida custou tempo.',
        effect: { type: 'retreat', positions: 2, affectsGroup: true }
      },
      {
        text: 'Citar a Escritura e rejeitar a mentira',
        consequence: '"Andamos por fé e não por vista!" O Ateu ficou mudo e vocês prosseguiram com convicção renovada.',
        effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true }
      },
      {
        text: 'Debater longamente com o Ateu',
        consequence: 'O debate consumiu horas sem resultado. O Ateu não queria verdade, queria companhia na descrença.',
        effect: { type: 'stun', stunTurns: 1, affectsGroup: true }
      }
    ],
    bibleReference: '2 Coríntios 5:7',
    lesson: '"Andamos por fé e não por vista." A experiência do incrédulo não invalida a promessa de Deus.'
  },

  // ═══════ VETERANO ═══════
  {
    id: 'd-v-001', difficulty: 'veterano',
    context: 'Vocês encontram um grupo de peregrinos que interpretam as Escrituras de forma diferente. Eles afirmam que o Portão Estreito é simbólico e que todos os caminhos levam à Cidade Celestial.',
    situation: '"Deus é amor e jamais rejeitaria alguém. Não sejam exclusivistas como Cristão foi!" dizem eles com convicção.',
    choices: [
      {
        text: 'Aceitar a interpretação inclusivista por amor',
        consequence: 'Vocês seguiram o grupo e acabaram no caminho que leva ao Erro — o abismo que os pastores mostraram nas Montanhas Deleitosas.',
        effect: { type: 'retreat', positions: 6, affectsGroup: true }
      },
      {
        text: 'Rejeitar com firmeza mas com graça, usando as Escrituras',
        consequence: 'Vocês citaram João 14:6 e Atos 4:12 com amor. Dois do grupo repensaram e se juntaram a vocês.',
        effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true }
      },
      {
        text: 'Rejeitar com raiva e chamar o grupo de hereges',
        consequence: 'A verdade foi dita, mas sem amor. O grupo se fechou completamente. "A verdade sem amor é brutalidade."',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Efésios 4:15',
    lesson: '"Falando a verdade em amor." A verdade sem amor machuca; o amor sem verdade engana. Precisamos dos dois.'
  },
  {
    id: 'd-v-002', difficulty: 'veterano',
    context: 'Vocês descobrem que o líder do grupo tem pregado com motivações erradas — buscando glória pessoal em vez de glorificar a Deus.',
    situation: 'O líder é carismático e eficaz — muitos foram ajudados por ele. Mas sua motivação é vaidade. Confrontá-lo pode dividir o grupo.',
    choices: [
      {
        text: 'Confrontar publicamente diante de todos',
        consequence: 'O grupo se dividiu amargamente. A verdade foi dita no momento errado e da forma errada.',
        effect: { type: 'penalty', attribute: 'perseveranca', amount: -2, affectsGroup: true }
      },
      {
        text: 'Falar em particular primeiro, com dois ou três testemunhas',
        consequence: 'O líder se arrependeu em particular! O grupo nunca soube e ele se tornou genuíno. Mateus 18 funcionou!',
        effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true }
      },
      {
        text: 'Ignorar porque os resultados são bons',
        consequence: 'A motivação corrupta eventualmente corrompeu os frutos. "Árvore má não pode dar bons frutos" — a longo prazo.',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Mateus 18:15-17',
    lesson: 'A disciplina bíblica segue uma ordem: particular primeiro, depois com testemunhas, depois a comunidade. A ordem importa tanto quanto a verdade.'
  },
  {
    id: 'd-v-003', difficulty: 'veterano',
    context: 'Vocês estão presos no Castelo da Dúvida. O Gigante Desespero oferece uma proposta: "Se um de vocês ficar para sempre como meu servo, eu liberto os demais."',
    situation: 'Um membro do grupo se voluntaria para ficar. "Eu fico. Vocês sigam para a Cidade Celestial sem mim."',
    choices: [
      {
        text: 'Aceitar o sacrifício do voluntário',
        consequence: 'O gigante riu! "Nenhum de vocês tem poder de salvar o outro. Só a chave da Promessa abre estas portas!" Vocês perderam tempo precioso.',
        effect: { type: 'stun', stunTurns: 1, affectsGroup: true }
      },
      {
        text: 'Recusar e buscar a chave da Promessa juntos',
        consequence: 'Cristão encontrou a chave no peito! Todos foram libertos. Ninguém precisou ficar para trás.',
        effect: { type: 'advance', positions: 4, affectsGroup: true }
      },
      {
        text: 'Tentar lutar contra o gigante fisicamente',
        consequence: 'O gigante é forte demais para força humana. Vocês foram espancados e ficaram mais fracos.',
        effect: { type: 'penalty', attribute: 'coragem', amount: -2, affectsGroup: true }
      }
    ],
    bibleReference: 'Filipenses 1:6',
    lesson: 'Nenhum sacrifício humano pode substituir a obra de Cristo. Só as promessas de Deus nos libertam do desespero.'
  },
  {
    id: 'd-v-004', difficulty: 'veterano',
    context: 'Vocês encontram um pergaminho antigo que contém uma profecia sobre o grupo. A profecia diz que um de vocês não completará a jornada.',
    situation: 'A profecia parece genuína. O grupo está abalado. Cada um olha para o outro com suspeita.',
    choices: [
      {
        text: 'Aceitar a profecia e tentar identificar quem vai falhar',
        consequence: 'A paranoia destruiu a confiança do grupo. O pergaminho era do Lisonjeiro — mais uma armadilha!',
        effect: { type: 'penalty', attribute: 'perseveranca', amount: -2, affectsGroup: true }
      },
      {
        text: 'Queimar o pergaminho — profecias de origem duvidosa devem ser rejeitadas',
        consequence: 'Boa decisão! "Examinai tudo e retende o que é bom." O grupo se uniu mais forte.',
        effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true }
      },
      {
        text: 'Guardar o pergaminho e orar sobre ele',
        consequence: 'A ansiedade persistiu. O pergaminho era falso, mas a dúvida plantada demorou a ser arrancada.',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: '1 Tessalonicenses 5:20-21',
    lesson: '"Não desprezeis as profecias. Examinai tudo e retende o que é bom." Nem toda palavra que parece espiritual vem de Deus.'
  },
  {
    id: 'd-v-005', difficulty: 'veterano',
    context: 'Vocês encontram Demas na mina de prata. Ele mostra montanhas de riqueza e diz: "Usem isso para financiar o evangelho! Construam igrejas! Alimentem os pobres!"',
    situation: 'O argumento é persuasivo — a riqueza PODERIA ser usada para o bem. Mas significa desviar do caminho.',
    choices: [
      {
        text: 'Entrar na mina — riqueza usada para Deus não é pecado',
        consequence: 'O chão cedeu dentro da mina! A cobiça disfarçada de piedade é a mais perigosa. Vocês quase não escaparam.',
        effect: { type: 'retreat', positions: 5, affectsGroup: true }
      },
      {
        text: 'Recusar — Deus não precisa de ouro roubado do caminho',
        consequence: 'Vocês lembraram: "Buscai primeiro o Reino de Deus e sua justiça, e todas estas coisas vos serão acrescentadas."',
        effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true }
      }
    ],
    bibleReference: 'Mateus 6:33',
    lesson: 'A cobiça mais perigosa é aquela disfarçada de generosidade. Deus não precisa que desobedeçamos para financiar Sua obra.'
  },
];
