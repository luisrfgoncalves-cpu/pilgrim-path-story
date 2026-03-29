import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { storyChapters, chapterOrder } from '@/data/story';
import { ArrowLeft, Lock, MapPin, CheckCircle2 } from 'lucide-react';

const JourneysPage = () => {
  const navigate = useNavigate();
  const { progress, goToChapter, startJourney } = useStoryProgress();

  const handleChapterClick = (chapterId: string) => {
    if (progress.visitedChapters.includes(chapterId)) {
      goToChapter(chapterId);
      startJourney();
      navigate('/cena');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg text-foreground">Jornada</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-3">
        {chapterOrder.map((chapterId, i) => {
          const chapter = storyChapters[chapterId];
          if (!chapter) return null;
          const unlocked = progress.visitedChapters.includes(chapterId);
          const isCurrent = progress.currentChapterId === chapterId;

          return (
            <button
              key={chapterId}
              onClick={() => handleChapterClick(chapterId)}
              disabled={!unlocked}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-primary/10 border-primary/50 glow-gold'
                  : unlocked
                  ? 'bg-card border-border hover:border-primary/30'
                  : 'bg-muted/30 border-border opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-display ${
                  isCurrent ? 'bg-primary text-primary-foreground' : unlocked ? 'bg-card border border-primary/30 text-gold' : 'bg-muted text-muted-foreground'
                }`}>
                  {unlocked ? (isCurrent ? i + 1 : <CheckCircle2 className="w-4 h-4" />) : <Lock className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-display text-sm ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {unlocked ? chapter.title : '???'}
                  </p>
                  {unlocked && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {chapter.location}
                    </p>
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

export default JourneysPage;
