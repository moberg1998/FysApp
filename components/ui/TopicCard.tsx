import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Badge } from './Badge';
import { Topic } from '@/types';

interface TopicCardProps {
  topic: Topic;
  bestScore?: { score: number; questionCount: number } | null;
  onPress: () => void;
  examMode?: boolean;
}

export function TopicCard({ topic, bestScore, onPress, examMode }: TopicCardProps) {
  const isDisabled = !topic.isAvailable;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.78}
      style={[styles.wrapper, isDisabled && styles.disabled]}
    >
      <View style={styles.card}>
        <View style={[styles.dot, { backgroundColor: isDisabled ? Colors.border : topic.color }]} />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={[styles.title, isDisabled && styles.disabledText]} numberOfLines={1}>
              {topic.title}
            </Text>
            {!isDisabled && (
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            )}
          </View>
          <Text style={styles.subtitle}>{topic.subtitle}</Text>
          {!isDisabled && (
            <View style={styles.stats}>
              {examMode ? (
                topic.examCaseCount > 0 && (
                  <Text style={styles.statText}>{topic.examCaseCount} {topic.examCaseCount === 1 ? 'case' : 'cases'}</Text>
                )
              ) : (
                <>
                  {topic.quizCount > 0 && (
                    <Text style={styles.statText}>{topic.quizCount} spørgsmål</Text>
                  )}
                  {topic.flashcardCount > 0 && (
                    <Text style={styles.statText}>{topic.flashcardCount} kort</Text>
                  )}
                </>
              )}
              {bestScore != null && (
                <Text style={[styles.statText, styles.score]}>
                  Bedste: {bestScore.score}% ({bestScore.questionCount} sp.)
                </Text>
              )}
            </View>
          )}
        </View>
        {isDisabled && (
          <Badge label="Kommer snart" variant="coming-soon" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.55,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Layout.spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  disabledText: {
    color: Colors.textMuted,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  score: {
    color: Colors.correct,
    fontWeight: '600',
  },
});
