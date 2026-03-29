import { useState, useEffect } from 'react';
import { BoardEvent } from '@/lib/multiplayerTypes';
import { characterImages } from '@/data/characterImages';
import { playPositiveEvent, playNegativeEvent, playChallengeEvent, playChallengeWin, playChallengeFail, playStun } from './BoardSounds';
import { playGameSfx } from '@/lib/gameSfx';

// Map event IDs to character image keys for dramatic reveals
const eventCharacterMap: Record<string, string> = {
  ev3: 'evangelista',
  ev5: 'auxilio',
  ev7: 'gigante_desespero',
  ev10: 'apolion',
  ev14: 'falador',
  ev20: 'interprete',
  ev21: 'cristao',
  ev22: 'cristao',
  ev24: 'grande_coracao',
  ev35: 'apolion',
  ev37: 'gigante_desespero',
  ev40: 'fiel',
  ev41: 'crista',
  ev42: 'valente',
  ev43: 'gigante_desespero',
  ev45: 'madame_bolha',
  ev49: 'grande_coracao',
  ev53: 'vigilante',
  ev55: 'vigilante',
  ev57: 'gigante_desespero',
  ev61: 'misericordia',
  ev65: 'cristao',
};

const villainEvents = ['ev6', 'ev7', 'ev8', 'ev9', 'ev10', 'ev26', 'ev27', 'ev28', 'ev29', 'ev30', 'ev31', 'ev43', 'ev44', 'ev48', 'ev60'];

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

    // Play suspense first for dramatic events
    const isVillain = villainEvents.includes(event.id);
    const hasCharacter = !!eventCharacterMap[event.id];

    if (hasCharacter) {
      playGameSfx('suspense');
      setTimeout(() => {
        playGameSfx(isVillain ? 'charRevealVillain' : 'charRevealAlly');
      }, 500);
    }

    // Play event-type sound
    if (event.type === 'challenge') {
      setTimeout(() => playChallengeEvent(), hasCharacter ? 800 : 0);
      if (challengeResult === 'win') setTimeout(playChallengeWin, hasCharacter ? 1400 : 600);
      else if (challengeResult === 'fail') setTimeout(playChallengeFail, hasCharacter ? 1400 : 600);
    } else if (['advance', 'boost', 'safe', 'shield'].includes(event.type)) {
      setTimeout(() => playPositiveEvent(), hasCharacter ? 800 : 0);
    } else if (['retreat', 'steal', 'swap'].includes(event.type)) {
      setTimeout(() => playNegativeEvent(), hasCharacter ? 800 : 0);
    } else if (event.type === 'stun') {
      setTimeout(() => playStun(), hasCharacter ? 800 : 0);
    }

    setTimeout(() => setPhase('show'), 100);
    const autoClose = setTimeout(() => {
      setPhase('exit');
      setTimeout(onClose, 500);
    }, hasCharacter ? 5500 : 3500);
    return () => clearTimeout(autoClose);
  }, [event]);

  if (!event) return null;

  const isPositive = ['advance', 'boost', 'safe', 'shield'].includes(event.type);
  const isNegative = ['retreat', 'stun', 'steal'].includes(event.type);
  const isChallenge = event.type === 'challenge';
  const isVillain = villainEvents.includes(event.id);

  const charImg = eventCharacterMap[event.id] ? characterImages[eventCharacterMap[event.id]] : null;

  const accentColor = isPositive
    ? 'hsl(140 60% 50%)'
    : isNegative
    ? 'hsl(0 70% 55%)'
    : isChallenge
    ? 'hsl(40 80% 55%)'
    : 'hsl(40 60% 55%)';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500
        ${phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0' : 'opacity-100'}
      `}
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.8)' }}
      onClick={() => { setPhase('exit'); setTimeout(onClose, 500); }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1.5 + Math.random() * 2.5}px`,
              height: `${1.5 + Math.random() * 2.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: isNegative
                ? `hsl(0 60% 60% / ${0.3 + Math.random() * 0.3})`
                : `hsl(40 70% 60% / ${0.3 + Math.random() * 0.3})`,
              animation: `pilgrimDust ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative w-full max-w-sm mx-4 space-y-4 transition-all duration-600
          ${phase === 'show' ? 'scale-100 translate-y-0' : 'scale-85 translate-y-12'}
        `}
      >
        {/* Character image — floating, no frame */}
        {charImg && (
          <div className="flex justify-center mb-2" style={{ animation: 'charRevealIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <div className="relative">
              <img
                src={charImg}
                alt={event.title}
                className="w-44 h-56 md:w-52 md:h-64 object-cover object-top"
                style={{
                  border: 'none',
                  borderRadius: '0',
                  filter: `contrast(1.1) brightness(1.05) drop-shadow(0 0 30px ${accentColor}40)`,
                  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                }}
              />
              {/* Glow behind */}
              <div className="absolute inset-0 -z-10 blur-3xl scale-150" style={{
                background: `radial-gradient(ellipse at center 40%, ${accentColor}20 0%, transparent 70%)`,
              }} />
            </div>
          </div>
        )}

        {/* Event emoji — if no character */}
        {!charImg && (
          <div className="text-center">
            <span className="text-7xl block mb-2 drop-shadow-lg" style={{
              animation: 'pulse 2s infinite',
            }}>
              {event.emoji}
            </span>
          </div>
        )}

        {/* Card content */}
        <div className="rounded-2xl p-5 space-y-3" style={{
          background: isNegative
            ? 'linear-gradient(180deg, hsl(0 20% 10% / 0.95), hsl(0 10% 8% / 0.95))'
            : isPositive
            ? 'linear-gradient(180deg, hsl(140 15% 10% / 0.95), hsl(120 10% 8% / 0.95))'
            : 'linear-gradient(180deg, hsl(40 15% 12% / 0.95), hsl(30 10% 8% / 0.95))',
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 40px ${accentColor}15, 0 20px 40px rgba(0,0,0,0.5)`,
        }}>
          {/* Title */}
          <h3 className="font-display text-xl text-center leading-tight" style={{
            color: accentColor,
            textShadow: `0 0 20px ${accentColor}40`,
          }}>
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-center leading-relaxed" style={{ color: 'hsl(38 30% 75%)' }}>
            {event.description}
          </p>

          {/* Dice value */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs" style={{ color: 'hsl(30 15% 50%)' }}>🎲 {playerName} tirou</span>
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg font-bold text-lg" style={{
              background: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}>
              {diceValue}
            </span>
          </div>

          {/* Challenge result */}
          {isChallenge && challengeResult && (
            <div className="text-center py-2.5 rounded-xl" style={{
              background: challengeResult === 'win' ? 'hsl(140 50% 20% / 0.3)' : 'hsl(0 50% 20% / 0.3)',
              border: challengeResult === 'win' ? '1px solid hsl(140 60% 50% / 0.3)' : '1px solid hsl(0 60% 50% / 0.3)',
            }}>
              <p className="text-sm font-display font-medium" style={{
                color: challengeResult === 'win' ? 'hsl(140 60% 60%)' : 'hsl(0 60% 60%)',
              }}>
                {challengeResult === 'win' ? '✨ Desafio Superado!' : '💔 Falhou no Desafio'}
              </p>
            </div>
          )}

          {/* Effect summary */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-[10px]">
            {event.effect.positions && event.effect.positions > 0 && (
              <span className="px-2.5 py-1 rounded-full" style={{ background: 'hsl(140 50% 20% / 0.3)', color: 'hsl(140 60% 60%)' }}>
                +{event.effect.positions} casas
              </span>
            )}
            {event.effect.positions && event.effect.positions < 0 && (
              <span className="px-2.5 py-1 rounded-full" style={{ background: 'hsl(0 50% 20% / 0.3)', color: 'hsl(0 60% 60%)' }}>
                {event.effect.positions} casas
              </span>
            )}
            {event.effect.stunTurns && (
              <span className="px-2.5 py-1 rounded-full" style={{ background: 'hsl(280 40% 20% / 0.3)', color: 'hsl(280 50% 65%)' }}>
                😵 Perde {event.effect.stunTurns} rodada(s)
              </span>
            )}
            {event.effect.attribute && event.effect.amount && (
              <span className="px-2.5 py-1 rounded-full" style={{
                background: event.effect.amount > 0 ? 'hsl(200 50% 20% / 0.3)' : 'hsl(0 50% 20% / 0.3)',
                color: event.effect.amount > 0 ? 'hsl(200 60% 60%)' : 'hsl(0 60% 60%)',
              }}>
                {event.effect.amount > 0 ? '+' : ''}{event.effect.amount} {event.effect.attribute}
              </span>
            )}
          </div>
        </div>

        {/* Tap hint */}
        <p className="text-[9px] text-center uppercase tracking-widest" style={{ color: 'hsl(0 0% 40%)', animation: 'charRevealName 0.5s ease-out 1.5s both' }}>
          toque para fechar
        </p>
      </div>
    </div>
  );
}
