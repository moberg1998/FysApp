import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { Badge } from '@/components/ui/Badge';
import { OptionButton } from '@/components/quiz/OptionButton';
import { FeedbackPanel } from '@/components/quiz/FeedbackPanel';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useQuizSession } from '@/context/QuizSessionContext';
import { useProgress } from '@/hooks/useProgress';
import { generateId } from '@/store/progressStore';
import { QuizQuestion, UserQuizResult } from '@/types';

function computeResults(questions: QuizQuestion[], answers: Record<string, string[]>) {
  let correct = 0, partial = 0, incorrect = 0;
  const weakTags = new Set<string>();
  const questionResults = questions.map((q) => {
    const selected = answers[q.id] ?? [];
    const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    const correctSelected = selected.filter((id) => correctIds.includes(id));
    const incorrectSelected = selected.filter((id) => !correctIds.includes(id));
    let isCorrect = false;
    let isPartiallyCorrect = false;
    if (incorrectSelected.length === 0 && correctSelected.length === correctIds.length) {
      correct++;
      isCorrect = true;
    } else if (correctSelected.length > 0 && incorrectSelected.length === 0) {
      partial++;
      isPartiallyCorrect = true;
      q.tags.forEach((t) => weakTags.add(t));
    } else {
      incorrect++;
      q.tags.forEach((t) => weakTags.add(t));
    }
    return { questionId: q.id, selectedOptionIds: selected, isCorrect, isPartiallyCorrect };
  });

  const score = Math.round(((correct + partial * 0.5) / questions.length) * 100);
  return {
    correct,
    partial,
    incorrect,
    score,
    weakTags: Array.from(weakTags),
    questionResults,
  };
}

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'missed';

function getReviewOptionState(optionId: string, isCorrect: boolean, selectedIds: string[]): OptionState {
  const isSelected = selectedIds.includes(optionId);
  if (isCorrect && isSelected) return 'correct';
  if (!isCorrect && isSelected) return 'incorrect';
  if (isCorrect && !isSelected) return 'missed';
  return 'idle';
}

export default function QuizResults() {
  const router = useRouter();
  const { session, resetSession } = useQuizSession();
  const { addQuizResult } = useProgress();
  const savedRef = useRef(false);
  const [showReview, setShowReview] = useState(false);

  const results = session
    ? computeResults(session.questions, session.answers)
    : null;

  useEffect(() => {
    if (session && results && !savedRef.current) {
      savedRef.current = true;
      const result: UserQuizResult = {
        id: generateId(),
        topicId: session.topicId,
        completedAt: Date.now(),
        totalQuestions: session.questions.length,
        correctCount: results.correct,
        partialCount: results.partial,
        incorrectCount: results.incorrect,
        score: results.score,
        weakTags: results.weakTags,
        questionResults: results.questionResults,
      };
      addQuizResult(result);
    }
  }, []);

  if (!session || !results) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Resultater" onBack={() => router.replace('/quiz/index')} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Ingen sessionsdata. Gå tilbage til quiz.</Text>
          <Button title="Gå til quiz" onPress={() => { resetSession(); router.replace('/quiz/index'); }} />
        </View>
      </View>
    );
  }

  const scoreLabel = results.score >= 75 ? 'Fremragende' : results.score >= 50 ? 'God indsats' : 'Bliv ved med at øve';

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Resultater" onBack={() => { resetSession(); router.replace('/quiz/index'); }} showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score */}
        <View style={styles.scoreRow}>
          <ScoreCircle score={results.score} size={110} label={scoreLabel} />
          <View style={styles.statsColumn}>
            <StatRow icon="checkmark-circle" color={Colors.correct} label="Korrekt" value={`${results.correct}`} />
            <StatRow icon="alert-circle" color={Colors.warning} label="Delvist" value={`${results.partial}`} />
            <StatRow icon="close-circle" color={Colors.incorrect} label="Forkert" value={`${results.incorrect}`} />
            <StatRow icon="layers" color={Colors.textSecondary} label="I alt" value={`${session.questions.length}`} />
          </View>
        </View>

        {/* Weak areas */}
        {results.weakTags.length > 0 && (
          <Card>
            <View style={styles.weakHeader}>
              <Ionicons name="trending-down" size={16} color={Colors.warning} />
              <Text style={styles.weakTitle}>Områder at gennemgå</Text>
            </View>
            <View style={styles.tagRow}>
              {results.weakTags.map((tag) => (
                <Badge key={tag} label={tag.replace(/-/g, ' ')} variant="warning" />
              ))}
            </View>
          </Card>
        )}

        {/* Review toggle */}
        <TouchableOpacity
          style={styles.reviewToggle}
          onPress={() => setShowReview((v) => !v)}
          activeOpacity={0.75}
        >
          <Text style={styles.reviewToggleText}>
            {showReview ? 'Skjul spørgsmålsgennemgang' : 'Gennemgå alle spørgsmål'}
          </Text>
          <Ionicons name={showReview ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.primary} />
        </TouchableOpacity>

        {/* Question review */}
        {showReview && session.questions.map((q, i) => {
          const selectedIds = session.answers[q.id] ?? [];
          const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
          const allCorrect = selectedIds.length > 0 &&
            selectedIds.every((id) => correctIds.includes(id)) &&
            correctIds.every((id) => selectedIds.includes(id));
          const feedbackType = allCorrect ? 'correct' : (selectedIds.some((id) => correctIds.includes(id)) && !selectedIds.some((id) => !correctIds.includes(id))) ? 'partial' : 'incorrect';

          return (
            <Card key={q.id} style={styles.reviewCard}>
              <View style={styles.reviewNum}>
                <Text style={styles.reviewNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.reviewStem}>{q.stem}</Text>
              <View style={styles.reviewOptions}>
                {q.options.map((opt) => (
                  <OptionButton
                    key={opt.id}
                    optionId={opt.id}
                    text={opt.text}
                    state={getReviewOptionState(opt.id, opt.isCorrect, selectedIds)}
                    disabled
                  />
                ))}
              </View>
              <FeedbackPanel
                type={feedbackType}
                explanation={q.explanation}
                takeaway={q.takeaway}
              />
            </Card>
          );
        })}

        <View style={styles.actions}>
          <Button title="Ny session" onPress={() => { resetSession(); router.replace('/quiz/index'); }} variant="secondary" size="lg" fullWidth />
        </View>
      </ScrollView>
    </View>
  );
}

function StatRow({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Ionicons name={icon as 'checkmark-circle'} size={16} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
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
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsColumn: { flex: 1, gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  statValue: { fontSize: 16, fontWeight: '700' },
  weakHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  weakTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  reviewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewToggleText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  reviewCard: { gap: Layout.spacing.md },
  reviewNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewNumText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  reviewStem: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, lineHeight: 22 },
  reviewOptions: { gap: Layout.spacing.sm },
  actions: { marginTop: Layout.spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Layout.spacing.xl, gap: Layout.spacing.md },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
