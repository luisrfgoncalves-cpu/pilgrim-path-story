import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { getChapter, storyChapters } from '@/data/story';
import { MapPin, BookOpen, RotateCcw, Home, ScrollText } from 'lucide-react';

const ScenePage = () => {
  const navigate = useNavigate();
  const { progress, goToChapter } = useStoryProgress();
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  const chapter = getChapter(progress.currentChapterId);

  useEffect(() => {
    setNarrativeIndex(0);
    setShowChoices(false);
  }, [progress.currentChapterId]);

  useEffect(() => {
    if (!chapter) return;
    if (narrativeIndex < chapter.narrative.length - 1) {
      const timer = setTimeout(() => setNarrativeIndex(prev => prev + 1), 200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowChoices(true), 400);
      return () => clearTimeout(timer);
    }
  }, [narrativeIndex, chapter]);

  const handleChoice = (nextChapterId: string, consequence?: string) => {
    if (consequence) {
      navigate('/resultado', { state: { consequence, nextChapterId } });
    } else {
      goToChapter(nextChapterId);
    }
  };

  if (!chapter) {
    navigate('/');
    return null;
  }

  const totalChapters = Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            <span className="font-display text-sm text-gold">O Peregrino</span>
          </div>
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
          </button>
        </div>
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-0.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full">
        {/* Location */}
        <div className="flex items-center gap-2 mb-3 slide-up">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs uppercase tracking-widest text-primary font-medium">{chapter.location}</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-6 fade-in leading-tight">{chapter.title}</h1>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-primary/20" />
          <span className="text-primary text-xs">✦</span>
          <div className="h-px flex-1 bg-primary/20" />
        </div>

        {/* Narrative */}
        <div className="space-y-5 mb-8">
          {chapter.narrative.slice(0, narrativeIndex + 1).map((paragraph, i) => (
            <p key={i} className="narrative-text text-foreground/90 text-base fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Choices or Ending */}
        {showChoices && (
          <div className="space-y-3 slide-up pb-8">
            {chapter.isEnding ? (
              <div className="text-center space-y-6 py-8">
                <div className="flex items-center gap-3 justify-center">
                  <div className="h-px w-12 bg-primary/30" />
                  <span className="text-primary">✦ FIM ✦</span>
                  <div className="h-px w-12 bg-primary/30" />
                </div>
                <p className="narrative-text text-muted-foreground italic">A jornada de Cristão chegou ao fim. Mas a sua continua.</p>
                <p className="text-xs text-muted-foreground">Capítulos visitados: {progress.visitedChapters.length} · Decisões: {progress.choicesMade}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm">
                    <Home className="w-4 h-4" /> Voltar ao Início
                  </button>
                  <button onClick={() => navigate('/reflexoes')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-foreground font-display text-sm">
                    <ScrollText className="w-4 h-4" /> Ver Reflexões
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">O que Cristão deve fazer?</p>
                {chapter.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(choice.nextChapterId, choice.consequence)}
                    className="w-full text-left p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:glow-gold transition-all duration-300 group"
                  >
                    <p className="text-foreground font-body text-sm group-hover:text-gold transition-colors">{choice.text}</p>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ScenePage;
