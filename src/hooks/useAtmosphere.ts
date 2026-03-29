import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { PostureState } from '@/components/PilgrimAvatar';

/**
 * Computes continuous CSS custom properties + filter values
 * based on player attributes AND emotional posture for reactive UI atmosphere.
 */

export interface AtmosphereStyle {
  containerStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  imageStyle: React.CSSProperties;
  vignetteOpacity: number;
  glowOpacity: number;
  wobbleClass: string;
}

/** Per-posture atmosphere modifiers */
const postureModifiers: Record<PostureState, {
  brightnessShift: number;
  saturationShift: number;
  extraBlur: number;
  vignetteBoost: number;
  glowBoost: number;
  hueShift: number;
}> = {
  abatido:        { brightnessShift: -0.12, saturationShift: -0.20, extraBlur: 0.4, vignetteBoost: 0.20, glowBoost: 0,    hueShift: 0 },
  confuso:        { brightnessShift: -0.05, saturationShift: -0.08, extraBlur: 0.8, vignetteBoost: 0.08, glowBoost: 0,    hueShift: 0 },
  determinado:    { brightnessShift:  0.02, saturationShift:  0.05, extraBlur: 0,   vignetteBoost: 0,    glowBoost: 0.02, hueShift: 0 },
  em_dificuldade: { brightnessShift: -0.08, saturationShift: -0.15, extraBlur: 0.2, vignetteBoost: 0.15, glowBoost: 0,    hueShift: 0 },
  esperancoso:    { brightnessShift:  0.10, saturationShift:  0.15, extraBlur: 0,   vignetteBoost: 0,    glowBoost: 0.20, hueShift: 5 },
  livre:          { brightnessShift:  0.15, saturationShift:  0.20, extraBlur: 0,   vignetteBoost: 0,    glowBoost: 0.30, hueShift: 7 },
  em_conflito:    { brightnessShift: -0.06, saturationShift: -0.10, extraBlur: 0,   vignetteBoost: 0.12, glowBoost: 0,    hueShift: -3 },
  recuperacao:    { brightnessShift:  0.04, saturationShift:  0.03, extraBlur: 0,   vignetteBoost: 0.05, glowBoost: 0.10, hueShift: 3 },
  vitoria_final:  { brightnessShift:  0.20, saturationShift:  0.25, extraBlur: 0,   vignetteBoost: 0,    glowBoost: 0.35, hueShift: 10 },
};

export function useAtmosphere(attributes: PlayerAttributes, posture: PostureState = 'determinado'): AtmosphereStyle {
  return useMemo(() => {
    const { fe, coragem, perseveranca, discernimento } = attributes;

    // Normalize 0-12 → 0-1
    const feN = Math.min(fe / 10, 1);
    const coragemN = Math.min(coragem / 10, 1);
    const persN = Math.min(perseveranca / 10, 1);
    const discN = Math.min(discernimento / 10, 1);

    const mod = postureModifiers[posture];

    // Base values from attributes
    const brightness = Math.max(0.72, Math.min(1.3, 0.75 + feN * 0.35 + mod.brightnessShift));
    const saturation = Math.max(0.55, Math.min(1.3, 0.6 + coragemN * 0.55 + mod.saturationShift));
    const blur = Math.max(0, (1 - discN) * 0.8 + mod.extraBlur * 0.6);
    const hueShift = (feN > 0.7 ? (feN - 0.7) * 15 : 0) + mod.hueShift;

    const vignetteOpacity = Math.max(0, Math.min(0.35, (1 - feN) * 0.25 + mod.vignetteBoost * 0.6));
    const glowOpacity = Math.max(0, Math.min(0.5, (feN > 0.6 ? (feN - 0.6) * 0.5 : 0) + mod.glowBoost));

    const wobbleClass = persN < 0.35 ? 'atmo-wobble' : '';
    const textOpacity = 0.75 + discN * 0.25;

    const filter = [
      `brightness(${brightness.toFixed(2)})`,
      `saturate(${saturation.toFixed(2)})`,
      blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : '',
      hueShift !== 0 ? `hue-rotate(${hueShift.toFixed(1)}deg)` : '',
    ].filter(Boolean).join(' ');

    return {
      containerStyle: {
        transition: 'filter 2s ease, opacity 2s ease',
        filter: blur > 0.1 ? `blur(${(blur * 0.3).toFixed(1)}px)` : 'none',
      },
      textStyle: {
        transition: 'opacity 2s ease',
        opacity: textOpacity,
      },
      imageStyle: {
        transition: 'filter 2s ease',
        filter,
      },
      vignetteOpacity,
      glowOpacity,
      wobbleClass,
    };
  }, [attributes, posture]);
}
