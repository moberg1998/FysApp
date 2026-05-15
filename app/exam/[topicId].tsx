import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { CaseCard } from '@/components/exam/CaseCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { parkinsonExamCases } from '@/data/parkinson/examCases';
import { getTopicById } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import { useExamSession } from '@/context/ExamSessionContext';
import { ExamCase } from '@/types';

const ALL_EXAM_CASES: Record<string, ExamCase[]> = {
  parkinson: parkinsonExamCases,
};

export default function ExamCaseList() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const { progress } = useProgress();

  const topic = getTopicById(topicId ?? '');
  const cases = ALL_EXAM_CASES[topicId ?? ''] ?? [];
  const { startSession } = useExamSession();

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
        <ScreenHeader title="Clinical Cases" onBack={() => router.back()} />
        <EmptyState
          icon="construct"
          title="Coming Soon"
          message="Clinical cases for this topic are being prepared. Check back soon."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={topic.title} subtitle="Select a case" onBack={() => router.back()} />
      <FlatList
        data={cases}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Work through each case step by step. Select all appropriate actions for each clinical stage.
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
