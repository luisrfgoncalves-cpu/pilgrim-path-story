// Lista de emails de acesso autorizados para o app O Peregrino
// Cada email é único e deve ser vendido para apenas uma pessoa
// Supabase Auth impede que dois usuários usem o mesmo email

const allowedEmails: string[] = [];

for (let i = 1; i <= 100; i++) {
  const num = String(i).padStart(4, '0');
  allowedEmails.push(`peregrino${num}@centrobiblico.online`);
}

export const ALLOWED_EMAILS = allowedEmails;

export const isEmailAllowed = (email: string): boolean => {
  return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
};
