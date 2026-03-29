import { useMemo, useState } from 'react';
import { GamePlayer, GameRoom, BOARD_SIZE, boardEvents, BoardEvent } from '@/lib/multiplayerTypes';
import { BOARD_SECTIONS, getTileStyle, getSectionIndex, getSerpentineLayout } from './BoardTheme';
import boardBgUrl from '@/assets/board-bg.jpg';

interface PremiumBoardProps {
  room: GameRoom;
  players: GamePlayer[];
  myPlayerId?: string;
  onTileClick?: (position: number, event: BoardEvent | undefined) => void;
}

export default function PremiumBoard({ room, players, myPlayerId, onTileClick }: PremiumBoardProps) {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const cols = 5;
  const layout = useMemo(() => getSerpentineLayout(BOARD_SIZE, cols), []);

  const boardEventsList = useMemo(() => {
    const events: (BoardEvent | undefined)[] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const eventId = (room as any).board_events?.[i];
      events.push(boardEvents.find(e => e.id === eventId));
    }
    return events;
  }, [room]);

  const totalRows = Math.ceil(BOARD_SIZE / cols);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-primary/20" style={{
      boxShadow: '0 0 60px hsl(40 60% 55% / 0.08), inset 0 0 40px rgba(0,0,0,0.3)',
    }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={boardBgUrl}
          alt="Mapa do tabuleiro"
          className="w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
      </div>

      {/* Section labels */}
      <div className="relative px-3 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-medium">
            🏚️ Cidade da Destruição
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-medium">
            ✨ Cidade Celestial
          </span>
        </div>
      </div>

      {/* Board grid */}
      <div className="relative px-3 pb-3">
        {Array.from({ length: totalRows }).map((_, rowIdx) => {
          const section = BOARD_SECTIONS[Math.min(5, rowIdx)];
          const tilesInRow = layout.filter(t => t.row === rowIdx);

          return (
            <div key={rowIdx} className="relative">
              {/* Section label */}
              <div className="flex items-center gap-2 py-1.5 px-1">
                <span className="text-[8px] text-muted-foreground/40">{section.icon}</span>
                <span className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground/40 font-medium">
                  {section.name}
                </span>
                <div className="flex-1 h-px bg-border/20" />
              </div>

              {/* Tiles row */}
              <div className={`grid grid-cols-5 gap-2 ${rowIdx % 2 === 1 ? 'direction-rtl' : ''}`}>
                {tilesInRow.map(tile => {
                  const globalIdx = rowIdx * cols + (rowIdx % 2 === 1 ? (cols - 1 - tile.col) : tile.col);
                  const isStart = globalIdx === 0;
                  const isEnd = globalIdx === BOARD_SIZE - 1;
                  const event = boardEventsList[globalIdx];
                  const style = getTileStyle(event, isStart, isEnd);
                  const playersHere = players.filter(p => p.position === globalIdx && !p.finished);
                  const isCurrentTurn = room.current_turn_player_id;
                  const myPlayer = players.find(p => p.user_id === myPlayerId);
                  const isMyPosition = myPlayer && myPlayer.position === globalIdx;
                  const isHovered = hoveredTile === globalIdx;

                  return (
                    <div
                      key={globalIdx}
                      className={`relative aspect-square rounded-xl ${style.bg} ring-1 ${style.ring}
                        transition-all duration-300 cursor-pointer overflow-hidden
                        ${playersHere.length > 0 ? 'ring-2 scale-105' : ''}
                        ${isMyPosition ? 'ring-2 ring-primary' : ''}
                        ${isHovered ? 'scale-110 z-10' : ''}
                      `}
                      style={{
                        boxShadow: playersHere.length > 0
                          ? `0 4px 20px ${style.glow.replace('shadow-', '').replace('/15', '')}, 0 0 15px rgba(0,0,0,0.3)`
                          : '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                      onMouseEnter={() => setHoveredTile(globalIdx)}
                      onMouseLeave={() => setHoveredTile(null)}
                      onClick={() => onTileClick?.(globalIdx, event)}
                    >
                      {/* Tile number */}
                      <div className="absolute top-0.5 left-1 text-[7px] text-muted-foreground/40 font-mono">
                        {globalIdx + 1}
                      </div>

                      {/* Event symbol */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {(isStart || isEnd) ? (
                          <span className="text-2xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.3))' }}>
                            {style.symbol}
                          </span>
                        ) : event ? (
                          <span className="text-lg opacity-80">{event.emoji}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground/20">{style.symbol}</span>
                        )}
                      </div>

                      {/* Player tokens */}
                      {playersHere.length > 0 && (
                        <div className="absolute bottom-0.5 left-0 right-0 flex items-center justify-center gap-0.5">
                          {playersHere.map(p => (
                            <div
                              key={p.id}
                              className="w-4 h-4 rounded-full border-2 border-background/80"
                              style={{
                                backgroundColor: p.color,
                                boxShadow: `0 0 6px ${p.color}60, inset 0 -1px 2px rgba(0,0,0,0.3)`,
                                animation: p.user_id === isCurrentTurn ? 'pulse 1.5s infinite' : undefined,
                              }}
                              title={p.display_name}
                            />
                          ))}
                        </div>
                      )}

                      {/* Stun indicator */}
                      {playersHere.some(p => p.is_stunned) && (
                        <div className="absolute top-0 right-0 text-[10px]">😵</div>
                      )}

                      {/* Connecting path line */}
                      {globalIdx < BOARD_SIZE - 1 && (
                        <div className="absolute -right-2 top-1/2 w-2 h-px bg-primary/15" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredTile !== null && boardEventsList[hoveredTile] && (
        <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-card/95 border border-border backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl">{boardEventsList[hoveredTile]?.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display text-foreground truncate">
                {boardEventsList[hoveredTile]?.title}
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-2">
                {boardEventsList[hoveredTile]?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
