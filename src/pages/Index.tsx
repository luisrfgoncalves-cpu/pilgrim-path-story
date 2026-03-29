import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { BookOpen, Map, BarChart3, Users, ScrollText, ChevronRight, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { hasProgress, startJourney, resetProgress } = useStoryProgress();

  const handleContinue = () => {
    startJourney();
    navigate('/cena');
  };

  const handleNewJourney = () => {
    resetProgress();
    startJourney();
    navigate('/cena');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <div className="max-w-sm w-full space-y-8 fade-in">
        {/* Logo area */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center glow-gold">
            <BookOpen className="w-9 h-9 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground leading-tight">O Peregrino</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mt-2 font-medium">John Bunyan</p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-px flex-1 bg-primary/20" />
            <span className="text-primary text-xs">✦</span>
            <div className="h-px flex-1 bg-primary/20" />
          </div>
          <p className="narrative-text text-muted-foreground text-sm">
            Uma experiência narrativa interativa. Tome decisões que moldam a jornada de Cristão.
          </p>
        </div>

        {/* Main actions */}
        <div className="space-y-3">
          {hasProgress && (
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-primary text-primary-foreground font-display text-sm hover:opacity-90 transition-opacity glow-gold"
            >
              <span className="flex items-center gap-3">
                <ChevronRight className="w-5 h-5" />
                Continuar Jornada
              </span>
            </button>
          )}

          <button
            onClick={handleNewJourney}
            className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-card border border-border text-foreground font-display text-sm hover:border-primary/50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gold" />
              Nova Jornada
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Explorar</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Secondary navigation */}
        <div className="grid grid-cols-3 gap-3">
          <NavCard icon={<Map className="w-5 h-5" />} label="Jornada" onClick={() => navigate('/jornada')} />
          <NavCard icon={<BarChart3 className="w-5 h-5" />} label="Progresso" onClick={() => navigate('/progresso')} />
          <NavCard icon={<Users className="w-5 h-5" />} label="Personagens" onClick={() => navigate('/personagens')} />
        </div>

        <button
          onClick={() => navigate('/reflexoes')}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-lg bg-card border border-border text-foreground font-body text-sm hover:border-primary/50 transition-colors"
        >
          <ScrollText className="w-5 h-5 text-gold" />
          <span>Reflexões</span>
        </button>
      </div>
    </div>
  );
};

const NavCard = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
  >
    <span className="text-gold">{icon}</span>
    <span className="text-xs text-foreground font-medium">{label}</span>
  </button>
);

export default Index;
