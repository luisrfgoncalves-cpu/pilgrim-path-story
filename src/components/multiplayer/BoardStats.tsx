/**
 * BoardStats — Full stats screen with ranking, medals, and sharing
 * Accessed via a text button on the board
 */
import { useMemo } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { TILES_PER_PHASE, IMMERSIVE_BOARD_SIZE } from './ImmersiveBoardTypes';

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
  currentStreak: number;
  backToStartCount: number;
  shieldsGained: number;
  swapsTriggered: number;
  phasesCompleted: number;
  riverCrossed: boolean;
}

interface StatsPlayer {
  id: string;
  name: string;
  color: string;
  position: number;
  finished: boolean;
  finishOrder: number | null;
  attributes: { fe: number; perseveranca: number; discernimento: number; coragem: number };
  stats: PlayerStats;
  hasShield: boolean;
}

interface BoardStatsProps {
  players: StatsPlayer[];
  onClose: () => void;
}

// ─── Medal/Title system ───
interface Medal {
  title: string;
  icon: string;
  description: string;
}

function getPlayerMedals(p: StatsPlayer): Medal[] {
  const medals: Medal[] = [];

  if (p.stats.giantsDefeated >= 3) medals.push({ title: 'Matador de Gigantes', icon: '⚔️', description: `Derrotou ${p.stats.giantsDefeated} gigantes` });
  else if (p.stats.giantsDefeated >= 1) medals.push({ title: 'Enfrentou Gigantes', icon: '💪', description: `Derrotou ${p.stats.giantsDefeated} gigante(s)` });

  if (p.stats.scripturesCorrect >= 5) medals.push({ title: 'Sábio das Escrituras', icon: '📖', description: `Acertou ${p.stats.scripturesCorrect} perguntas bíblicas` });
  else if (p.stats.scripturesCorrect >= 2) medals.push({ title: 'Estudante da Palavra', icon: '📜', description: `Acertou ${p.stats.scripturesCorrect} perguntas` });

  if (p.stats.maxStreak >= 5) medals.push({ title: 'Imbatível', icon: '🔥', description: `Sequência de ${p.stats.maxStreak} vitórias seguidas` });
  else if (p.stats.maxStreak >= 3) medals.push({ title: 'Em Chamas', icon: '✨', description: `Sequência de ${p.stats.maxStreak} vitórias` });

  if (p.stats.blessingsReceived >= 3) medals.push({ title: 'Abençoado', icon: '⭐', description: `Recebeu ${p.stats.blessingsReceived} bênçãos` });

  if (p.stats.shieldsGained >= 3) medals.push({ title: 'Escudeiro de Deus', icon: '🛡️', description: `Ganhou ${p.stats.shieldsGained} escudos` });

  if (p.stats.backToStartCount >= 2) medals.push({ title: 'O Resiliente', icon: '💎', description: `Voltou ao início ${p.stats.backToStartCount}x e seguiu em frente` });

  if (p.stats.challengesWon >= 4) medals.push({ title: 'Guerreiro Fiel', icon: '🗡️', description: `Venceu ${p.stats.challengesWon} desafios` });

  if (p.stats.riverCrossed) medals.push({ title: 'Atravessou o Rio', icon: '🌊', description: 'Cruzou o Rio da Morte' });

  if (p.finished && p.finishOrder === 1) medals.push({ title: 'Primeiro a Chegar', icon: '👑', description: 'Chegou à Cidade Celestial primeiro' });

  if (p.attributes.fe >= 10) medals.push({ title: 'Fé Inabalável', icon: '🕊️', description: `Fé alcançou ${p.attributes.fe}` });

  if (p.stats.trapsHit === 0 && p.position > 30) medals.push({ title: 'Pés Firmes', icon: '🦶', description: 'Nenhuma armadilha até agora' });

  return medals;
}

function calculateScore(p: StatsPlayer): number {
  const posScore = p.position * 2;
  const attrScore = (p.attributes.fe + p.attributes.perseveranca + p.attributes.discernimento + p.attributes.coragem) * 3;
  const challengeScore = p.stats.challengesWon * 10 + p.stats.giantsDefeated * 15 + p.stats.scripturesCorrect * 8;
  const streakScore = p.stats.maxStreak * 5;
  const blessingScore = p.stats.blessingsReceived * 5;
  const penaltyScore = p.stats.backToStartCount * -20 + p.stats.trapsHit * -3;
  return Math.max(0, posScore + attrScore + challengeScore + streakScore + blessingScore + penaltyScore);
}

export default function BoardStats({ players, onClose }: BoardStatsProps) {
  const rankedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      // Finished players first (by finish order)
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      if (a.finished && b.finished) return (a.finishOrder || 99) - (b.finishOrder || 99);
      // Then by score
      return calculateScore(b) - calculateScore(a);
    });
  }, [players]);

  const handleShare = () => {
    const lines = [
      '🎲 O PEREGRINO — Partida em andamento!',
      '',
      '📊 RANKING:',
      ...rankedPlayers.map((p, i) => {
        const score = calculateScore(p);
        const medals = getPlayerMedals(p);
        const medalText = medals.length > 0 ? ` ${medals.map(m => m.icon).join('')}` : '';
        const status = p.finished ? `🏆 ${p.finishOrder}º lugar` : `Casa ${p.position + 1}`;
        return `${i + 1}. ${p.name} — ${score} pts (${status})${medalText}`;
      }),
      '',
      '🏅 DESTAQUES:',
      ...rankedPlayers.flatMap(p => {
        const medals = getPlayerMedals(p);
        return medals.slice(0, 2).map(m => `${m.icon} ${p.name}: ${m.title}`);
      }).slice(0, 6),
      '',
      '⬇️ Jogue também: operegrino.lovable.app',
    ];

    const text = lines.join('\n');

    if (navigator.share) {
      navigator.share({ title: 'O Peregrino — Ranking', text }).catch(() => {});
    } else {
      // Fallback: WhatsApp direct
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-base text-foreground">Placar da Partida</h1>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-display hover:bg-primary/20 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Ranking */}
        <div className="bg-card/60 border border-border rounded-xl p-4">
          <h2 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
            Ranking
          </h2>
          <div className="space-y-2">
            {rankedPlayers.map((p, rank) => {
              const score = calculateScore(p);
              const progress = Math.round((p.position / (IMMERSIVE_BOARD_SIZE - 1)) * 100);
              return (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg"
                  style={{
                    background: rank === 0 ? 'hsl(40 60% 20% / 0.3)' : 'hsl(0 0% 50% / 0.05)',
                    border: rank === 0 ? '1px solid hsl(40 60% 55% / 0.3)' : '1px solid transparent',
                  }}
                >
                  <span className="font-display text-lg w-7 text-center" style={{
                    color: rank === 0 ? 'hsl(40 80% 60%)' : rank === 1 ? 'hsl(0 0% 75%)' : rank === 2 ? 'hsl(25 60% 50%)' : 'hsl(0 0% 50%)',
                  }}>
                    {rank === 0 ? '👑' : `${rank + 1}º`}
                  </span>
                  <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: p.color, border: `2px solid ${p.color}80` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${progress}%`,
                          background: `linear-gradient(to right, ${p.color}80, ${p.color})`,
                        }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground shrink-0">{progress}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-display font-bold" style={{ color: 'hsl(40 80% 65%)' }}>{score}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-wider">pontos</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Player Cards */}
        {rankedPlayers.map((p) => {
          const medals = getPlayerMedals(p);
          const score = calculateScore(p);

          return (
            <div key={p.id} className="bg-card/60 border border-border rounded-xl overflow-hidden">
              {/* Player header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50" style={{
                background: `linear-gradient(135deg, ${p.color}15, transparent)`,
              }}>
                <div className="w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: p.color, border: `2px solid ${p.color}80` }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-display font-bold text-foreground">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {p.finished ? `Chegou em ${p.finishOrder}º lugar` : `Casa ${p.position + 1} · Fase ${Math.floor(p.position / TILES_PER_PHASE) + 1}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display font-bold" style={{ color: 'hsl(40 80% 65%)' }}>{score}</p>
                  <p className="text-[8px] text-muted-foreground">PONTOS</p>
                </div>
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-4 gap-1 px-3 py-2 border-b border-border/30">
                {[
                  { key: 'fe', label: 'Fé', icon: '🕊️' },
                  { key: 'perseveranca', label: 'Persev.', icon: '💪' },
                  { key: 'discernimento', label: 'Discern.', icon: '👁️' },
                  { key: 'coragem', label: 'Coragem', icon: '🗡️' },
                ].map(attr => (
                  <div key={attr.key} className="text-center py-1">
                    <p className="text-[9px] text-muted-foreground">{attr.label}</p>
                    <p className="text-sm font-display font-bold text-foreground">
                      {(p.attributes as any)[attr.key]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-px bg-border/20 border-b border-border/30">
                {[
                  { label: 'Desafios', value: `${p.stats.challengesWon}/${p.stats.challengesWon + p.stats.challengesLost}` },
                  { label: 'Gigantes', value: `${p.stats.giantsDefeated}/${p.stats.giantsDefeated + p.stats.giantsLost}` },
                  { label: 'Escrituras', value: `${p.stats.scripturesCorrect}/${p.stats.scripturesCorrect + p.stats.scripturesWrong}` },
                  { label: 'Armadilhas', value: `${p.stats.trapsHit}` },
                  { label: 'Bênçãos', value: `${p.stats.blessingsReceived}` },
                  { label: 'Escudos', value: `${p.stats.shieldsGained}` },
                  { label: 'Melhor Sequência', value: `${p.stats.maxStreak}` },
                  { label: 'Trocas', value: `${p.stats.swapsTriggered}` },
                  { label: 'Voltas ao Início', value: `${p.stats.backToStartCount}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-card/40 px-2 py-2 text-center">
                    <p className="text-[8px] text-muted-foreground leading-tight">{stat.label}</p>
                    <p className="text-xs font-display font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Medals */}
              {medals.length > 0 && (
                <div className="px-3 py-2.5 space-y-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-display">Títulos conquistados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {medals.map((m, i) => (
                      <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-display"
                        style={{
                          background: 'hsl(40 30% 15% / 0.5)',
                          border: '1px solid hsl(40 50% 40% / 0.3)',
                          color: 'hsl(40 60% 75%)',
                        }}
                      >
                        <span>{m.icon}</span>
                        <span className="font-bold">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
