import { useEffect, useRef, useState } from 'react';

type ParticleType = 'sparks' | 'dust' | 'wind' | 'embers' | 'light';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: string;
  rotation: number;
  rotSpeed: number;
}

interface ParticleEffectsProps {
  type: ParticleType;
  intensity?: number; // 0-1
  active?: boolean;
}

const COLORS: Record<ParticleType, string[]> = {
  sparks: ['#FFD700', '#FFA500', '#FF6347', '#FFEC8B'],
  dust: ['#C4A265', '#A08050', '#8B7355', '#D2B48C'],
  wind: ['#BEBEBE', '#D3D3D3', '#C0C0C0', '#A9A9A9'],
  embers: ['#FF4500', '#FF6347', '#FF8C00', '#FFD700'],
  light: ['#FFFACD', '#FFD700', '#FAFAD2', '#FFF8DC'],
};

export const ParticleEffects = ({ type, intensity = 0.5, active = true }: ParticleEffectsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const colors = COLORS[type];
    const maxParticles = Math.floor(intensity * (type === 'wind' ? 15 : type === 'dust' ? 12 : 20));

    const spawn = (): Particle => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      switch (type) {
        case 'sparks':
          return {
            x: Math.random() * w, y: h,
            vx: (Math.random() - 0.5) * 2, vy: -(1 + Math.random() * 3),
            life: 0, maxLife: 40 + Math.random() * 40,
            size: 1 + Math.random() * 2.5, opacity: 1,
            color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.2,
          };
        case 'embers':
          return {
            x: Math.random() * w, y: h + 10,
            vx: (Math.random() - 0.5) * 1.5, vy: -(0.5 + Math.random() * 1.5),
            life: 0, maxLife: 80 + Math.random() * 60,
            size: 1.5 + Math.random() * 3, opacity: 0.9,
            color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.1,
          };
        case 'dust':
          return {
            x: Math.random() * w, y: h * 0.6 + Math.random() * h * 0.4,
            vx: 0.3 + Math.random() * 0.8, vy: -(0.2 + Math.random() * 0.5),
            life: 0, maxLife: 100 + Math.random() * 80,
            size: 1 + Math.random() * 2, opacity: 0.4,
            color, rotation: 0, rotSpeed: 0,
          };
        case 'wind':
          return {
            x: -10, y: Math.random() * h,
            vx: 2 + Math.random() * 4, vy: (Math.random() - 0.5) * 0.5,
            life: 0, maxLife: 60 + Math.random() * 40,
            size: 1 + Math.random() * 1.5, opacity: 0.3,
            color, rotation: 0, rotSpeed: 0,
          };
        case 'light':
          return {
            x: Math.random() * w, y: Math.random() * h * 0.3,
            vx: (Math.random() - 0.5) * 0.3, vy: 0.1 + Math.random() * 0.3,
            life: 0, maxLife: 120 + Math.random() * 80,
            size: 2 + Math.random() * 4, opacity: 0.2 + Math.random() * 0.3,
            color, rotation: 0, rotSpeed: 0,
          };
      }
    };

    let spawnTimer = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      
      spawnTimer++;
      const spawnRate = type === 'wind' ? 8 : type === 'light' ? 15 : 5;
      if (spawnTimer % spawnRate === 0 && particlesRef.current.length < maxParticles) {
        particlesRef.current.push(spawn());
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        
        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(1, p.life / 10);
        const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        if (alpha <= 0 || p.life > p.maxLife) return false;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (type === 'sparks' || type === 'embers') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'light') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [type, intensity, active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[5]"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

/** Scene-level particle selector based on chapter context */
export const getParticleTypeForScene = (chapterId: string, tone?: string): ParticleType | null => {
  if (chapterId.includes('fogo') || chapterId.includes('fire') || chapterId.includes('fornalha')) return 'embers';
  if (chapterId.includes('vale') || chapterId.includes('sombra') || chapterId.includes('shadow')) return 'dust';
  if (chapterId.includes('celestial') || chapterId.includes('luz') || chapterId.includes('glory')) return 'light';
  if (chapterId.includes('tempestade') || chapterId.includes('storm') || chapterId.includes('vento')) return 'wind';
  if (tone === 'heavy' || tone === 'tense') return 'dust';
  if (tone === 'hopeful') return 'light';
  if (chapterId.startsWith('fase3')) return 'embers';
  if (chapterId.startsWith('fase2')) return 'dust';
  return 'sparks';
};
