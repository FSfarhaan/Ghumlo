import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Platform, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../contexts/AuthContext'
import { useConfirm } from '../hooks/useConfirm'
import { signOutFromGoogle } from '../services/googleSignin'

const Header = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { confirm, ConfirmUI } = useConfirm();

  const handleSignout = async () => {
    const confirmed = await confirm({
      title: "Logout",
      message: "Are you sure you want to logout from the app?",
    });

    if (confirmed) {
      await signOutFromGoogle();
      signOut()
      router.replace("/(auth)/login");
    }
    
  };
  
  return (
    <SafeAreaView className={"flex-row items-center justify-between border-b border-gray-200"}>
      <View className={`flex-1 flex-row items-center justify-between ${Platform.OS === "web" ? "p-4" : "p-6"}`}>
      <View className="flex-row items-center gap-3">

        {Platform.OS === "web" ?  <img src={user?.avatar || "https://randomuser.me/api/portraits/men/76.jpg"} alt="" className="rounded-full w-10 h-10"/>
        :  <Image source={{ uri: user?.avatar || "https://randomuser.me/api/portraits/men/76.jpg" }} height={40} width={40} className="rounded-full" />
        }

        <View>
          <Text className="text-sm text-neutral-500">Welcome back,</Text>
          <Text className="font-semibold text-black text-xl">
            {user?.name?.split(" ")[0] || "Explorer"}
          </Text>
        </View>
      </View>

      <Pressable 
        onPress={handleSignout}
        className="flex-row items-center gap-2 bg-red-500/20 px-3 py-2 rounded-lg"
      >
        {/* <Text className="text-md font-medium text-red-500">Sign out</Text> */}
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
      </Pressable>
      </View>

      <ConfirmUI />
    </SafeAreaView>
  )
}

export default Header;