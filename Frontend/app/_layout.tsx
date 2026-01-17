import { Stack } from "expo-router";
import AuthProvider from "./contexts/AuthContext";
import "./config/env"
import { configureGoogleSignIn } from "./services/googleSigninApp";
import { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";


export default function RootLayout() {  

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return <View>
      <Text>Fonts not loaded</Text>
    </View>; // or splash loader
  }

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
