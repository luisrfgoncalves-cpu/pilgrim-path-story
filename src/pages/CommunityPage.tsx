import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Send, Users, MapPin } from 'lucide-react';
import NavLink from '@/components/NavLink';

interface PilgrimSummary {
  id: string;
  display_name: string;
  avatar_style: string;
  current_phase: number;
  total_choices: number;
  bio: string;
}

interface PilgrimMessage {
  id: string;
  content: string;
  created_at: string;
  profiles: { display_name: string; avatar_style: string } | null;
}

const PHASE_NAMES = [
  'Início', 'Porta Estreita', 'Casa do Intérprete', 'Vale da Humilhação',
  'Feira da Vaidade', 'Castelo da Dúvida', 'Cidade Celestial'
];

const CommunityPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [pilgrims, setPilgrims] = useState<PilgrimSummary[]>([]);
  const [messages, setMessages] = useState<PilgrimMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [tab, setTab] = useState<'pilgrims' | 'messages'>('pilgrims');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadPilgrims();
    loadMessages();

    const channel = supabase
      .channel('pilgrim-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pilgrim_messages' }, () => {
        loadMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadPilgrims = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_style, current_phase, total_choices, bio')
      .order('total_choices', { ascending: false })
      .limit(20);
    if (data) setPilgrims(data);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('pilgrim_messages')
      .select('id, content, created_at, profiles(display_name, avatar_style)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setMessages(data as unknown as PilgrimMessage[]);
  };

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;
    if (newMessage.length > 140) {
      toast.error('Máximo 140 caracteres');
      return;
    }
    setSending(true);
    const { error } = await supabase.from('pilgrim_messages').insert({
      user_id: user.id,
      content: newMessage.trim(),
    });
    if (error) {
      toast.error('Erro ao enviar mensagem');
    } else {
      setNewMessage('');
    }
    setSending(false);
  };

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        <NavLink to="/" icon={ArrowLeft} label="Voltar" className="mb-6" />

        <h1 className="text-2xl font-bold text-foreground mb-4">Comunidade de Peregrinos</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pilgrims')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'pilgrims'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" /> Peregrinos
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'messages'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Send className="w-4 h-4 inline mr-1" /> Mensagens
          </button>
        </div>

        {tab === 'pilgrims' && (
          <div className="space-y-3">
            {pilgrims.length === 0 && (
              <p className="text-muted-foreground text-center py-8">Nenhum peregrino ainda. Seja o primeiro!</p>
            )}
            {pilgrims.map((p) => (
              <div key={p.id} className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.display_name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{p.avatar_style}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <MapPin className="w-3 h-3" />
                      {PHASE_NAMES[p.current_phase] || 'Início'}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.total_choices} escolhas</p>
                  </div>
                </div>
                {p.bio && <p className="text-sm text-muted-foreground mt-2">{p.bio}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'messages' && (
          <div>
            {user && (
              <div className="flex gap-2 mb-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Compartilhe uma palavra com outros peregrinos..."
                  maxLength={140}
                  className="bg-card border-border"
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="icon" disabled={sending || !newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
            {!user && (
              <p className="text-sm text-muted-foreground text-center mb-4">
                Faça login para enviar mensagens
              </p>
            )}

            <div className="space-y-3">
              {messages.length === 0 && (
                <p className="text-muted-foreground text-center py-8">Nenhuma mensagem ainda.</p>
              )}
              {messages.map((m) => (
                <div key={m.id} className="bg-card rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {m.profiles?.display_name || 'Peregrino'}
                    </span>
                    <span className="text-xs text-muted-foreground">{timeAgo(m.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
