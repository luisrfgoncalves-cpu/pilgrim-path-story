import { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { characterImages } from '@/data/characterImages';
import { characters } from '@/data/story';
import { part2Characters } from '@/data/storyPart2';

/**
 * Allegory card descriptions — what each character *represents* spiritually.
 * Shown on FIRST encounter only, with enough time to read.
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
    // NO auto-dismiss — user must tap/click to close
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

  return (
    <div
      className={`fixed inset-0 z-[56] flex items-center justify-center px-4 transition-all duration-500 ${
        phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0 scale-95' : 'opacity-100'
      }`}
      onClick={() => {
        setPhase('exit');
        setTimeout(onDismiss, 500);
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      {/* Card */}
      <div
        className={`relative z-10 max-w-sm w-full rounded-2xl overflow-hidden transition-all duration-700 ${
          phase === 'visible' ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
        style={{
          border: `2px solid ${colors.border}`,
          boxShadow: `0 0 40px ${colors.glow}, 0 20px 40px hsl(0 0% 0% / 0.6)`,
          background: 'hsl(var(--card))',
        }}
      >
        {/* Character image — top section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={img}
            alt={char.name}
            className="w-full h-full object-cover object-top"
            style={{
              filter: 'contrast(1.1) brightness(1.05)',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          />
          {/* Type badge */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider"
            style={{ background: colors.badge, color: colors.badgeText }}
          >
            {colors.label}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 -mt-4 relative">
          {/* Name */}
          <h3
            className="font-display text-2xl font-bold mb-1"
            style={{ color: colors.badgeText, textShadow: '0 2px 8px hsl(0 0% 0% / 0.6)' }}
          >
            {char.name}
          </h3>
          <p className="text-xs text-muted-foreground font-display uppercase tracking-wider mb-3">
            {char.role}
          </p>

          {/* Allegory meaning */}
          {allegory && (
            <>
              <div className="flex items-start gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  {allegory.meaning}
                </p>
              </div>
              {allegory.verse && (
                <p className="text-xs text-primary/70 leading-relaxed pl-6 border-l-2 ml-1"
                  style={{ borderColor: colors.border }}>
                  {allegory.verse}
                </p>
              )}
            </>
          )}

          {/* Tap hint */}
          <p className="text-[10px] text-muted-foreground/50 text-center mt-4 font-display uppercase tracking-widest">
            Toque para continuar
          </p>
        </div>
      </div>
    </div>
  );
}

export { allegoryMeanings };
