import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

interface LikedItem {
  id: string;
  destination: string;
  input: string;
  result: string;
  imageUrl: string;
  date: string;
  groupType: string;
}

export default function LikedScreen() {
  const router = useRouter();
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LikedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // true for asc, false for desc
  const [refreshing, setRefreshing] = useState(false);
  const { user, signOut } = useAuth();

  const loadLikedItems = async () => {
    try {
      const liked = await AsyncStorage.getItem("liked_itenary");
      if (liked) {
        const items: LikedItem[] = JSON.parse(liked);
        // console.log("Ye mere liked items hai");
        // console.log(items);
        setLikedItems(items);
        setFilteredItems(items);
      } else {
        setLikedItems([]);
        setFilteredItems([]);
      }
    } catch (e) {
      console.error("Failed to load liked items:", e);
    }
  };

  useEffect(() => {
    console.log("Pehla item ye hai");
    console.log(filteredItems[0]);
  }, [filteredItems]);

  useEffect(() => {
    loadLikedItems();
  }, []);

  useEffect(() => {
    let filtered = likedItems.filter((item) =>
      item.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Sort by date
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortAsc
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
    setFilteredItems(filtered);
  }, [likedItems, searchQuery, sortAsc]);

  const directOpenItenary = async (destination: string) => {
    const liked = await AsyncStorage.getItem("liked_itenary");
    if (liked) {
      const likedData = JSON.parse(liked);
      const item = likedData.find(
        (item: LikedItem) => item.destination === destination
      );
      if (item) {
        router.push({
          pathname: "/(flow)/itenary",
          params: {
            input: item.input,
            result: item.result,
          },
        });
      }
    }
  };

  const handleSignout = () => {
    signOut();
    router.replace("/(auth)/login");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLikedItems();
    setRefreshing(false);
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-5 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center gap-3">
          <Image
            src={user?.avatar}
            height={40}
            width={40}
            className="rounded-full"
          ></Image>

          <View>
            <Text className="text-sm text-neutral-500">Welcome back,</Text>
            <Text className="font-semibold text-black text-xl">
              {user?.name?.split(" ")[0] || "Explorer"}
            </Text>
          </View>
        </View>

        <Pressable onPress={handleSignout}>
          <Text className="text-sm text-neutral-500">Sign out</Text>
        </Pressable>
      </View>

      <View className="px-6 py-6 mb-2">
        {/* <Text className="text-2xl font-bold text-black mb-4">My Plans</Text> */}
        {/* Hero */}
        <View>
          <Text className="text-3xl font-bold text-black">
            Plans you
          </Text>
          <Text className="text-4xl font-bold text-primary">
            Loved
          </Text>
          <Text className="text-neutral-500 mt-2">
            Saved itineraries for later moments
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
            <Pressable
              onPress={() => directOpenItenary(item.destination)}
              className="relative "
            >
              <Image
                source={{
                  uri:
                    item.imageUrl ||
                    "https://via.placeholder.com/400x200?text=No+Image",
                }}
                className="w-full h-40 rounded-2xl "
                resizeMode="cover"
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.1)", "transparent"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                className="absolute inset-0 w-full h-full"
              />
              <View className="p-4 absolute bottom-0 left-0 right-0">
                <Text className="font-bold text-xl text-white mb-1">
                  {item.destination}
                </Text>
                <View className="flex-row items-center gap-3">
                  <Ionicons name="time-outline" size={16} color="#ddd" />
                  <Text className="text-sm text-[#ddd]">{item?.date}</Text>
                  <Text className="text-sm px-2 py-1 rounded-full bg-white/30 capitalize text-white">
                    {item.groupType}
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* Remove Button */}
            {/* <View className="p-4 border-t border-gray-100">
              <TouchableOpacity
                onPress={() => removeLikedItem(item.id)}
                className="flex-row items-center justify-center gap-2 py-2"
              >
                <Ionicons name="heart-dislike-outline" size={16} color="#ef4444" />
                <Text className="text-red-500 font-medium">Remove from Liked</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-10">
            <Ionicons name="heart-outline" size={48} color="#ccc" />
            <Text className="text-gray-500 mt-2">No liked plans found</Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, paddingTop: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
