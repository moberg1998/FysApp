import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useExamSession } from '@/context/ExamSessionContext';
import { useProgress } from '@/hooks/useProgress';
import { generateId } from '@/store/progressStore';
import { ExamResult, ExamStepScore } from '@/types';

const STEP_LABELS = ['Anamnesis', 'Red Flags', 'Examination', 'Reasoning', 'Treatment', 'Documentation'];

export default function ExamResults() {
  const router = useRouter();
  const { session, resetSession } = useExamSession();
  const { addExamResult } = useProgress();
  const savedRef = useRef(false);

  const computeStepScores = (): { stepScores: ExamStepScore[]; totalCorrect: number; totalPossible: number } => {
    if (!session) return { stepScores: [], totalCorrect: 0, totalPossible: 0 };
    let totalCorrect = 0;
    let totalPossible = 0;
    const stepScores: ExamStepScore[] = session.examCase.steps.map((step, i) => {
      const selected = session.stepAnswers[i] ?? [];
      const correctIds = step.options.filter((o) => o.isCorrect).map((o) => o.id);
      const correctCount = selected.filter((id) => correctIds.includes(id)).length;
      totalCorrect += correctCount;
      totalPossible += correctIds.length;
      return {
        stepNumber: step.stepNumber,
        selectedOptionIds: selected,
        correctCount,
        totalCorrect: correctIds.length,
      };
    });
    return { stepScores, totalCorrect, totalPossible };
  };

  const { stepScores, totalCorrect, totalPossible } = computeStepScores();
  const percentage = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;
  const passed = percentage >= 60;

  useEffect(() => {
    if (session && !savedRef.current) {
      savedRef.current = true;
      const result: ExamResult = {
        id: generateId(),
        topicId: session.topicId,
        caseId: session.examCase.id,
        completedAt: Date.now(),
        stepScores,
        totalCorrect,
        totalPossible,
        percentage,
        passed,
      };
      addExamResult(result);
    }
  }, []);

  if (!session) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Results" onBack={() => router.replace('/exam')} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No session data.</Text>
          <Button title="Back to Cases" onPress={() => { resetSession(); router.replace('/exam'); }} />
        </View>
      </View>
    );
  }

  const scoreLabel = passed
    ? percentage >= 80 ? 'Excellent clinical reasoning' : 'Case completed'
    : 'Review needed';

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Case Results" onBack={() => { resetSession(); router.replace('/exam'); }} showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score section */}
        <View style={styles.scoreRow}>
          <ScoreCircle score={percentage} size={110} label={scoreLabel} />
          <View style={styles.statsColumn}>
            <View style={styles.passChip}>
              <Ionicons
                name={passed ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={passed ? Colors.correct : Colors.incorrect}
              />
              <Text style={[styles.passText, { color: passed ? Colors.correct : Colors.incorrect }]}>
                {passed ? 'Pass' : 'Did not pass'}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Correct selections</Text>
              <Text style={[styles.statValue, { color: Colors.textPrimary }]}>{totalCorrect} / {totalPossible}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Pass threshold</Text>
              <Text style={styles.statValue}>60%</Text>
            </View>
          </View>
        </View>

        {/* Step breakdown */}
        <Card>
          <Text style={styles.breakdownTitle}>Step Breakdown</Text>
          {stepScores.map((s, i) => {
            const pct = s.totalCorrect > 0 ? Math.round((s.correctCount / s.totalCorrect) * 100) : 0;
            const color = pct >= 70 ? Colors.correct : pct >= 40 ? Colors.warning : Colors.incorrect;
            return (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <Text style={styles.stepLabel}>{STEP_LABELS[i]}</Text>
                  <View style={styles.stepBar}>
                    <View style={[styles.stepBarFill, { width: `${pct}%` as unknown as number, backgroundColor: color }]} />
                  </View>
                </View>
                <Text style={[styles.stepScore, { color }]}>{s.correctCount}/{s.totalCorrect}</Text>
              </View>
            );
          })}
        </Card>

        {/* Case title */}
        <Card>
          <View style={styles.caseInfo}>
            <Ionicons name="person" size={16} color={Colors.modeExam} />
            <View style={{ flex: 1 }}>
              <Text style={styles.caseName}>{session.examCase.title}</Text>
              <Text style={styles.caseProfile} numberOfLines={2}>{session.examCase.patientProfile}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Try Again"
            onPress={() => {
              const examCase = session.examCase;
              const topicId = session.topicId;
              resetSession();
              router.replace(`/exam/${topicId}`);
            }}
            variant="secondary"
            size="lg"
            fullWidth
          />
          <Button
            title="Back to Cases"
            onPress={() => { resetSession(); router.replace('/exam'); }}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Layout.spacing.md, gap: Layout.spacing.md, paddingBottom: Layout.spacing.xxl },
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
  statsColumn: { flex: 1, gap: Layout.spacing.sm },
  passChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  passText: { fontSize: 16, fontWeight: '700' },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  statLabel: { flex: 1, fontSize: 13, color: Colors.textSecondary },
  statValue: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  stepLeft: { flex: 1, gap: 4 },
  stepLabel: { fontSize: 12, color: Colors.textSecondary },
  stepBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stepBarFill: {
    height: 4,
    borderRadius: 2,
  },
  stepScore: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
  caseInfo: { flexDirection: 'row', gap: Layout.spacing.sm },
  caseName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  caseProfile: { fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
  actions: { gap: Layout.spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Layout.spacing.xl, gap: Layout.spacing.md },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
