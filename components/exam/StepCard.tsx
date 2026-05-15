import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ExamStepType } from '@/types';

const STEP_TYPE_META: Record<ExamStepType, { label: string; icon: string; color: string }> = {
  anamnesis: { label: 'Anamnese', icon: 'chatbubble-ellipses', color: Colors.info },
  'red-flags': { label: 'Røde flag', icon: 'warning', color: Colors.incorrect },
  examination: { label: 'Undersøgelse', icon: 'body', color: Colors.modeAnatomy },
  hypothesis: { label: 'Klinisk ræsonnering', icon: 'bulb', color: Colors.warning },
  treatment: { label: 'Behandlingsplan', icon: 'fitness', color: Colors.primary },
  documentation: { label: 'Dokumentation', icon: 'document-text', color: Colors.textSecondary },
};

interface StepCardProps {
  type: ExamStepType;
  stepNumber: number;
  prompt: string;
}

export function StepCard({ type, stepNumber, prompt }: StepCardProps) {
  const meta = STEP_TYPE_META[type];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.typeTag, { backgroundColor: meta.color + '20' }]}>
          <Ionicons name={meta.icon as 'body'} size={13} color={meta.color} />
          <Text style={[styles.typeLabel, { color: meta.color }]}>Trin {stepNumber} — {meta.label}</Text>
        </View>
      </View>
      <Text style={styles.prompt}>{prompt}</Text>
      <Text style={styles.hint}>Vælg alle der passer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Layout.spacing.sm,
  },
  header: {
    flexDirection: 'row',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 5,
    borderRadius: Layout.radius.sm,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  prompt: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
