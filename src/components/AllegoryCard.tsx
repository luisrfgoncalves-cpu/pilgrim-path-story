import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { characterImages } from '@/data/characterImages';
import { characters } from '@/data/story';
import { part2Characters } from '@/data/storyPart2';

/**
 * Allegory card descriptions — what each character *represents* spiritually.
 * Shown on FIRST encounter only. User must manually dismiss.
 */
const allegoryMeanings: Record<string, { meaning: string; verse?: string; type: 'ally' | 'villain' | 'warning' | 'divine' | 'family' }> = {
  obstinado: {
    meaning: 'Representa aqueles que se recusam a ouvir o chamado de Deus, preferindo a falsa segurança do que já conhecem.',
    verse: 'Provérbios 1:7 — "O temor do Senhor é o princípio do conhecimento; os loucos desprezam a sabedoria e a instrução."',
    type: 'villain',
  },
  flexivel: {
    meaning: 'Representa a fé superficial — aceita o caminho enquanto é fácil, mas abandona no primeiro sofrimento.',
    verse: 'Mateus 13:20-21 — "O que foi semeado em pedregulhos é o que ouve a palavra e logo a recebe com alegria; mas não tem raiz em si mesmo."',
    type: 'warning',
  },
  evangelista: {
    meaning: 'O pregador fiel que aponta para Cristo — não para si mesmo. Reaparece nos momentos em que o peregrino se desvia.',
    verse: 'Romanos 10:14 — "Como crerão naquele de quem não ouviram? E como ouvirão se não há quem pregue?"',
    type: 'ally',
  },
  prudencia_mundana: {
    meaning: 'A tentação de resolver o problema do pecado com moralidade humana em vez de graça divina.',
    verse: '1 Coríntios 3:19 — "A sabedoria deste mundo é loucura diante de Deus."',
    type: 'villain',
  },
  auxilio: {
    meaning: 'A graça de Deus que se estende quando nossas forças acabam. Não nos salva por mérito, mas por misericórdia.',
    verse: '2 Coríntios 12:9 — "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza."',
    type: 'ally',
  },
  boa_vontade: {
    meaning: 'A graça que recebe quem busca a entrada. Abre a porta e puxa o pecador para dentro antes que as flechas do inimigo o alcancem.',
    verse: 'João 6:37 — "Todo aquele que o Pai me dá virá a mim; e o que vem a mim de maneira nenhuma o lançarei fora."',
    type: 'divine',
  },
  tres_resplandecentes: {
    meaning: 'Três anjos que declaram: pecados perdoados, vestes novas, e o pergaminho selado como passaporte para a Cidade Celestial.',
    verse: '2 Coríntios 5:17 — "Se alguém está em Cristo, nova criatura é."',
    type: 'divine',
  },
  presuncao_preguica_simples: {
    meaning: 'Três homens acorrentados à beira do caminho que se recusam a despertar: Presunção ("cada um cuide de si"), Preguiça ("mais um cochilo"), e Simples ("não vejo perigo").',
    verse: 'Provérbios 6:10-11 — "Um pouco de sono, um pouco de tosquejar de mãos para dormir; assim sobrevirá a tua pobreza."',
    type: 'warning',
  },
  esposa_cristao: {
    meaning: 'A família que não compreende o chamado espiritual. Na Parte I, ela pede que Cristão volte a dormir. Na Parte II, ela se arrepende e faz a mesma jornada.',
    verse: 'Lucas 14:26 — "Se alguém vier a mim e não aborrecer a seu pai, e mãe… não pode ser meu discípulo."',
    type: 'family',
  },
  vizinhos: {
    meaning: 'Os moradores da Cidade da Destruição — representam a indiferença do mundo diante do chamado divino. Zombam, fecham as janelas e riem.',
    verse: 'Mateus 7:13 — "Larga é a porta, e espaçoso o caminho que conduz à perdição, e muitos são os que entram por ela."',
    type: 'warning',
  },
  interprete: {
    meaning: 'O sábio que revela verdades espirituais através de visões e parábolas vivas. Cada visão é um espelho da alma.',
    verse: '1 Coríntios 2:10 — "Deus no-las revelou pelo seu Espírito; porque o Espírito penetra todas as coisas."',
    type: 'ally',
  },
  apolion: {
    meaning: 'O governante do Vale da Humilhação — uma criatura coberta de escamas que tenta destruir quem serve a Cristo.',
    verse: 'Tiago 4:7 — "Sujeitai-vos a Deus, resisti ao diabo, e ele fugirá de vós."',
    type: 'villain',
  },
  fiel: {
    meaning: 'Um companheiro que morre não porque falhou, mas porque se recusou a negar a verdade. Sua morte não é derrota — é testemunho.',
    verse: 'Apocalipse 2:10 — "Sê fiel até à morte, e dar-te-ei a coroa da vida."',
    type: 'ally',
  },
  esperanca: {
    meaning: 'Convertido pelo martírio de Fiel. Torna-se o companheiro fiel de Cristão até a Cidade Celestial.',
    verse: 'Romanos 5:3-4 — "A tribulação produz a paciência, e a paciência a experiência, e a experiência a esperança."',
    type: 'ally',
  },
  gigante_desespero: {
    meaning: 'O dono do Castelo da Dúvida. Aprisiona peregrinos que se desviam e tenta convencê-los a desistir da vida.',
    verse: '2 Pedro 1:4 — "Nos têm sido doadas as suas preciosas e grandíssimas promessas."',
    type: 'villain',
  },
  homem_gaiola: {
    meaning: 'Um ex-peregrino preso no desespero, incapaz de recuperar a graça que rejeitou. Serve como aviso solene.',
    verse: 'Hebreus 6:4-6 — "É impossível que os que uma vez foram iluminados… e recaíram, sejam outra vez renovados para arrependimento."',
    type: 'warning',
  },
  formalista: {
    meaning: 'Pula o muro do caminho em vez de entrar pela Porta Estreita. Acredita que rituais externos bastam, sem transformação interior.',
    verse: 'Mateus 23:27 — "Ai de vós, escribas e fariseus, hipócritas! Pois sois semelhantes aos sepulcros caiados."',
    type: 'warning',
  },
  hipocrisia: {
    meaning: 'Companheiro de Formalista que finge piedade sem verdadeira conversão do coração.',
    verse: 'Isaías 29:13 — "Este povo se aproxima de mim com a sua boca… mas o seu coração está longe de mim."',
    type: 'warning',
  },
  vergonha: {
    meaning: 'Tenta convencer que a religião é coisa vergonhosa, indigna de homens corajosos. Usa pressão social contra a fé.',
    verse: 'Romanos 1:16 — "Não me envergonho do evangelho de Cristo, pois é o poder de Deus para salvação."',
    type: 'villain',
  },
  vigilante: {
    meaning: 'O porteiro que encoraja o peregrino a passar entre os leões acorrentados, revelando que estão sob controle.',
    verse: 'Salmo 91:13 — "Pisarás o leão e a cobra; calcarás aos pés o filho do leão e a serpente."',
    type: 'ally',
  },
  demas: {
    meaning: 'Fica ao lado de uma mina de prata chamando peregrinos para se desviarem por ganância. Muitos que entraram nunca saíram.',
    verse: '1 Timóteo 6:10 — "O amor ao dinheiro é raiz de todos os males."',
    type: 'villain',
  },
  livro_antigo: {
    meaning: 'O Livro que Cristão abre representa a Bíblia — a Palavra de Deus que revela a verdade sobre o pecado e a condenação. É o instrumento que desperta a consciência adormecida.',
    verse: 'Hebreus 4:12 — "A palavra de Deus é viva e eficaz, e mais penetrante do que qualquer espada de dois gumes."',
    type: 'divine',
  },
  interesses: {
    meaning: 'O homem de Bom-Discurso que segue a religião apenas quando ela caminha "com chinelos de prata" — sob o sol e com aplausos. Sua fé é ornamento, não sacrifício.',
    verse: '2 Timóteo 4:10 — "Demas me desamparou, amando o presente século."',
    type: 'villain',
  },
  pequena_fe: {
    meaning: 'Um peregrino que foi assaltado e perdeu quase tudo, menos o pergaminho. Representa aqueles que têm fé genuína mas vivem como mendigos quando poderiam caminhar como príncipes.',
    verse: 'Mateus 14:31 — "Homem de pequena fé, por que duvidaste?"',
    type: 'warning',
  },
  discricao: {
    meaning: 'Uma das donzelas do Palácio Belo que examina e instrui o peregrino. Representa o discernimento cristão que testa e fortalece a fé antes das provas.',
    verse: 'Filipenses 1:9-10 — "Que o vosso amor aumente mais e mais em ciência e em todo o conhecimento, para que aproveis as coisas excelentes."',
    type: 'ally',
  },
  pastores: {
    meaning: 'Conhecimento, Experiência, Vigilante e Sincero — os pastores das Montanhas Deleitosas que mostram a Cidade Celestial pela luneta e alertam sobre os perigos finais.',
    verse: 'Jeremias 3:15 — "Dar-vos-ei pastores segundo o meu coração, que vos apascentem com ciência e inteligência."',
    type: 'ally',
  },
  lisonjeiro: {
    meaning: 'O Adulador que se veste de anjo de luz para desviar peregrinos com palavras doces. Sua rede prende quem segue conselhos sem verificar na Palavra.',
    verse: '2 Coríntios 11:14 — "O próprio Satanás se transfigura em anjo de luz."',
    type: 'villain',
  },
  ateismo: {
    meaning: 'Um homem que buscou a Cidade Celestial por vinte anos, desistiu e agora zomba de quem ainda busca. Representa a descrença que nasce do cansaço espiritual.',
    verse: 'Salmo 14:1 — "Disse o néscio no seu coração: Não há Deus."',
    type: 'villain',
  },
  ignorancia: {
    meaning: 'O homem que fez toda a jornada sem nunca passar pela Porta Estreita. Confia em boas obras mas não tem o pergaminho selado. É rejeitado nos portões da Cidade Celestial.',
    verse: 'Mateus 7:22-23 — "Muitos me dirão naquele dia: Senhor, Senhor! E então lhes direi abertamente: Nunca vos conheci."',
    type: 'warning',
  },
  falador: {
    meaning: 'Fala com eloquência sobre a fé mas nunca a pratica. Sua religião está nos lábios, não no coração. Fiel o desmascarou com perguntas simples.',
    verse: 'Tiago 1:22 — "Sede cumpridores da palavra e não somente ouvintes, enganando-vos a vós mesmos."',
    type: 'warning',
  },
  desconfianca: {
    meaning: 'Esposa do Gigante Desespero, que sussurra conselhos cruéis ao marido sobre como torturar os prisioneiros. Representa a voz interior que amplifica a dúvida e incentiva a destruição.',
    verse: 'Provérbios 12:25 — "A ansiedade no coração do homem o abate, mas a boa palavra o alegra."',
    type: 'villain',
  },
  juiz_odio_ao_bem: {
    meaning: 'O juiz cruel da Feira da Vaidade que condena Fiel à morte. Seu nome revela sua natureza: ele odeia tudo que é bom porque a bondade expõe sua corrupção.',
    verse: 'João 15:18 — "Se o mundo vos odeia, sabei que, primeiro do que a vós, me odiou a mim."',
    type: 'villain',
  },
  amor_dinheiro: {
    meaning: 'Um cavalheiro da Feira da Vaidade que ensina que servir a Deus e buscar riquezas são perfeitamente compatíveis. Representa a teologia da prosperidade.',
    verse: 'Mateus 6:24 — "Ninguém pode servir a dois senhores; porque ou há de odiar um e amar o outro."',
    type: 'villain',
  },
  prudencia: {
    meaning: 'Donzela do Palácio Belo que questiona Cristão sobre suas motivações internas. Representa o autoexame necessário antes de cada batalha espiritual.',
    verse: 'Lamentações 3:40 — "Esquadrinhemos os nossos caminhos, e provemo-los, e voltemos para o Senhor."',
    type: 'ally',
  },
  piedade: {
    meaning: 'Donzela do Palácio Belo que fortalece a esperança do peregrino falando das maravilhas da Cidade Celestial. Representa a contemplação devocional.',
    verse: 'Filipenses 3:14 — "Prossigo para o alvo, pelo prêmio da soberana vocação de Deus em Cristo Jesus."',
    type: 'ally',
  },
  caridade: {
    meaning: 'Donzela do Palácio Belo que pergunta sobre a família de Cristão e o encoraja à compaixão. Representa o amor cristão que não abandona ninguém.',
    verse: '1 Coríntios 13:13 — "Agora, pois, permanecem a fé, a esperança e a caridade, estas três; mas a maior destas é a caridade."',
    type: 'ally',
  },
  timidez_desconfianca: {
    meaning: 'Dois homens que fogem dos leões acorrentados, representando os que abandonam a jornada por medo de perigos que na verdade estão sob controle divino.',
    verse: '2 Timóteo 1:7 — "Deus não nos deu o espírito de temor, mas de fortaleza, de amor e de moderação."',
    type: 'warning',
  },
  volta_atras: {
    meaning: 'Um apóstata capturado por sete demônios e levado de volta ao abismo. Visto nas Montanhas Deleitosas como aviso solene de que abandonar o caminho tem consequências eternas.',
    verse: '2 Pedro 2:21 — "Melhor lhes fora não terem conhecido o caminho da justiça do que, conhecendo-o, desviarem-se do santo mandamento."',
    type: 'warning',
  },

  // ── Protagonistas ──
  cristao: {
    meaning: 'O Peregrino — um homem comum esmagado pelo peso de seus pecados que parte em busca da Cidade Celestial. Representa todo pecador que ouve o chamado de Deus e decide abandonar tudo para segui-Lo.',
    verse: 'Lucas 14:33 — "Qualquer de vós que não renunciar a tudo quanto tem, não pode ser meu discípulo."',
    type: 'ally',
  },

  // ── Parte II — A Peregrina ──
  crista: {
    meaning: 'Esposa de Cristão, que se arrependeu por não tê-lo acompanhado. Representa o arrependimento tardio que ainda encontra a porta aberta — e a coragem de refazer o caminho com filhos e responsabilidades.',
    verse: 'Joel 2:25 — "Restituir-vos-ei os anos que foram consumidos pelo gafanhoto."',
    type: 'ally',
  },
  misericordia: {
    meaning: 'Jovem vizinha que acompanha Cristã sem ter recebido carta do Rei. Representa a fé que nasce não de um chamado direto, mas do amor por alguém que crê — a compaixão como porta de entrada para a graça.',
    verse: 'Rute 1:16 — "Aonde quer que fores, irei eu; e onde quer que pousares, ali pousarei eu."',
    type: 'ally',
  },
  grande_coracao: {
    meaning: 'Soldado designado pelo Intérprete para escoltar o grupo. Onde Cristão caminhou sozinho, Cristã recebe um protetor. Representa o cuidado providencial de Deus — matador de gigantes e defensor dos fracos.',
    verse: 'Salmos 91:11 — "Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos."',
    type: 'divine',
  },
  velho_honesto: {
    meaning: 'Da Cidade da Estupidez, viu a Luz e se juntou ao grupo. Prolixo e imperfeito, mas genuíno. Representa aqueles de origens improváveis que encontram a verdade apesar de tudo.',
    verse: '1 Coríntios 1:27 — "Deus escolheu as coisas loucas deste mundo para confundir as sábias."',
    type: 'ally',
  },
  gaio: {
    meaning: 'Hospedeiro generoso que recebe peregrinos com pão e vinho entre os vales e a feira. Representa a hospitalidade cristã como ministério sagrado — abrir a casa é abrir o coração de Deus.',
    verse: 'Hebreus 13:2 — "Não vos esqueçais da hospitalidade, porque por ela alguns, sem o saberem, hospedaram anjos."',
    type: 'ally',
  },
  mente_fraca: {
    meaning: 'Homem frágil resgatado das garras do Gigante Mata-Bons. Representa os crentes de constituição fraca que precisam da proteção do corpo de Cristo para sobreviver — fé genuína em vaso frágil.',
    verse: 'Mateus 12:20 — "Não esmagará a cana quebrada, e não apagará a torcida que fumega."',
    type: 'warning',
  },
  pronto_para_parar: {
    meaning: 'Aleijado que caminha com muletas, a cada passo dizem que vai desistir — mas nunca para. Representa a perseverança que não depende de força física, mas de determinação espiritual inabalável.',
    verse: '2 Coríntios 12:9 — "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza."',
    type: 'ally',
  },
  sr_desanimo: {
    meaning: 'Prisioneiro resgatado do Castelo da Dúvida que continua lamentando até o fim. Mas na hora de cruzar o rio, suas últimas palavras surpreendem: "Adeus, noite. Bem-vindo, dia." O desânimo não cruza a eternidade.',
    verse: 'Salmo 30:5 — "O choro pode durar uma noite, mas a alegria vem pela manhã."',
    type: 'warning',
  },
  muito_medo: {
    meaning: 'Filha do Sr. Desânimo, viveu em terror constante. Mas atravessa o rio cantando — ela que nunca cantou na vida. Representa a transformação final: o medo não tem a última palavra.',
    verse: 'Apocalipse 21:4 — "E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto."',
    type: 'ally',
  },
  valente_pela_verdade: {
    meaning: 'Guerreiro coberto de sangue após lutar contra três bandidos — Coração-Fraco, Desconfiança e Culpa. Empunha uma lâmina legítima de Jerusalém. Suas palavras de despedida são as mais famosas de Bunyan: "Minha espada, eu a deixo a quem me suceder."',
    verse: '2 Timóteo 4:7 — "Combati o bom combate, acabei a carreira, guardei a fé."',
    type: 'ally',
  },
  firme: {
    meaning: 'Encontrado ajoelhado em oração na Terra Encantada, resistindo à sedução de Madame Bolha. Não lutou com espada, mas de joelhos. A oração silenciosa é a arma mais poderosa contra a tentação.',
    verse: 'Tiago 4:7 — "Resisti ao diabo, e ele fugirá de vós."',
    type: 'ally',
  },
  madame_bolha: {
    meaning: 'Mulher elegante que oferece ouro, corpo e cama para desviar peregrinos. Representa as tentações materiais e carnais que se apresentam como liberdade mas são escravidão disfarçada.',
    verse: 'Provérbios 7:21-23 — "Seduziu-o com a suavidade dos seus lábios. Vai após ela como o boi vai ao matadouro."',
    type: 'villain',
  },
};

interface AllegoryCardProps {
  characterId: string;
  onDismiss: () => void;
}

export function AllegoryCard({ characterId, onDismiss }: AllegoryCardProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');
  const allChars = [...characters, ...part2Characters];
  const char = allChars.find(c => c.id === characterId);
  const img = characterImages[characterId];
  const allegory = allegoryMeanings[characterId];

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('visible'), 300);
    return () => { clearTimeout(enterTimer); };
  }, []);

  if (!char || !img) return null;

  const typeColors = {
    ally: { border: 'hsl(120 40% 35%)', glow: 'hsl(120 50% 40% / 0.3)', badge: 'hsl(120 40% 25%)', badgeText: 'hsl(120 50% 75%)', label: '🕊️ Aliado' },
    villain: { border: 'hsl(0 50% 40%)', glow: 'hsl(0 50% 40% / 0.3)', badge: 'hsl(0 40% 25%)', badgeText: 'hsl(0 50% 75%)', label: '⚔️ Opositor' },
    warning: { border: 'hsl(40 60% 40%)', glow: 'hsl(40 60% 40% / 0.3)', badge: 'hsl(40 40% 25%)', badgeText: 'hsl(40 60% 75%)', label: '⚠️ Advertência' },
    divine: { border: 'hsl(50 80% 60%)', glow: 'hsl(50 80% 60% / 0.4)', badge: 'hsl(50 60% 25%)', badgeText: 'hsl(50 80% 80%)', label: '✨ Divino' },
    family: { border: 'hsl(30 50% 45%)', glow: 'hsl(30 50% 45% / 0.3)', badge: 'hsl(30 40% 25%)', badgeText: 'hsl(30 50% 70%)', label: '🏠 Família' },
  };

  const colors = allegory ? typeColors[allegory.type] : typeColors.ally;

  const handleDismiss = () => {
    setPhase('exit');
    setTimeout(onDismiss, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[56] flex items-center justify-center px-3 py-4 transition-all duration-500 ${
        phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0 scale-95' : 'opacity-100'
      }`}
      style={{ overflow: 'auto' }}
    >
      {/* Backdrop - NOT clickable to close, user must use button */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

      {/* Card - scrollable if needed on small screens */}
      <div
        className={`relative z-10 max-w-md w-full rounded-2xl overflow-hidden transition-all duration-700 ${
          phase === 'visible' ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
        style={{
          border: `2px solid ${colors.border}`,
          boxShadow: `0 0 40px ${colors.glow}, 0 20px 40px hsl(0 0% 0% / 0.6)`,
          background: 'hsl(var(--card))',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Character image — large, NOT cropped at head */}
        <div className="relative flex-shrink-0" style={{ minHeight: '220px', maxHeight: '280px' }}>
          <img
            src={img}
            alt={char.name}
            className="w-full h-full object-cover"
            style={{
              height: '280px',
              objectPosition: 'center 15%', // Show head/face, not crop from top
              filter: 'contrast(1.1) brightness(1.08)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            }}
          />
          {/* Type badge */}
          <div
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider"
            style={{ background: colors.badge, color: colors.badgeText }}
          >
            {colors.label}
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="px-5 pb-5 -mt-4 relative overflow-y-auto flex-1">
          {/* Name */}
          <h3
            className="font-display text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: colors.badgeText, textShadow: '0 2px 8px hsl(0 0% 0% / 0.6)' }}
          >
            {char.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-display uppercase tracking-wider mb-3">
            {char.role}
          </p>

          {/* Allegory meaning */}
          {allegory && (
            <>
              <div className="flex items-start gap-2.5 mb-3">
                <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed italic">
                  {allegory.meaning}
                </p>
              </div>
              {allegory.verse && (
                <p className="text-xs sm:text-sm text-primary/70 leading-relaxed pl-6 border-l-2 ml-1"
                  style={{ borderColor: colors.border }}>
                  {allegory.verse}
                </p>
              )}
            </>
          )}

          {/* Dismiss button — ONLY way to close */}
          <button
            className="mt-5 w-full py-3.5 rounded-xl text-sm sm:text-base font-display font-bold uppercase tracking-wider transition-all active:scale-95"
            style={{
              background: colors.badge,
              color: colors.badgeText,
              border: `1px solid ${colors.border}`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
          >
            Entendi — Continuar
          </button>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2 font-display uppercase tracking-widest">
            Toque no botão acima para continuar
          </p>
        </div>
      </div>
    </div>
  );
}

export { allegoryMeanings };
