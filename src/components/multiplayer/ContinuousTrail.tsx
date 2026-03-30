import { useMemo } from 'react';
import trailStoneImg from '@/assets/board/trail-stone.jpg';
import trailDirtImg from '@/assets/board/trail-dirt.jpg';
import trailSwampImg from '@/assets/board/trail-swamp.jpg';
import trailDarkValleyImg from '@/assets/board/trail-dark-valley.jpg';
import trailFairImg from '@/assets/board/trail-fair.jpg';
import trailCastleImg from '@/assets/board/trail-castle.jpg';
import trailCelestialImg from '@/assets/board/trail-celestial.jpg';

// Phase-specific trail image
const PHASE_TRAIL_IMG: Record<number, string> = {
  0: trailDirtImg,          // Cidade da Destruição - terra batida
  1: trailSwampImg,         // Pântano - lama
  2: trailDarkValleyImg,    // Vale da Sombra - rocha escura
  3: trailFairImg,          // Feira da Vaidade - paralelepípedo
  4: trailCastleImg,        // Castelo da Dúvida - pedra de castelo
  5: trailCelestialImg,     // Cidade Celestial - caminho dourado
};

// Secondary trail for variation (appears in alternating sections)
const PHASE_TRAIL_ALT: Record<number, string> = {
  0: trailStoneImg,
  1: trailDirtImg,
  2: trailStoneImg,
  3: trailStoneImg,
  4: trailStoneImg,
  5: trailStoneImg,
};

interface ContinuousTrailProps {
  trailPositions: { x: number; y: number }[];
  phaseIdx: number;
  accentHue: number;
  enableGlowFilter?: boolean;
}

/**
 * Builds a smooth cubic bezier SVG path through all trail positions
 */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';

  // Convert percentage coords to SVG viewBox coords (1000x10000)
  const pts = points.map(p => ({ x: p.x * 10, y: p.y * 100 }));

  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    // Catmull-Rom to cubic bezier control points
    const tension = 0.35;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export default function ContinuousTrail({ trailPositions, phaseIdx, accentHue, enableGlowFilter = true }: ContinuousTrailProps) {
  const pathD = useMemo(() => buildSmoothPath(trailPositions), [trailPositions]);
  const trailImg = PHASE_TRAIL_IMG[phaseIdx] || trailDirtImg;
  const trailAltImg = PHASE_TRAIL_ALT[phaseIdx] || trailStoneImg;
  const patternId = `trail-pattern-${phaseIdx}`;
  const patternAltId = `trail-pattern-alt-${phaseIdx}`;
  const glowFilterId = `trail-glow-${phaseIdx}`;

  if (!pathD) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      viewBox="0 0 1000 10000"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Main trail texture pattern */}
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="200"
          height="400"
        >
          <image
            href={trailImg}
            x="0" y="0"
            width="200" height="400"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>

        {/* Alt trail texture for variety */}
        <pattern
          id={patternAltId}
          patternUnits="userSpaceOnUse"
          width="200"
          height="400"
        >
          <image
            href={trailAltImg}
            x="0" y="0"
            width="200" height="400"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>

        {/* Glow filter for luminous edges */}
        <filter id={glowFilterId} x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feFlood floodColor={`hsl(${accentHue} 50% 55%)`} floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow layer - depth effect */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="124"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(4, 8)"
      />

      {/* Main trail with image texture */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${patternId})`}
        strokeWidth="112"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowFilterId})`}
        opacity="0.9"
      />

      {/* Subtle edge borders for definition */}
      <path
        d={pathD}
        fill="none"
        stroke={`hsla(${accentHue} 40% 45% / 0.35)`}
        strokeWidth="118"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Inner highlight for 3D raised effect */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="72"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
