import { Stack } from "expo-router";
import AuthProvider from "./contexts/AuthContext";
import "./config/env"
import { configureGoogleSignIn } from "./services/googleSigninApp";
import { useEffect } from "react";
import { Platform } from "react-native";


export default function RootLayout() {  
  useEffect(() => {
    if (Platform.OS !== "web") {
      configureGoogleSignIn();
    }
  }, []);
  
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
