import { useState, useMemo, useRef, useEffect } from 'react';
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

  // Phases that need FULL rendering (where any player is, ±1)
  const fullPhases = useMemo(() => {
    const set = new Set<number>();
    players.forEach(p => {
      if (p.finished) return;
      const ph = Math.floor(p.position / TILES_PER_PHASE);
      set.add(Math.max(0, ph - 1));
      set.add(ph);
      set.add(Math.min(PHASES.length - 1, ph + 1));
    });
    // Always include first and last if any player there
    set.add(0);
    return set;
  }, [players]);

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
          isFullRender={fullPhases.has(phaseIdx)}
        />
      ))}
    </div>
  );
}

function PhaseSection({
  phase, phaseIdx, tileTypes, trailPositions, players, currentTurnId, onTileClick, isFullRender,
}: {
  phase: PhaseConfig;
  phaseIdx: number;
  tileTypes: TileType[];
  trailPositions: { x: number; y: number }[];
  players: Player[];
  currentTurnId?: string;
  onTileClick?: (position: number, tileType: TileType) => void;
  isFullRender: boolean;
}) {
  const startIdx = phaseIdx * TILES_PER_PHASE;

  return (
    <div
      data-phase={phaseIdx}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '200svh' }}
    >
      {/* Background - always show (just 1 img per phase) */}
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

      {/* Phase title - always show */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pt-4 pb-2">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, hsla(${phase.accentHue} 50% 25% / 0.85), hsla(${phase.accentHue} 40% 15% / 0.9))`,
            border: `2px solid hsla(${phase.accentHue} 60% 55% / 0.5)`,
            boxShadow: `0 0 40px hsla(${phase.accentHue} 60% 50% / 0.3)`,
          }}
        >
          <span className="text-2xl">{phase.icon}</span>
          <div>
            <h3 className="text-base font-display font-bold" style={{ color: `hsl(${phase.accentHue} 60% 80%)` }}>{phase.name}</h3>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: `hsl(${phase.accentHue} 40% 65%)` }}>{phase.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Character portrait - only on full render phases */}
      {isFullRender && phase.characterKey && characterImages[phase.characterKey] && (
        <div className="absolute right-0 top-[15%] w-44 h-56 opacity-40 pointer-events-none z-0"
          style={{
            maskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
          }}
        >
          <img src={characterImages[phase.characterKey]} alt={phase.characterName || ''} className="w-full h-full object-cover rounded-l-2xl" loading="lazy"
            style={{ filter: 'saturate(1.3) contrast(1.1)' }}
          />
        </div>
      )}

      {/* Trail path SVG - always show */}
      <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none" preserveAspectRatio="none">
        {trailPositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = trailPositions[i - 1];
          return (
            <line key={i}
              x1={`${prev.x}%`} y1={`${prev.y}%`}
              x2={`${pos.x}%`} y2={`${pos.y}%`}
              stroke={`hsla(${phase.accentHue} 50% 60% / 0.4)`}
              strokeWidth="4" strokeDasharray="10 5" strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Tiles - always render but optimize detail level */}
      <div className="relative w-full z-[2]" style={{ minHeight: '200svh' }}>
        {trailPositions.map((pos, localIdx) => {
          const globalIdx = startIdx + localIdx;
          if (globalIdx >= IMMERSIVE_BOARD_SIZE) return null;

          const tileType = tileTypes[globalIdx] || 'normal';
          const config = TILE_TYPES[tileType];
          const playersHere = players.filter(p => p.position === globalIdx && !p.finished);
          const isCurrentPlayerHere = playersHere.some(p => p.id === currentTurnId);

          const isSpecial = tileType !== 'normal';
          const isBoss = tileType === 'giant' || tileType === 'challenge';
          const tileSize = isBoss ? 76 : isSpecial ? 68 : 56;

          // Character images on ALL special tiles (like before)
          const tileCharImg = isSpecial && config.characterKey ? characterImages[config.characterKey!] : null;

          const iconOnRight = localIdx % 2 === 0;

          return (
            <div
              key={globalIdx}
              className="absolute z-[3] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onTileClick?.(globalIdx, tileType)}
            >
              <div className="relative flex items-center gap-1">
                {/* Icon OUTSIDE tile - left */}
                {isSpecial && !iconOnRight && (
                  <TileIconBadge tileType={tileType} config={config} isBoss={isBoss} />
                )}

                {/* Tile body */}
                <div
                  className={`relative flex items-center justify-center overflow-hidden flex-shrink-0
                    ${playersHere.length > 0 ? 'scale-110 ring-2 ring-white/50' : ''}
                    ${isCurrentPlayerHere ? 'animate-pulse' : ''}
                  `}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    borderRadius: isBoss ? 18 : isSpecial ? 16 : 12,
                    // Use CSS background-image instead of <img> for better perf
                    backgroundImage: tileCharImg ? `url(${tileCharImg})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: !tileCharImg ? undefined : 'hsl(0 0% 12%)',
                    background: !tileCharImg ? `radial-gradient(circle at 30% 25%, ${config.color}, hsl(0 0% 12%))` : undefined,
                    boxShadow: `0 0 ${playersHere.length > 0 ? '30' : '14'}px ${config.glowColor},
                      0 4px 12px rgba(0,0,0,0.5)`,
                    border: `2.5px solid ${config.color}`,
                  }}
                >
                  {/* Dark gradient overlay for tiles with images */}
                  {tileCharImg && (
                    <div className="absolute inset-0 rounded-[inherit]" style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                    }} />
                  )}

                  {/* Number badge */}
                  <span className="absolute -top-1.5 -left-1.5 text-[8px] font-mono font-bold rounded-full w-5 h-5 flex items-center justify-center z-10"
                    style={{ background: 'rgba(0,0,0,0.9)', color: config.color, border: `1.5px solid ${config.color}50` }}
                  >
                    {globalIdx + 1}
                  </span>

                  {/* Center emoji/icon */}
                  {!isSpecial && <span className="text-lg opacity-50">·</span>}
                  {isBoss && <span className="relative z-10 text-2xl drop-shadow-lg">{tileType === 'giant' ? '💀' : '⚔️'}</span>}
                  {isSpecial && !isBoss && (
                    <span className="relative z-10 text-xl drop-shadow-lg">{config.emoji}</span>
                  )}
                </div>

                {/* Icon OUTSIDE tile - right */}
                {isSpecial && iconOnRight && (
                  <TileIconBadge tileType={tileType} config={config} isBoss={isBoss} />
                )}
              </div>

              {/* Label */}
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-display font-bold whitespace-nowrap px-2 py-0.5 rounded-md z-10"
                style={{ background: 'rgba(0,0,0,0.9)', color: config.color, border: `1px solid ${config.color}40`, textShadow: `0 0 8px ${config.glowColor}` }}
              >
                {config.label}
              </span>

              {/* Player tokens */}
              {playersHere.length > 0 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-0.5 z-20">
                  {playersHere.map(p => (
                    <div key={p.id}
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

      {/* Phase transition */}
      {phaseIdx < PHASES.length - 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-24 z-[5]"
          style={{
            background: `linear-gradient(to bottom, transparent, hsla(${PHASES[phaseIdx + 1].accentHue} 25% 8% / 0.85))`,
          }}
        />
      )}
    </div>
  );
}

// Small extracted component to reduce repetition
function TileIconBadge({ tileType, config, isBoss }: { tileType: TileType; config: typeof TILE_TYPES[TileType]; isBoss: boolean }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-lg"
      style={{
        width: isBoss ? 32 : 26,
        height: isBoss ? 32 : 26,
        background: `radial-gradient(circle, ${config.color}, hsl(0 0% 8%))`,
        border: `1.5px solid ${config.color}60`,
        boxShadow: `0 0 10px ${config.glowColor}`,
      }}
    >
      <MedievalTileIcon tileType={tileType} size={isBoss ? 22 : 18} color="#fff" glowColor={config.glowColor} />
    </div>
  );
}
