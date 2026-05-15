import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FlipCard } from '@/components/flashcards/FlipCard';
import { RatingButtons } from '@/components/flashcards/RatingButtons';
import { QuizProgressBar } from '@/components/quiz/QuizProgressBar';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useFlashcardSession } from '@/context/FlashcardSessionContext';
import { parkinsonFlashcards } from '@/data/parkinson/flashcards';
import { Flashcard, FlashcardStatus } from '@/types';

const ALL_FLASHCARDS: Record<string, Flashcard[]> = {
  parkinson: parkinsonFlashcards,
};

export default function FlashcardSession() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const { session, startSession, flip, rate } = useFlashcardSession();

  useEffect(() => {
    const cards = ALL_FLASHCARDS[topicId ?? ''] ?? [];
    if (cards.length > 0 && !session) {
      startSession(topicId ?? '', cards);
    }
  }, [topicId]);

  useEffect(() => {
    if (session?.isComplete) {
      router.replace('/flashcards/results');
    }
  }, [session?.isComplete]);

  const handleBack = () => {
    Alert.alert('Exit Flashcards', 'Your session progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => router.replace('/flashcards') },
    ]);
  };

  const handleRate = (status: FlashcardStatus) => {
    rate(status);
  };

  if (!session || session.cards.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Flashcards" onBack={() => router.replace('/flashcards')} />
        <View style={styles.center}>
          <Text style={styles.emptyText}>No flashcards available for this topic yet.</Text>
        </View>
      </View>
    );
  }

  const card = session.cards[session.currentIndex];

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Flashcards" subtitle={card.category} onBack={handleBack} />
      <QuizProgressBar current={session.currentIndex + 1} total={session.cards.length} />

      <View style={styles.cardArea}>
        <FlipCard
          card={card}
          isFlipped={session.isFlipped}
          onFlip={flip}
        />
      </View>

      <View style={styles.footer}>
        {session.isFlipped ? (
          <>
            <Text style={styles.ratingHint}>How well did you know this?</Text>
            <RatingButtons onRate={handleRate} />
          </>
        ) : (
          <Text style={styles.flipHint}>Tap the card to reveal the answer</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
  },
  footer: {
    padding: Layout.spacing.md,
    paddingBottom: Layout.spacing.xl,
    gap: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ratingHint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  flipHint: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
