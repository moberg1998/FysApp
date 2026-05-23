import { useState, useEffect, useCallback } from 'react';
import {
  UserProgress,
  UserQuizResult,
  FlashcardProgress,
  ExamResult,
} from '@/types';
import {
  loadProgress,
  appendQuizResult,
  updateFlashcardProgress,
  appendExamResult,
  getBestQuizScore,
  getBestQuizScoreInfo,
  getLatestQuizScore,
  getFlashcardStats,
} from '@/store/progressStore';

interface UseProgressReturn {
  progress: UserProgress | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  addQuizResult: (result: UserQuizResult) => Promise<void>;
  updateFlashcards: (fp: FlashcardProgress) => Promise<void>;
  addExamResult: (result: ExamResult) => Promise<void>;
  getBestScore: (topicId: string) => number | null;
  getBestScoreInfo: (topicId: string) => { score: number; questionCount: number } | null;
  getLatestScore: (topicId: string) => number | null;
  getFlashcardProgress: (topicId: string) => { knew: number; unsure: number; repeat: number } | null;
}

export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadProgress();
      setProgress(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addQuizResult = useCallback(async (result: UserQuizResult) => {
    await appendQuizResult(result);
    await refresh();
  }, [refresh]);

  const updateFlashcards = useCallback(async (fp: FlashcardProgress) => {
    await updateFlashcardProgress(fp);
    await refresh();
  }, [refresh]);

  const addExamResult = useCallback(async (result: ExamResult) => {
    await appendExamResult(result);
    await refresh();
  }, [refresh]);

  const getBestScore = useCallback((topicId: string) => {
    if (!progress) return null;
    return getBestQuizScore(progress.quizResults, topicId);
  }, [progress]);

  const getBestScoreInfo = useCallback((topicId: string) => {
    if (!progress) return null;
    return getBestQuizScoreInfo(progress.quizResults, topicId);
  }, [progress]);

  const getLatestScore = useCallback((topicId: string) => {
    if (!progress) return null;
    return getLatestQuizScore(progress.quizResults, topicId);
  }, [progress]);

  const getFlashcardProgress = useCallback((topicId: string) => {
    if (!progress) return null;
    return getFlashcardStats(progress.flashcardProgress, topicId);
  }, [progress]);

  return {
    progress,
    isLoading,
    refresh,
    addQuizResult,
    updateFlashcards,
    addExamResult,
    getBestScore,
    getBestScoreInfo,
    getLatestScore,
    getFlashcardProgress,
  };
}
