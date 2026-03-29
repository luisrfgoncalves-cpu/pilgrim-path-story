import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { getChapter, storyChapters, ChoiceEffect, ConditionalEffect, ToneNarrative } from '@/data/story';
import { sceneImages } from '@/data/sceneImages';
import { getEmotionalState, getEmotionalClasses } from '@/lib/emotionalIntensity';
import { analyzePerformance } from '@/lib/performanceAnalysis';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import PilgrimAvatar from '@/components/PilgrimAvatar';
import AttributeBars from '@/components/AttributeBars';
import Inventory from '@/components/Inventory';
import { MapPin, Home, ScrollText, Lock, Trophy, AlertTriangle, XCircle, Volume2, VolumeX } from 'lucide-react';

const ScenePage = () => {
  const navigate = useNavigate();
  const { progress, makeChoice, meetsRequirements, hasFlag, isReplay, completePlaythrough, hadFlagBefore, addItem } = useStoryProgress();
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const { triggerChoiceEffect } = useVisualEffects();
  const { setAmbienceForScene, sfxForChoice, toggleAudio, stopAmbience } = useAudioEngine();

  const chapter = getChapter(progress.currentChapterId);
  const bgImage = chapter ? sceneImages[chapter.id] : undefined;

  // Emotional intensity system
  const emotional = useMemo(() => 
    chapter ? getEmotionalState(progress.attributes, chapter.id) : null
  , [progress.attributes, chapter?.id]);

  const emotionalClass = emotional ? getEmotionalClasses(emotional.tone) : '';

  // Build full narrative with adaptive + flag-based + tone-based + emotional + replay segments
  const fullNarrative = chapter ? [
    ...chapter.narrative,
    ...(isReplay && chapter.replayNarrative ? chapter.replayNarrative : []),
    ...(chapter.adaptiveNarrative || [])
      .filter(seg => progress.attributes[seg.minAttr as keyof typeof progress.attributes] >= seg.minValue)
      .map(seg => seg.text),
    ...(chapter.flagNarrative || [])
      .filter(seg => hasFlag(seg.flag))
      .map(seg => seg.text),
    ...(chapter.noFlagNarrative || [])
      .filter(seg => !hasFlag(seg.flag))
      .map(seg => seg.text),
    ...(chapter.toneNarrative || []).map(tone => {
      const val = progress.attributes[tone.attr as keyof typeof progress.attributes] || 0;
      if (val >= tone.highThreshold) return tone.highText;
      if (val <= tone.lowThreshold) return tone.lowText;
      return null;
    }).filter((t): t is string => t !== null),
    ...(emotional?.atmosphereLine ? [emotional.atmosphereLine] : []),
  ] : [];

  // Record playthrough completion when reaching a final ending
  const [playthroughRecorded, setPlaythroughRecorded] = useState(false);
  useEffect(() => {
    if (chapter?.isEnding && (chapter.endingType === 'final_good' || chapter.endingType === 'final_bad') && !playthroughRecorded) {
      const analysis = analyzePerformance(progress.attributes, progress.choicesMade, progress.visitedChapters, progress.flags, chapter.endingType);
      completePlaythrough(analysis.result);
      setPlaythroughRecorded(true);
    }
  }, [chapter, playthroughRecorded]);

  useEffect(() => {
    setNarrativeIndex(0);
    setShowChoices(false);
    setImageLoaded(false);
    setPlaythroughRecorded(false);
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

  const handleChoice = (nextChapterId: string, choiceText: string, effects: ChoiceEffect, consequence?: string, flag?: string, conditionalEffects?: ConditionalEffect[], item?: string) => {
    triggerChoiceEffect(effects as Record<string, number>);

    if (item) {
      addItem(item);
    }

    if (consequence) {
      navigate('/resultado', {
        state: {
          consequence,
          nextChapterId,
          choiceText,
          effects,
          currentChapterId: chapter?.id,
          attributeChanges: effects,
          flag,
          conditionalEffects,
          item,
        }
      });
    } else {
      makeChoice(chapter!.id, nextChapterId, choiceText, effects, flag, conditionalEffects);
    }
  };

  if (!chapter) {
    navigate('/');
    return null;
  }

  const totalChapters = Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);

  const availableChoices = chapter.choices.filter(c => 
    meetsRequirements(c.requires) && 
    (!c.requiresFlag || hasFlag(c.requiresFlag)) &&
    (!c.excludesFlag || !hasFlag(c.excludesFlag))
  );
  const lockedChoices = chapter.choices.filter(c => !meetsRequirements(c.requires) && !c.requiresFlag && !c.excludesFlag);

  return (
    <div id="scene-container" className={`min-h-screen bg-background flex flex-col transition-all duration-1000 ${emotionalClass}`}>
      {/* Header with avatar */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => setShowStats(s => !s)} className="flex-shrink-0">
            <PilgrimAvatar attributes={progress.attributes} tone={emotional?.tone} size="sm" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">{progressPercent}%</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors text-xs flex-shrink-0">
            ← Início
          </button>
        </div>

        {/* Expandable attribute bars */}
        {showStats && (
          <div className="max-w-lg mx-auto pt-3 pb-1 animate-fade-in space-y-3">
            <AttributeBars attributes={progress.attributes} compact />
            {progress.items.length > 0 && <Inventory items={progress.items} compact />}
          </div>
        )}
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
              className={`w-full h-auto object-cover transition-all duration-700 scene-image ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 scene-overlay bg-gradient-to-t from-background via-background/40 to-transparent" />
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
              {chapter.isEnding && (chapter.endingType === 'final_good' || chapter.endingType === 'final_bad') ? (() => {
                const analysis = analyzePerformance(
                  progress.attributes,
                  progress.choicesMade,
                  progress.visitedChapters,
                  progress.flags,
                  chapter.endingType
                );
                const isComplete = analysis.result === 'complete';
                const isDifficult = analysis.result === 'difficult';
                const isIncomplete = analysis.result === 'incomplete';
                const ResultIcon = isComplete ? Trophy : isDifficult ? AlertTriangle : XCircle;
                const accentColor = isComplete ? 'text-primary' : isDifficult ? 'text-yellow-500' : 'text-destructive';
                const borderColor = isComplete ? 'border-primary/30' : isDifficult ? 'border-yellow-500/30' : 'border-destructive/30';
                const bgAccent = isComplete ? 'bg-primary/10' : isDifficult ? 'bg-yellow-500/10' : 'bg-destructive/10';

                return (
                  <div className="text-center space-y-5 py-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${bgAccent} mx-auto`}>
                      <ResultIcon className={`w-7 h-7 ${accentColor}`} />
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className={`h-px w-12 ${borderColor.replace('border', 'bg')}`} />
                      <span className={`${accentColor} font-display text-sm`}>✦ {analysis.title.toUpperCase()} ✦</span>
                      <div className={`h-px w-12 ${borderColor.replace('border', 'bg')}`} />
                    </div>
                    <p className="narrative-text text-foreground/90 italic text-sm">{analysis.message}</p>

                    {/* Performance details */}
                    <div className={`bg-card border ${borderColor} rounded-lg p-4 text-left space-y-3`}>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Análise da Jornada</p>
                      <ul className="space-y-1.5">
                        {analysis.details.map((detail, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                            <span className={`mt-0.5 ${accentColor}`}>•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Attributes */}
                    <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Atributos Finais</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-foreground">🔥 Fé: <strong className="text-gold">{progress.attributes.fe}</strong></span>
                        <span className="text-foreground">⛰️ Perseverança: <strong className="text-gold">{progress.attributes.perseveranca}</strong></span>
                        <span className="text-foreground">👁️ Discernimento: <strong className="text-gold">{progress.attributes.discernimento}</strong></span>
                        <span className="text-foreground">🛡️ Coragem: <strong className="text-gold">{progress.attributes.coragem}</strong></span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">Decisões: {progress.choicesMade} · Capítulos: {progress.visitedChapters.length}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      {!isIncomplete && (
                        <button onClick={() => navigate('/progresso')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm w-full">
                          <ScrollText className="w-4 h-4" /> Ver Jornada Completa
                        </button>
                      )}
                      <button onClick={() => { localStorage.removeItem('peregrino-progress'); window.location.href = '/'; }} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-display text-sm w-full">
                        <Home className="w-4 h-4" /> Recomeçar Jornada
                      </button>
                    </div>
                  </div>
                );
              })() : chapter.isEnding ? (
                <div className="text-center space-y-6 py-6">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-px w-12 bg-primary/30" />
                    <span className="text-primary font-display text-sm">✦ FIM DA FASE ✦</span>
                    <div className="h-px w-12 bg-primary/30" />
                  </div>
                  <p className="narrative-text text-muted-foreground italic">Esta parte da jornada chegou ao fim. Mas há muito mais pela frente.</p>
                  <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Seus Atributos</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-foreground">🔥 Fé: <strong className="text-gold">{progress.attributes.fe}</strong></span>
                      <span className="text-foreground">⛰️ Perseverança: <strong className="text-gold">{progress.attributes.perseveranca}</strong></span>
                      <span className="text-foreground">👁️ Discernimento: <strong className="text-gold">{progress.attributes.discernimento}</strong></span>
                      <span className="text-foreground">🛡️ Coragem: <strong className="text-gold">{progress.attributes.coragem}</strong></span>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">Decisões: {progress.choicesMade} · Capítulos: {progress.visitedChapters.length}</p>
                  </div>
                  <button onClick={() => navigate('/')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm">
                    <Home className="w-4 h-4" /> Voltar ao Início
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">O que Cristão deve fazer?</p>
                  {availableChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence, choice.flag, choice.conditionalEffects, choice.item)}
                      className="w-full text-left p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:glow-gold transition-all duration-300 group"
                    >
                      <p className="text-foreground font-body text-sm group-hover:text-gold transition-colors">{choice.text}</p>
                      {choice.requires && (
                        <p className="text-[10px] text-primary mt-1.5 uppercase tracking-wider">★ Escolha desbloqueada por seus atributos</p>
                      )}
                      {choice.item && (
                        <p className="text-[10px] text-amber-400 mt-1 uppercase tracking-wider">✦ Concede um item</p>
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
