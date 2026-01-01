import { Stack, Redirect } from "expo-router";

export default function AuthLayout() {
  const isLoggedIn = false; // from AsyncStorage later

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
}
