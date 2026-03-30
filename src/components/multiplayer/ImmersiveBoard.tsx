import { useMemo, useRef, useEffect } from 'react';
import {
  IMMERSIVE_BOARD_SIZE, TILES_PER_PHASE, PHASES, TILE_TYPES,
  TileType, getTrailPositions, PhaseConfig,
} from './ImmersiveBoardTypes';
import { MedievalTileIcon } from './MedievalTileIcons';
import { characterImages } from '@/data/characterImages';
import ContinuousTrail from './ContinuousTrail';

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
      style={{ minHeight: '500svh' }}
    >
      {/* Background - BRIGHT and vivid */}
      <div className="absolute inset-0">
        <img
          src={phase.bgImage}
          alt={phase.name}
          className="w-full h-full object-cover"
          loading={phaseIdx === 0 ? 'eager' : 'lazy'}
          style={{ filter: 'brightness(0.85) saturate(1.7) contrast(1.1)' }}
        />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, hsla(${phase.accentHue} 25% 8% / 0.3) 0%, hsla(${phase.accentHue} 15% 5% / 0.15) 50%, hsla(${phase.accentHue} 25% 8% / 0.35) 100%)`,
        }} />
      </div>

      {/* Phase title */}
      <div className="absolute top-3 left-3 z-10">
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, hsla(${phase.accentHue} 50% 25% / 0.9), hsla(${phase.accentHue} 40% 15% / 0.95))`,
            border: `1.5px solid hsla(${phase.accentHue} 60% 55% / 0.5)`,
            boxShadow: `0 0 20px hsla(${phase.accentHue} 60% 50% / 0.2)`,
          }}
        >
          <span className="text-sm">{phase.icon}</span>
          <div>
            <h3 className="text-[11px] font-display font-bold leading-tight" style={{ color: `hsl(${phase.accentHue} 60% 80%)` }}>{phase.name}</h3>
            <p className="text-[7px] uppercase tracking-wider" style={{ color: `hsl(${phase.accentHue} 40% 65%)` }}>{phase.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Character portrait */}
      {charImg && (
        <div className="absolute right-0 top-[15%] w-44 h-56 opacity-40 pointer-events-none z-0"
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

      {/* Continuous trail path */}
      <ContinuousTrail
        trailPositions={trailPositions}
        phaseIdx={phaseIdx}
        accentHue={phase.accentHue}
      />

      {/* Tiles */}
      <div className="relative w-full z-[2]" style={{ minHeight: '500svh' }}>
        {trailPositions.map((pos, localIdx) => {
          const globalIdx = startIdx + localIdx;
          if (globalIdx >= IMMERSIVE_BOARD_SIZE) return null;

          const tileType = tileTypes[globalIdx] || 'normal';
          const config = TILE_TYPES[tileType];
          const playersHere = players.filter(p => p.position === globalIdx && !p.finished);
          const isCurrentPlayerHere = playersHere.some(p => p.id === currentTurnId);

          const tileCharKey = config.characterKey;
          const tileCharImg = tileCharKey ? characterImages[tileCharKey] : null;
          const tileEnvImg = config.tileImage || null;
          const tileImg = tileCharImg || tileEnvImg;
          const isSpecial = tileType !== 'normal';
          const isBoss = tileType === 'giant' || tileType === 'challenge';
          const tileSize = isBoss ? 88 : isSpecial ? 78 : 66;

          return (
            <div
              key={globalIdx}
              className="absolute z-[3] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onTileClick?.(globalIdx, tileType)}
            >
              {/* Tile body - enhanced 3D depth */}
              <div
                className={`relative flex items-center justify-center overflow-hidden
                  ${playersHere.length > 0 ? 'scale-125 ring-2 ring-white/50' : ''}
                  ${isCurrentPlayerHere ? 'animate-pulse' : ''}
                  transition-all duration-300 hover:scale-110
                `}
                style={{
                  width: tileSize,
                  height: tileSize,
                  borderRadius: isBoss ? 18 : isSpecial ? 16 : 12,
                  background: tileImg ? 'none' : `radial-gradient(circle at 30% 25%, ${config.color}, hsl(0 0% 12%))`,
                  boxShadow: `
                    0 0 ${playersHere.length > 0 ? '35' : '18'}px ${config.glowColor},
                    inset 0 2px 3px rgba(255,255,255,0.2),
                    inset 0 -2px 4px rgba(0,0,0,0.4),
                    0 6px 20px rgba(0,0,0,0.7),
                    0 2px 6px rgba(0,0,0,0.5)
                  `,
                  border: `2.5px solid ${config.color}`,
                }}
              >
                {/* Image filling the tile - now includes normal tiles */}
                {tileImg && (
                  <img
                    src={tileImg}
                    alt={config.label}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: isBoss ? 'saturate(1.4) contrast(1.2)' : isSpecial ? 'saturate(1.2)' : 'brightness(0.7) saturate(0.8)' }}
                    loading="lazy"
                  />
                )}

                {/* Tile emoji icon overlay for normal tiles */}
                {!isSpecial && (
                  <span className="relative z-10 text-lg opacity-60">{config.emoji}</span>
                )}
              </div>

              {/* Medieval icon */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10"
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  borderRadius: '50%',
                  padding: isBoss ? 5 : 4,
                  border: `2px solid ${config.color}`,
                  boxShadow: `0 0 10px ${config.glowColor}`,
                }}
              >
                <MedievalTileIcon
                  tileType={tileType}
                  size={isBoss ? 18 : isSpecial ? 16 : 14}
                  color={config.color}
                  glowColor={config.glowColor}
                />
              </div>

              {/* Boss indicator */}
              {isBoss && (
                <div className="absolute -top-2 -right-2 text-xs z-10 animate-bounce">
                  {tileType === 'giant' ? '💀' : '⚔️'}
                </div>
              )}

              {/* Type label */}
              {isSpecial && (
                <div className="absolute top-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${tileSize + 6}px` }}
                >
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full"
                      style={{
                        width: 0, height: 0,
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderRight: `4px solid ${config.color}60`,
                      }}
                    />
                    <span className="text-[7px] font-display font-bold whitespace-nowrap px-1.5 py-0.5 rounded"
                      style={{ background: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Player tokens */}
              {playersHere.length > 0 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-0.5 z-20">
                  {playersHere.map(p => (
                    <div
                      key={p.id}
                      className="w-6 h-6 rounded-full border-2 border-white/60 shadow-lg"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 12px ${p.color}90`,
                        animation: p.id === currentTurnId ? 'bounce 1s infinite' : undefined,
                      }}
                      title={p.name}
                    />
                  ))}
                </div>
              )}

              {playersHere.some(p => p.isStunned) && (
                <div className="absolute -top-7 right-0 text-base animate-bounce z-20">😵</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase transition divider */}
      {phaseIdx < PHASES.length - 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-[5]">
          {/* Gradient fade */}
          <div className="h-28" style={{
            background: `linear-gradient(to bottom, transparent, hsla(${PHASES[phaseIdx + 1].accentHue} 25% 8% / 0.9))`,
          }} />
          {/* Decorative medieval divider line */}
          <div className="relative h-8 flex items-center justify-center"
            style={{ background: `hsla(${PHASES[phaseIdx + 1].accentHue} 25% 8% / 0.9)` }}
          >
            <div className="absolute inset-x-8 h-[2px]" style={{
              background: `linear-gradient(to right, transparent, hsla(${phase.accentHue} 50% 50% / 0.6), hsla(${PHASES[phaseIdx + 1].accentHue} 50% 50% / 0.6), transparent)`,
            }} />
            <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsla(${phase.accentHue} 40% 20% / 0.95), hsla(${PHASES[phaseIdx + 1].accentHue} 40% 20% / 0.95))`,
                border: `2px solid hsla(${phase.accentHue} 50% 50% / 0.5)`,
                boxShadow: `0 0 12px hsla(${phase.accentHue} 50% 50% / 0.3)`,
              }}
            >
              <span className="text-xs">{PHASES[phaseIdx + 1].icon}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
