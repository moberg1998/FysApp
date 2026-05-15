import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAnatomySession } from '@/context/AnatomySessionContext';
import { ANATOMY_CATEGORIES } from '@/data/anatomy/categories';

export default function AnatomyResults() {
  const router = useRouter();
  const { session, resetSession } = useAnatomySession();

  if (!session) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Resultater" onBack={() => router.replace('/anatomy/index')} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Ingen sessionsdata.</Text>
          <Button title="Tilbage til anatomi" onPress={() => { resetSession(); router.replace('/anatomy/index'); }} />
        </View>
      </View>
    );
  }

  const correct = session.questions.filter((q) => {
    const selected = session.answers[q.id];
    return selected != null && q.options.find((o) => o.id === selected)?.isCorrect;
  }).length;

  const total = session.questions.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const category = ANATOMY_CATEGORIES.find((c) => c.id === session.categoryId);
  const scoreLabel = score >= 75 ? 'Godt klaret' : score >= 50 ? 'God indsats' : 'Bliv ved med at øve';

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Session afsluttet" onBack={() => { resetSession(); router.replace('/anatomy/index'); }} showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreRow}>
          <ScoreCircle score={score} size={110} label={scoreLabel} />
          <View style={styles.statsColumn}>
            <StatRow icon="checkmark-circle" color={Colors.correct} label="Korrekt" value={`${correct}`} />
            <StatRow icon="close-circle" color={Colors.incorrect} label="Forkert" value={`${total - correct}`} />
            <StatRow icon="layers" color={Colors.textSecondary} label="I alt" value={`${total}`} />
          </View>
        </View>

        {/* Question review */}
        <Card>
          <Text style={styles.reviewTitle}>Spørgsmålsgennemgang</Text>
          {session.questions.map((q, i) => {
            const selected = session.answers[q.id];
            const isCorrect = selected != null && q.options.find((o) => o.id === selected)?.isCorrect;
            const correctOption = q.options.find((o) => o.isCorrect);
            return (
              <View key={q.id} style={[styles.reviewItem, i > 0 && styles.reviewBorder]}>
                <View style={styles.reviewHeader}>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={14}
                    color={isCorrect ? Colors.correct : Colors.incorrect}
                  />
                  <Text style={styles.reviewNum}>Q{i + 1}</Text>
                  <Text style={styles.reviewQuestion} numberOfLines={2}>{q.question}</Text>
                </View>
                {!isCorrect && correctOption && (
                  <Text style={styles.reviewAnswer}>Korrekt: {correctOption.text}</Text>
                )}
              </View>
            );
          })}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Studér igen"
            onPress={() => { resetSession(); router.replace({ pathname: '/anatomy/[categoryId]', params: { categoryId: session.categoryId } }); }}
            variant="secondary"
            size="lg"
            fullWidth
          />
          <Button
            title="Tilbage til kategorier"
            onPress={() => { resetSession(); router.replace('/anatomy/index'); }}
            variant="ghost"
            size="lg"
            fullWidth
          />
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
  statsColumn: { flex: 1, gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  statValue: { fontSize: 16, fontWeight: '700' },
  reviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  reviewItem: { paddingVertical: Layout.spacing.sm, gap: 4 },
  reviewBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  reviewNum: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  reviewQuestion: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  reviewAnswer: {
    fontSize: 12,
    color: Colors.correct,
    marginLeft: 22,
    fontStyle: 'italic',
  },
  actions: { gap: Layout.spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Layout.spacing.xl, gap: Layout.spacing.md },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
