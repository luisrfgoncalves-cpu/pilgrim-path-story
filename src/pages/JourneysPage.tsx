import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { storyChapters, chapterOrder } from '@/data/story';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';

/* ── Phase definitions with map coordinates ── */
const PHASES = [
  {
    id: 'fase1', label: 'A Partida', subtitle: 'Cidade da Destruição',
    x: 18, y: 82, icon: '🏚️',
    description: 'O peregrino desperta e foge da cidade condenada',
    terrain: 'ruins',
  },
  {
    id: 'fase2', label: 'O Caminho', subtitle: 'Casa do Intérprete',
    x: 35, y: 62, icon: '🏛️',
    description: 'Visões, revelações e a armadura de Deus',
    terrain: 'forest',
  },
  {
    id: 'fase3', label: 'A Provação', subtitle: 'Vale da Sombra',
    x: 55, y: 75, icon: '🐉',
    description: 'Batalhas contra Apolião e as trevas do vale',
    terrain: 'valley',
  },
  {
    id: 'fase4', label: 'A Perseverança', subtitle: 'Feira da Vaidade',
    x: 72, y: 55, icon: '⚖️',
    description: 'Julgamentos, martírios e tentações do ouro',
    terrain: 'town',
  },
  {
    id: 'fase5', label: 'A Libertação', subtitle: 'Castelo da Dúvida',
    x: 50, y: 35, icon: '🔑',
    description: 'Prisão do Gigante Desespero e a chave da promessa',
    terrain: 'castle',
  },
  {
    id: 'fase6', label: 'A Glória', subtitle: 'Cidade Celestial',
    x: 78, y: 15, icon: '✨',
    description: 'O rio da morte e os portões eternos',
    terrain: 'celestial',
  },
];

/* Path between phases as SVG path data (percentage-based) */
const MAP_PATH = "M 18 82 C 22 72, 30 68, 35 62 S 45 70, 55 75 S 65 65, 72 55 S 62 45, 50 35 S 60 25, 78 15";

const JourneysPage = () => {
  const navigate = useNavigate();
  const { progress, goToChapter, startJourney } = useStoryProgress();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

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

  const isPhaseVisited = (phaseId: string) =>
    chapterOrder.some(id => id.startsWith(phaseId) && progress.visitedChapters.includes(id));
  
  const isPhaseComplete = (phaseId: string) => {
    const phaseChapters = chapterOrder.filter(id => id.startsWith(phaseId));
    return phaseChapters.length > 0 && phaseChapters.every(id => progress.visitedChapters.includes(id));
  };

  const selectedPhaseData = selectedPhase
    ? groupedChapters.find(p => p.id === selectedPhase)
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden select-none"
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, hsl(38 40% 24%) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 70%, hsl(30 30% 20%) 0%, transparent 40%),
          linear-gradient(180deg, hsl(35 35% 18%) 0%, hsl(30 28% 14%) 40%, hsl(25 22% 11%) 100%)
        `,
      }}
    >
      {/* Parchment texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
        opacity: 0.5,
      }} />

      {/* Aged vignette */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{
        boxShadow: 'inset 0 0 150px 60px hsl(20 30% 6% / 0.85), inset 0 0 60px 20px hsl(20 30% 6% / 0.5)',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-3 border-b-2"
        style={{
          background: 'linear-gradient(180deg, hsl(35 30% 16% / 0.97) 0%, hsl(30 25% 13% / 0.95) 100%)',
          borderColor: 'hsl(40 50% 35% / 0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-medieval-icon !p-2 active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg" style={{ color: 'hsl(40 60% 70%)' }}>
              Mapa do Peregrino
            </h1>
            <p className="text-xs" style={{ color: 'hsl(35 30% 50%)' }}>
              {totalVisited}/{total} locais • {Math.round((totalVisited / total) * 100)}% explorado
            </p>
          </div>
        </div>
      </header>

      {/* ═══ THE ILLUSTRATED MAP ═══ */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 2px hsl(0 0% 0% / 0.3))' }}
        >
          <defs>
            {/* Water pattern */}
            <pattern id="water" patternUnits="userSpaceOnUse" width="6" height="3">
              <path d="M0 1.5 Q1.5 0, 3 1.5 T6 1.5" fill="none" stroke="hsl(210 30% 35% / 0.3)" strokeWidth="0.3"/>
            </pattern>
            {/* Mountain hatching */}
            <pattern id="mountainHatch" patternUnits="userSpaceOnUse" width="2" height="2" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="2" stroke="hsl(30 20% 30% / 0.15)" strokeWidth="0.3"/>
            </pattern>
            {/* Forest dots */}
            <pattern id="forestDots" patternUnits="userSpaceOnUse" width="4" height="4">
              <circle cx="2" cy="2" r="0.6" fill="hsl(120 25% 25% / 0.2)"/>
            </pattern>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* ── Background terrain features ── */}
          
          {/* Ocean / water on edges */}
          <rect x="0" y="88" width="100" height="12" fill="hsl(210 25% 20% / 0.3)"/>
          <rect x="0" y="88" width="100" height="12" fill="url(#water)"/>
          <path d="M0 88 Q10 86, 20 88 T40 87 T60 88 T80 87 T100 88 V88" fill="none" stroke="hsl(210 30% 40% / 0.25)" strokeWidth="0.4"/>

          {/* Mountain range across top */}
          <g opacity="0.35">
            <path d="M60 8 L65 2 L70 8 Z" fill="hsl(30 15% 28%)" stroke="hsl(30 20% 22%)" strokeWidth="0.3"/>
            <path d="M66 8 L72 0 L78 8 Z" fill="hsl(30 15% 25%)" stroke="hsl(30 20% 22%)" strokeWidth="0.3"/>
            <path d="M74 8 L79 3 L84 8 Z" fill="hsl(30 15% 30%)" stroke="hsl(30 20% 22%)" strokeWidth="0.3"/>
            <path d="M82 10 L87 4 L92 10 Z" fill="hsl(30 15% 26%)" stroke="hsl(30 20% 22%)" strokeWidth="0.3"/>
            <path d="M55 12 L60 5 L65 12 Z" fill="hsl(30 15% 27%)" stroke="hsl(30 20% 22%)" strokeWidth="0.3"/>
            {/* Snow caps */}
            <path d="M65 2 L63.5 4 L66.5 4 Z" fill="hsl(40 20% 75% / 0.3)"/>
            <path d="M72 0 L70 3 L74 3 Z" fill="hsl(40 20% 75% / 0.3)"/>
          </g>

          {/* Hills and terrain */}
          <g opacity="0.2">
            {/* Rolling hills */}
            <ellipse cx="10" cy="70" rx="12" ry="4" fill="hsl(100 15% 22%)"/>
            <ellipse cx="30" cy="50" rx="8" ry="3" fill="hsl(100 15% 20%)"/>
            <ellipse cx="85" cy="45" rx="10" ry="3.5" fill="hsl(100 15% 22%)"/>
            <ellipse cx="15" cy="40" rx="9" ry="3" fill="hsl(100 15% 20%)"/>
            {/* Forest areas */}
            <rect x="25" y="55" width="15" height="12" rx="3" fill="url(#forestDots)"/>
            <rect x="5" y="60" width="10" height="8" rx="2" fill="url(#forestDots)"/>
          </g>

          {/* Decorative trees (medieval style) */}
          <g opacity="0.3" fill="hsl(120 20% 28%)" stroke="hsl(30 20% 20%)" strokeWidth="0.2">
            <circle cx="28" cy="58" r="1.2"/><line x1="28" y1="59.2" x2="28" y2="61" stroke="hsl(30 30% 25%)" strokeWidth="0.4"/>
            <circle cx="31" cy="60" r="1"/><line x1="31" y1="61" x2="31" y2="62.5" stroke="hsl(30 30% 25%)" strokeWidth="0.3"/>
            <circle cx="8" cy="63" r="1.3"/><line x1="8" y1="64.3" x2="8" y2="66" stroke="hsl(30 30% 25%)" strokeWidth="0.4"/>
            <circle cx="12" cy="65" r="1"/><line x1="12" y1="66" x2="12" y2="67.5" stroke="hsl(30 30% 25%)" strokeWidth="0.3"/>
            <circle cx="42" cy="45" r="1.1"/><line x1="42" y1="46.1" x2="42" y2="48" stroke="hsl(30 30% 25%)" strokeWidth="0.3"/>
            <circle cx="88" cy="40" r="1.2"/><line x1="88" y1="41.2" x2="88" y2="43" stroke="hsl(30 30% 25%)" strokeWidth="0.4"/>
          </g>

          {/* River flowing through the map */}
          <path
            d="M95 90 Q85 80, 80 70 Q75 60, 65 55 Q55 50, 45 42 Q35 35, 30 25 Q25 18, 22 10"
            fill="none"
            stroke="hsl(210 30% 40% / 0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M95 90 Q85 80, 80 70 Q75 60, 65 55 Q55 50, 45 42 Q35 35, 30 25 Q25 18, 22 10"
            fill="none"
            stroke="hsl(210 30% 50% / 0.12)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* ── THE PILGRIM'S PATH ── */}
          {/* Path shadow */}
          <path
            d={MAP_PATH}
            fill="none"
            stroke="hsl(30 30% 15% / 0.4)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="3 2"
            transform="translate(0.3, 0.3)"
          />
          {/* Main path - dotted trail */}
          <path
            d={MAP_PATH}
            fill="none"
            stroke="hsl(40 50% 45% / 0.6)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2.5 1.8"
          />

          {/* ── Compass Rose ── */}
          <g transform="translate(12, 18)" opacity="0.3">
            <circle cx="0" cy="0" r="6" fill="none" stroke="hsl(40 50% 50%)" strokeWidth="0.3"/>
            <circle cx="0" cy="0" r="4.5" fill="none" stroke="hsl(40 50% 50%)" strokeWidth="0.2"/>
            {/* Cardinal points */}
            <polygon points="0,-5.5 -0.8,-2 0.8,-2" fill="hsl(40 60% 55%)"/>
            <polygon points="0,5.5 -0.8,2 0.8,2" fill="hsl(40 40% 35%)"/>
            <polygon points="-5.5,0 -2,-0.8 -2,0.8" fill="hsl(40 40% 35%)"/>
            <polygon points="5.5,0 2,-0.8 2,0.8" fill="hsl(40 40% 35%)"/>
            {/* Intermediate */}
            <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="hsl(40 50% 50%)" strokeWidth="0.15"/>
            <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="hsl(40 50% 50%)" strokeWidth="0.15"/>
            <text x="0" y="-7" textAnchor="middle" fill="hsl(40 60% 60%)" fontSize="2.5" fontFamily="serif" fontWeight="bold">N</text>
            <text x="7.5" y="0.8" textAnchor="middle" fill="hsl(40 50% 50%)" fontSize="2" fontFamily="serif">L</text>
            <text x="0" y="8.5" textAnchor="middle" fill="hsl(40 50% 50%)" fontSize="2" fontFamily="serif">S</text>
            <text x="-7.5" y="0.8" textAnchor="middle" fill="hsl(40 50% 50%)" fontSize="2" fontFamily="serif">O</text>
          </g>

          {/* ── Sea monster in the water ── */}
          <g transform="translate(82, 93)" opacity="0.2">
            <path d="M0 0 Q2 -3, 4 -1 Q6 1, 8 -2 Q10 -4, 12 -1" fill="none" stroke="hsl(210 30% 40%)" strokeWidth="0.5" strokeLinecap="round"/>
            <circle cx="0" cy="-0.5" r="0.8" fill="hsl(210 30% 35%)"/>
            <circle cx="0.3" cy="-0.8" r="0.2" fill="hsl(40 50% 60%)"/>
          </g>

          {/* ── Decorative scroll border elements ── */}
          <g opacity="0.15" stroke="hsl(40 50% 50%)" fill="none" strokeWidth="0.3">
            <path d="M2 2 Q2 5, 5 5 Q2 5, 2 8"/>
            <path d="M98 2 Q98 5, 95 5 Q98 5, 98 8"/>
            <path d="M2 98 Q2 95, 5 95 Q2 95, 2 92"/>
            <path d="M98 98 Q98 95, 95 95 Q98 95, 98 92"/>
          </g>

          {/* ── Map title cartouche ── */}
          <g transform="translate(50, 96)">
            <rect x="-22" y="-3" width="44" height="6" rx="1" fill="hsl(30 25% 14% / 0.8)" stroke="hsl(40 50% 40% / 0.3)" strokeWidth="0.3"/>
            <text x="0" y="1.2" textAnchor="middle" fill="hsl(40 55% 60%)" fontSize="2.8" fontFamily="serif" fontStyle="italic">
              O Progresso do Peregrino
            </text>
          </g>

          {/* ── LOCATION MARKERS ── */}
          {PHASES.map((phase, idx) => {
            const visited = isPhaseVisited(phase.id);
            const complete = isPhaseComplete(phase.id);
            const isCurrent = chapterOrder.some(
              id => id.startsWith(phase.id) && progress.currentChapterId === id
            );
            const isSelected = selectedPhase === phase.id;

            return (
              <g key={phase.id} className="cursor-pointer" onClick={() => setSelectedPhase(isSelected ? null : phase.id)}>
                {/* Terrain illustration behind marker */}
                {phase.terrain === 'ruins' && (
                  <g transform={`translate(${phase.x}, ${phase.y})`} opacity="0.3">
                    <rect x="-4" y="-2" width="3" height="4" fill="hsl(30 20% 25%)" stroke="hsl(30 15% 20%)" strokeWidth="0.2"/>
                    <rect x="1" y="-1" width="2.5" height="3" fill="hsl(30 20% 22%)" stroke="hsl(30 15% 20%)" strokeWidth="0.2"/>
                    <line x1="-4" y1="-2" x2="-2.5" y2="-4" stroke="hsl(30 20% 25%)" strokeWidth="0.3"/>
                  </g>
                )}
                {phase.terrain === 'forest' && (
                  <g transform={`translate(${phase.x}, ${phase.y})`} opacity="0.3">
                    <polygon points="-4,1 -3,-2 -2,1" fill="hsl(120 20% 25%)"/>
                    <polygon points="-2.5,1 -1.5,-3 -0.5,1" fill="hsl(120 20% 22%)"/>
                    <polygon points="2,1 3,-2 4,1" fill="hsl(120 20% 25%)"/>
                  </g>
                )}
                {phase.terrain === 'valley' && (
                  <g transform={`translate(${phase.x}, ${phase.y})`} opacity="0.25">
                    <path d="M-6,0 L-3,-4 L0,0 L3,-3 L6,0" fill="none" stroke="hsl(30 20% 30%)" strokeWidth="0.4"/>
                    <path d="M-5,1 Q0,3 5,1" fill="hsl(30 15% 18% / 0.4)" stroke="none"/>
                  </g>
                )}
                {phase.terrain === 'town' && (
                  <g transform={`translate(${phase.x}, ${phase.y})`} opacity="0.3">
                    <rect x="-3" y="-2" width="2" height="3" fill="hsl(30 25% 28%)"/>
                    <polygon points="-3,-2 -2,-3.5 -1,-2" fill="hsl(0 30% 35%)"/>
                    <rect x="1" y="-1" width="2.5" height="2.5" fill="hsl(30 25% 25%)"/>
                    <polygon points="1,-1 2.25,-2.5 3.5,-1" fill="hsl(0 30% 30%)"/>
                  </g>
                )}
                {phase.terrain === 'castle' && (
                  <g transform={`translate(${phase.x}, ${phase.y})`} opacity="0.3">
                    <rect x="-3" y="-3" width="6" height="5" fill="hsl(30 15% 25%)" stroke="hsl(30 20% 20%)" strokeWidth="0.3"/>
                    <rect x="-3.5" y="-4" width="1.5" height="1.5" fill="hsl(30 15% 28%)"/>
                    <rect x="2" y="-4" width="1.5" height="1.5" fill="hsl(30 15% 28%)"/>
                    <rect x="-0.5" y="-1" width="1" height="2" fill="hsl(30 10% 15%)"/>
                  </g>
                )}
                {phase.terrain === 'celestial' && (
                  <g transform={`translate(${phase.x}, ${phase.y})`} opacity="0.35" filter="url(#softGlow)">
                    <polygon points="0,-5 1.5,-1.5 5.5,-1.5 2.5,1 3.5,5 0,2.5 -3.5,5 -2.5,1 -5.5,-1.5 -1.5,-1.5" fill="hsl(40 60% 50% / 0.3)" stroke="hsl(40 60% 55% / 0.4)" strokeWidth="0.2"/>
                  </g>
                )}

                {/* Glow ring for current location */}
                {isCurrent && (
                  <circle cx={phase.x} cy={phase.y} r="4.5" fill="none" stroke="hsl(40 60% 55% / 0.3)" strokeWidth="0.5" filter="url(#glow)">
                    <animate attributeName="r" values="4;5;4" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
                  </circle>
                )}

                {/* Main marker circle */}
                <circle
                  cx={phase.x} cy={phase.y}
                  r={isSelected ? 3.5 : 2.8}
                  fill={
                    complete ? 'hsl(40 55% 40%)' :
                    isCurrent ? 'hsl(40 60% 50%)' :
                    visited ? 'hsl(35 35% 30%)' :
                    'hsl(30 15% 18%)'
                  }
                  stroke={
                    isCurrent ? 'hsl(40 70% 60%)' :
                    complete ? 'hsl(40 60% 55%)' :
                    visited ? 'hsl(40 40% 40%)' :
                    'hsl(30 15% 25%)'
                  }
                  strokeWidth={isCurrent ? 0.6 : 0.4}
                  filter={isCurrent || complete ? 'url(#glow)' : undefined}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Icon inside marker */}
                <text
                  x={phase.x} y={phase.y + 1.2}
                  textAnchor="middle"
                  fontSize={isSelected ? 3.5 : 2.8}
                  style={{ pointerEvents: 'none' }}
                >
                  {visited ? phase.icon : '?'}
                </text>

                {/* Label */}
                <g style={{ pointerEvents: 'none' }}>
                  <text
                    x={phase.x}
                    y={phase.y - (isSelected ? 5.5 : 4.5)}
                    textAnchor="middle"
                    fill={visited ? 'hsl(40 55% 65%)' : 'hsl(30 15% 40%)'}
                    fontSize={isSelected ? 2.8 : 2.2}
                    fontFamily="serif"
                    fontWeight="bold"
                    style={{ textShadow: '0 0 3px hsl(0 0% 0% / 0.8)' }}
                  >
                    {visited ? phase.label : '???'}
                  </text>
                  {visited && (
                    <text
                      x={phase.x}
                      y={phase.y - (isSelected ? 3 : 2.5)}
                      textAnchor="middle"
                      fill="hsl(35 30% 50%)"
                      fontSize="1.6"
                      fontFamily="serif"
                      fontStyle="italic"
                    >
                      {phase.subtitle}
                    </text>
                  )}
                </g>

                {/* Pilgrim figure at current location */}
                {isCurrent && (
                  <g transform={`translate(${phase.x + 4}, ${phase.y - 1})`}>
                    <text fontSize="3.5" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                      🚶
                      <animate attributeName="y" values="0;-0.5;0" dur="2s" repeatCount="indefinite"/>
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Phase number badges along the path */}
          {PHASES.map((phase, idx) => {
            const visited = isPhaseVisited(phase.id);
            const midX = idx === 0 ? phase.x + 5 : (phase.x + PHASES[idx - 1].x) / 2;
            const midY = idx === 0 ? phase.y - 5 : (phase.y + PHASES[idx - 1].y) / 2;
            return (
              <g key={`badge-${phase.id}`} opacity={visited ? 0.6 : 0.2}>
                <circle cx={midX} cy={midY} r="2" fill="hsl(30 20% 14%)" stroke="hsl(40 40% 40% / 0.4)" strokeWidth="0.25"/>
                <text x={midX} y={midY + 0.8} textAnchor="middle" fill="hsl(40 50% 55%)" fontSize="1.8" fontFamily="serif">{idx + 1}</text>
              </g>
            );
          })}
        </svg>

        {/* ── Selected phase detail panel ── */}
        {selectedPhaseData && (
          <div
            className="absolute bottom-0 left-0 right-0 z-20 max-h-[50vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, hsl(30 25% 12% / 0.95) 0%, hsl(25 20% 10% / 0.98) 100%)',
              borderTop: '2px solid hsl(40 50% 35% / 0.4)',
              backdropFilter: 'blur(12px)',
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <div className="max-w-lg mx-auto p-4">
              {/* Close bar */}
              <div className="flex justify-center mb-3">
                <button
                  onClick={() => setSelectedPhase(null)}
                  className="w-12 h-1.5 rounded-full"
                  style={{ background: 'hsl(40 40% 40% / 0.4)' }}
                />
              </div>

              {/* Phase header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{selectedPhaseData.icon}</span>
                <div>
                  <h3 className="font-display text-lg" style={{ color: 'hsl(40 55% 70%)' }}>
                    {selectedPhaseData.label}
                  </h3>
                  <p className="text-sm italic" style={{ color: 'hsl(35 25% 50%)' }}>
                    {selectedPhaseData.subtitle}
                  </p>
                </div>
                {isPhaseComplete(selectedPhaseData.id) && (
                  <span className="ml-auto text-sm px-2 py-1 rounded-lg font-display"
                    style={{ background: 'hsl(40 50% 35% / 0.3)', color: 'hsl(40 60% 65%)', border: '1px solid hsl(40 50% 45% / 0.3)' }}>
                    ✓ Completo
                  </span>
                )}
              </div>

              <p className="text-sm mb-4" style={{ color: 'hsl(35 25% 55%)' }}>
                {isPhaseVisited(selectedPhaseData.id) ? selectedPhaseData.description : 'Terra ainda não explorada pelo peregrino...'}
              </p>

              {/* Chapter list */}
              <div className="space-y-2">
                {selectedPhaseData.chapters.map((item) => {
                  const unlocked = progress.visitedChapters.includes(item.id);
                  const isCurrent = progress.currentChapterId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleChapterClick(item.id)}
                      disabled={!unlocked}
                      className="w-full text-left transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          background: isCurrent
                            ? 'linear-gradient(135deg, hsl(40 50% 22% / 0.6), hsl(40 40% 18% / 0.4))'
                            : unlocked
                            ? 'hsl(30 20% 14% / 0.6)'
                            : 'hsl(30 15% 12% / 0.3)',
                          border: isCurrent
                            ? '2px solid hsl(40 60% 50% / 0.5)'
                            : unlocked
                            ? '1px solid hsl(30 20% 25% / 0.4)'
                            : '1px solid hsl(30 15% 20% / 0.2)',
                        }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                          style={{
                            background: isCurrent ? 'hsl(40 60% 45%)' : unlocked ? 'hsl(30 25% 18%)' : 'hsl(30 15% 14%)',
                            border: `1.5px solid ${isCurrent ? 'hsl(40 70% 55%)' : unlocked ? 'hsl(40 40% 35% / 0.4)' : 'hsl(30 15% 22%)'}`,
                            color: isCurrent ? 'hsl(30 20% 10%)' : 'hsl(40 50% 55%)',
                          }}
                        >
                          {isCurrent ? '📍' : unlocked ? '✓' : '🔒'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm leading-snug"
                            style={{ color: isCurrent ? 'hsl(40 60% 70%)' : unlocked ? 'hsl(38 40% 65%)' : 'hsl(30 15% 35%)' }}>
                            {unlocked ? item.chapter!.title : '— terra desconhecida —'}
                          </p>
                          {unlocked && item.chapter?.location && (
                            <p className="text-xs mt-0.5" style={{ color: 'hsl(35 20% 45%)' }}>
                              {item.chapter.location}
                            </p>
                          )}
                        </div>

                        {isCurrent && (
                          <span className="text-xs font-display px-2 py-0.5 rounded"
                            style={{ background: 'hsl(40 60% 50% / 0.2)', color: 'hsl(40 60% 65%)', border: '1px solid hsl(40 60% 50% / 0.3)' }}>
                            AQUI
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-3 text-xs" style={{ color: 'hsl(35 25% 50%)' }}>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(40 60% 50%)', boxShadow: '0 0 4px hsl(40 60% 50% / 0.5)' }}/>
            <span>Atual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(40 55% 40%)' }}/>
            <span>Visitado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(30 15% 18%)', border: '1px solid hsl(30 15% 25%)' }}/>
            <span>Oculto</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneysPage;
