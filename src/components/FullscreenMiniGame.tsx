import { useState, useEffect } from 'react';
import { MiniGame, MiniGameConfig, MiniGameResult } from '@/components/MiniGames';
import { sceneImages } from '@/data/sceneImages';
import { Dice3D } from '@/components/Dice3D';
import { ArrowLeft, Zap, Shield, Flame, Star, Swords, Heart } from 'lucide-react';

/**
 * Fullscreen immersive mini-game wrapper
 * Used for major games: diceduel, pathchoice, wordpuzzle, treasure
 * Shows themed background, cinematic intro, large UI elements
 */

// Which game types get fullscreen treatment
export const FULLSCREEN_GAMES = new Set(['diceduel', 'pathchoice', 'wordpuzzle', 'treasure']);

interface FullscreenMiniGameProps {
  config: MiniGameConfig;
  chapterId: string;
  onComplete: (result: MiniGameResult) => void;
  onSkip?: () => void;
  characterPortraits?: { id: string; name: string; img: string }[];
}

const GAME_THEMES: Record<string, {
  title: string;
  icon: string;
  gradient: string;
  overlayColor: string;
  accentGlow: string;
}> = {
  diceduel: {
    title: 'Duelo Espiritual',
    icon: '⚔️',
    gradient: 'linear-gradient(180deg, hsl(0 40% 8% / 0.85) 0%, hsl(0 30% 5% / 0.95) 100%)',
    overlayColor: 'hsl(0 50% 15% / 0.3)',
    accentGlow: 'hsl(0 60% 50% / 0.15)',
  },
  pathchoice: {
    title: 'Caminho da Fé',
    icon: '🗺️',
    gradient: 'linear-gradient(180deg, hsl(30 40% 8% / 0.85) 0%, hsl(25 30% 5% / 0.95) 100%)',
    overlayColor: 'hsl(30 50% 15% / 0.3)',
    accentGlow: 'hsl(40 60% 50% / 0.15)',
  },
  wordpuzzle: {
    title: 'Puzzle das Escrituras',
    icon: '📖',
    gradient: 'linear-gradient(180deg, hsl(220 40% 8% / 0.85) 0%, hsl(210 30% 5% / 0.95) 100%)',
    overlayColor: 'hsl(220 50% 15% / 0.3)',
    accentGlow: 'hsl(220 60% 50% / 0.15)',
  },
  treasure: {
    title: 'Caça ao Tesouro',
    icon: '🔍',
    gradient: 'linear-gradient(180deg, hsl(40 40% 8% / 0.85) 0%, hsl(35 30% 5% / 0.95) 100%)',
    overlayColor: 'hsl(40 50% 20% / 0.3)',
    accentGlow: 'hsl(40 70% 50% / 0.15)',
  },
};

export function FullscreenMiniGame({ config, chapterId, onComplete, onSkip, characterPortraits }: FullscreenMiniGameProps) {
  const [phase, setPhase] = useState<'cinematic' | 'playing' | 'done'>('cinematic');
  const [fadeIn, setFadeIn] = useState(false);
  const [result, setResult] = useState<MiniGameResult | null>(null);

  const bgImage = sceneImages[chapterId] || '';
  const theme = GAME_THEMES[config.type] || GAME_THEMES.diceduel;
  const leadPortrait = characterPortraits?.[0];
  const supportPortrait = characterPortraits?.[1];

  useEffect(() => {
    requestAnimationFrame(() => setFadeIn(true));
  }, []);

  // Auto-advance cinematic intro
  useEffect(() => {
    if (phase === 'cinematic') {
      const t = setTimeout(() => setPhase('playing'), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleComplete = (res: MiniGameResult) => {
    setResult(res);
    setPhase('done');
    // Delay before passing back to scene
    setTimeout(() => onComplete(res), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.4) saturate(0.8)',
            }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: theme.gradient }} />
        
        {/* Animated particles/glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: 3 + Math.random() * 4,
                height: 3 + Math.random() * 4,
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 90}%`,
                background: theme.accentGlow,
                boxShadow: `0 0 ${8 + Math.random() * 12}px ${theme.accentGlow}`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.7) 100%)',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          {onSkip && phase !== 'done' && (
            <button
              onClick={onSkip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-95"
              style={{
                background: 'hsl(0 0% 0% / 0.4)',
                border: '1px solid hsl(0 0% 100% / 0.1)',
                color: 'hsl(0 0% 70%)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-display">Pular</span>
            </button>
          )}
          <div className="flex-1" />
          {config.difficulty && (
            <div
              className="px-2.5 py-1 rounded-lg text-[10px] font-display uppercase tracking-wider"
              style={{
                background: config.difficulty === 'hard'
                  ? 'hsl(0 50% 30% / 0.5)'
                  : config.difficulty === 'normal'
                  ? 'hsl(40 50% 30% / 0.5)'
                  : 'hsl(120 40% 25% / 0.5)',
                color: config.difficulty === 'hard'
                  ? 'hsl(0 60% 70%)'
                  : config.difficulty === 'normal'
                  ? 'hsl(40 70% 70%)'
                  : 'hsl(120 50% 65%)',
                border: `1px solid ${
                  config.difficulty === 'hard'
                    ? 'hsl(0 40% 40% / 0.5)'
                    : config.difficulty === 'normal'
                    ? 'hsl(40 40% 40% / 0.5)'
                    : 'hsl(120 30% 35% / 0.5)'
                }`,
              }}
            >
              {config.difficulty === 'hard' ? '🔥 Difícil' : config.difficulty === 'normal' ? '⚡ Normal' : '✨ Fácil'}
            </div>
          )}
        </div>

        {/* Cinematic intro */}
        {phase === 'cinematic' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6 animate-fade-in">
            {/* Floating icon */}
            <div
              className="text-7xl"
              style={{
                filter: `drop-shadow(0 0 30px ${theme.accentGlow})`,
                animation: 'float 2s ease-in-out infinite',
              }}
            >
              {theme.icon}
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2
                className="font-display text-3xl tracking-wide"
                style={{
                  color: 'hsl(0 0% 95%)',
                  textShadow: `0 0 40px ${theme.accentGlow}, 0 2px 10px hsl(0 0% 0% / 0.8)`,
                }}
              >
                {theme.title}
              </h2>
              {config.duelEnemy && (
                <p className="font-display text-lg" style={{ color: 'hsl(0 60% 65%)' }}>
                  vs. {config.duelEnemy.emoji} {config.duelEnemy.name}
                </p>
              )}
            </div>

            {/* Intro text */}
            <p
              className="text-sm text-center leading-relaxed max-w-xs"
              style={{ color: 'hsl(0 0% 75%)' }}
            >
              {config.intro}
            </p>

            {/* Loading dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: 'hsl(40 60% 55%)',
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            {/* Skip intro button */}
            <button
              onClick={() => setPhase('playing')}
              className="text-xs font-display px-4 py-2 rounded-lg transition-all active:scale-95"
              style={{
                color: 'hsl(0 0% 60%)',
                background: 'hsl(0 0% 100% / 0.05)',
                border: '1px solid hsl(0 0% 100% / 0.1)',
              }}
            >
              Pular intro →
            </button>
          </div>
        )}

        {/* Game area */}
        {phase === 'playing' && (
          <div className="flex-1 flex flex-col px-3 pb-4 pt-2 animate-fade-in overflow-y-auto">
            <MiniGame config={config} onComplete={handleComplete} />
          </div>
        )}

        {/* Result overlay */}
        {phase === 'done' && result && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6 animate-scale-in">
            {/* Big result icon */}
            <div
              className="text-8xl"
              style={{
                filter: result.success
                  ? 'drop-shadow(0 0 40px hsl(40 70% 50% / 0.6))'
                  : 'drop-shadow(0 0 30px hsl(0 60% 50% / 0.4))',
                animation: 'float 2s ease-in-out infinite',
              }}
            >
              {result.success ? '🏆' : '💔'}
            </div>

            <h2
              className="font-display text-2xl text-center"
              style={{
                color: result.success ? 'hsl(40 70% 70%)' : 'hsl(0 50% 65%)',
                textShadow: '0 2px 10px hsl(0 0% 0% / 0.8)',
              }}
            >
              {result.success ? 'Vitória!' : 'Não desta vez...'}
            </h2>

            {/* Score bar */}
            <div className="w-full max-w-xs space-y-2">
              <div
                className="h-4 rounded-full overflow-hidden"
                style={{ background: 'hsl(0 0% 15%)', border: '1px solid hsl(0 0% 25%)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${result.score}%`,
                    background: result.success
                      ? 'linear-gradient(90deg, hsl(40 60% 45%), hsl(40 70% 55%))'
                      : 'linear-gradient(90deg, hsl(0 50% 35%), hsl(0 60% 45%))',
                  }}
                />
              </div>
              <p className="text-center text-sm font-display" style={{ color: 'hsl(0 0% 60%)' }}>
                Pontuação: {result.score}%
              </p>
            </div>

            {/* Attribute changes */}
            <div className="flex gap-3 flex-wrap justify-center">
              {Object.entries(result.effects).map(([key, val]) => {
                if (!val) return null;
                const labels: Record<string, { label: string; emoji: string }> = {
                  fe: { label: 'Fé', emoji: '🔥' },
                  perseveranca: { label: 'Perseverança', emoji: '⛰️' },
                  discernimento: { label: 'Discernimento', emoji: '👁️' },
                  coragem: { label: 'Coragem', emoji: '🛡️' },
                };
                const attr = labels[key];
                if (!attr) return null;
                return (
                  <span
                    key={key}
                    className="px-3 py-1.5 rounded-lg text-sm font-display"
                    style={{
                      background: val > 0 ? 'hsl(120 30% 15% / 0.6)' : 'hsl(0 30% 15% / 0.6)',
                      color: val > 0 ? 'hsl(120 50% 65%)' : 'hsl(0 50% 65%)',
                      border: `1px solid ${val > 0 ? 'hsl(120 30% 30%)' : 'hsl(0 30% 30%)'}`,
                    }}
                  >
                    {attr.emoji} {attr.label} {val > 0 ? `+${val}` : val}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CSS for float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
