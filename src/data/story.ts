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
  choices: StoryChoice[];
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
  { id: "tres_resplandecentes", name: "Três Seres Resplandecentes", description: "Três anjos que encontram Cristão ao pé da Cruz. O primeiro declara seus pecados perdoados, o segundo lhe dá vestes novas, e o terceiro lhe entrega um pergaminho selado como passaporte para a Cidade Celestial.", role: "Mensageiros divinos", unlockedAtChapter: "cena15" },
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

  // ═══════════════════════════════════════════
  // FASE 1: DA CIDADE DA DESTRUIÇÃO AO CAMINHO
  // Baseado nos capítulos iniciais de Bunyan
  // ═══════════════════════════════════════════

  "cena1": {
    id: "cena1",
    title: "O Livro e o Fardo",
    location: "Cidade da Destruição",
    characters: ["cristao", "esposa_cristao", "livro_antigo"],
    sceneEvent: { type: 'tension', intensity: 1, duration: 3000, message: 'Um peso esmagador cai sobre seus ombros...' },
    narrative: [
      "Você está em casa, na Cidade da Destruição, quando abre um livro antigo.",
      "{{tremor}}As palavras falam de juízo. De uma cidade condenada. {{emphasis}}Da sua cidade.{{/emphasis}}{{/tremor}}",
      "Suas mãos tremem. As páginas parecem brilhar com uma luz própria.",
      "{{tremor}}Um peso surge nas suas costas, como se cada frase virasse pedra.{{/tremor}}",
      "Você tenta arrancá-lo. Não consegue. {{heart}}O fardo é real.{{/heart}}",
      "{{fade}}À noite, uma frase não sai da sua cabeça:{{/fade}} {{divine}}\"Fugi da ira vindoura.\"{{/divine}}"
    ],
    replayNarrative: [
      "O livro está aqui de novo. O fardo, também. Mas desta vez você sabe — sabe que há uma porta, um caminho, e que cada escolha adiante moldará quem você se tornará."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Mesmo no terror, uma certeza cresce em você: essas palavras são verdadeiras. E se são verdadeiras, deve haver um caminho.", lowThreshold: 3, lowText: "Será loucura? Talvez o livro esteja errado. Talvez o peso seja só imaginação. Mas ele continua ali, esmagando." }
    ],
    choices: [
      {
        text: "Guardar o livro e fingir que nada aconteceu",
        nextChapterId: "cena2",
        effects: { fe: -1, discernimento: -1 },
        flag: "ignorou_inquietacao",
        consequence: "Você fecha o livro, mas ele continua queimando no peito. Bunyan nos ensina: ignorar a verdade não a apaga — apenas adia o confronto com ela. Quantos vivem carregando fardos que se recusam a nomear?"
      },
      {
        text: "Sair de casa clamando: \"O que devo fazer para ser salvo?\"",
        nextChapterId: "cena1b",
        effects: { discernimento: 1, fe: 1 },
        consequence: "O grito de Cristão é o mesmo do carcereiro de Filipos (Atos 16:30). É a pergunta mais honesta que um ser humano pode fazer. Reconhecer a necessidade de salvação é o primeiro passo da jornada."
      }
    ]
  },

  "cena2": {
    id: "cena2",
    title: "Obstinado e Flexível",
    location: "Cidade da Destruição",
    characters: ["cristao", "obstinado", "flexivel"],
    reflection: "r2",
    narrative: [
      "Você tenta agir como se nada tivesse acontecido, mas o fardo continua ali.",
      "{{villain}}Obstinado percebe primeiro. \"Você enlouqueceu. Volte ao normal.\"{{/villain}}",
      "{{tremor}}Ele te segura pelo braço com força.{{/tremor}}",
      "Flexível não ri. {{dialog}}\"E se ele estiver certo? E se a cidade realmente for destruída?\"{{/dialog}}",
      "Os dois esperam sua resposta. {{heart}}Um te puxa para trás. O outro olha para a estrada.{{/heart}}"
    ],
    choices: [
      {
        text: "Concordar com Obstinado e voltar para casa",
        nextChapterId: "cena4",
        effects: { fe: -1, coragem: -1 },
        consequence: "Obstinado representa quem ouve o chamado de Deus mas escolhe a falsa segurança do que já conhece. Voltar para a 'normalidade' quando a verdade já foi revelada é escolher o conforto acima da salvação."
      },
      {
        text: "Dizer a Flexível: \"Venha comigo. Há uma porta que devemos encontrar.\"",
        nextChapterId: "cena3",
        effects: { discernimento: 1, coragem: 1 },
        flag: "convidou_flexivel",
        consequence: "Flexível é a fé que depende das circunstâncias — aceita o caminho enquanto é fácil. Cristão faz o certo ao convidá-lo, mesmo sabendo que nem todos que começam a jornada a completam. Jesus disse: 'Muitos são chamados, mas poucos, escolhidos.' (Mateus 22:14)"
      }
    ]
  },

  "cena3": {
    id: "cena3",
    title: "O Clamor",
    location: "Cidade da Destruição",
    sceneEvent: { type: 'tension', intensity: 1, duration: 2000 },
    characters: ["cristao", "flexivel"],
    reflection: "r3",
    narrative: [
      "{{tremor}}Você corre para fora da cidade com o livro apertado no peito.{{/tremor}}",
      "Para não ouvir os gritos atrás de você, tapa os próprios ouvidos.",
      "{{shout}}\"Vida! Vida eterna!\"{{/shout}}",
      "{{fade}}A cidade fica menor. O campo à frente parece imenso.{{/fade}} {{whisper}}E sem direção.{{/whisper}}"
    ],
    flagNarrative: [
      { flag: "convidou_flexivel", text: "Flexível corre ao seu lado, ofegante: \"Onde vamos? Mostre-me esse lugar de que você fala!\" Sua companhia é reconfortante, mas será que ele aguentará o caminho?" }
    ],
    choices: [
      {
        text: "Procurar alguém que conheça o caminho",
        nextChapterId: "cena5",
        effects: { fe: 1, discernimento: 1 },
        consequence: "Buscar orientação é sabedoria. Provérbios 12:15 diz: 'O caminho do tolo parece-lhe reto, mas o sábio dá ouvidos ao conselho.' Evangelista é a figura do pregador fiel que aponta para Cristo — não para si mesmo."
      },
      {
        text: "Tentar encontrar a porta por conta própria",
        nextChapterId: "cena6",
        effects: { perseveranca: 1, coragem: 1 },
        consequence: "A coragem de tentar sozinho é admirável, mas perigosa. Sem orientação, o caminho se perde facilmente. Bunyan mostra que o orgulho espiritual — achar que não precisa de guia — é um dos primeiros tropeços do peregrino."
      }
    ]
  },

  "cena4": {
    id: "cena4",
    title: "O Fardo Insuportável",
    location: "Cidade da Destruição",
    characters: ["cristao"],
    interactionType: 'timed',
    timeLimit: 12,
    timeoutChoiceIndex: 1,
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000 },
    narrative: [
      "{{tremor}}Você volta para casa, mas o peso só aumenta.{{/tremor}}",
      "{{tremor}}À noite, as paredes parecem se fechar em volta de você.{{/tremor}}",
      "As palavras do livro queimam na mente: {{heart}}\"A ira vindoura...\"{{/heart}}",
      "{{fade}}Sua família percebe que algo se rompeu dentro de você.{{/fade}}",
      "{{emphasis}}Ficar dói. Partir também. Mas só um dos caminhos tem esperança.{{/emphasis}}"
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 6, highText: "No fundo da agonia, uma voz mansa sussurra: \"Há uma saída. Busque-a.\"", lowThreshold: 3, lowText: "O desespero é tão espesso que você mal consegue respirar. Será que existe saída, ou o fardo é para sempre?" }
    ],
    choices: [
      {
        text: "Fugir da cidade esta noite, mesmo sozinho",
        nextChapterId: "cena5",
        effects: { fe: 1, coragem: 1 },
        consequence: "Bunyan escreveu que Cristão tapou os ouvidos e correu gritando 'Vida! Vida eterna!' Quando Deus abre nossos olhos para o perigo, a urgência de fugir do pecado é mais forte que qualquer laço terreno. Lucas 14:26 fala do custo de seguir a Cristo."
      },
      {
        text: "Aguentar mais um dia, talvez o peso passe",
        nextChapterId: "cena6",
        effects: { coragem: -1, perseveranca: -1 },
        consequence: "A procrastinação espiritual é uma das maiores armadilhas. Cada dia que Cristão adiou a partida, o fardo ficou mais pesado. 'Eis aqui agora o dia da salvação' (2 Coríntios 6:2). O amanhã nunca é garantido."
      }
    ]
  },

  "cena5": {
    id: "cena5",
    title: "Evangelista",
    location: "Campos abertos",
    characters: ["cristao", "evangelista"],
    narrative: [
      "No meio do campo, um homem alto cruza seu caminho.",
      "O nome dele é {{emphasis}}Evangelista{{/emphasis}}. {{divine}}Seu rosto irradia uma paz que você nunca viu.{{/divine}}",
      "Ele aponta para uma luz distante: {{dialog}}\"Siga naquela direção. Lá está a Porta Estreita.\"{{/dialog}}",
      "Depois coloca um pergaminho na sua mão. Uma única palavra brilha nele: {{divine}}FUJA{{/divine}}.",
      "{{whisper}}Antes de partir, ele avisa: \"Não olhe para trás.\"{{/whisper}}"
    ],
    flagNarrative: [
      { flag: "convidou_flexivel", text: "Flexível olha para Evangelista com desconfiança: \"Esse caminho parece perigoso. Tem certeza?\" Evangelista o ignora e fala diretamente com você." }
    ],
    choices: [
      {
        text: "Seguir a luz que Evangelista apontou",
        nextChapterId: "cena5b",
        effects: { discernimento: 1, fe: 1 },
        flag: "seguiu_evangelista",
        consequence: "Evangelista aponta para a Porta Estreita — que é Cristo (João 10:9: 'Eu sou a porta; se alguém entrar por mim, salvar-se-á'). A luz é fraca não porque seja falsa, mas porque a fé começa pequena. Como um grão de mostarda que se torna árvore."
      },
      {
        text: "Hesitar — a luz é fraca demais, o caminho incerto",
        nextChapterId: "cena6",
        effects: { fe: -1 },
        consequence: "A hesitação de Cristão representa a dúvida que todo crente enfrenta: 'E se eu estiver errado?' Mas Hebreus 11:1 ensina que 'a fé é a certeza de coisas que se esperam, a convicção de coisas que não se veem.' A luz fraca é o começo — não o fim."
      }
    ]
  },

  "cena6": {
    id: "cena6",
    title: "Sozinho com o Fardo",
    location: "Arredores da Cidade",
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'A solidão pesa...' },
    characters: ["cristao", "flexivel"],
    narrative: [
      "Sem direção, você vagueia pelos campos.",
      "O fardo range a cada passo.",
      "A noite cai, o vento esfria, e você finalmente desaba em lágrimas.",
      "{{fade}}No horizonte, uma luz fraca insiste em piscar.{{/fade}}"
    ],
    flagNarrative: [
      { flag: "convidou_flexivel", text: "Flexível te olha e diz: \"Isso é loucura. Volto para a cidade.\" Ele se vai. Agora você está completamente sozinho." }
    ],
    choices: [
      {
        text: "Caminhar em direção à luz, mesmo sem certeza",
        nextChapterId: "cena7",
        effects: { fe: 1, coragem: 1 },
        consequence: "Andar em direção a uma luz fraca, sem mapa, sem companhia — isso é fé. Não é certeza absoluta. É confiança suficiente para dar o próximo passo. 'Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.' (Salmo 119:105)"
      },
      {
        text: "Ficar parado, esperando que algo aconteça",
        nextChapterId: "cena8",
        effects: { perseveranca: -1 },
        consequence: "A inércia espiritual é perigosa. Quem espera a fé perfeita para agir nunca age. Tiago 2:17 diz: 'A fé, se não tiver obras, é morta.' A jornada exige movimento — mesmo imperfeito."
      }
    ]
  },

  "cena7": {
    id: "cena7",
    title: "A Porta Estreita e o Caminho Largo",
    location: "A Encruzilhada",
    characters: ["cristao"],
    reflection: "r4",
    interactionType: 'drag',
    narrative: [
      "Dois caminhos se abrem diante de você.",
      "À esquerda: uma estrada larga, iluminada, fácil. {{whisper}}Vozes alegres ecoam dela.{{/whisper}}",
      "À direita, uma trilha estreita sobe entre pedras e espinhos.",
      "Lá no alto, quase escondida, {{divine}}uma porta pequena brilha{{/divine}}.",
      "O pergaminho de Evangelista pesa no bolso: {{emphasis}}\"A porta estreita.\"{{/emphasis}}"
    ],
    replayNarrative: [
      "Você conhece essa encruzilhada. Da última vez, escolheu um caminho. Agora sabe aonde cada um leva. A pergunta é: terá coragem de escolher diferente?"
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 6, highText: "Seus olhos percebem o que outros não veem: o caminho largo, embora bonito, desce imperceptivelmente. Quem entra nele não percebe que está descendo até ser tarde demais.", lowThreshold: 3, lowText: "Os dois caminhos parecem igualmente válidos. Você não consegue discernir a diferença entre eles." },
      { attr: "coragem", highThreshold: 6, highText: "Algo dentro de você se inclina para o desafio. A dificuldade não te assusta — ela te chama.", lowThreshold: 3, lowText: "O medo puxa você para o caminho mais seguro. Os espinhos do caminho estreito parecem afiados demais." }
    ],
    choices: [
      {
        text: "Tomar o caminho largo — é mais seguro",
        nextChapterId: "cena8",
        effects: { discernimento: -1, fe: -1 },
        flag: "escolheu_caminho_facil",
        consequence: "Jesus disse em Mateus 7:13-14: 'Larga é a porta, e espaçoso o caminho que conduz à perdição, e muitos são os que entram por ela. Estreita é a porta, e apertado o caminho que leva à vida, e poucos há que a encontrem.' O caminho fácil seduz, mas seu destino é a destruição."
      },
      {
        text: "Subir a colina até a Porta Estreita",
        nextChapterId: "cena7b",
        effects: { fe: 2, coragem: 1 },
        flag: "escolheu_caminho_estreito",
        item: "pergaminho_verdade",
        consequence: "Escolher o caminho difícil quando o fácil está disponível — isso é discernimento verdadeiro. Os espinhos representam as tribulações que acompanham quem segue a Cristo (João 16:33). Mas no topo, a porta está aberta para quem persevera."
      }
    ]
  },

  "cena8": {
    id: "cena8",
    title: "O Conselho de Prudência Mundana",
    location: "Caminho Largo",
    characters: ["cristao", "prudencia_mundana"],
    narrative: [
      "No caminho largo, você encontra um homem chamado Prudência Mundana. Ele é bem-vestido e fala com autoridade.",
      "\"Esse fardo nas suas costas? Conheço um vilarejo chamado Moralidade. Lá, um homem chamado Legalidade pode removê-lo. Não precisa dessa jornada perigosa.\"",
      "A oferta é tentadora. Uma solução rápida, sem sofrimento, sem a trilha íngreme. Mas algo no olhar dele te incomoda."
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 6, highText: "Você percebe: Prudência Mundana não mencionou a Porta Estreita. Ele quer te desviar.", lowThreshold: 3, lowText: "As palavras dele fazem sentido. Por que sofrer se há um caminho mais fácil?" }
    ],
    choices: [
      {
        text: "Ir ao vilarejo da Moralidade",
        nextChapterId: "cena10",
        effects: { fe: -1, discernimento: -1 },
        consequence: "Prudência Mundana representa a tentação de resolver o problema do pecado com moralidade humana em vez de graça divina. 'Legalidade' é a Lei — que condena mas não pode salvar. Gálatas 2:16 ensina que 'ninguém será justificado pelas obras da lei, mas pela fé em Jesus Cristo.'"
      },
      {
        text: "Recusar e voltar à encruzilhada",
        nextChapterId: "cena7",
        effects: { discernimento: 1, fe: 1 },
        consequence: "Recusar o atalho de Prudência Mundana exige discernimento. Muitos 'conselhos sábios' do mundo são armadilhas espirituais disfarçadas. 'Há caminho que ao homem parece direito, mas o seu fim são os caminhos da morte.' (Provérbios 14:12)"
      }
    ]
  },

  "cena9": {
    id: "cena9",
    title: "A Porta Estreita",
    location: "Porta Estreita",
    sceneEvent: { type: 'suspense', delay: 1000, duration: 2000, message: 'A porta se ergue diante de você...' },
    characters: ["cristao", "boa_vontade"],
    narrative: [
      "A subida é árdua. Os espinhos rasgam suas roupas e a inclinação faz o fardo pesar ainda mais. Várias vezes você escorrega e cai de joelhos.",
      "Mas no topo, a porta está ali. Pequena, quase insignificante, mas real. Uma inscrição brilha acima dela: \"Batei, e abrir-se-vos-á.\"",
      "Você bate. Uma voz do outro lado pergunta: \"Quem é?\" Você responde com a única verdade que tem: \"Um pecador carregado, fugindo da ira vindoura.\"",
      "A porta se abre. Mãos fortes te puxam para dentro. Do outro lado, o mundo parece diferente. O fardo ainda pesa — mas agora há um caminho."
    ],
    choices: [
      {
        text: "Seguir o caminho que se abre além da porta",
        nextChapterId: "cena9b",
        effects: { perseveranca: 1, fe: 1 },
        consequence: "A Porta Estreita é Cristo — 'Eu sou a porta; se alguém entrar por mim, salvar-se-á' (João 10:9). Cristão entrou com humildade, confessando ser pecador. Essa é a única credencial aceita: não méritos, mas honestidade diante de Deus."
      },
      {
        text: "Olhar para trás, com saudade do que ficou",
        nextChapterId: "cena8",
        effects: { coragem: -1 },
        consequence: "Jesus advertiu em Lucas 9:62: 'Ninguém que, tendo posto a mão no arado, olha para trás, é apto para o Reino de Deus.' A saudade do passado é natural, mas pode se tornar uma corrente que prende o peregrino."
      }
    ]
  },

  "cena10": {
    id: "cena10",
    title: "A Montanha Sinai",
    location: "Monte Sinai",
    characters: ["cristao", "evangelista"],
    narrative: [
      "O vilarejo da Moralidade fica ao pé de uma montanha chamada Sinai. Ao se aproximar, o monte começa a tremer. Pedras despencam. Fogo parece arder no topo.",
      "O homem Legalidade não está em lugar nenhum. A montanha ruge como se fosse esmagar tudo ao redor. Você percebe, com horror, que este caminho não pode remover seu fardo — ele só acrescenta medo ao peso.",
      "Evangelista aparece novamente, com rosto severo: \"Por que você se desviou? O caminho de Prudência Mundana leva à morte. Volte à Porta Estreita.\""
    ],
    sceneEvent: { type: 'tension', intensity: 3, duration: 5000, message: 'A montanha treme e fogo arde no topo!' },
    choices: [
      {
        text: "Obedecer a Evangelista e voltar ao caminho",
        nextChapterId: "cena7",
        effects: { fe: 1, discernimento: 1 },
        consequence: "O Monte Sinai representa a Lei de Deus — que é santa, mas não pode salvar. A Lei mostra o pecado, mas não pode removê-lo. Por isso tremia e queimava: ela revela a ira de Deus contra o pecado, mas a solução está na Cruz, não na Moralidade. Romanos 3:20: 'Pela lei vem o pleno conhecimento do pecado.'"
      }
    ]
  },

  "cena11": {
    id: "cena11",
    title: "O Pântano do Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao"],
    reflection: "r5",
    interactionType: 'hold',
    sceneEvent: { type: 'tension', intensity: 1, duration: 2500, message: 'O chão estremece sob seus pés...' },
    narrative: [
      "Logo após a porta, o caminho atravessa um terreno lodoso e traiçoeiro. O Pântano do Desânimo — assim o chamam aqueles que conseguiram sair dele.",
      "A cada passo, o lodo suga seus pés. O fardo nas costas empurra você para baixo. Dúvidas sobem como bolhas da lama: \"Será que escolhi certo? Será que existe algo além disso?\"",
      "Bunyan escreveu que este pântano é feito dos medos, terrores e dúvidas que surgem quando uma alma desperta para sua condição. Não é lama comum — é desânimo materializado."
    ],
    flagNarrative: [
      { flag: "convidou_flexivel", text: "É aqui que Flexível te abandonou, no livro original. Ao sentir a lama, ele gritou: \"É isso a felicidade que você prometeu?\" — e voltou para a Cidade da Destruição." }
    ],
    toneNarrative: [
      { attr: "perseveranca", highThreshold: 6, highText: "Seus pés encontram, aqui e ali, degraus de pedra escondidos sob a lama — as promessas de perdão e aceitação que sustentam quem persevera.", lowThreshold: 3, lowText: "O lodo chega até seus joelhos. Cada passo exige o triplo de esforço. Seu corpo implora para parar." }
    ],
    choices: [
      {
        text: "Procurar os degraus de pedra sob a lama e avançar devagar",
        nextChapterId: "cena12",
        effects: { discernimento: 1, perseveranca: 1 },
        consequence: "Os degraus sob a lama são as promessas de Deus — sempre presentes, mesmo quando não conseguimos vê-las. O Rei ordenou que fossem colocados ali para que ninguém perecesse, mas no desespero, poucos olham para baixo. 'As suas promessas são mui preciosas e grandíssimas' (2 Pedro 1:4)."
      },
      {
        text: "Parar e ouvir — vozes estranhas sussurram na lama",
        nextChapterId: "cena11b",
        effects: { discernimento: 1 },
        consequence: "Prestar atenção ao que o desânimo diz é perigoso, mas necessário. Nem toda voz que fala no sofrimento é de Deus — algumas são o próprio pântano tentando te afundar. Discernir entre elas exige coragem."
      },
      {
        text: "Correr desesperadamente para atravessar",
        nextChapterId: "cena13",
        effects: { coragem: 1 },
        consequence: "A pressa no desânimo pode ser fatal. Quem corre no pântano afunda mais rápido. Bunyan ensina que paciência no sofrimento — não velocidade — é o que leva o peregrino ao outro lado."
      }
    ]
  },

  "cena12": {
    id: "cena12",
    title: "Os Degraus Ocultos",
    location: "Pântano do Desânimo",
    characters: ["cristao", "auxilio"],
    narrative: [
      "Com paciência, seus pés encontram pedras firmes sob a lama. São os degraus que o Rei colocou ali — promessas de misericórdia e perdão para quem persevera.",
      "O progresso é lento. O fardo ainda pesa. Mas a cada degrau encontrado, o pântano parece menos profundo.",
      "Ao longe, a margem oposta se aproxima. Solo firme. Grama verde."
    ],
    choices: [
      {
        text: "Continuar passo a passo, confiando nos degraus",
        nextChapterId: "cena14",
        effects: { perseveranca: 1, fe: 1 },
        consequence: "Cada degrau é uma promessa de Deus. O progresso lento não é fracasso — é fidelidade. 'Os que esperam no Senhor renovarão as suas forças; subirão com asas como águias; correrão e não se cansarão; caminharão e não se fatigarão.' (Isaías 40:31)"
      },
      {
        text: "Desanimar — o progresso é lento demais",
        nextChapterId: "cena13",
        effects: { fe: -1 },
        consequence: "O desânimo no meio do avanço é uma das armas mais eficazes do inimigo. Quando você já está progredindo, ele sussurra: 'Não é o suficiente.' Mas Deus valoriza cada passo dado em fé, mesmo o mais lento."
      }
    ]
  },

  "cena13": {
    id: "cena13",
    title: "Afundando no Desânimo",
    location: "Pântano do Desânimo",
    characters: ["cristao", "auxilio"],
    interactionType: 'timed',
    timeLimit: 10,
    timeoutChoiceIndex: 1,
    sceneEvent: { type: 'sinking', duration: 12000, message: 'A lama te puxa para baixo!' },
    narrative: [
      "A lama sobe até sua cintura. O fardo nas suas costas te empurra para baixo como uma âncora. O pântano quer te engolir.",
      "Cada movimento afunda você mais. O pânico aperta sua garganta. A Cidade da Destruição, ao longe, quase parece convidativa comparada a isso.",
      "Mas então — uma mão se estende. Um homem chamado Auxílio aparece na margem."
    ],
    choices: [
      {
        text: "Agarrar a mão de Auxílio",
        nextChapterId: "cena14",
        effects: { fe: 2, perseveranca: 1 },
        flag: "pediu_ajuda_pantano",
        consequence: "Aceitar ajuda não é fraqueza — é sabedoria. Auxílio representa a graça de Deus que se estende quando nossas forças acabam. 'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza' (2 Coríntios 12:9). Cristão não saiu do pântano por mérito — saiu porque aceitou a mão estendida."
      },
      {
        text: "Tentar sair sozinho — por orgulho ou medo",
        nextChapterId: "cena15",
        effects: { perseveranca: 1, fe: -1 },
        consequence: "O orgulho espiritual — recusar ajuda quando se está afundando — é perigoso. Provérbios 16:18 avisa: 'A soberba precede a ruína.' Deus envia Auxílio, mas não obriga ninguém a aceitar."
      }
    ]
  },

  "cena14": {
    id: "cena14",
    title: "A Mão de Auxílio",
    location: "Margem do Pântano",
    characters: ["cristao", "auxilio"],
    narrative: [
      "Auxílio te puxa com força para fora da lama. No solo firme, você cai de joelhos, ofegante, coberto de lodo.",
      "\"Por que não usou os degraus?\", pergunta Auxílio gentilmente. \"O Rei os colocou ali por uma razão.\"",
      "Você olha para trás. O pântano borbulha, sombrio. Mas você está do outro lado. O fardo ainda está nas suas costas — porém mais leve agora, como se parte da lama tivesse ficado para trás."
    ],
    choices: [
      {
        text: "Agradecer a Auxílio e seguir adiante",
        nextChapterId: "cena14b",
        effects: { fe: 1, discernimento: 1 },
        consequence: "Auxílio explica que o Rei colocou degraus sob a lama — mas no desespero, ninguém olha para baixo. As promessas de Deus estão sempre ali, mesmo quando a dor nos cega. Gratidão é o antídoto do desânimo."
      }
    ]
  },

  "cena15": {
    id: "cena15",
    title: "A Cruz e o Sepulcro",
    location: "Colina da Cruz",
    characters: ["cristao", "tres_resplandecentes"],
    sceneEvent: { type: 'suspense', delay: 800, duration: 3000, message: 'Uma presença sagrada enche o lugar...' },
    narrative: [
      "O caminho sobe uma colina. No topo, uma visão te paralisa: uma cruz de madeira, erguida contra o céu. Ao seu pé, um sepulcro aberto.",
      "Ao olhar para a cruz, algo acontece. As cordas que prendiam o fardo às suas costas se soltam. O fardo desliza, cai, e rola colina abaixo até desaparecer dentro do sepulcro. A boca do túmulo se fecha.",
      "Pela primeira vez desde que abriu o livro, você está de pé sem peso. Lágrimas escorrem, mas não são de dor — são de alívio. Três Seres Resplandecentes aparecem. O primeiro diz: \"Seus pecados são perdoados.\" O segundo remove seus trapos e lhe veste roupas novas. O terceiro coloca um selo na sua testa e lhe entrega um pergaminho com um selo: sua garantia de entrada na Cidade Celestial.",
      "A jornada continua. Mas agora, sem o fardo."
    ],
    choices: [
      {
        text: "Seguir o caminho, renovado e livre do fardo",
        nextChapterId: "cena15b",
        effects: { fe: 2, perseveranca: 1, coragem: 1 }
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 1 — CENAS EXPANDIDAS (fidelidade a Bunyan)
  // ═══════════════════════════════════════════

  "cena1b": {
    id: "cena1b",
    title: "A Angústia Secreta",
    location: "Cidade da Destruição",
    characters: ["cristao", "esposa_cristao", "vizinhos"],
    sceneEvent: { type: 'tension', intensity: 1, duration: 3000 },
    narrative: [
      "{{shout}}Você corre pelas ruas gritando, mas ninguém entende.{{/shout}}",
      "Os vizinhos fecham as janelas. As crianças riem do homem que chora em público.",
      "Em casa, sua esposa segura seus ombros: {{dialog}}\"Você está assustando as crianças.\"{{/dialog}}",
      "Você tenta explicar o livro, o juízo, a cidade condenada. As palavras saem quebradas.",
      "Ela manda você dormir. {{whisper}}Você sabe que o peso vai amanhecer com você.{{/whisper}}"
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Mesmo rejeitado, uma certeza arde no seu peito: o que você leu é verdade. Se ninguém acredita, você irá sozinho.", lowThreshold: 3, lowText: "Talvez sua esposa tenha razão. Talvez seja febre. Talvez o livro seja só... um livro." }
    ],
    choices: [
      {
        text: "Levantar antes do amanhecer e partir em segredo",
        nextChapterId: "cena3",
        effects: { coragem: 2, fe: 1 },
        flag: "partiu_em_segredo"
      },
      {
        text: "Tentar mais uma vez convencer sua família",
        nextChapterId: "cena2",
        effects: { perseveranca: 1 }
      },
      {
        text: "Obedecer e tentar dormir — talvez realmente passe",
        nextChapterId: "cena4",
        effects: { fe: -1, coragem: -1 }
      }
    ]
  },

  "cena5b": {
    id: "cena5b",
    title: "O Peso da Partida",
    location: "Estrada para a Porta Estreita",
    characters: ["cristao", "evangelista", "presuncao_preguica_simples"],
    narrative: [
      "Você olha para trás uma última vez. {{heart}}A cidade ainda parece casa.{{/heart}}",
      "Mas cada passo à frente confirma: ficar não é mais opção.",
      "Na estrada, três homens dormem acorrentados: {{emphasis}}Presunção, Preguiça e Simples{{/emphasis}}.",
      "{{shout}}\"Acordem! O perigo é real!\"{{/shout}}",
      "{{villain}}\"Cada um cuide de si.\"{{/villain}} {{villain}}\"Mais um cochilo...\"{{/villain}} {{villain}}\"Não vejo perigo nenhum.\"{{/villain}}"
    ],
    flagNarrative: [
      { flag: "partiu_em_segredo", text: "Você saiu de casa antes do sol nascer, sem acordar ninguém. O silêncio da madrugada pesou mais que o fardo. Será que um dia eles entenderão por que você partiu?" }
    ],
    choices: [
      {
        text: "Seguir em frente — você não pode salvar quem não quer ser salvo",
        nextChapterId: "cena7",
        effects: { discernimento: 1, perseveranca: 1 },
        flag: "alertou_dorminhocoes"
      },
      {
        text: "Insistir e tentar acordar os três à força",
        nextChapterId: "cena7",
        effects: { coragem: 1, fe: 1 },
        consequence: "Você os sacode, mas eles resmungam e voltam a dormir. Alguns caminhos só podem ser escolhidos por quem os percorre."
      }
    ]
  },

  "cena7b": {
    id: "cena7b",
    title: "Boa-Vontade e as Flechas",
    location: "Porta Estreita",
    characters: ["cristao", "boa_vontade"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 4000, message: 'Flechas cortam o ar ao seu redor!' },
    interactionType: 'timed',
    timeLimit: 8,
    timeoutChoiceIndex: 0,
    narrative: [
      "A subida castiga. Os espinhos rasgam. O fardo puxa você para trás.",
      "Quando a porta aparece, você corre e bate com os punhos: {{shout}}\"Abram! Pelo amor de Deus, abram!\"{{/shout}}",
      "{{tremor}}Flechas cortam o ar ao redor da sua cabeça!{{/tremor}}",
      "Antes que outra acerte você, {{emphasis}}Boa-Vontade{{/emphasis}} abre e te puxa para dentro com força.",
      "Uma flecha crava na porta onde sua cabeça estava.",
      "Ele fecha a porta e diz: {{divine}}\"Quem chega até aqui não é rejeitado.\"{{/divine}}"
    ],
    choices: [
      {
        text: "\"Obrigado! Mas por que o inimigo atira flechas tão perto da porta?\"",
        nextChapterId: "cena9",
        effects: { discernimento: 1, fe: 1 },
        flag: "entrou_pela_porta_estreita"
      },
      {
        text: "Cair de joelhos, trêmulo, agradecendo por estar vivo",
        nextChapterId: "cena9",
        effects: { fe: 2 },
        flag: "entrou_pela_porta_estreita"
      }
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
    ],
    toneNarrative: [
      { attr: "perseveranca", highThreshold: 6, highText: "As palavras de Boa-Vontade te enchem de determinação. Se o fardo vai cair, vale a pena cada passo até lá.", lowThreshold: 3, lowText: "\"Mais um pouco\" — as palavras doem. Quanto é \"um pouco\"? O fardo parece eterno." }
    ],
    choices: [
      {
        text: "Seguir pela estrada reta com esperança renovada",
        nextChapterId: "cena11",
        effects: { fe: 1, perseveranca: 1 },
        flag: "recebeu_instrucao_boa_vontade"
      },
      {
        text: "Perguntar se não existe um atalho mais rápido",
        nextChapterId: "cena11",
        effects: { discernimento: -1 },
        consequence: "Boa-Vontade sorri triste: \"Não há atalhos no caminho da vida. Todos os que tentaram atalhos caíram em armadilhas.\""
      }
    ]
  },

  "cena11b": {
    id: "cena11b",
    title: "As Vozes na Lama",
    location: "Profundezas do Pântano",
    characters: ["cristao"],
    sceneEvent: { type: 'sinking', duration: 10000, message: 'O desânimo te puxa para baixo...' },
    interactionType: 'hold',
    narrative: [
      "No fundo do pântano, {{whisper}}vozes sussurram da lama{{/whisper}}.",
      "Não são vozes de fora. São seus próprios pensamentos, deformados pelo desânimo.",
      "{{villain}}\"Você abandonou sua família por nada...\"{{/villain}}",
      "{{villain}}\"A Cidade Celestial não existe...\"{{/villain}}",
      "{{villain}}\"Ninguém vai sentir sua falta no caminho...\"{{/villain}}",
      "Cada sussurro pesa como mais uma pedra. A lama borbulha ao redor dos seus quadris.",
      "Mas entre os sussurros — outra voz. Quase inaudível.",
      "{{divine}}\"Os que semeiam com lágrimas, com júbilo ceifarão.\"{{/divine}}",
      "Ela não vem da lama. {{divine}}Vem de cima.{{/divine}}"
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Você se agarra à voz que vem de cima como um náufrago se agarra a uma tábua. Ela é real. As outras vozes são a lama falando.", lowThreshold: 3, lowText: "Todas as vozes se misturam — as da lama e a de cima. Você não sabe mais qual é verdadeira. O desespero é quase total." }
    ],
    choices: [
      {
        text: "Focar na voz de cima e ignorar os sussurros da lama",
        nextChapterId: "cena12",
        effects: { fe: 2, perseveranca: 1 },
        flag: "resistiu_vozes_pantano"
      },
      {
        text: "Gritar por socorro com todas as forças que restam",
        nextChapterId: "cena13",
        effects: { coragem: 1, fe: 1 }
      },
      {
        text: "Parar de lutar — talvez se afundar seja menos doloroso",
        nextChapterId: "cena13",
        effects: { fe: -2, perseveranca: -1 },
        flag: "cedeu_desanimo"
      }
    ]
  },

  "cena14b": {
    id: "cena14b",
    title: "A Razão do Pântano",
    location: "Margem do Pântano",
    characters: ["cristao", "auxilio"],
    narrative: [
      "No solo firme, coberto de lama da cabeça aos pés, você se senta ao lado de Auxílio. Ele não parece com pressa de ir embora.",
      "\"Você quer saber por que o pântano existe?\", ele pergunta, como se lesse seus pensamentos. \"É assim: quando um pecador desperta para sua condição, medos, dúvidas e terrores surgem na sua alma. Eles se acumulam e escorrem para este lugar.\"",
      "Ele aponta para a lama: \"Por isso o pântano nunca seca. O Rei mandou colocar degraus de pedra firme sob a lama — são Suas promessas de perdão. Mas no desespero, as pessoas não olham para baixo. Só olham para a lama.\"",
      "Você olha para suas mãos sujas. Cada mancha de lama é uma dúvida que quase te engoliu. Mas agora você está do outro lado.",
      "\"O caminho continua\", diz Auxílio, apontando para uma colina à frente. \"E o melhor está por vir. Naquela colina, seu fardo será tratado de um jeito que você não espera.\""
    ],
    choices: [
      {
        text: "\"Obrigado, Auxílio. Nunca esquecerei sua mão estendida.\"",
        nextChapterId: "cena15",
        effects: { fe: 1, discernimento: 1, perseveranca: 1 },
        flag: "grato_a_auxilio"
      },
      {
        text: "Seguir em frente rapidamente — o pântano ainda assusta",
        nextChapterId: "cena15",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "cena15b": {
    id: "cena15b",
    title: "Os Três Seres Resplandecentes",
    location: "Colina da Cruz",
    characters: ["cristao", "tres_resplandecentes"],
    narrative: [
      "Você ainda está de joelhos quando três figuras luminosas aparecem diante de você. A luz que emana deles é tão intensa que você cobre os olhos com as mãos.",
      "O primeiro se adianta. Sua voz é como trovão gentil: \"Paz a você. Seus pecados são perdoados.\" As palavras atravessam o seu peito como fogo que não queima — purifica.",
      "O segundo se ajoelha ao seu lado e, com mãos que parecem feitas de luz, remove seus trapos sujos e imundos — as velhas roupas da Cidade da Destruição. No lugar, veste você com roupas novas, brancas e limpas. Pela primeira vez, você não sente vergonha do que veste.",
      "O terceiro coloca um selo na sua testa — uma marca invisível mas real — e estende um pergaminho selado com um selo dourado. \"Este é seu passaporte\", ele diz. \"Guarde-o com sua vida. Você precisará dele nos portões da Cidade Celestial. Não o perca.\"",
      "Os três desaparecem como vieram — em luz. Você fica ali, de pé, com roupas novas, sem fardo, com um pergaminho selado no peito. O caminho à frente parece possível agora."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Neste momento, tudo faz sentido. O fardo, o pântano, as flechas, a porta — tudo levava até aqui. Até a Cruz.", lowThreshold: 3, lowText: "Você quase não acredita no que aconteceu. Será real? Será que o fardo realmente se foi? Você toca as costas — nada ali. Pela primeira vez em muito tempo, nada ali." }
    ],
    choices: [
      {
        text: "Seguir a jornada com alegria — em direção à Casa do Intérprete",
        nextChapterId: "fase2-cena1",
        effects: { fe: 2, perseveranca: 1, coragem: 1, discernimento: 1 },
        flag: "recebeu_vestes_novas",
        item: "pergaminho_selado"
      },
      {
        text: "Dar três saltos de alegria e correr pelo caminho cantando",
        nextChapterId: "fase2-cena1",
        effects: { fe: 2, coragem: 2 },
        flag: "recebeu_vestes_novas",
        item: "pergaminho_selado",
        consequence: "Cristão deu três saltos e seguiu cantando: \"Bendito seja aquele lugar! Bendita a Cruz e o Sepulcro! Bendita a graça que me libertou!\""
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 2: A CASA DO INTÉRPRETE
  // Baseado nas visões do Intérprete em Bunyan
  // ═══════════════════════════════════════════

  "fase2-cena1": {
    id: "fase2-cena1",
    title: "A Casa do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    sceneEvent: { type: 'suspense', delay: 500, duration: 2000, message: 'Uma presença sábia aguarda dentro...' },
    narrative: [
      "O caminho leva a uma casa grande e sóbria. Uma placa sobre a porta diz: {{emphasis}}\"Casa do Intérprete.\"{{/emphasis}} Antes de bater, você hesita. {{fade}}A casa emana silêncio — o tipo de silêncio que precede revelações.{{/fade}}",
      "A porta se abre antes de você bater. Um homem de olhar profundo e voz calma diz: {{divine}}\"Eu estava te esperando. Entre. Vou te mostrar coisas que serão úteis para o restante da sua jornada.\"{{/divine}}"
    ],
    replayNarrative: [
      "A casa é a mesma. Mas seus olhos mudaram. Desta vez, o que você verá nas salas do Intérprete?"
    ],
    choices: [
      {
        text: "Entrar e aceitar a instrução",
        nextChapterId: "fase2-cena2",
        effects: { fe: 1, discernimento: 1 },
        flag: "entrou_casa_interprete",
        item: "lampada_discernimento"
      },
      {
        text: "Agradecer mas seguir viagem — o caminho é longo",
        nextChapterId: "fase2-cena3",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena2": {
    id: "fase2-cena2",
    title: "O Retrato na Parede",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "A primeira sala contém apenas um retrato. O homem pintado tem {{divine}}olhos erguidos ao céu{{/divine}}, o melhor dos livros nas mãos, a lei da verdade escrita nos lábios e o mundo atrás de si. Ele está de pé, como se suplicasse aos homens.",
      "{{dialog}}\"Grave este rosto\"{{/dialog}}, diz o Intérprete. {{emphasis}}\"Este homem é o único guia autorizado para o caminho que você percorre.\"{{/emphasis}} \"Muitos vão se oferecer para guiá-lo — Prudência Mundana, Legalidade, outros. Mas só este homem conhece a verdade.\"",
      "{{fade}}Você estuda o retrato. Os olhos do homem pintado parecem vivos, cheios de urgência e compaixão.{{/fade}}"
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Olhando o retrato, você reconhece algo. É como se já conhecesse esse homem — não pelo rosto, mas pelo que ele representa.", lowThreshold: 3, lowText: "O retrato é perturbador. Você não entende por que deveria confiar em alguém que nunca viu." },
      { attr: "discernimento", highThreshold: 6, highText: "Cada detalhe do retrato fala: o livro, os olhos ao céu, o mundo atrás de si. É um mapa visual para a jornada.", lowThreshold: 3, lowText: "É só uma pintura. Você olha sem entender e logo desvia os olhos." }
    ],
    choices: [
      {
        text: "Meditar no retrato e pedir para ver mais",
        nextChapterId: "fase2-cena4",
        effects: { discernimento: 2 }
      },
      {
        text: "Passar rapidamente para a próxima sala",
        nextChapterId: "fase2-cena4",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena3": {
    id: "fase2-cena3",
    title: "O Caminho Sem Instrução",
    location: "Caminho Estreito",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 1, duration: 2000, message: 'Uma sensação de vazio te acompanha...' },
    narrative: [
      "{{fade}}Você segue adiante sem entrar na casa. O caminho parece igual, mas algo falta.{{/fade}} Sem as lições do Intérprete, cada decisão futura será mais difícil.",
      "{{whisper}}Na estrada, um sentimento de perda te acompanha. Os perigos à frente exigirão sabedoria que você não tem.{{/whisper}}",
      "Ao longe, {{divine}}a porta da Casa do Intérprete ainda está aberta.{{/divine}}"
    ],
    choices: [
      {
        text: "Voltar e entrar na casa",
        nextChapterId: "fase2-cena2",
        effects: { discernimento: 1, fe: 1 }
      },
      {
        text: "Seguir em frente sem instrução",
        nextChapterId: "fase2-cena6",
        effects: { fe: -1, discernimento: -1 }
      }
    ]
  },

  "fase2-cena4": {
    id: "fase2-cena4",
    title: "A Sala da Poeira",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    interactionType: 'hold',
    narrative: [
      "A segunda sala está coberta de poeira espessa — nunca foi varrida. O Intérprete chama um homem com uma vassoura. {{tremor}}Ele varre furiosamente, mas a poeira sobe em nuvens sufocantes, enchendo o ar até que ninguém consegue respirar.{{/tremor}}",
      "{{fade}}Então uma jovem entra com um jarro de água e borrifa o chão. A poeira se assenta. O ar se limpa. O chão aparece limpo.{{/fade}}",
      "{{divine}}\"A poeira é o pecado\"{{/divine}}, explica o Intérprete. \"A vassoura é a Lei, que revela o pecado mas não pode limpá-lo — apenas levanta mais poeira. {{emphasis}}A água é a Graça, que purifica o coração onde a Lei apenas condena.{{/emphasis}}\""
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "Você se lembra do pântano. Lá, tentar sozinho te afundou. Aqui, a lição se repete: a vassoura sozinha piora tudo. Só a água limpa." },
      { flag: "escolheu_caminho_facil", text: "O caminho largo era como a vassoura — parecia resolver, mas só levantava mais problemas." }
    ],
    choices: [
      {
        text: "Perguntar ao Intérprete: \"Então a Lei é inútil?\"",
        nextChapterId: "fase2-cena5",
        effects: { discernimento: 2 }
      },
      {
        text: "Apenas observar em silêncio",
        nextChapterId: "fase2-cena5",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "fase2-cena5": {
    id: "fase2-cena5",
    title: "A Resposta do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "{{dialog}}\"A Lei não é inútil\"{{/dialog}}, responde o Intérprete. {{emphasis}}\"Ela revela a doença. Mas não é o remédio.{{/emphasis}} Quem tenta se curar pela Lei apenas sufoca na própria poeira.\"",
      "Ele te olha fixamente: {{divine}}\"Lembre-se disso no caminho. Muitos tentarão te dizer que basta ser bom o suficiente, seguir regras o suficiente. Mas o fardo que caiu na cruz não caiu por suas obras — caiu pela Graça.\"{{/divine}}"
    ],
    choices: [
      {
        text: "Absorver a lição profundamente",
        nextChapterId: "fase2-cena6",
        effects: { discernimento: 2, fe: 1 }
      },
      {
        text: "Achar complicado demais e seguir adiante",
        nextChapterId: "fase2-cena6",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena6": {
    id: "fase2-cena6",
    title: "O Fogo que Não Apaga",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    sceneEvent: { type: 'suspense', duration: 2000, message: 'As chamas dançam diante de seus olhos...' },
    narrative: [
      "Na terceira sala, {{tremor}}um fogo arde contra uma parede{{/tremor}}. Um homem se posta diante dele e derrama água sem parar, tentando apagá-lo. {{emphasis}}Mas o fogo não diminui — pelo contrário, cresce mais forte a cada balde.{{/emphasis}}",
      "O Intérprete te leva para trás da parede. Ali, escondido, {{divine}}outro homem despeja óleo continuamente sobre o fogo{{/divine}}, através de uma abertura que o primeiro homem não consegue ver.",
      "{{dialog}}\"O fogo é a obra da Graça no coração\"{{/dialog}}, explica o Intérprete. \"O diabo tenta apagá-lo com tentações. Mas {{divine}}Cristo, de modo secreto e contínuo, alimenta essa chama. É por isso que ela nunca se apaga.{{/divine}}\""
    ],
    choices: [
      {
        text: "Perguntar: \"Como posso manter esse fogo vivo em mim?\"",
        nextChapterId: "fase2-cena7",
        effects: { discernimento: 1, fe: 1 }
      },
      {
        text: "Seguir para a próxima sala",
        nextChapterId: "fase2-cena7",
        effects: {}
      }
    ]
  },

  "fase2-cena7": {
    id: "fase2-cena7",
    title: "O Palácio Belo",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'Uma batalha feroz se desenrola diante de seus olhos...' },
    narrative: [
      "A visão seguinte mostra um palácio magnífico. Na porta, guardas armados impedem a entrada. {{fade}}Uma multidão observa de longe, com medo.{{/fade}}",
      "{{tremor}}Então um homem de rosto determinado se aproxima da mesa de registro, escreve seu nome, e avança de espada em punho contra os guardas.{{/tremor}} A batalha é feroz. Ele recebe golpes, sangra, mas não recua. {{emphasis}}Finalmente, atravessa a porta.{{/emphasis}}",
      "{{divine}}De dentro do palácio, vozes cantam: \"Entra, entra! A glória eterna será tua.\"{{/divine}}",
      "{{whisper}}\"O Reino dos Céus padece violência\"{{/whisper}}, murmura o Intérprete, {{emphasis}}\"e são os violentos que o tomam por força.\"{{/emphasis}}"
    ],
    flagNarrative: [
      { flag: "ignorou_inquietacao", text: "Você pensa em como quase ignorou o chamado. Aquele homem corajoso não hesitou — e você?" }
    ],
    choices: [
      {
        text: "\"Eu quero ser como aquele homem. Custará tudo, mas eu vou.\"",
        nextChapterId: "fase2-cena8",
        effects: { coragem: 2, fe: 1 }
      },
      {
        text: "Sentir medo dos guardas e da violência necessária",
        nextChapterId: "fase2-cena8",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase2-cena8": {
    id: "fase2-cena8",
    title: "O Homem na Gaiola de Ferro",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "A última sala contém uma gaiola de ferro. Dentro, um homem em trapos, de cabeça baixa. {{fade}}Seus olhos estão vazios.{{/fade}}",
      "{{villain}}\"Eu já fui um peregrino como você\"{{/villain}}, diz o homem da gaiola. \"Eu era cheio de fé. Mas me deixei levar pelos prazeres e pecados do mundo. Abandonei o caminho. E agora...\" {{heart}}Sua voz falha.{{/heart}} \"Agora estou trancado no desespero. A Graça me foi oferecida, e eu a rejeitei tantas vezes que ela se retirou.\"",
      "{{tremor}}O Intérprete se vira para você com seriedade mortal: \"Grave isso no seu coração. Para que nunca lhe aconteça o mesmo.\"{{/tremor}}"
    ],
    choices: [
      {
        text: "Tremer e jurar nunca abandonar o caminho",
        nextChapterId: "fase2-cena9",
        effects: { fe: 1, perseveranca: 1 }
      },
      {
        text: "Pensar: \"Isso nunca aconteceria comigo\"",
        nextChapterId: "fase2-cena9",
        effects: { discernimento: -1 }
      }
    ]
  },

  "fase2-cena9": {
    id: "fase2-cena9",
    title: "O Sonho do Julgamento",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 4000, message: 'Trovões soam e o céu se abre...' },
    narrative: [
      "Na última visão, o Intérprete mostra um homem que acordou tremendo de um sonho. {{tremor}}No sonho, o céu se abriu, trovões soaram, e um Juiz no trono ordenou: \"Recolhei o trigo e queimem o joio.\"{{/tremor}}",
      "{{heart}}O homem viu a si mesmo entre o joio — e acordou gritando.{{/heart}}",
      "{{divine}}\"O dia do juízo vem\"{{/divine}}, diz o Intérprete. {{emphasis}}\"Lembre-se disso quando o caminho parecer difícil demais, quando a tentação for doce demais. Há um final para esta história. Certifique-se de estar do lado certo.\"{{/emphasis}}"
    ],
    choices: [
      {
        text: "\"Essas lições ficarão comigo. Obrigado.\"",
        nextChapterId: "fase2-cena10",
        effects: { fe: 1, discernimento: 1 }
      },
      {
        text: "Sentir-se perturbado e querer ir embora",
        nextChapterId: "fase2-cena10",
        effects: { fe: -1 }
      }
    ]
  },

  "fase2-cena10": {
    id: "fase2-cena10",
    title: "A Despedida do Intérprete",
    location: "Casa do Intérprete",
    characters: ["cristao", "interprete"],
    narrative: [
      "{{heart}}Na porta, o Intérprete coloca as mãos nos seus ombros.{{/heart}}",
      "{{divine}}\"O Consolador esteja sempre contigo, bom Cristão, para te guiar no caminho que leva à Cidade Celestial.\"{{/divine}}",
      "{{fade}}Ele aperta sua mão. Seus olhos brilham — não de tristeza, mas de esperança firme.{{/fade}}"
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "\"Você já escolheu o caminho difícil antes\", ele diz. \"Essa coragem será testada. Não a abandone.\"" },
      { flag: "entrou_casa_interprete", text: "\"Poucos entram aqui. Muitos passam direto. Você fez a escolha certa ao parar e aprender.\"" }
    ],
    noFlagNarrative: [
      { flag: "entrou_casa_interprete", text: "Mesmo tendo chegado tarde, as lições encontraram você. A Graça opera mesmo quando erramos o caminho." }
    ],
    choices: [
      {
        text: "Abraçar o Intérprete e partir fortalecido",
        nextChapterId: "fase2-cena11",
        effects: { fe: 1, perseveranca: 1 }
      },
      {
        text: "Acenar e partir em silêncio",
        nextChapterId: "fase2-cena11",
        effects: {}
      }
    ]
  },

  "fase2-cena11": {
    id: "fase2-cena11",
    title: "Além da Casa",
    location: "O Caminho Adiante",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 1, duration: 2000, message: 'O caminho se inclina para cima...' },
    narrative: [
      "{{fade}}A casa fica para trás, mas suas lições caminham com você.{{/fade}} A poeira e a vassoura. O fogo que não apaga. O homem na gaiola. O palácio que exige luta.",
      "{{tremor}}O caminho sobe agora. Uma colina íngreme se ergue à frente — a Colina da Dificuldade.{{/tremor}}"
    ],
    choices: [
      {
        text: "Subir a colina íngreme",
        nextChapterId: "fase2-cena12",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "fase2-cena12": {
    id: "fase2-cena12",
    title: "A Colina da Dificuldade",
    location: "Colina da Dificuldade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'A colina se ergue como um muro...' },
    narrative: [
      "{{tremor}}A Colina da Dificuldade se ergue como um muro de pedra.{{/tremor}} Bunyan a descreve como tão íngreme que só se pode subir de mãos e joelhos. No pé da colina, uma fonte de água fresca — para fortalecer o peregrino antes da escalada.",
      "Dois caminhos alternativos contornam a colina: um chamado {{villain}}Perigo{{/villain}}, cheio de bosques escuros, e outro chamado {{villain}}Destruição{{/villain}}, que leva a um campo de pedras traiçoeiras. {{emphasis}}Formalista e Hipocrisia, que pularam o muro, tomaram esses atalhos — e nunca mais foram vistos.{{/emphasis}}",
      "{{heart}}Não há atalho para a colina. É subir — ou desistir.{{/heart}}"
    ],
    toneNarrative: [
      { attr: "perseveranca", highThreshold: 7, highText: "Sua perseverança faz cada degrau natural parecer um convite. Difícil, sim — mas possível.", lowThreshold: 3, lowText: "A colina parece infinita. Seus joelhos gritam de dor antes mesmo do primeiro terço." }
    ],
    choices: [
      {
        text: "Subir direto pela trilha íngreme",
        nextChapterId: "fase2-cena13",
        effects: { perseveranca: 2, coragem: 1 },
        flag: "subiu_colina_direto"
      },
      {
        text: "Tentar o caminho Perigo — parece mais fácil",
        nextChapterId: "fase2-cena13",
        effects: { perseveranca: -1, discernimento: -1 },
        flag: "tentou_atalho_colina"
      }
    ]
  },

  "fase2-cena13": {
    id: "fase2-cena13",
    title: "O Caramanchão e o Pergaminho Perdido",
    location: "Colina da Dificuldade",
    characters: ["cristao"],
    interactionType: 'timed',
    timeLimit: 15,
    timeoutChoiceIndex: 1,
    narrative: [
      "Na metade da subida, um caramanchão de pedra oferece sombra e descanso. {{whisper}}Bunyan nos diz que o Senhor o construiu para alívio dos peregrinos cansados.{{/whisper}}",
      "{{fade}}Você se senta. O cansaço é imenso. As pálpebras pesam. O vento é morno. O caramanchão é tão confortável...{{/fade}}",
      "{{emphasis}}No livro original, Cristão adormeceu aqui — e o pergaminho selado caiu de suas mãos.{{/emphasis}} Quando acordou e descobriu a perda, teve que descer toda a colina para buscá-lo, {{heart}}chorando e se recriminando.{{/heart}}"
    ],
    flagNarrative: [
      { flag: "tentou_atalho_colina", text: "O atalho te trouxe de volta ao mesmo ponto, mais cansado. A colina não aceita atalhos." }
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Você reconhece o perigo: descanso demais no meio da subida pode custar mais do que cansaço.", lowThreshold: 3, lowText: "O sono é irresistível. Só um momento... só fechar os olhos..." }
    ],
    choices: [
      {
        text: "Descansar brevemente e verificar o pergaminho antes de seguir",
        nextChapterId: "fase2-cena14",
        effects: { discernimento: 2, perseveranca: 1 },
        flag: "guardou_pergaminho"
      },
      {
        text: "Adormecer profundamente no caramanchão",
        nextChapterId: "fase2-cena14",
        effects: { discernimento: -2, perseveranca: -1 },
        flag: "dormiu_caramanchao"
      }
    ]
  },

  "fase2-cena14": {
    id: "fase2-cena14",
    title: "Os Leões Acorrentados",
    location: "Portão do Palácio Belo",
    characters: ["cristao", "discricao"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 4000, message: 'Rugidos ecoam entre os muros!' },
    narrative: [
      "No topo da colina, o caminho estreita entre muros altos. {{tremor}}E ali, bloqueando a passagem, dois leões enormes rugem com ferocidade.{{/tremor}}",
      "Dois homens correm na direção oposta — Timidez e Desconfiança. {{shout}}\"Volte!\"{{/shout}}, gritam. {{villain}}\"Os leões nos devorarão!\"{{/villain}}",
      "Mas um porteiro chamado {{emphasis}}Vigilante{{/emphasis}} grita do outro lado: {{divine}}\"Não tema! Os leões estão acorrentados! Mantenha-se no meio do caminho e eles não poderão tocá-lo!\"{{/divine}}",
      "{{whisper}}Bunyan usa os leões para ensinar que os perigos no caminho cristão são muitas vezes mais aparentes do que reais — desde que o peregrino permaneça no centro do caminho estreito.{{/whisper}}"
    ],
    flagNarrative: [
      { flag: "dormiu_caramanchao", text: "Você acorda em pânico e descobre que o pergaminho caiu. Corre colina abaixo, encontra-o no caramanchão, e sobe tudo de novo — exausto, mas aliviado. A lição: não durma no caminho." }
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 7, highText: "Você olha os leões nos olhos. Suas correntes são grossas — eles não podem alcançá-lo se mantiver o caminho.", lowThreshold: 3, lowText: "Os rugidos fazem seu sangue gelar. Todo instinto grita para correr." }
    ],
    choices: [
      {
        text: "Passar entre os leões, mantendo-se no centro do caminho",
        nextChapterId: "fase3-cena1",
        effects: { coragem: 2, fe: 1 },
        flag: "passou_pelos_leoes"
      },
      {
        text: "Hesitar e quase voltar, mas a voz de Vigilante te encoraja",
        nextChapterId: "fase3-cena1",
        effects: { coragem: 1, fe: 1 }
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 3: O VALE DA HUMILHAÇÃO E APOLIÃO
  // Baseado na batalha com Apolião em Bunyan
  // ═══════════════════════════════════════════

  "fase3-cena1": {
    id: "fase3-cena1",
    title: "A Descida ao Vale",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    sceneEvent: { type: 'suspense', delay: 500, duration: 2500, message: 'Algo se move nas sombras...' },
    narrative: [
      "{{fade}}O Vale da Humilhação é estreito e escuro. Paredes de rocha se erguem dos dois lados. O sol desaparece atrás das nuvens.{{/fade}}",
      "{{whisper}}O silêncio aqui é diferente. Não é paz — é espera. Como se o próprio vale prendesse a respiração.{{/whisper}}",
      "{{tremor}}Seus passos ecoam entre as pedras. A armadura da fé que você recebeu parece fina demais.{{/tremor}} O pergaminho pesa no bolso como um lembrete: {{emphasis}}você tem algo pelo que lutar.{{/emphasis}}"
    ],
    replayNarrative: [
      "O vale é o mesmo. Mas você sabe quem espera nas sombras. Da última vez, enfrentou Apolião — ou fugiu. Desta vez, o que fará?"
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As visões do Intérprete ecoam: o homem que avançou de espada contra os guardas do palácio. Será que você tem a mesma coragem?" }
    ],
    choices: [
      {
        text: "Avançar com determinação, mão na espada",
        nextChapterId: "fase3-cena2",
        effects: { coragem: 1 },
        flag: "enfrentou_vale",
        item: "armadura_fe"
      },
      {
        text: "Avançar com cautela, olhando para todos os lados",
        nextChapterId: "fase3-cena2",
        effects: { discernimento: 1 }
      }
    ]
  },

  "fase3-cena2": {
    id: "fase3-cena2",
    title: "A Voz nas Sombras",
    location: "Vale da Humilhação",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 4000, message: 'O chão vibra sob seus pés...' },
    narrative: [
      "{{tremor}}Uma voz troveja entre as rochas, fazendo o chão vibrar:{{/tremor}}",
      "{{villain}}\"Eu te conheço, Cristão. Você veio da minha cidade — a Cidade da Destruição. Toda aquela terra é minha. Você é meu servo.\"{{/villain}}",
      "{{fade}}A voz é de Apolião. Ele ainda não se mostra, mas seu hálito quente faz o ar feder a enxofre.{{/fade}} {{whisper}}O som de escamas raspando pedra ecoa nas paredes do vale.{{/whisper}}"
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 7, highText: "Seu coração dispara, mas suas mãos não tremem. Você já sabia que esse encontro viria.", lowThreshold: 3, lowText: "Cada palavra de Apolião te encolhe. A tentação de correr é quase física." },
      { attr: "fe", highThreshold: 7, highText: "Uma certeza queima dentro de você: não importa o que ele é — há alguém maior.", lowThreshold: 3, lowText: "Você se sente completamente sozinho. Se essa criatura é real, que chance você tem?" }
    ],
    choices: [
      {
        text: "Gritar de volta: \"Eu renunciei à sua lealdade! Sirvo a outro Rei!\"",
        nextChapterId: "fase3-cena3",
        effects: { fe: 1, coragem: 1 }
      },
      {
        text: "Recuar em silêncio, procurando um lugar para se esconder",
        nextChapterId: "fase3-cena5",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase3-cena3": {
    id: "fase3-cena3",
    title: "Apolião Revelado",
    location: "Vale da Humilhação",
    characters: ["cristao", "apolion"],
    narrative: [
      "{{tremor}}Apolião emerge das sombras.{{/tremor}} Bunyan o descreve assim: coberto de escamas como um peixe, asas como de dragão, pés de urso, boca de leão, e de seu ventre saem fogo e fumaça.",
      "{{villain}}\"Servo ingrato!\"{{/villain}}, ruge a criatura, bloqueando o caminho inteiro. \"Quantas vezes você quase desistiu? No pântano, na encruzilhada, nas noites de dúvida? {{villain}}Você é fraco. Volte para mim e eu te pouparei.{{/villain}}\"",
      "{{fade}}Ele oferece riquezas, conforto, o fim do sofrimento. Tudo que você precisa fazer é largar o pergaminho e voltar.{{/fade}}"
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 8, highText: "Apolião é terrível. Mas dentro de você, uma chama responde: \"Eu já passei pelo pântano, pela cruz, pelo fogo que não apaga. Não vou voltar.\"", lowThreshold: 3, lowText: "Suas pernas tremem. Apolião é imenso. O pergaminho na sua mão parece frágil como papel diante daquelas garras." }
    ],
    choices: [
      {
        text: "Levantar o escudo da fé e desembainhar a Espada do Espírito",
        nextChapterId: "fase3-cena4",
        effects: { coragem: 2, fe: 1 },
        flag: "enfrentou_presenca",
        item: "manto_coragem",
        conditionalEffects: [
          { attr: "fe", threshold: 8, bonus: { coragem: 1 }, penalty: { coragem: -1 } }
        ]
      },
      {
        text: "Dar as costas e correr",
        nextChapterId: "fase3-cena5",
        effects: { discernimento: -1, coragem: -2 },
        conditionalEffects: [
          { attr: "coragem", threshold: 6, bonus: { fe: 1 }, penalty: { fe: -1 } }
        ]
      }
    ]
  },

  "fase3-cena4": {
    id: "fase3-cena4",
    title: "A Batalha",
    location: "Vale da Humilhação",
    characters: ["cristao", "apolion"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 5000, message: 'Dardos flamejantes cortam o ar!' },
    narrative: [
      "{{tremor}}A batalha dura horas. Apolião lança dardos flamejantes.{{/tremor}} Você os apara com o escudo da fé, mas alguns passam e ferem suas mãos, sua cabeça, seu pé.",
      "Em um momento terrível, {{tremor}}Apolião te derruba. Sua espada voa de suas mãos.{{/tremor}} Ele se ergue sobre você, pronto para o golpe final.",
      "Mas sua mão encontra a espada novamente. {{divine}}Com um grito que não vem de você — vem de algo maior — você desfere um golpe que faz Apolião recuar.{{/divine}} {{fade}}Ele abre as asas de dragão e foge, deixando para trás apenas o fedor de enxofre.{{/fade}}",
      "{{heart}}Você está ferido, sangrando, exausto. Mas vivo. E vitorioso.{{/heart}}"
    ],
    adaptiveNarrative: [
      { minAttr: "perseveranca", minValue: 8, text: "Cada cicatriz da jornada preparou você para este momento. A perseverança acumulada sustentou cada golpe." }
    ],
    noFlagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "Sem a experiência do caminho difícil, a batalha é ainda mais brutal. Mas você sobreviveu." }
    ],
    choices: [
      {
        text: "Recolher folhas da Árvore da Vida para curar suas feridas",
        nextChapterId: "fase3-cena6",
        effects: { perseveranca: 2, fe: 1 },
        conditionalEffects: [
          { attr: "perseveranca", threshold: 8, bonus: { perseveranca: 2, fe: 1 }, penalty: { perseveranca: -1 } }
        ]
      },
      {
        text: "Desabar de exaustão, sem forças para continuar",
        nextChapterId: "fase3-cena5",
        effects: { coragem: -2 }
      }
    ]
  },

  "fase3-cena5": {
    id: "fase3-cena5",
    title: "O Vale da Sombra da Morte",
    location: "Vale da Sombra da Morte",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 5000, message: 'A escuridão é quase total...' },
    narrative: [
      "{{fade}}Além da batalha (ou da fuga), o vale se torna ainda mais escuro.{{/fade}} Este é o {{emphasis}}Vale da Sombra da Morte{{/emphasis}} — um lugar que Bunyan descreve como tendo um fosso sem fundo de um lado e um pântano de lama do outro.",
      "{{villain}}Demônios sussurram blasfêmias ao seu ouvido, tão perto que você pensa que são seus próprios pensamentos.{{/villain}} {{tremor}}O chão está coberto de armadilhas.{{/tremor}}",
      "{{whisper}}A escuridão é tão densa que nem a espada é visível na sua mão.{{/whisper}}"
    ],
    choices: [
      {
        text: "Orar em voz alta: \"Ainda que eu ande pelo vale da sombra da morte...\"",
        nextChapterId: "fase3-cena6",
        effects: { fe: 2, coragem: 1 }
      },
      {
        text: "Caminhar em silêncio, suportando os sussurros",
        nextChapterId: "fase3-cena7",
        effects: { perseveranca: 1, coragem: -1 }
      }
    ]
  },

  "fase3-cena6": {
    id: "fase3-cena6",
    title: "A Aurora no Vale",
    location: "Vale da Sombra da Morte",
    characters: ["cristao"],
    sceneEvent: { type: 'suspense', delay: 500, duration: 3000, message: 'Uma luz dourada rompe a escuridão...' },
    narrative: [
      "{{divine}}Quando a situação parece impossível, o sol nasce. A luz invade o vale como uma lâmina, dispersando as sombras.{{/divine}} Os demônios recuam. As armadilhas ficam visíveis.",
      "Bunyan escreveu: {{emphasis}}\"Então Cristão disse: 'Ele transformou a sombra da morte em manhã.'\"{{/emphasis}}",
      "{{fade}}À luz do dia, você vê o caminho que percorreu no escuro — cheio de fossos, redes e armadilhas. É um milagre ter passado.{{/fade}} {{divine}}Não foi habilidade sua. Foi providência.{{/divine}}"
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 8, text: "Sua fé acumulada brilha neste momento. A luz parece mais forte ao seu redor, como se respondesse à sua confiança." }
    ],
    choices: [
      {
        text: "Agradecer pela aurora e seguir adiante",
        nextChapterId: "fase3-cena8",
        effects: { fe: 2, perseveranca: 1 },
        conditionalEffects: [
          { attr: "fe", threshold: 10, bonus: { fe: 2, perseveranca: 1 }, penalty: { fe: -1 } }
        ]
      },
      {
        text: "Duvidar — talvez tenha sido apenas sorte",
        nextChapterId: "fase3-cena7",
        effects: { fe: -1 },
        conditionalEffects: [
          { attr: "fe", threshold: 5, bonus: {}, penalty: { coragem: -1 } }
        ]
      }
    ]
  },

  "fase3-cena7": {
    id: "fase3-cena7",
    title: "Os Gigantes na Caverna",
    location: "Saída do Vale",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'Ossos rangem na escuridão...' },
    narrative: [
      "Na saída do vale, duas cavernas se abrem. {{fade}}Dentro, os esqueletos de peregrinos que não conseguiram passar.{{/fade}} Gigantes antigos — {{villain}}Papa e Pagão{{/villain}} — vigiavam este lugar. Um já morreu, o outro está velho demais para atacar.",
      "{{villain}}O gigante sobrevivente range os dentes, mas só consegue gritar: \"Vocês nunca mudarão!\"{{/villain}}",
      "{{heart}}Você passa por ele. Suas ameaças são vazias.{{/heart}} Mas os esqueletos são um lembrete: {{emphasis}}nem todos que começaram a jornada chegaram ao fim.{{/emphasis}}"
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "Você olha os esqueletos e pensa: qualquer um deles poderia ter sido você, se tivesse escolhido diferente naquela encruzilhada." }
    ],
    choices: [
      {
        text: "Passar pelos gigantes com resolução",
        nextChapterId: "fase3-cena8",
        effects: { coragem: 1, discernimento: 1 }
      },
      {
        text: "Hesitar diante dos esqueletos",
        nextChapterId: "fase3-cena9",
        effects: { fe: -1 }
      }
    ]
  },

  "fase3-cena8": {
    id: "fase3-cena8",
    title: "Fiel, o Companheiro",
    location: "Além do Vale",
    characters: ["cristao", "fiel"],
    sceneEvent: { type: 'suspense', delay: 300, duration: 2000, message: 'Uma figura familiar surge à frente...' },
    narrative: [
      "Do outro lado do vale, uma surpresa: {{emphasis}}outro peregrino{{/emphasis}}. Seu nome é {{emphasis}}Fiel{{/emphasis}}. Ele também veio da Cidade da Destruição, por um caminho diferente.",
      "{{dialog}}\"Eu também carreguei o fardo\"{{/dialog}}, diz Fiel. {{dialog}}\"Eu também passei pela cruz. O meu caminho foi diferente do seu, mas chegamos ao mesmo ponto.\"{{/dialog}}",
      "{{heart}}Pela primeira vez na jornada, você tem um companheiro verdadeiro. Alguém que entende o peso, a luta, e a esperança.{{/heart}} Juntos, vocês seguem em direção à Feira da Vaidade."
    ],
    choices: [
      {
        text: "Caminhar lado a lado com Fiel, compartilhando histórias",
        nextChapterId: "fase3-cena10",
        effects: { perseveranca: 1, fe: 1 }
      }
    ]
  },

  "fase3-cena9": {
    id: "fase3-cena9",
    title: "O Peso do Medo",
    location: "Saída do Vale",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'O medo paralisa seus membros...' },
    narrative: [
      "{{tremor}}Os esqueletos te paralisam. Cada um deles foi um peregrino como você.{{/tremor}} Eles tinham fé, coragem, pergaminhos — e mesmo assim morreram aqui.",
      "{{whisper}}A pergunta martela: se eles não conseguiram, como você conseguiria?{{/whisper}}",
      "Mas então você olha para suas mãos. {{divine}}O pergaminho ainda está ali. O selo na sua testa ainda brilha.{{/divine}} {{emphasis}}Você ainda está de pé.{{/emphasis}}"
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, a mão de Auxílio te salvou. Você não precisa vencer sozinho." }
    ],
    choices: [
      {
        text: "Levantar a cabeça e seguir — você ainda está vivo",
        nextChapterId: "fase3-cena8",
        effects: { fe: 1, coragem: 1 },
        conditionalEffects: [
          { attr: "perseveranca", threshold: 7, bonus: { coragem: 2 }, penalty: {} }
        ]
      },
      {
        text: "Sentar entre os esqueletos e chorar",
        nextChapterId: "fase3-cena9",
        effects: { coragem: -1 },
        conditionalEffects: [
          { attr: "fe", threshold: 4, bonus: {}, penalty: { fe: -1 } }
        ]
      }
    ]
  },

  "fase3-cena10": {
    id: "fase3-cena10",
    title: "Rumo à Feira",
    location: "Estrada para a Feira da Vaidade",
    characters: ["cristao", "fiel"],
    narrative: [
      "{{heart}}Com Fiel ao seu lado, a estrada parece menos solitária.{{/heart}} Vocês conversam sobre o vale, sobre Apolião, sobre as lições do Intérprete.",
      "{{emphasis}}\"A Feira da Vaidade fica adiante\"{{/emphasis}}, diz Fiel com seriedade. {{dialog}}\"Lá, tudo tem um preço. Tudo está à venda. Menos uma coisa: a Verdade.\"{{/dialog}}",
      "Ele te olha: {{whisper}}\"Quando chegarmos lá, vão nos odiar. Porque não queremos comprar o que eles vendem.\"{{/whisper}}"
    ],
    flagNarrative: [
      { flag: "enfrentou_presenca", text: "Fiel te olha com respeito: \"Ouvi que você enfrentou Apolião face a face. Poucos sobrevivem a isso. Será preciso a mesma coragem na Feira.\"" }
    ],
    choices: [
      {
        text: "Seguir para a Feira, preparado para o que vier",
        nextChapterId: "fase4-cena1",
        effects: { perseveranca: 1, coragem: 1 }
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 4: A FEIRA DA VAIDADE
  // Baseado no episódio da Vanity Fair de Bunyan
  // ═══════════════════════════════════════════

  "fase4-cena1": {
    id: "fase4-cena1",
    title: "A Feira da Vaidade",
    location: "Feira da Vaidade",
    characters: ["cristao", "fiel"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'O barulho da feira é ensurdecedor...' },
    narrative: [
      "{{tremor}}O barulho atinge você antes de ver a feira.{{/tremor}} Gritos de vendedores, música, gargalhadas. A Feira da Vaidade existe há séculos — fundada por Belzebu, Apolião e Legião quando descobriram que o caminho dos peregrinos passava por esta cidade.",
      "Aqui, tudo está à venda: casas, terras, honras, títulos, reinos, prazeres, esposas, maridos, corpos, almas. {{fade}}As barracas se estendem até onde a vista alcança.{{/fade}}",
      "Ao entrarem, vocês causam comoção. Suas roupas são diferentes. Seu idioma — a língua de Canaã — soa estranho. E quando os vendedores gritam: {{dialog}}\"O que desejam comprar?\"{{/dialog}}, vocês respondem: {{divine}}\"Compramos apenas a Verdade.\"{{/divine}}"
    ],
    replayNarrative: [
      "A feira continua a mesma — barulhenta, sedutora, hostil. Mas você já sabe o preço que ela cobra. Da última vez, Fiel pagou com a vida. O que mudará agora?"
    ],
    flagNarrative: [
      { flag: "enfrentou_vale", text: "Depois de Apolião e do vale da sombra, a feira parece quase trivial. Mas o perigo aqui é diferente — não são garras, são sorrisos." }
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Seus olhos treinados veem além das fachadas brilhantes. Cada barraca é uma armadilha disfarçada de oferta.", lowThreshold: 3, lowText: "As cores, os sons, os aromas — tudo é intoxicante. É difícil lembrar por que você está aqui." },
      { attr: "fe", highThreshold: 7, highText: "Sua fé funciona como um filtro. Você vê o que realmente se esconde sob a beleza superficial da feira.", lowThreshold: 3, lowText: "Uma voz interior sussurra: talvez o que buscam aqui não seja tão diferente do que você busca..." }
    ],
    choices: [
      {
        text: "Manter os olhos fixos no caminho, sem parar nas barracas",
        nextChapterId: "fase4-cena2",
        effects: { discernimento: 1, fe: 1 },
        flag: "observou_feira",
        conditionalEffects: [
          { attr: "discernimento", threshold: 6, bonus: { discernimento: 1 }, penalty: {} }
        ]
      },
      {
        text: "Parar para olhar — talvez haja algo útil para a jornada",
        nextChapterId: "fase4-cena3",
        effects: { fe: -1 },
        flag: "envolveu_feira"
      }
    ]
  },

  "fase4-cena2": {
    id: "fase4-cena2",
    title: "O Escárnio",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 3000, message: 'A multidão se volta contra vocês!' },
    narrative: [
      "{{tremor}}Sua recusa em comprar provoca escárnio. Vendedores zombam. A multidão começa a cercá-los.{{/tremor}} Alguns cospem em vocês. Outros jogam lama.",
      "{{shout}}\"Loucos!\"{{/shout}}, gritam. {{villain}}\"Fanáticos! Quem vem à feira e não compra nada?\"{{/villain}}",
      "{{heart}}Fiel permanece firme ao seu lado. Seu rosto sangra onde uma pedra o atingiu, mas ele não recua.{{/heart}}"
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_estreito", text: "O caminho estreito te ensinou a suportar dor. Os espinhos daquela trilha te prepararam para as pedras desta feira." }
    ],
    choices: [
      {
        text: "Suportar o escárnio em silêncio, como Fiel",
        nextChapterId: "fase4-cena4",
        effects: { perseveranca: 1, fe: 1 }
      },
      {
        text: "Tentar argumentar com a multidão",
        nextChapterId: "fase4-cena5",
        effects: { coragem: 1, discernimento: -1 }
      }
    ]
  },

  "fase4-cena3": {
    id: "fase4-cena3",
    title: "A Sedução da Feira",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'suspense', delay: 300, duration: 2000, message: 'As ofertas brilham ao seu redor...' },
    narrative: [
      "{{fade}}As barracas oferecem tudo que seu coração poderia desejar.{{/fade}} Comida abundante, roupas finas, poder, reconhecimento. {{villain}}Vendedores sorriem e dizem: \"Apenas prove. Sem compromisso.\"{{/villain}}",
      "{{heart}}Fiel te puxa pelo braço:{{/heart}} {{dialog}}\"Cristão, lembre-se do homem na gaiola de ferro. Ele também começou apenas olhando.\"{{/dialog}}"
    ],
    adaptiveNarrative: [
      { minAttr: "fe", minValue: 8, text: "Sua fé resiste. Mesmo diante da beleza das ofertas, algo dentro de você reconhece: nada aqui vale o pergaminho no seu bolso." }
    ],
    choices: [
      {
        text: "Ouvir Fiel e se afastar das barracas",
        nextChapterId: "fase4-cena4",
        effects: { coragem: 1, fe: 1 }
      },
      {
        text: "Ficar mais um pouco — apenas olhando",
        nextChapterId: "fase4-cena5",
        effects: { fe: -1, discernimento: -1 }
      }
    ]
  },

  "fase4-cena4": {
    id: "fase4-cena4",
    title: "O Julgamento",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 4000, message: 'O tribunal se ergue diante de vocês!' },
    narrative: [
      "{{tremor}}A confusão cresce. Os donos da feira decidem prender vocês.{{/tremor}} São levados a um tribunal presidido pelo juiz {{villain}}Ódio-ao-Bem{{/villain}}. O júri é formado por Cego, Sem-Bem, Malícia, Luxúria, Vive-no-Prazer, Imprudente e outros.",
      "As acusações: {{emphasis}}perturbação do comércio, desprezo pela cultura local, e influência perigosa sobre cidadãos honestos.{{/emphasis}}",
      "{{divine}}Fiel é chamado primeiro. Ele fala com coragem: \"Tudo que se opõe à verdade se opõe ao Rei dos reis. Eu respondo apenas a Ele.\"{{/divine}}"
    ],
    flagNarrative: [
      { flag: "enfrentou_presenca", text: "Você enfrentou Apolião. Este tribunal é assustador, mas os juízes são humanos — não monstros." }
    ],
    choices: [
      {
        text: "Defender Fiel publicamente, arriscando sua própria vida",
        nextChapterId: "fase4-cena6",
        effects: { coragem: 2, fe: 1 },
        flag: "permaneceu_diferente",
        item: "pedra_memorial",
        conditionalEffects: [
          { attr: "coragem", threshold: 6, bonus: { perseveranca: 1 }, penalty: {} }
        ]
      },
      {
        text: "Permanecer em silêncio para não chamar atenção",
        nextChapterId: "fase4-cena5",
        effects: { coragem: -1, fe: -1 }
      }
    ]
  },

  "fase4-cena5": {
    id: "fase4-cena5",
    title: "O Preço do Silêncio",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 2, duration: 2500, message: 'A pressão aumenta...' },
    narrative: [
      "{{fade}}Seu silêncio não te protege. A multidão te identifica como companheiro de Fiel.{{/fade}} {{tremor}}A pressão aumenta. Olhares hostis de todos os lados.{{/tremor}}",
      "{{heart}}Fiel olha para você. Seus olhos não acusam — mas perguntam: \"Onde está sua coragem?\"{{/heart}}"
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 7, highText: "A vergonha te atinge como um golpe. Você enfrentou Apolião e agora se esconde de comerciantes?", lowThreshold: 3, lowText: "O medo te congela. São tantos contra vocês dois. O que um pode fazer?" }
    ],
    choices: [
      {
        text: "Encontrar a coragem e falar em defesa da verdade",
        nextChapterId: "fase4-cena6",
        effects: { coragem: 2, fe: 1 },
        flag: "permaneceu_diferente"
      },
      {
        text: "Tentar se misturar com a multidão",
        nextChapterId: "fase4-cena7",
        effects: { fe: -2, discernimento: -1 }
      }
    ]
  },

  "fase4-cena6": {
    id: "fase4-cena6",
    title: "O Martírio de Fiel",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 3, duration: 5000, message: 'O fogo consome a estaca...' },
    narrative: [
      "{{tremor}}O tribunal condena Fiel.{{/tremor}} Ele é açoitado, apedrejado, esfaqueado e, por fim, queimado na estaca. {{heart}}Fiel não grita de dor. Seu rosto, mesmo no fogo, irradia paz.{{/heart}}",
      "{{divine}}Bunyan escreveu que uma carruagem celestial desceu e levou Fiel através das nuvens, ao som de trombetas, direto para a Porta Celestial.{{/divine}}",
      "{{fade}}Você está sozinho novamente. Mas o sacrifício de Fiel muda algo em você. Se ele suportou a morte sem recuar, o que é o desconforto diante disso?{{/fade}}"
    ],
    flagNarrative: [
      { flag: "permaneceu_diferente", text: "Você defendeu Fiel. Ele morreu sabendo que seu companheiro não o abandonou. Essa memória te fortalecerá para sempre." }
    ],
    choices: [
      {
        text: "Continuar a jornada em honra de Fiel",
        nextChapterId: "fase4-cena8",
        effects: { fe: 2, perseveranca: 1 }
      },
      {
        text: "Questionar se a jornada vale tanto sofrimento",
        nextChapterId: "fase4-cena7",
        effects: { fe: -1, coragem: -1 }
      }
    ]
  },

  "fase4-cena7": {
    id: "fase4-cena7",
    title: "A Tentação de Desistir",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 1, duration: 2000, message: 'A solidão pesa sem Fiel...' },
    narrative: [
      "{{fade}}Sem Fiel, a solidão é esmagadora.{{/fade}} Os vendedores da feira percebem sua fraqueza e se aproximam com ofertas mais tentadoras.",
      "{{villain}}\"Fique conosco. Aqui ninguém te persegue. Aqui, o fardo não existe. Aqui, não há vales escuros nem rios para atravessar.\"{{/villain}}",
      "{{emphasis}}O homem na gaiola de ferro surge na sua memória. Ele também achou que podia ficar \"só um pouco\".{{/emphasis}}"
    ],
    adaptiveNarrative: [
      { minAttr: "discernimento", minValue: 7, text: "Seu discernimento grita: este é exatamente o momento que o Intérprete te mostrou. O fogo tentam apagar — mas a mão oculta continua alimentando." }
    ],
    choices: [
      {
        text: "Recusar tudo e sair da feira",
        nextChapterId: "fase4-cena8",
        effects: { fe: 1, coragem: 1 }
      },
      {
        text: "Ficar mais um dia — só para descansar",
        nextChapterId: "fase4-cena9",
        effects: { fe: -2, perseveranca: -1 }
      }
    ]
  },

  "fase4-cena8": {
    id: "fase4-cena8",
    title: "Esperança, o Novo Companheiro",
    location: "Saída da Feira",
    characters: ["cristao", "esperanca"],
    sceneEvent: { type: 'suspense', delay: 300, duration: 2000, message: 'Alguém se aproxima por trás...' },
    narrative: [
      "Na saída da feira, alguém te alcança. Seu nome é {{emphasis}}Esperança{{/emphasis}}. Ele viu tudo — o julgamento, o martírio de Fiel, sua coragem (ou falta dela).",
      "{{dialog}}\"O sacrifício de Fiel me convenceu\"{{/dialog}}, diz Esperança. {{heart}}\"Quero seguir o mesmo caminho. Posso ir com você?\"{{/heart}}",
      "{{divine}}Bunyan nos diz que a morte de Fiel converteu mais pessoas na feira do que anos de pregação teriam feito. O sangue do mártir é semente.{{/divine}}"
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As lições do Intérprete ganham peso: o fogo não apagou. O sangue de Fiel é o óleo que alimenta a chama." },
      { flag: "permaneceu_diferente", text: "Esperança diz: \"Vi você defender Fiel quando todos se calaram. Foi isso que me deu coragem para sair.\"" }
    ],
    choices: [
      {
        text: "Aceitar Esperança como companheiro e seguir adiante",
        nextChapterId: "fase4-cena10",
        effects: { fe: 1, perseveranca: 1 },
        flag: "aceitou_custo_feira",
        conditionalEffects: [
          { attr: "fe", threshold: 6, bonus: { coragem: 1 }, penalty: { coragem: -1 } }
        ]
      },
      {
        text: "Preferir seguir sozinho — companheiros morrem",
        nextChapterId: "fase4-cena10",
        effects: { coragem: -1, fe: -1 }
      }
    ]
  },

  "fase4-cena9": {
    id: "fase4-cena9",
    title: "Preso na Feira",
    location: "Feira da Vaidade",
    characters: ["cristao"],
    sceneEvent: { type: 'tension', intensity: 1, duration: 3000, message: 'Os dias se perdem na feira...' },
    narrative: [
      "{{fade}}Um dia se torna dois. Dois se tornam uma semana.{{/fade}} As barracas se tornam familiares. O caminho se torna uma memória distante.",
      "{{whisper}}O pergaminho no seu bolso parece mais leve — não porque o destino está mais perto, mas porque você quase esqueceu que ele existe.{{/whisper}}",
      "{{tremor}}Uma noite, acordando em suor, as palavras do livro queimam novamente na sua mente:{{/tremor}} {{divine}}\"Fugi da ira vindoura.\"{{/divine}}"
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, você aprendeu a pedir ajuda. Talvez precise fazer isso novamente — antes que a gaiola de ferro se feche." }
    ],
    choices: [
      {
        text: "Abandonar a feira agora, antes que seja tarde",
        nextChapterId: "fase4-cena8",
        effects: { discernimento: 1, fe: 1 }
      },
      {
        text: "Mais um dia não fará diferença...",
        nextChapterId: "fase4-cena9",
        effects: { fe: -1 }
      }
    ]
  },

  "fase4-cena10": {
    id: "fase4-cena10",
    title: "O Legado de Fiel",
    location: "Estrada além da Feira",
    characters: ["cristao"],
    sceneEvent: { type: 'suspense', delay: 500, duration: 2500, message: 'O silêncio carrega o peso do sacrifício...' },
    narrative: [
      "{{fade}}A feira fica para trás. A estrada é silenciosa novamente.{{/fade}} Mas o silêncio não é vazio — está cheio de tudo que aconteceu.",
      "{{heart}}Fiel morreu. Mas Esperança nasceu do seu sacrifício.{{/heart}} E você carrega a memória de ambos como uma tocha.",
      "{{dialog}}\"Para onde vamos agora?\"{{/dialog}}, pergunta Esperança. Você aponta para frente: {{emphasis}}\"Para a Cidade Celestial. Não importa o que estiver no caminho.\"{{/emphasis}}"
    ],
    flagNarrative: [
      { flag: "aceitou_custo_feira", text: "O custo da feira foi alto — o mais alto até agora. Mas você pagou e seguiu. Isso é fé." }
    ],
    choices: [
      {
        text: "Seguir para o próximo trecho da jornada",
        nextChapterId: "fase4-cena11b",
        effects: { fe: 1, perseveranca: 1 }
      }
    ]
  },

  "fase4-cena11b": {
    id: "fase4-cena11b",
    title: "Demas e a Mina de Prata",
    location: "Colina de Lucro",
    characters: ["cristao", "esperanca", "demas"],
    sceneEvent: { type: 'suspense', delay: 500, duration: 2000, message: 'Uma luz prateada brilha na colina...' },
    narrative: [
      "Na estrada, um homem acena de uma colina próxima. Seu nome é {{emphasis}}Demas{{/emphasis}}. Ao seu lado, a entrada de uma mina brilha com veios de prata.",
      "{{villain}}\"Peregrinos! Venham ver! Há uma mina de prata aqui — basta cavar um pouco e ficarão ricos! Muitos peregrinos já se desviaram para cá. É seguro.\"{{/villain}}",
      "{{dialog}}Esperança te puxa: \"Ouvi dizer que essa mina é traiçoeira. O chão cede, e quem entra raramente sai.\"{{/dialog}}",
      "{{whisper}}Bunyan nos diz que Demas era descendente de Geazi e de Judas — homens que venderam a eternidade por prata.{{/whisper}}"
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "A prata brilha, mas você reconhece o brilho: é o mesmo das barracas da feira. Beleza superficial escondendo ruína.", lowThreshold: 3, lowText: "A prata é real. Brilha ao sol. E você está tão cansado de caminhar sem nada..." }
    ],
    flagNarrative: [
      { flag: "rejeitou_interesses", text: "Interesses teria corrido para essa mina. Sua decisão de rejeitá-lo se prova sábia." },
      { flag: "envolveu_feira", text: "A feira já te seduziu uma vez. Esta mina é a mesma armadilha com outro rosto." }
    ],
    choices: [
      {
        text: "\"Sua mina é uma cova. O preço da prata é a alma.\"",
        nextChapterId: "fase4-cena11",
        effects: { fe: 2, discernimento: 1 },
        flag: "rejeitou_demas"
      },
      {
        text: "Ir olhar a mina — só uma espiada",
        nextChapterId: "fase4-cena11",
        effects: { fe: -2, discernimento: -1 },
        flag: "cedeu_demas"
      }
    ]
  },

  "fase4-cena11": {
    id: "fase4-cena11",
    title: "Interesses, o Companheiro Conveniente",
    location: "Estrada além da Feira",
    characters: ["cristao", "esperanca", "interesses"],
    narrative: [
      "Na estrada, um homem bem-vestido se junta a vocês. Seu nome é {{emphasis}}Interesses{{/emphasis}}, da cidade de Bom-Discurso. Ele é primo do Sr. Volta-Suave e sobrinho do Sr. Duas-Línguas.",
      "{{dialog}}\"Também sou peregrino!\"{{/dialog}}, diz ele sorrindo. {{villain}}\"Mas confesso que prefiro seguir a religião quando ela caminha com chinelos de prata — sob o sol, com aplausos do povo.\"{{/villain}}",
      "{{whisper}}Esperança te cutuca: \"Pergunte a ele se seguiria a religião descalço, na chuva, sem plateia.\"{{/whisper}}"
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Você reconhece o tipo. Interesses ama a religião como ornamento, não como sacrifício. Sua fé é uma roupa para dias de sol.", lowThreshold: 3, lowText: "O homem parece razoável. Por que sofrer quando se pode servir a Deus com conforto?" }
    ],
    choices: [
      {
        text: "\"A fé que não custa nada não vale nada. Adeus, Interesses.\"",
        nextChapterId: "fase4-cena12",
        effects: { fe: 2, discernimento: 1 },
        flag: "rejeitou_interesses"
      },
      {
        text: "Deixar Interesses caminhar junto — companhia é companhia",
        nextChapterId: "fase4-cena12",
        effects: { discernimento: -1, fe: -1 }
      }
    ]
  },

  "fase4-cena12": {
    id: "fase4-cena12",
    title: "Pequena-Fé Assaltado",
    location: "Caminho Estreito",
    characters: ["cristao", "esperanca", "pequena_fe"],
    narrative: [
      "Na estrada, encontram um homem esfarrapado sentado numa pedra, chorando. Seu nome é Pequena-Fé, da cidade de Sinceridade.",
      "\"Três ladrões me atacaram\", soluça ele. \"Coração-Fraco, Desconfiança e Culpa. Roubaram todo o meu dinheiro. Quase levaram meu pergaminho — mas o esconderam-se quando ouviram uma voz de Grande-Graça ao longe.\"",
      "Esperança sussurra: \"Ele ainda tem o pergaminho. Ainda pode entrar na cidade. Mas caminha como um mendigo quando poderia caminhar como um príncipe.\""
    ],
    flagNarrative: [
      { flag: "rejeitou_interesses", text: "Interesses teria rido de Pequena-Fé. Você fez bem em se separar dele." },
      { flag: "escapou_castelo_fe", text: "Pequena-Fé nunca encontrou a chave da Promessa. Ela teria mudado tudo para ele." }
    ],
    choices: [
      {
        text: "Encorajar Pequena-Fé: \"O pergaminho é o que importa. Levante-se.\"",
        nextChapterId: "fase5-cena1",
        effects: { fe: 1, perseveranca: 1 },
        flag: "mostrou_misericordia"
      },
      {
        text: "Julgar Pequena-Fé: \"Deveria ter lutado mais\"",
        nextChapterId: "fase5-cena1",
        effects: { coragem: 1, fe: -1 }
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 5: O CASTELO DA DÚVIDA
  // Baseado no Castelo do Gigante Desespero
  // ═══════════════════════════════════════════

  "fase5-cena1": {
    id: "fase5-cena1",
    title: "O Desvio Fatal",
    location: "Prado Agradável",
    characters: ["cristao", "esperanca"],
    narrative: [
      "O caminho se torna pedregoso e doloroso para os pés. Ao lado da estrada, um prado verde e macio corre paralelo — o Prado Agradável. Uma cerca baixa é a única separação.",
      "\"Olhe\", diz Esperança. \"O prado segue na mesma direção. Podemos caminhar na grama e voltar ao caminho depois.\"",
      "Parece sensato. Os pés sangram. A grama é suave. A cerca é fácil de pular. Mas Bunyan nos avisa: desviar-se, mesmo um passo, do caminho estreito é o começo da ruína."
    ],
    replayNarrative: [
      "O prado está ali de novo, verde e convidativo. Da última vez, você sabe — ou deveria saber — para onde ele leva. O Castelo da Dúvida espera quem se desvia."
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Algo está errado. O prado é perfeito demais. Nada na jornada foi fácil — por que seria agora?", lowThreshold: 3, lowText: "A grama é tão macia... e o caminho, tão duro. Qual o mal em descansar os pés?" }
    ],
    flagNarrative: [
      { flag: "escolheu_caminho_facil", text: "Na encruzilhada, o caminho fácil quase te destruiu. E agora outro desvio se apresenta..." }
    ],
    choices: [
      {
        text: "Resistir à tentação e continuar na estrada pedregosa",
        nextChapterId: "fase5-cena10",
        effects: { discernimento: 2, perseveranca: 1 },
        flag: "resistiu_prado"
      },
      {
        text: "Pular a cerca e caminhar no prado",
        nextChapterId: "fase5-cena2",
        effects: { discernimento: -1 },
        flag: "reconheceu_erro_castelo"
      }
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
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Mesmo nas garras do gigante, uma voz interior insiste: há saída. Sempre há.", lowThreshold: 3, lowText: "O gigante é imenso. Sua voz faz o chão tremer. Toda esperança parece morrer." }
    ],
    choices: [
      {
        text: "Suplicar por misericórdia",
        nextChapterId: "fase5-cena4",
        effects: { fe: 1, coragem: -1 }
      },
      {
        text: "Resistir em silêncio",
        nextChapterId: "fase5-cena3",
        effects: { perseveranca: 1 }
      }
    ]
  },

  "fase5-cena3": {
    id: "fase5-cena3",
    title: "A Masmorra",
    location: "Castelo da Dúvida",
    characters: ["cristao", "gigante_desespero"],
    narrative: [
      "O Gigante Desespero os arrasta para seu castelo e os joga numa masmorra escura, fétida e sem esperança. Não há luz. Não há comida. Apenas pedra úmida e correntes.",
      "A esposa do gigante, Desconfiança, sussurra ao marido: \"Bata neles pela manhã. Faça-os desejar nunca ter nascido.\"",
      "Na escuridão, Esperança murmura: \"Cristão... o que fizemos?\""
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 6, highText: "Mesmo acorrentado, algo em você se recusa a quebrar. Você já enfrentou Apolião. Este gigante é grande, mas não é invencível.", lowThreshold: 3, lowText: "As correntes pesam. A escuridão é total. Você se pergunta se alguém sequer sabe que está aqui." }
    ],
    flagNarrative: [
      { flag: "enfrentou_presenca", text: "No vale, você enfrentou algo pior que esse gigante. A lembrança te dá uma faísca de resistência." }
    ],
    choices: [
      {
        text: "Encorajar Esperança: \"Já sobrevivemos coisas piores\"",
        nextChapterId: "fase5-cena4",
        effects: { coragem: 1, fe: 1 }
      },
      {
        text: "Desabar no chão em silêncio",
        nextChapterId: "fase5-cena5",
        effects: { perseveranca: -1 }
      }
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
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Você analisa: o gigante quer que desistam. Se a situação fosse sem saída, ele não precisaria convencer.", lowThreshold: 3, lowText: "As palavras do gigante ecoam: acabar com tudo... seria tão fácil... a dor pararia..." }
    ],
    choices: [
      {
        text: "Recusar com firmeza: \"Matar-se é pecado. Não faremos isso.\"",
        nextChapterId: "fase5-cena6",
        effects: { discernimento: 1, fe: 1 },
        conditionalEffects: [
          { attr: "discernimento", threshold: 6, bonus: { fe: 1 }, penalty: {} }
        ]
      },
      {
        text: "Considerar a proposta — a dor é demais",
        nextChapterId: "fase5-cena5",
        effects: { fe: -2 }
      }
    ]
  },

  "fase5-cena5": {
    id: "fase5-cena5",
    title: "O Abismo do Desespero",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "A escuridão da masmorra penetra sua alma. O gigante tem razão? Todo o sofrimento, toda a luta — para quê?",
      "Esperança te sacode: \"Cristão! Lembre-se da cruz! Lembre-se do fardo que caiu! Lembre-se de Fiel, que morreu sem recuar! Vamos desistir quando estamos tão perto?\"",
      "As palavras perfuram a névoa do desespero como agulhas de luz."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 6, highText: "No fundo, uma chama resiste. O fogo que o Intérprete mostrou — o fogo que não apaga. Ele ainda está ali.", lowThreshold: 3, lowText: "A escuridão é quase completa. A chama bruxuleia, prestes a se apagar." },
      { attr: "perseveranca", highThreshold: 6, highText: "Sua persistência te impede de desistir. Cada passo da jornada te preparou para resistir este momento.", lowThreshold: 3, lowText: "Você está exausto. A vontade de desistir é quase irresistível." }
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, a ajuda veio quando você pediu. Talvez não esteja tão sozinho quanto pensa." }
    ],
    choices: [
      {
        text: "Agarrar-se às palavras de Esperança e resistir",
        nextChapterId: "fase5-cena6",
        effects: { fe: 1, coragem: 1 },
        conditionalEffects: [
          { attr: "fe", threshold: 5, bonus: { coragem: 1 }, penalty: { coragem: -1 } }
        ]
      },
      {
        text: "Afundar no desespero",
        nextChapterId: "fase5-cena7",
        effects: { fe: -2 }
      }
    ]
  },

  "fase5-cena6": {
    id: "fase5-cena6",
    title: "A Chave da Promessa",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "Na terceira noite, enquanto oram, Cristão dá um salto: {{shout}}\"Que tolo eu sou! Tenho no meu peito uma chave chamada Promessa. Ela pode abrir qualquer fechadura do Castelo da Dúvida!\"{{/shout}}",
      "Esperança se anima: {{dialog}}\"Tire-a, irmão! Experimente!\"{{/dialog}}",
      "{{heart}}Com mãos trêmulas, você tira a chave — as promessas de Deus, guardadas durante toda a jornada.{{/heart}} Cada lição, cada versículo, cada momento de fé solidificou essa chave.",
      "{{divine}}Ela gira na fechadura. A porta se abre.{{/divine}}"
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "As lições do Intérprete iluminam sua mente. A poeira, o fogo, o palácio — tudo converge neste momento.", lowThreshold: 3, lowText: "Você mal acredita que a chave existe. Mas ela está nas suas mãos." }
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As visões do Intérprete retornam com força: a poeira e a graça, o fogo alimentado secretamente, o homem corajoso no palácio. Cada visão era uma peça desta chave." },
      { flag: "reconheceu_erro_castelo", text: "Reconhecer o erro no prado foi o primeiro passo. A chave é o segundo. Humildade abre portas que orgulho tranca." }
    ],
    choices: [
      {
        text: "Usar a Chave da Promessa e fugir do castelo",
        nextChapterId: "fase5-cena8",
        effects: { fe: 2, discernimento: 2 },
        flag: "escapou_castelo_fe",
        item: "chave_promessa",
        conditionalEffects: [
          { attr: "perseveranca", threshold: 7, bonus: { fe: 1 }, penalty: {} }
        ]
      },
      {
        text: "Hesitar — e se a chave não funcionar na próxima porta?",
        nextChapterId: "fase5-cena7",
        effects: { coragem: -1 }
      }
    ]
  },

  "fase5-cena7": {
    id: "fase5-cena7",
    title: "Os Portões do Castelo",
    location: "Castelo da Dúvida",
    characters: ["cristao"],
    narrative: [
      "A masmorra se fecha ao redor de vocês. As paredes parecem encolher. O Gigante Desespero ruge nos corredores superiores.",
      "Esperança repete baixinho: \"A chave. Use a chave. Toda promessa de Deus é sim e amém.\"",
      "O som de passos pesados se aproxima. O gigante está descendo."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Impossível não é sem esperança. A chave ainda está no seu peito. Use-a.", lowThreshold: 2, lowText: "Você não acredita mais em nada. A masmorra venceu?" }
    ],
    choices: [
      {
        text: "Usar a Chave da Promessa antes que o gigante chegue",
        nextChapterId: "fase5-cena6",
        effects: { fe: 1 }
      },
      {
        text: "Fechar os olhos e esperar o golpe",
        nextChapterId: "fase5-cena7",
        effects: {}
      }
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
    ],
    toneNarrative: [
      { attr: "coragem", highThreshold: 6, highText: "Sem hesitar, você planta um marco de aviso na estrada: \"Este é o caminho para o Castelo da Dúvida. Nenhum peregrino deve pisar aqui.\"", lowThreshold: 3, lowText: "Com as mãos tremendo, você marca o caminho para que outros não cometam o mesmo erro." }
    ],
    choices: [
      {
        text: "Erguer um pilar de aviso para futuros peregrinos",
        nextChapterId: "fase5-cena9",
        effects: { coragem: 1, discernimento: 1 }
      }
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
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "Ao ver a Cidade Celestial, mesmo à distância, seus olhos se enchem de lágrimas. Todo sofrimento tem um propósito. O fim está à vista.", lowThreshold: 4, lowText: "Você olha pela luneta, mas a cidade parece distante demais. Será que realmente chegará lá?" }
    ],
    choices: [
      {
        text: "Agradecer aos pastores e seguir para o último trecho",
        nextChapterId: "fase5-cena10",
        effects: { fe: 1, perseveranca: 1 }
      }
    ]
  },

  "fase5-cena10": {
    id: "fase5-cena10",
    title: "A Lição do Castelo",
    location: "Além das Montanhas",
    characters: ["cristao"],
    narrative: [
      "O castelo ensinou uma verdade que o Intérprete não pôde mostrar — porque só se aprende na dor: a promessa de Deus é uma chave que abre qualquer prisão, mas você precisa se lembrar de usá-la.",
      "Fiel morreu, mas seu legado vive em Esperança. O prado era bonito, mas levava à masmorra. O gigante era grande, mas a chave era maior.",
      "A Cidade Celestial espera. Há apenas um obstáculo final: o Rio."
    ],
    flagNarrative: [
      { flag: "escapou_castelo_fe", text: "A chave da Promessa salvou você. Não por méritos, não por força — pela fé que se lembrou das promessas quando tudo parecia perdido." },
      { flag: "reconheceu_erro_castelo", text: "O erro do prado quase custou tudo. Mas a graça transformou até o erro em lição. Humildade abre onde orgulho tranca." }
    ],
    choices: [
      {
        text: "Caminhar em direção ao próximo trecho",
        nextChapterId: "fase5-cena11",
        effects: { perseveranca: 1, fe: 1 }
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 5B: LISONJEIRO, ATEÍSMO, TERRA ENCANTADA, BEULÁ
  // Episódios reais entre as Montanhas e o Rio
  // ═══════════════════════════════════════════

  "fase5-cena11": {
    id: "fase5-cena11",
    title: "A Rede do Lisonjeiro",
    location: "Caminho Estreito",
    characters: ["cristao", "esperanca", "lisonjeiro"],
    narrative: [
      "Além das montanhas, o caminho se divide. Vocês hesitam. Um homem de pele escura, vestido com uma túnica branca brilhante, se aproxima sorrindo.",
      "\"Amigos peregrinos! Vocês parecem perdidos. Eu conheço o caminho para a Cidade Celestial. Sigam-me.\"",
      "Sua voz é doce, seu sorriso convincente. Ele os leva por um caminho lateral que parece seguro — até que uma rede cai sobre vocês, prendendo-os completamente."
    ],
    toneNarrative: [
      { attr: "discernimento", highThreshold: 7, highText: "Algo no sorriso dele te incomoda. Os pastores alertaram sobre o Adulador. Este homem... será ele?", lowThreshold: 3, lowText: "O homem parece confiável. Sua túnica branca irradia autoridade. Por que duvidar?" }
    ],
    choices: [
      {
        text: "Perceber a armadilha e tentar se libertar",
        nextChapterId: "fase5-cena12",
        effects: { discernimento: 2, fe: 1 },
        flag: "escapou_lisonjeiro",
        conditionalEffects: [
          { attr: "discernimento", threshold: 6, bonus: { coragem: 1 }, penalty: {} }
        ]
      },
      {
        text: "Confiar no homem — ele parece sincero",
        nextChapterId: "fase5-cena12",
        effects: { discernimento: -2, fe: -1 },
        flag: "caiu_na_rede"
      }
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
    ],
    flagNarrative: [
      { flag: "caiu_na_rede", text: "A vergonha da rede ainda arde. E agora este homem diz que a cidade nem existe? A dúvida é uma ferida aberta." },
      { flag: "escapou_lisonjeiro", text: "Você escapou da rede porque desconfiou. Agora, desconfie também deste riso fácil demais." }
    ],
    choices: [
      {
        text: "\"Nós vimos a cidade da luneta dos pastores. Ela é real.\"",
        nextChapterId: "fase5-cena13",
        effects: { fe: 2, coragem: 1 }
      },
      {
        text: "Sentir a dúvida crescer — e se ele tiver razão?",
        nextChapterId: "fase5-cena13",
        effects: { fe: -1, discernimento: -1 }
      }
    ]
  },

  "fase5-cena13": {
    id: "fase5-cena13",
    title: "A Terra Encantada",
    location: "Terra Encantada",
    characters: ["cristao", "esperanca"],
    sceneEvent: { type: 'suspense', duration: 3000, message: 'O ar pesado te envolve...' },
    narrative: [
      "O caminho entra numa região estranha. O ar é pesado, perfumado, intoxicante. Cada passo exige mais esforço. As pálpebras pesam como chumbo.",
      "A Terra Encantada — Bunyan a descreve como um lugar onde o próprio ar faz os peregrinos adormecerem para sempre. Quem dorme aqui, nunca mais acorda.",
      "Esperança começa a cambalear: \"Cristão... estou tão cansado... apenas um momento de descanso...\""
    ],
    toneNarrative: [
      { attr: "perseveranca", highThreshold: 7, highText: "Sua perseverança acumulada te mantém acordado. Cada passo do pântano, cada noite no castelo construiu resistência contra este sono.", lowThreshold: 3, lowText: "O sono é irresistível. As flores ao redor exalam um perfume que adormece a alma. Seus olhos se fecham..." },
      { attr: "fe", highThreshold: 7, highText: "A promessa da cidade te puxa para frente como uma corrente. Você não veio tão longe para dormir à beira do destino.", lowThreshold: 3, lowText: "A cidade... tão longe... o chão parece tão confortável..." }
    ],
    choices: [
      {
        text: "Sacudir Esperança e forçar ambos a caminhar sem parar",
        nextChapterId: "fase5-cena14",
        effects: { perseveranca: 2, coragem: 1 },
        flag: "venceu_terra_encantada"
      },
      {
        text: "Sentar \"só um momento\" para descansar",
        nextChapterId: "fase5-cena14",
        effects: { perseveranca: -2, fe: -1 }
      }
    ]
  },

  "fase5-cena14": {
    id: "fase5-cena14",
    title: "O País de Beulá",
    location: "País de Beulá",
    characters: ["cristao", "esperanca"],
    reflection: "r13",
    narrative: [
      "Além da Terra Encantada, tudo muda. O ar se torna doce — não intoxicante, mas revigorante. Flores de todas as cores cobrem os campos. Árvores carregadas de frutos dourados bordam o caminho.",
      "Este é o País de Beulá — a terra onde o sol nunca se põe, onde os pássaros cantam sem cessar, e onde o perfume das flores vem do próprio jardim do Rei.",
      "Bunyan escreveu que aqui os peregrinos ouviam continuamente vozes cantando: 'Dize à filha de Sião: Eis que vem o teu Salvador.' A Cidade Celestial brilha no horizonte, tão perto que seus portões são visíveis a olho nu."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "As lágrimas rolam livremente. Não de dor — de alegria absoluta. Tudo pelo que você lutou está diante de seus olhos. A fé virou quase visão.", lowThreshold: 4, lowText: "A beleza é avassaladora. Você não sabia que algo assim era possível. A dúvida se dissolve como névoa ao sol." }
    ],
    flagNarrative: [
      { flag: "venceu_terra_encantada", text: "Você resistiu ao sono encantado. E a recompensa é esta: o País de Beulá, onde não há sono — apenas vida plena." },
      { flag: "escapou_castelo_fe", text: "Do castelo da dúvida à terra da certeza. A chave da Promessa abriu mais do que portas de ferro — abriu seus olhos para ver o que sempre esteve lá." }
    ],
    choices: [
      {
        text: "Descansar em Beulá e seguir renovado para o Rio",
        nextChapterId: "fase6-cena1",
        effects: { fe: 2, perseveranca: 1, coragem: 1 },
        item: "folhas_arvore_vida"
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FASE 6: O RIO E A CIDADE CELESTIAL
  // O clímax da jornada de Cristão em Bunyan
  // ═══════════════════════════════════════════

  "fase6-cena1": {
    id: "fase6-cena1",
    title: "O Rio sem Ponte",
    location: "Margem do Rio",
    characters: ["cristao", "esperanca"],
    narrative: [
      "A Cidade Celestial brilha do outro lado de um rio largo e profundo. Não há ponte. Não há barco. Bunyan nos diz que cada peregrino deve atravessá-lo a pé — e a profundidade varia conforme a fé de cada um.",
      "Esperança olha para a água escura: \"Temos que passar por isso?\"",
      "Você olha para a cidade. As torres brilham. Os portões parecem abertos. Anjos se movem nas muralhas. Tudo pelo que você lutou está ali — separado apenas por esta última travessia."
    ],
    replayNarrative: [
      "O rio. Da última vez, talvez você tenha hesitado. Talvez tenha afundado. Desta vez, o que mudou? Sua fé está mais funda ou mais rasa?"
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "Olhando a água, você sente paz. Não ausência de medo — presença de confiança. A fé acumulada é sua boia.", lowThreshold: 3, lowText: "A água é negra. Profunda. Gelada. Você olha para suas mãos e não vê força suficiente para nadar." },
      { attr: "perseveranca", highThreshold: 8, highText: "Cada passo da jornada — pântano, vale, feira, castelo — construiu músculos invisíveis. Seus pés estão prontos.", lowThreshold: 3, lowText: "A exaustão de toda a jornada cai sobre você de uma vez. O rio parece a gota d'água." }
    ],
    flagNarrative: [
      { flag: "escapou_castelo_fe", text: "No castelo, a chave abriu portas de ferro. O rio não tem portas — mas a mesma fé que girou a chave pode manter seus pés no fundo." },
      { flag: "enfrentou_presenca", text: "Você enfrentou Apolião. Depois dele, a água não parece tão terrível — apenas fria e funda." }
    ],
    choices: [
      {
        text: "Sentar na margem e relembrar a jornada com Esperança",
        nextChapterId: "fase6-cena3",
        effects: { fe: 1 },
        flag: "relembrou_jornada"
      },
      {
        text: "Entrar no rio com os olhos fixos na Cidade",
        nextChapterId: "fase6-cena2",
        effects: { fe: 1, coragem: 1 },
        flag: "avancou_confiante_rio"
      },
      {
        text: "Hesitar na margem, paralisado pelo medo",
        nextChapterId: "fase6-cena4",
        effects: { coragem: -1 }
      }
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
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "As palavras de Esperança penetram. Seus pés encontram rocha firme. A água está até o pescoço, mas você está de pé. A cidade brilha mais forte a cada passo.", lowThreshold: 3, lowText: "A água sobe acima da sua cabeça. Você não sente o fundo. Memórias de todos os fracassos da jornada te puxam para baixo como correntes." },
      { attr: "perseveranca", highThreshold: 8, highText: "Pântano, vale, feira, castelo — cada prova construiu a resistência que agora mantém suas pernas movendo contra a correnteza.", lowThreshold: 3, lowText: "Seu corpo implora para parar. A jornada cobrou tudo que você tinha. O rio quer o que resta." }
    ],
    flagNarrative: [
      { flag: "pediu_ajuda_pantano", text: "No pântano, a mão de Auxílio te salvou. Aqui, a mão de Esperança te sustenta. Você aprendeu: aceitar ajuda não é fraqueza." },
      { flag: "aceitou_custo_feira", text: "Na feira, você pagou com lágrimas. No rio, o preço é confiança total. Cada custo que você aceitou te preparou para este." }
    ],
    choices: [
      {
        text: "Confiar até o fim — mesmo sem sentir o fundo",
        nextChapterId: "fase6-cena5",
        effects: { fe: 2, coragem: 1 },
        flag: "confiou_rio",
        item: "selo_peregrino",
        conditionalEffects: [
          { attr: "fe", threshold: 7, bonus: { perseveranca: 2, coragem: 1 }, penalty: {} }
        ]
      },
      {
        text: "O pânico domina — a água é demais",
        nextChapterId: "fase6-cena4",
        effects: { fe: -2 }
      }
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
    ],
    flagNarrative: [
      { flag: "permaneceu_diferente", text: "\"Você defendeu Fiel na feira\", diz Esperança. \"Essa coragem veio de algum lugar. Ela te carregará pelo rio também.\"" },
      { flag: "entrou_casa_interprete", text: "As visões do Intérprete — poeira e graça, fogo eterno, gaiola de ferro — cada uma foi um degrau que te trouxe até esta margem." },
      { flag: "venceu_terra_encantada", text: "Você venceu o sono da Terra Encantada. O rio é a última prova. Depois dele, não há mais sono — apenas vida." }
    ],
    choices: [
      {
        text: "Orar juntos e entrar no rio com fé",
        nextChapterId: "fase6-cena2",
        effects: { fe: 1, perseveranca: 1 },
        flag: "orou_antes_rio"
      },
      {
        text: "Entrar no rio sem mais delongas",
        nextChapterId: "fase6-cena2",
        effects: { coragem: 1 }
      }
    ]
  },

  "fase6-cena4": {
    id: "fase6-cena4",
    title: "Afundando nas Águas",
    location: "No Rio",
    characters: ["cristao"],
    narrative: [
      "Bunyan descreve este momento com dor: Cristão afunda nas águas escuras. As ondas cobrem sua cabeça. Todos os pecados, medos e dúvidas da jornada convergem.",
      "\"Eu nunca verei a terra dos vivos\", ele geme. \"Nem a cidade que tanto busquei.\"",
      "Mas Esperança não larga sua mão: \"Irmão! Vejo a porta! Há homens esperando por nós do outro lado! Mantenha a cabeça acima da água!\""
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Uma última faísca de fé queima: \"Quando passares pelas águas, estarei contigo.\" A promessa. A chave. Ela funciona até aqui.", lowThreshold: 2, lowText: "A escuridão é completa. A cidade brilha ao longe, inalcançável. Você afunda." }
    ],
    choices: [
      {
        text: "Agarrar-se à promessa e lutar pela superfície",
        nextChapterId: "fase6-cena5",
        effects: { fe: 2, coragem: 1 }
      },
      {
        text: "Soltar a mão de Esperança e se render às águas",
        nextChapterId: "fase6-cena6",
        effects: { coragem: -2, fe: -2 }
      }
    ]
  },

  "fase6-cena5": {
    id: "fase6-cena5",
    title: "O Outro Lado",
    location: "Margem Celestial",
    characters: ["cristao"],
    narrative: [
      "Seus pés tocam solo firme. A água fica para trás. Do outro lado do rio, tudo muda.",
      "Bunyan descreve: os corpos mortais ficaram no rio. As roupas de peregrino se transformam em vestes resplandecentes. Os rostos brilham como o sol.",
      "Dois Seres Resplandecentes os recebem: \"O restante do caminho é plano. A cidade está ali.\""
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 7, highText: "A paz é absoluta. Não é a ausência de dor — é a certeza de que toda dor teve propósito. Cada lágrima, cada ferida, cada noite no castelo.", lowThreshold: 4, lowText: "Você mal acredita. Depois de tudo — o pântano, Apolião, a feira, o castelo, o rio — você está aqui. Isso basta." }
    ],
    choices: [
      {
        text: "Subir a colina em direção aos portões da Cidade Celestial",
        nextChapterId: "fase6-cena7",
        effects: { fe: 1 }
      }
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
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 5, highText: "Mesmo neste fracasso, algo permanece: a convicção de que a cidade é real. Na próxima vez — e haverá uma próxima vez — você estará mais forte.", lowThreshold: 2, lowText: "O silêncio é total. A cidade brilha ao longe, um lembrete do que poderia ter sido." }
    ],
    flagNarrative: [
      { flag: "reconheceu_erro_castelo", text: "No castelo, reconhecer o erro salvou você. O rio te venceu — mas erros reconhecidos viram sabedoria na próxima jornada." }
    ],
    choices: [],
    isEnding: true,
    endingType: "final_bad"
  },

  "fase6-cena7": {
    id: "fase6-cena7",
    title: "Os Portões da Cidade Celestial",
    location: "Cidade Celestial",
    characters: ["cristao"],
    narrative: [
      "{{divine}}A subida até os portões é a parte mais bela de toda a jornada.{{/divine}} O caminho é pavimentado de ouro. Anjos os acompanham. O ar cheira a flores que não existem na terra.",
      "Nos portões, gravada em letras de fogo, a inscrição: {{divine}}\"Bem-aventurados os que entram pelos portões da Cidade.\"{{/divine}}",
      "{{heart}}Você apresenta o pergaminho — o selo que recebeu na cruz.{{/heart}} {{divine}}Os portões se abrem. De dentro, uma multidão incontável canta em boas-vindas.{{/divine}}"
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "As portas se abrem como se te esperassem. Cada decisão de fé ao longo da jornada construiu o caminho até este exato momento.", lowThreshold: 4, lowText: "Você quase não acredita que está aqui. Depois de tudo, depois de tantos quase-desistimentos — os portões se abrem." }
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "As visões do Intérprete ganham sentido pleno. A poeira e a graça, o fogo eterno, o palácio conquistado à espada, a gaiola de ferro — cada lição foi um preparo para este momento." },
      { flag: "permaneceu_diferente", text: "Na feira, você se recusou a comprar o que todos vendiam. Agora, diante dos portões, você entende: a Verdade era a única coisa que valia a pena." }
    ],
    choices: [
      {
        text: "Entrar na Cidade Celestial",
        nextChapterId: "fase6-cena8",
        effects: {}
      }
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
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "A certeza que começou como uma inquietação na Cidade da Destruição agora é visão. Você vê o que antes apenas cria. A fé se transformou em vista.", lowThreshold: 4, lowText: "O caminho foi tortuoso, cheio de dúvidas e desvios. Mas você chegou. E no final, é isso que importa." }
    ],
    choices: [
      {
        text: "Olhar para trás uma última vez",
        nextChapterId: "fase6-cena9",
        effects: {}
      }
    ]
  },

  "fase6-cena9": {
    id: "fase6-cena9",
    title: "A Rejeição de Ignorância",
    location: "Portões da Cidade Celestial",
    characters: ["cristao", "ignorancia"],
    reflection: "r15",
    narrative: [
      "Antes que os portões se fechem, Bunyan mostra uma última cena — a mais solene de todo o livro.",
      "Ignorância chega aos portões. Ele também fez a jornada — mas nunca passou pela Porta Estreita. Nunca carregou o fardo à cruz. Nunca recebeu o pergaminho selado.",
      "\"Boas obras são meu passaporte\", diz ele confiante. Mas quando buscam seu nome no livro, ele não está lá. Os portões não se abrem. Dois Seres Resplandecentes o tomam pelos braços e o levam embora — não para a Cidade, mas para uma porta lateral no monte que leva ao abismo.",
      "Bunyan termina com uma frase que ecoa pelos séculos: \"Então vi que havia um caminho para o inferno, mesmo dos portões do Céu.\"",
      "A jornada terminou. A graça triunfou — não por suas forças, mas pela fidelidade de Quem prometeu."
    ],
    toneNarrative: [
      { attr: "fe", highThreshold: 8, highText: "A cena de Ignorância te faz estremecer mesmo na glória. A graça não é merecida — é recebida. E você a recebeu.", lowThreshold: 4, lowText: "O destino de Ignorância é um aviso final: boas intenções não bastam. A porta estreita existe por uma razão." }
    ],
    flagNarrative: [
      { flag: "entrou_casa_interprete", text: "O Intérprete te mostrou a diferença entre a vassoura e a água, entre a Lei e a Graça. Ignorância confiou na vassoura até o fim." },
      { flag: "confiou_rio", text: "Você confiou nas águas escuras. Ignorância confiou em si mesmo. A diferença é eterna." }
    ],
    choices: [],
    isEnding: true,
    endingType: "final_good"
  }
};

export const getChapter = (id: string): StoryChapter | undefined => storyChapters[id];
export const FIRST_CHAPTER_ID = "cena1";
