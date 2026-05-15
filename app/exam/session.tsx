import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StepIndicator } from '@/components/exam/StepIndicator';
import { StepCard } from '@/components/exam/StepCard';
import { ExamFeedback } from '@/components/exam/ExamFeedback';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useExamSession } from '@/context/ExamSessionContext';

function ExamOptionButton({
  text,
  isSelected,
  isCorrect,
  isSubmitted,
  onPress,
}: {
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isSubmitted: boolean;
  onPress: () => void;
}) {
  let bgColor: string = Colors.surface;
  let borderColor: string = Colors.border;
  let textColor: string = Colors.textSecondary;

  if (isSubmitted) {
    if (isCorrect && isSelected) { bgColor = Colors.correctSubtle; borderColor = Colors.correct; textColor = Colors.correct; }
    else if (!isCorrect && isSelected) { bgColor = Colors.incorrectSubtle; borderColor = Colors.incorrect; textColor = Colors.incorrect; }
    else if (isCorrect && !isSelected) { bgColor = Colors.warningSubtle; borderColor = Colors.warning; textColor = Colors.warning; }
  } else if (isSelected) {
    bgColor = Colors.primarySubtle;
    borderColor = Colors.primary;
    textColor = Colors.textPrimary;
  }

  return (
    <View
      onTouchEnd={isSubmitted ? undefined : onPress}
      style={[styles.option, { backgroundColor: bgColor, borderColor }]}
    >
      <Text style={[styles.optionText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

export default function ExamSession() {
  const router = useRouter();
  const { session, toggleOption, submitStep, nextStep } = useExamSession();

  useEffect(() => {
    if (!session) {
      router.replace('/exam/index');
    } else if (session.isComplete) {
      router.replace('/exam/results');
    }
  }, [session]);

  if (!session) return null;

  const step = session.examCase.steps[session.currentStep];
  const selectedIds = session.stepAnswers[session.currentStep] ?? [];
  const isSubmitted = session.stepSubmitted[session.currentStep];
  const correctIds = step.options.filter((o) => o.isCorrect).map((o) => o.id);
  const correctCount = selectedIds.filter((id) => correctIds.includes(id)).length;
  const isLast = session.currentStep >= 5;

  const handleBack = () => {
    Alert.alert('Afslut case', 'Din fremgang slettes. Er du sikker?', [
      { text: 'Annuller', style: 'cancel' },
      { text: 'Afslut', style: 'destructive', onPress: () => router.replace('/exam/index') },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={session.examCase.title}
        subtitle={`Trin ${session.currentStep + 1} af 6`}
        onBack={handleBack}
      />
      <StepIndicator currentStep={session.currentStep} submittedSteps={session.stepSubmitted} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient profile — show on step 1 */}
        {session.currentStep === 0 && (
          <Card style={styles.profileCard}>
            <Text style={styles.profileLabel}>PATIENT</Text>
            <Text style={styles.profileText}>{session.examCase.patientProfile}</Text>
            <Text style={styles.complaintLabel}>Hovedklage</Text>
            <Text style={styles.complaintText}>{session.examCase.chiefComplaint}</Text>
          </Card>
        )}

        {/* Step prompt */}
        <StepCard
          type={step.type}
          stepNumber={step.stepNumber}
          prompt={step.prompt}
        />

        {/* Options */}
        <View style={styles.options}>
          {step.options.map((option) => (
            <ExamOptionButton
              key={option.id}
              text={option.text}
              isSelected={selectedIds.includes(option.id)}
              isCorrect={option.isCorrect}
              isSubmitted={isSubmitted}
              onPress={() => toggleOption(option.id)}
            />
          ))}
        </View>

        {/* Per-option explanation after submit */}
        {isSubmitted && (
          <>
            <View style={styles.optionExplanations}>
              {step.options
                .filter((o) => selectedIds.includes(o.id) && o.explanation)
                .map((o) => (
                  <View key={o.id} style={[
                    styles.optionExplain,
                    { borderLeftColor: o.isCorrect ? Colors.correct : Colors.incorrect },
                  ]}>
                    <Text style={styles.optionExplainText}>{o.explanation}</Text>
                  </View>
                ))}
              {step.options
                .filter((o) => !selectedIds.includes(o.id) && o.isCorrect && o.explanation)
                .map((o) => (
                  <View key={o.id} style={[styles.optionExplain, { borderLeftColor: Colors.warning }]}>
                    <Text style={styles.optionExplainText}>{o.explanation}</Text>
                  </View>
                ))}
            </View>
            <ExamFeedback
              correctCount={correctCount}
              totalCorrect={correctIds.length}
              explanation={step.explanation}
              clinicalNote={step.clinicalNote}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!isSubmitted ? (
          <Button
            title="Bekræft trin"
            onPress={submitStep}
            disabled={selectedIds.length === 0}
            size="lg"
            fullWidth
          />
        ) : (
          <Button
            title={isLast ? 'Se resultater' : 'Næste trin'}
            onPress={nextStep}
            size="lg"
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
  },
  profileCard: {
    backgroundColor: Colors.modeExam + '10',
    borderColor: Colors.modeExam + '40',
    gap: 6,
  },
  profileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.modeExam,
    letterSpacing: 1,
  },
  profileText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  complaintLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 6,
  },
  complaintText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  options: {
    gap: Layout.spacing.sm,
  },
  option: {
    borderWidth: 1.5,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionExplanations: {
    gap: Layout.spacing.sm,
  },
  optionExplain: {
    borderLeftWidth: 3,
    paddingLeft: Layout.spacing.sm,
    paddingVertical: 4,
  },
  optionExplainText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});
