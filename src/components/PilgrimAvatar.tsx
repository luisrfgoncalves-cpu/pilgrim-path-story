import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { EmotionalTone } from '@/lib/emotionalIntensity';

import pilgrimBurdened from '@/assets/pilgrim-burdened.png';
import pilgrimDoubt from '@/assets/pilgrim-doubt.png';
import pilgrimStanding from '@/assets/pilgrim-standing.png';
import pilgrimAdvancing from '@/assets/pilgrim-advancing.png';
import pilgrimRadiant from '@/assets/pilgrim-radiant.png';
import pilgrimDifficulty from '@/assets/pilgrim-difficulty.png';
import pilgrimFree from '@/assets/pilgrim-free.png';
import pilgrimConflict from '@/assets/pilgrim-conflict.png';
import pilgrimRecovery from '@/assets/pilgrim-recovery.png';

interface PilgrimAvatarProps {
  attributes: PlayerAttributes;
  tone?: EmotionalTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  /** Story flag that can override posture (e.g. 'livre' after the cross) */
  storyFlag?: string;
}

export type PostureState =
  | 'abatido'
  | 'confuso'
  | 'determinado'
  | 'em_dificuldade'
  | 'esperancoso'
  | 'livre'
  | 'em_conflito'
  | 'recuperacao'
  | 'vitoria_final';

/**
 * Resolve posture from attributes average + emotional tone + story flags.
 * Story flags take priority, then tone nuance, then attribute average.
 */
const resolvePosture = (avg: number, tone: EmotionalTone, storyFlag?: string): PostureState => {
  // Story-driven overrides (highest priority)
  if (storyFlag === 'livre') return 'livre';
  if (storyFlag === 'vitoria') return 'vitoria_final';

  // Tone-driven nuances
  if (tone === 'heavy' && avg < 4) return 'abatido';
  if (tone === 'heavy') return 'em_dificuldade';
  if (tone === 'tension' && avg < 5) return 'em_conflito';
  if (tone === 'tension') return 'em_dificuldade';
  if (tone === 'doubt') return 'confuso';
  if (tone === 'hope' && avg >= 7) return 'esperancoso';
  if (tone === 'hope') return 'recuperacao';
  if (tone === 'peace' && avg >= 8) return 'vitoria_final';
  if (tone === 'peace') return 'esperancoso';

  // Attribute-average fallback
  if (avg >= 8.5) return 'vitoria_final';
  if (avg >= 7) return 'esperancoso';
  if (avg >= 5.5) return 'determinado';
  if (avg >= 4) return 'recuperacao';
  if (avg >= 3) return 'confuso';
  return 'abatido';
};

const postureAssets: Record<PostureState, string> = {
  abatido: pilgrimBurdened,
  confuso: pilgrimDoubt,
  determinado: pilgrimStanding,
  em_dificuldade: pilgrimDifficulty,
  esperancoso: pilgrimAdvancing,
  livre: pilgrimFree,
  em_conflito: pilgrimConflict,
  recuperacao: pilgrimRecovery,
  vitoria_final: pilgrimRadiant,
};

const postureLabels: Record<PostureState, string> = {
  abatido: 'Abatido',
  confuso: 'Confuso',
  determinado: 'Determinado',
  em_dificuldade: 'Em Dificuldade',
  esperancoso: 'Esperançoso',
  livre: 'Livre',
  em_conflito: 'Em Conflito',
  recuperacao: 'Recuperação',
  vitoria_final: 'Vitória',
};

const breatheDuration: Record<PostureState, string> = {
  abatido: '5s',
  confuso: '4.5s',
  determinado: '4s',
  em_dificuldade: '5.2s',
  esperancoso: '3.8s',
  livre: '3.5s',
  em_conflito: '4.8s',
  recuperacao: '4.2s',
  vitoria_final: '4.2s',
};

const swayDuration: Record<PostureState, string> = {
  abatido: '7s',
  confuso: '6s',
  determinado: '8s',
  em_dificuldade: '6.5s',
  esperancoso: '5s',
  livre: '5.5s',
  em_conflito: '5.8s',
  recuperacao: '6.5s',
  vitoria_final: '6s',
};

const PilgrimAvatar = ({ attributes, tone = 'neutral', size = 'sm', className = '', showLabel = false, storyFlag }: PilgrimAvatarProps) => {
  const { fe, coragem, perseveranca, discernimento } = attributes;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;
  const posture = resolvePosture(avg, tone, storyFlag);

  const visual = useMemo(() => {
    switch (posture) {
      case 'vitoria_final':
        return { border: 'ring-2 ring-primary', shadow: 'shadow-[0_0_30px_hsl(var(--primary)/0.4)]', overlayClass: '' };
      case 'esperancoso':
      case 'livre':
        return { border: 'ring-1 ring-primary/60', shadow: 'shadow-[0_0_16px_hsl(var(--primary)/0.2)]', overlayClass: '' };
      case 'determinado':
      case 'recuperacao':
        return { border: 'ring-1 ring-border', shadow: '', overlayClass: '' };
      case 'confuso':
        return { border: 'ring-1 ring-muted-foreground/30', shadow: '', overlayClass: 'brightness-90' };
      case 'em_conflito':
        return { border: 'ring-1 ring-destructive/40', shadow: 'shadow-[0_0_12px_hsl(var(--destructive)/0.2)]', overlayClass: 'brightness-[0.85] contrast-[1.1]' };
      case 'em_dificuldade':
        return { border: 'ring-1 ring-destructive/30', shadow: '', overlayClass: 'brightness-[0.8] saturate-[0.8]' };
      case 'abatido':
        return { border: 'ring-1 ring-destructive/30', shadow: '', overlayClass: 'brightness-[0.75] saturate-[0.6]' };
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
          className={`w-full h-full object-cover transition-all duration-700 ${visual.overlayClass} ${size === 'lg' ? 'scale-110' : ''}`}
          style={{
            objectPosition: size === 'sm' ? 'center 15%' : 'center 10%',
            ...(enableAnimations ? {
              animation: `pilgrimBreathe ${breatheDuration[posture]} ease-in-out infinite, pilgrimSway ${swayDuration[posture]} ease-in-out infinite`,
              transformOrigin: 'center bottom',
            } : {}),
          }}
          width={512}
          height={768}
        />

        {/* Vignette */}
        {(size === 'lg' || size === 'md') && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at center 35%, transparent 40%, hsl(var(--background) / 0.7) 100%)',
            }}
          />
        )}

        {/* Victory glow pulse */}
        {posture === 'vitoria_final' && (
          <div className="absolute inset-0 bg-primary/10 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Free state — golden warmth overlay */}
        {posture === 'livre' && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
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
