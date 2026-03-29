import { useState, useCallback, useEffect } from 'react';
import { FIRST_CHAPTER_ID } from '@/data/story';

const STORAGE_KEY = 'peregrino-progress';

export interface PlayerAttributes {
  fe: number;
  coragem: number;
  sabedoria: number;
  humildade: number;
}

export interface StoryProgress {
  currentChapterId: string;
  visitedChapters: string[];
  choicesMade: number;
  attributes: PlayerAttributes;
  started: boolean;
}

const defaultAttributes: PlayerAttributes = {
  fe: 10,
  coragem: 10,
  sabedoria: 5,
  humildade: 5,
};

const getInitialProgress = (): StoryProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, attributes: parsed.attributes || defaultAttributes, started: parsed.started ?? false };
    }
  } catch {}
  return {
    currentChapterId: FIRST_CHAPTER_ID,
    visitedChapters: [FIRST_CHAPTER_ID],
    choicesMade: 0,
    attributes: defaultAttributes,
    started: false,
  };
};

// Attribute changes per chapter based on choices
const chapterAttributeEffects: Record<string, Partial<PlayerAttributes>> = {
  "pantano-desanimo": { fe: 5, humildade: 3 },
  "pantano-desanimo-sozinho": { fe: 3, coragem: 5 },
  "pantano-orgulho": { humildade: 8, sabedoria: 3 },
  "familia-recusa": { coragem: 3, fe: 2 },
  "portao-estreito": { fe: 5, coragem: 3 },
  "casa-interprete": { sabedoria: 10, fe: 3 },
  "cruz-fardo": { fe: 15, humildade: 5 },
  "vale-sombra": { coragem: 10, fe: 5 },
  "fiel-encontro": { sabedoria: 3, fe: 3 },
  "feira-vaidade": { coragem: 8, fe: 5 },
  "feira-inevitavel": { sabedoria: 3 },
  "esperanca-encontro": { fe: 3, sabedoria: 3 },
  "castelo-duvida": { humildade: 10, sabedoria: 5 },
  "cidade-celestial": { fe: 20, coragem: 10, sabedoria: 10, humildade: 10 },
};

export const useStoryProgress = () => {
  const [progress, setProgress] = useState<StoryProgress>(getInitialProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const goToChapter = useCallback((chapterId: string) => {
    setProgress(prev => {
      const effects = chapterAttributeEffects[chapterId] || {};
      const newAttrs = { ...prev.attributes };
      for (const [key, val] of Object.entries(effects)) {
        newAttrs[key as keyof PlayerAttributes] = (newAttrs[key as keyof PlayerAttributes] || 0) + (val as number);
      }
      return {
        ...prev,
        currentChapterId: chapterId,
        visitedChapters: prev.visitedChapters.includes(chapterId)
          ? prev.visitedChapters
          : [...prev.visitedChapters, chapterId],
        choicesMade: prev.choicesMade + 1,
        attributes: newAttrs,
        started: true,
      };
    });
  }, []);

  const startJourney = useCallback(() => {
    setProgress(prev => ({ ...prev, started: true }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      currentChapterId: FIRST_CHAPTER_ID,
      visitedChapters: [FIRST_CHAPTER_ID],
      choicesMade: 0,
      attributes: defaultAttributes,
      started: false,
    });
  }, []);

  const hasProgress = progress.started || progress.choicesMade > 0;

  return { progress, goToChapter, resetProgress, startJourney, hasProgress };
};
