import { PhaseEventPool } from '@/lib/dynamicEvents';

/**
 * Event pools for Part II — A Peregrina.
 * Semi-random encounters per phase, matching the Part I structure.
 */

export const eventPoolsPart2: Record<string, PhaseEventPool> = {

  // ═══════════════════════════════════════
  // FASE 1 — A Partida de Cristã
  // ═══════════════════════════════════════
  'p2-fase1': {
    phaseId: 'p2-fase1',
    variableCount: 3,
    events: [
      {
        id: 'p2f1-vizinhos-zombam',
        type: 'variable',
        narrative: [
          'Vizinhos aparecem à porta de Cristã: "Vai seguir o louco do seu marido? Levando crianças para morrer na estrada?"',
          '"Sua mãe chorou por três dias quando Cristão partiu. Quer causar a mesma dor?"',
        ],
        choices: [
          {
            text: '"Meu marido não era louco. Ele encontrou a Verdade."',
            effects: { fe: 2, coragem: 1 },
            consequence: 'Os vizinhos cospem no chão e vão embora. Sua certeza se fortalece.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Hesitar diante das acusações',
            effects: { fe: -1 },
            consequence: 'A dúvida é passageira, mas as palavras dos vizinhos ecoam.',
            consequenceKey: 'cedeu_tentacao',
          },
        ],
        weight: 3,
        emotionalWeight: 2,
      },
      {
        id: 'p2f1-sra-timida',
        type: 'variable',
        narrative: [
          'Uma mulher tímida se aproxima de Cristã: "Eu... eu também gostaria de ir. Mas tenho tanto medo."',
          '"Meu marido me proíbe. Disse que é loucura."',
        ],
        choices: [
          {
            text: '"O medo é real, mas o chamado do Rei é maior."',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'A mulher chora, mas decide não ir. Talvez um dia.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: '"Talvez devesse esperar até ter certeza."',
            effects: { discernimento: 1 },
            consequence: 'Cristã se pergunta se deu o conselho certo.',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f1-filhos-choram',
        type: 'variable',
        narrative: [
          'Os filhos menores choram à noite: "Mãe, para onde estamos indo? Quero voltar para casa."',
          'Samuel, o mais novo, pergunta: "O pai está lá? Ele está esperando?"',
        ],
        choices: [
          {
            text: '"Sim, querido. Seu pai está esperando na Cidade mais linda que existe."',
            effects: { fe: 1, perseveranca: 1 },
            consequence: 'Os olhos de Samuel brilham. Ele segura a mão da mãe com força.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Abraçar os filhos em silêncio, sem prometer o que não sabe',
            effects: { perseveranca: 1 },
            consequence: 'O silêncio é honesto. Os filhos sentem a seriedade da jornada.',
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      {
        id: 'p2f1-carta-misterio',
        type: 'variable',
        narrative: [
          'Cristã relê a carta do Rei. Desta vez, notas que há palavras escritas em tinta invisível, que só aparecem com a luz da manhã.',
          '"O caminho será mais gentil para quem traz outros. A porta se abre mais largo para quem não vem sozinha."',
        ],
        choices: [
          {
            text: 'Guardar a carta junto ao coração como um tesouro',
            effects: { fe: 2 },
            consequence: 'A carta aquece seu peito como uma brasa viva.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Mostrar as palavras ocultas a Misericórdia',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'Misericórdia chora ao ler. "Então eu também sou bem-vinda."',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f1-sonho-cristao',
        type: 'variable',
        narrative: [
          'Cristã tem outro sonho: vê Cristão na Cidade Celestial, sorrindo. Ele diz: "Estou esperando. Traga nossos filhos."',
          'Ao acordar, lágrimas molham o travesseiro. A saudade queima, mas também ilumina.',
        ],
        choices: [
          {
            text: 'Levantar-se com renovada determinação',
            effects: { coragem: 1, fe: 1 },
            consequence: 'O sonho vira combustível. A partida é inevitável.',
            consequenceKey: 'perseverou_na_dor',
          },
          {
            text: 'Chorar até o sol nascer, depois partir',
            effects: { perseveranca: 1 },
            consequence: 'As lágrimas lavam o medo. A dor prepara a alma para o caminho.',
          },
        ],
        weight: 2,
        emotionalWeight: 3,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 2 — Com Grande-Coração
  // ═══════════════════════════════════════
  'p2-fase2': {
    phaseId: 'p2-fase2',
    variableCount: 3,
    events: [
      {
        id: 'p2f2-grande-historias',
        type: 'variable',
        narrative: [
          'Grande-Coração conta histórias ao redor da fogueira: "Matei sete gigantes. Mas o mais perigoso não foi o maior."',
          '"O mais perigoso foi o Gigante Razão Humana. Ele não ataca com clava — ataca com argumentos."',
        ],
        choices: [
          {
            text: 'Pedir mais detalhes sobre como vencer argumentos contra a fé',
            effects: { discernimento: 2, fe: 1 },
            consequence: 'Grande-Coração ensina: "A Palavra é a única espada que corta argumentos."',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Ouvir em silêncio e guardar as lições',
            effects: { discernimento: 1 },
            consequence: 'Cada história é uma armadura invisível.',
          },
        ],
        weight: 3,
      },
      {
        id: 'p2f2-misericordia-duvida',
        type: 'variable',
        narrative: [
          'Misericórdia se afasta do grupo e chora sozinha. "Cristã, eu não tenho carta do Rei. E se Ele me rejeitar no final?"',
          '"Todos vocês têm certeza. Eu só tenho... esperança."',
        ],
        choices: [
          {
            text: '"Misericórdia, o Rei não rejeita quem vem com o coração. A carta está no seu amor."',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'Misericórdia seca as lágrimas. "Então minha carta é o amor? É o suficiente?"',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: '"Eu também tenho dúvidas. Vamos juntas."',
            effects: { perseveranca: 1 },
            consequence: 'A honestidade une mais que a certeza.',
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      {
        id: 'p2f2-mateus-adoece',
        type: 'variable',
        narrative: [
          'Mateus come frutos de uma árvore à beira do caminho e adoece gravemente. Febre alta, delírio.',
          'Grande-Coração sacude a cabeça: "Esses frutos são do inimigo. Plantados para parecerem bons."',
        ],
        choices: [
          {
            text: 'Dar a Mateus a pílula amarga do arrependimento que o médico prescreveu',
            effects: { discernimento: 2 },
            consequence: 'Mateus melhora após vomitar o veneno. A cura começa pelo amargor.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Orar sobre Mateus até a febre passar',
            effects: { fe: 2 },
            consequence: 'A oração é intensa. A febre cede lentamente, como água evaporando.',
          },
        ],
        weight: 2,
        emotionalWeight: 2,
      },
      {
        id: 'p2f2-caramanchao-aviso',
        type: 'variable',
        narrative: [
          'No caramanchão da Colina da Dificuldade, Grande-Coração aponta inscrições na parede: "Cristão dormiu aqui e quase perdeu tudo."',
          '"Há lições escritas por quem errou. A sabedoria dos que caíram é a proteção dos que vêm depois."',
        ],
        choices: [
          {
            text: 'Ler todas as inscrições e memorizar os avisos',
            effects: { discernimento: 1, perseveranca: 1 },
            consequence: 'Cada aviso é uma cicatriz de outro peregrino transformada em escudo.',
          },
          {
            text: 'Descansar brevemente — mas sem adormecer',
            effects: { perseveranca: 1 },
            consequence: 'O descanso sem sono é uma disciplina que poucos dominam.',
            consequenceKey: 'perseverou_na_dor',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f2-donzelas-misericordia',
        type: 'variable',
        narrative: [
          'No Palácio Belo, Caridade pega Misericórdia pelas mãos: "Você veio sem carta, mas com o coração do Rei. Isso é mais raro."',
          '"Sabe quantos recebem carta e não partem? A maioria. Você partiu sem carta. Isso te torna mais corajosa que muitos."',
        ],
        choices: [
          {
            text: 'Celebrar o reconhecimento de Misericórdia',
            effects: { fe: 1, coragem: 1 },
            consequence: 'Misericórdia brilha. Pela primeira vez, ela não se sente uma intrusa.',
          },
          {
            text: 'Perguntar a Caridade sobre o destino de quem vem sem carta',
            effects: { discernimento: 2 },
            consequence: '"O Rei aceita todos que batem. A carta é convite, não requisito."',
            consequenceKey: 'buscou_sabedoria',
          },
        ],
        weight: 2,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 3 — Os Vales e Encontros
  // ═══════════════════════════════════════
  'p2-fase3': {
    phaseId: 'p2-fase3',
    variableCount: 3,
    events: [
      {
        id: 'p2f3-vale-lirios',
        type: 'variable',
        narrative: [
          'O Vale da Humilhação, que foi campo de batalha para Cristão, é para o grupo de Cristã um prado repleto de lírios.',
          'Grande-Coração explica: "O vale é humilde para os humildes e violento para os orgulhosos. Seu marido veio com armadura. Vocês vieram com oração."',
        ],
        choices: [
          {
            text: 'Colher lírios e dar aos filhos como lembranças',
            effects: { fe: 1 },
            consequence: 'Cada lírio é uma promessa: a humildade transforma campos de batalha em jardins.',
          },
          {
            text: 'Refletir sobre por que o mesmo lugar é diferente para pessoas diferentes',
            effects: { discernimento: 2 },
            consequence: '"O caminho não muda. Nós mudamos. E o caminho responde."',
            consequenceKey: 'buscou_sabedoria',
          },
        ],
        weight: 3,
      },
      {
        id: 'p2f3-pilar-fogo',
        type: 'variable',
        narrative: [
          'No Vale da Sombra da Morte, um pilar de fogo aparece e ilumina o caminho. Os demônios recuam.',
          '"Quando Cristão passou", diz Grande-Coração, "era escuridão total. Para vocês, o Senhor enviou luz. Talvez porque há crianças."',
        ],
        choices: [
          {
            text: 'Cantar hinos para afugentar o medo dos filhos',
            effects: { fe: 2, coragem: 1 },
            consequence: 'As vozes infantis ecoam no vale. Os demônios cobrem os ouvidos.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Seguir o pilar em silêncio reverente',
            effects: { perseveranca: 1, discernimento: 1 },
            consequence: 'O silêncio no vale é mais corajoso do que parece.',
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      {
        id: 'p2f3-gigante-maul',
        type: 'variable',
        narrative: [
          'O Gigante Maul bloqueia a saída do vale: "Mulheres peregrinas? Fácil demais!"',
          'Grande-Coração puxa a espada: "Diga isso à minha lâmina."',
        ],
        choices: [
          {
            text: 'Encorajar Grande-Coração durante a luta',
            effects: { coragem: 1, fe: 1 },
            consequence: 'A cabeça do gigante rola. Grande-Coração a coloca num poste como aviso.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Proteger os filhos e orar enquanto a batalha acontece',
            effects: { fe: 2 },
            consequence: 'A oração é a arma de Cristã. Diferente da espada, mas igualmente poderosa.',
          },
        ],
        weight: 2,
        emotionalWeight: 2,
      },
      {
        id: 'p2f3-gaio-ancestralidade',
        type: 'variable',
        narrative: [
          'Na hospedaria, Gaio revela um pergaminho genealógico: "Cristão descende de Noé pela linha de Sem."',
          '"Os filhos que levais não são filhos comuns. Há sangue de santos em suas veias."',
        ],
        choices: [
          {
            text: 'Perguntar sobre a responsabilidade dessa linhagem',
            effects: { discernimento: 2 },
            consequence: '"A linhagem não garante nada. Mas abre portas que outros precisam arrombar."',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Emocionar-se com a história — Cristão era mais do que ela sabia',
            effects: { fe: 1, perseveranca: 1 },
            consequence: 'Lágrimas de orgulho e saudade. O marido era um herdeiro de promessas.',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f3-casamento-mateus',
        type: 'variable',
        narrative: [
          'Gaio organiza o casamento de Mateus com Misericórdia. A hospedaria se enche de vinho e música.',
          '"Na peregrinação", diz Gaio, "também há celebração. Nem tudo é luta e lágrima."',
        ],
        choices: [
          {
            text: 'Dançar e celebrar — mesmo no meio da jornada',
            effects: { fe: 1, perseveranca: 1 },
            consequence: 'A alegria é uma arma que o inimigo não espera.',
          },
          {
            text: 'Chorar de alegria ao ver o filho casando',
            effects: { fe: 1 },
            consequence: 'As lágrimas de Cristã são diferentes agora — não de dor, mas de gratidão.',
            consequenceKey: 'mostrou_misericordia',
          },
        ],
        weight: 2,
        emotionalWeight: 2,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 4 — Novos Companheiros
  // ═══════════════════════════════════════
  'p2-fase4': {
    phaseId: 'p2-fase4',
    variableCount: 3,
    events: [
      {
        id: 'p2f4-pronto-testemunho',
        type: 'variable',
        narrative: [
          'Pronto-para-Parar conta sua história: "Nasci com pernas tortas. Todos diziam que nunca sairia da cidade. Caminhei assim mesmo."',
          '"Cada passo dói. Mas a dor de parar seria pior."',
        ],
        choices: [
          {
            text: '"Você é o mais forte de todos nós, Pronto-para-Parar."',
            effects: { perseveranca: 2 },
            consequence: 'Ele sorri com olhos úmidos. Ninguém nunca lhe disse isso.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Carregar suas bolsas para aliviar o peso',
            effects: { perseveranca: 1, coragem: 1 },
            consequence: 'Pronto-para-Parar caminha um pouco mais reto. A carga compartilhada é mais leve.',
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      {
        id: 'p2f4-demas-desaparecido',
        type: 'variable',
        narrative: [
          'Na mina, um velho garimpeiro conta: "Demas entrou na mina há meses buscando mais prata. Nunca saiu."',
          '"Ouvimos seus gritos às vezes. Ou talvez seja o vento."',
        ],
        choices: [
          {
            text: 'Orar pela alma de Demas, mesmo que seja tarde',
            effects: { fe: 2 },
            consequence: 'A oração ecoa na mina. Nenhuma resposta. Mas a misericórdia nunca é desperdiçada.',
          },
          {
            text: 'Usar Demas como lição para os filhos sobre ganância',
            effects: { discernimento: 2 },
            consequence: 'Os filhos olham para a mina com olhos novos. A prata perdeu seu brilho.',
            consequenceKey: 'buscou_sabedoria',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f4-valente-feridas',
        type: 'variable',
        narrative: [
          'Valente-pela-Verdade mostra suas cicatrizes: "Cada uma foi uma escolha. Poderia ter fugido. Escolhi lutar."',
          '"A espada de Jerusalém nunca falha. Mas o braço que a empunha precisa de coragem."',
        ],
        choices: [
          {
            text: 'Pedir para ver a espada de Jerusalém de perto',
            effects: { coragem: 2, fe: 1 },
            consequence: 'A lâmina brilha com uma luz que não vem do sol. É a Palavra feita aço.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Perguntar se teve medo durante as lutas',
            effects: { coragem: 1, discernimento: 1 },
            consequence: '"Sempre. Coragem não é ausência de medo. É lutar mesmo tremendo."',
          },
        ],
        weight: 3,
      },
      {
        id: 'p2f4-feira-mudada',
        type: 'variable',
        narrative: [
          'Na Feira da Vaidade, alguns moradores pedem bênçãos ao grupo. O martírio de Fiel plantou sementes.',
          '"O sangue de Fiel irrigou esta terra", diz Grande-Coração. "Agora, brotos de fé crescem onde antes havia só comércio."',
        ],
        choices: [
          {
            text: 'Abençoar os moradores e compartilhar a mensagem',
            effects: { fe: 2, coragem: 1 },
            consequence: 'Alguns da feira choram. O sacrifício de Fiel não foi em vão.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Passar depressa — a feira ainda é perigosa',
            effects: { perseveranca: 1, discernimento: 1 },
            consequence: 'A prudência e a ousadia são ambas virtudes. A questão é o momento.',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f4-grupo-cresce',
        type: 'variable',
        narrative: [
          'Cristã olha para trás e conta: ela mesma, quatro filhos, Misericórdia, Grande-Coração, Velho Honesto, Mente-Fraca, Pronto-para-Parar, Valente...',
          '"Cristão partiu sozinho", pensa ela. "Eu parto com uma multidão. O caminho é o mesmo, mas a jornada é completamente diferente."',
        ],
        choices: [
          {
            text: 'Agradecer a Deus por cada companheiro',
            effects: { fe: 1, perseveranca: 1 },
            consequence: 'Cada nome é uma bênção. A solidão de Cristão se transformou em comunidade.',
          },
          {
            text: 'Preocupar-se: mais pessoas significa mais responsabilidade',
            effects: { discernimento: 1 },
            consequence: 'A preocupação de líder. Cristã cresce em sabedoria com cada passo.',
          },
        ],
        weight: 2,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 5 — O Castelo Destruído
  // ═══════════════════════════════════════
  'p2-fase5': {
    phaseId: 'p2-fase5',
    variableCount: 3,
    events: [
      {
        id: 'p2f5-desconfianca-foge',
        type: 'variable',
        narrative: [
          'Desconfiança, esposa do Gigante Desespero, foge das ruínas do castelo gritando: "Meu marido! Meu castelo! Vocês destruíram tudo!"',
          '"Peregrinos malditos! Outros gigantes virão! Outros castelos serão construídos!"',
        ],
        choices: [
          {
            text: '"Podem construir mil castelos. A Chave da Promessa abrirá todos."',
            effects: { fe: 2, coragem: 1 },
            consequence: 'Desconfiança grita de raiva e desaparece nas sombras.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Deixá-la ir sem responder — a vitória fala por si',
            effects: { perseveranca: 1 },
            consequence: 'O silêncio é mais eloquente que qualquer resposta.',
          },
        ],
        weight: 3,
      },
      {
        id: 'p2f5-sr-desanimo-lamenta',
        type: 'variable',
        narrative: [
          'Sr. Desânimo, recém-libertado, caminha arrastando os pés: "E se formos recapturados? E se houver outro castelo?"',
          'Muito-Medo se agarra à mão de Misericórdia: "Não me solte. Por favor."',
        ],
        choices: [
          {
            text: '"O castelo já foi destruído. Olhe para trás: é só ruína e céu aberto."',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'Sr. Desânimo olha para trás. Pela primeira vez, vê luz onde havia trevas.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Pedir a Grande-Coração que tranquilize os dois',
            effects: { coragem: 1 },
            consequence: '"Enquanto eu respirar", diz Grande-Coração, "nenhum gigante tocará em vocês."',
          },
        ],
        weight: 3,
        emotionalWeight: 3,
      },
      {
        id: 'p2f5-pastores-reconhecem',
        type: 'variable',
        narrative: [
          'Nas Montanhas Deleitosas, os pastores se curvam diante de Grande-Coração: "Matou o Gigante Desespero! A Chave da Promessa não foi necessária desta vez."',
          'Conhecimento diz: "Há gerações que sofrem e gerações que destroem a fonte do sofrimento. Vocês são a segunda."',
        ],
        choices: [
          {
            text: '"A glória é de Deus, não nossa."',
            effects: { fe: 2 },
            consequence: 'Os pastores sorriem. A humildade é a última armadura.',
          },
          {
            text: 'Pedir aos pastores que mostrem a vista da Cidade Celestial',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'Da montanha, a Cidade brilha. Os filhos de Cristã veem pela primeira vez o destino.',
            consequenceKey: 'buscou_sabedoria',
          },
        ],
        weight: 2,
      },
      {
        id: 'p2f5-ossos-peregrinos',
        type: 'variable',
        narrative: [
          'Nas ruínas do castelo, encontram ossos. Peregrinos que não sobreviveram ao cativeiro.',
          'Grande-Coração se ajoelha: "Estes são nossos irmãos. Não pudemos salvá-los. Mas podemos honrá-los destruindo o que os matou."',
        ],
        choices: [
          {
            text: 'Orar pelos peregrinos que morreram no castelo',
            effects: { fe: 2 },
            consequence: 'A oração ecoa entre as ruínas. Os ossos parecem descansar em paz.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Erguer um memorial de pedra em sua memória',
            effects: { perseveranca: 1, discernimento: 1 },
            consequence: 'O memorial será visto por todos os peregrinos futuros.',
          },
        ],
        weight: 2,
        emotionalWeight: 3,
      },
    ],
  },

  // ═══════════════════════════════════════
  // FASE 6 — A Terra Encantada e o Rio
  // ═══════════════════════════════════════
  'p2-fase6': {
    phaseId: 'p2-fase6',
    variableCount: 3,
    events: [
      {
        id: 'p2f6-madame-bolha-tenta',
        type: 'variable',
        narrative: [
          'Madame Bolha se aproxima do grupo: "Tanto sofrimento por uma cidade que ninguém prova que existe."',
          '"Eu ofereço prazer agora. Ouro agora. Descanso agora. Por que esperar?"',
        ],
        choices: [
          {
            text: '"Porque o que você oferece é bolha — estoura. O que o Rei oferece é eterno."',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'Madame Bolha se dissolve como fumaça. Firme ajoelhado abre os olhos e sorri.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Ignorá-la e continuar orando com Firme',
            effects: { perseveranca: 1, fe: 1 },
            consequence: 'A oração conjunta é um muro que nenhuma tentação transpõe.',
          },
        ],
        weight: 3,
      },
      {
        id: 'p2f6-valente-discurso',
        type: 'variable',
        narrative: [
          'Na margem do rio, Valente-pela-Verdade faz seu discurso final:',
          '"Minha espada, eu a deixo a quem me suceder. Minha coragem, ao que puder obtê-la. Minhas cicatrizes, levo comigo — testemunho de que lutei Suas batalhas."',
        ],
        choices: [
          {
            text: 'Gravar as palavras de Valente na memória para sempre',
            effects: { coragem: 2, fe: 1 },
            consequence: 'As palavras de Valente se tornam parte de você. Herança de guerreiro.',
            consequenceKey: 'foi_corajoso',
          },
          {
            text: 'Chorar — a beleza da coragem é avassaladora',
            effects: { fe: 2 },
            consequence: 'As lágrimas são a resposta mais honesta à grandeza.',
            consequenceKey: 'mostrou_misericordia',
          },
        ],
        weight: 3,
        emotionalWeight: 4,
      },
      {
        id: 'p2f6-desanimo-surpreende',
        type: 'variable',
        narrative: [
          'Sr. Desânimo, para surpresa de todos, diz com voz firme: "Adeus, noite. Bem-vindo, dia."',
          '"O desânimo não cruzará o rio comigo. Eu o deixo na margem, com os ossos do gigante que me prendeu."',
        ],
        choices: [
          {
            text: 'Abraçar Sr. Desânimo — ele finalmente é livre de verdade',
            effects: { fe: 2, perseveranca: 1 },
            consequence: 'O abraço diz o que palavras não podem: a libertação é real.',
            consequenceKey: 'mostrou_misericordia',
          },
          {
            text: 'Chorar com Muito-Medo, que vê o pai transformado',
            effects: { fe: 1 },
            consequence: 'Muito-Medo canta. Ela que viveu em terror canta à beira do rio da morte.',
          },
        ],
        weight: 3,
        emotionalWeight: 4,
      },
      {
        id: 'p2f6-reencontro-cristao',
        type: 'variable',
        narrative: [
          'Do outro lado do rio, uma figura vestida de luz estende a mão. É Cristão.',
          'Cristã o reconhece imediatamente. Anos de saudade se dissolvem numa lágrima e num sorriso.',
        ],
        choices: [
          {
            text: 'Correr para o abraço de Cristão sem olhar para trás',
            effects: { fe: 2, coragem: 1 },
            consequence: 'O rio é raso para quem corre com fé. Cristã e Cristão se abraçam na eternidade.',
          },
          {
            text: 'Estender a mão para os filhos, trazendo-os consigo',
            effects: { fe: 1, perseveranca: 1 },
            consequence: 'A família reunida. O que a Cidade da Destruição separou, a Cidade Celestial une.',
            consequenceKey: 'mostrou_misericordia',
          },
        ],
        weight: 3,
        emotionalWeight: 5,
      },
      {
        id: 'p2f6-muito-medo-canta',
        type: 'variable',
        narrative: [
          'Muito-Medo, tremendo, entra no rio. Todos esperam que ela afunde de medo.',
          'Mas ela abre a boca e canta. Um hino que ninguém lhe ensinou. Um canto que vem de um lugar mais profundo que o medo.',
        ],
        choices: [
          {
            text: 'Cantar junto com ela — o medo se afoga em louvor',
            effects: { fe: 2, coragem: 1 },
            consequence: 'O rio inteiro parece cantar. Os anjos do outro lado se juntam ao coro.',
          },
          {
            text: 'Observar em silêncio maravilhado',
            effects: { fe: 1, discernimento: 1 },
            consequence: 'A maior vitória de Muito-Medo não é entrar na Cidade. É cantar no rio.',
          },
        ],
        weight: 2,
        emotionalWeight: 4,
      },
    ],
  },
};

/**
 * Replay-exclusive events for Part II — only appear on 2nd+ playthrough.
 */
export const replayExclusiveEventsPart2: Record<string, PhaseEventPool> = {
  'p2-fase1': {
    phaseId: 'p2-fase1',
    variableCount: 1,
    events: [
      {
        id: 'p2r-memoria-cristao',
        type: 'variable',
        narrative: [
          'Cristã encontra um diário velho escondido na casa — é de Cristão. Palavras escritas antes da partida dele.',
          '"Se algum dia leres isto, perdoa-me por partir sem ti. Mas eu não podia ficar. E espero que um dia entendas por quê."',
        ],
        choices: [
          {
            text: 'Ler o diário até o fim, chorando e entendendo',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'Cada página é uma explicação que ela precisava há anos.',
            consequenceKey: 'buscou_sabedoria',
          },
          {
            text: 'Fechar o diário — as palavras doem demais',
            effects: { perseveranca: 1 },
            consequence: 'Algumas verdades precisam de tempo para serem digeridas.',
          },
        ],
        weight: 3,
        emotionalWeight: 4,
      },
    ],
  },
  'p2-fase6': {
    phaseId: 'p2-fase6',
    variableCount: 1,
    events: [
      {
        id: 'p2r-eco-jornada',
        type: 'variable',
        narrative: [
          'Na margem do rio, ecos de todas as suas jornadas se entrelaçam. Você ouve escolhas passadas, vozes familiares.',
          '"Cada vez que voltei", pensa Cristã, "o caminho estava mais claro. Não porque mudou — porque eu mudei."',
        ],
        choices: [
          {
            text: 'Agradecer por cada repetição — cada uma ensinou algo',
            effects: { fe: 2, discernimento: 1 },
            consequence: 'A gratidão é a última lição. E a mais difícil.',
          },
          {
            text: 'Entrar no rio com a sabedoria de todas as jornadas',
            effects: { fe: 2, coragem: 1 },
            consequence: 'O rio é raso. Tão raso que as pedras do fundo parecem degraus.',
            consequenceKey: 'perseverou_na_dor',
          },
        ],
        weight: 3,
        emotionalWeight: 5,
      },
    ],
  },
};
