import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryGradient from '../components/PrimaryGradient';
import getPlaceImage from '../data/placesData';
import { useLikedItemsStore } from '../store/useLikedItemsStore';

type PreferenceType = "travel" | "food" | "games" | "hangout" | "religious" | "romantic";
type GroupTypeKey = "friends" | "family" | "date";

interface TimeWindow {
  start: string;
  end: string;
}

interface ItineraryInput {
  destination: string;
  peopleCount: number;
  budgetPerPerson: number;
  timeWindow: TimeWindow;
  preferences: PreferenceType[];
  startLocation: string;
  groupType: GroupTypeKey;
}

interface ItineraryStop {
  id: string;
  time: string;
  activity: string;
  location: string;
  transport: string;
  cost: number;
  duration: string;
  description?: string;
  imageUrl?: string;
}

interface ItineraryResult {
  stops: ItineraryStop[];
  totalSpendPerPerson: number;
  remainingBuffer: number;
  nearbyAttractions: string[];
}

// Mock function - replace with your actual function

export default function ItineraryScreen() {
  const { toggleLike, isLiked } = useLikedItemsStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const input: ItineraryInput = JSON.parse(params.input as string);
  const result: ItineraryResult = JSON.parse(params.result as string);

  
  const heroImage = getPlaceImage(input?.destination);

  const handleShare = async () => {
    try {
      const text = `My Mumbai Day Plan:\n\n${result.stops
        .map((s) => `${s.time} - ${s.activity} at ${s.location}`)
        .join("\n")}\n\nTotal: ₹${result.totalSpendPerPerson} per person`;

      await Share.share({
        message: text,
        title: "Mumbai Day Itinerary",
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleRegenerate = () => {
    router.push({
      pathname: "/loading",
      params: { input: JSON.stringify(input) },
    });
  };

  const handleBack = () => {
    router.replace("/(tabs)")
  };

  const removePrice = (text: string): string => {
    return text.replace(/\s*\(₹\s*\d+(\s*[-–]\s*\d+)?\)/g, "").trim();
  }

  const onSelectDestination = (destination: string) => {
    if (destination) {
      router.push({
        pathname: "/(flow)/questionnaire",
        params: { destination },
      });
    }; 
  }


  return (
    <SafeAreaView className="flex-1 bg-[#fafafa]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="relative h-64">
          <Image
            source={{ uri: heroImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["#fafafa", "rgba(255,255,255,0.5)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            className="absolute inset-0 w-full h-full"
          />
          
          {/* Header Buttons */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-white/90"
            >
              <Ionicons name="arrow-back" size={16} color="#000" />
              <Text className="text-md font-medium text-gray-900">Back</Text>
            </TouchableOpacity>
            
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => toggleLike({
                  id: Date.now().toString(),
                  date: new Date().toLocaleDateString(),
                  ...input
                })}
                className="p-2.5 rounded-full bg-white/90"
              >
                <Ionicons name={isLiked(input.destination) ? "heart" : "heart-outline"} size={18} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRegenerate}
                className="p-2.5 rounded-full bg-white/90"
              >
                <Ionicons name="refresh" size={18} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                className="p-2.5 rounded-full bg-white/90"
              >
                <Ionicons name="share-social" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title Overlay */}
          <View className="absolute bottom-6 left-6 right-6">
            <PrimaryGradient className='self-start gap-2 px-5 py-2 mb-3 rounded-full'>
              <View className="flex-row items-center self-start">
                <Ionicons name="location" size={14} color="#fff" />
                <Text className="text-sm font-medium text-white">
                  {input.destination}
                </Text>
              </View>
            </PrimaryGradient>
            <Text className="text-3xl font-bold text-black">
              Your Perfect Day
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className={`${Platform.OS === "web" ? "px-4" : "px-6"}  -mt-4 relative z-10`}>
          {/* Meta Info Card */}
          <View className="flex-row flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <View className="flex-row items-center gap-2">
              <Ionicons name="time" size={16} color="#2BAA8C" />
              <Text className={`${Platform.OS === "web" ? "text-xs" : "text-sm"}  text-gray-600`}>
                {input?.timeWindow?.start} - {input?.timeWindow?.end}
              </Text>
            </View>

            <View className="w-1 h-1 rounded-full bg-gray-300" />
            <Text className={`${Platform.OS === "web" ? "text-xs" : "text-sm"}  text-gray-600`}>
              {input.peopleCount} {input.peopleCount === 1 ? "person" : "people"}
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-300" />
            <View className="px-3 py-1.5 rounded-full bg-primary/10">
              <Text className={`${Platform.OS === "web" ? "text-xs" : "text-sm"}  text-primary capitalize`}>
                {input.groupType}
              </Text>
            </View>
          </View>

          {/* Timeline Section */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Your Itinerary
            </Text>
            
            {result.stops.map((stop, index) => {
              const isLast = index === result?.stops?.length - 1;
              const imageUrl = stop.imageUrl || getPlaceImage(stop.location, stop.description);
              
              return (
                <View key={stop.id} className="relative pl-8 pb-8 pr-0">
                  {/* Timeline line */}
                  {!isLast && (
                  <PrimaryGradient className="absolute left-[11px] top-8 w-0.5 bg-primary   h-full rounded-none overflow-auto" optColors={["#2BAA8C", "#ffffff"]}/>
                  )}
                  
                  {/* Timeline dot */}
                  <View className="absolute left-0 top-1 w-7 h-7 rounded-full bg-primary items-center justify-center shadow-md">
                    <Text className="text-md font-bold text-white">{index + 1}</Text>
                  </View>
                  
                  {/* Content card */}
                  <View className="ml-2 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    {/* Image */}
                    <View className="relative h-40 overflow-hidden">
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.5)"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        className="absolute inset-0"
                      />
                      <View className="absolute top-3 left-3 flex-row gap-4 justify-between">
                        <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-sm">
                          <Ionicons name="time-outline" size={16} color="#2BAA8C" />
                          <Text className={` ${Platform.OS === "web" ? "text-xs" : "text-sm"} font-medium text-gray-900`}>{stop.time}</Text>
                        </View>
                        <View className="px-2 py-1 rounded-full bg-black/30 justify-center">
                          <Text className={`${Platform.OS === "web" ? "text-xs" : "text-sm"} text-white`}>{stop.duration}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Content */}
                    <View className="p-5">
                      {/* Activity */}
                      <Text className="text-xl font-bold text-gray-900 mb-1">{stop.activity}</Text>
                      
                      {/* Location */}
                      <View className="flex-row items-center gap-2 text-gray-600 mb-3">
                        <Ionicons name="location-outline" size={16} color="#2BAA8C" />
                        <Text className="text-md text-gray-600">{stop.location}</Text>
                      </View>
                      
                      {/* Description */}
                      {stop.description && (
                        <Text className="text-md text-gray-600 mb-4 leading-relaxed">{removePrice(stop.description)}</Text>
                      )}
                      
                      {/* Footer info */}
                      <View className="flex-row items-center justify-between pt-4 border-t border-gray-200">
                        <View className="flex-row items-center gap-2 flex-wrap w-3/4">
                          {/* <Ionicons name="car-outline" size={16} color="#666" /> */}
                          <Text className="text-sm text-gray-600 ">{removePrice(stop.transport)}</Text>
                        </View>
                          <View className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
                            <Text className="text-sm font-semibold text-primary">₹{stop?.cost || 0}</Text>
                          </View>
                        
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Budget Summary */}
          <View className="mt-4">
            <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              
              <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="cash-outline" size={20} color="#2BAA8C" />
                <Text className="text-lg font-bold text-gray-900">Budget Summary</Text>
              </View>

              <View className="gap-4">
                {/* Progress bar */}
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-gray-600">Estimated Spend</Text>
                    <Text className="text-sm font-semibold text-gray-900">₹{result.totalSpendPerPerson}</Text>
                  </View>
                  <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-primary rounded-full" 
                      style={{ 
                        width: `${Math.min((result.totalSpendPerPerson / input.budgetPerPerson) * 100, 100)}%` 
                      }} 
                    />
                  </View>
                </View>

                {/* Stats */}
                <View className="pt-4 border-t border-gray-200">
                  <View className="flex-row gap-4">
                    <View className="flex-1 p-3 bg-gray-50 rounded-2xl items-center">
                      <Text className="text-2xl font-bold text-primary">₹{result.totalSpendPerPerson}</Text>
                      <Text className="text-xs text-gray-500">Total per person</Text>
                    </View>
                    <View className="flex-1 p-3 bg-gray-50 rounded-2xl items-center">
                      <Text className={`text-2xl font-bold ${result.remainingBuffer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(result.remainingBuffer)}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Ionicons 
                          name={result.remainingBuffer >= 0 ? "checkmark-circle-outline" : "trending-down-outline"} 
                          size={12} 
                          color={result.remainingBuffer >= 0 ? "#10B981" : "#EF4444"} 
                        />
                        <Text className="text-xs text-gray-500">
                          {result.remainingBuffer >= 0 ? "Buffer saved" : "Over budget"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Nearby Attractions */}
          {result?.nearbyAttractions && result?.nearbyAttractions?.length > 0 && (
            <View className="mt-10">
              <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="location-outline" size={20} color="#2BAA8C" />
                <Text className="text-xl font-bold text-gray-900">Nearby Places to Explore</Text>
              </View>
              
              <View className="flex-row flex-wrap gap-4">
                {result.nearbyAttractions.map((place, index) => (
                  <Pressable onPress={() => onSelectDestination(place)} key={index} className="w-[48%] overflow-hidden rounded-2xl shadow-sm border border-gray-200 flex-1" style={{ minWidth: "45%"}}>
                    <View className="relative h-32 overflow-hidden">
                      <Image
                        source={{ uri: getPlaceImage(place) }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.6)"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        className="absolute inset-0"
                      />
                      <View className="absolute bottom-2 left-2 right-2">
                        <Text className="font-semibold text-white text-sm">{place}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="mt-10 gap-3">
            <TouchableOpacity
              onPress={handleRegenerate}
              className="flex-row items-center justify-center gap-2 px-6 py-4 bg-primary/5 rounded-xl w-full border border-gray-200"
            >
              <Ionicons name="refresh" size={18} color="#2BAA8C" />
              <Text className="text-md font-medium text-primary">
                Generate Another Plan
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-xl w-full"
            >
              <Ionicons name="arrow-back" size={18} color="#666" />
              <Text className="text-base font-semibold text-gray-600">
                Start Over
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text className="text-center text-xs text-gray-500 mt-8 pb-8">
            Generated with AI • Prices are estimates
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}