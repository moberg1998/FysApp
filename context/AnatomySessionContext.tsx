import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  AnatomySessionState,
  AnatomySessionAction,
  AnatomyQuestion,
} from '@/types';

interface AnatomySessionContextValue {
  session: AnatomySessionState | null;
  startSession: (categoryId: string, questions: AnatomyQuestion[]) => void;
  selectOption: (optionId: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  resetSession: () => void;
}

function reducer(state: AnatomySessionState | null, action: AnatomySessionAction): AnatomySessionState | null {
  switch (action.type) {
    case 'START':
      return {
        categoryId: action.categoryId,
        questions: action.questions,
        currentIndex: 0,
        answers: {},
        isAnswerSubmitted: false,
        isComplete: false,
        startedAt: Date.now(),
      };

    case 'SELECT_OPTION': {
      if (!state || state.isAnswerSubmitted) return state;
      const q = state.questions[state.currentIndex];
      return {
        ...state,
        answers: { ...state.answers, [q.id]: action.optionId },
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

const AnatomySessionContext = createContext<AnatomySessionContextValue | undefined>(undefined);

export function AnatomySessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, null);

  const value: AnatomySessionContextValue = {
    session,
    startSession: (categoryId, questions) => dispatch({ type: 'START', categoryId, questions }),
    selectOption: (optionId) => dispatch({ type: 'SELECT_OPTION', optionId }),
    submitAnswer: () => dispatch({ type: 'SUBMIT_ANSWER' }),
    nextQuestion: () => dispatch({ type: 'NEXT_QUESTION' }),
    resetSession: () => dispatch({ type: 'RESET' }),
  };

  return (
    <AnatomySessionContext.Provider value={value}>
      {children}
    </AnatomySessionContext.Provider>
  );
}

export function useAnatomySession(): AnatomySessionContextValue {
  const ctx = useContext(AnatomySessionContext);
  if (!ctx) throw new Error('useAnatomySession must be used inside AnatomySessionProvider');
  return ctx;
}
