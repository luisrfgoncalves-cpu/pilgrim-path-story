import { PhaseEventPool } from '@/lib/dynamicEvents';

/**
 * Event pools per phase. Each phase has fixed events (core story)
 * and variable events (randomly selected each playthrough).
 */

export const eventPools: Record<string, PhaseEventPool> = {

  // ═══════════════════════════════════════
  // FASE 1 — Cidade da Destruição
  // ═══════════════════════════════════════
  fase1: {
    phaseId: 'fase1',
    variableCount: 3,
    events: [
      // ── Personagem: Obstinado ──
      {
        id: 'f1-obstinado-reencontro',
        type: 'variable',
        narrative: [
          'Obstinado surge no caminho, ofegante. "Eu vim te buscar! Sua família implora que volte."',
          '"A cidade está em festa. Ninguém mais se preocupa com esse livro ridículo. Só você."',
        ],
        choices: [
          {
            text: '"Não posso voltar. Vi a verdade com meus próprios olhos."',
            effects: { fe: 2, coragem: 1 },
            consequence: 'Obstinado cospe no chão e vai embora, resmungando. Sua resolução se fortalece.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Hesitar e considerar voltar por um momento',
            effects: { fe: -1, coragem: -1 },
            consequence: 'A hesitação é breve, mas Obstinado percebe a fraqueza e insiste com mais força.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.6,
          },
        ],
        weight: 3,
        emotionalWeight: 2,
      },
      // ── Personagem: Flexível retornando ──
      {
        id: 'f1-flexivel-retorno',
        type: 'variable',
        narrative: [
          'Flexível aparece molhado e sujo, vindo da direção do pântano.',
          '"Eu tentei... mas é impossível. Voltei para a cidade. Você deveria fazer o mesmo."',
        ],
        requiresFlag: 'convidou_flexivel',
        choices: [
          {
            text: '"O pântano não é o fim. É só o começo."',
            effects: { fe: 1, perseveranca: 1 },
            consequence: 'Flexível balança a cabeça e vai embora. Sua fé superficial não suportou o teste.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Sentir inveja da decisão dele de voltar ao conforto',
            effects: { fe: -1 },
            consequence: 'A inveja é passageira, mas revela uma raiz que precisa ser arrancada.',
          },
        ],
        weight: 2,
      },
      // Variable: random encounters on the road
      {
        id: 'f1-viajante-misterioso',
        type: 'variable',
        narrative: [
          'Um viajante encapuzado cruza seu caminho. Seus olhos carregam uma tristeza antiga.',
          '"Eu já carreguei um fardo como o seu", diz ele. "Alguns se livram dele. Outros são consumidos."',
        ],
        choices: [
          {
            text: 'Perguntar como ele se livrou do fardo',
            effects: { discernimento: 1, fe: 1 },
            consequence: 'Ele sorri: "Há uma colina com uma cruz. Lá, tudo muda."',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Ignorar o viajante e seguir em frente',
            effects: { perseveranca: 1 },
            consequence: 'Você segue adiante. As palavras dele ecoam na memória.',
            consequenceKey: 'ignorou_aviso',
          },
        ],
        weight: 3,
      },
      {
        id: 'f1-crianca-perdida',
        type: 'variable',
        narrative: [
          'Uma criança chora à beira do caminho. Está sozinha, suja, assustada.',
          '"Meus pais foram para a cidade", soluça ela. "Disseram que não havia perigo."',
        ],
        choices: [
          {
            text: 'Parar e confortar a criança',
            effects: { fe: 1, coragem: 1 },
            consequence: 'A criança se acalma. Nos olhos dela, você vê algo que perdeu: inocência.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Seguir — cada segundo conta',
            effects: { perseveranca: 1 },
            consequence: 'Você se afasta. O choro diminui atrás de você, mas não desaparece.',
            consequenceKey: 'abandonou_companheiro',
          },
        ],
        weight: 2,
      },
      {
        id: 'f1-tempestade-subita',
        type: 'variable',
        narrative: [
          'O céu escurece sem aviso. Um vento cortante açoita seu rosto.',
          'A tempestade parece pessoal, como se quisesse empurrá-lo de volta para casa.',
        ],
        choices: [
          {
            text: 'Abaixar a cabeça e avançar contra o vento',
            effects: { perseveranca: 2, coragem: 1 },
            consequence: 'Cada passo é uma batalha, mas você avança.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Procurar abrigo e esperar passar',
            effects: { discernimento: 1 },
            consequence: 'No abrigo, encontra gravações na pedra: "Espere no Senhor."',
            consequenceKey: 'buscou_sabedoria',
            appearance: 0.7,
          },
        ],
        weight: 2,
      },
      {
        id: 'f1-comerciante-tentador',
        type: 'variable',
        narrative: [
          'Um comerciante aparece com um sorriso largo: "Peregrino! Conheço um atalho."',
          '"Por uma pequena taxa, posso livrá-lo desse fardo agora mesmo. Sem cruz, sem sofrimento."',
        ],
        choices: [
          {
            text: 'Recusar: "Meu fardo só será tirado no lugar certo"',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'O comerciante desaparece como fumaça. Não era real.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Aceitar a oferta',
            effects: { fe: -2, discernimento: -1 },
            consequence: 'O fardo parece mais leve por um instante — depois volta, mais pesado.',
            consequenceKey: 'cedeu_tentacao',
          },
        ],
        weight: 3,
      },
      {
        id: 'f1-eco-passado',
        type: 'variable',
        narrative: [
          'Vozes conhecidas ecoam do vento: sua família, seus amigos, chamando-o de volta.',
          '"Volte! Aqui é seguro! Por que sofrer sem necessidade?"',
        ],
        excludesFlag: 'ignorou_inquietacao',
        choices: [
          {
            text: 'Tapar os ouvidos e seguir',
            effects: { perseveranca: 1, coragem: 1 },
            consequence: 'As vozes enfraquecem. O silêncio que segue é libertador.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Parar e ouvir com saudade',
            effects: { fe: -1 },
            consequence: 'A saudade dói, mas fortalece sua determinação de encontrar algo melhor.',
          },
        ],
        weight: 1,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 2 — Casa do Intérprete
  // ═══════════════════════════════════════
  fase2: {
    phaseId: 'fase2',
    variableCount: 4,
    events: [
      // ── Personagem: Formalista e Hipocrisia ──
      {
        id: 'f2-formalista-hipocrisia',
        type: 'variable',
        narrative: [
          'No caminho, dois homens pulam o muro e caem na estrada ao seu lado. "Sou Formalista", diz um. "E eu, Hipocrisia", diz o outro.',
          '"Entramos pelo atalho — mais rápido que sua Porta Estreita. O resultado é o mesmo, não?"',
        ],
        choices: [
          {
            text: '"O Senhor do caminho disse para entrar pela porta. Não há atalhos."',
            effects: { discernimento: 2, fe: 1 },
            consequence: 'Eles riem e seguem adiante. Mais tarde, você os vê desaparecer em caminhos falsos.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Caminhar com eles por um tempo — parecem inofensivos',
            effects: { discernimento: -1 },
            consequence: 'A companhia deles o distrai. Quando olha de novo, o caminho estreito quase se perdeu.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.7,
          },
        ],
        weight: 3,
        emotionalWeight: 1,
      },
      // ── Personagem: Donzelas do Palácio Belo ──
      {
        id: 'f2-donzelas-palacio',
        type: 'variable',
        narrative: [
          'No Palácio Belo, quatro donzelas o recebem: Discrição, Prudência, Piedade e Caridade.',
          'Discrição o examina: "De onde vem e para onde vai?" Prudência pergunta: "O que te motiva?" Piedade descreve as maravilhas da Cidade Celestial. Caridade pergunta: "E sua família?"',
        ],
        choices: [
          {
            text: 'Responder com sinceridade a todas as perguntas',
            effects: { fe: 1, discernimento: 2, perseveranca: 1 },
            consequence: 'As donzelas sorriem. "Você é um peregrino verdadeiro." Elas lhe servem uma refeição e armadura para o vale.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Responder superficialmente, com pressa de seguir',
            effects: { perseveranca: 1 },
            consequence: 'Elas se calam. A refeição é simples. A armadura, básica. Pressa nem sempre é virtude.',
          },
        ],
        weight: 3,
        emotionalWeight: 2,
      },
      {
        id: 'f2-visao-fogo',
        type: 'variable',
        narrative: [
          'O Intérprete o leva a uma sala onde um fogo arde numa lareira. Um homem joga água nele, mas o fogo não se apaga.',
          'Por trás da parede, outro derrama azeite secretamente. "A graça", diz o Intérprete, "mantém vivo o que o mundo tenta extinguir."',
        ],
        choices: [
          {
            text: 'Meditar profundamente sobre a visão',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'Algo se acende dentro de você que a água do mundo não pode apagar.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Seguir para a próxima sala rapidamente',
            effects: { perseveranca: 1 },
            consequence: 'A pressa rouba parte do ensinamento, mas o fogo permanece na memória.',
          },
        ],
        weight: 3,
      },
      {
        id: 'f2-homem-gaiola',
        type: 'variable',
        narrative: [
          'Numa cela escura, um homem está preso numa gaiola de ferro.',
          '"Eu tive fé", diz com olhos vazios. "Mas troquei a eternidade pelo prazer de um momento. Agora não consigo me arrepender."',
        ],
        choices: [
          {
            text: 'Orar pelo homem da gaiola',
            effects: { fe: 1, coragem: 1 },
            consequence: 'Ele não responde. Mas seus olhos se umedecem pela primeira vez em anos.',
            consequenceKey: 'mostrou_misericordia',
            appearance: 0.8,
          },
          {
            text: 'Perguntar: "Ainda há esperança para você?"',
            effects: { discernimento: 1 },
            consequence: '"Não sei", sussurra ele. "Mas pergunta me dá algo que há muito não sentia."',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Afastar-se com medo de acabar como ele',
            effects: { perseveranca: 1, fe: -1 },
            consequence: 'O medo é um professor cruel, mas eficaz.',
            consequenceKey: 'fugiu_do_conflito',
            appearance: 0.6,
          },
        ],
        weight: 2,
      },
      {
        id: 'f2-sala-escura',
        type: 'variable',
        narrative: [
          'Uma sala completamente escura. O Intérprete lhe entrega uma vela fraca.',
          '"Ande devagar", diz ele. "A luz é pequena, mas suficiente para o próximo passo."',
        ],
        choices: [
          {
            text: 'Caminhar devagar, confiando na pequena luz',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'A cada passo, a vela parece mais forte. Ou talvez seus olhos se acostumaram.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Correr tentando atravessar rápido',
            effects: { coragem: 1, discernimento: -1 },
            consequence: 'Você tropeça. A vela quase se apaga. Mas sobrevive.',
          },
        ],
        weight: 2,
      },
      {
        id: 'f2-espelho-verdade',
        type: 'variable',
        narrative: [
          'O Intérprete apresenta um espelho. "Olhe", diz ele. "Mas não olhe seu rosto. Olhe sua alma."',
          'No reflexo, você vê não quem é — mas quem poderia se tornar.',
        ],
        choices: [
          {
            text: 'Aceitar a visão com humildade',
            effects: { fe: 1, discernimento: 2 },
            consequence: 'A imagem queima, mas é a dor da verdade — e a verdade liberta.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Desviar o olhar — não está pronto',
            effects: { perseveranca: -1 },
            consequence: 'O Intérprete não o julga. "Voltará quando estiver pronto."',
            consequenceKey: 'fugiu_do_conflito',
            appearance: 0.5,
          },
        ],
        weight: 3,
      },
      {
        id: 'f2-jardim-parábolas',
        type: 'variable',
        narrative: [
          'No jardim, duas árvores crescem lado a lado. Uma carregada de frutos, outra seca.',
          '"Ambas receberam a mesma chuva", diz o Intérprete. "A diferença está nas raízes."',
        ],
        choices: [
          {
            text: 'Examinar as raízes da árvore seca',
            effects: { discernimento: 2 },
            consequence: 'As raízes são rasas, superficiais. Você entende: profundidade importa.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Colher um fruto da árvore frutífera',
            effects: { fe: 1 },
            consequence: 'O fruto é doce. Um gosto do que a fé profunda produz.',
          },
        ],
        weight: 2,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 3 — Vale da Humilhação / Batalha
  // ═══════════════════════════════════════
  fase3: {
    phaseId: 'fase3',
    variableCount: 3,
    events: [
      // ── Personagem: Apolião provocação ──
      {
        id: 'f3-apoliao-provocacao',
        type: 'variable',
        narrative: [
          'Uma risada gutural ecoa pelo vale. "Eu conheço cada pecado que você cometeu, Cristão."',
          '"Cada dúvida. Cada momento que quase voltou para mim. Você é meu — sempre foi."',
        ],
        choices: [
          {
            text: '"Fui seu. Mas fui comprado por sangue mais precioso que o seu."',
            effects: { fe: 2, coragem: 2 },
            consequence: 'A declaração ressoa pelo vale. Por um instante, o silêncio de Apolião é sua vitória.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Tremer em silêncio, incapaz de responder',
            effects: { coragem: -1, fe: -1 },
            consequence: 'O silêncio alimenta a arrogância de Apolião. Mas até o silêncio pode ser resistência.',
            consequenceKey: 'fugiu_do_conflito',
            appearance: 0.6,
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      // ── Personagem: Fiel no vale ──
      {
        id: 'f3-fiel-relato',
        type: 'variable',
        narrative: [
          'Fiel, que você encontrará adiante, passou por aqui antes de você. Marcas na pedra contam sua história.',
          'Gravado na rocha: "Adão Primeiro me tentou com prazeres. Moisés me bateu. Mas a graça me curou."',
        ],
        choices: [
          {
            text: 'Ler todas as inscrições de Fiel com atenção',
            effects: { discernimento: 2, fe: 1 },
            consequence: 'Cada marca na pedra é um lembrete: outros passaram por aqui e sobreviveram.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Seguir em frente — suas próprias marcas o esperam',
            effects: { coragem: 1 },
            consequence: 'Há sabedoria em aprender com outros. Mas também em forjar seu próprio caminho.',
          },
        ],
        weight: 2,
      },
      {
        id: 'f3-emboscada',
        type: 'variable',
        narrative: [
          'Sombras se movem entre as rochas. Não é Apolião — são seus servos menores.',
          'Criaturas rastejantes sussurram suas fraquezas, seus fracassos, seus medos mais íntimos.',
        ],
        choices: [
          {
            text: 'Recitar as promessas que aprendeu',
            effects: { fe: 2, coragem: 1 },
            consequence: 'As palavras cortam o ar como espadas. As sombras recuam.',
            consequenceKey: 'foi_corajoso',
            requiresFlag: 'buscou_sabedoria',
          },
          {
            text: 'Empunhar a espada e avançar',
            effects: { coragem: 2, perseveranca: 1 },
            consequence: 'O aço brilha. Nem todas as batalhas são espirituais — algumas exigem ação.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Correr para longe',
            effects: { perseveranca: -1, coragem: -1 },
            consequence: 'As sombras perseguem. Fugir não funciona quando o inimigo está dentro.',
            consequenceKey: 'fugiu_do_conflito',
            appearance: 0.7,
          },
        ],
        weight: 3,
      },
      {
        id: 'f3-peregrino-ferido',
        type: 'variable',
        narrative: [
          'No vale, encontra outro peregrino caído. Sangue e suor marcam seu rosto.',
          '"Apolião... ele é mais forte do que diziam", geme o homem.',
        ],
        choices: [
          {
            text: 'Cuidar dos ferimentos dele',
            effects: { fe: 1, coragem: 1, perseveranca: 1 },
            consequence: '"Obrigado, peregrino. Que Deus fortaleça seu braço quando for sua vez."',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Perguntar sobre as táticas de Apolião',
            effects: { discernimento: 2 },
            consequence: '"Ele ataca sua identidade. Diz que você nunca foi chamado. Não acredite."',
            consequenceKey: 'buscou_sabedoria',
          },
        ],
        weight: 2,
      },
      {
        id: 'f3-armadura-encontrada',
        type: 'variable',
        narrative: [
          'Entre as pedras, algo brilha. Uma peça de armadura abandonada — o escudo da fé.',
          'Está amassado por golpes, mas ainda funcional.',
        ],
        choices: [
          {
            text: 'Pegar o escudo e equipá-lo',
            effects: { fe: 1, coragem: 1 },
            consequence: 'O escudo é pesado, mas reconfortante. Alguém lutou com ele antes — e sobreviveu.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Deixar — pode ser uma armadilha',
            effects: { discernimento: 1 },
            consequence: 'Precaução. Nem tudo que brilha no vale é de Deus.',
          },
        ],
        weight: 2,
        excludesFlag: 'cedeu_tentacao',
      },
      {
        id: 'f3-voz-no-escuro',
        type: 'variable',
        narrative: [
          'Na escuridão mais densa do vale, uma voz que parece a sua própria blasfema contra Deus.',
          'Não é você — mas parece. O horror é descobrir que o inimigo pode falar com a sua voz.',
        ],
        choices: [
          {
            text: 'Reconhecer que a voz não é sua',
            effects: { discernimento: 2, fe: 1 },
            consequence: 'Saber distinguir sua voz da do inimigo é uma vitória silenciosa.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Entrar em pânico e duvidar de si mesmo',
            effects: { fe: -1, discernimento: -1 },
            consequence: 'A dúvida é mais venenosa que qualquer espada.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.6,
          },
        ],
        weight: 3,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 4 — Feira da Vaidade
  // ═══════════════════════════════════════
  fase4: {
    phaseId: 'fase4',
    variableCount: 4,
    events: [
      // ── Personagem: Falador ──
      {
        id: 'f4-falador-encontro',
        type: 'variable',
        narrative: [
          'Um homem eloquente se junta a vocês: "Que bela jornada! Conheço toda a doutrina — justificação, santificação, regeneração..."',
          'Fiel sussurra: "Cuidado. Ele fala como um anjo, mas vive como um demônio. Na cidade dele, dizem que é pior em casa."',
        ],
        choices: [
          {
            text: 'Perguntar a Falador: "A graça transformou sua vida prática?"',
            effects: { discernimento: 2, fe: 1 },
            consequence: 'Falador gagueja e muda de assunto. As perguntas certas desarmam mais que espadas.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Ouvir seus discursos impressionantes',
            effects: { discernimento: -1 },
            consequence: 'As palavras são bonitas. Mas sem frutos, são apenas barulho.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.5,
          },
        ],
        weight: 3,
        emotionalWeight: 2,
      },
      // ── Personagem: Amor ao Dinheiro ──
      {
        id: 'f4-amor-dinheiro',
        type: 'variable',
        narrative: [
          'Um cavalheiro bem-vestido se aproxima: "Sou Amor ao Dinheiro, de Vanity Fair. Posso mostrar-lhes como servir a Deus E enriquecer."',
          '"Os maiores homens de fé tinham riquezas — Abraão, Salomão. Por que não vocês?"',
        ],
        choices: [
          {
            text: '"Ninguém pode servir a dois senhores"',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'Amor ao Dinheiro se afasta irritado. A verdade sempre incomoda quem vive na mentira.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Considerar o argumento — faz algum sentido',
            effects: { fe: -1, discernimento: -1 },
            consequence: 'O argumento é sedutor. Mas no fundo, você sabe que está trocando ouro eterno por cobre temporal.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.6,
          },
        ],
        weight: 3,
        emotionalWeight: 2,
      },
      {
        id: 'f4-mercador-honras',
        type: 'variable',
        narrative: [
          'Um mercador vende títulos e honras. "Barão do Conforto! Duque da Segurança! Preços especiais para peregrinos!"',
          'As pessoas ao redor competem para comprar. A pressa é contagiante.',
        ],
        choices: [
          {
            text: 'Dizer: "Só compro a verdade"',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'O mercador ri. Mas algo em seus olhos treme. Verdade não tem preço.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Passar sem dizer nada',
            effects: { perseveranca: 1 },
            consequence: 'Às vezes o silêncio é a resposta mais sábia.',
          },
          {
            text: 'Comprar um título — por curiosidade',
            effects: { fe: -1, discernimento: -1 },
            consequence: 'O pergaminho é bonito. Mas pesa como chumbo no bolso.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.5,
          },
        ],
        weight: 3,
      },
      {
        id: 'f4-julgamento-publico',
        type: 'variable',
        narrative: [
          'Uma multidão se reúne para um julgamento. O acusado? Um peregrino que se recusou a negociar.',
          '"Culpado de ser diferente!", grita a multidão.',
        ],
        choices: [
          {
            text: 'Defender o acusado publicamente',
            effects: { coragem: 2, fe: 1 },
            consequence: 'A multidão se volta contra você. Mas o acusado ergue os olhos com esperança.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Assistir em silêncio, protegendo-se',
            effects: { perseveranca: 1, coragem: -1 },
            consequence: 'Segurança comprada com silêncio tem um custo que se revela depois.',
            consequenceKey: 'fugiu_do_conflito',
          },
        ],
        weight: 2,
      },
      {
        id: 'f4-espetaculo-distracao',
        type: 'variable',
        narrative: [
          'Música, dança, luzes. A feira oferece um espetáculo hipnotizante.',
          'Por um momento, você esquece o fardo, o caminho, tudo. É tão... fácil.',
        ],
        choices: [
          {
            text: 'Reconhecer a distração e afastar-se',
            effects: { discernimento: 2, perseveranca: 1 },
            consequence: 'A música perde o encanto quando você percebe o que está tentando esconder.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Ficar mais um pouco — só um momento',
            effects: { perseveranca: -1, fe: -1 },
            consequence: '"Só um momento" se torna uma hora. O caminho parece mais distante agora.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.7,
          },
        ],
        weight: 2,
      },
      {
        id: 'f4-amigo-inesperado',
        type: 'variable',
        narrative: [
          'No meio da feira, uma voz familiar: um amigo da Cidade da Destruição.',
          '"O que faz aqui, peregrino? Todos pensam que você enlouqueceu."',
        ],
        choices: [
          {
            text: 'Compartilhar por que partiu',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'Ele ouve em silêncio. Algo muda em seus olhos. Talvez uma semente plantada.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Pedir que venha junto',
            effects: { coragem: 1 },
            consequence: '"Preciso pensar", diz ele. Você segue. Às vezes, plantar é tudo que se pode fazer.',
          },
        ],
        weight: 2,
        excludesFlag: 'ignorou_inquietacao',
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 5 — Castelo da Dúvida / Queda
  // ═══════════════════════════════════════
  fase5: {
    phaseId: 'fase5',
    variableCount: 3,
    events: [
      // ── Personagem: Gigante Desespero e Desconfiança ──
      {
        id: 'f5-desconfianca-conselho',
        type: 'variable',
        narrative: [
          'Através das paredes da masmorra, ouve-se a voz de Desconfiança, esposa do Gigante:',
          '"Faça-os passar fome. Depois, diga que a morte é a única saída. Eles são fracos — todos são."',
        ],
        choices: [
          {
            text: 'Sussurrar para Esperança: "Eles querem que desistamos. Isso prova que podemos escapar."',
            effects: { discernimento: 2, coragem: 1 },
            consequence: 'Se não houvesse saída, o gigante não precisaria convencê-los a desistir.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Deixar as palavras de Desconfiança corroer sua esperança',
            effects: { fe: -1, perseveranca: -1 },
            consequence: 'O veneno das palavras se espalha. Desconfiança sabia exatamente onde acertar.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.5,
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      // ── Personagem: Ignorância ──
      {
        id: 'f5-ignorancia-encontro',
        type: 'variable',
        narrative: [
          'No caminho, encontram um jovem chamado Ignorância, da terra da Presunção.',
          '"Eu também vou para a Cidade Celestial!", diz ele alegremente. "Meu coração é bom. Não preciso de porta estreita ou cruz."',
        ],
        choices: [
          {
            text: '"Amigo, sem passar pela porta e pela cruz, os portões não se abrirão"',
            effects: { discernimento: 2, fe: 1 },
            consequence: 'Ignorância ri: "Vocês pensam demais. Deus aceita pessoas boas." Ele segue sozinho, sorrindo.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Deixá-lo seguir seu próprio caminho sem avisar',
            effects: { discernimento: -1 },
            consequence: 'Você se perguntará depois se deveria ter insistido mais.',
            consequenceKey: 'abandonou_companheiro',
            appearance: 0.7,
          },
        ],
        weight: 3,
        emotionalWeight: 2,
      },
      {
        id: 'f5-sonho-perturbador',
        type: 'variable',
        narrative: [
          'Na masmorra, o sono traz um sonho vívido. Você está de volta na Cidade da Destruição.',
          'Tudo está como antes. O livro nunca foi aberto. O fardo nunca existiu. Foi tudo imaginação?',
        ],
        choices: [
          {
            text: 'Recusar o sonho: "Isso não é real"',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'O sonho se desfaz. A masmorra é real, mas também a promessa.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Aceitar o sonho com alívio',
            effects: { fe: -2, perseveranca: -1 },
            consequence: 'Por um instante, o alívio é real. Depois, a realidade volta com peso dobrado.',
            consequenceKey: 'cedeu_tentacao',
            appearance: 0.6,
          },
        ],
        weight: 3,
      },
      {
        id: 'f5-companheiro-prisao',
        type: 'variable',
        narrative: [
          'Na cela ao lado, outro prisioneiro. Ele está lá há muito mais tempo.',
          '"Desista", diz com voz oca. "Eu tentei escapar sete vezes. É impossível."',
        ],
        choices: [
          {
            text: 'Encorajá-lo: "Talvez a oitava vez seja diferente"',
            effects: { fe: 1, coragem: 1, perseveranca: 1 },
            consequence: 'Algo se acende nos olhos dele. Esperança é contagiosa.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Concordar silenciosamente',
            effects: { perseveranca: -1 },
            consequence: 'O desespero compartilhado é mais pesado que o desespero sozinho.',
          },
        ],
        weight: 2,
      },
      {
        id: 'f5-chave-esquecida',
        type: 'variable',
        narrative: [
          'No fundo do bolso, seus dedos tocam algo frio e metálico.',
          'Uma chave. Como você esqueceu? Sempre esteve ali — a Chave da Promessa.',
        ],
        requiresFlag: 'buscou_sabedoria',
        choices: [
          {
            text: 'Usar a chave imediatamente',
            effects: { fe: 2, discernimento: 2 },
            consequence: 'A fechadura gira. A porta se abre. O que estava ali o tempo todo finalmente é usado.',
            consequenceKey: 'foi_corajoso',
          },
        ],
        weight: 5,
      },
      {
        id: 'f5-gigante-dorme',
        type: 'variable',
        narrative: [
          'O Gigante Desespero cai em sono profundo. Seus roncos sacodem as paredes.',
          'É a oportunidade — mas o medo paralisa.',
        ],
        choices: [
          {
            text: 'Agir agora, enquanto ele dorme',
            effects: { coragem: 2, perseveranca: 1 },
            consequence: 'Cada passo na ponta dos pés é uma eternidade. Mas a liberdade vale o risco.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Esperar — pode ser uma armadilha',
            effects: { discernimento: 1 },
            consequence: 'Paciência ou paralisia? Só o tempo dirá se esperou demais.',
            consequenceKey: 'fugiu_do_conflito',
            appearance: 0.7,
          },
        ],
        weight: 3,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 6 — Rumo à Cidade Celestial
  // ═══════════════════════════════════════
  fase6: {
    phaseId: 'fase6',
    variableCount: 2,
    events: [
      {
        id: 'f6-rio-final',
        type: 'variable',
        narrative: [
          'O rio final se estende à sua frente. Não há ponte. A água é escura e profunda.',
          '"A profundidade é proporcional à sua fé", ouve de algum lugar.',
        ],
        choices: [
          {
            text: 'Entrar na água confiando',
            effects: { fe: 2, coragem: 2 },
            consequence: 'A água sobe até o peito — depois recua. Seus pés encontram fundo.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Hesitar na margem',
            effects: { perseveranca: 1 },
            consequence: 'Uma mão estende-se da outra margem. Você não está sozinho.',
          },
        ],
        weight: 3,
      },
      {
        id: 'f6-retrospectiva',
        type: 'variable',
        narrative: [
          'Na margem oposta, você olha para trás. Todo o caminho percorrido se revela como um panorama.',
          'O Pântano. A Cruz. O Vale. A Feira. O Castelo. Cada passo fez sentido — mesmo os errados.',
        ],
        choices: [
          {
            text: 'Agradecer por cada passo',
            effects: { fe: 2, perseveranca: 1, discernimento: 1 },
            consequence: 'Gratidão é o último ato do peregrino antes da eternidade.',
            consequenceKey: 'mostrou_misericordia',
          },
        ],
        weight: 2,
      },
      {
        id: 'f6-ultima-tentacao',
        type: 'variable',
        narrative: [
          'Tão perto do fim, uma voz sussurra: "Você realmente merece entrar?"',
          '"Olhe para trás. Lembre de cada falha, cada dúvida, cada queda."',
        ],
        choices: [
          {
            text: '"Não mereço. Mas a graça não é sobre merecimento"',
            effects: { fe: 3, discernimento: 1 },
            consequence: 'A voz silencia. A porta se abre. Não pelo que você fez — mas pelo que foi feito por você.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Duvidar por um instante',
            effects: { fe: -1 },
            consequence: 'A dúvida dura apenas um segundo. Depois, a luz é forte demais para qualquer sombra.',
            appearance: 0.5,
          },
        ],
        weight: 4,
      },
    ],
  },
};

/**
 * Replay-exclusive events: only appear on 2nd+ playthroughs.
 * Import these and merge into pools when playthrough > 1.
 */
export const replayExclusiveEvents: Record<string, PhaseEventPool> = {
  fase1: {
    phaseId: 'fase1',
    variableCount: 1,
    events: [
      {
        id: 'f1-replay-deja-vu',
        type: 'variable',
        narrative: [
          'O caminho parece estranhamente familiar. Cada pedra, cada curva — você já esteve aqui.',
          'Mas desta vez, há algo diferente. Uma trilha lateral que você não notou antes.',
        ],
        choices: [
          {
            text: 'Seguir a trilha desconhecida',
            effects: { discernimento: 2, coragem: 1 },
            consequence: 'O desvio revela uma vista que redefine tudo que você pensava saber sobre o caminho.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Manter o caminho que conhece',
            effects: { perseveranca: 1 },
            consequence: 'A familiaridade é reconfortante. Mas uma parte de você se pergunta o que havia na trilha.',
          },
        ],
        weight: 4,
      },
      {
        id: 'f1-replay-fantasma',
        type: 'variable',
        narrative: [
          'Por um instante, você vê sua própria silhueta no caminho à frente — o fantasma de sua jornada anterior.',
          'Ele se move como você se movia antes. Comete os mesmos erros. Faz as mesmas escolhas.',
        ],
        choices: [
          {
            text: 'Seguir um caminho diferente do fantasma',
            effects: { coragem: 2, discernimento: 1 },
            consequence: 'O fantasma desaparece. Você não é mais quem era.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Seguir os passos do fantasma — deu certo antes',
            effects: { perseveranca: 1, fe: 1 },
            consequence: 'Os mesmos passos levam a um lugar sutilmente diferente. O caminho mudou, mesmo que você não tenha.',
          },
        ],
        weight: 3,
      },
    ],
  },
  fase3: {
    phaseId: 'fase3',
    variableCount: 1,
    events: [
      {
        id: 'f3-replay-apoliao-lembra',
        type: 'variable',
        narrative: [
          'Apolião sorri ao vê-lo: "Eu me lembro de você, peregrino."',
          '"Da última vez, encontrei suas fraquezas. Desta vez, trouxe algo novo."',
        ],
        choices: [
          {
            text: '"E eu trouxe algo novo também"',
            effects: { coragem: 3, fe: 1 },
            consequence: 'A confiança o surpreende. Por um instante, o monstro recua.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Preparar-se silenciosamente',
            effects: { discernimento: 2, perseveranca: 1 },
            consequence: 'O silêncio é sua armadura. Apolião não sabe o que esperar.',
            consequenceKey: 'buscou_sabedoria',
          },
        ],
        weight: 5,
      },
    ],
  },
  fase5: {
    phaseId: 'fase5',
    variableCount: 1,
    events: [
      {
        id: 'f5-replay-masmorra-secreta',
        type: 'variable',
        narrative: [
          'Na parede da masmorra, você nota marcas que não viu antes — inscrições de outros prisioneiros.',
          '"A saída não é pela porta", lê a inscrição mais antiga. "É por dentro."',
        ],
        choices: [
          {
            text: 'Meditar sobre o significado',
            effects: { fe: 2, discernimento: 2 },
            consequence: 'Uma paz sobrenatural invade a cela. As correntes parecem mais leves.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Procurar uma passagem secreta na parede',
            effects: { coragem: 1, discernimento: 1 },
            consequence: 'Não há passagem física. Mas a busca em si ensina algo.',
          },
        ],
        weight: 4,
      },
    ],
  },
};

/**
 * Route variants: alternate paths within phases based on player state.
 */
export const routeVariants: Record<string, Array<{
  condition: (ctx: { attributes: Record<string, number>; flags: Record<string, boolean>; playthrough: number }) => boolean;
  nextChapterId: string;
  hint: string;
}>> = {
  // After cena5, high-faith players can skip directly to cena7
  'cena5': [
    {
      condition: (ctx) => ctx.attributes.fe >= 7 && ctx.attributes.discernimento >= 6,
      nextChapterId: 'cena7',
      hint: 'Sua fé é forte. Evangelista aponta diretamente para a Porta Estreita.',
    },
  ],
  // In fase3, courageous players can face Apolião earlier
  'fase3-cena1': [
    {
      condition: (ctx) => ctx.attributes.coragem >= 8,
      nextChapterId: 'fase3-cena3',
      hint: 'Sua coragem atrai Apolião. Ele vem ao seu encontro antes do esperado.',
    },
  ],
  // In fase5, players with the key can skip some dungeon scenes
  'fase5-cena2': [
    {
      condition: (ctx) => !!ctx.flags['chave_promessa'],
      nextChapterId: 'fase5-cena5',
      hint: 'A Chave da Promessa brilha no seu bolso. Você sabe o que fazer.',
    },
  ],
  // Replay-exclusive routes
  'fase2-cena1': [
    {
      condition: (ctx) => ctx.playthrough >= 2 && ctx.attributes.discernimento >= 7,
      nextChapterId: 'fase2-cena3',
      hint: 'O Intérprete reconhece sua sabedoria: "Venha, há salas que não mostro a todos."',
    },
  ],
  'fase4-cena1': [
    {
      condition: (ctx) => ctx.playthrough >= 3 && ctx.attributes.fe >= 8,
      nextChapterId: 'fase4-cena4',
      hint: 'Sua fé é um escudo. A feira perde seu poder sobre você.',
    },
  ],
  'fase6-cena1': [
    {
      condition: (ctx) => ctx.playthrough >= 2 && ctx.attributes.coragem >= 8 && ctx.attributes.fe >= 8,
      nextChapterId: 'fase6-cena3',
      hint: 'O rio se abre diante de você. Sua jornada anterior abriu este caminho.',
    },
  ],
};
