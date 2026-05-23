import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { AnatomyOption } from '@/types';

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

interface AnatomyOptionButtonProps {
  option: AnatomyOption;
  state: OptionState;
  onPress?: () => void;
}

function AnatomyOptionButton({ option, state, onPress }: AnatomyOptionButtonProps) {
  const colors: Record<OptionState, { bg: string; border: string; text: string }> = {
    idle: { bg: Colors.surface, border: Colors.border, text: Colors.textSecondary },
    selected: { bg: Colors.primarySubtle, border: Colors.primary, text: Colors.textPrimary },
    correct: { bg: Colors.correctSubtle, border: Colors.correct, text: Colors.correct },
    incorrect: { bg: Colors.incorrectSubtle, border: Colors.incorrect, text: Colors.incorrect },
  };
  const c = colors[state];

  return (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: c.bg, borderColor: c.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.optionText, { color: c.text }]}>{option.text}</Text>
    </TouchableOpacity>
  );
}

interface AnatomyQuestionCardProps {
  question: string;
  imageKey?: string;
  options: AnatomyOption[];
  selectedId: string | null;
  isSubmitted: boolean;
  onSelect: (optionId: string) => void;
}

export function AnatomyQuestionCard({
  question,
  imageKey,
  options,
  selectedId,
  isSubmitted,
  onSelect,
}: AnatomyQuestionCardProps) {
  const getState = (option: AnatomyOption): OptionState => {
    const isSelected = option.id === selectedId;
    if (!isSubmitted) return isSelected ? 'selected' : 'idle';
    if (option.isCorrect && isSelected) return 'correct';
    if (!option.isCorrect && isSelected) return 'incorrect';
    return 'idle';
  };

  return (
    <View style={styles.container}>
      {imageKey && (
        <Image
          source={{ uri: imageKey }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
      )}
      <Text style={styles.question}>{question}</Text>
      <View style={styles.options}>
        {options.map((option) => (
          <AnatomyOptionButton
            key={option.id}
            option={option}
            state={getState(option)}
            onPress={!isSubmitted ? () => onSelect(option.id) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Layout.spacing.md },
  image: {
    width: '100%',
    height: 220,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.surface,
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 25,
  },
  options: { gap: Layout.spacing.sm },
  option: {
    borderWidth: 1.5,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
