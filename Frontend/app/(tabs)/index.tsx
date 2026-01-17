import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryGradient from "../components/PrimaryGradient";
import getPlaceImage, { RECOMMENDED_PLACES } from "../data/placesData";
import { useAIResponseStore } from "../store/useAIResponseStore";
import { useSearchHistoryStore } from "../store/useSearchHistoryStore";
import { SearchHistory } from "../types/itinerary";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const { searchHistory } = useSearchHistoryStore();
  const { getResponseByDestination } = useAIResponseStore();
  const router = useRouter();

  const onSelectDestination = (destination?: string) => {
    if (destination) {
      router.push({
        pathname: "/(flow)/questionnaire",
        params: { destination },
      });
    } else {
      router.push({
        pathname: "/(flow)/questionnaire",
      });
    }
  };

  const directOpenItenary = async (myHistory: SearchHistory) => {
    const myResponse = getResponseByDestination(myHistory.destination);
    router.push({
      pathname: "/(flow)/itenary",
      params: {
        input: JSON.stringify(myHistory),
        result: JSON.stringify(myResponse),
      },
    });
  };

  return (
    <View className="flex-1 bg-white pb-8">
      <ScrollView
        className={`flex-1 ${Platform.OS === "web" ? "px-4" : "px-6"}`}
        showsVerticalScrollIndicator={false}
      >
        <View className={"py-6"}>
          {/* Hero */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-black">
              Plan your perfect
            </Text>
            <Text className="text-4xl font-bold text-primary">Mumbai day</Text>
            <Text className="text-neutral-500 mt-2">
              AI-powered itineraries tailored to your vibe
            </Text>
          </View>

          {/* New Plan CTA */}
          <TouchableOpacity
            onPress={() => onSelectDestination()}
            className={`mb-8 ${Platform.OS === "web" ? "p-4" : "p-6"} rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5`}
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
          {searchHistory?.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-black">
                  Recent Plans
                </Text>
                <Pressable
                  onPress={() => router.push("/(tabs)/plans")}
                  className="flex flex-row gap-2 items-center"
                >
                  <Text className="text-md text-primary">View all</Text>
                  <Ionicons name="arrow-forward" color={"#2BAA8C"} />
                </Pressable>
              </View>

              <View className="gap-4">
                {searchHistory.slice(0, 2).map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => directOpenItenary(item)}
                    className="rounded-2xl overflow-hidden bg-black/5 relative"
                  >
                    <Image
                      source={{ uri: getPlaceImage(item.imageUrl!) }}
                      className="w-full h-40"
                      resizeMode="cover"
                    />

                    <LinearGradient
                      colors={[
                        "rgba(0,0,0,0.7)",
                        "rgba(0,0,0,0.2)",
                        "transparent",
                      ]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      className="absolute inset-0 w-full h-full"
                    />

                    <View className="p-4 absolute bottom-0 left-0 right-3">
                      <Text className="font-bold text-lg text-white">
                        {item.destination}
                      </Text>

                      <View className="flex-row items-center gap-3">
                        <Ionicons name="time-outline" size={14} color="#ddd" />
                        <Text className="text-sm text-[#ddd]">{item.date}</Text>
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

            <View className="flex-row gap-4 flex-wrap">
              {RECOMMENDED_PLACES.slice(0, 8).map((place) => (
                <Pressable
                  key={place.id}
                  onPress={() => onSelectDestination(place.name)}
                  className="rounded-2xl overflow-hidden flex-1"
                  style={{ minWidth: "45%" }}
                >
                  <Image
                    source={{ uri: place.imageUrl }}
                    className="w-full h-40"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0.7)",
                      "rgba(0,0,0,0.2)",
                      "transparent",
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    className="absolute inset-0 w-full h-full"
                  />

                  <Text className="text-black text-sm bg-white/80 self-start px-3 py-1 rounded-full mb-2 absolute top-2 right-2">
                    {place.category}
                  </Text>

                  <View className="p-3 absolute bottom-0 left-0 right-0">
                    <Text className="font-bold text-white text-md">
                      {place.name}
                    </Text>

                    {place.rating && (
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="star" size={12} color="#facc15" />
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
              <Ionicons name="location-outline" size={24} color="#2BAA8C" />
              <Text className="font-semibold text-black text-xl">
                Quick Tips for Mumbai
              </Text>
            </View>

            <View className="gap-3">
              <View className="flex flex-row items-start gap-4">
                <Text className="text-primary font-bold text-2xl">•</Text>
                <Text className="text-md text-neutral-700 leading-6">
                  During rush hours (8-11 AM, 6-9 PM), local trains are
                  extremely crowded. Avoid them unless you're used to the
                  chaos.
                </Text>
              </View>

              <View className="flex flex-row items-start gap-4">
                <Text className="text-primary font-bold text-2xl">•</Text>
                <Text className="text-md text-neutral-700 leading-6">
                  Autos don't run south of Bandra. Plan for taxis or trains if
                  you're heading toward South Mumbai.
                </Text>
              </View>

              <View className="flex flex-row items-start gap-4">
                <Text className="text-primary font-bold text-2xl">•</Text>
                <Text className="text-md text-neutral-700 leading-6">
                  If it starts raining heavily, traffic slows dramatically.
                  Nearby cafés or malls are better waiting spots than staying on
                  the road.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>

    // <View><Text>Ye index hai</Text></View>
  );
}
