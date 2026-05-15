import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[topicId]" />
      <Stack.Screen name="session" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
