import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLikedItemsStore } from "../store/useLikedItemsStore";
import { SearchHistory } from "../types/itinerary";
import { useAIResponseStore } from "../store/useAIResponseStore";
import getPlaceImage from "../data/placesData";
import { useConfirm } from "../hooks/useConfirm";

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

  const { toggleLike, likedItems } = useLikedItemsStore();
  const { getResponseByDestination } = useAIResponseStore();
  const { confirm, ConfirmUI } = useConfirm();
  const router = useRouter();
  
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

  const handleDeleteLike = async (item: SearchHistory) => {
      const confirmed = await confirm({
        title: "Delete Search History",
        message: "Are you sure you want to delete this from liked history?",
      });
      if (confirmed) {
        toggleLike(item);
      }
    }

  return (
    <View className={`flex-1 bg-white ${Platform.OS === "web" ? "px-4" : "px-6"}`}>

      <View className="py-6 mb-2">
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
        data={likedItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
            <Pressable
              onPress={() => directOpenItenary(item)}
              className="relative "
            >
              <Image
                source={{
                  uri:
                    getPlaceImage(item.imageUrl!) ||
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

              <TouchableOpacity
                onPress={() => handleDeleteLike(item)}
                className="flex-row items-center justify-center gap-2 py-2 absolute top-2 right-4 p-2 rounded-full bg-white/90"
              >
                <Ionicons name="heart" size={16} color="#ef4444" />
                {/* <Text className="text-red-500 font-medium">Delete Plan</Text> */}
              </TouchableOpacity>
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
        contentContainerStyle={{ paddingVertical: 16, paddingTop: 0 }}
      />

      <ConfirmUI />
    </View>

    // <View><Text>Ye liked hai</Text></View>
  );
}
