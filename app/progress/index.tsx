import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useProgress } from '@/hooks/useProgress';
import { TOPICS } from '@/data/topics';

export default function ProgressScreen() {
  const router = useRouter();
  const { progress, isLoading } = useProgress();

  const availableTopics = TOPICS.filter((t) => t.isAvailable);

  const quizStats = React.useMemo(() => {
    if (!progress) return null;
    const results = progress.quizResults;
    if (results.length === 0) return null;
    const best = Math.max(...results.map((r) => r.score));
    const latest = results[results.length - 1]?.score ?? 0;
    const total = results.length;
    return { best, latest, total };
  }, [progress]);

  const flashcardStats = React.useMemo(() => {
    if (!progress) return null;
    const fps = progress.flashcardProgress;
    if (fps.length === 0) return null;
    const totalKnew = fps.reduce((sum, fp) => sum + fp.cards.filter((c) => c.status === 'knew').length, 0);
    const totalCards = fps.reduce((sum, fp) => sum + fp.cards.length, 0);
    const sessions = fps.length;
    return { totalKnew, totalCards, sessions };
  }, [progress]);

  const examStats = React.useMemo(() => {
    if (!progress) return null;
    const results = progress.examResults;
    if (results.length === 0) return null;
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const best = Math.max(...results.map((r) => r.percentage));
    return { passed, total, best };
  }, [progress]);

  const weakAreas = progress?.weakAreas
    .filter((w) => w.totalAttempts > 0)
    .sort((a, b) => (b.incorrectCount / b.totalAttempts) - (a.incorrectCount / a.totalAttempts))
    .slice(0, 5) ?? [];

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Fremgang" onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.loadingText}>Indlæser...</Text>
        </View>
      </View>
    );
  }

  const hasAnyData = quizStats || flashcardStats || examStats;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Fremgang" subtitle="Din læringsoversigt" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {!hasAnyData && (
          <View style={styles.emptyBanner}>
            <Ionicons name="stats-chart" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Ingen aktivitet endnu</Text>
            <Text style={styles.emptyText}>Gennemfør en quiz, flashkort-session eller eksamen for at se din fremgang her.</Text>
          </View>
        )}

        {/* Quiz stats */}
        {quizStats && (
          <Card>
            <SectionHeader icon="help-circle" color={Colors.modeQuiz} title="Quiz" />
            <View style={styles.statsGrid}>
              <StatBox label="Sessioner" value={`${quizStats.total}`} color={Colors.textPrimary} />
              <StatBox label="Bedste score" value={`${quizStats.best}%`} color={Colors.correct} />
              <StatBox label="Seneste" value={`${quizStats.latest}%`} color={Colors.primary} />
            </View>
          </Card>
        )}

        {/* Flashcard stats */}
        {flashcardStats && (
          <Card>
            <SectionHeader icon="layers" color={Colors.modeFlashcard} title="Flashkort" />
            <View style={styles.statsGrid}>
              <StatBox label="Sessioner" value={`${flashcardStats.sessions}`} color={Colors.textPrimary} />
              <StatBox label="Vidste det" value={`${flashcardStats.totalKnew}`} color={Colors.correct} />
              <StatBox label="Samlet bedømt" value={`${flashcardStats.totalCards}`} color={Colors.textSecondary} />
            </View>
            {flashcardStats.totalCards > 0 && (
              <View style={styles.knewBar}>
                <View style={[
                  styles.knewBarFill,
                  { width: `${Math.round((flashcardStats.totalKnew / flashcardStats.totalCards) * 100)}%` as unknown as number },
                ]} />
              </View>
            )}
          </Card>
        )}

        {/* Exam stats */}
        {examStats && (
          <Card>
            <SectionHeader icon="document" color={Colors.modeExam} title="Kliniske cases" />
            <View style={styles.statsGrid}>
              <StatBox label="Forsøg" value={`${examStats.total}`} color={Colors.textPrimary} />
              <StatBox label="Bestået" value={`${examStats.passed}`} color={Colors.correct} />
              <StatBox label="Bedste score" value={`${examStats.best}%`} color={Colors.primary} />
            </View>
          </Card>
        )}

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <Card>
            <SectionHeader icon="trending-down" color={Colors.warning} title="Fokusområder" />
            {weakAreas.map((area) => {
              const errorRate = Math.round((area.incorrectCount / area.totalAttempts) * 100);
              return (
                <View key={area.tag} style={styles.weakRow}>
                  <View style={styles.weakTag}>
                    <Text style={styles.weakTagText}>{area.tag.replace(/-/g, ' ')}</Text>
                  </View>
                  <View style={styles.weakRight}>
                    <Text style={styles.weakRate}>{errorRate}% fejl</Text>
                    <Text style={styles.weakAttempts}>{area.totalAttempts} forsøg</Text>
                  </View>
                </View>
              );
            })}
          </Card>
        )}

        {/* Topic progress */}
        <Card>
          <SectionHeader icon="grid" color={Colors.primary} title="Emner" />
          {availableTopics.map((topic) => {
            const quizBest = progress?.quizResults
              .filter((r) => r.topicId === topic.id)
              .reduce((max, r) => Math.max(max, r.score), 0) ?? 0;
            const examAttempts = progress?.examResults.filter((r) => r.topicId === topic.id).length ?? 0;
            const fcSessions = progress?.flashcardProgress.filter((f) => f.topicId === topic.id).length ?? 0;
            return (
              <View key={topic.id} style={styles.topicRow}>
                <View style={[styles.topicDot, { backgroundColor: topic.color }]} />
                <Text style={styles.topicName}>{topic.title}</Text>
                <View style={styles.topicStats}>
                  {quizBest > 0 && (
                    <View style={styles.miniChip}>
                      <Ionicons name="help-circle" size={10} color={Colors.modeQuiz} />
                      <Text style={styles.miniChipText}>{quizBest}%</Text>
                    </View>
                  )}
                  {examAttempts > 0 && (
                    <View style={styles.miniChip}>
                      <Ionicons name="document" size={10} color={Colors.modeExam} />
                      <Text style={styles.miniChipText}>{examAttempts}</Text>
                    </View>
                  )}
                  {fcSessions > 0 && (
                    <View style={styles.miniChip}>
                      <Ionicons name="layers" size={10} color={Colors.modeFlashcard} />
                      <Text style={styles.miniChipText}>{fcSessions}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

      </ScrollView>
    </View>
  );
}

function SectionHeader({ icon, color, title }: { icon: string; color: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as 'grid'} size={16} color={color} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, { color }]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Layout.spacing.md, gap: Layout.spacing.md, paddingBottom: Layout.spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, color: Colors.textMuted },
  emptyBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
    gap: Layout.spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Layout.spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  statsGrid: { flexDirection: 'row', gap: Layout.spacing.sm },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statBoxValue: { fontSize: 20, fontWeight: '800' },
  statBoxLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  knewBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: Layout.spacing.sm,
    overflow: 'hidden',
  },
  knewBarFill: {
    height: 4,
    backgroundColor: Colors.correct,
    borderRadius: 2,
  },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  weakTag: {
    flex: 1,
    backgroundColor: Colors.warningSubtle,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
  },
  weakTagText: { fontSize: 12, color: Colors.warning, fontWeight: '600' },
  weakRight: { alignItems: 'flex-end', gap: 2 },
  weakRate: { fontSize: 13, fontWeight: '700', color: Colors.warning },
  weakAttempts: { fontSize: 11, color: Colors.textMuted },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  topicDot: { width: 8, height: 8, borderRadius: 4 },
  topicName: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  topicStats: { flexDirection: 'row', gap: 6 },
  miniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  miniChipText: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
});
