import { useState, useEffect } from 'react';
import PreviewPaywall from './PreviewPaywall';
import { Timer } from 'lucide-react';

const TRIAL_KEY = 'peregrino_preview_trial_start';
const TRIAL_DURATION = 3 * 60 * 1000; // 3 minutes

/** Shows a floating timer badge during preview trial */
const TrialTimer = ({ startTime }: { startTime: number }) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, TRIAL_DURATION - (Date.now() - startTime));
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const isLow = remaining < 60000;

  return (
    <div
      className="fixed top-2 right-2 z-[90] flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-display font-bold pointer-events-none"
      style={{
        background: isLow
          ? 'linear-gradient(135deg, hsl(0 60% 15%), hsl(0 50% 8%))'
          : 'linear-gradient(135deg, hsl(40 30% 12%), hsl(40 20% 6%))',
        borderColor: isLow ? 'hsl(0 60% 40%)' : 'hsl(40 60% 40% / 0.4)',
        boxShadow: isLow
          ? '0 0 15px hsl(0 60% 50% / 0.3)'
          : '0 0 15px hsl(40 70% 50% / 0.2)',
        color: isLow ? 'hsl(0 80% 65%)' : 'hsl(40 80% 60%)',
        animation: isLow ? 'pulse 1s ease-in-out infinite' : 'none',
      }}
    >
      <Timer className="w-3.5 h-3.5" />
      {mins}:{String(secs).padStart(2, '0')}
    </div>
  );
};

/**
 * Allows unauthenticated preview access for 3 minutes per device.
 * Uses localStorage fingerprint to prevent repeated trials.
 */
const PreviewTrialGate = ({ children }: { children: React.ReactNode }) => {
  const [expired, setExpired] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    let stored = localStorage.getItem(TRIAL_KEY);
    if (!stored) {
      stored = String(Date.now());
      localStorage.setItem(TRIAL_KEY, stored);
    }

    const st = parseInt(stored, 10);
    setStartTime(st);

    const check = () => {
      if (Date.now() - st >= TRIAL_DURATION) {
        setExpired(true);
      }
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) return <PreviewPaywall />;

  return (
    <>
      {startTime > 0 && <TrialTimer startTime={startTime} />}
      {children}
    </>
  );
};

export default PreviewTrialGate;
