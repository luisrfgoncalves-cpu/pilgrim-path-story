import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { useProgressSync } from '@/hooks/useProgressSync';
import { getChapter, storyChapters, ChoiceEffect, ConditionalEffect, ToneNarrative, StoryChoice } from '@/data/story';
import { getPart2Chapter } from '@/data/storyPart2';
import { sceneImages } from '@/data/sceneImages';
import { characterImages } from '@/data/characterImages';
import { characters } from '@/data/story';
import { part2Characters } from '@/data/storyPart2';
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
import { ParticleEffects, getParticleTypeForScene } from '@/components/ParticleEffects';
import Inventory from '@/components/Inventory';
import { TimedChoice, HoldButton, DragToChoose } from '@/components/InteractiveChallenges';
import { SinkingEvent, SuspenseDelay, TensionPulse } from '@/components/SceneEvents';
import { MiniGame, MiniGameResult } from '@/components/MiniGames';
import { FullscreenMiniGame, FULLSCREEN_GAMES } from '@/components/FullscreenMiniGame';
import { miniGameMappings } from '@/data/miniGameMappings';
import { playGameSfx } from '@/lib/gameSfx';
import GameNotification from '@/components/GameNotification';
import { MapPin, Home, ScrollText, Lock, Trophy, AlertTriangle, XCircle, Volume2, VolumeX, Compass, Heart, TrendingUp, TrendingDown, ArrowRight, ArrowLeft, Zap, Star, Shield, Flame } from 'lucide-react';
import { useSupportBonus } from '@/hooks/useSupportBonus';
import { useAuth } from '@/contexts/AuthContext';

const attrLabels: Record<string, { label: string; emoji: string; icon: typeof Flame }> = {
  fe: { label: 'Fé', emoji: '🔥', icon: Flame },
  perseveranca: { label: 'Perseverança', emoji: '⛰️', icon: Shield },
  discernimento: { label: 'Discernimento', emoji: '👁️', icon: Star },
  coragem: { label: 'Coragem', emoji: '🛡️', icon: Zap },
};

interface InlineConsequence {
  text: string;
  effects: ChoiceEffect;
  nextChapterId: string;
  choiceText: string;
  flag?: string;
  conditionalEffects?: ConditionalEffect[];
}

const ScenePage = () => {
  const navigate = useNavigate();
  const { progress, makeChoice, goToChapter, meetsRequirements, hasFlag, isReplay, completePlaythrough, hadFlagBefore, addItem, history } = useStoryProgress();
  const { profile } = useAuth();
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
  // Inline consequence overlay state
  const [inlineConsequence, setInlineConsequence] = useState<InlineConsequence | null>(null);
  const [consequencePhase, setConsequencePhase] = useState<'enter' | 'attrs' | 'ready'>('enter');
  // Streak/combo counter
  const [streak, setStreak] = useState(0);
  const [lastStreakEffect, setLastStreakEffect] = useState<'positive' | 'negative' | null>(null);
  const [showStreakBurst, setShowStreakBurst] = useState(false);
  // Mini-game state
  const [miniGameDone, setMiniGameDone] = useState(false);
  const [miniGameResult, setMiniGameResult] = useState<MiniGameResult | null>(null);
  const [showMiniGameResult, setShowMiniGameResult] = useState(false);
  const [miniGameReady, setMiniGameReady] = useState(false);
  // Character entrance reveal
  const [charReveal, setCharReveal] = useState<{ name: string; img: string; role?: string } | null>(null);
  const [charRevealDone, setCharRevealDone] = useState(false); // After reveal, show persistent portrait
  const [persistentChar, setPersistentChar] = useState<{ name: string; img: string; role?: string } | null>(null);
  const { triggerChoiceEffect, triggerSceneEntryVFX } = useVisualEffects();
  const { bonus: supportBonus, newSupportCount } = useSupportBonus();
  const [supportToastShown, setSupportToastShown] = useState(false);
  const { setAmbienceForScene, sfxForChoice, toggleAudio, stopAmbience } = useAudioEngine();
  // Recent decision effects for trend analysis
  const recentEffects = useMemo(() => {
    return (progress as any).decisions?.slice(-5)?.map((d: any) => d.effects || {}) || [];
  }, [progress]);

  const chapter = getChapter(progress.currentChapterId) || getPart2Chapter(progress.currentChapterId);

  // Build character portraits for mini-games
  const scenePortraits = useMemo(() => {
    if (!chapter) return [];
    const allChars = [...characters, ...part2Characters];
    const isPart2 = progress.campaign === 'part2';
    const protagonistId = isPart2 ? 'crista' : 'cristao';
    const sceneCharIds = chapter.characters || [];
    const charIds = sceneCharIds.includes(protagonistId) ? sceneCharIds : [protagonistId, ...sceneCharIds];
    return charIds
      .map(id => {
        const char = allChars.find(c => c.id === id);
        const img = characterImages[id];
        return img ? { id, name: char?.name || id, img } : null;
      })
      .filter(Boolean) as { id: string; name: string; img: string }[];
  }, [chapter, progress.campaign]);
  const bgImage = chapter ? sceneImages[chapter.id] : undefined;

  // Preload next scene images for instant loading
  useEffect(() => {
    if (!chapter?.choices) return;
    const nextImages = chapter.choices
      .map(c => sceneImages[c.nextChapterId])
      .filter((img): img is string => !!img);
    const uniqueImages = [...new Set(nextImages)];
    uniqueImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [chapter?.id]);

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
    setMiniGameDone(false);
    setMiniGameResult(null);
    setShowMiniGameResult(false);
    setCharReveal(null);
    setCharRevealDone(false);
    setPersistentChar(null);
    const t = setTimeout(() => {
      setTransitioning(false);
      triggerSceneEntryVFX(progress.currentChapterId);
    }, 100);
    return () => clearTimeout(t);
  }, [progress.currentChapterId]);

  // Dramatic character entrance — show big portrait for non-protagonist characters
  useEffect(() => {
    if (!chapter || transitioning) return;
    const allChars = [...characters, ...part2Characters];
    const isPart2 = progress.campaign === 'part2';
    const protagonistId = isPart2 ? 'crista' : 'cristao';
    const sceneCharIds = chapter.characters || [];
    // Find the most important non-protagonist character to reveal
    const revealChar = sceneCharIds
      .filter(id => id !== protagonistId)
      .map(id => {
        const char = allChars.find(c => c.id === id);
        const img = characterImages[id];
        if (!char || !img) return null;
        // Determine character type for sound
        const isVillain = ['apolion', 'gigante_desespero', 'juiz_odio_ao_bem', 'amor_dinheiro', 'hipocrisia', 'formalista', 'ateismo', 'lisonjeiro'].includes(id);
        return { name: char.name, img, role: char.role, isVillain };
      })
      .find(Boolean);
    
    if (revealChar) {
      const delay = setTimeout(() => {
        // Play entrance sound
        playGameSfx('suspense');
        setTimeout(() => {
          playGameSfx(revealChar.isVillain ? 'charRevealVillain' : 'charRevealAlly');
        }, 400);
        setCharReveal(revealChar);
        // After 8 seconds, dismiss reveal and set persistent portrait
        setTimeout(() => {
          setCharReveal(null);
          setCharRevealDone(true);
          setPersistentChar(revealChar);
        }, 8000);
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [chapter?.id, transitioning]);

  // Roll for surprise on scene entry
  useEffect(() => {
    if (!chapter) return;
    const s = rollForSurprise(progress.attributes, chapter.id, progress.choicesMade);
    if (s) {
      setSurprise(s);
      setSurpriseShown(true);
      // No auto-timeout — GameNotification handles it
      return;
    } else {
      setSurprise(null);
      setSurpriseShown(false);
    }
  }, [chapter?.id]);

  // Show support bonus toast
  useEffect(() => {
    if (newSupportCount > 0 && !supportToastShown) {
      setSupportToastShown(true);
      // GameNotification handles auto-dismiss
    }
  }, [newSupportCount, supportToastShown]);

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
    // Apply community support bonus to positive effects
    const withSupport: ChoiceEffect = { ...intensityAdjusted };
    if (supportBonus.fe > 0 && (withSupport.fe || 0) > 0) withSupport.fe = (withSupport.fe || 0) + 1;
    if (supportBonus.coragem > 0 && (withSupport.coragem || 0) > 0) withSupport.coragem = (withSupport.coragem || 0) + 1;
    if (supportBonus.perseveranca > 0 && (withSupport.perseveranca || 0) > 0) withSupport.perseveranca = (withSupport.perseveranca || 0) + 1;
    // Roll the invisible dice
    const diceOutcome = rollInvisibleDice(progress.attributes);
    const modifiedEffects = applyDiceToEffects(withSupport, diceOutcome);
    const diceHint = getDiceNarrativeHint(diceOutcome);

    triggerChoiceEffect(modifiedEffects as Record<string, number>);
    sfxForChoice(modifiedEffects as Record<string, number>);

    if (item) {
      addItem(item);
    }

    // Track streak
    const total = Object.values(modifiedEffects).reduce((a: number, b) => a + ((b as number) || 0), 0);
    if (total > 0) {
      const newStreak = lastStreakEffect === 'positive' ? streak + 1 : 1;
      setStreak(newStreak);
      setLastStreakEffect('positive');
      if (newStreak >= 3) {
        setShowStreakBurst(true);
        // GameNotification handles auto-dismiss
      }
    } else if (total < 0) {
      setStreak(lastStreakEffect === 'negative' ? streak + 1 : 1);
      setLastStreakEffect('negative');
    } else {
      setLastStreakEffect(null);
    }

    // Enrich consequence text with dice narrative hint
    const enrichedConsequence = consequence && diceHint
      ? `${consequence}\n\n${diceHint}`
      : consequence;

    if (enrichedConsequence) {
      // INLINE consequence — no navigation!
      setInlineConsequence({
        text: enrichedConsequence,
        effects: modifiedEffects,
        nextChapterId,
        choiceText,
        flag,
        conditionalEffects,
      });
      setConsequencePhase('enter');
      setTimeout(() => setConsequencePhase('attrs'), 600);
      setTimeout(() => setConsequencePhase('ready'), 1400);
    } else {
      makeChoice(chapter!.id, nextChapterId, choiceText, modifiedEffects, flag, conditionalEffects);
    }
  };

  const advanceFromConsequence = () => {
    if (!inlineConsequence) return;
    const { nextChapterId, choiceText, effects, flag, conditionalEffects } = inlineConsequence;
    setInlineConsequence(null);
    setConsequencePhase('enter');
    makeChoice(chapter!.id, nextChapterId, choiceText, effects, flag, conditionalEffects);
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
      <GameNotification visible={surpriseShown && !!surprise} onDismiss={() => setSurpriseShown(false)} duration={12000}>
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-primary/30 shadow-lg">
          <span className="text-xl">{surprise?.icon}</span>
          <div>
            <p className="text-xs font-display text-primary">{surprise?.title}</p>
            <p className="text-[10px] text-foreground/80">{surprise?.message}</p>
          </div>
        </div>
      </GameNotification>
      {/* Support bonus toast */}
      <GameNotification visible={supportToastShown && newSupportCount > 0} onDismiss={() => setSupportToastShown(false)} duration={12000} position="top-offset">
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-primary/30 shadow-lg">
          <Heart className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-display text-primary">Apoio recebido!</p>
            <p className="text-[10px] text-foreground/80">
              {newSupportCount} {newSupportCount === 1 ? 'peregrino orou' : 'peregrinos oraram'} por você.
            </p>
          </div>
        </div>
      </GameNotification>
      {/* Header with avatar */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => setShowStats(s => !s)} className="flex-shrink-0 p-1 rounded-lg active:scale-95 transition-transform">
            <PilgrimAvatar attributes={progress.attributes} tone={legacyTone} size="sm" storyFlag={emotional?.flagOverride} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0 font-display">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Back to previous scene */}
            {progress.visitedChapters.length > 1 && (
              <button
                onClick={() => {
                  const visited = progress.visitedChapters;
                  const currentIdx = visited.indexOf(progress.currentChapterId);
                  const prevId = currentIdx > 0 ? visited[currentIdx - 1] : visited[visited.length - 2];
                  if (prevId && prevId !== progress.currentChapterId) {
                    goToChapter(prevId);
                  }
                }}
                className="btn-medieval-icon !p-2.5 !rounded-lg flex items-center justify-center active:scale-95"
                aria-label="Cena anterior"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={() => { const next = !audioOn; setAudioOn(next); toggleAudio(next); }}
              className="btn-medieval-icon !p-2.5 !rounded-lg flex items-center justify-center active:scale-95"
              aria-label={audioOn ? 'Desativar som' : 'Ativar som'}
            >
              {audioOn ? <Volume2 className="w-5 h-5 text-muted-foreground" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
            </button>
            <button onClick={() => navigate('/')} className="btn-medieval-icon !p-2.5 !rounded-lg flex items-center justify-center active:scale-95">
              <Home className="w-5 h-5 text-muted-foreground" />
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
        {/* Scene image with preloading */}
        {bgImage && (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: '280px', minHeight: '180px', background: 'hsl(25 20% 12%)' }}>
            <img
              src={bgImage}
              alt={chapter.title}
              width={1024}
              height={576}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-auto object-cover transition-opacity duration-500 scene-image scene-image-alive ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={atmosphere.imageStyle}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-card flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
              </div>
            )}
            {/* Particle effects overlay */}
            {imageLoaded && (() => {
              const pType = getParticleTypeForScene(chapter.id, legacyTone);
              return pType ? <ParticleEffects type={pType} intensity={0.6} /> : null;
            })()}
            <div className="absolute inset-0 scene-overlay bg-gradient-to-t from-background via-background/10 to-transparent" />
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20">
              <MapPin className="w-3 h-3 text-primary/80" />
              <span className="text-[10px] uppercase tracking-widest text-primary/90 font-display font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{chapter.location}</span>
            </div>
          </div>
        )}
        {!bgImage && (
          <div className="w-full h-32 bg-card flex items-center justify-center">
            <MapPin className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* Character portraits — protagonist with user name + persistent NPC */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Protagonist — always visible */}
            {(() => {
              const isPart2 = progress.campaign === 'part2';
              const protagonistId = isPart2 ? 'crista' : 'cristao';
              const protImg = characterImages[protagonistId];
              const protChar = [...characters, ...part2Characters].find(c => c.id === protagonistId);
              const userName = profile?.display_name || protChar?.name || 'Peregrino';
              if (!protImg) return null;
              return (
                <button onClick={() => navigate('/personagens')} className="flex items-center gap-3 flex-shrink-0 active:scale-95 transition-transform">
                  <img
                    src={protImg}
                    alt={userName}
                    className="w-14 h-14 rounded-2xl object-cover"
                    style={{
                      border: '2px solid hsl(40 60% 50%)',
                      boxShadow: '0 4px 16px hsl(0 0% 0% / 0.4), 0 0 12px hsl(40 50% 45% / 0.3)',
                    }}
                  />
                  <div className="text-left">
                    <p className="font-display text-sm font-bold text-primary leading-tight">{userName}</p>
                    <p className="text-[10px] text-muted-foreground">Protagonista</p>
                  </div>
                </button>
              );
            })()}

            {/* Persistent NPC portrait — appears after reveal animation finishes */}
            {persistentChar && charRevealDone && (
              <div className="flex items-center gap-3 flex-shrink-0 animate-fade-in ml-auto">
                <div className="text-right">
                  <p className="font-display text-sm font-bold leading-tight" style={{ color: 'hsl(35 50% 65%)' }}>{persistentChar.name}</p>
                  <p className="text-[10px] text-muted-foreground">{persistentChar.role || 'Personagem'}</p>
                </div>
                <img
                  src={persistentChar.img}
                  alt={persistentChar.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                  style={{
                    border: '2px solid hsl(35 40% 40%)',
                    boxShadow: '0 4px 16px hsl(0 0% 0% / 0.4), 0 0 10px hsl(35 40% 40% / 0.25)',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-5">
          <h1 className="font-display text-2xl md:text-3xl text-foreground mb-4 fade-in leading-tight">{chapter.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-primary/20" />
            <span className="text-primary text-sm">✦</span>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="space-y-3 mb-6" style={atmosphere.textStyle}>
            {fullNarrative.slice(0, narrativeIndex + 1).map((paragraph, i) => (
              <p key={i} className="narrative-text text-foreground/90 fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
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

          {/* ═══ MINI-GAME TRIGGER BUTTON ═══ */}
          {showChoices && !miniGameDone && miniGameMappings[chapter.id] && !miniGameReady && (
            <div className="mb-5 animate-scale-in" id="minigame-trigger">
              <button
                onClick={() => {
                  setMiniGameReady(true);
                  // Scroll to the mini-game area, not top of page
                  setTimeout(() => {
                    const el = document.getElementById('minigame-area');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="btn-medieval w-full flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" />
                <span>
                  {FULLSCREEN_GAMES.has(miniGameMappings[chapter.id].type)
                    ? '⚔️ Iniciar Desafio'
                    : '🎮 Iniciar Mini-Game'}
                </span>
              </button>
            </div>
          )}

          {/* ═══ MINI-GAME (inline for minor games) ═══ */}
          {showChoices && !miniGameDone && miniGameReady && miniGameMappings[chapter.id] && !FULLSCREEN_GAMES.has(miniGameMappings[chapter.id].type) && (
            <div id="minigame-area" className="mb-5 animate-scale-in space-y-4">
              {scenePortraits.length > 0 && (
                <div className="flex items-center justify-center gap-3 overflow-x-auto pb-1">
                  {scenePortraits.slice(0, 3).map((p, idx) => (
                    <div key={p.id} className="text-center flex-shrink-0">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-16 h-16 rounded-full object-cover border-2"
                        style={{
                          borderColor: idx === 0 ? 'hsl(120 40% 45%)' : 'hsl(40 55% 45%)',
                          boxShadow: idx === 0
                            ? '0 0 16px hsl(120 50% 45% / 0.4)'
                            : '0 0 14px hsl(40 60% 50% / 0.35)',
                        }}
                      />
                      <p className="text-[10px] font-display font-bold mt-1 text-foreground/90">{p.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <MiniGame
                config={miniGameMappings[chapter.id]}
                characterPortraits={scenePortraits}
                onComplete={(result) => {
                  setMiniGameResult(result);
                  setMiniGameDone(true);
                  setShowMiniGameResult(true);
                  if (result.effects) {
                    triggerChoiceEffect(result.effects as Record<string, number>);
                    sfxForChoice(result.effects as Record<string, number>);
                  }
                  // GameNotification handles dismiss
                }}
              />
            </div>
          )}

          {/* ═══ FULLSCREEN MINI-GAME (major games) ═══ */}
          {showChoices && !miniGameDone && miniGameReady && miniGameMappings[chapter.id] && FULLSCREEN_GAMES.has(miniGameMappings[chapter.id].type) && (
            <>
              <div id="minigame-area" />
              <FullscreenMiniGame
                config={miniGameMappings[chapter.id]}
                chapterId={chapter.id}
                characterPortraits={scenePortraits}
                onComplete={(result) => {
                  setMiniGameResult(result);
                  setMiniGameDone(true);
                  setShowMiniGameResult(true);
                  if (result.effects) {
                    triggerChoiceEffect(result.effects as Record<string, number>);
                    sfxForChoice(result.effects as Record<string, number>);
                  }
                  // GameNotification handles dismiss
                }}
                onSkip={() => {
                  setMiniGameDone(true);
                }}
              />
            </>
          )}

          {/* Mini-game result toast */}
          {showMiniGameResult && miniGameResult && (
            <div className="mb-4 animate-fade-in">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${
                miniGameResult.success
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-destructive/10 border-destructive/30 text-destructive'
              }`}>
                <span className="text-xl">{miniGameResult.success ? '🏆' : '💔'}</span>
                <div className="flex-1">
                  <p className="text-sm font-display">
                    {miniGameResult.success ? 'Desafio superado!' : 'Desafio falhou...'}
                  </p>
                  <p className="text-xs opacity-80">
                    {Object.entries(miniGameResult.effects)
                      .filter(([, v]) => v !== 0)
                      .map(([k, v]) => {
                        const labels: Record<string, string> = { fe: 'Fé', perseveranca: 'Perseverança', discernimento: 'Discernimento', coragem: 'Coragem' };
                        return `${labels[k] || k} ${(v as number) > 0 ? '+' : ''}${v}`;
                      })
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
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
                        <button onClick={() => navigate('/progresso')} className="btn-medieval w-full flex items-center justify-center gap-2">
                          <ScrollText className="w-4 h-4" /> Ver Jornada Completa
                        </button>
                      )}
                      <button onClick={() => { localStorage.removeItem('peregrino-progress'); window.location.href = '/'; }} className="btn-medieval-secondary w-full flex items-center justify-center gap-2">
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
                  <button onClick={() => navigate('/')} className="btn-medieval flex items-center justify-center gap-2">
                    <Home className="w-4 h-4" /> Voltar ao Início
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-display">Escolha seu caminho</p>

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
                          className="choice-btn-medieval group"
                        >
                          <p className="text-foreground font-body text-base group-hover:text-primary transition-colors flex items-center gap-2">
                            <Compass className="w-5 h-5 text-primary" />
                            {dynamicEvents.alternateRoute.hint}
                          </p>
                          <p className="text-xs text-primary/60 mt-1.5 uppercase tracking-wider">✦ Caminho alternativo</p>
                        </button>
                      )}

                      {allChoices.map((choice, i) => (
                        <button
                          key={i}
                          onClick={() => handleChoice(choice.nextChapterId, choice.text, choice.effects, choice.consequence, choice.flag, choice.conditionalEffects, choice.item)}
                          className="choice-btn-medieval group"
                          style={{ animationDelay: `${i * 0.08}s` }}
                        >
                          <p className="text-foreground font-body text-base group-hover:text-primary transition-colors">{choice.text}</p>
                          {choice.requires && (
                            <p className="text-xs text-primary mt-2 uppercase tracking-wider">★ Desbloqueada por atributos</p>
                          )}
                          {choice.item && (
                            <p className="text-xs text-primary/70 mt-1.5">✦ Concede um item</p>
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

      {/* ═══ INLINE CONSEQUENCE OVERLAY ═══ */}
      {inlineConsequence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ animation: 'consequenceFadeIn 0.5s ease-out' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => {}} />
          
          <div className="relative z-10 max-w-sm mx-6 w-full">
            {/* Consequence text */}
            <div className={`text-center transition-all duration-700 ${consequencePhase !== 'enter' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ animationDelay: '0.2s' }}>
              
              <ScrollText className="w-8 h-8 text-primary mx-auto mb-4" />
              
              {inlineConsequence.text.split('\n\n').filter(Boolean).map((part, i) => (
                <p key={i} className={`narrative-text italic leading-relaxed mb-3 ${i === 0 ? 'text-lg text-foreground' : 'text-sm text-primary/70'}`}>
                  {part}
                </p>
              ))}
            </div>

            {/* Attribute changes — animated bars */}
            {(() => {
              const positiveChanges = Object.entries(inlineConsequence.effects).filter(([, v]) => v && (v as number) > 0);
              const negativeChanges = Object.entries(inlineConsequence.effects).filter(([, v]) => v && (v as number) < 0);
              const hasChanges = positiveChanges.length > 0 || negativeChanges.length > 0;

              if (!hasChanges) return null;

              return (
                <div className={`mt-5 space-y-3 transition-all duration-700 ${consequencePhase === 'enter' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  {positiveChanges.map(([key, val], i) => {
                    const info = attrLabels[key];
                    if (!info) return null;
                    return (
                      <div key={key} className="flex items-center gap-3 bg-card/60 border border-primary/20 rounded-xl px-4 py-3"
                        style={{ animation: `attrSlideIn 0.4s ease-out ${0.1 * i}s both` }}>
                        <span className="text-xl">{info.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-display text-foreground">{info.label}</span>
                            <span className="text-sm font-display text-primary">+{val as number}</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, ((progress.attributes[key as keyof typeof progress.attributes] || 0) + (val as number)) * 5)}%`, animation: 'barGrow 0.8s ease-out' }} />
                          </div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                    );
                  })}
                  {negativeChanges.map(([key, val], i) => {
                    const info = attrLabels[key];
                    if (!info) return null;
                    return (
                      <div key={key} className="flex items-center gap-3 bg-card/60 border border-destructive/20 rounded-xl px-4 py-3"
                        style={{ animation: `attrSlideIn 0.4s ease-out ${0.1 * (i + positiveChanges.length)}s both` }}>
                        <span className="text-xl">{info.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-display text-foreground">{info.label}</span>
                            <span className="text-sm font-display text-destructive">{val as number}</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-destructive/60 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, (progress.attributes[key as keyof typeof progress.attributes] || 0) + (val as number)) * 5)}%` }} />
                          </div>
                        </div>
                        <TrendingDown className="w-4 h-4 text-destructive/70" />
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Continue button */}
            <button
              onClick={advanceFromConsequence}
              className={`btn-medieval mt-6 w-full flex items-center justify-center gap-3 transition-all duration-500 ${
                consequencePhase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Continuar a Jornada <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══ STREAK BURST ═══ */}
      {showStreakBurst && streak >= 3 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          style={{ animation: 'streakBurst 2s ease-out forwards' }}>
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary/90 text-primary-foreground shadow-xl">
            <Zap className="w-5 h-5" />
            <span className="font-display text-lg">
              {streak}x Combo!
            </span>
            <span className="text-sm opacity-80">
              {lastStreakEffect === 'positive' ? '🔥 Em chamas!' : '💔 Sequência sombria'}
            </span>
          </div>
        </div>
      )}

      {/* ═══ CHARACTER ENTRANCE REVEAL — 3D style, no circle ═══ */}
      {charReveal && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-auto"
          onClick={() => {
            setCharReveal(null);
            setCharRevealDone(true);
            setPersistentChar(charReveal);
          }}
          style={{ animation: 'charRevealBg 8s ease-out forwards' }}
        >
          {/* Dark cinematic backdrop with radial light */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 60% 80% at 50% 60%, hsl(0 0% 0% / 0.5) 0%, hsl(0 0% 0% / 0.92) 100%)',
          }} />

          {/* Ambient floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {[...Array(18)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${1.5 + Math.random() * 3}px`,
                  height: `${1.5 + Math.random() * 3}px`,
                  left: `${5 + Math.random() * 90}%`,
                  top: `${10 + Math.random() * 80}%`,
                  background: i % 3 === 0 ? 'hsl(40 70% 60% / 0.7)' : 'hsl(0 0% 80% / 0.4)',
                  animation: `pilgrimDust ${2.5 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Character image — VERY BIG, no frame, floating 3D */}
          <div className="relative z-10 flex flex-col items-center" style={{ animation: 'charRevealIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <div className="relative">
              <img
                src={charReveal.img}
                alt={charReveal.name}
                className="w-72 h-[22rem] md:w-[22rem] md:h-[28rem] object-cover object-top mx-auto"
                style={{
                  borderRadius: '0',
                  border: 'none',
                  boxShadow: '0 0 80px hsl(40 50% 45% / 0.25), 0 30px 80px hsl(0 0% 0% / 0.8), -30px 0 60px hsl(0 0% 0% / 0.5), 30px 0 60px hsl(0 0% 0% / 0.5)',
                  filter: 'contrast(1.12) brightness(1.08) drop-shadow(0 0 30px hsl(40 50% 40% / 0.3))',
                  maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
                }}
              />
              {/* Glow behind character */}
              <div className="absolute inset-0 -z-10 blur-3xl scale-125" style={{
                background: 'radial-gradient(ellipse at center 40%, hsl(40 50% 50% / 0.2) 0%, transparent 70%)',
              }} />
            </div>

            {/* Name — below image, dramatic */}
            <div className="text-center mt-2" style={{ animation: 'charRevealName 0.8s ease-out 0.6s both' }}>
              <p className="font-display text-4xl md:text-5xl font-bold" style={{
                color: 'hsl(40 80% 75%)',
                textShadow: '0 4px 20px hsl(0 0% 0% / 0.9), 0 0 60px hsl(40 60% 50% / 0.4)',
                letterSpacing: '0.03em',
              }}>
                {charReveal.name}
              </p>
              {charReveal.role && (
                <p className="text-base md:text-lg mt-2 font-display uppercase tracking-[0.3em]" style={{
                  color: 'hsl(40 40% 55%)',
                  textShadow: '0 2px 12px hsl(0 0% 0% / 0.8)',
                  animation: 'charRevealName 0.6s ease-out 1s both',
                }}>
                  {charReveal.role}
                </p>
              )}
            </div>

            {/* Tap hint */}
            <p className="text-[10px] mt-6 font-display uppercase tracking-widest" style={{
              color: 'hsl(0 0% 45%)',
              animation: 'charRevealName 0.5s ease-out 2s both',
            }}>
              Toque para continuar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenePage;
