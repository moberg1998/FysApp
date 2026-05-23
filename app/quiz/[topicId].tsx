import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { TOPICS } from '@/data/topics';
import { parkinsonQuiz } from '@/data/parkinson/quiz';
import { msQuiz } from '@/data/ms/quiz';
import { strokeQuiz } from '@/data/stroke/quiz';
import { neuroGroupQuiz } from '@/data/neuro-group/quiz';
import { homeTreatmentQuiz } from '@/data/home-treatment/quiz';
import { lowBackQuiz } from '@/data/low-back/quiz';
import { neckQuiz } from '@/data/neck/quiz';
import { shoulderQuiz } from '@/data/shoulder/quiz';
import { hipKneeQuiz } from '@/data/hip-knee/quiz';
import { redFlagsQuiz } from '@/data/red-flags/quiz';
import { useQuizSession } from '@/context/QuizSessionContext';
import { QuizQuestion } from '@/types';
import { shuffle } from '@/utils/shuffle';

const ALL_QUESTIONS: Record<string, QuizQuestion[]> = {
  parkinson: parkinsonQuiz,
  'multiple-sclerosis': msQuiz,
  stroke: strokeQuiz,
  'neuro-group-training': neuroGroupQuiz,
  'home-treatment': homeTreatmentQuiz,
  'low-back-pain': lowBackQuiz,
  'neck-pain': neckQuiz,
  shoulder: shoulderQuiz,
  'hip-knee-oa': hipKneeQuiz,
  'red-flags': redFlagsQuiz,
};

const LENGTHS = [5, 10, 20, 0] as const;
const LENGTH_LABELS: Record<number, string> = { 5: '5 spørgsmål', 10: '10 spørgsmål', 20: '20 spørgsmål', 0: 'Alle spørgsmål' };

export default function QuizConfig() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const { startSession } = useQuizSession();
  const [selectedLength, setSelectedLength] = useState<number>(10);

  const topic = TOPICS.find((t) => t.id === topicId);
  const questions = ALL_QUESTIONS[topicId ?? ''] ?? [];

  const handleStart = () => {
    const shuffledQuestions = shuffle(questions);
    const selected = selectedLength > 0 && selectedLength < shuffledQuestions.length
      ? shuffledQuestions.slice(0, selectedLength)
      : shuffledQuestions;
    const withShuffledOptions = selected.map((q) => ({ ...q, options: shuffle(q.options) }));
    startSession(topicId ?? '', withShuffledOptions);
    router.push('/quiz/session');
  };

  if (!topic) return null;

  if (questions.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={topic.title} onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.emptyText}>Quiz-spørgsmål til dette emne er under udarbejdelse. Prøv de kliniske cases i mellemtiden.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={topic.title} subtitle="Konfigurer din session" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>Tilgængelige spørgsmål</Text>
          <Text style={styles.infoValue}>{questions.length}</Text>
        </Card>

        <Text style={styles.sectionLabel}>Sessionslængde</Text>
        <View style={styles.lengthGrid}>
          {LENGTHS.map((len) => {
            const isAvailable = len === 0 || len <= questions.length;
            const isSelected = selectedLength === len;
            return (
              <TouchableOpacity
                key={len}
                onPress={() => isAvailable && setSelectedLength(len)}
                disabled={!isAvailable}
                style={[
                  styles.lengthOption,
                  isSelected && styles.lengthOptionSelected,
                  !isAvailable && styles.lengthOptionDisabled,
                ]}
              >
                <Text style={[styles.lengthText, isSelected && styles.lengthTextSelected, !isAvailable && styles.lengthTextDisabled]}>
                  {len === 0 ? `All ${questions.length}` : len}
                </Text>
                <Text style={[styles.lengthSubtext, isSelected && styles.lengthSubtextSelected]}>
                  {len === 0 ? 'spørgsmål' : 'sp.'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title="Start quiz"
          onPress={handleStart}
          disabled={questions.length === 0}
          size="lg"
          fullWidth
          style={styles.startButton}
        />

        {questions.length === 0 && (
          <Text style={styles.emptyNote}>Ingen spørgsmål tilgængeligt for dette emne endnu.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lengthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  lengthOption: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  lengthOptionSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  lengthOptionDisabled: { opacity: 0.35 },
  lengthText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  lengthTextSelected: { color: Colors.primary },
  lengthTextDisabled: { color: Colors.textMuted },
  lengthSubtext: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  lengthSubtextSelected: { color: Colors.primary },
  startButton: { marginTop: Layout.spacing.sm },
  emptyNote: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
