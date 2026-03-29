import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { storyChapters, chapterOrder } from '@/data/story';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

const PHASES = [
  {
    id: 'fase1', label: 'A Partida', subtitle: 'Cidade da Destruição → Porta Estreita',
    icon: '🏰', landmark: '🏚️', color: '#C4A265',
    description: 'O peregrino desperta e parte em busca da salvação',
    illustrations: ['⛪', '📖', '🏃', '🌊'],
  },
  {
    id: 'fase2', label: 'O Caminho', subtitle: 'Casa do Intérprete → Palácio Belo',
    icon: '⛰️', landmark: '🏛️', color: '#8B7355',
    description: 'Visões, revelações e a armadura de Deus',
    illustrations: ['🔥', '🕯️', '⚔️', '🛡️'],
  },
  {
    id: 'fase3', label: 'A Provação', subtitle: 'Vale da Humilhação → Feira da Vaidade',
    icon: '🐉', landmark: '🗡️', color: '#8B4513',
    description: 'Batalhas, sombras e o preço da verdade',
    illustrations: ['🐉', '💀', '⚡', '🩸'],
  },
  {
    id: 'fase4', label: 'A Perseverança', subtitle: 'Feira da Vaidade → Colina de Lucro',
    icon: '⚖️', landmark: '🎪', color: '#6B4423',
    description: 'Julgamentos, martírios e tentações do ouro',
    illustrations: ['⚖️', '👑', '💰', '🕊️'],
  },
  {
    id: 'fase5', label: 'A Libertação', subtitle: 'Castelo da Dúvida → Montanhas Deleitosas',
    icon: '🔑', landmark: '🏔️', color: '#4A6741',
    description: 'Prisão, chave da promessa e visão celestial',
    illustrations: ['🔒', '🔑', '🐑', '🌄'],
  },
  {
    id: 'fase6', label: 'A Glória', subtitle: 'País de Beulá → Cidade Celestial',
    icon: '✨', landmark: '🏛️', color: '#DAA520',
    description: 'O rio da morte e os portões eternos',
    illustrations: ['🌸', '🌊', '🎺', '👼'],
  },
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
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(38 35% 22%) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(30 25% 18%) 0%, transparent 50%),
          linear-gradient(180deg, hsl(35 30% 16%) 0%, hsl(30 25% 12%) 50%, hsl(25 20% 10%) 100%)
        `,
      }}
    >
      {/* Parchment texture */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
        opacity: 0.4,
      }} />

      {/* Aged edges vignette */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{
        boxShadow: 'inset 0 0 120px 40px hsl(25 30% 8% / 0.8), inset 0 0 60px 20px hsl(25 30% 8% / 0.4)',
      }} />

      {/* Compass rose - top right */}
      <div className="fixed top-20 right-3 z-[2] opacity-20 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 100 100">
          <g fill="none" stroke="hsl(40 60% 55%)" strokeWidth="1.5" opacity="0.6">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="35" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="5" y1="50" x2="95" y2="50" />
            <line x1="15" y1="15" x2="85" y2="85" />
            <line x1="85" y1="15" x2="15" y2="85" />
            <polygon points="50,8 46,25 54,25" fill="hsl(40 60% 55%)" opacity="0.5" />
          </g>
          <text x="50" y="4" textAnchor="middle" fill="hsl(40 60% 55%)" fontSize="8" opacity="0.5" fontFamily="serif">N</text>
          <text x="97" y="53" textAnchor="middle" fill="hsl(40 60% 55%)" fontSize="7" opacity="0.4" fontFamily="serif">L</text>
          <text x="50" y="99" textAnchor="middle" fill="hsl(40 60% 55%)" fontSize="7" opacity="0.4" fontFamily="serif">S</text>
          <text x="4" y="53" textAnchor="middle" fill="hsl(40 60% 55%)" fontSize="7" opacity="0.4" fontFamily="serif">O</text>
        </svg>
      </div>

      {/* Header - parchment style */}
      <header className="sticky top-0 z-20 px-4 py-3 border-b-2"
        style={{
          background: 'linear-gradient(180deg, hsl(35 30% 18% / 0.97) 0%, hsl(30 25% 15% / 0.95) 100%)',
          borderColor: 'hsl(40 50% 35% / 0.5)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-medieval-icon !p-2 active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-xl" style={{ color: 'hsl(40 60% 70%)' }}>
              📜 Mapa do Peregrino
            </h1>
            <p className="text-sm" style={{ color: 'hsl(35 30% 55%)' }}>
              {totalVisited} de {total} locais descobertos
            </p>
          </div>
          {/* Pilgrim silhouette */}
          <span className="text-2xl opacity-60">🚶</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 pb-12 relative z-10">

        {/* Map title banner */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12" style={{ background: 'hsl(40 50% 45% / 0.4)' }} />
            <span className="text-xl" style={{ color: 'hsl(40 60% 55%)' }}>⚜️</span>
            <div className="h-px w-12" style={{ background: 'hsl(40 50% 45% / 0.4)' }} />
          </div>
          <h2 className="font-display text-2xl mb-1" style={{ color: 'hsl(38 50% 75%)', textShadow: '0 2px 8px hsl(0 0% 0% / 0.5)' }}>
            O Progresso do Peregrino
          </h2>
          <p className="text-sm italic font-body" style={{ color: 'hsl(35 25% 50%)' }}>
            Da Cidade da Destruição à Cidade Celestial
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-16" style={{ background: 'hsl(40 50% 45% / 0.3)' }} />
            <span style={{ color: 'hsl(40 60% 55% / 0.5)' }}>✦</span>
            <div className="h-px w-16" style={{ background: 'hsl(40 50% 45% / 0.3)' }} />
          </div>
        </div>

        {/* Progress bar - scroll style */}
        <div className="mb-8 px-2">
          <div className="h-3 rounded-full overflow-hidden border"
            style={{
              background: 'hsl(30 20% 12%)',
              borderColor: 'hsl(40 40% 30% / 0.5)',
              boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.3)',
            }}
          >
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.round((totalVisited / total) * 100)}%`,
                background: 'linear-gradient(90deg, hsl(40 60% 45%), hsl(40 70% 55%), hsl(40 60% 50%))',
                boxShadow: '0 0 8px hsl(40 70% 50% / 0.4)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-display" style={{ color: 'hsl(35 30% 45%)' }}>🏚️ Início</span>
            <span className="text-xs font-display" style={{ color: 'hsl(35 30% 45%)' }}>{Math.round((totalVisited / total) * 100)}%</span>
            <span className="text-xs font-display" style={{ color: 'hsl(35 30% 45%)' }}>🏛️ Celestial</span>
          </div>
        </div>

        {/* THE MAP - winding path */}
        <div className="relative">
          {/* Central winding path SVG */}
          <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
            <defs>
              <pattern id="pathPattern" patternUnits="userSpaceOnUse" width="4" height="8">
                <circle cx="2" cy="2" r="1" fill="hsl(40 50% 40% / 0.3)" />
              </pattern>
            </defs>
          </svg>

          {groupedChapters.map((phase, phaseIdx) => {
            const visitedCount = phase.chapters.filter(c => progress.visitedChapters.includes(c.id)).length;
            const isPhaseStarted = visitedCount > 0;
            const isPhaseComplete = visitedCount === phase.chapters.length && phase.chapters.length > 0;
            const isRight = phaseIdx % 2 !== 0;

            return (
              <div key={phase.id} className="relative mb-2">
                {/* Phase region - parchment card */}
                <div className="rounded-2xl p-4 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(${isRight ? '135deg' : '225deg'}, hsl(35 25% 15% / 0.8) 0%, hsl(30 20% 12% / 0.6) 100%)`,
                    border: `2px solid ${isPhaseComplete ? 'hsl(40 60% 45% / 0.6)' : 'hsl(30 20% 25% / 0.5)'}`,
                    boxShadow: isPhaseStarted
                      ? `0 0 20px hsl(40 50% 40% / 0.1), inset 0 1px 0 hsl(40 50% 50% / 0.1)`
                      : 'inset 0 2px 6px hsl(0 0% 0% / 0.2)',
                  }}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-1 left-1 opacity-20" style={{ color: phase.color }}>╔</div>
                  <div className="absolute top-1 right-1 opacity-20" style={{ color: phase.color }}>╗</div>
                  <div className="absolute bottom-1 left-1 opacity-20" style={{ color: phase.color }}>╚</div>
                  <div className="absolute bottom-1 right-1 opacity-20" style={{ color: phase.color }}>╝</div>

                  {/* Phase header with illustrations */}
                  <div className={`flex items-start gap-3 mb-4 ${isRight ? 'flex-row-reverse text-right' : ''}`}>
                    {/* Landmark icon */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 relative"
                      style={{
                        background: isPhaseComplete
                          ? `linear-gradient(135deg, hsl(40 60% 35%), hsl(40 50% 25%))`
                          : `linear-gradient(135deg, hsl(30 20% 18%), hsl(30 15% 14%))`,
                        border: `2px solid ${isPhaseComplete ? 'hsl(40 60% 50% / 0.6)' : 'hsl(30 20% 28% / 0.5)'}`,
                        boxShadow: isPhaseComplete ? '0 0 12px hsl(40 60% 50% / 0.2)' : 'none',
                      }}
                    >
                      {phase.icon}
                      {isPhaseComplete && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ background: 'hsl(40 60% 45%)', color: 'hsl(30 20% 10%)' }}>✓</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-display uppercase tracking-widest"
                          style={{ color: 'hsl(40 50% 50% / 0.7)' }}>
                          Fase {phaseIdx + 1}
                        </span>
                        <span className="text-xs" style={{ color: 'hsl(35 30% 40%)' }}>
                          — {visitedCount}/{phase.chapters.length}
                        </span>
                      </div>
                      <h3 className="font-display text-lg leading-tight mt-0.5"
                        style={{ color: isPhaseStarted ? 'hsl(38 50% 72%)' : 'hsl(30 15% 40%)' }}>
                        {phase.label}
                      </h3>
                      <p className="text-xs mt-0.5 italic" style={{ color: 'hsl(35 20% 45%)' }}>
                        {phase.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Illustration strip */}
                  <div className={`flex gap-2 mb-3 ${isRight ? 'justify-end' : 'justify-start'}`}>
                    {phase.illustrations.map((ill, idx) => (
                      <span key={idx} className="text-lg opacity-30" style={{
                        filter: isPhaseStarted ? 'none' : 'grayscale(1)',
                        opacity: isPhaseStarted ? 0.5 : 0.15,
                      }}>{ill}</span>
                    ))}
                  </div>

                  {/* Phase description */}
                  <p className={`text-sm italic mb-3 ${isRight ? 'text-right' : ''}`}
                    style={{ color: isPhaseStarted ? 'hsl(35 25% 55%)' : 'hsl(30 15% 35%)' }}>
                    {isPhaseStarted ? phase.description : '???'}
                  </p>

                  {/* Chapter nodes */}
                  <div className="space-y-2">
                    {phase.chapters.map((item, i) => {
                      const unlocked = progress.visitedChapters.includes(item.id);
                      const isCurrent = progress.currentChapterId === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleChapterClick(item.id)}
                          disabled={!unlocked}
                          className="w-full text-left transition-all active:scale-[0.98]"
                        >
                          <div className={`flex items-center gap-3 p-3 rounded-xl ${isRight ? 'flex-row-reverse' : ''}`}
                            style={{
                              background: isCurrent
                                ? 'linear-gradient(135deg, hsl(40 50% 25% / 0.5), hsl(40 40% 20% / 0.3))'
                                : unlocked
                                ? 'hsl(30 20% 14% / 0.5)'
                                : 'hsl(30 15% 12% / 0.3)',
                              border: isCurrent
                                ? '2px solid hsl(40 60% 50% / 0.5)'
                                : unlocked
                                ? '1px solid hsl(30 20% 25% / 0.4)'
                                : '1px solid hsl(30 15% 20% / 0.3)',
                              boxShadow: isCurrent ? '0 0 12px hsl(40 60% 50% / 0.15)' : 'none',
                            }}
                          >
                            {/* Map pin */}
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                              style={{
                                background: isCurrent
                                  ? 'linear-gradient(135deg, hsl(40 60% 50%), hsl(40 50% 40%))'
                                  : unlocked
                                  ? 'hsl(30 25% 18%)'
                                  : 'hsl(30 15% 14%)',
                                border: `2px solid ${isCurrent ? 'hsl(40 70% 55%)' : unlocked ? 'hsl(40 40% 35% / 0.4)' : 'hsl(30 15% 22%)'}`,
                                color: isCurrent ? 'hsl(30 20% 10%)' : unlocked ? 'hsl(40 50% 55%)' : 'hsl(30 15% 35%)',
                                boxShadow: isCurrent ? '0 0 8px hsl(40 60% 50% / 0.3)' : 'none',
                              }}
                            >
                              {isCurrent ? '📍' : unlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                            </div>

                            <div className={`flex-1 min-w-0 ${isRight ? 'text-right' : ''}`}>
                              <p className="font-display text-base leading-snug"
                                style={{
                                  color: isCurrent ? 'hsl(40 60% 70%)' : unlocked ? 'hsl(38 40% 70%)' : 'hsl(30 15% 35%)',
                                }}>
                                {unlocked ? item.chapter!.title : '— terra desconhecida —'}
                              </p>
                              {unlocked && (
                                <p className="text-sm mt-0.5" style={{ color: 'hsl(35 20% 45%)' }}>
                                  📍 {item.chapter!.location}
                                </p>
                              )}
                            </div>

                            {isCurrent && (
                              <span className="text-xs font-display px-2 py-1 rounded-lg flex-shrink-0"
                                style={{
                                  background: 'hsl(40 60% 50% / 0.2)',
                                  color: 'hsl(40 60% 65%)',
                                  border: '1px solid hsl(40 60% 50% / 0.3)',
                                }}>
                                AQUI
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Path connector between phases */}
                {phaseIdx < groupedChapters.length - 1 && (
                  <div className="flex flex-col items-center py-3 relative">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-8" style={{ background: 'hsl(40 40% 35% / 0.3)' }} />
                      <span className="text-lg" style={{ color: 'hsl(40 50% 40% / 0.5)' }}>⚜️</span>
                      <div className="h-px w-8" style={{ background: 'hsl(40 40% 35% / 0.3)' }} />
                    </div>
                    {/* Dotted path line */}
                    <div className="w-px h-6" style={{
                      backgroundImage: 'repeating-linear-gradient(180deg, hsl(40 50% 40% / 0.3) 0px, hsl(40 50% 40% / 0.3) 3px, transparent 3px, transparent 7px)',
                    }} />
                    {/* Small pilgrim walking */}
                    <span className="text-sm opacity-30">🚶</span>
                    <div className="w-px h-6" style={{
                      backgroundImage: 'repeating-linear-gradient(180deg, hsl(40 50% 40% / 0.3) 0px, hsl(40 50% 40% / 0.3) 3px, transparent 3px, transparent 7px)',
                    }} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Final destination — Celestial City */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-16" style={{ background: 'hsl(40 60% 50% / 0.3)' }} />
              <span style={{ color: 'hsl(40 60% 55% / 0.5)' }}>✦ ✦ ✦</span>
              <div className="h-px w-16" style={{ background: 'hsl(40 60% 50% / 0.3)' }} />
            </div>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl relative"
              style={{
                background: 'linear-gradient(135deg, hsl(40 50% 25%), hsl(40 40% 18%))',
                border: '3px solid hsl(40 60% 45% / 0.4)',
                boxShadow: '0 0 30px hsl(40 60% 50% / 0.15), inset 0 2px 8px hsl(40 80% 60% / 0.1)',
              }}
            >
              🏛️
            </div>
            <h3 className="font-display text-xl mt-3" style={{ color: 'hsl(40 60% 70%)', textShadow: '0 2px 8px hsl(40 60% 50% / 0.2)' }}>
              A Cidade Celestial
            </h3>
            <p className="text-sm italic mt-1" style={{ color: 'hsl(35 25% 45%)' }}>
              "E Deus limpará de seus olhos toda lágrima"
            </p>
            <p className="text-xs mt-1" style={{ color: 'hsl(35 20% 38%)' }}>
              Apocalipse 21:4
            </p>
          </div>

          {/* Map legend */}
          <div className="mt-10 rounded-xl p-4"
            style={{
              background: 'hsl(30 20% 13% / 0.6)',
              border: '1px solid hsl(30 20% 25% / 0.4)',
            }}
          >
            <p className="text-xs font-display uppercase tracking-widest mb-3"
              style={{ color: 'hsl(40 40% 50% / 0.7)' }}>Legenda do Mapa</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span style={{ color: 'hsl(35 25% 55%)' }}>Local atual</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(40 50% 55%)' }} />
                <span style={{ color: 'hsl(35 25% 55%)' }}>Visitado</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: 'hsl(30 15% 35%)' }} />
                <span style={{ color: 'hsl(35 25% 55%)' }}>Não descoberto</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🚶</span>
                <span style={{ color: 'hsl(35 25% 55%)' }}>Caminho</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default JourneysPage;
