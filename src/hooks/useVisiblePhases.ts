/**
 * Lazy loading by phase — only mount current phase + neighbors
 * Phases outside the window are unmounted from DOM (freeing RAM)
 */
import { useMemo } from 'react';
import { TILES_PER_PHASE, PHASES } from '@/components/multiplayer/ImmersiveBoardTypes';

/**
 * Given the current leading player position, returns which phase indices should be rendered.
 * Always includes current phase + next phase (for smooth scroll transition).
 * Previous phase is also included if player is near the phase boundary.
 */
export function useVisiblePhases(players: { position: number; finished: boolean }[]): Set<number> {
  return useMemo(() => {
    const visible = new Set<number>();

    // Find all active player phases
    const activePositions = players
      .filter(p => !p.finished)
      .map(p => p.position);

    if (activePositions.length === 0) {
      // All finished — show last phase
      visible.add(PHASES.length - 1);
      return visible;
    }

    // Get the range of phases occupied by active players
    const minPhase = Math.floor(Math.min(...activePositions) / TILES_PER_PHASE);
    const maxPhase = Math.floor(Math.max(...activePositions) / TILES_PER_PHASE);

    // Always render all phases between min and max player positions
    for (let p = minPhase; p <= maxPhase; p++) {
      visible.add(p);
    }

    // Add one phase before the earliest player (for scroll back)
    if (minPhase > 0) visible.add(minPhase - 1);

    // Add one phase after the latest player (for scroll forward)
    if (maxPhase < PHASES.length - 1) visible.add(maxPhase + 1);

    return visible;
  }, [players.map(p => `${p.position}-${p.finished}`).join(',')]);
}
