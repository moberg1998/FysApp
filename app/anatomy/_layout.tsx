import { Stack } from 'expo-router';

export default function AnatomyLayout() {
  console.log('ANATOMY LAYOUT MOUNTED');
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[categoryId]" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
