import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TopicCard } from '@/components/ui/TopicCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { TOPICS } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';

export default function QuizTopicSelect() {
  const router = useRouter();
  const { getBestScore } = useProgress();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Quiz Mode" subtitle="Choose a topic to practice" />
      <FlatList
        data={TOPICS}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            bestScore={getBestScore(item.id)}
            onPress={() => router.push({ pathname: '/quiz/[topicId]', params: { topicId: item.id } })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    paddingBottom: Layout.spacing.xxl,
  },
});
