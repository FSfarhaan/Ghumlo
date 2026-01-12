import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryGradient from "../components/PrimaryGradient";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../types/itinerary";
import { Platform } from "react-native";
import { signInWithGoogle, signOutFromGoogle } from "../services/googleSignin";
import { saveUserToDB } from "../api/api";

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const tabs = ["Budget-friendly", "Local spots", "Smart timing"];
  const { signIn } = useAuth();

  const handleGoogleLogin = async () => {

    try {
      setIsLoading(true);
      const data = await signInWithGoogle();
      console.log(data.data?.user);
      if(data) {
        console.log("Data to hai");
        const user: User = {
          name: data.data?.user.name!,
          email: data.data?.user.email!,
          avatar: data.data?.user.photo || "https://www.gravatar.com/avatar/?d=mp",
        }
        signIn(user);
        console.log("Sign in ho raha hai");
        const isSuccessful = await saveUserToDB(user);
        console.log("Kya db me store ho raha hai?");
        console.log("Success hua? ", isSuccessful);
        if(isSuccessful && isSuccessful !== undefined && isSuccessful !== null) {
          setIsLoading(false);
          router.replace("/(tabs)");
        }
        else await signOutFromGoogle();
      } else {
        console.log("Data to nahi hai");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6 overflow-hidden">
      {/* Background blobs */}
      <View 
        className={`absolute top-20 left-10 ${Platform.OS === "web" ? "w-36 h-36" : "w-48 h-48"}  rounded-full bg-green-500/5 `} />
      <View
        className={`absolute bottom-8 right-8 ${Platform.OS === "web" ? "w-48 h-48" : "w-64 h-64"} rounded-full bg-emerald-400/10 `}
      />

      {/* Content */}
      <View className="items-center max-w-md px-6">
        {/* Logo */}
        <PrimaryGradient>
          <View className={`${Platform.OS === "web" ? "w-20 h-20" : "w-28 h-28"}  items-center justify-center`}>
            {Platform.OS === "web" ? <Ionicons name="location-outline" size={36} color="white" />
            : <Ionicons name="location-outline" size={48} color="white" />}
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
          <PrimaryGradient className={`${isLoading && "opacity-50"}`}>
            <Pressable
              disabled={isLoading}
              // onPress={async () => {
              //   const data = await signInWithGoogle();
              //   console.log('ID TOKEN:', data.idToken);
              // }}
              // onPress={() => promptAsync()}
              onPress={handleGoogleLogin}
              className="flex-row items-center justify-center gap-4 h-14 px-10 min-w-3/4"
            >
              {isLoading ? (
                <>
                <ActivityIndicator color="white" />
                <Text className="font-semibold text-white text-xl">
                    Logging in
                  </Text>
                </>
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

          {/* <Pressable onPress={() => signOutFromGoogle()}>
            <Text className="text-red-500 text-xl">Logout</Text>
          </Pressable> */}

          <Text className="text-neutral-500 text-xs text-center mt-4">
            Demo mode • No real authentication required
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
