import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

const STEP_LABELS = ['Anamnesis', 'Red Flags', 'Examination', 'Hypothesis', 'Treatment', 'Documentation'];

interface StepIndicatorProps {
  currentStep: number; // 0-5
  submittedSteps: boolean[];
}

export function StepIndicator({ currentStep, submittedSteps }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {STEP_LABELS.map((label, index) => {
        const isActive = index === currentStep;
        const isDone = submittedSteps[index];

        return (
          <View key={index} style={styles.stepWrapper}>
            {index > 0 && (
              <View style={[styles.connector, isDone || index <= currentStep ? styles.connectorActive : {}]} />
            )}
            <View style={[
              styles.dot,
              isActive && styles.dotActive,
              isDone && styles.dotDone,
            ]}>
              {isDone ? (
                <Ionicons name="checkmark" size={10} color="#fff" />
              ) : (
                <Text style={[styles.dotText, isActive && styles.dotTextActive]}>{index + 1}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    width: 20,
    height: 2,
    backgroundColor: Colors.border,
  },
  connectorActive: {
    backgroundColor: Colors.primary,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  dotDone: {
    backgroundColor: Colors.correct,
    borderColor: Colors.correct,
  },
  dotText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  dotTextActive: {
    color: Colors.primary,
  },
});
