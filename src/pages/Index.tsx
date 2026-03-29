import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { getChapter, storyChapters, chapterOrder } from '@/data/story';
import PilgrimAvatar from '@/components/PilgrimAvatar';
import { ChevronRight, Sparkles, RotateCcw, Map, User, Users } from 'lucide-react';

const replayMessages = [
  "Escolhas diferentes levam a caminhos diferentes. Descubra o que mudaria.",
  "Você explorou apenas um lado da história. Há muito mais para descobrir.",
  "E se você tivesse escolhido diferente no vale? Na feira? No castelo?",
  "Cada jornada é única. Sua próxima pode ser completamente diferente.",
  "Novos caminhos, novas lições. A história muda com você.",
];

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
  const replayMsg = replayMessages[history.totalPlaythroughs % replayMessages.length];

  // Determine current phase
  const currentPhase = useMemo(() => {
    const id = progress.currentChapterId;
    if (id.startsWith('fase3')) return { num: 3, name: 'O Vale da Sombra' };
    if (id.startsWith('fase2')) return { num: 2, name: 'O Caminho Estreito' };
    return { num: 1, name: 'A Partida' };
  }, [progress.currentChapterId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                <span>{progress.choicesMade} decisões</span>
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

          {/* Replay summary */}
          {lastResult && !hasProgress && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Última Jornada</p>
              <div className="flex items-center justify-center gap-3 text-xs">
                <span>🔥 {lastResult.attributes.fe}</span>
                <span>⛰️ {lastResult.attributes.perseveranca}</span>
                <span>👁️ {lastResult.attributes.discernimento}</span>
                <span>🛡️ {lastResult.attributes.coragem}</span>
              </div>
              <p className="text-[10px] text-primary italic">{replayMsg}</p>
              {history.totalPlaythroughs > 0 && (
                <p className="text-[9px] text-muted-foreground">
                  {history.totalPlaythroughs} {history.totalPlaythroughs === 1 ? 'jornada completada' : 'jornadas completadas'}
                </p>
              )}
            </div>
          )}
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
            onClick={() => navigate('/progresso')}
            className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Perfil</span>
          </button>
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-card border border-border opacity-50 cursor-not-allowed relative"
          >
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Comunidade</span>
            <span className="absolute -top-1 -right-1 text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Em breve</span>
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
