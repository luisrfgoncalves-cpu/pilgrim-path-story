import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ChevronRight, ChevronDown, BookOpen, Users, Star, Shield, Flame, Zap,
  Share2, Smartphone, Clock, Check, X, CreditCard, QrCode,
  Swords, Gamepad2, Brain, Eye, Heart, Crown, Map, Trophy, Lock,
  Play, Award, Timer, Target, Compass
} from 'lucide-react';

import heroImg from '@/assets/landing-hero.jpg';
import battleImg from '@/assets/landing-battle.jpg';
import bunyanImg from '@/assets/bunyan-portrait.jpg';
import sealImg from '@/assets/medieval-seal.png';
import giantImg from '@/assets/landing-giant.jpg';
import journeyImg from '@/assets/landing-journey.jpg';

const SALE_URL = 'https://ocapelao-app.centrobiblico.online/venda';

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════ */
const CountdownTimer = ({ compact = false }: { compact?: boolean }) => {
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

  if (compact) {
    return (
      <span className="font-display font-bold text-primary" style={{ textShadow: '0 0 12px hsl(40 70% 50% / 0.5)' }}>
        {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {[
        { v: timeLeft.h, l: 'HRS' },
        { v: timeLeft.m, l: 'MIN' },
        { v: timeLeft.s, l: 'SEG' },
      ].map((t, i) => (
        <div key={i} className="flex flex-col items-center">
          <span
            className="font-display text-2xl md:text-3xl font-bold text-primary w-10 text-center"
            style={{ textShadow: '0 0 20px hsl(40 70% 50% / 0.6), 0 0 40px hsl(40 70% 50% / 0.3)' }}
          >
            {pad(t.v)}
          </span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{t.l}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PHONE MOCKUP WITH AUTO-SCROLL TOUR
   ═══════════════════════════════════════════════════════════ */
const PhoneMockupTour = () => {
  const tourScreens = [
    {
      title: '🏰 Tela Inicial',
      subtitle: 'Escolha seu capítulo',
      items: ['Fase 1 — Cidade da Destruição', 'Fase 2 — Casa do Intérprete', 'Fase 3 — Vale da Humilhação'],
      accent: 'from-amber-900/60 to-stone-900/80',
    },
    {
      title: '📖 Narrativa Imersiva',
      subtitle: 'Leia e decida',
      items: ['Arte cinematográfica em cada cena', 'Escolhas que mudam a história', 'Consequências em tempo real'],
      accent: 'from-emerald-900/60 to-stone-900/80',
    },
    {
      title: '⚔️ Duelo contra Apolião',
      subtitle: 'Combate estratégico',
      items: ['Espada > Oração > Escudo', 'Dados 3D animados', 'Armadura de Deus'],
      accent: 'from-red-900/60 to-stone-900/80',
    },
    {
      title: '🧩 Mini-Games',
      subtitle: '9 tipos diferentes',
      items: ['Puzzles bíblicos', 'Reflexo e esquiva', 'Caça ao tesouro espiritual'],
      accent: 'from-violet-900/60 to-stone-900/80',
    },
    {
      title: '📊 Seus Atributos',
      subtitle: 'Evolua com cada escolha',
      items: ['Fé ██████░░ 75%', 'Perseverança █████░░░ 62%', 'Coragem ████████░ 88%'],
      accent: 'from-blue-900/60 to-stone-900/80',
    },
    {
      title: '🎲 Multiplayer',
      subtitle: 'Até 6 jogadores',
      items: ['Tabuleiro premium', 'Online ou presencial', 'Eventos coletivos'],
      accent: 'from-cyan-900/60 to-stone-900/80',
    },
    {
      title: '🏆 Finais Múltiplos',
      subtitle: 'Rejogue e descubra',
      items: ['Final da Cidade Celestial', 'Final do Rio da Morte', 'Finais alternativos secretos'],
      accent: 'from-yellow-900/60 to-stone-900/80',
    },
  ];

  return (
    <div className="flex justify-center">
      {/* Phone frame - realistic iPhone style */}
      <div
        className="relative"
        style={{
          width: 300,
          transform: 'perspective(1200px) rotateY(-5deg) rotateX(2deg)',
        }}
      >
        {/* Phone body */}
        <div
          className="relative rounded-[3rem] overflow-hidden border-[6px] border-foreground/30 bg-background"
          style={{
            boxShadow:
              '0 0 40px hsl(40 70% 50% / 0.25), 0 30px 80px rgba(0,0,0,0.7), -15px 15px 40px rgba(0,0,0,0.4), inset 0 0 0 2px hsl(40 70% 50% / 0.1)',
            aspectRatio: '9/19.5',
          }}
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground/90 rounded-full z-20" />

          {/* Screen content - auto scrolling */}
          <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
            <div
              className="animate-phone-scroll"
              style={{
                animation: 'phoneScroll 28s ease-in-out infinite',
              }}
            >
              {tourScreens.map((screen, i) => (
                <div
                  key={i}
                  className={`min-h-[580px] flex flex-col p-6 pt-12 bg-gradient-to-b ${screen.accent}`}
                  style={{ background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)` }}
                >
                  {/* Status bar mockup */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-6 pt-4">
                    <span>9:41</span>
                    <span className="font-display text-primary text-[9px] tracking-wider">O PEREGRINO</span>
                    <span>100%</span>
                  </div>

                  {/* Screen title */}
                  <div className="mb-6">
                    <h4 className="font-display text-xl text-foreground font-bold">{screen.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{screen.subtitle}</p>
                  </div>

                  {/* Content items as cards */}
                  <div className="space-y-3 flex-1">
                    {screen.items.map((item, j) => (
                      <div
                        key={j}
                        className="p-4 rounded-xl bg-card/60 border border-border/50 text-sm text-foreground/80 font-body"
                        style={{
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 hsl(40 80% 75% / 0.05)',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Fake bottom nav */}
                  <div className="flex items-center justify-around pt-6 pb-2 border-t border-border/30 mt-4">
                    <div className="flex flex-col items-center gap-1">
                      <Compass className="w-4 h-4 text-primary" />
                      <span className="text-[9px] text-primary">Jornada</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">Multi</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">Perfil</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/40 rounded-full z-20" />
        </div>

        {/* Reflection effect */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full"
          style={{ background: 'radial-gradient(ellipse, hsl(40 70% 50% / 0.15), transparent)' }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════ */
const faqData = [
  { q: 'O app funciona sem internet?', a: 'Sim! Todo o conteúdo narrativo, mini-games e desafios funcionam 100% offline. Você pode jogar em qualquer lugar, a qualquer hora. O modo online é necessário apenas para multiplayer e sincronização na nuvem.' },
  { q: 'Posso instalar no celular como um aplicativo?', a: 'Sim! O Peregrino é um PWA (Progressive Web App). Basta acessar pelo navegador e clicar em "Instalar" ou "Adicionar à tela inicial". Funciona em Android e iPhone sem precisar da Play Store ou App Store.' },
  { q: 'É seguro comprar? Como funciona a garantia?', a: 'Totalmente seguro. Você tem 7 dias de garantia incondicional. Se por qualquer motivo não gostar, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.' },
  { q: 'Qual a diferença entre a versão gratuita e a completa?', a: 'A versão gratuita inclui os primeiros capítulos para você experimentar. A versão completa desbloqueia toda a jornada: 30+ capítulos, todos os mini-games, modo multiplayer, finais alternativos e atualizações futuras.' },
  { q: 'Quantas vezes posso jogar?', a: 'Infinitas! O jogo foi projetado para rejogabilidade. Com eventos aleatórios, escolhas ramificadas e múltiplos finais, cada jogada é uma experiência diferente.' },
  { q: 'É adequado para crianças e adolescentes?', a: 'Sim! O conteúdo é 100% baseado na obra clássica de John Bunyan. É ideal para jovens, grupos de jovens, escolas dominicais e famílias. Classificação livre.' },
  { q: 'Posso jogar com meu grupo de jovens da igreja?', a: 'Absolutamente! O modo presencial foi feito exatamente para isso. Reúna até 6 pessoas, cada um com seu personagem, e vivam a jornada juntos como um RPG de tabuleiro digital.' },
  { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos PIX, cartão de crédito (até 12x), cartão de débito, e pagamento híbrido (PIX + cartão). Processamento 100% seguro.' },
];

/* ═══════════════════════════════════════════════════════════
   CTA BUTTON
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

const SectionDivider = () => (
  <div className="flex items-center justify-center py-4">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
    <Sparkles className="w-4 h-4 text-primary/40 mx-3" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   CINEMATIC IMAGE SECTION
   ═══════════════════════════════════════════════════════════ */
const CinematicImage = ({ src, alt, caption, subcaption, rotate = 0 }: {
  src: string; alt: string; caption: string; subcaption?: string; rotate?: number;
}) => (
  <div
    className="relative rounded-2xl overflow-hidden"
    style={{
      transform: `perspective(1000px) rotateY(${rotate}deg) rotateX(1deg)`,
      boxShadow: '0 0 30px hsl(40 70% 50% / 0.2), 0 20px 60px rgba(0,0,0,0.5)',
    }}
  >
    <img src={src} alt={alt} className="w-full" loading="lazy" width={1280} height={720} />
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
      <p className="font-display text-lg text-foreground font-bold">{caption}</p>
      {subcaption && <p className="text-sm text-foreground/70 mt-1">{subcaption}</p>}
    </div>
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

      {/* ══════════ STICKY TOP BAR — URGENCY ══════════ */}
      <div
        className="sticky top-0 z-50 flex items-center justify-center gap-3 px-4 py-2.5 border-b border-destructive/20"
        style={{
          background: 'linear-gradient(90deg, hsl(0 60% 12%), hsl(0 50% 8%), hsl(0 60% 12%))',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px hsl(0 60% 50% / 0.1)',
        }}
      >
        <Timer className="w-4 h-4 text-destructive animate-pulse flex-shrink-0" />
        <span className="text-xs text-destructive/90 font-display font-bold uppercase tracking-wider">
          Oferta expira em
        </span>
        <CountdownTimer compact />
        <button
          onClick={handleBuy}
          className="ml-2 px-3 py-1 text-xs font-display font-bold rounded-lg bg-primary text-primary-foreground border border-primary/60 flex-shrink-0"
          style={{ boxShadow: '0 0 10px hsl(40 70% 50% / 0.3)' }}
        >
          GARANTIR
        </button>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-5 py-16 text-center overflow-hidden">
        {/* Background — more visible */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="Jornada do Peregrino" className="w-full h-full object-cover opacity-60" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div
            className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10"
            style={{ boxShadow: '0 0 20px hsl(40 70% 50% / 0.2)' }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-display font-bold flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" /> Jornada Interativa Épica
            </span>
          </div>

          <h1
            className="font-display text-4xl md:text-6xl text-foreground leading-[1.1] font-bold"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 40px hsl(40 70% 50% / 0.3)' }}
          >
            Viva a Maior Batalha<br />
            <span className="text-primary">Espiritual</span> de Todos os Tempos
          </h1>

          <p
            className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-lg mx-auto font-body"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
          >
            A obra-prima de <strong>John Bunyan</strong> transformada em uma experiência interativa
            que vai <em>desafiar sua fé, provocar suas emoções</em> e mudar sua perspectiva para sempre.
          </p>

          <p className="text-sm text-primary font-display tracking-wide" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            ⚔️ Mais de 30 capítulos · 9 tipos de desafios · Múltiplos finais
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <CtaButton onClick={handleBuy} variant="primary">
              <Crown className="w-5 h-5" />
              Adquirir — R$147/ano
            </CtaButton>
            <CtaButton onClick={() => navigate('/')} variant="secondary">
              <Play className="w-5 h-5" />
              Experimentar Grátis
            </CtaButton>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-foreground/70" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Garantia 7 dias</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Instale no celular</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Pagamento seguro</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-primary/50" />
        </div>
      </section>

      {/* ══════════ CINEMATIC IMAGES ══════════ */}
      <section className="px-5 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <CinematicImage
              src={battleImg}
              alt="Batalha contra Apolião"
              caption="⚔️ Enfrente Apolião"
              subcaption="O terrível demônio que bloqueia o Vale da Humilhação"
              rotate={-2}
            />
            <CinematicImage
              src={giantImg}
              alt="Gigante Desespero"
              caption="👹 Gigante Desespero"
              subcaption="Prisioneiro no Castelo da Dúvida — você consegue escapar?"
              rotate={2}
            />
          </div>
          <CinematicImage
            src={journeyImg}
            alt="A Jornada"
            caption="🌉 A Travessia do Rio da Morte"
            subcaption="O último e mais difícil desafio. Seus atributos determinam o desfecho."
          />
        </div>
      </section>

      <SectionDivider />

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

          <p className="text-base text-foreground/70 font-body max-w-lg mx-auto">
            Não é apenas um jogo. É uma <strong className="text-primary">experiência narrativa completa</strong> que transforma
            a maior alegoria cristã de todos os tempos em algo que você <em>vive, sente e nunca esquece</em>.
          </p>

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

      {/* ══════════ PHONE MOCKUP TOUR ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Veja por Dentro</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            Um tour <span className="text-primary">real</span> pelo app
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Assista o app funcionando — cada tela mostra uma parte da experiência completa
          </p>

          <PhoneMockupTour />

          <p className="text-xs text-muted-foreground italic">Tour automático — aguarde para ver todas as telas</p>
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
              { icon: <BookOpen className="w-6 h-6" />, title: 'Narrativa Interativa', desc: 'A história de O Peregrino ganha vida através de escolhas que você faz. Cada decisão altera seus 4 atributos — Fé, Perseverança, Discernimento e Coragem — e determina qual caminho você seguirá.' },
              { icon: <Swords className="w-6 h-6" />, title: 'Duelos Espirituais', desc: 'Enfrente Apolião, o Gigante Desespero e outros inimigos usando a Armadura de Deus: Espada (ataque), Escudo (defesa) e Oração (poder espiritual) em combates estratégicos.' },
              { icon: <Gamepad2 className="w-6 h-6" />, title: '9 Tipos de Mini-Games', desc: 'Reflexos rápidos (QTE), esquiva de tentações, memória bíblica, furtividade, caça ao tesouro, duelo de dados, puzzles de escrituras e muito mais.' },
              { icon: <Users className="w-6 h-6" />, title: 'Modo Multiplayer', desc: 'Jogue online com amigos ou reúna o grupo presencialmente. Um tabuleiro digital premium com dados 3D, eventos coletivos e chat.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Sistema de Combo', desc: 'Sequências de boas escolhas ativam combos que amplificam suas recompensas. Mantenha a série e veja seus atributos dispararem.' },
              { icon: <Eye className="w-6 h-6" />, title: 'Efeitos Visuais e Atmosféricos', desc: 'Partículas de fogo, chuva, luz sagrada. Efeitos de câmera como terremoto e brilho divino em momentos críticos da história.' },
              { icon: <Map className="w-6 h-6" />, title: 'Funciona 100% Offline', desc: 'Instale no celular como app (PWA). Todo conteúdo funciona sem internet. Ideal para viagens, retiros e qualquer lugar.' },
              { icon: <Star className="w-6 h-6" />, title: 'Rejogabilidade Infinita', desc: 'Eventos aleatórios, variações narrativas e múltiplos finais garantem que cada jogada seja uma experiência nova e surpreendente.' },
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
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
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

          <div className="flex items-center justify-center gap-6 pt-6">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'O Peregrino — Jornada Interativa', text: 'Viva a maior batalha espiritual de todos os tempos!', url: window.location.href });
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
