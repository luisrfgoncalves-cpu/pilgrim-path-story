import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { useProgressSync } from '@/hooks/useProgressSync';
import { getChapter, storyChapters, ChoiceEffect, ConditionalEffect, ToneNarrative, StoryChoice } from '@/data/story';
import { sceneImages } from '@/data/sceneImages';
import { sceneVariations, VariationContext } from '@/data/sceneVariations';
import { resolveEmotionalState, postureToLegacyTone } from '@/lib/emotionalState';
import { analyzePerformance } from '@/lib/performanceAnalysis';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useAtmosphere } from '@/hooks/useAtmosphere';
import { useDynamicEvents } from '@/hooks/useDynamicEvents';
import { rollInvisibleDice, applyDiceToEffects, getDiceNarrativeHint } from '@/lib/invisibleDice';
import { rollForSurprise, Surprise } from '@/lib/gameLoop';
import { applyIntensityToEffects } from '@/lib/replayEngine';
import PilgrimAvatar from '@/components/PilgrimAvatar';
import AttributeBars from '@/components/AttributeBars';
import Inventory from '@/components/Inventory';
import { TimedChoice, HoldButton, DragToChoose } from '@/components/InteractiveChallenges';
import { SinkingEvent, SuspenseDelay, TensionPulse } from '@/components/SceneEvents';
import { MapPin, Home, ScrollText, Lock, Trophy, AlertTriangle, XCircle, Volume2, VolumeX, Compass } from 'lucide-react';

const ScenePage = () => {
  const navigate = useNavigate();
  const { progress, makeChoice, meetsRequirements, hasFlag, isReplay, completePlaythrough, hadFlagBefore, addItem, history } = useStoryProgress();
  useProgressSync(progress);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [sceneEventDone, setSceneEventDone] = useState(false);
  const [suspenseActive, setSuspenseActive] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<(() => void) | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [surpriseShown, setSurpriseShown] = useState(false);
  const { triggerChoiceEffect } = useVisualEffects();
  const { setAmbienceForScene, sfxForChoice, toggleAudio, stopAmbience } = useAudioEngine();
  // Recent decision effects for trend analysis
  const recentEffects = useMemo(() => {
    return (progress as any).decisions?.slice(-5)?.map((d: any) => d.effects || {}) || [];
  }, [progress]);

  const chapter = getChapter(progress.currentChapterId);
  const bgImage = chapter ? sceneImages[chapter.id] : undefined;

  // Dynamic events system
  const dynamicEvents = useDynamicEvents(progress, progress.currentChapterId, history);

  // Emotional state system (9 postures)
  const emotional = useMemo(() => 
    chapter ? resolveEmotionalState(progress.attributes, chapter.id, Object.entries(progress.flags).filter(([, v]) => v).map(([k]) => k), recentEffects) : null
  , [progress.attributes, chapter?.id, progress.flags, recentEffects]);

  const emotionalClass = emotional?.sceneClass || '';
  const legacyTone = emotional ? postureToLegacyTone(emotional.posture) : 'neutral' as const;
  const atmosphere = useAtmosphere(progress.attributes, emotional?.posture);

  // Build variation context for history-aware scene text
  const variationCtx: VariationContext = useMemo(() => ({
    playthrough: progress.playthrough,
    history,
    flags: progress.flags,
    visitedChapters: progress.visitedChapters,
    attributes: progress.attributes,
  }), [progress, history]);

  // Build full narrative: base + variations + dynamic events + consequence hints
  const fullNarrative = chapter ? [
    ...chapter.narrative,
    ...(isReplay && chapter.replayNarrative ? chapter.replayNarrative : []),
    // History-aware scene variations
    ...(sceneVariations[chapter.id] || [])
      .filter(v => v.condition(variationCtx))
      .map(v => v.text),
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
    // Dynamic events narrative (randomly selected per playthrough)
    ...dynamicEvents.extraNarrative,
    // Consequence echoes from past dynamic choices
    ...dynamicEvents.consequenceHints.map(h => `_${h}_`),
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
    setTransitioning(true);
    setNarrativeIndex(0);
    setShowChoices(false);
    setImageLoaded(false);
    setPlaythroughRecorded(false);
    setSceneEventDone(false);
    setSuspenseActive(false);
    setPendingChoice(null);
    const t = setTimeout(() => setTransitioning(false), 100);
    return () => clearTimeout(t);
  }, [progress.currentChapterId]);

  // Roll for surprise on scene entry
  useEffect(() => {
    if (!chapter) return;
    const s = rollForSurprise(progress.attributes, chapter.id, progress.choicesMade);
    if (s) {
      setSurprise(s);
      setSurpriseShown(true);
      const t = setTimeout(() => setSurpriseShown(false), 4000);
      return () => clearTimeout(t);
    } else {
      setSurprise(null);
      setSurpriseShown(false);
    }
  }, [chapter?.id]);

  // Audio: set ambience when scene or emotional state changes
  useEffect(() => {
    if (chapter && emotional) {
      setAmbienceForScene(chapter.id, legacyTone);
    }
  }, [chapter?.id, legacyTone, setAmbienceForScene]);

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

  const executeChoice = (nextChapterId: string, choiceText: string, effects: ChoiceEffect, consequence?: string, flag?: string, conditionalEffects?: ConditionalEffect[], item?: string) => {
    // Apply adaptive intensity based on replay history
    const intensityAdjusted = applyIntensityToEffects(effects, dynamicEvents.intensity);
    // Roll the invisible dice — modifies effects based on attributes + luck
    const diceOutcome = rollInvisibleDice(progress.attributes);
    const modifiedEffects = applyDiceToEffects(intensityAdjusted, diceOutcome);
    const diceHint = getDiceNarrativeHint(diceOutcome);

    triggerChoiceEffect(modifiedEffects as Record<string, number>);
    sfxForChoice(modifiedEffects as Record<string, number>);

    if (item) {
      addItem(item);
    }

    // Enrich consequence text with dice narrative hint
    const enrichedConsequence = consequence && diceHint
      ? `${consequence}\n\n${diceHint}`
      : consequence;

    if (enrichedConsequence) {
      navigate('/resultado', {
        state: {
          consequence: enrichedConsequence,
          nextChapterId,
          choiceText,
          effects: modifiedEffects,
          currentChapterId: chapter?.id,
          attributeChanges: modifiedEffects,
          flag,
          conditionalEffects,
          item,
        }
      });
    } else {
      makeChoice(chapter!.id, nextChapterId, choiceText, modifiedEffects, flag, conditionalEffects);
    }
  };

  // Wrap choice execution with optional suspense delay
  const handleChoice = (nextChapterId: string, choiceText: string, effects: ChoiceEffect, consequence?: string, flag?: string, conditionalEffects?: ConditionalEffect[], item?: string) => {
    // Check if next chapter has a suspense event
    const nextChapter = getChapter(nextChapterId);
    if (nextChapter?.sceneEvent?.type === 'suspense' && !consequence) {
      setSuspenseActive(true);
      setPendingChoice(() => () => executeChoice(nextChapterId, choiceText, effects, consequence, flag, conditionalEffects, item));
      return;
    }
    executeChoice(nextChapterId, choiceText, effects, consequence, flag, conditionalEffects, item);
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

  // Dynamic choices from event pools (converted to StoryChoice format)
  const dynamicChoicesMapped: StoryChoice[] = dynamicEvents.extraChoices.map(dc => ({
    text: dc.text,
    nextChapterId: dc.nextChapterId || progress.currentChapterId,
    effects: {
      ...dc.effects,
      // Apply consequence bonuses from past dynamic decisions
      ...(dynamicEvents.consequenceBonus ? Object.fromEntries(
        Object.entries(dynamicEvents.consequenceBonus).map(([k, v]) => [k, (dc.effects[k as keyof ChoiceEffect] || 0) + (v || 0)])
      ) : {}),
    },
    consequence: dc.consequence,
    flag: dc.consequenceKey || dc.flag,
    requires: dc.requires,
    requiresFlag: dc.requiresFlag,
    excludesFlag: dc.excludesFlag,
  }));

  // Merge all choices: base + dynamic
  const allChoices = [...availableChoices, ...dynamicChoicesMapped];

  return (
    <div id="scene-container" className={`min-h-screen bg-background flex flex-col transition-all duration-[2000ms] ease-in-out ${emotionalClass} ${atmosphere.wobbleClass}`} style={atmosphere.containerStyle}>
      {/* Atmosphere overlays — gradual transitions */}
      <div className="atmo-vignette transition-opacity duration-[2000ms] ease-in-out" style={{ '--vignette-opacity': atmosphere.vignetteOpacity, opacity: atmosphere.vignetteOpacity > 0.02 ? 1 : 0 } as React.CSSProperties} />
      <div className="atmo-glow transition-opacity duration-[2000ms] ease-in-out" style={{ '--glow-opacity': atmosphere.glowOpacity, opacity: atmosphere.glowOpacity > 0.02 ? 1 : 0 } as React.CSSProperties} />
      {/* Emotional tint overlay — full screen color wash per state */}
      <div className="fixed inset-0 pointer-events-none z-[38] transition-all duration-[2000ms] ease-in-out" style={{ background: 'var(--bg-overlay, transparent)' }} />
      {/* Surprise micro-reward toast */}
      {surpriseShown && surprise && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-primary/30 shadow-lg max-w-xs">
            <span className="text-xl">{surprise.icon}</span>
            <div>
              <p className="text-xs font-display text-primary">{surprise.title}</p>
              <p className="text-[10px] text-foreground/80">{surprise.message}</p>
            </div>
          </div>
        </div>
      )}
      {/* Header with avatar */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => setShowStats(s => !s)} className="flex-shrink-0">
            <PilgrimAvatar attributes={progress.attributes} tone={legacyTone} size="sm" storyFlag={emotional?.flagOverride} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { const next = !audioOn; setAudioOn(next); toggleAudio(next); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={audioOn ? 'Desativar som' : 'Ativar som'}
            >
              {audioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors text-xs">
              ← Início
            </button>
          </div>
        </div>

        {/* Expandable attribute bars */}
        {showStats && (
          <div className="max-w-lg mx-auto pt-3 pb-1 animate-fade-in space-y-3">
            <AttributeBars attributes={progress.attributes} compact />
            {progress.items.length > 0 && <Inventory items={progress.items} compact />}
          </div>
        )}
      </header>

      <main className={`flex-1 max-w-lg mx-auto w-full ${transitioning ? 'opacity-0' : 'scene-transition-enter'}`}>
        {/* Scene image */}
        {bgImage && (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: '260px' }}>
            <img
              src={bgImage}
              alt={chapter.title}
              width={1024}
              height={576}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-auto object-cover transition-all duration-500 scene-image ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={atmosphere.imageStyle}
            />
            <div className="absolute inset-0 scene-overlay bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-[11px] uppercase tracking-widest text-primary font-medium drop-shadow-lg">{chapter.location}</span>
            </div>
          </div>
        )}

        <div className="px-5 py-5">
          <h1 className="font-display text-xl md:text-2xl text-foreground mb-4 fade-in leading-tight">{chapter.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-primary/20" />
            <span className="text-primary text-[10px]">✦</span>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="space-y-3 mb-6" style={atmosphere.textStyle}>
            {fullNarrative.slice(0, narrativeIndex + 1).map((paragraph, i) => (
              <p key={i} className="narrative-text text-foreground/90 text-[15px] fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Scene events */}
          {chapter.sceneEvent && !sceneEventDone && showChoices && (
            <>
              {chapter.sceneEvent.type === 'sinking' && (
                <div className="mb-5">
                  <SinkingEvent
                    duration={chapter.sceneEvent.duration}
                    message={chapter.sceneEvent.message}
                    onEscape={() => setSceneEventDone(true)}
                    onDrown={() => {
                      setSceneEventDone(true);
                      // Auto-pick worst choice on drown
                      const worst = availableChoices[chapter.timeoutChoiceIndex ?? availableChoices.length - 1];
                      if (worst) handleChoice(worst.nextChapterId, worst.text, worst.effects, worst.consequence, worst.flag, worst.conditionalEffects, worst.item);
                    }}
                  />
                </div>
              )}
              {chapter.sceneEvent.type === 'tension' && (
                <TensionPulse
                  intensity={chapter.sceneEvent.intensity || 2}
                  duration={chapter.sceneEvent.duration || 3000}
                  onComplete={() => setSceneEventDone(true)}
                />
              )}
            </>
          )}

          {/* Suspense overlay */}
          {suspenseActive && pendingChoice && (
            <SuspenseDelay
              duration={2500}
              message="O destino pondera sua escolha..."
              onComplete={() => {
                setSuspenseActive(false);
                pendingChoice();
              }}
            />
          )}

          {showChoices && !suspenseActive && (
            <div className="space-y-3 slide-up pb-6">
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
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Escolha seu caminho</p>

                  {chapter.interactionType === 'drag' && availableChoices.length >= 2 ? (
                    <DragToChoose
                      leftChoice={{ label: availableChoices[0].text, description: availableChoices[0].item ? '✦ Item' : undefined }}
                      rightChoice={{ label: availableChoices[1].text, description: availableChoices[1].item ? '✦ Item' : undefined }}
                      onChoose={(side) => {
                        const choice = side === 'left' ? availableChoices[0] : availableChoices[1];
                        handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence, choice.flag, choice.conditionalEffects, choice.item);
                      }}
                    />

                  ) : chapter.interactionType === 'timed' ? (
                    <TimedChoice
                      timeLimit={chapter.timeLimit || 15}
                      onTimeout={() => {
                        const idx = chapter.timeoutChoiceIndex ?? 0;
                        const fallback = availableChoices[idx] || availableChoices[0];
                        if (fallback) handleChoice(fallback.nextChapterId, fallback.text, fallback.effects, fallback.consequence, fallback.flag, fallback.conditionalEffects, fallback.item);
                      }}
                    >
                      {availableChoices.map((choice, i) => (
                        <HoldButton key={i} holdDuration={1.2} onConfirm={() => handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence, choice.flag, choice.conditionalEffects, choice.item)}>
                          <p className="text-foreground font-body text-sm">{choice.text}</p>
                          {choice.item && <p className="text-[10px] text-primary/70 mt-1">✦ Concede um item</p>}
                        </HoldButton>
                      ))}
                    </TimedChoice>

                  ) : chapter.interactionType === 'hold' ? (
                    <div className="space-y-3">
                      {availableChoices.map((choice, i) => (
                        <HoldButton key={i} holdDuration={2} onConfirm={() => handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence, choice.flag, choice.conditionalEffects, choice.item)}>
                          <p className="text-foreground font-body text-sm">{choice.text}</p>
                          {choice.requires && <p className="text-[10px] text-primary mt-1">★ Desbloqueada</p>}
                          {choice.item && <p className="text-[10px] text-primary/70 mt-1">✦ Concede um item</p>}
                        </HoldButton>
                      ))}
                    </div>

                  ) : (
                    <>
                      {/* Alternate route option */}
                      {dynamicEvents.alternateRoute && (
                        <button
                          onClick={() => handleChoice(dynamicEvents.alternateRoute!.nextChapterId, dynamicEvents.alternateRoute!.hint, {}, dynamicEvents.alternateRoute!.hint)}
                          className="choice-btn group border-primary/30 bg-card/80"
                        >
                          <p className="text-foreground font-body text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-primary" />
                            {dynamicEvents.alternateRoute.hint}
                          </p>
                          <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-wider">✦ Caminho alternativo</p>
                        </button>
                      )}

                      {allChoices.map((choice, i) => (
                        <button
                          key={i}
                          onClick={() => handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence, choice.flag, choice.conditionalEffects, choice.item)}
                          className="choice-btn group"
                          style={{ animationDelay: `${i * 0.08}s` }}
                        >
                          <p className="text-foreground font-body text-sm group-hover:text-primary transition-colors">{choice.text}</p>
                          {choice.requires && (
                            <p className="text-[10px] text-primary mt-1.5 uppercase tracking-wider">★ Desbloqueada por atributos</p>
                          )}
                          {choice.item && (
                            <p className="text-[10px] text-primary/70 mt-1">✦ Concede um item</p>
                          )}
                        </button>
                      ))}
                    </>
                  )}

                  {lockedChoices.map((choice, i) => (
                    <div key={`locked-${i}`} className="w-full text-left p-4 rounded-lg bg-muted/20 border border-border/50 opacity-50">
                      <p className="text-muted-foreground font-body text-sm flex items-center gap-2">
                        <Lock className="w-3 h-3 flex-shrink-0" />
                        {choice.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
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
