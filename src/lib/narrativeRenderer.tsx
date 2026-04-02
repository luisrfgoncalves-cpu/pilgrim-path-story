import React from 'react';

/**
 * Narrative Markup Parser
 * 
 * Converts inline markup in narrative strings into expressive React elements.
 * 
 * Markup syntax:
 *   {{shout}}TEXT{{/shout}}       → Large, bold, uppercase text (gritos, desespero)
 *   {{whisper}}text{{/whisper}}   → Small, italic, faded text (sussurros, medo)
 *   {{divine}}text{{/divine}}     → Golden, glowing text (vozes divinas, revelações)
 *   {{emphasis}}text{{/emphasis}} → Primary colored, bold text (destaques narrativos)
 *   {{dialog}}text{{/dialog}}     → Quoted speech with distinct styling
 *   {{villain}}text{{/villain}}   → Dark red, menacing text (falas de vilões)
 *   {{heart}}text{{/heart}}       → Pulsing text for emotional moments
 *   {{tremor}}text{{/tremor}}     → Shaking text for fear/earthquakes
 *   {{fade}}text{{/fade}}         → Fading in/out text for mystery
 */

interface MarkupSegment {
  type: 'text' | 'shout' | 'whisper' | 'divine' | 'emphasis' | 'dialog' | 'villain' | 'heart' | 'tremor' | 'fade';
  content: string;
}

const MARKUP_REGEX = /\{\{(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

function parseMarkup(text: string): MarkupSegment[] {
  const segments: MarkupSegment[] = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  const regex = new RegExp(MARKUP_REGEX.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: match[1] as MarkupSegment['type'], content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

const segmentStyles: Record<MarkupSegment['type'], React.CSSProperties> = {
  text: {},
  shout: {
    fontSize: '1.25em',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'hsl(0 0% 95%)',
    textShadow: '0 2px 12px hsl(0 70% 40% / 0.5), 0 0 4px hsl(0 0% 0% / 0.8)',
  },
  whisper: {
    fontSize: '0.85em',
    fontStyle: 'italic',
    opacity: 0.6,
    letterSpacing: '0.04em',
  },
  divine: {
    color: 'hsl(43 80% 65%)',
    fontWeight: 700,
    textShadow: '0 0 16px hsl(43 80% 50% / 0.6), 0 0 4px hsl(43 60% 40% / 0.4)',
    letterSpacing: '0.02em',
  },
  emphasis: {
    fontWeight: 700,
    color: 'hsl(var(--primary))',
  },
  dialog: {
    fontStyle: 'italic',
    borderLeft: '2px solid hsl(var(--primary) / 0.4)',
    paddingLeft: '0.75em',
    display: 'inline-block',
  },
  villain: {
    color: 'hsl(0 55% 45%)',
    fontWeight: 700,
    fontStyle: 'italic',
    textShadow: '0 1px 8px hsl(0 60% 30% / 0.5)',
  },
  heart: {
    color: 'hsl(350 70% 60%)',
    fontWeight: 600,
    animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
  },
  tremor: {
    animation: 'tremor 0.15s ease-in-out infinite',
    display: 'inline-block',
  },
  fade: {
    animation: 'fade-mystery 3s ease-in-out infinite',
    display: 'inline-block',
  },
};

const segmentClasses: Record<MarkupSegment['type'], string> = {
  text: '',
  shout: 'narrative-shout',
  whisper: 'narrative-whisper',
  divine: 'narrative-divine',
  emphasis: 'narrative-emphasis',
  dialog: 'narrative-dialog',
  villain: 'narrative-villain',
  heart: 'narrative-heart',
  tremor: 'narrative-tremor',
  fade: 'narrative-fade',
};

export function renderNarrative(text: string): React.ReactNode {
  const segments = parseMarkup(text);

  if (segments.length === 1 && segments[0].type === 'text') {
    return text;
  }

  return (
    <>
      {segments.map((seg, i) => (
        <span
          key={i}
          className={segmentClasses[seg.type]}
          style={segmentStyles[seg.type]}
        >
          {seg.content}
        </span>
      ))}
    </>
  );
}

/**
 * Scene atmosphere configuration — defines the emotional color palette,
 * ambient effects and psychological mood for each scene or scene pattern.
 */
export interface SceneAtmosphere {
  /** Dominant hue for the scene overlay (CSS color) */
  overlayColor?: string;
  /** Vignette intensity 0-1 */
  vignette?: number;
  /** Background tint gradient */
  bgTint?: string;
  /** Text glow/shadow color */
  textGlow?: string;
  /** CSS filter for the scene image */
  imageFilter?: string;
  /** Card background override */
  cardBg?: string;
  /** Border accent color */
  borderAccent?: string;
  /** Narrative text color override */
  textColor?: string;
}

/**
 * Scene atmosphere presets mapped by scene ID or pattern.
 * More specific IDs take priority over patterns.
 */
export const sceneAtmospheres: Record<string, SceneAtmosphere> = {
  // ── Cidade da Destruição — opressão, cinza esverdeado ──
  'cena1': {
    overlayColor: 'hsl(200 15% 12% / 0.3)',
    bgTint: 'linear-gradient(to bottom, hsl(200 10% 8% / 0.4), transparent)',
    vignette: 0.5,
    imageFilter: 'saturate(0.7) brightness(0.85)',
    cardBg: 'hsl(200 10% 10% / 0.65)',
    borderAccent: 'hsl(200 15% 30% / 0.4)',
  },
  'cena1b': {
    overlayColor: 'hsl(220 20% 10% / 0.4)',
    bgTint: 'linear-gradient(to bottom, hsl(220 15% 6% / 0.5), transparent)',
    vignette: 0.6,
    imageFilter: 'saturate(0.6) brightness(0.75)',
    cardBg: 'hsl(220 15% 10% / 0.7)',
    borderAccent: 'hsl(220 20% 25% / 0.5)',
  },
  'cena2': {
    overlayColor: 'hsl(30 15% 15% / 0.25)',
    vignette: 0.4,
    imageFilter: 'saturate(0.8) brightness(0.9)',
    cardBg: 'hsl(30 10% 12% / 0.6)',
  },
  'cena3': {
    overlayColor: 'hsl(180 10% 15% / 0.2)',
    bgTint: 'linear-gradient(to bottom, hsl(180 8% 10% / 0.3), transparent)',
    vignette: 0.35,
    imageFilter: 'saturate(0.85)',
  },
  'cena4': {
    overlayColor: 'hsl(0 20% 12% / 0.35)',
    bgTint: 'linear-gradient(to bottom, hsl(0 15% 8% / 0.45), transparent)',
    vignette: 0.65,
    imageFilter: 'saturate(0.6) brightness(0.7) contrast(1.1)',
    cardBg: 'hsl(0 12% 10% / 0.7)',
    borderAccent: 'hsl(0 30% 30% / 0.4)',
  },
  'cena5': {
    overlayColor: 'hsl(45 20% 15% / 0.2)',
    bgTint: 'linear-gradient(to bottom, transparent, hsl(45 15% 10% / 0.2))',
    vignette: 0.3,
    imageFilter: 'saturate(0.9) brightness(0.95)',
    textGlow: 'hsl(45 60% 50% / 0.15)',
  },
  'cena5b': {
    overlayColor: 'hsl(30 12% 15% / 0.25)',
    vignette: 0.4,
    imageFilter: 'saturate(0.75) brightness(0.85)',
  },
  'cena6': {
    overlayColor: 'hsl(240 15% 10% / 0.4)',
    bgTint: 'linear-gradient(to bottom, hsl(240 12% 6% / 0.5), transparent)',
    vignette: 0.7,
    imageFilter: 'saturate(0.5) brightness(0.65)',
    cardBg: 'hsl(240 10% 8% / 0.75)',
    borderAccent: 'hsl(240 15% 25% / 0.5)',
  },
  'cena7': {
    overlayColor: 'hsl(280 10% 12% / 0.2)',
    bgTint: 'linear-gradient(135deg, hsl(280 8% 8% / 0.3), hsl(45 15% 10% / 0.2))',
    vignette: 0.45,
    imageFilter: 'saturate(0.85) contrast(1.05)',
  },
  'cena7b': {
    overlayColor: 'hsl(0 25% 15% / 0.35)',
    bgTint: 'linear-gradient(to bottom, hsl(0 20% 10% / 0.4), transparent)',
    vignette: 0.6,
    imageFilter: 'saturate(0.7) brightness(0.8) contrast(1.1)',
    cardBg: 'hsl(0 15% 10% / 0.65)',
    borderAccent: 'hsl(0 40% 35% / 0.4)',
  },
  'cena8': {
    overlayColor: 'hsl(35 15% 18% / 0.2)',
    vignette: 0.35,
    imageFilter: 'saturate(0.9) sepia(0.15)',
    cardBg: 'hsl(35 10% 12% / 0.6)',
  },
  'cena9': {
    overlayColor: 'hsl(45 25% 15% / 0.25)',
    bgTint: 'linear-gradient(to top, hsl(45 20% 12% / 0.3), transparent)',
    vignette: 0.4,
    textGlow: 'hsl(45 50% 50% / 0.2)',
    imageFilter: 'saturate(1.1) brightness(1.05)',
  },
  'cena9b': {
    overlayColor: 'hsl(45 20% 15% / 0.2)',
    textGlow: 'hsl(45 50% 50% / 0.15)',
    imageFilter: 'saturate(1.05)',
  },
  'cena10': {
    overlayColor: 'hsl(15 30% 12% / 0.45)',
    bgTint: 'linear-gradient(to bottom, hsl(15 25% 8% / 0.5), hsl(0 20% 10% / 0.3))',
    vignette: 0.75,
    imageFilter: 'saturate(0.5) brightness(0.6) contrast(1.2)',
    cardBg: 'hsl(15 15% 8% / 0.8)',
    borderAccent: 'hsl(15 40% 35% / 0.5)',
  },
  // ── Pântano do Desânimo — verde doentio, névoa ──
  'cena11': {
    overlayColor: 'hsl(120 20% 10% / 0.35)',
    bgTint: 'linear-gradient(to bottom, hsl(120 15% 6% / 0.5), hsl(90 10% 8% / 0.3))',
    vignette: 0.6,
    imageFilter: 'saturate(0.6) brightness(0.7) hue-rotate(-10deg)',
    cardBg: 'hsl(120 10% 8% / 0.7)',
    borderAccent: 'hsl(120 20% 25% / 0.5)',
  },
  'cena11b': {
    overlayColor: 'hsl(130 25% 8% / 0.5)',
    bgTint: 'linear-gradient(to bottom, hsl(130 20% 5% / 0.6), hsl(100 15% 6% / 0.4))',
    vignette: 0.8,
    imageFilter: 'saturate(0.4) brightness(0.55) hue-rotate(-15deg)',
    cardBg: 'hsl(130 12% 6% / 0.8)',
    borderAccent: 'hsl(130 25% 20% / 0.6)',
  },
  'cena12': {
    overlayColor: 'hsl(120 15% 12% / 0.3)',
    vignette: 0.5,
    imageFilter: 'saturate(0.7) brightness(0.75)',
    cardBg: 'hsl(120 8% 10% / 0.65)',
  },
  'cena13': {
    overlayColor: 'hsl(100 20% 8% / 0.5)',
    bgTint: 'linear-gradient(to bottom, hsl(100 15% 5% / 0.6), hsl(80 10% 6% / 0.4))',
    vignette: 0.85,
    imageFilter: 'saturate(0.35) brightness(0.5) contrast(1.15)',
    cardBg: 'hsl(100 12% 5% / 0.85)',
    borderAccent: 'hsl(0 30% 30% / 0.5)',
  },
  'cena14': {
    overlayColor: 'hsl(120 12% 15% / 0.2)',
    bgTint: 'linear-gradient(to top, hsl(90 10% 12% / 0.2), transparent)',
    vignette: 0.35,
    imageFilter: 'saturate(0.8) brightness(0.9)',
  },
  'cena14b': {
    overlayColor: 'hsl(90 10% 15% / 0.15)',
    vignette: 0.3,
    imageFilter: 'saturate(0.9) brightness(0.95)',
    textGlow: 'hsl(45 40% 50% / 0.1)',
  },
  // ── Cruz — dourado, luz rompendo, libertação ──
  'cena15': {
    overlayColor: 'hsl(43 30% 15% / 0.25)',
    bgTint: 'linear-gradient(to top, transparent, hsl(43 40% 20% / 0.3))',
    vignette: 0.3,
    imageFilter: 'saturate(1.2) brightness(1.1) contrast(1.05)',
    textGlow: 'hsl(43 70% 55% / 0.3)',
    cardBg: 'hsl(43 15% 10% / 0.55)',
    borderAccent: 'hsl(43 50% 40% / 0.4)',
  },
  'cena15b': {
    overlayColor: 'hsl(43 35% 18% / 0.3)',
    bgTint: 'linear-gradient(to top, transparent, hsl(43 45% 25% / 0.35))',
    vignette: 0.2,
    imageFilter: 'saturate(1.3) brightness(1.15)',
    textGlow: 'hsl(43 80% 60% / 0.4)',
    cardBg: 'hsl(43 20% 12% / 0.5)',
    borderAccent: 'hsl(43 60% 45% / 0.5)',
    textColor: 'hsl(43 30% 90%)',
  },
};

/**
 * Get atmosphere config for a scene, falling back to defaults.
 */
export function getSceneAtmosphere(sceneId: string): SceneAtmosphere {
  // Exact match first
  if (sceneAtmospheres[sceneId]) return sceneAtmospheres[sceneId];

  // Pattern match for phases
  if (sceneId.startsWith('fase2-')) return {
    overlayColor: 'hsl(270 15% 12% / 0.2)',
    vignette: 0.35,
    imageFilter: 'saturate(0.9)',
    textGlow: 'hsl(270 40% 50% / 0.1)',
  };
  if (sceneId.startsWith('fase3-')) return {
    overlayColor: 'hsl(0 20% 10% / 0.35)',
    vignette: 0.6,
    imageFilter: 'saturate(0.6) brightness(0.75)',
    cardBg: 'hsl(0 10% 8% / 0.7)',
  };
  if (sceneId.startsWith('fase4-')) return {
    overlayColor: 'hsl(30 25% 15% / 0.25)',
    vignette: 0.45,
    imageFilter: 'saturate(0.85) sepia(0.1)',
  };
  if (sceneId.startsWith('fase5-')) return {
    overlayColor: 'hsl(220 15% 10% / 0.4)',
    vignette: 0.65,
    imageFilter: 'saturate(0.5) brightness(0.7)',
    cardBg: 'hsl(220 10% 8% / 0.75)',
  };
  if (sceneId.startsWith('fase6-') || sceneId.startsWith('final')) return {
    overlayColor: 'hsl(43 30% 18% / 0.2)',
    vignette: 0.2,
    imageFilter: 'saturate(1.3) brightness(1.15)',
    textGlow: 'hsl(43 70% 55% / 0.3)',
  };

  return {};
}