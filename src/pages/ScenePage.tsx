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
import { postureLabels, postureLabelsFemale } from '@/components/PilgrimAvatar';
import AttributeBars from '@/components/AttributeBars';
import { ParticleEffects, getParticleTypeForScene } from '@/components/ParticleEffects';
import Inventory from '@/components/Inventory';
import { TimedChoice, HoldButton, DragToChoose } from '@/components/InteractiveChallenges';
import { SinkingEvent, SuspenseDelay, TensionPulse } from '@/components/SceneEvents';
import { MiniGame, MiniGameResult } from '@/components/MiniGames';
import { FullscreenMiniGame, FULLSCREEN_GAMES } from '@/components/FullscreenMiniGame';
import { miniGameMappings } from '@/data/miniGameMappings';
import { playGameSfx } from '@/lib/gameSfx';
import { playRealSfx } from '@/lib/realSfx';
import GameNotification from '@/components/GameNotification';
import { MapPin, Home, ScrollText, Lock, Trophy, AlertTriangle, XCircle, Volume2, VolumeX, Compass, Heart, TrendingUp, TrendingDown, ArrowRight, ArrowLeft, Zap, Star, Shield, Flame, Share2 } from 'lucide-react';
import { useSupportBonus } from '@/hooks/useSupportBonus';
import { useAuth } from '@/contexts/AuthContext';
import { trackPageView, trackSceneComplete } from '@/lib/analytics';
import { shareResult } from '@/lib/socialShare';
import { toast } from 'sonner';
import { renderNarrative, getSceneAtmosphere } from '@/lib/narrativeRenderer';
import { getSceneImageVariation } from '@/lib/sceneImageVariation';
import { AllegoryCard, allegoryMeanings } from '@/components/AllegoryCard';
import { groupIntoBeats, NarrativeBeat } from '@/hooks/useNarrativeBeats';
import EpicMoment, { epicMoments } from '@/components/EpicMoment';
import EpicDefeatScreen from '@/components/EpicDefeatScreen';
import { useTTS } from '@/hooks/useTTS';

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
  const [beatIndex, setBeatIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  // Epic moment state
  const [epicMomentActive, setEpicMomentActive] = useState(false);
  const [epicMomentDone, setEpicMomentDone] = useState(false);
  // Epic defeat screen state
  const [showDefeatScreen, setShowDefeatScreen] = useState(false);
  const [defeatMessage, setDefeatMessage] = useState('');
  const [defeatVillain, setDefeatVillain] = useState<string | undefined>();
  // TTS
  const { speak, stop: stopTTS, isPlaying: ttsPlaying } = useTTS();
  const [sceneEventDone, setSceneEventDone] = useState(false);
  const [suspenseActive, setSuspenseActive] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<(() => void) | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [surpriseShown, setSurpriseShown] = useState(false);
  // Inline consequence overlay state
  const [inlineConsequence, setInlineConsequence] = useState<InlineConsequence | null>(null);
  const [consequencePhase, setConsequencePhase] = useState<'enter' | 'attrs' | 'ready'>('enter');
  // Streak counter (internal only — no popup)
  const [streak, setStreak] = useState(0);
  const [lastStreakEffect, setLastStreakEffect] = useState<'positive' | 'negative' | null>(null);
  // Mini-game state
  const [miniGameDone, setMiniGameDone] = useState(false);
  const [miniGameResult, setMiniGameResult] = useState<MiniGameResult | null>(null);
  const [showMiniGameResult, setShowMiniGameResult] = useState(false);
  const [miniGameReady, setMiniGameReady] = useState(false);
  const [miniGameButtonVisible, setMiniGameButtonVisible] = useState(false);
  const [miniGameAutoPopup, setMiniGameAutoPopup] = useState(false);
  const [timedRetryCount, setTimedRetryCount] = useState(0);
  // Character entrance reveal
  const [charReveal, setCharReveal] = useState<{ name: string; img: string; role?: string } | null>(null);
  const [charRevealDone, setCharRevealDone] = useState(false);
  const [persistentChar, setPersistentChar] = useState<{ name: string; img: string; role?: string } | null>(null);
  // Allegory card state — shown once per character per session
  const [allegoryCardChar, setAllegoryCardChar] = useState<string | null>(null);
  const [seenAllegoryCards] = useState<Set<string>>(() => {
    try {
      const saved = sessionStorage.getItem('seen-allegory-cards');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const { triggerChoiceEffect, triggerSceneEntryVFX } = useVisualEffects();
  const { bonus: supportBonus, newSupportCount } = useSupportBonus();
  const [supportToastShown, setSupportToastShown] = useState(false);
  const { setAmbienceForScene, sfxForChoice, playSfx, toggleAudio, stopAmbience } = useAudioEngine();
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
    const portraits = charIds
      .map(id => {
        const char = allChars.find(c => c.id === id);
        const img = characterImages[id];
        return img ? { id, name: char?.name || id, img } : null;
      })
      .filter(Boolean) as { id: string; name: string; img: string }[];

    // For dice duels: ensure enemy portrait exists by matching duelEnemy name to characters
    const mapping = miniGameMappings[chapter.id];
    if (mapping?.duelEnemy && portraits.length <= 1) {
      const enemyName = mapping.duelEnemy.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // Try to find matching character by name
      const matchedChar = allChars.find(c => {
        const cName = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return cName.includes(enemyName) || enemyName.includes(cName);
      });
      if (matchedChar) {
        const img = characterImages[matchedChar.id];
        if (img && !portraits.find(p => p.id === matchedChar.id)) {
          portraits.push({ id: matchedChar.id, name: matchedChar.name, img });
        }
      }
      // Fallback mapping for enemies without character matches
      if (portraits.length <= 1) {
        const fallbackMap: Record<string, string> = {
          'instrutor': 'discricao', // Discrição trains at the Palace
          'acusador': 'juiz_odio_ao_bem', // Judge Hatred-of-Good
        };
        const fallbackId = fallbackMap[enemyName];
        if (fallbackId && characterImages[fallbackId] && !portraits.find(p => p.id === fallbackId)) {
          const fChar = allChars.find(c => c.id === fallbackId);
          portraits.push({ id: fallbackId, name: mapping.duelEnemy.name, img: characterImages[fallbackId] });
        }
      }
    }

    return portraits;
  }, [chapter, progress.campaign]);
  const bgImage = chapter ? sceneImages[chapter.id] : undefined;

  // Preload next scene images + character images for instant loading
  useEffect(() => {
    if (!chapter) return;
    const toPreload: string[] = [];
    // Next scene images
    if (chapter.choices) {
      chapter.choices.forEach(c => {
        const img = sceneImages[c.nextChapterId];
        if (img) toPreload.push(img);
      });
    }
    // Character images for this scene
    (chapter.characters || []).forEach(id => {
      const img = characterImages[id];
      if (img) toPreload.push(img);
    });
    [...new Set(toPreload)].forEach(src => {
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
    // SCROLL TO TOP on every scene change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Track analytics
    trackPageView(`scene:${progress.currentChapterId}`);
    trackSceneComplete(progress.currentChapterId);

    setTransitioning(true);
    setNarrativeIndex(0);
    setShowChoices(false);
    setImageLoaded(true); // keep true — show image area immediately, avoid brown flash
    setPlaythroughRecorded(false);
    setSceneEventDone(false);
    setSuspenseActive(false);
    setPendingChoice(null);
    setBeatIndex(0);
    setEpicMomentActive(false);
    setEpicMomentDone(false);
    setShowDefeatScreen(false);
    stopTTS();
    setMiniGameDone(false);
    setMiniGameResult(null);
    setShowMiniGameResult(false);
    setMiniGameButtonVisible(false);
    setMiniGameAutoPopup(false);
    setCharReveal(null);
    setCharRevealDone(false);
    setPersistentChar(null);
    setAllPersistentChars([]);
    const t = setTimeout(() => {
      setTransitioning(false);
      triggerSceneEntryVFX(progress.currentChapterId);
      // Start ambient audio for this scene
      if (audioOn) {
        setAmbienceForScene(progress.currentChapterId, legacyTone);
        // Scene-specific entry SFX — comprehensive immersive audio
        const id = progress.currentChapterId;

        // ═══ REAL SFX — contextual OGG sounds per scene ═══
        const realSfxMap: Record<string, Array<[string, number, number?]>> = {
          // [sfxName, delayMs, volume?]
          // FASE 1
          'cena1':  [['bell', 1200, 0.25]],                  // sino solene — despertar
          'cena3':  [['hit', 800, 0.3]],                     // portão batendo — fuga
          'cena7':  [['bell', 600, 0.35], ['blessing', 1800, 0.3]], // Porta Estreita — sino + bênção
          'cena7b': [['sword', 300, 0.3], ['shield', 1000, 0.3]], // flechas + proteção
          'cena10': [['hit', 500, 0.4], ['hit', 1200, 0.3]], // Sinai — trovão
          'cena11': [['splash', 500, 0.4]],                   // Pântano — água
          'cena11b': [['splash', 400, 0.35], ['water', 1000, 0.3]], // afundando
          'cena12': [['water', 300, 0.4], ['splash', 900, 0.3]], // mais fundo
          'cena13': [['water', 400, 0.35], ['splash', 1000, 0.35]], // quase morrendo
          'cena14': [['chime', 800, 0.35]],                   // Auxílio — som esperançoso
          'cena15': [['blessing', 1000, 0.4], ['crowd_cheer', 2500, 0.3]], // Cruz! Fardo cai!
          'cena15b': [['blessing', 500, 0.35], ['chime', 1200, 0.3]], // Três Resplandecentes
          // FASE 2
          'fase2-cena1': [['bell', 600, 0.25], ['chime', 1500, 0.3]], // Casa do Intérprete
          'fase2-cena7': [['chime', 500, 0.3]],              // Palácio Belo
          'fase2-cena8': [['trap', 600, 0.3]],                // Homem Gaiola — som sinistro
          'fase2-cena9': [['shield', 600, 0.35], ['sword', 1200, 0.3]], // Armadura!
          'fase2-cena11': [['hit', 500, 0.3]],                // Colina
          'fase2-cena14': [['hit', 400, 0.3], ['shield', 1500, 0.3]], // Leões
          // FASE 3
          'fase3-cena3': [['sword', 500, 0.4], ['hit', 1200, 0.35]], // Apolião — espada!
          'fase3-cena4': [['sword', 400, 0.35], ['hit', 1000, 0.3]], // batalha
          'fase3-cena5': [['sword', 300, 0.4], ['hit', 800, 0.3], ['shield', 1500, 0.35]], // clímax
          'fase3-cena6': [['blessing', 600, 0.3]],            // após batalha — cura
          'fase3-cena8': [['chime', 500, 0.3]],               // encontro com Fiel
          // FASE 4
          'fase4-cena1': [['crowd_cheer', 800, 0.2]],         // Feira — multidão
          'fase4-cena4': [['trap', 500, 0.3]],                // prisão — armadilha
          'fase4-cena6': [['hit', 400, 0.35], ['wrong', 1000, 0.3]], // julgamento — golpe
          'fase4-cena8': [['chime', 500, 0.3]],               // Esperança aparece
          'fase4-cena10': [['coins', 500, 0.3]],              // Demas — moedas tentação
          'fase4-cena11': [['coins', 400, 0.25], ['trap', 1000, 0.3]], // mina perigosa
          // FASE 5
          'fase5-cena3': [['hit', 500, 0.4], ['trap', 1200, 0.3]], // Gigante Desespero
          'fase5-cena4': [['trap', 400, 0.35], ['hit', 1000, 0.3]], // calabouço
          'fase5-cena6': [['chime', 800, 0.35], ['bell', 1500, 0.3]], // Chave da Promessa!
          'fase5-cena7': [['complete', 600, 0.4]],            // fuga!
          'fase5-cena9': [['blessing', 600, 0.3], ['chime', 1200, 0.25]], // Montanhas Deleitosas
          'fase5-cena11': [['trap', 500, 0.3]],               // Lisonjeiro armadilha
          'fase5-cena14': [['blessing', 600, 0.35]],          // País de Beulá
          // FASE 6
          'fase6-cena1': [['water', 500, 0.4]],               // Rio da Morte
          'fase6-cena2': [['water', 400, 0.35], ['splash', 1000, 0.3]], // águas profundas
          'fase6-cena3': [['water', 500, 0.3]],               // esperança no rio
          'fase6-cena4': [['splash', 500, 0.3]],              // atravessando
          'fase6-cena5': [['blessing', 500, 0.35]],           // outra margem
          'fase6-cena7': [['bell', 500, 0.35], ['crowd_cheer', 1500, 0.3]], // portões à vista
          'fase6-cena8': [['crowd_cheer', 500, 0.35], ['fireworks', 1500, 0.4], ['victory', 2500, 0.35]], // Cidade Celestial!
          'fase6-cena9': [['fireworks', 300, 0.4], ['crowd_cheer', 1000, 0.35], ['victory', 2000, 0.4]], // Glória final!
          // PARTE II
          'p2-cena1': [['bell', 600, 0.25]],
          'p2-cena3': [['splash', 500, 0.35], ['water', 1200, 0.3]], // pântano
          'p2-cena4': [['hit', 400, 0.3]],                    // confronto no portão
          'p2-cena5': [['sword', 500, 0.3], ['shield', 1200, 0.3]], // luta
          'p2-cena6': [['chime', 500, 0.3], ['blessing', 1200, 0.3]], // Casa do Intérprete
          'p2-fase2-cena2': [['blessing', 600, 0.35]],        // Cruz
          'p2-fase2-cena4': [['hit', 400, 0.3], ['shield', 1000, 0.3]], // leões
          'p2-fase3-cena1': [['sword', 500, 0.3]],            // Vale
          'p2-fase3-cena2': [['trap', 500, 0.3]],             // sombras
          'p2-fase3-cena3': [['sword', 500, 0.4], ['hit', 1200, 0.35]], // Gigante Maul
          'p2-fase3-cena4': [['chime', 500, 0.3]],            // Hospedaria Gaio
          'p2-fase3-cena5': [['sword', 400, 0.4], ['hit', 1000, 0.35], ['victory', 2000, 0.3]], // Gigante Mata-Bons
          'p2-fase4-cena2': [['coins', 500, 0.3]],            // Demas
          'p2-fase4-cena3': [['sword', 400, 0.35], ['shield', 1000, 0.3]], // Valente
          'p2-fase5-cena1': [['trap', 500, 0.3]],             // Castelo Dúvida
          'p2-fase5-cena2': [['sword', 400, 0.4], ['hit', 1000, 0.35], ['victory', 2000, 0.3]], // destruição castelo
          'p2-fase5-cena4': [['complete', 600, 0.35], ['crowd_cheer', 1200, 0.3]], // libertação prisioneiros
          'p2-fase5-cena5': [['blessing', 500, 0.3], ['chime', 1200, 0.25]], // Montanhas
          'p2-fase6-cena3': [['water', 500, 0.35]],           // Rio
          'p2-fase6-cena5': [['water', 400, 0.3], ['splash', 1000, 0.3]], // atravessando
          'p2-fase6-cena6': [['fireworks', 300, 0.4], ['crowd_cheer', 1000, 0.35], ['victory', 2000, 0.4]], // Celestial!
        };

        // ═══ SYNTH SFX — emotional synthesized sounds per scene ═══
        const synthSfxMap: Record<string, Array<[string, number]>> = {
          'cena1':  [['defeat', 800]],
          'cena2':  [['negative', 500]],
          'cena3':  [['gameStart', 500]],
          'cena4':  [['defeat', 400], ['defeat', 1200]],
          'cena5':  [['pray', 800]],
          'cena5b': [['pray', 600], ['positive', 1200]],
          'cena6':  [['defeat', 500]],
          'cena8':  [['negative', 600]],
          'cena9':  [['negative', 400], ['defeat', 1000]],
          'cena14': [['heal', 800]],
          'cena14b': [['positive', 600]],
          'cena15': [['victory', 1000], ['pray', 2500]],
          'fase2-cena2': [['positive', 500], ['pray', 1200]],
          'fase2-cena3': [['pray', 600]],
          'fase2-cena4': [['negative', 600]],
          'fase2-cena5': [['positive', 700]],
          'fase2-cena6': [['positive', 500], ['pray', 1200]],
          'fase2-cena10': [['defend', 500], ['critical', 1200]],
          'fase2-cena12': [['defeat', 400]],
          'fase2-cena13': [['defeat', 500], ['negative', 1200]],
          'fase3-cena1': [['defeat', 500]],
          'fase3-cena2': [['attack', 600]],
          'fase3-cena7': [['defeat', 500], ['defeat', 1200]],
          'fase3-cena9': [['negative', 500]],
          'fase3-cena10': [['negative', 500], ['negative', 1200]],
          'fase4-cena2': [['negative', 500]],
          'fase4-cena3': [['negative', 400]],
          'fase4-cena5': [['defeat', 500]],
          'fase4-cena7': [['defeat', 400], ['defeat', 1000]],
          'fase4-cena9': [['positive', 500]],
          'fase4-cena12': [['positive', 500], ['pray', 1200]],
          'fase5-cena1': [['negative', 500]],
          'fase5-cena2': [['defeat', 400]],
          'fase5-cena5': [['defeat', 500]],
          'fase5-cena8': [['positive', 500]],
          'fase5-cena10': [['positive', 500]],
          'fase5-cena12': [['attack', 400]],
          'fase5-cena13': [['defeat', 500]],
          'fase6-cena3': [['positive', 600]],
          'fase6-cena4': [['heal', 500]],
          'fase6-cena5': [['positive', 500], ['pray', 1200]],
          'fase6-cena6': [['victory', 500]],
          'fase6-cena8': [['victory', 500], ['critical', 1200], ['pray', 2000]],
          'p2-cena1': [['positive', 600], ['pray', 1200]],
          'p2-cena2': [['positive', 500]],
          'p2-cena4': [['attack', 400], ['negative', 1000]],
          'p2-fase2-cena1': [['positive', 500], ['pray', 1200]],
          'p2-fase2-cena3': [['negative', 500]],
          'p2-fase2-cena5': [['positive', 500], ['pray', 1200]],
          'p2-fase3-cena1': [['positive', 600]],
          'p2-fase3-cena6': [['negative', 500]],
          'p2-fase4-cena1': [['positive', 600]],
          'p2-fase4-cena4': [['negative', 500], ['pray', 1200]],
          'p2-fase5-cena3': [['defeat', 500], ['pray', 1200]],
          'p2-fase6-cena1': [['defeat', 500], ['pray', 1200]],
          'p2-fase6-cena2': [['positive', 500], ['pray', 1200]],
          'p2-fase6-cena4': [['positive', 500], ['pray', 1200]],
        };

        // Play REAL SFX (OGG files) — contextual
        const realList = realSfxMap[id];
        if (realList) {
          realList.forEach(([sfx, delay, vol]) => {
            setTimeout(() => playRealSfx(sfx as any, vol ?? 0.35), delay);
          });
        }

        // Play SYNTH SFX — emotional layer
        const synthList = synthSfxMap[id];
        if (synthList) {
          synthList.forEach(([sfx, delay]) => {
            setTimeout(() => playSfx(sfx as any), delay);
          });
        }
      }
      // Second scroll after content renders
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, 100);
    return () => { clearTimeout(t); };
  }, [progress.currentChapterId]);

  // All characters shown in the top strip (excluding protagonist, which is rendered separately)
  const [allPersistentChars, setAllPersistentChars] = useState<{ id: string; name: string; img: string; role?: string }[]>([]);

  // Dramatic character entrance — now includes protagonist allegory on first scene/contact
  useEffect(() => {
    if (!chapter || transitioning) return;
    const allChars = [...characters, ...part2Characters];
    const isPart2 = progress.campaign === 'part2';
    const protagonistId = isPart2 ? 'crista' : 'cristao';
    const sceneCharIds = chapter.characters || [];

    const sceneChars = sceneCharIds
      .map(id => {
        const char = allChars.find(c => c.id === id);
        const img = characterImages[id];
        if (!char || !img) return null;
        const isVillain = ['apolion', 'gigante_desespero', 'juiz_odio_ao_bem', 'amor_dinheiro', 'hipocrisia', 'formalista', 'ateismo', 'lisonjeiro', 'vergonha', 'desconfianca', 'madame_bolha'].includes(id);
        return { id, name: char.name, img, role: char.role, isVillain, isProtagonist: id === protagonistId };
      })
      .filter(Boolean) as { id: string; name: string; img: string; role?: string; isVillain?: boolean; isProtagonist?: boolean }[];

    const sceneSupportingChars = sceneChars.filter(char => !char.isProtagonist);

    // Show first unseen allegory from the full scene cast, including protagonist
    const firstCharId = sceneCharIds.find(id => !seenAllegoryCards.has(id) && allegoryMeanings[id] && characterImages[id]);

    // Prefer cinematic reveal for first supporting character, otherwise protagonist when alone
    const revealChar = sceneSupportingChars[0] || sceneChars[0];

    if (firstCharId) {
      const revealTarget = sceneChars.find(char => char.id === firstCharId) || revealChar;
      const delay = setTimeout(() => {
        seenAllegoryCards.add(firstCharId);
        try { sessionStorage.setItem('seen-allegory-cards', JSON.stringify([...seenAllegoryCards])); } catch {}
        setAllegoryCardChar(firstCharId);
        if (revealTarget) {
          playGameSfx(revealTarget.isVillain ? 'charRevealVillain' : 'charRevealAlly');
        }
      }, 250);
      return () => clearTimeout(delay);
    }

    if (revealChar) {
      const delay = setTimeout(() => {
        playGameSfx('suspense');
        setTimeout(() => {
          playGameSfx(revealChar.isVillain ? 'charRevealVillain' : 'charRevealAlly');
        }, 200);
        setCharReveal(revealChar);
        setTimeout(() => {
          setCharReveal(null);
          setCharRevealDone(true);
          setPersistentChar(revealChar);
          setAllPersistentChars(sceneSupportingChars.map(({ id, name, img, role }) => ({ id, name, img, role })));
        }, 2500);
      }, 250);
      return () => clearTimeout(delay);
    }

    setAllPersistentChars([]);
  }, [chapter?.id, transitioning, progress.campaign]);

  const hasCharReveal = !!charReveal || !!allegoryCardChar;
  const canShowChoices = !hasCharReveal;

  useEffect(() => {
    if (!chapter || fullNarrative.length > 0 || !canShowChoices) return;
    const timer = setTimeout(() => setShowChoices(true), 180);
    return () => clearTimeout(timer);
  }, [chapter, fullNarrative.length, canShowChoices]);

  // Delayed mini-game trigger button — appears 12s after choices show
  // Auto-popup notification after 30s if user hasn't clicked the button
  useEffect(() => {
    if (!showChoices || miniGameDone || !miniGameMappings[chapter?.id || '']) return;
    const btnTimer = setTimeout(() => setMiniGameButtonVisible(true), 12000);
    const popupTimer = setTimeout(() => setMiniGameAutoPopup(true), 15000);
    return () => { clearTimeout(btnTimer); clearTimeout(popupTimer); };
  }, [showChoices, miniGameDone, chapter?.id]);

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
      // Streak tracked internally for attribute bonuses only
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

  // ═══ BEATS SYSTEM — group narrative into 2-3 line beats ═══
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const beats = groupIntoBeats(fullNarrative, 2);
  const currentBeat = beats[beatIndex] ?? null;
  const hasMoreBeats = beatIndex < beats.length - 1;

  // Epic moment detection
  const hasEpicMoment = chapter ? !!epicMoments[chapter.id] : false;

  const handleAdvanceNarrative = () => {
    if (hasMoreBeats) {
      setBeatIndex(prev => prev + 1);
      // TTS for next beat
      if (audioOn && beats[beatIndex + 1]) {
        const beatText = beats[beatIndex + 1].lines.join(' ');
        speak(beatText, { isEpic: hasEpicMoment });
      }
      return;
    }

    // Check for epic moment before showing choices
    if (hasEpicMoment && !epicMomentDone) {
      setEpicMomentActive(true);
      return;
    }

    if (canShowChoices) {
      setShowChoices(true);
    }
  };

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
            <PilgrimAvatar attributes={progress.attributes} tone={legacyTone} size="sm" storyFlag={emotional?.flagOverride} campaign={progress.campaign} />
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
            {/* Back to previous scene — always visible */}
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
                className="btn-medieval-icon !px-3 !py-2 !rounded-lg flex items-center justify-center gap-1.5 active:scale-95"
                aria-label="Cena anterior"
              >
                <ArrowLeft className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-display text-primary uppercase tracking-wider hidden sm:inline">Voltar</span>
              </button>
            )}
            <button
              onClick={() => { const next = !audioOn; setAudioOn(next); toggleAudio(next); }}
              className="btn-medieval-icon !p-2.5 !rounded-lg flex items-center justify-center active:scale-95"
              aria-label={audioOn ? 'Desativar som' : 'Ativar som'}
            >
              {audioOn ? <Volume2 className="w-5 h-5 text-muted-foreground" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
            </button>
            <button
              onClick={() => {
                const phase = progress.currentChapterId.startsWith('fase') ? parseInt(progress.currentChapterId.charAt(4)) || 1 : 1;
                shareResult(progress.attributes, progress.choicesMade, phase).then(ok => {
                  if (ok) toast.success('Compartilhado!');
                });
              }}
              className="btn-medieval-icon !p-2.5 !rounded-lg flex items-center justify-center active:scale-95"
              aria-label="Compartilhar"
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
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
        {/* When inline mini-game is active, show it at the top and hide scene content */}
        {miniGameReady && !miniGameDone && miniGameMappings[chapter.id] && !FULLSCREEN_GAMES.has(miniGameMappings[chapter.id].type) && (
          <div id="minigame-area" className="px-5 py-4 animate-scale-in space-y-4">
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
              }}
            />
          </div>
        )}

        {/* Scene content — hidden when inline mini-game is active */}
        {!(miniGameReady && !miniGameDone && miniGameMappings[chapter.id] && !FULLSCREEN_GAMES.has(miniGameMappings[chapter.id]?.type)) && (
        <>
        {/* Scene image with preloading — BRIGHT and visible */}
        {bgImage && (
          <div className="relative w-full overflow-hidden" style={{ maxHeight: '320px', minHeight: '200px', background: 'hsl(var(--card))' }}>
            {(() => {
              const imgVar = getSceneImageVariation(chapter.id);
              return (
                <img
                  src={bgImage}
                  alt={chapter.title}
                  width={1024}
                  height={576}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  className="w-full h-auto object-cover scene-image scene-image-alive transition-all duration-[2000ms] ease-in-out"
                  style={{
                    ...atmosphere.imageStyle,
                    objectPosition: imgVar.objectPosition,
                    transform: imgVar.transform,
                    transformOrigin: 'center center',
                    filter: [
                      getSceneAtmosphere(chapter.id).imageFilter || 'brightness(1.05) saturate(1.0)',
                      imgVar.extraFilter || '',
                    ].filter(Boolean).join(' ') || undefined,
                  }}
                />
              );
            })()}
            {/* Particle effects overlay */}
            {imageLoaded && (() => {
              const pType = getParticleTypeForScene(chapter.id, legacyTone);
              return pType ? <ParticleEffects type={pType} intensity={0.6} /> : null;
            })()}
            <div className="absolute inset-0 scene-overlay bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            {/* Scene atmosphere overlay */}
            {(() => {
              const atmo = getSceneAtmosphere(chapter.id);
              return atmo.overlayColor || atmo.bgTint ? (
                <div className="absolute inset-0 pointer-events-none transition-all duration-[2000ms]" style={{
                  background: atmo.bgTint || atmo.overlayColor,
                  mixBlendMode: 'multiply',
                }} />
              ) : null;
            })()}
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20">
              <MapPin className="w-3 h-3 text-primary/80" />
              <span className="text-xs uppercase tracking-widest text-amber-300 font-display font-bold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{chapter.location}</span>
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
            {/* Protagonist — always visible with emotional state */}
            {(() => {
              const isPart2 = progress.campaign === 'part2';
              const protagonistId = isPart2 ? 'crista' : 'cristao';
              const protChar = [...characters, ...part2Characters].find(c => c.id === protagonistId);
              const userName = profile?.display_name || protChar?.name || 'Peregrino';
              return (
                <button onClick={() => setShowStats(s => !s)} className="flex items-center gap-3 flex-shrink-0 active:scale-95 transition-transform">
                  <PilgrimAvatar
                    attributes={progress.attributes}
                    tone={legacyTone}
                    size="md"
                    storyFlag={emotional?.flagOverride}
                    showLabel={false}
                    campaign={progress.campaign}
                  />
                  <div className="text-left">
                    <p className="font-display text-sm font-bold text-primary leading-tight">{userName}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{emotional?.posture ? (isPart2 ? postureLabelsFemale : postureLabels)[emotional.posture] || emotional.posture.replace(/_/g, ' ') : (isPart2 ? 'Peregrina' : 'Peregrino')}</p>
                  </div>
                </button>
              );
            })()}

            {/* Persistent NPC portraits — clickable to reopen allegory card */}
            {charRevealDone && allPersistentChars.length > 0 && (
              <div className="flex items-center gap-3 flex-shrink-0 animate-fade-in ml-auto overflow-hidden">
                {allPersistentChars.slice(0, 3).map((npc, idx) => {
                  const npcId = npc.id;
                  const hasAllegory = !!allegoryMeanings[npcId];
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (hasAllegory && npcId) {
                          setAllegoryCardChar(npcId);
                        }
                      }}
                      className="flex flex-col items-center flex-shrink-0 active:scale-95 transition-transform"
                    >
                      <img
                        src={npc.img}
                        alt={npc.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-top"
                        style={{
                          border: '2px solid hsl(35 40% 40%)',
                          boxShadow: '0 4px 12px hsl(0 0% 0% / 0.4), 0 0 8px hsl(35 40% 40% / 0.2)',
                        }}
                      />
                      <p className="text-[11px] sm:text-xs font-display font-bold leading-tight mt-1 text-center max-w-[72px] truncate" style={{ color: 'hsl(35 50% 65%)' }}>{npc.name}</p>
                      {hasAllegory && <p className="text-[9px] text-primary/50 font-display uppercase tracking-wider">toque p/ ler</p>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-5">
          <h1 className="font-display text-xl md:text-2xl text-white mb-4 fade-in leading-tight scene-title font-bold" style={{ wordSpacing: '0.15em', textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.5)' }}>{chapter.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-primary/20" />
            <span className="text-primary text-sm">✦</span>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="space-y-3 mb-6" style={atmosphere.textStyle}>
            {currentBeat && (
              (() => {
                const sceneAtmo = getSceneAtmosphere(chapter.id);
                return <div
                key={`${chapter.id}-beat-${beatIndex}`}
                className="fade-in rounded-xl border px-4 py-4"
                style={{
                  boxShadow: sceneAtmo.textGlow
                    ? `0 8px 20px hsl(0 0% 0% / 0.14), 0 0 20px ${sceneAtmo.textGlow}`
                    : '0 8px 20px hsl(0 0% 0% / 0.14)',
                  background: sceneAtmo.cardBg || 'hsl(var(--card) / 0.55)',
                  borderColor: sceneAtmo.borderAccent || 'hsl(var(--border) / 0.6)',
                }}
              >
                {currentBeat.lines.map((line, li) => (
                  <p
                    key={li}
                    className="narrative-text text-foreground/90 mb-2 last:mb-0"
                    style={{
                      ...(sceneAtmo.textColor ? { color: sceneAtmo.textColor } : {}),
                      animation: `fade-in 0.5s ease-out ${li * 200}ms both`,
                    }}
                  >
                    {renderNarrative(line)}
                  </p>
                ))}
              </div>;
              })()
            )}

            {beats.length > 0 && !showChoices && (
              <div className="space-y-2 sticky bottom-0 z-10 pb-2 pt-2" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 60%, transparent)' }}>
                {/* Navigation: back + forward buttons always visible */}
                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm px-3 py-2.5">
                  {/* Back button */}
                  <button
                    onClick={() => {
                      if (beatIndex > 0) {
                        setBeatIndex(prev => Math.max(0, prev - 1));
                      }
                    }}
                    disabled={beatIndex === 0}
                    className="btn-medieval-secondary px-3 py-2 text-xs flex items-center gap-1.5 flex-shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  {/* Progress indicator */}
                  <p className="text-[10px] font-display uppercase tracking-[0.15em] text-muted-foreground flex-1 text-center">
                    {Math.min(beatIndex + 1, beats.length)}/{beats.length} ✦
                  </p>
                  {/* TTS button */}
                  {currentBeat && (
                    <button
                      onClick={() => {
                        if (ttsPlaying) {
                          stopTTS();
                        } else {
                          speak(currentBeat.lines.join(' '), { isEpic: hasEpicMoment });
                        }
                      }}
                      className="btn-medieval-icon !p-2 !rounded-lg flex items-center justify-center active:scale-95"
                      aria-label={ttsPlaying ? 'Parar narração' : 'Ouvir narração'}
                    >
                      {ttsPlaying ? <VolumeX className="w-3.5 h-3.5 text-primary" /> : <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                  )}
                  {/* Continue button */}
                  <button
                    onClick={handleAdvanceNarrative}
                    disabled={!hasMoreBeats && !canShowChoices && !hasEpicMoment}
                    className="btn-medieval min-w-[120px] px-4 py-2 text-xs disabled:pointer-events-none disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {hasMoreBeats ? 'Continuar' : (hasEpicMoment && !epicMomentDone) ? '✦ Momento' : canShowChoices ? 'Ver escolhas' : 'Aguarde...'} 
                    {hasMoreBeats && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
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

          {/* ═══ MINI-GAME AUTO-POPUP (after 30s inactivity) ═══ */}
          <GameNotification visible={miniGameAutoPopup && !miniGameDone && !miniGameReady && !!miniGameMappings[chapter.id]} onDismiss={() => setMiniGameAutoPopup(false)} duration={0} persistent position="center">
            <div className="bg-card border-2 border-primary/40 rounded-2xl p-5 text-center space-y-3 shadow-2xl">
              <span className="text-4xl">⚔️</span>
              <p className="font-display text-lg text-primary">Desafio Disponível!</p>
              <p className="text-sm text-muted-foreground">Há um desafio esperando por você nesta cena.</p>
              <button
                onClick={() => {
                  setMiniGameAutoPopup(false);
                  window.scrollTo(0, 0);
                  setMiniGameReady(true);
                  requestAnimationFrame(() => window.scrollTo(0, 0));
                }}
                className="btn-medieval w-full flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Iniciar Desafio
              </button>
            </div>
          </GameNotification>

          {/* ═══ MINI-GAME TRIGGER BUTTON (appears after 12s delay) ═══ */}
          {showChoices && !miniGameDone && miniGameMappings[chapter.id] && !miniGameReady && miniGameButtonVisible && (
            <div className="mb-5 animate-scale-in" id="minigame-trigger">
              <button
                onClick={() => {
                  setMiniGameAutoPopup(false);
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  setMiniGameReady(true);
                  requestAnimationFrame(() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  });
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    const el = document.getElementById('minigame-area');
                    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
                  }, 50);
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    const el = document.getElementById('minigame-area');
                    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
                  }, 200);
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

          {/* Old inline mini-game area removed — now renders at top of main */}

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
          {miniGameResult && (
            <GameNotification visible={showMiniGameResult} onDismiss={() => setShowMiniGameResult(false)} duration={15000} position="top">
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
            </GameNotification>
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
                  {/* Re-read narrative + back to previous scene */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-display">Escolha seu caminho</p>
                    <div className="flex items-center gap-2">
                      {fullNarrative.length > 0 && (
                        <button
                          onClick={() => { setShowChoices(false); setBeatIndex(0); }}
                          className="flex items-center gap-1 text-[10px] font-display text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
                        >
                          <ArrowLeft className="w-3 h-3" /> Reler
                        </button>
                      )}
                      {progress.visitedChapters.length > 1 && (
                        <button
                          onClick={() => {
                            const visited = progress.visitedChapters;
                            const currentIdx = visited.indexOf(progress.currentChapterId);
                            const prevId = currentIdx > 0 ? visited[currentIdx - 1] : visited[visited.length - 2];
                            if (prevId && prevId !== progress.currentChapterId) goToChapter(prevId);
                          }}
                          className="flex items-center gap-1 text-[10px] font-display text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                        >
                          <ArrowLeft className="w-3 h-3" /> Cena anterior
                        </button>
                      )}
                    </div>
                  </div>

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
                      key={`timed-${timedRetryCount}`}
                      timeLimit={chapter.timeLimit || 15}
                      onTimeout={() => {
                        playGameSfx('defeat');
                        toast.error('⏳ O tempo acabou! Tente novamente — leia o texto e escolha rápido.');
                        setTimedRetryCount(prev => prev + 1);
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
        </>
        )}
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

      {/* Streak popup removed — was distracting from the narrative */}

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
                className="w-64 h-[20rem] sm:w-72 sm:h-[22rem] md:w-[22rem] md:h-[28rem] object-cover object-top mx-auto max-w-[90vw]"
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

      {/* ═══ ALLEGORY CARD — first encounter explanation ═══ */}
      {allegoryCardChar && (
        <AllegoryCard
          characterId={allegoryCardChar}
          onDismiss={() => {
            setAllegoryCardChar(null);

            // Check if there's another unseen allegory card in this scene
            const isPart2 = progress.campaign === 'part2';
            const protagonistId = isPart2 ? 'crista' : 'cristao';
            const sceneCharIds = chapter?.characters || [];
            const nextUnseen = sceneCharIds.find(
              id => id !== protagonistId && !seenAllegoryCards.has(id) && allegoryMeanings[id] && characterImages[id]
            );

            if (nextUnseen) {
              // Queue the next allegory card after a short delay
              seenAllegoryCards.add(nextUnseen);
              try { sessionStorage.setItem('seen-allegory-cards', JSON.stringify([...seenAllegoryCards])); } catch {}
              setTimeout(() => setAllegoryCardChar(nextUnseen), 400);
            } else {
              // All allegory cards shown — finalize scene
              setCharRevealDone(true);
              const allChars = [...characters, ...part2Characters];
              const npcs = sceneCharIds
                .filter(id => id !== protagonistId)
                .map(id => {
                  const char = allChars.find(c => c.id === id);
                  const img = characterImages[id];
                  if (!char || !img) return null;
                  return { id, name: char.name, img, role: char.role };
                })
                .filter(Boolean) as { id: string; name: string; img: string; role?: string }[];
              setAllPersistentChars(npcs);
              if (npcs[0]) setPersistentChar(npcs[0]);
            }
          }}
        />
      )}

      {/* ═══ EPIC MOMENT — immersive full-screen for key scenes ═══ */}
      {epicMomentActive && chapter && epicMoments[chapter.id] && (
        <EpicMoment
          sceneId={chapter.id}
          config={epicMoments[chapter.id]}
          onComplete={() => {
            setEpicMomentActive(false);
            setEpicMomentDone(true);
            if (canShowChoices) setShowChoices(true);
          }}
        />
      )}

      {/* ═══ EPIC DEFEAT SCREEN — dramatic failure with hold-to-rise ═══ */}
      {showDefeatScreen && (
        <EpicDefeatScreen
          message={defeatMessage}
          villain={defeatVillain}
          onRise={() => {
            setShowDefeatScreen(false);
            // Grant +1 perseverance for rising
            const riseEffects = { perseveranca: 1 };
            triggerChoiceEffect(riseEffects);
          }}
        />
      )}
    </div>
  );
};

export default ScenePage;
