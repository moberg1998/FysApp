import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  QuizSessionState,
  QuizSessionAction,
  QuizQuestion,
} from '@/types';

interface QuizSessionContextValue {
  session: QuizSessionState | null;
  startSession: (topicId: string, questions: QuizQuestion[]) => void;
  toggleOption: (optionId: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  resetSession: () => void;
}

function reducer(state: QuizSessionState | null, action: QuizSessionAction): QuizSessionState | null {
  switch (action.type) {
    case 'START':
      return {
        topicId: action.topicId,
        questions: action.questions,
        currentIndex: 0,
        answers: {},
        isAnswerSubmitted: false,
        isComplete: false,
        startedAt: Date.now(),
      };

    case 'TOGGLE_OPTION': {
      if (!state || state.isAnswerSubmitted) return state;
      const q = state.questions[state.currentIndex];
      const current = state.answers[q.id] ?? [];
      const isSingle = q.type === 'single' || q.type === 'true-false';
      let next: string[];
      if (isSingle) {
        next = current.includes(action.optionId) ? [] : [action.optionId];
      } else {
        next = current.includes(action.optionId)
          ? current.filter((id) => id !== action.optionId)
          : [...current, action.optionId];
      }
      return {
        ...state,
        answers: { ...state.answers, [q.id]: next },
      };
    }

    case 'SUBMIT_ANSWER':
      if (!state) return state;
      return { ...state, isAnswerSubmitted: true };

    case 'NEXT_QUESTION': {
      if (!state) return state;
      const isLast = state.currentIndex >= state.questions.length - 1;
      if (isLast) {
        return { ...state, isAnswerSubmitted: false, isComplete: true };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        isAnswerSubmitted: false,
      };
    }

    case 'COMPLETE':
      return state ? { ...state, isComplete: true } : state;

    case 'RESET':
      return null;

    default:
      return state;
  }
}

const QuizSessionContext = createContext<QuizSessionContextValue | undefined>(undefined);

export function QuizSessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, null);

  const value: QuizSessionContextValue = {
    session,
    startSession: (topicId, questions) => dispatch({ type: 'START', topicId, questions }),
    toggleOption: (optionId) => dispatch({ type: 'TOGGLE_OPTION', optionId }),
    submitAnswer: () => dispatch({ type: 'SUBMIT_ANSWER' }),
    nextQuestion: () => dispatch({ type: 'NEXT_QUESTION' }),
    resetSession: () => dispatch({ type: 'RESET' }),
  };

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  );
}

export function useQuizSession(): QuizSessionContextValue {
  const ctx = useContext(QuizSessionContext);
  if (!ctx) throw new Error('useQuizSession must be used inside QuizSessionProvider');
  return ctx;
}
