import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { EmotionalTone } from '@/lib/emotionalIntensity';

import pilgrimBurdened from '@/assets/pilgrim-burdened.png';
import pilgrimDoubt from '@/assets/pilgrim-doubt.png';
import pilgrimStanding from '@/assets/pilgrim-standing.png';
import pilgrimAdvancing from '@/assets/pilgrim-advancing.png';
import pilgrimRadiant from '@/assets/pilgrim-radiant.png';

interface PilgrimAvatarProps {
  attributes: PlayerAttributes;
  tone?: EmotionalTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

type PostureState = 'burdened' | 'doubt' | 'standing' | 'advancing' | 'radiant';

const getPosture = (avg: number): PostureState => {
  if (avg >= 8) return 'radiant';
  if (avg >= 6.5) return 'advancing';
  if (avg >= 5) return 'standing';
  if (avg >= 3.5) return 'doubt';
  return 'burdened';
};

const postureAssets: Record<PostureState, string> = {
  burdened: pilgrimBurdened,
  doubt: pilgrimDoubt,
  standing: pilgrimStanding,
  advancing: pilgrimAdvancing,
  radiant: pilgrimRadiant,
};

const postureLabels: Record<PostureState, string> = {
  burdened: 'Abatido',
  doubt: 'Em Dúvida',
  standing: 'Peregrino',
  advancing: 'Firme',
  radiant: 'Radiante',
};

/* Breathing speed varies by posture — burdened breathes heavier/slower */
const breatheDuration: Record<PostureState, string> = {
  burdened: '5s',
  doubt: '4.5s',
  standing: '4s',
  advancing: '3.8s',
  radiant: '4.2s',
};

const swayDuration: Record<PostureState, string> = {
  burdened: '7s',
  doubt: '6s',
  standing: '8s',
  advancing: '5s',
  radiant: '6s',
};

const PilgrimAvatar = ({ attributes, tone = 'neutral', size = 'sm', className = '', showLabel = false }: PilgrimAvatarProps) => {
  const { fe, coragem, perseveranca, discernimento } = attributes;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;
  const posture = getPosture(avg);

  const visual = useMemo(() => {
    switch (posture) {
      case 'radiant':
        return { border: 'ring-2 ring-primary', shadow: 'shadow-[0_0_30px_hsl(var(--primary)/0.4)]', overlayClass: '' };
      case 'advancing':
        return { border: 'ring-1 ring-primary/60', shadow: 'shadow-[0_0_16px_hsl(var(--primary)/0.2)]', overlayClass: '' };
      case 'standing':
        return { border: 'ring-1 ring-border', shadow: '', overlayClass: '' };
      case 'doubt':
        return { border: 'ring-1 ring-muted-foreground/30', shadow: '', overlayClass: 'brightness-90' };
      case 'burdened':
        return { border: 'ring-1 ring-destructive/30', shadow: '', overlayClass: 'brightness-[0.8] saturate-[0.7]' };
    }
  }, [posture]);

  const sizeConfig = {
    sm: { container: 'w-10 h-10', rounded: 'rounded-full', showParticles: false },
    md: { container: 'w-24 h-24', rounded: 'rounded-2xl', showParticles: false },
    lg: { container: 'w-56 h-72', rounded: 'rounded-2xl', showParticles: true },
  }[size];

  const enableAnimations = size === 'md' || size === 'lg';

  return (
    <div className={`relative flex flex-col items-center gap-1.5 ${className}`}>
      <div className={`${sizeConfig.container} ${sizeConfig.rounded} ${visual.border} ${visual.shadow} overflow-hidden relative bg-card transition-all duration-700`}>
        {/* Avatar image with breathing + sway animations */}
        <img
          src={postureAssets[posture]}
          alt={postureLabels[posture]}
          className={`w-full h-full object-cover transition-all duration-700 ${visual.overlayClass}`}
          style={{
            objectPosition: size === 'sm' ? 'center 15%' : 'center 20%',
            ...(enableAnimations ? {
              animation: `pilgrimBreathe ${breatheDuration[posture]} ease-in-out infinite, pilgrimSway ${swayDuration[posture]} ease-in-out infinite`,
              transformOrigin: 'center bottom',
            } : {}),
          }}
          width={512}
          height={768}
        />

        {/* Radiant glow pulse */}
        {posture === 'radiant' && (
          <div className="absolute inset-0 bg-primary/10 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Ambient dust particles — only on lg */}
        {sizeConfig.showParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-primary/30"
                style={{
                  width: `${1.5 + Math.random() * 2}px`,
                  height: `${1.5 + Math.random() * 2}px`,
                  left: `${10 + (i * 15) % 80}%`,
                  bottom: `${5 + (i * 12) % 40}%`,
                  animation: `pilgrimDust ${4 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.8}s`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom gradient for readability when large */}
        {size === 'lg' && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
        )}
      </div>

      {(showLabel || size === 'md' || size === 'lg') && (
        <span className={`uppercase tracking-widest font-medium ${
          size === 'lg' ? 'text-xs text-foreground/80' : 'text-[9px] text-muted-foreground'
        }`}>
          {postureLabels[posture]}
        </span>
      )}
    </div>
  );
};

export default PilgrimAvatar;
