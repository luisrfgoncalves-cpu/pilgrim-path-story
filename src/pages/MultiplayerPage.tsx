import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useAuth } from '@/contexts/AuthContext';
import PremiumDice from '@/components/multiplayer/PremiumDice';
import PremiumBoard from '@/components/multiplayer/PremiumBoard';
import EventReveal from '@/components/multiplayer/EventReveal';
import GameNotification from '@/components/GameNotification';
import { BOARD_SIZE, boardEvents, BoardEvent } from '@/lib/multiplayerTypes';
import { playMove, playVictory, playTurnStart } from '@/components/multiplayer/BoardSounds';
import { playGameSfx } from '@/lib/gameSfx';
import { ArrowLeft, Copy, Crown, Users, MapPin, Trophy, LogIn, Share2, Swords, Loader2, Eye, Flame, Shield, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const MultiplayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    room, players, myPlayer, loading, error,
    createRoom, joinRoom, startGame, rollDice, leaveRoom,
    isMyTurn, isHost,
  } = useMultiplayer();

  const [joinCode, setJoinCode] = useState('');
  const [view, setView] = useState<'menu' | 'lobby' | 'game'>('menu');
  const [revealEvent, setRevealEvent] = useState<{ event: BoardEvent; playerName: string; dice: number; challengeResult?: 'win' | 'fail' | null } | null>(null);
  const [selectedTile, setSelectedTile] = useState<{ pos: number; event: BoardEvent | undefined } | null>(null);
  const [turnAnnounce, setTurnAnnounce] = useState<string | null>(null);
  const prevTurnRef = useRef<string | null>(null);

  // Auto-join via link
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl && user && !room) {
      joinRoom(codeFromUrl);
    }
  }, [searchParams, user]);

  // Turn announcement with sound
  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const turnId = room.current_turn_player_id;
    if (turnId && turnId !== prevTurnRef.current) {
      prevTurnRef.current = turnId;
      const turnPlayer = players.find(p => p.user_id === turnId);
      if (turnPlayer) {
        playTurnStart();
        if (turnId === user?.id) {
          playGameSfx('suspense');
          setTurnAnnounce('Sua vez!');
        } else {
          setTurnAnnounce(`Vez de ${turnPlayer.display_name}`);
        }
        // GameNotification handles dismiss
      }
    }
  }, [room?.current_turn_player_id, players, user?.id]);

  const currentView = room
    ? room.status === 'playing' || room.status === 'finished' ? 'game' : 'lobby'
    : view === 'menu' ? 'menu' : 'menu';

  const handleDiceRoll = useCallback(async (value?: number) => {
    if (!room || !myPlayer) return;

    const diceValue = value || (Math.floor(Math.random() * 6) + 1);
    let newPosition = Math.min(myPlayer.position + diceValue, BOARD_SIZE - 1);
    const boardEventId = (room as any).board_events?.[newPosition];
    const event = boardEvents.find(e => e.id === boardEventId);

    playMove();

    // Show event reveal if there's an event
    if (event) {
      let challengeResult: 'win' | 'fail' | null = null;
      if (event.type === 'challenge') {
        const challengeRoll = Math.floor(Math.random() * 6) + 1;
        challengeResult = challengeRoll >= 4 ? 'win' : 'fail';
      }

      setRevealEvent({
        event,
        playerName: myPlayer.display_name,
        dice: diceValue,
        challengeResult,
      });
    }

    // Check victory
    if (newPosition >= BOARD_SIZE - 1) {
      setTimeout(playVictory, 500);
    }

    // Execute the actual roll
    await rollDice(diceValue);
  }, [room, myPlayer, rollDice]);

  const handleTileClick = (pos: number, event: BoardEvent | undefined) => {
    setSelectedTile({ pos, event });
    setTimeout(() => setSelectedTile(null), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center" style={{
          boxShadow: '0 0 40px hsl(40 60% 55% / 0.1)',
        }}>
          <Swords className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-xl font-display text-foreground">RPG de Tabuleiro</h1>
          <p className="text-sm text-muted-foreground">Faça login para jogar com amigos</p>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-display text-sm glow-gold"
        >
          <LogIn className="w-4 h-4 inline mr-2" />
          Entrar / Criar Conta
        </button>
      </div>
    );
  }

  // ─── MENU ───
  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg text-foreground">Multiplayer</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-5 gap-8 max-w-sm mx-auto w-full">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto" style={{
              boxShadow: '0 0 60px hsl(40 60% 55% / 0.12), inset 0 0 20px hsl(40 60% 55% / 0.05)',
              border: '1px solid hsl(40 60% 55% / 0.2)',
            }}>
              <Swords className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display text-2xl text-foreground">RPG de Tabuleiro</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Corra até a Cidade Celestial com seus amigos!<br />
              <span className="text-primary">2–8 jogadores</span> · 30 casas · 65 eventos
            </p>
          </div>

          {/* Create room */}
          <button
            onClick={async () => {
              const r = await createRoom();
              if (r) setView('lobby');
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 glow-gold transition-opacity"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
            Criar Sala
          </button>

          {/* Join room */}
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">ou entre com código</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="CÓDIGO"
                maxLength={5}
                className="flex-1 h-14 rounded-xl bg-card border border-border text-center text-xl font-mono text-foreground tracking-[0.3em] uppercase focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
              <button
                onClick={async () => {
                  const ok = await joinRoom(joinCode);
                  if (ok) setView('lobby');
                }}
                disabled={loading || joinCode.length < 5}
                className="px-6 h-14 rounded-xl bg-primary text-primary-foreground font-display disabled:opacity-50 transition-opacity"
              >
                Entrar
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>
          )}
        </main>
      </div>
    );
  }

  // ─── LOBBY ───
  if (currentView === 'lobby') {
    const shareUrl = `${window.location.origin}/multiplayer?code=${room?.code}`;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={async () => { await leaveRoom(); setView('menu'); }} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg text-foreground">Sala de Jogo</h1>
          </div>
        </header>

        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6">
          {/* Room code — premium display */}
          <div className="text-center space-y-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">Código da Sala</p>
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/60 border border-primary/20" style={{
              boxShadow: '0 0 40px hsl(40 60% 55% / 0.06)',
            }}>
              <span className="text-4xl font-mono font-bold text-primary tracking-[0.4em]" style={{
                textShadow: '0 0 20px hsl(40 60% 55% / 0.3)',
              }}>
                {room?.code}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(room?.code || '');
                  toast.success('Código copiado!');
                }}
                className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success('Link copiado!');
              }}
              className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <Share2 className="w-3 h-3" /> Copiar link de convite
            </button>
          </div>

          {/* Players list */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{players.length}/{room?.max_players} peregrinos</span>
            </div>

            {players.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-card/60 border border-border hover:border-primary/20 transition-colors">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{
                    backgroundColor: p.color + '20',
                    border: `2px solid ${p.color}60`,
                    color: p.color,
                  }}
                >
                  {p.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{p.display_name}</p>
                  {p.user_id === room?.host_id && (
                    <p className="text-[10px] text-primary flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Anfitrião
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Start / waiting */}
          {isHost ? (
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 glow-gold disabled:opacity-50 transition-all"
            >
              <Swords className="w-5 h-5" />
              Iniciar Partida ({players.length} peregrinos)
            </button>
          ) : (
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-card/60 border border-border">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Aguardando o anfitrião iniciar...</span>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── GAME BOARD ───
  const currentTurnPlayer = players.find(p => p.user_id === room?.current_turn_player_id);
  const finishedPlayers = players.filter(p => p.finished).sort((a, b) => (a.finish_order || 99) - (b.finish_order || 99));
  const isGameOver = room?.status === 'finished';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Turn announcement overlay */}
      <GameNotification visible={!!turnAnnounce} onDismiss={() => setTurnAnnounce(null)} duration={8000} position="top-offset">
        <div className="px-6 py-3 rounded-2xl font-display text-lg" style={{
          background: turnAnnounce === 'Sua vez!'
            ? 'linear-gradient(135deg, hsl(40 60% 20%), hsl(40 50% 15%))'
            : 'linear-gradient(135deg, hsl(30 20% 15%), hsl(30 15% 10%))',
          border: turnAnnounce === 'Sua vez!'
            ? '1px solid hsl(40 60% 55% / 0.5)'
            : '1px solid hsl(30 15% 25%)',
          color: turnAnnounce === 'Sua vez!'
            ? 'hsl(40 80% 70%)'
            : 'hsl(38 30% 70%)',
          boxShadow: turnAnnounce === 'Sua vez!'
            ? '0 0 40px hsl(40 60% 55% / 0.2)'
            : '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {turnAnnounce === 'Sua vez!' ? '⚔️ ' : '🎲 '}{turnAnnounce}
        </div>
      </GameNotification>

      {/* Event reveal overlay */}
      {revealEvent && (
        <EventReveal
          event={revealEvent.event}
          playerName={revealEvent.playerName}
          diceValue={revealEvent.dice}
          challengeResult={revealEvent.challengeResult}
          onClose={() => setRevealEvent(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={async () => { await leaveRoom(); setView('menu'); }} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-sm text-foreground">
                {isGameOver ? '🏆 Fim de Jogo' : `Vez de ${currentTurnPlayer?.display_name || '...'}`}
              </h1>
              {!isGameOver && currentTurnPlayer && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTurnPlayer.color }} />
                  <span className="text-[9px] text-muted-foreground">
                    Casa {currentTurnPlayer.position + 1}/{BOARD_SIZE}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono bg-card px-2 py-1 rounded-md border border-border">
            {room?.code}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4 overflow-y-auto">
        {/* Premium Board */}
        <PremiumBoard
          room={room!}
          players={players}
          myPlayerId={user?.id}
          onTileClick={handleTileClick}
        />

        {/* Tile info popup */}
        {selectedTile && selectedTile.event && (
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

        {/* Player cards — compact */}
        <div className="grid grid-cols-2 gap-2">
          {players.map(p => {
            const isTurn = p.user_id === room?.current_turn_player_id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  isTurn
                    ? 'bg-primary/8 border-primary/30'
                    : p.finished
                    ? 'bg-card/30 border-border/50 opacity-60'
                    : 'bg-card/50 border-border'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: p.color + '25',
                    border: `1.5px solid ${p.color}50`,
                    color: p.color,
                  }}
                >
                  {p.display_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-medium text-foreground truncate">{p.display_name}</p>
                    {isTurn && !p.finished && (
                      <span className="text-[8px] text-primary">◀</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
                    {p.finished ? (
                      <span className="text-primary flex items-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5" /> {p.finish_order}º
                      </span>
                    ) : p.is_stunned ? (
                      <span className="text-destructive">😵 paralisado</span>
                    ) : (
                      <>
                        <span>{p.position + 1}/{BOARD_SIZE}</span>
                        {p.last_dice_roll && <span>🎲{p.last_dice_roll}</span>}
                      </>
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

        {/* Dice & action */}
        {!isGameOver && (
          <div className="py-4">
            <PremiumDice
              onRoll={handleDiceRoll}
              disabled={!isMyTurn || (myPlayer?.finished || false) || (myPlayer?.is_stunned || false)}
              isMyTurn={isMyTurn}
            />
          </div>
        )}

        {/* Stun message */}
        {isMyTurn && myPlayer?.is_stunned && (
          <div className="text-center p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-display">😵 Você está paralisado!</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {myPlayer.stun_turns > 0 ? `Faltam ${myPlayer.stun_turns} rodada(s)` : 'Última rodada de paralisia'}
            </p>
            <button
              onClick={() => rollDice()}
              className="mt-2 px-4 py-2 rounded-lg bg-card border border-border text-xs text-foreground hover:border-primary/30 transition-colors"
            >
              Passar a vez
            </button>
          </div>
        )}

        {/* Game over ranking */}
        {isGameOver && (
          <div className="space-y-4 py-4 animate-fade-in">
            {/* Particles */}
            <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="absolute rounded-full" style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `hsl(40 70% ${50 + Math.random() * 20}% / ${0.4 + Math.random() * 0.4})`,
                  animation: `pilgrimDust ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
            </div>
            <div className="text-center space-y-3">
              <span className="text-5xl block" style={{ animation: 'pulse 2s infinite' }}>🏆</span>
              <h2 className="font-display text-2xl" style={{ color: 'hsl(40 80% 70%)', textShadow: '0 0 20px hsl(40 60% 55% / 0.3)' }}>
                Resultado Final
              </h2>
              <p className="text-xs text-muted-foreground">A jornada chegou ao fim!</p>
            </div>

            {finishedPlayers.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                style={{
                  background: i === 0
                    ? 'linear-gradient(135deg, hsl(40 50% 15%), hsl(30 20% 12%))'
                    : 'hsl(var(--card))',
                  borderColor: i === 0
                    ? 'hsl(40 60% 55% / 0.4)'
                    : 'hsl(var(--border))',
                  boxShadow: i === 0 ? '0 0 30px hsl(40 60% 55% / 0.1)' : undefined,
                }}
              >
                <span className="text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: p.color + '25', border: `2px solid ${p.color}`, color: p.color }}
                >
                  {p.display_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-display text-foreground">{p.display_name}</p>
                  <div className="flex gap-2 text-[9px] text-muted-foreground mt-0.5">
                    <span>🔥{p.attributes.fe}</span>
                    <span>⛰{p.attributes.perseveranca}</span>
                    <span>👁{p.attributes.discernimento}</span>
                    <span>🛡{p.attributes.coragem}</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={async () => { await leaveRoom(); setView('menu'); }}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm glow-gold"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MultiplayerPage;
