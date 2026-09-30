import React, { useEffect } from 'react';
import { useShake } from '@/hooks/useShake';
import { playGameSfx } from '@/lib/gameSfx';

interface EpicCharacterViewProps {
  character: { name: string; img: string; role?: string; isVillain?: boolean };
  onDismiss: () => void;
}

export function EpicCharacterView({ character, onDismiss }: EpicCharacterViewProps) {
  const { isShaking, triggerShake, shakeClass } = useShake();

  useEffect(() => {
    // Treme a tela bruscamente se for um vilão
    if (character.isVillain) {
      triggerShake('heavy', 800);
    } else {
      triggerShake('light', 400);
    }
    
    // Auto-dimiss após 6 segundos para não travar o jogo muito tempo
    const timer = setTimeout(() => {
     onDismiss();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [character.isVillain, onDismiss, triggerShake]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-auto ${shakeClass}`}
      onClick={onDismiss}
      style={{ animation: 'charRevealBg 8s ease-out forwards' }}
    >
      {/* Dark cinematic backdrop with radial light */}
      <div className="absolute inset-0" style={{
        background: character.isVillain 
          ? 'radial-gradient(ellipse 60% 80% at 50% 60%, hsl(0 80% 10% / 0.7) 0%, hsl(0 0% 0% / 0.95) 100%)' 
          : 'radial-gradient(ellipse 60% 80% at 50% 60%, hsl(40 60% 20% / 0.6) 0%, hsl(0 0% 0% / 0.92) 100%)',
      }} />

      {/* Ambient floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1.5 + Math.random() * 4}px`,
              height: `${1.5 + Math.random() * 4}px`,
              left: `${5 + Math.random() * 90}%`,
              top: `${10 + Math.random() * 80}%`,
              background: character.isVillain 
                ? (i % 2 === 0 ? 'hsl(0 70% 50% / 0.7)' : 'hsl(0 0% 40% / 0.5)')
                : (i % 3 === 0 ? 'hsl(40 70% 60% / 0.7)' : 'hsl(0 0% 80% / 0.4)'),
              animation: `pilgrimDust ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Character image — VERY BIG, NO FRAME, floating 3D */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-50 duration-1000 slide-in-from-bottom-24" 
           style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        <div className="relative group">
          <img
            src={character.img}
            alt={character.name}
            className="w-80 h-[28rem] md:w-[28rem] md:h-[36rem] object-cover object-top mx-auto"
            style={{
              borderRadius: '0',
              border: 'none',
              // Dynamic glowing shadow based on alignment
              boxShadow: character.isVillain 
                ? '0 0 100px hsl(0 80% 30% / 0.4), 0 40px 100px hsl(0 0% 0% / 0.9)' 
                : '0 0 100px hsl(40 60% 50% / 0.3), 0 40px 100px hsl(0 0% 0% / 0.8)',
              filter: 'contrast(1.15) brightness(1.1) drop-shadow(0 0 40px rgba(0,0,0,0.5))',
              // Soft gradient mask to bleed the bottom of the image into the darkness (Borderless illusion)
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            }}
          />
          
          {/* Intense Glow behind character */}
          <div className="absolute inset-0 -z-10 blur-[80px] scale-125" style={{
            background: character.isVillain 
             ? 'radial-gradient(ellipse at center 40%, hsl(0 80% 40% / 0.4) 0%, transparent 70%)'
             : 'radial-gradient(ellipse at center 40%, hsl(40 60% 50% / 0.3) 0%, transparent 70%)',
          }} />
        </div>

        {/* Cinematic Name Display */}
        <div className="text-center mt-[-2rem] relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
          <p className="font-display text-5xl md:text-6xl font-extrabold uppercase" style={{
            color: character.isVillain ? 'hsl(0 80% 65%)' : 'hsl(40 80% 75%)',
            textShadow: character.isVillain 
              ? '0 6px 30px hsl(0 0% 0% / 0.9), 0 0 80px hsl(0 90% 40% / 0.8)' 
              : '0 6px 30px hsl(0 0% 0% / 0.9), 0 0 80px hsl(40 60% 50% / 0.6)',
            letterSpacing: '0.05em',
          }}>
            {character.name}
          </p>
          {character.role && (
            <p className="text-lg md:text-xl mt-3 font-display uppercase tracking-[0.4em] animate-in fade-in duration-1000 delay-1000 fill-mode-both" style={{
              color: character.isVillain ? 'hsl(0 60% 50%)' : 'hsl(40 40% 55%)',
              textShadow: '0 4px 16px hsl(0 0% 0% / 0.9)',
            }}>
              {character.role}
            </p>
          )}
        </div>

        {/* Tap hint */}
        <p className="text-xs mt-10 font-display uppercase tracking-[0.3em] font-bold animate-in fade-in duration-1000 delay-1000 fill-mode-both animate-pulse" style={{
          color: 'hsl(0 0% 60%)',
        }}>
          Toque para continuar a jornada
        </p>
      </div>
    </div>
  );
}
