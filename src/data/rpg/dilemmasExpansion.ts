import { MoralDilemma } from './types';

// ═══════════════════════════════════════════════════════
// EXPANSÃO DE DILEMAS MORAIS — LOTE 2
// Dilemas com consequências em cadeia e revelações
// ═══════════════════════════════════════════════════════

export const moralDilemmasExpansion: MoralDilemma[] = [
  // ═══════ APRENDIZ — EXPANSÃO ═══════
  {
    id: 'd-a-006', difficulty: 'aprendiz',
    context: 'Vocês encontram uma placa no caminho que diz: "Atalho Seguro — Aprovado pelo Senhor Sabedoria Mundana." O caminho parece mais confortável e sombreado.',
    situation: 'Um membro do grupo diz: "Deus não ia querer que sofrêssemos desnecessariamente, certo? Este atalho pode ser uma bênção!"',
    choices: [
      {
        text: 'Seguir o atalho — Deus quer nosso conforto',
        consequence: 'O atalho levava ao Monte Sinai! O chão tremeu, trovões rugiam, e o peso da Lei caiu sobre vocês! Sabedoria Mundana mentiu de novo.',
        effect: { type: 'retreat', positions: 4, affectsGroup: true }
      },
      {
        text: 'Permanecer no caminho estreito — desconfiar de facilidades',
        consequence: '"Entrai pela porta estreita!" O caminho era difícil mas logo chegou a um lugar de refrigério. Deus honra a obediência.',
        effect: { type: 'advance', positions: 2, affectsGroup: true }
      },
      {
        text: 'Enviar um voluntário para verificar primeiro',
        consequence: 'O voluntário voltou pálido — o atalho tinha um precipício escondido atrás da primeira curva! Sabedoria sem ação é inútil, mas prudência salvou o grupo.',
        effect: { type: 'boost', attribute: 'discernimento', amount: 2, affectsGroup: true }
      }
    ],
    bibleReference: 'Provérbios 14:12',
    lesson: '"Há caminho que parece certo ao homem, mas o fim dele são caminhos de morte." Nem todo conselho "sensato" vem de Deus.',
    chainTrigger: { flag: 'rejected_shortcut', description: 'Grupo rejeitou o atalho de Sabedoria Mundana' },
  },
  {
    id: 'd-a-007', difficulty: 'aprendiz',
    context: 'Um antigo companheiro de viagem reaparece, agora rico e bem vestido. Ele diz: "Eu saí do caminho estreito e estou melhor do que nunca! Deus abençoou minha escolha!"',
    situation: '"Olhem para mim! Tenho casa, família e prosperidade. Vocês estão sujos, cansados e com fome. Quem está certo?"',
    choices: [
      {
        text: 'Ele tem razão — a prosperidade dele prova a bênção de Deus',
        consequence: 'Era Volúvel disfarçado de próspero! Atrás do sorriso havia vazio. "Que aproveita ao homem ganhar o mundo inteiro e perder a sua alma?"',
        effect: { type: 'penalty', attribute: 'fe', amount: -2, affectsGroup: true }
      },
      {
        text: 'Prosperidade não é prova de bênção — perseverar no caminho',
        consequence: 'Vocês responderam: "Andamos por fé, não por vista." O Mestre bate o cajado e anuncia: "DISCERNIMENTO EXEMPLAR!"',
        effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true }
      }
    ],
    bibleReference: 'Marcos 8:36',
    lesson: '"Que aproveita ao homem ganhar o mundo inteiro e perder a sua alma?" A prosperidade terrena não é indicador de aprovação divina.',
  },
  {
    id: 'd-a-008', difficulty: 'aprendiz',
    context: 'Vocês encontram um jovem peregrino chorando no caminho. Ele diz que caiu em pecado e agora tem vergonha de continuar a jornada.',
    situation: '"Eu não mereço mais caminhar com vocês. Deus deve estar furioso comigo. É melhor eu voltar para a Cidade da Destruição."',
    choices: [
      {
        text: 'Concordar — quem peca deve sair do caminho',
        consequence: 'O jovem voltou e se perdeu. Vocês agiram como o Gigante Desespero — dizendo que não havia esperança.',
        effect: { type: 'penalty', attribute: 'fe', amount: -3, affectsGroup: true }
      },
      {
        text: 'Encorajá-lo com 1 João 1:9 — "Se confessarmos, Ele perdoa"',
        consequence: 'O jovem confessou, se levantou e caminhou com renovada coragem! A graça restaura. O grupo ganhou um aliado fiel.',
        effect: { type: 'boost', attribute: 'fe', amount: 3, affectsGroup: true }
      },
      {
        text: 'Dar um sermão sobre as consequências do pecado',
        consequence: 'O sermão era verdadeiro mas fora de hora. "A cana trilhada não quebrará." Ele precisava de abraço, não de aula.',
        effect: { type: 'penalty', attribute: 'perseveranca', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: '1 João 1:9',
    lesson: '"Se confessarmos os nossos pecados, Ele é fiel e justo para nos perdoar." O arrependimento genuíno sempre encontra perdão.',
  },

  // ═══════ PEREGRINO — EXPANSÃO ═══════
  {
    id: 'd-p-006', difficulty: 'peregrino',
    context: 'Vocês chegam a uma encruzilhada onde um "profeta" diz ter recebido uma revelação: "O caminho estreito mudou de direção! Deus me revelou o novo caminho!"',
    situation: 'Ele parece piedoso, jejua muito, ora em público, e tem seguidores devotos que testemunham "milagres." Mas a "nova revelação" contradiz Mateus 7:13.',
    choices: [
      {
        text: 'Seguir a nova revelação — Deus pode mudar de planos',
        consequence: 'Era o Lisonjeiro com nova máscara! A "nova revelação" levou a uma rede. Deus NÃO contradiz Sua Palavra escrita.',
        effect: { type: 'retreat', positions: 5, affectsGroup: true }
      },
      {
        text: 'Testar pela Escritura: "Se alguém pregar outro evangelho, seja anátema" (Gl 1:8)',
        consequence: 'O "profeta" ficou furioso quando confrontado com a Escritura e fugiu! Os bereanos teriam orgulho de vocês.',
        effect: { type: 'boost', attribute: 'discernimento', amount: 4, affectsGroup: true }
      },
      {
        text: 'Ignorar e seguir em frente sem interagir',
        consequence: 'Prudente, mas os seguidores dele continuarão enganados. Às vezes silêncio diante do erro é cumplicidade.',
        effect: { type: 'advance', positions: 1, affectsGroup: true }
      }
    ],
    bibleReference: 'Gálatas 1:8',
    lesson: '"Se alguém vos pregar outro evangelho além do que recebestes, seja anátema." Nenhuma experiência espiritual substitui ou contradiz a Escritura.',
    chainTrigger: { flag: 'exposed_false_prophet', description: 'Grupo desmascarou um falso profeta' },
  },
  {
    id: 'd-p-007', difficulty: 'peregrino',
    context: 'Vocês encontram dois grupos de peregrinos discutindo acaloradamente sobre uma doutrina. Um grupo diz que a salvação pode ser perdida; o outro diz que é eterna.',
    situation: 'Ambos os grupos citam versículos bíblicos para apoiar suas posições. Ambos parecem sinceros. Ambos pedem que vocês se juntem ao lado deles.',
    choices: [
      {
        text: 'Escolher o lado que parece ter mais versículos',
        consequence: 'Vocês entraram em uma discussão sem fim e perderam tempo. Contar versículos não é estudar — é debater.',
        effect: { type: 'stun', stunTurns: 1, affectsGroup: true }
      },
      {
        text: 'Dizer que ambos têm pontos válidos e que a humildade é mais importante que ganhar debate',
        consequence: 'Os dois grupos pararam, refletiram e reconheceram que a discussão havia se tornado orgulhosa. O amor uniu o que o debate dividiu.',
        effect: { type: 'boost', attribute: 'fe', amount: 2, affectsGroup: true }
      },
      {
        text: 'Recusar participar e continuar andando — a jornada é mais importante que debates',
        consequence: 'Vocês seguiram em frente. Mas o grupo quieto refletiu: nem todo debate é perda de tempo — alguns são necessários para a verdade.',
        effect: { type: 'advance', positions: 1, affectsGroup: true }
      }
    ],
    bibleReference: '2 Timóteo 2:23-25',
    lesson: '"Rejeita as questões insensatas, pois produzem contendas. O servo do Senhor não deve contender, mas ser manso para com todos." A forma importa tanto quanto o conteúdo.',
  },

  // ═══════ VETERANO — EXPANSÃO ═══════
  {
    id: 'd-v-009', difficulty: 'veterano',
    context: 'Vocês encontram um teólogo brilhante que argumenta: "A doutrina da predestinação significa que nada do que fazemos importa. Se Deus já decidiu, por que evangelizar?"',
    situation: 'Ele cita Efésios 1:4-5 com precisão. Seu argumento é logicamente coerente. Alguns no grupo ficam abalados.',
    choices: [
      {
        text: 'Concordar — se Deus predestinou, evangelismo é desnecessário',
        consequence: 'O Mestre bate o cajado: "ERRO GRAVE!" A soberania de Deus não anula a responsabilidade humana. São trilhos paralelos, não contraditórios.',
        effect: { type: 'penalty', attribute: 'discernimento', amount: -3, affectsGroup: true }
      },
      {
        text: 'Responder: "Deus predestinou tanto o FIM (salvação) quanto os MEIOS (pregação)" — citar Romanos 10:14',
        consequence: 'BRILHANTE! "Como crerão se não houver quem pregue?" A predestinação INCLUI os meios — e nós somos os meios que Deus escolheu.',
        effect: { type: 'boost', attribute: 'discernimento', amount: 4, affectsGroup: true }
      },
      {
        text: 'Dizer que a predestinação não existe',
        consequence: 'Negar um ensino bíblico claro não resolve o problema. Efésios 1:4-5 existe — é preciso INTEGRAR, não negar.',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Romanos 10:14-15',
    lesson: 'A soberania de Deus e a responsabilidade humana são como os dois trilhos de um trem — parecem paralelos e nunca se encontram ao nosso olhar, mas sustentam o mesmo trem.',
  },
  {
    id: 'd-v-010', difficulty: 'veterano',
    context: 'Vocês encontram um grupo de peregrinos que praticam "silêncio contemplativo" — oração sem palavras, meditação em vazio, esvaziamento da mente para "ouvir Deus."',
    situation: '"A Bíblia diz para estarmos quietos diante de Deus! Esvaziar a mente é a forma mais pura de oração!" Eles parecem muito pacíficos.',
    choices: [
      {
        text: 'Adotar a prática — parece espiritual e pacífica',
        consequence: 'A mente vazia é terreno fértil para engano. Cristão aprendeu que a Espada do Espírito (a Palavra) é ATIVA, não passiva. Bunyan encheria a mente com Escritura, não a esvaziaria.',
        effect: { type: 'penalty', attribute: 'discernimento', amount: -2, affectsGroup: true }
      },
      {
        text: 'Explicar que meditação bíblica é ENCHER a mente com a Palavra, não esvaziá-la',
        consequence: '"Medita na minha lei de dia e de noite" (Sl 1:2). Meditação bíblica é ruminar a Palavra, não esvaziar a mente. Discernimento que salva de engano!',
        effect: { type: 'boost', attribute: 'discernimento', amount: 3, affectsGroup: true }
      },
      {
        text: 'Ignorá-los — cada um com sua prática',
        consequence: 'A tolerância não confrontou o erro. Alguns do grupo ficaram curiosos e quase se desviaram depois.',
        effect: { type: 'penalty', attribute: 'fe', amount: -1, affectsGroup: true }
      }
    ],
    bibleReference: 'Josué 1:8',
    lesson: '"Medita neste livro da Lei DE DIA E DE NOITE." Meditação bíblica é enchimento ativo com a Palavra, não esvaziamento místico. A diferença é entre Escritura e paganismo.',
  },
];
