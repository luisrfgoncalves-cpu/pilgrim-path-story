import { useState, useEffect } from 'react';
import { getChapter } from '@/data/story';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { BookOpen, RotateCcw, MapPin, ScrollText } from 'lucide-react';

const StoryReader = () => {
  const { progress, goToChapter, resetProgress } = useStoryProgress();
  const [showConsequence, setShowConsequence] = useState<string | null>(null);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const chapter = getChapter(progress.currentChapterId);

  useEffect(() => {
    setNarrativeIndex(0);
    setShowChoices(false);
    setShowConsequence(null);
    setIsTransitioning(false);
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
    setIsTransitioning(true);
    if (consequence) {
      setShowConsequence(consequence);
      setTimeout(() => {
        goToChapter(nextChapterId);
      }, 2000);
    } else {
      setTimeout(() => goToChapter(nextChapterId), 500);
    }
  };

  if (!chapter) return null;

  const totalChapters = Object.keys(require('@/data/story').storyChapters).length;
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{progressPercent}%</span>
            <button
              onClick={resetProgress}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Recomeçar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-0.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full">
        {/* Consequence overlay */}
        {showConsequence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-8">
            <div className="text-center fade-in">
              <ScrollText className="w-8 h-8 text-gold mx-auto mb-4" />
              <p className="narrative-text text-foreground italic text-lg">{showConsequence}</p>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 mb-3 slide-up">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs uppercase tracking-widest text-primary font-medium">
            {chapter.location}
          </span>
        </div>

        {/* Chapter Title */}
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-6 fade-in leading-tight">
          {chapter.title}
        </h1>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-primary/20" />
          <span className="text-primary text-xs">✦</span>
          <div className="h-px flex-1 bg-primary/20" />
        </div>

        {/* Narrative paragraphs */}
        <div className="space-y-5 mb-8">
          {chapter.narrative.slice(0, narrativeIndex + 1).map((paragraph, i) => (
            <p
              key={i}
              className="narrative-text text-foreground/90 text-base fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Choices or Ending */}
        {showChoices && !isTransitioning && (
          <div className="space-y-3 slide-up pb-8">
            {chapter.isEnding ? (
              <div className="text-center space-y-6 py-8">
                <div className="flex items-center gap-3 justify-center">
                  <div className="h-px w-12 bg-primary/30" />
                  <span className="text-primary">✦ FIM ✦</span>
                  <div className="h-px w-12 bg-primary/30" />
                </div>
                <p className="narrative-text text-muted-foreground italic">
                  A jornada de Cristão chegou ao fim. Mas a sua continua.
                </p>
                <p className="text-xs text-muted-foreground">
                  Capítulos visitados: {progress.visitedChapters.length} · Decisões: {progress.choicesMade}
                </p>
                <button
                  onClick={resetProgress}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" />
                  Recomeçar a Jornada
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                  O que Cristão deve fazer?
                </p>
                {chapter.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(choice.nextChapterId, choice.consequence)}
                    className="w-full text-left p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:glow-gold transition-all duration-300 group"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <p className="text-foreground font-body text-sm group-hover:text-gold transition-colors">
                      {choice.text}
                    </p>
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

export default StoryReader;
