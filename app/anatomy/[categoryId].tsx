import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QuizProgressBar } from '@/components/quiz/QuizProgressBar';
import { AnatomyQuestionCard } from '@/components/anatomy/AnatomyQuestionCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAnatomySession } from '@/context/AnatomySessionContext';
import { ANATOMY_CATEGORIES } from '@/data/anatomy/categories';
import { hipPelvisQuestions } from '@/data/anatomy/hipPelvis';
import { kneeQuestions } from '@/data/anatomy/knee';
import { ankleFootQuestions } from '@/data/anatomy/ankleFoot';
import { gaitCycleQuestions } from '@/data/anatomy/gaitCycle';
import { AnatomyQuestion } from '@/types';

const ALL_QUESTIONS: Record<string, AnatomyQuestion[]> = {
  'hip-pelvis': hipPelvisQuestions,
  'knee': kneeQuestions,
  'ankle-foot': ankleFootQuestions,
  'gait-cycle': gaitCycleQuestions,
};

export default function AnatomySession() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const { session, startSession, selectOption, submitAnswer, nextQuestion } = useAnatomySession();

  const category = ANATOMY_CATEGORIES.find((c) => c.id === categoryId);
  const questions = ALL_QUESTIONS[categoryId ?? ''] ?? [];

  useEffect(() => {
    if (questions.length > 0 && !session) {
      startSession(categoryId ?? '', questions);
    }
  }, [categoryId]);

  useEffect(() => {
    if (session?.isComplete) {
      router.replace('/anatomy/results');
    }
  }, [session?.isComplete]);

  const handleBack = () => {
    Alert.alert('Exit Session', 'Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => router.replace('/anatomy/index') },
    ]);
  };

  if (!session || questions.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Anatomy" onBack={() => router.replace('/anatomy/index')} />
        <View style={styles.center}>
          <Text style={styles.emptyText}>No questions available for this category yet.</Text>
        </View>
      </View>
    );
  }

  const question = session.questions[session.currentIndex];
  const selectedId = session.answers[question.id] ?? null;
  const isSubmitted = session.isAnswerSubmitted;
  const correctOption = question.options.find((o) => o.isCorrect);
  const isCorrect = selectedId != null && correctOption?.id === selectedId;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={category?.title ?? 'Anatomy'}
        onBack={handleBack}
      />
      <QuizProgressBar current={session.currentIndex + 1} total={session.questions.length} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnatomyQuestionCard
          question={question.question}
          options={question.options}
          selectedId={selectedId}
          isSubmitted={isSubmitted}
          onSelect={selectOption}
        />

        {isSubmitted && (
          <Card style={[
            styles.feedbackCard,
            { borderColor: isCorrect ? Colors.correct : Colors.incorrect },
          ]}>
            <View style={styles.feedbackHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={isCorrect ? Colors.correct : Colors.incorrect}
              />
              <Text style={[styles.feedbackLabel, { color: isCorrect ? Colors.correct : Colors.incorrect }]}>
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Text>
            </View>
            <Text style={styles.explanation}>{question.explanation}</Text>
            <View style={styles.clinicalRelevance}>
              <Text style={styles.clinicalLabel}>Clinical relevance</Text>
              <Text style={styles.clinicalText}>{question.clinicalRelevance}</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!isSubmitted ? (
          <Button
            title="Check Answer"
            onPress={submitAnswer}
            disabled={selectedId === null}
            size="lg"
            fullWidth
          />
        ) : (
          <Button
            title={session.currentIndex >= session.questions.length - 1 ? 'See Results' : 'Next Question'}
            onPress={nextQuestion}
            size="lg"
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: Layout.spacing.md, gap: Layout.spacing.md, paddingBottom: Layout.spacing.xxl },
  feedbackCard: {
    borderWidth: 1.5,
    gap: Layout.spacing.sm,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedbackLabel: { fontSize: 15, fontWeight: '700' },
  explanation: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  clinicalRelevance: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.sm,
    gap: 4,
  },
  clinicalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.info,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  clinicalText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  footer: {
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
