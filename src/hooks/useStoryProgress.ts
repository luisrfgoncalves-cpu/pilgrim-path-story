import { useState, useCallback, useEffect } from 'react';
import { FIRST_CHAPTER_ID } from '@/data/story';

const STORAGE_KEY = 'peregrino-progress';

interface StoryProgress {
  currentChapterId: string;
  visitedChapters: string[];
  choicesMade: number;
}

const getInitialProgress = (): StoryProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    currentChapterId: FIRST_CHAPTER_ID,
    visitedChapters: [FIRST_CHAPTER_ID],
    choicesMade: 0,
  };
};

export const useStoryProgress = () => {
  const [progress, setProgress] = useState<StoryProgress>(getInitialProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const goToChapter = useCallback((chapterId: string) => {
    setProgress(prev => ({
      currentChapterId: chapterId,
      visitedChapters: prev.visitedChapters.includes(chapterId)
        ? prev.visitedChapters
        : [...prev.visitedChapters, chapterId],
      choicesMade: prev.choicesMade + 1,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    const initial: StoryProgress = {
      currentChapterId: FIRST_CHAPTER_ID,
      visitedChapters: [FIRST_CHAPTER_ID],
      choicesMade: 0,
    };
    setProgress(initial);
  }, []);

  return { progress, goToChapter, resetProgress };
};
