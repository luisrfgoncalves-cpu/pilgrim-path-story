import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { hasProgress, startJourney, resetProgress, progress } = useStoryProgress();

  const handleContinue = () => {
    startJourney();
    navigate('/cena');
  };

  const handleNewJourney = () => {
    resetProgress();
    startJourney();
    navigate('/cena');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <div className="max-w-sm w-full space-y-8 fade-in text-center">
        {/* Logo */}
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center glow-gold">
            <BookOpen className="w-9 h-9 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-foreground">O Peregrino</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Uma jornada interativa</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {hasProgress ? (
            <>
              <button
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity glow-gold"
              >
                <ChevronRight className="w-5 h-5" />
                Continuar Jornada
              </button>
              <p className="text-xs text-muted-foreground">
                {progress.choicesMade} decisões · {progress.visitedChapters.length} capítulos
              </p>
              <button
                onClick={handleNewJourney}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Recomeçar do início
              </button>
            </>
          ) : (
            <button
              onClick={handleNewJourney}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity glow-gold"
            >
              <Sparkles className="w-5 h-5" />
              Iniciar Jornada
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
