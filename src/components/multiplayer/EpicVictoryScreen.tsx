// Epic Victory Screen — faithful to Bunyan's Pilgrim's Progress
// The arrival at the Celestial City with trumpets, angels, golden crown,
// and the contrast with Ignorance who is turned away
import { useEffect, useState, useRef } from 'react';
import { Crown, Trophy } from 'lucide-react';
import { playVictory, playPhaseTransitionSound } from './BoardSounds';

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

function Firework({ delay, x, y }: { delay: number; x: number; y?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!visible) return null;

  const colors = ['#FFD700', '#FFF8DC', '#FFFACD', '#F0E68C', '#DAA520', '#FFE4B5', '#FFEFD5'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y || 15}%` }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 30 + Math.random() * 50;
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
              animation: `fireworkBurst 1.8s ease-out forwards`,
              transform: `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`,
              animationDelay: `${i * 0.04}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// Narrative lines for the arrival — faithful to Bunyan
const ARRIVAL_NARRATIVE = [
  '«E vi a Cidade Santa... descendo do céu, da parte de Deus.»',
  'Os Resplandecentes acompanham o peregrino até o Rio.',
  'As águas foram atravessadas pela fé.',
  'Do outro lado, anjos aguardam com trombetas de ouro.',
  'Os portões da Cidade Celestial se abrem de par em par!',
  '«Entrai no gozo do vosso Senhor!»',
  'Uma coroa de ouro é colocada sobre a cabeça do peregrino.',
  'As sinos da cidade repicam em júbilo eterno.',
];

// Ignorance contrast — faithful to the book
const IGNORANCE_NARRATIVE = [
  'Mas nem todos entram pelos portões...',
  'Ignorância tentou cruzar o Rio em uma barca chamada Vã Esperança.',
  'Ao chegar aos portões, perguntaram: «Onde está teu certificado?»',
  'Ele não tinha. Nunca passou pela Porta Estreita.',
  'Os portões se fecharam. Ignorância foi levado para longe.',
  '«Há caminho que ao homem parece direito, mas o fim dele são caminhos de morte.»',
];

export default function EpicVictoryScreen({ players, onPlayAgain, onExit }: EpicVictoryScreenProps) {
  const [phase, setPhase] = useState<'approach' | 'gates' | 'crown' | 'ignorance' | 'rankings' | 'stats'>('approach');
  const [narrativeIdx, setNarrativeIdx] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const hasPlayed = useRef(false);

  const sorted = [...players]
    .filter(p => p.finishOrder !== null)
    .sort((a, b) => (a.finishOrder || 99) - (b.finishOrder || 99));

  const winner = sorted[0];

  useEffect(() => {
    // Phase 1: Approach — narrative lines
    playPhaseTransitionSound(5);

    const narrativeTimers: number[] = [];
    ARRIVAL_NARRATIVE.forEach((_, i) => {
      narrativeTimers.push(window.setTimeout(() => setNarrativeIdx(i), i * 2500));
    });

    // Phase 2: Gates open
    const gatesTime = ARRIVAL_NARRATIVE.length * 2500 + 500;
    const t2 = setTimeout(() => {
      setPhase('gates');
      setShowFireworks(true);
      if (!hasPlayed.current) {
        hasPlayed.current = true;
        playVictory();
        if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100, 50, 200, 100, 300]);
      }
    }, gatesTime);

    // Phase 3: Crown
    const t3 = setTimeout(() => setPhase('crown'), gatesTime + 3500);

    // Phase 4: Ignorance contrast
    const t4 = setTimeout(() => {
      setPhase('ignorance');
      setNarrativeIdx(0);
    }, gatesTime + 7000);

    // Phase 5: Rankings
    const ignoranceTime = gatesTime + 7000 + IGNORANCE_NARRATIVE.length * 2200 + 1500;
    const t5 = setTimeout(() => setPhase('rankings'), ignoranceTime);

    // Phase 6: Stats
    const t6 = setTimeout(() => setPhase('stats'), ignoranceTime + 3000);

    return () => {
      narrativeTimers.forEach(clearTimeout);
      clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6);
    };
  }, []);

  // Ignorance narrative progression
  useEffect(() => {
    if (phase !== 'ignorance') return;
    const timers = IGNORANCE_NARRATIVE.map((_, i) => {
      if (i === 0) return -1;
      return window.setTimeout(() => setNarrativeIdx(i), i * 2200);
    }).filter(t => t >= 0);
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const totalAttr = (p: VictoryPlayer) =>
    p.attributes.fe + p.attributes.perseveranca + p.attributes.discernimento + p.attributes.coragem;

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

  const skipToEnd = () => {
    if (phase === 'approach' || phase === 'gates' || phase === 'crown' || phase === 'ignorance') {
      setPhase('rankings');
      setShowFireworks(true);
      if (!hasPlayed.current) {
        hasPlayed.current = true;
        playVictory();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" onClick={skipToEnd}>
      {/* Background */}
      <div className="fixed inset-0" style={{
        background: phase === 'ignorance'
          ? 'radial-gradient(ellipse at 50% 50%, hsl(0 10% 8%), hsl(0 0% 3%) 70%)'
          : 'radial-gradient(ellipse at 50% 20%, hsl(45 60% 15%), hsl(30 20% 5%) 70%)',
        transition: 'background 2s ease',
      }} />

      {/* Light rays — only during positive phases */}
      {phase !== 'ignorance' && (
        <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 left-1/2 h-full"
              style={{
                width: '2px',
                background: 'linear-gradient(to bottom, rgba(255,215,0,0.6), transparent 50%)',
                transform: `rotate(${i * 30}deg)`,
                transformOrigin: 'top center',
                animation: `rayPulse 3s ease-in-out ${i * 0.2}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Fireworks */}
      {showFireworks && phase !== 'ignorance' && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <Firework key={i} delay={i * 600} x={5 + Math.random() * 90} y={5 + Math.random() * 40} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-4 py-8 space-y-6" onClick={e => e.stopPropagation()}>

        {/* ═══ APPROACH — Narrative buildup ═══ */}
        {phase === 'approach' && (
          <div className="text-center space-y-6 min-h-[60vh] flex flex-col items-center justify-center">
            {/* Golden gates icon */}
            <div className="text-7xl" style={{
              filter: 'drop-shadow(0 0 50px rgba(255,215,0,0.6))',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              🏛️
            </div>

            {/* Narrative lines — revealed progressively */}
            <div className="space-y-2 min-h-[180px]">
              {ARRIVAL_NARRATIVE.map((line, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed font-display transition-all duration-700"
                  style={{
                    color: i <= narrativeIdx ? 'hsl(45 60% 80%)' : 'transparent',
                    opacity: i <= narrativeIdx ? 1 : 0,
                    transform: i <= narrativeIdx ? 'translateY(0)' : 'translateY(8px)',
                    textShadow: i === narrativeIdx ? '0 0 20px rgba(255,215,0,0.3)' : undefined,
                    fontStyle: line.startsWith('«') ? 'italic' : undefined,
                    fontWeight: line.startsWith('«') ? 700 : undefined,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <button onClick={skipToEnd} className="text-[10px] text-white/25 uppercase tracking-widest hover:text-white/50 transition-colors">
              Toque para pular ▸
            </button>
          </div>
        )}

        {/* ═══ GATES OPENING ═══ */}
        {phase === 'gates' && winner && (
          <div className="text-center space-y-4 min-h-[60vh] flex flex-col items-center justify-center">
            <div className="text-8xl" style={{
              animation: 'gatesOpen 2s ease-out forwards',
              filter: 'drop-shadow(0 0 60px rgba(255,215,0,0.7))',
            }}>
              ✨
            </div>
            <h2 className="text-2xl font-display font-bold uppercase tracking-[0.2em]"
              style={{
                color: 'hsl(45 90% 75%)',
                textShadow: '0 0 40px rgba(255,215,0,0.5)',
                animation: 'fadeSlideUp 1s ease-out 0.5s both',
              }}
            >
              Os portões se abrem!
            </h2>
            <p className="text-lg font-display italic"
              style={{
                color: 'hsl(45 60% 65%)',
                animation: 'fadeSlideUp 1s ease-out 1s both',
              }}
            >
              «Entrai no gozo do vosso Senhor!»
            </p>
            <div className="flex items-center gap-3" style={{ animation: 'fadeSlideUp 1s ease-out 1.5s both' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{
                  backgroundColor: winner.color + '30',
                  border: `3px solid ${winner.color}`,
                  color: winner.color,
                  boxShadow: `0 0 40px ${winner.color}60`,
                }}
              >
                {winner.name.charAt(0)}
              </div>
              <span className="text-xl font-display font-bold" style={{ color: 'hsl(45 80% 75%)' }}>
                {winner.name}
              </span>
            </div>
          </div>
        )}

        {/* ═══ CROWN CEREMONY ═══ */}
        {phase === 'crown' && winner && (
          <div className="text-center space-y-5 min-h-[60vh] flex flex-col items-center justify-center">
            <Crown className="w-20 h-20 mx-auto" style={{
              color: '#FFD700',
              filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.7))',
              animation: 'crownDescend 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }} />

            <div className="w-28 h-28 rounded-2xl mx-auto flex items-center justify-center text-5xl font-bold"
              style={{
                backgroundColor: winner.color + '30',
                border: `4px solid ${winner.color}`,
                color: winner.color,
                boxShadow: `0 0 60px ${winner.color}80, 0 0 120px rgba(255,215,0,0.3)`,
              }}
            >
              {winner.name.charAt(0)}
            </div>

            <h2 className="text-3xl font-display font-bold"
              style={{ color: 'hsl(45 90% 80%)', textShadow: '0 0 40px rgba(255,215,0,0.5)' }}
            >
              {winner.name}
            </h2>

            <p className="text-base font-display italic" style={{ color: 'hsl(45 60% 65%)' }}>
              Uma coroa de ouro foi colocada sobre sua cabeça.
            </p>
            <p className="text-sm font-display" style={{ color: 'hsl(45 50% 55%)' }}>
              «Sê fiel até à morte, e dar-te-ei a coroa da vida.»
            </p>
            <p className="text-xs" style={{ color: 'hsl(45 30% 45%)' }}>
              — Apocalipse 2:10
            </p>

            <div className="flex justify-center gap-5 text-base" style={{ color: 'hsl(45 50% 65%)' }}>
              <span>🔥 Fé {winner.attributes.fe}</span>
              <span>⛰️ Perseverança {winner.attributes.perseveranca}</span>
            </div>
            <div className="flex justify-center gap-5 text-base" style={{ color: 'hsl(45 50% 65%)' }}>
              <span>👁️ Discernimento {winner.attributes.discernimento}</span>
              <span>🛡️ Coragem {winner.attributes.coragem}</span>
            </div>
          </div>
        )}

        {/* ═══ IGNORANCE CONTRAST ═══ */}
        {phase === 'ignorance' && (
          <div className="text-center space-y-5 min-h-[50vh] flex flex-col items-center justify-center">
            <div className="text-5xl" style={{
              filter: 'drop-shadow(0 0 20px rgba(100,0,0,0.4))',
              animation: 'shake 0.3s infinite alternate',
            }}>
              🚪
            </div>

            <h3 className="text-lg font-display font-bold uppercase tracking-wider"
              style={{ color: 'hsl(0 40% 55%)', textShadow: '0 0 15px rgba(200,50,50,0.3)' }}
            >
              Mas nem todos entram...
            </h3>

            <div className="space-y-2 min-h-[140px]">
              {IGNORANCE_NARRATIVE.map((line, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed font-display transition-all duration-700"
                  style={{
                    color: i <= narrativeIdx ? 'hsl(0 20% 65%)' : 'transparent',
                    opacity: i <= narrativeIdx ? 1 : 0,
                    transform: i <= narrativeIdx ? 'translateY(0)' : 'translateY(8px)',
                    fontStyle: line.startsWith('«') ? 'italic' : undefined,
                    fontWeight: line.startsWith('«') ? 700 : undefined,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <p className="text-xs italic" style={{ color: 'hsl(0 20% 45%)' }}>
              — Provérbios 14:12
            </p>

            <button onClick={() => setPhase('rankings')} className="text-[10px] text-white/25 uppercase tracking-widest hover:text-white/50 transition-colors mt-4">
              Continuar ▸
            </button>
          </div>
        )}

        {/* ═══ RANKINGS ═══ */}
        {(phase === 'rankings' || phase === 'stats') && winner && (
          <>
            {/* Winner summary */}
            <div className="text-center space-y-2">
              <Crown className="w-10 h-10 mx-auto" style={{
                color: '#FFD700',
                filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.5))',
              }} />
              <h2 className="text-2xl font-display font-bold"
                style={{ color: 'hsl(45 90% 75%)', textShadow: '0 0 20px rgba(255,215,0,0.4)' }}
              >
                {winner.name}
              </h2>
              <p className="text-xs font-display" style={{ color: 'hsl(45 50% 55%)' }}>
                🏆 Alcançou a Cidade Celestial · Total: {totalAttr(winner)} atributos
              </p>
            </div>

            {/* Rankings */}
            <div className="space-y-2 animate-fade-in">
              <h3 className="text-center text-sm font-display uppercase tracking-widest"
                style={{ color: 'hsl(45 40% 50%)' }}
              >
                Classificação Final
              </h3>
              {sorted.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
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

            {/* STATS */}
            {phase === 'stats' && winner.stats && (
              <div className="space-y-3 animate-fade-in pt-2">
                <h3 className="text-center text-sm font-display uppercase tracking-widest"
                  style={{ color: 'hsl(45 40% 50%)' }}
                >
                  📊 A Jornada em Números
                </h3>

                <div className="rounded-xl p-4 space-y-2" style={{
                  background: 'hsl(40 20% 10% / 0.8)',
                  border: '1px solid hsl(45 40% 30% / 0.5)',
                }}>
                  <p className="text-xs font-display font-bold" style={{ color: 'hsl(45 60% 65%)' }}>
                    {winner.name} — Resumo da Peregrinação
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {getStatHighlights(winner).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]"
                        style={{ animation: `slideInRank 0.3s ease-out ${i * 0.1}s both` }}
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

                {sorted.length > 1 && (
                  <div className="rounded-xl p-4 space-y-2" style={{
                    background: 'hsl(30 10% 10% / 0.6)',
                    border: '1px solid hsl(0 0% 20% / 0.5)',
                  }}>
                    <p className="text-xs font-display font-bold" style={{ color: 'hsl(0 0% 60%)' }}>
                      Comparativo dos Peregrinos
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

                {/* Biblical closing */}
                <div className="text-center py-3 space-y-1">
                  <p className="text-sm font-display italic" style={{ color: 'hsl(45 50% 60%)' }}>
                    «Combati o bom combate, acabei a carreira, guardei a fé.»
                  </p>
                  <p className="text-xs" style={{ color: 'hsl(45 30% 45%)' }}>— 2 Timóteo 4:7</p>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onPlayAgain(); }}
                    className="w-full py-4 rounded-xl font-display text-sm font-bold transition-all active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, hsl(45 60% 45%), hsl(35 50% 35%))',
                      color: 'hsl(45 90% 95%)',
                      boxShadow: '0 0 30px hsl(45 60% 45% / 0.3)',
                      border: '1px solid hsl(45 60% 55% / 0.4)',
                    }}
                  >
                    🎲 Nova Peregrinação
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onExit(); }}
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
        @keyframes rayPulse {
          0% { opacity: 0.1; }
          100% { opacity: 0.4; }
        }
        @keyframes slideInRank {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes gatesOpen {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes crownDescend {
          0% { transform: translateY(-60px) scale(0.5); opacity: 0; }
          60% { transform: translateY(5px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0% { transform: translateX(-2px); }
          100% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}
