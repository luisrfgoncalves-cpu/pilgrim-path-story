import { supabase } from '@/lib/supabase';

/**
 * Verifica se o email está na lista de acessos autorizados no Supabase
 * e se ainda não foi usado por outro usuário.
 */
export const isEmailAllowed = async (email: string): Promise<{ allowed: boolean; reason?: string }> => {
  const normalizedEmail = email.toLowerCase().trim();
  
  const { data, error } = await supabase
    .from('allowed_emails')
    .select('id, used')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error('Erro ao verificar email:', error);
    // Fallback: permitir (para não bloquear em caso de erro de rede)
    return { allowed: true };
  }

  if (!data) {
    return { allowed: false, reason: 'Este email não possui acesso autorizado. Adquira seu acesso em nossa página de vendas.' };
  }

  if (data.used) {
    return { allowed: false, reason: 'Este acesso já foi utilizado por outro usuário.' };
  }

  return { allowed: true };
};
