import { Stack, Redirect } from "expo-router";

export default function FlowLayout() {
  
  return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="questionnaire" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="itenary" />
    </Stack>
}
