import { useState } from 'react';
import { Difficulty } from '@/data/rpg/types';
import { getContentStats } from '@/data/rpg/rotationEngine';
import { BookOpen, Users, Shield, Swords, Crown, ChevronRight, AlertTriangle } from 'lucide-react';

export type GameMode = 'cooperative' | 'individual';

interface RPGBriefingProps {
  onStart: (config: {
    difficulty: Difficulty;
    gameMode: GameMode;
    playerNames: string[];
    hostPlayerIndex: number; // who holds the phone
  }) => void;
  onBack: () => void;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; desc: string; icon: string; color: string; age: string }> = {
  aprendiz: {
    label: 'Aprendiz',
    desc: 'Perguntas mais diretas, punições leves. Ideal para iniciantes.',
    icon: '📖', color: 'hsl(140 50% 40%)', age: '13+'
  },
  peregrino: {
    label: 'Peregrino',
    desc: 'Profundidade teológica, consequências moderadas. Para quem conhece a Bíblia.',
    icon: '⚔️', color: 'hsl(210 60% 50%)', age: '18+'
  },
  veterano: {
    label: 'Veterano',
    desc: 'Teologia profunda, charadas complexas, punições severas. Para estudiosos.',
    icon: '👑', color: 'hsl(45 80% 50%)', age: '25+'
  },
};

const DEFAULT_NAMES = ['Cristão', 'Fiel', 'Esperança', 'Misericórdia', 'Valente', 'Honesto', 'Prudência', 'Caridade'];

export default function RPGBriefing({ onStart, onBack }: RPGBriefingProps) {
  const [step, setStep] = useState<'briefing' | 'config'>('briefing');
  const [difficulty, setDifficulty] = useState<Difficulty>('peregrino');
  const [gameMode, setGameMode] = useState<GameMode>('cooperative');
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_NAMES.slice(0, 8));
  const [hostIndex, setHostIndex] = useState(0);

  const stats = getContentStats();

  if (step === 'briefing') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="font-display text-lg text-foreground">⚔️ RPG Peregrino</h1>
          </div>
        </header>

        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6 overflow-y-auto pb-32">
          {/* Epic intro */}
          <div className="text-center space-y-3">
            <div className="text-5xl mb-2">📜</div>
            <h2 className="font-display text-2xl text-foreground font-bold">O Mestre Convoca</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O aplicativo será o <strong className="text-foreground">Mestre do Jogo</strong>.
              Ele narrará, sorteará, desafiará e julgará cada decisão do grupo.
              Preparem-se para uma jornada épica pelo caminho do Peregrino!
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="font-display text-sm font-bold text-amber-400">ANTES DE COMEÇAR</h3>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-amber-400">📖</span>
                <span>Tenha uma <strong className="text-foreground">Bíblia em mãos</strong> (física ou app). Vocês precisarão pesquisar versículos!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">📜</span>
                <span>É <strong className="text-foreground">altamente recomendado</strong> ter jogado a narrativa da <strong className="text-foreground">Parte 1 — O Peregrino</strong> para entender as referências do jogo.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">👥</span>
                <span>Reúnam <strong className="text-foreground">2 a 6 jogadores</strong> ao redor de um único celular. Quem segurar o celular também joga!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">🎲</span>
                <span>Podem usar o <strong className="text-foreground">dado 3D do app</strong> ou um <strong className="text-foreground">dado físico</strong> real — a escolha é de vocês!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">⏱️</span>
                <span>Duração estimada: <strong className="text-foreground">45 min a 2 horas</strong> dependendo da dificuldade e do grupo.</span>
              </li>
            </ul>
          </div>

          {/* What awaits */}
          <div className="bg-card/50 border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">🗡️ O QUE VOS ESPERA</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <span className="text-lg">📖</span>
                <div>
                  <p className="font-bold text-foreground">{stats.questions}</p>
                  <p className="text-muted-foreground">Perguntas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <span className="text-lg">🧩</span>
                <div>
                  <p className="font-bold text-foreground">{stats.riddles}</p>
                  <p className="text-muted-foreground">Charadas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <span className="text-lg">⚖️</span>
                <div>
                  <p className="font-bold text-foreground">{stats.dilemmas}</p>
                  <p className="text-muted-foreground">Dilemas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <span className="text-lg">⚔️</span>
                <div>
                  <p className="font-bold text-foreground">{stats.challenges}</p>
                  <p className="text-muted-foreground">Desafios</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <span className="text-lg">👹</span>
                <div>
                  <p className="font-bold text-foreground">{stats.bosses}</p>
                  <p className="text-muted-foreground">Confrontos</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                <span className="text-lg">🎲</span>
                <div>
                  <p className="font-bold text-foreground">{stats.total}+</p>
                  <p className="text-muted-foreground">Total Únicos</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              ✨ Sistema anti-repetição: cada partida é única!
            </p>
          </div>

          {/* How it works */}
          <div className="bg-card/50 border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">🎮 COMO FUNCIONA</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <span className="text-primary font-bold shrink-0">1.</span>
                <span>O <strong className="text-foreground">Mestre (app)</strong> narra a situação e sorteia quem participa</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold shrink-0">2.</span>
                <span>O Mestre define o <strong className="text-foreground">modo de resposta</strong>: individual, grupo, votação secreta...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold shrink-0">3.</span>
                <span>Após a <strong className="text-foreground">contextualização</strong>, cliquem no cronômetro para liberar o tempo</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold shrink-0">4.</span>
                <span>Respondam usando <strong className="text-foreground">Bíblia, memória, estratégia e debate!</strong></span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold shrink-0">5.</span>
                <span>Cada resposta tem <strong className="text-foreground">consequências</strong> — bênçãos ou punições para o grupo!</span>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-5 px-5">
          <button
            onClick={() => setStep('config')}
            className="w-full max-w-lg mx-auto flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-all"
            style={{ boxShadow: '0 0 30px hsl(40 60% 55% / 0.3)' }}
          >
            <Swords className="w-5 h-5" />
            Preparar a Jornada
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── CONFIG STEP ───
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => setStep('briefing')} className="text-muted-foreground hover:text-foreground">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="font-display text-lg text-foreground">⚙️ Configurar Partida</h1>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6 overflow-y-auto pb-32">
        {/* Difficulty */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Nível de Dificuldade
          </h3>
          <div className="grid gap-2">
            {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.aprendiz][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  difficulty === key
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-card/50 border-border hover:border-primary/20'
                }`}
              >
                <span className="text-2xl">{cfg.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-foreground">{cfg.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{cfg.age}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{cfg.desc}</p>
                </div>
                {difficulty === key && <div className="w-3 h-3 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Game Mode */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            Modo de Jogo
          </h3>
          <div className="grid gap-2">
            <button
              onClick={() => setGameMode('cooperative')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                gameMode === 'cooperative' ? 'bg-primary/10 border-primary/40' : 'bg-card/50 border-border hover:border-primary/20'
              }`}
            >
              <span className="text-2xl">🤝</span>
              <div className="flex-1">
                <span className="font-display font-bold text-sm text-foreground">Peregrinação Coletiva</span>
                <p className="text-[11px] text-muted-foreground">O grupo avança junto. Bênçãos e punições afetam todos. Unidos até a Cidade Celestial!</p>
              </div>
              {gameMode === 'cooperative' && <div className="w-3 h-3 rounded-full bg-primary" />}
            </button>
            <button
              onClick={() => setGameMode('individual')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                gameMode === 'individual' ? 'bg-primary/10 border-primary/40' : 'bg-card/50 border-border hover:border-primary/20'
              }`}
            >
              <span className="text-2xl">🏃</span>
              <div className="flex-1">
                <span className="font-display font-bold text-sm text-foreground">Livre Arbítrio</span>
                <p className="text-[11px] text-muted-foreground">Cada peregrino tem seu próprio caminho. Suas decisões afetam só a você — ou ao grupo!</p>
              </div>
              {gameMode === 'individual' && <div className="w-3 h-3 rounded-full bg-primary" />}
            </button>
          </div>
        </div>

        {/* Players */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Peregrinos ({playerCount}/6)
          </h3>

          {/* Player count */}
          <div className="flex items-center gap-3 px-3">
            <button
              onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
              disabled={playerCount <= 2}
              className="w-8 h-8 rounded-full bg-card border border-border text-foreground font-bold flex items-center justify-center disabled:opacity-30"
            >−</button>
            <div className="flex gap-1.5">
              {Array.from({ length: playerCount }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-primary/70" />
              ))}
              {Array.from({ length: 6 - playerCount }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-muted/30" />
              ))}
            </div>
            <button
              onClick={() => setPlayerCount(Math.min(6, playerCount + 1))}
              disabled={playerCount >= 6}
              className="w-8 h-8 rounded-full bg-card border border-border text-foreground font-bold flex items-center justify-center disabled:opacity-30"
            >+</button>
          </div>

          {/* Player names */}
          <div className="space-y-2">
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    backgroundColor: `hsl(${(i * 60) % 360} 60% 45% / 0.2)`,
                    color: `hsl(${(i * 60) % 360} 60% 60%)`,
                    border: `2px solid hsl(${(i * 60) % 360} 60% 45% / 0.4)`,
                  }}
                >
                  {(playerNames[i] || DEFAULT_NAMES[i]).charAt(0).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={playerNames[i] || DEFAULT_NAMES[i]}
                  onChange={e => {
                    const names = [...playerNames];
                    names[i] = e.target.value;
                    setPlayerNames(names);
                  }}
                  className="flex-1 bg-transparent border-none text-sm text-foreground font-medium outline-none focus:text-primary"
                  placeholder={`Jogador ${i + 1}`}
                  maxLength={20}
                />
                {i === hostIndex ? (
                  <span className="text-[10px] text-amber-400 font-display font-bold px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
                    📱 MESTRE
                  </span>
                ) : (
                  <button
                    onClick={() => setHostIndex(i)}
                    className="text-[10px] text-muted-foreground hover:text-primary px-2 py-1 rounded-full border border-border hover:border-primary/30 shrink-0"
                  >
                    definir mestre
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            📱 O Mestre é quem segura o celular. Ele também joga!
          </p>
        </div>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-5 px-5">
        <button
          onClick={() => {
            const names = Array.from({ length: playerCount }).map((_, i) =>
              (playerNames[i] || DEFAULT_NAMES[i]).trim() || `Jogador ${i + 1}`
            );
            onStart({
              difficulty,
              gameMode,
              playerNames: names,
              hostPlayerIndex: hostIndex,
            });
          }}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-all"
          style={{ boxShadow: '0 0 30px hsl(40 60% 55% / 0.3)' }}
        >
          <Crown className="w-5 h-5" />
          Iniciar RPG ({playerCount} peregrinos · {DIFFICULTY_CONFIG[difficulty].label})
        </button>
      </div>
    </div>
  );
}
