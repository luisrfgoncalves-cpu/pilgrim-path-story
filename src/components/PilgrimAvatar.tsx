import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { EmotionalTone } from '@/lib/emotionalIntensity';

interface PilgrimAvatarProps {
  attributes: PlayerAttributes;
  tone?: EmotionalTone;
  size?: 'sm' | 'md';
  className?: string;
}

const PilgrimAvatar = ({ attributes, tone = 'neutral', size = 'sm', className = '' }: PilgrimAvatarProps) => {
  const { fe, coragem, perseveranca, discernimento } = attributes;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;

  // Avatar visual state based on attributes
  const state = useMemo(() => {
    if (avg >= 8) return { label: 'Radiante', glow: 'shadow-[0_0_20px_hsl(var(--primary)/0.6)]', ring: 'ring-2 ring-primary', aura: 'bg-primary/20' };
    if (avg >= 6) return { label: 'Firme', glow: 'shadow-[0_0_10px_hsl(var(--primary)/0.3)]', ring: 'ring-1 ring-primary/50', aura: 'bg-primary/10' };
    if (avg >= 4) return { label: 'Peregrino', glow: '', ring: 'ring-1 ring-border', aura: '' };
    return { label: 'Abatido', glow: '', ring: 'ring-1 ring-destructive/30', aura: 'bg-destructive/5' };
  }, [avg]);

  // Body color based on emotional tone
  const toneColor = tone === 'hopeful' ? 'text-primary' : tone === 'heavy' ? 'text-muted-foreground' : 'text-foreground';

  const dims = size === 'sm' ? 'w-10 h-10' : 'w-16 h-16';
  const iconScale = size === 'sm' ? 'w-5 h-5' : 'w-8 h-8';

  // Shield strength based on coragem
  const shieldOpacity = Math.min(coragem / 12, 1);
  // Flame intensity based on fé
  const flameOpacity = Math.min(fe / 12, 1);

  return (
    <div className={`relative flex flex-col items-center gap-0.5 ${className}`}>
      <div className={`${dims} rounded-full ${state.ring} ${state.glow} ${state.aura} flex items-center justify-center transition-all duration-700 overflow-hidden relative`}>
        {/* Pilgrim SVG icon */}
        <svg viewBox="0 0 40 40" className={`${iconScale} ${toneColor} transition-colors duration-500`} fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Head */}
          <circle cx="20" cy="12" r="5" fill="currentColor" opacity="0.9" />
          {/* Body */}
          <path d="M20 17 L20 28" strokeWidth="2" />
          {/* Arms */}
          <path d="M14 22 L20 20 L26 22" strokeWidth="1.5" />
          {/* Staff */}
          <line x1="26" y1="10" x2="26" y2="34" strokeWidth="1.5" opacity="0.7" />
          {/* Legs */}
          <path d="M20 28 L16 35" strokeWidth="1.5" />
          <path d="M20 28 L24 35" strokeWidth="1.5" />
          {/* Shield glow (coragem) */}
          <circle cx="14" cy="22" r="3" fill="currentColor" opacity={shieldOpacity * 0.3} />
          {/* Faith flame */}
          <path d="M20 6 Q18 3 20 1 Q22 3 20 6" fill="currentColor" opacity={flameOpacity * 0.6} />
        </svg>

        {/* Aura pulse for high attributes */}
        {avg >= 8 && (
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-[pulse_3s_ease-in-out_infinite]" />
        )}
      </div>

      {size === 'md' && (
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">{state.label}</span>
      )}
    </div>
  );
};

export default PilgrimAvatar;
