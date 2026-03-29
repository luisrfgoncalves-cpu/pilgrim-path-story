import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { BookOpen, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';

const replayMessages = [
  "Escolhas diferentes levam a caminhos diferentes. Descubra o que mudaria.",
  "Você explorou apenas um lado da história. Há muito mais para descobrir.",
  "E se você tivesse escolhido diferente no vale? Na feira? No castelo?",
  "Cada jornada é única. Sua próxima pode ser completamente diferente.",
  "Novos caminhos, novas lições. A história muda com você.",
];

const Index = () => {
  const navigate = useNavigate();
  const { hasProgress, startJourney, resetProgress, progress, history, isReplay } = useStoryProgress();

  const handleContinue = () => {
    startJourney();
    navigate('/cena');
  };

  const handleNewJourney = () => {
    resetProgress();
    startJourney();
    navigate('/cena');
  };

  const lastResult = history.playthroughs.length > 0
    ? history.playthroughs[history.playthroughs.length - 1]
    : null;

  const replayMsg = replayMessages[history.totalPlaythroughs % replayMessages.length];

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

        {/* Previous result summary */}
        {lastResult && !hasProgress && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-3 slide-up">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Última Jornada</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-foreground">🔥 {lastResult.attributes.fe}</span>
              <span className="text-foreground">⛰️ {lastResult.attributes.perseveranca}</span>
              <span className="text-foreground">👁️ {lastResult.attributes.discernimento}</span>
              <span className="text-foreground">🛡️ {lastResult.attributes.coragem}</span>
            </div>
            <p className="text-xs text-primary italic">{replayMsg}</p>
            {history.totalPlaythroughs > 0 && (
              <p className="text-[10px] text-muted-foreground">
                {history.totalPlaythroughs} {history.totalPlaythroughs === 1 ? 'jornada completada' : 'jornadas completadas'}
              </p>
            )}
          </div>
        )}

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
                {isReplay && <span className="text-primary"> · Jogada {progress.playthrough}</span>}
              </p>
              <button
                onClick={handleNewJourney}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Recomeçar do início
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleNewJourney}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity glow-gold"
              >
                {history.totalPlaythroughs > 0 ? (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    Nova Jornada
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Iniciar Jornada
                  </>
                )}
              </button>
              {history.totalPlaythroughs > 0 && (
                <p className="text-xs text-muted-foreground italic">
                  Tente fazer escolhas diferentes desta vez
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
