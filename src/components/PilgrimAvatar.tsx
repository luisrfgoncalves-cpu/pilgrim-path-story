import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { EmotionalTone } from '@/lib/emotionalIntensity';

import avatarBurdened from '@/assets/avatar-burdened.png';
import avatarStanding from '@/assets/avatar-standing.png';
import avatarAdvancing from '@/assets/avatar-advancing.png';
import avatarRadiant from '@/assets/avatar-radiant.png';

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

const postureAssets: Record<PostureState, string> = {
  burdened: avatarBurdened,
  standing: avatarStanding,
  advancing: avatarAdvancing,
  radiant: avatarRadiant,
};

const postureLabels: Record<PostureState, string> = {
  burdened: 'Abatido',
  standing: 'Peregrino',
  advancing: 'Firme',
  radiant: 'Radiante',
};

const PilgrimAvatar = ({ attributes, tone = 'neutral', size = 'sm', className = '', showLabel = false }: PilgrimAvatarProps) => {
  const { fe, coragem, perseveranca, discernimento } = attributes;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;
  const posture = getPosture(avg);

  const visual = useMemo(() => {
    if (posture === 'radiant') return { glow: 'shadow-[0_0_24px_hsl(var(--primary)/0.5)]', ring: 'ring-2 ring-primary', overlay: 'bg-primary/10' };
    if (posture === 'advancing') return { glow: 'shadow-[0_0_12px_hsl(var(--primary)/0.25)]', ring: 'ring-1 ring-primary/50', overlay: '' };
    if (posture === 'standing') return { glow: '', ring: 'ring-1 ring-border', overlay: '' };
    return { glow: '', ring: 'ring-1 ring-destructive/30', overlay: 'bg-destructive/5' };
  }, [posture]);

  const dims = size === 'lg' ? 'w-28 h-28' : size === 'md' ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className={`relative flex flex-col items-center gap-1 ${className}`}>
      <div className={`${dims} rounded-full ${visual.ring} ${visual.glow} flex items-center justify-center transition-all duration-700 overflow-hidden relative bg-card`}>
        <img
          src={postureAssets[posture]}
          alt={postureLabels[posture]}
          className="w-full h-full object-cover object-top transition-opacity duration-500"
          width={512}
          height={512}
        />

        {/* Subtle overlay for tone */}
        {visual.overlay && (
          <div className={`absolute inset-0 rounded-full ${visual.overlay} pointer-events-none`} />
        )}

        {/* Radiant pulse */}
        {posture === 'radiant' && (
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Heavy vignette */}
        {posture === 'burdened' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
        )}
      </div>

      {(showLabel || size === 'md' || size === 'lg') && (
        <span className={`uppercase tracking-wider mt-1 ${size === 'lg' ? 'text-xs text-foreground/70 font-medium' : 'text-[9px] text-muted-foreground'}`}>
          {postureLabels[posture]}
        </span>
      )}
    </div>
  );
};

export default PilgrimAvatar;
