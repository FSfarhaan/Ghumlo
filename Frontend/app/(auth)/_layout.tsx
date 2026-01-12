import { Stack, Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
  const { user } = useAuth();
  let isLoggedIn = false;
  if(user) isLoggedIn = true;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
}
