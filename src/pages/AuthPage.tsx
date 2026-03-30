import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isEmailAllowed } from '@/data/allowedEmails';
import { User, LogIn, UserPlus, KeyRound, Smartphone, Share2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    if (mode !== 'signup') setDisplayName('');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === 'forgot') {
      if (!email) {
        toast.error('Digite seu email de cadastro');
        setSubmitting(false);
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
      }
      setSubmitting(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Bem-vindo de volta, peregrino!');
        navigate('/');
      }
    } else {
      if (!displayName.trim()) {
        toast.error('Escolha um nome para o seu peregrino');
        setSubmitting(false);
        return;
      }
      // Verificar se o email está na lista de acessos autorizados
      const emailCheck = await isEmailAllowed(email);
      if (!emailCheck.allowed) {
        toast.error(emailCheck.reason || 'Email não autorizado.');
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Conta criada! Bem-vindo, peregrino!');
        navigate('/');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            {mode === 'forgot' ? (
              <KeyRound className="w-8 h-8 text-primary" />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'login' ? 'Entrar na Jornada' : mode === 'signup' ? 'Iniciar sua Peregrinação' : 'Recuperar Senha'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {mode === 'login'
              ? 'Continue sua caminhada rumo à Cidade Celestial'
              : mode === 'signup'
              ? 'Junte-se a outros peregrinos nesta jornada'
              : 'Digite seu email para receber o link de recuperação'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nome do Peregrino</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Como quer ser chamado?"
                className="bg-card border-border"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input
              type="email"
              name="login_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail de acesso"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              required
              className="bg-card border-border"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Senha</label>
              <Input
                type="password"
                name="login_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={6}
                className="bg-card border-border"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              'Aguarde...'
            ) : mode === 'login' ? (
              <><LogIn className="w-4 h-4 mr-2" /> Entrar</>
            ) : mode === 'signup' ? (
              <><UserPlus className="w-4 h-4 mr-2" /> Criar Conta</>
            ) : (
              <><KeyRound className="w-4 h-4 mr-2" /> Enviar Link de Recuperação</>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'forgot' ? (
            <button
              onClick={() => setMode('login')}
              className="text-sm text-primary hover:underline"
            >
              Voltar ao login
            </button>
          ) : (
            <>
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'login' ? 'Não tem conta? Crie uma agora' : 'Já tem conta? Entre aqui'}
              </button>
              {mode === 'login' && (
                <button
                  onClick={() => setMode('forgot')}
                  className="block mx-auto text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  <KeyRound className="w-3 h-3 inline mr-1" />
                  Esqueceu a senha?
                </button>
              )}
            </>
          )}
        </div>

        {/* iOS Install Banner */}
        <IOSInstallBanner />
      </div>
    </div>
  );
};

/** Shows install instructions for iOS users who haven't installed the PWA */
const IOSInstallBanner = () => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
  const [dismissed, setDismissed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  if (!isIOS || isStandalone || dismissed || sessionStorage.getItem('ios_install_dismissed') === '1') return null;

  return (
    <>
      <div
        className="mt-6 rounded-xl border border-primary/30 p-4 text-center space-y-2"
        style={{
          background: 'linear-gradient(135deg, hsl(40 20% 10%), hsl(40 10% 6%))',
          boxShadow: '0 0 20px hsl(40 70% 50% / 0.15)',
        }}
      >
        <div className="flex items-center justify-center gap-2 text-primary">
          <Smartphone className="w-5 h-5" />
          <span className="font-display text-sm font-bold">Instale o App no iPhone!</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Adicione à sua tela inicial para uma experiência completa
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setShowSteps(true)}
            className="px-4 py-2 text-xs font-display font-bold rounded-lg bg-primary text-primary-foreground hover:scale-105 transition-transform"
            style={{ boxShadow: '0 0 12px hsl(40 70% 50% / 0.3)' }}
          >
            Como Instalar
          </button>
          <button
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem('ios_install_dismissed', '1');
            }}
            className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Agora não
          </button>
        </div>
      </div>

      {showSteps && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
          onClick={() => setShowSteps(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-primary/30 p-6 space-y-4"
            style={{ background: 'linear-gradient(180deg, hsl(40 20% 10%), hsl(40 10% 6%))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg text-foreground font-bold">Instalar no iPhone</h3>
            </div>
            <div className="space-y-3 text-sm text-foreground/80">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <p>Toque no ícone de <strong className="text-foreground">Compartilhar</strong> <Share2 className="w-4 h-4 inline text-primary" /> na barra do Safari</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <p>Role e toque em <strong className="text-foreground">"Adicionar à Tela de Início"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <p>Toque em <strong className="text-foreground">"Adicionar"</strong> no canto superior direito</p>
              </div>
            </div>
            <button
              onClick={() => setShowSteps(false)}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:scale-[1.02] transition-transform"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthPage;
