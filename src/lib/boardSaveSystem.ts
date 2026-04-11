// ═══════════════════════════════════════════════════════
// SISTEMA DE SALVAR / RETOMAR PARTIDA
// Persiste o estado do tabuleiro em LocalStorage
// ═══════════════════════════════════════════════════════

const SAVE_KEY = 'rpg_board_save';
const SAVE_VERSION = 1;

export interface BoardSaveData {
  version: number;
  savedAt: string;
  // Game config
  difficulty: string;
  gameMode: string;
  hostIndex: number;
  // Board state
  tileTypes: string[];
  currentTurn: number;
  finishCount: number;
  // Players
  players: Array<{
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
    lastPhase: number;
    characterId?: string;
    shieldHits?: number;
  }>;
}

export function saveGame(data: BoardSaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}

export function loadGame(): BoardSaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as BoardSaveData;
    if (data.version !== SAVE_VERSION) return null;
    // Verify it's not too old (48 hours)
    const savedAt = new Date(data.savedAt).getTime();
    if (Date.now() - savedAt > 48 * 60 * 60 * 1000) {
      clearSave();
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}

export function hasSavedGame(): boolean {
  return loadGame() !== null;
}
