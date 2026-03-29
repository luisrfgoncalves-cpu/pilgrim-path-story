import { useNavigate } from 'react-router-dom';
import { useStoryProgress, PlayerAttributes } from '@/hooks/useStoryProgress';
import { storyChapters } from '@/data/story';
import { ArrowLeft, Flame, Shield, BookOpen, Mountain, ScrollText, ChevronRight, TrendingUp } from 'lucide-react';
import ScreenHero from '@/components/ScreenHero';
import pilgrimAdvancing from '@/assets/pilgrim-advancing.png';

const attributeConfig: { key: keyof PlayerAttributes; label: string; icon: React.ReactNode; emoji: string; description: string; max: number }[] = [
  { key: 'fe', label: 'Fé', icon: <Flame className="w-4 h-4" />, emoji: '🔥', description: 'Confiança no caminho e no Rei da Cidade Celestial', max: 80 },
  { key: 'perseveranca', label: 'Perseverança', icon: <Mountain className="w-4 h-4" />, emoji: '⛰️', description: 'Capacidade de resistir às provações sem desistir', max: 60 },
  { key: 'discernimento', label: 'Discernimento', icon: <BookOpen className="w-4 h-4" />, emoji: '👁️', description: 'Sabedoria para ver além das aparências e tomar decisões sábias', max: 60 },
  { key: 'coragem', label: 'Coragem', icon: <Shield className="w-4 h-4" />, emoji: '🛡️', description: 'Força para enfrentar o medo e o perigo', max: 60 },
];

const ProgressPage = () => {
  const navigate = useNavigate();
  const { progress } = useStoryProgress();

  const totalChapters = Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);
  const totalAttr = progress.attributes.fe + progress.attributes.perseveranca + progress.attributes.discernimento + progress.attributes.coragem;

  // Determine dominant attribute
  const sorted = [...attributeConfig].sort((a, b) => progress.attributes[b.key] - progress.attributes[a.key]);
  const dominant = sorted[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg text-foreground">Progresso</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        <ScreenHero
          image={pilgrimAdvancing}
          name="Seu Progresso"
          subtitle={`${progressPercent}% da jornada · ${progress.choicesMade} decisões`}
          sfx="accept"
          size="md"
        />
      </div>

      <main className="max-w-lg mx-auto px-5 pb-6 space-y-6">
        {/* Journey stats */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-display text-base text-foreground">Jornada</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso geral</span>
              <span className="text-gold font-display">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <p className="font-display text-2xl text-gold">{progress.visitedChapters.length}</p>
              <p className="text-xs text-muted-foreground">Capítulos</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-gold">{progress.choicesMade}</p>
              <p className="text-xs text-muted-foreground">Decisões</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-gold">{totalAttr}</p>
              <p className="text-xs text-muted-foreground">Total Attr</p>
            </div>
          </div>
        </div>

        {/* Character profile */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h2 className="font-display text-base text-foreground">Perfil do Peregrino</h2>
          <p className="text-sm text-muted-foreground">
            Atributo dominante: <span className="text-gold">{dominant.emoji} {dominant.label}</span>
          </p>
          <p className="narrative-text text-xs text-muted-foreground italic">{dominant.description}</p>
        </div>

        {/* Attributes */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-5">
          <h2 className="font-display text-base text-foreground">Atributos</h2>
          {attributeConfig.map(attr => {
            const value = progress.attributes[attr.key];
            const percent = Math.min(100, Math.round((value / attr.max) * 100));
            return (
              <div key={attr.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-gold">{attr.icon}</span>
                    {attr.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-display">{value}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{attr.description}</p>
              </div>
            );
          })}
        </div>

        {/* Decision history */}
        {progress.decisions.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-5 space-y-3">
            <h2 className="font-display text-base text-foreground flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-gold" />
              Histórico de Decisões
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {progress.decisions.map((d, i) => {
                const chapter = storyChapters[d.chapterId];
                return (
                  <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/30">
                    <ChevronRight className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{chapter?.title || d.chapterId}</p>
                      <p className="text-sm text-foreground">{d.choiceText}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(d.effects).filter(([,v]) => v && v > 0).map(([k, v]) => {
                          const labels: Record<string, string> = { fe: '🔥', perseveranca: '⛰️', discernimento: '👁️', coragem: '🛡️' };
                          return <span key={k} className="text-[10px] text-primary">{labels[k]}+{v}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressPage;
