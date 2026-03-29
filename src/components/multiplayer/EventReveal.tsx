import { useState, useEffect } from 'react';
import { BoardEvent } from '@/lib/multiplayerTypes';
import { playPositiveEvent, playNegativeEvent, playChallengeEvent, playChallengeWin, playChallengeFail, playStun } from './BoardSounds';

interface EventRevealProps {
  event: BoardEvent | null;
  playerName: string;
  diceValue: number;
  challengeResult?: 'win' | 'fail' | null;
  onClose: () => void;
}

export default function EventReveal({ event, playerName, diceValue, challengeResult, onClose }: EventRevealProps) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    if (!event) return;

    // Play sound based on event type
    if (event.type === 'challenge') {
      playChallengeEvent();
      if (challengeResult === 'win') setTimeout(playChallengeWin, 600);
      else if (challengeResult === 'fail') setTimeout(playChallengeFail, 600);
    } else if (['advance', 'boost', 'safe', 'shield'].includes(event.type)) {
      playPositiveEvent();
    } else if (['retreat', 'steal', 'swap'].includes(event.type)) {
      playNegativeEvent();
    } else if (event.type === 'stun') {
      playStun();
    }

    setTimeout(() => setPhase('show'), 100);
    const autoClose = setTimeout(() => {
      setPhase('exit');
      setTimeout(onClose, 400);
    }, 3500);
    return () => clearTimeout(autoClose);
  }, [event]);

  if (!event) return null;

  const isPositive = ['advance', 'boost', 'safe', 'shield'].includes(event.type);
  const isNegative = ['retreat', 'stun', 'steal'].includes(event.type);
  const isChallenge = event.type === 'challenge';

  const borderColor = isPositive
    ? 'border-emerald-500/50'
    : isNegative
    ? 'border-red-500/50'
    : isChallenge
    ? 'border-amber-500/50'
    : 'border-primary/50';

  const glowColor = isPositive
    ? 'shadow-emerald-500/20'
    : isNegative
    ? 'shadow-red-500/20'
    : isChallenge
    ? 'shadow-amber-500/20'
    : 'shadow-primary/20';

  const bgGradient = isPositive
    ? 'from-emerald-950/95 via-card/95 to-card/95'
    : isNegative
    ? 'from-red-950/95 via-card/95 to-card/95'
    : isChallenge
    ? 'from-amber-950/95 via-card/95 to-card/95'
    : 'from-card/95 to-card/95';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-400
        ${phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0' : 'opacity-100'}
      `}
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.7)' }}
      onClick={() => { setPhase('exit'); setTimeout(onClose, 400); }}
    >
      <div
        className={`w-full max-w-sm rounded-2xl border-2 ${borderColor} bg-gradient-to-b ${bgGradient}
          shadow-2xl ${glowColor} p-6 space-y-4 transition-all duration-500
          ${phase === 'show' ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}
        `}
      >
        {/* Event emoji — large */}
        <div className="text-center">
          <span className="text-6xl block mb-2 drop-shadow-lg" style={{
            filter: isNegative ? 'hue-rotate(-10deg)' : 'none',
            animation: 'pulse 2s infinite',
          }}>
            {event.emoji}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl text-center text-foreground leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center leading-relaxed narrative-text">
          {event.description}
        </p>

        {/* Dice value */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs text-muted-foreground">🎲 {playerName} tirou</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-lg">
            {diceValue}
          </span>
        </div>

        {/* Challenge result */}
        {isChallenge && challengeResult && (
          <div className={`text-center py-2 rounded-lg ${
            challengeResult === 'win'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            <p className="text-sm font-medium">
              {challengeResult === 'win' ? '✨ Desafio Superado!' : '💔 Falhou no Desafio'}
            </p>
          </div>
        )}

        {/* Effect summary */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          {event.effect.positions && event.effect.positions > 0 && (
            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              +{event.effect.positions} casas
            </span>
          )}
          {event.effect.positions && event.effect.positions < 0 && (
            <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-400">
              {event.effect.positions} casas
            </span>
          )}
          {event.effect.stunTurns && (
            <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
              😵 Perde {event.effect.stunTurns} rodada(s)
            </span>
          )}
          {event.effect.attribute && event.effect.amount && (
            <span className={`px-2 py-1 rounded-full ${
              event.effect.amount > 0 ? 'bg-sky-500/10 text-sky-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {event.effect.amount > 0 ? '+' : ''}{event.effect.amount} {event.effect.attribute}
            </span>
          )}
        </div>

        {/* Tap to close */}
        <p className="text-[9px] text-muted-foreground/50 text-center">toque para fechar</p>
      </div>
    </div>
  );
}
