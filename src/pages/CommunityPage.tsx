import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isRateLimited, escapeHtml } from '@/lib/sanitize';
import { ArrowLeft, Heart, HandHeart, Sparkles, MapPin, Users, MessageCircle, Activity, ChevronRight, Trophy, Clock, Target, Gift } from 'lucide-react';
import { useCollectiveEvent } from '@/hooks/useCollectiveEvent';
import { Progress } from '@/components/ui/progress';
import { NavLink } from '@/components/NavLink';

// ─── Types ───

interface PilgrimSummary {
  id: string;
  display_name: string;
  avatar_style: string;
  current_phase: number;
  total_choices: number;
  bio: string;
  updated_at: string;
}

interface SupportRecord {
  id: string;
  from_user_id: string;
  to_user_id: string;
  support_type: string;
  message: string | null;
  created_at: string;
  profiles?: { display_name: string } | null;
}

interface PilgrimMessage {
  id: string;
  content: string;
  created_at: string;
  profiles: { display_name: string; avatar_style: string } | null;
}

// ─── Constants ───

const PHASE_NAMES = [
  'Início', 'Porta Estreita', 'Casa do Intérprete', 'Vale da Humilhação',
  'Feira da Vaidade', 'Castelo da Dúvida', 'Cidade Celestial'
];

const PHASE_EMOJI = ['🏠', '🚪', '📖', '⚔️', '🎪', '🏰', '✨'];

const EMOTIONAL_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Iniciando', color: 'text-muted-foreground' },
  1: { label: 'Caminhando', color: 'text-foreground' },
  2: { label: 'Aprendendo', color: 'text-primary' },
  3: { label: 'Em batalha', color: 'text-destructive' },
  4: { label: 'Sendo testado', color: 'text-yellow-500' },
  5: { label: 'Na escuridão', color: 'text-muted-foreground' },
  6: { label: 'Vitorioso', color: 'text-primary' },
};

const SUPPORT_TYPES = [
  { key: 'prayer', label: 'Oração', icon: '🙏', emoji: '🙏', effect: { fe: 1 } },
  { key: 'encouragement', label: 'Encorajamento', icon: '💪', emoji: '💪', effect: { coragem: 1 } },
  { key: 'blessing', label: 'Bênção', icon: '✨', emoji: '✨', effect: { perseveranca: 1 } },
];

const QUICK_MESSAGES = [
  'Força, peregrino! O caminho vale a pena.',
  'Não desista. A luz está mais perto do que parece.',
  'Sua jornada inspira outros a continuar.',
  'O vale da sombra tem fim. Continue.',
  'Que sua fé seja maior que seus medos.',
  'Cada passo conta, mesmo os mais difíceis.',
];

// ─── Helpers ───

function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function isRecentlyActive(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < 30 * 60 * 1000; // 30min
}

// ─── Component ───

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { progress } = useStoryProgress();
  const collectiveEvent = useCollectiveEvent();
  const [pilgrims, setPilgrims] = useState<PilgrimSummary[]>([]);
  const [messages, setMessages] = useState<PilgrimMessage[]>([]);
  const [supports, setSupports] = useState<SupportRecord[]>([]);
  const [myReceivedSupport, setMyReceivedSupport] = useState<SupportRecord[]>([]);
  const [tab, setTab] = useState<'pilgrims' | 'feed' | 'messages' | 'events'>('pilgrims');
  const [sending, setSending] = useState<string | null>(null);
  const [selectedPilgrim, setSelectedPilgrim] = useState<PilgrimSummary | null>(null);

  // Shuffle pilgrims to avoid implicit ranking by activity/progress
  const loadAll = useCallback(async () => {
    const [pilgrimsRes, messagesRes, supportsRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, avatar_style, current_phase, total_choices, bio, updated_at')
        .limit(30),
      supabase
        .from('pilgrim_messages')
        .select('id, content, created_at, profiles(display_name, avatar_style)')
        .order('created_at', { ascending: false })
        .limit(30),
      supabase
        .from('pilgrim_support')
        .select('id, from_user_id, to_user_id, support_type, message, created_at')
        .order('created_at', { ascending: false })
        .limit(30),
    ]);

    if (pilgrimsRes.data) {
      // Shuffle to avoid implicit ranking
      const shuffled = [...pilgrimsRes.data].sort(() => Math.random() - 0.5);
      setPilgrims(shuffled);
    }
    if (messagesRes.data) setMessages(messagesRes.data as unknown as PilgrimMessage[]);
    if (supportsRes.data) setSupports(supportsRes.data);

    // Load support received by current user
    if (user) {
      const { data } = await supabase
        .from('pilgrim_support')
        .select('id, from_user_id, to_user_id, support_type, message, created_at')
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setMyReceivedSupport(data);
    }
  }, [user]);

  useEffect(() => {
    loadAll();

    // Realtime subscriptions
    const channel = supabase
      .channel('community-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pilgrim_messages' }, () => loadAll())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pilgrim_support' }, () => loadAll())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => loadAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadAll]);

  // ─── Send Support ───

  const sendSupport = async (toUserId: string, supportType: string) => {
    if (!user) {
      toast.error('Faça login para enviar apoio');
      return;
    }
    if (toUserId === user.id) return;
    if (isRateLimited(`support-${user.id}`, 10, 60000)) {
      toast.error('Aguarde um momento antes de enviar mais apoio.');
      return;
    }

    setSending(`${toUserId}-${supportType}`);
    const { error } = await supabase.from('pilgrim_support').insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      support_type: supportType,
    });
    if (error) {
      toast.error('Erro ao enviar apoio');
    } else {
      const type = SUPPORT_TYPES.find(s => s.key === supportType);
      toast.success(`${type?.emoji} ${type?.label} enviado!`);
    }
    setSending(null);
  };

  // ─── Send Quick Message ───

  const sendQuickMessage = async (content: string) => {
    if (!user) {
      toast.error('Faça login para enviar mensagens');
      return;
    }
    if (isRateLimited(`msg-${user.id}`, 5, 60000)) {
      toast.error('Aguarde um momento antes de enviar outra mensagem.');
      return;
    }
    const { error } = await supabase.from('pilgrim_messages').insert({
      user_id: user.id,
      content,
    });
    if (error) {
      toast.error('Erro ao enviar');
    } else {
      toast.success('Mensagem compartilhada!');
    }
  };

  // ─── Derived data ───

  const activePilgrims = pilgrims.filter(p => isRecentlyActive(p.updated_at));
  const otherPilgrims = pilgrims.filter(p => !isRecentlyActive(p.updated_at));

  // Build activity feed: merge messages + supports, sorted by time
  const feedItems = [
    ...messages.map(m => ({
      type: 'message' as const,
      id: m.id,
      time: m.created_at,
      name: m.profiles?.display_name || 'Peregrino',
      content: m.content,
    })),
    ...supports.map(s => {
      const fromPilgrim = pilgrims.find(p => p.id === s.from_user_id);
      const toPilgrim = pilgrims.find(p => p.id === s.to_user_id);
      const type = SUPPORT_TYPES.find(st => st.key === s.support_type);
      return {
        type: 'support' as const,
        id: s.id,
        time: s.created_at,
        name: fromPilgrim?.display_name || 'Peregrino',
        content: `enviou ${type?.emoji} ${type?.label} para ${toPilgrim?.display_name || 'um peregrino'}`,
      };
    }),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 40);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <NavLink to="/" className="text-sm text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </NavLink>
          {activePilgrims.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-primary">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {activePilgrims.length} {activePilgrims.length === 1 ? 'ativo' : 'ativos'}
            </div>
          )}
        </div>

        <h1 className="font-display text-xl text-foreground mb-1">Comunidade de Peregrinos</h1>
        <p className="text-xs text-muted-foreground mb-5">Caminhe junto. Apoie outros. Seja apoiado.</p>

        {/* Received support banner */}
        {myReceivedSupport.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-5 animate-fade-in">
            <p className="text-[10px] uppercase tracking-widest text-primary font-medium mb-1.5">Apoio recebido</p>
            <div className="flex flex-wrap gap-1.5">
              {myReceivedSupport.slice(0, 5).map(s => {
                const type = SUPPORT_TYPES.find(st => st.key === s.support_type);
                return (
                  <span key={s.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-primary/20 text-[10px] text-foreground/80">
                    {type?.emoji} {timeAgo(s.created_at)}
                  </span>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 italic">
              O apoio de outros peregrinos fortalece seus atributos.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-card rounded-lg p-1 border border-border">
          {([
            { key: 'pilgrims', label: 'Peregrinos', icon: Users },
            { key: 'events', label: 'Eventos', icon: Trophy },
            { key: 'feed', label: 'Atividade', icon: Activity },
            { key: 'messages', label: 'Mensagens', icon: MessageCircle },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-[11px] font-medium transition-all ${
                tab === t.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.key === 'events' && collectiveEvent.canClaim && (
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* ═══ TAB: Eventos Coletivos ═══ */}
        {tab === 'events' && (
          <div className="space-y-4">
            {/* Current Event */}
            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-card to-primary/5 p-4 relative overflow-hidden">
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {collectiveEvent.daysLeft} dias restantes
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{collectiveEvent.event.emoji}</span>
                <div>
                  <h3 className="text-sm font-display text-foreground">{collectiveEvent.event.title}</h3>
                  <span className="text-[10px] text-primary font-medium uppercase tracking-wider">Evento Semanal</span>
                </div>
              </div>

              <p className="text-xs text-foreground/80 mb-4 leading-relaxed">
                {collectiveEvent.event.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3" /> Progresso coletivo
                  </span>
                  <span className="text-foreground font-medium">
                    {collectiveEvent.progress.current}/{collectiveEvent.progress.target}
                  </span>
                </div>
                <Progress value={collectiveEvent.progress.percentage} className="h-2.5" />
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    {collectiveEvent.progress.participants.length} participante{collectiveEvent.progress.participants.length !== 1 ? 's' : ''}
                  </span>
                  <span className={collectiveEvent.progress.completed ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    {collectiveEvent.progress.percentage}%
                  </span>
                </div>
              </div>

              {/* Reward */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border">
                <Gift className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Recompensa</p>
                  <p className="text-xs text-foreground font-medium">{collectiveEvent.event.reward.label}</p>
                </div>
                {collectiveEvent.canClaim && (
                  <button
                    onClick={() => {
                      const reward = collectiveEvent.claim();
                      toast.success(`🎁 Recompensa coletada! ${reward.label}`);
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity animate-pulse"
                  >
                    Coletar
                  </button>
                )}
                {collectiveEvent.claimed && (
                  <span className="text-[10px] text-primary font-medium">✓ Coletado</span>
                )}
                {!collectiveEvent.canClaim && !collectiveEvent.claimed && (
                  <span className="text-[10px] text-muted-foreground">Em andamento</span>
                )}
              </div>
            </div>

            {/* Next Event Preview */}
            <div className="rounded-lg border border-border bg-card/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                Próximo evento
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg">{collectiveEvent.nextEvent.emoji}</span>
                <div>
                  <p className="text-xs font-medium text-foreground">{collectiveEvent.nextEvent.title}</p>
                  <p className="text-[10px] text-muted-foreground">{collectiveEvent.nextEvent.description.slice(0, 80)}...</p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                Como funciona
              </p>
              <ul className="space-y-1.5 text-xs text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Eventos mudam toda semana automaticamente
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Todos contribuem para o objetivo coletivo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Ao completar, todos podem coletar a recompensa
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Recompensas dão bônus reais nos seus atributos
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ═══ TAB: Peregrinos ═══ */}
        {tab === 'pilgrims' && (
          <div className="space-y-4">
            {/* Active pilgrims */}
            {activePilgrims.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Em jornada agora
                </p>
                <div className="space-y-2">
                  {activePilgrims.map(p => (
                    <PilgrimCard
                      key={p.id}
                      pilgrim={p}
                      isActive
                      isMe={p.id === user?.id}
                      onSelect={() => setSelectedPilgrim(p)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other pilgrims */}
            {otherPilgrims.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                  Companheiros de caminhada
                </p>
                <div className="space-y-2">
                  {otherPilgrims.map(p => (
                    <PilgrimCard
                      key={p.id}
                      pilgrim={p}
                      isActive={false}
                      isMe={p.id === user?.id}
                      onSelect={() => setSelectedPilgrim(p)}
                    />
                  ))}
                </div>
              </div>
            )}

            {pilgrims.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Nenhum peregrino ainda.</p>
                <p className="text-muted-foreground text-xs">Crie uma conta para aparecer aqui.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: Feed de Atividade ═══ */}
        {tab === 'feed' && (
          <div className="space-y-2">
            {feedItems.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Nenhuma atividade ainda.</p>
              </div>
            )}
            {feedItems.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-card border border-border">
                <span className="text-sm mt-0.5">
                  {item.type === 'message' ? '💬' : '🤝'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{item.name}</span>{' '}
                    {item.type === 'message' ? `disse: "${item.content}"` : item.content}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{timeAgo(item.time)}</span>
              </div>
            ))}
          </div>
        )}

        {/* ═══ TAB: Mensagens ═══ */}
        {tab === 'messages' && (
          <div>
            {/* Quick messages */}
            {user && (
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                  Compartilhe uma palavra
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_MESSAGES.map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => sendQuickMessage(msg)}
                      className="text-left px-3 py-2.5 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors text-xs text-foreground/80"
                    >
                      "{msg}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!user && (
              <p className="text-sm text-muted-foreground text-center mb-4 py-4">
                Faça login para compartilhar mensagens
              </p>
            )}

            {/* Messages feed */}
            <div className="space-y-2">
              {messages.length === 0 && (
                <p className="text-muted-foreground text-center py-8 text-sm">Nenhuma mensagem ainda.</p>
              )}
              {messages.map(m => (
                <div key={m.id} className="bg-card rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">
                      {m.profiles?.display_name || 'Peregrino'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{timeAgo(m.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 italic">"{m.content}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Support Modal ═══ */}
        {selectedPilgrim && selectedPilgrim.id !== user?.id && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setSelectedPilgrim(null)}>
            <div
              className="w-full max-w-lg bg-card rounded-t-2xl border-t border-border p-5 pb-8 animate-fade-in"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
              <div className="text-center mb-4">
                <h3 className="font-display text-lg text-foreground">{selectedPilgrim.display_name}</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  {PHASE_EMOJI[selectedPilgrim.current_phase] || '🏠'}{' '}
                  {PHASE_NAMES[selectedPilgrim.current_phase] || 'Início'}
                </p>
                {selectedPilgrim.bio && (
                  <p className="text-xs text-foreground/70 mt-2 italic">"{selectedPilgrim.bio}"</p>
                )}
              </div>

              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3 text-center">
                Enviar apoio simbólico
              </p>

              <div className="grid grid-cols-3 gap-3">
                {SUPPORT_TYPES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => {
                      sendSupport(selectedPilgrim.id, s.key);
                      setSelectedPilgrim(null);
                    }}
                    disabled={sending !== null}
                    className="flex flex-col items-center gap-2 py-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-xs font-medium text-foreground">{s.label}</span>
                    <span className="text-[9px] text-muted-foreground">
                      +1 {Object.keys(s.effect)[0]}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedPilgrim(null)}
                className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Pilgrim Card Component ───

const PilgrimCard: React.FC<{
  pilgrim: PilgrimSummary;
  isActive: boolean;
  isMe: boolean;
  onSelect: () => void;
}> = ({ pilgrim, isActive, isMe, onSelect }) => {
  const emotional = EMOTIONAL_LABELS[pilgrim.current_phase] || EMOTIONAL_LABELS[0];

  return (
    <button
      onClick={onSelect}
      disabled={isMe}
      className={`w-full text-left rounded-lg p-3 border transition-all ${
        isMe
          ? 'bg-primary/5 border-primary/20'
          : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar indicator */}
        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            isActive ? 'bg-primary/15' : 'bg-secondary'
          }`}>
            {PHASE_EMOJI[pilgrim.current_phase] || '🏠'}
          </div>
          {isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          )}
        </div>

        {/* Info — no numeric stats, just phase and emotional state */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground truncate">{pilgrim.display_name}</span>
            {isMe && <span className="text-[9px] text-primary font-medium">(você)</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              {PHASE_NAMES[pilgrim.current_phase] || 'Início'}
            </span>
            <span className={`text-[10px] ${emotional.color}`}>
              {emotional.label}
            </span>
          </div>
        </div>

        {/* Support hint instead of competitive arrow */}
        {!isMe && (
          <div className="flex-shrink-0 text-[10px] text-muted-foreground/60">
            Apoiar
          </div>
        )}
      </div>
    </button>
  );
};

export default CommunityPage;
