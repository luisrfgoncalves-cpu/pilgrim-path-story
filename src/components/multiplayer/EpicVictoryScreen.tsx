// Epic Victory Screen with fireworks, stats, and dramatic animation
import { useEffect, useState, useRef } from 'react';
import { Crown, Trophy, Star, Sparkles } from 'lucide-react';
import { playVictory } from './BoardSounds';

interface PlayerStats {
  trapsHit: number;
  challengesWon: number;
  challengesLost: number;
  blessingsReceived: number;
  giantsDefeated: number;
  giantsLost: number;
  scripturesCorrect: number;
  scripturesWrong: number;
  tilesVisited: number;
  maxStreak: number;
  backToStartCount: number;
  shieldsGained: number;
  swapsTriggered: number;
  phasesCompleted: number;
  riverCrossed: boolean;
}

interface VictoryPlayer {
  id: string;
  name: string;
  color: string;
  finishOrder: number | null;
  attributes: { fe: number; perseveranca: number; discernimento: number; coragem: number };
  stats?: PlayerStats;
}

interface EpicVictoryScreenProps {
  players: VictoryPlayer[];
  onPlayAgain: () => void;
  onExit: () => void;
}

function Firework({ delay, x }: { delay: number; x: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!visible) return null;

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF9FF3', '#FECA57', '#FF6348'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: '15%' }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 40 + Math.random() * 60;
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
              animation: `fireworkBurst 1.5s ease-out forwards`,
              transform: `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`,
              animationDelay: `${i * 0.03}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function EpicVictoryScreen({ players, onPlayAgain, onExit }: EpicVictoryScreenProps) {
  const [phase, setPhase] = useState<'buildup' | 'reveal' | 'rankings' | 'stats'>('buildup');
  const [showFireworks, setShowFireworks] = useState(false);
  const hasPlayed = useRef(false);

  const sorted = [...players]
    .filter(p => p.finishOrder !== null)
    .sort((a, b) => (a.finishOrder || 99) - (b.finishOrder || 99));

  const winner = sorted[0];

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('reveal');
      setShowFireworks(true);
      if (!hasPlayed.current) {
        hasPlayed.current = true;
        playVictory();
        if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100, 50, 200]);
      }
    }, 2500);

    const t2 = setTimeout(() => setPhase('rankings'), 5000);
    const t3 = setTimeout(() => setPhase('stats'), 8000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const totalAttr = (p: VictoryPlayer) =>
    p.attributes.fe + p.attributes.perseveranca + p.attributes.discernimento + p.attributes.coragem;

  // Generate stat highlights for winner
  const getStatHighlights = (p: VictoryPlayer) => {
    const s = p.stats;
    if (!s) return [];
    const highlights: { icon: string; label: string; value: string }[] = [];
    if (s.giantsDefeated > 0) highlights.push({ icon: '💀', label: 'Gigantes derrotados', value: `${s.giantsDefeated}` });
    if (s.challengesWon > 0) highlights.push({ icon: '⚔️', label: 'Desafios vencidos', value: `${s.challengesWon}` });
    if (s.scripturesCorrect > 0) highlights.push({ icon: '📖', label: 'Escrituras acertadas', value: `${s.scripturesCorrect}` });
    if (s.blessingsReceived > 0) highlights.push({ icon: '⭐', label: 'Bênçãos recebidas', value: `${s.blessingsReceived}` });
    if (s.trapsHit > 0) highlights.push({ icon: '🔙', label: 'Armadilhas sofridas', value: `${s.trapsHit}` });
    if (s.shieldsGained > 0) highlights.push({ icon: '🛡️', label: 'Escudos obtidos', value: `${s.shieldsGained}` });
    if (s.maxStreak > 1) highlights.push({ icon: '🔥', label: 'Melhor sequência', value: `${s.maxStreak}x` });
    if (s.backToStartCount > 0) highlights.push({ icon: '☠️', label: 'Voltas ao início', value: `${s.backToStartCount}` });
    if (s.riverCrossed) highlights.push({ icon: '🌊', label: 'Rio da Morte', value: 'Atravessou!' });
    return highlights;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, hsl(45 60% 15%), hsl(30 20% 5%) 70%)',
      }} />

      {/* Light rays */}
      <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 h-full"
            style={{
              width: '3px',
              background: 'linear-gradient(to bottom, rgba(255,215,0,0.6), transparent 60%)',
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: 'top center',
              animation: `rayPulse 3s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Fireworks */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <Firework key={i} delay={i * 500} x={10 + Math.random() * 80} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-4 py-10 space-y-6">
        {/* BUILDUP */}
        {phase === 'buildup' && (
          <div className="text-center space-y-4 min-h-[60vh] flex flex-col items-center justify-center">
            <div className="text-7xl" style={{
              animation: 'spin 2s linear infinite',
              filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.6))',
            }}>
              ⭐
            </div>
            <p className="text-lg font-display uppercase tracking-[0.25em] animate-pulse"
              style={{ color: 'hsl(45 60% 60%)', textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
            >
              A jornada chegou ao fim...
            </p>
            <p className="text-2xl font-display font-bold uppercase tracking-[0.3em]"
              style={{ color: 'hsl(45 80% 70%)', textShadow: '0 0 30px rgba(255,215,0,0.4)' }}
            >
              E o vencedor é...
            </p>
          </div>
        )}

        {/* REVEAL + RANKINGS + STATS */}
        {(phase === 'reveal' || phase === 'rankings' || phase === 'stats') && winner && (
          <>
            {/* Winner card */}
            <div className="text-center space-y-3" style={{
              animation: phase === 'reveal' ? 'victoryReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
            }}>
              <div className="relative inline-block">
                <Crown className="w-14 h-14 mx-auto text-yellow-400 mb-2" style={{
                  filter: 'drop-shadow(0 0 25px rgba(255,215,0,0.7))',
                  animation: 'bounce 1s infinite',
                }} />
                <div
                  className="w-28 h-28 rounded-2xl mx-auto flex items-center justify-center text-5xl font-bold"
                  style={{
                    backgroundColor: winner.color + '30',
                    border: `4px solid ${winner.color}`,
                    color: winner.color,
                    boxShadow: `0 0 50px ${winner.color}80, 0 0 100px ${winner.color}40`,
                  }}
                >
                  {winner.name.charAt(0)}
                </div>
              </div>

              <h2 className="text-3xl font-display font-bold"
                style={{ color: 'hsl(45 90% 75%)', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}
              >
                {winner.name}
              </h2>
              <p className="text-sm font-display" style={{ color: 'hsl(45 60% 60%)' }}>
                🏆 Alcançou a Cidade Celestial!
              </p>

              {/* Winner attributes */}
              <div className="flex justify-center gap-4 text-sm" style={{ color: 'hsl(45 40% 60%)' }}>
                <span>🔥 {winner.attributes.fe}</span>
                <span>⛰️ {winner.attributes.perseveranca}</span>
                <span>👁️ {winner.attributes.discernimento}</span>
                <span>🛡️ {winner.attributes.coragem}</span>
              </div>
              <p className="text-xs" style={{ color: 'hsl(45 30% 50%)' }}>
                Total: {totalAttr(winner)} pontos de atributo
              </p>
            </div>

            {/* Rankings */}
            {(phase === 'rankings' || phase === 'stats') && (
              <div className="space-y-2 animate-fade-in">
                <h3 className="text-center text-sm font-display uppercase tracking-widest"
                  style={{ color: 'hsl(45 40% 50%)' }}
                >
                  Classificação Final
                </h3>
                {sorted.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, hsl(45 40% 18%), hsl(40 25% 12%))'
                        : 'hsl(30 10% 12% / 0.8)',
                      border: `1.5px solid ${i === 0 ? 'hsl(45 60% 50% / 0.5)' : 'hsl(0 0% 20% / 0.5)'}`,
                      boxShadow: i === 0 ? '0 0 25px hsl(45 60% 50% / 0.15)' : undefined,
                      animation: `slideInRank 0.4s ease-out ${i * 0.15}s both`,
                    }}
                  >
                    <span className="text-2xl w-8 text-center">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                      style={{ backgroundColor: p.color + '25', border: `2px solid ${p.color}`, color: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-bold truncate" style={{
                        color: i === 0 ? 'hsl(45 80% 75%)' : 'hsl(0 0% 80%)',
                      }}>
                        {p.name}
                      </p>
                      <div className="flex gap-2 text-[9px]" style={{ color: 'hsl(0 0% 50%)' }}>
                        <span>🔥{p.attributes.fe}</span>
                        <span>⛰{p.attributes.perseveranca}</span>
                        <span>👁{p.attributes.discernimento}</span>
                        <span>🛡{p.attributes.coragem}</span>
                        <span className="ml-1 font-bold" style={{ color: 'hsl(45 50% 55%)' }}>
                          Σ{totalAttr(p)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STATS — detailed journey statistics */}
            {phase === 'stats' && winner.stats && (
              <div className="space-y-3 animate-fade-in pt-2">
                <h3 className="text-center text-sm font-display uppercase tracking-widest"
                  style={{ color: 'hsl(45 40% 50%)' }}
                >
                  📊 Estatísticas da Jornada
                </h3>

                {/* Winner stats highlights */}
                <div className="rounded-xl p-4 space-y-2" style={{
                  background: 'hsl(40 20% 10% / 0.8)',
                  border: '1px solid hsl(45 40% 30% / 0.5)',
                }}>
                  <p className="text-xs font-display font-bold" style={{ color: 'hsl(45 60% 65%)' }}>
                    {winner.name} — Resumo
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {getStatHighlights(winner).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]"
                        style={{
                          animation: `slideInRank 0.3s ease-out ${i * 0.1}s both`,
                        }}
                      >
                        <span className="text-base">{h.icon}</span>
                        <div>
                          <p style={{ color: 'hsl(0 0% 65%)' }}>{h.label}</p>
                          <p className="font-bold" style={{ color: 'hsl(45 60% 70%)' }}>{h.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All players comparison */}
                {sorted.length > 1 && (
                  <div className="rounded-xl p-4 space-y-2" style={{
                    background: 'hsl(30 10% 10% / 0.6)',
                    border: '1px solid hsl(0 0% 20% / 0.5)',
                  }}>
                    <p className="text-xs font-display font-bold" style={{ color: 'hsl(0 0% 60%)' }}>
                      Comparativo
                    </p>
                    {sorted.map((p, i) => {
                      const s = p.stats;
                      if (!s) return null;
                      return (
                        <div key={p.id} className="flex items-center gap-2 text-[10px]" style={{
                          animation: `slideInRank 0.3s ease-out ${i * 0.1 + 0.5}s both`,
                        }}>
                          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="font-medium w-16 truncate" style={{ color: 'hsl(0 0% 70%)' }}>{p.name}</span>
                          <div className="flex gap-2 flex-wrap" style={{ color: 'hsl(0 0% 50%)' }}>
                            <span>⚔{s.challengesWon}</span>
                            <span>💀{s.giantsDefeated}</span>
                            <span>📖{s.scripturesCorrect}</span>
                            <span>⭐{s.blessingsReceived}</span>
                            <span>🔙{s.trapsHit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    onClick={onPlayAgain}
                    className="w-full py-4 rounded-xl font-display text-sm font-bold transition-all active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, hsl(45 60% 45%), hsl(35 50% 35%))',
                      color: 'hsl(45 90% 95%)',
                      boxShadow: '0 0 30px hsl(45 60% 45% / 0.3)',
                      border: '1px solid hsl(45 60% 55% / 0.4)',
                    }}
                  >
                    🎲 Jogar Novamente
                  </button>
                  <button
                    onClick={onExit}
                    className="w-full py-3 rounded-xl font-display text-sm transition-all active:scale-95"
                    style={{
                      background: 'hsl(30 10% 12%)',
                      color: 'hsl(0 0% 55%)',
                      border: '1px solid hsl(0 0% 20%)',
                    }}
                  >
                    Voltar ao Menu
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fireworkBurst {
          0% { opacity: 1; transform: scale(1) translate(0, 0); }
          100% { opacity: 0; transform: scale(0.3) translate(var(--tx, 0), var(--ty, -50px)); }
        }
        @keyframes victoryReveal {
          0% { transform: scale(0.3) translateY(50px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes rayPulse {
          0% { opacity: 0.1; }
          100% { opacity: 0.4; }
        }
        @keyframes slideInRank {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
