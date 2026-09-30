import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getChapter, chapterOrder } from '@/data/story';
import { getPart2Chapter, part2ChapterOrder } from '@/data/storyPart2';
import { sceneImages } from '@/data/sceneImages';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { useNarration } from '@/hooks/useNarration';
import { Play, Pause, SkipForward, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

const LINE_DELAY_MS = 4000;
const LINE_FADE_MS = 600;

const CinemaPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { goToChapter, progress } = useStoryProgress();

  const chapterId = params.get('id') || progress.currentChapterId || 'cena1';
  const chapter = getChapter(chapterId) || getPart2Chapter(chapterId);
  const isPart2 = !!getPart2Chapter(chapterId);
  const voice = isPart2 ? 'francisca' as const : 'antonio' as const;

  const [currentLine, setCurrentLine] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [lineVisible, setLineVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const narration = useNarration({ chapterId, part: voice, enabled: true });

  const narrative = chapter?.narrative || [];
  const totalLines = narrative.length;

  // Find next chapter
  const allOrder = [...chapterOrder, ...part2ChapterOrder];
  const currentIdx = allOrder.indexOf(chapterId);
  const nextChapterId = currentIdx >= 0 && currentIdx < allOrder.length - 1
    ? allOrder[currentIdx + 1]
    : null;

  const image = sceneImages[chapterId] || sceneImages[chapterId.replace(/-\d+$/, '')];

  // Auto-play narration when chapter loads
  useEffect(() => {
    if (narration.isLoaded && !isPaused) {
      narration.play();
    }
  }, [narration.isLoaded, chapterId]);

  // Auto-advance lines
  useEffect(() => {
    if (isPaused || transitioning || currentLine >= totalLines) return;

    setLineVisible(false);
    const fadeTimer = setTimeout(() => setLineVisible(true), 50);

    timerRef.current = setTimeout(() => {
      if (currentLine < totalLines - 1) {
        setCurrentLine(prev => prev + 1);
      } else {
        // Chapter complete — advance to next
        setTransitioning(true);
        setTimeout(() => {
          if (nextChapterId) {
            goToChapter(nextChapterId);
            navigate(`/cinema?id=${nextChapterId}`, { replace: true });
            setCurrentLine(0);
            setTransitioning(false);
          }
        }, 1200);
      }
    }, LINE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(fadeTimer);
    };
  }, [currentLine, isPaused, transitioning, totalLines, nextChapterId, goToChapter, navigate]);

  // Pause/resume narration with video
  useEffect(() => {
    if (isPaused) {
      narration.pause();
    } else if (narration.isLoaded) {
      narration.play();
    }
  }, [isPaused, narration.isLoaded]);

  // Skip to next line
  const skipLine = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentLine < totalLines - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setTransitioning(false);
      }, 300);
    } else if (nextChapterId) {
      setTransitioning(true);
      setTimeout(() => {
        goToChapter(nextChapterId);
        navigate(`/cinema?id=${nextChapterId}`, { replace: true });
        setCurrentLine(0);
        setTransitioning(false);
      }, 300);
    }
  }, [currentLine, totalLines, nextChapterId, goToChapter, navigate]);

  // Go back
  const goBack = useCallback(() => {
    navigate('/jornada');
  }, [navigate]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Capítulo não encontrado.</p>
          <button onClick={goBack} className="text-amber-400 underline">Voltar</button>
        </div>
      </div>
    );
  }

  const progressPercent = totalLines > 0 ? ((currentLine + 1) / totalLines) * 100 : 0;
  const chapterProgress = allOrder.length > 0 ? ((currentIdx + 1) / allOrder.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background image */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${image})`,
            opacity: transitioning ? 0 : 0.35,
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      {/* Progress bar — top */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${chapterProgress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center flex-1 px-4">
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            {chapter.location}
          </h2>
          <h1 className="text-lg font-semibold mt-1">{chapter.title}</h1>
        </div>
        <button
          onClick={narration.toggleMute}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          {narration.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Main content — centered narrative */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-2xl w-full text-center">
          {/* Narrative line */}
          <p
            className={`text-xl md:text-2xl leading-relaxed font-light transition-opacity duration-${LINE_FADE_MS} ${
              lineVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          >
            {narrative[currentLine] || ''}
          </p>

          {/* Line counter */}
          <div className="mt-8 text-sm text-white/40">
            {currentLine + 1} / {totalLines}
          </div>
        </div>
      </div>

      {/* Controls — bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-6">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button
          onClick={skipLine}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Line progress — bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-amber-400/60 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CinemaPage;
