// Phase-specific contextual narratives for tile events
// Textos imersivos, retóricos e persuasivos — estilo RPG narrativo

export interface PhaseNarrative {
  [tileType: string]: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

const PHASE_NARRATIVES: Record<number, Record<string, string[]>> = {
  // Phase 0 — Cidade da Destruição → Porta Estreita
  0: {
    refuge: [
      '🏠 Entre ruínas e cinzas, uma porta se abre. Um ancião de olhar bondoso estende a mão: "Descanse aqui, peregrino. O caminho à frente exigirá tudo de você — mas não precisa partir exausto." Suas forças são renovadas como quem bebe de uma fonte escondida no deserto.',
      '🏠 Auxílio emerge do pântano lamacento e agarra firme a mão do viajante. "Eu conheço este lugar — muitos afundaram aqui por falta de coragem. Mas você não." Com um puxão firme, te coloca em terra firme. O ar fresco enche seus pulmões como uma promessa.',
    ],
    trap: [
      '🔙 A lama do Pântano do Desânimo suga seus pés como mãos invisíveis. Cada passo afunda mais. Vozes sussurram: "Volte... você nunca conseguirá... quem te garantiu que existe algo além?" A dúvida pesa mais que o barro. Você perde terreno.',
      '🔙 Prudência Mundana aparece com sorriso largo e argumentos afiados: "Por que sofrer? Volte para sua cidade, viva confortavelmente, esqueça essa loucura de peregrinação." Suas palavras são veneno doce — e você hesita tempo demais.',
    ],
    blessing: [
      '⭐ Como um raio de sol rompendo nuvens de tempestade, Evangelista surge no caminho. Seu dedo aponta firme para a Porta Estreita: "Corra para lá! Não olhe para trás, pois a cidade está condenada!" Uma força sobrenatural acelera seus passos e seu coração arde com determinação renovada.',
      '⭐ Uma coluna de luz dourada desce dos céus e ilumina exatamente o trecho à sua frente. O caminho que parecia impossível agora brilha como ouro líquido. Cada passo nessa luz enche sua alma de certeza inabalável.',
    ],
    surprise: [
      '🎁 Algo reluz entre as pedras do caminho — um pergaminho antigo, amarelado pelo tempo. Ao desenrolá-lo, palavras aparecem como escritas por fogo: uma mensagem que parece ter sido deixada ali especificamente para este momento da sua jornada.',
      '🎁 Um viajante encapuzado cruza seu caminho. Sem dizer uma palavra, deposita algo em sua mão e desaparece na névoa. O que será? Bênção ou provação? Só o próximo passo revelará.',
    ],
    giant: [
      '💀 Das sombras da Cidade da Destruição, uma figura colossal se ergue — um guardião antigo, designado para impedir que qualquer alma escape. Seus olhos vermelhos brilham com ódio ancestral. "NINGUÉM PARTE!" — sua voz faz o chão tremer. Este não é um inimigo comum.',
      '💀 A escuridão da cidade que ficou para trás ganha forma, substância e fúria. Uma criatura das trevas primordiais bloqueia o caminho, alimentada por cada pecado, cada medo, cada dúvida que já atormentou seu coração.',
    ],
    challenge: [
      '⚔️ Obstinado e Flexível surgem como velhos conhecidos, com sorrisos condescendentes. "Voltando para casa, não é? Venha, a cidade é quente e segura. Essa sua peregrinação é loucura!" Suas palavras são correntes invisíveis — cada argumento é um elo que tenta prender seus pés.',
      '⚔️ O porteiro da Porta Estreita fixa seus olhos em você com intensidade perturbadora. "Muitos batem, poucos entram. Prove que seu coração busca verdadeiramente o que está além desta porta. Responda — e escolha bem suas palavras."',
    ],
    scripture: [
      '📖 As palavras de Evangelista ressoam como trovão distante em sua memória: "Fuja da ira vindoura!" Mas há mais — um versículo brilha na pedra do caminho, como gravado por dedo divino. As letras parecem vivas, pulsando com urgência.',
      '📖 Ao tropeçar numa pedra, você percebe que não é pedra comum — é uma tábua antiga com inscrições sagradas. As palavras saltam aos olhos como se gritassem para serem ouvidas neste exato instante.',
    ],
    current: [
      '🌊 O rio ao lado do caminho ganha vida própria — suas águas aceleram sem aviso, lambendo seus tornozelos, tentando definir para onde você irá. A correnteza não pede permissão.',
      '🌊 Uma torrente inesperada cruza a estrada como serpente líquida. Impossível ignorá-la — ela vai te levar para algum lugar, quer você queira ou não.',
    ],
    shield: [
      '🛡️ No meio do caminho, brilhando sob um raio de luz que parece vir do próprio céu, jaz uma armadura de peregrino. Simples, mas forjada com algo que transcende o ferro. Ao vesti-la, um calor reconfortante envolve todo o seu corpo — como um abraço invisível.',
      '🛡️ Uma voz suave, quase inaudível, sussurra: "Vista-se da proteção que foi preparada para você antes mesmo do começo da sua jornada." Uma energia luminosa envolve seus ombros como um manto.',
    ],
    swap: [
      '🔄 O Pântano do Desânimo borbulha e a névoa se adensa até que ninguém consegue ver ninguém. Quando o ar clareia, os peregrinos percebem que estão em posições completamente trocadas. O pântano ri em gorgolejos.',
      '🔄 Um redemoinho de vento e poeira envolve todos os viajantes. Quando a tempestade cessa, cada um está onde o outro estava. O caminho tem suas próprias regras.',
    ],
  },
  // Phase 1 — Casa do Intérprete e Palácio Belo
  1: {
    refuge: [
      '🏠 As portas da Casa do Intérprete se abrem com um rangido solene. Lá dentro, velas iluminam afrescos que contam histórias de mil gerações de fiéis. O Intérprete sorri: "Sente-se, peregrino. Antes de enfrentar o que vem, deixe-me mostrar o que seus olhos ainda não viram."',
      '🏠 O Palácio Belo se ergue como uma catedral de esperança entre montanhas austeras. Prudência, Piedade e Caridade descem as escadarias para recebê-lo. Há comida, há descanso, há sabedoria — tudo que um peregrino ferido precisa para seguir.',
    ],
    trap: [
      '🔙 Uma armadilha engenhosamente disfarçada — o que parecia uma passagem segura era uma ilusão plantada pelo inimigo. O chão cede sob seus pés e você cai em um fosso de escuridão. Lá embaixo, sussurros tentam convencê-lo de que nunca houve caminho algum.',
      '🔙 Visões falsas se projetam à sua frente como miragens no deserto — um oásis que na verdade é areia movediça. Você segue o que parece ser o caminho certo, mas cada passo te afasta mais da verdade.',
    ],
    blessing: [
      '⭐ O Intérprete abre uma porta secreta e revela uma sala banhada em luz sobrenatural. "Isto", ele diz apontando para uma cena viva nas paredes, "é o que aguarda quem persevera." Sua alma se inflama com uma convicção que nenhuma provação poderá apagar.',
      '⭐ Diante da Cruz, algo extraordinário acontece — o fardo que pesava em suas costas se solta sozinho, rola morro abaixo e desaparece numa fenda escura. Pela primeira vez, você se sente verdadeiramente livre. Lágrimas escorrem, mas são lágrimas de alegria indescritível.',
    ],
    surprise: [
      '🎁 Em um cômodo esquecido da Casa do Intérprete, algo espera por você — algo que parece ter sido deixado ali há séculos, especificamente para este momento, para esta pergunta que arde em seu coração.',
      '🎁 Nas profundezas do Palácio Belo, em um baú que ninguém lembra de ter visto, algo brilha. Uma surpresa preparada desde antes da fundação do mundo — ou seria apenas coincidência?',
    ],
    giant: [
      '💀 Das sombras do vale que cerca o Palácio, uma forma monstruosa se ergue lentamente. Seus olhos são poços de desespero. Sua voz é como rocha se quebrando: "VOCÊS PENSAM QUE PAREDES DE PEDRA VÃO PROTEGÊ-LOS DE MIM?" O chão treme sob seus passos.',
      '💀 Um demônio antigo, banido há eras, encontrou uma brecha e se materializa diante de vocês. Seu hálito é gelo, sua presença é terror puro. Este é o tipo de inimigo que testa não a força dos braços, mas a firmeza da alma.',
    ],
    challenge: [
      '⚔️ O Intérprete vira-se com expressão grave: "Mostrei-lhes verdades, mas ver não é o bastante. Agora devem provar que entenderam — não com palavras vazias, mas com a convicção que nasce das entranhas da fé."',
      '⚔️ Prudência, Piedade e Caridade se postam diante de vocês no salão principal. "Antes de vestirem a armadura", diz Prudência, "precisamos saber se seus corações são dignos de portá-la. Respondam."',
    ],
    scripture: [
      '📖 Os afrescos nas paredes do Palácio ganham vida — figuras de guerreiros antigos, reis e profetas parecem falar diretamente a vocês. Uma inscrição dourada pulsa com urgência, exigindo ser decifrada.',
      '📖 Na biblioteca do Intérprete, um livro se abre sozinho numa página específica. As palavras naquela página queimam com verdade tão intensa que é impossível ignorá-las.',
    ],
    current: [
      '🌊 Uma corrente de graça — invisível mas poderosa como um rio subterrâneo — envolve os peregrinos. Não há como resistir; ela carrega vocês adiante com propósito definido.',
      '🌊 As águas que cercam o Palácio se agitam sem vento. Algo se move nas profundezas, e a maré decide por vocês qual será o próximo passo.',
    ],
    shield: [
      '🛡️ Na armaria do Palácio Belo, a Armadura de Deus aguarda em um pedestal de mármore: capacete da salvação, couraça da justiça, escudo da fé, espada do Espírito. Ao vesti-la, você sente cada peça pulsar com poder vivo.',
      '🛡️ O Intérprete estende as mãos e uma luz se solidifica em torno de vocês como cristal vivo. "Esta proteção não é feita de metal", ele explica, "é feita de verdade — e a verdade não pode ser quebrada."',
    ],
    swap: [
      '🔄 O Intérprete mostra uma visão que desoriente — quando ela se dissipa, ninguém está onde estava antes. "Às vezes", ele diz sem se desculpar, "Deus muda nossa posição para nos dar uma nova perspectiva."',
      '🔄 Um portal de luz se abre no centro do Palácio. Antes que alguém possa reagir, todos são puxados através dele e cuspidos em posições trocadas. O Palácio tem seus mistérios.',
    ],
  },
  // Phase 2 — Vale da Sombra da Morte
  2: {
    refuge: [
      '🏠 No coração das trevas mais densas, uma caverna se abre — e lá dentro, uma fogueira queima sem lenha, sem fumaça. Uma luz que desafia a escuridão. Calor que nenhum frio deste vale pode vencer. Aqui, por um breve instante, o terror não pode tocar você.',
      '🏠 Uma voz familiar — impossível saber de onde vem — canta um salmo antigo que ecoa pelas paredes do vale. A melodia é simples, mas carrega um poder que faz as sombras recuarem como animais acuados. Seus pés encontram um terreno firme para descansar.',
    ],
    trap: [
      '🔙 As trevas do vale se condensam ao redor como cortinas de veludo negro. Seus olhos não veem nada, seus ouvidos ouvem tudo — sussurros, gritos, risadas malignas. Algo puxa seus pés para um abismo que você não viu. Você tropeça e perde terreno precioso.',
      '🔙 Vozes demoníacas imitam perfeitamente a voz de pessoas que você ama, chamando na direção errada: "Venha por aqui! O caminho é por aqui!" Cada passo na direção delas te afasta mais da trilha verdadeira.',
    ],
    blessing: [
      '⭐ Quando as trevas parecem absolutas e invencíveis, um raio de luz celestial rompe o teto do vale como uma lança de ouro puro. As sombras GRITAM e fogem. Por um instante glorioso, você vê o caminho à frente com clareza cristalina — e ele é bom.',
      '⭐ Anjos guardiões, invisíveis até agora, revelam sua presença com um brilho que não cega mas ilumina a alma. "Não temas", dizem em uníssono. "Aquele que te enviou é maior que qualquer sombra deste vale."',
    ],
    surprise: [
      '🎁 Algo brilha entre as sombras — não deveria haver luz aqui, mas há. Um objeto que pesa na mão como propósito, que brilha como esperança. O vale de morte guarda segredos que nem as trevas conseguem esconder.',
      '🎁 Um eco estranho — diferente dos horrores habituais — ressoa pelo vale. Não é ameaça; é algo mais. Uma revelação? Uma armadilha? Só a coragem de investigar dirá.',
    ],
    giant: [
      '💀 APOLIÃO! O destruidor desce sobre o vale com asas de morcego gigantescas, escamas como couraça e olhos como fornalhas. "EU CONHEÇO VOCÊ", troveja. "CONHEÇO CADA FRAQUEZA, CADA DÚVIDA, CADA PECADO ESCONDIDO. E VOU USARÁ TODOS CONTRA VOCÊ!" Esta é a batalha que define peregrinos.',
      '💀 Das profundezas do vale, o Gigante Desespero emerge — não como criatura de carne, mas como um peso esmagador na alma. Sua presença rouba a esperança como um buraco negro devora a luz. Respirar se torna difícil. Pensar, quase impossível.',
    ],
    challenge: [
      '⚔️ As trevas se condensam em formas que testam sua sanidade — ilusões tão reais que você sente o cheiro do fogo, o gosto do medo. Neste vale, o desafio não é de espada contra carne, mas de fé contra terror absoluto. O que você realmente acredita?',
      '⚔️ Um demônio menor — covarde sozinho, mas perigoso em grupo — bloqueia o caminho estreito. Seus olhos são espelhos que refletem seus piores medos. Derrotá-lo exige coragem que vem de um lugar mais profundo que a bravura humana.',
    ],
    scripture: [
      '📖 Na escuridão total, letras de fogo aparecem flutuando no ar — um versículo sagrado que brilha com tal intensidade que as sombras ao redor se retorcem de dor. As palavras são antigas, mas parecem ditas AGORA, PARA VOCÊ, NESTE EXATO SEGUNDO.',
      '📖 A voz de Deus — inconfundível, impossível de ignorar — ecoa pelo vale como trovão e brisa ao mesmo tempo. As trevas tremem. As palavras são uma espada que corta a escuridão ao meio.',
    ],
    current: [
      '🌊 Ventos sobrenaturais varrem o vale — não ventos comuns, mas forças que carregam cheiro de enxofre ou de incenso, dependendo da direção. Você será levado — a questão é para onde.',
      '🌊 Uma força invisível, poderosa como maré oceânica, empurra o peregrino através do vale. Não há como ancorar os pés. O destino decidirá se a corrente é aliada ou inimiga.',
    ],
    shield: [
      '🛡️ Na escuridão mais profunda do vale, a Espada do Espírito começa a brilhar em suas mãos com luz própria. As trevas RECUAM. Pela primeira vez neste lugar, você não é a presa — é o caçador.',
      '🛡️ Uma armadura celestial se materializa peça por peça sobre seu corpo. Cada placa brilha com inscrições sagradas. O vale continua escuro, mas você se tornou uma fortaleza ambulante.',
    ],
    swap: [
      '🔄 A escuridão total do vale rouba toda orientação — não há norte, sul, cima ou baixo. Quando uma breve claridade retorna, todos os peregrinos percebem que estão em posições completamente diferentes. O vale ri nas sombras.',
      '🔄 O vale distorce o próprio espaço como um espelho de feira — posições se invertem, caminhos se cruzam. O que era frente vira trás. Ninguém entende como, mas todos sentem.',
    ],
  },
  // Phase 3 — Feira da Vaidade
  3: {
    refuge: [
      '🏠 No beco mais escuro da feira, uma porta discreta se abre. Dentro, cristãos fiéis que sobreviveram à perseguição da cidade te recebem com lágrimas de alegria. "Sabíamos que mais peregrinos viriam. Descansem — aqui o barulho da vaidade não alcança."',
      '🏠 Uma igreja subterrânea, escondida sob os alicerces da própria feira, oferece refúgio. Seus muros são grossos o bastante para abafar as tentações lá fora. Aqui, o silêncio sagrado reconstrói o que o caos destruiu.',
    ],
    trap: [
      '🔙 "Tudo a preço de banana! Fama, poder, prazeres — e o primeiro é de graça!" O mercador sorri com dentes de ouro enquanto suas palavras-armadilha envolvem seus tornozelos como cordas invisíveis. Quando percebe, você já foi arrastado três barracas na direção errada.',
      '🔙 A multidão da feira te engole como um redemoinho humano — empurrões, gritos, ofertas gritadas no ouvido. Quando finalmente consegue escapar, está mais longe do caminho do que quando entrou. A feira cobra caro de quem se distrai.',
    ],
    blessing: [
      '⭐ O martírio de Fiel — sua recusa absoluta em ceder — acende uma chama que nenhum vento da vaidade consegue apagar. Seu testemunho queima como fogo nas consciências de toda a feira. Guardas hesitam. Mercadores param. Por um instante eterno, a verdade reina.',
      '⭐ Em meio ao barulho ensurdecedor da vaidade, uma voz clara e pura corta o caos como espada cortando seda. É a voz da verdade — e ela é mais poderosa que mil mercadores gritando mentiras. Sua alma se fortalece como aço temperado.',
    ],
    surprise: [
      '🎁 Um mercador diferente — olhos serenos entre rostos gananciosos — se aproxima discretamente: "Tenho algo que não está à venda. Foi deixado aqui especificamente para alguém como você." O que ele oferece muda o jogo completamente.',
      '🎁 Na confusão de uma briga entre mercadores, algo cai de uma barraca e rola até seus pés. Coincidência? Na Feira da Vaidade, nada é coincidência — tudo é teste ou provisão.',
    ],
    giant: [
      '💀 O Juiz da Feira se ergue em seu tribunal ornamentado com ouro saqueado. Seu martelo pesa como a condenação eterna. "CULPADOS!", troveja, apontando para os peregrinos. "Culpados de recusar nossas mercadorias! A punição é... exemplar." O tribunal inteiro ri — uma gargalhada que congela o sangue.',
      '💀 O Carrasco da Feira avança entre a multidão — uma montanha de músculos e crueldade, sem rosto sob o capuz negro. Onde ele pisa, o chão estala. Sua missão: ensinar aos peregrinos o preço de rejeitar a vaidade.',
    ],
    challenge: [
      '⚔️ Vocês estão no banco dos réus. O tribunal da Feira da Vaidade exige que defendam sua fé diante de um júri que já decidiu condená-los. Cada palavra pode ser usada contra vocês — mas o silêncio é pior que qualquer sentença. O que dirão quando a eternidade está em jogo?',
      '⚔️ As tentações da feira não são apenas barracas — são experiências completas. Cada luxo, cada prazer, cada oferta é perfeitamente calibrada para explorar exatamente a fraqueza mais profunda do seu coração. Resistir requer mais que vontade; requer transformação.',
    ],
    scripture: [
      '📖 As últimas palavras de Fiel antes de seu martírio ecoam pelo tribunal como trovão em catedral: fortes, inquebráveis, eternas. Cada sílaba é uma flecha de verdade que perfura a armadura da vaidade.',
      '📖 Um pergaminho sagrado, escondido sob os escombros de uma barraca destruída, revela palavras que fazem os mercadores ao redor taparem os ouvidos e fugirem. A verdade é insuportável para quem vive de mentiras.',
    ],
    current: [
      '🌊 A massa humana da feira se move como maré — incontrolável, imprevisível. Você é carregado pela corrente de gente, empurrado para direções que não escolheu. Na feira, até seus passos pertencem ao caos.',
      '🌊 Uma onda de pessoas em pânico — algo aconteceu no centro da feira — varre todos os peregrinos. Quando a turba se acalma, cada um está em um lugar completamente diferente.',
    ],
    shield: [
      '🛡️ A fé inabalável de Fiel — mesmo diante da morte — se torna um escudo invisível mas impenetrável ao redor de vocês. Os golpes da feira ricocheteiam como pedras em muralha. O martírio dele protege vocês agora.',
      '🛡️ Esperança, o companheiro fiel, estende sobre todos um manto que parece feito de orações — leve como ar, forte como diamante. Sob sua proteção, as tentações da feira perdem todo o poder.',
    ],
    swap: [
      '🔄 Um tumulto monumental na praça central — barracas caem, mercadorias voam, gente corre para todos os lados. Quando a poeira baixa, os peregrinos percebem que a confusão os redistribuiu completamente pelo mapa.',
      '🔄 O Trapaceiro da Feira, rindo às gargalhadas, puxa uma alavanca escondida. O chão gira como uma plataforma de circo. Quando para, todos estão em posições trocadas.',
    ],
  },
  // Phase 4 — Castelo da Dúvida e Montanhas Deleitosas
  4: {
    refuge: [
      '🏠 Em uma cela esquecida do Castelo da Dúvida, um raio de luz entra por uma fresta impossível. Nesse cantinho miserável, você encontra paz — não porque o lugar é bom, mas porque a Presença que te acompanha é maior que qualquer masmorra.',
      '🏠 Finalmente, as Montanhas Deleitosas! Os pastores — Conhecimento, Experiência, Vigia e Sincero — descem para recebê-los com braços abertos e mesa farta. Daqui, em dias claros, é possível avistar os portões dourados da Cidade Celestial ao longe.',
    ],
    trap: [
      '🔙 Os corredores do Castelo da Dúvida mudam de forma quando você não está olhando — portas que existiam desaparecem, paredes se fecham. Você está sendo caçado, e o castelo é o predador. Cada passo em falso te afunda mais nas masmorras.',
      '🔙 O Gigante Desespero te encontra vagando pelos corredores. Seu bastão é grosso como um tronco. "ACHEI VOCÊS!", urra com alegria sádica. "Meus aposentos estavam ficando vazios." Ele te arrasta de volta sem esforço.',
    ],
    blessing: [
      '⭐ Seu bolso esquenta — a Chave da Promessa! Você quase tinha esquecido que a possuía. Ao tirá-la, ela brilha com luz própria e as fechaduras do castelo começam a se abrir uma após outra com estalos de libertação. NENHUMA PORTA RESISTE À PROMESSA DE DEUS.',
      '⭐ Os pastores das Montanhas Deleitosas revelam segredos guardados há gerações. Através de seus telescópios sagrados, mostram visões que enchem a alma de uma esperança tão intensa que parece impossível que a dúvida algum dia tenha existido.',
    ],
    surprise: [
      '🎁 Nas paredes do castelo, uma pedra solta revela um compartimento secreto. Dentro, algo que Gigante Desespero guardou sem saber o que era — porque a escuridão não compreende a luz, mesmo quando a tem nas mãos.',
      '🎁 Uma passagem secreta se abre onde antes havia apenas pedra sólida. Para onde leva? Apenas os corajosos descobrirão. O castelo tem segredos que até seu monstruoso dono desconhece.',
    ],
    giant: [
      '💀 GIGANTE DESESPERO! A criatura que transformou mais peregrinos em esqueletos que qualquer monstro da jornada. Ele surge com seu bastão de ferro, cada passo fazendo o castelo inteiro estremecer. "NINGUÉM ESCAPA DO MEU CASTELO!", brame. Atrás dele, Desconfiança — sua esposa — sussurra táticas cruéis.',
      '💀 Desconfiança, a giganta, ataca com uma ferocidade que supera até o marido. Seus golpes são direcionados não ao corpo, mas à fé. Cada palavra que ela cospe é um ácido que corrói a esperança. Este é o combate mais perigoso — porque o inimigo ataca o que os olhos não veem.',
    ],
    challenge: [
      '⚔️ As masmorras do Castelo da Dúvida não são feitas apenas de pedra — são feitas de ilusões que mostram seus piores fracassos, suas maiores vergonhas, seus medos mais íntimos. "Por que continuar?", perguntam as paredes. A resposta precisa vir de um lugar mais profundo que a razão.',
      '⚔️ Um enigma está gravado na porta que separa a prisão da liberdade. Decifre-o e a porta se abre. Falhe, e o Gigante Desespero virá cobrar pela tentativa. Não há segunda chance — mas há a Chave da Promessa.',
    ],
    scripture: [
      '📖 A Chave da Promessa pulsa em seu peito e revela um versículo gravado em sua superfície — palavras de libertação que fazem as correntes do castelo se partirem como vidro. Até Gigante Desespero recua quando ouve essas palavras.',
      '📖 Inscrições sagradas — gravadas por prisioneiros que passaram antes de vocês e foram libertos — cobrem as paredes da cela. Cada palavra é um testemunho de que estas masmorras NÃO são o fim da história.',
    ],
    current: [
      '🌊 Correntes de ar gelado sopram pelos corredores do castelo como o hálito de um monstro adormecido. Elas empurram, puxam, desorientam — o castelo usa o próprio ar como arma.',
      '🌊 Uma força sobrenatural se move pelos corredores do castelo, arrastando os peregrinos como marionetes. Resistir é possível, mas custoso.',
    ],
    shield: [
      '🛡️ A fé — testada, provada, refinada como ouro no fogo — se torna literalmente um escudo visível nas masmorras do castelo. A escuridão bate contra ele e se parte. Desespero grita de frustração.',
      '🛡️ Grande-Coração, o guerreiro lendário, aparece como uma visão: "Tomem esta armadura — ela já derrotou gigantes antes de vocês." A proteção que ele oferece carrega o peso de mil vitórias.',
    ],
    swap: [
      '🔄 Os corredores labirínticos do castelo são impossíveis de mapear — cada vez que viram uma esquina, estão em um lugar completamente diferente. O Gigante Desespero ri, porque no castelo dele, até o espaço obedece ao caos.',
      '🔄 Uma armadilha mágica — colocada por Desconfiança para confundir prisioneiros — ativa sob seus pés. O chão gira, as paredes mudam, e quando tudo para, ninguém está onde deveria.',
    ],
  },
  // Phase 5 — Rio da Morte e Cidade Celestial
  5: {
    refuge: [
      '🏠 Na margem do Rio da Morte, sob árvores que carregam frutos impossíveis — doces como mel, luminosos como estrelas —, um último descanso é concedido. Anjos invisíveis sustentam o peregrino exausto. "Quase lá", sussurram. "Tão perto que podemos ouvir as trombetas do outro lado."',
      '🏠 A Terra de Beulá envolve vocês com seu ar perfumado — cada respiração é uma oração respondida, cada brisa carrega melodias da Cidade que aguarda. Aqui não há noite, não há medo, não há dúvida. Apenas a doce certeza de que o fim da jornada é glória.',
    ],
    trap: [
      '🔙 As águas geladas do Rio da Morte sobem até o peito — escuras, profundas, implacáveis. Cada dúvida que você já teve na vida inteira volta como pedra amarrada nos tornozelos, puxando para baixo. "EU NÃO VOU CONSEGUIR!", grita o coração. E por um momento terrível, parece verdade.',
      '🔙 Na borda da Cidade Celestial, a dúvida faz sua última tentativa desesperada. Ignorância aparece com seu caminho alternativo: "Não precisa passar pelo Rio! Há um atalho!" É mentira — mas é a mentira mais tentadora de toda a jornada.',
    ],
    blessing: [
      '⭐ TROMBETAS! TROMBETAS CELESTIAIS ECOAM PELO HORIZONTE! Os portões de ouro da Cidade Eterna se abrem e uma luz tão gloriosa que faz o sol parecer vela irrompe sobre o vale. Dez mil anjos entoam: "ENTREM NO GOZO DO SEU SENHOR!" Seus pés mal tocam o chão.',
      '⭐ Uma coroa de glória — não de ouro terreno, mas de luz viva — desce e paira sobre sua cabeça. Cada pedra preciosa nela representa uma provação vencida, uma tentação resistida, uma lágrima que agora se transformou em diamante eterno.',
    ],
    surprise: [
      '🎁 Uma visão celestial se abre como uma janela no próprio tecido da realidade — por ela, você vê a Cidade por dentro: ruas de ouro, árvores de vida, rostos de santos que foram antes de você. Um deles sorri e acena. Você o conhece.',
      '🎁 Um anjo traz uma mensagem lacrada — selada com selo celestial que nenhum olho humano jamais viu. Ao abri-la, as palavras que lê mudam completamente sua compreensão da jornada. Tudo — cada provação, cada lágrima — fazia parte de algo maior do que você podia imaginar.',
    ],
    giant: [
      '💀 A Última Dúvida se ergue nas águas do Rio da Morte — uma criatura formada por todas as incertezas, todos os "e se", todos os medos que já te perseguiram. É o adversário final, e ele conhece seu nome. Mas — e este é o segredo que ele não quer que você saiba — ele é o mais fraco de todos os inimigos. Porque aqui, tão perto do fim, a fé é invencível.',
      '💀 Das águas escuras, uma forma antiga se ergue — o último guardião entre o peregrino e a eternidade. Ele não luta com espada; luta com medo. Mas seus dias estão contados — porque do outro lado do Rio, os portões já estão abertos.',
    ],
    challenge: [
      '⚔️ A travessia do Rio da Morte — o teste supremo e final. As águas escuras sobem, o fundo desaparece, o medo é real e brutal. Mas lá no fundo, sob as ondas, seus pés encontram rocha firme. Sempre houve rocha ali — você só não podia vê-la até agora. ATRAVESSE.',
      '⚔️ Os portões celestiais se erguem diante de vocês em toda sua glória impossível — altos demais para serem medidos, brilhantes demais para serem observados diretamente. Um anjo porteiro estende a mão: "Mostrem seus pergaminhos." Esta é a última verificação — e ela não é de conhecimento, mas de coração.',
    ],
    scripture: [
      '📖 Nos portões de ouro, todas as Escrituras que você leu, ouviu e guardou na jornada inteira convergem em um único versículo que brilha com cada cor do arco-íris e mais algumas que não têm nome. É a Palavra — viva, eterna, e agora, finalmente, completamente compreendida.',
      '📖 Toda a Escritura se ilumina de uma vez — cada verso que sustentou seus passos, cada promessa que te levantou quando caiu. Aqui, na fronteira da eternidade, as palavras não são mais texto; são realidade.',
    ],
    current: [
      '🌊 As águas do Rio da Morte te envolvem — frias, profundas, escuras. Mas sob a superfície, uma corrente gentil te carrega. Não é a corrente da morte; é a corrente da vida eterna, disfarçada. Solte. Confie. Deixe-se levar.',
      '🌊 Uma corrente celestial — feita não de água mas de luz líquida — empurra os peregrinos para os portões. Resistir seria não apenas inútil, mas insensato. O destino de glória não pode ser evitado.',
    ],
    shield: [
      '🛡️ A armadura completa de Deus não apenas protege — ela RESPLANDECE com a glória acumulada de toda a jornada. Cada golpe recebido a tornou mais forte. Cada cicatriz a tornou mais bela. Os anjos param para observar — até eles se impressionam.',
      '🛡️ Proteção angelical total envolve o peregrino para a travessia final. Não uma proteção de ferro, mas de amor inquebrantável — o tipo que passou por fogo, água, vale de sombras e feira de vaidade, e permaneceu de pé.',
    ],
    swap: [
      '🔄 As águas do Rio da Morte distorcem tudo — reflexos mentem, margens mudam de lugar, e quando os peregrinos emergem, estão em posições completamente reorganizadas. O Rio tem a última palavra antes da eternidade.',
      '🔄 O véu entre o temporal e o eterno ondula — e por um instante, o próprio tecido da realidade se reorganiza. Posições trocadas, perspectivas invertidas. Mas todos ainda caminham na mesma direção: para a Cidade.',
    ],
  },
};

export function getPhaseNarrative(phaseIdx: number, tileType: string, seed: number): string | null {
  const phase = PHASE_NARRATIVES[phaseIdx];
  if (!phase) return null;
  const narratives = phase[tileType];
  if (!narratives || narratives.length === 0) return null;
  return narratives[seed % narratives.length];
}
