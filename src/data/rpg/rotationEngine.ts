import { Difficulty, ResponseMode, TileEventType, RotationState, ScriptureQuestion } from './types';
import { scriptureQuestions } from './questions';
import { riddles } from './riddles';
import { moralDilemmas } from './dilemmas';
import { activeChallenges } from './challenges';
import { bossEncounters } from './bosses';
import { specialEvents, trapEvents, refugeEvents } from './specialEvents';

export type { RotationState };

// ═══════════════════════════════════════════════════════
// MOTOR DE ROTAÇÃO ANTI-REPETIÇÃO
// Garante que conteúdo não se repete na mesma sessão
// ═══════════════════════════════════════════════════════

export function createRotationState(): RotationState {
  return {
    usedQuestions: new Set(),
    usedRiddles: new Set(),
    usedDilemmas: new Set(),
    usedChallenges: new Set(),
    usedBosses: new Set(),
    usedSpecials: new Set(),
    usedTraps: new Set(),
  };
}

function pickRandom<T extends { id: string; difficulty?: Difficulty }>(
  items: T[],
  usedSet: Set<string>,
  difficulty?: Difficulty
): T | null {
  let filtered = difficulty
    ? items.filter(i => (i as any).difficulty === difficulty)
    : items;

  // Filter out used items
  let available = filtered.filter(i => !usedSet.has(i.id));

  // If all used, reset rotation for this category
  if (available.length === 0) {
    const usedIds = filtered.map(i => i.id);
    usedIds.forEach(id => usedSet.delete(id));
    available = filtered;
  }

  if (available.length === 0) return null;

  const picked = available[Math.floor(Math.random() * available.length)];
  usedSet.add(picked.id);
  return picked;
}

// ═══════ PUBLIC API ═══════

export function getRandomQuestion(state: RotationState, difficulty: Difficulty) {
  return pickRandom(scriptureQuestions, state.usedQuestions, difficulty);
}

export function getRandomRiddle(state: RotationState, difficulty: Difficulty) {
  return pickRandom(riddles, state.usedRiddles, difficulty);
}

export function getRandomDilemma(state: RotationState, difficulty: Difficulty) {
  return pickRandom(moralDilemmas, state.usedDilemmas, difficulty);
}

export function getRandomChallenge(state: RotationState, difficulty: Difficulty) {
  return pickRandom(activeChallenges, state.usedChallenges, difficulty);
}

export function getRandomBoss(state: RotationState, difficulty: Difficulty) {
  return pickRandom(bossEncounters, state.usedBosses, difficulty);
}

export function getRandomSpecialEvent(state: RotationState, difficulty: Difficulty) {
  return pickRandom(specialEvents, state.usedSpecials, difficulty);
}

export function getRandomTrap(state: RotationState) {
  return pickRandom(trapEvents, state.usedTraps);
}

export function getRandomRefuge(state: RotationState) {
  return pickRandom(refugeEvents, state.usedTraps); // shares pool to avoid overuse
}

/** Pick a random response mode for this tile */
export function getRandomResponseMode(): ResponseMode {
  const modes: ResponseMode[] = [
    'individual_solo',
    'individual_group_help',
    'group_consensus',
    'secret_vote',
    'group_picks_one',
  ];
  return modes[Math.floor(Math.random() * modes.length)];
}

/** Pick a random tile event type (weighted) */
export function getRandomTileEventType(position: number, totalTiles: number): TileEventType {
  // Narrative tiles at key positions
  const narrativePositions = [0, Math.floor(totalTiles * 0.16), Math.floor(totalTiles * 0.33),
    Math.floor(totalTiles * 0.5), Math.floor(totalTiles * 0.66), Math.floor(totalTiles * 0.83), totalTiles - 1];
  if (narrativePositions.includes(position)) return 'narrative';

  // Boss at specific phase boundaries
  const bossPositions = [
    Math.floor(totalTiles * 0.2),
    Math.floor(totalTiles * 0.4),
    Math.floor(totalTiles * 0.6),
    Math.floor(totalTiles * 0.8),
    totalTiles - 2,
  ];
  if (bossPositions.includes(position)) return 'boss';

  // Weighted random for the rest
  const roll = Math.random() * 100;
  if (roll < 25) return 'scripture';      // 25%
  if (roll < 40) return 'riddle';         // 15%
  if (roll < 52) return 'challenge';      // 12%
  if (roll < 64) return 'dilemma';        // 12%
  if (roll < 74) return 'trap';           // 10%
  if (roll < 84) return 'refuge';         // 10%
  if (roll < 94) return 'special';        // 10%
  return 'scripture';                      // 6% fallback
}

/** Generate response mode label in Portuguese */
export function getResponseModeLabel(mode: ResponseMode): string {
  switch (mode) {
    case 'individual_solo': return '🎯 INDIVIDUAL — Sem ajuda do grupo!';
    case 'individual_group_help': return '🤝 INDIVIDUAL — O grupo pode ajudar!';
    case 'group_consensus': return '👥 GRUPO — Decidam juntos!';
    case 'secret_vote': return '🗳️ VOTAÇÃO SECRETA — Cada um vota!';
    case 'group_picks_one': return '👆 GRUPO ESCOLHE — Escolham quem responde!';
  }
}

/** Get tile event type emoji and label */
export function getTileEventLabel(type: TileEventType): { emoji: string; label: string; color: string } {
  switch (type) {
    case 'scripture': return { emoji: '📖', label: 'Escritura', color: '#4A90D9' };
    case 'riddle': return { emoji: '🧩', label: 'Charada', color: '#9B59B6' };
    case 'challenge': return { emoji: '⚔️', label: 'Desafio', color: '#E67E22' };
    case 'dilemma': return { emoji: '⚖️', label: 'Dilema', color: '#E74C3C' };
    case 'boss': return { emoji: '👹', label: 'Confronto', color: '#C0392B' };
    case 'refuge': return { emoji: '🏰', label: 'Refúgio', color: '#27AE60' };
    case 'trap': return { emoji: '🕸️', label: 'Armadilha', color: '#8B0000' };
    case 'special': return { emoji: '✨', label: 'Evento', color: '#F1C40F' };
    case 'narrative': return { emoji: '📜', label: 'Narrativa', color: '#D4A574' };
  }
}

/** Get content stats for display */
export function getContentStats() {
  return {
    questions: scriptureQuestions.length,
    riddles: riddles.length,
    dilemmas: moralDilemmas.length,
    challenges: activeChallenges.length,
    bosses: bossEncounters.length,
    specialEvents: specialEvents.length,
    traps: trapEvents.length,
    refuges: refugeEvents.length,
    total: scriptureQuestions.length + riddles.length + moralDilemmas.length +
      activeChallenges.length + bossEncounters.length + specialEvents.length +
      trapEvents.length + refugeEvents.length,
  };
}
