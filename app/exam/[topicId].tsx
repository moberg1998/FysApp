import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { CaseCard } from '@/components/exam/CaseCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { parkinsonExamCases } from '@/data/parkinson/examCases';
import { msExamCases } from '@/data/ms/examCases';
import { strokeExamCases } from '@/data/stroke/examCases';
import { neuroGroupExamCases } from '@/data/neuro-group/examCases';
import { homeTreatmentExamCases } from '@/data/home-treatment/examCases';
import { lowBackExamCases } from '@/data/low-back/examCases';
import { neckExamCases } from '@/data/neck/examCases';
import { shoulderExamCases } from '@/data/shoulder/examCases';
import { hipKneeExamCases } from '@/data/hip-knee/examCases';
import { redFlagsExamCases } from '@/data/red-flags/examCases';
import { getTopicById } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import { useExamSession } from '@/context/ExamSessionContext';
import { ExamCase } from '@/types';

const ALL_EXAM_CASES: Record<string, ExamCase[]> = {
  parkinson: parkinsonExamCases,
  'multiple-sclerosis': msExamCases,
  stroke: strokeExamCases,
  'neuro-group-training': neuroGroupExamCases,
  'home-treatment': homeTreatmentExamCases,
  'low-back-pain': lowBackExamCases,
  'neck-pain': neckExamCases,
  shoulder: shoulderExamCases,
  'hip-knee-oa': hipKneeExamCases,
  'red-flags': redFlagsExamCases,
};

export default function ExamCaseList() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const { progress } = useProgress();
  const { startSession } = useExamSession();

  if (!topicId) return null;

  const topic = getTopicById(topicId);
  const cases = ALL_EXAM_CASES[topicId] ?? [];

  const handleSelectCase = (examCase: ExamCase) => {
    startSession(topicId ?? '', examCase);
    router.push('/exam/session');
  };

  const getScore = (caseId: string): number | null => {
    if (!progress) return null;
    const results = progress.examResults.filter((r) => r.caseId === caseId);
    if (results.length === 0) return null;
    return Math.max(...results.map((r) => r.percentage));
  };

  if (!topic?.isAvailable || cases.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Kliniske cases" onBack={() => router.back()} />
        <EmptyState
          icon="construct"
          title="Kommer snart"
          message="Kliniske cases til dette emne er under udarbejdelse. Kom tilbage snart."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={topic.title} subtitle="Vælg en case" onBack={() => router.back()} />
      <FlatList
        data={cases}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Arbejd dig gennem hvert trin. Vælg alle passende handlinger for hvert klinisk trin.
          </Text>
        }
        renderItem={({ item }) => (
          <CaseCard
            examCase={item}
            onPress={() => handleSelectCase(item)}
            isCompleted={getScore(item.id) != null}
            score={getScore(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Layout.spacing.md, paddingBottom: Layout.spacing.xxl },
  intro: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
    marginBottom: Layout.spacing.md,
  },
  separator: { height: Layout.spacing.sm },
});
