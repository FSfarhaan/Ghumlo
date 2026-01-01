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
import getPlaceImage from "../data/placesData";
import { SearchHistory } from "../types/itinerary";

export default function PlansScreen() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SearchHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // true for asc, false for desc
  const [refreshing, setRefreshing] = useState(false);
  const { user, signOut } = useAuth();

  const loadSearchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("search_history");
      if (storedHistory) {
        const history: SearchHistory[] = JSON.parse(storedHistory);
        setSearchHistory(history);
        setFilteredHistory(history);
      }
    } catch (e) {
      console.error("Failed to load search history:", e);
    }
  };

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    let filtered = searchHistory.filter((item) =>
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
    setFilteredHistory(filtered);
  }, [searchHistory, searchQuery, sortAsc]);

  const directOpenItenary = async (destination: string) => {
    const result = await AsyncStorage.getItem("groq_response");
    const search = await AsyncStorage.getItem("search_history");

    if (result && search) {
      const resultValue = JSON.parse(result);
      const myResponse = resultValue.filter((it: any) => {
        return it.destination === destination;
      });

      const searchValue = JSON.parse(search);
      const mySearch = searchValue.filter((s: any) => {
        return s.destination === destination;
      });

      router.push({
        pathname: "/(flow)/itenary",
        params: {
          input: JSON.stringify(mySearch[0]),
          result: JSON.stringify(myResponse[0]),
        },
      });
    }
  };

  const deleteHistoryItem = async (id: string) => {
    Alert.alert("Delete Plan", "Are you sure you want to delete this plan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedHistory = searchHistory.filter((item) => item.id !== id);
          setSearchHistory(updatedHistory);
          await AsyncStorage.setItem(
            "search_history",
            JSON.stringify(updatedHistory)
          );
        },
      },
    ]);
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSearchHistory();
    setRefreshing(false);
  };

  const handleSignout = () => {
    signOut();
    router.replace("/(auth)/login");
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

      <View className="px-6 py-6">
        {/* <Text className="text-2xl font-bold text-black mb-4">My Plans</Text> */}
        {/* Hero */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-black">Your past plans</Text>
          <Text className="text-4xl font-bold text-primary">Revisited</Text>
          <Text className="text-neutral-500 mt-2">
            Itineraries you’ve explored before
          </Text>
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1 flex-row items-center rounded-xl px-4 border border-gray-200 overflow-hidden">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-lg"
              placeholder="Search plans..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            onPress={toggleSort}
            className="bg-primary rounded-xl px-4 py-2 items-center justify-center"
          >
            <Ionicons
              name={sortAsc ? "arrow-up" : "arrow-down"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4">
            <Pressable
              onPress={() => directOpenItenary(item.destination)}
              className="relative rounded-xl"
            >
              <Image
                source={{
                  uri:
                    getPlaceImage(item.imageUrl) ||
                    "https://via.placeholder.com/400x200?text=No+Image",
                }}
                className="w-full h-40 rounded-2xl"
                resizeMode="cover"
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.1)", "transparent"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                className="absolute inset-0 w-full h-full"
              />
              <View className="p-4 rounded-b-xl absolute bottom-0 left-0 right-0">
                <Text className="font-bold text-lg text-white mb-1">
                  {item.destination}
                </Text>
                <View className="flex-row items-center gap-3">
                  <Ionicons name="time-outline" size={16} color="#ddd" />
                  <Text className="text-sm text-[#ddd]">{item.date}</Text>
                  <Text className="text-sm px-2 py-1 rounded-full bg-white/30 capitalize text-white">
                    {item.groupType}
                  </Text>
                </View>
              </View>
            </Pressable>

            <TouchableOpacity
              onPress={() => deleteHistoryItem(item.id)}
              className="flex-row items-center justify-center gap-2 py-2 absolute top-2 right-4"
            >
              <Ionicons name="trash" size={20} color="#fff" />
              {/* <Text className="text-red-500 font-medium">Delete Plan</Text> */}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-10">
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text className="text-gray-500 mt-2">No plans found</Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
