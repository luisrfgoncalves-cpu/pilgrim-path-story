import { useState, useEffect, useRef, useCallback } from 'react';
import { sceneImages } from '@/data/sceneImages';
import { playGameSfx } from '@/lib/gameSfx';
import { playRealSfx } from '@/lib/realSfx';
import { renderNarrative } from '@/lib/narrativeRenderer';

export interface EpicMomentConfig {
  /** Unique key for this moment */
  id: string;
  /** Dramatic text lines shown sequentially */
  lines: string[];
  /** Interaction type */
  interaction: 'hold' | 'tap_rapid' | 'reveal';
  /** Duration for hold in ms */
  holdDuration?: number;
  /** Number of rapid taps needed */
  tapCount?: number;
  /** Prompt text shown on the interaction */
  interactionPrompt: string;
  /** Final dramatic text after completing interaction */
  completionText: string;
  /** SFX to play on completion */
  completionSfx?: string;
}

/** Pre-configured epic moments for key scenes */
export const epicMoments: Record<string, EpicMomentConfig> = {
  'cena15': {
    id: 'cruz',
    lines: [
      '{{divine}}A Cruz se ergue diante de você.{{/divine}}',
      'O fardo que carregou por toda a jornada... pesa como nunca.',
      '{{emphasis}}Seus joelhos cedem. Suas mãos tocam o chão.{{/emphasis}}',
    ],
    interaction: 'hold',
    holdDuration: 3000,
    interactionPrompt: 'Soltar o Fardo',
    completionText: '{{divine}}O fardo rola... e desaparece no abismo da Cruz. Você está livre!{{/divine}}',
    completionSfx: 'victory',
  },
  'fase3-cena5': {
    id: 'apolion_climax',
    lines: [
      '{{villain}}Apolião ruge com fúria infernal!{{/villain}}',
      '{{shout}}A espada do Espírito brilha em suas mãos!{{/shout}}',
      '{{tremor}}O chão treme sob o peso da batalha final.{{/tremor}}',
    ],
    interaction: 'tap_rapid',
    tapCount: 10,
    interactionPrompt: 'ATACAR!',
    completionText: '{{shout}}O golpe final! Apolião recua, ferido e derrotado!{{/shout}}',
    completionSfx: 'victory',
  },
  'fase4-cena6': {
    id: 'fiel_julgamento',
    lines: [
      '{{villain}}O Juiz Ódio-ao-Bem ergue seu martelo.{{/villain}}',
      'O silêncio na corte é ensurdecedor.',
      '{{heart}}Fiel permanece firme, mesmo diante da sentença.{{/heart}}',
    ],
    interaction: 'reveal',
    interactionPrompt: 'Testemunhar',
    completionText: '{{divine}}A fidelidade de Fiel brilha mais forte que qualquer sentença terrena.{{/divine}}',
  },
  'fase5-cena6': {
    id: 'chave_promessa',
    lines: [
      'Na escuridão do calabouço, algo brilha no seu peito.',
      '{{emphasis}}A Chave da Promessa! Como pôde esquecer?{{/emphasis}}',
      '{{divine}}Com ela, nenhuma porta permanece trancada.{{/divine}}',
    ],
    interaction: 'hold',
    holdDuration: 2000,
    interactionPrompt: 'Usar a Chave',
    completionText: '{{divine}}A porta se abre! A luz inunda o calabouço! Liberdade!{{/divine}}',
    completionSfx: 'victory',
  },
  'fase6-cena8': {
    id: 'cidade_celestial',
    lines: [
      '{{divine}}Os portões se abrem diante de você.{{/divine}}',
      '{{emphasis}}Trombetas celestiais ecoam por toda a eternidade.{{/emphasis}}',
      '{{divine}}Uma multidão de santos o recebe com cânticos de glória!{{/divine}}',
    ],
    interaction: 'reveal',
    interactionPrompt: 'Entrar',
    completionText: '{{divine}}Bem-vindo à Cidade Celestial. A jornada termina. A eternidade começa.{{/divine}}',
    completionSfx: 'victory',
  },
};

interface EpicMomentProps {
  sceneId: string;
  config: EpicMomentConfig;
  onComplete: () => void;
}

const EpicMoment = ({ sceneId, config, onComplete }: EpicMomentProps) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [showInteraction, setShowInteraction] = useState(false);
  const [interactionDone, setInteractionDone] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [entered, setEntered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const bgImage = sceneImages[sceneId];

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance lines
  useEffect(() => {
    if (lineIndex < config.lines.length - 1) {
      const t = setTimeout(() => setLineIndex(prev => prev + 1), 2500);
      return () => clearTimeout(t);
    } else if (lineIndex === config.lines.length - 1) {
      const t = setTimeout(() => setShowInteraction(true), 1500);
      return () => clearTimeout(t);
    }
  }, [lineIndex, config.lines.length]);

  // Cleanup interval
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleHoldStart = useCallback(() => {
    if (interactionDone) return;
    setHolding(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const pct = Math.min(1, (Date.now() - startTimeRef.current) / (config.holdDuration || 3000));
      setHoldProgress(pct);
      if (pct >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        completeInteraction();
      }
    }, 30);
  }, [interactionDone, config.holdDuration]);

  const handleHoldEnd = useCallback(() => {
    if (interactionDone) return;
    setHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHoldProgress(0);
  }, [interactionDone]);

  const handleTap = useCallback(() => {
    if (interactionDone) return;
    const next = tapCount + 1;
    setTapCount(next);
    playGameSfx('attack');
    if (next >= (config.tapCount || 10)) {
      completeInteraction();
    }
  }, [tapCount, interactionDone, config.tapCount]);

  const handleReveal = useCallback(() => {
    if (interactionDone) return;
    completeInteraction();
  }, [interactionDone]);

  const completeInteraction = () => {
    setInteractionDone(true);
    if (config.completionSfx) {
      playGameSfx(config.completionSfx as any);
    }
    setTimeout(() => setShowCompletion(true), 400);
    setTimeout(onComplete, 4000);
  };

  return (
    <div
      className={`fixed inset-0 z-[65] flex flex-col items-center justify-center transition-opacity duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Parallax background */}
      {bgImage && (
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-[5000ms]"
            style={{
              filter: 'brightness(0.35) saturate(0.7)',
              transform: interactionDone ? 'scale(1.15)' : 'scale(1.05)',
            }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-background/50" />

      {/* Content */}
      <div className="relative z-10 max-w-md mx-6 text-center">
        {/* Narrative lines */}
        {!showCompletion && config.lines.map((line, i) => (
          <p
            key={i}
            className={`font-display text-xl md:text-2xl leading-relaxed mb-4 transition-all duration-700 ${i <= lineIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              color: 'hsl(0 0% 92%)',
              textShadow: '0 2px 16px hsl(0 0% 0% / 0.9)',
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {renderNarrative(line)}
          </p>
        ))}

        {/* Completion text */}
        {showCompletion && (
          <p
            className="font-display text-2xl md:text-3xl leading-relaxed animate-scale-in"
            style={{
              color: 'hsl(43 80% 75%)',
              textShadow: '0 0 30px hsl(43 70% 50% / 0.5), 0 2px 16px hsl(0 0% 0% / 0.9)',
            }}
          >
            {renderNarrative(config.completionText)}
          </p>
        )}

        {/* Interaction zone */}
        {showInteraction && !interactionDone && (
          <div className="mt-10 animate-fade-in">
            {config.interaction === 'hold' && (
              <div className="flex flex-col items-center">
                <svg className="w-24 h-24 mb-3" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(0 0% 25%)" strokeWidth="3" />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="hsl(43 70% 55%)"
                    strokeWidth="3"
                    strokeDasharray={`${holdProgress * 339.3} 339.3`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <button
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={(e) => { e.preventDefault(); handleHoldStart(); }}
                  onTouchEnd={handleHoldEnd}
                  onTouchCancel={handleHoldEnd}
                  className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-xl border transition-all"
                  style={{
                    borderColor: holding ? 'hsl(43 60% 50%)' : 'hsl(0 0% 30%)',
                    color: holding ? 'hsl(43 70% 65%)' : 'hsl(0 0% 60%)',
                    background: holding ? 'hsl(43 30% 15% / 0.3)' : 'transparent',
                  }}
                >
                  {holding ? 'Segure...' : config.interactionPrompt}
                </button>
              </div>
            )}

            {config.interaction === 'tap_rapid' && (
              <div className="flex flex-col items-center">
                {/* Progress bar */}
                <div className="w-48 h-2 bg-secondary rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${(tapCount / (config.tapCount || 10)) * 100}%`,
                      background: 'hsl(0 60% 50%)',
                    }}
                  />
                </div>
                <button
                  onClick={handleTap}
                  className="font-display text-lg uppercase tracking-widest px-8 py-4 rounded-xl border active:scale-95 transition-transform"
                  style={{
                    borderColor: 'hsl(0 50% 40%)',
                    color: 'hsl(0 60% 65%)',
                    background: 'hsl(0 30% 15% / 0.3)',
                    textShadow: '0 0 8px hsl(0 60% 40% / 0.5)',
                  }}
                >
                  ⚔️ {config.interactionPrompt}
                </button>
                <p className="text-[10px] mt-2 text-muted-foreground font-display">
                  {tapCount}/{config.tapCount || 10}
                </p>
              </div>
            )}

            {config.interaction === 'reveal' && (
              <button
                onClick={handleReveal}
                className="font-display text-sm uppercase tracking-widest px-8 py-4 rounded-xl border transition-all active:scale-95"
                style={{
                  borderColor: 'hsl(43 50% 40%)',
                  color: 'hsl(43 60% 65%)',
                  background: 'hsl(43 30% 15% / 0.2)',
                }}
              >
                ✦ {config.interactionPrompt}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EpicMoment;
