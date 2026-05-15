import { Stack } from 'expo-router';
import { ExamSessionProvider } from '@/context/ExamSessionContext';

export default function ExamLayout() {
  return (
    <ExamSessionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[topicId]" />
        <Stack.Screen name="session" />
        <Stack.Screen name="results" />
      </Stack>
    </ExamSessionProvider>
  );
}
