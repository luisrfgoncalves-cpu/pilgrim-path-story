import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { reflections } from '@/data/story';
import { ArrowLeft, Lock, ScrollText } from 'lucide-react';
import { useState } from 'react';

const ReflectionsPage = () => {
  const navigate = useNavigate();
  const { progress } = useStoryProgress();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg text-foreground">Reflexões</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-3">
        {reflections.map(ref => {
          const unlocked = progress.visitedChapters.includes(ref.unlockedAtChapter);
          const isExpanded = expandedId === ref.id;

          return (
            <button
              key={ref.id}
              onClick={() => unlocked && setExpandedId(isExpanded ? null : ref.id)}
              disabled={!unlocked}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                unlocked ? 'bg-card border-border hover:border-primary/30' : 'bg-muted/30 border-border opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${unlocked ? 'text-gold' : 'text-muted-foreground'}`}>
                  {unlocked ? <ScrollText className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm text-foreground">
                    {unlocked ? ref.title : '???'}
                  </p>
                  {unlocked && isExpanded && (
                    <div className="mt-3 space-y-3 fade-in">
                      <p className="narrative-text text-sm text-foreground/80 leading-relaxed">{ref.text}</p>
                      {ref.verse && (
                        <p className="text-xs text-primary italic border-l-2 border-primary/30 pl-3">{ref.verse}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
};

export default ReflectionsPage;
