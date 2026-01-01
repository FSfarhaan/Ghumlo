import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryGradient from "../components/PrimaryGradient";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../types/itinerary";

// REQUIRED for OAuth redirect handling
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const tabs = ["Budget-friendly", "Local spots", "Smart timing"];
  const { signIn } = useAuth();

  // 🔐 Google OAuth config
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "474457524110-iv954r6rpg3ecqaq8t1ggd35hna92ub8.apps.googleusercontent.com",
  });

  // ✅ Handle Google response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      console.log("Google Access Token:", authentication?.accessToken);

      // TODO (later):
      // - send token to backend
      // - receive JWT
      // - store securely

      router.replace("/(tabs)");
    }

    setIsLoading(false);
  }, [response]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    promptAsync();
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user: User = {
        name: "Farhaan Shaikh",
        email: "farhaan8d@gmail.com",
        id: "1234567890",
        avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      }
      signIn(user);
      
      setIsLoading(false);
      router.replace("/(tabs)");
    }, 1000);
    
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6 overflow-hidden">
      {/* Background blobs */}
      <View className="absolute top-20 left-10 w-64 h-64 rounded-full bg-green-500/10 blur-3xl" />
      {/* <View
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl"
      /> */}

      {/* Content */}
      <View className="items-center max-w-md ">
        {/* Logo */}
        <PrimaryGradient>
          <View className="w-28 h-28 items-center justify-center">
            <Ionicons name="location-outline" size={48} color="white" />
          </View>
        </PrimaryGradient>

        {/* Title */}
        <Text className="text-black text-5xl font-bold text-center mb-3 mt-8">
          Mumbai <Text className="text-primary">Day Planner</Text>
        </Text>

        {/* Subtitle */}
        <Text className="text-neutral-400 text-lg text-center mb-8">
          AI-powered itineraries for the perfect Mumbai day out
        </Text>

        {/* Features */}
        <View className="flex-row flex-wrap justify-center gap-3 mb-10">
          {tabs.map((feature, i) => (
            <View
              key={feature}
              className="flex-row items-center gap-2 px-5 py-3 bg-primary/10 rounded-full"
            >
              <Ionicons name="sparkles-outline" size={14} color="#2bab92" />
              <Text className="text-primary text-md font-medium">
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Login button */}
        <View className="w-full">
          <PrimaryGradient>
            <Pressable
              disabled={!request || isLoading}
              onPress={handleDemoLogin}
              className="flex-row items-center justify-center gap-4 h-14 px-10"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="white" />
                  <Text className="font-semibold text-white text-xl">
                    Continue with Google
                  </Text>
                </>
              )}
            </Pressable>
          </PrimaryGradient>

          <Text className="text-neutral-500 text-xs text-center mt-4">
            Demo mode • No real authentication required
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
