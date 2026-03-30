import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TileType, TILE_TYPES } from './ImmersiveBoardTypes';
import { characterImages } from '@/data/characterImages';
import {
  playPositiveEvent, playNegativeEvent, playChallengeEvent,
  playStun, playMove, playVictory,
} from './BoardSounds';

// Map tile types to character images and sound categories
const TILE_CHARACTER_MAP: Record<string, string> = {
  giant: 'gigante_desespero',
  challenge: 'apolion',
  trap: 'desconfianca',
  shield: 'grande_coracao',
  blessing: 'evangelista',
  scripture: 'interprete',
  refuge: 'auxilio',
  surprise: 'falador',
  swap: 'fiel',
  double_dice: 'esperanca',
  current: 'cristao',
  checkpoint: 'pastores',
  start: 'cristao',
  finish: 'esperanca',
};

// Sound category per tile type
type SoundCategory = 'positive' | 'negative' | 'challenge' | 'stun' | 'neutral' | 'victory';
const TILE_SOUND_MAP: Record<string, SoundCategory> = {
  refuge: 'positive',
  blessing: 'positive',
  shield: 'positive',
  double_dice: 'positive',
  checkpoint: 'positive',
  scripture: 'challenge',
  challenge: 'challenge',
  surprise: 'neutral',
  swap: 'neutral',
  current: 'neutral',
  trap: 'negative',
  giant: 'stun',
  finish: 'victory',
};

function playSoundForTile(tileType: TileType) {
  const cat = TILE_SOUND_MAP[tileType] || 'neutral';
  switch (cat) {
    case 'positive': playPositiveEvent(); break;
    case 'negative': playNegativeEvent(); break;
    case 'challenge': playChallengeEvent(); break;
    case 'stun': playStun(); break;
    case 'victory': playVictory(); break;
    default: playMove(); break;
  }
}

interface TileEventPopupProps {
  visible: boolean;
  tileType: TileType;
  message: string;
  emoji: string;
  playerName?: string;
  onDismiss: () => void;
}

export default function TileEventPopup({ visible, tileType, message, emoji, playerName, onDismiss }: TileEventPopupProps) {
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (visible && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playSoundForTile(tileType);
    }
    if (!visible) hasPlayedSound.current = false;
  }, [visible, tileType]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  if (!visible) return null;

  const config = TILE_TYPES[tileType] || TILE_TYPES.normal;
  const charKey = TILE_CHARACTER_MAP[tileType];
  const charImg = charKey ? characterImages[charKey] : null;

  // Determine visual mood
  const isPositive = ['refuge', 'blessing', 'shield', 'double_dice', 'checkpoint', 'finish'].includes(tileType);
  const isNegative = ['trap', 'giant'].includes(tileType);
  const isChallenge = ['challenge', 'scripture'].includes(tileType);

  const borderColor = isNegative
    ? 'hsl(0 60% 45%)'
    : isPositive
    ? 'hsl(45 70% 50%)'
    : isChallenge
    ? 'hsl(25 80% 50%)'
    : 'hsl(210 40% 50%)';

  const bgGradient = isNegative
    ? 'linear-gradient(135deg, hsl(0 30% 12%), hsl(0 20% 8%))'
    : isPositive
    ? 'linear-gradient(135deg, hsl(40 30% 14%), hsl(35 20% 8%))'
    : isChallenge
    ? 'linear-gradient(135deg, hsl(25 30% 14%), hsl(20 15% 8%))'
    : 'linear-gradient(135deg, hsl(220 20% 14%), hsl(220 15% 8%))';

  const glowColor = isNegative
    ? 'rgba(220,40,40,0.3)'
    : isPositive
    ? 'rgba(255,215,0,0.3)'
    : isChallenge
    ? 'rgba(255,140,40,0.3)'
    : 'rgba(100,160,255,0.2)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: bgGradient,
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 60px ${glowColor}, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <X className="w-4 h-4 text-white/70" />
        </button>

        {/* Character image */}
        {charImg && (
          <div className="relative w-full h-40 overflow-hidden">
            <img
              src={charImg}
              alt={config.label}
              className="w-full h-full object-cover"
              style={{
                filter: isNegative ? 'saturate(1.3) contrast(1.1)' : 'saturate(1.2) brightness(1.1)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${isNegative ? 'hsl(0 30% 12%)' : isPositive ? 'hsl(40 30% 14%)' : 'hsl(220 20% 14%)'} 0%, transparent 60%)`,
              }}
            />
            {/* Pulsing vignette for negative */}
            {isNegative && (
              <div className="absolute inset-0 animate-pulse" style={{
                background: 'radial-gradient(circle, transparent 40%, rgba(150,0,0,0.3) 100%)',
              }} />
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 text-center space-y-3">
          {/* Big emoji */}
          <div className="text-5xl" style={{
            filter: `drop-shadow(0 0 12px ${glowColor})`,
            animation: isNegative ? 'pulse 1.5s infinite' : isPositive ? 'bounce 2s infinite' : undefined,
          }}>
            {emoji}
          </div>

          {/* Tile type label */}
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-display uppercase tracking-widest"
            style={{
              background: `${borderColor}20`,
              border: `1px solid ${borderColor}60`,
              color: borderColor,
            }}
          >
            {config.label}
          </div>

          {/* Player name */}
          {playerName && (
            <p className="text-sm text-white/50 font-medium">{playerName}</p>
          )}

          {/* Message */}
          <p className="text-base font-display leading-relaxed" style={{
            color: isNegative ? 'hsl(0 60% 75%)' : isPositive ? 'hsl(45 80% 80%)' : 'hsl(0 0% 88%)',
            textShadow: `0 0 15px ${glowColor}`,
          }}>
            {message}
          </p>

          {/* Description */}
          <p className="text-xs text-white/40 italic">{config.description}</p>

          {/* Tap to dismiss */}
          <p className="text-[10px] text-white/25 mt-2">Toque para fechar</p>
        </div>
      </div>
    </div>
  );
}
