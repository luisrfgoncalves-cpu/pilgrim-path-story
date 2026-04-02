import { Riddle } from './types';

// ═══════════════════════════════════════════════════════
// BANCO DE CHARADAS E ENIGMAS BÍBLICOS
// 40+ por nível × 3 = 120+ charadas
// ═══════════════════════════════════════════════════════

export const riddles: Riddle[] = [
  // ═══════ APRENDIZ ═══════
  {
    id: 'r-a-001', difficulty: 'aprendiz',
    context: 'Cristão carregava algo muito pesado nas costas desde o início da jornada...',
    riddle: 'Todos carregam, ninguém quer ter. Na Cruz se perde, não volta a crescer. O que é?',
    hints: ['Cristão carregava isso nas costas', 'É algo espiritual, não físico', 'Jesus morreu para nos livrar disso'],
    answer: 'O fardo do pecado',
    bibleReference: '1 João 1:7',
    explanation: 'O pecado é um peso que todos carregamos, mas na Cruz de Cristo somos libertos dele para sempre.',
    timerSeconds: 45
  },
  {
    id: 'r-a-002', difficulty: 'aprendiz',
    context: 'No início da jornada, Cristão precisou passar por uma entrada muito específica...',
    riddle: 'Sou estreita demais para o orgulhoso, larga demais para quem não quer entrar. Muitos me veem, poucos me cruzam. Quem sou eu?',
    hints: ['Jesus falou sobre mim', 'Fico no início do caminho certo', 'Cristão bateu na minha porta'],
    answer: 'O Portão Estreito',
    bibleReference: 'Mateus 7:13-14',
    explanation: '"Entrai pela porta estreita." Poucos a encontram porque requer humildade e arrependimento.',
    timerSeconds: 45
  },
  {
    id: 'r-a-003', difficulty: 'aprendiz',
    context: 'No caminho, Cristão encontrou um lugar que sugava as pessoas para baixo...',
    riddle: 'Quanto mais você luta, mais afunda. Quanto mais chora, mais cresce. Só uma mão de fora pode te tirar. O que é?',
    hints: ['É um lugar, não uma pessoa', 'Cristão caiu nele no início', 'Representa um sentimento que paralisa'],
    answer: 'O Pântano do Desânimo',
    bibleReference: 'Salmos 40:2',
    explanation: 'O desânimo é como areia movediça espiritual. Quanto mais tentamos sair sozinhos, mais afundamos. Precisamos da mão de Deus.',
    timerSeconds: 45
  },
  {
    id: 'r-a-004', difficulty: 'aprendiz',
    context: 'Cristão recebeu algo precioso que precisava guardar com cuidado...',
    riddle: 'Não sou de ouro, mas valho mais que ouro. Posso ser perdido por descuido, mas não por roubo. Sem mim, a porta final não se abre. O que sou?',
    hints: ['Cristão quase me perdeu na Colina', 'Sou um documento', 'Provo que você pertence ao Rei'],
    answer: 'O pergaminho / certificado de salvação',
    bibleReference: 'Efésios 1:13-14',
    explanation: 'O pergaminho representa a certeza da salvação selada pelo Espírito Santo. Podemos perder a consciência dela, mas Deus nunca a revoga.',
    timerSeconds: 45
  },
  {
    id: 'r-a-005', difficulty: 'aprendiz',
    context: 'No Palácio Belo, Cristão recebeu proteção completa para o corpo...',
    riddle: 'Tenho capacete, escudo, espada e couraça, mas não sou para guerra de carne e sangue. O que sou?',
    hints: ['Paulo escreveu sobre mim', 'Estou em Efésios capítulo 6', 'Protejo contra ataques espirituais'],
    answer: 'A armadura de Deus',
    bibleReference: 'Efésios 6:11',
    explanation: '"Revesti-vos de toda a armadura de Deus." Nossa luta é espiritual e requer armas espirituais.',
    timerSeconds: 40
  },
  {
    id: 'r-a-006', difficulty: 'aprendiz',
    context: 'Um monstro terrível atacou Cristão no vale...',
    riddle: 'Tenho asas de dragão e boca de leão. Já fui anjo, agora sou destruição. Quem sou eu?',
    hints: ['Meu nome começa com A', 'Atacou Cristão no Vale da Humilhação', 'Represento o inimigo da nossa alma'],
    answer: 'Apolion (o Destruidor)',
    bibleReference: 'Apocalipse 9:11',
    explanation: 'Apolion significa "Destruidor." Representa Satanás que quer destruir os que seguem a Cristo.',
    timerSeconds: 40
  },
  {
    id: 'r-a-007', difficulty: 'aprendiz',
    context: 'Dois amigos fiéis caminharam juntos, mas um deu a vida pela fé...',
    riddle: 'Meu nome diz o que sou. Caminhei com Cristão até onde pude. Morri na feira, mas venci na eternidade. Quem sou?',
    hints: ['Meu nome é uma virtude cristã', 'Fui martirizado', 'Cristão me encontrou no caminho'],
    answer: 'Fiel',
    bibleReference: 'Apocalipse 2:10',
    explanation: '"Sê fiel até à morte e dar-te-ei a coroa da vida." Fiel honrou seu nome ao morrer por sua fé.',
    timerSeconds: 35
  },
  {
    id: 'r-a-008', difficulty: 'aprendiz',
    context: 'Cristão ficou preso em um castelo sombrio com um gigante terrível...',
    riddle: 'Sou grande e forte, mas uma chave pequena me derrota. Moro em um castelo de dúvidas. Quem sou eu?',
    hints: ['Sou um gigante', 'Minha esposa se chama Desconfiança', 'Cristão escapou de mim com as promessas de Deus'],
    answer: 'O Gigante Desespero',
    bibleReference: 'Salmos 34:17-18',
    explanation: 'O desespero parece imenso, mas as promessas de Deus (a chave) são maiores que qualquer gigante.',
    timerSeconds: 40
  },
  {
    id: 'r-a-009', difficulty: 'aprendiz',
    context: 'No final da jornada, havia um obstáculo que todos precisavam atravessar...',
    riddle: 'Não tenho ponte, sou frio e profundo. Todos me temem, mas quem me cruza encontra a vida. O que sou?',
    hints: ['Estou no final do caminho', 'Represento algo que todos enfrentarão', 'Do outro lado está a Cidade Celestial'],
    answer: 'O Rio da Morte',
    bibleReference: 'Salmos 23:4',
    explanation: 'A morte física é inevitável, mas para o cristão é a passagem para a vida eterna na presença de Deus.',
    timerSeconds: 40
  },
  {
    id: 'r-a-010', difficulty: 'aprendiz',
    context: 'Este lugar vendia tudo que o mundo podia oferecer...',
    riddle: 'Aqui tudo tem preço, menos a verdade. Quem compra se perde, quem recusa é odiado. Que lugar é esse?',
    hints: ['Cristão e Fiel passaram por aqui', 'É uma feira', 'Representa as tentações do mundo'],
    answer: 'A Feira da Vaidade',
    bibleReference: '1 João 2:15-17',
    explanation: '"Não ameis o mundo nem as coisas que há no mundo." A Feira oferece tudo, exceto o que realmente importa.',
    timerSeconds: 40
  },
  {
    id: 'r-a-011', difficulty: 'aprendiz',
    context: 'Alguém aparecia sempre que Cristão se perdia para mostrar o caminho certo...',
    riddle: 'Não sou anjo, mas trago boas notícias. Apareço quando o peregrino se perde. Meu nome é minha missão. Quem sou?',
    hints: ['Meu nome vem de "Evangelho"', 'Apareço várias vezes na história', 'Sempre aponto para o caminho certo'],
    answer: 'Evangelista',
    bibleReference: 'Romanos 10:15',
    explanation: '"Como são belos os pés dos que anunciam boas novas!" Evangelista sempre trazia a direção de Deus.',
    timerSeconds: 35
  },
  {
    id: 'r-a-012', difficulty: 'aprendiz',
    context: 'Rugiam ferozmente, mas não podiam atacar quem passava com coragem...',
    riddle: 'Somos ferozes mas limitados. Rugimos alto mas estamos presos. Guardamos um palácio de beleza. Quem somos?',
    hints: ['Somos animais', 'Estamos acorrentados', 'Ficamos antes do Palácio Belo'],
    answer: 'Os leões acorrentados',
    bibleReference: '1 Pedro 5:8-9',
    explanation: 'O diabo ruge como leão, mas está limitado por Deus. Os leões testam a coragem, não a força.',
    timerSeconds: 35
  },
  {
    id: 'r-a-013', difficulty: 'aprendiz',
    context: 'Este lugar ensinava verdades espirituais através de visões e quadros vivos...',
    riddle: 'Não sou escola, mas ensino. Não sou museu, mas mostro quadros vivos. Quem me visita sai mais sábio. O que sou?',
    hints: ['Cristão visitou este lugar após o Portão', 'É uma casa', 'O dono interpreta visões espirituais'],
    answer: 'A Casa do Intérprete',
    bibleReference: 'João 16:13',
    explanation: 'A Casa do Intérprete representa o ministério do Espírito Santo que nos ensina e revela verdades divinas.',
    timerSeconds: 40
  },

  // ═══════ PEREGRINO ═══════
  {
    id: 'r-p-001', difficulty: 'peregrino',
    context: 'Na Casa do Intérprete, Cristão viu algo que ardia sem se apagar...',
    riddle: 'Ardo sem me consumir. Água me ataca pela frente, mas óleo me alimenta por trás. O que represento?',
    hints: ['Estou na parede da Casa do Intérprete', 'Represento algo no coração do crente', 'Cristo me mantém vivo secretamente'],
    answer: 'A graça de Deus no coração, sustentada por Cristo contra os ataques do diabo',
    bibleReference: '2 Coríntios 12:9',
    explanation: 'O fogo é a graça; a água são os ataques de Satanás; o óleo é Cristo nos sustentando por trás, invisivelmente.',
    timerSeconds: 60
  },
  {
    id: 'r-p-002', difficulty: 'peregrino',
    context: 'Cristão encontrou um caminho que parecia bom mas levava ao abismo...',
    riddle: 'Pareço reto, pareço bom. Muitos me escolhem sem pensar. Mas meu fim é um precipício que nenhum viajante pode evitar depois de me seguir. O que sou?',
    hints: ['Provérbios fala sobre mim', 'Pareço certo mas levo à morte', 'Sabedoria Mundana me recomendava'],
    answer: 'O caminho que parece certo ao homem mas cujo fim é morte (Provérbios 14:12)',
    bibleReference: 'Provérbios 14:12',
    explanation: 'Nem todo caminho confortável é o caminho de Deus. A aparência engana quando não consultamos as Escrituras.',
    timerSeconds: 60
  },
  {
    id: 'r-p-003', difficulty: 'peregrino',
    context: 'No calabouço do Castelo da Dúvida, Cristão e Esperança sofriam sem encontrar saída...',
    riddle: 'Estive sempre no seu bolso, mas você se esqueceu de mim. Abro qualquer porta, quebro qualquer corrente. Sou pequena mas invencível. O que sou?',
    hints: ['Cristão me encontrou no peito', 'Sou chamada de "Promessa"', 'Abri a porta do Castelo da Dúvida'],
    answer: 'A chave da Promessa — as promessas de Deus',
    bibleReference: '2 Pedro 1:4',
    explanation: 'Muitas vezes temos as promessas de Deus conosco mas esquecemos de usá-las. Elas abrem qualquer prisão de dúvida.',
    timerSeconds: 50
  },
  {
    id: 'r-p-004', difficulty: 'peregrino',
    context: 'Uma sala cheia de poeira na Casa do Intérprete...',
    riddle: 'Quando me varrem, sufoco. Quando me lavam, purifico. A vassoura me agita, a água me remove. O que represento?',
    hints: ['A vassoura representa a Lei', 'A água representa o Evangelho', 'Estou no coração do homem'],
    answer: 'O pecado no coração — agitado pela Lei, purificado pela graça',
    bibleReference: 'Romanos 5:20',
    explanation: 'A Lei não pode limpar o pecado, apenas revelá-lo. Só a graça do Evangelho (água) purifica de verdade.',
    timerSeconds: 60
  },
  {
    id: 'r-p-005', difficulty: 'peregrino',
    context: 'Três ladrões atacaram alguém no caminho...',
    riddle: 'Somos três irmãos: um te faz recuar, outro te faz duvidar, o terceiro te condena. Roubamos tua paz mas não podemos tocar tua herança. Quem somos?',
    hints: ['Atacamos Pequena-Fé', 'Nossos nomes são sentimentos negativos', 'O pergaminho ficou seguro'],
    answer: 'Tímido, Desconfiança e Culpa',
    bibleReference: 'Romanos 8:1',
    explanation: '"Não há condenação para os que estão em Cristo Jesus." O inimigo pode roubar a paz, mas não a salvação.',
    timerSeconds: 55
  },
  {
    id: 'r-p-006', difficulty: 'peregrino',
    context: 'Cristão viu dois homens pulando o muro em vez de entrar pelo portão...',
    riddle: 'Entramos sem convite, subimos sem escada, fingimos sem vergonha. Nossos nomes revelam nosso caráter. Quem somos?',
    hints: ['Pulamos o muro em vez de usar o portão', 'Um se chama Formalista', 'Jesus falou sobre quem não entra pela porta'],
    answer: 'Formalista e Hipocrisia',
    bibleReference: 'João 10:1',
    explanation: '"O que não entra pela porta no curral das ovelhas, mas sobe por outra parte, é ladrão e salteador." Há quem tente atalhos para Deus.',
    timerSeconds: 55
  },
  {
    id: 'r-p-007', difficulty: 'peregrino',
    context: 'Nas montanhas, os pastores mostraram coisas terríveis e maravilhosas...',
    riddle: 'Mostro quatro vistas: um abismo, uma precaução, um erro e uma promessa. Estou no alto, entre nuvens. Sou plural mas trabalho em unidade. O que somos?',
    hints: ['Somos pessoas no topo de montanhas', 'Cuidamos de ovelhas', 'Ensinamos, protegemos e guiamos'],
    answer: 'Os pastores das Montanhas Deleitosas',
    bibleReference: '1 Pedro 5:2',
    explanation: 'Pastores fiéis mostram tanto os perigos (erro, abismo) quanto a esperança (a Cidade ao longe).',
    timerSeconds: 55
  },
  {
    id: 'r-p-008', difficulty: 'peregrino',
    context: 'Alguém ofereceu riquezas fáceis ao lado do caminho...',
    riddle: 'Meu nome é bíblico. Ofereço prata e ouro a quem se desviar. Muitos entraram em minha mina, nenhum voltou. Quem sou?',
    hints: ['Paulo mencionou alguém com meu nome', 'Fiquei à beira do caminho', 'Minha mina é uma armadilha de ganância'],
    answer: 'Demas',
    bibleReference: '2 Timóteo 4:10',
    explanation: '"Demas me abandonou, amando o presente século." A ganância afastou Demas da fé e ele agora tenta desviar outros.',
    timerSeconds: 50
  },
  {
    id: 'r-p-009', difficulty: 'peregrino',
    context: 'Um lugar que fazia todos dormirem profundamente, perto do final...',
    riddle: 'Sou doce mas mortal. Pareço descanso mas sou prisão. Quanto mais perto do fim, mais forte me torno. O que sou?',
    hints: ['Estou perto da Cidade Celestial', 'Faço as pessoas adormecerem', 'Represento a apatia espiritual'],
    answer: 'A Terra Encantada',
    bibleReference: 'Mateus 26:41',
    explanation: '"Vigiai e orai." A apatia espiritual é mais perigosa perto do fim da jornada, quando pensamos que já estamos seguros.',
    timerSeconds: 50
  },
  {
    id: 'r-p-010', difficulty: 'peregrino',
    context: 'Um homem de palavras suaves capturou Cristão e Esperança em uma rede...',
    riddle: 'Minhas palavras são mel, minha rede é invisível. Elogio para prender, sorrio para capturar. Quem sou?',
    hints: ['Sou uma pessoa', 'Uso lisonja como arma', 'Provérbios adverte sobre mim'],
    answer: 'O Lisonjeiro',
    bibleReference: 'Provérbios 29:5',
    explanation: '"O homem que lisonjeia o próximo arma uma rede aos seus pés." Cuidado com quem só fala o que queremos ouvir.',
    timerSeconds: 45
  },

  // ═══════ VETERANO ═══════
  {
    id: 'r-v-001', difficulty: 'veterano',
    context: 'Bunyan escreveu sobre um homem em uma gaiola de ferro na Casa do Intérprete...',
    riddle: 'Estou preso não por ferro, mas por mim mesmo. Tive graça e a rejeitei. O Espírito me deixou e não volta. Sou o aviso mais terrível da história. Quem sou?',
    hints: ['Estou na Casa do Intérprete', 'Represento o pecado contra o Espírito Santo', 'Hebreus 6 fala sobre minha situação'],
    answer: 'O Homem na Gaiola de Ferro — aquele que apostatou da fé e não pode ser renovado ao arrependimento',
    bibleReference: 'Hebreus 6:4-6',
    explanation: 'A gaiola de ferro representa o estado desesperador de quem conheceu a verdade, rejeitou-a deliberadamente e endureceu completamente o coração.',
    timerSeconds: 75
  },
  {
    id: 'r-v-002', difficulty: 'veterano',
    context: 'Na Casa do Intérprete, Cristão viu dois meninos: Paixão e Paciência...',
    riddle: 'Um de nós quer tudo agora e acaba com nada. O outro espera e recebe tudo depois. Somos opostos mas vivemos na mesma casa. Quem somos e o que ensinamos?',
    hints: ['Somos dois meninos alegóricos', 'Um representa os prazeres imediatos', 'O outro representa a esperança eterna'],
    answer: 'Paixão (que busca recompensas terrenas imediatas) e Paciência (que espera as recompensas celestiais eternas)',
    bibleReference: 'Hebreus 11:24-26',
    explanation: 'Moisés escolheu ser maltratado com o povo de Deus a ter o prazer temporário do pecado, pois olhava para a recompensa futura.',
    timerSeconds: 75
  },
  {
    id: 'r-v-003', difficulty: 'veterano',
    context: 'O julgamento de Fiel na Feira da Vaidade teve jurados com nomes muito específicos...',
    riddle: 'Nossos nomes são nosso veredicto: Cego, Sem-bem, Malícia, Luxúria, Presunção, Hostilidade, Mentiroso, Cruel, Ódio-à-luz, Implacável, e mais. Somos 12 e sempre condenamos o justo. Quem somos?',
    hints: ['Somos o júri de um julgamento famoso', 'Condenamos Fiel à morte', 'Nossos nomes representam vícios da humanidade'],
    answer: 'Os 12 jurados do julgamento de Fiel — representando os vícios que condenam os justos no tribunal do mundo',
    bibleReference: 'João 15:18-19',
    explanation: 'Bunyan nomeou cada jurado com um vício para mostrar que o julgamento do mundo contra os cristãos é motivado pelo pecado, não pela justiça.',
    timerSeconds: 90
  },
  {
    id: 'r-v-004', difficulty: 'veterano',
    context: 'Um personagem tentou acompanhar Cristão por um caminho que não começou no Portão Estreito...',
    riddle: 'Meu nome descreve o que me falta. Converso sobre Deus com confiança, mas nunca passei pela Cruz. Chego até os portões do céu, mas sou levado para baixo. Quem sou e que doutrina ilustro?',
    hints: ['Sou um dos últimos personagens', 'Entrei por um atalho', 'Ilustro a diferença entre fé verdadeira e presunção'],
    answer: 'Ignorância — ilustra a doutrina da falsa segurança e presunção espiritual',
    bibleReference: 'Mateus 7:21-23',
    explanation: 'Ignorância tinha certeza de sua salvação baseada em sentimentos e moralidade própria, não em Cristo. A presunção é uma das formas mais perigosas de incredulidade.',
    timerSeconds: 90
  },
  {
    id: 'r-v-005', difficulty: 'veterano',
    context: 'Bunyan descreveu o Monte Sinai tremendo sobre Cristão...',
    riddle: 'Sou sagrado e terrível. Tremo e queimo. Quem se aproxima de mim sem mediador morre. Mas outro monte me substituiu. Quem sou eu e quem me substituiu?',
    hints: ['Moisés recebeu algo em mim', 'Represento a Lei', 'Hebreus 12 me compara com outro monte'],
    answer: 'Monte Sinai (a Lei) foi substituído pelo Monte Sião (a Graça)',
    bibleReference: 'Hebreus 12:18-24',
    explanation: '"Não chegastes ao monte que ardia em fogo... mas chegastes ao Monte Sião." A Lei condena; a Graça em Cristo salva.',
    timerSeconds: 75
  },
  {
    id: 'r-v-006', difficulty: 'veterano',
    context: 'A esposa do Gigante Desespero dava conselhos cruéis ao marido...',
    riddle: 'Meu nome é dúvida sobre Deus. Aconselho meu marido a destruir os presos. Sugeri que eles se matassem. Represento a voz que sussurra que não há esperança. Quem sou?',
    hints: ['Sou esposa do Gigante Desespero', 'Meu conselho era para Cristão se suicidar', 'Represento a desconfiança em Deus'],
    answer: 'Desconfiança (Diffidence) — a voz interior que alimenta o desespero dizendo que Deus abandonou',
    bibleReference: 'Salmos 42:5',
    explanation: '"Por que estás abatida, ó minha alma? Espera em Deus!" A desconfiança alimenta o desespero, mas a esperança em Deus os vence.',
    timerSeconds: 75
  },
  {
    id: 'r-v-007', difficulty: 'veterano',
    context: 'Cristão recebeu três coisas na Cruz: uma marca, vestes e um pergaminho...',
    riddle: 'Sou três em um momento. Um marca o perdão do passado. Outro veste a nova vida do presente. O terceiro garante a glória do futuro. Juntos, somos a salvação completa. O que representamos teologicamente?',
    hints: ['Cada um corresponde a um tempo: passado, presente, futuro', 'São três aspectos da salvação', 'Termos técnicos da teologia reformada'],
    answer: 'Justificação (marca/perdão), Santificação (vestes/nova vida) e Glorificação (pergaminho/garantia)',
    bibleReference: 'Romanos 8:30',
    explanation: 'Bunyan encapsulou a ordo salutis em três presentes: a declaração de justiça, a transformação progressiva e a certeza do destino eterno.',
    timerSeconds: 90
  },
  {
    id: 'r-v-008', difficulty: 'veterano',
    context: 'Na Feira da Vaidade, um julgamento injusto condenou Fiel à morte...',
    riddle: 'Meu tribunal tem 12 vícios sentados como juízes. Meu réu é inocente mas condenado. Meu juiz se chama Ódio-ao-Bem. Meu veredicto estava decidido antes de começar. Que evento bíblico eu espelho?',
    hints: ['Outro inocente foi julgado por um tribunal corrupto', 'Pilatos sabia que era inocente', 'Os acusadores eram motivados por inveja'],
    answer: 'O julgamento de Jesus Cristo diante do Sinédrio e de Pilatos',
    bibleReference: 'Mateus 27:18-26',
    explanation: 'Bunyan modelou o julgamento de Fiel no de Cristo: réu inocente, juízes corruptos, testemunhas falsas, condenação predeterminada. O mundo sempre condenará os fiéis.',
    timerSeconds: 90
  },
  {
    id: 'r-v-009', difficulty: 'veterano',
    context: 'Cristão encontrou dois peregrinos que entraram por cima do muro em vez de pelo portão...',
    riddle: 'Meu companheiro e eu temos nomes que são nosso pecado. Entramos sem convite, caminhamos sem selo, falamos sem substância. Na primeira prova real, desaparecemos. Nosso destino é um abismo. Que doutrina nossa existência ilustra?',
    hints: ['Somos Formalista e Hipocrisia', 'Jesus falou sobre quem sobe por outro lugar', 'Ilustramos um tipo específico de falsa religiosidade'],
    answer: 'A doutrina da falsa conversão — a diferença entre religião externa (formalismo) e fé genuína (regeneração)',
    bibleReference: 'Mateus 23:27-28',
    explanation: '"Sepulcros caiados, belos por fora mas cheios de ossos." Formalista e Hipocrisia representam a religião sem novo nascimento.',
    timerSeconds: 90
  },
  {
    id: 'r-v-010', difficulty: 'veterano',
    context: 'Na Casa do Intérprete, Cristão viu um homem varrendo uma sala empoeirada...',
    riddle: 'Duas mulheres trabalham na mesma sala. A primeira levanta nuvens com sua vassoura e sufoca todos. A segunda borrifador água e tudo fica limpo. Uma trabalha há 3.500 anos, a outra há 2.000. Quem são elas e por que uma falha onde a outra triunfa?',
    hints: ['A vassoura representa algo dado no Sinai', 'A água representa algo dado no Calvário', 'Uma revela, a outra remove'],
    answer: 'A Lei (vassoura — dada por Moisés ~1500 aC) e a Graça (água — dada por Cristo). A Lei agita o pecado mas não pode removê-lo; só a Graça purifica.',
    bibleReference: 'João 1:17',
    explanation: '"A lei foi dada por Moisés; a graça e a verdade vieram por Jesus Cristo." Bunyan ilustrou visualmente a insuficiência da Lei e a suficiência da Graça.',
    timerSeconds: 90
  },
  {
    id: 'r-v-011', difficulty: 'veterano',
    context: 'O Ateu ria dos peregrinos dizendo que a Cidade Celestial não existia...',
    riddle: 'Procurei 20 anos e não achei. Andei muito mas sempre em círculos. Rio dos que ainda buscam porque sofri demais para admitir que eu é que estava errado. Que falácia lógica minha história representa?',
    hints: ['É uma falácia conhecida na filosofia', 'Minha experiência negativa não prova inexistência', 'Nunca estive no caminho certo para começar'],
    answer: 'A falácia do argumento pela ignorância (argumentum ad ignorantiam) e o viés de confirmação — a experiência pessoal de fracasso não invalida a realidade objetiva',
    bibleReference: '2 Pedro 3:3-4',
    explanation: '"Nos últimos dias virão escarnecedores." O Ateu nunca percorreu o caminho correto, mas usa seu fracasso pessoal para negar a verdade objetiva.',
    timerSeconds: 90
  },
];
