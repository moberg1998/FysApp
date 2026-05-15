import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { AnatomyCategory } from '@/types';

const GROUP_META: Record<AnatomyCategory['group'], { color: string; icon: string }> = {
  'lower-extremity': { color: Colors.modeAnatomy, icon: 'fitness' },
  'upper-extremity': { color: Colors.primary, icon: 'hand-left' },
  'spine-trunk': { color: Colors.warning, icon: 'body' },
  'neurofunctional': { color: Colors.modeExam, icon: 'pulse' },
};

interface CategoryCardProps {
  category: AnatomyCategory;
  onPress: () => void;
  bestScore?: number | null;
}

export function CategoryCard({ category, onPress, bestScore }: CategoryCardProps) {
  const meta = GROUP_META[category.group];
  const isAvailable = category.isAvailable;

  return (
    <TouchableOpacity
      style={[styles.card, !isAvailable && styles.cardDisabled]}
      onPress={isAvailable ? onPress : undefined}
      activeOpacity={isAvailable ? 0.75 : 1}
    >
      <View style={[styles.iconBox, { backgroundColor: meta.color + '20' }]}>
        <Ionicons name={meta.icon as 'body'} size={20} color={isAvailable ? meta.color : Colors.textMuted} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !isAvailable && styles.titleDisabled]}>{category.title}</Text>
          {!isAvailable && (
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Snart</Text>
            </View>
          )}
          {bestScore != null && (
            <View style={styles.scoreChip}>
              <Text style={styles.scoreText}>{bestScore}%</Text>
            </View>
          )}
        </View>
        <Text style={styles.description} numberOfLines={1}>{category.description}</Text>
        {isAvailable && (
          <Text style={styles.count}>{category.questionCount} spørgsmål</Text>
        )}
      </View>

      {isAvailable && (
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  titleDisabled: { color: Colors.textSecondary },
  comingSoon: {
    backgroundColor: Colors.border,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  scoreChip: {
    backgroundColor: Colors.correctSubtle,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scoreText: { fontSize: 11, color: Colors.correct, fontWeight: '700' },
  description: { fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
  count: { fontSize: 12, color: Colors.textMuted },
});
