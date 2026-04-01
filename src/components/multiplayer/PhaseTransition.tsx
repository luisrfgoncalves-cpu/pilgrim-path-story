// Phase Transition Cutscene — full-screen narrative when entering a new phase
import { useEffect, useState } from 'react';
import { PHASES } from './ImmersiveBoardTypes';
import { characterImages } from '@/data/characterImages';

interface PhaseTransitionProps {
  phaseIdx: number;
  onComplete: () => void;
}

const PHASE_NARRATIVES = [
  {
    title: 'A Partida',
    lines: [
      'Cristão larga tudo e foge da Cidade da Destruição...',
      'O fardo em suas costas pesa mais a cada passo.',
      'Evangelista aponta o caminho: a Porta Estreita é o destino.',
      '«Fuja da ira vindoura!»',
    ],
  },
  {
    title: 'O Caminho',
    lines: [
      'O Pântano do Desânimo se abre diante dos peregrinos...',
      'A lama da dúvida puxa seus pés para baixo.',
      'Mas a Casa do Intérprete aguarda com sabedoria.',
      '«Não olhe para trás — olhe para a Cruz.»',
    ],
  },
  {
    title: 'O Vale da Sombra',
    lines: [
      'Trevas envolvem o caminho. Sons terríveis ecoam.',
      'O Vale da Sombra da Morte não perdoa os fracos.',
      'Demônios sussurram blasfêmias ao ouvido do peregrino.',
      '«Ainda que eu ande pelo vale... não temerei mal.»',
    ],
  },
  {
    title: 'A Feira da Vaidade',
    lines: [
      'O brilho falso da Feira da Vaidade seduz os viajantes.',
      'Tudo está à venda: prazeres, honras, reinos...',
      'Fiel pagará o preço mais alto por sua fé.',
      '«Comprai a verdade e não a vendais.»',
    ],
  },
  {
    title: 'O Castelo da Dúvida',
    lines: [
      'As masmorras do Gigante Desespero se fecham.',
      'Correntes de dúvida prendem mãos e pés.',
      'Mas existe uma Chave — a Chave da Promessa.',
      '«A Palavra do Senhor é a minha liberdade.»',
    ],
  },
  {
    title: 'A Travessia Final',
    lines: [
      'O Rio da Morte se estende — negro e profundo.',
      'Não há ponte. Não há barco. Só a fé sustenta.',
      'Do outro lado, os portões de ouro brilham.',
      '«Quando passares pelas águas, eu serei contigo.»',
    ],
  },
];

export default function PhaseTransition({ phaseIdx, onComplete }: PhaseTransitionProps) {
  const [lineIdx, setLineIdx] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [exiting, setExiting] = useState(false);

  const phase = PHASES[phaseIdx];
  const narrative = PHASE_NARRATIVES[phaseIdx] || PHASE_NARRATIVES[0];
  const charImg = phase?.characterKey ? characterImages[phase.characterKey] : null;

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setOpacity(1), 100);

    // Advance lines automatically
    const timers: number[] = [];
    narrative.lines.forEach((_, i) => {
      if (i > 0) {
        timers.push(window.setTimeout(() => setLineIdx(i), i * 2200));
      }
    });

    // Do NOT auto-close — user must close manually

    return () => {
      clearTimeout(fadeIn);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
      style={{
        opacity: exiting ? 0 : opacity,
        transition: 'opacity 0.8s ease-in-out',
      }}
    >
      {/* Background with phase image */}
      <div className="absolute inset-0">
        {phase?.bgImage && (
          <img
            src={phase.bgImage}
            alt={phase.name}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) saturate(1.5) blur(2px)' }}
          />
        )}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 60%, hsla(${phase?.accentHue || 0} 30% 10% / 0.6), hsla(0 0% 0% / 0.9))`,
        }} />
      </div>

      {/* Character silhouette */}
      {charImg && (
        <div className="absolute right-0 bottom-0 w-48 h-72 opacity-20 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to top, black 30%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 90%)',
          }}
        >
          <img src={charImg} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-6 space-y-6 text-center">
        {/* Phase icon */}
        <div className="text-6xl" style={{
          filter: `drop-shadow(0 0 40px hsla(${phase?.accentHue || 45} 70% 50% / 0.5))`,
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          {phase?.icon || '✨'}
        </div>

        {/* Phase number */}
        <p className="text-xs font-display uppercase tracking-[0.4em]"
          style={{ color: `hsl(${phase?.accentHue || 45} 50% 55%)` }}
        >
          Fase {phaseIdx + 1} de 6
        </p>

        {/* Title */}
        <h2 className="text-3xl font-display font-bold"
          style={{
            color: `hsl(${phase?.accentHue || 45} 60% 75%)`,
            textShadow: `0 0 40px hsla(${phase?.accentHue || 45} 70% 50% / 0.4)`,
          }}
        >
          {narrative.title}
        </h2>

        {/* Subtitle */}
        <p className="text-sm font-display italic"
          style={{ color: `hsl(${phase?.accentHue || 45} 40% 60%)` }}
        >
          {phase?.subtitle}
        </p>

        {/* Narrative lines */}
        <div className="space-y-3 min-h-[120px]">
          {narrative.lines.map((line, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed font-display transition-all duration-700"
              style={{
                color: 'hsl(0 0% 85%)',
                opacity: i <= lineIdx ? 1 : 0,
                transform: i <= lineIdx ? 'translateY(0)' : 'translateY(12px)',
                textShadow: i === lineIdx ? '0 0 15px rgba(255,255,255,0.2)' : undefined,
                fontStyle: i === narrative.lines.length - 1 ? 'italic' : undefined,
                fontWeight: i === narrative.lines.length - 1 ? 700 : undefined,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={() => { setExiting(true); setTimeout(onComplete, 400); }}
          className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
        >
          Toque para pular ▸
        </button>
      </div>
    </div>
  );
}
