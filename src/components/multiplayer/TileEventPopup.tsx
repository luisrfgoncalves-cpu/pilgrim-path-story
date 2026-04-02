import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TileType, TILE_TYPES } from './ImmersiveBoardTypes';
import { characterImages } from '@/data/characterImages';
import {
  playPositiveEvent, playNegativeEvent, playChallengeEvent,
  playStun, playMove, playVictory,
  playShieldAcquired, playSwapEvent, playCurrentEvent,
  playSurpriseEvent, playCheckpointEvent, playBackToStartEvent,
} from './BoardSounds';

// Map tile types to character images
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
  back_to_start: 'desconfianca',
};

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
  back_to_start: 'stun',
  finish: 'victory',
};

// Haptic vibration for mobile
function triggerHaptic(pattern: 'negative' | 'stun' | 'positive') {
  if (!navigator.vibrate) return;
  switch (pattern) {
    case 'stun': navigator.vibrate([100, 50, 200, 50, 300]); break;
    case 'negative': navigator.vibrate([150, 80, 150]); break;
    case 'positive': navigator.vibrate([50, 30, 50]); break;
  }
}

function playSoundForTile(tileType: TileType) {
  // Haptic feedback
  const cat = TILE_SOUND_MAP[tileType] || 'neutral';
  if (cat === 'stun') triggerHaptic('stun');
  else if (cat === 'negative') triggerHaptic('negative');
  else if (cat === 'positive') triggerHaptic('positive');

  // Per-tile-type specific sounds for maximum distinction
  switch (tileType) {
    case 'shield': playShieldAcquired(); break;
    case 'swap': playSwapEvent(); break;
    case 'current': playCurrentEvent(); break;
    case 'surprise': playSurpriseEvent(); break;
    case 'checkpoint': playCheckpointEvent(); break;
    case 'back_to_start': playBackToStartEvent(); break;
    case 'finish': playVictory(); break;
    default:
      // Fallback to category-based sounds
      switch (cat) {
        case 'positive': playPositiveEvent(); break;
        case 'negative': playNegativeEvent(); break;
        case 'challenge': playChallengeEvent(); break;
        case 'stun': playStun(); break;
        default: playMove(); break;
      }
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
    if (!visible) {
      hasPlayedSound.current = false;
      return;
    }
    // Play sound immediately on reveal
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playSoundForTile(tileType);
    }
  }, [visible, tileType]);

  // No auto-dismiss — user must tap to close (prevents premature closure)

  if (!visible) return null;

  const config = TILE_TYPES[tileType] || TILE_TYPES.normal;
  const charKey = TILE_CHARACTER_MAP[tileType];
  const charImg = charKey ? characterImages[charKey] : null;

  const isPositive = ['refuge', 'blessing', 'shield', 'double_dice', 'checkpoint', 'finish'].includes(tileType);
  const isNegative = ['trap', 'giant', 'back_to_start'].includes(tileType);
  const isChallenge = ['challenge', 'scripture'].includes(tileType);

  const borderColor = isNegative
    ? 'hsl(0 60% 45%)'
    : isPositive ? 'hsl(45 70% 50%)'
    : isChallenge ? 'hsl(25 80% 50%)'
    : 'hsl(210 40% 50%)';

  const bgGradient = isNegative
    ? 'linear-gradient(135deg, hsl(0 30% 12%), hsl(0 20% 8%))'
    : isPositive ? 'linear-gradient(135deg, hsl(40 30% 14%), hsl(35 20% 8%))'
    : isChallenge ? 'linear-gradient(135deg, hsl(25 30% 14%), hsl(20 15% 8%))'
    : 'linear-gradient(135deg, hsl(220 20% 14%), hsl(220 15% 8%))';

  const glowColor = isNegative
    ? 'rgba(220,40,40,0.3)'
    : isPositive ? 'rgba(255,215,0,0.3)'
    : isChallenge ? 'rgba(255,140,40,0.3)'
    : 'rgba(100,160,255,0.2)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Screen flash for negative events */}
      {isNegative && (
        <div className="absolute inset-0 pointer-events-none" style={{
          animation: 'screenFlash 0.6s ease-out forwards',
          background: 'radial-gradient(circle, rgba(200,0,0,0.3), transparent 70%)',
        }} />
      )}
      {/* Golden glow for positive events */}
      {isPositive && (
        <div className="absolute inset-0 pointer-events-none" style={{
          animation: 'goldenGlow 1.5s ease-out forwards',
          background: 'radial-gradient(circle, rgba(255,215,0,0.15), transparent 60%)',
        }} />
      )}

      {/* Fullscreen popup */}
      {(
        <div
          className="relative w-full h-full max-h-[100dvh] flex flex-col overflow-y-auto"
          style={{
            background: bgGradient,
            animation: 'scaleReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <X className="w-5 h-5 text-white/70" />
          </button>

          {/* Character image */}
          {charImg && (
            <div className="relative w-full h-64 flex-shrink-0 overflow-hidden">
              <img
                src={charImg}
                alt={config.label}
                className="w-full h-full"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center top',
                  filter: isNegative ? 'saturate(1.3) contrast(1.1)' : 'saturate(1.2) brightness(1.1)',
                  background: isNegative ? 'hsl(0 20% 8%)' : isPositive ? 'hsl(40 20% 10%)' : 'hsl(220 15% 10%)',
                }}
              />
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to top, ${isNegative ? 'hsl(0 30% 12%)' : isPositive ? 'hsl(40 30% 14%)' : 'hsl(220 20% 14%)'} 0%, transparent 40%)`,
              }} />
            </div>
          )}

          {/* Tile context image (for non-character tiles) */}
          {!charImg && config.tileImage && (
            <div className="relative w-full h-52 flex-shrink-0 overflow-hidden">
              <img
                src={config.tileImage}
                alt={config.label}
                className="w-full h-full object-cover"
                style={{
                  filter: isNegative ? 'saturate(1.2) contrast(1.1) brightness(0.9)' : 'saturate(1.1) brightness(1.05)',
                }}
              />
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to top, ${isNegative ? 'hsl(0 30% 12%)' : isPositive ? 'hsl(40 30% 14%)' : 'hsl(220 20% 14%)'} 0%, transparent 50%)`,
              }} />
            </div>
          )}

          {/* Content — generous padding and large fonts */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center space-y-5">
            <div className="text-6xl" style={{
              filter: `drop-shadow(0 0 12px ${glowColor})`,
            }}>
              {emoji}
            </div>

            <div
              className="inline-block px-5 py-2 rounded-full text-sm font-display uppercase tracking-widest"
              style={{ background: `${borderColor}20`, border: `1px solid ${borderColor}60`, color: borderColor }}
            >
              {config.label}
            </div>

            {playerName && (
              <p className="text-base text-white/50 font-medium">{playerName}</p>
            )}

            <p className="text-xl font-display leading-relaxed max-w-md" style={{
              color: isNegative ? 'hsl(0 60% 80%)' : isPositive ? 'hsl(45 80% 85%)' : 'hsl(0 0% 92%)',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              lineHeight: '1.7',
            }}>
              {message}
            </p>

            <p className="text-sm text-white/50 italic leading-relaxed max-w-sm">{config.description}</p>

            {/* Dismiss button */}
            <button
              onClick={onDismiss}
              className="mt-4 px-8 py-3 rounded-xl font-display font-bold text-base transition-all active:scale-95"
              style={{
                background: `${borderColor}25`,
                border: `2px solid ${borderColor}60`,
                color: borderColor,
              }}
            >
              Continuar ▸
            </button>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes scaleReveal {
          0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes screenFlash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes goldenGlow {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
