import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} height={4} />
      <Text style={styles.label}>
        {current} <Text style={styles.of}>of</Text> {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    paddingHorizontal: Layout.spacing.md,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    fontWeight: '500',
  },
  of: {
    color: Colors.textMuted,
    fontWeight: '400',
  },
});
