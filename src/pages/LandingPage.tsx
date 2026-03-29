import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ChevronRight, ChevronDown, BookOpen, Users, Star, Shield, Flame, Zap,
  Share2, Smartphone, MessageCircle, Clock, Check, X, CreditCard, QrCode,
  Swords, Gamepad2, Brain, Eye, Heart, Crown, Map, Trophy, Lock,
  ChevronLeft, Play, Volume2, Award, Gift, Timer, Target, Compass
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import heroImg from '@/assets/landing-hero.jpg';
import battleImg from '@/assets/landing-battle.jpg';
import bunyanImg from '@/assets/bunyan-portrait.jpg';
import sealImg from '@/assets/medieval-seal.png';

const SALE_URL = 'https://ocapelao-app.centrobiblico.online/venda';

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════ */
const CountdownTimer = () => {
  const getTarget = () => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(23, 59, 59, 999);
    return target.getTime();
  };

  const [target] = useState(getTarget);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-2">
      {[
        { v: timeLeft.h, l: 'HRS' },
        { v: timeLeft.m, l: 'MIN' },
        { v: timeLeft.s, l: 'SEG' },
      ].map((t, i) => (
        <div key={i} className="flex flex-col items-center">
          <span
            className="font-display text-2xl md:text-3xl font-bold text-primary"
            style={{
              textShadow: '0 0 20px hsl(40 70% 50% / 0.6), 0 0 40px hsl(40 70% 50% / 0.3)',
            }}
          >
            {pad(t.v)}
          </span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t.l}</span>
          {i < 2 && (
            <span className="absolute text-primary text-xl ml-[4.5rem] mt-1 animate-pulse">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PHONE MOCKUP
   ═══════════════════════════════════════════════════════════ */
const appTourSlides = [
  {
    title: '🏰 Tela Inicial',
    desc: 'Escolha seu capítulo e mergulhe na jornada. Interface elegante com progresso visual.',
    colors: 'from-amber-900/80 to-stone-900/90',
    icon: <Compass className="w-8 h-8 text-primary" />,
  },
  {
    title: '📖 Narrativa Imersiva',
    desc: 'Leia a história com arte conceitual cinematográfica e tome decisões que mudam tudo.',
    colors: 'from-emerald-900/80 to-stone-900/90',
    icon: <BookOpen className="w-8 h-8 text-primary" />,
  },
  {
    title: '⚔️ Duelos Épicos',
    desc: 'Enfrente Apolião e outros inimigos em batalhas estratégicas com dados e Armadura de Deus.',
    colors: 'from-red-900/80 to-stone-900/90',
    icon: <Swords className="w-8 h-8 text-primary" />,
  },
  {
    title: '🧩 Mini-Games',
    desc: 'Puzzles bíblicos, desafios de reflexo, caça ao tesouro e muito mais em cada capítulo.',
    colors: 'from-violet-900/80 to-stone-900/90',
    icon: <Gamepad2 className="w-8 h-8 text-primary" />,
  },
  {
    title: '📊 Atributos Dinâmicos',
    desc: 'Fé, Perseverança, Discernimento e Coragem evoluem com suas escolhas.',
    colors: 'from-blue-900/80 to-stone-900/90',
    icon: <Target className="w-8 h-8 text-primary" />,
  },
  {
    title: '🎲 Multiplayer',
    desc: 'Jogue online ou reunidos como RPG de tabuleiro. Até 6 jogadores simultâneos.',
    colors: 'from-cyan-900/80 to-stone-900/90',
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: '🏆 Múltiplos Finais',
    desc: 'Cada jogada é única. Eventos aleatórios e finais diferentes baseados nos seus atributos.',
    colors: 'from-yellow-900/80 to-stone-900/90',
    icon: <Trophy className="w-8 h-8 text-primary" />,
  },
];

/* ═══════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════ */
const faqData = [
  {
    q: 'O app funciona sem internet?',
    a: 'Sim! Todo o conteúdo narrativo, mini-games e desafios funcionam 100% offline. Você pode jogar em qualquer lugar, a qualquer hora. O modo online é necessário apenas para multiplayer e sincronização na nuvem.',
  },
  {
    q: 'Posso instalar no celular como um aplicativo?',
    a: 'Sim! O Peregrino é um PWA (Progressive Web App). Basta acessar pelo navegador e clicar em "Instalar" ou "Adicionar à tela inicial". Funciona em Android e iPhone sem precisar da Play Store ou App Store.',
  },
  {
    q: 'É seguro comprar? Como funciona a garantia?',
    a: 'Totalmente seguro. Você tem 7 dias de garantia incondicional. Se por qualquer motivo não gostar, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.',
  },
  {
    q: 'Qual a diferença entre a versão gratuita e a completa?',
    a: 'A versão gratuita inclui os primeiros capítulos para você experimentar. A versão completa desbloqueia toda a jornada: 30+ capítulos, todos os mini-games, modo multiplayer, finais alternativos e atualizações futuras.',
  },
  {
    q: 'Quantas vezes posso jogar?',
    a: 'Infinitas! O jogo foi projetado para rejogabilidade. Com eventos aleatórios, escolhas ramificadas e múltiplos finais, cada jogada é uma experiência diferente.',
  },
  {
    q: 'É adequado para crianças e adolescentes?',
    a: 'Sim! O conteúdo é 100% baseado na obra clássica de John Bunyan. É ideal para jovens, grupos de jovens, escolas dominicais e famílias. Classificação livre.',
  },
  {
    q: 'Posso jogar com meu grupo de jovens da igreja?',
    a: 'Absolutamente! O modo presencial foi feito exatamente para isso. Reúna até 6 pessoas, cada um com seu personagem, e vivam a jornada juntos como um RPG de tabuleiro digital.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos PIX, cartão de crédito (até 12x), cartão de débito, e pagamento híbrido (PIX + cartão). Processamento 100% seguro.',
  },
];

/* ═══════════════════════════════════════════════════════════
   CTA BUTTON COMPONENT
   ═══════════════════════════════════════════════════════════ */
const CtaButton = ({ children, onClick, variant = 'primary', className = '' }: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`
      relative font-display text-base tracking-wide rounded-xl transition-all duration-300
      flex items-center justify-center gap-2 min-h-[56px] px-8
      ${variant === 'primary'
        ? 'bg-gradient-to-b from-primary to-primary/80 text-primary-foreground border-2 border-primary/60'
        : 'bg-card/80 text-foreground border-2 border-primary/30 hover:border-primary/60'
      }
      ${className}
    `}
    style={{
      boxShadow: variant === 'primary'
        ? '0 0 25px hsl(40 70% 50% / 0.4), 0 0 50px hsl(40 70% 50% / 0.15), 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 hsl(40 80% 75% / 0.3)'
        : '0 0 15px hsl(40 70% 50% / 0.15), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 hsl(40 80% 75% / 0.1)',
    }}
  >
    {children}
  </button>
);

/* ═══════════════════════════════════════════════════════════
   MEDIEVAL CARD
   ═══════════════════════════════════════════════════════════ */
const MedievalCard = ({ children, className = '', glow = false }: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) => (
  <div
    className={`rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 ${className}`}
    style={{
      boxShadow: glow
        ? '0 0 20px hsl(40 70% 50% / 0.2), 0 0 40px hsl(40 70% 50% / 0.08), 0 8px 30px rgba(0,0,0,0.4)'
        : '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 hsl(40 80% 75% / 0.05)',
    }}
  >
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SECTION DIVIDER
   ═══════════════════════════════════════════════════════════ */
const SectionDivider = () => (
  <div className="flex items-center justify-center py-4">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
    <Sparkles className="w-4 h-4 text-primary/40 mx-3" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBuy = () => {
    window.open(SALE_URL, '_blank', 'noopener');
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-5 py-16 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Jornada do Peregrino" className="w-full h-full object-cover opacity-40" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div
            className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 mb-2"
            style={{ boxShadow: '0 0 20px hsl(40 70% 50% / 0.2)' }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-display font-bold flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" /> Jornada Interativa Épica
            </span>
          </div>

          <h1
            className="font-display text-4xl md:text-6xl text-foreground leading-[1.1] font-bold"
            style={{ textShadow: '0 0 40px hsl(40 70% 50% / 0.3)' }}
          >
            Viva a Maior Batalha<br />
            <span className="text-primary">Espiritual</span> de Todos os Tempos
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-lg mx-auto font-body">
            A obra-prima de <strong>John Bunyan</strong> transformada em uma experiência interativa
            que vai <em>desafiar sua fé, provocar suas emoções</em> e mudar sua perspectiva para sempre.
          </p>

          <p className="text-sm text-primary/80 font-display tracking-wide">
            ⚔️ Mais de 30 capítulos · 9 tipos de desafios · Múltiplos finais
          </p>

          {/* Urgency */}
          <div className="pt-3">
            <div
              className="inline-block px-6 py-3 rounded-xl border border-destructive/30 bg-destructive/10"
              style={{ boxShadow: '0 0 15px hsl(0 60% 50% / 0.15)' }}
            >
              <p className="text-xs text-destructive font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <Timer className="w-3.5 h-3.5 animate-pulse" /> Oferta expira em:
              </p>
              <CountdownTimer />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <CtaButton onClick={handleBuy} variant="primary">
              <Crown className="w-5 h-5" />
              Adquirir Versão Completa — R$147/ano
            </CtaButton>
            <CtaButton onClick={() => navigate('/')} variant="secondary">
              <Play className="w-5 h-5" />
              Experimentar Grátis
            </CtaButton>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Garantia 7 dias</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Instale no celular</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Pagamento seguro</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-primary/50" />
        </div>
      </section>

      {/* ══════════ PAIN POINTS ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Você já sentiu isso?</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            A fé esfriando... Os desafios pesando...<br />
            <span className="text-primary">E a sensação de estar sozinho na caminhada</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              'Sente que devocional virou rotina e não toca mais o coração?',
              'Quer ensinar valores bíblicos mas os jovens não se engajam?',
              'Procura algo diferente para seu grupo de jovens e não encontra?',
              'Deseja uma experiência bíblica profunda mas acessível e moderna?',
            ].map((pain, i) => (
              <MedievalCard key={i} className="flex items-start gap-3 p-4">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 font-body">{pain}</p>
              </MedievalCard>
            ))}
          </div>

          <p className="text-base text-foreground/70 font-body italic">
            Você não está sozinho. Milhares de cristãos sentem o mesmo vazio.
            Mas existe uma solução que transforma isso em uma <strong className="text-primary">jornada épica de fé</strong>.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ SOLUTION ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">A Solução</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            Apresentamos <span className="text-primary">O Peregrino</span><br />
            — A Jornada Interativa
          </h2>

          <div className="relative rounded-2xl overflow-hidden max-w-xl mx-auto"
            style={{
              transform: 'perspective(1000px) rotateY(-2deg) rotateX(1deg)',
              boxShadow: '0 0 30px hsl(40 70% 50% / 0.25), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <img src={battleImg} alt="Batalha contra Apolião" className="w-full" loading="lazy" width={1280} height={720} />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
              <p className="font-display text-lg text-foreground font-bold">Enfrente Apolião</p>
              <p className="text-sm text-foreground/70">Cada batalha é diferente. Cada escolha importa.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <BookOpen className="w-6 h-6" />, stat: '30+', label: 'Capítulos narrativos' },
              { icon: <Gamepad2 className="w-6 h-6" />, stat: '9', label: 'Tipos de desafios' },
              { icon: <Trophy className="w-6 h-6" />, stat: '∞', label: 'Rejogabilidade' },
            ].map((s, i) => (
              <MedievalCard key={i} glow className="text-center">
                <div className="text-primary mb-2 flex justify-center">{s.icon}</div>
                <p className="font-display text-2xl text-primary font-bold">{s.stat}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </MedievalCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ APP TOUR / PHONE MOCKUP ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Tour pelo App</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            Veja por dentro como é<br />
            <span className="text-primary">a experiência completa</span>
          </h2>

          {/* Phone Mockup */}
          <div className="flex justify-center">
            <div
              className="relative w-[280px] rounded-[2.5rem] border-4 border-foreground/20 bg-background overflow-hidden"
              style={{
                boxShadow: '0 0 30px hsl(40 70% 50% / 0.2), 0 25px 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.3)',
                transform: 'perspective(800px) rotateY(-3deg)',
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-foreground/20 rounded-b-xl z-10" />

              {/* Screen content */}
              <div className="pt-8 pb-4">
                <Carousel opts={{ loop: true }} className="w-full">
                  <CarouselContent>
                    {appTourSlides.map((slide, i) => (
                      <CarouselItem key={i}>
                        <div className={`min-h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b ${slide.colors}`}>
                          <div
                            className="w-16 h-16 rounded-2xl bg-card/50 border border-primary/30 flex items-center justify-center mb-4"
                            style={{ boxShadow: '0 0 15px hsl(40 70% 50% / 0.3)' }}
                          >
                            {slide.icon}
                          </div>
                          <h3 className="font-display text-lg text-foreground font-bold mb-3">{slide.title}</h3>
                          <p className="text-sm text-foreground/70 leading-relaxed font-body">{slide.desc}</p>
                          <div className="mt-6 flex gap-1.5">
                            {appTourSlides.map((_, j) => (
                              <div
                                key={j}
                                className={`w-2 h-2 rounded-full transition-all ${j === i ? 'bg-primary w-6' : 'bg-foreground/20'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Home bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-foreground/30 rounded-full" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-body">
            ← Deslize para ver todas as telas →
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ FEATURES — HOW IT WORKS ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Como Funciona</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Uma experiência <span className="text-primary">completa e profunda</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Narrativa Interativa',
                desc: 'A história de O Peregrino ganha vida através de escolhas que você faz. Cada decisão altera seus 4 atributos — Fé, Perseverança, Discernimento e Coragem — e determina qual caminho você seguirá.',
              },
              {
                icon: <Swords className="w-6 h-6" />,
                title: 'Duelos Espirituais',
                desc: 'Enfrente Apolião, o Gigante Desespero e outros inimigos usando a Armadura de Deus: Espada (ataque), Escudo (defesa) e Oração (poder espiritual) em combates estratégicos.',
              },
              {
                icon: <Gamepad2 className="w-6 h-6" />,
                title: '9 Tipos de Mini-Games',
                desc: 'Reflexos rápidos (QTE), esquiva de tentações, memória bíblica, furtividade, caça ao tesouro, duelo de dados, puzzles de escrituras e muito mais.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Modo Multiplayer',
                desc: 'Jogue online com amigos ou reúna o grupo presencialmente. Um tabuleiro digital premium com dados 3D, eventos coletivos e chat.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Sistema de Combo',
                desc: 'Sequências de boas escolhas ativam combos (streaks) que amplificam suas recompensas. Mantenha a série e veja seus atributos dispararem.',
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'Efeitos Visuais e Atmosféricos',
                desc: 'Partículas de fogo, chuva, luz sagrada. Efeitos de câmera como terremoto e brilho divino em momentos críticos da história.',
              },
              {
                icon: <Map className="w-6 h-6" />,
                title: 'Funciona 100% Offline',
                desc: 'Instale no celular como app (PWA). Todo conteúdo funciona sem internet. Ideal para viagens, retiros e qualquer lugar.',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Rejogabilidade Infinita',
                desc: 'Eventos aleatórios, variações narrativas e múltiplos finais garantem que cada jogada seja uma experiência nova e surpreendente.',
              },
            ].map((f, i) => (
              <MedievalCard key={i} glow={i < 3} className="flex gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
                  style={{ boxShadow: '0 0 10px hsl(40 70% 50% / 0.15)' }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed font-body">{f.desc}</p>
                </div>
              </MedievalCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ FOR WHO / NOT FOR WHO ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Transparência Total</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Para quem é <span className="text-primary">e para quem não é</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MedievalCard glow>
              <h3 className="font-display text-lg text-primary font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" /> É para você se:
              </h3>
              <ul className="space-y-3">
                {[
                  'Quer uma experiência bíblica profunda e envolvente',
                  'Busca algo diferente para seu grupo de jovens',
                  'É líder de célula, pastor de jovens ou professor de ED',
                  'Quer presentear alguém com algo significativo',
                  'Gosta de jogos narrativos com escolhas reais',
                  'Valoriza conteúdo que edifica e entretém',
                  'Quer algo que funcione offline e no celular',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </MedievalCard>

            <MedievalCard>
              <h3 className="font-display text-lg text-destructive font-bold mb-4 flex items-center gap-2">
                <X className="w-5 h-5" /> NÃO é para você se:
              </h3>
              <ul className="space-y-3">
                {[
                  'Procura um jogo casual sem profundidade',
                  'Não tem interesse em conteúdo bíblico',
                  'Quer gráficos 3D AAA de console',
                  'Espera um jogo de ação puro sem narrativa',
                  'Não gosta de ler e tomar decisões',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body">
                    <X className="w-4 h-4 text-destructive/60 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </MedievalCard>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ JOHN BUNYAN STORY ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">A Obra Original</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              A História por trás de <span className="text-primary">O Peregrino</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div
              className="flex-shrink-0 w-full md:w-56 rounded-xl overflow-hidden"
              style={{
                transform: 'perspective(800px) rotateY(3deg)',
                boxShadow: '0 0 25px hsl(40 70% 50% / 0.2), 0 15px 40px rgba(0,0,0,0.5)',
              }}
            >
              <img src={bunyanImg} alt="John Bunyan" className="w-full" loading="lazy" width={768} height={1024} />
            </div>

            <div className="space-y-4 font-body text-foreground/80 text-sm leading-relaxed">
              <p>
                Em <strong className="text-foreground">1678</strong>, um homem preso por pregar o Evangelho escreveu,
                de dentro de uma cela úmida e fria, a obra que se tornaria o <strong className="text-primary">segundo livro
                mais lido da história</strong> — perdendo apenas para a Bíblia.
              </p>
              <p>
                <strong className="text-foreground">John Bunyan</strong> passou 12 anos na prisão de Bedford, na Inglaterra,
                por se recusar a parar de pregar. Dentro daquelas paredes, ele teve uma visão:
                a jornada de um homem chamado <em>Cristão</em>, que abandona a Cidade da Destruição
                e caminha até a Cidade Celestial.
              </p>
              <p>
                <strong className="text-primary">"O Peregrino"</strong> (The Pilgrim's Progress) já foi traduzido para
                mais de <strong>200 idiomas</strong>. É uma alegoria poderosa sobre a vida cristã, onde cada personagem
                — <em>Evangelista, Fiel, Esperançoso, Apolião, o Gigante Desespero</em> — representa lutas
                e verdades que todo cristão enfrenta.
              </p>
              <p>
                Bunyan também escreveu <strong className="text-primary">"A Peregrina"</strong>, a continuação que conta a jornada
                de Cristina, esposa de Cristão, e seus filhos. Uma história de coragem feminina, maternidade e fé inabalável.
              </p>
              <p className="text-primary font-display text-base italic">
                "Este app transforma essas obras-primas em algo que você não apenas lê —
                mas <strong>vive</strong>."
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Depoimentos</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              O que dizem os <span className="text-primary">peregrinos</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Lucas M.', role: 'Líder de Jovens', text: 'Nunca imaginei que um jogo pudesse me fazer refletir tanto. Cada escolha pesa de verdade. Usei no retiro e foi transformador.' },
              { name: 'Ana P.', role: 'Professora de ED', text: 'Joguei com meu grupo de jovens no modo presencial. Foi incrível! Melhor que qualquer jogo de tabuleiro. As discussões depois foram profundas.' },
              { name: 'Rafael S.', role: 'Gamer Cristão', text: 'A história é envolvente e os mini-games são muito bem feitos. Já joguei 3 vezes e cada uma foi diferente. Os duelos contra Apolião são épicos!' },
              { name: 'Débora L.', role: 'Mãe e Educadora', text: 'Meus filhos adoraram. Finalmente algo que ensina valores bíblicos de forma que eles realmente querem participar. Vale cada centavo.' },
            ].map((t, i) => (
              <MedievalCard key={i} glow={i === 0}>
                <div className="flex items-center gap-1.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/85 italic leading-relaxed font-body">"{t.text}"</p>
                <p className="text-xs text-muted-foreground mt-3 font-display">
                  — <span className="text-foreground">{t.name}</span> · {t.role}
                </p>
              </MedievalCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ PRICE ANCHORING ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Investimento</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            Quanto vale uma <span className="text-primary">transformação</span> assim?
          </h2>

          {/* Anchoring */}
          <div className="space-y-3 text-left max-w-md mx-auto font-body">
            {[
              { item: 'Um jogo de tabuleiro cristão', price: 'R$ 180+' },
              { item: 'Material de estudo bíblico anual', price: 'R$ 300+' },
              { item: 'Curso de discipulado online', price: 'R$ 497+' },
              { item: 'Retiro de jovens (por pessoa)', price: 'R$ 250+' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-foreground/60">{a.item}</span>
                <span className="text-sm text-foreground/40 line-through">{a.price}</span>
              </div>
            ))}
          </div>

          <p className="text-base text-foreground/70 font-body">
            Tudo isso junto custaria mais de <span className="line-through text-foreground/40">R$ 1.200</span>
          </p>

          {/* Price Card */}
          <MedievalCard glow className="max-w-sm mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display mb-1">Acesso completo por apenas</p>
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-sm text-muted-foreground">R$</span>
              <span
                className="font-display text-5xl md:text-6xl font-bold text-primary"
                style={{ textShadow: '0 0 30px hsl(40 70% 50% / 0.5)' }}
              >
                147
              </span>
              <span className="text-sm text-muted-foreground">/ano</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Equivale a apenas <strong className="text-primary">R$ 0,40/dia</strong> — menos que uma bala
            </p>

            <div className="space-y-2 text-left mb-6">
              {[
                'Acesso a todos os 30+ capítulos',
                'Todos os 9 tipos de mini-games',
                'Modo multiplayer online e presencial',
                'Múltiplos finais e eventos aleatórios',
                'Funciona 100% offline',
                'Atualizações futuras inclusas',
                'Instale em quantos dispositivos quiser',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80 font-body">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <CtaButton onClick={handleBuy} variant="primary" className="w-full">
              <Crown className="w-5 h-5" />
              Quero Começar Minha Jornada
            </CtaButton>
          </MedievalCard>

          {/* Urgency */}
          <div
            className="inline-block px-5 py-3 rounded-xl border border-destructive/30 bg-destructive/10"
            style={{ boxShadow: '0 0 15px hsl(0 60% 50% / 0.15)' }}
          >
            <p className="text-xs text-destructive font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
              <Timer className="w-3.5 h-3.5 animate-pulse" /> Preço promocional expira em:
            </p>
            <CountdownTimer />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ GUARANTEE & PAYMENT ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Segurança Total</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Sua compra é <span className="text-primary">100% protegida</span>
            </h2>
          </div>

          {/* Guarantee */}
          <MedievalCard glow className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <img src={sealImg} alt="Selo de Garantia 7 Dias" className="w-28 h-28 object-contain" loading="lazy" width={512} height={512} />
            <div>
              <h3 className="font-display text-lg text-foreground font-bold mb-2">
                Garantia Incondicional de 7 Dias
              </h3>
              <p className="text-sm text-foreground/70 font-body leading-relaxed">
                Se por <strong>qualquer motivo</strong> você não ficar satisfeito nos primeiros 7 dias,
                devolvemos <strong className="text-primary">100% do seu dinheiro</strong>. Sem perguntas,
                sem burocracia, sem letras miúdas. O risco é <strong>zero</strong>.
              </p>
            </div>
          </MedievalCard>

          {/* Payment Methods */}
          <div className="text-center">
            <h3 className="font-display text-base text-foreground mb-4">Formas de Pagamento</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: <CreditCard className="w-5 h-5" />, label: 'Crédito até 12x', sub: 'Visa, Master, Elo' },
                { icon: <CreditCard className="w-5 h-5" />, label: 'Débito', sub: 'Todas as bandeiras' },
                { icon: <QrCode className="w-5 h-5" />, label: 'PIX', sub: 'Pagamento instantâneo' },
                { icon: <CreditCard className="w-5 h-5" />, label: 'Híbrido', sub: 'PIX + Cartão' },
              ].map((pm, i) => (
                <MedievalCard key={i} className="w-[140px] text-center p-4">
                  <div className="text-primary mb-2 flex justify-center">{pm.icon}</div>
                  <p className="text-xs font-display font-bold text-foreground">{pm.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{pm.sub}</p>
                </MedievalCard>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { icon: <Shield className="w-4 h-4" />, text: 'Compra Segura' },
              { icon: <Lock className="w-4 h-4" />, text: 'SSL Criptografado' },
              { icon: <Award className="w-4 h-4" />, text: 'Satisfação Garantida' },
              { icon: <Check className="w-4 h-4" />, text: 'Acesso Imediato' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-primary">{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ FAQ ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Dúvidas Frequentes</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Perguntas e <span className="text-primary">Respostas</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <MedievalCard key={i} className="cursor-pointer p-0 overflow-hidden" glow={openFaq === i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-display text-sm font-bold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-4 pb-4 text-sm text-foreground/70 font-body leading-relaxed">{faq.a}</p>
                </div>
              </MedievalCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative px-5 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-lg mx-auto space-y-6">
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            A jornada começa com <span className="text-primary">um passo</span>
          </h2>
          <p className="text-base text-foreground/70 font-body">
            Cristão também hesitou antes de deixar a Cidade da Destruição.
            Mas ele deu o primeiro passo — e nunca mais foi o mesmo.
          </p>
          <p className="text-sm text-primary font-display italic">
            "Fuja da ira vindoura!" — Evangelista
          </p>

          <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
            <CtaButton onClick={handleBuy} variant="primary" className="w-full text-base">
              <Crown className="w-5 h-5" />
              Adquirir Agora — R$147/ano
            </CtaButton>
            <CtaButton onClick={() => navigate('/')} variant="secondary" className="w-full">
              <Play className="w-5 h-5" />
              Experimentar Versão Gratuita
            </CtaButton>
          </div>

          <div className="flex items-center justify-center gap-4 pt-3">
            <img src={sealImg} alt="Garantia" className="w-12 h-12 object-contain" loading="lazy" width={512} height={512} />
            <div className="text-left">
              <p className="text-xs font-display text-foreground font-bold">7 Dias de Garantia</p>
              <p className="text-[10px] text-muted-foreground">100% do dinheiro de volta</p>
            </div>
          </div>

          {/* Urgency final */}
          <div className="pt-4">
            <div
              className="inline-block px-5 py-3 rounded-xl border border-destructive/30 bg-destructive/10"
              style={{ boxShadow: '0 0 15px hsl(0 60% 50% / 0.15)' }}
            >
              <p className="text-xs text-destructive font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <Timer className="w-3.5 h-3.5 animate-pulse" /> Oferta por tempo limitado:
              </p>
              <CountdownTimer />
            </div>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-6 pt-6">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'O Peregrino — Jornada Interativa',
                    text: 'Viva a maior batalha espiritual de todos os tempos! Jogo narrativo interativo baseado na obra de John Bunyan.',
                    url: window.location.href,
                  });
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
