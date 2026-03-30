import { useMemo, useRef, useEffect } from 'react';
import {
  IMMERSIVE_BOARD_SIZE, TILES_PER_PHASE, PHASES, TILE_TYPES,
  TileType, getTrailPositions, PhaseConfig,
} from './ImmersiveBoardTypes';
import { MedievalTileIcon } from './MedievalTileIcons';
import { characterImages } from '@/data/characterImages';

interface Player {
  id: string;
  name: string;
  color: string;
  position: number;
  finished: boolean;
  isStunned: boolean;
}

interface ImmersiveBoardProps {
  tileTypes: TileType[];
  players: Player[];
  currentTurnId?: string;
  onTileClick?: (position: number, tileType: TileType) => void;
}

export default function ImmersiveBoard({ tileTypes, players, currentTurnId, onTileClick }: ImmersiveBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const trailPositions = useMemo(() => getTrailPositions(), []);

  const currentPlayer = players.find(p => p.id === currentTurnId);
  useEffect(() => {
    if (!currentPlayer || !boardRef.current) return;
    const phaseIdx = Math.floor(currentPlayer.position / TILES_PER_PHASE);
    const phaseEl = boardRef.current.querySelector(`[data-phase="${phaseIdx}"]`);
    if (phaseEl) {
      phaseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPlayer?.position]);

  return (
    <div ref={boardRef} className="w-full">
      {PHASES.map((phase, phaseIdx) => (
        <PhaseSection
          key={phaseIdx}
          phase={phase}
          phaseIdx={phaseIdx}
          tileTypes={tileTypes}
          trailPositions={trailPositions}
          players={players}
          currentTurnId={currentTurnId}
          onTileClick={onTileClick}
        />
      ))}
    </div>
  );
}

function PhaseSection({
  phase, phaseIdx, tileTypes, trailPositions, players, currentTurnId, onTileClick,
}: {
  phase: PhaseConfig;
  phaseIdx: number;
  tileTypes: TileType[];
  trailPositions: { x: number; y: number }[];
  players: Player[];
  currentTurnId?: string;
  onTileClick?: (position: number, tileType: TileType) => void;
}) {
  const startIdx = phaseIdx * TILES_PER_PHASE;
  const charImg = phase.characterKey ? characterImages[phase.characterKey] : null;

  return (
    <div
      data-phase={phaseIdx}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Background - BRIGHTER with vivid colors */}
      <div className="absolute inset-0">
        <img
          src={phase.bgImage}
          alt={phase.name}
          className="w-full h-full object-cover"
          loading={phaseIdx === 0 ? 'eager' : 'lazy'}
          style={{ filter: 'brightness(0.75) saturate(1.6) contrast(1.1)' }}
        />
        {/* Lighter overlay - tinted with phase color */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, hsla(${phase.accentHue} 30% 8% / 0.4) 0%, hsla(${phase.accentHue} 20% 5% / 0.25) 50%, hsla(${phase.accentHue} 30% 8% / 0.5) 100%)`,
        }} />
      </div>

      {/* Phase title - larger and more visible */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pt-4 pb-2">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, hsla(${phase.accentHue} 50% 25% / 0.85), hsla(${phase.accentHue} 40% 15% / 0.9))`,
            border: `2px solid hsla(${phase.accentHue} 60% 55% / 0.5)`,
            boxShadow: `0 0 40px hsla(${phase.accentHue} 60% 50% / 0.3), inset 0 1px 0 hsla(${phase.accentHue} 60% 80% / 0.15)`,
          }}
        >
          <span className="text-2xl">{phase.icon}</span>
          <div>
            <h3 className="text-base font-display font-bold" style={{ color: `hsl(${phase.accentHue} 60% 80%)` }}>{phase.name}</h3>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: `hsl(${phase.accentHue} 40% 65%)` }}>{phase.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Character portrait - more visible */}
      {charImg && (
        <div className="absolute right-0 top-1/4 w-40 h-52 opacity-35 pointer-events-none z-0"
          style={{
            maskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
          }}
        >
          <img src={charImg} alt={phase.characterName || ''} className="w-full h-full object-cover rounded-l-2xl" loading="lazy"
            style={{ filter: 'saturate(1.3) contrast(1.1)' }}
          />
        </div>
      )}

      {/* Trail path SVG */}
      <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none" preserveAspectRatio="none">
        {trailPositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = trailPositions[i - 1];
          return (
            <line
              key={i}
              x1={`${prev.x}%`} y1={`${prev.y}%`}
              x2={`${pos.x}%`} y2={`${pos.y}%`}
              stroke={`hsla(${phase.accentHue} 50% 60% / 0.4)`}
              strokeWidth="4"
              strokeDasharray="10 5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Tiles - BIGGER */}
      <div className="relative w-full z-[2]" style={{ minHeight: '100svh' }}>
        {trailPositions.map((pos, localIdx) => {
          const globalIdx = startIdx + localIdx;
          if (globalIdx >= IMMERSIVE_BOARD_SIZE) return null;

          const tileType = tileTypes[globalIdx] || 'normal';
          const config = TILE_TYPES[tileType];
          const playersHere = players.filter(p => p.position === globalIdx && !p.finished);
          const isCurrentPlayerHere = playersHere.some(p => p.id === currentTurnId);

          return (
            <div
              key={globalIdx}
              className="absolute z-[3] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onTileClick?.(globalIdx, tileType)}
            >
              {/* Tile body - BIGGER: 56px → 64px for specials, 52px for normal */}
              <div
                className={`relative flex items-center justify-center
                  ${playersHere.length > 0 ? 'scale-125 ring-2 ring-white/40' : ''}
                  ${isCurrentPlayerHere ? 'animate-pulse' : ''}
                  transition-all duration-300 hover:scale-115
                `}
                style={{
                  width: tileType === 'normal' ? 52 : 64,
                  height: tileType === 'normal' ? 52 : 64,
                  borderRadius: tileType === 'checkpoint' || tileType === 'start' || tileType === 'finish' ? 16 : 14,
                  background: `radial-gradient(circle at 30% 25%, ${config.color}, hsl(0 0% 12%))`,
                  boxShadow: `0 0 ${playersHere.length > 0 ? '30' : '16'}px ${config.glowColor},
                    inset 0 2px 3px rgba(255,255,255,0.2),
                    inset 0 -3px 6px rgba(0,0,0,0.5),
                    0 4px 12px rgba(0,0,0,0.4)`,
                  border: `2.5px solid ${config.color}`,
                }}
              >
                {/* Tile number badge */}
                <span className="absolute -top-1.5 -left-1.5 text-[8px] font-mono font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.85)', color: config.color, border: `1.5px solid ${config.color}50` }}
                >
                  {globalIdx + 1}
                </span>

                {/* Medieval icon */}
                <MedievalTileIcon
                  tileType={tileType}
                  size={tileType === 'normal' ? 24 : 30}
                  color={config.color}
                  glowColor={config.glowColor}
                />

                {/* Type label - bigger */}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-display font-bold whitespace-nowrap px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.85)', color: config.color, border: `1px solid ${config.color}40`, textShadow: `0 0 8px ${config.glowColor}` }}
                >
                  {config.label}
                </span>
              </div>

              {/* Player tokens */}
              {playersHere.length > 0 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {playersHere.map(p => (
                    <div
                      key={p.id}
                      className="w-6 h-6 rounded-full border-2 border-white/60 shadow-lg"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 12px ${p.color}90, inset 0 -2px 4px rgba(0,0,0,0.3)`,
                        animation: p.id === currentTurnId ? 'bounce 1s infinite' : undefined,
                      }}
                      title={p.name}
                    />
                  ))}
                </div>
              )}

              {playersHere.some(p => p.isStunned) && (
                <div className="absolute -top-6 right-0 text-base animate-bounce">😵</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase transition */}
      {phaseIdx < PHASES.length - 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-20 z-[5]"
          style={{
            background: `linear-gradient(to bottom, transparent, hsla(${PHASES[phaseIdx + 1].accentHue} 25% 8% / 0.85))`,
          }}
        />
      )}
    </div>
  );
}
