import { useEffect, useState } from 'react';
import { playGameSfx } from '@/lib/gameSfx';
import { Sparkles } from 'lucide-react';

interface ScreenHeroProps {
  /** Image src or null for icon-only mode */
  image?: string;
  /** Fallback icon when no image */
  icon?: React.ReactNode;
  /** Character/element name */
  name: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Sound to play on reveal */
  sfx?: 'charRevealAlly' | 'charRevealVillain' | 'suspense' | 'gameStart' | 'accept';
  /** Size variant */
  size?: 'md' | 'lg';
}

const ScreenHero = ({ image, icon, name, subtitle, sfx = 'accept', size = 'lg' }: ScreenHeroProps) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      playGameSfx(sfx);
    }, 300);
    return () => clearTimeout(t);
  }, [sfx]);

  const imgSize = size === 'lg' ? 'h-40 md:h-52' : 'h-28 md:h-36';
  const iconSize = size === 'lg' ? 'w-20 h-20 md:w-28 md:h-28' : 'w-14 h-14 md:w-20 md:h-20';

  return (
    <div className="flex flex-col items-center py-4">
      <div
        className={`relative transition-all duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}
        style={{ animation: revealed ? 'screenHeroReveal 0.8s ease-out forwards' : 'none' }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className={`${imgSize} object-contain drop-shadow-[0_8px_40px_hsl(var(--primary)/0.4)]`}
          />
        ) : icon ? (
          <div className={`${iconSize} flex items-center justify-center text-primary drop-shadow-[0_8px_40px_hsl(var(--primary)/0.4)]`}>
            {icon}
          </div>
        ) : null}

        {/* Glow aura */}
        <div
          className="absolute inset-0 -z-10 blur-3xl bg-primary/15 rounded-full scale-150"
          style={{ animation: 'screenHeroGlow 3s ease-in-out infinite' }}
        />

        {/* Sparkles */}
        <Sparkles
          className="absolute -top-1 -right-1 w-4 h-4 text-primary/60"
          style={{ animation: 'splashSparkle 2s ease-in-out infinite' }}
        />
        <Sparkles
          className="absolute bottom-2 -left-2 w-3 h-3 text-accent/50"
          style={{ animation: 'splashSparkle 2.5s ease-in-out infinite 0.5s' }}
        />
      </div>

      {/* Name */}
      <div className={`mt-3 text-center transition-all duration-500 delay-300 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="font-display text-lg md:text-xl text-primary drop-shadow-[0_2px_8px_hsl(var(--primary)/0.3)]">
          {name}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default ScreenHero;
