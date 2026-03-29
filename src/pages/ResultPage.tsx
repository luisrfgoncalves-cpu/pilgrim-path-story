import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { ChoiceEffect } from '@/data/story';
import { ScrollText, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface ResultState {
  consequence: string;
  nextChapterId: string;
  choiceText: string;
  effects: ChoiceEffect;
  currentChapterId: string;
  attributeChanges: ChoiceEffect;
  flag?: string;
  conditionalEffects?: any[];
}

const attrLabels: Record<string, { label: string; emoji: string }> = {
  fe: { label: 'Fé', emoji: '🔥' },
  perseveranca: { label: 'Perseverança', emoji: '⛰️' },
  discernimento: { label: 'Discernimento', emoji: '👁️' },
  coragem: { label: 'Coragem', emoji: '🛡️' },
};

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { makeChoice } = useStoryProgress();
  const [show, setShow] = useState(false);
  const [showAttrs, setShowAttrs] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const state = location.state as ResultState | undefined;

  useEffect(() => {
    if (!state?.consequence || !state?.nextChapterId) {
      navigate('/');
      return;
    }
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => setShowAttrs(true), 800);
    const t3 = setTimeout(() => {
      if (autoAdvance) {
        makeChoice(state.currentChapterId, state.nextChapterId, state.choiceText, state.effects, state.flag, state.conditionalEffects);
        navigate('/cena', { replace: true });
      }
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [state, makeChoice, navigate, autoAdvance]);

  if (!state?.consequence) return null;

  const positiveChanges = Object.entries(state.attributeChanges || {}).filter(([, v]) => v && v > 0);
  const negativeChanges = Object.entries(state.attributeChanges || {}).filter(([, v]) => v && v < 0);
  const hasChanges = positiveChanges.length > 0 || negativeChanges.length > 0;

  // Split consequence into paragraphs (dice hints come after \n\n)
  const consequenceParts = state.consequence.split('\n\n').filter(Boolean);

  const handleTap = () => {
    setAutoAdvance(false);
    makeChoice(state.currentChapterId, state.nextChapterId, state.choiceText, state.effects, state.flag, state.conditionalEffects);
    navigate('/cena', { replace: true });
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-8 cursor-pointer"
      onClick={handleTap}
    >
      <div className={`text-center max-w-sm transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <ScrollText className="w-10 h-10 text-primary mx-auto mb-6" />

        {/* Main consequence */}
        <p className="narrative-text text-foreground italic text-lg leading-relaxed">
          {consequenceParts[0]}
        </p>

        {/* Dice narrative hint (if present) */}
        {consequenceParts.length > 1 && (
          <p className={`narrative-text text-primary/80 italic text-sm leading-relaxed mt-3 transition-all duration-700 delay-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
            {consequenceParts[1]}
          </p>
        )}

        {/* Attribute changes — positive and negative */}
        {hasChanges && (
          <div className={`mt-6 space-y-3 transition-all duration-700 ${showAttrs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {positiveChanges.length > 0 && (
              <div>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Fortalecido</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {positiveChanges.map(([key, val]) => {
                    const info = attrLabels[key];
                    return (
                      <span key={key} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-primary/20 text-xs text-foreground">
                        {info?.emoji} {info?.label} <span className="text-primary font-display">+{val}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {negativeChanges.length > 0 && (
              <div>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <TrendingDown className="w-3.5 h-3.5 text-destructive/70" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Abalado</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {negativeChanges.map(([key, val]) => {
                    const info = attrLabels[key];
                    return (
                      <span key={key} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-destructive/20 text-xs text-foreground">
                        {info?.emoji} {info?.label} <span className="text-destructive font-display">{val}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 justify-center">
          <div className="h-px w-8 bg-primary/20" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="h-px w-8 bg-primary/20" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          Toque para avançar <ArrowRight className="w-3 h-3" />
        </p>
      </div>
    </div>
  );
};

export default ResultPage;
