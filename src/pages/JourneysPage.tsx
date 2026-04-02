import { useNavigate } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { storyChapters, chapterOrder } from '@/data/story';
import { part2Chapters, part2ChapterOrder } from '@/data/storyPart2';
import { ArrowLeft, Lock, CheckCircle2, MapPin, ChevronDown, ChevronUp, RotateCcw, Compass, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ScreenHero from '@/components/ScreenHero';

import mapFase1 from '@/assets/map-fase1.jpg';
import mapFase2 from '@/assets/map-fase2.jpg';
import mapFase3 from '@/assets/map-fase3.jpg';
import mapFase4 from '@/assets/map-fase4.jpg';
import mapFase5 from '@/assets/map-fase5.jpg';
import mapFase6 from '@/assets/map-fase6.jpg';

const PART1_OPENING_CHAPTER_PATTERN = /^cena\d+[a-z]?$/i;

const PHASES_PART1 = [
  {
    id: 'fase1', label: 'A Partida', subtitle: 'Cidade da Destruição → Porta Estreita',
    image: mapFase1, color: '#E8724A',
    description: 'O peregrino desperta e foge da cidade condenada à destruição, carregando o peso de seus pecados.',
    verse: '"Fujam da ira vindoura!" — Mateus 3:7',
  },
  {
    id: 'fase2', label: 'O Caminho', subtitle: 'Casa do Intérprete → Palácio Belo',
    image: mapFase2, color: '#4CAF50',
    description: 'Visões reveladoras, a armadura de Deus e o acolhimento no Palácio Belo.',
    verse: '"Revesti-vos de toda a armadura de Deus" — Efésios 6:11',
  },
  {
    id: 'fase3', label: 'A Provação', subtitle: 'Vale da Humilhação → Feira da Vaidade',
    image: mapFase3, color: '#D32F2F',
    description: 'Batalha mortal contra Apolião e a travessia do terrível Vale da Sombra da Morte.',
    verse: '"Ainda que eu ande pelo vale da sombra da morte, não temerei" — Salmo 23:4',
  },
  {
    id: 'fase4', label: 'A Perseverança', subtitle: 'Feira da Vaidade → Colina de Lucro',
    image: mapFase4, color: '#FF9800',
    description: 'Julgamentos cruéis, o martírio de Fiel e as tentações do ouro e da vaidade.',
    verse: '"Sede fiéis até a morte, e vos darei a coroa da vida" — Apocalipse 2:10',
  },
  {
    id: 'fase5', label: 'A Libertação', subtitle: 'Castelo da Dúvida → Montanhas Deleitosas',
    image: mapFase5, color: '#00BCD4',
    description: 'Prisão do Gigante Desespero, a chave da Promessa e a visão das Montanhas Deleitosas.',
    verse: '"Se o Filho vos libertar, verdadeiramente sereis livres" — João 8:36',
  },
  {
    id: 'fase6', label: 'A Glória', subtitle: 'País de Beulá → Cidade Celestial',
    image: mapFase6, color: '#FFD700',
    description: 'A travessia do rio da morte e a entrada triunfal nos portões eternos da Cidade Celestial.',
    verse: '"Bem-aventurados os que lavam as suas vestes para terem direito à árvore da vida" — Ap 22:14',
  },
];

const PHASES_PART2 = [
  {
    id: 'p2-fase1', label: 'O Chamado de Cristã', subtitle: 'Cidade da Destruição → Porta Estreita',
    image: mapFase1, color: '#AB47BC',
    description: 'Cristã, esposa do Peregrino, recebe o chamado e parte com seus filhos e Misericórdia.',
    verse: '"Vinde a mim, todos os que estais cansados e oprimidos" — Mateus 11:28',
  },
  {
    id: 'p2-fase2', label: 'A Companhia', subtitle: 'Casa do Intérprete → Cruz e Sepulcro',
    image: mapFase2, color: '#26C6DA',
    description: 'Grande-Coração guia o grupo pelas lições do Intérprete e pela libertação na Cruz.',
    verse: '"Eis que envio o meu anjo diante de ti, para guardar-te pelo caminho" — Êxodo 23:20',
  },
  {
    id: 'p2-fase3', label: 'A Jornada em Grupo', subtitle: 'Vale da Humilhação → Feira da Vaidade',
    image: mapFase3, color: '#EF5350',
    description: 'A família enfrenta o vale sombrio e a feira com a força da comunidade.',
    verse: '"Ainda que um caia, o outro levanta o seu companheiro" — Eclesiastes 4:10',
  },
  {
    id: 'p2-fase4', label: 'A Resistência', subtitle: 'Gigante Desespero → Castelo da Dúvida',
    image: mapFase4, color: '#FF7043',
    description: 'Grande-Coração derruba o Castelo da Dúvida e Valente-pela-Verdade se junta ao grupo.',
    verse: '"Maior é o que está em vós do que o que está no mundo" — 1 João 4:4',
  },
  {
    id: 'p2-fase5', label: 'As Provas Finais', subtitle: 'Terra Encantada → Montanhas Deleitosas',
    image: mapFase5, color: '#42A5F5',
    description: 'O grupo resiste ao sono encantado e encontra Firme, que se une à caminhada.',
    verse: '"Vigiai e orai, para que não entreis em tentação" — Mateus 26:41',
  },
  {
    id: 'p2-fase6', label: 'A Travessia de Cristã', subtitle: 'Rio da Morte → Cidade Celestial',
    image: mapFase6, color: '#FFD700',
    description: 'Cristã atravessa o rio da morte em paz e entra na glória eterna.',
    verse: '"Preciosa é aos olhos do Senhor a morte dos seus santos" — Salmo 116:15',
  },
];

const OWNER_EMAIL = 'luis.rf.goncalves@gmail.com';

const JourneysPage = () => {
  const navigate = useNavigate();
  const { progress, goToChapter, startJourney, resetProgress } = useStoryProgress();
  const { user } = useAuth();
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL;
  const currentCampaign = progress.campaign || 'part1';

  const handleChapterClick = (chapterId: string, campaign: 'part1' | 'part2') => {
    if (isOwner || progress.visitedChapters.includes(chapterId)) {
      goToChapter(chapterId);
      startJourney();
      navigate('/jornada', { replace: true });
      setTimeout(() => navigate('/cena'), 50);
    }
  };

  const handlePhaseReplay = (phaseId: string, campaign: 'part1' | 'part2') => {
    const phaseChapters = getPhaseChapterIds(phaseId, campaign);
    const firstVisited = phaseChapters.find(id => progress.visitedChapters.includes(id));
    if (firstVisited) {
      goToChapter(firstVisited);
      startJourney();
      navigate('/jornada', { replace: true });
      setTimeout(() => navigate('/cena'), 50);
    }
  };

  const getPhaseChapterIds = (phaseId: string, campaign: 'part1' | 'part2' = 'part1') => {
    if (campaign === 'part2' || phaseId.startsWith('p2-')) {
      if (phaseId === 'p2-fase1') {
        return part2ChapterOrder.filter(id => /^p2-cena\d+$/.test(id));
      }
      return part2ChapterOrder.filter(id => id.startsWith(phaseId.replace('p2-fase', 'p2-fase') + '-'));
    }
    if (phaseId === 'fase1') {
      return chapterOrder.filter(id => PART1_OPENING_CHAPTER_PATTERN.test(id));
    }
    return chapterOrder.filter(id => id.startsWith(phaseId + '-'));
  };

  const groupedChaptersPart1 = useMemo(() => {
    return PHASES_PART1.map(phase => ({
      ...phase,
      campaign: 'part1' as const,
      chapters: getPhaseChapterIds(phase.id, 'part1')
        .map(id => ({ id, chapter: storyChapters[id] }))
        .filter(c => c.chapter),
    }));
  }, [progress.visitedChapters]);

  const groupedChaptersPart2 = useMemo(() => {
    return PHASES_PART2.map(phase => ({
      ...phase,
      campaign: 'part2' as const,
      chapters: getPhaseChapterIds(phase.id, 'part2')
        .map(id => ({ id, chapter: part2Chapters[id] }))
        .filter(c => c.chapter),
    }));
  }, [progress.visitedChapters]);

  const totalVisitedPart1 = chapterOrder.filter(id => progress.visitedChapters.includes(id)).length;
  const totalVisitedPart2 = part2ChapterOrder.filter(id => progress.visitedChapters.includes(id)).length;
  const totalVisited = totalVisitedPart1 + totalVisitedPart2;
  const total = chapterOrder.length + part2ChapterOrder.length;

  const isPhaseVisited = (phaseId: string, campaign: 'part1' | 'part2') =>
    getPhaseChapterIds(phaseId, campaign).some(id => progress.visitedChapters.includes(id));

  const isPhaseComplete = (phaseId: string, campaign: 'part1' | 'part2') => {
    const phaseChapters = getPhaseChapterIds(phaseId, campaign);
    return phaseChapters.length > 0 && phaseChapters.every(id => progress.visitedChapters.includes(id));
  };

  const isCurrentPhase = (phaseId: string) => {
    const currentId = progress.currentChapterId;
    if (phaseId === 'fase1') return PART1_OPENING_CHAPTER_PATTERN.test(currentId);
    return currentId?.startsWith(phaseId + '-');
  };

  return (
    <div className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, hsl(30 25% 10%) 0%, hsl(25 20% 8%) 100%)',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-3 border-b-2"
        style={{
          background: 'linear-gradient(180deg, hsl(30 28% 14% / 0.98) 0%, hsl(25 22% 11% / 0.96) 100%)',
          borderColor: 'hsl(40 50% 35% / 0.4)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-medieval-icon !p-2 active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg" style={{ color: 'hsl(40 60% 70%)' }}>
              📜 Mapa da Jornada
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(30 20% 15%)', border: '1px solid hsl(40 30% 25% / 0.4)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.round((totalVisited / total) * 100)}%`,
                    background: 'linear-gradient(90deg, hsl(40 60% 45%), hsl(40 70% 55%))',
                  }}
                />
              </div>
              <span className="text-xs font-display" style={{ color: 'hsl(35 30% 50%)' }}>
                {Math.round((totalVisited / total) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable vertical map */}
      <div className="max-w-lg mx-auto">
        <ScreenHero
          icon={<Compass className="w-full h-full" />}
          name="Mapa da Jornada"
          subtitle={`${Math.round((totalVisited / total) * 100)}% explorado`}
          sfx="gameStart"
          size="md"
        />
      </div>

      <main className="max-w-lg mx-auto pb-12">
        {/* Map title */}
        <div className="text-center py-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-10" style={{ background: 'hsl(40 50% 45% / 0.4)' }} />
            <span style={{ color: 'hsl(40 60% 55%)' }}>⚜️</span>
            <div className="h-px w-10" style={{ background: 'hsl(40 50% 45% / 0.4)' }} />
          </div>
          <h2 className="font-display text-xl" style={{ color: 'hsl(38 50% 72%)', textShadow: '0 2px 8px hsl(0 0% 0% / 0.6)' }}>Parte I — O Peregrino</h2>
          <p className="text-xs italic font-body mt-1" style={{ color: 'hsl(35 25% 50%)' }}>Da Cidade da Destruição à Cidade Celestial</p>
        </div>

        {/* Phases */}
        {groupedChaptersPart1.map((phase, phaseIdx) => {
          const visited = isPhaseVisited(phase.id, 'part1');
          const complete = isPhaseComplete(phase.id, 'part1');
          const current = isCurrentPhase(phase.id);
          const expanded = expandedPhase === phase.id;
          const visitedCount = phase.chapters.filter(c => progress.visitedChapters.includes(c.id)).length;

          return (
            <div key={phase.id} className="relative">
              {/* Connecting path line */}
              {phaseIdx > 0 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-8" style={{
                    background: visited
                      ? `linear-gradient(180deg, ${PHASES_PART1[phaseIdx - 1].color}80, ${phase.color}80)`
                      : 'hsl(30 15% 20%)',
                  }} />
                </div>
              )}

              {/* Phase card with illustration */}
              <div className="mx-3 relative overflow-hidden rounded-2xl"
                style={{
                  border: current
                    ? `2px solid ${phase.color}90`
                    : complete
                    ? `2px solid ${phase.color}60`
                    : visited
                    ? '2px solid hsl(30 20% 25%)'
                    : '2px solid hsl(30 15% 18%)',
                  boxShadow: current
                    ? `0 0 25px ${phase.color}30, 0 8px 32px hsl(0 0% 0% / 0.5)`
                    : '0 4px 20px hsl(0 0% 0% / 0.4)',
                }}
              >
                {/* Scene illustration */}
                <div className="relative w-full" style={{ height: 180 }}>
                  <img
                    src={phase.image}
                    alt={phase.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={512}
                    style={{
                      filter: visited
                        ? current ? 'brightness(1.05) saturate(1.1)' : 'brightness(0.85) saturate(0.9)'
                        : 'brightness(0.3) saturate(0.2) grayscale(0.6)',
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(180deg, transparent 30%, hsl(25 20% 10% / 0.85) 100%)`,
                  }} />

                  {/* Phase number badge */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-display text-lg"
                    style={{
                      background: visited ? `${phase.color}DD` : 'hsl(30 15% 20% / 0.8)',
                      color: visited ? '#fff' : 'hsl(30 15% 40%)',
                      border: `2px solid ${visited ? phase.color : 'hsl(30 15% 28%)'}`,
                      boxShadow: visited ? `0 0 12px ${phase.color}40` : 'none',
                      textShadow: visited ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
                    }}
                  >
                    {phaseIdx + 1}
                  </div>

                  {/* Status badge */}
                  {current && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-display text-xs"
                      style={{
                        background: `${phase.color}CC`,
                        color: '#fff',
                        boxShadow: `0 0 15px ${phase.color}50`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      VOCÊ ESTÁ AQUI
                    </div>
                  )}
                  {complete && !current && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full font-display text-xs"
                      style={{
                        background: 'hsl(120 40% 30% / 0.8)',
                        color: 'hsl(120 40% 80%)',
                        border: '1px solid hsl(120 40% 40% / 0.5)',
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completo
                    </div>
                  )}

                  {/* Lock overlay for unvisited */}
                  {!visited && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'hsl(0 0% 0% / 0.5)', border: '2px solid hsl(30 15% 30%)' }}>
                        <Lock className="w-8 h-8" style={{ color: 'hsl(30 15% 45%)' }} />
                      </div>
                    </div>
                  )}

                  {/* Title over image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-block px-3 py-1.5 rounded-lg" style={{ background: 'hsl(0 0% 0% / 0.65)', backdropFilter: 'blur(4px)' }}>
                      <h3 className="font-display text-xl leading-tight"
                        style={{
                          color: visited ? '#fff' : 'hsl(30 15% 60%)',
                          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                        }}
                      >
                        {visited ? phase.label : '???'}
                      </h3>
                      {visited && (
                        <p className="text-sm italic mt-0.5" style={{ color: 'hsl(40 50% 80%)', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                          {phase.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phase info section */}
                <div className="p-4" style={{ background: 'hsl(30 22% 12%)' }}>
                  {visited ? (
                    <>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: 'hsl(35 30% 60%)' }}>
                        {phase.description}
                      </p>
                      <p className="text-xs italic mb-3" style={{ color: `${phase.color}AA` }}>
                        {phase.verse}
                      </p>

                      {/* Progress within phase */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(30 15% 18%)' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${phase.chapters.length > 0 ? Math.round((visitedCount / phase.chapters.length) * 100) : 0}%`,
                              background: `linear-gradient(90deg, ${phase.color}BB, ${phase.color})`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-display" style={{ color: 'hsl(35 25% 50%)' }}>
                          {visitedCount}/{phase.chapters.length}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePhaseReplay(phase.id, 'part1')}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                          style={{
                            background: `${phase.color}20`,
                            border: `1.5px solid ${phase.color}50`,
                            color: phase.color,
                          }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-sm font-display">Revisitar</span>
                        </button>

                        {/* Expand chapters button */}
                        <button
                          onClick={() => setExpandedPhase(expanded ? null : phase.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                          style={{
                            background: expanded ? `${phase.color}20` : 'hsl(30 18% 15%)',
                            border: `1.5px solid ${expanded ? `${phase.color}50` : 'hsl(30 15% 22%)'}`,
                            color: expanded ? phase.color : 'hsl(35 30% 55%)',
                          }}
                        >
                          <span className="text-sm font-display">
                            {expanded ? 'Fechar' : 'Capítulos'}
                          </span>
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Expanded chapter list */}
                      {expanded && (
                        <div className="mt-3 space-y-2" style={{ animation: 'slideUp 0.3s ease-out' }}>
                          {phase.chapters.map((item) => {
                            const unlocked = progress.visitedChapters.includes(item.id);
                            const isCurrent = progress.currentChapterId === item.id;

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleChapterClick(item.id, 'part1')}
                                disabled={!unlocked}
                                className="w-full text-left transition-all active:scale-[0.98]"
                              >
                                <div className="flex items-center gap-3 p-3 rounded-xl"
                                  style={{
                                    background: isCurrent
                                      ? `${phase.color}18`
                                      : unlocked
                                      ? 'hsl(30 18% 14%)'
                                      : 'hsl(30 12% 11%)',
                                    border: isCurrent
                                      ? `2px solid ${phase.color}60`
                                      : unlocked
                                      ? '1px solid hsl(30 18% 22%)'
                                      : '1px solid hsl(30 12% 16%)',
                                  }}
                                >
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                    style={{
                                      background: isCurrent ? phase.color : unlocked ? 'hsl(30 20% 18%)' : 'hsl(30 12% 14%)',
                                      border: `1.5px solid ${isCurrent ? phase.color : unlocked ? 'hsl(40 30% 30%)' : 'hsl(30 12% 20%)'}`,
                                      color: isCurrent ? '#fff' : unlocked ? 'hsl(40 50% 55%)' : 'hsl(30 12% 30%)',
                                    }}
                                  >
                                    {isCurrent ? <MapPin className="w-3.5 h-3.5" /> : unlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-display text-sm leading-snug"
                                      style={{ color: isCurrent ? phase.color : unlocked ? 'hsl(38 40% 68%)' : 'hsl(30 12% 32%)' }}>
                                      {unlocked ? item.chapter!.title : '— terra desconhecida —'}
                                    </p>
                                    {unlocked && item.chapter?.location && (
                                      <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(35 20% 45%)' }}>
                                        📍 {item.chapter.location}
                                      </p>
                                    )}
                                  </div>

                                  {isCurrent && (
                                    <span className="text-[10px] font-display px-2 py-0.5 rounded flex-shrink-0"
                                      style={{ background: `${phase.color}30`, color: phase.color, border: `1px solid ${phase.color}50` }}>
                                      AQUI
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm italic text-center py-2" style={{ color: 'hsl(30 15% 35%)' }}>
                      🔒 Terra ainda não explorada pelo peregrino...
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Final destination */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8" style={{ background: 'linear-gradient(180deg, hsl(40 60% 45% / 0.5), transparent)' }} />
        </div>
        <div className="mx-3 mb-8 p-5 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(40 40% 18%) 0%, hsl(35 30% 14%) 100%)',
            border: '2px solid hsl(40 50% 35% / 0.4)',
            boxShadow: '0 0 30px hsl(40 60% 50% / 0.1)',
          }}
        >
          <span className="text-4xl">🏛️</span>
          <h3 className="font-display text-lg mt-2" style={{ color: 'hsl(40 60% 70%)' }}>
            A Cidade Celestial
          </h3>
          <p className="text-xs italic mt-1" style={{ color: 'hsl(35 30% 50%)' }}>
            "E Deus lhes enxugará dos olhos toda lágrima" — Apocalipse 21:4
          </p>
        </div>

        {/* ═══════════════ PARTE II — A PEREGRINA ═══════════════ */}
        <div className="text-center py-8 px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-16" style={{ background: 'hsl(280 40% 45% / 0.4)' }} />
            <span style={{ color: 'hsl(280 50% 65%)' }}>👑</span>
            <div className="h-px w-16" style={{ background: 'hsl(280 40% 45% / 0.4)' }} />
          </div>
          <h2 className="font-display text-xl" style={{ color: 'hsl(280 40% 72%)', textShadow: '0 2px 8px hsl(0 0% 0% / 0.6)' }}>Parte II — A Peregrina</h2>
          <p className="text-xs italic font-body mt-1" style={{ color: 'hsl(280 25% 50%)' }}>A caminhada de Cristã e seus companheiros</p>
        </div>

        {groupedChaptersPart2.map((phase, phaseIdx) => {
          const visited = isPhaseVisited(phase.id, 'part2');
          const complete = isPhaseComplete(phase.id, 'part2');
          const current = isCurrentPhase(phase.id);
          const expanded = expandedPhase === phase.id;
          const visitedCount = phase.chapters.filter(c => progress.visitedChapters.includes(c.id)).length;

          return (
            <div key={phase.id} className="relative">
              {phaseIdx > 0 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-8" style={{
                    background: visited
                      ? `linear-gradient(180deg, ${PHASES_PART2[phaseIdx - 1].color}80, ${phase.color}80)`
                      : 'hsl(30 15% 20%)',
                  }} />
                </div>
              )}

              <div className="mx-3 relative overflow-hidden rounded-2xl"
                style={{
                  border: current ? `2px solid ${phase.color}90` : complete ? `2px solid ${phase.color}60` : visited ? '2px solid hsl(30 20% 25%)' : '2px solid hsl(30 15% 18%)',
                  boxShadow: current ? `0 0 25px ${phase.color}30, 0 8px 32px hsl(0 0% 0% / 0.5)` : '0 4px 20px hsl(0 0% 0% / 0.4)',
                }}
              >
                <div className="relative w-full" style={{ height: 180 }}>
                  <img src={phase.image} alt={phase.label} className="w-full h-full object-cover" loading="lazy" width={800} height={512}
                    style={{ filter: visited ? current ? 'brightness(1.05) saturate(1.1)' : 'brightness(0.85) saturate(0.9)' : 'brightness(0.3) saturate(0.2) grayscale(0.6)' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, hsl(25 20% 10% / 0.85) 100%)' }} />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-display text-lg"
                    style={{ background: visited ? `${phase.color}DD` : 'hsl(30 15% 20% / 0.8)', color: visited ? '#fff' : 'hsl(30 15% 40%)', border: `2px solid ${visited ? phase.color : 'hsl(30 15% 28%)'}`, boxShadow: visited ? `0 0 12px ${phase.color}40` : 'none' }}
                  >{phaseIdx + 1}</div>
                  {current && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-display text-xs" style={{ background: `${phase.color}CC`, color: '#fff', boxShadow: `0 0 15px ${phase.color}50` }}>
                      <MapPin className="w-3.5 h-3.5" /> VOCÊ ESTÁ AQUI
                    </div>
                  )}
                  {complete && !current && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full font-display text-xs" style={{ background: 'hsl(120 40% 30% / 0.8)', color: 'hsl(120 40% 80%)', border: '1px solid hsl(120 40% 40% / 0.5)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completo
                    </div>
                  )}
                  {!visited && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'hsl(0 0% 0% / 0.5)', border: '2px solid hsl(30 15% 30%)' }}>
                        <Lock className="w-8 h-8" style={{ color: 'hsl(30 15% 45%)' }} />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-block px-3 py-1.5 rounded-lg" style={{ background: 'hsl(0 0% 0% / 0.65)', backdropFilter: 'blur(4px)' }}>
                      <h3 className="font-display text-xl leading-tight" style={{ color: visited ? '#fff' : 'hsl(30 15% 60%)', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                        {visited ? phase.label : '???'}
                      </h3>
                      {visited && <p className="text-sm italic mt-0.5" style={{ color: 'hsl(280 50% 80%)', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{phase.subtitle}</p>}
                    </div>
                  </div>
                </div>

                <div className="p-4" style={{ background: 'hsl(30 22% 12%)' }}>
                  {visited ? (
                    <>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: 'hsl(35 30% 60%)' }}>{phase.description}</p>
                      <p className="text-xs italic mb-3" style={{ color: `${phase.color}AA` }}>{phase.verse}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(30 15% 18%)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${phase.chapters.length > 0 ? Math.round((visitedCount / phase.chapters.length) * 100) : 0}%`, background: `linear-gradient(90deg, ${phase.color}BB, ${phase.color})` }} />
                        </div>
                        <span className="text-xs font-display" style={{ color: 'hsl(35 25% 50%)' }}>{visitedCount}/{phase.chapters.length}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handlePhaseReplay(phase.id, 'part2')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-[0.98]" style={{ background: `${phase.color}20`, border: `1.5px solid ${phase.color}50`, color: phase.color }}>
                          <RotateCcw className="w-3.5 h-3.5" /><span className="text-sm font-display">Revisitar</span>
                        </button>
                        <button onClick={() => setExpandedPhase(expanded ? null : phase.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-[0.98]" style={{ background: expanded ? `${phase.color}20` : 'hsl(30 18% 15%)', border: `1.5px solid ${expanded ? `${phase.color}50` : 'hsl(30 15% 22%)'}`, color: expanded ? phase.color : 'hsl(35 30% 55%)' }}>
                          <span className="text-sm font-display">{expanded ? 'Fechar' : 'Capítulos'}</span>
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {expanded && (
                        <div className="mt-3 space-y-2" style={{ animation: 'slideUp 0.3s ease-out' }}>
                          {phase.chapters.map((item) => {
                            const unlocked = progress.visitedChapters.includes(item.id);
                            const isCurrent = progress.currentChapterId === item.id;
                            return (
                              <button key={item.id} onClick={() => handleChapterClick(item.id, 'part2')} disabled={!unlocked} className="w-full text-left transition-all active:scale-[0.98]">
                                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isCurrent ? `${phase.color}18` : unlocked ? 'hsl(30 18% 14%)' : 'hsl(30 12% 11%)', border: isCurrent ? `2px solid ${phase.color}60` : unlocked ? '1px solid hsl(30 18% 22%)' : '1px solid hsl(30 12% 16%)' }}>
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: isCurrent ? phase.color : unlocked ? 'hsl(30 20% 18%)' : 'hsl(30 12% 14%)', border: `1.5px solid ${isCurrent ? phase.color : unlocked ? 'hsl(40 30% 30%)' : 'hsl(30 12% 20%)'}`, color: isCurrent ? '#fff' : unlocked ? 'hsl(40 50% 55%)' : 'hsl(30 12% 30%)' }}>
                                    {isCurrent ? <MapPin className="w-3.5 h-3.5" /> : unlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-display text-sm leading-snug" style={{ color: isCurrent ? phase.color : unlocked ? 'hsl(38 40% 68%)' : 'hsl(30 12% 32%)' }}>{unlocked ? item.chapter!.title : '— terra desconhecida —'}</p>
                                    {unlocked && item.chapter?.location && <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(35 20% 45%)' }}>📍 {item.chapter.location}</p>}
                                  </div>
                                  {isCurrent && <span className="text-[10px] font-display px-2 py-0.5 rounded flex-shrink-0" style={{ background: `${phase.color}30`, color: phase.color, border: `1px solid ${phase.color}50` }}>AQUI</span>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm italic text-center py-2" style={{ color: 'hsl(30 15% 35%)' }}>🔒 Terra ainda não explorada pela peregrina...</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Final destination Part 2 */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8" style={{ background: 'linear-gradient(180deg, hsl(280 40% 45% / 0.5), transparent)' }} />
        </div>
        <div className="mx-3 mb-8 p-5 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(280 30% 18%) 0%, hsl(280 25% 14%) 100%)',
            border: '2px solid hsl(280 40% 35% / 0.4)',
            boxShadow: '0 0 30px hsl(280 50% 50% / 0.1)',
          }}
        >
          <span className="text-4xl">👑</span>
          <h3 className="font-display text-lg mt-2" style={{ color: 'hsl(280 40% 70%)' }}>A Cidade Celestial</h3>
          <p className="text-xs italic mt-1" style={{ color: 'hsl(280 25% 50%)' }}>"Preciosa é aos olhos do Senhor a morte dos seus santos" — Salmo 116:15</p>
        </div>

        {/* Reset button */}
        <div className="flex justify-center pb-4 px-3">
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja recomeçar toda a jornada do início?')) {
                resetProgress(progress.campaign || 'part1');
                navigate('/');
              }
            }}
            className="w-full max-w-[280px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all active:scale-95"
            style={{
              background: 'hsl(0 30% 18% / 0.6)',
              border: '1.5px solid hsl(0 30% 30% / 0.5)',
              color: 'hsl(0 40% 65%)',
            }}
          >
            <RotateCcw className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-display whitespace-nowrap">Recomeçar do Início</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 pb-6 text-xs" style={{ color: 'hsl(35 25% 50%)' }}>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: 'hsl(40 60% 55%)' }} />
            <span>Atual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'hsl(120 40% 45%)' }} />
            <span>Visitado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" style={{ color: 'hsl(30 15% 35%)' }} />
            <span>Oculto</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JourneysPage;
