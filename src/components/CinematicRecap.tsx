import { useState, useEffect } from 'react';
import { sceneImages } from '@/data/sceneImages';
import { ArrowRight } from 'lucide-react';

interface CinematicRecapProps {
  currentChapterId: string;
  chapterTitle: string;
  onContinue: () => void;
  onDismiss: () => void;
}

/** Maps scene IDs to dramatic recap text */
const recapTexts: Record<string, string> = {
  // FASE 1
  'cena1': 'Você despertou com um fardo pesado nas costas... e ouviu um chamado que mudaria tudo.',
  'cena3': 'Você fugiu da Cidade da Destruição. Não há como voltar agora.',
  'cena5': 'O Evangelista apontou o caminho. A Porta Estreita ainda aguarda.',
  'cena7': 'Você bateu na Porta Estreita. O caminho verdadeiro se abriu.',
  'cena10': 'O Monte Sinai tremeu diante de você. A Lei revelou sua força.',
  'cena11': 'O Pântano do Desânimo quase o engoliu...',
  'cena14': 'O Auxílio estendeu a mão no último momento.',
  'cena15': 'Na Cruz, o fardo caiu. Você foi libertado!',
  'cena15b': 'Três Resplandecentes confirmaram sua libertação com novas vestes.',
  // FASE 2
  'fase2-cena1': 'Você entrou na Casa do Intérprete. Grandes verdades foram reveladas.',
  'fase2-cena7': 'O Palácio Belo ofereceu descanso e armadura para a jornada.',
  'fase2-cena9': 'Você vestiu a Armadura de Deus. A batalha se aproxima.',
  // FASE 3
  'fase3-cena3': 'Apolião surgiu das sombras. A batalha começou!',
  'fase3-cena5': 'Você sobreviveu ao confronto com Apolião!',
  'fase3-cena8': 'Fiel se juntou à sua jornada como companheiro fiel.',
  // FASE 4
  'fase4-cena1': 'Você entrou na Feira da Vaidade. Tentações por todos os lados.',
  'fase4-cena6': 'O julgamento de Fiel abalou sua fé.',
  'fase4-cena8': 'Esperança surgiu como novo companheiro de jornada.',
  // FASE 5
  'fase5-cena3': 'O Gigante Desespero o capturou!',
  'fase5-cena6': 'A Chave da Promessa brilhou no escuro — a esperança retornou!',
  'fase5-cena9': 'As Montanhas Deleitosas revelaram a vista da Cidade Celestial ao longe.',
  // FASE 6
  'fase6-cena1': 'O Rio da Morte se estendeu à sua frente. A última travessia.',
  'fase6-cena7': 'Os portões da Cidade Celestial estão à vista!',
  // PARTE 2
  'p2-cena1': 'Cristã ouviu o chamado. Uma nova jornada começou.',
  'p2-cena5': 'A família enfrentou seus primeiros perigos no caminho.',
  'p2-fase2-cena2': 'Na Cruz, a família encontrou libertação.',
  'p2-fase3-cena3': 'O Gigante Maul atacou! Valente interveio.',
  'p2-fase5-cena2': 'O Castelo da Dúvida foi destruído!',
  'p2-fase6-cena6': 'A Cidade Celestial acolheu todos os peregrinos.',
};

/** Get recap text for a given chapter, with fallback by phase prefix */
function getRecapText(chapterId: string): string {
  if (recapTexts[chapterId]) return recapTexts[chapterId];

  // Fallback by phase
  if (chapterId.startsWith('fase6') || chapterId.startsWith('final')) return 'A última etapa da jornada se aproxima. A Cidade Celestial aguarda.';
  if (chapterId.startsWith('fase5')) return 'Você escapou do Castelo da Dúvida. As montanhas chamam.';
  if (chapterId.startsWith('fase4')) return 'A Feira da Vaidade testou seus valores. Mas a jornada continua.';
  if (chapterId.startsWith('fase3')) return 'O Vale da Sombra ficou para trás. Novas batalhas aguardam.';
  if (chapterId.startsWith('fase2')) return 'O caminho estreito revelou verdades profundas.';
  if (chapterId.startsWith('p2-fase')) return 'A família de Cristã avança na jornada de fé.';
  if (chapterId.startsWith('p2-')) return 'Cristã e seus filhos seguem os passos do Peregrino.';
  return 'Sua jornada continua. O caminho se estende à sua frente.';
}

const CinematicRecap = ({ currentChapterId, chapterTitle, onContinue, onDismiss }: CinematicRecapProps) => {
  const [phase, setPhase] = useState<'enter' | 'text' | 'ready'>('enter');
  const bgImage = sceneImages[currentChapterId];
  const recapText = getRecapText(currentChapterId);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 400);
    const t2 = setTimeout(() => setPhase('ready'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image with blur */}
      {bgImage && (
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'blur(8px) brightness(0.3) saturate(0.6)', transform: 'scale(1.1)' }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10 max-w-sm mx-6 text-center">
        {/* "Última vez" label */}
        <p
          className={`text-xs font-display uppercase tracking-[0.3em] mb-4 transition-all duration-700 ${phase !== 'enter' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ color: 'hsl(43 50% 55%)' }}
        >
          ✦ Última vez ✦
        </p>

        {/* Recap text with typewriter-like fade */}
        <p
          className={`font-display text-xl leading-relaxed mb-3 transition-all duration-1000 ${phase !== 'enter' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{
            color: 'hsl(0 0% 90%)',
            textShadow: '0 2px 12px hsl(0 0% 0% / 0.8)',
          }}
        >
          {recapText}
        </p>

        {/* Chapter title */}
        <p
          className={`text-sm italic text-muted-foreground mb-8 transition-all duration-700 delay-300 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}
        >
          {chapterTitle}
        </p>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className={`btn-medieval px-8 py-3 flex items-center gap-3 mx-auto transition-all duration-500 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Continuar Jornada <ArrowRight className="w-5 h-5" />
        </button>

        {/* Skip */}
        <button
          onClick={onDismiss}
          className={`text-[10px] font-display uppercase tracking-widest mt-4 transition-opacity duration-500 ${phase === 'ready' ? 'opacity-50' : 'opacity-0'}`}
          style={{ color: 'hsl(0 0% 45%)' }}
        >
          Pular
        </button>
      </div>
    </div>
  );
};

export default CinematicRecap;
