import { useMemo, useRef, useEffect, useState, memo } from 'react';
import {
  IMMERSIVE_BOARD_SIZE, TILES_PER_PHASE, PHASES, TILE_TYPES,
  TileType, getTrailPositions, PhaseConfig,
} from './ImmersiveBoardTypes';
import { MedievalTileIcon } from './MedievalTileIcons';
import { characterImages } from '@/data/characterImages';
import ContinuousTrail from './ContinuousTrail';
import { useVisiblePhases } from '@/hooks/useVisiblePhases';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';

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
  onTokenArrived?: () => void;
}

export default function ImmersiveBoard({ tileTypes, players, currentTurnId, onTileClick, onTokenArrived }: ImmersiveBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const trailPositions = useMemo(() => getTrailPositions(), []);
  const prevPositionRef = useRef<Record<string, number>>({});
  const [animatingPlayerId, setAnimatingPlayerId] = useState<string | null>(null);
  const [animatedPosition, setAnimatedPosition] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const onTokenArrivedRef = useRef(onTokenArrived);
  onTokenArrivedRef.current = onTokenArrived;

  const visiblePhases = useVisiblePhases(players);
  const capability = useDeviceCapability();

  // Track ALL players' position changes — animate whichever player moved
  useEffect(() => {
    if (!boardRef.current) return;

    // Find which player changed position
    let movedPlayer: Player | null = null;
    let prevPos = 0;
    let newPos = 0;

    for (const p of players) {
      const prev = prevPositionRef.current[p.id] ?? p.position;
      if (prev !== p.position && !p.finished) {
        movedPlayer = p;
        prevPos = prev;
        newPos = p.position;
        break; // animate one at a time
      }
    }

    // Save current positions for all players
    players.forEach(p => { prevPositionRef.current[p.id] = p.position; });

    if (!movedPlayer || prevPos === newPos) return;

    // Cancel any running animation — call onTokenArrived so state doesn't get stuck
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
      // If we were already animating, fire the callback to clean up
      if (animatingPlayerId) {
        setAnimatingPlayerId(null);
        setAnimatedPosition(null);
        // Don't call onTokenArrived here — the new animation replaces the old one
      }
    }

    // Animate step by step
    const steps: number[] = [];
    if (newPos > prevPos) {
      for (let i = prevPos + 1; i <= newPos; i++) steps.push(i);
    } else {
      for (let i = prevPos - 1; i >= newPos; i--) steps.push(i);
    }

    if (steps.length === 0) {
      onTokenArrivedRef.current?.();
      return;
    }

    const playerId = movedPlayer.id;
    setAnimatingPlayerId(playerId);
    setAnimatedPosition(prevPos);

    // Scroll to starting position first so user sees the token
    const startTileEl = boardRef.current?.querySelector(`[data-tile-global="${prevPos}"]`);
    if (startTileEl) {
      startTileEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let stepIdx = 0;
    // Speed up for long return moves (more than 5 tiles)
    const STEP_DELAY = steps.length > 5 ? 500 : 900;
    let cancelled = false;

    const doStep = () => {
      if (cancelled) return;
      if (stepIdx >= steps.length) {
        setAnimatingPlayerId(null);
        setAnimatedPosition(null);
        onTokenArrivedRef.current?.();
        return;
      }

      const pos = steps[stepIdx];
      setAnimatedPosition(pos);

      const tileEl = boardRef.current?.querySelector(`[data-tile-global="${pos}"]`);
      if (tileEl) {
        tileEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      stepIdx++;
      animationRef.current = window.setTimeout(doStep, STEP_DELAY);
    };

    // Small delay to let React render the target phase before animating
    animationRef.current = window.setTimeout(doStep, 350);

    // Safety fallback: if animation doesn't complete in reasonable time, force-complete it
    const maxTime = 350 + steps.length * STEP_DELAY + 2000;
    const safetyTimer = window.setTimeout(() => {
      if (!cancelled && animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
        setAnimatingPlayerId(null);
        setAnimatedPosition(null);
        onTokenArrivedRef.current?.();
      }
    }, maxTime);

    return () => {
      cancelled = true;
      if (animationRef.current) clearTimeout(animationRef.current);
      clearTimeout(safetyTimer);
      // On cleanup (effect re-run), force-call onTokenArrived to prevent stuck state
      setAnimatingPlayerId(null);
      setAnimatedPosition(null);
      onTokenArrivedRef.current?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.map(p => `${p.id}:${p.position}`).join(',')]);

  const getDisplayPosition = (player: Player): number => {
    if (player.id === animatingPlayerId && animatedPosition !== null) {
      return animatedPosition;
    }
    return player.position;
  };

  return (
    <div ref={boardRef} className="w-full">
      {/* Single global tokenGlow keyframe — avoids duplicating per phase */}
      <style>{`
        @keyframes tokenGlow {
          0% { transform: scale(1); }
          100% { transform: scale(1.3); }
        }
      `}</style>
      {PHASES.map((phase, phaseIdx) => {
        // LAZY LOADING: only mount phases that are visible
        if (!visiblePhases.has(phaseIdx)) {
          return (
            <div
              key={phaseIdx}
              data-phase={phaseIdx}
              style={{ minHeight: '500svh' }}
              className="relative w-full"
            />
          );
        }

        return (
          <PhaseSection
            key={phaseIdx}
            phase={phase}
            phaseIdx={phaseIdx}
            tileTypes={tileTypes}
            trailPositions={trailPositions}
            players={players}
            currentTurnId={currentTurnId}
            onTileClick={onTileClick}
            getDisplayPosition={getDisplayPosition}
            animatingPlayerId={animatingPlayerId}
            capability={capability}
          />
        );
      })}
    </div>
  );
}

const PhaseSection = memo(function PhaseSection({
  phase, phaseIdx, tileTypes, trailPositions, players, currentTurnId, onTileClick,
  getDisplayPosition, animatingPlayerId, capability,
}: {
  phase: PhaseConfig;
  phaseIdx: number;
  tileTypes: TileType[];
  trailPositions: { x: number; y: number }[];
  players: Player[];
  currentTurnId?: string;
  onTileClick?: (position: number, tileType: TileType) => void;
  getDisplayPosition: (player: Player) => number;
  animatingPlayerId: string | null;
  capability: ReturnType<typeof useDeviceCapability>;
}) {
  const startIdx = phaseIdx * TILES_PER_PHASE;
  const charImg = phase.characterKey ? characterImages[phase.characterKey] : null;

  // Virtualization: track which tiles are visible in viewport
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleTileRange, setVisibleTileRange] = useState<[number, number]>([0, TILES_PER_PHASE - 1]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Use IntersectionObserver on the section itself for coarse visibility
    // For tile-level virtualization, we observe scroll position
    const BUFFER = 5; // extra tiles above/below viewport

    const updateVisibleRange = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const sectionH = rect.height;

      if (sectionH === 0) {
        setVisibleTileRange([0, TILES_PER_PHASE - 1]);
        return;
      }

      const topVisible = Math.max(0, -rect.top / sectionH);
      const bottomVisible = Math.min(1, (viewH - rect.top) / sectionH);

      const firstTile = Math.max(0, Math.floor(topVisible * TILES_PER_PHASE) - BUFFER);
      const lastTile = Math.min(TILES_PER_PHASE - 1, Math.ceil(bottomVisible * TILES_PER_PHASE) + BUFFER);

      setVisibleTileRange([firstTile, lastTile]);
    };

    updateVisibleRange();

    // THROTTLED scroll listener — prevents excessive recalculations on mobile
    let ticking = false;
    const throttledUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateVisibleRange();
        ticking = false;
      });
    };

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  return (
    <div
      ref={sectionRef}
      data-phase={phaseIdx}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '500svh' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={phase.bgImage}
          alt={phase.name}
          className="w-full h-full object-cover"
          loading={phaseIdx === 0 ? 'eager' : 'lazy'}
          style={{
            filter: capability.tier === 'essential'
              ? 'brightness(0.9) saturate(1.2) contrast(1.05)'
              : 'brightness(0.85) saturate(1.7) contrast(1.1)',
          }}
        />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, hsla(${phase.accentHue} 25% 8% / 0.3) 0%, hsla(${phase.accentHue} 15% 5% / 0.15) 50%, hsla(${phase.accentHue} 25% 8% / 0.35) 100%)`,
        }} />
      </div>
...
      {/* Continuous trail path */}
      <ContinuousTrail
        trailPositions={trailPositions}
        phaseIdx={phaseIdx}
        accentHue={phase.accentHue}
        enableGlowFilter={capability.enableSvgFilters}
        simplified={capability.tier === 'essential'}
      />

      {/* Tiles — VIRTUALIZED: only render visible ones */}
      <div className="relative w-full z-[2]" style={{ minHeight: '500svh' }}>
        {trailPositions.map((pos, localIdx) => {
          const globalIdx = startIdx + localIdx;
          if (globalIdx >= IMMERSIVE_BOARD_SIZE) return null;

          // VIRTUALIZATION: skip tiles outside visible range
          // BUT always render tiles that have players on them
          const hasPlayer = players.some(p => getDisplayPosition(p) === globalIdx && !p.finished);
          if (!hasPlayer && (localIdx < visibleTileRange[0] || localIdx > visibleTileRange[1])) {
            return null;
          }

          const tileType = tileTypes[globalIdx] || 'normal';
          const config = TILE_TYPES[tileType];
          const playersHere = players.filter(p => getDisplayPosition(p) === globalIdx && !p.finished);
          const isCurrentPlayerHere = playersHere.some(p => p.id === currentTurnId);
          const isAnimatingHere = playersHere.some(p => p.id === animatingPlayerId);

          const tileCharKey = config.characterKey;
          const tileCharImg = tileCharKey ? characterImages[tileCharKey] : null;
          const tileEnvImg = config.tileImage || null;
          const tileImg = tileCharImg || tileEnvImg;
          const isSpecial = tileType !== 'normal';
          const isBoss = tileType === 'giant' || tileType === 'challenge';
          const tileSize = isBoss ? 88 : isSpecial ? 78 : 66;

          const labelOnRight = pos.x < 50;

          return (
            <div
              key={globalIdx}
              data-tile-global={globalIdx}
              className="absolute z-[3] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onTileClick?.(globalIdx, tileType)}
            >
              {/* Tile body */}
              <div
                className={`relative flex items-center justify-center overflow-hidden
                  ${playersHere.length > 0 ? 'scale-125 ring-2 ring-white/50' : ''}
                  ${isAnimatingHere ? 'ring-4 ring-yellow-400/70' : ''}
                  ${isCurrentPlayerHere && !isAnimatingHere && capability.enableCssAnimations ? 'animate-pulse' : ''}
                  transition-all duration-300 hover:scale-110
                `}
                style={{
                  width: tileSize,
                  height: tileSize,
                  borderRadius: isBoss ? 18 : isSpecial ? 16 : 12,
                  background: tileImg ? 'none' : `radial-gradient(circle at 30% 25%, ${config.color}, hsl(0 0% 12%))`,
                  boxShadow: capability.enableComplexShadows
                    ? `0 0 ${playersHere.length > 0 ? '35' : '18'}px ${config.glowColor}, inset 0 2px 3px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)`
                    : `0 0 ${playersHere.length > 0 ? '15' : '8'}px ${config.glowColor}, 0 4px 12px rgba(0,0,0,0.5)`,
                  border: `2.5px solid ${config.color}`,
                }}
              >
                {tileImg && (
                  <img
                    src={tileImg}
                    alt={config.label}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: isBoss ? 'saturate(1.4) contrast(1.2)' : isSpecial ? 'saturate(1.2)' : 'brightness(0.7) saturate(0.8)' }}
                    loading="lazy"
                  />
                )}

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
                  boxShadow: capability.enableComplexShadows ? `0 0 10px ${config.glowColor}` : undefined,
                }}
              >
                <MedievalTileIcon
                  tileType={tileType}
                  size={isBoss ? 18 : isSpecial ? 16 : 14}
                  color={config.color}
                  glowColor={capability.enableComplexShadows ? config.glowColor : undefined}
                />
              </div>

              {/* Boss indicator */}
              {isBoss && capability.enableCssAnimations && (
                <div className="absolute -top-2 -right-2 text-xs z-10 animate-bounce">
                  {tileType === 'giant' ? '💀' : '⚔️'}
                </div>
              )}
              {isBoss && !capability.enableCssAnimations && (
                <div className="absolute -top-2 -right-2 text-xs z-10">
                  {tileType === 'giant' ? '💀' : '⚔️'}
                </div>
              )}

              {/* Type label */}
              {isSpecial && (
                <div className="absolute top-1/2 -translate-y-1/2 z-10"
                  style={labelOnRight
                    ? { left: `${tileSize + 10}px` }
                    : { right: `${tileSize + 10}px` }
                  }
                >
                  <div className="relative flex items-center">
                    {labelOnRight ? (
                      <div style={{
                        width: 0, height: 0,
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent',
                        borderRight: '7px solid rgba(0,0,0,0.9)',
                        marginRight: -1,
                      }} />
                    ) : null}
                    <span className="font-display font-extrabold whitespace-nowrap px-3 py-1.5 rounded-lg"
                      style={{
                        background: 'rgba(0,0,0,0.9)',
                        color: '#FFFFFF',
                        border: `2px solid ${config.color}`,
                        boxShadow: capability.enableComplexShadows
                          ? `0 0 16px ${config.glowColor}, 0 4px 12px rgba(0,0,0,0.7)`
                          : `0 2px 8px rgba(0,0,0,0.5)`,
                        textShadow: capability.enableComplexShadows
                          ? `0 0 10px ${config.color}, 0 1px 3px rgba(0,0,0,0.8)`
                          : `0 1px 3px rgba(0,0,0,0.8)`,
                        letterSpacing: '0.06em',
                        wordSpacing: '0.2em',
                        fontSize: isBoss ? '15px' : '13px',
                      }}
                    >
                      {config.label}
                    </span>
                    {!labelOnRight ? (
                      <div style={{
                        width: 0, height: 0,
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent',
                        borderLeft: '7px solid rgba(0,0,0,0.9)',
                        marginLeft: -1,
                      }} />
                    ) : null}
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
                        boxShadow: `0 0 ${p.id === animatingPlayerId ? '20' : '12'}px ${p.color}90`,
                        animation: p.id === animatingPlayerId
                          ? 'tokenGlow 0.35s ease-in-out infinite alternate'
                          : p.id === currentTurnId && capability.enableCssAnimations ? 'bounce 1s infinite' : undefined,
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
          <div className="h-28" style={{
            background: `linear-gradient(to bottom, transparent, hsla(${PHASES[phaseIdx + 1].accentHue} 25% 8% / 0.9))`,
          }} />
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
                boxShadow: capability.enableComplexShadows ? `0 0 12px hsla(${phase.accentHue} 50% 50% / 0.3)` : undefined,
              }}
            >
              <span className="text-xs">{PHASES[phaseIdx + 1].icon}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});
