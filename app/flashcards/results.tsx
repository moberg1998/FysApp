import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useFlashcardSession } from '@/context/FlashcardSessionContext';
import { useProgress } from '@/hooks/useProgress';
import { FlashcardProgress, FlashcardStatus } from '@/types';

export default function FlashcardResults() {
  const router = useRouter();
  const { session, resetSession } = useFlashcardSession();
  const { updateFlashcards } = useProgress();
  const savedRef = useRef(false);

  useEffect(() => {
    if (session && !savedRef.current) {
      savedRef.current = true;
      const now = Date.now();
      const cards = Object.entries(session.ratings).map(([cardId, status]) => ({
        cardId,
        status: status as FlashcardStatus,
        reviewCount: 1,
        lastRated: now,
      }));
      const fp: FlashcardProgress = {
        topicId: session.topicId,
        lastStudied: Date.now(),
        cards,
      };
      updateFlashcards(fp);
    }
  }, []);

  if (!session) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Results" onBack={() => router.replace('/flashcards')} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No session data.</Text>
          <Button title="Back to Flashcards" onPress={() => { resetSession(); router.replace('/flashcards'); }} />
        </View>
      </View>
    );
  }

  const ratings = Object.values(session.ratings) as FlashcardStatus[];
  const knew = ratings.filter((r) => r === 'knew').length;
  const unsure = ratings.filter((r) => r === 'unsure').length;
  const repeat = ratings.filter((r) => r === 'repeat').length;
  const total = session.cards.length;
  const score = total > 0 ? Math.round((knew / total) * 100) : 0;

  const scoreLabel = score >= 75 ? 'Great recall' : score >= 50 ? 'Keep going' : 'More practice needed';

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Session Complete" onBack={() => { resetSession(); router.replace('/flashcards'); }} showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreRow}>
          <ScoreCircle score={score} size={110} label={scoreLabel} />
          <View style={styles.statsColumn}>
            <StatRow icon="checkmark-circle" color={Colors.correct} label="Knew it" value={`${knew}`} />
            <StatRow icon="help-circle" color={Colors.warning} label="Unsure" value={`${unsure}`} />
            <StatRow icon="refresh-circle" color={Colors.incorrect} label="Repeat" value={`${repeat}`} />
            <StatRow icon="layers" color={Colors.textSecondary} label="Total" value={`${total}`} />
          </View>
        </View>

        {repeat > 0 && (
          <Card>
            <View style={styles.repeatHeader}>
              <Ionicons name="refresh" size={16} color={Colors.incorrect} />
              <Text style={styles.repeatTitle}>Cards to review again</Text>
            </View>
            <View style={styles.repeatList}>
              {session.cards
                .filter((c) => session.ratings[c.id] === 'repeat')
                .map((c) => (
                  <View key={c.id} style={styles.repeatItem}>
                    <View style={styles.repeatDot} />
                    <Text style={styles.repeatText} numberOfLines={2}>{c.front}</Text>
                  </View>
                ))}
            </View>
          </Card>
        )}

        {unsure > 0 && (
          <Card>
            <View style={styles.repeatHeader}>
              <Ionicons name="alert-circle" size={16} color={Colors.warning} />
              <Text style={styles.repeatTitle}>Cards to revisit</Text>
            </View>
            <View style={styles.repeatList}>
              {session.cards
                .filter((c) => session.ratings[c.id] === 'unsure')
                .map((c) => (
                  <View key={c.id} style={styles.repeatItem}>
                    <View style={[styles.repeatDot, { backgroundColor: Colors.warning }]} />
                    <Text style={styles.repeatText} numberOfLines={2}>{c.front}</Text>
                  </View>
                ))}
            </View>
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="Study Again"
            onPress={() => { resetSession(); router.replace(`/flashcards/${session.topicId}`); }}
            variant="secondary"
            size="lg"
            fullWidth
          />
          <Button
            title="Back to Topics"
            onPress={() => { resetSession(); router.replace('/flashcards'); }}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

function StatRow({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Ionicons name={icon as 'checkmark-circle'} size={16} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsColumn: { flex: 1, gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  statValue: { fontSize: 16, fontWeight: '700' },
  repeatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  repeatTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  repeatList: { gap: 8 },
  repeatItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  repeatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.incorrect,
    marginTop: 6,
    flexShrink: 0,
  },
  repeatText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  actions: { gap: Layout.spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Layout.spacing.xl, gap: Layout.spacing.md },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
