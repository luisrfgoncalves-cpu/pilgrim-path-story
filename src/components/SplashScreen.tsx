import { useState, useEffect, useCallback, useRef } from 'react';
import { Sword, Sparkles } from 'lucide-react';
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

/* ── Pilgrim ambient soundtrack (Web Audio — works offline) ── */
function createSplashSoundtrack(): { start: () => void; stop: () => void } {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let stopped = false;
  let timeouts: number[] = [];

  const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

  function playNote(freq: number, startTime: number, dur: number, vol: number, type: OscillatorType = 'sine') {
    if (!ctx || !masterGain) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = ctx.createGain();
    const atk = Math.min(0.4, dur * 0.15);
    const rel = Math.min(0.8, dur * 0.3);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(vol, startTime + atk);
    g.gain.setValueAtTime(vol, startTime + dur - rel);
    g.gain.linearRampToValueAtTime(0, startTime + dur);
    osc.connect(g).connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.1);
  }

  function playPhrase() {
    if (stopped || !ctx || !masterGain) return;
    const now = ctx.currentTime;

    // Deep reverential pad — C minor (C3, Eb3, G3, Bb3)
    const padNotes = [48, 51, 55, 58];
    padNotes.forEach((n, i) => {
      playNote(midiToFreq(n), now + i * 0.2, 6, 0.025, 'sine');
    });

    // Melodic pilgrim theme — pentatonic in C minor
    const melody = [60, 63, 65, 67, 63, 60, 58, 60]; // C4 Eb4 F4 G4 Eb4 C4 Bb3 C4
    melody.forEach((n, i) => {
      playNote(midiToFreq(n), now + 1 + i * 0.6, 0.5, 0.035, 'triangle');
    });

    // High ethereal shimmer
    playNote(midiToFreq(72), now + 2, 4, 0.012, 'sine'); // C5
    playNote(midiToFreq(79), now + 3, 3, 0.008, 'sine'); // G5

    // Low drone — foundation
    playNote(midiToFreq(36), now + 0.5, 8, 0.02, 'sine'); // C2

    // Schedule next phrase with breathing gap
    const nextDelay = 9000 + Math.random() * 4000;
    const t = window.setTimeout(playPhrase, nextDelay);
    timeouts.push(t);
  }

  return {
    start: () => {
      try {
        ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.7;
        masterGain.connect(ctx.destination);
        stopped = false;
        playPhrase();
      } catch { /* silent */ }
    },
    stop: () => {
      stopped = true;
      timeouts.forEach(t => clearTimeout(t));
      if (masterGain) {
        try {
          masterGain.gain.linearRampToValueAtTime(0, (ctx?.currentTime || 0) + 0.5);
        } catch { /* ok */ }
      }
      setTimeout(() => { try { ctx?.close(); } catch {} }, 600);
    }
  };
}

function playEnterSfx() {
  try {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    // Heroic ascending fanfare — C major arpeggio
    const notes = [
      { f: 261.63, t: 0, d: 0.3 },      // C4
      { f: 329.63, t: 0.1, d: 0.3 },     // E4
      { f: 392.0, t: 0.2, d: 0.3 },      // G4
      { f: 523.25, t: 0.3, d: 0.5 },     // C5
      { f: 659.25, t: 0.45, d: 0.4 },    // E5
      { f: 783.99, t: 0.6, d: 0.6 },     // G5
      { f: 1046.5, t: 0.8, d: 0.8 },     // C6
    ];
    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(0.07, now + t + 0.04);
      g.gain.linearRampToValueAtTime(0, now + t + d);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + d + 0.1);
    });
    // Impact boom
    const boom = ctx.createOscillator();
    boom.type = 'sine';
    boom.frequency.value = 80;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.1, now + 0.8);
    bg.gain.linearRampToValueAtTime(0, now + 1.5);
    boom.connect(bg).connect(ctx.destination);
    boom.start(now + 0.8);
    boom.stop(now + 1.6);
  } catch { /* silent fail */ }
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo' | 'ready'>('logo');
  const [phraseIdx] = useState(() => Math.floor(Math.random() * PHRASES.length));
  const [fadeOut, setFadeOut] = useState(false);
  const [btnPulse, setBtnPulse] = useState(false);
  const soundtrackRef = useRef<ReturnType<typeof createSplashSoundtrack> | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('ready');
      // Start continuous soundtrack
      const st = createSplashSoundtrack();
      soundtrackRef.current = st;
      st.start();
    }, 2200);
    const t2 = setTimeout(() => setBtnPulse(true), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      soundtrackRef.current?.stop();
    };
  }, []);

  const handleEnter = useCallback(() => {
    soundtrackRef.current?.stop();
    playEnterSfx();
    setFadeOut(true);
    setTimeout(onFinish, 700);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-700 overflow-hidden ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Animated radial glow — breathing */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px]"
          style={{ animation: 'splashGlow 4s ease-in-out infinite' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-accent/8 blur-[100px]"
          style={{ animation: 'splashGlow 6s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-primary/5 blur-[80px]"
          style={{ animation: 'splashGlow 5s ease-in-out infinite 1s' }}
        />
      </div>

      {/* Rising light rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute bottom-0 bg-gradient-to-t from-primary/8 to-transparent"
            style={{
              width: '2px',
              height: '100%',
              left: `${15 + i * 14}%`,
              animation: `splashRay ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Ambient particles — varied sizes and colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-primary/40' : i % 4 === 1 ? 'bg-accent/25' : i % 4 === 2 ? 'bg-foreground/15' : 'bg-primary/20'
            }`}
            style={{
              width: `${1.5 + Math.random() * 5}px`,
              height: `${1.5 + Math.random() * 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pilgrimDust ${2.5 + i * 0.35}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Logo — large with animated glow */}
      <div className={`transition-all duration-1000 ${phase === 'logo' ? 'opacity-100 scale-100' : 'opacity-100 scale-90 -translate-y-6'}`}>
        <div className="relative">
          <img
            src={logoPeregrino}
            alt="O Peregrino"
            className="w-[22rem] md:w-[30rem] drop-shadow-[0_0_60px_hsl(var(--primary)/0.5)]"
            width={1024}
            height={512}
          />
          {/* Animated glow ring behind logo */}
          <div
            className="absolute inset-0 -z-10 rounded-full bg-primary/15 blur-[60px] scale-110"
            style={{ animation: 'splashGlow 3s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Pilgrim image with dramatic aura */}
      <div className={`transition-all duration-1000 ease-out ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="relative mt-2">
          <img
            src={pilgrimStanding}
            alt="O Peregrino"
            className="h-56 md:h-72 object-contain drop-shadow-[0_10px_50px_hsl(var(--primary)/0.4)]"
            width={512}
            height={768}
          />
          {/* Aura layers */}
          <div className="absolute inset-0 -z-10 blur-3xl bg-primary/15 rounded-full scale-150" style={{ animation: 'splashGlow 3.5s ease-in-out infinite' }} />
          <div className="absolute inset-0 -z-20 blur-[60px] bg-accent/8 rounded-full scale-[2]" style={{ animation: 'splashGlow 5s ease-in-out infinite reverse' }} />
          {/* Sparkle accents around pilgrim */}
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary/60" style={{ animation: 'splashSparkle 2s ease-in-out infinite' }} />
          <Sparkles className="absolute bottom-4 -left-3 w-4 h-4 text-accent/50" style={{ animation: 'splashSparkle 2.5s ease-in-out infinite 0.5s' }} />
          <Sparkles className="absolute top-8 -left-4 w-3 h-3 text-primary/40" style={{ animation: 'splashSparkle 3s ease-in-out infinite 1s' }} />
        </div>
      </div>

      {/* Phrase — bigger text with glow */}
      <div className={`mt-6 px-6 max-w-lg text-center transition-all duration-1000 delay-300 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="text-lg md:text-2xl text-primary italic font-display leading-relaxed drop-shadow-[0_2px_12px_hsl(var(--primary)/0.4)]">
          {PHRASES[phraseIdx]}
        </p>
      </div>

      {/* Subtitle */}
      <div className={`mt-3 transition-all duration-700 delay-500 ${phase === 'ready' ? 'opacity-70' : 'opacity-0'}`}>
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Uma jornada interativa de fé
        </p>
      </div>

      {/* CTA Button — larger, pulsing glow, dramatic */}
      <div className={`mt-10 transition-all duration-700 delay-700 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={handleEnter}
          className={`btn-medieval relative flex items-center gap-4 px-14 py-6 text-xl md:text-2xl font-bold tracking-wide group overflow-hidden ${btnPulse ? 'animate-[splashBtnPulse_2s_ease-in-out_infinite]' : ''}`}
        >
          {/* Animated glow behind button */}
          <span className="absolute inset-0 -z-10 rounded-xl bg-primary/25 blur-2xl group-hover:bg-primary/40 transition-all duration-500" style={{ animation: 'splashGlow 2s ease-in-out infinite' }} />
          <Sword className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
          Iniciar Jornada
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
