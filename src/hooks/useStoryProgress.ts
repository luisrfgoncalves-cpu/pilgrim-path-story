import { useState, useCallback, useEffect } from 'react';
import { FIRST_CHAPTER_ID, ChoiceEffect, ConditionalEffect } from '@/data/story';
import { loadProgressFromCloud, loadHistoryFromCloud, savePlaythroughToCloud } from '@/lib/cloudSave';

const STORAGE_KEY = 'peregrino-progress';
const HISTORY_KEY = 'peregrino-history';

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
  flag?: string;
}

export interface PlaythroughRecord {
  completedAt: number;
  result: 'complete' | 'difficult' | 'incomplete';
  attributes: PlayerAttributes;
  choicesMade: number;
  flags: string[];
}

export interface PlayHistory {
  playthroughs: PlaythroughRecord[];
  totalPlaythroughs: number;
}

export interface StoryProgress {
  currentChapterId: string;
  visitedChapters: string[];
  choicesMade: number;
  attributes: PlayerAttributes;
  decisions: DecisionRecord[];
  flags: Record<string, boolean>;
  items: string[];
  started: boolean;
  playthrough: number;
}

const defaultAttributes: PlayerAttributes = {
  fe: 5,
  perseveranca: 5,
  discernimento: 5,
  coragem: 5,
};

const getPlayHistory = (): PlayHistory => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { playthroughs: [], totalPlaythroughs: 0 };
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
        flags: parsed.flags || {},
        items: parsed.items || [],
        started: parsed.started ?? false,
        playthrough: parsed.playthrough ?? 1,
      };
    }
  } catch {}
  const history = getPlayHistory();
  return {
    currentChapterId: FIRST_CHAPTER_ID,
    visitedChapters: [FIRST_CHAPTER_ID],
    choicesMade: 0,
    attributes: defaultAttributes,
    decisions: [],
    flags: {},
    items: [],
    started: false,
    playthrough: history.totalPlaythroughs + 1,
  };
};

export const useStoryProgress = () => {
  const [progress, setProgress] = useState<StoryProgress>(getInitialProgress);
  const [history, setHistory] = useState<PlayHistory>(getPlayHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const makeChoice = useCallback((
    chapterId: string,
    nextChapterId: string,
    choiceText: string,
    effects: ChoiceEffect,
    flag?: string,
    conditionalEffects?: ConditionalEffect[]
  ) => {
    setProgress(prev => {
      const newAttrs = { ...prev.attributes };
      for (const [key, val] of Object.entries(effects)) {
        if (val) newAttrs[key as keyof PlayerAttributes] += val;
      }
      if (conditionalEffects) {
        for (const ce of conditionalEffects) {
          const currentVal = prev.attributes[ce.attr] || 0;
          const extraEffects = currentVal >= ce.threshold ? ce.bonus : ce.penalty;
          if (extraEffects) {
            for (const [key, val] of Object.entries(extraEffects)) {
              if (val) newAttrs[key as keyof PlayerAttributes] += val;
            }
          }
        }
      }

      const newFlags = { ...prev.flags };
      if (flag) {
        newFlags[flag] = true;
      }

      const decision: DecisionRecord = {
        chapterId,
        choiceText,
        timestamp: Date.now(),
        effects,
        flag,
      };

      return {
        ...prev,
        currentChapterId: nextChapterId,
        visitedChapters: prev.visitedChapters.includes(nextChapterId)
          ? prev.visitedChapters
          : [...prev.visitedChapters, nextChapterId],
        choicesMade: prev.choicesMade + 1,
        attributes: newAttrs,
        decisions: [...prev.decisions, decision],
        flags: newFlags,
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

  const completePlaythrough = useCallback((result: 'complete' | 'difficult' | 'incomplete') => {
    const record: PlaythroughRecord = {
      completedAt: Date.now(),
      result,
      attributes: { ...progress.attributes },
      choicesMade: progress.choicesMade,
      flags: Object.keys(progress.flags).filter(k => progress.flags[k]),
    };
    setHistory(prev => ({
      playthroughs: [...prev.playthroughs, record],
      totalPlaythroughs: prev.totalPlaythroughs + 1,
    }));
    // Also save to cloud if userId is provided later via syncCloudPlaythrough
    (window as any).__lastPlaythroughRecord = { record, playthrough: progress.playthrough };
  }, [progress]);

  /** Save last completed playthrough to cloud */
  const syncCloudPlaythrough = useCallback(async (userId: string) => {
    const last = (window as any).__lastPlaythroughRecord;
    if (last) {
      await savePlaythroughToCloud(userId, last.record, last.playthrough);
      (window as any).__lastPlaythroughRecord = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    const hist = getPlayHistory();
    setProgress({
      currentChapterId: FIRST_CHAPTER_ID,
      visitedChapters: [FIRST_CHAPTER_ID],
      choicesMade: 0,
      attributes: defaultAttributes,
      decisions: [],
      flags: {},
      items: [],
      started: false,
      playthrough: hist.totalPlaythroughs + 1,
    });
  }, []);

  /** Load progress from Supabase cloud save */
  const loadFromCloud = useCallback(async (userId: string) => {
    const [progressResult, historyResult] = await Promise.all([
      loadProgressFromCloud(userId),
      loadHistoryFromCloud(userId),
    ]);

    if (progressResult.data) {
      setProgress(progressResult.data);
    }
    if (historyResult.data) {
      setHistory(historyResult.data);
    }

    return {
      hasCloudSave: !!progressResult.data,
      error: progressResult.error || historyResult.error,
    };
  }, []);

  const hasProgress = progress.started || progress.choicesMade > 0;
  const isReplay = progress.playthrough > 1;

  const hasFlag = useCallback((flag: string): boolean => {
    return !!progress.flags[flag];
  }, [progress.flags]);

  const meetsRequirements = useCallback((requires?: Partial<ChoiceEffect>): boolean => {
    if (!requires) return true;
    for (const [key, val] of Object.entries(requires)) {
      if (val && progress.attributes[key as keyof PlayerAttributes] < val) return false;
    }
    return true;
  }, [progress.attributes]);

  const hadFlagBefore = useCallback((flag: string): boolean => {
    return history.playthroughs.some(p => p.flags.includes(flag));
  }, [history.playthroughs]);

  const addItem = useCallback((itemId: string) => {
    setProgress(prev => {
      if (prev.items.includes(itemId)) return prev;
      return { ...prev, items: [...prev.items, itemId] };
    });
  }, []);

  const hasItem = useCallback((itemId: string): boolean => {
    return progress.items.includes(itemId);
  }, [progress.items]);

  return {
    progress, makeChoice, goToChapter, resetProgress, startJourney,
    hasProgress, hasFlag, meetsRequirements, history, isReplay,
    completePlaythrough, hadFlagBefore, addItem, hasItem,
    loadFromCloud, syncCloudPlaythrough,
  };
};
