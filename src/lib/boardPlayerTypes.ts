import { getCharacter } from '@/data/rpg/characters';

export const COLORS = ['#E8724A', '#4CAF50', '#42A5F5', '#FFD54F', '#AB47BC', '#EF5350', '#26C6DA', '#FF7043'];
export const DEFAULT_NAMES = ['Cristão', 'Fiel', 'Esperança', 'Prudência', 'Caridade', 'Piedade', 'Evangelista', 'Socorro'];

export interface PlayerStats {
  trapsHit: number;
  challengesWon: number;
  challengesLost: number;
  blessingsReceived: number;
  giantsDefeated: number;
  giantsLost: number;
  scripturesCorrect: number;
  scripturesWrong: number;
  tilesVisited: number;
  maxStreak: number;
  currentStreak: number;
  backToStartCount: number;
  shieldsGained: number;
  swapsTriggered: number;
  phasesCompleted: number;
  riverCrossed: boolean;
}

export function emptyStats(): PlayerStats {
  return {
    trapsHit: 0, challengesWon: 0, challengesLost: 0,
    blessingsReceived: 0, giantsDefeated: 0, giantsLost: 0,
    scripturesCorrect: 0, scripturesWrong: 0, tilesVisited: 0,
    maxStreak: 0, currentStreak: 0, backToStartCount: 0,
    shieldsGained: 0, swapsTriggered: 0, phasesCompleted: 0,
    riverCrossed: false,
  };
}

export interface LocalPlayer {
  id: string;
  name: string;
  color: string;
  position: number;
  attributes: { fe: number; perseveranca: number; discernimento: number; coragem: number };
  lastDice: number | null;
  finished: boolean;
  finishOrder: number | null;
  isStunned: boolean;
  stunTurns: number;
  hasShield: boolean;
  checkpoint: number;
  extraTurn: boolean;
  stats: PlayerStats;
  lastPhase: number;
  characterId?: string;
  shieldHits?: number;
}

export function createPlayer(index: number, name?: string, characterId?: string): LocalPlayer {
  const char = characterId ? getCharacter(characterId) : undefined;
  const baseAttrs = { fe: 3, perseveranca: 3, discernimento: 3, coragem: 3 };
  if (char?.startingBonus) {
    for (const [key, val] of Object.entries(char.startingBonus)) {
      if (key in baseAttrs) {
        (baseAttrs as any)[key] += val;
      }
    }
  }
  return {
    id: `p${index}`,
    name: name || DEFAULT_NAMES[index] || `Jogador ${index + 1}`,
    color: char?.color || COLORS[index % COLORS.length],
    position: 0,
    attributes: baseAttrs,
    lastDice: null,
    finished: false,
    finishOrder: null,
    isStunned: false,
    stunTurns: 0,
    hasShield: false,
    checkpoint: 0,
    extraTurn: false,
    stats: emptyStats(),
    lastPhase: 0,
    characterId: characterId || undefined,
    shieldHits: 0,
  };
}
