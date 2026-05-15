import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QuizSessionProvider } from '@/context/QuizSessionContext';
import { FlashcardSessionProvider } from '@/context/FlashcardSessionContext';
import { ExamSessionProvider } from '@/context/ExamSessionContext';
import { AnatomySessionProvider } from '@/context/AnatomySessionContext';

const FysAppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0D1117',
    card: '#161B22',
    text: '#E6EDF3',
    border: '#30363D',
    primary: '#2F81F7',
    notification: '#2F81F7',
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0D1117' }}>
      <ThemeProvider value={FysAppDarkTheme}>
        <QuizSessionProvider>
          <FlashcardSessionProvider>
            <ExamSessionProvider>
              <AnatomySessionProvider>
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="quiz" />
                  <Stack.Screen name="exam" />
                  <Stack.Screen name="anatomy" />
                  <Stack.Screen name="flashcards" />
                  <Stack.Screen name="progress/index" />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </AnatomySessionProvider>
            </ExamSessionProvider>
          </FlashcardSessionProvider>
        </QuizSessionProvider>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
