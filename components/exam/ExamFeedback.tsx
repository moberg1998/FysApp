import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ExamFeedbackProps {
  correctCount: number;
  totalCorrect: number;
  explanation: string;
  clinicalNote: string;
}

export function ExamFeedback({ correctCount, totalCorrect, explanation, clinicalNote }: ExamFeedbackProps) {
  const allCorrect = correctCount === totalCorrect;
  const partial = correctCount > 0 && correctCount < totalCorrect;

  const borderColor = allCorrect ? Colors.correct : partial ? Colors.warning : Colors.incorrect;
  const bgColor = allCorrect ? Colors.correctSubtle : partial ? Colors.warningSubtle : Colors.incorrectSubtle;
  const icon = allCorrect ? 'checkmark-circle' : partial ? 'alert-circle' : 'close-circle';
  const iconColor = allCorrect ? Colors.correct : partial ? Colors.warning : Colors.incorrect;
  const label = allCorrect ? 'All correct' : partial ? `${correctCount} of ${totalCorrect} correct` : 'Incomplete';

  return (
    <View style={styles.container}>
      <View style={[styles.scoreBar, { backgroundColor: bgColor, borderColor }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
        <Text style={[styles.scoreLabel, { color: iconColor }]}>{label}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Explanation</Text>
        <Text style={styles.sectionText}>{explanation}</Text>
      </View>

      <View style={styles.clinicalNote}>
        <View style={styles.noteHeader}>
          <Ionicons name="document-text" size={14} color={Colors.info} />
          <Text style={styles.noteLabel}>Clinical Note</Text>
        </View>
        <Text style={styles.noteText}>{clinicalNote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Layout.spacing.md,
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  clinicalNote: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
    gap: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.info,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
