import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { QuizProgressBar } from '@/components/quiz/QuizProgressBar';
import { OptionButton } from '@/components/quiz/OptionButton';
import { FeedbackPanel } from '@/components/quiz/FeedbackPanel';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useQuizSession } from '@/context/QuizSessionContext';
import { QuizQuestion, QuizOption } from '@/types';

function getOptionState(
  option: QuizOption,
  selectedIds: string[],
  isSubmitted: boolean,
): 'idle' | 'selected' | 'correct' | 'incorrect' | 'missed' {
  const isSelected = selectedIds.includes(option.id);
  if (!isSubmitted) {
    return isSelected ? 'selected' : 'idle';
  }
  if (option.isCorrect && isSelected) return 'correct';
  if (!option.isCorrect && isSelected) return 'incorrect';
  if (option.isCorrect && !isSelected) return 'missed';
  return 'idle';
}

function evaluateAnswer(question: QuizQuestion, selectedIds: string[]): 'correct' | 'partial' | 'incorrect' {
  const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o.id);
  const correctSelected = selectedIds.filter((id) => correctIds.includes(id));
  const incorrectSelected = selectedIds.filter((id) => !correctIds.includes(id));

  if (incorrectSelected.length === 0 && correctSelected.length === correctIds.length) return 'correct';
  if (correctSelected.length > 0 && incorrectSelected.length === 0) return 'partial';
  if (correctSelected.length > 0) return 'partial';
  return 'incorrect';
}

export default function QuizSession() {
  const router = useRouter();
  const { session, toggleOption, submitAnswer, nextQuestion } = useQuizSession();

  useEffect(() => {
    if (!session) {
      router.replace('/quiz/index');
    } else if (session.isComplete) {
      router.replace('/quiz/results');
    }
  }, [session, router]);

  if (!session) return null;

  const question = session.questions[session.currentIndex];
  const selectedIds = session.answers[question.id] ?? [];
  const isMultiple = question.type === 'multiple';
  const isSubmitted = session.isAnswerSubmitted;
  const feedbackType = isSubmitted ? evaluateAnswer(question, selectedIds) : 'correct';

  const correctCount = question.options.filter((o) => o.isCorrect).length;
  const selectedCorrect = selectedIds.filter((id) => question.options.find((o) => o.id === id)?.isCorrect).length;
  const partialInfo = isMultiple && isSubmitted
    ? `${selectedCorrect} of ${correctCount} correct answers`
    : undefined;

  const handleBack = () => {
    Alert.alert('Exit Quiz', 'Your progress will be lost. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => router.replace('/quiz/index') },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={isMultiple ? 'Select all that apply' : 'Select one answer'}
        onBack={handleBack}
      />
      <QuizProgressBar current={session.currentIndex + 1} total={session.questions.length} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Context/vignette */}
        {question.context && (
          <Card style={styles.contextCard}>
            <View style={styles.contextHeader}>
              <Ionicons name="person" size={14} color={Colors.info} />
              <Text style={styles.contextLabel}>Clinical Scenario</Text>
            </View>
            <Text style={styles.contextText}>{question.context}</Text>
          </Card>
        )}

        {/* Stem */}
        <Text style={styles.stem}>{question.stem}</Text>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((option) => (
            <OptionButton
              key={option.id}
              optionId={option.id}
              text={option.text}
              state={getOptionState(option, selectedIds, isSubmitted)}
              onPress={() => toggleOption(option.id)}
              disabled={isSubmitted}
            />
          ))}
        </View>

        {/* Feedback */}
        {isSubmitted && (
          <FeedbackPanel
            type={feedbackType}
            explanation={question.explanation}
            takeaway={question.takeaway}
            partialInfo={partialInfo}
          />
        )}
      </ScrollView>

      {/* Footer actions */}
      <View style={styles.footer}>
        {!isSubmitted ? (
          <Button
            title="Check Answer"
            onPress={submitAnswer}
            disabled={selectedIds.length === 0}
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
  scrollContent: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
  },
  contextCard: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '30',
    gap: 8,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.info,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  contextText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  stem: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 25,
  },
  options: { gap: Layout.spacing.sm },
  footer: {
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});
