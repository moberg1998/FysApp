import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProgress,
  UserQuizResult,
  FlashcardProgress,
  ExamResult,
  WeakArea,
  PROGRESS_SCHEMA_VERSION,
} from '@/types';

const STORAGE_KEY = '@fysapp:progress';

function createDefaultProgress(): UserProgress {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    quizResults: [],
    flashcardProgress: [],
    examResults: [],
    weakAreas: [],
    lastUpdated: Date.now(),
  };
}

function migrateProgress(raw: UserProgress): UserProgress {
  // Future schema migrations go here.
  // Example: if (raw.schemaVersion < 2) { ... }
  return { ...raw, schemaVersion: PROGRESS_SCHEMA_VERSION };
}

function isValidProgress(data: unknown): data is UserProgress {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;
  return (
    typeof p.schemaVersion === 'number' &&
    Array.isArray(p.quizResults) &&
    Array.isArray(p.flashcardProgress) &&
    Array.isArray(p.examResults) &&
    Array.isArray(p.weakAreas) &&
    typeof p.lastUpdated === 'number'
  );
}

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    if (!isValidProgress(parsed)) return createDefaultProgress();
    return migrateProgress(parsed);
  } catch {
    return createDefaultProgress();
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    const updated = { ...progress, lastUpdated: Date.now() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage failures should not crash the app
  }
}

export async function appendQuizResult(result: UserQuizResult): Promise<void> {
  const progress = await loadProgress();
  const existing = progress.quizResults.filter((r) => r.id !== result.id);
  const updated: UserProgress = {
    ...progress,
    quizResults: [...existing, result],
    weakAreas: mergeWeakAreas(progress.weakAreas, result.weakTags),
    lastUpdated: Date.now(),
  };
  await saveProgress(updated);
}

export async function updateFlashcardProgress(fp: FlashcardProgress): Promise<void> {
  const progress = await loadProgress();
  const existing = progress.flashcardProgress.filter((p) => p.topicId !== fp.topicId);
  const updated: UserProgress = {
    ...progress,
    flashcardProgress: [...existing, fp],
    lastUpdated: Date.now(),
  };
  await saveProgress(updated);
}

export async function appendExamResult(result: ExamResult): Promise<void> {
  const progress = await loadProgress();
  const existing = progress.examResults.filter((r) => r.id !== result.id);
  const updated: UserProgress = {
    ...progress,
    examResults: [...existing, result],
    lastUpdated: Date.now(),
  };
  await saveProgress(updated);
}

export async function clearProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function mergeWeakAreas(existing: WeakArea[], newWeakTags: string[]): WeakArea[] {
  const map = new Map<string, WeakArea>(existing.map((w) => [w.tag, w]));
  for (const tag of newWeakTags) {
    const current = map.get(tag);
    if (current) {
      map.set(tag, { ...current, incorrectCount: current.incorrectCount + 1, totalAttempts: current.totalAttempts + 1 });
    } else {
      map.set(tag, { tag, incorrectCount: 1, totalAttempts: 1 });
    }
  }
  return Array.from(map.values());
}

export function getBestQuizScore(results: UserQuizResult[], topicId: string): number | null {
  const relevant = results.filter((r) => r.topicId === topicId);
  if (relevant.length === 0) return null;
  return Math.max(...relevant.map((r) => r.score));
}

export function getLatestQuizScore(results: UserQuizResult[], topicId: string): number | null {
  const relevant = results
    .filter((r) => r.topicId === topicId)
    .sort((a, b) => b.completedAt - a.completedAt);
  return relevant[0]?.score ?? null;
}

export function getFlashcardStats(
  progress: FlashcardProgress[],
  topicId: string,
): { knew: number; unsure: number; repeat: number } | null {
  const fp = progress.find((p) => p.topicId === topicId);
  if (!fp) return null;
  let knew = 0, unsure = 0, repeat = 0;
  for (const card of fp.cards) {
    if (card.status === 'knew') knew++;
    else if (card.status === 'unsure') unsure++;
    else repeat++;
  }
  return { knew, unsure, repeat };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
