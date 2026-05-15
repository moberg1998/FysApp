import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Flashcard } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 260;

interface FlipCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ card, isFlipped, onFlip }: FlipCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flipAnim]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.6],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <TouchableOpacity onPress={onFlip} activeOpacity={0.9} style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          styles.front,
          { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
        ]}
      >
        <Text style={styles.side}>Spørgsmål</Text>
        <Text style={styles.frontText}>{card.front}</Text>
        <Text style={styles.hint}>Tryk for at se svar</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.back,
          { transform: [{ rotateY: backRotate }], opacity: backOpacity },
        ]}
      >
        <Text style={[styles.side, { color: Colors.correct }]}>Svar</Text>
        <Text style={styles.backText}>{card.back}</Text>
        {card.clinicalPoint ? (
          <View style={styles.clinicalPointBox}>
            <Text style={styles.clinicalPointLabel}>Klinisk pointe</Text>
            <Text style={styles.clinicalPoint}>{card.clinicalPoint}</Text>
          </View>
        ) : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    minHeight: CARD_HEIGHT,
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    backfaceVisibility: 'hidden',
    gap: Layout.spacing.sm,
    justifyContent: 'center',
  },
  front: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  back: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.correct + '40',
  },
  side: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  frontText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 26,
    textAlign: 'center',
  },
  backText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 21,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
  clinicalPointBox: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginTop: Layout.spacing.sm,
  },
  clinicalPointLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  clinicalPoint: {
    fontSize: 13,
    color: Colors.info,
    lineHeight: 18,
  },
});
