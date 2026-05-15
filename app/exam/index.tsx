import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TopicCard } from '@/components/ui/TopicCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { TOPICS } from '@/data/topics';

const EXAM_TOPICS = TOPICS.filter((t) => t.category === 'neuro' || t.examCaseCount > 0);

export default function ExamTopicSelect() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Kliniske cases" subtitle="Vælg et emne" />
      <FlatList
        data={EXAM_TOPICS}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            onPress={() => router.push({ pathname: '/exam/[topicId]', params: { topicId: item.id } })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Layout.spacing.md, gap: Layout.spacing.sm, paddingBottom: Layout.spacing.xxl },
});
