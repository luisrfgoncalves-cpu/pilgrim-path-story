import React from 'react';

/**
 * Narrative Markup Parser — supports nested tags
 */

interface MarkupSegment {
  type: 'text' | 'shout' | 'whisper' | 'divine' | 'emphasis' | 'dialog' | 'villain' | 'heart' | 'tremor' | 'fade';
  content: string;
  children?: MarkupSegment[];
}

const TAGS = ['shout', 'whisper', 'divine', 'emphasis', 'dialog', 'villain', 'heart', 'tremor', 'fade'];
const TAG_OPEN = /\{\{(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}/;
const TAG_CLOSE_FOR = (tag: string) => `{{/${tag}}}`;

function parseMarkup(text: string): MarkupSegment[] {
  const segments: MarkupSegment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const match = TAG_OPEN.exec(remaining);
    if (!match) {
      segments.push({ type: 'text', content: remaining });
      break;
    }

    // Text before the tag
    if (match.index > 0) {
      segments.push({ type: 'text', content: remaining.slice(0, match.index) });
    }

    const tag = match[1] as MarkupSegment['type'];
    const afterOpen = remaining.slice(match.index + match[0].length);
    const closeTag = TAG_CLOSE_FOR(tag);
    const closeIdx = afterOpen.indexOf(closeTag);

    if (closeIdx === -1) {
      // No closing tag found — treat as plain text
      segments.push({ type: 'text', content: remaining.slice(match.index) });
      break;
    }

    const innerContent = afterOpen.slice(0, closeIdx);
    // Recursively parse inner content for nested tags
    const children = parseMarkup(innerContent);
    segments.push({ type: tag, content: innerContent, children });

    remaining = afterOpen.slice(closeIdx + closeTag.length);
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
    color: 'hsl(43 70% 65%)',
    textShadow: '0 0 8px hsl(43 60% 50% / 0.3)',
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

function renderSegments(segments: MarkupSegment[]): React.ReactNode {
  return segments.map((seg, i) => {
    if (seg.type === 'text') {
      return <React.Fragment key={i}>{seg.content}</React.Fragment>;
    }
    // If has nested children, render them recursively
    const inner = seg.children && seg.children.length > 0
      ? renderSegments(seg.children)
      : seg.content;
    return (
      <span key={i} className={segmentClasses[seg.type]} style={segmentStyles[seg.type]}>
        {inner}
      </span>
    );
  });
}

export function renderNarrative(text: string): React.ReactNode {
  const segments = parseMarkup(text);
  if (segments.length === 1 && segments[0].type === 'text') {
    return text;
  }
  return <>{renderSegments(segments)}</>;
}

/**
 * Scene atmosphere configuration
 */
export interface SceneAtmosphere {
  overlayColor?: string;
  vignette?: number;
  bgTint?: string;
  textGlow?: string;
  imageFilter?: string;
  cardBg?: string;
  borderAccent?: string;
  textColor?: string;
}

/**
 * Scene atmosphere presets — BRIGHTER than before to keep backgrounds visible
 */
export const sceneAtmospheres: Record<string, SceneAtmosphere> = {
  'cena1': {
    overlayColor: 'hsl(200 15% 12% / 0.15)',
    bgTint: 'linear-gradient(to bottom, hsl(200 10% 8% / 0.2), transparent)',
    vignette: 0.3,
    imageFilter: 'saturate(0.85) brightness(1.0)',
    cardBg: 'hsl(200 10% 10% / 0.65)',
    borderAccent: 'hsl(200 15% 30% / 0.4)',
  },
  'cena1b': {
    overlayColor: 'hsl(220 20% 10% / 0.2)',
    bgTint: 'linear-gradient(to bottom, hsl(220 15% 6% / 0.25), transparent)',
    vignette: 0.35,
    imageFilter: 'saturate(0.75) brightness(0.92)',
    cardBg: 'hsl(220 15% 10% / 0.7)',
    borderAccent: 'hsl(220 20% 25% / 0.5)',
  },
  'cena2': {
    overlayColor: 'hsl(30 15% 15% / 0.15)',
    vignette: 0.25,
    imageFilter: 'saturate(0.9) brightness(1.0)',
    cardBg: 'hsl(30 10% 12% / 0.6)',
  },
  'cena3': {
    overlayColor: 'hsl(180 10% 15% / 0.1)',
    bgTint: 'linear-gradient(to bottom, hsl(180 8% 10% / 0.15), transparent)',
    vignette: 0.2,
    imageFilter: 'saturate(0.95) brightness(1.0)',
  },
  'cena4': {
    overlayColor: 'hsl(0 20% 12% / 0.2)',
    bgTint: 'linear-gradient(to bottom, hsl(0 15% 8% / 0.25), transparent)',
    vignette: 0.4,
    imageFilter: 'saturate(0.75) brightness(0.88) contrast(1.05)',
    cardBg: 'hsl(0 12% 10% / 0.7)',
    borderAccent: 'hsl(0 30% 30% / 0.4)',
  },
  'cena5': {
    overlayColor: 'hsl(45 20% 15% / 0.1)',
    bgTint: 'linear-gradient(to bottom, transparent, hsl(45 15% 10% / 0.1))',
    vignette: 0.2,
    imageFilter: 'saturate(1.0) brightness(1.05)',
    textGlow: 'hsl(45 60% 50% / 0.15)',
  },
  'cena5b': {
    overlayColor: 'hsl(30 12% 15% / 0.15)',
    vignette: 0.25,
    imageFilter: 'saturate(0.85) brightness(0.95)',
  },
  'cena6': {
    overlayColor: 'hsl(240 15% 10% / 0.25)',
    bgTint: 'linear-gradient(to bottom, hsl(240 12% 6% / 0.3), transparent)',
    vignette: 0.45,
    imageFilter: 'saturate(0.65) brightness(0.8)',
    cardBg: 'hsl(240 10% 8% / 0.75)',
    borderAccent: 'hsl(240 15% 25% / 0.5)',
  },
  'cena7': {
    overlayColor: 'hsl(280 10% 12% / 0.1)',
    bgTint: 'linear-gradient(135deg, hsl(280 8% 8% / 0.15), hsl(45 15% 10% / 0.1))',
    vignette: 0.3,
    imageFilter: 'saturate(0.95) contrast(1.05) brightness(1.0)',
  },
  'cena7b': {
    overlayColor: 'hsl(0 25% 15% / 0.2)',
    bgTint: 'linear-gradient(to bottom, hsl(0 20% 10% / 0.25), transparent)',
    vignette: 0.4,
    imageFilter: 'saturate(0.8) brightness(0.9) contrast(1.05)',
    cardBg: 'hsl(0 15% 10% / 0.65)',
    borderAccent: 'hsl(0 40% 35% / 0.4)',
  },
  'cena8': {
    overlayColor: 'hsl(35 15% 18% / 0.1)',
    vignette: 0.2,
    imageFilter: 'saturate(1.0) sepia(0.1) brightness(1.0)',
    cardBg: 'hsl(35 10% 12% / 0.6)',
  },
  'cena9': {
    overlayColor: 'hsl(45 25% 15% / 0.15)',
    bgTint: 'linear-gradient(to top, hsl(45 20% 12% / 0.15), transparent)',
    vignette: 0.25,
    textGlow: 'hsl(45 50% 50% / 0.2)',
    imageFilter: 'saturate(1.15) brightness(1.1)',
  },
  'cena9b': {
    overlayColor: 'hsl(45 20% 15% / 0.1)',
    textGlow: 'hsl(45 50% 50% / 0.15)',
    imageFilter: 'saturate(1.1) brightness(1.05)',
  },
  'cena10': {
    overlayColor: 'hsl(15 30% 12% / 0.25)',
    bgTint: 'linear-gradient(to bottom, hsl(15 25% 8% / 0.3), hsl(0 20% 10% / 0.15))',
    vignette: 0.5,
    imageFilter: 'saturate(0.65) brightness(0.78) contrast(1.1)',
    cardBg: 'hsl(15 15% 8% / 0.8)',
    borderAccent: 'hsl(15 40% 35% / 0.5)',
  },
  'cena11': {
    overlayColor: 'hsl(120 20% 10% / 0.2)',
    bgTint: 'linear-gradient(to bottom, hsl(120 15% 6% / 0.3), hsl(90 10% 8% / 0.15))',
    vignette: 0.35,
    imageFilter: 'saturate(0.75) brightness(0.85) hue-rotate(-10deg)',
    cardBg: 'hsl(120 10% 8% / 0.7)',
    borderAccent: 'hsl(120 20% 25% / 0.5)',
  },
  'cena11b': {
    overlayColor: 'hsl(130 25% 8% / 0.3)',
    bgTint: 'linear-gradient(to bottom, hsl(130 20% 5% / 0.35), hsl(100 15% 6% / 0.2))',
    vignette: 0.5,
    imageFilter: 'saturate(0.55) brightness(0.72) hue-rotate(-15deg)',
    cardBg: 'hsl(130 12% 6% / 0.8)',
    borderAccent: 'hsl(130 25% 20% / 0.6)',
  },
  'cena12': {
    overlayColor: 'hsl(120 15% 12% / 0.2)',
    vignette: 0.3,
    imageFilter: 'saturate(0.8) brightness(0.88)',
    cardBg: 'hsl(120 8% 10% / 0.65)',
  },
  'cena13': {
    overlayColor: 'hsl(100 20% 8% / 0.3)',
    bgTint: 'linear-gradient(to bottom, hsl(100 15% 5% / 0.35), hsl(80 10% 6% / 0.2))',
    vignette: 0.55,
    imageFilter: 'saturate(0.5) brightness(0.65) contrast(1.1)',
    cardBg: 'hsl(100 12% 5% / 0.85)',
    borderAccent: 'hsl(0 30% 30% / 0.5)',
  },
  'cena14': {
    overlayColor: 'hsl(120 12% 15% / 0.1)',
    bgTint: 'linear-gradient(to top, hsl(90 10% 12% / 0.1), transparent)',
    vignette: 0.2,
    imageFilter: 'saturate(0.9) brightness(1.0)',
  },
  'cena14b': {
    overlayColor: 'hsl(90 10% 15% / 0.08)',
    vignette: 0.15,
    imageFilter: 'saturate(1.0) brightness(1.05)',
    textGlow: 'hsl(45 40% 50% / 0.1)',
  },
  'cena15': {
    overlayColor: 'hsl(43 30% 15% / 0.15)',
    bgTint: 'linear-gradient(to top, transparent, hsl(43 40% 20% / 0.2))',
    vignette: 0.2,
    imageFilter: 'saturate(1.3) brightness(1.15) contrast(1.05)',
    textGlow: 'hsl(43 70% 55% / 0.3)',
    cardBg: 'hsl(43 15% 10% / 0.55)',
    borderAccent: 'hsl(43 50% 40% / 0.4)',
  },
  'cena15b': {
    overlayColor: 'hsl(43 35% 18% / 0.2)',
    bgTint: 'linear-gradient(to top, transparent, hsl(43 45% 25% / 0.25))',
    vignette: 0.15,
    imageFilter: 'saturate(1.35) brightness(1.2)',
    textGlow: 'hsl(43 80% 60% / 0.4)',
    cardBg: 'hsl(43 20% 12% / 0.5)',
    borderAccent: 'hsl(43 60% 45% / 0.5)',
    textColor: 'hsl(43 30% 90%)',
  },
};

export function getSceneAtmosphere(sceneId: string): SceneAtmosphere {
  if (sceneAtmospheres[sceneId]) return sceneAtmospheres[sceneId];

  if (sceneId.startsWith('fase2-')) return {
    overlayColor: 'hsl(270 15% 12% / 0.1)',
    vignette: 0.2,
    imageFilter: 'saturate(0.95) brightness(1.0)',
    textGlow: 'hsl(270 40% 50% / 0.1)',
  };
  if (sceneId.startsWith('fase3-')) return {
    overlayColor: 'hsl(0 20% 10% / 0.2)',
    vignette: 0.35,
    imageFilter: 'saturate(0.75) brightness(0.88)',
    cardBg: 'hsl(0 10% 8% / 0.7)',
  };
  if (sceneId.startsWith('fase4-')) return {
    overlayColor: 'hsl(30 25% 15% / 0.15)',
    vignette: 0.25,
    imageFilter: 'saturate(0.9) sepia(0.08) brightness(1.0)',
  };
  if (sceneId.startsWith('fase5-')) return {
    overlayColor: 'hsl(220 15% 10% / 0.2)',
    vignette: 0.4,
    imageFilter: 'saturate(0.65) brightness(0.85)',
    cardBg: 'hsl(220 10% 8% / 0.75)',
  };
  if (sceneId.startsWith('fase6-') || sceneId.startsWith('final')) return {
    overlayColor: 'hsl(43 30% 18% / 0.1)',
    vignette: 0.15,
    imageFilter: 'saturate(1.35) brightness(1.2)',
    textGlow: 'hsl(43 70% 55% / 0.3)',
  };

  return {};
}
