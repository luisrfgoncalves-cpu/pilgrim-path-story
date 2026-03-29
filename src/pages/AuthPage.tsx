import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isEmailAllowed } from '@/data/allowedEmails';
import { User, LogIn, UserPlus, KeyRound } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

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

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-card border-border"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
      </div>
    </div>
  );
};

export default AuthPage;
