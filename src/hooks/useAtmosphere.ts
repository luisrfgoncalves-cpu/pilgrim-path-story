import { useMemo } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';

/**
 * Computes continuous CSS custom properties + filter values
 * based on player attributes for reactive UI atmosphere.
 *
 * - Low fé → darker (lower brightness)
 * - High fé → soft warm glow
 * - Low discernimento → slight blur (doubt/confusion)
 * - High discernimento → crisp, stable
 * - Low coragem → desaturated
 * - High coragem → vivid
 * - Low perseverança → subtle sway/wobble via transform
 * - High perseverança → rock-solid
 */

export interface AtmosphereStyle {
  /** Applied to the main scene container */
  containerStyle: React.CSSProperties;
  /** Applied to the narrative text area */
  textStyle: React.CSSProperties;
  /** Applied to the scene image */
  imageStyle: React.CSSProperties;
  /** Overlay opacity for vignette (0-1) */
  vignetteOpacity: number;
  /** Glow overlay opacity (0-1) */
  glowOpacity: number;
  /** CSS class for wobble animation */
  wobbleClass: string;
}

export function useAtmosphere(attributes: PlayerAttributes): AtmosphereStyle {
  return useMemo(() => {
    const { fe, coragem, perseveranca, discernimento } = attributes;

    // Normalize 0-12 → 0-1
    const feN = Math.min(fe / 10, 1);
    const coragemN = Math.min(coragem / 10, 1);
    const persN = Math.min(perseveranca / 10, 1);
    const discN = Math.min(discernimento / 10, 1);

    // Brightness: 0.65 (low fé) → 1.1 (high fé)
    const brightness = 0.65 + feN * 0.45;

    // Saturation: 0.5 (low coragem) → 1.15 (high coragem)
    const saturation = 0.5 + coragemN * 0.65;

    // Blur: 1.5px (low discernimento) → 0 (high discernimento)
    const blur = Math.max(0, (1 - discN) * 1.5);

    // Warm hue-rotate for high fé: 0 → 5deg warm shift
    const hueShift = feN > 0.7 ? (feN - 0.7) * 15 : 0;

    // Vignette darkness for low fé
    const vignetteOpacity = Math.max(0, (1 - feN) * 0.4);

    // Warm glow for high fé
    const glowOpacity = feN > 0.6 ? (feN - 0.6) * 0.5 : 0;

    // Wobble for low perseverança
    const wobbleClass = persN < 0.35 ? 'atmo-wobble' : '';

    // Text opacity: slight fade when doubt is high
    const textOpacity = 0.75 + discN * 0.25;

    const filter = [
      `brightness(${brightness.toFixed(2)})`,
      `saturate(${saturation.toFixed(2)})`,
      blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : '',
      hueShift > 0 ? `hue-rotate(${hueShift.toFixed(1)}deg)` : '',
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
  }, [attributes]);
}
