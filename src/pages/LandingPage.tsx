import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, ChevronRight, BookOpen, Users, Star, Shield, Flame, Zap, Share2, Smartphone, MessageCircle } from 'lucide-react';
import ScreenHero from '@/components/ScreenHero';

const features = [
  { icon: <BookOpen className="w-6 h-6" />, title: 'Narrativa Interativa', desc: 'Suas escolhas moldam a história. Cada decisão afeta seus atributos e o destino do peregrino.' },
  { icon: <Flame className="w-6 h-6" />, title: '4 Atributos Dinâmicos', desc: 'Fé, Perseverança, Discernimento e Coragem evoluem com cada decisão que você toma.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Mini-Games e Desafios', desc: 'Puzzles bíblicos, desafios de tempo e jogos interativos em momentos-chave da história.' },
  { icon: <Users className="w-6 h-6" />, title: 'Multiplayer', desc: 'Jogue com amigos online ou reunidos presencialmente como um RPG de tabuleiro.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Funciona Offline', desc: 'Toda a experiência funciona sem internet. Seus dados são salvos automaticamente.' },
  { icon: <Star className="w-6 h-6" />, title: 'Rejogabilidade', desc: 'Múltiplos finais, eventos aleatórios e variações narrativas a cada jogada.' },
];

const testimonials = [
  { name: 'Lucas M.', text: 'Nunca imaginei que um jogo pudesse me fazer refletir tanto. Cada escolha pesa de verdade.', stars: 5 },
  { name: 'Ana P.', text: 'Joguei com meu grupo de jovens no modo presencial. Foi incrível! Melhor que qualquer jogo de tabuleiro.', stars: 5 },
  { name: 'Rafael S.', text: 'A história é envolvente e os mini-games são muito bem feitos. Já joguei 3 vezes e cada uma foi diferente.', stars: 5 },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-12 pb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-lg mx-auto space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display font-bold">Jornada Interativa</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight" style={{ wordSpacing: '0.1em' }}>
            O Peregrino
          </h1>
          <p className="text-base text-foreground/80 leading-relaxed max-w-md mx-auto" style={{ wordSpacing: '0.05em' }}>
            Viva a clássica jornada de John Bunyan como nunca antes. Suas escolhas determinam o destino. Cada decisão tem consequências reais.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => navigate('/')}
              className="btn-medieval flex items-center justify-center gap-2 px-8"
            >
              <Sparkles className="w-5 h-5" />
              Jogar Agora — Grátis
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-medieval-secondary flex items-center justify-center gap-2 px-8"
            >
              <ChevronRight className="w-5 h-5" />
              Saiba Mais
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Instale no celular</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Funciona offline</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-12 bg-card/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-foreground text-center mb-8">O que torna esta jornada única</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-foreground text-center mb-8">O que os peregrinos dizem</h2>
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/85 italic leading-relaxed">"{t.text}"</p>
                <p className="text-xs text-muted-foreground mt-2 font-display">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-5 py-16 text-center bg-gradient-to-t from-primary/10 via-transparent to-transparent">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="font-display text-2xl text-foreground">Pronto para a jornada?</h2>
          <p className="text-sm text-foreground/70">Gratuito. Sem anúncios. Funciona offline. Instale no celular como um app.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-medieval flex items-center justify-center gap-2 px-10 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Começar Agora
          </button>
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'O Peregrino', text: 'Viva a jornada do Peregrino — jogo narrativo interativo!', url: window.location.origin });
                }
              }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Compartilhar
            </button>
            <button
              onClick={() => navigate('/termos')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Termos e Privacidade
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
