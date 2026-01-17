import { Stack } from "expo-router";
import AuthProvider from "./contexts/AuthContext";
import "./config/env"
import { configureGoogleSignIn } from "./services/googleSigninApp";
import { useEffect } from "react";


export default function RootLayout() {  
  useEffect(() => {
    configureGoogleSignIn();
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
