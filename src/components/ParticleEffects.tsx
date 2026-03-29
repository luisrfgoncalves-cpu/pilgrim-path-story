import { useEffect, useRef } from 'react';

type ParticleType = 'sparks' | 'dust' | 'wind' | 'embers' | 'light' | 'fire' | 'rain' | 'fog' | 'holy_light' | 'snow' | 'lightning' | 'blood' | 'stars' | 'leaves';

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
  fire: ['#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF0000', '#FF2400'],
  rain: ['#6CA6CD', '#87CEEB', '#B0C4DE', '#7EB7D4'],
  fog: ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3'],
  holy_light: ['#FFFACD', '#FFD700', '#FFF8DC', '#FFEFD5', '#FFFFFF'],
  snow: ['#FFFFFF', '#F0F8FF', '#F5F5F5', '#FAFAFA'],
  lightning: ['#FFFFFF', '#E0E0FF', '#C0C0FF', '#FFFACD'],
  blood: ['#8B0000', '#B22222', '#DC143C', '#FF4444'],
  stars: ['#FFFFFF', '#FFD700', '#FFFACD', '#87CEEB', '#FFE4B5'],
  leaves: ['#556B2F', '#8B7355', '#CD853F', '#A0522D', '#6B8E23'],
};

export const ParticleEffects = ({ type, intensity = 0.5, active = true }: ParticleEffectsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lightningRef = useRef(0);

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
    const maxParticles = Math.floor(intensity * getMaxParticles(type));

    const spawn = (): Particle => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      switch (type) {
        case 'sparks':
          return { x: Math.random() * w, y: h, vx: (Math.random() - 0.5) * 2, vy: -(1 + Math.random() * 3), life: 0, maxLife: 40 + Math.random() * 40, size: 1 + Math.random() * 2.5, opacity: 1, color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.2 };

        case 'embers':
          return { x: Math.random() * w, y: h + 10, vx: (Math.random() - 0.5) * 1.5, vy: -(0.5 + Math.random() * 1.5), life: 0, maxLife: 80 + Math.random() * 60, size: 1.5 + Math.random() * 3, opacity: 0.9, color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.1 };

        case 'fire':
          return { x: w * 0.2 + Math.random() * w * 0.6, y: h, vx: (Math.random() - 0.5) * 3, vy: -(2 + Math.random() * 4), life: 0, maxLife: 30 + Math.random() * 30, size: 2 + Math.random() * 5, opacity: 0.95, color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.3 };

        case 'rain':
          return { x: Math.random() * w, y: -10, vx: -1 + Math.random() * 0.5, vy: 6 + Math.random() * 8, life: 0, maxLife: 60, size: 1 + Math.random() * 1.5, opacity: 0.4 + Math.random() * 0.3, color, rotation: 0.2, rotSpeed: 0 };

        case 'fog':
          return { x: -20 + Math.random() * (w + 40), y: h * 0.4 + Math.random() * h * 0.6, vx: 0.2 + Math.random() * 0.5, vy: (Math.random() - 0.5) * 0.3, life: 0, maxLife: 200 + Math.random() * 150, size: 15 + Math.random() * 30, opacity: 0.08 + Math.random() * 0.12, color, rotation: 0, rotSpeed: 0 };

        case 'holy_light':
          return { x: Math.random() * w, y: -5, vx: (Math.random() - 0.5) * 0.5, vy: 0.3 + Math.random() * 0.8, life: 0, maxLife: 150 + Math.random() * 100, size: 3 + Math.random() * 8, opacity: 0.15 + Math.random() * 0.25, color, rotation: 0, rotSpeed: 0 };

        case 'snow':
          return { x: Math.random() * w, y: -5, vx: (Math.random() - 0.5) * 1, vy: 0.5 + Math.random() * 1.5, life: 0, maxLife: 200 + Math.random() * 100, size: 1.5 + Math.random() * 3, opacity: 0.5 + Math.random() * 0.4, color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.05 };

        case 'lightning':
          return { x: Math.random() * w, y: 0, vx: 0, vy: 8 + Math.random() * 10, life: 0, maxLife: 5 + Math.random() * 8, size: 1 + Math.random() * 2, opacity: 0.9, color, rotation: 0, rotSpeed: 0 };

        case 'blood':
          return { x: Math.random() * w, y: -5, vx: (Math.random() - 0.5) * 2, vy: 1 + Math.random() * 3, life: 0, maxLife: 60 + Math.random() * 40, size: 1.5 + Math.random() * 3, opacity: 0.6, color, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.1 };

        case 'stars':
          return { x: Math.random() * w, y: Math.random() * h * 0.5, vx: 0, vy: 0, life: 0, maxLife: 200 + Math.random() * 200, size: 1 + Math.random() * 2.5, opacity: 0.1 + Math.random() * 0.6, color, rotation: 0, rotSpeed: 0 };

        case 'leaves':
          return { x: Math.random() * w, y: -10, vx: 0.5 + Math.random() * 2, vy: 0.5 + Math.random() * 1.5, life: 0, maxLife: 120 + Math.random() * 80, size: 2 + Math.random() * 4, opacity: 0.5 + Math.random() * 0.3, color, rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.08 };

        case 'dust':
          return { x: Math.random() * w, y: h * 0.6 + Math.random() * h * 0.4, vx: 0.3 + Math.random() * 0.8, vy: -(0.2 + Math.random() * 0.5), life: 0, maxLife: 100 + Math.random() * 80, size: 1 + Math.random() * 2, opacity: 0.4, color, rotation: 0, rotSpeed: 0 };

        case 'wind':
          return { x: -10, y: Math.random() * h, vx: 2 + Math.random() * 4, vy: (Math.random() - 0.5) * 0.5, life: 0, maxLife: 60 + Math.random() * 40, size: 1 + Math.random() * 1.5, opacity: 0.3, color, rotation: 0, rotSpeed: 0 };

        case 'light':
        default:
          return { x: Math.random() * w, y: Math.random() * h * 0.3, vx: (Math.random() - 0.5) * 0.3, vy: 0.1 + Math.random() * 0.3, life: 0, maxLife: 120 + Math.random() * 80, size: 2 + Math.random() * 4, opacity: 0.2 + Math.random() * 0.3, color, rotation: 0, rotSpeed: 0 };
      }
    };

    let spawnTimer = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // Lightning flash effect
      if (type === 'lightning') {
        lightningRef.current--;
        if (lightningRef.current > 0) {
          ctx.fillStyle = `rgba(255,255,255,${lightningRef.current * 0.03})`;
          ctx.fillRect(0, 0, w, h);
        }
        if (Math.random() < 0.005 * intensity) {
          lightningRef.current = 8;
          // Spawn burst
          for (let i = 0; i < 5; i++) particlesRef.current.push(spawn());
        }
      }

      spawnTimer++;
      const spawnRate = getSpawnRate(type);
      if (spawnTimer % spawnRate === 0 && particlesRef.current.length < maxParticles) {
        particlesRef.current.push(spawn());
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Wind sway for leaves
        if (type === 'leaves') {
          p.vx += Math.sin(p.life * 0.05) * 0.02;
        }
        // Snow sway
        if (type === 'snow') {
          p.x += Math.sin(p.life * 0.03 + p.y * 0.01) * 0.3;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(1, p.life / 10);
        const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
        let alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        // Stars twinkle
        if (type === 'stars') {
          alpha *= 0.5 + 0.5 * Math.sin(p.life * 0.08 + p.x);
        }

        if (alpha <= 0 || p.life > p.maxLife) return false;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (type === 'fire' || type === 'sparks' || type === 'embers') {
          ctx.shadowBlur = type === 'fire' ? 12 : 6;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'light' || type === 'holy_light' || type === 'stars') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'fog') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(0.5, p.color + '40');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'rain') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.5;
          ctx.globalAlpha = alpha * 0.6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p.vx * 2, p.vy * 2);
          ctx.stroke();
        } else if (type === 'leaves') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'blood') {
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#8B0000';
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'lightning') {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFFFFF';
          ctx.fillStyle = p.color;
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

function getMaxParticles(type: ParticleType): number {
  switch (type) {
    case 'fire': return 35;
    case 'rain': return 50;
    case 'fog': return 8;
    case 'holy_light': return 15;
    case 'snow': return 30;
    case 'lightning': return 10;
    case 'blood': return 20;
    case 'stars': return 25;
    case 'leaves': return 18;
    case 'wind': return 15;
    case 'dust': return 12;
    case 'sparks': return 20;
    case 'embers': return 20;
    case 'light': return 12;
    default: return 15;
  }
}

function getSpawnRate(type: ParticleType): number {
  switch (type) {
    case 'fire': return 2;
    case 'rain': return 1;
    case 'fog': return 20;
    case 'holy_light': return 10;
    case 'snow': return 4;
    case 'lightning': return 15;
    case 'blood': return 5;
    case 'stars': return 12;
    case 'leaves': return 8;
    case 'wind': return 8;
    case 'dust': return 5;
    case 'sparks': return 5;
    case 'embers': return 4;
    case 'light': return 15;
    default: return 5;
  }
}

/** Enhanced scene-level particle selector */
export const getParticleTypeForScene = (chapterId: string, tone?: string): ParticleType | null => {
  // Specific chapter overrides
  const chapterMap: Record<string, ParticleType> = {
    // Fase 1
    'cena1': 'dust',
    'cena3': 'wind',
    'cena4': 'fog',          // Pântano — fog/mist
    'cena5': 'light',
    'cena7': 'wind',
    'cena9': 'leaves',
    'cena10': 'dust',
    'cena12': 'rain',
    'cena13': 'fog',
    'cena14': 'light',
    'cena15': 'sparks',
    // Fase 2 — Intérprete
    'fase2-cena1': 'holy_light',
    'fase2-cena2': 'light',
    'fase2-cena3': 'fire',
    'fase2-cena4': 'holy_light',  // Cruz — divine light
    'fase2-cena5': 'sparks',
    'fase2-cena6': 'light',
    'fase2-cena7': 'dust',
    'fase2-cena8': 'embers',      // Homem na Gaiola
    'fase2-cena9': 'fire',
    'fase2-cena10': 'light',
    'fase2-cena11': 'sparks',
    'fase2-cena12': 'holy_light',
    'fase2-cena13': 'leaves',
    'fase2-cena14': 'light',
    // Fase 3 — Vale da Humilhação
    'fase3-cena1': 'dust',
    'fase3-cena2': 'wind',
    'fase3-cena3': 'fire',        // Apolião — FIRE!
    'fase3-cena4': 'embers',
    'fase3-cena5': 'fog',         // Vale da Sombra — fog
    'fase3-cena6': 'dust',
    'fase3-cena7': 'wind',
    'fase3-cena8': 'light',       // Encontro Fiel
    'fase3-cena9': 'sparks',
    'fase3-cena10': 'leaves',
    // Fase 4 — Feira da Vaidade
    'fase4-cena1': 'sparks',
    'fase4-cena2': 'dust',
    'fase4-cena3': 'sparks',
    'fase4-cena4': 'embers',
    'fase4-cena5': 'fire',        // Julgamento — fire
    'fase4-cena6': 'embers',
    'fase4-cena7': 'light',
    'fase4-cena8': 'holy_light',  // Morte de Fiel — divine
    'fase4-cena9': 'light',
    'fase4-cena10': 'dust',
    'fase4-cena11': 'wind',
    'fase4-cena11b': 'rain',
    'fase4-cena12': 'leaves',
    // Fase 5 — Castelo da Dúvida
    'fase5-cena1': 'fog',         // Castelo — fog
    'fase5-cena2': 'rain',
    'fase5-cena3': 'blood',       // Gigante Desespero — blood
    'fase5-cena4': 'dust',
    'fase5-cena5': 'fog',
    'fase5-cena6': 'holy_light',  // Montanhas Deleitosas
    'fase5-cena7': 'leaves',
    'fase5-cena8': 'wind',
    'fase5-cena9': 'stars',       // Night scene
    'fase5-cena10': 'light',
    'fase5-cena11': 'rain',
    'fase5-cena12': 'fog',
    'fase5-cena13': 'dust',
    'fase5-cena14': 'light',
    // Fase 6 — Cidade Celestial
    'fase6-cena1': 'rain',        // Rio da Morte
    'fase6-cena2': 'fog',
    'fase6-cena3': 'holy_light',  // Anjos — divine light
    'fase6-cena4': 'stars',
    'fase6-cena5': 'holy_light',
    'fase6-cena6': 'light',
    'fase6-cena7': 'stars',
    'fase6-cena8': 'holy_light',
    'fase6-cena9': 'holy_light',  // Cidade Celestial final — GLORY
  };

  if (chapterMap[chapterId]) return chapterMap[chapterId];

  // Keyword fallbacks
  if (chapterId.includes('fogo') || chapterId.includes('fire') || chapterId.includes('fornalha')) return 'embers';
  if (chapterId.includes('vale') || chapterId.includes('sombra') || chapterId.includes('shadow')) return 'fog';
  if (chapterId.includes('celestial') || chapterId.includes('luz') || chapterId.includes('glory')) return 'holy_light';
  if (chapterId.includes('tempestade') || chapterId.includes('storm') || chapterId.includes('vento')) return 'wind';
  if (chapterId.includes('castelo') || chapterId.includes('duvida')) return 'fog';
  if (chapterId.includes('montanha')) return 'leaves';

  // Tone fallbacks
  if (tone === 'heavy' || tone === 'tense') return 'embers';
  if (tone === 'hopeful') return 'light';

  // Phase fallbacks
  if (chapterId.startsWith('fase6')) return 'holy_light';
  if (chapterId.startsWith('fase5')) return 'fog';
  if (chapterId.startsWith('fase4')) return 'sparks';
  if (chapterId.startsWith('fase3')) return 'embers';
  if (chapterId.startsWith('fase2')) return 'light';
  if (chapterId.startsWith('p2-')) return 'dust';

  return 'sparks';
};
