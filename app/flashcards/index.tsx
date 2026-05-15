import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TopicCard } from '@/components/ui/TopicCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { TOPICS } from '@/data/topics';
import { parkinsonFlashcards } from '@/data/parkinson/flashcards';
import { useFlashcardSession } from '@/context/FlashcardSessionContext';
import { Flashcard } from '@/types';

const ALL_FLASHCARDS: Record<string, Flashcard[]> = {
  parkinson: parkinsonFlashcards,
};

export default function FlashcardsTopicSelect() {
  const router = useRouter();
  const { startSession } = useFlashcardSession();

  const handlePress = (topicId: string) => {
    const cards = ALL_FLASHCARDS[topicId] ?? [];
    if (cards.length > 0) {
      startSession(topicId, cards);
    }
    router.push({ pathname: '/flashcards/[topicId]', params: { topicId } });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Flashkort" subtitle="Vælg et emne" />
      <FlatList
        data={TOPICS}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            onPress={() => handlePress(item.id)}
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
