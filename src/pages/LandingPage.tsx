import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ChevronRight, ChevronDown, BookOpen, Users, Star, Shield, Flame, Zap,
  Share2, Smartphone, Clock, Check, X, CreditCard, QrCode,
  Swords, Gamepad2, Brain, Eye, Heart, Crown, Map, Trophy, Lock,
  Play, Award, Timer, Target, Compass, ArrowRight, MessageCircle, Gift
} from 'lucide-react';

// ── IMAGENS REAIS DO APP ──
import cidadeDestruicao from '@/assets/scenes/cidade-destruicao.jpg';
import valeHumilhacao from '@/assets/scenes/vale-humilhacao.jpg';
import feiraVaidade from '@/assets/scenes/feira-vaidade.jpg';
import casteloDuvida from '@/assets/scenes/castelo-duvida.jpg';
import cidadeCelestial from '@/assets/scenes/cidade-celestial.jpg';
import cruzFardo from '@/assets/scenes/cruz-fardo.jpg';
import valeSombra from '@/assets/scenes/vale-sombra.jpg';
import casaInterprete from '@/assets/scenes/casa-interprete.jpg';
import palacioBelo from '@/assets/scenes/palacio-belo.jpg';
import montanhasDeleitosas from '@/assets/scenes/montanhas-deleitosas.jpg';
import rioFinal from '@/assets/scenes/rio-final.jpg';
import portaoEstreito from '@/assets/scenes/portao-estreito.jpg';
import pantanoDesanimo from '@/assets/scenes/pantano-desanimo.jpg';
import giganteMataBons from '@/assets/scenes/gigante-mata-bons.jpg';
import julgamentoFeira from '@/assets/scenes/julgamento-feira.jpg';

// Personagens reais
import cristao from '@/assets/characters/cristao.jpg';
import apolion from '@/assets/characters/apolion.jpg';
import giganteDesespero from '@/assets/characters/gigante-desespero.jpg';
import evangelista from '@/assets/characters/evangelista.jpg';
import fiel from '@/assets/characters/fiel.jpg';
import esperanca from '@/assets/characters/esperanca.jpg';
import crista from '@/assets/characters/crista.jpg';
import valentePelaVerdade from '@/assets/characters/valente-pela-verdade.jpg';

import sealImg from '@/assets/medieval-seal.png';
import logoImg from '@/assets/logo-peregrino.png';
import pilgrimStanding from '@/assets/pilgrim-standing.png';

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
   PHONE MOCKUP — SHOWS THE REAL APP VIA IFRAME
   Auto-navigates through real app routes.
   User can pause and manually pick a screen.
   ═══════════════════════════════════════════════════════════ */

const MockScreen = ({ id }: { id: number }) => {
  const screens: Record<number, React.ReactNode> = {
    0: (
      <div className="flex flex-col items-center justify-center h-full" style={{ background: 'radial-gradient(ellipse at center, #1a1440 0%, #0c0a14 100%)' }}>
        <div className="text-4xl mb-2">⚔️</div>
        <p className="font-display text-lg font-bold" style={{ color: '#d4a44a' }}>O Peregrino</p>
        <p className="text-[10px] mt-1" style={{ color: '#a89060' }}>A Jornada Interativa</p>
        <div className="mt-4 w-20 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #d4a44a, transparent)' }} />
      </div>
    ),
    1: (
      <div className="flex flex-col h-full p-3 gap-2" style={{ background: 'linear-gradient(180deg, #12101e 0%, #0c0a14 100%)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #d4a44a, #8b6914)' }} />
          <div><p className="text-[10px] font-bold" style={{ color: '#d4a44a' }}>Cristão</p><p className="text-[8px]" style={{ color: '#888' }}>Nível 5</p></div>
        </div>
        {['Fé', 'Coragem', 'Sabedoria', 'Resistência'].map((attr, i) => (
          <div key={attr} className="flex items-center gap-1.5">
            <span className="text-[8px] w-12" style={{ color: '#a89060' }}>{attr}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1a1630' }}>
              <div className="h-full rounded-full" style={{ width: `${60 + i * 10}%`, background: `linear-gradient(90deg, #d4a44a, ${i % 2 === 0 ? '#e8c547' : '#c4943a'})`, boxShadow: '0 0 6px #d4a44a88' }} />
            </div>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {['📖 Jornada', '⚔️ Duelos', '🗺️ Mapa'].map(item => (
            <div key={item} className="rounded-lg p-2 text-center text-[8px] font-bold" style={{ background: 'linear-gradient(145deg, #1e1a30, #14122a)', border: '1px solid #d4a44a33', color: '#d4a44a', boxShadow: '0 0 8px #d4a44a22' }}>{item}</div>
          ))}
        </div>
        <div className="mt-auto rounded-lg p-2" style={{ background: '#1a1630', border: '1px solid #d4a44a22' }}>
          <p className="text-[8px]" style={{ color: '#d4a44a' }}>📍 Próxima Cena</p>
          <p className="text-[9px] font-bold" style={{ color: '#eee' }}>O Vale da Sombra da Morte</p>
        </div>
      </div>
    ),
    2: (
      <div className="flex flex-col h-full" style={{ background: '#0c0a14' }}>
        <div className="h-[45%] relative" style={{ background: 'linear-gradient(180deg, #2a1a10 0%, #1a1040 60%, #0c0a14 100%)' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl">🏰</div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 rounded-lg p-1.5" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <p className="text-[8px] font-bold" style={{ color: '#d4a44a' }}>Capítulo 3</p>
            <p className="text-[10px] font-bold" style={{ color: '#eee' }}>A Cidade da Destruição</p>
          </div>
        </div>
        <div className="flex-1 p-3">
          <p className="text-[9px] leading-relaxed" style={{ color: '#ccc' }}>Cristão olhou ao redor da cidade onde nascera. Havia algo diferente no ar — uma urgência que não podia mais ignorar...</p>
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="rounded-lg p-2 text-[8px] font-bold" style={{ background: 'linear-gradient(90deg, #d4a44a22, #d4a44a11)', border: '1px solid #d4a44a44', color: '#d4a44a' }}>⚡ Fugir imediatamente</div>
            <div className="rounded-lg p-2 text-[8px] font-bold" style={{ background: 'linear-gradient(90deg, #d4a44a11, #d4a44a08)', border: '1px solid #d4a44a22', color: '#a89060' }}>🗣️ Tentar convencer a família</div>
          </div>
        </div>
      </div>
    ),
    3: (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-4" style={{ background: 'radial-gradient(ellipse at center, #2a1020 0%, #0c0a14 100%)' }}>
        <p className="text-[10px] font-bold" style={{ color: '#ff6666' }}>⚔️ DUELO ÉPICO</p>
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="text-center"><div className="text-2xl">🛡️</div><p className="text-[8px] font-bold mt-1" style={{ color: '#d4a44a' }}>Cristão</p><div className="w-16 h-1.5 rounded-full mt-1" style={{ background: '#1a1630' }}><div className="h-full rounded-full" style={{ width: '70%', background: '#4ade80', boxShadow: '0 0 6px #4ade8088' }} /></div></div>
          <div className="text-lg font-bold" style={{ color: '#ff4444' }}>VS</div>
          <div className="text-center"><div className="text-2xl">👹</div><p className="text-[8px] font-bold mt-1" style={{ color: '#ff6666' }}>Apolião</p><div className="w-16 h-1.5 rounded-full mt-1" style={{ background: '#1a1630' }}><div className="h-full rounded-full" style={{ width: '85%', background: '#ef4444', boxShadow: '0 0 6px #ef444488' }} /></div></div>
        </div>
        <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a44a, #8b6914)', boxShadow: '0 0 20px #d4a44a66' }}>
          <span className="text-2xl font-bold text-white">🎲</span>
        </div>
        <p className="text-[8px]" style={{ color: '#888' }}>Toque para rolar os dados</p>
      </div>
    ),
    4: (
      <div className="flex flex-col h-full p-3" style={{ background: 'linear-gradient(180deg, #0f1a0f 0%, #0c0a14 100%)' }}>
        <p className="text-[10px] font-bold mb-2" style={{ color: '#4ade80' }}>🗺️ Mapa da Jornada</p>
        <div className="flex-1 flex flex-col gap-1">
          {['Cidade da Destruição', 'Pântano do Desânimo', 'Portão Estreito', 'Casa do Intérprete', 'Vale da Humilhação', 'Vale da Sombra', 'Feira das Vaidades', 'Castelo da Dúvida', 'Montanhas Deleitosas', 'Cidade Celestial'].map((loc, i) => (
            <div key={loc} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex items-center justify-center text-[6px]" style={{ background: i < 5 ? '#4ade80' : i === 5 ? '#d4a44a' : '#333', boxShadow: i === 5 ? '0 0 8px #d4a44a88' : 'none' }}>{i < 5 ? '✓' : i === 5 ? '▶' : ''}</div>
              <div className="h-px flex-1" style={{ background: i < 5 ? '#4ade8044' : '#333' }} />
              <span className="text-[7px]" style={{ color: i < 5 ? '#4ade80' : i === 5 ? '#d4a44a' : '#555' }}>{loc}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center"><p className="text-[8px]" style={{ color: '#d4a44a' }}>50% concluído</p></div>
      </div>
    ),
    5: (
      <div className="flex flex-col h-full p-3" style={{ background: 'linear-gradient(180deg, #1a1040 0%, #0c0a14 100%)' }}>
        <p className="text-[10px] font-bold mb-2" style={{ color: '#a78bfa' }}>🎮 Multiplayer Online</p>
        <div className="rounded-xl p-2 mb-2" style={{ background: '#1e1a30', border: '1px solid #a78bfa33' }}>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {['🟢 João', '🟢 Maria', '🟡 Pedro', '🔴 Ana'].map(p => (
              <div key={p} className="text-center"><div className="w-6 h-6 rounded-full mx-auto mb-0.5" style={{ background: '#2a2640' }} /><p className="text-[6px]" style={{ color: '#a78bfa' }}>{p}</p></div>
            ))}
          </div>
          <div className="h-20 rounded-lg relative" style={{ background: 'linear-gradient(135deg, #2a1a10 0%, #1a1040 100%)', border: '1px solid #d4a44a22' }}>
            <p className="absolute top-1 left-2 text-[7px]" style={{ color: '#d4a44a' }}>Tabuleiro Premium</p>
            <div className="absolute bottom-1 right-2 text-[7px]" style={{ color: '#4ade80' }}>Vez de João 🎲</div>
          </div>
        </div>
        <div className="rounded-lg p-1.5" style={{ background: '#14122a', border: '1px solid #a78bfa22' }}>
          <p className="text-[7px]" style={{ color: '#888' }}>💬 Chat: "Boa jogada!" — Maria</p>
        </div>
      </div>
    ),
    6: (
      <div className="flex flex-col h-full p-3" style={{ background: 'linear-gradient(180deg, #1a1510 0%, #0c0a14 100%)' }}>
        <p className="text-[10px] font-bold mb-2" style={{ color: '#f59e0b' }}>🏠 Modo Reunidos</p>
        <div className="rounded-xl p-3 text-center mb-2" style={{ background: '#1e1a14', border: '1px solid #f59e0b33' }}>
          <p className="text-3xl mb-1">📱</p>
          <p className="text-[9px] font-bold" style={{ color: '#f59e0b' }}>Jogue Presencialmente</p>
          <p className="text-[7px]" style={{ color: '#888' }}>Até 6 jogadores no mesmo ambiente</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {['Criar Sala', 'Entrar', 'Tutorial'].map(btn => (
            <div key={btn} className="rounded-lg p-2 text-center text-[7px] font-bold" style={{ background: '#d4a44a22', border: '1px solid #d4a44a44', color: '#d4a44a' }}>{btn}</div>
          ))}
        </div>
      </div>
    ),
    7: (
      <div className="flex flex-col h-full p-3 gap-2" style={{ background: 'linear-gradient(180deg, #14101e 0%, #0c0a14 100%)' }}>
        <p className="text-[10px] font-bold" style={{ color: '#d4a44a' }}>👥 Personagens</p>
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          {[{n:'Cristão',e:'🛡️',c:'#d4a44a'},{n:'Evangelista',e:'📖',c:'#60a5fa'},{n:'Fiel',e:'⚔️',c:'#4ade80'},{n:'Esperançoso',e:'🌟',c:'#f59e0b'},{n:'Apolião',e:'👹',c:'#ef4444'},{n:'Gigante Desespero',e:'👊',c:'#8b5cf6'}].map(ch => (
            <div key={ch.n} className="rounded-lg p-2 flex flex-col items-center" style={{ background: '#1a1630', border: `1px solid ${ch.c}33` }}>
              <span className="text-lg">{ch.e}</span>
              <p className="text-[7px] font-bold mt-0.5" style={{ color: ch.c }}>{ch.n}</p>
            </div>
          ))}
        </div>
        <p className="text-[7px] text-center" style={{ color: '#888' }}>40+ personagens com arte original</p>
      </div>
    ),
    8: (
      <div className="flex flex-col h-full p-3" style={{ background: 'linear-gradient(180deg, #10141e 0%, #0c0a14 100%)' }}>
        <p className="text-[10px] font-bold mb-2" style={{ color: '#60a5fa' }}>🙏 Reflexões Espirituais</p>
        <div className="rounded-xl p-3 mb-2" style={{ background: '#1a1e30', border: '1px solid #60a5fa33' }}>
          <p className="text-[8px] italic leading-relaxed" style={{ color: '#bbb' }}>"Porque estreita é a porta, e apertado o caminho que leva à vida, e poucos há que a encontrem."</p>
          <p className="text-[7px] mt-1 text-right" style={{ color: '#60a5fa' }}>— Mateus 7:14</p>
        </div>
        <div className="rounded-lg p-2" style={{ background: '#14182a', border: '1px solid #60a5fa22' }}>
          <p className="text-[7px] font-bold mb-1" style={{ color: '#60a5fa' }}>💭 Reflexão do Dia</p>
          <p className="text-[7px]" style={{ color: '#888' }}>O que significa escolher o caminho estreito na sua vida diária?</p>
        </div>
      </div>
    ),
    9: (
      <div className="flex flex-col items-center justify-center h-full p-4 gap-2" style={{ background: 'radial-gradient(ellipse at center, #1a1a10 0%, #0c0a14 100%)' }}>
        <div className="text-3xl">🏆</div>
        <p className="text-[10px] font-bold" style={{ color: '#d4a44a' }}>Jornada Concluída!</p>
        <div className="w-full grid grid-cols-2 gap-1.5 mt-1">
          {[{l:'Fé',v:'92%'},{l:'Coragem',v:'85%'},{l:'Sabedoria',v:'78%'},{l:'Resistência',v:'88%'}].map(s => (
            <div key={s.l} className="rounded-lg p-1.5 text-center" style={{ background: '#1a1630', border: '1px solid #d4a44a22' }}>
              <p className="text-[7px]" style={{ color: '#888' }}>{s.l}</p>
              <p className="text-[10px] font-bold" style={{ color: '#d4a44a' }}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-lg px-4 py-1.5 text-[8px] font-bold" style={{ background: 'linear-gradient(135deg, #d4a44a, #8b6914)', color: '#fff', boxShadow: '0 0 12px #d4a44a66' }}>Compartilhar Resultado</div>
      </div>
    ),
  };
  return screens[id] || screens[0];
};

const PhoneMockupTour = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeScreen, setActiveScreen] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval>>();

  const screens = [
    { label: 'Splash Screen', desc: 'Tela de abertura do app' },
    { label: 'Dashboard', desc: 'Painel do peregrino' },
    { label: 'Cena Narrativa', desc: 'Escolhas que mudam a história' },
    { label: 'Duelo de Dados', desc: 'Batalhas épicas com dados 3D' },
    { label: 'Mapa da Jornada', desc: 'Progresso na peregrinação' },
    { label: 'Multiplayer Online', desc: 'Tabuleiro premium digital' },
    { label: 'Modo Reunidos', desc: 'Jogue presencialmente' },
    { label: 'Personagens', desc: '40+ personagens bíblicos' },
    { label: 'Reflexões', desc: 'Meditações espirituais' },
    { label: 'Resultado Final', desc: 'Sua jornada completa' },
  ];

  useEffect(() => {
    if (isPaused) return;
    autoRef.current = setInterval(() => {
      setActiveScreen(prev => (prev + 1) % screens.length);
    }, 3500);
    return () => clearInterval(autoRef.current);
  }, [isPaused, screens.length]);

  const goToScreen = (idx: number) => {
    setIsPaused(true);
    setActiveScreen(idx);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Phone frame */}
      <div
        className="relative"
        style={{
          width: 280,
          transform: 'perspective(1200px) rotateY(-4deg) rotateX(2deg)',
        }}
      >
        <div
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{
            aspectRatio: '9/19.5',
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 30%, #111 100%)',
            padding: '8px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 40px hsl(40 70% 50% / 0.2), 0 40px 100px rgba(0,0,0,0.8), -20px 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-[100px] w-[3px] h-8 rounded-l-sm" style={{ background: '#333' }} />
          <div className="absolute -left-[3px] top-[145px] w-[3px] h-12 rounded-l-sm" style={{ background: '#333' }} />
          <div className="absolute -left-[3px] top-[170px] w-[3px] h-12 rounded-l-sm" style={{ background: '#333' }} />
          <div className="absolute -right-[3px] top-[130px] w-[3px] h-16 rounded-r-sm" style={{ background: '#333' }} />

          {/* Screen */}
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0c0a14]">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-[22px] bg-black rounded-full z-30" style={{ boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)' }}>
              <div className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full" style={{ background: 'radial-gradient(circle, #1a3a5c, #0a1a2c)' }} />
            </div>

            {/* Rendered app screen */}
            <div className="absolute inset-0 z-10 transition-opacity duration-500">
              <MockScreen id={activeScreen} />
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-[4px] bg-white/30 rounded-full z-30" />
          </div>
        </div>

        {/* Phone reflection */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-10 rounded-full" style={{ background: 'radial-gradient(ellipse, hsl(40 70% 50% / 0.12), transparent)' }} />
      </div>

      {/* Screen label */}
      <div className="text-center">
        <p className="font-display text-sm text-foreground font-bold">{screens[activeScreen].label}</p>
        <p className="text-xs text-muted-foreground">{screens[activeScreen].desc}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => setIsPaused(p => !p)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary/40 bg-card/80 hover:border-primary/70 transition-all text-sm hover:scale-105"
          style={{ boxShadow: '0 0 20px hsl(40 70% 50% / 0.2), 0 0 40px hsl(40 70% 50% / 0.08), inset 0 1px 0 hsl(40 80% 75% / 0.1)' }}
        >
          {isPaused ? (
            <><Play className="w-4 h-4 text-primary" /> <span className="text-foreground text-xs font-display">Retomar Tour</span></>
          ) : (
            <><Clock className="w-4 h-4 text-primary" /> <span className="text-foreground text-xs font-display">Pausar Tour</span></>
          )}
        </button>

        <div className="flex flex-wrap justify-center gap-1.5">
          {screens.map((screen, i) => (
            <button
              key={i}
              onClick={() => goToScreen(i)}
              className="group relative"
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: i === activeScreen ? 'hsl(40 70% 50%)' : 'rgba(255,255,255,0.12)',
                  boxShadow: i === activeScreen ? '0 0 8px hsl(40 70% 50% / 0.5)' : 'none',
                  transform: i === activeScreen ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-foreground bg-card/90 border border-border px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {screen.label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          {isPaused ? '👆 Clique nos pontos para navegar' : '⏩ Tour automático — clique para pausar'}
        </p>
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
  { q: 'Funciona em qual dispositivo?', a: 'Funciona em qualquer celular, tablet ou computador com navegador moderno. Android, iPhone, iPad, Windows, Mac — tudo funciona.' },
  { q: 'O app é atualizado?', a: 'Sim! Estamos constantemente adicionando novos capítulos, desafios e funcionalidades. Todas as atualizações são inclusas no plano anual.' },
];

/* ═══════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
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
      hover:scale-[1.03] active:scale-[0.97]
      ${variant === 'primary'
        ? 'bg-gradient-to-b from-primary to-primary/80 text-primary-foreground border-2 border-primary/60'
        : 'bg-card/80 text-foreground border-2 border-primary/40 hover:border-primary/70'
      }
      ${className}
    `}
    style={{
      boxShadow: variant === 'primary'
        ? '0 0 30px hsl(40 70% 50% / 0.6), 0 0 60px hsl(40 70% 50% / 0.25), 0 0 100px hsl(40 70% 50% / 0.1), 0 8px 20px rgba(0,0,0,0.5), inset 0 2px 0 hsl(40 80% 75% / 0.4), inset 0 -2px 4px hsl(40 50% 20% / 0.5)'
        : '0 0 20px hsl(40 70% 50% / 0.2), 0 0 40px hsl(40 70% 50% / 0.08), 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 hsl(40 80% 75% / 0.15), inset 0 -1px 3px hsl(40 50% 20% / 0.3)',
      textShadow: variant === 'primary' ? '0 0 12px hsl(40 70% 50% / 0.6)' : 'none',
    }}
  >
    {children}
  </button>
);

const MedievalCard = ({ children, className = '', glow = false }: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) => (
  <div
    className={`rounded-xl border bg-card/80 backdrop-blur-sm p-6 relative ${glow ? 'border-primary/40' : 'border-border'} ${className}`}
    style={{
      boxShadow: glow
        ? '0 0 25px hsl(40 70% 50% / 0.3), 0 0 50px hsl(40 70% 50% / 0.1), 0 8px 30px rgba(0,0,0,0.5), inset 0 1px 0 hsl(40 80% 75% / 0.1), inset 0 -1px 0 hsl(40 50% 20% / 0.2)'
        : '0 4px 20px rgba(0,0,0,0.4), 0 0 10px hsl(40 70% 50% / 0.05), inset 0 1px 0 hsl(40 80% 75% / 0.05), inset 0 -1px 0 hsl(40 50% 20% / 0.15)',
    }}
  >
    {glow && (
      <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
        background: 'radial-gradient(ellipse at top center, hsl(40 70% 50% / 0.06), transparent 70%)',
      }} />
    )}
    <div className="relative">{children}</div>
  </div>
);

const MedievalOrnament = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const w = size === 'sm' ? 'w-32' : size === 'md' ? 'w-48' : 'w-64';
  return (
    <div className={`flex items-center justify-center mx-auto ${w}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-primary/20" />
      <div className="mx-2 flex items-center gap-1">
        <span className="text-primary/30 text-[10px]">✦</span>
        <span className="text-primary/50 text-xs">⚜</span>
        <span className="text-primary/30 text-[10px]">✦</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/40 to-primary/20" />
    </div>
  );
};

const SealBadge = ({ icon, text, subtext }: { icon: string; text: string; subtext?: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-primary/40 bg-gradient-to-b from-primary/15 to-primary/5"
      style={{ boxShadow: '0 0 20px hsl(40 70% 50% / 0.25), inset 0 2px 4px hsl(40 80% 75% / 0.15), inset 0 -2px 4px rgba(0,0,0,0.3)' }}
    >
      <span className="text-xl">{icon}</span>
    </div>
    <span className="text-[10px] text-foreground font-display font-bold uppercase tracking-wider">{text}</span>
    {subtext && <span className="text-[8px] text-muted-foreground">{subtext}</span>}
  </div>
);

const SectionDivider = () => (
  <div className="flex items-center justify-center py-6">
    <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
    <div className="mx-2 flex items-center gap-1.5">
      <span className="text-primary/20 text-[8px]">✦</span>
      <Sparkles className="w-4 h-4 text-primary/40" />
      <span className="text-primary/20 text-[8px]">✦</span>
    </div>
    <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
  </div>
);

const CinematicImage = ({ src, alt, caption, subcaption, rotate = 0 }: {
  src: string; alt: string; caption: string; subcaption?: string; rotate?: number;
}) => (
  <div
    className="relative rounded-2xl overflow-hidden group"
    style={{
      transform: `perspective(1000px) rotateY(${rotate}deg) rotateX(1deg)`,
      boxShadow: '0 0 30px hsl(40 70% 50% / 0.2), 0 20px 60px rgba(0,0,0,0.5)',
    }}
  >
    <img src={src} alt={alt} className="w-full transition-transform duration-700 group-hover:scale-105" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
      <p className="font-display text-lg text-foreground font-bold">{caption}</p>
      {subcaption && <p className="text-sm text-foreground/70 mt-1">{subcaption}</p>}
    </div>
  </div>
);

/* Character portrait for the gallery */
const CharacterPortrait = ({ src, name, role }: { src: string; name: string; role: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary/50 relative"
      style={{ boxShadow: '0 0 20px hsl(40 70% 50% / 0.35), 0 0 40px hsl(40 70% 50% / 0.12), 0 4px 15px rgba(0,0,0,0.5), inset 0 2px 4px hsl(40 80% 75% / 0.1)' }}
    >
      <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="text-center">
      <p className="font-display text-xs font-bold text-foreground" style={{ textShadow: '0 0 8px hsl(40 70% 50% / 0.3)' }}>{name}</p>
      <p className="text-[10px] text-muted-foreground">{role}</p>
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
          className="ml-2 px-3 py-1 text-xs font-display font-bold rounded-lg bg-primary text-primary-foreground border border-primary/60 flex-shrink-0 hover:scale-105 transition-transform"
          style={{ boxShadow: '0 0 10px hsl(40 70% 50% / 0.3)' }}
        >
          GARANTIR
        </button>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-5 py-16 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={cidadeDestruicao} alt="Cidade da Destruição" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
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
            className="text-base md:text-xl text-foreground/90 leading-relaxed max-w-lg mx-auto font-body"
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

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-foreground/70 flex-wrap" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
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

      {/* ══════════ TRUST SEAL BADGES ══════════ */}
      <section className="px-5 py-8 bg-card/20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <SealBadge icon="🛡️" text="Garantia" subtext="7 Dias" />
            <SealBadge icon="⚔️" text="30+ Capítulos" />
            <SealBadge icon="🏆" text="100% Offline" />
            <SealBadge icon="👥" text="Multiplayer" subtext="Até 6 jogadores" />
          </div>
          <MedievalOrnament size="lg" />
        </div>
      </section>

      {/* ══════════ MODO SOLO — COMO FUNCIONA ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Modo Solo</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Uma aventura narrativa <span className="text-primary">onde cada escolha importa</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              Você lê, decide e vive a história. Não é um jogo passivo — suas decisões alteram atributos, desbloqueiam caminhos e determinam o final.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <MedievalCard glow className="overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden">
                <img src={valeHumilhacao} alt="Narrativa com escolhas" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Narrativa Interativa
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  30+ capítulos com texto imersivo e arte cinematográfica. Cada cena apresenta 2-4 escolhas que impactam seus <strong className="text-primary">4 atributos</strong>: Fé 🔥, Perseverança ⛰️, Discernimento 👁️ e Coragem 🛡️.
                </p>
              </div>
            </MedievalCard>

            <MedievalCard glow className="overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden">
                <img src={casteloDuvida} alt="Duelos de dados" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Swords className="w-5 h-5 text-primary" /> Duelos com Dados 3D
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Enfrente inimigos como <strong className="text-primary">Apolião</strong> e o <strong className="text-primary">Gigante Desespero</strong> com sistema de combate: Espada ⚔️ (ataque), Escudo 🛡️ (defesa) e Oração 🙏 (poder). Dados 3D animados!
                </p>
              </div>
            </MedievalCard>

            <MedievalCard glow className="overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden">
                <img src={feiraVaidade} alt="Mini-games" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" /> 9 Tipos de Mini-Games
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  QTE de reflexo, esquiva de tentações, memória bíblica, stealth, caça ao tesouro, Simon Says, puzzle de versículos, caminho da fé e duelo de dados. Cada um com tela de instrução antes do início.
                </p>
              </div>
            </MedievalCard>

            <MedievalCard glow className="overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden">
                <img src={cidadeCelestial} alt="Finais múltiplos" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" /> Múltiplos Finais
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Seus atributos determinam qual final você alcança. Cidade Celestial gloriosa, finais alternativos ou caminhos secretos. Cada jogada é diferente com <strong className="text-primary">eventos aleatórios</strong> e dados invisíveis.
                </p>
              </div>
            </MedievalCard>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ MODO MULTIPLAYER ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Multiplayer</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Dois modos para jogar <span className="text-primary">em grupo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MedievalCard glow className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center" style={{ boxShadow: '0 0 15px hsl(40 70% 50% / 0.2)' }}>
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground font-bold">Online</h3>
              <ul className="text-xs text-muted-foreground text-left space-y-2">
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Até 6 jogadores simultâneos via internet</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Tabuleiro premium digital com 65 casas</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Dados 3D animados (branco com pontos pretos)</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> 65 eventos narrativos no tabuleiro</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Ranking e medalhas por partida</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Compartilhe o link e jogue com amigos</li>
              </ul>
            </MedievalCard>

            <MedievalCard glow className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center" style={{ boxShadow: '0 0 15px hsl(40 70% 50% / 0.2)' }}>
                <Swords className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground font-bold">Presencial (Reunidos)</h3>
              <ul className="text-xs text-muted-foreground text-left space-y-2">
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> 2 a 8 jogadores no mesmo dispositivo</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Funciona 100% offline — ideal para retiros</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Use dados físicos reais ou o dado digital</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Cada jogador escolhe nome e personagem</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Eventos surpresa a cada casa</li>
                <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> Perfeito para grupos de jovens e famílias</li>
              </ul>
            </MedievalCard>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ PERSONAGENS + CENAS ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Conteúdo do App</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              40+ personagens e cenários <span className="text-primary">cinematográficos</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2">Todas as imagens abaixo são reais — exatamente o que você verá no app</p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center">
            <CharacterPortrait src={cristao} name="Cristão" role="Protagonista" />
            <CharacterPortrait src={evangelista} name="Evangelista" role="O Guia" />
            <CharacterPortrait src={fiel} name="Fiel" role="Companheiro" />
            <CharacterPortrait src={esperanca} name="Esperança" role="Amigo Fiel" />
            <CharacterPortrait src={apolion} name="Apolião" role="O Destruidor" />
            <CharacterPortrait src={giganteDesespero} name="Gigante" role="Desespero" />
            <CharacterPortrait src={crista} name="Cristã" role="A Peregrina" />
            <CharacterPortrait src={valentePelaVerdade} name="Valente" role="Pela Verdade" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { img: cidadeDestruicao, label: 'Cidade da Destruição' },
              { img: portaoEstreito, label: 'Portão Estreito' },
              { img: cruzFardo, label: 'A Cruz e o Fardo' },
              { img: casaInterprete, label: 'Casa do Intérprete' },
              { img: valeSombra, label: 'Vale da Sombra' },
              { img: julgamentoFeira, label: 'Julgamento na Feira' },
              { img: giganteMataBons, label: 'Gigante Mata-Bons' },
              { img: montanhasDeleitosas, label: 'Montanhas Deleitosas' },
            ].map((scene, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden group aspect-[4/3]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <img src={scene.img} alt={scene.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 font-display text-[11px] text-white font-bold">{scene.label}</p>
              </div>
            ))}
          </div>
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
              'Sente que está espiritualmente estagnado e precisa de algo novo?',
              'Quer algo que una diversão e edificação espiritual ao mesmo tempo?',
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
              { icon: <Users className="w-6 h-6" />, stat: '6', label: 'Jogadores simultâneos' },
              { icon: <Swords className="w-6 h-6" />, stat: '10+', label: 'Duelos épicos' },
              { icon: <Trophy className="w-6 h-6" />, stat: '∞', label: 'Rejogabilidade' },
              { icon: <Map className="w-6 h-6" />, stat: '40+', label: 'Personagens' },
            ].map((s, i) => (
              <MedievalCard key={i} glow={i < 3} className="text-center">
                <div className="text-primary mb-2 flex justify-center">{s.icon}</div>
                <p className="font-display text-2xl text-primary font-bold">{s.stat}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </MedievalCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ CTA intermediário ══════════ */}
      <section className="px-5 py-10 bg-card/30">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <p className="font-display text-lg text-foreground font-bold">
            Não espere mais — <span className="text-primary">sua jornada começa agora</span>
          </p>
          <CtaButton onClick={handleBuy} variant="primary" className="w-full">
            <Crown className="w-5 h-5" />
            Garantir Meu Acesso — R$147/ano
          </CtaButton>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5" /> 7 dias de garantia · Pagamento seguro
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ PHONE MOCKUP TOUR ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Veja por Dentro</p>
          <MedievalOrnament size="sm" />
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            O app <span className="text-primary">por dentro</span> — tour real
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Dashboard, cenas narrativas, duelos de dados, mini-games, tabuleiro multiplayer e mapa da jornada — tudo que você terá acesso
          </p>

          <PhoneMockupTour />
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ FEATURES — HOW IT WORKS ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Como Funciona</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Tudo o que o app <span className="text-primary">entrega para você</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { icon: <BookOpen className="w-6 h-6" />, title: 'Narrativa Interativa Completa', desc: 'A história de O Peregrino e A Peregrina em 30+ capítulos. Cada decisão altera seus 4 atributos — Fé, Perseverança, Discernimento e Coragem — e muda o rumo da história.' },
              { icon: <Swords className="w-6 h-6" />, title: 'Duelos Espirituais com Dados 3D', desc: 'Enfrente Apolião, o Gigante Desespero e outros usando Espada (ataque), Escudo (defesa) e Oração (poder) com dados 3D animados e sistema de combate estratégico.' },
              { icon: <Gamepad2 className="w-6 h-6" />, title: '9 Tipos de Mini-Games', desc: 'QTE de reflexo, esquiva de tentações, memória bíblica, stealth, caça ao tesouro, duelo de dados, puzzles de versículos, caminho da fé e muito mais.' },
              { icon: <Users className="w-6 h-6" />, title: 'Multiplayer Online e Presencial', desc: 'Até 6 jogadores com tabuleiro premium digital, dados 3D, eventos coletivos e chat. Perfeito para grupos de jovens e famílias.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Sistema de Combo e Atributos', desc: 'Sequências de boas escolhas ativam combos que amplificam recompensas. 4 barras de atributos evoluem com cada decisão.' },
              { icon: <Eye className="w-6 h-6" />, title: 'Efeitos Visuais Cinematográficos', desc: 'Partículas, chuva, luz sagrada, tremor de câmera, brilho divino. Arte concept art em cada cena com atmosfera imersiva.' },
              { icon: <Brain className="w-6 h-6" />, title: 'Eventos Aleatórios Dinâmicos', desc: 'A cada jogada, eventos diferentes surgem. Personagens invisíveis, dados secretos e variações narrativas tornam cada experiência única.' },
              { icon: <Star className="w-6 h-6" />, title: 'Múltiplos Finais e Rejogabilidade', desc: 'Finais diferentes baseados nos seus atributos. Final da Cidade Celestial, finais alternativos e caminhos secretos para descobrir.' },
              { icon: <Smartphone className="w-6 h-6" />, title: 'Funciona 100% Offline (PWA)', desc: 'Instale no celular como app nativo. Funciona sem internet. Ideal para viagens, retiros, escolas dominicais e qualquer lugar.' },
              { icon: <Heart className="w-6 h-6" />, title: 'Reflexões Espirituais Profundas', desc: 'Cada capítulo traz reflexões baseadas nas verdades bíblicas da obra de Bunyan. Momentos de meditação e crescimento real na fé.' },
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

      {/* ══════════ RESULTADOS / TRANSFORMAÇÃO ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Resultados</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              O que acontece quando você <span className="text-primary">joga O Peregrino</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🔥', title: 'Fé Renovada', desc: 'Cada escolha e desafio te confronta com verdades bíblicas profundas que reacendem sua chama espiritual.' },
              { icon: '🧠', title: 'Conhecimento Bíblico', desc: 'Aprenda sobre a jornada cristã de forma prática e memorável, não apenas teórica.' },
              { icon: '💪', title: 'Perseverança Fortalecida', desc: 'Ao enfrentar tentações e batalhas no jogo, você desenvolve resiliência real na vida.' },
              { icon: '👥', title: 'Comunhão Profunda', desc: 'Jogue com seu grupo e crie momentos de discussão e crescimento que transcendem o jogo.' },
              { icon: '📖', title: 'Amor pela Obra de Bunyan', desc: 'Descubra (ou redescubra) uma das maiores obras da literatura cristã de todos os tempos.' },
              { icon: '🎯', title: 'Propósito Renovado', desc: 'A jornada de Cristão espelha a sua — e ao final, você sairá com uma visão mais clara do seu propósito.' },
            ].map((r, i) => (
              <MedievalCard key={i} glow className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{r.icon}</span>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-body leading-relaxed">{r.desc}</p>
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
                  'Quer algo para usar em retiros e encontros',
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
                  'Quer algo descartável sem valor duradouro',
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

      {/* ══════════ CTA intermediário 2 ══════════ */}
      <section className="relative px-5 py-12 overflow-hidden">
        <div className="absolute inset-0">
          <img src={cruzFardo} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center space-y-4">
          <p className="font-display text-xl text-foreground font-bold">
            ✝️ Assim como Cristão largou o fardo na Cruz...<br />
            <span className="text-primary">largue a sua hesitação agora</span>
          </p>
          <CtaButton onClick={handleBuy} variant="primary" className="w-full">
            <Flame className="w-5 h-5" />
            Quero Começar Minha Jornada — R$147/ano
          </CtaButton>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ JOHN BUNYAN STORY ══════════ */}
      <section className="px-5 py-16 bg-card/30">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">A Obra Original</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              A Incrível História por trás de <span className="text-primary">O Peregrino</span>
            </h2>
          </div>

          <MedievalCard glow className="space-y-4 font-body text-foreground/80 text-sm leading-relaxed">
            <p>
              <strong className="text-foreground text-lg font-display">1678.</strong> Uma cela úmida e fria na prisão de Bedford, Inglaterra.
              Um homem que recusou parar de pregar o Evangelho — mesmo sob ameaça de morte — pega uma pena e começa a escrever.
            </p>
            <p>
              Esse homem era <strong className="text-primary">John Bunyan</strong>. Filho de um caldeireiro pobre,
              ex-soldado, autodidata, que passou <strong>12 anos preso</strong> por se recusar a silenciar sua fé.
            </p>
            <p>
              Dentro daquelas paredes, ele teve uma visão que mudou a história da literatura:
              a jornada de um homem chamado <em className="text-primary">Cristão</em>, que abandona a Cidade da Destruição
              carregando um fardo pesado nas costas e caminha rumo à Cidade Celestial.
            </p>
            <p>
              <strong className="text-primary">"O Peregrino"</strong> (The Pilgrim's Progress) se tornou o
              <strong className="text-foreground"> segundo livro mais lido da história da humanidade</strong> — perdendo apenas para a Bíblia.
              Traduzido para mais de <strong>200 idiomas</strong>. Milhões de cópias vendidas em 4 séculos.
            </p>
            <p>
              Bunyan escreveu também <strong className="text-primary">"A Peregrina"</strong>, contando a jornada
              de <em>Cristã</em> — esposa de Cristão — e seus filhos. Uma história de coragem feminina, maternidade
              e fé inabalável que complementa a obra original.
            </p>
            <p className="text-primary font-display text-base italic border-l-2 border-primary/40 pl-4">
              "Este app transforma essas obras-primas em algo que você não apenas lê —
              mas <strong>vive, sente e experimenta</strong> como se estivesse lá."
            </p>
          </MedievalCard>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════ METODOLOGIA ══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-display">Metodologia</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-2">
              Como o app <span className="text-primary">transforma</span> sua experiência
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Narrativa Imersiva', desc: 'Você lê a história como um livro, mas com arte cinematográfica em cada cena e a capacidade de fazer escolhas que alteram o rumo.' },
              { step: '02', title: 'Escolhas com Consequências', desc: 'Cada decisão impacta seus 4 atributos (Fé, Perseverança, Discernimento, Coragem). Atributos baixos = caminhos mais difíceis.' },
              { step: '03', title: 'Desafios Interativos', desc: '9 tipos de mini-games testam reflexo, conhecimento bíblico, estratégia e coragem. Cada um conectado à narrativa.' },
              { step: '04', title: 'Duelos Épicos com Dados 3D', desc: 'Combata inimigos usando Espada, Escudo e Oração. Dados 3D animados determinam o resultado.' },
              { step: '05', title: 'Multiplayer Social', desc: 'Jogue com até 6 amigos online ou presencialmente com tabuleiro digital premium.' },
              { step: '06', title: 'Finais Baseados em Suas Escolhas', desc: 'Seus atributos determinam qual final você alcança — e existem finais secretos para os mais dedicados.' },
            ].map((m, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-display text-sm text-primary font-bold"
                  style={{ boxShadow: '0 0 10px hsl(40 70% 50% / 0.2)' }}
                >
                  {m.step}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{m.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-body leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
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
              { name: 'Pastor Marcos', role: 'Pastor de Jovens', text: 'Revolucionou nossos encontros de sábado. Os jovens chegam empolgados para jogar e saem refletindo sobre as verdades bíblicas.' },
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
          <MedievalOrnament />
          <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            Quanto vale uma <span className="text-primary">transformação</span> assim?
          </h2>

          <div className="space-y-3 text-left max-w-md mx-auto font-body">
            {[
              { item: 'Um jogo de tabuleiro cristão', price: 'R$ 180+' },
              { item: 'Material de estudo bíblico anual', price: 'R$ 300+' },
              { item: 'Curso de discipulado online', price: 'R$ 497+' },
              { item: 'Retiro de jovens (por pessoa)', price: 'R$ 250+' },
              { item: 'Livros e comentários bíblicos', price: 'R$ 200+' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-foreground/60">{a.item}</span>
                <span className="text-sm text-foreground/40 line-through">{a.price}</span>
              </div>
            ))}
          </div>

          <p className="text-base text-foreground/70 font-body">
            Tudo isso junto custaria mais de <span className="line-through text-foreground/40">R$ 1.400</span>
          </p>

          {/* Medieval crest */}
          <div className="flex justify-center mb-2">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-primary/50 bg-gradient-to-b from-primary/20 to-primary/5"
              style={{ boxShadow: '0 0 30px hsl(40 70% 50% / 0.35), 0 0 60px hsl(40 70% 50% / 0.15), inset 0 2px 6px hsl(40 80% 75% / 0.2), inset 0 -3px 6px rgba(0,0,0,0.4)' }}
            >
              <span className="text-3xl">⚔️</span>
            </div>
          </div>

          <MedievalCard glow className="max-w-sm mx-auto text-center relative overflow-hidden">
            {/* Corner ornaments */}
            <div className="absolute top-2 left-2 text-primary/15 text-lg">⚜</div>
            <div className="absolute top-2 right-2 text-primary/15 text-lg">⚜</div>
            <div className="absolute bottom-2 left-2 text-primary/15 text-lg">⚜</div>
            <div className="absolute bottom-2 right-2 text-primary/15 text-lg">⚜</div>
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
                'Parte I (O Peregrino) e Parte II (A Peregrina)',
                'Todos os 9 tipos de mini-games',
                'Modo multiplayer online e presencial',
                'Múltiplos finais e eventos aleatórios',
                '40+ personagens com arte original',
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

          <CountdownTimer />
          <p className="text-xs text-destructive font-display animate-pulse">⚠️ Essa oferta expira hoje!</p>
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
            <img src={sealImg} alt="Selo de Garantia 7 Dias" className="w-28 h-28 object-contain" loading="lazy" />
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
        <div className="absolute inset-0">
          <img src={cidadeCelestial} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
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

          <CountdownTimer />

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
            <img src={sealImg} alt="Garantia" className="w-12 h-12 object-contain" loading="lazy" />
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
