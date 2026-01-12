import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import getPlaceImage from "../data/placesData";
import { useSearchHistoryStore } from "../store/useSearchHistoryStore";
import type { SearchHistory } from "../store/useSearchHistoryStore";
import { useAIResponseStore } from "../store/useAIResponseStore";
import { useConfirm } from "../hooks/useConfirm";

export default function PlansScreen() {
  const { deleteHistory, searchHistory } = useSearchHistoryStore();
  
  const { getResponseByDestination } = useAIResponseStore();
  const router = useRouter();
  const { confirm, ConfirmUI } = useConfirm();

    
  const [filteredHistory, setFilteredHistory] = useState<typeof searchHistory>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    let filtered = searchHistory?.filter((item) =>
      item?.destination?.toLowerCase().includes(searchQuery?.toLowerCase())
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

   const directOpenItenary = async (myHistory: SearchHistory) => {
        const myResponse = getResponseByDestination(myHistory.destination);
        router.push({
          pathname: "/(flow)/itenary",
          params: {
            input: JSON.stringify(myHistory),
            result: JSON.stringify(myResponse),
          },
        })
    }

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };
  

  const handleDeleteHistory = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Search History",
      message: "Are you sure you want to delete this from searched history?",
    });

    if (confirmed) {
      deleteHistory(id);
    }
  }

  return (
    <View className={`flex-1 bg-white ${Platform.OS === "web" ? "px-4" : "px-6"}`}>
      <View className="py-6">
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
              className="flex-1 ml-2 text-lg text-black"
              placeholderTextColor={"#4b5563"}
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
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4">
            <Pressable
              onPress={() => directOpenItenary(item)}
              className="relative rounded-xl"
            >
              <Image
                source={{
                  uri:
                    getPlaceImage(item.imageUrl!) ||
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
              onPress={() => handleDeleteHistory(item.id)}
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
        contentContainerStyle={{ paddingVertical: 16 }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      />

      <ConfirmUI />
    </View>

    // <View><Text>Ye plans hai</Text></View>
  );
}
