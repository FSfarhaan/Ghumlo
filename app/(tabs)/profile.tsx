import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

type GroupTypeKey = "friends" | "family" | "date";

interface SearchHistory {
  id: string;
  destination: string;
  date: string;
  groupType: GroupTypeKey;
  imageUrl: string;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  console.log(user);
  const [searchCount, setSearchCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [groupTypeStats, setGroupTypeStats] = useState<Record<GroupTypeKey, number>>({
    friends: 0,
    family: 0,
    date: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get search history count
      const searchHistoryJson = await AsyncStorage.getItem("search_history");
      const searchHistory: SearchHistory[] = searchHistoryJson ? JSON.parse(searchHistoryJson) : [];
      setSearchCount(searchHistory.length);

      // Calculate group type stats
      const stats: Record<GroupTypeKey, number> = {
        friends: 0,
        family: 0,
        date: 0,
      };
      searchHistory.forEach((item) => {
        if (item.groupType) {
          stats[item.groupType] = (stats[item.groupType] || 0) + 1;
        }
      });
      setGroupTypeStats(stats);

      // Get liked count
      const likedJson = await AsyncStorage.getItem("liked_itenary");
      const liked = likedJson ? JSON.parse(likedJson) : [];
      setLikedCount(liked.length);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleDeleteSearch = async () => {
    Alert.alert(
      "Delete Search History",
      "Are you sure you want to delete all search history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("search_history");
            setSearchCount(0);
            setGroupTypeStats({ friends: 0, family: 0, date: 0 });
            Alert.alert("Success", "Search history deleted");
            loadStats();
          },
        },
      ]
    );
  };

  const handleDeleteResponses = async () => {
    Alert.alert(
      "Delete API Responses",
      "Are you sure you want to delete all cached responses?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("groq_response");
            Alert.alert("Success", "API responses deleted");
          },
        },
      ]
    );
  };

  const handleDeleteLikes = async () => {
    Alert.alert(
      "Delete Liked Plans",
      "Are you sure you want to delete all liked itineraries?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("liked_itenary");
            setLikedCount(0);
            Alert.alert("Success", "Liked plans deleted");
            loadStats();
          },
        },
      ]
    );
  };

  const getGroupTypeIcon = (type: GroupTypeKey): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "friends":
        return "people";
      case "family":
        return "home";
      case "date":
        return "heart";
    }
  };

  const getGroupTypeLabel = (type: GroupTypeKey) => {
    switch (type) {
      case "friends":
        return "Friends";
      case "family":
        return "Family";
      case "date":
        return "Date";
    }
  };

  const hasStats = searchCount > 0 || likedCount > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#fafafa] pt-4">
      <ScrollView className="flex-1 p-10">

        {/* Profile Card */}
        <View className="px-6">
          <View className="flex items-center justify-between bg-whiteborder mb-3 rounded-2xl p-6 border border-gray-200 bg-white overflow-hidden">
            <Text className="text-2xl font-semibold text-black mb-8 text-center">Profile</Text>
            {/* Avatar & Name */}
            <View className="items-center mb-6">
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar! }}
                  className="w-32 h-32 rounded-full mb-4"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Ionicons name="person" size={48} color="#6366f1" />
                </View>
              )}
              <Text className="text-3xl font-bold text-gray-900 mb-1">
                {user?.name || "Guest User"}
              </Text>
              <Text className="text-sm text-gray-500">{user?.email || "guest@example.com"}</Text>
            </View>

            {/* Stats */}
            {hasStats && (
              <View className="flex-row justify-center items-center pb-2 gap-8 w-full">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-900">{searchCount}</Text>
                  <Text className="text-xs text-gray-500 mt-1">Plans Made</Text>
                </View>
                
                {/* Vertical Divider */}
                <View className="h-12 w-[1px] bg-gray-300" />
                
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-900">{likedCount}</Text>
                  <Text className="text-xs text-gray-500 mt-1">Plans Liked</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Group Preferences */}
        {hasStats && Object.values(groupTypeStats).some(count => count > 0) && (
          <View className="px-6 mt-5">
            <Text className="text-lg font-bold text-gray-900 mb-3">Group Preferences</Text>
            <View className="rounded-2xl mb-8">
              <View className="flex-row flex-wrap gap-2">
                {(Object.keys(groupTypeStats) as GroupTypeKey[]).map((type) => {
                  const count = groupTypeStats[type];
                  if (count === 0) return null;
                  return (
                    <View
                      key={type}
                      className="flex-row items-center gap-2 px-4 py-2 bg-primary/5 rounded-full"
                    >
                      <Ionicons name={getGroupTypeIcon(type)} size={18} color="#2BAA8C" />
                      <Text className="text-sm font-medium text-primary">
                        {getGroupTypeLabel(type)}
                      </Text>
                      <View className="w-6 h-6 rounded-full  items-center bg-primary/10 justify-center">
                        <Text className="text-xs font-bold text-primary">{count}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Data Management</Text>
          
          <TouchableOpacity
            onPress={handleDeleteSearch}
            className="flex-row items-center justify-between bg-whiteborder mb-3 rounded-2xl p-4 border border-gray-200  bg-white"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                <Ionicons name="time-outline" size={20} color="#2BAA8C" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">Clear Search History</Text>
                <Text className="text-xs text-gray-500">Delete all past searches</Text>
              </View>
            </View>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteResponses}
            className="flex-row items-center justify-between bg-whiteborder mb-3 rounded-2xl p-4 border border-gray-200  bg-white"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
                <Ionicons name="cloud-outline" size={20} color="#2BAA8C" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">Clear Cached Data</Text>
                <Text className="text-xs text-gray-500">Remove stored API responses</Text>
              </View>
            </View>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteLikes}
            className="flex-row items-center justify-between bg-whiteborder mb-3 rounded-2xl p-4 border border-gray-200  bg-white"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Ionicons name="heart-outline" size={20} color="#2BAA8C" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">Clear Liked Plans</Text>
                <Text className="text-xs text-gray-500">Delete all saved itineraries</Text>
              </View>
            </View>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View className="px-6 mt-8 mb-8">
          <View className="flex justify-between bg-whiteborder mb-3 rounded-2xl p-4 border border-gray-200  bg-white">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="information-circle" size={24} color="#2BAA8C" />
              <Text className="text-lg font-bold text-gray-900">About Mumbai Itinerary</Text>
            </View>
            <Text className="text-sm text-gray-600 leading-6 mb-4">
              Your AI-powered companion for exploring Mumbai! Create personalized day plans tailored to your preferences, budget, and group.
            </Text>
            <View className="pt-4 border-t border-gray-200">
              <View className="flex-row items-center gap-2 mb-2">
                {/* <Ionicons name="code-slash" size={16} color="#6366f1" /> */}
                <Text className="text-xs font-semibold text-gray-700">Developed by:</Text>
              </View>
              <Text className="text-sm text-gray-600 mb-1">Farhaan Shaikh</Text>
              <Text className="text-xs text-gray-500">Version 1.0.0</Text>
              {/* <View className="flex-row items-center gap-1 mt-1">
                <Text className="text-xs text-gray-500">Made with</Text>
                <Ionicons name="heart" size={12} color="#ef4444" />
                <Text className="text-xs text-gray-500">in Mumbai</Text>
              </View> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}