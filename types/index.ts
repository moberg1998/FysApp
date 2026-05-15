// ─── Content Types ─────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'single' | 'multiple' | 'true-false' | 'scenario';

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  quizCount: number;
  flashcardCount: number;
  examCaseCount: number;
  category: 'neuro' | 'msk' | 'cross-cutting';
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  type: QuestionType;
  difficulty: Difficulty;
  stem: string;
  context?: string;
  options: QuizOption[];
  explanation: string;
  takeaway: string;
  tags: string[];
  subtopic: string;
}

// ─── Exam / Clinical Case Types ────────────────────────────────────────────

export type ExamStepType =
  | 'anamnesis'
  | 'red-flags'
  | 'examination'
  | 'hypothesis'
  | 'treatment'
  | 'documentation';

export interface ExamOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ExamStep {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  type: ExamStepType;
  title: string;
  prompt: string;
  options: ExamOption[];
  explanation: string;
  clinicalNote: string;
}

export interface ExamCase {
  id: string;
  topicId: string;
  title: string;
  patientProfile: string;
  chiefComplaint: string;
  difficulty: Difficulty;
  steps: [ExamStep, ExamStep, ExamStep, ExamStep, ExamStep, ExamStep];
}

// ─── Anatomy Types ─────────────────────────────────────────────────────────

export interface AnatomyCategory {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  isAvailable: boolean;
  group: 'lower-extremity' | 'upper-extremity' | 'spine-trunk' | 'neurofunctional';
}

export interface AnatomyOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AnatomyQuestion {
  id: string;
  categoryId: string;
  question: string;
  options: AnatomyOption[];
  explanation: string;
  clinicalRelevance: string;
  imageKey?: string;
}

// ─── Flashcard Types ───────────────────────────────────────────────────────

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  clinicalPoint: string;
  category: string;
  tags: string[];
}

// ─── User Progress / Persistence Types ────────────────────────────────────

export const PROGRESS_SCHEMA_VERSION = 1;

export interface QuestionResult {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  isPartiallyCorrect: boolean;
}

export interface UserQuizResult {
  id: string;
  topicId: string;
  completedAt: number;
  totalQuestions: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
  score: number;
  weakTags: string[];
  questionResults: QuestionResult[];
}

export type FlashcardStatus = 'knew' | 'unsure' | 'repeat';

export interface FlashcardCardProgress {
  cardId: string;
  status: FlashcardStatus;
  reviewCount: number;
  lastRated: number;
}

export interface FlashcardProgress {
  topicId: string;
  lastStudied: number;
  cards: FlashcardCardProgress[];
}

export interface ExamStepScore {
  stepNumber: number;
  selectedOptionIds: string[];
  correctCount: number;
  totalCorrect: number;
}

export interface ExamResult {
  id: string;
  topicId: string;
  caseId: string;
  completedAt: number;
  stepScores: ExamStepScore[];
  totalCorrect: number;
  totalPossible: number;
  percentage: number;
  passed: boolean;
}

export interface WeakArea {
  tag: string;
  incorrectCount: number;
  totalAttempts: number;
}

export interface UserProgress {
  schemaVersion: number;
  quizResults: UserQuizResult[];
  flashcardProgress: FlashcardProgress[];
  examResults: ExamResult[];
  weakAreas: WeakArea[];
  lastUpdated: number;
}

// ─── Session State Types ────────────────────────────────────────────────────

export interface QuizSessionState {
  topicId: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, string[]>;
  isAnswerSubmitted: boolean;
  isComplete: boolean;
  startedAt: number;
}

export type QuizSessionAction =
  | { type: 'START'; topicId: string; questions: QuizQuestion[] }
  | { type: 'TOGGLE_OPTION'; optionId: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };

export interface ExamSessionState {
  topicId: string;
  examCase: ExamCase;
  currentStep: number;
  stepAnswers: Record<number, string[]>;
  stepSubmitted: boolean[];
  isComplete: boolean;
  startedAt: number;
}

export type ExamSessionAction =
  | { type: 'START'; topicId: string; examCase: ExamCase }
  | { type: 'TOGGLE_OPTION'; optionId: string }
  | { type: 'SUBMIT_STEP' }
  | { type: 'NEXT_STEP' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };

export interface FlashcardSessionState {
  topicId: string;
  cards: Flashcard[];
  currentIndex: number;
  ratings: Record<string, FlashcardStatus>;
  isFlipped: boolean;
  isComplete: boolean;
  startedAt: number;
}

export type FlashcardSessionAction =
  | { type: 'START'; topicId: string; cards: Flashcard[] }
  | { type: 'FLIP' }
  | { type: 'RATE'; status: FlashcardStatus }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };

export interface AnatomySessionState {
  categoryId: string;
  questions: AnatomyQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  isAnswerSubmitted: boolean;
  isComplete: boolean;
  startedAt: number;
}

export type AnatomySessionAction =
  | { type: 'START'; categoryId: string; questions: AnatomyQuestion[] }
  | { type: 'SELECT_OPTION'; optionId: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };
