import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryGradient from "../components/PrimaryGradient";
import { useAuth } from "../contexts/AuthContext";
import getPlaceImage, { RECOMMENDED_PLACES } from "../data/placesData";
import { SearchHistory } from "../types/itinerary";

// interface SearchHistory {
//   id: string;
//   destination: string;
//   imageUrl: string;
//   date: string;
//   groupType: string;
// }

// interface RecommendedPlace {
//   id: string;
//   name: string;
//   imageUrl: string;
//   category: string;
//   rating?: number;
// }

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const loadStoredData = async () => {
    try {
      const storedKey = await AsyncStorage.getItem("groq_api_key");
      if (storedKey) {
        setApiKey(storedKey);
      }
      
      // Load search history from AsyncStorage
      const storedHistory = await AsyncStorage.getItem("search_history");
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
        // console.log(searchHistory);
      } else {
        console.log("Search history is not there");
      }
    } catch (e) {
      console.error("Failed to load stored data:", e);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  const handleSignout = () => {
    signOut();
    router.replace("/(auth)/login");
  }

  const onSelectDestination = (destination?: string) => {
    // console.log("Daba to raha hu");
    if(destination) {
      router.push({
        pathname: "/(flow)/questionnaire",
        params: { destination }
      });
    } else {
      router.push({
        pathname: "/(flow)/questionnaire"      
      });
    }
  }

  const directOpenItenary = async (destination: string) => {
    const result = await AsyncStorage.getItem("groq_response");
    const search = await AsyncStorage.getItem("search_history");

    
    if(result && search) {
      const resultValue = JSON.parse(result)
      const myResponse = resultValue.filter((it: any) => {
        return it.destination === destination
      })

      const searchValue = JSON.parse(search);
      const mySearch = searchValue.filter((s: any) => {
        return s.destination === destination;
      })

      console.log("Ye Search hai");
      console.log(mySearch);
      console.log("Ye response hai");
      console.log(myResponse);
      router.push({
        pathname: "/(flow)/itenary",
        params: {
          input: JSON.stringify(mySearch[0]),
          result: JSON.stringify(myResponse[0]),
        },
      })
    }
  }
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1"
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadStoredData();
            setRefreshing(false);
          }}
        />
      }>
        {/* Header */}
        <View className="px-6 py-5 flex-row items-center justify-between border-b border-gray-200">
          <View className="flex-row items-center gap-3">
              <Image src={user?.avatar} height={40} width={40} className="rounded-full"></Image>

            <View>
              <Text className="text-sm text-neutral-500">Welcome back,</Text>
              <Text className="font-semibold text-black text-xl">
                {user?.name?.split(" ")[0] || "Explorer"}
              </Text>
            </View>
          </View>

          <Pressable 
            onPress={handleSignout}
            >
            <Text className="text-sm text-neutral-500">Sign out</Text>
          </Pressable>
        </View>

        <View className="px-6 py-6">
          {/* Hero */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-black">
              Plan your perfect
            </Text>
            <Text className="text-4xl font-bold text-primary">
              Mumbai day
            </Text>
            <Text className="text-neutral-500 mt-2">
              AI-powered itineraries tailored to your vibe
            </Text>
          </View>

          {/* New Plan CTA */}
          <TouchableOpacity
            onPress={() => onSelectDestination()}
            className="mb-8 p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5"
          >
            <View className="flex-row items-center gap-4">
              <PrimaryGradient>
                <View className="w-12 h-12 rounded-full items-center justify-center">
                  <Ionicons name="add" size={24} color="white" />
                </View>
              </PrimaryGradient>

              <View>
                <Text className="font-semibold text-black text-lg">
                  Start a new plan
                </Text>
                <Text className="text-sm text-neutral-500">
                  Create your personalized itinerary
                </Text>
              </View>
            </View>
          </TouchableOpacity>

            {/* Recent Plans */}
            {searchHistory.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-black">
                Recent Plans
              </Text>
              <Pressable 
                onPress={() => router.push("/(tabs)/plans")}
                className="flex flex-row gap-2 items-center"
              >
                <Text className="text-md text-primary">
                View all 
                </Text>
                <Ionicons name="arrow-forward" color={"#2BAA8C"}/>
              </Pressable>
              </View>

              <View className="gap-4">
              {searchHistory.slice(0, 2).map((item) => (
                <Pressable
                key={item.id}
                onPress={() =>
                  directOpenItenary(item.destination)
                }
                className="rounded-2xl overflow-hidden bg-black/5 relative"
                >
                <Image
                  source={{ uri: getPlaceImage(item.imageUrl) }}
                  className="w-full h-40"
                  resizeMode="cover"
                />

                <LinearGradient
                  colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.2)", "transparent"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  className="absolute inset-0 w-full h-full"
                />

                <View className="p-4 absolute bottom-0 left-0 right-3">
                  <Text className="font-bold text-lg text-white">
                  {item.destination}
                  </Text>

                  <View className="flex-row items-center gap-3">
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color="#ddd"
                  />
                  <Text className="text-sm text-[#ddd]">
                    {item.date}
                  </Text>
                  <Text className="text-sm px-2 py-0.5 rounded-full bg-white/30 capitalize text-white">
                    {item.groupType}
                  </Text>
                  </View>
                </View>
                </Pressable>
              ))}
              </View>
            </View>
            )}

          {/* Popular Destinations */}
          <View className="mb-10">
            <Text className="text-xl font-bold text-black mb-4">
              Popular Destinations
            </Text>

            <View className="flex-row flex-wrap gap-4">
              {RECOMMENDED_PLACES.slice(0, 8).map((place) => (
                <Pressable
                  key={place.id}
                  onPress={() =>
                    onSelectDestination(place.name)
                  }
                  className="w-[48%] rounded-2xl overflow-hidden"
                >
                  <Image
                    source={{ uri: place.imageUrl }}
                    className="w-full h-40"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.2)", "transparent"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    className="absolute inset-0 w-full h-full"
                  />

                  <Text className="text-black text-sm bg-white/80 self-start px-3 py-1 rounded-full mb-2 absolute top-2 right-2" >
                    {place.category}
                  </Text>

                  <View className="p-3 absolute bottom-0 left-0 right-0">
                    <Text className="font-bold text-white text-md">
                      {place.name}
                    </Text>

                    {place.rating && (
                      <View className="flex-row items-center gap-1">
                        <Ionicons
                          name="star"
                          size={12}
                          color="#facc15"
                        />
                        <Text className="text-sm text-white">
                          {place.rating}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quick Tips */}
          <View className="p-8 rounded-2xl bg-primary/5 border border-gray-500/10">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons
                name="location-outline"
                size={24}
                color="#2BAA8C"
              />
              <Text className="font-semibold text-black text-xl">
                Quick Tips for Mumbai
              </Text>
            </View>

            <View className="gap-2">
              <View className="flex items-center flex-row gap-4">
                <Text className="text-primary font-bold text-2xl">•</Text> 
                <Text className="text-md text-neutral-600">
                  Local trains are the fastest during peak hours
                </Text>
              </View>
              <View className="flex items-center flex-row gap-4">
                <Text className="text-primary font-bold text-2xl">•</Text> 
                <Text className="text-md text-neutral-600">
                  Stick to popular stalls for street food
                </Text>
              </View>
              <View className="flex items-center flex-row gap-4">
                <Text className="text-primary font-bold text-2xl">•</Text> 
                <Text className="text-md text-neutral-600">
                  Monsoon season can affect outdoor plans
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
