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
import { balancePosturalQuestions } from '@/data/anatomy/balancePostural';
import { basalGangliaParkinsonQuestions } from '@/data/anatomy/basalGangliaParkinson';
import { corticospinalStrokeQuestions } from '@/data/anatomy/corticospinalStroke';
import { lumbarSpineQuestions } from '@/data/anatomy/lumbarSpine';
import { cervicalSpineQuestions } from '@/data/anatomy/cervicalSpine';
import { AnatomyQuestion } from '@/types';
import { shuffle } from '@/utils/shuffle';

const ALL_QUESTIONS: Record<string, AnatomyQuestion[]> = {
  'hip-pelvis': hipPelvisQuestions,
  'knee': kneeQuestions,
  'ankle-foot': ankleFootQuestions,
  'gait-cycle': gaitCycleQuestions,
  'balance-postural': balancePosturalQuestions,
  'basal-ganglia-parkinson': basalGangliaParkinsonQuestions,
  'corticospinal-stroke': corticospinalStrokeQuestions,
  'lumbar-spine': lumbarSpineQuestions,
  'cervical-spine': cervicalSpineQuestions,
};

export default function AnatomySession() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const { session, startSession, selectOption, submitAnswer, nextQuestion } = useAnatomySession();

  const category = ANATOMY_CATEGORIES.find((c) => c.id === categoryId);
  const questions = ALL_QUESTIONS[categoryId ?? ''] ?? [];

  useEffect(() => {
    if (questions.length > 0 && (!session || session.categoryId !== categoryId)) {
      const shuffled = shuffle(questions).map((q) => ({ ...q, options: shuffle(q.options) }));
      startSession(categoryId ?? '', shuffled);
    }
  }, [categoryId]);

  useEffect(() => {
    if (session?.isComplete) {
      router.replace('/anatomy/results');
    }
  }, [session?.isComplete]);

  const handleBack = () => {
    Alert.alert('Afslut session', 'Din fremgang slettes.', [
      { text: 'Annuller', style: 'cancel' },
      { text: 'Afslut', style: 'destructive', onPress: () => router.replace('/anatomy') },
    ]);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Anatomi" onBack={() => router.replace('/anatomy')} />
        <View style={styles.center}>
          <Text style={styles.emptyText}>Ingen spørgsmål tilgængeligt for denne kategori endnu.</Text>
        </View>
      </View>
    );
  }

  if (!session) return null;

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
          imageKey={question.imageKey}
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
                {isCorrect ? 'Korrekt' : 'Forkert'}
              </Text>
            </View>
            <Text style={styles.explanation}>{question.explanation}</Text>
            <View style={styles.clinicalRelevance}>
              <Text style={styles.clinicalLabel}>Klinisk relevans</Text>
              <Text style={styles.clinicalText}>{question.clinicalRelevance}</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!isSubmitted ? (
          <Button
            title="Tjek svar"
            onPress={submitAnswer}
            disabled={selectedId === null}
            size="lg"
            fullWidth
          />
        ) : (
          <Button
            title={session.currentIndex >= session.questions.length - 1 ? 'Se resultater' : 'Næste spørgsmål'}
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
