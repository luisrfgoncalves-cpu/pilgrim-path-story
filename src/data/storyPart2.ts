/**
 * PARTE II — A PEREGRINA
 * Campanha solo baseada na segunda parte de "O Peregrino" de John Bunyan.
 * Segue a jornada de Cristã (esposa de Cristão), seus quatro filhos,
 * Misericórdia e o guia Grande-Coração até a Cidade Celestial.
 */

import { StoryChapter, Character, Reflection, ChoiceEffect } from './story';

export const PART2_FIRST_CHAPTER_ID = 'p2-cena1';

export const part2Characters: Character[] = [
  { id: "crista", name: "Cristã", description: "Esposa de Cristão. Arrependida por não tê-lo acompanhado, decide seguir o mesmo caminho com seus quatro filhos.", role: "Protagonista", unlockedAtChapter: "p2-cena1" },
  { id: "misericordia", name: "Misericórdia", description: "Jovem vizinha bondosa que acompanha Cristã. Representa a compaixão ativa e a graça entre irmãos.", role: "Companheira", unlockedAtChapter: "p2-cena2" },
  { id: "grande_coracao", name: "Grande-Coração", description: "Soldado valente designado pelo Intérprete para escoltar o grupo. Grande matador de gigantes.", role: "Guia e Protetor", unlockedAtChapter: "p2-fase2-cena1" },
  { id: "velho_honesto", name: "Velho Honesto", description: "Da Cidade da Estupidez, viu a Luz e se juntou ao grupo. Prolixo mas genuíno.", role: "Companheiro", unlockedAtChapter: "p2-fase3-cena1" },
  { id: "gaio", name: "Gaio", description: "Hospedeiro generoso entre o Vale da Sombra e a Feira. Revela a ancestralidade ilustre de Cristão.", role: "Anfitrião", unlockedAtChapter: "p2-fase3-cena4" },
  { id: "mente_fraca", name: "Mente-Fraca", description: "Resgatado do Gigante Mata-Bons por Grande-Coração. Frágil mas fiel.", role: "Companheiro", unlockedAtChapter: "p2-fase3-cena5" },
  { id: "pronto_para_parar", name: "Pronto-para-Parar", description: "Aleijado que caminha com muletas. Sua determinação inspira todos.", role: "Companheiro", unlockedAtChapter: "p2-fase4-cena1" },
  { id: "valente_pela_verdade", name: "Valente-pela-Verdade", description: "Guerreiro coberto de sangue após lutar contra três bandidos. Empunha uma lâmina de Jerusalém.", role: "Guerreiro", unlockedAtChapter: "p2-fase4-cena3" },
  { id: "sr_desanimo", name: "Sr. Desânimo", description: "Resgatado do Castelo da Dúvida. Continua lamentando até o fim.", role: "Companheiro", unlockedAtChapter: "p2-fase5-cena3" },
  { id: "muito_medo", name: "Muito-Medo", description: "Filha do Sr. Desânimo, também resgatada do Castelo. Vive em temor constante mas segue fielmente.", role: "Companheira", unlockedAtChapter: "p2-fase5-cena3" },
  { id: "firme", name: "Firme", description: "Encontrado ajoelhado na Terra Encantada, resistindo à sedução de Madame Bolha.", role: "Companheiro", unlockedAtChapter: "p2-fase6-cena1" },
  { id: "madame_bolha", name: "Madame Bolha", description: "Mulher elegante que tenta seduzir Firme com ouro, corpo e cama. Representa as tentações mundanas.", role: "Tentadora", unlockedAtChapter: "p2-fase6-cena1" },
];

export const part2Reflections: Reflection[] = [
  { id: "p2r1", title: "O Arrependimento Tardio", text: "Cristã não acompanhou o marido quando ele partiu. Anos depois, um sonho e uma carta do Rei a despertam. O arrependimento tardio ainda é arrependimento — e a porta ainda está aberta.", verse: "Joel 2:25 — \"Restituir-vos-ei os anos que foram consumidos pelo gafanhoto.\"", unlockedAtChapter: "p2-cena1" },
  { id: "p2r2", title: "A Companhia na Jornada", text: "Misericórdia não teve um chamado direto — ela simplesmente não conseguiu deixar Cristã ir sozinha. Às vezes, a fé começa não com uma visão, mas com um ato de amor por alguém que crê.", verse: "Rute 1:16 — \"Aonde quer que fores, irei eu; e onde quer que pousares, ali pousarei eu.\"", unlockedAtChapter: "p2-cena2" },
  { id: "p2r3", title: "O Guia Enviado", text: "Grande-Coração não é apenas forte — ele é enviado. Cristã não precisa lutar sozinha porque o Intérprete providenciou um protetor. Na jornada de fé, Deus não nos envia desarmados.", verse: "Salmos 91:11 — \"Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos.\"", unlockedAtChapter: "p2-fase2-cena1" },
  { id: "p2r4", title: "O Gigante Morto", text: "Grande-Coração mata o Gigante Desespero e destrói o Castelo da Dúvida. O que Cristão sobreviveu, Cristã vê destruído. Os gigantes que aterrorizam uma geração podem ser eliminados pela seguinte.", verse: "1 Samuel 17:50 — \"Davi prevaleceu sobre o filisteu com uma funda e uma pedra.\"", unlockedAtChapter: "p2-fase5-cena4" },
  { id: "p2r5", title: "A Resistência de Firme", text: "Firme é encontrado ajoelhado em oração, lutando contra a sedução de Madame Bolha. A resistência não é espetacular — é silenciosa, de joelhos, sozinha com Deus.", verse: "Tiago 4:7 — \"Resisti ao diabo, e ele fugirá de vós.\"", unlockedAtChapter: "p2-fase6-cena1" },
  { id: "p2r6", title: "Cada Um Atravessa Diferente", text: "No rio, cada peregrino atravessa de modo distinto. Alguns com canções, outros com medo, outros em paz. Bunyan ensina que não há fórmula para a morte — mas há promessa para o outro lado.", verse: "Salmos 116:15 — \"Preciosa é à vista do Senhor a morte dos seus santos.\"", unlockedAtChapter: "p2-fase6-cena5" },
];

export const part2Chapters: Record<string, StoryChapter> = {
  "p2-cena1": {
    id: "p2-cena1",
    title: "O Sonho e a Carta",
    location: "Cidade da Destruição",
    characters: ["crista"],
    narrative: [
      "Anos se passaram desde que Cristão partiu da Cidade da Destruição. Sua esposa, Cristã, ficou para trás com quatro filhos — Mateus, Tiago, Samuel e José.",
      "Uma noite, ela tem um sonho: vê o marido na Cidade Celestial, vestido de branco, entre anjos, olhando para ela com saudade e amor.",
      "Ao acordar, encontra uma carta deixada à sua porta. É do Rei da Cidade Celestial: \"Convido-te, Cristã, a vir ao meu palácio. O mesmo caminho que teu marido percorreu está aberto para ti e teus filhos.\""
    ]
  },

  "p2-cena2": {
    id: "p2-cena2",
    title: "Misericórdia",
    location: "Cidade da Destruição",
    characters: ["crista", "misericordia"],
    narrative: [
      "Cristã anuncia sua partida. Vizinhos zombam — exatamente como zombaram de Cristão anos atrás. \"Vai seguir o louco do seu marido?\", dizem.",
      "Mas uma jovem vizinha, Misericórdia, se aproxima com olhos cheios de lágrimas: \"Cristã, posso ir contigo? Não recebi carta do Rei como tu... mas não suporto ficar aqui. Se me aceitares, te acompanho.\"",
      "Misericórdia não tem chamado direto. Não tem carta. Tem apenas um coração que se recusa a abandonar quem ama."
    ]
  },

  "p2-cena3": {
    id: "p2-cena3",
    title: "O Pântano — Outra Vez",
    location: "Pântano do Desânimo",
    characters: ["crista", "misericordia"],
    narrative: [
      "O mesmo pântano que quase engoliu Cristão ainda está ali. As pedras de promessa que o Rei ordenou colocar estão parcialmente submersas — negligência dos zeladores.",
      "Os filhos de Cristã pisam nas pedras com cuidado. Misericórdia escorrega e quase cai na lama escura.",
      "\"Mãe, o pai passou por aqui?\", pergunta Mateus. \"Sim\", responde Cristã. \"E quase não saiu.\""
    ]
  },

  "p2-cena4": {
    id: "p2-cena4",
    title: "O Portão Estreito — Batendo e Esperando",
    location: "Portão Estreito",
    characters: ["crista", "misericordia"],
    narrative: [
      "Cristã chega ao Portão Estreito e bate. Ninguém responde de imediato. Ela bate de novo. E de novo.",
      "Um cachorro enorme late do outro lado, aterrorizado. Misericórdia, que ficou um pouco atrás, desmaia de medo ao ouvir os latidos.",
      "Finalmente, o portão se abre. O guardião olha para Cristã: \"Quem bate assim, com tanta insistência?\" Cristã responde: \"Sou a esposa de Cristão. Venho com meus filhos e uma amiga.\""
    ]
  },

  "p2-cena5": {
    id: "p2-cena5",
    title: "Os Mal-Encarados",
    location: "Próximo ao Portão",
    characters: ["crista", "misericordia"],
    narrative: [
      "Mal passam pelo portão, dois homens de aparência terrível atacam o grupo. São os Mal-Encarados — servos de Belzebu que tentam impedir peregrinos de prosseguir.",
      "O guardião do portão intervém e os afugenta, mas não antes de Cristã e Misericórdia sentirem o terror de um ataque real.",
      "\"Isto é normal\", diz o guardião. \"Todo peregrino que passa por esta porta é atacado logo depois. Seu marido também foi. Mas o Senhor vos guardará.\""
    ]
  },

  "p2-cena6": {
    id: "p2-cena6",
    title: "O Banho e as Vestes",
    location: "Jardim do Intérprete",
    characters: ["crista", "misericordia", "interprete"],
    narrative: [
      "O Intérprete recebe Cristã e seu grupo com alegria. \"A esposa de Cristão! Que honra.\"",
      "Ele ordena que preparem um banho cerimonial. Cristã, os filhos e Misericórdia são lavados e vestidos com roupas novas e brilhantes. O selo do Rei é colocado em suas testas.",
      "\"Agora estais marcadas\", diz o Intérprete. \"Todos verão a quem pertenceis. E quando a estrada escurecer, lembrai-vos deste momento.\""
    ]
  },

  "p2-fase2-cena1": {
    id: "p2-fase2-cena1",
    title: "Grande-Coração",
    location: "Casa do Intérprete",
    characters: ["crista", "misericordia", "grande_coracao", 'interprete'],
    narrative: [
      "O Intérprete chama um homem forte e armado: \"Este é Grande-Coração. Ele vos acompanhará até a Cidade Celestial.\" Onde Cristão caminhou sozinho, vocês terão um guia.",
      "Grande-Coração carrega uma espada enorme e um escudo gasto de muitas batalhas. Seus olhos são bondosos, mas sua postura é de quem já matou gigantes.",
      "\"Senhoras\", diz ele com voz grave, \"o caminho é o mesmo que o marido de vocês percorreu. Mas desta vez, nenhum gigante tocará em vocês enquanto eu respirar.\""
    ]
  },

  "p2-fase2-cena2": {
    id: "p2-fase2-cena2",
    title: "A Cruz — O Mesmo Lugar",
    location: "A Cruz",
    characters: ["crista", "misericordia", "grande_coracao"],
    narrative: [
      "O grupo chega ao pé da Cruz — o mesmo lugar onde o fardo de Cristão caiu e rolou para dentro do sepulcro.",
      "Cristã cai de joelhos. Lágrimas escorrem. \"Aqui\", sussurra. \"Foi aqui que ele foi livre.\"",
      "Misericórdia chora ao lado dela. Os filhos observam em silêncio sagrado. O lugar onde o peso do pecado caiu ainda pulsa com uma presença que nenhum dos viajantes consegue explicar."
    ]
  },

  "p2-fase2-cena3": {
    id: "p2-fase2-cena3",
    title: "A Colina da Dificuldade",
    location: "Colina da Dificuldade",
    characters: ["crista", "misericordia", "grande_coracao"],
    narrative: [
      "A mesma colina íngreme que exauriu Cristão aparece diante do grupo. Grande-Coração caminha na frente, abrindo o caminho.",
      "Os filhos de Cristã tropeçam nas pedras. Misericórdia ajuda os menores. Cristã puxa os maiores. A subida é lenta e dolorosa.",
      "No caramanchão onde Cristão adormeceu e quase perdeu o pergaminho, Grande-Coração diz: \"Descansem. Mas não durmam como o marido de vocês. Esse erro quase lhe custou tudo.\""
    ]
  },

  "p2-fase2-cena4": {
    id: "p2-fase2-cena4",
    title: "Os Leões e Grande-Coração",
    location: "Caminho dos Leões",
    characters: ["crista", "grande_coracao", 'vigilante'],
    narrative: [
      "Os leões acorrentados ainda estão ali. Cristã recua de medo, mas Grande-Coração ergue a espada e avança.",
      "Os leões rugem. Grande-Coração não hesita. Ele bate no chão com a espada e os leões recuam, revelando que suas correntes são curtas — como Vigilante revelou a Cristão.",
      "\"Viram?\", diz Grande-Coração. \"A mesma lição. O medo ruge alto, mas está acorrentado. Passem pelo centro.\""
    ]
  },

  "p2-fase2-cena5": {
    id: "p2-fase2-cena5",
    title: "O Palácio Belo — O Reencontro",
    location: "Palácio Belo",
    characters: ["crista", "misericordia", "grande_coracao", "discricao", "prudencia", "piedade", "caridade"],
    narrative: [
      "O Palácio Belo recebe o grupo com festa. As donzelas — Discrição, Prudência, Piedade e Caridade — reconhecem Cristã como a esposa de Cristão.",
      "\"Seu marido dormiu aqui. Comeu nesta mesa. Vestiu a armadura nesta sala\", diz Prudência com ternura.",
      "Misericórdia recebe atenção especial de Caridade: \"Você veio sem carta do Rei, mas com o coração do Rei. Isso é mais raro.\"",
      "Mateus, o filho mais velho, adoece após comer frutos de uma árvore proibida no caminho. O médico do palácio o cura com uma pílula amarga — arrependimento."
    ]
  },

  "p2-fase3-cena1": {
    id: "p2-fase3-cena1",
    title: "O Vale da Humilhação — Sem Apolião",
    location: "Vale da Humilhação",
    characters: ["crista", "grande_coracao", "velho_honesto"],
    narrative: [
      "O mesmo vale onde Cristão lutou contra Apolião. Mas desta vez, com Grande-Coração à frente, nenhum demônio ousa atacar.",
      "\"É estranho\", diz Grande-Coração. \"Este vale, que foi campo de batalha para seu marido, é para vocês um prado agradável. Vejam — há lírios e ovelhas.\"",
      "Um velho homem emerge do caminho lateral. \"Sou Velho Honesto, da Cidade da Estupidez. Vi a Luz há muito tempo, mas nunca tive coragem de partir. Posso juntar-me a vocês?\""
    ]
  },

  "p2-fase3-cena2": {
    id: "p2-fase3-cena2",
    title: "O Vale da Sombra da Morte",
    location: "Vale da Sombra da Morte",
    characters: ["crista", "grande_coracao"],
    narrative: [
      "O vale é tão escuro quanto foi para Cristão. Mas desta vez, um pilar de fogo aparece adiante, iluminando o caminho.",
      "Grande-Coração explica: \"Quando Cristão passou, o vale era pura escuridão. Para vocês, o Senhor enviou luz. Talvez porque desta vez haja crianças.\"",
      "Os filhos de Cristã se agarram à mãe. Os sussurros do abismo ainda ecoam, mas o pilar de fogo mantém os demônios à distância."
    ]
  },

  "p2-fase3-cena3": {
    id: "p2-fase3-cena3",
    title: "O Gigante Maul",
    location: "Saída do Vale",
    characters: ["crista", "grande_coracao", "gigante_maul"],
    narrative: [
      "Na saída do vale, um gigante chamado Maul bloqueia o caminho. Ele é menor que Desespero, mas feroz: \"Mulheres peregrinas? Fácil demais!\"",
      "Grande-Coração avança. A luta é intensa — espada contra clava. O gigante é forte, mas Grande-Coração é habilidoso.",
      "Após um combate que faz a terra tremer, Grande-Coração decepa a cabeça do gigante e a coloca num poste ao lado do caminho: aviso a todos os outros."
    ]
  },

  "p2-fase3-cena4": {
    id: "p2-fase3-cena4",
    title: "A Hospedaria de Gaio",
    location: "Hospedaria de Gaio",
    characters: ["crista", "misericordia", "gaio"],
    narrative: [
      "Entre o vale e a feira, o grupo encontra a hospedaria de Gaio — um discípulo honrado que recebe peregrinos com pão, vinho e histórias.",
      "\"Cristã!\", exclama Gaio. \"Seu marido comeu nesta mesa. E devo lhes contar: a linhagem de Cristão remonta a homens ilustres da fé.\"",
      "Gaio revela a ancestralidade espiritual de Cristão e organiza o casamento de Mateus (filho de Cristã) com Misericórdia. Lágrimas de alegria enchem a sala."
    ]
  },

  "p2-fase3-cena5": {
    id: "p2-fase3-cena5",
    title: "O Gigante Mata-Bons",
    location: "Caminho após a Hospedaria",
    characters: ["crista", "grande_coracao", "mente_fraca", "gigante_mata_bons"],
    narrative: [
      "No caminho, encontram o Gigante Mata-Bons arrastando um homem pálido e fraco: Mente-Fraca.",
      "Grande-Coração desafia o gigante: \"Solta esse homem, monstro! Tua hora chegou.\"",
      "O combate é brutal. Mata-Bons é mais forte que Maul, mas Grande-Coração luta com a fúria de quem protege os fracos. A cabeça do gigante rola no chão.",
      "Mente-Fraca, tremendo, agradece: \"Eu estava prestes a ser devorado. Posso... posso ir com vocês?\""
    ]
  },

  "p2-fase3-cena6": {
    id: "p2-fase3-cena6",
    title: "A Feira da Vaidade — Desta Vez, Diferente",
    location: "Feira da Vaidade",
    characters: ["crista", "grande_coracao", "misericordia", 'fiel'],
    narrative: [
      "A Feira da Vaidade ainda existe. Mas algo mudou. O martírio de Fiel, anos atrás, plantou sementes.",
      "Alguns moradores da feira recebem os peregrinos com respeito. Outros ainda zombam, mas o ódio não é tão intenso quanto foi com Cristão e Fiel.",
      "Grande-Coração fica alerta: \"Não confiem na aparente paz. Esta feira já matou um santo. Passem depressa.\""
    ]
  },

  "p2-fase4-cena1": {
    id: "p2-fase4-cena1",
    title: "Pronto-para-Parar",
    location: "Caminho Estreito",
    characters: ["crista", "grande_coracao", "pronto_para_parar"],
    narrative: [
      "No caminho, encontram um homem aleijado caminhando dolorosamente com muletas. Cada passo parece ser o último.",
      "\"Me chamam de Pronto-para-Parar\", diz ele com um sorriso triste. \"Porque a cada metro dizem que vou desistir. Mas aqui estou — ainda caminhando.\"",
      "Seu corpo é fraco, seus pés sangram, mas sua determinação faz o grupo inteiro parar em admiração."
    ]
  },

  "p2-fase4-cena2": {
    id: "p2-fase4-cena2",
    title: "A Mina de Demas — De Novo",
    location: "Colina de Lucro",
    characters: ["crista", "grande_coracao", 'demas'],
    narrative: [
      "A mina de Demas ainda está ali. Mas Demas não. Dizem que ele próprio entrou na mina buscando mais prata — e nunca mais saiu.",
      "A entrada da mina brilha com um reflexo dourado tentador. Alguns dos filhos olham com curiosidade.",
      "Grande-Coração fala severamente: \"Não olhem. Não cheguem perto. Muitos peregrinos morreram ali dentro. A ganância é uma porta sem volta.\""
    ]
  },

  "p2-fase4-cena3": {
    id: "p2-fase4-cena3",
    title: "Valente-pela-Verdade",
    location: "Caminho Estreito",
    characters: ["crista", "grande_coracao", "valente_pela_verdade"],
    narrative: [
      "O grupo encontra um homem coberto de sangue, espada em punho, cercado por três bandidos derrotados no chão.",
      "\"Sou Valente-pela-Verdade\", diz ele, limpando a lâmina. \"Três ladrões — Coração-Fraco, Desconfiança e Culpa — me emboscaram. Eles tentam roubar a fé de todo peregrino. Mas esta espada é uma lâmina legítima de Jerusalém.\"",
      "Grande-Coração sorri com aprovação: \"Um guerreiro de verdade. Junte-se a nós.\""
    ]
  },

  "p2-fase4-cena4": {
    id: "p2-fase4-cena4",
    title: "O Prado Agradável — Lição Aprendida",
    location: "Prado Agradável",
    characters: ["crista", "grande_coracao", 'esperanca'],
    narrative: [
      "O Prado Agradável que seduziu Cristão e Esperançoso para o Castelo da Dúvida aparece à esquerda do caminho.",
      "\"Aqui\", diz Grande-Coração, apontando as marcas na cerca. \"Aqui seu marido escalou a cerca e foi capturado pelo Gigante Desespero. Mas nós não repetiremos esse erro.\"",
      "Os filhos olham o prado verde e tentador. É lindo. É convidativo. E é uma armadilha."
    ]
  },

  "p2-fase5-cena1": {
    id: "p2-fase5-cena1",
    title: "Às Portas do Castelo da Dúvida",
    location: "Castelo da Dúvida",
    characters: ["crista", "grande_coracao", "valente_pela_verdade"],
    narrative: [
      "Grande-Coração para diante do Castelo da Dúvida. Não para fugir — para atacar.",
      "\"Este castelo aprisiona peregrinos há anos demais\", declara. \"O Gigante Desespero ainda vive ali dentro. Hoje, nós o destruímos.\"",
      "Valente-pela-Verdade bate a espada no escudo: \"Estou pronto.\""
    ]
  },

  "p2-fase5-cena2": {
    id: "p2-fase5-cena2",
    title: "A Batalha contra o Gigante Desespero",
    location: "Castelo da Dúvida",
    characters: ["crista", "grande_coracao", "valente_pela_verdade", "gigante_desespero", 'desconfianca'],
    narrative: [
      "Grande-Coração arromba os portões. O Gigante Desespero emerge, rugindo. Desconfiança, sua esposa, grita do alto da torre.",
      "A luta é épica. Grande-Coração e Valente-pela-Verdade atacam em conjunto. O gigante é poderoso, mas os dois guerreiros são implacáveis.",
      "Depois de um combate que faz tremer as fundações do castelo, Grande-Coração decepa a cabeça do Gigante Desespero. Desconfiança foge para as sombras."
    ]
  },

  "p2-fase5-cena3": {
    id: "p2-fase5-cena3",
    title: "Os Prisioneiros Libertados",
    location: "Masmorras do Castelo",
    characters: ["crista", "grande_coracao", "sr_desanimo", "muito_medo", 'misericordia'],
    narrative: [
      "Nas masmorras escuras, encontram dois prisioneiros: Sr. Desânimo e sua filha, Muito-Medo. Estão pálidos, fracos, cobertos de feridas.",
      "\"Há quanto tempo estão aqui?\", pergunta Cristã. \"Não sabemos mais\", responde Sr. Desânimo. \"O gigante nos dizia todos os dias para desistir da vida. Quase obedecemos.\"",
      "Muito-Medo agarra a mão de Misericórdia e não solta. \"Vocês são reais? Não é mais uma ilusão do gigante?\""
    ]
  },

  "p2-fase5-cena4": {
    id: "p2-fase5-cena4",
    title: "A Demolição do Castelo",
    location: "Castelo da Dúvida",
    characters: ["crista", "grande_coracao"],
    narrative: [
      "Grande-Coração não se contenta em matar o gigante. Ele ordena a destruição completa do Castelo da Dúvida.",
      "Pedra por pedra, o grupo destrói as muralhas. O castelo que aterrorizou peregrinos por gerações é reduzido a ruínas.",
      "\"O que Cristão sobreviveu, nós destruímos\", diz Grande-Coração. \"Nenhum outro peregrino será preso aqui.\"",
      "Onde antes havia trevas, agora há céu aberto."
    ]
  },

  "p2-fase5-cena5": {
    id: "p2-fase5-cena5",
    title: "As Montanhas Deleitosas",
    location: "Montanhas Deleitosas",
    characters: ["crista", "grande_coracao", "pastores"],
    narrative: [
      "Os quatro pastores — Conhecimento, Experiência, Vigilante e Sincero — recebem o grupo com banquete.",
      "\"A esposa de Cristão!\", exclama Conhecimento. \"Que jornada! O castelo que prendeu seu marido agora é pó. A coragem cresce a cada geração.\"",
      "Das montanhas, mostram a vista da Cidade Celestial — mais perto do que nunca. Os filhos de Cristã olham maravilhados.",
      "\"Vejam\", diz Sincero. \"E lembrem-se: também há um abismo para os que se desviam. Olhem ambos.\""
    ]
  },

  "p2-fase6-cena1": {
    id: "p2-fase6-cena1",
    title: "Firme e Madame Bolha",
    location: "Terra Encantada",
    characters: ["crista", "grande_coracao", "firme", "madame_bolha"],
    narrative: [
      "Na Terra Encantada — onde o ar faz os viajantes dormirem — o grupo encontra um homem ajoelhado em oração, tremendo.",
      "É Firme. Ao lado dele, uma mulher alta e elegante tenta seduzi-lo: Madame Bolha. Ela oferece sua bolsa de ouro, seu corpo e sua cama.",
      "\"Vem comigo\", sussurra ela. \"Tudo que queres, eu te dou. O caminho é longo demais. Por que sofrer?\"",
      "Firme ora com mais força. Grande-Coração avança e Madame Bolha desaparece como fumaça."
    ]
  },

  "p2-fase6-cena2": {
    id: "p2-fase6-cena2",
    title: "O País de Beulá",
    location: "País de Beulá",
    characters: ["crista", "misericordia", "grande_coracao"],
    narrative: [
      "O ar muda. O sono da Terra Encantada fica para trás. O País de Beulá se abre diante do grupo — flores, pássaros cantando, sol perpétuo.",
      "Aqui, a paz do Rei é sentida em toda parte. As crianças brincam sem medo pela primeira vez na jornada inteira.",
      "Cristã respira fundo: \"É assim que cheira a paz.\"",
      "Misericórdia sorri: \"Valeu cada pântano, cada gigante, cada lágrima.\""
    ]
  },

  "p2-fase6-cena3": {
    id: "p2-fase6-cena3",
    title: "O Chamado Individual",
    location: "Margem do Rio",
    characters: ["crista", "misericordia", "grande_coracao", "valente_pela_verdade"],
    narrative: [
      "O rio aparece. Mas na Parte II, Bunyan faz algo diferente: cada peregrino recebe um chamado individual do Rei.",
      "Um mensageiro chega a Cristã com uma carta: \"O Mestre te convida a estar em Sua presença dentro de dez dias.\"",
      "Cristã lê a carta e sorri. Não há medo. Não há pânico. Apenas uma paz profunda e uma saudade de quem já espera do outro lado — seu marido."
    ]
  },

  "p2-fase6-cena4": {
    id: "p2-fase6-cena4",
    title: "As Despedidas",
    location: "Margem do Rio",
    characters: ["crista", "misericordia", "grande_coracao", "valente_pela_verdade", "sr_desanimo", 'muito_medo'],
    narrative: [
      "Cada peregrino se despede à sua maneira. Valente-pela-Verdade diz as palavras mais famosas da Parte II:",
      "\"Minha espada, eu a deixo a quem me suceder na peregrinação. Minha coragem e habilidade, ao que puder obtê-las. Minhas marcas e cicatrizes, levo comigo como testemunho de que lutei Suas batalhas.\"",
      "Sr. Desânimo, surpreendendo a todos, diz com voz firme pela primeira vez: \"Adeus, noite. Bem-vindo, dia. O desânimo não cruzará o rio comigo.\"",
      "Muito-Medo atravessa cantando — ela que viveu em terror constante morre com uma canção nos lábios."
    ]
  },

  "p2-fase6-cena5": {
    id: "p2-fase6-cena5",
    title: "A Travessia de Cristã",
    location: "No Rio",
    characters: ["crista"],
    narrative: [
      "Cristã entra no rio. As águas que quase afogaram Cristão são, para ela, surpreendentemente calmas.",
      "Bunyan escreve: \"Suas últimas palavras foram: 'Venho, Senhor, para estar Contigo e Te bendizer.'\"",
      "Do outro lado do rio, uma multidão espera. Trombetas soam. Anjos cantam. E no meio deles — Cristão, vestido de glória, estende a mão para sua esposa.",
      "O reencontro é eterno."
    ]
  },

  "p2-fase6-cena6": {
    id: "p2-fase6-cena6",
    title: "O Fim da Segunda Peregrinação",
    location: "Cidade Celestial",
    characters: ["crista", "misericordia"],
    narrative: [
      "Os portões se abrem. Cristã e todos os seus companheiros entram na Cidade Celestial. Trombetas soam. Vozes cantam.",
      "A peregrinação de Cristã é diferente da de Cristão: ela não caminhou sozinha. Levou filhos, amigos, fracos, feridos. Onde Cristão lutou com espada, ela lutou com compaixão.",
      "Bunyan encerra a Parte II com estas palavras: \"Devo tomar cuidado para não revelar mais do que o sonho me mostrou, pois há no Céu coisas que nenhuma língua pode descrever.\"",
      "A jornada terminou. Ambas as peregrinações — a do marido e a da esposa — estão completas. A Cidade da Destruição ficou para trás. A porta está aberta para quem quiser partir."
    ]
  },

  "p2-final-desistencia": {
    id: "p2-final-desistencia",
    title: "A Desistência de Cristã",
    location: "Caminho Estreito",
    characters: ["crista", 'misericordia'],
    narrative: [
      "O peso da jornada se tornou insuportável. Os filhos choram, os companheiros vacilam, e a estrada parece não ter fim.",
      "Cristã para. Olha para trás. A Cidade da Destruição parece tão distante quanto a Cidade Celestial. Presa no meio, ela se senta e não se levanta.",
      "\"Cristão conseguiu\", sussurra. \"Mas Cristão era mais forte que eu. Talvez nem todos sejam feitos para esta jornada.\"",
      "O caminho continua sem ela. Misericórdia chora. Os filhos esperam. Mas Cristã não se levanta. Não desta vez."
    ]
  },

  "p2-final-terra-encantada": {
    id: "p2-final-terra-encantada",
    title: "O Sono Eterno",
    location: "Terra Encantada",
    characters: ["crista", "misericordia", 'grande_coracao'],
    narrative: [
      "O ar da Terra Encantada é doce demais. Os filhos adormecem primeiro. Depois Misericórdia. Depois Cristã.",
      "Grande-Coração tenta acordá-los, mas o sono é profundo — o sono de quem está cansado demais para continuar.",
      "\"Acorde!\", grita ele. \"A Cidade está tão perto! Uma hora de caminhada!\"",
      "Mas os olhos de Cristã não se abrem. A Terra Encantada cobra seu preço. Tão perto do fim, e tão distante.",
      "Bunyan alertou: 'Há peregrinos que dormem a um passo da glória.' Este é o sono dos que quase chegaram."
    ]
  }
};

export const getPart2Chapter = (id: string): StoryChapter | undefined => part2Chapters[id];

export const part2ChapterOrder = [
  "p2-cena1", "p2-cena2", "p2-cena3", "p2-cena4", "p2-cena5", "p2-cena6",
  "p2-fase2-cena1", "p2-fase2-cena2", "p2-fase2-cena3", "p2-fase2-cena4", "p2-fase2-cena5",
  "p2-fase3-cena1", "p2-fase3-cena2", "p2-fase3-cena3", "p2-fase3-cena4", "p2-fase3-cena5", "p2-fase3-cena6",
  "p2-fase4-cena1", "p2-fase4-cena2", "p2-fase4-cena3", "p2-fase4-cena4",
  "p2-fase5-cena1", "p2-fase5-cena2", "p2-fase5-cena3", "p2-fase5-cena4", "p2-fase5-cena5",
  "p2-fase6-cena1", "p2-fase6-cena2", "p2-fase6-cena3", "p2-fase6-cena4", "p2-fase6-cena5", "p2-fase6-cena6",
];
