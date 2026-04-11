import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import PremiumDice from '@/components/multiplayer/PremiumDice';
import PremiumBoard from '@/components/multiplayer/PremiumBoard';
import EventReveal from '@/components/multiplayer/EventReveal';
import GameNotification from '@/components/GameNotification';
import { BOARD_SIZE, boardEvents, BoardEvent } from '@/lib/multiplayerTypes';
import { playMove, playVictory, playTurnStart } from '@/components/multiplayer/BoardSounds';
import { playGameSfx } from '@/lib/gameSfx';
import { ArrowLeft, Copy, Crown, Users, Trophy, Share2, Swords, Loader2, Flame, Shield, Star, Zap, Sparkles, User } from 'lucide-react';
import { toast } from 'sonner';

const MultiplayerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    room, players, myPlayer, loading, error,
    guestName, setGuestName, guestId,
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
    if (codeFromUrl && guestName && !room) {
      joinRoom(codeFromUrl);
    }
  }, [searchParams, guestName]);

  // Turn announcement with sound
  useEffect(() => {
    if (!room || room.status !== 'playing') return;
    const turnId = room.current_turn_player_id;
    if (turnId && turnId !== prevTurnRef.current) {
      prevTurnRef.current = turnId;
      const turnPlayer = players.find(p => p.user_id === turnId);
      if (turnPlayer) {
        playTurnStart();
        if (turnId === guestId) {
          playGameSfx('suspense');
          setTurnAnnounce('Sua vez!');
        } else {
          setTurnAnnounce(`Vez de ${turnPlayer.display_name}`);
        }
      }
    }
  }, [room?.current_turn_player_id, players, guestId]);

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

    if (newPosition >= BOARD_SIZE - 1) {
      setTimeout(playVictory, 500);
    }

    rollDice(diceValue);
  }, [room, myPlayer, rollDice]);

  const handleTileClick = (pos: number, event: BoardEvent | undefined) => {
    setSelectedTile({ pos, event });
    setTimeout(() => setSelectedTile(null), 3000);
  };

  // ─── MENU ───
  if (currentView === 'menu') {
    return (
      <div className="min-h-screen flex flex-col" style={{
        background: 'linear-gradient(180deg, hsl(30 20% 6%) 0%, hsl(25 25% 10%) 40%, hsl(30 20% 6%) 100%)',
      }}>
        <header className="sticky top-0 z-10 backdrop-blur-sm border-b px-4 py-3" style={{
          background: 'hsl(30 20% 8% / 0.9)',
          borderColor: 'hsl(40 30% 20% / 0.3)',
        }}>
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg text-foreground">RPG de Tabuleiro</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-5 pt-8 pb-12 gap-8 max-w-sm mx-auto w-full">
          {/* Hero icon */}
          <div className="text-center space-y-4">
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center mx-auto" style={{
              background: 'linear-gradient(135deg, hsl(40 50% 18%), hsl(35 40% 12%))',
              boxShadow: '0 0 80px hsl(40 60% 50% / 0.15), inset 0 1px 0 hsl(40 60% 40% / 0.2)',
              border: '1px solid hsl(40 50% 30% / 0.4)',
            }}>
              <Swords className="w-14 h-14" style={{ color: 'hsl(40 70% 60%)' }} />
            </div>
            <h2 className="font-display text-3xl" style={{ color: 'hsl(40 50% 75%)', textShadow: '0 0 30px hsl(40 60% 50% / 0.2)' }}>
              O Peregrino
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(30 15% 55%)' }}>
              Uma jornada épica de fé, coragem e decisões<br />
              que mudarão o destino dos peregrinos.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { icon: <Users className="w-4 h-4" />, value: '2–8', label: 'Jogadores' },
              { icon: <Flame className="w-4 h-4" />, value: '120', label: 'Casas' },
              { icon: <Sparkles className="w-4 h-4" />, value: '300+', label: 'Eventos' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{
                background: 'hsl(30 15% 10% / 0.6)',
                border: '1px solid hsl(40 30% 20% / 0.3)',
              }}>
                <div style={{ color: 'hsl(40 60% 55%)' }}>{stat.icon}</div>
                <span className="font-display text-lg font-bold" style={{ color: 'hsl(40 50% 75%)' }}>{stat.value}</span>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'hsl(30 15% 45%)' }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Features list */}
          <div className="w-full space-y-2.5">
            {[
              { icon: <Crown className="w-4 h-4" />, text: 'Mestre do Jogo narra como um RPG real' },
              { icon: <Shield className="w-4 h-4" />, text: 'Perguntas bíblicas, charadas e dilemas morais' },
              { icon: <Zap className="w-4 h-4" />, text: 'Bosses épicos, armadilhas e bênçãos' },
              { icon: <Star className="w-4 h-4" />, text: 'Modo cooperativo ou competitivo' },
              { icon: <Trophy className="w-4 h-4" />, text: 'Funciona 100% offline — sem internet' },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{
                background: 'hsl(30 15% 10% / 0.4)',
                border: '1px solid hsl(40 30% 20% / 0.15)',
              }}>
                <div style={{ color: 'hsl(40 60% 55%)' }}>{feat.icon}</div>
                <span className="text-sm" style={{ color: 'hsl(30 15% 70%)' }}>{feat.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/multiplayer/presencial')}
            className="w-full flex items-center justify-center gap-3 px-5 py-5 rounded-2xl font-display text-base transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, hsl(40 50% 30%), hsl(35 45% 22%))',
              border: '2px solid hsl(40 60% 45% / 0.5)',
              color: 'hsl(40 80% 85%)',
              boxShadow: '0 0 40px hsl(40 60% 50% / 0.15), 0 4px 20px rgba(0,0,0,0.4)',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            <Swords className="w-5 h-5" />
            Iniciar Jornada
          </button>
          <p className="text-[10px] text-center leading-relaxed" style={{ color: 'hsl(30 15% 40%)' }}>
            Reúna seus amigos ao redor de um celular.<br />
            O app será o tabuleiro e o Mestre do Jogo.
          </p>
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
            <button onClick={() => { leaveRoom(); setView('menu'); }} className="text-muted-foreground hover:text-foreground">
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
                {p.user_id === guestId && (
                  <span className="text-[9px] text-muted-foreground bg-card px-2 py-1 rounded-md">Você</span>
                )}
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
            <button onClick={() => { leaveRoom(); setView('menu'); }} className="text-muted-foreground hover:text-foreground">
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
          myPlayerId={guestId}
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
              onClick={() => { leaveRoom(); setView('menu'); }}
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
