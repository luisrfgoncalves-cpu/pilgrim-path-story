import { useNavigate } from 'react-router-dom';
import { useStoryProgress, PlayerAttributes } from '@/hooks/useStoryProgress';
import { storyChapters } from '@/data/story';
import { ArrowLeft, Flame, Shield, BookOpen, Heart } from 'lucide-react';

const attributeConfig: { key: keyof PlayerAttributes; label: string; icon: React.ReactNode; max: number }[] = [
  { key: 'fe', label: 'Fé', icon: <Flame className="w-4 h-4" />, max: 80 },
  { key: 'coragem', label: 'Coragem', icon: <Shield className="w-4 h-4" />, max: 60 },
  { key: 'sabedoria', label: 'Sabedoria', icon: <BookOpen className="w-4 h-4" />, max: 50 },
  { key: 'humildade', label: 'Humildade', icon: <Heart className="w-4 h-4" />, max: 50 },
];

const ProgressPage = () => {
  const navigate = useNavigate();
  const { progress } = useStoryProgress();

  const totalChapters = Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);

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

      <main className="max-w-lg mx-auto px-5 py-6 space-y-8">
        {/* Journey progress */}
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
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <p className="font-display text-2xl text-gold">{progress.visitedChapters.length}</p>
              <p className="text-xs text-muted-foreground">Capítulos</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-gold">{progress.choicesMade}</p>
              <p className="text-xs text-muted-foreground">Decisões</p>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-5">
          <h2 className="font-display text-base text-foreground">Atributos do Peregrino</h2>
          {attributeConfig.map(attr => {
            const value = progress.attributes[attr.key];
            const percent = Math.min(100, Math.round((value / attr.max) * 100));
            return (
              <div key={attr.key} className="space-y-2">
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
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
