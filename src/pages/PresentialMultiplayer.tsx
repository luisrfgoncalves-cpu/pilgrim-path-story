import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumBoard from '@/components/multiplayer/PremiumBoard';
import PremiumDice from '@/components/multiplayer/PremiumDice';
import EventReveal from '@/components/multiplayer/EventReveal';
import GameNotification from '@/components/GameNotification';
import { BOARD_SIZE, boardEvents, BoardEvent } from '@/lib/multiplayerTypes';
import { playMove, playVictory, playTurnStart } from '@/components/multiplayer/BoardSounds';
import { playGameSfx } from '@/lib/gameSfx';
import { ArrowLeft, Users, Trophy, Plus, Minus, Dices, Crown, UserPlus } from 'lucide-react';
import ScreenHero from '@/components/ScreenHero';

const COLORS = ['#E8724A', '#4CAF50', '#42A5F5', '#FFD54F', '#AB47BC', '#EF5350', '#26C6DA', '#FF7043'];
const DEFAULT_NAMES = ['Cristão', 'Fiel', 'Esperança', 'Misericórdia', 'Valente', 'Honesto', 'Prudência', 'Caridade'];

interface LocalPlayer {
  id: string;
  name: string;
  color: string;
  position: number;
  attributes: { fe: number; perseveranca: number; discernimento: number; coragem: number };
  lastDice: number | null;
  finished: boolean;
  finishOrder: number | null;
  isStunned: boolean;
  stunTurns: number;
}

function createPlayer(index: number, name?: string): LocalPlayer {
  return {
    id: `p${index}`,
    name: name || DEFAULT_NAMES[index] || `Jogador ${index + 1}`,
    color: COLORS[index % COLORS.length],
    position: 0,
    attributes: { fe: 3, perseveranca: 3, discernimento: 3, coragem: 3 },
    lastDice: null,
    finished: false,
    finishOrder: null,
    isStunned: false,
    stunTurns: 0,
  };
}

function generateBoardEvents(): Record<number, string> {
  const events: Record<number, string> = {};
  const available = [...boardEvents];
  for (let i = 2; i < BOARD_SIZE - 1; i++) {
    if (Math.random() < 0.6 && available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      events[i] = available[idx].id;
      available.splice(idx, 1);
    }
  }
  return events;
}

const PresentialMultiplayer = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [players, setPlayers] = useState<LocalPlayer[]>([createPlayer(0), createPlayer(1)]);
  const [editingNames, setEditingNames] = useState<Record<string, string>>({});
  const [currentTurn, setCurrentTurn] = useState(0);
  const [boardEventsMap, setBoardEventsMap] = useState<Record<number, string>>({});
  const [revealEvent, setRevealEvent] = useState<{ event: BoardEvent; playerName: string; dice: number; challengeResult?: 'win' | 'fail' | null } | null>(null);
  const [selectedTile, setSelectedTile] = useState<{ pos: number; event: BoardEvent | undefined } | null>(null);
  const [turnAnnounce, setTurnAnnounce] = useState<string | null>(null);
  const [finishCount, setFinishCount] = useState(0);

  const addPlayer = () => {
    if (players.length >= 8) return;
    setPlayers(prev => [...prev, createPlayer(prev.length)]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setEditingNames(prev => ({ ...prev, [id]: name }));
  };

  const commitName = (id: string) => {
    const name = editingNames[id];
    if (name && name.trim()) {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: name.trim() } : p));
    }
    setEditingNames(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const startGame = () => {
    // Commit any pending names
    const finalPlayers = players.map(p => {
      const editName = editingNames[p.id];
      return editName?.trim() ? { ...p, name: editName.trim() } : p;
    });
    setPlayers(finalPlayers);
    setBoardEventsMap(generateBoardEvents());
    setPhase('playing');
    setCurrentTurn(0);
    playTurnStart();
    playGameSfx('gameStart');
    setTurnAnnounce(`Vez de ${finalPlayers[0].name}!`);
  };

  const handleDiceRoll = useCallback((value?: number) => {
    const player = players[currentTurn];
    if (!player || player.finished) return;

    // If stunned, skip turn
    if (player.isStunned) {
      setPlayers(prev => prev.map((p, i) => i === currentTurn ? {
        ...p,
        isStunned: p.stunTurns <= 1 ? false : true,
        stunTurns: Math.max(0, p.stunTurns - 1),
      } : p));
      nextTurn();
      return;
    }

    const diceValue = value || (Math.floor(Math.random() * 6) + 1);
    let newPos = Math.min(player.position + diceValue, BOARD_SIZE - 1);
    playMove();

    const eventId = boardEventsMap[newPos];
    const event = boardEvents.find(e => e.id === eventId);

    let posAdjust = 0;
    let attrChanges = { fe: 0, perseveranca: 0, discernimento: 0, coragem: 0 };
    let stun = false;
    let stunTurns = 0;
    let challengeResult: 'win' | 'fail' | null = null;

    if (event) {
      const eff = event.effect;
      if (event.type === 'challenge') {
        const roll = Math.floor(Math.random() * 6) + 1;
        challengeResult = roll >= 4 ? 'win' : 'fail';
        if (challengeResult === 'win') {
          if (eff.attribute) (attrChanges as any)[eff.attribute] = (eff.amount || 1);
          if (eff.positions) posAdjust = Math.abs(eff.positions);
        } else {
          if (eff.attribute) (attrChanges as any)[eff.attribute] = -(eff.amount || 1);
          if (eff.positions) posAdjust = -(Math.abs(eff.positions));
        }
      } else if (event.type === 'advance' || event.type === 'boost') {
        if (eff.attribute) (attrChanges as any)[eff.attribute] = (eff.amount || 1);
        posAdjust = eff.positions || 0;
      } else if (event.type === 'retreat' || event.type === 'steal') {
        if (eff.attribute) (attrChanges as any)[eff.attribute] = -(eff.amount || 1);
        posAdjust = eff.positions ? -Math.abs(eff.positions) : 0;
      } else if (event.type === 'stun') {
        if (eff.attribute) (attrChanges as any)[eff.attribute] = -(eff.amount || 1);
        posAdjust = eff.positions ? -Math.abs(eff.positions) : 0;
        if (eff.stunTurns) { stun = true; stunTurns = eff.stunTurns; }
      } else if (event.type === 'shield' || event.type === 'safe') {
        if (eff.attribute) (attrChanges as any)[eff.attribute] = (eff.amount || 1);
      } else if (event.type === 'swap') {
        // Swap doesn't affect attributes in local mode
        if (eff.attribute) (attrChanges as any)[eff.attribute] = -(eff.amount || 0);
      }

      setRevealEvent({ event, playerName: player.name, dice: diceValue, challengeResult });
    }

    const finalPos = Math.max(0, Math.min(newPos + posAdjust, BOARD_SIZE - 1));
    const isFinished = finalPos >= BOARD_SIZE - 1;
    const newFinishCount = isFinished ? finishCount + 1 : finishCount;
    if (isFinished) {
      setFinishCount(newFinishCount);
      setTimeout(playVictory, 500);
    }

    setPlayers(prev => prev.map((p, i) => i === currentTurn ? {
      ...p,
      position: finalPos,
      lastDice: diceValue,
      finished: isFinished,
      finishOrder: isFinished ? newFinishCount : null,
      isStunned: stun,
      stunTurns,
      attributes: {
        fe: Math.max(0, p.attributes.fe + (attrChanges.fe || 0)),
        perseveranca: Math.max(0, p.attributes.perseveranca + (attrChanges.perseveranca || 0)),
        discernimento: Math.max(0, p.attributes.discernimento + (attrChanges.discernimento || 0)),
        coragem: Math.max(0, p.attributes.coragem + (attrChanges.coragem || 0)),
      },
    } : p));

    if (!event) {
      nextTurn();
    }
  }, [players, currentTurn, boardEventsMap, finishCount]);

  const nextTurn = useCallback(() => {
    setPlayers(current => {
      const activePlayers = current.filter(p => !p.finished);
      if (activePlayers.length === 0) {
        setPhase('finished');
        return current;
      }

      let next = (currentTurn + 1) % current.length;
      let tries = 0;
      while (current[next].finished && tries < current.length) {
        next = (next + 1) % current.length;
        tries++;
      }

      setCurrentTurn(next);
      playTurnStart();
      setTurnAnnounce(`Vez de ${current[next].name}!`);
      return current;
    });
  }, [currentTurn]);

  const handleEventClose = () => {
    setRevealEvent(null);
    nextTurn();
  };

  const handleTileClick = (pos: number, event: BoardEvent | undefined) => {
    setSelectedTile({ pos, event });
    setTimeout(() => setSelectedTile(null), 3000);
  };

  const resetGame = () => {
    setPlayers(prev => prev.map((p, i) => createPlayer(i, p.name)));
    setCurrentTurn(0);
    setFinishCount(0);
    setBoardEventsMap(generateBoardEvents());
    setPhase('playing');
    playGameSfx('gameStart');
  };

  // Build room-like object for PremiumBoard
  const fakeRoom = {
    code: 'LOCAL',
    status: phase === 'finished' ? 'finished' : 'playing',
    current_turn_player_id: players[currentTurn]?.id || '',
    host_id: players[0]?.id || '',
    board_events: boardEventsMap,
  };

  const fakePlayers = players.map(p => ({
    ...p,
    id: p.id,
    user_id: p.id,
    display_name: p.name,
    last_dice_roll: p.lastDice,
    finish_order: p.finishOrder,
    is_stunned: p.isStunned,
    stun_turns: p.stunTurns,
  }));

  // ─── SETUP ───
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => navigate('/multiplayer')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg text-foreground">Modo Presencial</h1>
          </div>
        </header>

        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6">
          <ScreenHero
            icon={<Dices className="w-full h-full" />}
            name="Jogo Presencial"
            subtitle="Um celular, todos os jogadores reunidos"
            sfx="gameStart"
            size="md"
          />

          <div className="bg-card/50 border border-border rounded-xl p-4 space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              📜 <strong className="text-foreground">Como funciona:</strong> Um celular serve como tabuleiro digital.
              Os jogadores passam o celular entre si ou usam um dado físico real. 
              Cada jogador clica no dado digital ou informa o resultado do dado físico na sua vez.
            </p>
          </div>

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-display text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Jogadores ({players.length}/8)
              </span>
              {players.length < 8 && (
                <button
                  onClick={addPlayer}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              )}
            </div>

            {players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: p.color + '20', border: `2px solid ${p.color}60`, color: p.color }}
                >
                  {(editingNames[p.id] || p.name).charAt(0).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={editingNames[p.id] ?? p.name}
                  onChange={e => updatePlayerName(p.id, e.target.value)}
                  onBlur={() => commitName(p.id)}
                  className="flex-1 bg-transparent border-none text-sm text-foreground font-medium outline-none focus:text-primary"
                  maxLength={20}
                />
                {players.length > 2 && (
                  <button onClick={() => removePlayer(p.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 glow-gold disabled:opacity-50 transition-all"
          >
            <Dices className="w-5 h-5" />
            Começar Partida ({players.length} peregrinos)
          </button>
        </main>
      </div>
    );
  }

  // ─── GAME & FINISHED ───
  const currentPlayer = players[currentTurn];
  const finishedPlayers = players.filter(p => p.finished).sort((a, b) => (a.finishOrder || 99) - (b.finishOrder || 99));
  const allFinished = players.every(p => p.finished);

  if (allFinished && phase !== 'finished') {
    setPhase('finished');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameNotification visible={!!turnAnnounce} onDismiss={() => setTurnAnnounce(null)} duration={6000} position="top-offset">
        <div className="px-6 py-3 rounded-2xl font-display text-lg" style={{
          background: 'linear-gradient(135deg, hsl(40 60% 20%), hsl(40 50% 15%))',
          border: '1px solid hsl(40 60% 55% / 0.5)',
          color: 'hsl(40 80% 70%)',
          boxShadow: '0 0 40px hsl(40 60% 55% / 0.2)',
        }}>
          🎲 {turnAnnounce}
        </div>
      </GameNotification>

      {revealEvent && (
        <EventReveal
          event={revealEvent.event}
          playerName={revealEvent.playerName}
          diceValue={revealEvent.dice}
          challengeResult={revealEvent.challengeResult}
          onClose={handleEventClose}
        />
      )}

      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/multiplayer')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-sm text-foreground">
                {phase === 'finished' ? '🏆 Fim de Jogo' : `Vez de ${currentPlayer?.name || '...'}`}
              </h1>
              {phase !== 'finished' && currentPlayer && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPlayer.color }} />
                  <span className="text-[9px] text-muted-foreground">
                    Casa {currentPlayer.position + 1}/{BOARD_SIZE}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="text-[10px] text-primary font-display bg-card px-2 py-1 rounded-md border border-primary/20">
            🎲 Presencial
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4 overflow-y-auto">
        <PremiumBoard
          room={fakeRoom as any}
          players={fakePlayers as any}
          myPlayerId={currentPlayer?.id}
          onTileClick={handleTileClick}
        />

        {selectedTile?.event && (
          <div className="p-3 rounded-xl bg-card/80 border border-border space-y-1 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedTile.event.emoji}</span>
              <div>
                <p className="text-xs font-display text-foreground">{selectedTile.event.title}</p>
                <p className="text-[10px] text-muted-foreground">{selectedTile.event.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Player cards */}
        <div className="grid grid-cols-2 gap-2">
          {players.map((p, i) => {
            const isTurn = i === currentTurn;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  isTurn ? 'bg-primary/8 border-primary/30' : p.finished ? 'bg-card/30 border-border/50 opacity-60' : 'bg-card/50 border-border'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: p.color + '25', border: `1.5px solid ${p.color}50`, color: p.color }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-medium text-foreground truncate">{p.name}</p>
                    {isTurn && !p.finished && <span className="text-[8px] text-primary">◀</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
                    {p.finished ? (
                      <span className="text-primary flex items-center gap-0.5"><Trophy className="w-2.5 h-2.5" /> {p.finishOrder}º</span>
                    ) : p.isStunned ? (
                      <span className="text-destructive">😵 paralisado</span>
                    ) : (
                      <><span>{p.position + 1}/{BOARD_SIZE}</span>{p.lastDice && <span>🎲{p.lastDice}</span>}</>
                    )}
                  </div>
                </div>
                <div className="text-[7px] text-muted-foreground/60 text-right leading-relaxed">
                  <div>🔥{p.attributes.fe} 🛡{p.attributes.coragem}</div>
                  <div>⛰{p.attributes.perseveranca} 👁{p.attributes.discernimento}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dice — or manual input for physical dice */}
        {phase === 'playing' && !currentPlayer?.finished && (
          <div className="space-y-3 py-4">
            {currentPlayer?.isStunned ? (
              <div className="text-center p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-display">😵 {currentPlayer.name} está paralisado!</p>
                <button onClick={() => handleDiceRoll(0)} className="mt-2 px-4 py-2 rounded-lg bg-card border border-border text-xs text-foreground">
                  Passar a vez
                </button>
              </div>
            ) : (
              <>
                <PremiumDice onRoll={handleDiceRoll} disabled={false} isMyTurn={true} />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/30" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">ou dado físico</span>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      onClick={() => handleDiceRoll(n)}
                      className="w-11 h-11 rounded-xl bg-card border border-border text-foreground font-bold text-lg hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Game Over */}
        {phase === 'finished' && (
          <div className="space-y-4 py-4 animate-fade-in">
            <div className="text-center space-y-3">
              <span className="text-5xl block" style={{ animation: 'pulse 2s infinite' }}>🏆</span>
              <h2 className="font-display text-2xl" style={{ color: 'hsl(40 80% 70%)', textShadow: '0 0 20px hsl(40 60% 55% / 0.3)' }}>
                Resultado Final
              </h2>
            </div>
            {finishedPlayers.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 rounded-xl border"
                style={{
                  background: i === 0 ? 'linear-gradient(135deg, hsl(40 50% 15%), hsl(30 20% 12%))' : 'hsl(var(--card))',
                  borderColor: i === 0 ? 'hsl(40 60% 55% / 0.4)' : 'hsl(var(--border))',
                  boxShadow: i === 0 ? '0 0 30px hsl(40 60% 55% / 0.1)' : undefined,
                }}
              >
                <span className="text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: p.color + '25', border: `2px solid ${p.color}`, color: p.color }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-display text-foreground">{p.name}</p>
                  <div className="flex gap-2 text-[9px] text-muted-foreground mt-0.5">
                    <span>🔥{p.attributes.fe}</span>
                    <span>⛰{p.attributes.perseveranca}</span>
                    <span>👁{p.attributes.discernimento}</span>
                    <span>🛡{p.attributes.coragem}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={resetGame} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm glow-gold">
              Jogar Novamente
            </button>
            <button onClick={() => navigate('/multiplayer')} className="w-full py-3 rounded-xl bg-card border border-border text-sm text-muted-foreground font-display">
              Voltar ao Menu
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PresentialMultiplayer;
