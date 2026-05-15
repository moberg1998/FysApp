import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  FlashcardSessionState,
  FlashcardSessionAction,
  Flashcard,
  FlashcardStatus,
} from '@/types';

interface FlashcardSessionContextValue {
  session: FlashcardSessionState | null;
  startSession: (topicId: string, cards: Flashcard[]) => void;
  flip: () => void;
  rate: (status: FlashcardStatus) => void;
  resetSession: () => void;
}

function reducer(state: FlashcardSessionState | null, action: FlashcardSessionAction): FlashcardSessionState | null {
  switch (action.type) {
    case 'START':
      return {
        topicId: action.topicId,
        cards: action.cards,
        currentIndex: 0,
        ratings: {},
        isFlipped: false,
        isComplete: false,
        startedAt: Date.now(),
      };

    case 'FLIP':
      if (!state) return state;
      return { ...state, isFlipped: !state.isFlipped };

    case 'RATE': {
      if (!state) return state;
      const card = state.cards[state.currentIndex];
      const newRatings = { ...state.ratings, [card.id]: action.status };
      const isLast = state.currentIndex >= state.cards.length - 1;
      return {
        ...state,
        ratings: newRatings,
        currentIndex: isLast ? state.currentIndex : state.currentIndex + 1,
        isFlipped: false,
        isComplete: isLast,
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

const FlashcardSessionContext = createContext<FlashcardSessionContextValue | undefined>(undefined);

export function FlashcardSessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, null);

  const value: FlashcardSessionContextValue = {
    session,
    startSession: (topicId, cards) => dispatch({ type: 'START', topicId, cards }),
    flip: () => dispatch({ type: 'FLIP' }),
    rate: (status) => dispatch({ type: 'RATE', status }),
    resetSession: () => dispatch({ type: 'RESET' }),
  };

  return (
    <FlashcardSessionContext.Provider value={value}>
      {children}
    </FlashcardSessionContext.Provider>
  );
}

export function useFlashcardSession(): FlashcardSessionContextValue {
  const ctx = useContext(FlashcardSessionContext);
  if (!ctx) throw new Error('useFlashcardSession must be used inside FlashcardSessionProvider');
  return ctx;
}
