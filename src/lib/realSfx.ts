// ═══════════════════════════════════════════════════════
// REAL SFX ENGINE — High-quality OGG audio files
// CC0 licensed sounds from OpenGameArt / GitHub
// Falls back to Web Audio synthesis if loading fails
// ═══════════════════════════════════════════════════════

// Import all OGG files as static assets (Vite handles this)
import sfxCrowdCheer from '@/assets/sfx/crowd-cheer.ogg';
import sfxVictory from '@/assets/sfx/victory.ogg';
import sfxBlessing from '@/assets/sfx/blessing.ogg';
import sfxWrong from '@/assets/sfx/wrong.ogg';
import sfxTrap from '@/assets/sfx/trap.ogg';
import sfxWater from '@/assets/sfx/water.ogg';
import sfxCoin from '@/assets/sfx/coin.ogg';
import sfxCoins from '@/assets/sfx/coins.ogg';
import sfxChime from '@/assets/sfx/chime.ogg';
import sfxComplete from '@/assets/sfx/complete.ogg';
import sfxHit from '@/assets/sfx/hit.ogg';
import sfxShield from '@/assets/sfx/shield.ogg';
import sfxSplash from '@/assets/sfx/splash.ogg';
import sfxBell from '@/assets/sfx/bell.ogg';
import sfxSword from '@/assets/sfx/sword.ogg';
import sfxFireworks from '@/assets/sfx/fireworks.ogg';

// ─── Sound catalog ───
export type RealSfxName =
  | 'crowd_cheer' | 'victory' | 'blessing' | 'wrong'
  | 'trap' | 'water' | 'coin' | 'coins'
  | 'chime' | 'complete' | 'hit' | 'shield'
  | 'splash' | 'bell' | 'sword' | 'fireworks';

const SFX_MAP: Record<RealSfxName, string> = {
  crowd_cheer: sfxCrowdCheer,
  victory: sfxVictory,
  blessing: sfxBlessing,
  wrong: sfxWrong,
  trap: sfxTrap,
  water: sfxWater,
  coin: sfxCoin,
  coins: sfxCoins,
  chime: sfxChime,
  complete: sfxComplete,
  hit: sfxHit,
  shield: sfxShield,
  splash: sfxSplash,
  bell: sfxBell,
  sword: sfxSword,
  fireworks: sfxFireworks,
};

// ─── Audio cache for instant replay ───
const audioCache = new Map<string, HTMLAudioElement>();

function getOrCreateAudio(name: RealSfxName): HTMLAudioElement | null {
  const url = SFX_MAP[name];
  if (!url) return null;

  let audio = audioCache.get(name);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = 'auto';
    audioCache.set(name, audio);
  }
  return audio;
}

// ─── Play a real SFX ───
export function playRealSfx(name: RealSfxName, volume = 0.5): void {
  try {
    const audio = getOrCreateAudio(name);
    if (!audio) return;

    // Clone for overlapping plays
    const instance = audio.cloneNode(true) as HTMLAudioElement;
    instance.volume = Math.min(1, Math.max(0, volume));
    instance.play().catch(() => {
      // Silently fail if autoplay blocked
    });
  } catch {
    // Fallback: do nothing, Web Audio synth will handle it
  }
}

// ─── Preload critical sounds ───
export function preloadRealSfx(): void {
  const critical: RealSfxName[] = ['chime', 'hit', 'wrong', 'blessing', 'crowd_cheer', 'bell'];
  critical.forEach(name => {
    const audio = getOrCreateAudio(name);
    if (audio) {
      audio.load();
    }
  });
}

// ─── Tile-type to SFX mapping ───
export function getSfxForTileEvent(tileType: string, success: boolean): RealSfxName | null {
  if (success) {
    switch (tileType) {
      case 'scripture': case 'riddle': return 'chime';
      case 'challenge': return 'crowd_cheer';
      case 'boss': case 'giant': return 'victory';
      case 'blessing': case 'special': return 'blessing';
      case 'refuge': return 'bell';
      case 'surprise': return 'coins';
      case 'shield': return 'shield';
      case 'checkpoint': return 'complete';
      default: return 'coin';
    }
  } else {
    switch (tileType) {
      case 'boss': case 'giant': return 'hit';
      case 'trap': case 'back_to_start': return 'trap';
      case 'current': return 'splash';
      default: return 'wrong';
    }
  }
}

// ─── Contextual SFX for narrative moments ───
export function playNarrativeSfx(context: string): void {
  if (context.includes('espada') || context.includes('Apolião') || context.includes('combate')) {
    playRealSfx('sword', 0.4);
  } else if (context.includes('água') || context.includes('rio') || context.includes('pântano')) {
    playRealSfx('water', 0.3);
  } else if (context.includes('vitória') || context.includes('Celestial')) {
    playRealSfx('fireworks', 0.4);
  } else if (context.includes('armadilha') || context.includes('sombra') || context.includes('Gigante')) {
    playRealSfx('trap', 0.4);
  } else if (context.includes('bênção') || context.includes('Beulá') || context.includes('Palácio')) {
    playRealSfx('blessing', 0.4);
  } else if (context.includes('tesouro') || context.includes('moeda') || context.includes('prata')) {
    playRealSfx('coins', 0.3);
  } else {
    playRealSfx('chime', 0.3);
  }
}
