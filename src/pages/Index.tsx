import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { getChapter, storyChapters, chapterOrder } from '@/data/story';
import { getReplayIncentive, getUnlockableHints } from '@/data/sceneVariations';
import { useAuth } from '@/contexts/AuthContext';
import { getStreak, getDashboardMessage, getMilestones } from '@/lib/gameLoop';
import PilgrimAvatar from '@/components/PilgrimAvatar';
import { ChevronRight, Sparkles, RotateCcw, Map, User, Users, LogIn, KeyRound, Flame, Star } from 'lucide-react';

const getPlayerState = (attrs: { fe: number; coragem: number; perseveranca: number; discernimento: number }) => {
  const avg = (attrs.fe + attrs.coragem + attrs.perseveranca + attrs.discernimento) / 4;
  if (avg >= 8) return { label: 'Iluminado', color: 'text-primary', icon: '✦' };
  if (avg >= 6.5) return { label: 'Firme', color: 'text-primary/80', icon: '⬆' };
  if (avg >= 5) return { label: 'Caminhando', color: 'text-foreground', icon: '→' };
  if (avg >= 4) return { label: 'Em dúvida', color: 'text-muted-foreground', icon: '?' };
  return { label: 'Abatido', color: 'text-destructive', icon: '↓' };
};

const Index = () => {
  const navigate = useNavigate();
  const { hasProgress, startJourney, resetProgress, progress, history, isReplay } = useStoryProgress();
  const { user, profile } = useAuth();
  const [streakShown, setStreakShown] = useState(false);

  const streak = useMemo(() => getStreak(), []);

  // Show streak toast briefly
  useEffect(() => {
    if (streak.isNewDay && streak.days >= 2) {
      setStreakShown(true);
      const t = setTimeout(() => setStreakShown(false), 4000);
      return () => clearTimeout(t);
    }
  }, [streak]);

  const handleContinue = () => {
    startJourney();
    navigate('/cena');
  };

  const handleNewJourney = () => {
    resetProgress();
    startJourney();
    navigate('/cena');
  };

  const currentChapter = getChapter(progress.currentChapterId);
  const totalChapters = Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);
  const playerState = getPlayerState(progress.attributes);

  const lastResult = history.playthroughs.length > 0
    ? history.playthroughs[history.playthroughs.length - 1]
    : null;

  const currentPhase = useMemo(() => {
    const id = progress.currentChapterId;
    if (id.startsWith('fase3')) return { num: 3, name: 'O Vale da Sombra' };
    if (id.startsWith('fase2')) return { num: 2, name: 'O Caminho Estreito' };
    return { num: 1, name: 'A Partida' };
  }, [progress.currentChapterId]);

  const dashboardMsg = useMemo(() =>
    getDashboardMessage(progress.attributes, progress.choicesMade, currentPhase.num, progress.playthrough),
    [progress.attributes, progress.choicesMade, currentPhase.num, progress.playthrough]
  );

  const milestones = useMemo(() =>
    getMilestones(progress.choicesMade, progress.visitedChapters.length, progress.attributes),
    [progress.choicesMade, progress.visitedChapters.length, progress.attributes]
  );

  const reachedMilestones = milestones.filter(m => m.reached);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Streak toast */}
      {streakShown && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{streak.message}</span>
          </div>
        </div>
      )}

      {/* Top section — avatar & status */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-10 pb-4">
        <div className="w-full max-w-sm space-y-5 text-center animate-fade-in">

          {/* Phase & playthrough */}
          <div className="space-y-1">
            {isReplay && (
              <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">
                Jogada {progress.playthrough}
              </p>
            )}
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              {hasProgress ? `Fase ${currentPhase.num} · ${currentPhase.name}` : 'O Peregrino'}
            </p>
          </div>

          {/* Central Avatar */}
          <PilgrimAvatar
            attributes={hasProgress ? progress.attributes : { fe: 3, perseveranca: 3, discernimento: 3, coragem: 3 }}
            tone={hasProgress ? undefined : 'heavy'}
            size="lg"
            showLabel
            className="mx-auto"
          />

          {/* Title */}
          <div>
            <h1 className="font-display text-2xl text-foreground leading-tight">
              {hasProgress && currentChapter ? currentChapter.title : 'O Peregrino'}
            </h1>
            {hasProgress && currentChapter && (
              <p className="text-xs text-muted-foreground mt-1">{currentChapter.location}</p>
            )}
            {!hasProgress && (
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mt-2">Uma jornada interativa</p>
            )}
          </div>

          {/* Contextual message */}
          {hasProgress && (
            <p className="text-xs text-muted-foreground italic px-4">{dashboardMsg}</p>
          )}

          {/* Progress bar */}
          {hasProgress && (
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{progressPercent}% da jornada</span>
                <div className="flex items-center gap-2">
                  {streak.days >= 2 && (
                    <span className="flex items-center gap-0.5 text-primary">
                      <Flame className="w-3 h-3" />
                      {streak.days}
                    </span>
                  )}
                  <span>{progress.choicesMade} decisões</span>
                </div>
              </div>
            </div>
          )}

          {/* Player state badge */}
          {hasProgress && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
              <span className={`text-sm ${playerState.color}`}>{playerState.icon}</span>
              <span className={`text-xs font-medium ${playerState.color}`}>{playerState.label}</span>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-muted-foreground">
                🔥{progress.attributes.fe} ⛰️{progress.attributes.perseveranca} 👁️{progress.attributes.discernimento} 🛡️{progress.attributes.coragem}
              </span>
            </div>
          )}

          {/* Milestones row */}
          {hasProgress && reachedMilestones.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {reachedMilestones.map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-primary/20 text-[10px] text-foreground/80"
                  title={m.label}
                >
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
          )}

          {/* Replay incentive — history-aware */}
          {lastResult && !hasProgress && (() => {
            const incentive = getReplayIncentive(history, progress.playthrough);
            const hints = getUnlockableHints(history);
            return (
              <div className="bg-card border border-border rounded-lg p-3 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Última Jornada</p>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <span>🔥 {lastResult.attributes.fe}</span>
                  <span>⛰️ {lastResult.attributes.perseveranca}</span>
                  <span>👁️ {lastResult.attributes.discernimento}</span>
                  <span>🛡️ {lastResult.attributes.coragem}</span>
                </div>
                {incentive && (
                  <p className="text-[10px] text-primary italic">{incentive}</p>
                )}
                {hints.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-1">
                      <KeyRound className="w-3 h-3" /> Ainda por descobrir
                    </p>
                    {hints.map((hint, i) => (
                      <p key={i} className="text-[10px] text-foreground/70">{hint}</p>
                    ))}
                  </div>
                )}
                {history.totalPlaythroughs > 0 && (
                  <p className="text-[9px] text-muted-foreground">
                    {history.totalPlaythroughs} {history.totalPlaythroughs === 1 ? 'jornada completada' : 'jornadas completadas'}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Bottom section — actions */}
      <div className="px-5 pb-8 pt-2 w-full max-w-sm mx-auto space-y-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        {/* Primary CTA */}
        {hasProgress ? (
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity glow-gold"
          >
            <ChevronRight className="w-5 h-5" />
            Continuar Jornada
          </button>
        ) : (
          <button
            onClick={handleNewJourney}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity glow-gold"
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
        )}

        {/* Secondary buttons row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate('/jornada')}
            className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
          >
            <Map className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Mapa</span>
          </button>
          <button
            onClick={() => user ? navigate('/perfil') : navigate('/auth')}
            className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
          >
            {user ? <User className="w-4 h-4 text-muted-foreground" /> : <LogIn className="w-4 h-4 text-muted-foreground" />}
            <span className="text-[10px] text-muted-foreground font-medium">{user ? (profile?.display_name || 'Perfil') : 'Entrar'}</span>
          </button>
          <button
            onClick={() => navigate('/comunidade')}
            className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
          >
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Comunidade</span>
          </button>
        </div>

        {/* Restart option when in progress */}
        {hasProgress && (
          <button
            onClick={handleNewJourney}
            className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors pt-1"
          >
            Recomeçar do início
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;
