import { useMemo, useRef, useEffect } from 'react';
import {
  IMMERSIVE_BOARD_SIZE, TILES_PER_PHASE, PHASES, TILE_TYPES,
  TileType, getTrailPositions, PhaseConfig,
} from './ImmersiveBoardTypes';
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

  // Auto-scroll to current player position
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

// ─── Phase Section ───
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
      {/* Background image with parallax */}
      <div className="absolute inset-0">
        <img
          src={phase.bgImage}
          alt={phase.name}
          className="w-full h-full object-cover"
          loading={phaseIdx === 0 ? 'eager' : 'lazy'}
          style={{ filter: 'brightness(0.4) saturate(1.2)' }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      </div>

      {/* Phase title */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pt-4 pb-2">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, hsla(${phase.accentHue} 40% 20% / 0.8), hsla(${phase.accentHue} 30% 10% / 0.9))`,
            border: `1px solid hsla(${phase.accentHue} 50% 50% / 0.4)`,
            boxShadow: `0 0 30px hsla(${phase.accentHue} 50% 40% / 0.2)`,
          }}
        >
          <span className="text-xl">{phase.icon}</span>
          <div>
            <h3 className="text-sm font-display text-foreground">{phase.name}</h3>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{phase.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Character portrait (faded, atmospheric) */}
      {charImg && (
        <div className="absolute right-0 top-1/4 w-32 h-44 opacity-20 pointer-events-none z-0"
          style={{
            maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
          }}
        >
          <img src={charImg} alt={phase.characterName || ''} className="w-full h-full object-cover rounded-l-2xl" loading="lazy" />
        </div>
      )}

      {/* Trail path SVG connecting tiles */}
      <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none" preserveAspectRatio="none">
        {trailPositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = trailPositions[i - 1];
          return (
            <line
              key={i}
              x1={`${prev.x}%`} y1={`${prev.y}%`}
              x2={`${pos.x}%`} y2={`${pos.y}%`}
              stroke={`hsla(${phase.accentHue} 40% 50% / 0.3)`}
              strokeWidth="3"
              strokeDasharray="8 4"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Tiles */}
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
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onClick={() => onTileClick?.(globalIdx, tileType)}
            >
              {/* Tile body */}
              <div
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center
                  ${playersHere.length > 0 ? 'scale-125 ring-2 ring-white/30' : ''}
                  ${isCurrentPlayerHere ? 'animate-pulse' : ''}
                  transition-all duration-300 hover:scale-110
                `}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${config.color}, hsl(0 0% 8%))`,
                  boxShadow: `0 0 ${playersHere.length > 0 ? '25' : '12'}px ${config.glowColor},
                    inset 0 1px 2px rgba(255,255,255,0.15),
                    inset 0 -2px 4px rgba(0,0,0,0.4)`,
                  border: `2px solid ${config.color}`,
                }}
              >
                {/* Tile number */}
                <span className="absolute -top-1 -left-1 text-[7px] font-mono rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.7)', color: config.color, border: `1px solid ${config.color}40` }}
                >
                  {globalIdx + 1}
                </span>

                {/* Tile emoji/icon */}
                <span className="text-xl drop-shadow-lg" style={{ filter: `drop-shadow(0 0 4px ${config.glowColor})` }}>
                  {config.emoji}
                </span>

                {/* Type label */}
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.8)', color: config.color, border: `1px solid ${config.color}30` }}
                >
                  {config.label}
                </span>
              </div>

              {/* Player tokens */}
              {playersHere.length > 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {playersHere.map(p => (
                    <div
                      key={p.id}
                      className="w-5 h-5 rounded-full border-2 border-white/50 shadow-lg"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 10px ${p.color}80, inset 0 -2px 3px rgba(0,0,0,0.3)`,
                        animation: p.id === currentTurnId ? 'bounce 1s infinite' : undefined,
                      }}
                      title={p.name}
                    />
                  ))}
                </div>
              )}

              {/* Stun indicator */}
              {playersHere.some(p => p.isStunned) && (
                <div className="absolute -top-5 right-0 text-sm animate-bounce">😵</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase transition divider */}
      {phaseIdx < PHASES.length - 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 z-[5]"
          style={{
            background: `linear-gradient(to bottom, transparent, hsla(${PHASES[phaseIdx + 1].accentHue} 20% 5% / 0.9))`,
          }}
        />
      )}
    </div>
  );
}
