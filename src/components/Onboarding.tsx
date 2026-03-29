import { useState } from 'react';
import { BookOpen, Zap, Shield, Users, ChevronRight, Flame } from 'lucide-react';

const steps = [
  {
    icon: <BookOpen className="w-10 h-10" />,
    title: 'Narrativa Interativa',
    desc: 'Você é o protagonista. Cada escolha que fizer afeta a história e seus atributos.',
    color: 'text-primary',
  },
  {
    icon: <Flame className="w-10 h-10" />,
    title: '4 Atributos',
    desc: 'Fé, Perseverança, Discernimento e Coragem. Suas decisões fazem eles subir ou descer.',
    color: 'text-primary',
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: 'Mini-Games e Desafios',
    desc: 'Em momentos-chave, você enfrentará puzzles e desafios interativos que testam suas habilidades.',
    color: 'text-primary',
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: 'Multiplayer',
    desc: 'Jogue com amigos online ou reunidos presencialmente como um RPG de mesa.',
    color: 'text-primary',
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: 'Funciona Offline',
    desc: 'Tudo salva automaticamente. Jogue sem internet. Seu progresso nunca se perde.',
    color: 'text-primary',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('peregrino-onboarding-done', '1');
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('peregrino-onboarding-done', '1');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[99] bg-background flex flex-col items-center justify-center px-6">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-12">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/50' : 'w-4 bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="text-center max-w-sm animate-fade-in" key={step}>
        <div className={`${current.color} mb-6 flex justify-center`}>
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            {current.icon}
          </div>
        </div>
        <h2 className="font-display text-2xl text-foreground mb-3">
          {current.title}
        </h2>
        <p className="text-sm text-foreground/75 leading-relaxed">
          {current.desc}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-12 w-full max-w-sm space-y-3">
        <button
          onClick={handleNext}
          className="btn-medieval w-full flex items-center justify-center gap-2"
        >
          {isLast ? 'Começar Jornada' : 'Próximo'}
          <ChevronRight className="w-5 h-5" />
        </button>
        {!isLast && (
          <button
            onClick={handleSkip}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Pular tutorial
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
