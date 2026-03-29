import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, LogOut, Bell, BellOff, Sun, Moon, BookOpen } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { requestNotificationPermission, isNotificationsEnabled, toggleNotifications } from '@/lib/notifications';

const AVATAR_STYLES = ['peregrino', 'monge', 'cavaleiro', 'eremita', 'profeta'];
const JOURNEY_PREFS = ['contemplativa', 'aventureira', 'devocional', 'exploratória'];

const ProfilePage: React.FC = () => {
  const { profile, updateProfile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarStyle, setAvatarStyle] = useState(profile?.avatar_style || 'peregrino');
  const [journeyPref, setJourneyPref] = useState(profile?.journey_preference || 'contemplativa');
  const [saving, setSaving] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(isNotificationsEnabled());

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      display_name: displayName,
      bio,
      avatar_style: avatarStyle,
      journey_preference: journeyPref,
    });
    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado!');
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Até breve, peregrino!');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        <NavLink to="/" className="text-sm text-primary hover:underline flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </NavLink>

        <h1 className="text-2xl font-bold text-foreground mb-6">Perfil do Peregrino</h1>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Nome</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-card border-border"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Bio curta</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Uma breve descrição da sua jornada..."
              maxLength={200}
              className="bg-card border-border resize-none"
              rows={3}
            />
            <span className="text-xs text-muted-foreground">{bio.length}/200</span>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Estilo do Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setAvatarStyle(s)}
                  className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                    avatarStyle === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Preferência de Jornada</label>
            <div className="flex flex-wrap gap-2">
              {JOURNEY_PREFS.map((p) => (
                <button
                  key={p}
                  onClick={() => setJourneyPref(p)}
                  className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                    journeyPref === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="pt-4 border-t border-border space-y-3">
            <h2 className="text-sm font-display text-foreground">Configurações</h2>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Tema {theme === 'dark' ? 'Escuro' : 'Claro'}
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-md text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <BookOpen className="w-4 h-4" />
                Tutorial
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('peregrino-onboarding-done');
                  toast.success('Tutorial será exibido ao voltar à tela inicial!');
                }}
                className="px-3 py-1.5 rounded-md text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Rever Tutorial
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                {notifEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                Notificações
              </div>
              <button
                onClick={async () => {
                  if (!notifEnabled) {
                    const ok = await requestNotificationPermission();
                    setNotifEnabled(ok);
                    if (ok) toast.success('Notificações ativadas!');
                    else toast.error('Permissão negada pelo navegador');
                  } else {
                    toggleNotifications(false);
                    setNotifEnabled(false);
                    toast.success('Notificações desativadas');
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  notifEnabled 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {notifEnabled ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Perfil'}
            </Button>

            <Button onClick={handleSignOut} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {user && (
            <p className="text-xs text-muted-foreground text-center">
              {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
