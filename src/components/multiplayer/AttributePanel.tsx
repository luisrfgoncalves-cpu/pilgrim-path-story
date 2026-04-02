import { useEffect, useState } from 'react';
import { Shield, Sword, BookOpen, Heart } from 'lucide-react';

interface PlayerAttributes {
  fe: number;
  perseveranca: number;
  discernimento: number;
  coragem: number;
}

interface AttributePanelProps {
  players: {
    name: string;
    color: string;
    attributes: PlayerAttributes;
    hasShield: boolean;
    isStunned: boolean;
    finished: boolean;
  }[];
  currentPlayerIdx: number;
  expanded: boolean;
  onToggle: () => void;
}

const ATTR_CONFIG = [
  { key: 'fe' as const, label: 'Fé', icon: Heart, color: 'hsl(45 80% 55%)' },
  { key: 'perseveranca' as const, label: 'Persev.', icon: Shield, color: 'hsl(200 70% 55%)' },
  { key: 'discernimento' as const, label: 'Discern.', icon: BookOpen, color: 'hsl(270 60% 60%)' },
  { key: 'coragem' as const, label: 'Coragem', icon: Sword, color: 'hsl(15 80% 55%)' },
];

const MAX_ATTR = 10;

export default function AttributePanel({ players, currentPlayerIdx, expanded, onToggle }: AttributePanelProps) {
  const [flashAttr, setFlashAttr] = useState<string | null>(null);
  const current = players[currentPlayerIdx];

  if (!current) return null;

  return (
    <div className="w-full">
      {/* Compact bar — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-[0.98]"
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: current.color }} />
        <span className="text-[10px] font-display font-bold text-foreground truncate">{current.name}</span>
        <div className="flex-1 flex items-center gap-1 justify-end">
          {ATTR_CONFIG.map(attr => {
            const val = current.attributes[attr.key];
            const Icon = attr.icon;
            return (
              <div key={attr.key} className="flex items-center gap-0.5">
                <Icon className="w-3 h-3" style={{ color: attr.color }} />
                <span className="text-[10px] font-mono font-bold" style={{ color: attr.color }}>{val}</span>
              </div>
            );
          })}
        </div>
        <span className="text-[9px] text-muted-foreground ml-1">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="mt-1 p-3 rounded-xl space-y-2 overflow-y-auto max-h-[40vh]"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
        >
          {players.map((p, pi) => (
            <div key={pi} className={`p-2 rounded-lg ${pi === currentPlayerIdx ? 'ring-1 ring-primary/40' : ''}`}
              style={{ background: pi === currentPlayerIdx ? 'hsl(var(--primary) / 0.05)' : 'transparent' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs font-display font-bold text-foreground">{p.name}</span>
                {p.hasShield && <span className="text-xs">🛡️</span>}
                {p.isStunned && <span className="text-xs">😵</span>}
                {p.finished && <span className="text-xs">🏆</span>}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {ATTR_CONFIG.map(attr => {
                  const val = p.attributes[attr.key];
                  const pct = Math.max(0, Math.min(100, (val / MAX_ATTR) * 100));
                  const Icon = attr.icon;
                  return (
                    <div key={attr.key} className="flex items-center gap-1.5">
                      <Icon className="w-3 h-3 shrink-0" style={{ color: attr.color }} />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: attr.color }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold w-4 text-right" style={{ color: attr.color }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
