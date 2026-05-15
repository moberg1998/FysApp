import React from 'react';
import { View, SectionList, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { CategoryCard } from '@/components/anatomy/CategoryCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ANATOMY_CATEGORIES } from '@/data/anatomy/categories';
import { hipPelvisQuestions } from '@/data/anatomy/hipPelvis';
import { kneeQuestions } from '@/data/anatomy/knee';
import { ankleFootQuestions } from '@/data/anatomy/ankleFoot';
import { gaitCycleQuestions } from '@/data/anatomy/gaitCycle';
import { useProgress } from '@/hooks/useProgress';
import { useAnatomySession } from '@/context/AnatomySessionContext';
import { AnatomyCategory, AnatomyQuestion } from '@/types';

const ALL_QUESTIONS: Record<string, AnatomyQuestion[]> = {
  'hip-pelvis': hipPelvisQuestions,
  'knee': kneeQuestions,
  'ankle-foot': ankleFootQuestions,
  'gait-cycle': gaitCycleQuestions,
};

const GROUP_LABELS: Record<AnatomyCategory['group'], string> = {
  'lower-extremity': 'Underekstremitet',
  'upper-extremity': 'Overekstremitet',
  'spine-trunk': 'Rygsøjle og krop',
  'neurofunctional': 'Neurologisk og funktionelt',
};

const GROUP_ORDER: AnatomyCategory['group'][] = [
  'lower-extremity',
  'neurofunctional',
  'upper-extremity',
  'spine-trunk',
];

export default function AnatomyCategorySelect() {
  const router = useRouter();
  const { progress } = useProgress();
  const { startSession } = useAnatomySession();

  const sections = GROUP_ORDER.map((group) => ({
    title: GROUP_LABELS[group],
    data: ANATOMY_CATEGORIES.filter((c) => c.group === group),
  })).filter((s) => s.data.length > 0);

  const getBestScore = (categoryId: string): number | null => {
    if (!progress) return null;
    const results = progress.quizResults.filter((r) => r.topicId === `anatomy-${categoryId}`);
    if (results.length === 0) return null;
    return Math.max(...results.map((r) => r.score));
  };

  const handlePress = (categoryId: string) => {
    const questions = ALL_QUESTIONS[categoryId] ?? [];
    console.log('[DEBUG anatomy/index] categoryId:', categoryId, '| questions.length:', questions.length, '| ALL_QUESTIONS keys:', Object.keys(ALL_QUESTIONS));
    if (questions.length > 0) {
      console.log('[DEBUG anatomy/index] calling startSession with', questions.length, 'questions');
      startSession(categoryId, questions);
    } else {
      console.log('[DEBUG anatomy/index] NO questions found — startSession NOT called');
    }
    router.push({ pathname: '/anatomy/[categoryId]', params: { categoryId } });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Anatomi" subtitle="Vælg en kategori" />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => handlePress(item.id)}
            bestScore={getBestScore(item.id)}
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: Layout.spacing.sm,
    paddingTop: Layout.spacing.md,
  },
  separator: { height: Layout.spacing.sm },
});
