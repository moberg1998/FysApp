import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useProgress } from '@/hooks/useProgress';
import { clearProgress } from '@/store/progressStore';
import { TOPICS } from '@/data/topics';
import { Topic } from '@/types';

export default function ProgressScreen() {
  const router = useRouter();
  const { progress, isLoading, refresh, getBestScore, getLatestScore, getFlashcardProgress } = useProgress();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const availableTopics = TOPICS.filter((t) => t.isAvailable);

  const handleReset = () => {
    Alert.alert(
      'Nulstil al fremgang',
      'Er du sikker? Dette sletter alle quiz-resultater, flashkort-fremgang og case-historik.',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Nulstil',
          style: 'destructive',
          onPress: async () => { await clearProgress(); await refresh(); },
        },
      ]
    );
  };

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
    const totalUnsure = fps.reduce((sum, fp) => sum + fp.cards.filter((c) => c.status === 'unsure').length, 0);
    const totalRepeat = fps.reduce((sum, fp) => sum + fp.cards.filter((c) => c.status === 'repeat').length, 0);
    const totalCards = totalKnew + totalUnsure + totalRepeat;
    const sessions = fps.length;
    return { totalKnew, totalUnsure, totalRepeat, totalCards, sessions };
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
            <Text style={styles.emptyTitle}>Ingen resultater endnu</Text>
            <Text style={styles.emptyText}>Gennemfør en quiz eller flashkortsession for at se din fremgang her.</Text>
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
              <StatBox label="Kendte" value={`${flashcardStats.totalKnew}`} color={Colors.correct} />
              <StatBox label="Usikre" value={`${flashcardStats.totalUnsure}`} color={Colors.warning} />
              <StatBox label="Gentag" value={`${flashcardStats.totalRepeat}`} color={Colors.incorrect} />
            </View>
            {flashcardStats.totalCards > 0 && (
              <View style={styles.triBar}>
                {flashcardStats.totalKnew > 0 && (
                  <View style={[styles.triBarSegment, { flex: flashcardStats.totalKnew, backgroundColor: Colors.correct }]} />
                )}
                {flashcardStats.totalUnsure > 0 && (
                  <View style={[styles.triBarSegment, { flex: flashcardStats.totalUnsure, backgroundColor: Colors.warning }]} />
                )}
                {flashcardStats.totalRepeat > 0 && (
                  <View style={[styles.triBarSegment, { flex: flashcardStats.totalRepeat, backgroundColor: Colors.incorrect }]} />
                )}
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

        {/* Per-topic breakdown */}
        <View style={styles.sectionLabelRow}>
          <Ionicons name="grid" size={14} color={Colors.primary} />
          <Text style={styles.sectionLabelText}>Emner</Text>
        </View>

        {availableTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            best={getBestScore(topic.id)}
            latest={getLatestScore(topic.id)}
            fc={getFlashcardProgress(topic.id)}
            examCount={progress?.examResults.filter((r) => r.topicId === topic.id).length ?? 0}
          />
        ))}

        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.75}>
          <Text style={styles.resetButtonText}>Nulstil al fremgang</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

interface TopicCardProps {
  topic: Topic;
  best: number | null;
  latest: number | null;
  fc: { knew: number; unsure: number; repeat: number } | null;
  examCount: number;
}

function TopicCard({ topic, best, latest, fc, examCount }: TopicCardProps) {
  const hasData = best !== null || fc !== null || examCount > 0;
  const fcTotal = fc ? fc.knew + fc.unsure + fc.repeat : 0;

  return (
    <Card style={styles.topicCard}>
      <View style={styles.topicCardHeader}>
        <View style={[styles.topicDot, { backgroundColor: topic.color }]} />
        <View style={styles.topicCardTitles}>
          <Text style={styles.topicCardTitle}>{topic.title}</Text>
          <Text style={styles.topicCardSubtitle}>{topic.subtitle}</Text>
        </View>
      </View>

      {!hasData ? (
        <Text style={styles.topicEmpty}>Ingen aktivitet endnu</Text>
      ) : (
        <View style={styles.topicDetails}>
          {best !== null && (
            <View style={styles.topicDetailRow}>
              <Ionicons name="help-circle" size={13} color={Colors.modeQuiz} />
              <Text style={styles.topicDetailLabel}>Quiz</Text>
              <View style={styles.topicDetailRight}>
                <ScorePill value={best} color={Colors.correct} label="bedst" />
                {latest !== null && latest !== best && (
                  <ScorePill value={latest} color={Colors.primary} label="senest" />
                )}
              </View>
            </View>
          )}

          {fc !== null && (
            <View style={styles.topicDetailRow}>
              <Ionicons name="layers" size={13} color={Colors.modeFlashcard} />
              <Text style={styles.topicDetailLabel}>Flashkort</Text>
              <View style={styles.topicDetailRight}>
                <FCBadge value={fc.knew} color={Colors.correct} label="kendte" />
                <FCBadge value={fc.unsure} color={Colors.warning} label="usikre" />
                <FCBadge value={fc.repeat} color={Colors.incorrect} label="gentag" />
              </View>
            </View>
          )}

          {fc !== null && fcTotal > 0 && (
            <View style={styles.fcMiniBar}>
              {fc.knew > 0 && <View style={[styles.fcMiniSegment, { flex: fc.knew, backgroundColor: Colors.correct }]} />}
              {fc.unsure > 0 && <View style={[styles.fcMiniSegment, { flex: fc.unsure, backgroundColor: Colors.warning }]} />}
              {fc.repeat > 0 && <View style={[styles.fcMiniSegment, { flex: fc.repeat, backgroundColor: Colors.incorrect }]} />}
            </View>
          )}

          {examCount > 0 && (
            <View style={styles.topicDetailRow}>
              <Ionicons name="document-text" size={13} color={Colors.modeExam} />
              <Text style={styles.topicDetailLabel}>Cases</Text>
              <View style={styles.topicDetailRight}>
                <Text style={styles.examCount}>{examCount} gennemført</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

function ScorePill({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <View style={styles.scorePill}>
      <Text style={[styles.scorePillValue, { color }]}>{value}%</Text>
      <Text style={styles.scorePillLabel}>{label}</Text>
    </View>
  );
}

function FCBadge({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <View style={styles.fcBadge}>
      <Text style={[styles.fcBadgeValue, { color }]}>{value}</Text>
      <Text style={styles.fcBadgeLabel}>{label}</Text>
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

  triBar: {
    height: 5,
    flexDirection: 'row',
    borderRadius: 3,
    marginTop: Layout.spacing.md,
    overflow: 'hidden',
    gap: 1,
  },
  triBarSegment: { height: 5 },

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

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  topicCard: { gap: Layout.spacing.sm },
  topicCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm },
  topicDot: { width: 10, height: 10, borderRadius: 5 },
  topicCardTitles: { flex: 1 },
  topicCardTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  topicCardSubtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  topicEmpty: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic', paddingLeft: 18 },

  topicDetails: { gap: 6 },
  topicDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topicDetailLabel: { fontSize: 12, color: Colors.textSecondary, width: 60 },
  topicDetailRight: { flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' },

  scorePill: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scorePillValue: { fontSize: 13, fontWeight: '700' },
  scorePillLabel: { fontSize: 10, color: Colors.textMuted },

  fcBadge: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  fcBadgeValue: { fontSize: 13, fontWeight: '700' },
  fcBadgeLabel: { fontSize: 10, color: Colors.textMuted },

  fcMiniBar: {
    height: 4,
    flexDirection: 'row',
    borderRadius: 2,
    marginTop: 2,
    marginLeft: 19,
    overflow: 'hidden',
    gap: 1,
  },
  fcMiniSegment: { height: 4 },

  examCount: { fontSize: 13, fontWeight: '600', color: Colors.modeExam },

  resetButton: {
    marginTop: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.incorrect + '50',
    backgroundColor: Colors.incorrectSubtle,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.incorrect,
  },
});
