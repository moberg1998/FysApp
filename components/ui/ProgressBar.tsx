import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  height = 6,
  style,
  animated = true,
}: ProgressBarProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animValue, {
        toValue: Math.min(1, Math.max(0, progress)),
        duration: 350,
        useNativeDriver: false,
      }).start();
    } else {
      animValue.setValue(Math.min(1, Math.max(0, progress)));
    }
  }, [progress, animated, animValue]);

  const widthPercent = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { height }, style]}>
      <Animated.View
        style={[styles.fill, { width: widthPercent, backgroundColor: color, height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.border,
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: Layout.radius.full,
  },
});
