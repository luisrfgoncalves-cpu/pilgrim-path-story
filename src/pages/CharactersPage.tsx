import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { characters } from '@/data/story';
import { part2Characters } from '@/data/storyPart2';
import { characterImages } from '@/data/characterImages';
import { ArrowLeft, Lock } from 'lucide-react';

const CharactersPage = () => {
  const navigate = useNavigate();
  const { progress } = useStoryProgress();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg text-foreground">Personagens</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-3">
        {[...characters, ...part2Characters].map(char => {
          const unlocked = progress.visitedChapters.includes(char.unlockedAtChapter);
          const portrait = characterImages[char.id];
          return (
            <div
              key={char.id}
              className={`p-4 rounded-lg border transition-all ${
                unlocked ? 'bg-card border-border' : 'bg-muted/30 border-border opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 ${
                  unlocked ? 'border-primary/40' : 'border-muted'
                }`}>
                  {unlocked && portrait ? (
                    <img
                      src={portrait}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm text-foreground">
                    {unlocked ? char.name : '???'}
                  </p>
                  {unlocked && (
                    <>
                      <p className="text-xs text-primary mt-0.5">{char.role}</p>
                      <p className="text-sm text-muted-foreground mt-2 narrative-text leading-relaxed">{char.description}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default CharactersPage;
