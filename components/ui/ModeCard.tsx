import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ModeCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  stat?: string;
  onPress: () => void;
}

export function ModeCard({ title, description, icon, accentColor, stat, onPress }: ModeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={styles.wrapper}>
      <LinearGradient
        colors={[Colors.surface, Colors.surface]}
        style={styles.card}
      >
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '22', borderColor: accentColor + '44' }]}>
          <Ionicons name={icon} size={28} color={accentColor} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>
        {stat ? (
          <View style={styles.statContainer}>
            <Text style={[styles.stat, { color: accentColor }]}>{stat}</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={styles.arrow} />
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    ...Layout.shadow.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Layout.spacing.md,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  statContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  stat: {
    fontSize: 13,
    fontWeight: '600',
  },
  arrow: {
    flexShrink: 0,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: Layout.radius.lg,
    borderBottomLeftRadius: Layout.radius.lg,
  },
});
