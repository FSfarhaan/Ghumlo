import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import Header from "../components/Header";

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-white">
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2BAA8C",
          tabBarInactiveTintColor: "#ccc",
          tabBarStyle: {
            backgroundColor: "#fff",
            paddingBottom: 10,
            justifyContent: "space-between",
            alignContent: "space-between",
            alignItems: "center",
          },
          tabBarIconStyle: {
            marginTop: 5
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-sharp" size={size} color={color} />
            ),
            tabBarStyle: {
              height: Platform.OS === "web" ? 70 : 80,
              marginTop: -20,
              width: "100%"
            }
          }}
        />

        <Tabs.Screen
          name="plans"
          options={{
            title: "Plans",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" size={size} color={color} />
            ),
            tabBarStyle: {
              height: Platform.OS === "web" ? 70 : 80,
              marginTop: -20,
              width: "100%"
            }
          }}
        />

        <Tabs.Screen
          name="liked"
          options={{
            title: "Liked",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
            tabBarStyle: {
              height: Platform.OS === "web" ? 70 : 80,
              marginTop: -20,
              width: "100%"
            }
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarStyle: {
              height: Platform.OS === "web" ? 70 : 80,
              marginTop: -20,
              width: "100%"
            }
          }}
        />
      </Tabs>
    </View>
  );
}
