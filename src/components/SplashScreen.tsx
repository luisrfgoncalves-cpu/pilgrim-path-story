import { useState, useEffect } from 'react';
import logoPeregrino from '@/assets/logo-peregrino.png';
import pilgrimStanding from '@/assets/pilgrim-standing.png';

const PHRASES = [
  '"Estreita é a porta e apertado o caminho que leva à vida."',
  '"Corre com perseverança a carreira que te está proposta."',
  '"Ainda que eu ande pelo vale da sombra da morte, não temerei."',
  '"Combati o bom combate, acabei a carreira, guardei a fé."',
  '"O justo viverá pela fé."',
  '"Sede fortes e corajosos, não temais."',
  '"Eu sou o caminho, a verdade e a vida."',
];

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo' | 'pilgrim' | 'done'>('logo');
  const [phraseIdx, setPhraseIdx] = useState(() => Math.floor(Math.random() * PHRASES.length));
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('pilgrim'), 2200);
    const t2 = setTimeout(() => setFadeOut(true), 5000);
    const t3 = setTimeout(() => onFinish(), 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      onClick={() => { setFadeOut(true); setTimeout(onFinish, 600); }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pilgrimDust ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className={`transition-all duration-1000 ${phase === 'logo' ? 'opacity-100 scale-100' : 'opacity-100 scale-90 -translate-y-8'}`}>
        <img
          src={logoPeregrino}
          alt="O Peregrino"
          className="w-72 md:w-96 drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
          width={1024}
          height={512}
        />
      </div>

      {/* Pilgrim image */}
      <div className={`transition-all duration-1000 ease-out ${phase === 'pilgrim' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="relative mt-2">
          <img
            src={pilgrimStanding}
            alt="O Peregrino"
            className="h-56 md:h-72 object-contain drop-shadow-[0_20px_40px_hsl(var(--background)/0.8)]"
            width={512}
            height={768}
          />
          {/* Glow behind pilgrim */}
          <div className="absolute inset-0 -z-10 blur-3xl bg-primary/10 rounded-full scale-150" />
        </div>
      </div>

      {/* Phrase */}
      <div className={`mt-8 px-8 max-w-md text-center transition-all duration-1000 delay-500 ${phase === 'pilgrim' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="text-sm md:text-base text-primary/90 italic font-display leading-relaxed">
          {PHRASES[phraseIdx]}
        </p>
      </div>

      {/* Subtitle */}
      <div className={`mt-4 transition-all duration-700 delay-700 ${phase === 'pilgrim' ? 'opacity-60' : 'opacity-0'}`}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Uma jornada interativa de fé
        </p>
      </div>

      {/* Tap hint */}
      <div className={`absolute bottom-8 transition-all duration-700 ${phase === 'pilgrim' ? 'opacity-40' : 'opacity-0'}`}>
        <p className="text-[10px] text-muted-foreground animate-pulse">Toque para continuar</p>
      </div>
    </div>
  );
};

export default SplashScreen;
