import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { FlashcardStatus } from '@/types';

interface RatingButtonsProps {
  onRate: (status: FlashcardStatus) => void;
  disabled?: boolean;
}

const ratings: { status: FlashcardStatus; label: string; icon: string; color: string; bg: string }[] = [
  { status: 'repeat', label: 'Again', icon: 'refresh', color: Colors.incorrect, bg: Colors.incorrectSubtle },
  { status: 'unsure', label: 'Unsure', icon: 'help-circle', color: Colors.warning, bg: Colors.warningSubtle },
  { status: 'knew', label: 'Knew it', icon: 'checkmark-circle', color: Colors.correct, bg: Colors.correctSubtle },
];

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <View style={styles.container}>
      {ratings.map((r) => (
        <TouchableOpacity
          key={r.status}
          onPress={() => onRate(r.status)}
          disabled={disabled}
          activeOpacity={0.75}
          style={[styles.button, { backgroundColor: r.bg, borderColor: r.color + '40' }, disabled && styles.disabled]}
        >
          <Ionicons name={r.icon as 'refresh'} size={20} color={r.color} />
          <Text style={[styles.label, { color: r.color }]}>{r.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 14,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    minHeight: 64,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});
