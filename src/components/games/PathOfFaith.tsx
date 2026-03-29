import { useState, useEffect, useCallback } from 'react';
import { ChoiceEffect } from '@/data/story';
import { MiniGameResult } from '@/components/MiniGames';

/**
 * Path of Faith — Navigate branching paths with RPG risk/reward
 * Each junction presents 2-3 paths with different risks
 */

interface PathOfFaithProps {
  config: {
    intro: string;
    difficulty?: 'easy' | 'normal' | 'hard';
    successBonus: ChoiceEffect;
    failurePenalty: ChoiceEffect;
  };
  onComplete: (result: MiniGameResult) => void;
}

interface PathNode {
  id: number;
  emoji: string;
  label: string;
  description: string;
  risk: 'safe' | 'moderate' | 'dangerous';
  hpChange: number;
  faithChange: number;
  isTrap?: boolean;
  isBlessing?: boolean;
}

const PATH_POOLS: PathNode[][] = [
  [
    { id: 1, emoji: '🛤️', label: 'Caminho Iluminado', description: 'Um caminho com tochas acesas', risk: 'safe', hpChange: 0, faithChange: 1 },
    { id: 2, emoji: '🌑', label: 'Atalho Sombrio', description: 'Mais curto, mas perigoso', risk: 'dangerous', hpChange: -2, faithChange: 2, isTrap: true },
    { id: 3, emoji: '⛪', label: 'Desvio pela Capela', description: 'Uma pequena capela abandonada', risk: 'moderate', hpChange: 1, faithChange: 1, isBlessing: true },
  ],
  [
    { id: 4, emoji: '🌊', label: 'Travessia do Rio', description: 'Águas profundas e turbulentas', risk: 'dangerous', hpChange: -3, faithChange: 3 },
    { id: 5, emoji: '🌉', label: 'Ponte Antiga', description: 'Parece frágil mas segura', risk: 'moderate', hpChange: -1, faithChange: 1 },
    { id: 6, emoji: '🏔️', label: 'Contorno pela Montanha', description: 'Longo mas seguro', risk: 'safe', hpChange: 0, faithChange: 0 },
  ],
  [
    { id: 7, emoji: '🐺', label: 'Bosque dos Lobos', description: 'Uivos ecoam entre as árvores', risk: 'dangerous', hpChange: -2, faithChange: 2, isTrap: true },
    { id: 8, emoji: '🕯️', label: 'Caverna Sagrada', description: 'Uma luz brilha lá dentro', risk: 'moderate', hpChange: 2, faithChange: 2, isBlessing: true },
    { id: 9, emoji: '🌾', label: 'Campo Aberto', description: 'Exposto mas tranquilo', risk: 'safe', hpChange: 0, faithChange: 1 },
  ],
  [
    { id: 10, emoji: '🗡️', label: 'Acampamento Inimigo', description: 'Risco de emboscada', risk: 'dangerous', hpChange: -3, faithChange: 3 },
    { id: 11, emoji: '🙏', label: 'Jardim de Oração', description: 'Paz e restauração', risk: 'safe', hpChange: 3, faithChange: 1, isBlessing: true },
  ],
  [
    { id: 12, emoji: '🔥', label: 'Vale de Fogo', description: 'Chamas cercam o caminho', risk: 'dangerous', hpChange: -2, faithChange: 3 },
    { id: 13, emoji: '✨', label: 'Portal de Luz', description: 'Uma visão celestial', risk: 'moderate', hpChange: 1, faithChange: 2, isBlessing: true },
    { id: 14, emoji: '🏕️', label: 'Descanso do Viajante', description: 'Uma pausa reconfortante', risk: 'safe', hpChange: 2, faithChange: 0 },
  ],
  [
    { id: 15, emoji: '👹', label: 'Gruta do Desespero', description: 'O Gigante Desespero espreita', risk: 'dangerous', hpChange: -4, faithChange: 4, isTrap: true },
    { id: 16, emoji: '🗝️', label: 'Chave da Promessa', description: 'Um tesouro divino escondido', risk: 'moderate', hpChange: 0, faithChange: 3, isBlessing: true },
  ],
];

const RISK_COLORS = {
  safe: { bg: 'hsl(120 30% 15%)', border: 'hsl(120 40% 30%)', text: 'hsl(120 40% 60%)' },
  moderate: { bg: 'hsl(40 30% 15%)', border: 'hsl(40 50% 35%)', text: 'hsl(40 60% 65%)' },
  dangerous: { bg: 'hsl(0 30% 15%)', border: 'hsl(0 40% 30%)', text: 'hsl(0 40% 60%)' },
};

export function PathOfFaith({ config, onComplete }: PathOfFaithProps) {
  const diff = config.difficulty || 'normal';
  const totalSteps = diff === 'easy' ? 3 : diff === 'hard' ? 6 : 4;
  const startHP = diff === 'easy' ? 12 : diff === 'hard' ? 8 : 10;

  const [phase, setPhase] = useState<'intro' | 'choose' | 'outcome' | 'result'>('intro');
  const [step, setStep] = useState(0);
  const [hp, setHp] = useState(startHP);
  const [maxHp] = useState(startHP);
  const [faith, setFaith] = useState(0);
  const [choices, setChoices] = useState<PathNode[]>([]);
  const [chosenNode, setChosenNode] = useState<PathNode | null>(null);
  const [outcomeText, setOutcomeText] = useState('');
  const [pathHistory, setPathHistory] = useState<PathNode[]>([]);

  const generateChoices = useCallback(() => {
    const pool = PATH_POOLS[step % PATH_POOLS.length];
    // Random chance to modify outcomes slightly
    return pool.map(p => ({
      ...p,
      hpChange: p.hpChange + (Math.random() > 0.7 ? (p.risk === 'dangerous' ? 1 : 0) : 0),
    }));
  }, [step]);

  useEffect(() => {
    if (phase === 'choose') {
      setChoices(generateChoices());
    }
  }, [phase, generateChoices]);

  const choosePath = (node: PathNode) => {
    setChosenNode(node);
    setPathHistory(prev => [...prev, node]);

    // Apply effects
    const newHp = Math.max(0, Math.min(maxHp, hp + node.hpChange));
    setHp(newHp);
    setFaith(f => f + node.faithChange);

    // Generate outcome text
    let text = '';
    if (node.isBlessing) {
      text = `✨ Bênção! ${node.description}. `;
      if (node.hpChange > 0) text += `Recuperou ${node.hpChange} de vida. `;
      text += `Fé +${node.faithChange}`;
    } else if (node.isTrap) {
      text = `⚠️ Armadilha! ${node.description}. `;
      text += `Perdeu ${Math.abs(node.hpChange)} de vida.`;
      if (node.faithChange > 0) text += ` Mas sua fé cresceu +${node.faithChange}`;
    } else {
      text = node.description + '. ';
      if (node.hpChange > 0) text += `Recuperou ${node.hpChange} de vida. `;
      if (node.hpChange < 0) text += `Perdeu ${Math.abs(node.hpChange)} de vida. `;
      if (node.faithChange > 0) text += `Fé +${node.faithChange}`;
    }
    setOutcomeText(text);
    setPhase('outcome');

    // Check death or advance
    setTimeout(() => {
      if (newHp <= 0) {
        setPhase('result');
      } else if (step + 1 >= totalSteps) {
        setStep(s => s + 1);
        setPhase('result');
      } else {
        setStep(s => s + 1);
        setPhase('choose');
      }
    }, 2500);
  };

  const success = hp > 0 && step >= totalSteps;
  const finalScore = Math.round(((hp / maxHp) * 50) + (Math.min(faith, totalSteps * 3) / (totalSteps * 3)) * 50);

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        onComplete({
          success,
          score: finalScore,
          effects: success ? config.successBonus : config.failurePenalty,
        });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-5xl">🗺️</div>
        <h3 className="font-display text-xl text-primary">Caminho da Fé</h3>
        <p className="text-sm text-foreground/80">{config.intro}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>A cada encruzilhada, escolha seu caminho com sabedoria.</p>
          <p>Cada decisão afeta sua <strong>vida</strong> e sua <strong>fé</strong>.</p>
          <p className="flex items-center justify-center gap-3 pt-1">
            <span style={{ color: RISK_COLORS.safe.text }}>🟢 Seguro</span>
            <span style={{ color: RISK_COLORS.moderate.text }}>🟡 Moderado</span>
            <span style={{ color: RISK_COLORS.dangerous.text }}>🔴 Perigoso</span>
          </p>
        </div>
        <button onClick={() => setPhase('choose')} className="btn-medieval w-full">
          Iniciar Jornada
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-4 animate-scale-in">
        <div className="text-5xl">{success ? '🏆' : '💀'}</div>
        <h3 className="font-display text-xl text-primary">
          {success ? 'Jornada Completa!' : hp <= 0 ? 'Caiu no caminho...' : 'Fim da trilha'}
        </h3>
        
        {/* Journey summary */}
        <div className="flex justify-center gap-1 flex-wrap">
          {pathHistory.map((node, i) => (
            <span key={i} className="text-xl" title={node.label}>{node.emoji}</span>
          ))}
        </div>

        <div className="flex justify-center gap-4 text-sm">
          <span className="text-foreground/80">❤️ {hp}/{maxHp}</span>
          <span className="text-primary">✨ Fé: {faith}</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${success ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${finalScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 border-2 border-primary/20 rounded-2xl p-4 space-y-3">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* HP bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm">❤️</span>
            <div className="w-20 h-3 bg-secondary/50 rounded-full overflow-hidden border border-border">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(hp / maxHp) * 100}%`,
                  background: hp > maxHp * 0.5 ? 'hsl(120 50% 40%)' : hp > maxHp * 0.25 ? 'hsl(40 60% 50%)' : 'hsl(0 60% 50%)',
                }}
              />
            </div>
            <span className="text-xs font-display text-foreground/60">{hp}/{maxHp}</span>
          </div>
        </div>
        <span className="text-xs font-display text-primary bg-card/80 px-2 py-1 rounded-lg">
          ✨ Fé: {faith}
        </span>
        <span className="text-xs font-display text-muted-foreground bg-card/80 px-2 py-1 rounded-lg">
          Passo {step + 1}/{totalSteps}
        </span>
      </div>

      {/* Path trail */}
      {pathHistory.length > 0 && (
        <div className="flex items-center gap-1 justify-center">
          {pathHistory.map((node, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-lg">{node.emoji}</span>
              {i < pathHistory.length - 1 && <span className="text-xs text-muted-foreground">→</span>}
            </div>
          ))}
          {step < totalSteps && <span className="text-xs text-muted-foreground">→ ?</span>}
        </div>
      )}

      {/* Outcome phase */}
      {phase === 'outcome' && chosenNode && (
        <div className="text-center space-y-3 py-3 animate-scale-in">
          <div className="text-5xl">{chosenNode.emoji}</div>
          <h4 className="font-display text-lg text-foreground">{chosenNode.label}</h4>
          <p className="text-sm text-foreground/80">{outcomeText}</p>
          {chosenNode.hpChange !== 0 && (
            <span className={`inline-block text-sm font-display px-3 py-1 rounded-full ${
              chosenNode.hpChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {chosenNode.hpChange > 0 ? '+' : ''}{chosenNode.hpChange} ❤️
            </span>
          )}
        </div>
      )}

      {/* Choice phase */}
      {phase === 'choose' && (
        <div className="space-y-2">
          <p className="text-center text-sm font-display text-primary/80">
            ⚔️ Encruzilhada {step + 1} — Escolha seu caminho:
          </p>
          {choices.map(node => {
            const colors = RISK_COLORS[node.risk];
            return (
              <button
                key={node.id}
                onClick={() => choosePath(node)}
                className="w-full text-left p-3 rounded-xl transition-all active:scale-[0.97]"
                style={{
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{node.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm" style={{ color: colors.text }}>
                      {node.label}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5">{node.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 text-[10px] font-display flex-shrink-0">
                    <span className={node.risk === 'dangerous' ? 'text-red-400' : node.risk === 'moderate' ? 'text-yellow-400' : 'text-green-400'}>
                      {node.risk === 'dangerous' ? '⚠️ Perigoso' : node.risk === 'moderate' ? '⚡ Moderado' : '✅ Seguro'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
