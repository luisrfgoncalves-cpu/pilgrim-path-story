import { useEffect, useState } from 'react';

interface ResultFeedbackProps {
  visible: boolean;
  success: boolean;
  message: string;
  emoji: string;
  posAdjust?: number;
  attrChanges?: Record<string, number>;
  onComplete: () => void;
}

const ATTR_LABELS: Record<string, string> = {
  fe: 'Fé', perseveranca: 'Perseverança', discernimento: 'Discernimento', coragem: 'Coragem',
};

export default function ResultFeedback({ visible, success, message, emoji, posAdjust, attrChanges, onComplete }: ResultFeedbackProps) {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<'impact' | 'details' | 'fade'>('impact');

  useEffect(() => {
    if (!visible) { setShow(false); return; }
    setShow(true);
    setPhase('impact');

    const t1 = setTimeout(() => setPhase('details'), 800);
    const t2 = setTimeout(() => setPhase('fade'), 3500);
    const t3 = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible, onComplete]);

  if (!show) return null;

  const hasPositions = posAdjust && posAdjust !== 0;
  const hasAttrs = attrChanges && Object.keys(attrChanges).length > 0;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center px-6">
      {/* Screen flash */}
      {phase === 'impact' && (
        <div className="absolute inset-0" style={{
          animation: 'resultFlash 0.8s ease-out forwards',
          background: success
            ? 'radial-gradient(circle, hsl(45 80% 50% / 0.25), transparent 70%)'
            : 'radial-gradient(circle, hsl(0 70% 40% / 0.25), transparent 70%)',
        }} />
      )}

      {/* Central impact */}
      <div className={`relative flex flex-col items-center gap-5 transition-all duration-500 ${
        phase === 'fade' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
      }`}>
        <div className="px-6 py-3 rounded-full font-display font-bold text-lg"
          style={{
            background: success ? 'hsl(45 40% 15% / 0.9)' : 'hsl(0 30% 15% / 0.9)',
            border: `2px solid ${success ? 'hsl(45 50% 40%)' : 'hsl(0 40% 35%)'}`,
            color: success ? 'hsl(45 60% 70%)' : 'hsl(0 50% 65%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {success ? 'Resultado' : 'Consequência'}
        </div>

        <div className="max-w-md rounded-2xl px-6 py-5 text-center"
          style={{
            background: 'hsl(0 0% 7% / 0.9)',
            border: '1px solid hsl(0 0% 100% / 0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="text-base leading-relaxed text-white/90 whitespace-pre-line">{message}</p>
        </div>

        {/* Position change */}
        {phase !== 'impact' && hasPositions && (
          <div className="px-8 py-3 rounded-full font-display font-bold text-2xl animate-in slide-in-from-bottom-4"
            style={{
              background: posAdjust! > 0
                ? 'hsl(120 40% 15% / 0.9)'
                : 'hsl(0 40% 15% / 0.9)',
              border: `2px solid ${posAdjust! > 0 ? 'hsl(120 50% 40%)' : 'hsl(0 50% 40%)'}`,
              color: posAdjust! > 0 ? 'hsl(120 60% 70%)' : 'hsl(0 60% 70%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {posAdjust! > 0 ? `+${posAdjust} casas` : `${posAdjust} casas`}
          </div>
        )}

        {/* Attribute changes */}
        {phase !== 'impact' && hasAttrs && (
          <div className="flex flex-wrap gap-3 justify-center animate-in slide-in-from-bottom-4" style={{ animationDelay: '150ms' }}>
            {Object.entries(attrChanges!).map(([key, val]) => (
              <div key={key} className="px-5 py-2 rounded-full text-base font-display font-bold"
                style={{
                  background: val > 0 ? 'hsl(45 40% 15% / 0.9)' : 'hsl(0 30% 15% / 0.9)',
                  border: `2px solid ${val > 0 ? 'hsl(45 50% 40%)' : 'hsl(0 40% 35%)'}`,
                  color: val > 0 ? 'hsl(45 60% 70%)' : 'hsl(0 50% 65%)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {ATTR_LABELS[key] || key}: {val > 0 ? `+${val}` : val}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes resultFlash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes resultBounce {
          0% { transform: scale(0) rotate(-20deg); }
          60% { transform: scale(1.3) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
