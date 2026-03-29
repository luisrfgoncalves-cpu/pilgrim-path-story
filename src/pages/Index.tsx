import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { useCloudSync } from '@/hooks/useCloudSync';
import { getChapter, storyChapters } from '@/data/story';
import { getPart2Chapter, part2Chapters } from '@/data/storyPart2';
import { useTheme } from '@/contexts/ThemeContext';
import { getStreak, getDashboardMessage } from '@/lib/gameLoop';
// progressBackup removed — auto-save handles persistence
import PilgrimAvatar from '@/components/PilgrimAvatar';
import SplashScreen from '@/components/SplashScreen';
import Onboarding from '@/components/Onboarding';
import GameNotification from '@/components/GameNotification';
import { ChevronRight, Sparkles, RotateCcw, Map, Users, Flame, Swords, BookOpen, Home, Sun, Moon } from 'lucide-react';
import { Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { hasProgress, startJourney, resetProgress, progress, history, isReplay, loadFromCloud } = useStoryProgress();
  const { theme, toggleTheme } = useTheme();
  useCloudSync(loadFromCloud);

  // ── PWA Install Banner ──
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const alreadyInstalled = isStandalone || localStorage.getItem('pwa_installed') === '1';

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      if (!alreadyInstalled) setShowInstallBanner(true);
    };

    const onAppInstalled = () => {
      localStorage.setItem('pwa_installed', '1');
      setShowInstallBanner(false);
      setInstallPrompt(null);
      sessionStorage.setItem('install_banner_dismissed', '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    if (isStandalone) {
      localStorage.setItem('pwa_installed', '1');
    } else if (!alreadyInstalled && !sessionStorage.getItem('install_banner_dismissed')) {
      const timeout = window.setTimeout(() => {
        if (isMobile) setShowInstallBanner(true);
      }, 3000);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.removeEventListener('appinstalled', onAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [alreadyInstalled, isIOS, isMobile, isStandalone]);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }

    if (isMobile) {
      setShowInstallInstructions(true);
      return;
    }

    toast.info('Para instalar de verdade no Android, use o Chrome e toque em "Instalar aplicativo".');
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('install_banner_dismissed', '1');
  };

  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem('splash_seen');
    return !seen;
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('peregrino-onboarding-done');
  });

  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('splash_seen', '1');
  }, []);

  const handleBackToSplash = useCallback(() => {
    sessionStorage.removeItem('splash_seen');
    setShowSplash(true);
  }, []);

  const streak = useMemo(() => getStreak(), []);
  const [streakShown, setStreakShown] = useState(false);

  useEffect(() => {
    if (streak.isNewDay && streak.days >= 2 && !showSplash) {
      setStreakShown(true);
      // GameNotification handles auto-dismiss
    }
  }, [streak, showSplash]);

  const handleContinue = () => { startJourney(); navigate('/cena'); };
  const handleNewJourney = (campaign: 'part1' | 'part2' = 'part1') => {
    resetProgress(campaign); startJourney(); navigate('/cena');
  };

  const isPart2 = progress.campaign === 'part2';
  const currentChapter = isPart2 ? getPart2Chapter(progress.currentChapterId) : getChapter(progress.currentChapterId);
  const totalChapters = isPart2 ? Object.keys(part2Chapters).length : Object.keys(storyChapters).length;
  const progressPercent = Math.round((progress.visitedChapters.length / totalChapters) * 100);

  const currentPhase = useMemo(() => {
    const id = progress.currentChapterId;
    if (id.startsWith('fase6') || id.startsWith('final')) return { num: 6, name: 'O Rio e a Cidade Celestial' };
    if (id.startsWith('fase5')) return { num: 5, name: 'O Castelo da Dúvida' };
    if (id.startsWith('fase4')) return { num: 4, name: 'A Feira da Vaidade' };
    if (id.startsWith('fase3')) return { num: 3, name: 'O Vale da Sombra' };
    if (id.startsWith('fase2')) return { num: 2, name: 'O Caminho Estreito' };
    return { num: 1, name: 'A Partida' };
  }, [progress.currentChapterId]);

  const dashboardMsg = useMemo(() =>
    getDashboardMessage(progress.attributes, progress.choicesMade, currentPhase.num, progress.playthrough),
    [progress.attributes, progress.choicesMade, currentPhase.num, progress.playthrough]
  );

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashDone} />;
  }

  if (showOnboarding && !hasProgress) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Install Banner */}
      {showInstallBanner && (
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 border-b border-primary/20 bg-card">
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-xs text-foreground/90 font-display font-bold truncate">
              Instale o App no seu celular!
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleInstall} className="px-3 py-1.5 text-xs font-display font-bold rounded-lg bg-primary text-primary-foreground border border-primary/60">
              INSTALAR
            </button>
            <button onClick={dismissInstallBanner} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Install Instructions Modal */}
      {showInstallInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6" onClick={() => setShowInstallInstructions(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-primary/30 bg-card p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg text-foreground font-bold">Instalar o App</h3>
            </div>
            {isIOS ? (
              <div className="space-y-3 text-sm text-foreground/80">
                <p className="font-display text-primary text-xs uppercase tracking-wider">No iPhone / iPad:</p>
                <div className="flex items-start gap-3"><span className="text-primary font-bold">1.</span><p>Toque no ícone de <strong className="text-foreground">Compartilhar</strong> (quadrado com seta para cima) na barra do Safari</p></div>
                <div className="flex items-start gap-3"><span className="text-primary font-bold">2.</span><p>Role para baixo e toque em <strong className="text-foreground">"Adicionar à Tela de Início"</strong></p></div>
                <div className="flex items-start gap-3"><span className="text-primary font-bold">3.</span><p>Toque em <strong className="text-foreground">"Adicionar"</strong></p></div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-foreground/80">
                <p className="font-display text-primary text-xs uppercase tracking-wider">No Android:</p>
                <div className="flex items-start gap-3"><span className="text-primary font-bold">1.</span><p>Toque no menu <strong className="text-foreground">⋮</strong> (três pontos) no Chrome</p></div>
                <div className="flex items-start gap-3"><span className="text-primary font-bold">2.</span><p>Toque em <strong className="text-foreground">"Instalar aplicativo"</strong> (não use “Adicionar à tela inicial”)</p></div>
                <div className="flex items-start gap-3"><span className="text-primary font-bold">3.</span><p>Se não aparecer “Instalar aplicativo”, abra no <strong className="text-foreground">Google Chrome</strong> e tente novamente</p></div>
              </div>
            )}
            <button onClick={() => setShowInstallInstructions(false)} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">Entendi!</button>
          </div>
        </div>
      )}

      {/* Streak toast */}
      <GameNotification visible={streakShown} onDismiss={() => setStreakShown(false)} duration={10000}>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">{streak.message}</span>
        </div>
      </GameNotification>

      {/* Main content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-4">
        <div className="w-full max-w-sm text-center animate-fade-in space-y-4">

          {/* Phase indicator */}
          {hasProgress && (
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              {isPart2 ? 'Parte II · ' : ''}Fase {currentPhase.num} · {currentPhase.name}
              {isReplay && <span className="text-primary/60 ml-2">· Jogada {progress.playthrough}</span>}
            </p>
          )}

          {/* Avatar — large and prominent */}
          <PilgrimAvatar
            attributes={hasProgress ? progress.attributes : { fe: 3, perseveranca: 3, discernimento: 3, coragem: 3 }}
            tone={hasProgress ? undefined : 'heavy'}
            size="lg"
            showLabel
            className="mx-auto"
            campaign={hasProgress ? progress.campaign : 'part1'}
          />

          {/* Title + location */}
          <div>
            <h1 className="font-display text-2xl text-foreground leading-tight">
              {hasProgress && currentChapter ? currentChapter.title : 'O Peregrino'}
            </h1>
            {hasProgress && currentChapter && (
              <p className="text-xs text-muted-foreground mt-1">{currentChapter.location}</p>
            )}
          </div>

          {/* Dashboard message */}
          {hasProgress && (
            <p className="text-xs text-muted-foreground italic px-2">{dashboardMsg}</p>
          )}

          {/* Compact progress + stats row */}
          {hasProgress && (
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{progressPercent}%</span>
                <div className="flex items-center gap-3">
                  {streak.days >= 2 && (
                    <span className="flex items-center gap-0.5 text-primary">
                      <Flame className="w-3 h-3" />{streak.days}
                    </span>
                  )}
                  <span className="flex gap-1.5">
                    🔥{progress.attributes.fe}
                    ⛰️{progress.attributes.perseveranca}
                    👁️{progress.attributes.discernimento}
                    🛡️{progress.attributes.coragem}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions — fixed bottom */}
      <div className="px-5 pb-8 pt-2 w-full max-w-sm mx-auto space-y-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Primary CTA */}
        {hasProgress ? (
          <button onClick={handleContinue} className="btn-medieval w-full flex items-center justify-center gap-3">
            <ChevronRight className="w-6 h-6" />
            Continuar Jornada
          </button>
        ) : (
          <button onClick={() => handleNewJourney()} className="btn-medieval w-full flex items-center justify-center gap-3">
            {history.totalPlaythroughs > 0
              ? <><RotateCcw className="w-6 h-6" />Nova Jornada</>
              : <><Sparkles className="w-6 h-6" />Parte I — O Peregrino</>
            }
          </button>
        )}

        {/* Part II */}
        <button onClick={() => handleNewJourney('part2')} className="btn-medieval-secondary w-full flex items-center justify-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          Parte II — A Peregrina
        </button>

        {/* Nav grid */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={handleBackToSplash} className="btn-medieval-icon flex flex-col items-center justify-center gap-1 h-16 overflow-hidden">
            <Home className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-[10px] text-primary font-display leading-tight truncate w-full text-center">Início</span>
          </button>
          <button onClick={() => navigate('/jornada')} className="btn-medieval-icon flex flex-col items-center justify-center gap-1 h-16 overflow-hidden">
            <Map className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground font-display leading-tight truncate w-full text-center">Mapa</span>
          </button>
          <button onClick={() => navigate('/multiplayer')} className="btn-medieval-icon flex flex-col items-center justify-center gap-1 h-16 overflow-hidden !border-primary/30">
            <Swords className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-[10px] text-primary font-display leading-tight truncate w-full text-center">Múltiplo</span>
          </button>
          <button onClick={() => navigate('/comunidade')} className="btn-medieval-icon flex flex-col items-center justify-center gap-1 h-16 overflow-hidden">
            <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground font-display leading-tight truncate w-full text-center">Social</span>
          </button>
        </div>

        {/* Theme toggle */}
        <div className="flex justify-center">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Restart */}
        {hasProgress && (
          <button onClick={() => handleNewJourney(progress.campaign || 'part1')} className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors pt-1">
            Recomeçar do início
          </button>
        )}

        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button onClick={() => navigate('/termos')} className="px-4 py-2 text-[10px] text-muted-foreground hover:text-foreground border border-border rounded-lg bg-card hover:border-primary/30 transition-all font-display whitespace-nowrap">
            Políticas e Termos
          </button>
          <button onClick={() => navigate('/landing')} className="px-4 py-2 text-[10px] text-muted-foreground hover:text-foreground border border-border rounded-lg bg-card hover:border-primary/30 transition-all font-display whitespace-nowrap">
            Sobre o aplicativo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
