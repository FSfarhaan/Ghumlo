import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLikedItemsStore } from '../store/useLikedItemsStore';
import { useSearchHistoryStore } from '../store/useSearchHistoryStore';
import { useAIResponseStore } from '../store/useAIResponseStore';
import { useConfirm } from '../hooks/useConfirm';

type GroupTypeKey = "friends" | "family" | "date";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { searchHistory, clearHistory } = useSearchHistoryStore();
  const { likedItems, clearLikes } = useLikedItemsStore();
  const { clearResponses } = useAIResponseStore();
  const { confirm, ConfirmUI } = useConfirm();

  const searchCount = searchHistory?.length;
  const likedCount = likedItems?.length

  const groupTypeStats: Record<GroupTypeKey, number> = {
    friends: 0,
    family: 0,
    date: 0,
  };
  searchHistory?.forEach((item) => {
    if (item.groupType) {
      groupTypeStats[item.groupType] = (groupTypeStats[item.groupType] || 0) + 1;
    }
  });

  const hasStats = searchCount > 0 || likedCount > 0;

  const handleDeleteSearch = async () => {
    const confirmed = await confirm({
      title: "Delete Search History",
      message: "Are you sure you want to delete all search history?",
    });

    if (confirmed) {
      clearHistory();
    }
  };

  const handleDeleteResponses = async () => {
    const confirmed = await confirm({
      title: "Delete API Responses",
      message: "Are you sure you want to delete all cached responses?",
    });

    if (confirmed) {
      clearResponses();
    }
  };

  const handleDeleteLikes = async () => {
    const confirmed = await confirm({
      title: "Delete Liked Plans",
      message: "Are you sure you want to delete all liked itineraries?",
    });

    if (confirmed) {
      clearLikes();
    }
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

  return (
    <View className="flex-1 bg-[#fafafa] pb-8">
      <ScrollView showsVerticalScrollIndicator={false} className={`flex-1 ${Platform.OS === "web" ? "p-4" : "p-6"}`}>

        {/* Profile Card */}
        <View className="">
          <View className="flex items-center justify-between bg-whiteborder mb-3 rounded-2xl p-6 border border-gray-200 bg-white overflow-hidden">
            {/* <Text className="text-2xl font-semibold text-black mb-8 text-center">Profile</Text> */}
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
              <View className="flex-row justify-center items-center pb-2 gap-6 w-full">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-900">{searchCount}</Text>
                  <Text className="text-xs text-gray-500 mt-1">Plans Made</Text>
                </View>
                
                {/* Vertical Divider */}
                <View className="h-8 w-[1px] bg-gray-200" />
                
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
          <View className="mt-5">
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
        <View className="mt-6">
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
        <View className={`mt-8 ${Platform.OS === "web" ? "" : "mb-8"}`}>
          <View className="flex justify-between bg-whiteborder mb-3 rounded-2xl p-4 border border-gray-200  bg-white">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="information-circle" size={24} color="#2BAA8C" />
              <Text className="text-lg font-bold text-gray-900">About Mumbai Itinerary</Text>
            </View>
            <Text className="text-md text-gray-600 leading-6 mb-4">
              Your AI-powered companion for exploring Mumbai! Create personalized day plans tailored to your preferences, budget, and group.
            </Text>
            <View className="pt-4 border-t border-gray-200">
              <View className="flex-row items-center gap-2 mb-2">
                {/* <Ionicons name="code-slash" size={16} color="#6366f1" /> */}
                <Text className="text-md font-semibold text-gray-700">Developed by:</Text>
              </View>
              <Text className="text-sm text-gray-600 mb-1">Farhaan Shaikh</Text>
              <Text className="text-xs text-gray-500">Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ConfirmUI />
    </View>
    // <View><Text>Ye profile hai</Text></View>
  );
}