/**
 * Scene Image Variation System
 * 
 * Applies CSS transforms to scene background images to create the illusion
 * of different camera angles/views from the same base image.
 * Each scene gets a unique "camera" position so scenes sharing the same
 * background image still look visually distinct.
 */

export interface ImageVariation {
  /** CSS object-position (e.g. 'center 20%') */
  objectPosition: string;
  /** CSS transform applied to the img */
  transform: string;
  /** Extra CSS filter on top of atmosphere */
  extraFilter?: string;
}

/**
 * Per-scene camera variation. Scenes using the same base image
 * get different zoom, pan, and crop to feel like different angles.
 */
const SCENE_VARIATIONS: Record<string, ImageVariation> = {
  // ── FASE 1: Cidade da Destruição — 5 scenes use the same image ──
  'cena1':  { objectPosition: 'center 30%', transform: 'scale(1.15)', extraFilter: 'brightness(0.85) contrast(1.1)' },
  'cena1b': { objectPosition: '60% 25%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.8) sepia(0.1)' },
  'cena2':  { objectPosition: '30% 40%',   transform: 'scale(1.25)', extraFilter: 'brightness(0.9)' },
  'cena3':  { objectPosition: '70% 20%',   transform: 'scale(1.3)',  extraFilter: 'brightness(0.75) contrast(1.15)' },
  'cena4':  { objectPosition: '40% 50%',   transform: 'scale(1.1)',  extraFilter: 'brightness(0.7) saturate(0.8)' },

  // Evangelista / Sabedoria
  'cena5':  { objectPosition: 'center 35%', transform: 'scale(1.05)', extraFilter: 'brightness(1.05) saturate(1.1)' },
  'cena8':  { objectPosition: '55% 30%',   transform: 'scale(1.15)', extraFilter: 'sepia(0.15) brightness(0.9)' },

  // Três Dorminhocoes
  'cena5b': { objectPosition: 'center 40%', transform: 'scale(1.1)' },
  'cena6':  { objectPosition: '35% 30%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.75) saturate(0.7)' },

  // Portão Estreito — multiple scenes
  'cena7':  { objectPosition: 'center 25%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.1) saturate(1.15)' },
  'cena7b': { objectPosition: '45% 35%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.8) contrast(1.2)' },
  'cena9':  { objectPosition: '55% 20%',   transform: 'scale(1.1)',  extraFilter: 'brightness(1.0)' },
  'cena9b': { objectPosition: '40% 30%',   transform: 'scale(1.2)' },

  // Monte Sinai
  'cena10': { objectPosition: 'center 20%', transform: 'scale(1.15)', extraFilter: 'brightness(0.7) contrast(1.3) saturate(0.6)' },

  // Pântano — multiple scenes with same image
  'cena11':  { objectPosition: 'center 35%', transform: 'scale(1.0)',  extraFilter: 'brightness(0.85) saturate(0.9)' },
  'cena11b': { objectPosition: '60% 40%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.8) saturate(0.8)' },
  'cena12':  { objectPosition: '35% 45%',   transform: 'scale(1.25)', extraFilter: 'brightness(0.7) saturate(0.7)' },
  'cena13':  { objectPosition: '50% 55%',   transform: 'scale(1.3)',  extraFilter: 'brightness(0.65) contrast(1.1) saturate(0.6)' },
  'cena14':  { objectPosition: '45% 30%',   transform: 'scale(1.1)',  extraFilter: 'brightness(0.9) saturate(1.1)' },
  'cena14b': { objectPosition: '55% 35%',   transform: 'scale(1.05)', extraFilter: 'brightness(0.95)' },

  // Cruz
  'cena15':  { objectPosition: 'center 20%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.15) saturate(1.2)' },
  'cena15b': { objectPosition: 'center 15%', transform: 'scale(1.05)', extraFilter: 'brightness(1.25) saturate(1.3)' },

  // ── FASE 2 ──
  'fase2-cena1': { objectPosition: 'center 30%', transform: 'scale(1.05)' },
  'fase2-cena2': { objectPosition: '40% 25%',   transform: 'scale(1.1)' },
  'fase2-cena3': { objectPosition: '60% 35%',   transform: 'scale(1.15)' },
  'fase2-cena4': { objectPosition: '35% 40%',   transform: 'scale(1.2)' },
  'fase2-cena5': { objectPosition: '55% 20%',   transform: 'scale(1.1)' },
  'fase2-cena6': { objectPosition: '45% 30%',   transform: 'scale(1.15)' },
  'fase2-cena7': { objectPosition: 'center 25%', transform: 'scale(1.0)' },
  'fase2-cena8': { objectPosition: '40% 35%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.75) saturate(0.7)' },
  'fase2-cena9': { objectPosition: 'center 20%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.1)' },
  'fase2-cena10': { objectPosition: '55% 25%',  transform: 'scale(1.05)', extraFilter: 'brightness(1.15) saturate(1.2)' },
  'fase2-cena11': { objectPosition: 'center 40%', transform: 'scale(1.1)', extraFilter: 'brightness(0.85)' },
  'fase2-cena12': { objectPosition: '60% 45%',  transform: 'scale(1.2)',  extraFilter: 'brightness(0.8)' },
  'fase2-cena13': { objectPosition: '40% 30%',  transform: 'scale(1.15)' },
  'fase2-cena14': { objectPosition: 'center 35%', transform: 'scale(1.1)', extraFilter: 'brightness(0.85) contrast(1.15)' },

  // ── FASE 3 ──
  'fase3-cena1': { objectPosition: 'center 40%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.8) saturate(0.8)' },
  'fase3-cena2': { objectPosition: '55% 35%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.75)' },
  'fase3-cena3': { objectPosition: '40% 45%',   transform: 'scale(1.25)', extraFilter: 'brightness(0.7) contrast(1.2)' },
  'fase3-cena4': { objectPosition: '50% 30%',   transform: 'scale(1.1)' },
  'fase3-cena5': { objectPosition: 'center 50%', transform: 'scale(1.15)', extraFilter: 'brightness(0.65) saturate(0.6)' },
  'fase3-cena6': { objectPosition: '60% 40%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.6) saturate(0.5)' },
  'fase3-cena7': { objectPosition: '45% 35%',   transform: 'scale(1.1)' },
  'fase3-cena8': { objectPosition: 'center 25%', transform: 'scale(1.05)', extraFilter: 'brightness(1.05)' },
  'fase3-cena9': { objectPosition: '55% 30%',   transform: 'scale(1.15)' },
  'fase3-cena10': { objectPosition: '40% 25%',  transform: 'scale(1.1)' },

  // ── FASE 4 ──
  'fase4-cena1':  { objectPosition: 'center 30%', transform: 'scale(1.05)', extraFilter: 'brightness(1.1) saturate(1.15)' },
  'fase4-cena2':  { objectPosition: '60% 35%',   transform: 'scale(1.15)' },
  'fase4-cena3':  { objectPosition: '35% 40%',   transform: 'scale(1.2)' },
  'fase4-cena4':  { objectPosition: 'center 25%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.8) contrast(1.2)' },
  'fase4-cena5':  { objectPosition: '50% 30%',   transform: 'scale(1.15)' },
  'fase4-cena6':  { objectPosition: '55% 40%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.75) contrast(1.15)' },
  'fase4-cena7':  { objectPosition: 'center 35%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.7) saturate(0.7)' },
  'fase4-cena8':  { objectPosition: '45% 25%',   transform: 'scale(1.05)', extraFilter: 'brightness(1.1)' },
  'fase4-cena9':  { objectPosition: '40% 30%',   transform: 'scale(1.15)' },
  'fase4-cena10': { objectPosition: '55% 35%',   transform: 'scale(1.1)' },
  'fase4-cena11': { objectPosition: '50% 25%',   transform: 'scale(1.1)',  extraFilter: 'brightness(1.05) saturate(1.1)' },
  'fase4-cena11b':{ objectPosition: 'center 40%', transform: 'scale(1.2)',  extraFilter: 'brightness(0.7) saturate(0.6)' },
  'fase4-cena12': { objectPosition: '45% 30%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.9)' },

  // ── FASE 5 ──
  'fase5-cena1':  { objectPosition: 'center 30%', transform: 'scale(1.05)' },
  'fase5-cena2':  { objectPosition: '55% 35%',   transform: 'scale(1.1)' },
  'fase5-cena3':  { objectPosition: 'center 40%', transform: 'scale(1.2)',  extraFilter: 'brightness(0.7) contrast(1.2)' },
  'fase5-cena4':  { objectPosition: '40% 45%',   transform: 'scale(1.25)', extraFilter: 'brightness(0.65)' },
  'fase5-cena5':  { objectPosition: '50% 30%',   transform: 'scale(1.15)' },
  'fase5-cena6':  { objectPosition: 'center 25%', transform: 'scale(1.05)', extraFilter: 'brightness(1.15) saturate(1.2)' },
  'fase5-cena7':  { objectPosition: '55% 20%',   transform: 'scale(1.1)',  extraFilter: 'brightness(1.2)' },
  'fase5-cena8':  { objectPosition: '45% 35%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.7) contrast(1.15)' },
  'fase5-cena9':  { objectPosition: 'center 20%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.1)' },
  'fase5-cena10': { objectPosition: '45% 30%',   transform: 'scale(1.1)' },
  'fase5-cena11': { objectPosition: '55% 40%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.85) saturate(0.8)' },
  'fase5-cena12': { objectPosition: '40% 35%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.8) contrast(1.1)' },
  'fase5-cena13': { objectPosition: 'center 45%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.75) saturate(0.7)' },
  'fase5-cena14': { objectPosition: '50% 20%',   transform: 'scale(1.05)', extraFilter: 'brightness(1.15) saturate(1.25)' },

  // ── FASE 6 ──
  'fase6-cena1': { objectPosition: 'center 35%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.85)' },
  'fase6-cena2': { objectPosition: '55% 40%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.8)' },
  'fase6-cena3': { objectPosition: '45% 25%',   transform: 'scale(1.05)' },
  'fase6-cena4': { objectPosition: '50% 35%',   transform: 'scale(1.1)',  extraFilter: 'brightness(0.85)' },
  'fase6-cena5': { objectPosition: 'center 20%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.15) saturate(1.2)' },
  'fase6-cena6': { objectPosition: '55% 30%',   transform: 'scale(1.1)' },
  'fase6-cena7': { objectPosition: 'center 15%', transform: 'scale(1.05)', extraFilter: 'brightness(1.2) saturate(1.25)' },
  'fase6-cena8': { objectPosition: 'center 10%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.3) saturate(1.3)' },
  'fase6-cena9': { objectPosition: 'center 5%',  transform: 'scale(1.05)', extraFilter: 'brightness(1.35) saturate(1.4)' },

  // ══════ PARTE II ══════
  'p2-cena1':  { objectPosition: 'center 30%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.9) saturate(1.1)' },
  'p2-cena2':  { objectPosition: '55% 25%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.85) sepia(0.1)' },
  'p2-cena3':  { objectPosition: '40% 40%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.8) saturate(0.8)' },
  'p2-cena4':  { objectPosition: 'center 25%', transform: 'scale(1.05)', extraFilter: 'brightness(1.1)' },
  'p2-cena5':  { objectPosition: '60% 30%',   transform: 'scale(1.15)', extraFilter: 'brightness(1.05) saturate(1.15)' },
  'p2-cena6':  { objectPosition: '35% 35%',   transform: 'scale(1.1)' },

  'p2-fase2-cena1': { objectPosition: 'center 30%', transform: 'scale(1.05)' },
  'p2-fase2-cena2': { objectPosition: '50% 20%',   transform: 'scale(1.15)', extraFilter: 'brightness(1.15) saturate(1.2)' },
  'p2-fase2-cena3': { objectPosition: '60% 40%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.85)' },
  'p2-fase2-cena4': { objectPosition: 'center 35%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.8) contrast(1.15)' },
  'p2-fase2-cena5': { objectPosition: '45% 25%',   transform: 'scale(1.05)', extraFilter: 'brightness(1.1)' },

  'p2-fase3-cena1': { objectPosition: 'center 40%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.75) saturate(0.8)' },
  'p2-fase3-cena2': { objectPosition: '55% 45%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.65) saturate(0.6)' },
  'p2-fase3-cena3': { objectPosition: '40% 30%',   transform: 'scale(1.15)', extraFilter: 'brightness(0.8) contrast(1.2)' },
  'p2-fase3-cena4': { objectPosition: 'center 25%', transform: 'scale(1.05)', extraFilter: 'brightness(1.05) saturate(1.1)' },
  'p2-fase3-cena5': { objectPosition: '60% 35%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.7) contrast(1.15)' },
  'p2-fase3-cena6': { objectPosition: '35% 40%',   transform: 'scale(1.1)',  extraFilter: 'brightness(0.9)' },

  'p2-fase4-cena1': { objectPosition: 'center 30%', transform: 'scale(1.1)',  extraFilter: 'brightness(1.05)' },
  'p2-fase4-cena2': { objectPosition: '55% 35%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.7) saturate(0.6)' },
  'p2-fase4-cena3': { objectPosition: '40% 25%',   transform: 'scale(1.1)',  extraFilter: 'brightness(0.95)' },
  'p2-fase4-cena4': { objectPosition: '50% 30%',   transform: 'scale(1.05)' },

  'p2-fase5-cena1': { objectPosition: 'center 40%', transform: 'scale(1.15)', extraFilter: 'brightness(0.7) contrast(1.2)' },
  'p2-fase5-cena2': { objectPosition: '55% 35%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.65)' },
  'p2-fase5-cena3': { objectPosition: '40% 45%',   transform: 'scale(1.25)', extraFilter: 'brightness(0.6) saturate(0.5)' },
  'p2-fase5-cena4': { objectPosition: 'center 30%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.85) contrast(1.1)' },
  'p2-fase5-cena5': { objectPosition: '50% 20%',   transform: 'scale(1.05)', extraFilter: 'brightness(1.1) saturate(1.15)' },

  'p2-fase6-cena1': { objectPosition: 'center 45%', transform: 'scale(1.1)',  extraFilter: 'brightness(0.75) saturate(0.7)' },
  'p2-fase6-cena2': { objectPosition: '45% 25%',   transform: 'scale(1.05)', extraFilter: 'brightness(1.1) saturate(1.2)' },
  'p2-fase6-cena3': { objectPosition: 'center 35%', transform: 'scale(1.15)', extraFilter: 'brightness(0.85)' },
  'p2-fase6-cena4': { objectPosition: '55% 30%',   transform: 'scale(1.1)',  extraFilter: 'brightness(0.9)' },
  'p2-fase6-cena5': { objectPosition: '50% 40%',   transform: 'scale(1.2)',  extraFilter: 'brightness(0.8)' },
  'p2-fase6-cena6': { objectPosition: 'center 10%', transform: 'scale(1.0)',  extraFilter: 'brightness(1.3) saturate(1.35)' },
};

const DEFAULT_VARIATION: ImageVariation = {
  objectPosition: 'center 25%',
  transform: 'scale(1.0)',
};

export function getSceneImageVariation(chapterId: string): ImageVariation {
  return SCENE_VARIATIONS[chapterId] || DEFAULT_VARIATION;
}
