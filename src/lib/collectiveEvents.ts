/**
 * Collective Events System
 * 
 * Weekly challenges that rotate automatically based on the current week.
 * Progress is calculated from real player data (profiles + support).
 * Rewards are attribute bonuses applied when the event goal is met.
 */

export interface CollectiveEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: 'attribute_goal' | 'support_goal' | 'progress_goal';
  /** Which attribute to track (for attribute_goal) */
  targetAttr?: string;
  /** Minimum value required per player */
  targetValue?: number;
  /** Total collective count needed (for support/progress goals) */
  targetCount: number;
  /** Reward granted to all participants */
  reward: { attr: string; value: number; label: string };
  /** Duration label */
  duration: string;
}

// Pool of rotating events — one per week
const EVENT_POOL: CollectiveEvent[] = [
  {
    id: 'perseverance_week',
    title: 'Semana da Perseverança',
    description: 'Todos devem manter perseverança acima de 7. Avance na jornada para fortalecer sua perseverança.',
    emoji: '🏔️',
    type: 'attribute_goal',
    targetAttr: 'perseveranca',
    targetValue: 7,
    targetCount: 5,
    reward: { attr: 'perseveranca', value: 2, label: '+2 Perseverança' },
    duration: '7 dias',
  },
  {
    id: 'faith_united',
    title: 'Fé Unida',
    description: 'A comunidade precisa enviar 20 orações coletivamente. Apoie outros peregrinos com oração.',
    emoji: '🙏',
    type: 'support_goal',
    targetCount: 20,
    reward: { attr: 'fe', value: 2, label: '+2 Fé' },
    duration: '7 dias',
  },
  {
    id: 'courage_challenge',
    title: 'Desafio da Coragem',
    description: 'Pelo menos 5 peregrinos devem alcançar coragem acima de 8. Faça escolhas corajosas!',
    emoji: '⚔️',
    type: 'attribute_goal',
    targetAttr: 'coragem',
    targetValue: 8,
    targetCount: 5,
    reward: { attr: 'coragem', value: 2, label: '+2 Coragem' },
    duration: '7 dias',
  },
  {
    id: 'community_bonds',
    title: 'Laços da Comunidade',
    description: 'Envie 30 apoios simbólicos entre peregrinos. Juntos somos mais fortes.',
    emoji: '🤝',
    type: 'support_goal',
    targetCount: 30,
    reward: { attr: 'discernimento', value: 2, label: '+2 Discernimento' },
    duration: '7 dias',
  },
  {
    id: 'pilgrim_advance',
    title: 'Marcha dos Peregrinos',
    description: '10 peregrinos devem tomar pelo menos 5 decisões esta semana. Avance na jornada!',
    emoji: '🚶',
    type: 'progress_goal',
    targetCount: 10,
    reward: { attr: 'fe', value: 1, label: '+1 Fé para todos' },
    duration: '7 dias',
  },
  {
    id: 'blessing_rain',
    title: 'Chuva de Bênçãos',
    description: 'Envie 25 bênçãos coletivamente. Que a perseverança de todos seja fortalecida.',
    emoji: '✨',
    type: 'support_goal',
    targetCount: 25,
    reward: { attr: 'perseveranca', value: 2, label: '+2 Perseverança' },
    duration: '7 dias',
  },
  {
    id: 'valley_shadows',
    title: 'Travessia do Vale da Sombra',
    description: 'Pelo menos 8 peregrinos devem completar a Fase 3 (Vale da Humilhação e Sombra da Morte) esta semana.',
    emoji: '💀',
    type: 'progress_goal',
    targetCount: 8,
    reward: { attr: 'coragem', value: 3, label: '+3 Coragem' },
    duration: '7 dias',
  },
  {
    id: 'armor_of_god',
    title: 'Armadura Completa',
    description: 'A comunidade precisa enviar 40 apoios de oração. Vistam toda a armadura de Deus!',
    emoji: '🛡️',
    type: 'support_goal',
    targetCount: 40,
    reward: { attr: 'fe', value: 2, label: '+2 Fé' },
    duration: '7 dias',
  },
  {
    id: 'vanity_fair_resistance',
    title: 'Resistência na Feira da Vaidade',
    description: 'Pelo menos 5 peregrinos devem manter discernimento acima de 7 ao passar pela Fase 4.',
    emoji: '🎪',
    type: 'attribute_goal',
    targetAttr: 'discernimento',
    targetValue: 7,
    targetCount: 5,
    reward: { attr: 'discernimento', value: 3, label: '+3 Discernimento' },
    duration: '7 dias',
  },
  {
    id: 'key_of_promise',
    title: 'A Chave da Promessa',
    description: 'Que 6 peregrinos encontrem e usem a Chave da Promessa no Castelo da Dúvida esta semana!',
    emoji: '🗝️',
    type: 'progress_goal',
    targetCount: 6,
    reward: { attr: 'perseveranca', value: 3, label: '+3 Perseverança' },
    duration: '7 dias',
  },
  {
    id: 'celestial_approach',
    title: 'Marcha à Cidade Celestial',
    description: 'Pelo menos 3 peregrinos devem completar a jornada inteira (Fase 6) esta semana.',
    emoji: '🏙️',
    type: 'progress_goal',
    targetCount: 3,
    reward: { attr: 'fe', value: 3, label: '+3 Fé para todos' },
    duration: '7 dias',
  },

  // ═══ Eventos coletivos da Parte II ═══
  {
    id: 'crista_journey',
    title: 'Jornada de Cristã',
    description: 'Pelo menos 5 peregrina(o)s devem iniciar a Parte II esta semana. Sigam os passos de Cristã!',
    emoji: '👩',
    type: 'progress_goal',
    targetCount: 5,
    reward: { attr: 'perseveranca', value: 2, label: '+2 Perseverança' },
    duration: '7 dias',
  },
  {
    id: 'giant_slayer',
    title: 'Matadores de Gigantes',
    description: 'A comunidade precisa destruir o Castelo da Dúvida na Parte II coletivamente. 4 peregrinos devem completar a Fase 5 da Parte II.',
    emoji: '🗡️',
    type: 'progress_goal',
    targetCount: 4,
    reward: { attr: 'coragem', value: 3, label: '+3 Coragem' },
    duration: '7 dias',
  },
  {
    id: 'mercy_and_compassion',
    title: 'Misericórdia e Compaixão',
    description: 'Envie 25 apoios de encorajamento a outros peregrinos. Como Misericórdia, vá sem carta — vá com amor.',
    emoji: '💝',
    type: 'support_goal',
    targetCount: 25,
    reward: { attr: 'fe', value: 2, label: '+2 Fé' },
    duration: '7 dias',
  },
  {
    id: 'valiant_for_truth',
    title: 'Valentes pela Verdade',
    description: 'Pelo menos 6 peregrinos devem alcançar coragem acima de 9. Empunhem a espada de Jerusalém!',
    emoji: '⚔️',
    type: 'attribute_goal',
    targetAttr: 'coragem',
    targetValue: 9,
    targetCount: 6,
    reward: { attr: 'coragem', value: 2, label: '+2 Coragem' },
    duration: '7 dias',
  },
  {
    id: 'river_crossing_together',
    title: 'Travessia Coletiva do Rio',
    description: 'Pelo menos 3 peregrinos devem completar a Parte II inteira (Fase 6) esta semana. Cantem como Muito-Medo!',
    emoji: '🌊',
    type: 'progress_goal',
    targetCount: 3,
    reward: { attr: 'fe', value: 3, label: '+3 Fé para todos' },
    duration: '7 dias',
  },
];

/** Get the current week number (ISO) */
function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

/** Get the current active event based on the week */
export function getCurrentEvent(): CollectiveEvent {
  const week = getWeekNumber();
  return EVENT_POOL[week % EVENT_POOL.length];
}

/** Get the next event (preview) */
export function getNextEvent(): CollectiveEvent {
  const week = getWeekNumber();
  return EVENT_POOL[(week + 1) % EVENT_POOL.length];
}

/** Days remaining in the current week */
export function getDaysRemaining(): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  return 7 - dayOfWeek;
}

/** Get the start of the current week (Sunday) */
export function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

/** Reward storage key */
const REWARD_KEY = 'peregrino-event-reward';

export function hasClaimedReward(eventId: string): boolean {
  try {
    const claimed = JSON.parse(localStorage.getItem(REWARD_KEY) || '{}');
    const week = getWeekNumber();
    return claimed[`${eventId}-${week}`] === true;
  } catch { return false; }
}

export function claimReward(eventId: string): void {
  try {
    const claimed = JSON.parse(localStorage.getItem(REWARD_KEY) || '{}');
    const week = getWeekNumber();
    claimed[`${eventId}-${week}`] = true;
    localStorage.setItem(REWARD_KEY, JSON.stringify(claimed));
  } catch {}
}
