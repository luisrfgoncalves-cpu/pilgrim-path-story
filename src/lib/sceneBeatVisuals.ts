import { sceneImages } from '@/data/sceneImages';
import type { NarrativeBeat } from '@/hooks/useNarrativeBeats';

type StoryScope = 'part1' | 'part2' | 'any';

interface ResolveSceneBeatVisualKeyInput {
  chapterId: string;
  beat: NarrativeBeat | null;
  beatCount: number;
  beatIndex: number;
}

interface VisualRule {
  keywords: string[];
  keys: string[];
  scope?: StoryScope;
  weight?: number;
}

const VISUAL_RULES: VisualRule[] = [
  { keywords: ['cruz', 'fardo', 'liberto'], keys: ['cena15', 'cena15b', 'p2-fase2-cena2'], weight: 5 },
  { keywords: ['cidade celestial', 'portoes', 'trombetas', 'gloria'], keys: ['fase6-cena8', 'fase6-cena7', 'fase6-cena5', 'p2-fase6-cena6'], weight: 5 },
  { keywords: ['rio', 'travessia', 'morte', 'aguas profundas'], keys: ['fase6-cena1', 'fase6-cena2', 'fase6-cena4', 'p2-fase6-cena5'], weight: 5 },
  { keywords: ['gigante desespero', 'calabouco', 'masmorra', 'chave da promessa'], keys: ['fase5-cena3', 'fase5-cena4', 'fase5-cena5', 'fase5-cena6', 'p2-fase5-cena1', 'p2-fase5-cena2'], weight: 5 },
  { keywords: ['apoliao', 'espada', 'batalha', 'humilhacao'], keys: ['fase3-cena2', 'fase3-cena3', 'fase3-cena4', 'fase3-cena5'], weight: 5 },
  { keywords: ['feira da vaidade', 'vaidade', 'mercadorias', 'comprar', 'vender'], keys: ['fase4-cena1', 'fase4-cena2', 'fase4-cena3', 'fase4-cena9'], weight: 4 },
  { keywords: ['prisao', 'cela', 'julgamento', 'martir', 'sentenca'], keys: ['fase4-cena4', 'fase4-cena5', 'fase4-cena6', 'fase4-cena7'], weight: 4 },
  { keywords: ['porta estreita', 'portao estreito', 'boa vontade', 'bateu na porta'], keys: ['cena7', 'cena7b', 'cena9', 'cena9b', 'p2-cena4'], weight: 4 },
  { keywords: ['pantano', 'desanimo', 'lama', 'afund', 'auxilio'], keys: ['cena11', 'cena11b', 'cena12', 'cena13', 'cena14', 'p2-cena3'], weight: 4 },
  { keywords: ['interprete', 'poeira', 'fogo', 'visao'], keys: ['fase2-cena1', 'fase2-cena4', 'fase2-cena6', 'fase2-cena5', 'fase2-cena2', 'p2-cena6'], weight: 4 },
  { keywords: ['palacio', 'leoes', 'armadura'], keys: ['fase2-cena7', 'fase2-cena14', 'fase2-cena9', 'p2-fase2-cena4', 'p2-fase2-cena5'], weight: 4 },
  { keywords: ['colina', 'dificuldade', 'caramanchao', 'subida'], keys: ['fase2-cena11', 'fase2-cena12', 'fase2-cena13', 'p2-fase2-cena3'], weight: 4 },
  { keywords: ['vale da sombra', 'sombra', 'abismo', 'escuridao'], keys: ['fase3-cena7', 'fase3-cena9', 'p2-fase3-cena2'], weight: 4 },
  { keywords: ['fiel', 'esperanca', 'companheiro'], keys: ['fase3-cena8', 'fase4-cena8', 'fase4-cena12', 'fase3-cena10'], weight: 3 },
  { keywords: ['demas', 'prata', 'mina'], keys: ['fase4-cena10', 'fase4-cena11b', 'p2-fase4-cena2'], weight: 3 },
  { keywords: ['lisonjeiro', 'rede'], keys: ['fase5-cena11', 'fase5-cena12', 'fase5-cena8'], weight: 3 },
  { keywords: ['montanhas', 'pastores'], keys: ['fase5-cena9', 'fase5-cena10', 'p2-fase5-cena5'], weight: 3 },
  { keywords: ['terra encantada', 'beula', 'descanso'], keys: ['fase5-cena13', 'fase5-cena14', 'p2-fase6-cena2'], weight: 3 },
  { keywords: ['livro', 'juizo', 'fardo', 'destruicao'], keys: ['cena1', 'cena1b', 'cena2', 'cena3'], weight: 3 },
  { keywords: ['evangelista', 'caminho', 'porta'], keys: ['cena5', 'cena7', 'cena9'], weight: 3 },
  { keywords: ['sinai', 'lei', 'tremor', 'monte'], keys: ['cena10'], weight: 3 },
  { keywords: ['crista', 'misericordia', 'familia', 'filhos'], keys: ['p2-cena1', 'p2-cena2', 'p2-cena3', 'p2-cena4', 'p2-cena5', 'p2-cena6'], scope: 'part2', weight: 4 },
  { keywords: ['grande coracao', 'gaio', 'valente', 'maul', 'mata-bons', 'pronto para parar'], keys: ['p2-fase2-cena1', 'p2-fase3-cena4', 'p2-fase3-cena3', 'p2-fase3-cena5', 'p2-fase4-cena1', 'p2-fase4-cena3'], scope: 'part2', weight: 4 },
  { keywords: ['madame bolha', 'firme'], keys: ['p2-fase6-cena1'], scope: 'part2', weight: 4 },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scopeMatches(scope: StoryScope | undefined, chapterId: string): boolean {
  if (!scope || scope === 'any') return true;
  const isPart2 = chapterId.startsWith('p2-');
  return scope === 'part2' ? isPart2 : !isPart2;
}

function prioritizeKeys(keys: string[], chapterId: string): string[] {
  const isPart2 = chapterId.startsWith('p2-');
  return [...keys].sort((a, b) => {
    const aMatch = a.startsWith('p2-') === isPart2 ? 1 : 0;
    const bMatch = b.startsWith('p2-') === isPart2 ? 1 : 0;
    return bMatch - aMatch;
  });
}

export function resolveSceneBeatVisualKey({ chapterId, beat, beatCount, beatIndex }: ResolveSceneBeatVisualKeyInput): string {
  if (!beat) return chapterId;

  const startKey = `${chapterId}__${beat.startIndex}`;
  if (sceneImages[startKey]) return startKey;

  const beatKey = `${chapterId}__beat${Math.min(beatIndex + 1, Math.max(beatCount, 1))}`;
  if (sceneImages[beatKey]) return beatKey;

  const text = normalize(beat.lines.join(' '));
  if (!text) return chapterId;

  let bestKey = chapterId;
  let bestScore = 0;

  for (const rule of VISUAL_RULES) {
    if (!scopeMatches(rule.scope, chapterId)) continue;

    const hits = rule.keywords.reduce((count, keyword) => count + (text.includes(normalize(keyword)) ? 1 : 0), 0);
    if (hits === 0) continue;

    const candidateKey = prioritizeKeys(rule.keys, chapterId).find((key) => !!sceneImages[key]);
    if (!candidateKey) continue;

    const score = hits * (rule.weight ?? 1);
    if (score > bestScore) {
      bestScore = score;
      bestKey = candidateKey;
    }
  }

  return bestKey;
}