import { ChainState } from './types';

// ═══════════════════════════════════════════════════════
// SISTEMA DE CONSEQUÊNCIAS EM CADEIA
// Decisões passadas afetam eventos futuros
// ═══════════════════════════════════════════════════════

export function createChainState(): ChainState {
  return {
    flags: new Set(),
    history: [],
  };
}

export function setChainFlag(state: ChainState, flag: string, turn: number, playerId: string) {
  state.flags.add(flag);
  state.history.push({ flag, turn, playerId });
}

export function hasChainFlag(state: ChainState, flag: string): boolean {
  return state.flags.has(flag);
}

/** Get narrative modifier based on chain history */
export function getChainNarrativeModifier(state: ChainState): string {
  const flagCount = state.flags.size;
  if (flagCount >= 8) return 'O Mestre observa o grupo com admiração — vocês carregam a sabedoria de muitas provações superadas.';
  if (flagCount >= 5) return 'O caminho já deixou marcas em vocês — cicatrizes de batalha e memórias de vitória.';
  if (flagCount >= 3) return 'Alguns eventos anteriores ecoam neste momento...';
  return '';
}

/** Check if a chain condition is met and return modified content */
export function applyChainCondition(
  state: ChainState,
  condition?: { requiredFlag: string; altContext?: string; altNarrative?: string }
): { modified: boolean; altContext?: string; altNarrative?: string } {
  if (!condition) return { modified: false };
  if (state.flags.has(condition.requiredFlag)) {
    return { modified: true, altContext: condition.altContext, altNarrative: condition.altNarrative };
  }
  return { modified: false };
}
