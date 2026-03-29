import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { ChoiceEffect } from '@/data/story';
import { ScrollText, TrendingUp } from 'lucide-react';

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

  const state = location.state as ResultState | undefined;

  useEffect(() => {
    if (!state?.consequence || !state?.nextChapterId) {
      navigate('/');
      return;
    }
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => {
      makeChoice(state.currentChapterId, state.nextChapterId, state.choiceText, state.effects, state.flag, state.conditionalEffects);
      navigate('/cena', { replace: true });
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [state, makeChoice, navigate]);

  if (!state?.consequence) return null;

  const changes = Object.entries(state.attributeChanges || {}).filter(([, v]) => v && v > 0);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className={`text-center max-w-sm transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <ScrollText className="w-10 h-10 text-gold mx-auto mb-6" />
        <p className="narrative-text text-foreground italic text-lg leading-relaxed">{state.consequence}</p>

        {/* Attribute changes */}
        {changes.length > 0 && (
          <div className={`mt-6 transition-all duration-700 delay-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-2 justify-center mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Atributos alterados</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {changes.map(([key, val]) => {
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

        <div className="mt-8 flex items-center gap-3 justify-center">
          <div className="h-px w-8 bg-primary/20" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="h-px w-8 bg-primary/20" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">Avançando...</p>
      </div>
    </div>
  );
};

export default ResultPage;
