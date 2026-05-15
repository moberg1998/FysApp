import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ExamCase } from '@/types';

interface CaseCardProps {
  examCase: ExamCase;
  onPress: () => void;
  isCompleted?: boolean;
  score?: number | null;
}

export function CaseCard({ examCase, onPress, isCompleted, score }: CaseCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.caseIcon}>
            <Ionicons name="person" size={16} color={Colors.modeExam} />
          </View>
          <Text style={styles.title}>{examCase.title}</Text>
          <Badge label={examCase.difficulty} variant={examCase.difficulty} />
        </View>
        {isCompleted && score != null && (
          <View style={styles.scoreChip}>
            <Ionicons name="checkmark-circle" size={13} color={Colors.correct} />
            <Text style={styles.scoreText}>{score}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.profile} numberOfLines={2}>{examCase.patientProfile}</Text>
      <Text style={styles.complaint} numberOfLines={2}>{examCase.chiefComplaint}</Text>

      <View style={styles.footer}>
        <View style={styles.stepBadge}>
          <Ionicons name="list" size={12} color={Colors.textMuted} />
          <Text style={styles.stepText}>6 clinical steps</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    flex: 1,
    flexWrap: 'wrap',
  },
  caseIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.modeExam + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.correctSubtle,
    borderRadius: Layout.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.correct,
  },
  profile: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  complaint: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
