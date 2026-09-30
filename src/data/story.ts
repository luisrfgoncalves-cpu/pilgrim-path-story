export interface ChoiceEffect {
  fe?: number;
  perseveranca?: number;
  discernimento?: number;
  coragem?: number;
}

/** Conditional bonus/penalty applied on top of base effects */
export interface ConditionalEffect {
  /** Attribute to check */
  attr: keyof ChoiceEffect;
  /** Minimum value to trigger (if met, apply bonus; if not met, apply penalty) */
  threshold: number;
  /** Extra effects when player meets the threshold */
  bonus?: ChoiceEffect;
  /** Extra effects when player is below the threshold */
  penalty?: ChoiceEffect;
}

export interface ToneOption {
  tone: 'humble' | 'firm' | 'sarcastic' | 'fearful';
  emoji: string;
  label: string;
  npcReaction: string;
  /** Extra attribute bonus/penalty for choosing this tone */
  effects?: ChoiceEffect;
}

export interface StoryChoice {
  text: string;
  nextChapterId: string;
  consequence?: string;
  effects: ChoiceEffect;
  requires?: Partial<ChoiceEffect>;
  flag?: string;
  requiresFlag?: string;
  excludesFlag?: string;
  conditionalEffects?: ConditionalEffect[];
  /** Item granted when this choice is made */
  item?: string;
  /** Tone options — how the player responds, affects NPC reaction */
  toneOptions?: ToneOption[];
}

/** Tone variation: shows different text based on whether an attribute is high or low */
export interface ToneNarrative {
  attr: keyof ChoiceEffect;
  highThreshold: number;
  highText: string;
  lowThreshold: number;
  lowText: string;
}

export interface SceneEventConfig {
  type: 'sinking' | 'tension' | 'suspense';
  delay?: number;
  duration?: number;
  message?: string;
  intensity?: number;
}

export interface StoryChapter {
  id: string;
  title: string;
  location: string;
  narrative: string[];
  adaptiveNarrative?: { minAttr: keyof ChoiceEffect; minValue: number; text: string }[];
  flagNarrative?: { flag: string; text: string }[];
  noFlagNarrative?: { flag: string; text: string }[];
  toneNarrative?: ToneNarrative[];
  replayNarrative?: string[];
  choices?: StoryChoice[];
  isEnding?: boolean;
  endingType?: 'parte1' | 'final_good' | 'final_bad';
  reflection?: string;
  characters?: string[];
  interactionType?: 'hold' | 'timed' | 'drag';
  timeLimit?: number;
  timeoutChoiceIndex?: number;
  /** Immersive event triggered when entering scene */
  sceneEvent?: SceneEventConfig;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  unlockedAtChapter: string;
}

export interface Reflection {
  id: string;
  title: string;
  text: string;
  verse?: string;
  unlockedAtChapter: string;
}

export const characters: Character[] = [
  { id: "cristao", name: "Cristão", description: "Um homem chamado Gracioso que, ao ler um livro, descobre que sua cidade será destruída. O peso de seus pecados o esmaga, e ele parte em busca da Porta Estreita e da Cidade Celestial.", role: "Protagonista", unlockedAtChapter: "cena1" },
  { id: "obstinado", name: "Obstinado", description: "Vizinho de Cristão que zomba de sua decisão e tenta convencê-lo a abandonar a jornada. Representa aqueles que se recusam a ouvir qualquer chamado espiritual.", role: "Opositor", unlockedAtChapter: "cena2" },
  { id: "flexivel", name: "Flexível", description: "Vizinho que inicialmente se junta a Cristão, mas desiste ao primeiro sinal de dificuldade no Pântano do Desânimo. Representa a fé superficial.", role: "Companheiro temporário", unlockedAtChapter: "cena2" },
  { id: "evangelista", name: "Evangelista", description: "O mensageiro que aponta para Cristão a Porta Estreita e o pergaminho luminoso. Ele reaparece nos momentos em que Cristão se desvia do caminho.", role: "Guia", unlockedAtChapter: "cena5" },
  { id: "prudencia_mundana", name: "Prudência Mundana", description: "Um homem astuto que aconselha Cristão a buscar alívio no vilarejo da Moralidade, tentando desviá-lo do caminho estreito com soluções fáceis e mundanas.", role: "Tentador", unlockedAtChapter: "cena8" },
  { id: "auxilio", name: "Auxílio", description: "O homem que estende a mão a Cristão quando ele está afundando no Pântano do Desânimo. Representa a ajuda divina nos momentos de maior fraqueza.", role: "Ajudante", unlockedAtChapter: "cena13" },
  { id: "interprete", name: "Intérprete", description: "O sábio guardião da Casa do Intérprete, que revela verdades espirituais através de visões e parábolas vivas.", role: "Mestre", unlockedAtChapter: "fase2-cena1" },
  { id: "homem_gaiola", name: "Homem na Gaiola de Ferro", description: "Um ex-peregrino que abandonou o caminho e agora está preso no desespero, incapaz de recuperar a graça que rejeitou. Serve como aviso solene.", role: "Advertência", unlockedAtChapter: "fase2-cena8" },
  { id: "apolion", name: "Apolião", description: "O terrível governante do Vale da Humilhação, uma criatura coberta de escamas com asas de dragão, que tenta destruir Cristão.", role: "Antagonista", unlockedAtChapter: "fase3-cena3" },
  { id: "fiel", name: "Fiel", description: "Um peregrino corajoso que se junta a Cristão após o Vale da Humilhação. Na Feira da Vaidade, ele é martirizado por se recusar a negar a verdade, e sua morte inspira outros.", role: "Companheiro e Mártir", unlockedAtChapter: "fase3-cena8" },
  { id: "esperanca", name: "Esperança", description: "Convertido pelo testemunho e martírio de Fiel na Feira da Vaidade. Torna-se o companheiro fiel de Cristão até a Cidade Celestial, encorajando-o nos momentos mais sombrios.", role: "Companheiro", unlockedAtChapter: "fase4-cena8" },
  { id: "gigante_desespero", name: "Gigante Desespero", description: "O dono do Castelo da Dúvida, que aprisiona peregrinos que se desviam do caminho e tenta convencê-los a desistir da vida.", role: "Antagonista", unlockedAtChapter: "fase5-cena2" },
  { id: "desconfianca", name: "Desconfiança", description: "A esposa do Gigante Desespero, que sussurra conselhos cruéis ao marido sobre como torturar os prisioneiros.", role: "Antagonista", unlockedAtChapter: "fase5-cena3" },
  { id: "pastores", name: "Os Pastores das Montanhas", description: "Conhecimento, Experiência, Vigilante e Sincero — os quatro pastores das Montanhas Deleitosas que mostram aos peregrinos uma visão distante da Cidade Celestial.", role: "Guias", unlockedAtChapter: "fase5-cena9" },
  { id: "formalista", name: "Formalista", description: "Um homem que pula o muro do caminho em vez de entrar pela Porta Estreita. Acredita que seguir rituais externos basta, sem transformação interior.", role: "Opositor", unlockedAtChapter: "cena7" },
  { id: "hipocrisia", name: "Hipocrisia", description: "Companheiro de Formalista, que também pula o muro. Representa aqueles que fingem piedade sem verdadeira conversão.", role: "Opositor", unlockedAtChapter: "cena7" },
  { id: "falador", name: "Falador", description: "Um homem de palavras bonitas mas sem frutos. Conhece toda a doutrina, mas não a vive. Fiel o desmascarou na estrada.", role: "Opositor", unlockedAtChapter: "fase3-cena10" },
  { id: "amor_dinheiro", name: "Amor ao Dinheiro", description: "Um cavalheiro de Vanity Fair que tenta convencer os peregrinos de que servir a Deus e buscar riquezas são compatíveis.", role: "Tentador", unlockedAtChapter: "fase4-cena3" },
  { id: "discricao", name: "Discrição", description: "Uma das donzelas do Palácio Belo que examina o peregrino antes de lhe dar entrada, testando a sinceridade de sua fé.", role: "Guia", unlockedAtChapter: "fase2-cena7" },
  { id: "prudencia", name: "Prudência", description: "Donzela do Palácio Belo que questiona Cristão sobre suas motivações e o ajuda a examinar seu próprio coração.", role: "Guia", unlockedAtChapter: "fase2-cena9" },
  { id: "piedade", name: "Piedade", description: "Donzela do Palácio Belo que conversa com Cristão sobre as maravilhas do país para onde caminha, fortalecendo sua esperança.", role: "Guia", unlockedAtChapter: "fase2-cena9" },
  { id: "caridade", name: "Caridade", description: "Donzela do Palácio Belo que pergunta a Cristão sobre sua família e o encoraja a ter compaixão, mesmo pelos que ficaram para trás.", role: "Guia", unlockedAtChapter: "fase2-cena9" },
  { id: "ignorancia", name: "Ignorância", description: "Um jovem da terra da Presunção que segue o caminho sem nunca ter passado pela Porta Estreita. Acredita que seu coração bom é suficiente. No final, é rejeitado nos portões da Cidade Celestial.", role: "Contraste", unlockedAtChapter: "fase5-cena10" },

  // ── Parte I — Novos personagens ──
  { id: "boa_vontade", name: "Boa-Vontade", description: "O guardião do Portão Estreito que abre a porta para Cristão e o puxa para dentro quando flechas são disparadas contra ele. Representa a graça que recebe quem busca a entrada.", role: "Guia", unlockedAtChapter: "cena7" },
  { id: "tres_resplandecentes", name: "Três Seres Resplandecentes", description: "Três mensageiros celestiais enviados por Deus para encontrar Cristão ao pé da Cruz. O primeiro anuncia que Deus perdoou seus pecados, o segundo lhe dá vestes novas, e o terceiro lhe entrega um pergaminho selado como passaporte para a Cidade Celestial.", role: "Mensageiros divinos", unlockedAtChapter: "cena15" },
  { id: "juiz_odio_ao_bem", name: "Juiz Ódio-ao-Bem", description: "O juiz cruel que preside o julgamento de Fiel na Feira da Vaidade. Condena Fiel à morte por se recusar a adorar os ídolos da feira, representando a perseguição aos fiéis.", role: "Antagonista", unlockedAtChapter: "fase4-cena6" },
  { id: "interesses", name: "Interesses", description: "Um homem da cidade de Bom-Discurso que só segue a religião quando ela caminha com 'chinelos de prata', sob o sol e com aplausos do povo. Abandona a fé sempre que ela custa algo.", role: "Opositor", unlockedAtChapter: "fase5-cena1" },
  { id: "lisonjeiro", name: "Lisonjeiro", description: "Um homem de pele escura coberto com uma veste branca brilhante que engana Cristão e Esperançoso, levando-os para uma armadilha em forma de rede. Um Ser Resplandecente os resgata com um chicote.", role: "Tentador", unlockedAtChapter: "fase5-cena8" },
  { id: "ateismo", name: "Ateísmo", description: "Um homem que ri dos peregrinos, afirmando que buscou a Cidade Celestial por vinte anos e nunca a encontrou. Nega sua existência e tenta convencer Cristão e Esperançoso a desistir.", role: "Opositor", unlockedAtChapter: "fase5-cena10" },
  { id: "pequena_fe", name: "Pequena-Fé", description: "Um peregrino da cidade de Sinceridade que foi assaltado por três ladrões — Coração-Fraco, Desconfiança e Culpa — no Caminho Estreito. Perdeu seu dinheiro mas manteve seu pergaminho e suas joias.", role: "Advertência", unlockedAtChapter: "fase4-cena9" },
  { id: "presuncao_preguica_simples", name: "Presunção, Preguiça e Simples", description: "Três homens encontrados dormindo à beira do caminho com grilhões nos pés. Cristão os adverte do perigo, mas Presunção diz 'cada um cuide de si', Preguiça pede 'mais um cochilo', e Simples diz 'não vejo perigo algum'.", role: "Advertência", unlockedAtChapter: "cena6" },
  { id: "vergonha", name: "Vergonha", description: "Um homem ousado que aborda Fiel na estrada e tenta convencê-lo de que a religião é coisa vergonhosa, indigna de homens corajosos. Usa argumentos sociais e intelectuais contra a fé.", role: "Tentador", unlockedAtChapter: "fase3-cena9" },
  { id: "volta_atras", name: "Volta-Atrás", description: "Um apóstata capturado por sete demônios e amarrado com sete cordas, sendo levado de volta ao portão do abismo. Cristão e Esperançoso o veem sendo arrastado nas Montanhas Deleitosas como aviso solene.", role: "Advertência", unlockedAtChapter: "fase5-cena9" },
  { id: "demas", name: "Demas", description: "Descendente de Geazi (servo de Eliseu) e parente de Judas Iscariotes. Fica ao lado de uma mina de prata na Colina de Lucro, chamando peregrinos para se desviarem por ganância. Muitos que entraram na mina nunca mais saíram.", role: "Tentador", unlockedAtChapter: "fase4-cena10" },
  { id: "timidez_desconfianca", name: "Timidez e Desconfiança", description: "Dois homens que fogem dos leões acorrentados no caminho do Palácio Belo. Representam os que abandonam a jornada por medo de perigos que, na verdade, estão sob controle.", role: "Advertência", unlockedAtChapter: "fase2-cena14" },
  { id: "vigilante", name: "Vigilante", description: "O porteiro do Palácio Belo que encoraja Cristão a passar entre os leões acorrentados, revelando que eles não podem alcançar quem se mantém no centro do caminho.", role: "Guia", unlockedAtChapter: "fase2-cena14" },
  { id: "demas", name: "Demas", description: "Descendente de Geazi e parente de Judas Iscariotes. Fica ao lado de uma mina de prata chamando peregrinos para se desviarem por ganância.", role: "Tentador", unlockedAtChapter: "fase4-cena10" },

  // ── Personagens sem nome (ilustrativos) ──
  { id: "esposa_cristao", name: "Esposa de Cristão", description: "A mulher de Cristão que, na Parte I, não compreende o desespero do marido e pede que ele volte a dormir. Na Parte II (como Cristã), ela se arrepende e faz a mesma jornada.", role: "Família", unlockedAtChapter: "cena1" },
  { id: "vizinhos", name: "Vizinhos da Cidade", description: "Os moradores da Cidade da Destruição que zombam de Cristão, fecham as janelas e riem do homem que chora em público. Representam a indiferença do mundo diante do chamado divino.", role: "Ambiente", unlockedAtChapter: "cena1b" },
  { id: "livro_antigo", name: "O Livro", description: "O livro que Cristão abre e que revela a condenação da Cidade da Destruição. Representa a Bíblia — a Palavra de Deus que desperta a consciência do pecador.", role: "Símbolo", unlockedAtChapter: "cena1" },

  // ── Parte II — Novos personagens ──
  { id: "crista", name: "Cristã", description: "Esposa de Cristão e protagonista da Parte II. Arrependida por não ter acompanhado o marido, decide seguir o mesmo caminho até a Cidade Celestial, levando seus quatro filhos: Mateus, Tiago, Samuel e José.", role: "Protagonista (Parte II)", unlockedAtChapter: "cena1" },
  { id: "misericordia", name: "Misericórdia", description: "Jovem bondosa, amiga e vizinha de Cristã, que decide acompanhá-la na peregrinação. Casa-se com Mateus durante a jornada. Representa a compaixão ativa e a graça exercida entre irmãos.", role: "Companheira (Parte II)", unlockedAtChapter: "cena2" },
  { id: "grande_coracao", name: "Grande-Coração", description: "Soldado cristão valente designado pelo Intérprete para escoltar Cristã e seu grupo até a Cidade Celestial. Grande matador de gigantes e defensor incansável dos peregrinos.", role: "Guia e Protetor (Parte II)", unlockedAtChapter: "fase2-cena1" },
  { id: "velho_honesto", name: "Velho Honesto", description: "Nativo da Cidade da Estupidez que, apesar de suas origens, viu a Luz e se juntou ao grupo de Cristã. Argumentativo e prolixo, mas genuíno em sua fé.", role: "Companheiro (Parte II)", unlockedAtChapter: "fase3-cena1" },
  { id: "gaio", name: "Gaio", description: "Discípulo honrado que mantém uma hospedaria acolhedora entre o Vale da Sombra da Morte e a Feira da Vaidade. Recebe os peregrinos com pão e vinho, e revela a Cristã a ancestralidade ilustre de seu marido.", role: "Anfitrião (Parte II)", unlockedAtChapter: "fase3-cena5" },
  { id: "mente_fraca", name: "Mente-Fraca", description: "Homem de aparência pálida e constituição fraca, resgatado das mãos do gigante Mata-Bons por Grande-Coração. Junta-se à peregrinação apesar de sua fragilidade.", role: "Companheiro (Parte II)", unlockedAtChapter: "fase3-cena7" },
  { id: "pronto_para_parar", name: "Pronto-para-Parar", description: "Homem aleijado que caminha dolorosamente com muletas, mas insiste em seguir na peregrinação. Sua determinação apesar da deficiência física inspira todos ao redor.", role: "Companheiro (Parte II)", unlockedAtChapter: "fase3-cena8" },
  { id: "sr_desanimo", name: "Sr. Desânimo", description: "Prisioneiro resgatado da masmorra do Castelo da Dúvida quando Grande-Coração lidera a expedição para matar o Gigante Desespero. Junta-se à peregrinação, mas continua lamentando até o fim.", role: "Companheiro (Parte II)", unlockedAtChapter: "fase5-cena4" },
  { id: "muito_medo", name: "Muito-Medo", description: "Filha do Sr. Desânimo, também resgatada do Castelo da Dúvida. Vive em constante temor, mas segue fielmente com o grupo de peregrinos até o fim.", role: "Companheira (Parte II)", unlockedAtChapter: "fase5-cena4" },
  { id: "valente_pela_verdade", name: "Valente-pela-Verdade", description: "Guerreiro cristão que empunha uma 'lâmina legítima de Jerusalém' e é encontrado coberto de sangue após lutar contra três bandidos. Um dos personagens mais memoráveis de Bunyan.", role: "Guerreiro (Parte II)", unlockedAtChapter: "fase4-cena1" },
  { id: "firme", name: "Firme", description: "Encontrado ajoelhado em oração na Terra Encantada, implorando a Deus que o salvasse da tentação de Madame Bolha. Sua resistência à sedução exemplifica a perseverança na fé.", role: "Companheiro (Parte II)", unlockedAtChapter: "fase6-cena1" },
  { id: "madame_bolha", name: "Madame Bolha", description: "Uma mulher alta e elegante que carrega uma bolsa cheia de ouro e tenta seduzir Firme oferecendo seu corpo, sua bolsa e sua cama. Representa as tentações materiais e carnais do mundo.", role: "Tentadora (Parte II)", unlockedAtChapter: "fase6-cena1" },
  { id: "gigante_maul", name: "Gigante Maul", description: "Um gigante feroz que bloqueia a saída do Vale da Sombra da Morte na Parte II. Menor que Desespero, mas igualmente mortal. Grande-Coração decepa sua cabeça e a coloca num poste como aviso.", role: "Antagonista (Parte II)", unlockedAtChapter: "p2-fase3-cena3" },
  { id: "gigante_mata_bons", name: "Gigante Mata-Bons", description: "Um gigante brutal que ataca peregrinos fracos no caminho. Arrastava Mente-Fraca quando Grande-Coração o enfrentou e matou em combate brutal.", role: "Antagonista (Parte II)", unlockedAtChapter: "p2-fase3-cena5" },
];

export const reflections: Reflection[] = [
  { id: "r1", title: "O Fardo dos Pecados", text: "Cristão carrega nas costas um fardo que nenhuma mão humana pode remover. Ele representa tudo aquilo que nos separa de Deus — culpa, medo, vergonha. Reconhecer o peso é o primeiro ato de honestidade.", verse: "Mateus 11:28 — \"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.\"", unlockedAtChapter: "cena1" },
  { id: "r2", title: "A Surdez Voluntária", text: "Obstinado e Flexível são dois lados da mesma moeda: um não quer ouvir, o outro ouve mas não persevera. A verdadeira escuta exige compromisso.", verse: "Provérbios 28:13 — \"O que encobre as suas transgressões nunca prosperará.\"", unlockedAtChapter: "cena2" },
  { id: "r3", title: "O Despertar da Consciência", text: "Quando Cristão lê o livro e chora, algo se rompe dentro dele. O despertar espiritual não é suave — é uma ruptura dolorosa com a ilusão de normalidade.", verse: "João 8:32 — \"Conhecereis a verdade, e a verdade vos libertará.\"", unlockedAtChapter: "cena3" },
  { id: "r4", title: "A Porta Estreita", text: "Evangelista não oferece conforto fácil. Ele aponta para uma porta estreita, difícil de encontrar, ainda mais difícil de atravessar. Mas é a única porta que leva à vida.", verse: "Mateus 7:14 — \"Estreita é a porta, e apertado o caminho que leva à vida.\"", unlockedAtChapter: "cena7" },
  { id: "r5", title: "O Pântano do Desânimo", text: "Bunyan escreveu que o Pântano existe porque 'à medida que o pecador desperta para sua condição, surgem muitos medos, dúvidas e temores desanimadores'. O desânimo é o primeiro ataque ao peregrino.", verse: "Salmos 40:2 — \"Tirou-me de um lago horrível, pôs os meus pés sobre uma rocha.\"", unlockedAtChapter: "cena11" },
  { id: "r6", title: "O Alívio na Cruz", text: "Ao pé da cruz, o fardo cai das costas de Cristão e rola para dentro do sepulcro. Nenhum esforço humano o removeu — foi a graça. Três Seres Resplandecentes lhe dão vestes novas e um pergaminho selado.", verse: "2 Coríntios 5:17 — \"Se alguém está em Cristo, nova criatura é.\"", unlockedAtChapter: "cena15" },
  { id: "r7", title: "As Visões do Intérprete", text: "Na Casa do Intérprete, Cristão vê parábolas vivas: o fogo que não se apaga, o homem na gaiola de ferro, o sonhador do Juízo Final. Cada visão é um espelho da alma — revela o que está dentro de nós.", verse: "1 Coríntios 2:10 — \"Mas Deus no-las revelou pelo seu Espírito; porque o Espírito penetra todas as coisas.\"", unlockedAtChapter: "fase2-cena1" },
  { id: "r8", title: "A Armadura de Deus", text: "No Palácio Belo, Cristão recebe a armadura completa descrita por Paulo em Efésios 6: cinturão da verdade, couraça da justiça, sandálias do evangelho, escudo da fé, capacete da salvação e espada do Espírito. Sem ela, nenhum peregrino sobrevive ao vale.", verse: "Efésios 6:11 — \"Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.\"", unlockedAtChapter: "fase2-cena9" },
  { id: "r9", title: "O Vale da Humilhação", text: "É no vale — não no topo — que Cristão enfrenta Apolião. Bunyan ensina que os maiores combates espirituais acontecem nos momentos de humilhação, não de glória. A espada do Espírito é a única arma que fere o inimigo.", verse: "Tiago 4:7 — \"Sujeitai-vos a Deus, resisti ao diabo, e ele fugirá de vós.\"", unlockedAtChapter: "fase3-cena3" },
  { id: "r10", title: "O Martírio de Fiel", text: "Fiel morre na Feira da Vaidade não porque falhou, mas porque se recusou a negar a verdade. Sua morte não é derrota — é testemunho. Uma carruagem celestial o leva direto à Cidade Celestial, sem precisar completar a jornada.", verse: "Apocalipse 2:10 — \"Sê fiel até à morte, e dar-te-ei a coroa da vida.\"", unlockedAtChapter: "fase4-cena7" },
  { id: "r11", title: "A Chave da Promessa", text: "Trancados no Castelo da Dúvida, Cristão e Esperançoso quase desistem. Então Cristão lembra: 'Tenho no meu peito uma chave chamada Promessa!' A chave abre todas as portas. A promessa de Deus é sempre suficiente.", verse: "2 Pedro 1:4 — \"Nos têm sido doadas as suas preciosas e grandíssimas promessas.\"", unlockedAtChapter: "fase5-cena6" },
  { id: "r12", title: "Os Pastores das Montanhas", text: "Conhecimento, Experiência, Vigilante e Sincero — os quatro pastores das Montanhas Deleitosas mostram a Cristão tanto a vista gloriosa da Cidade Celestial quanto o abismo dos que se desviaram. Ver ambos é necessário.", verse: "Provérbios 4:18 — \"A vereda dos justos é como a luz da aurora, que vai brilhando mais e mais até ser dia perfeito.\"", unlockedAtChapter: "fase5-cena9" },
  { id: "r13", title: "O País de Beulá", text: "Antes do Rio da Morte, os peregrinos entram no País de Beulá — terra de flores, canto de pássaros e paz profunda. É o descanso antes da última prova. Mesmo a morte não pode roubar a alegria de quem já vislumbrou a Cidade.", verse: "Isaías 62:4 — \"A tua terra não se chamará mais Desolada; mas será chamada Beulá, porque o Senhor se deleitará em ti.\"", unlockedAtChapter: "fase6-cena1" },
  { id: "r14", title: "A Travessia do Rio", text: "O Rio da Morte não tem ponte nem barco. Cada peregrino o atravessa de modo diferente — Cristão quase se afogou, mas Esperançoso o sustentou. Bunyan ensina que até o último momento exige fé, e que a morte do crente não é o fim.", verse: "Salmos 23:4 — \"Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo.\"", unlockedAtChapter: "fase6-cena2" },
  { id: "r15", title: "A Cidade Celestial", text: "Trombetas soam, anjos cantam, os portões se abrem. Cristão e Esperançoso são recebidos com vestes de ouro e coroas. Mas Ignorância, que nunca passou pela Porta Estreita, é rejeitado. A entrada não se compra com boas intenções — só pela graça.", verse: "Apocalipse 21:4 — \"E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor.\"", unlockedAtChapter: "fase6-cena8" },
];

export const chapterOrder = [
  "cena1", "cena1b", "cena2", "cena3", "cena4", "cena5", "cena5b",
  "cena6", "cena7", "cena7b", "cena8", "cena9", "cena9b", "cena10",
  "cena11", "cena11b", "cena12", "cena13", "cena14", "cena14b", "cena15", "cena15b",
  "fase2-cena1", "fase2-cena2", "fase2-cena3", "fase2-cena4", "fase2-cena5",
  "fase2-cena6", "fase2-cena7", "fase2-cena8", "fase2-cena9", "fase2-cena10",
  "fase2-cena11", "fase2-cena12", "fase2-cena13", "fase2-cena14",
  "fase3-cena1", "fase3-cena2", "fase3-cena3", "fase3-cena4", "fase3-cena5",
  "fase3-cena6", "fase3-cena7", "fase3-cena8", "fase3-cena9", "fase3-cena10",
  "fase4-cena1", "fase4-cena2", "fase4-cena3", "fase4-cena4", "fase4-cena5",
  "fase4-cena6", "fase4-cena7", "fase4-cena8", "fase4-cena9", "fase4-cena10",
  "fase4-cena11b", "fase4-cena11", "fase4-cena12",
  "fase5-cena1", "fase5-cena2", "fase5-cena3", "fase5-cena4", "fase5-cena5",
  "fase5-cena6", "fase5-cena7", "fase5-cena8", "fase5-cena9", "fase5-cena10",
  "fase5-cena11", "fase5-cena12", "fase5-cena13", "fase5-cena14",
  "fase6-cena1", "fase6-cena2", "fase6-cena3", "fase6-cena4", "fase6-cena5",
  "fase6-cena6", "fase6-cena7", "fase6-cena8", "fase6-cena9",
];

export const storyChapters: Record<string, StoryChapter> = {
  "cena1": {
    id: "cena1",
    title: "O Livro e o Fardo",
    location: "Cidade da Destruição",
    characters: ["cristao", "esposa_cristao", "livro_antigo"],
    narrative: [
      "Na Cidade da Destruição, numa casa simples de paredes escuras, Cristão vivia com sua família como qualquer outro homem.",
      "Certa noite, enquanto todos dormiam, ele encontrou um livro antigo esquecido numa prateleira empoeirada.",
      "Ao abrir as páginas, as palavras pareciam pulsar — falavam de juízo, de uma cidade condenada. Da sua cidade.",
      "Suas mãos começaram a tremer. As letras brilhavam com uma luz que não vinha de nenhuma vela.",
      "Então aconteceu algo que ele jamais esqueceria: um peso invisível surgiu sobre seus ombros, como se cada palavra lida virasse pedra.",
      "Cristão tentou arrancar o fardo. Puxou, empurrou, contorceu-se. Mas o peso era real — e não saía.",
      "Sua esposa acordou assustada e o encontrou no chão, suando, abraçado ao livro. \"O que há com você?\"",
      "Ele tentou explicar, mas as palavras saíam quebradas. Ela sacudiu a cabeça e mandou-o voltar para a cama.",
      "Cristão obedeceu, mas não dormiu. A noite inteira uma única frase ecoou na sua mente: \"Fugi da ira vindoura.\""
    ]
  },

  "cena2": {
    id: "cena2",
    title: "Obstinado e Flexível",
    location: "Cidade da Destruição",
    characters: ["cristao", "obstinado", "flexivel"],
    narrative: [
      "Nos dias seguintes, Cristão tentou viver como antes. Ia ao mercado, cumprimentava os vizinhos, sentava-se à mesa com a família.",
      "Mas o fardo nas costas não diminuía. Cada manhã parecia mais pesado que a anterior.",
      "Foi então que seus vizinhos começaram a notar algo estranho. Cristão andava curvado, falava sozinho, e às vezes parava no meio da rua com os olhos perdidos.",
      "Obstinado foi o primeiro a confrontá-lo. Cruzou os braços na porta da casa de Cristão e disse sem rodeios: \"Você enlouqueceu. Largue esse livro e volte ao normal.\"",
      "Ele segurou Cristão pelo braço com força, como quem puxa alguém da beira de um precipício — mas para o lado errado.",
      "Flexível, porém, ficou em silêncio por um momento. Olhou para o livro debaixo do braço de Cristão. \"E se ele estiver certo? E se a cidade realmente for destruída?\"",
      "Os dois esperavam a resposta dele. Um puxava para a segurança do que já conhecia. O outro olhava para a estrada que levava ao desconhecido."
    ]
  },

  "cena3": {
    id: "cena3",
    title: "O Clamor",
    location: "Arredores da Cidade da Destruição",
    characters: ["cristao", "flexivel"],
    narrative: [
      "Cristão não olhou para trás. Com o livro apertado contra o peito, passou pelo portão da cidade e começou a correr.",
      "As casas foram ficando menores atrás dele. Os gritos dos vizinhos — \"Volta, louco!\" — se misturavam com o vento.",
      "Para não ouvir, tapou os próprios ouvidos e gritou enquanto corria: \"Vida! Vida eterna!\"",
      "Aos poucos, a estrada de pedra virou terra batida. As últimas casas da cidade desapareceram. O campo à frente era imenso.",
      "Cristão parou para recuperar o fôlego. O fardo pesava mais que nunca. A cidade ficava cada vez menor no horizonte, mas para onde ir? Não havia placas. Não havia caminho marcado. Só o campo aberto e o céu cinzento."
    ]
  },

  "cena4": {
    id: "cena4",
    title: "O Fardo Insuportável",
    location: "Cidade da Destruição — Casa de Cristão",
    characters: ["cristao"],
    narrative: [
      "Cristão voltou para casa. Trancou a porta. Guardou o livro debaixo da cama. Mas nada mudou.",
      "O fardo continuava ali, mais pesado a cada hora que passava.",
      "À noite, deitado ao lado da família adormecida, as paredes pareciam se fechar ao redor dele. A escuridão ganhava peso e forma.",
      "As palavras do livro queimavam na mente como ferro em brasa: \"A ira vindoura... a ira vindoura...\"",
      "Sua esposa murmurou algo no sono. As crianças ressonavam. Todos dormiam em paz — menos ele, que sabia o que ninguém queria ouvir.",
      "Ficar dói. Partir também. Mas só um dos caminhos tem esperança. E o tempo está acabando."
    ]
  },

  "cena5": {
    id: "cena5",
    title: "Evangelista",
    location: "Campos abertos",
    characters: ["cristao", "evangelista"],
    narrative: [
      "No meio do campo, um homem alto cruzou o caminho de Cristão.",
      "O nome dele é Evangelista. Seu rosto irradiava uma paz que Cristão nunca vira.",
      "Ele aponta para uma luz distante: \"Siga naquela direção. Lá está a Porta Estreita.\"",
      "Depois colocou um pergaminho na mão de Cristão. Uma única palavra brilha nele: FUJA.",
      "Antes de partir, ele avisa: \"Não olhe para trás.\""
    ]
  },

  "cena6": {
    id: "cena6",
    title: "Sozinho com o Fardo",
    location: "Arredores da Cidade",
    characters: ["cristao", "flexivel"],
    narrative: [
      "Sem direção, Cristão vagueou pelos campos.",
      "O fardo range a cada passo.",
      "A noite caiu, o vento esfriou, e Cristão finalmente desabou em lágrimas.",
      "No horizonte, uma luz fraca insiste em piscar."
    ]
  },

  "cena7": {
    id: "cena7",
    title: "A Porta Estreita e o Caminho Largo",
    location: "A Encruzilhada",
    characters: ["cristao"],
    narrative: [
      "Dois caminhos se abriram diante de Cristão.",
      "À esquerda: uma estrada larga, iluminada, fácil. Vozes alegres ecoam dela.",
      "À direita, uma trilha estreita sobe entre pedras e espinhos.",
      "Lá no alto, quase escondida, uma porta pequena brilha.",
      "O pergaminho de Evangelista pesa no bolso: \"A porta estreita.\""
    ]
  },

  "cena8": {
    id: "cena8",
    title: "O Conselho de Prudência Mundana",
    location: "Caminho Largo",
    characters: ["cristao", "prudencia_mundana"],
    narrative: [
      "No caminho largo, Cristão encontrou um homem chamado Prudência Mundana. Ele é bem-vestido e fala com autoridade.",
      "\"Esse fardo nas suas costas? Conheço um vilarejo chamado Moralidade. Lá, um homem chamado Legalidade pode removê-lo. Não precisa dessa jornada perigosa.\"",
      "A oferta era tentadora. Uma solução rápida, sem sofrimento, sem a trilha íngreme. Mas algo no olhar de Prudência Mundana incomodava Cristão."
    ]
  },

  "cena9": {
    id: "cena9",
    title: "A Porta Estreita",
    location: "Porta Estreita",
    characters: ["cristao", "boa_vontade"],
    narrative: [
      "A subida era árdua. Os espinhos rasgavam suas roupas e a inclinação faz o fardo pesar ainda mais. Várias vezes Cristão escorregou e caiu de joelhos.",
      "Mas no topo, a porta está ali. Pequena, quase insignificante, mas real. Uma inscrição brilha acima dela: \"Batei, e abrir-se-vos-á.\"",
      "Cristão bateu. Uma voz do outro lado perguntou: \"Quem é?\" Cristão respondeu com a única verdade que tinha: \"Um pecador carregado, fugindo da ira vindoura.\"",
      "A porta se abriu. Mãos fortes o puxaram para dentro. Do outro lado, o mundo parece diferente. O fardo ainda pesa — mas agora há um caminho."
    ]
  },

  "cena10": {
    id: "cena10",
    title: "A Montanha Sinai",
    location: "Monte Sinai",
    characters: ["cristao", "evangelista"],
    narrative: [
      "O vilarejo da Moralidade fica ao pé de uma montanha chamada Sinai. Ao se aproximar, o monte começa a tremer. Pedras despencam. Fogo parece arder no topo.",
      "O homem Legalidade não está em lugar nenhum. A montanha ruge como se fosse esmagar tudo ao redor. Cristão percebeu, com horror, que aquele caminho não podia remover o fardo — ele só acrescenta medo ao peso.",
      "Evangelista aparece novamente, com rosto severo: \"Por que você se desviou? O caminho de Prudência Mundana leva à morte. Volte à Porta Estreita.\""
    ]
  },

  "cena11": {
    id: "cena11",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao"],
    narrative: [
      "Logo após a porta, o caminho atravessa um terreno lodoso e traiçoeiro. O Pântano do Desânimo — assim o chamam aqueles que conseguiram sair dele.",
      "A cada passo, o lodo sugava seus pés. O fardo nas costas empurrava Cristão para baixo. Dúvidas sobem como bolhas da lama: \"Será que escolhi certo? Será que existe algo além disso?\"",
      "Bunyan escreveu que este pântano é feito dos medos, terrores e dúvidas que surgem quando uma alma desperta para sua condição. Não é lama comum — é desânimo materializado."
    ]
  },

  "cena12": {
    id: "cena12",
    title: "Os Degraus Ocultos",
    location: "Pântano do Desânimo",
    characters: ["cristao", "auxilio"],
    narrative: [
      "Com paciência, os pés de Cristão encontraram pedras firmes sob a lama. São os degraus que o Rei colocou ali — promessas de misericórdia e perdão para quem persevera.",
      "O progresso é lento. O fardo ainda pesa. Mas a cada degrau encontrado, o pântano parece menos profundo.",
      "Ao longe, a margem oposta se aproxima. Solo firme. Grama verde."
    ]
  },

  "cena13": {
    id: "cena13",
    title: "Afundando no Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao", "auxilio"],
    narrative: [
      "A lama subiu até a cintura de Cristão. O fardo nas suas costas te empurra para baixo como uma âncora. O pântano quer te engolir.",
      "Cada movimento o afundava mais. O pânico aperta sua garganta. A Cidade da Destruição, ao longe, quase parece convidativa comparada a isso.",
      "Mas então — uma mão se estende. Um homem chamado Auxílio aparece na margem."
    ]
  },

  "cena14": {
    id: "cena14",
    title: "A Mão de Auxílio",
    location: "Margem do Pântano",
    characters: ["cristao", "auxilio"],
    narrative: [
      "Auxílio puxou Cristão com força para fora da lama. No solo firme, Cristão caiu de joelhos, ofegante, coberto de lodo.",
      "\"Por que não usou os degraus?\", pergunta Auxílio gentilmente. \"O Rei os colocou ali por uma razão.\"",
      "Cristão olhou para trás. O pântano borbulhava, sombrio. Mas ele estava do outro lado. O fardo ainda estava nas costas de Cristão — porém mais leve agora, como se parte da lama tivesse ficado para trás."
    ]
  },

  "cena15": {
    id: "cena15",
    title: "A Cruz e o Sepulcro",
    location: "Colina da Cruz",
    characters: ["cristao", "tres_resplandecentes"],
    narrative: [
      "O caminho subiu uma colina. No topo, uma visão paralisou Cristão: uma cruz de madeira, erguida contra o céu. Ao seu pé, um sepulcro aberto.",
      "Ao olhar para a cruz, algo aconteceu. As cordas que prendiam o fardo às suas costas se soltam. O fardo desliza, cai, e rola colina abaixo até desaparecer dentro do sepulcro. A boca do túmulo se fecha.",
      "Pela primeira vez desde que abriu o livro, Cristão estava de pé sem peso. Lágrimas escorrem, mas não são de dor — são de alívio. Três Seres Resplandecentes aparecem — mensageiros enviados pelo Senhor. O primeiro anuncia: \"Deus perdoou os teus pecados.\" O segundo remove seus trapos e lhe veste roupas novas. O terceiro coloca um selo na sua testa e lhe entrega um pergaminho selado: sua garantia de entrada na Cidade Celestial.",
      "A jornada continua. Mas agora, sem o fardo."
    ]
  },

  "cena1b": {
    id: "cena1b",
    title: "A Angústia Secreta",
    location: "Cidade da Destruição — Ruas e Casa de Cristão",
    characters: ["cristao", "esposa_cristao", "vizinhos"],
    narrative: [
      "Cristão não aguentou ficar em casa. Saiu pela porta da frente e desceu a rua principal da cidade, ainda de madrugada.",
      "\"O que devo fazer para ser salvo?\" — gritou ele, sem se importar com quem ouvia.",
      "Os primeiros vizinhos que o viram pararam e olharam com espanto. Depois, um a um, foram fechando as janelas. Alguém riu. Uma criança apontou.",
      "Cristão bateu na porta de três casas. Ninguém abriu. O homem que chorava em público era, para todos, apenas um louco.",
      "Quando voltou para casa, encontrou sua esposa acordada na porta, com os olhos vermelhos. Ela segurou seus ombros com firmeza: \"Você está assustando as crianças. Precisa parar com isso.\"",
      "Cristão tentou explicar — o livro, as palavras de juízo, o fardo que não saía. Mas quanto mais falava, mais a esposa sacudia a cabeça.",
      "Por fim, ela mandou-o para a cama. Cristão obedeceu. Deitou-se no escuro, ouvindo a respiração calma da família adormecida.",
      "Mas ele sabia: o peso amanheceria com ele. E amanhã seria pior."
    ]
  },

  "cena5b": {
    id: "cena5b",
    title: "O Peso da Partida",
    location: "Estrada para a Porta Estreita",
    characters: ["cristao", "evangelista", "presuncao_preguica_simples"],
    narrative: [
      "Cristão olhou para trás uma última vez. A cidade ainda parecia casa.",
      "Mas cada passo à frente confirma: ficar não é mais opção.",
      "Na estrada, três homens dormem acorrentados: Presunção, Preguiça e Simples.",
      "\"Acordem! O perigo é real!\"",
      "\"Cada um cuide de si.\" \"Mais um cochilo...\" \"Não vejo perigo nenhum.\""
    ]
  },

  "cena7b": {
    id: "cena7b",
    title: "Boa-Vontade e as Flechas",
    location: "Porta Estreita",
    characters: ["cristao", "boa_vontade"],
    narrative: [
      "A subida castigava. Os espinhos rasgavam. O fardo puxava Cristão para trás.",
      "Quando a porta apareceu, Cristão correu e bateu com os punhos: \"Abram! Pelo amor de Deus, abram!\"",
      "Flechas cortam o ar ao redor da sua cabeça!",
      "Antes que outra acertasse Cristão, Boa-Vontade abriu a porta e o puxou para dentro com força.",
      "Uma flecha crava na porta onde sua cabeça estava.",
      "Ele fecha a porta e diz: \"Quem chega até aqui não é rejeitado.\""
    ]
  },

  "cena9b": {
    id: "cena9b",
    title: "A Instrução de Boa-Vontade",
    location: "Além da Porta Estreita",
    characters: ["cristao", "boa_vontade"],
    narrative: [
      "Do lado de dentro da porta, o mundo parece diferente. A luz é mais clara. O ar é mais limpo. Mas o fardo nas suas costas ainda está lá.",
      "Boa-Vontade caminha ao seu lado e aponta para um caminho estreito e reto: \"Vê aquela estrada? Ela foi aberta pelos patriarcas, pelos profetas, por Cristo e seus apóstolos. É reta como uma régua. Esse é o caminho que você deve seguir.\"",
      "\"Mas o fardo...\", você murmura. Boa-Vontade olha para suas costas com compaixão: \"Carregue-o por mais um pouco. Quando chegar ao lugar da libertação, ele cairá sozinho. Ninguém pode tirá-lo antes da hora.\"",
      "Ele aponta para o horizonte: \"Primeiro, a Casa do Intérprete. Bata à porta e peça para ver as coisas excelentes. Elas te prepararão para o que vem pela frente.\""
    ]
  },

  "cena11b": {
    id: "cena11b",
    title: "As Vozes na Lama",
    location: "Profundezas do Pântano",
    characters: ["cristao"],
    narrative: [
      "No fundo do pântano, vozes sussurram da lama.",
      "Não são vozes de fora. São seus próprios pensamentos, deformados pelo desânimo.",
      "\"Você abandonou sua família por nada...\"",
      "\"A Cidade Celestial não existe...\"",
      "\"Ninguém vai sentir sua falta no caminho...\"",
      "Cada sussurro pesa como mais uma pedra. A lama borbulha ao redor dos seus quadris.",
      "Mas entre os sussurros — outra voz. Quase inaudível.",
      "\"Os que semeiam com lágrimas, com júbilo ceifarão.\"",
      "Ela não vem da lama. Vem de cima."
    ]
  },

  "cena14b": {
    id: "cena14b",
    title: "A Razão do Pântano",
    location: "Margem do Pântano",
    characters: ["cristao", "auxilio"],
    narrative: [
      "No solo firme, coberto de lama da cabeça aos pés, Cristão se sentou ao lado de Auxílio. Ele não parece com pressa de ir embora.",
      "\"Você quer saber por que o pântano existe?\", ele pergunta, como se lesse seus pensamentos. \"É assim: quando um pecador desperta para sua condição, medos, dúvidas e terrores surgem na sua alma. Eles se acumulam e escorrem para este lugar.\"",
      "Ele aponta para a lama: \"Por isso o pântano nunca seca. O Rei mandou colocar degraus de pedra firme sob a lama — são Suas promessas de perdão. Mas no desespero, as pessoas não olham para baixo. Só olham para a lama.\"",
      "Cristão olhou para as próprias mãos sujas. Cada mancha de lama era uma dúvida que quase o engolira. Mas agora ele estava do outro lado.",
      "\"O caminho continua\", diz Auxílio, apontando para uma colina à frente. \"E o melhor está por vir. Naquela colina, seu fardo será tratado de um jeito que você não espera.\""
    ]
  },

  "cena15b": {
    id: "cena15b",
    title: "Os Três Seres Resplandecentes",
    location: "Colina da Cruz",
    characters: ["cristao", "tres_resplandecentes"],
    narrative: [
      "Cristão ainda estava de joelhos quando três figuras luminosas apareceram diante dele. A luz que emanava delas era tão intensa que ele cobriu os olhos com as mãos.",
      "O primeiro se adianta. Sua voz é como trovão gentil: \"Paz a você. O Senhor perdoou os teus pecados.\" As palavras atravessam o seu peito como fogo que não queima — purifica.",
      "O segundo se ajoelha ao seu lado e, com mãos que parecem feitas de luz, removeu os trapos sujos e imundos de Cristão — as velhas roupas da Cidade da Destruição. No lugar, vestiu-o com roupas novas, brancas e limpas. Pela primeira vez, Cristão não sentiu vergonha do que vestia.",
      "O terceiro coloca um selo na sua testa — uma marca invisível mas real — e estende um pergaminho selado com um selo dourado. \"Este é seu passaporte\", ele diz. \"Guarde-o com sua vida. Você precisará dele nos portões da Cidade Celestial. Não o perca.\"",
      "Os três desapareceram como vieram — em luz. Cristão ficou ali, de pé, com roupas novas, sem fardo, com um pergaminho selado no peito. O caminho à frente parecia possível agora."
    ]
  },

  "fase2-cena1": {
    id: "fase2-cena1",
    title: "A Casa do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "O caminho leva a uma casa grande e sóbria. Uma placa sobre a porta diz: \"Casa do Intérprete.\"",
      "A casa emana silêncio — o tipo de silêncio que precede revelações. Cristão hesitou antes de bater.",
      "A porta se abriu antes de Cristão bater. Um homem de olhar profundo e voz calma diz: \"Eu estava te esperando. Entre. Vou te mostrar coisas que serão úteis para o restante da sua jornada.\""
    ]
  },

  "fase2-cena2": {
    id: "fase2-cena2",
    title: "O Retrato na Parede",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "A primeira sala contém apenas um retrato. O homem pintado tem olhos erguidos ao céu, o melhor dos livros nas mãos, a lei da verdade escrita nos lábios e o mundo atrás de si. Ele está de pé, como se suplicasse aos homens.",
      "\"Grave este rosto\", diz o Intérprete. \"Este homem é o único guia autorizado para o caminho que você percorre.\" \"Muitos vão se oferecer para guiá-lo — Prudência Mundana, Legalidade, outros. Mas só este homem conhece a verdade.\"",
      "Cristão estudou o retrato. Os olhos do homem pintado parecem vivos, cheios de urgência e compaixão."
    ]
  },

  "fase2-cena3": {
    id: "fase2-cena3",
    title: "O Caminho Sem Instrução",
    location: "Caminho Estreito",
    characters: ["cristao", 'interprete'],
    narrative: [
      "Cristão seguiu adiante sem entrar na casa. O caminho parece igual, mas algo falta. Sem as lições do Intérprete, cada decisão futura será mais difícil.",
      "Na estrada, um sentimento de perda te acompanha. Os perigos à frente exigiriam sabedoria que ele não possuía.",
      "Ao longe, a porta da Casa do Intérprete ainda está aberta."
    ]
  },

  "fase2-cena4": {
    id: "fase2-cena4",
    title: "A Sala da Poeira",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "A segunda sala está coberta de poeira espessa — nunca foi varrida. O Intérprete chama um homem com uma vassoura. Ele varre furiosamente, mas a poeira sobe em nuvens sufocantes, enchendo o ar até que ninguém consegue respirar.",
      "Então uma jovem entra com um jarro de água e borrifa o chão. A poeira se assenta. O ar se limpa. O chão aparece limpo.",
      "\"A poeira é o pecado\", explica o Intérprete. \"A vassoura é a Lei, que revela o pecado mas não pode limpá-lo — apenas levanta mais poeira. A água é a Graça, que purifica o coração onde a Lei apenas condena.\""
    ]
  },

  "fase2-cena5": {
    id: "fase2-cena5",
    title: "A Resposta do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "\"A Lei não é inútil\", responde o Intérprete. \"Ela revela a doença. Mas não é o remédio. Quem tenta se curar pela Lei apenas sufoca na própria poeira.\"",
      "Cristão absorveu as palavras em silêncio. A sala da poeira ainda ecoava na memória — a vassoura que só piora, a água que limpa.",
      "Ele te olha fixamente: \"Lembre-se disso no caminho. Muitos tentarão te dizer que basta ser bom o suficiente, seguir regras o suficiente. Mas o fardo que caiu na cruz não caiu por suas obras — caiu pela Graça.\""
    ]
  },

  "fase2-cena6": {
    id: "fase2-cena6",
    title: "O Fogo que Não Apaga",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Na terceira sala, um fogo arde contra uma parede. Um homem se posta diante dele e derrama água sem parar, tentando apagá-lo. Mas o fogo não diminui — pelo contrário, cresce mais forte a cada balde.",
      "O Intérprete te leva para trás da parede. Ali, escondido, outro homem despeja óleo continuamente sobre o fogo, através de uma abertura que o primeiro homem não consegue ver.",
      "\"O fogo é a obra da Graça no coração\", explica o Intérprete. \"O diabo tenta apagá-lo com tentações. Mas Cristo, de modo secreto e contínuo, alimenta essa chama. É por isso que ela nunca se apaga.\""
    ]
  },

  "fase2-cena7": {
    id: "fase2-cena7",
    title: "O Palácio Belo",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "A visão seguinte mostra um palácio magnífico. Na porta, guardas armados impedem a entrada. Uma multidão observa de longe, com medo.",
      "Então um homem de rosto determinado se aproxima da mesa de registro, escreve seu nome, e avança de espada em punho contra os guardas. A batalha é feroz. Ele recebe golpes, sangra, mas não recua. Finalmente, atravessa a porta.",
      "De dentro do palácio, vozes cantam: \"Entra, entra! A glória eterna será tua.\"",
      "\"O Reino dos Céus padece violência\", murmura o Intérprete, \"e são os violentos que o tomam por força.\""
    ]
  },

  "fase2-cena8": {
    id: "fase2-cena8",
    title: "O Homem na Gaiola de Ferro",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "A última sala contém uma gaiola de ferro. Dentro, um homem em trapos, de cabeça baixa. Seus olhos estão vazios.",
      "\"Eu já fui um peregrino como você\", diz o homem da gaiola. \"Eu era cheio de fé. Mas me deixei levar pelos prazeres e pecados do mundo. Abandonei o caminho. E agora...\" Sua voz falha. \"Agora estou trancado no desespero. A Graça me foi oferecida, e eu a rejeitei tantas vezes que ela se retirou.\"",
      "O Intérprete se vira para você com seriedade mortal: \"Grave isso no seu coração. Para que nunca lhe aconteça o mesmo.\""
    ]
  },

  "fase2-cena9": {
    id: "fase2-cena9",
    title: "O Sonho do Julgamento",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Na última visão, o Intérprete mostra um homem que acordou tremendo de um sonho. No sonho, o céu se abriu, trovões soaram, e um Juiz no trono ordenou: \"Recolhei o trigo e queimem o joio.\"",
      "O homem viu a si mesmo entre o joio — e acordou gritando.",
      "\"O dia do juízo vem\", diz o Intérprete. \"Lembre-se disso quando o caminho parecer difícil demais, quando a tentação for doce demais. Há um final para esta história. Certifique-se de estar do lado certo.\""
    ]
  },

  "fase2-cena10": {
    id: "fase2-cena10",
    title: "A Despedida do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "Na porta, o Intérprete coloca as mãos nos seus ombros.",
      "\"O Consolador esteja sempre contigo, bom Cristão, para te guiar no caminho que leva à Cidade Celestial.\"",
      "Ele aperta sua mão. Seus olhos brilham — não de tristeza, mas de esperança firme."
    ]
  },

  "fase2-cena11": {
    id: "fase2-cena11",
    title: "Além da Casa",
    location: "O Caminho Adiante",
    characters: ["cristao"],
    narrative: [
      "A casa fica para trás, mas suas lições caminham com você. A poeira e a vassoura. O fogo que não apaga. O homem na gaiola. O palácio que exige luta.",
      "O ar é mais fresco aqui fora. A estrada serpenteia entre pedras e arbustos secos. Cada lição do Intérprete agora pesa como arma no cinto.",
      "O caminho sobe agora. Uma colina íngreme se ergue à frente — a Colina da Dificuldade."
    ]
  },

  "fase2-cena12": {
    id: "fase2-cena12",
    title: "A Colina da Dificuldade",
    location: "Colina da Dificuldade",
    characters: ["cristao", 'formalista', 'hipocrisia'],
    narrative: [
      "A Colina da Dificuldade se ergue como um muro de pedra. Bunyan a descreve como tão íngreme que só se pode subir de mãos e joelhos. No pé da colina, uma fonte de água fresca — para fortalecer o peregrino antes da escalada.",
      "Dois caminhos alternativos contornam a colina: um chamado Perigo, cheio de bosques escuros, e outro chamado Destruição, que leva a um campo de pedras traiçoeiras. Formalista e Hipocrisia, que pularam o muro, tomaram esses atalhos — e nunca mais foram vistos.",
      "Não há atalho para a colina. É subir — ou desistir."
    ]
  },

  "fase2-cena13": {
    id: "fase2-cena13",
    title: "O Caramanchão e o Pergaminho Perdido",
    location: "Colina da Dificuldade",
    characters: ["cristao"],
    narrative: [
      "Na metade da subida, um caramanchão de pedra oferece sombra e descanso. Bunyan nos diz que o Senhor o construiu para alívio dos peregrinos cansados.",
      "Você se senta. O cansaço é imenso. As pálpebras pesam. O vento é morno. O caramanchão é tão confortável...",
      "No livro original, Cristão adormeceu aqui — e o pergaminho selado caiu de suas mãos. Quando acordou e descobriu a perda, teve que descer toda a colina para buscá-lo, chorando e se recriminando."
    ]
  },

  "fase2-cena14": {
    id: "fase2-cena14",
    title: "Os Leões Acorrentados",
    location: "Portão do Palácio Belo",
    characters: ["cristao", "discricao", 'timidez_desconfianca', 'vigilante'],
    narrative: [
      "No topo da colina, o caminho estreita entre muros altos. E ali, bloqueando a passagem, dois leões enormes rugem com ferocidade.",
      "Dois homens correm na direção oposta — Timidez e Desconfiança. \"Volte!\", gritam. \"Os leões nos devorarão!\"",
      "Mas um porteiro chamado Vigilante grita do outro lado: \"Não tema! Os leões estão acorrentados! Mantenha-se no meio do caminho e eles não poderão tocá-lo!\"",
      "Bunyan usa os leões para ensinar que os perigos no caminho cristão são muitas vezes mais aparentes do que reais — desde que o peregrino permaneça no centro do caminho estreito."
    ]
  },

  "fase3-cena1": {
    id: "fase3-cena1",
    title: "A Descida ao Vale",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    narrative: [
      "O Vale da Humilhação é estreito e escuro. Paredes de rocha se erguem dos dois lados. O sol desaparece atrás das nuvens.",
      "O silêncio aqui é diferente. Não é paz — é espera. Como se o próprio vale prendesse a respiração.",
      "Seus passos ecoam entre as pedras. A armadura da fé que você recebeu parece fina demais. O pergaminho pesa no bolso como um lembrete: ele tinha algo pelo que lutar."
    ]
  },

  "fase3-cena2": {
    id: "fase3-cena2",
    title: "A Voz nas Sombras",
    location: "Vale da Humilhação",
    characters: ["cristao", 'apolion'],
    narrative: [
      "Uma voz troveja entre as rochas, fazendo o chão vibrar:",
      "\"Eu te conheço, Cristão. Você veio da minha cidade — a Cidade da Destruição. Toda aquela terra é minha. Você é meu servo.\"",
      "A voz é de Apolião. Ele ainda não se mostra, mas seu hálito quente faz o ar feder a enxofre. O som de escamas raspando pedra ecoa nas paredes do vale."
    ]
  },

  "fase3-cena3": {
    id: "fase3-cena3",
    title: "Apolião Revelado",
    location: "Vale da Humilhação",
    characters: ["cristao", "apolion"],
    narrative: [
      "Apolião emerge das sombras. Bunyan o descreve assim: coberto de escamas como um peixe, asas como de dragão, pés de urso, boca de leão, e de seu ventre saem fogo e fumaça.",
      "\"Servo ingrato!\", ruge a criatura, bloqueando o caminho inteiro. \"Quantas vezes você quase desistiu? No pântano, na encruzilhada, nas noites de dúvida? Você é fraco. Volte para mim e eu te pouparei.\"",
      "Ele oferece riquezas, conforto, o fim do sofrimento. Tudo que você precisa fazer é largar o pergaminho e voltar."
    ]
  },

  "fase3-cena4": {
    id: "fase3-cena4",
    title: "A Batalha",
    location: "Vale da Humilhação",
    characters: ["cristao", "apolion"],
    narrative: [
      "A batalha durou horas. Apolião lançou dardos flamejantes. Cristão os aparou com o escudo da fé, mas alguns passam e ferem suas mãos, sua cabeça, seu pé.",
      "Em um momento terrível, Apolião te derruba. A espada voou das mãos de Cristão. Ele se ergue sobre você, pronto para o golpe final.",
      "Mas a mão de Cristão encontrou a espada novamente. Com um grito que não vem de você — vem de algo maior — você desfere um golpe que faz Apolião recuar. Ele abre as asas de dragão e foge, deixando para trás apenas o fedor de enxofre.",
      "Cristão estava ferido, sangrando, exausto. Mas vivo. E vitorioso."
    ]
  },

  "fase3-cena5": {
    id: "fase3-cena5",
    title: "O Vale da Sombra da Morte",
    location: "Vale da Sombra da Morte",
    characters: ["cristao"],
    narrative: [
      "Além da batalha (ou da fuga), o vale se torna ainda mais escuro. Este é o Vale da Sombra da Morte — um lugar que Bunyan descreve como tendo um fosso sem fundo de um lado e um pântano de lama do outro.",
      "Demônios sussurram blasfêmias ao seu ouvido, tão perto que você pensa que são seus próprios pensamentos. O chão está coberto de armadilhas.",
      "A escuridão é tão densa que nem a espada é visível na sua mão."
    ]
  },

  "fase3-cena6": {
    id: "fase3-cena6",
    title: "A Aurora no Vale",
    location: "Vale da Sombra da Morte",
    characters: ["cristao"],
    narrative: [
      "Quando a situação parece impossível, o sol nasce. A luz invade o vale como uma lâmina, dispersando as sombras. Os demônios recuam. As armadilhas ficam visíveis.",
      "Bunyan escreveu: \"Então Cristão disse: 'Ele transformou a sombra da morte em manhã.'\"",
      "À luz do dia, você vê o caminho que percorreu no escuro — cheio de fossos, redes e armadilhas. É um milagre ter passado. Não foi habilidade sua. Foi providência."
    ]
  },

  "fase3-cena7": {
    id: "fase3-cena7",
    title: "Os Gigantes na Caverna",
    location: "Saída do Vale",
    characters: ["cristao"],
    narrative: [
      "Na saída do vale, duas cavernas se abrem. Dentro, os esqueletos de peregrinos que não conseguiram passar. Gigantes antigos — Papa e Pagão — vigiavam este lugar. Um já morreu, o outro está velho demais para atacar.",
      "O gigante sobrevivente range os dentes, mas só consegue gritar: \"Vocês nunca mudarão!\"",
      "Você passa por ele. Suas ameaças são vazias. Mas os esqueletos são um lembrete: nem todos que começaram a jornada chegaram ao fim."
    ]
  },

  "fase3-cena8": {
    id: "fase3-cena8",
    title: "Fiel, o Companheiro",
    location: "Além do Vale",
    characters: ["cristao", "fiel"],
    narrative: [
      "Do outro lado do vale, uma surpresa: outro peregrino. Seu nome é Fiel. Ele também veio da Cidade da Destruição, por um caminho diferente.",
      "\"Eu também carreguei o fardo\", diz Fiel. \"Eu também passei pela cruz. O meu caminho foi diferente do seu, mas chegamos ao mesmo ponto.\"",
      "Pela primeira vez na jornada, você tem um companheiro verdadeiro. Alguém que entende o peso, a luta, e a esperança. Juntos, os dois seguiram em direção à Feira da Vaidade."
    ]
  },

  "fase3-cena9": {
    id: "fase3-cena9",
    title: "O Peso do Medo",
    location: "Saída do Vale",
    characters: ["cristao"],
    narrative: [
      "Os esqueletos paralisaram Cristão. Cada um deles foi um peregrino como você. Eles tinham fé, coragem, pergaminhos — e mesmo assim morreram aqui.",
      "A pergunta martelava: se eles não conseguiram, como Cristão conseguiria?",
      "Mas então Cristão olhou para as próprias mãos. O pergaminho ainda está ali. O selo na sua testa ainda brilha. Você ainda está de pé."
    ]
  },

  "fase3-cena10": {
    id: "fase3-cena10",
    title: "Rumo à Feira",
    location: "Estrada para a Feira da Vaidade",
    characters: ["cristao", "fiel"],
    narrative: [
      "Com Fiel ao seu lado, a estrada parece menos solitária. Vocês conversam sobre o vale, sobre Apolião, sobre as lições do Intérprete.",
      "\"A Feira da Vaidade fica adiante\", diz Fiel com seriedade. \"Lá, tudo tem um preço. Tudo está à venda. Menos uma coisa: a Verdade.\"",
      "Ele te olha: \"Quando chegarmos lá, vão nos odiar. Porque não queremos comprar o que eles vendem.\""
    ]
  },

  "fase4-cena1": {
    id: "fase4-cena1",
    title: "A Feira da Vaidade",
    location: "Feira da Vaidade",
    characters: ["cristao", "fiel"],
    narrative: [
      "O barulho atinge você antes de ver a feira. Gritos de vendedores, música, gargalhadas. A Feira da Vaidade existe há séculos — fundada por Belzebu, Apolião e Legião quando descobriram que o caminho dos peregrinos passava por esta cidade.",
      "Aqui, tudo está à venda: casas, terras, honras, títulos, reinos, prazeres, esposas, maridos, corpos, almas. As barracas se estendem até onde a vista alcança.",
      "Ao entrarem, vocês causam comoção. Suas roupas são diferentes. Seu idioma — a língua de Canaã — soa estranho. E quando os vendedores gritam: \"O que desejam comprar?\", vocês respondem: \"Compramos apenas a Verdade.\""
    ]
  },

  "fase4-cena2": {
    id: "fase4-cena2",
    title: "O Escárnio",
    location: "Feira da Vaidade",
    characters: ["cristao", 'fiel'],
    narrative: [
      "Sua recusa em comprar provoca escárnio. Vendedores zombam. A multidão começa a cercá-los. Alguns cospem em vocês. Outros jogam lama.",
      "\"Loucos!\", gritam. \"Fanáticos! Quem vem à feira e não compra nada?\"",
      "Fiel permanece firme ao seu lado. Seu rosto sangra onde uma pedra o atingiu, mas ele não recua."
    ]
  },

  "fase4-cena3": {
    id: "fase4-cena3",
    title: "A Sedução da Feira",
    location: "Feira da Vaidade",
    characters: ["cristao", 'fiel'],
    narrative: [
      "As barracas oferecem tudo que seu coração poderia desejar. Comida abundante, roupas finas, poder, reconhecimento.",
      "Vendedores sorriem e dizem: \"Apenas prove. Sem compromisso.\" Os aromas intoxicam. As cores cegam. Cada passo para dentro da feira é um passo para longe do caminho.",
      "Fiel te puxa pelo braço: \"Cristão, lembre-se do homem na gaiola de ferro. Ele também começou apenas olhando.\""
    ]
  },

  "fase4-cena4": {
    id: "fase4-cena4",
    title: "O Julgamento",
    location: "Feira da Vaidade",
    characters: ["cristao", 'fiel'],
    narrative: [
      "A confusão cresce. Os donos da feira decidem prender vocês. São levados a um tribunal presidido pelo juiz Ódio-ao-Bem. O júri é formado por Cego, Sem-Bem, Malícia, Luxúria, Vive-no-Prazer, Imprudente e outros.",
      "As acusações: perturbação do comércio, desprezo pela cultura local, e influência perigosa sobre cidadãos honestos.",
      "Fiel é chamado primeiro. Ele fala com coragem: \"Tudo que se opõe à verdade se opõe ao Rei dos reis. Eu respondo apenas a Ele.\""
    ]
  },

  "fase4-cena5": {
    id: "fase4-cena5",
    title: "O Preço do Silêncio",
    location: "Feira da Vaidade",
    characters: ["cristao", 'fiel'],
    narrative: [
      "Seu silêncio não te protege. A multidão te identifica como companheiro de Fiel.",
      "A pressão aumenta. Olhares hostis de todos os lados. Empurrões. Cusparadas. O cerco se fecha.",
      "Fiel olha para você. Seus olhos não acusam — mas perguntam: \"Onde está sua coragem?\""
    ]
  },

  "fase4-cena6": {
    id: "fase4-cena6",
    title: "O Martírio de Fiel",
    location: "Feira da Vaidade",
    characters: ["cristao", 'fiel'],
    narrative: [
      "O tribunal condena Fiel. Ele é açoitado, apedrejado, esfaqueado e, por fim, queimado na estaca. Fiel não grita de dor. Seu rosto, mesmo no fogo, irradia paz.",
      "Bunyan escreveu que uma carruagem celestial desceu e levou Fiel através das nuvens, ao som de trombetas, direto para a Porta Celestial.",
      "Você está sozinho novamente. Mas o sacrifício de Fiel muda algo em você. Se ele suportou a morte sem recuar, o que é o desconforto diante disso?"
    ]
  },

  "fase4-cena7": {
    id: "fase4-cena7",
    title: "A Tentação de Desistir",
    location: "Feira da Vaidade",
    characters: ["cristao", 'fiel'],
    narrative: [
      "Sem Fiel, a solidão é esmagadora. Os vendedores da feira percebem sua fraqueza e se aproximam com ofertas mais tentadoras.",
      "\"Fique conosco. Aqui ninguém te persegue. Aqui, o fardo não existe. Aqui, não há vales escuros nem rios para atravessar.\"",
      "O homem na gaiola de ferro surge na sua memória. Ele também achou que podia ficar \"só um pouco\"."
    ]
  },

  "fase4-cena8": {
    id: "fase4-cena8",
    title: "Esperança, o Novo Companheiro",
    location: "Saída da Feira",
    characters: ["cristao", "esperanca", 'fiel'],
    narrative: [
      "Na saída da feira, alguém te alcança. Seu nome é Esperança. Ele viu tudo — o julgamento, o martírio de Fiel, sua coragem (ou falta dela).",
      "\"O sacrifício de Fiel me convenceu\", diz Esperança. \"Quero seguir o mesmo caminho. Posso ir com você?\"",
      "Bunyan nos diz que a morte de Fiel converteu mais pessoas na feira do que anos de pregação teriam feito. O sangue do mártir é semente."
    ]
  },

  "fase4-cena9": {
    id: "fase4-cena9",
    title: "Preso na Feira",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    narrative: [
      "Um dia se torna dois. Dois se tornam uma semana. As barracas se tornam familiares. O caminho se torna uma memória distante.",
      "O pergaminho no seu bolso parece mais leve — não porque o destino está mais perto, mas porque você quase esqueceu que ele existe.",
      "Uma noite, acordando em suor, as palavras do livro queimam novamente na sua mente: \"Fugi da ira vindoura.\""
    ]
  },

  "fase4-cena10": {
    id: "fase4-cena10",
    title: "O Legado de Fiel",
    location: "Estrada além da Feira",
    characters: ["cristao", 'esperanca'],
    narrative: [
      "A feira fica para trás. A estrada é silenciosa novamente. Mas o silêncio não é vazio — está cheio de tudo que aconteceu.",
      "Fiel morreu. Mas Esperança nasceu do seu sacrifício. E você carrega a memória de ambos como uma tocha.",
      "\"Para onde vamos agora?\", pergunta Esperança. Você aponta para frente: \"Para a Cidade Celestial. Não importa o que estiver no caminho.\""
    ]
  },

  "fase4-cena11b": {
    id: "fase4-cena11b",
    title: "Demas e a Mina de Prata",
    location: "Colina de Lucro",
    characters: ["cristao", "esperanca", "demas"],
    narrative: [
      "Na estrada, um homem acena de uma colina próxima. Seu nome é Demas. Ao seu lado, a entrada de uma mina brilha com veios de prata.",
      "\"Peregrinos! Venham ver! Há uma mina de prata aqui — basta cavar um pouco e ficarão ricos! Muitos peregrinos já se desviaram para cá. É seguro.\"",
      "Esperança te puxa: \"Ouvi dizer que essa mina é traiçoeira. O chão cede, e quem entra raramente sai.\"",
      "Bunyan nos diz que Demas era descendente de Geazi e de Judas — homens que venderam a eternidade por prata."
    ]
  },

  "fase4-cena11": {
    id: "fase4-cena11",
    title: "Interesses, o Companheiro Conveniente",
    location: "Estrada além da Feira",
    characters: ["cristao", "esperanca", "interesses"],
    narrative: [
      "Na estrada, um homem bem-vestido se junta a vocês. Seu nome é Interesses, da cidade de Bom-Discurso. Ele é primo do Sr. Volta-Suave e sobrinho do Sr. Duas-Línguas.",
      "\"Também sou peregrino!\", diz ele sorrindo. \"Mas confesso que prefiro seguir a religião quando ela caminha com chinelos de prata — sob o sol, com aplausos do povo.\"",
      "Esperança te cutuca: \"Pergunte a ele se seguiria a religião descalço, na chuva, sem plateia.\""
    ]
  },

  "fase4-cena12": {
    id: "fase4-cena12",
    title: "Pequena-Fé Assaltado",
    location: "Caminho Estreito",
    characters: ["cristao", "esperanca", "pequena_fe"],
    narrative: [
      "Na estrada, encontram um homem esfarrapado sentado numa pedra, chorando. Seu nome é Pequena-Fé, da cidade de Sinceridade.",
      "\"Três ladrões me atacaram\", soluça ele. \"Coração-Fraco, Desconfiança e Culpa. Roubaram todo o meu dinheiro. Quase levaram meu pergaminho — mas fugiram quando ouviram a voz de Grande-Graça ao longe.\"",
      "Esperança sussurra: \"Ele ainda tem o pergaminho. Ainda pode entrar na cidade. Mas caminha como um mendigo quando poderia caminhar como um príncipe.\""
    ]
  },

  "fase5-cena1": {
    id: "fase5-cena1",
    title: "O Desvio Fatal",
    location: "Prado Agradável",
    characters: ["cristao", "esperanca"],
    narrative: [
      "O caminho se torna pedregoso e doloroso para os pés. Ao lado da estrada, um prado verde e macio corre paralelo — o Prado Agradável. Uma cerca baixa é a única separação.",
      "\"Olhe\", diz Esperança. \"O prado segue na mesma direção. Podemos caminhar na grama e voltar ao caminho depois.\"",
      "Parece sensato. Os pés sangram. A grama é suave. A cerca é fácil de pular. Mas Bunyan nos avisa: desviar-se, mesmo um passo, do caminho estreito é o começo da ruína."
    ]
  },

  "fase5-cena2": {
    id: "fase5-cena2",
    title: "Perdidos no Prado",
    location: "Prado Agradável",
    characters: ["cristao", "esperanca", "gigante_desespero"],
    narrative: [
      "A noite cai. A chuva começa. Trovões rasgam o céu. O prado se transforma em lamaçal. Vocês tentam voltar ao caminho, mas a cerca desapareceu na escuridão.",
      "Perdidos e encharcados, vocês tropeçam até que o sono vence. Deitam-se no chão encharcado.",
      "Pela manhã, mãos brutais os sacodem. O Gigante Desespero está de pé sobre vocês. \"Vocês estão na minha terra. São meus prisioneiros.\""
    ]
  },

  "fase5-cena3": {
    id: "fase5-cena3",
    title: "A Masmorra",
    location: "Castelo da Dúvida",
    characters: ["cristao", "gigante_desespero", "desconfianca", 'esperanca'],
    narrative: [
      "O Gigante Desespero os arrasta para seu castelo e os joga numa masmorra escura, fétida e sem esperança. Não há luz. Não há comida. Apenas pedra úmida e correntes.",
      "A esposa do gigante, Desconfiança, sussurra ao marido: \"Bata neles pela manhã. Faça-os desejar nunca ter nascido.\"",
      "Na escuridão, Esperança murmura: \"Cristão... o que fizemos?\""
    ]
  },

  "fase5-cena4": {
    id: "fase5-cena4",
    title: "Os Golpes do Gigante",
    location: "Castelo da Dúvida",
    characters: ["cristao", "gigante_desespero"],
    narrative: [
      "Pela manhã, o Gigante Desespero desce à masmorra com um bastão. Ele bate em vocês sem misericórdia até que não consigam se mover.",
      "\"Por que não acabam com isso?\", rosna ele. \"Usem uma faca, uma corda, veneno. Qualquer coisa é melhor do que essa existência miserável.\"",
      "A proposta é horrível — mas na escuridão da masmorra, depois dos golpes, a tentação de desistir de tudo é real."
    ]
  },

  "fase5-cena5": {
    id: "fase5-cena5",
    title: "O Abismo do Desespero",
    location: "Castelo da Dúvida",
    characters: ["cristao", 'esperanca'],
    narrative: [
      "A escuridão da masmorra penetra sua alma. O gigante tem razão? Todo o sofrimento, toda a luta — para quê?",
      "Esperança te sacode: \"Cristão! Lembre-se da cruz! Lembre-se do fardo que caiu! Lembre-se de Fiel, que morreu sem recuar! Vamos desistir quando estamos tão perto?\"",
      "As palavras perfuram a névoa do desespero como agulhas de luz."
    ]
  },

  "fase5-cena6": {
    id: "fase5-cena6",
    title: "A Chave da Promessa",
    location: "Castelo da Dúvida",
    characters: ["cristao", 'esperanca'],
    narrative: [
      "Na terceira noite, enquanto oram, Cristão dá um salto: \"Que tolo eu sou! Tenho no meu peito uma chave chamada Promessa. Ela pode abrir qualquer fechadura do Castelo da Dúvida!\"",
      "Esperança se anima: \"Tire-a, irmão! Experimente!\"",
      "Com mãos trêmulas, você tira a chave — as promessas de Deus, guardadas durante toda a jornada. Cada lição, cada versículo, cada momento de fé solidificou essa chave.",
      "Ela gira na fechadura. A porta se abre."
    ]
  },

  "fase5-cena7": {
    id: "fase5-cena7",
    title: "Os Portões do Castelo",
    location: "Castelo da Dúvida",
    characters: ["cristao", 'esperanca', 'gigante_desespero'],
    narrative: [
      "A masmorra se fecha ao redor de vocês. As paredes parecem encolher. O Gigante Desespero ruge nos corredores superiores.",
      "Esperança repete baixinho: \"A chave. Use a chave. Toda promessa de Deus é sim e amém.\"",
      "O som de passos pesados se aproxima. O gigante está descendo."
    ]
  },

  "fase5-cena8": {
    id: "fase5-cena8",
    title: "A Fuga do Castelo",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "A chave abre cada porta — a da masmorra, a do corredor, a do pátio, a do portão exterior. Cada fechadura cede com um clique que ecoa como um trovão de libertação.",
      "O Gigante Desespero corre atrás de vocês, mas ao cruzar o portão, ele tem um ataque e cai. Suas pernas cedem. Ele é forte dentro de suas muralhas, mas impotente fora delas.",
      "Vocês correm até estarem longe. Sob a luz do sol, olham para trás. O castelo parece menor. As muralhas, que pareciam infinitas, são apenas pedra velha."
    ]
  },

  "fase5-cena9": {
    id: "fase5-cena9",
    title: "As Montanhas Deleitosas",
    location: "Montanhas Deleitosas",
    characters: ["cristao", "esperanca", "pastores"],
    narrative: [
      "Além do castelo, montanhas verdes se erguem — as Montanhas Deleitosas, propriedade do Rei Emanuel. Pastores chamados Conhecimento, Experiência, Vigilante e Sincero os recebem.",
      "Dali, com uma luneta, eles mostram ao longe os portões da Cidade Celestial, brilhando como ouro no horizonte.",
      "\"Vocês estão perto\", dizem os pastores. \"Mas cuidado com o Adulador e o Caminho Torto. Não se desviem outra vez.\""
    ]
  },

  "fase5-cena10": {
    id: "fase5-cena10",
    title: "A Lição do Castelo",
    location: "Além das Montanhas",
    characters: ["cristao", 'esperanca'],
    narrative: [
      "O castelo ensinou uma verdade que o Intérprete não pôde mostrar — porque só se aprende na dor: a promessa de Deus é uma chave que abre qualquer prisão, mas você precisa se lembrar de usá-la.",
      "Fiel morreu, mas seu legado vive em Esperança. O prado era bonito, mas levava à masmorra. O gigante era grande, mas a chave era maior.",
      "A Cidade Celestial espera. Há apenas um obstáculo final: o Rio."
    ]
  },

  "fase5-cena11": {
    id: "fase5-cena11",
    title: "A Rede do Lisonjeiro",
    location: "Caminho Estreito",
    characters: ["cristao", "esperanca", "lisonjeiro"],
    narrative: [
      "Além das montanhas, o caminho se divide. Vocês hesitam. Um homem de pele escura, vestido com uma túnica branca brilhante, se aproxima sorrindo.",
      "\"Amigos peregrinos! Vocês parecem perdidos. Eu conheço o caminho para a Cidade Celestial. Sigam-me.\"",
      "Sua voz é doce, seu sorriso convincente. Ele os leva por um caminho lateral que parece seguro — até que uma rede cai sobre vocês, prendendo-os completamente."
    ]
  },

  "fase5-cena12": {
    id: "fase5-cena12",
    title: "O Resgate e o Ateísmo",
    location: "Caminho Estreito",
    characters: ["cristao", "esperanca", "ateismo"],
    narrative: [
      "Um Ser Resplandecente aparece com um chicote de cordas. Ele corta a rede e os liberta — mas não sem repreensão: \"Os pastores não os avisaram? O Lisonjeiro engana com palavras doces e aparência de luz.\"",
      "Envergonhados mas livres, vocês retomam o caminho certo. Mas logo encontram outro obstáculo: um homem que ri alto, caminhando na direção oposta.",
      "\"Vocês ainda buscam a Cidade Celestial?\", ele gargalha. \"Eu a busquei por vinte anos e nunca a encontrei! Ela não existe! Voltem para casa antes que desperdicem mais da vida de vocês.\""
    ]
  },

  "fase5-cena13": {
    id: "fase5-cena13",
    title: "A Terra Encantada",
    location: "Terra Encantada",
    characters: ["cristao", "esperanca"],
    narrative: [
      "O caminho entra numa região estranha. O ar é pesado, perfumado, intoxicante. Cada passo exige mais esforço. As pálpebras pesam como chumbo.",
      "A Terra Encantada — Bunyan a descreve como um lugar onde o próprio ar faz os peregrinos adormecerem para sempre. Quem dorme aqui, nunca mais acorda.",
      "Esperança começa a cambalear: \"Cristão... estou tão cansado... apenas um momento de descanso...\""
    ]
  },

  "fase5-cena14": {
    id: "fase5-cena14",
    title: "O País de Beulá",
    location: "País de Beulá",
    characters: ["cristao", "esperanca"],
    narrative: [
      "Além da Terra Encantada, tudo muda. O ar se torna doce — não intoxicante, mas revigorante. Flores de todas as cores cobrem os campos. Árvores carregadas de frutos dourados bordam o caminho.",
      "Este é o País de Beulá — a terra onde o sol nunca se põe, onde os pássaros cantam sem cessar, e onde o perfume das flores vem do próprio jardim do Rei.",
      "Bunyan escreveu que aqui os peregrinos ouviam continuamente vozes cantando: 'Dize à filha de Sião: Eis que vem o teu Salvador.' A Cidade Celestial brilha no horizonte, tão perto que seus portões são visíveis a olho nu."
    ]
  },

  "fase6-cena1": {
    id: "fase6-cena1",
    title: "O Rio sem Ponte",
    location: "Margem do Rio",
    characters: ["cristao", "esperanca"],
    narrative: [
      "A Cidade Celestial brilha do outro lado de um rio largo e profundo. Não há ponte. Não há barco. Bunyan nos diz que cada peregrino deve atravessá-lo a pé — e a profundidade varia conforme a fé de cada um.",
      "Esperança olha para a água escura: \"Temos que passar por isso?\"",
      "Você olha para a cidade. As torres brilham. Os portões parecem abertos. Anjos se movem nas muralhas. Tudo pelo que você lutou está ali — separado apenas por esta última travessia."
    ]
  },

  "fase6-cena2": {
    id: "fase6-cena2",
    title: "A Travessia",
    location: "No Rio",
    characters: ["cristao", "esperanca"],
    narrative: [
      "A água sobe rápido. Até a cintura, até o peito. A correnteza puxa. A cidade brilha à frente, mas a água escura enche seus olhos.",
      "No livro de Bunyan, Cristão começa a afundar. O terror dos pecados passados volta com força — cada erro, cada desvio, cada momento de dúvida. As águas representam a morte, e na morte, todas as fraquezas retornam.",
      "Esperança, ao seu lado, grita: \"Sinto o fundo! É firme! Ânimo, irmão!\""
    ]
  },

  "fase6-cena3": {
    id: "fase6-cena3",
    title: "Recordações à Beira do Rio",
    location: "Margem do Rio",
    characters: ["cristao", "esperanca"],
    narrative: [
      "Antes de entrar nas águas, Esperança e você sentam-se na margem. O País de Beulá perfuma o ar atrás de vocês. O rio corre à frente, escuro e profundo.",
      "\"Lembra-se de Fiel?\", pergunta Esperança. \"Ele não precisou atravessar o rio. A carruagem celestial o levou direto. Mas nós... nós temos que passar por aqui.\"",
      "Vocês relembram toda a jornada: o fardo, o pântano, o vale, a feira, o castelo. Cada memória é uma pedra no alicerce da fé que os sustentará nas águas."
    ]
  },

  "fase6-cena4": {
    id: "fase6-cena4",
    title: "Afundando nas Águas",
    location: "No Rio",
    characters: ["cristao", 'esperanca'],
    narrative: [
      "Bunyan descreve este momento com dor: Cristão afunda nas águas escuras. As ondas cobrem sua cabeça. Todos os pecados, medos e dúvidas da jornada convergem.",
      "\"Eu nunca verei a terra dos vivos\", ele geme. \"Nem a cidade que tanto busquei.\"",
      "Mas Esperança não larga sua mão: \"Irmão! Vejo a porta! Há homens esperando por nós do outro lado! Mantenha a cabeça acima da água!\""
    ]
  },

  "fase6-cena5": {
    id: "fase6-cena5",
    title: "O Outro Lado",
    location: "Margem Celestial",
    characters: ["cristao", 'tres_resplandecentes'],
    narrative: [
      "Seus pés tocam solo firme. A água fica para trás. Do outro lado do rio, tudo muda.",
      "Bunyan descreve: os corpos mortais ficaram no rio. As roupas de peregrino se transformam em vestes resplandecentes. Os rostos brilham como o sol.",
      "Dois Seres Resplandecentes os recebem: \"O restante do caminho é plano. A cidade está ali.\""
    ]
  },

  "fase6-cena6": {
    id: "fase6-cena6",
    title: "A Jornada Interrompida",
    location: "No Rio",
    characters: ["cristao"],
    narrative: [
      "As águas te cobrem. A Cidade Celestial brilha ao longe, mas cada segundo ela fica mais distante.",
      "No livro de Bunyan, Cristão quase afunda — mas é salvo. Na sua versão da história, suas escolhas te trouxeram aqui, e a fé que você construiu não foi suficiente para esta última travessia.",
      "Mas lembre-se: este não é necessariamente o fim. A jornada do peregrino é feita de tentativas, de quedas e de recomeços. A porta continua aberta."
    ]
  },

  "fase6-cena7": {
    id: "fase6-cena7",
    title: "Os Portões da Cidade Celestial",
    location: "Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "A subida até os portões é a parte mais bela de toda a jornada. O caminho é pavimentado de ouro. Anjos os acompanham. O ar cheira a flores que não existem na terra.",
      "Nos portões, gravada em letras de fogo, a inscrição: \"Bem-aventurados os que entram pelos portões da Cidade.\"",
      "Você apresenta o pergaminho — o selo que recebeu na cruz. Os portões se abrem. De dentro, uma multidão incontável canta em boas-vindas."
    ]
  },

  "fase6-cena8": {
    id: "fase6-cena8",
    title: "O Fim da Peregrinação",
    location: "Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "Bunyan encerra assim a jornada de Cristão: ele entrou pela porta, e foi transfigurado. Vestes de glória lhe foram dadas. Sinos soaram. Vozes cantaram: \"Bendito o que vem em nome do Senhor.\"",
      "Suas decisões te trouxeram aqui. Cada prova — o fardo, o pântano, a encruzilhada, Apolião, a feira, o castelo, o rio — foi um degrau. Nenhum foi desperdiçado.",
      "A peregrinação terminou. Mas a história continua — porque há sempre mais peregrinos na estrada, e a Cidade da Destruição ainda está de pé."
    ]
  },

  "fase6-cena9": {
    id: "fase6-cena9",
    title: "A Rejeição de Ignorância",
    location: "Portões da Cidade Celestial",
    characters: ["cristao", "ignorancia", 'tres_resplandecentes'],
    narrative: [
      "Antes que os portões se fechem, Bunyan mostra uma última cena — a mais solene de todo o livro.",
      "Ignorância chega aos portões. Ele também fez a jornada — mas nunca passou pela Porta Estreita. Nunca carregou o fardo à cruz. Nunca recebeu o pergaminho selado.",
      "\"Boas obras são meu passaporte\", diz ele confiante. Mas quando buscam seu nome no livro, ele não está lá. Os portões não se abrem. Dois Seres Resplandecentes o tomam pelos braços e o levam embora — não para a Cidade, mas para uma porta lateral no monte que leva ao abismo.",
      "Bunyan termina com uma frase que ecoa pelos séculos: \"Então vi que havia um caminho para o inferno, mesmo dos portões do Céu.\"",
      "A jornada terminou. A graça triunfou — não por suas forças, mas pela fidelidade de Quem prometeu."
    ]
  }
};

export const getChapter = (id: string): StoryChapter | undefined => storyChapters[id];
export const FIRST_CHAPTER_ID = "cena1";
