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

  // Size configs: sm for header, md for cards, lg for hero display
  const sizeConfig = {
    sm: { container: 'w-10 h-10', rounded: 'rounded-full' },
    md: { container: 'w-20 h-20', rounded: 'rounded-2xl' },
    lg: { container: 'w-44 h-56', rounded: 'rounded-2xl' },
  }[size];

  return (
    <div className={`relative flex flex-col items-center gap-1.5 ${className}`}>
      <div className={`${sizeConfig.container} ${sizeConfig.rounded} ${visual.border} ${visual.shadow} overflow-hidden relative bg-card transition-all duration-700`}>
        <img
          src={postureAssets[posture]}
          alt={postureLabels[posture]}
          className={`w-full h-full object-cover transition-all duration-700 ${visual.overlayClass}`}
          style={{ objectPosition: size === 'sm' ? 'center 15%' : 'center 20%' }}
          width={512}
          height={768}
        />

        {/* Radiant glow pulse */}
        {posture === 'radiant' && (
          <div className="absolute inset-0 bg-primary/10 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none" />
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
