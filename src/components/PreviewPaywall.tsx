import { Crown, Lock } from 'lucide-react';

const SALE_URL = 'https://ocapelao-app.centrobiblico.online/venda';

const PreviewPaywall = () => {
  const handleBuy = () => {
    // Try opening in parent window, fall back to current
    try {
      window.top?.open(SALE_URL, '_blank', 'noopener');
    } catch {
      window.open(SALE_URL, '_blank', 'noopener');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center gap-5">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, hsl(40 60% 20%), hsl(40 40% 10%))',
          border: '1px solid hsl(40 60% 55% / 0.3)',
          boxShadow: '0 0 30px hsl(40 60% 55% / 0.15)',
        }}
      >
        <Lock className="w-10 h-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-xl text-foreground font-bold">
          Conteúdo Exclusivo
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          Esta parte da jornada está disponível apenas para membros.
          Adquira o acesso completo e viva toda a aventura do Peregrino!
        </p>
      </div>

      <button
        onClick={handleBuy}
        className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-display text-sm font-bold text-primary-foreground"
        style={{
          background: 'linear-gradient(135deg, hsl(40 70% 45%), hsl(40 60% 30%))',
          boxShadow: '0 0 20px hsl(40 70% 50% / 0.3), 0 4px 15px rgba(0,0,0,0.4)',
          border: '1px solid hsl(40 70% 55% / 0.3)',
        }}
      >
        <Crown className="w-5 h-5" />
        Adquirir — R$147/ano
      </button>

      <button
        onClick={() => window.history.back()}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Voltar e continuar explorando
      </button>
    </div>
  );
};

export default PreviewPaywall;
