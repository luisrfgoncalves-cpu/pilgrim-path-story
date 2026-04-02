import { useState } from 'react';
import { Difficulty } from '@/data/rpg/types';
import { getContentStats } from '@/data/rpg/rotationEngine';
import { BookOpen, Users, Shield, Swords, Crown, ChevronRight, AlertTriangle, Heart, Sword, Star, Zap, ChevronDown } from 'lucide-react';

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
  const [step, setStep] = useState<'briefing' | 'tutorial' | 'config'>('briefing');
  const [difficulty, setDifficulty] = useState<Difficulty>('peregrino');
  const [gameMode, setGameMode] = useState<GameMode>('cooperative');
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_NAMES.slice(0, 8));
  const [hostIndex, setHostIndex] = useState(0);
  const [tutorialSection, setTutorialSection] = useState<string | null>(null);

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

          {/* Tutorial button */}
          <button
            onClick={() => setStep('tutorial')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-display text-sm hover:bg-primary/10 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            📚 Tutorial Completo — Entenda o Tabuleiro
            <ChevronRight className="w-4 h-4" />
          </button>
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

  // ─── TUTORIAL STEP ───
  if (step === 'tutorial') {
    const toggleSection = (id: string) => setTutorialSection(tutorialSection === id ? null : id);

    const TutorialAccordion = ({ id, emoji, title, children }: { id: string; emoji: string; title: string; children: React.ReactNode }) => (
      <div className="border border-border rounded-xl overflow-hidden">
        <button onClick={() => toggleSection(id)} className="w-full flex items-center gap-3 px-4 py-3 bg-card/50 hover:bg-card/80 transition-colors text-left">
          <span className="text-xl">{emoji}</span>
          <span className="flex-1 font-display text-sm font-bold text-foreground">{title}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${tutorialSection === id ? 'rotate-180' : ''}`} />
        </button>
        {tutorialSection === id && (
          <div className="px-4 py-3 space-y-3 text-xs text-muted-foreground border-t border-border bg-background/50">
            {children}
          </div>
        )}
      </div>
    );

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => setStep('briefing')} className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="font-display text-lg text-foreground">📚 Tutorial do Tabuleiro</h1>
          </div>
        </header>

        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-3 overflow-y-auto pb-32">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Toque em cada seção para expandir. Leia antes de jogar pela primeira vez!
          </p>

          <TutorialAccordion id="objetivo" emoji="🎯" title="Objetivo do Jogo">
            <p>Sejam os primeiros a chegar à <strong className="text-foreground">Cidade Celestial</strong> (casa 120) percorrendo o caminho do Peregrino.</p>
            <p>O tabuleiro tem <strong className="text-foreground">6 fases</strong> que seguem a jornada de Cristão:</p>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {['🏚️ Cidade da Destruição', '🏛️ Casa do Intérprete', '⚔️ Vale da Humilhação', '🎪 Feira da Vaidade', '🏰 Castelo da Dúvida', '✨ Cidade Celestial'].map((f, i) => (
                <div key={i} className="px-2 py-1.5 rounded-lg bg-card/80 border border-border text-[11px] text-foreground">{f}</div>
              ))}
            </div>
          </TutorialAccordion>

          <TutorialAccordion id="casas" emoji="🗺️" title="Tipos de Casas">
            <div className="space-y-2">
              {[
                { emoji: '📖', name: 'Escritura', desc: 'Pergunta bíblica contextualizada com O Peregrino. Acerte para avançar!' },
                { emoji: '🧩', name: 'Charada', desc: 'Enigma bíblico com dicas progressivas. Use a Bíblia e o grupo!' },
                { emoji: '⚡', name: 'Desafio', desc: 'Desafio ativo: mímica, recitar versículo, achar na Bíblia, debate...' },
                { emoji: '⚖️', name: 'Dilema Moral', desc: 'Situação com escolhas — cada uma tem consequências ocultas diferentes.' },
                { emoji: '👹', name: 'Confronto (Boss)', desc: 'Batalha épica contra Apolião, Gigante Desespero, etc. Múltiplas fases!' },
                { emoji: '🏕️', name: 'Refúgio', desc: 'Descanso e bênção. Recupere atributos e ouça um versículo de consolo.' },
                { emoji: '⚠️', name: 'Armadilha', desc: 'Punição! Mas pode haver chance de escapar respondendo uma pergunta.' },
                { emoji: '🌟', name: 'Evento Especial', desc: 'Surpresa aleatória — pode ser bênção ou provação inesperada.' },
              ].map((casa, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-lg shrink-0">{casa.emoji}</span>
                  <div>
                    <p className="font-bold text-foreground text-xs">{casa.name}</p>
                    <p className="text-[11px]">{casa.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </TutorialAccordion>

          <TutorialAccordion id="atributos" emoji="📊" title="Sistema de Atributos">
            <p>Cada jogador tem <strong className="text-foreground">4 atributos</strong> que sobem ou descem com cada decisão:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-card/80 border border-border">
                <Heart className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
                <div>
                  <p className="font-bold text-foreground text-xs">Fé</p>
                  <p className="text-[10px]">Confiança em Deus</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-card/80 border border-border">
                <Shield className="w-4 h-4" style={{ color: 'hsl(200 70% 55%)' }} />
                <div>
                  <p className="font-bold text-foreground text-xs">Perseverança</p>
                  <p className="text-[10px]">Resistência nas provas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-card/80 border border-border">
                <Star className="w-4 h-4" style={{ color: 'hsl(270 60% 60%)' }} />
                <div>
                  <p className="font-bold text-foreground text-xs">Discernimento</p>
                  <p className="text-[10px]">Sabedoria espiritual</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-card/80 border border-border">
                <Sword className="w-4 h-4" style={{ color: 'hsl(15 80% 55%)' }} />
                <div>
                  <p className="font-bold text-foreground text-xs">Coragem</p>
                  <p className="text-[10px]">Ousadia na jornada</p>
                </div>
              </div>
            </div>
            <p className="mt-2">Atributos altos podem <strong className="text-foreground">desbloquear escolhas especiais</strong> e <strong className="text-foreground">reduzir penalidades</strong>. Atributos baixos tornam os desafios mais difíceis.</p>
          </TutorialAccordion>

          <TutorialAccordion id="modos" emoji="🎭" title="Modos de Resposta">
            <p>O Mestre sorteia como o grupo deve responder:</p>
            <div className="space-y-2 mt-2">
              {[
                { icon: '👤', name: 'Individual Solo', desc: 'O sorteado responde sozinho, sem ajuda de ninguém.' },
                { icon: '🤝', name: 'Individual + Ajuda', desc: 'O sorteado responde, mas o grupo pode ajudar e debater.' },
                { icon: '👥', name: 'Consenso do Grupo', desc: 'Todos discutem e decidem juntos a resposta.' },
                { icon: '🗳️', name: 'Votação Secreta', desc: 'Cada um vota no app sem ver os outros. Maioria vence.' },
                { icon: '🎯', name: 'Grupo Escolhe', desc: 'O grupo escolhe quem vai responder. Estratégia!' },
              ].map((modo, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-lg shrink-0">{modo.icon}</span>
                  <div>
                    <p className="font-bold text-foreground text-xs">{modo.name}</p>
                    <p className="text-[11px]">{modo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </TutorialAccordion>

          <TutorialAccordion id="dicas" emoji="💡" title="Dicas Estratégicas">
            <div className="space-y-2">
              <div className="flex gap-2"><span>📖</span><span>Mantenham a <strong className="text-foreground">Bíblia aberta</strong> — muitas respostas estão lá!</span></div>
              <div className="flex gap-2"><span>🤔</span><span>Em <strong className="text-foreground">dilemas</strong>, não existe resposta "certa" — cada escolha tem consequências diferentes.</span></div>
              <div className="flex gap-2"><span>⏱️</span><span>O <strong className="text-foreground">cronômetro</strong> só começa quando vocês clicam nele. Leiam tudo antes!</span></div>
              <div className="flex gap-2"><span>🛡️</span><span>Casas de <strong className="text-foreground">refúgio</strong> são raras. Quando encontrarem uma, aproveitem!</span></div>
              <div className="flex gap-2"><span>🎲</span><span>O dado é justo, mas o <strong className="text-foreground">tipo de casa</strong> onde você cai depende da posição no tabuleiro.</span></div>
              <div className="flex gap-2"><span>👹</span><span>Nos <strong className="text-foreground">confrontos com bosses</strong>, cada fase errada enfraquece o grupo. Trabalhem juntos!</span></div>
            </div>
          </TutorialAccordion>

          <TutorialAccordion id="narrador" emoji="🎙️" title="O Narrador (Voz)">
            <p>O app lê os textos em voz alta automaticamente. Você pode:</p>
            <div className="space-y-1.5 mt-2">
              <div className="flex gap-2"><span>🔊</span><span><strong className="text-foreground">Ativar/desativar</strong> a narração com o botão de áudio</span></div>
              <div className="flex gap-2"><span>⏭️</span><span><strong className="text-foreground">Pular</strong> a narração tocando "Continuar"</span></div>
              <div className="flex gap-2"><span>📖</span><span>O texto completo sempre aparece <strong className="text-foreground">escrito na tela</strong></span></div>
            </div>
          </TutorialAccordion>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-5 px-5">
          <button
            onClick={() => setStep('config')}
            className="w-full max-w-lg mx-auto flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-all"
            style={{ boxShadow: '0 0 30px hsl(40 60% 55% / 0.3)' }}
          >
            <Swords className="w-5 h-5" />
            Entendi! Preparar a Jornada
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
                <span className="font-display font-bold text-sm text-foreground">Cada Um Por Si</span>
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
