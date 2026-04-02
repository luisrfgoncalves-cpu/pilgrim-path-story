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
      <div
        className={`relative w-full h-full max-h-[100dvh] flex flex-col overflow-y-auto transition-all duration-600
          ${phase === 'show' ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'}
        `}
        style={{
          background: isNegative
            ? 'linear-gradient(180deg, hsl(0 20% 10%), hsl(0 10% 6%))'
            : isPositive
            ? 'linear-gradient(180deg, hsl(140 15% 10%), hsl(120 10% 6%))'
            : 'linear-gradient(180deg, hsl(40 15% 12%), hsl(30 10% 6%))',
        }}
      >
        {/* Character image */}
        {charImg && (
          <div className="flex justify-center pt-8 pb-2 flex-shrink-0" style={{ animation: 'charRevealIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <div className="relative">
              <img
                src={charImg}
                alt={event.title}
                className="w-52 h-64 md:w-60 md:h-72 object-cover object-top"
                style={{
                  filter: `contrast(1.1) brightness(1.05) drop-shadow(0 0 30px ${accentColor}40)`,
                  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                }}
              />
            </div>
          </div>
        )}

        {/* Card content — fullscreen with large fonts */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-5 text-center">
          <h3 className="font-display text-2xl leading-tight" style={{
            color: accentColor,
            textShadow: `0 2px 12px ${accentColor}40`,
          }}>
            {event.title}
          </h3>

          <p className="text-xl leading-relaxed max-w-md" style={{ 
            color: 'hsl(38 30% 85%)',
            lineHeight: '1.7',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            {event.description}
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="text-sm" style={{ color: 'hsl(30 15% 55%)' }}>{playerName} tirou</span>
            <span className="inline-flex items-center justify-center min-w-16 h-11 rounded-xl px-4 font-bold text-xl" style={{
              background: `${accentColor}20`,
              color: accentColor,
              border: `2px solid ${accentColor}30`,
            }}>
              {diceValue}
            </span>
          </div>

          {isChallenge && challengeResult && (
            <div className="text-center py-3 px-6 rounded-xl" style={{
              background: challengeResult === 'win' ? 'hsl(140 50% 20% / 0.3)' : 'hsl(0 50% 20% / 0.3)',
              border: challengeResult === 'win' ? '2px solid hsl(140 60% 50% / 0.3)' : '2px solid hsl(0 60% 50% / 0.3)',
            }}>
              <p className="text-lg font-display font-bold" style={{
                color: challengeResult === 'win' ? 'hsl(140 60% 65%)' : 'hsl(0 60% 65%)',
              }}>
                {challengeResult === 'win' ? 'Desafio superado' : 'Desafio não concluído'}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
            {event.effect.positions && event.effect.positions > 0 && (
              <span className="px-4 py-2 rounded-full font-display font-bold" style={{ background: 'hsl(140 50% 20% / 0.3)', color: 'hsl(140 60% 65%)' }}>
                +{event.effect.positions} casas
              </span>
            )}
            {event.effect.positions && event.effect.positions < 0 && (
              <span className="px-4 py-2 rounded-full font-display font-bold" style={{ background: 'hsl(0 50% 20% / 0.3)', color: 'hsl(0 60% 65%)' }}>
                {event.effect.positions} casas
              </span>
            )}
            {event.effect.stunTurns && (
              <span className="px-4 py-2 rounded-full font-display font-bold" style={{ background: 'hsl(280 40% 20% / 0.3)', color: 'hsl(280 50% 70%)' }}>
                Perde {event.effect.stunTurns} rodada(s)
              </span>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => { setPhase('exit'); setTimeout(onClose, 500); }}
            className="mt-4 px-8 py-3 rounded-xl font-display font-bold text-base transition-all active:scale-95"
            style={{
              background: `${accentColor}20`,
              border: `2px solid ${accentColor}50`,
              color: accentColor,
            }}
          >
            Continuar ▸
          </button>
        </div>
      </div>
    </div>
  );
}
