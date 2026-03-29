import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useAuth } from '@/contexts/AuthContext';
import DiceRoller from '@/components/DiceRoller';
import { BOARD_SIZE, boardEvents, PLAYER_COLORS } from '@/lib/multiplayerTypes';
import { ArrowLeft, Copy, Crown, Users, MapPin, Trophy, LogIn, Share2, Swords, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MultiplayerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    room, players, myPlayer, loading, error,
    createRoom, joinRoom, startGame, rollDice, leaveRoom,
    isMyTurn, isHost,
  } = useMultiplayer();

  const [joinCode, setJoinCode] = useState('');
  const [view, setView] = useState<'menu' | 'lobby' | 'game'>('menu');

  // Auto-detect view from room state
  const currentView = room
    ? room.status === 'playing' || room.status === 'finished' ? 'game' : 'lobby'
    : view === 'menu' ? 'menu' : 'menu';

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-5">
        <LogIn className="w-10 h-10 text-primary" />
        <p className="text-foreground font-display text-lg">Faça login para jogar</p>
        <p className="text-sm text-muted-foreground text-center">O modo multiplayer requer uma conta para sincronizar com outros jogadores.</p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
        >
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

        <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6 max-w-sm mx-auto w-full">
          <div className="text-center space-y-2">
            <Swords className="w-12 h-12 text-primary mx-auto" />
            <h2 className="font-display text-xl text-foreground">RPG de Tabuleiro</h2>
            <p className="text-sm text-muted-foreground">Corra até a Cidade Celestial com seus amigos! 2-8 jogadores.</p>
          </div>

          <button
            onClick={async () => {
              const r = await createRoom();
              if (r) setView('lobby');
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 glow-gold"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
            Criar Sala
          </button>

          <div className="w-full space-y-2">
            <p className="text-xs text-muted-foreground text-center">ou entre com código</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="CÓDIGO"
                maxLength={5}
                className="flex-1 h-12 rounded-xl bg-card border border-border text-center text-lg font-mono text-foreground tracking-widest uppercase"
              />
              <button
                onClick={async () => {
                  const ok = await joinRoom(joinCode);
                  if (ok) setView('lobby');
                }}
                disabled={loading || joinCode.length < 5}
                className="px-5 h-12 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50"
              >
                Entrar
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
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
          {/* Room code */}
          <div className="text-center space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Código da Sala</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-mono font-bold text-primary tracking-[0.3em]">{room?.code}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(room?.code || '');
                  toast.success('Código copiado!');
                }}
                className="p-2 rounded-lg bg-card border border-border hover:border-primary/40"
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{players.length}/{room?.max_players} jogadores</span>
            </div>

            {players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: p.color }} />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{p.display_name}</p>
                  {p.user_id === room?.host_id && (
                    <p className="text-[10px] text-primary flex items-center gap-1"><Crown className="w-3 h-3" /> Anfitrião</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Start button (host only) */}
          {isHost && (
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 glow-gold disabled:opacity-50"
            >
              <Swords className="w-5 h-5" />
              Iniciar Partida ({players.length} jogadores)
            </button>
          )}

          {!isHost && (
            <p className="text-center text-sm text-muted-foreground animate-pulse">
              Aguardando o anfitrião iniciar...
            </p>
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
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={async () => { await leaveRoom(); setView('menu'); }} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-sm text-foreground">
              {isGameOver ? '🏆 Fim de Jogo' : `Vez de ${currentTurnPlayer?.display_name || '...'}`}
            </h1>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{room?.code}</span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4 overflow-y-auto">
        {/* Board visualization — linear path */}
        <div className="relative">
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: BOARD_SIZE }).map((_, i) => {
              const playersHere = players.filter(p => p.position === i && !p.finished);
              const eventId = (room as any)?.board_events?.[i];
              const event = boardEvents.find(e => e.id === eventId);
              const isStart = i === 0;
              const isEnd = i === BOARD_SIZE - 1;

              return (
                <div
                  key={i}
                  className={`relative w-8 h-8 rounded-md flex items-center justify-center text-[10px] border transition-all
                    ${isStart ? 'bg-primary/20 border-primary' : ''}
                    ${isEnd ? 'bg-primary/30 border-primary' : ''}
                    ${!isStart && !isEnd ? 'bg-card border-border' : ''}
                    ${playersHere.length > 0 ? 'ring-2 ring-primary/40' : ''}
                  `}
                  title={event?.title || `Casa ${i + 1}`}
                >
                  {isEnd ? '🏰' : isStart ? '🏠' : event?.emoji || (i + 1)}

                  {/* Player tokens */}
                  {playersHere.length > 0 && (
                    <div className="absolute -top-1 -right-1 flex -space-x-1">
                      {playersHere.map(p => (
                        <div
                          key={p.id}
                          className="w-3 h-3 rounded-full border border-background"
                          style={{ backgroundColor: p.color }}
                          title={p.display_name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Player cards */}
        <div className="space-y-2">
          {players.map(p => (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                p.user_id === room?.current_turn_player_id
                  ? 'bg-primary/10 border-primary/40'
                  : p.finished
                  ? 'bg-card/50 border-border opacity-70'
                  : 'bg-card border-border'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-foreground truncate">{p.display_name}</p>
                  {p.user_id === room?.current_turn_player_id && !p.finished && (
                    <span className="text-[9px] text-primary">◀ jogando</span>
                  )}
                  {p.finished && (
                    <span className="text-[9px] text-primary flex items-center gap-0.5">
                      <Trophy className="w-3 h-3" /> {p.finish_order}º
                    </span>
                  )}
                  {p.is_stunned && !p.finished && (
                    <span className="text-[9px] text-destructive">😵 paralisado</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                  <span><MapPin className="w-2.5 h-2.5 inline" /> {p.position}/{BOARD_SIZE - 1}</span>
                  {p.last_dice_roll && <span>🎲 {p.last_dice_roll}</span>}
                  {p.last_event && <span className="truncate max-w-[100px]">{p.last_event}</span>}
                </div>
              </div>
              <div className="text-[8px] text-muted-foreground text-right">
                <div>🔥{p.attributes.fe} ⛰️{p.attributes.perseveranca}</div>
                <div>👁️{p.attributes.discernimento} 🛡️{p.attributes.coragem}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dice & action */}
        {!isGameOver && (
          <div className="py-4">
            <DiceRoller
              onRoll={(val) => rollDice(val)}
              disabled={!isMyTurn || (myPlayer?.finished || false)}
              isMyTurn={isMyTurn}
            />
          </div>
        )}

        {/* Game over ranking */}
        {isGameOver && (
          <div className="space-y-3 py-4">
            <h2 className="font-display text-lg text-foreground text-center">Resultado Final</h2>
            {finishedPlayers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}</span>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: p.color }} />
                <p className="text-sm font-medium text-foreground flex-1">{p.display_name}</p>
                <div className="text-[9px] text-muted-foreground">
                  🔥{p.attributes.fe} ⛰️{p.attributes.perseveranca} 👁️{p.attributes.discernimento} 🛡️{p.attributes.coragem}
                </div>
              </div>
            ))}
            <button
              onClick={async () => { await leaveRoom(); setView('menu'); }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm"
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
