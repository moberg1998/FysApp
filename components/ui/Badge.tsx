import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

type BadgeVariant = 'coming-soon' | 'easy' | 'medium' | 'hard' | 'correct' | 'incorrect' | 'warning' | 'info' | 'neuro' | 'msk';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  'coming-soon': { bg: Colors.surfaceElevated, text: Colors.textMuted },
  easy: { bg: Colors.correctSubtle, text: Colors.correct },
  medium: { bg: Colors.warningSubtle, text: Colors.warning },
  hard: { bg: Colors.incorrectSubtle, text: Colors.incorrect },
  correct: { bg: Colors.correctSubtle, text: Colors.correct },
  incorrect: { bg: Colors.incorrectSubtle, text: Colors.incorrect },
  warning: { bg: Colors.warningSubtle, text: Colors.warning },
  info: { bg: Colors.primarySubtle, text: Colors.info },
  neuro: { bg: '#200B3E', text: Colors.accentNeuro },
  msk: { bg: Colors.primarySubtle, text: Colors.primary },
};

export function Badge({ label, variant = 'info', style }: BadgeProps) {
  const { bg, text } = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Layout.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
