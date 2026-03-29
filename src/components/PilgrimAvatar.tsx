import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { EmotionalTone } from '@/lib/emotionalIntensity';

interface PilgrimAvatarProps {
  attributes: PlayerAttributes;
  tone?: EmotionalTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

type PostureState = 'burdened' | 'standing' | 'advancing' | 'radiant';

const getPosture = (avg: number): PostureState => {
  if (avg >= 8) return 'radiant';
  if (avg >= 6) return 'advancing';
  if (avg >= 4) return 'standing';
  return 'burdened';
};

const postureConfig: Record<PostureState, { label: string; headY: number; bodyTilt: number; shoulderDrop: number; staffAngle: number }> = {
  burdened:  { label: 'Abatido',   headY: 14, bodyTilt: 8,  shoulderDrop: 3, staffAngle: 15 },
  standing:  { label: 'Peregrino', headY: 12, bodyTilt: 3,  shoulderDrop: 1, staffAngle: 5  },
  advancing: { label: 'Firme',     headY: 11, bodyTilt: 0,  shoulderDrop: 0, staffAngle: 0  },
  radiant:   { label: 'Radiante',  headY: 10, bodyTilt: -2, shoulderDrop: -1, staffAngle: -3 },
};

const PilgrimAvatar = ({ attributes, tone = 'neutral', size = 'sm', className = '', showLabel = false }: PilgrimAvatarProps) => {
  const { fe, coragem, perseveranca, discernimento } = attributes;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;

  const posture = getPosture(avg);
  const cfg = postureConfig[posture];

  const visual = useMemo(() => {
    if (posture === 'radiant') return { glow: 'shadow-[0_0_24px_hsl(var(--primary)/0.6)]', ring: 'ring-2 ring-primary', aura: 'bg-primary/20' };
    if (posture === 'advancing') return { glow: 'shadow-[0_0_12px_hsl(var(--primary)/0.3)]', ring: 'ring-1 ring-primary/60', aura: 'bg-primary/10' };
    if (posture === 'standing') return { glow: '', ring: 'ring-1 ring-border', aura: '' };
    return { glow: '', ring: 'ring-1 ring-destructive/40', aura: 'bg-destructive/5' };
  }, [posture]);

  const toneColor = tone === 'hopeful' ? 'text-primary' : tone === 'heavy' ? 'text-muted-foreground' : 'text-foreground';

  const dims = size === 'lg' ? 'w-28 h-28' : size === 'md' ? 'w-16 h-16' : 'w-10 h-10';
  const iconScale = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-8 h-8' : 'w-5 h-5';

  const shieldOpacity = Math.min(coragem / 12, 1);
  const flameOpacity = Math.min(fe / 12, 1);
  const burdenWeight = posture === 'burdened' ? 0.7 : 0;

  return (
    <div className={`relative flex flex-col items-center gap-1 ${className}`}>
      <div className={`${dims} rounded-full ${visual.ring} ${visual.glow} ${visual.aura} flex items-center justify-center transition-all duration-700 overflow-hidden relative`}>
        <svg
          viewBox="0 0 40 40"
          className={`${iconScale} ${toneColor} transition-all duration-700`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ transform: `rotate(${cfg.bodyTilt}deg)` }}
        >
          {/* Burden pack — visible when burdened */}
          {burdenWeight > 0 && (
            <ellipse cx="22" cy="16" rx="5" ry="4" fill="currentColor" opacity={burdenWeight * 0.25} stroke="none" />
          )}

          {/* Head — moves up as posture improves */}
          <circle cx="20" cy={cfg.headY} r="4.5" fill="currentColor" opacity="0.9" />

          {/* Expression lines */}
          {posture === 'burdened' && (
            <>
              {/* Downcast eyes */}
              <line x1="18.5" y1={cfg.headY + 0.5} x2="19.5" y2={cfg.headY + 1} strokeWidth="0.8" opacity="0.5" />
              <line x1="21.5" y1={cfg.headY + 0.5} x2="20.5" y2={cfg.headY + 1} strokeWidth="0.8" opacity="0.5" />
            </>
          )}
          {posture === 'radiant' && (
            /* Crown / halo */
            <circle cx="20" cy={cfg.headY - 3} r="6" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 2" fill="none" />
          )}

          {/* Neck + Body */}
          <path d={`M20 ${cfg.headY + 4.5} L20 28`} strokeWidth="2" />

          {/* Shoulders — drop when burdened */}
          <path d={`M13 ${21 + cfg.shoulderDrop} L20 20 L27 ${21 + cfg.shoulderDrop}`} strokeWidth="1.5" />

          {/* Staff */}
          <line
            x1="27" y1="9" x2="27" y2="35"
            strokeWidth="1.5"
            opacity="0.7"
            transform={`rotate(${cfg.staffAngle}, 27, 22)`}
          />

          {/* Legs — wider stance when advancing/radiant */}
          <path d={`M20 28 L${posture === 'burdened' ? 17 : 15} 36`} strokeWidth="1.5" />
          <path d={`M20 28 L${posture === 'burdened' ? 23 : 25} 36`} strokeWidth="1.5" />

          {/* Shield glow (coragem) */}
          <circle cx="13" cy={21 + cfg.shoulderDrop} r="3" fill="currentColor" opacity={shieldOpacity * 0.35} />

          {/* Faith flame above head */}
          {flameOpacity > 0.1 && (
            <path
              d={`M20 ${cfg.headY - 5} Q${18 - flameOpacity} ${cfg.headY - 9} 20 ${cfg.headY - 12} Q${22 + flameOpacity} ${cfg.headY - 9} 20 ${cfg.headY - 5}`}
              fill="currentColor"
              opacity={flameOpacity * 0.5}
              stroke="none"
            />
          )}

          {/* Perseverance ground marks */}
          {perseveranca >= 7 && (
            <>
              <line x1="12" y1="37" x2="28" y2="37" strokeWidth="0.5" opacity="0.2" />
              <line x1="14" y1="38" x2="26" y2="38" strokeWidth="0.4" opacity="0.15" />
            </>
          )}
        </svg>

        {/* Aura pulse for radiant */}
        {posture === 'radiant' && (
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-[pulse_3s_ease-in-out_infinite]" />
        )}

        {/* Subtle dark vignette for burdened */}
        {posture === 'burdened' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-destructive/10 to-transparent" />
        )}
      </div>

      {(showLabel || size === 'md' || size === 'lg') && (
        <span className={`uppercase tracking-wider mt-1 ${size === 'lg' ? 'text-xs text-foreground/70 font-medium' : 'text-[9px] text-muted-foreground'}`}>
          {cfg.label}
        </span>
      )}
    </div>
  );
};

export default PilgrimAvatar;
