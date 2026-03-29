import { useMemo, useState, useEffect, useRef } from 'react';
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

import pilgrimFBurdened from '@/assets/pilgrim-f-burdened.png';
import pilgrimFDoubt from '@/assets/pilgrim-f-doubt.png';
import pilgrimFStanding from '@/assets/pilgrim-f-standing.png';
import pilgrimFAdvancing from '@/assets/pilgrim-f-advancing.png';
import pilgrimFRadiant from '@/assets/pilgrim-f-radiant.png';
import pilgrimFDifficulty from '@/assets/pilgrim-f-difficulty.png';
import pilgrimFFree from '@/assets/pilgrim-f-free.png';
import pilgrimFConflict from '@/assets/pilgrim-f-conflict.png';
import pilgrimFRecovery from '@/assets/pilgrim-f-recovery.png';

interface PilgrimAvatarProps {
  attributes: PlayerAttributes;
  tone?: EmotionalTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  /** Story flag that can override posture (e.g. 'livre' after the cross) */
  storyFlag?: string;
  /** Which campaign — determines male (part1) or female (part2) avatar */
  campaign?: 'part1' | 'part2';
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
  if (storyFlag === 'conflito') return 'em_conflito';

  // Tone + attribute combos
  if (tone === 'heavy' && avg < 3.5) return 'abatido';
  if (tone === 'heavy' && avg < 5) return 'em_dificuldade';
  if (tone === 'heavy') return 'em_conflito';

  if (tone === 'hopeful' && avg >= 8) return 'vitoria_final';
  if (tone === 'hopeful' && avg >= 6) return 'esperancoso';
  if (tone === 'hopeful') return 'recuperacao';

  // Neutral — pure attribute-based
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

const postureAssetsFemale: Record<PostureState, string> = {
  abatido: pilgrimFBurdened,
  confuso: pilgrimFDoubt,
  determinado: pilgrimFStanding,
  em_dificuldade: pilgrimFDifficulty,
  esperancoso: pilgrimFAdvancing,
  livre: pilgrimFFree,
  em_conflito: pilgrimFConflict,
  recuperacao: pilgrimFRecovery,
  vitoria_final: pilgrimFRadiant,
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

const PilgrimAvatar = ({ attributes, tone = 'neutral', size = 'sm', className = '', showLabel = false, storyFlag, campaign = 'part1' }: PilgrimAvatarProps) => {
  const { fe, coragem, perseveranca, discernimento } = attributes;
  const avg = (fe + coragem + perseveranca + discernimento) / 4;
  const posture = resolvePosture(avg, tone, storyFlag);
  const assets = campaign === 'part2' ? postureAssetsFemale : postureAssets;

  // Track previous posture for crossfade
  const [displayedPosture, setDisplayedPosture] = useState(posture);
  const [prevPosture, setPrevPosture] = useState<PostureState | null>(null);
  const [crossfading, setCrossfading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (posture !== displayedPosture && !crossfading) {
      // Start crossfade: show both images, fade out old, fade in new
      setPrevPosture(displayedPosture);
      setCrossfading(true);

      timeoutRef.current = setTimeout(() => {
        setDisplayedPosture(posture);
        setCrossfading(false);
        setPrevPosture(null);
      }, 1200); // crossfade duration
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [posture, displayedPosture, crossfading]);

  // Use the target posture for visual styling (so lighting transitions immediately)
  const activePosture = crossfading ? posture : displayedPosture;

  const visual = useMemo(() => {
    switch (activePosture) {
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
  }, [activePosture]);

  const sizeConfig = {
    sm: { container: 'w-10 h-10', rounded: 'rounded-full', showParticles: false },
    md: { container: 'w-24 h-24', rounded: 'rounded-2xl', showParticles: false },
    lg: { container: 'w-56 h-72', rounded: 'rounded-2xl', showParticles: true },
  }[size];

  const enableAnimations = size === 'md' || size === 'lg';

  const imgStyle = (p: PostureState) => ({
    objectPosition: size === 'sm' ? 'center 15%' : 'center 10%',
    ...(enableAnimations ? {
      animation: `pilgrimBreathe ${breatheDuration[p]} ease-in-out infinite, pilgrimSway ${swayDuration[p]} ease-in-out infinite`,
      transformOrigin: 'center bottom',
    } : {}),
  });

  return (
    <div className={`relative flex flex-col items-center gap-1.5 ${className}`}>
      <div className={`${sizeConfig.container} ${sizeConfig.rounded} ${visual.border} ${visual.shadow} overflow-hidden relative bg-card transition-all duration-[1200ms] ease-in-out`}>

        {/* Previous image (fading out during crossfade) */}
        {crossfading && prevPosture && (
          <img
            src={assets[prevPosture]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${size === 'lg' ? 'scale-110' : ''}`}
            style={{ ...imgStyle(prevPosture), opacity: 0 }}
            width={512}
            height={768}
          />
        )}

        {/* Current image (fading in during crossfade, or fully visible) */}
        <img
          src={assets[crossfading ? posture : displayedPosture]}
          alt={postureLabels[activePosture]}
          className={`w-full h-full object-cover transition-all duration-[1200ms] ease-in-out ${visual.overlayClass} ${size === 'lg' ? 'scale-110' : ''}`}
          style={{
            ...imgStyle(activePosture),
            opacity: crossfading ? 0 : 1,
          }}
          width={512}
          height={768}
          onLoad={(e) => {
            // Trigger fade-in after image loads
            if (crossfading) {
              requestAnimationFrame(() => {
                (e.target as HTMLImageElement).style.opacity = '1';
              });
            }
          }}
        />

        {/* Vignette */}
        {(size === 'lg' || size === 'md') && (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-[1500ms]"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at center 35%, transparent 40%, hsl(var(--background) / 0.7) 100%)',
            }}
          />
        )}

        {/* Victory glow pulse */}
        <div className={`absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-[1500ms] ${activePosture === 'vitoria_final' ? 'opacity-100 animate-[pulse_3s_ease-in-out_infinite]' : 'opacity-0'}`} />

        {/* Free state — golden warmth overlay */}
        <div className={`absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-[1500ms] ${activePosture === 'livre' ? 'opacity-100' : 'opacity-0'}`} />

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
        <span className={`uppercase tracking-widest font-medium transition-all duration-[1200ms] ${
          size === 'lg' ? 'text-xs text-foreground/80' : 'text-[9px] text-muted-foreground'
        }`}>
          {postureLabels[activePosture]}
        </span>
      )}
    </div>
  );
};

export default PilgrimAvatar;
