import { useState, useCallback, useEffect } from 'react';
import { FIRST_CHAPTER_ID, ChoiceEffect } from '@/data/story';

const STORAGE_KEY = 'peregrino-progress';

export interface PlayerAttributes {
  fe: number;
  perseveranca: number;
  discernimento: number;
  coragem: number;
}

export interface DecisionRecord {
  chapterId: string;
  choiceText: string;
  timestamp: number;
  effects: ChoiceEffect;
}

export interface StoryProgress {
  currentChapterId: string;
  visitedChapters: string[];
  choicesMade: number;
  attributes: PlayerAttributes;
  decisions: DecisionRecord[];
  started: boolean;
}

const defaultAttributes: PlayerAttributes = {
  fe: 5,
  perseveranca: 5,
  discernimento: 5,
  coragem: 5,
};

const getInitialProgress = (): StoryProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        attributes: parsed.attributes || defaultAttributes,
        decisions: parsed.decisions || [],
        started: parsed.started ?? false,
      };
    }
  } catch {}
  return {
    currentChapterId: FIRST_CHAPTER_ID,
    visitedChapters: [FIRST_CHAPTER_ID],
    choicesMade: 0,
    attributes: defaultAttributes,
    decisions: [],
    started: false,
  };
};

export const useStoryProgress = () => {
  const [progress, setProgress] = useState<StoryProgress>(getInitialProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const makeChoice = useCallback((
    chapterId: string,
    nextChapterId: string,
    choiceText: string,
    effects: ChoiceEffect
  ) => {
    setProgress(prev => {
      const newAttrs = { ...prev.attributes };
      for (const [key, val] of Object.entries(effects)) {
        if (val) newAttrs[key as keyof PlayerAttributes] += val;
      }

      const destination = nextChapterId;

      const decision: DecisionRecord = {
        chapterId,
        choiceText,
        timestamp: Date.now(),
        effects,
      };

      return {
        ...prev,
        currentChapterId: destination,
        visitedChapters: prev.visitedChapters.includes(destination)
          ? prev.visitedChapters
          : [...prev.visitedChapters, destination],
        choicesMade: prev.choicesMade + 1,
        attributes: newAttrs,
        decisions: [...prev.decisions, decision],
        started: true,
      };
    });
  }, []);

  const goToChapter = useCallback((chapterId: string) => {
    setProgress(prev => ({
      ...prev,
      currentChapterId: chapterId,
      visitedChapters: prev.visitedChapters.includes(chapterId)
        ? prev.visitedChapters
        : [...prev.visitedChapters, chapterId],
      started: true,
    }));
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
      decisions: [],
      started: false,
    });
  }, []);

  const hasProgress = progress.started || progress.choicesMade > 0;

  const meetsRequirements = useCallback((requires?: Partial<ChoiceEffect>): boolean => {
    if (!requires) return true;
    for (const [key, val] of Object.entries(requires)) {
      if (val && progress.attributes[key as keyof PlayerAttributes] < val) return false;
    }
    return true;
  }, [progress.attributes]);

  return { progress, makeChoice, goToChapter, resetProgress, startJourney, hasProgress, meetsRequirements };
};
