import { Stack } from 'expo-router';
import { AnatomySessionProvider } from '@/context/AnatomySessionContext';

export default function AnatomyLayout() {
  return (
    <AnatomySessionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[categoryId]" />
        <Stack.Screen name="results" />
      </Stack>
    </AnatomySessionProvider>
  );
}
