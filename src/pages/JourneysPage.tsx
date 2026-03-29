import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { storyChapters, chapterOrder } from '@/data/story';
import { ArrowLeft, Lock, CheckCircle2, Footprints } from 'lucide-react';
import { useMemo } from 'react';

/** Group chapters into phases for the medieval map */
const PHASES = [
  { id: 'fase1', label: 'Fase 1 — A Partida', color: 'hsl(40 60% 55%)', icon: '🏰' },
  { id: 'fase2', label: 'Fase 2 — O Caminho', color: 'hsl(30 50% 45%)', icon: '⛰️' },
  { id: 'fase3', label: 'Fase 3 — A Provação', color: 'hsl(0 40% 45%)', icon: '🔥' },
];

const JourneysPage = () => {
  const navigate = useNavigate();
  const { progress, goToChapter, startJourney } = useStoryProgress();

  const handleChapterClick = (chapterId: string) => {
    if (progress.visitedChapters.includes(chapterId)) {
      goToChapter(chapterId);
      startJourney();
      navigate('/cena');
    }
  };

  const groupedChapters = useMemo(() => {
    return PHASES.map(phase => ({
      ...phase,
      chapters: chapterOrder
        .filter(id => id.startsWith(phase.id))
        .map(id => ({ id, chapter: storyChapters[id] }))
        .filter(c => c.chapter),
    }));
  }, []);

  const totalVisited = progress.visitedChapters.length;
  const total = chapterOrder.length;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Parchment texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b-2 border-primary/30 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-medieval-icon !p-2 active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-xl text-foreground">📜 Mapa da Jornada</h1>
            <p className="text-sm text-muted-foreground">{totalVisited}/{total} locais descobertos</p>
          </div>
          <Footprints className="w-6 h-6 text-primary" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {/* Medieval map path */}
        <div className="relative">
          {/* Vertical winding path line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 z-0">
            <svg width="4" height="100%" className="overflow-visible">
              <line x1="2" y1="0" x2="2" y2="100%" stroke="hsl(40 60% 55% / 0.3)" strokeWidth="3" strokeDasharray="8 6" />
            </svg>
          </div>

          {groupedChapters.map((phase, phaseIdx) => (
            <div key={phase.id} className="mb-8 relative">
              {/* Phase banner */}
              <div className="relative z-10 flex items-center gap-3 mb-4 ml-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 border-primary/40 bg-card shadow-lg"
                  style={{ boxShadow: `0 0 20px ${phase.color.replace(')', ' / 0.2)')}` }}>
                  {phase.icon}
                </div>
                <div>
                  <h2 className="font-display text-lg text-foreground">{phase.label}</h2>
                  <p className="text-xs text-muted-foreground">
                    {phase.chapters.filter(c => progress.visitedChapters.includes(c.id)).length}/{phase.chapters.length} locais
                  </p>
                </div>
              </div>

              {/* Chapter nodes on the winding path */}
              <div className="space-y-2 ml-2">
                {phase.chapters.map((item, i) => {
                  const unlocked = progress.visitedChapters.includes(item.id);
                  const isCurrent = progress.currentChapterId === item.id;
                  const isEven = i % 2 === 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleChapterClick(item.id)}
                      disabled={!unlocked}
                      className={`relative w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                        isCurrent
                          ? 'bg-primary/15 border-primary/60 shadow-lg shadow-primary/10'
                          : unlocked
                          ? 'bg-card/80 border-border hover:border-primary/40 hover:bg-card'
                          : 'bg-muted/20 border-border/50 opacity-50 cursor-not-allowed'
                      }`}
                      style={{ marginLeft: isEven ? '0' : '1.5rem' }}
                    >
                      {/* Node marker */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-display flex-shrink-0 border-2 ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground border-primary animate-pulse'
                          : unlocked
                          ? 'bg-card border-primary/40 text-primary'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}>
                        {unlocked ? (isCurrent ? '⚔️' : <CheckCircle2 className="w-5 h-5" />) : <Lock className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <p className={`font-display text-base leading-snug ${
                          isCurrent ? 'text-primary' : unlocked ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {unlocked ? item.chapter!.title : '???'}
                        </p>
                        {unlocked && (
                          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                            📍 {item.chapter!.location}
                          </p>
                        )}
                      </div>

                      {isCurrent && (
                        <span className="text-xs text-primary font-display px-2 py-1 bg-primary/10 rounded-lg border border-primary/30">
                          AQUI
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Phase divider with decorative element */}
              {phaseIdx < groupedChapters.length - 1 && (
                <div className="flex items-center gap-2 my-6 ml-6">
                  <div className="h-px flex-1 bg-primary/20" />
                  <span className="text-primary text-lg">⚜️</span>
                  <div className="h-px flex-1 bg-primary/20" />
                </div>
              )}
            </div>
          ))}

          {/* End of map marker */}
          <div className="flex items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full border-3 border-primary/40 bg-card flex items-center justify-center text-2xl shadow-lg">
              🏛️
            </div>
          </div>
          <p className="text-center font-display text-base text-muted-foreground">A Cidade Celestial</p>
        </div>
      </main>
    </div>
  );
};

export default JourneysPage;
