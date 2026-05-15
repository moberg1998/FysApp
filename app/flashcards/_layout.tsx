import { Stack } from 'expo-router';

export default function FlashcardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[topicId]" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
