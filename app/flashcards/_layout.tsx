import { Stack } from 'expo-router';
import { FlashcardSessionProvider } from '@/context/FlashcardSessionContext';

export default function FlashcardsLayout() {
  return (
    <FlashcardSessionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[topicId]" />
        <Stack.Screen name="results" />
      </Stack>
    </FlashcardSessionProvider>
  );
}
