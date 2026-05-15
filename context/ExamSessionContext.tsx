import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  ExamSessionState,
  ExamSessionAction,
  ExamCase,
} from '@/types';

interface ExamSessionContextValue {
  session: ExamSessionState | null;
  startSession: (topicId: string, examCase: ExamCase) => void;
  toggleOption: (optionId: string) => void;
  submitStep: () => void;
  nextStep: () => void;
  resetSession: () => void;
}

function reducer(state: ExamSessionState | null, action: ExamSessionAction): ExamSessionState | null {
  switch (action.type) {
    case 'START':
      return {
        topicId: action.topicId,
        examCase: action.examCase,
        currentStep: 0,
        stepAnswers: {},
        stepSubmitted: new Array(6).fill(false),
        isComplete: false,
        startedAt: Date.now(),
      };

    case 'TOGGLE_OPTION': {
      if (!state || state.stepSubmitted[state.currentStep]) return state;
      const current = state.stepAnswers[state.currentStep] ?? [];
      const next = current.includes(action.optionId)
        ? current.filter((id) => id !== action.optionId)
        : [...current, action.optionId];
      return {
        ...state,
        stepAnswers: { ...state.stepAnswers, [state.currentStep]: next },
      };
    }

    case 'SUBMIT_STEP': {
      if (!state) return state;
      const submitted = [...state.stepSubmitted];
      submitted[state.currentStep] = true;
      return { ...state, stepSubmitted: submitted };
    }

    case 'NEXT_STEP': {
      if (!state) return state;
      const isLast = state.currentStep >= 5;
      if (isLast) {
        return { ...state, isComplete: true };
      }
      return { ...state, currentStep: state.currentStep + 1 };
    }

    case 'COMPLETE':
      return state ? { ...state, isComplete: true } : state;

    case 'RESET':
      return null;

    default:
      return state;
  }
}

const ExamSessionContext = createContext<ExamSessionContextValue | undefined>(undefined);

export function ExamSessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, null);

  const value: ExamSessionContextValue = {
    session,
    startSession: (topicId, examCase) => dispatch({ type: 'START', topicId, examCase }),
    toggleOption: (optionId) => dispatch({ type: 'TOGGLE_OPTION', optionId }),
    submitStep: () => dispatch({ type: 'SUBMIT_STEP' }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    resetSession: () => dispatch({ type: 'RESET' }),
  };

  return (
    <ExamSessionContext.Provider value={value}>
      {children}
    </ExamSessionContext.Provider>
  );
}

export function useExamSession(): ExamSessionContextValue {
  const ctx = useContext(ExamSessionContext);
  if (!ctx) throw new Error('useExamSession must be used inside ExamSessionProvider');
  return ctx;
}
