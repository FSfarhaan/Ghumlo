import { View, Text, Pressable, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryGradient from "../components/PrimaryGradient";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../types/itinerary";
import { Platform } from "react-native";
import { signInWithGoogleApp, signOutFromGoogleApp } from "../services/googleSigninApp";
import { saveUserToDB } from "../api/api";
//@ts-ignore
import Logo from "../../assets/images/icon.png"
import { signInWithGoogleWeb } from "../services/googleSigninWeb";

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const tabs = ["Budget-friendly", "Local spots", "Smart timing"];
  const { signIn } = useAuth();

  const handleGoogleLogin = async () => {

    try {
      setIsLoading(true);

      if(Platform.OS === "web") {
        const data = await signInWithGoogleWeb();
        // console.log(data.data?.user);
        if(data) {
          console.log("Data to hai");
          console.log(data);

          const user: User = {
            name: data?.name!,
            email: data?.email!,
            avatar: data?.photo || "https://www.gravatar.com/avatar/?d=mp",
          }
  
          signIn(user);
  
          console.log("Sign in ho raha hai");
          const isSuccessful = await saveUserToDB(user);
          console.log("Kya db me store ho raha hai?");
          console.log("Success hua? ", isSuccessful);
          if(isSuccessful) {
            setIsLoading(false);
            router.replace("/(tabs)");
          }
          else await signOutFromGoogleApp();
        }

      } 
      else {

        const data = await signInWithGoogleApp();
        // console.log(data.data?.user);
        if(data) {
          console.log("Data to hai");
          console.log(data);
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
          if(isSuccessful) {
            setIsLoading(false);
            router.replace("/(tabs)");
          }
          else await signOutFromGoogleApp();
        } else {
          console.log("Data to nahi hai");
        }
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
        className={`absolute top-20 left-10 ${Platform.OS === "web" ? "w-36 h-36" : "w-48 h-48"}  rounded-full bg-green-500/5 z-20`} />
      <View
        className={`absolute bottom-8 right-8 ${Platform.OS === "web" ? "w-48 h-48" : "w-64 h-64"} rounded-full bg-emerald-400/10 `}
      />

      {/* Content */}
      <View className="items-center max-w-md px-6">

        {/* {Platform.OS === "web" ? 
          <img src={Logo} alt="" className="w-10 h-10 rounded-full z-10"/> : 
          <Image source={Logo} height={10} width={10} className="rounded-full z-10" />} */}

          <Image
            source={Logo}
            resizeMode="contain"
            style={{ width: 150, height: 150 }}
          />


        {/* Title */}
        <Text className="text-black text-5xl font-bold text-center mb-3">
          Ghumlo <Text className="text-primary">Day Planner</Text>
        </Text>

        {/* Subtitle */}
        <Text className="text-neutral-400 text-lg text-center mb-8">
          Cafés, beaches, walks & hidden gems — perfectly planned for your day.
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
                    Signing you in...
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
            We respect your privacy • Nothing is shared.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
