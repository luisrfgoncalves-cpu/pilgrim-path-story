import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { getChapter, storyChapters, ChoiceEffect } from '@/data/story';
import { sceneImages } from '@/data/sceneImages';
import { MapPin, BookOpen, Home, ScrollText, Lock } from 'lucide-react';

const ScenePage = () => {
  const navigate = useNavigate();
  const { progress, makeChoice, meetsRequirements } = useStoryProgress();
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const chapter = getChapter(progress.currentChapterId);
  const bgImage = chapter ? sceneImages[chapter.id] : undefined;

  // Build full narrative with adaptive segments
  const fullNarrative = chapter ? [
    ...chapter.narrative,
    ...(chapter.adaptiveNarrative || [])
      .filter(seg => progress.attributes[seg.minAttr as keyof typeof progress.attributes] >= seg.minValue)
      .map(seg => seg.text)
  ] : [];

  useEffect(() => {
    setNarrativeIndex(0);
    setShowChoices(false);
    setImageLoaded(false);
  }, [progress.currentChapterId]);

  useEffect(() => {
    if (!chapter) return;
    if (narrativeIndex < fullNarrative.length - 1) {
      const timer = setTimeout(() => setNarrativeIndex(prev => prev + 1), 200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowChoices(true), 400);
      return () => clearTimeout(timer);
    }
  }, [narrativeIndex, chapter, fullNarrative.length]);

  const handleChoice = (nextChapterId: string, choiceText: string, effects: ChoiceEffect, consequence?: string) => {
    if (consequence) {
      navigate('/resultado', {
        state: {
          consequence,
          nextChapterId,
          choiceText,
          effects,
          currentChapterId: chapter?.id,
          attributeChanges: effects,
        }
      });
    } else {
      makeChoice(chapter!.id, nextChapterId, choiceText, effects);
    }
  };

  if (!chapter) {
    navigate('/');
    return null;
  }

  const totalChapters = Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);

  const availableChoices = chapter.choices.filter(c => meetsRequirements(c.requires));
  const lockedChoices = chapter.choices.filter(c => !meetsRequirements(c.requires));

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

      <main className="flex-1 max-w-lg mx-auto w-full">
        {/* Scene image */}
        {bgImage && (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: '280px' }}>
            <img
              src={bgImage}
              alt={chapter.title}
              width={1024}
              height={576}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-auto object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            {/* Location badge on image */}
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-medium drop-shadow-lg">{chapter.location}</span>
            </div>
          </div>
        )}

        <div className="px-5 py-5">
          {/* Title */}
          <h1 className="font-display text-2xl md:text-3xl text-foreground mb-5 fade-in leading-tight">{chapter.title}</h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-primary/20" />
            <span className="text-primary text-xs">✦</span>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          {/* Narrative */}
          <div className="space-y-4 mb-7">
            {fullNarrative.slice(0, narrativeIndex + 1).map((paragraph, i) => (
              <p key={i} className="narrative-text text-foreground/90 text-base fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Choices or Ending */}
          {showChoices && (
            <div className="space-y-3 slide-up pb-8">
              {chapter.isEnding ? (
                <div className="text-center space-y-6 py-6">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-px w-12 bg-primary/30" />
                    <span className="text-primary font-display text-sm">
                      ✦ {chapter.endingType === 'glorioso' ? 'GLÓRIA ETERNA' : chapter.endingType === 'humilde' ? 'SABEDORIA ALCANÇADA' : chapter.endingType === 'sofrido' ? 'PERSEVERANÇA RECOMPENSADA' : 'FIM'} ✦
                    </span>
                    <div className="h-px w-12 bg-primary/30" />
                  </div>
                  {chapter.endingType && chapter.endingType !== 'default' && (
                    <p className="text-xs text-primary uppercase tracking-widest">
                      Final: {chapter.endingType === 'glorioso' ? 'O Triunfo do Fiel' : chapter.endingType === 'humilde' ? 'O Caminho da Sabedoria' : 'A Resistência do Peregrino'}
                    </p>
                  )}
                  <p className="narrative-text text-muted-foreground italic">A jornada de Cristão chegou ao fim. Mas a sua continua.</p>
                  <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Seus Atributos Finais</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-foreground">🔥 Fé: <strong className="text-gold">{progress.attributes.fe}</strong></span>
                      <span className="text-foreground">⛰️ Perseverança: <strong className="text-gold">{progress.attributes.perseveranca}</strong></span>
                      <span className="text-foreground">👁️ Discernimento: <strong className="text-gold">{progress.attributes.discernimento}</strong></span>
                      <span className="text-foreground">🛡️ Coragem: <strong className="text-gold">{progress.attributes.coragem}</strong></span>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">Decisões: {progress.choicesMade} · Capítulos: {progress.visitedChapters.length}</p>
                  </div>
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
                  {availableChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence)}
                      className="w-full text-left p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:glow-gold transition-all duration-300 group"
                    >
                      <p className="text-foreground font-body text-sm group-hover:text-gold transition-colors">{choice.text}</p>
                      {choice.requires && (
                        <p className="text-[10px] text-primary mt-1.5 uppercase tracking-wider">★ Escolha desbloqueada por seus atributos</p>
                      )}
                    </button>
                  ))}
                  {lockedChoices.map((choice, i) => (
                    <div
                      key={`locked-${i}`}
                      className="w-full text-left p-4 rounded-lg bg-muted/30 border border-border opacity-60"
                    >
                      <p className="text-muted-foreground font-body text-sm flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                        {choice.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        Requer: {Object.entries(choice.requires || {}).map(([k, v]) => {
                          const labels: Record<string, string> = { fe: 'Fé', perseveranca: 'Perseverança', discernimento: 'Discernimento', coragem: 'Coragem' };
                          return `${labels[k] || k} ${v}+`;
                        }).join(', ')}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScenePage;
