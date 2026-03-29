import { useState } from 'react';
import StoryReader from '@/components/StoryReader';
import { BookOpen, ChevronRight } from 'lucide-react';

const Index = () => {
  const [started, setStarted] = useState(() => {
    try {
      return !!localStorage.getItem('peregrino-progress');
    } catch {
      return false;
    }
  });

  if (started) {
    return <StoryReader />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-8 fade-in">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center glow-gold">
          <BookOpen className="w-7 h-7 text-gold" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
            O Peregrino
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            John Bunyan
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-primary/20" />
          <span className="text-primary text-xs">✦</span>
          <div className="h-px flex-1 bg-primary/20" />
        </div>

        {/* Description */}
        <p className="narrative-text text-muted-foreground text-sm leading-relaxed">
          Uma experiência narrativa interativa baseada na obra clássica. 
          Acompanhe a jornada de Cristão da Cidade da Destruição até a 
          Cidade Celestial, tomando decisões que moldam o caminho.
        </p>

        {/* Start button */}
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-display text-base hover:opacity-90 transition-opacity glow-gold"
        >
          Iniciar a Jornada
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Footer */}
        <p className="text-xs text-muted-foreground/60">
          Sessões curtas · Decisões com impacto · Progressão salva
        </p>
      </div>
    </div>
  );
};

export default Index;
