import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ModeCard } from '@/components/ui/ModeCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useProgress } from '@/hooks/useProgress';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

const MODES = [
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Interaktive spørgsmål med øjeblikkelig klinisk feedback',
    icon: 'help-circle' as const,
    accentColor: Colors.modeQuiz,
    route: '/quiz' as const,
  },
  {
    id: 'exam',
    title: 'Klinisk case',
    description: '6-trins patientcases med struktureret klinisk ræsonnering',
    icon: 'clipboard' as const,
    accentColor: Colors.modeExam,
    route: '/exam' as const,
  },
  {
    id: 'anatomy',
    title: 'Anatomi',
    description: 'Struktur → funktion → klinisk relevans',
    icon: 'body' as const,
    accentColor: Colors.modeAnatomy,
    route: '/anatomy' as const,
  },
  {
    id: 'flashcards',
    title: 'Flashkort',
    description: 'Hurtig repetition af kliniske fakta og nøglebegreber',
    icon: 'albums' as const,
    accentColor: Colors.modeFlashcard,
    route: '/flashcards' as const,
  },
  {
    id: 'guide',
    title: 'Klinisk guide',
    description: 'Anamnese · undersøgelse · klinisk ræsonnering · røde flag',
    icon: 'book-outline' as const,
    accentColor: '#58A6FF',
    route: '/guide' as const,
  },
];

export default function HomeScreen() {
  console.log('APP LOADED v2');
  const router = useRouter();
  const { progress } = useProgress();

  const totalQuizzes = progress?.quizResults.length ?? 0;
  const totalExams = progress?.examResults.length ?? 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>FysApp</Text>
            <Text style={styles.tagline}>Klinisk fysioterapiundervisning</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/progress')}
            style={styles.progressButton}
            activeOpacity={0.75}
          >
            <Ionicons name="stats-chart" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary strip */}
        {(totalQuizzes > 0 || totalExams > 0) && (
          <TouchableOpacity
            onPress={() => router.push('/progress')}
            activeOpacity={0.8}
            style={styles.summaryStrip}
          >
            <Ionicons name="checkmark-circle" size={16} color={Colors.correct} />
            <Text style={styles.summaryText}>
              {totalQuizzes} quiz-session{totalQuizzes !== 1 ? 'er' : ''} · {totalExams} case{totalExams !== 1 ? 's' : ''} gennemført
            </Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        )}

        {/* Section label */}
        <Text style={styles.sectionLabel}>Læringstilstande</Text>

        {/* Mode cards */}
        <View style={styles.modeList}>
          {MODES.map((mode) => (
            <ModeCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              icon={mode.icon}
              accentColor={mode.accentColor}
              onPress={() => router.push(mode.route)}
            />
          ))}
        </View>

        {/* Topic coverage */}
        <TouchableOpacity
          onPress={() => router.push('/progress')}
          activeOpacity={0.75}
          style={styles.topicBanner}
        >
          <Ionicons name="library-outline" size={18} color={Colors.textMuted} />
          <View style={styles.topicBannerText}>
            <Text style={styles.topicBannerTitle}>10 kliniske emner</Text>
            <Text style={styles.topicBannerSub}>Parkinson, MS, Apopleksi tilgængeligt · 7 emner med indhold</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>Offline · Intet login krævet · Alt indhold er inkluderet</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: STATUSBAR_HEIGHT + Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
    gap: Layout.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: Layout.spacing.sm,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.correctSubtle,
    borderRadius: Layout.radius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.correct + '30',
  },
  summaryText: {
    fontSize: 13,
    color: Colors.correct,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Layout.spacing.sm,
  },
  modeList: {
    gap: Layout.spacing.sm,
  },
  topicBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Layout.spacing.sm,
  },
  topicBannerText: {
    flex: 1,
  },
  topicBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  topicBannerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
});
