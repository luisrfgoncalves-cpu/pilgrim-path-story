import { PlayerAttributes } from '@/hooks/useStoryProgress';

/**
 * Game Loop Utilities
 * 
 * Streak tracking, micro-rewards, contextual messages,
 * and surprise system for retention.
 */

// ─── Streak System ───

export interface StreakInfo {
  /** Consecutive days played (from localStorage) */
  days: number;
  /** Whether today is a new day (show reward) */
  isNewDay: boolean;
  /** Bonus message for streak */
  message: string | null;
  /** Attribute bonus for maintaining streak */
  bonus: Partial<Record<keyof PlayerAttributes, number>> | null;
}

const STREAK_KEY = 'peregrino-streak';

interface StreakData {
  lastPlayDate: string;
  count: number;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function getStreak(): StreakInfo {
  const today = todayStr();
  let data: StreakData = { lastPlayDate: '', count: 0 };

  try {
    const saved = localStorage.getItem(STREAK_KEY);
    if (saved) data = JSON.parse(saved);
  } catch {}

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let isNewDay = false;
  let count = data.count;

  if (data.lastPlayDate === today) {
    // Already played today
    isNewDay = false;
  } else if (data.lastPlayDate === yesterdayStr) {
    // Consecutive day
    count += 1;
    isNewDay = true;
  } else if (data.lastPlayDate) {
    // Streak broken
    count = 1;
    isNewDay = true;
  } else {
    // First time
    count = 1;
    isNewDay = true;
  }

  // Save updated
  localStorage.setItem(STREAK_KEY, JSON.stringify({ lastPlayDate: today, count }));

  const message = isNewDay ? getStreakMessage(count) : null;
  const bonus = isNewDay && count >= 3 ? getStreakBonus(count) : null;

  return { days: count, isNewDay, message, bonus };
}

function getStreakMessage(days: number): string {
  if (days >= 7) return `${days} dias seguidos! Sua perseverança é admirável.`;
  if (days >= 5) return `${days} dias de jornada contínua! O caminho se aclara.`;
  if (days >= 3) return `${days} dias seguidos! A constância fortalece sua fé.`;
  return 'Bem-vindo de volta, peregrino.';
}

function getStreakBonus(days: number): Partial<Record<keyof PlayerAttributes, number>> {
  if (days >= 7) return { fe: 1, perseveranca: 1 };
  if (days >= 5) return { perseveranca: 1 };
  return { fe: 1 };
}

// ─── Contextual Dashboard Messages ───

export function getDashboardMessage(
  attrs: PlayerAttributes,
  choicesMade: number,
  phase: number,
  playthrough: number,
): string {
  // Phase-specific motivational messages
  if (choicesMade === 0) {
    return playthrough > 1
      ? 'Uma nova jornada espera. O caminho será diferente desta vez.'
      : 'A Cidade da Destruição fica para trás. Seu destino aguarda.';
  }

  const avg = (attrs.fe + attrs.coragem + attrs.perseveranca + attrs.discernimento) / 4;

  if (avg >= 8) return 'Sua luz brilha forte. Continue firme até o fim.';
  if (avg >= 6) {
    const msgs = [
      'O caminho se mostra claro diante de você.',
      'Seus passos ecoam com propósito.',
      'A jornada tem fortalecido seu espírito.',
    ];
    return msgs[choicesMade % msgs.length];
  }
  if (avg >= 4) {
    const msgs = [
      'O caminho é difícil, mas há esperança adiante.',
      'Cada passo conta, mesmo os mais pesados.',
      'Persevere — a luz está mais perto do que parece.',
    ];
    return msgs[choicesMade % msgs.length];
  }

  const msgs = [
    'As sombras são densas, mas você ainda caminha.',
    'Mesmo abatido, o fato de continuar é prova de força.',
    'Não desista. O vale da sombra tem fim.',
  ];
  return msgs[choicesMade % msgs.length];
}

// ─── Surprise / Micro-reward System ───

export type SurpriseType = 'insight' | 'blessing' | 'whisper' | 'memory';

export interface Surprise {
  type: SurpriseType;
  title: string;
  message: string;
  icon: string;
  attrBonus?: Partial<Record<keyof PlayerAttributes, number>>;
}

/**
 * Roll for a random surprise on scene entry.
 * ~20% chance per scene, influenced by attributes.
 */
export function rollForSurprise(
  attrs: PlayerAttributes,
  chapterId: string,
  choicesMade: number,
): Surprise | null {
  // Base 20% chance, +2% per point of fé above 5
  const chance = 0.20 + Math.max(0, (attrs.fe - 5) * 0.02);
  if (Math.random() > chance) return null;

  const pool = getSurprisePool(attrs, choicesMade);
  return pool[Math.floor(Math.random() * pool.length)];
}

function getSurprisePool(attrs: PlayerAttributes, choicesMade: number): Surprise[] {
  const surprises: Surprise[] = [
    {
      type: 'insight',
      title: 'Momento de Clareza',
      message: 'Uma compreensão profunda ilumina sua mente por um instante.',
      icon: '💡',
      attrBonus: { discernimento: 1 },
    },
    {
      type: 'blessing',
      title: 'Bênção Inesperada',
      message: 'Uma paz inexplicável envolve seu coração.',
      icon: '✨',
      attrBonus: { fe: 1 },
    },
    {
      type: 'whisper',
      title: 'Sussurro do Caminho',
      message: 'O vento parece carregar palavras de encorajamento.',
      icon: '🌬️',
      attrBonus: { coragem: 1 },
    },
    {
      type: 'memory',
      title: 'Lembrança Fortalecedora',
      message: 'Uma memória distante renova suas forças para seguir em frente.',
      icon: '🕯️',
      attrBonus: { perseveranca: 1 },
    },
  ];

  // Add rarer surprises after more progress
  if (choicesMade >= 10) {
    surprises.push({
      type: 'blessing',
      title: 'Encontro Providencial',
      message: 'Um viajante desconhecido lhe oferece palavras que tocam sua alma.',
      icon: '🤝',
      attrBonus: { fe: 1, coragem: 1 },
    });
  }

  if (attrs.perseveranca >= 7) {
    surprises.push({
      type: 'insight',
      title: 'Fruto da Perseverança',
      message: 'Sua constância revela um segredo que outros não percebem.',
      icon: '🔑',
      attrBonus: { discernimento: 1, perseveranca: 1 },
    });
  }

  return surprises;
}

// ─── Progress Milestones ───

export interface Milestone {
  label: string;
  icon: string;
  reached: boolean;
}

export function getMilestones(choicesMade: number, visitedCount: number, attrs: PlayerAttributes): Milestone[] {
  return [
    { label: 'Primeiro Passo', icon: '👣', reached: choicesMade >= 1 },
    { label: '10 Decisões', icon: '⚖️', reached: choicesMade >= 10 },
    { label: '25 Decisões', icon: '🏔️', reached: choicesMade >= 25 },
    { label: 'Fé Inabalável', icon: '🔥', reached: attrs.fe >= 9 },
    { label: 'Coração Valente', icon: '🛡️', reached: attrs.coragem >= 9 },
    { label: 'Explorador', icon: '🗺️', reached: visitedCount >= 15 },
  ];
}
