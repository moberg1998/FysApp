import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

type FeedbackType = 'correct' | 'partial' | 'incorrect';

interface FeedbackPanelProps {
  type: FeedbackType;
  explanation: string;
  takeaway: string;
  partialInfo?: string;
}

const feedbackConfig: Record<FeedbackType, { color: string; bg: string; icon: string; label: string }> = {
  correct: {
    color: Colors.correct,
    bg: Colors.correctSubtle,
    icon: 'checkmark-circle',
    label: 'Correct',
  },
  partial: {
    color: Colors.warning,
    bg: Colors.warningSubtle,
    icon: 'alert-circle',
    label: 'Partially Correct',
  },
  incorrect: {
    color: Colors.incorrect,
    bg: Colors.incorrectSubtle,
    icon: 'close-circle',
    label: 'Incorrect',
  },
};

export function FeedbackPanel({ type, explanation, takeaway, partialInfo }: FeedbackPanelProps) {
  const config = feedbackConfig[type];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: config.bg, borderColor: config.color + '60' }]}>
        <Ionicons name={config.icon as 'checkmark-circle'} size={22} color={config.color} />
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        {partialInfo ? <Text style={[styles.partialInfo, { color: config.color }]}>{partialInfo}</Text> : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.explanationLabel}>Explanation</Text>
        <Text style={styles.explanation}>{explanation}</Text>

        <View style={styles.takeawayBox}>
          <View style={styles.takeawayHeader}>
            <Ionicons name="bookmark" size={14} color={Colors.primary} />
            <Text style={styles.takeawayLabel}>Most important takeaway</Text>
          </View>
          <Text style={styles.takeaway}>{takeaway}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  partialInfo: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  body: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  explanation: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  takeawayBox: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    marginTop: Layout.spacing.sm,
    gap: 6,
  },
  takeawayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  takeawayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  takeaway: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    fontWeight: '500',
  },
});
