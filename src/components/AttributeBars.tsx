import { useState, useEffect, useRef } from 'react';
import { PlayerAttributes } from '@/hooks/useStoryProgress';
import { ChoiceEffect } from '@/data/story';

interface AttributeBarsProps {
  attributes: PlayerAttributes;
  compact?: boolean;
}

const attrConfig = [
  { key: 'fe' as const, label: 'Fé', icon: '🔥', color: 'bg-orange-500' },
  { key: 'perseveranca' as const, label: 'Perseverança', icon: '⛰️', color: 'bg-emerald-500' },
  { key: 'discernimento' as const, label: 'Discernimento', icon: '👁️', color: 'bg-blue-500' },
  { key: 'coragem' as const, label: 'Coragem', icon: '🛡️', color: 'bg-amber-500' },
];

const AttributeBars = ({ attributes, compact = false }: AttributeBarsProps) => {
  const [prevAttrs, setPrevAttrs] = useState(attributes);
  const [changes, setChanges] = useState<Partial<Record<keyof PlayerAttributes, number>>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const diff: Partial<Record<keyof PlayerAttributes, number>> = {};
    let hasChange = false;
    for (const { key } of attrConfig) {
      const delta = attributes[key] - prevAttrs[key];
      if (delta !== 0) {
        diff[key] = delta;
        hasChange = true;
      }
    }
    if (hasChange) {
      setChanges(diff);
      setPrevAttrs(attributes);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setChanges({}), 2000);
    }
  }, [attributes]);

  const maxVal = 15;

  return (
    <div className={`space-y-${compact ? '1.5' : '2'}`}>
      {attrConfig.map(({ key, label, icon, color }) => {
        const val = Math.max(0, attributes[key]);
        const pct = Math.min((val / maxVal) * 100, 100);
        const change = changes[key];

        return (
          <div key={key} className="relative">
            <div className="flex items-center gap-2">
              <span className="text-xs w-4 text-center">{icon}</span>
              {!compact && <span className="text-[10px] text-muted-foreground w-20 uppercase tracking-wider">{label}</span>}
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden relative">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700 ease-out relative`}
                  style={{ width: `${pct}%` }}
                >
                  {/* Shimmer effect on change */}
                  {change && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1s_ease-out]" />
                  )}
                </div>
              </div>
              <span className="text-xs text-foreground font-medium w-5 text-right">{val}</span>

              {/* Change indicator */}
              {change && (
                <span
                  className={`absolute -right-1 -top-3 text-xs font-bold animate-[floatUp_1.5s_ease-out_forwards] ${
                    change > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {change > 0 ? `+${change}` : change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeBars;
