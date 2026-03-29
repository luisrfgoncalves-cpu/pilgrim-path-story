import { useState, useEffect, useCallback } from 'react';
import { Sword } from 'lucide-react';
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

/* ── tiny ambient audio ── */
function playAmbient() {
  try {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Deep pad chord (C3 + E3 + G3)
    const freqs = [130.81, 164.81, 196.0];
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.04, now + 1.5);
      g.gain.linearRampToValueAtTime(0.02, now + 4);
      g.gain.linearRampToValueAtTime(0, now + 6);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + i * 0.3);
      osc.stop(now + 6);
    });

    // Gentle high shimmer
    const shimmer = ctx.createOscillator();
    shimmer.type = 'triangle';
    shimmer.frequency.value = 523.25; // C5
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0, now + 1);
    sg.gain.linearRampToValueAtTime(0.015, now + 2);
    sg.gain.linearRampToValueAtTime(0, now + 5);
    shimmer.connect(sg).connect(ctx.destination);
    shimmer.start(now + 1);
    shimmer.stop(now + 5);
  } catch { /* silent fail */ }
}

function playEnterSfx() {
  try {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    // Heroic ascending notes
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + i * 0.1);
      g.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.05);
      g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.35);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  } catch { /* silent fail */ }
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo' | 'ready'>('logo');
  const [phraseIdx] = useState(() => Math.floor(Math.random() * PHRASES.length));
  const [fadeOut, setFadeOut] = useState(false);
  const [btnPulse, setBtnPulse] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('ready');
      playAmbient();
    }, 2200);
    const t2 = setTimeout(() => setBtnPulse(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleEnter = useCallback(() => {
    playEnterSfx();
    setFadeOut(true);
    setTimeout(onFinish, 700);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-700 overflow-hidden ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Radial glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" style={{ animation: 'pilgrimDust 8s ease-in-out infinite' }} />
      </div>

      {/* Ambient particles — more and varied */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-primary/30' : i % 3 === 1 ? 'bg-accent/20' : 'bg-foreground/10'}`}
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pilgrimDust ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Logo — bigger */}
      <div className={`transition-all duration-1000 ${phase === 'logo' ? 'opacity-100 scale-100' : 'opacity-100 scale-90 -translate-y-6'}`}>
        <img
          src={logoPeregrino}
          alt="O Peregrino"
          className="w-[22rem] md:w-[30rem] drop-shadow-[0_0_60px_hsl(var(--primary)/0.5)]"
          width={1024}
          height={512}
        />
      </div>

      {/* Pilgrim image */}
      <div className={`transition-all duration-1000 ease-out ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="relative mt-2">
          <img
            src={pilgrimStanding}
            alt="O Peregrino"
            className="h-56 md:h-72 object-contain drop-shadow-[0_20px_40px_hsl(var(--background)/0.8)]"
            width={512}
            height={768}
          />
          <div className="absolute inset-0 -z-10 blur-3xl bg-primary/10 rounded-full scale-150" />
        </div>
      </div>

      {/* Phrase — bigger text */}
      <div className={`mt-6 px-6 max-w-lg text-center transition-all duration-1000 delay-300 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="text-lg md:text-2xl text-primary/90 italic font-display leading-relaxed drop-shadow-[0_2px_8px_hsl(var(--primary)/0.3)]">
          {PHRASES[phraseIdx]}
        </p>
      </div>

      {/* Subtitle — bigger */}
      <div className={`mt-3 transition-all duration-700 delay-500 ${phase === 'ready' ? 'opacity-70' : 'opacity-0'}`}>
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Uma jornada interativa de fé
        </p>
      </div>

      {/* CTA Button — bigger, glowing, exciting text */}
      <div className={`mt-10 transition-all duration-700 delay-700 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={handleEnter}
          className={`btn-medieval relative flex items-center gap-4 px-12 py-5 text-xl md:text-2xl font-bold tracking-wide group overflow-hidden ${btnPulse ? 'animate-[splashBtnPulse_2s_ease-in-out_infinite]' : ''}`}
        >
          {/* Glow behind button */}
          <span className="absolute inset-0 -z-10 rounded-lg bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500" />
          <Sword className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
          Iniciar Jornada
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
