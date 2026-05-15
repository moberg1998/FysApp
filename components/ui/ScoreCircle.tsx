import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ScoreCircleProps {
  score: number; // 0–100
  size?: number;
  label?: string;
}

function getScoreColor(score: number): string {
  if (score >= 75) return Colors.correct;
  if (score >= 50) return Colors.warning;
  return Colors.incorrect;
}

export function ScoreCircle({ score, size = 100, label }: ScoreCircleProps) {
  const color = getScoreColor(score);
  const fontSize = size * 0.28;
  const labelSize = size * 0.13;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[styles.score, { fontSize, color }]}>{score}<Text style={[styles.percent, { fontSize: fontSize * 0.6, color }]}>%</Text></Text>
      {label ? <Text style={[styles.label, { fontSize: labelSize }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  score: {
    fontWeight: '700',
    letterSpacing: -1,
  },
  percent: {
    fontWeight: '600',
  },
  label: {
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
