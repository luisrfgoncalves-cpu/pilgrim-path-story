import { useState, useEffect, useRef } from 'react';

/**
 * 3D CSS Dice Component
 * Renders a fully animated 3D dice using CSS transforms
 */

interface Dice3DProps {
  value: number; // 1-6
  rolling: boolean;
  size?: number;
  color?: 'gold' | 'red' | 'blue' | 'dark';
  onRollEnd?: () => void;
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

const FACE_ROTATIONS: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateY(90deg)',
  3: 'rotateX(-90deg)',
  4: 'rotateX(90deg)',
  5: 'rotateY(-90deg)',
  6: 'rotateX(180deg)',
};

const COLOR_THEMES = {
  gold: {
    face: 'linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(0 0% 90%) 100%)',
    border: 'hsl(0 0% 75%)',
    dot: 'hsl(0 0% 10%)',
    glow: 'hsl(0 0% 60% / 0.4)',
    shadow: 'hsl(0 0% 0% / 0.5)',
  },
  red: {
    face: 'linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(0 0% 90%) 100%)',
    border: 'hsl(0 0% 75%)',
    dot: 'hsl(0 0% 10%)',
    glow: 'hsl(0 0% 60% / 0.4)',
    shadow: 'hsl(0 0% 0% / 0.5)',
  },
  blue: {
    face: 'linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(0 0% 90%) 100%)',
    border: 'hsl(0 0% 75%)',
    dot: 'hsl(0 0% 10%)',
    glow: 'hsl(0 0% 60% / 0.4)',
    shadow: 'hsl(0 0% 0% / 0.5)',
  },
  dark: {
    face: 'linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(0 0% 90%) 100%)',
    border: 'hsl(0 0% 75%)',
    dot: 'hsl(0 0% 10%)',
    glow: 'hsl(0 0% 60% / 0.4)',
    shadow: 'hsl(0 0% 0% / 0.5)',
  },
};

function DiceFace({ value, size, theme }: { value: number; size: number; theme: typeof COLOR_THEMES.gold }) {
  const dots = DOT_POSITIONS[value] || DOT_POSITIONS[1];
  const dotSize = size * 0.14;

  return (
    <div
      className="absolute rounded-lg flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: theme.face,
        border: `2px solid ${theme.border}`,
        boxShadow: `inset 0 1px 2px hsl(0 0% 100% / 0.1), inset 0 -2px 4px hsl(0 0% 0% / 0.3)`,
      }}
    >
      {dots.map(([x, y], i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, ${theme.dot}, ${theme.dot}88)`,
            boxShadow: `0 0 ${dotSize / 2}px ${theme.glow}, inset 0 1px 1px hsl(0 0% 100% / 0.3)`,
          }}
        />
      ))}
    </div>
  );
}

export function Dice3D({ value, rolling, size = 80, color = 'gold', onRollEnd }: Dice3DProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const rollRef = useRef<ReturnType<typeof setInterval>>();
  const theme = COLOR_THEMES[color];
  const half = size / 2;

  useEffect(() => {
    if (rolling) {
      let tick = 0;
      rollRef.current = setInterval(() => {
        setDisplayValue(Math.ceil(Math.random() * 6));
        setRotation({
          x: Math.random() * 720 - 360,
          y: Math.random() * 720 - 360,
          z: Math.random() * 360 - 180,
        });
        tick++;
        if (tick >= 20) {
          if (rollRef.current) clearInterval(rollRef.current);
          setDisplayValue(value);
          // Set final rotation to land flat on the correct face
          const FINAL_ROTATIONS: Record<number, { x: number; y: number; z: number }> = {
            1: { x: 0, y: 0, z: 0 },
            2: { x: 0, y: -90, z: 0 },
            3: { x: 90, y: 0, z: 0 },
            4: { x: -90, y: 0, z: 0 },
            5: { x: 0, y: 90, z: 0 },
            6: { x: 180, y: 0, z: 0 },
          };
          const final = FINAL_ROTATIONS[value] || FINAL_ROTATIONS[1];
          setRotation({ x: final.x + 720, y: final.y + 720, z: 0 });
          onRollEnd?.();
        }
      }, 80);
    }
    return () => { if (rollRef.current) clearInterval(rollRef.current); };
  }, [rolling, value]);

  // Build all 6 faces
  const faces = [
    { val: 1, transform: `translateZ(${half}px)` },
    { val: 6, transform: `rotateX(180deg) translateZ(${half}px)` },
    { val: 2, transform: `rotateY(90deg) translateZ(${half}px)` },
    { val: 5, transform: `rotateY(-90deg) translateZ(${half}px)` },
    { val: 3, transform: `rotateX(-90deg) translateZ(${half}px)` },
    { val: 4, transform: `rotateX(90deg) translateZ(${half}px)` },
  ];

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        perspective: size * 4,
      }}
    >
      {/* Shadow under dice */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.8,
          height: size * 0.3,
          left: '10%',
          bottom: -size * 0.15,
          background: `radial-gradient(ellipse, ${theme.shadow} 0%, transparent 70%)`,
          filter: rolling ? 'blur(8px)' : 'blur(4px)',
          opacity: rolling ? 0.3 : 0.6,
          transition: 'all 0.3s',
        }}
      />

      {/* 3D cube */}
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
          transition: rolling ? 'transform 0.08s linear' : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {faces.map((face) => (
          <div
            key={face.val}
            className="absolute"
            style={{
              width: size,
              height: size,
              transform: face.transform,
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            <DiceFace value={face.val} size={size} theme={theme} />
          </div>
        ))}
      </div>

      {/* Glow effect when rolling */}
      {rolling && (
        <div
          className="absolute inset-0 rounded-lg animate-pulse pointer-events-none"
          style={{
            boxShadow: `0 0 ${size / 2}px ${theme.glow}`,
          }}
        />
      )}
    </div>
  );
}

export default Dice3D;
