import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'missed';

interface OptionButtonProps {
  optionId: string;
  text: string;
  state: OptionState;
  onPress?: () => void;
  disabled?: boolean;
}

const stateConfig: Record<OptionState, { bg: string; border: string; text: string; icon?: string; iconColor?: string }> = {
  idle: {
    bg: Colors.surface,
    border: Colors.border,
    text: Colors.textPrimary,
  },
  selected: {
    bg: Colors.primarySubtle,
    border: Colors.primary,
    text: Colors.textPrimary,
  },
  correct: {
    bg: Colors.correctSubtle,
    border: Colors.correct,
    text: Colors.correct,
    icon: 'checkmark-circle',
    iconColor: Colors.correct,
  },
  incorrect: {
    bg: Colors.incorrectSubtle,
    border: Colors.incorrect,
    text: Colors.incorrect,
    icon: 'close-circle',
    iconColor: Colors.incorrect,
  },
  missed: {
    bg: Colors.warningSubtle,
    border: Colors.warning,
    text: Colors.warning,
    icon: 'alert-circle',
    iconColor: Colors.warning,
  },
};

export function OptionButton({ optionId, text, state, onPress, disabled }: OptionButtonProps) {
  const config = stateConfig[state];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || state !== 'idle' && state !== 'selected'}
      activeOpacity={0.75}
      style={[
        styles.option,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}
    >
      <View style={[styles.indicator, { borderColor: config.border, backgroundColor: state === 'selected' ? Colors.primary : 'transparent' }]}>
        {state === 'selected' && <View style={styles.dot} />}
      </View>
      <Text style={[styles.text, { color: config.text }]}>{text}</Text>
      {config.icon && (
        <Ionicons name={config.icon as 'checkmark-circle'} size={20} color={config.iconColor} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.radius.md,
    borderWidth: 1.5,
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
    minHeight: 52,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  icon: {
    flexShrink: 0,
  },
});
