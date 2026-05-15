import { Stack } from 'expo-router';
import { QuizSessionProvider } from '@/context/QuizSessionContext';

export default function QuizLayout() {
  return (
    <QuizSessionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[topicId]" />
        <Stack.Screen name="session" />
        <Stack.Screen name="results" />
      </Stack>
    </QuizSessionProvider>
  );
}
