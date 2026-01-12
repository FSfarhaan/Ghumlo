import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryGradient from "../components/PrimaryGradient";
import ItineraryInput from "../types/itinerary";
import { useSearchHistoryStore } from "../store/useSearchHistoryStore";
import TimePicker from "../components/TimePicker";
import { saveUserTrip } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

const TOTAL_STEPS = 7;

const popularDestinations = [
  "Gateway of India",
  "Marine Drive",
  "Juhu Beach",
  "Bandra-Worli Sea Link",
  "Elephanta Caves",
  "Siddhivinayak Temple",
];

const popularStartLocations = [
  "Thane",
  "Andheri",
  "Bandra",
  "Dadar",
  "Churchgate",
  "CST",
];

interface Preference {
  key: string;
  label: string;
  emoji: string;
}

interface GroupType {
  key: string;
  label: string;
  emoji: string;
  description: string;
}

interface TimeWindow {
  start: string;
  end: string;
}

interface FormData {
  destination: string;
  peopleCount: number;
  budgetPerPerson: number;
  timeWindow: TimeWindow;
  preferences: string[];
  startLocation: string;
  groupType: string;
}

// type GroupTypeKey = "friends" | "family" | "date";

interface SearchHistory extends ItineraryInput {
  id: string;
  destination: string;
  date: string;
  //   groupType: string;
  imageUrl: string;
}

const preferences: Preference[] = [
  { key: "travel", label: "Travel", emoji: "✈️" },
  { key: "food", label: "Food", emoji: "🍽️" },
  { key: "games", label: "Games", emoji: "🎮" },
  { key: "hangout", label: "Hangout", emoji: "☕" },
  { key: "religious", label: "Religious", emoji: "🕉️" },
  { key: "romantic", label: "Romantic", emoji: "💕" },
];

const groupTypes: GroupType[] = [
  {
    key: "friends",
    label: "Friends",
    emoji: "👥",
    description: "Fun and adventure",
  },
  {
    key: "family",
    label: "Family",
    emoji: "👨‍👩‍👧‍👦",
    description: "All ages welcome",
  },
  { key: "date", label: "Date", emoji: "💑", description: "Romantic vibes" },
];

export default function QuestionnaireScreen() {
  const { saveToHistory } = useSearchHistoryStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const prefilledDestination = params.destination as string | undefined;
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    destination: prefilledDestination || "",
    peopleCount: 1,
    budgetPerPerson: 0,
    timeWindow: { start: "09:00 AM", end: "7:00 PM" },
    preferences: [],
    startLocation: "",
    groupType: "",
  });

  useEffect(() => {
    if (prefilledDestination) {
      setFormData((prev) => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination]);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePreference = (pref: string) => {
    const current = formData.preferences;
    const updated = current?.includes(pref)
      ? current.filter((p) => p !== pref)
      : [...current, pref];
    updateField("preferences", updated);
  };

  const canProceed = (): boolean | string | 0 => {
    switch (step) {
      case 1:
        return formData.destination && formData.destination.trim().length > 0;
      case 2:
        return formData.peopleCount && formData.peopleCount > 0;
      case 3:
        return formData.budgetPerPerson && formData.budgetPerPerson > 0;
      case 4:
        return formData.timeWindow?.start && formData.timeWindow?.end;
      case 5:
        return formData.preferences && formData.preferences.length > 0;
      case 6:
        return (
          formData.startLocation && formData.startLocation.trim().length > 0
        );
      case 7:
        return formData.groupType !== "";
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else if (canProceed()) {
      const completeInput = formData as FormData;
      // Save to history
      saveToHistory(completeInput);
      // Save to backend, name of the trip
      saveUserTrip(user!.email, completeInput.destination);

      router.push({
        pathname: "/(flow)/loading",
        params: { input: JSON.stringify(completeInput) },
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onCancel = () => {
    router.back();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${Platform.OS === "web" ? "p-4" : "p-6"}  border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              Where do you want to explore?
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              Pick a destination in Mumbai
            </Text>

            <TextInput
              className="w-full px-4 py-3.5  rounded-xl border border-gray-200 text-base text-gray-900"
              value={formData.destination}
              onChangeText={(text) => updateField("destination", text)}
              placeholder="e.g., Gateway of India"
              placeholderTextColor="#999"
            />

            <View className="flex-row flex-wrap gap-2 mt-4 mb-4">
              {popularDestinations.map((dest) => (
                <TouchableOpacity
                  key={dest}
                  onPress={() => updateField("destination", dest)}
                  className={`flex-row items-center gap-4 px-5 py-3 rounded-full ${
                    formData.destination === dest
                      ? "bg-primary"
                      : "bg-primary/5"
                  }`}
                >
                  <Text
                    className={`text-md ${
                      formData.destination === dest
                        ? "text-white"
                        : "text-primary"
                    }`}
                  >
                    {dest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${Platform.OS === "web" ? "p-4" : "p-6"}  border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              How many people?
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              Including yourself
            </Text>

            <View className="flex-row items-center justify-center gap-6 mt-5 mb-6">
              <TouchableOpacity
                onPress={() =>
                  updateField(
                    "peopleCount",
                    Math.max(1, formData.peopleCount - 1)
                  )
                }
                className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center"
              >
                <Text className="text-2xl font-bold text-gray-900">−</Text>
              </TouchableOpacity>

              <Text className="text-5xl font-bold text-gray-900 min-w-[80px] text-center">
                {formData.peopleCount}
              </Text>

              <PrimaryGradient className="rounded-full">
                <TouchableOpacity
                  onPress={() =>
                    updateField("peopleCount", formData.peopleCount + 1)
                  }
                  className="w-14 h-14 rounded-full items-center justify-center"
                >
                  <Text className="text-2xl font-bold text-white">+</Text>
                </TouchableOpacity>
              </PrimaryGradient>
            </View>
          </View>
        );

      case 3:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${Platform.OS === "web" ? "p-4" : "p-6"}  border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              Budget per person?
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              In Indian Rupees (₹)
            </Text>

            <View className="relative">
              <Text className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary z-10">
                ₹
              </Text>
              <TextInput
                className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 text-2xl font-semibold text-gray-900"
                value={
                  formData.budgetPerPerson
                    ? formData.budgetPerPerson.toString()
                    : ""
                }
                onChangeText={(text) =>
                  updateField("budgetPerPerson", parseInt(text) || 0)
                }
                placeholder="1500"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View className="flex-row gap-2 mt-4 mb-4 flex-wrap">
              {[500, 1000, 1500, 2000, 3000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => updateField("budgetPerPerson", amount)}
                  className={`flex-row gap-4 px-5 py-3 rounded-full ${
                    formData.budgetPerPerson === amount
                      ? "bg-primary"
                      : "bg-primary/5"
                  }`}
                >
                  <Text
                    className={`text-md text-center ${
                      formData.budgetPerPerson === amount
                        ? "text-white"
                        : "text-primary"
                    }`}
                  >
                    ₹{amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${
              Platform.OS === "web" ? "p-4" : "p-6"
            } border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              What's your time window?
            </Text>

            <Text className="text-base text-gray-600 mb-6">
              When do you want to start and end
            </Text>

            <View className="flex-row gap-4">
              {/* START */}
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">Start Time</Text>
                <TouchableOpacity
                  onPress={() => setShowPicker("start")}
                  className="flex-row items-center px-4 py-3.5 rounded-xl border border-gray-200"
                >
                  <Text className="flex-1 text-base text-gray-900">
                    {formData.timeWindow.start}
                  </Text>
                  <Ionicons name="time" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* END */}
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">End Time</Text>
                <TouchableOpacity
                  onPress={() => setShowPicker("end")}
                  className="flex-row items-center px-4 py-3.5 rounded-xl border border-gray-200"
                >
                  <Text className="flex-1 text-base text-gray-900">
                    {formData.timeWindow.end}
                  </Text>
                  <Ionicons name="time" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* PICKERS */}
            <TimePicker
              visible={showPicker === "start"}
              value={formData.timeWindow.start}
              onClose={() => setShowPicker(null)}
              onChange={(value) =>
                setFormData((p) => ({
                  ...p,
                  timeWindow: { ...p.timeWindow, start: value },
                }))
              }
            />

            <TimePicker
              visible={showPicker === "end"}
              value={formData.timeWindow.end}
              onClose={() => setShowPicker(null)}
              onChange={(value) =>
                setFormData((p) => ({
                  ...p,
                  timeWindow: { ...p.timeWindow, end: value },
                }))
              }
            />
          </View>
        );

      case 5:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${Platform.OS === "web" ? "p-4" : "p-6"}  border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              What are you in the mood for?
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              Select all that apply
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {preferences.map((pref) => {
                const iconMap: Record<string, string> = {
                  travel: "airplane-outline",
                  food: "restaurant-outline",
                  games: "game-controller-outline",
                  hangout: "cafe-outline",
                  religious: "hand-right-outline",
                  romantic: "heart-outline",
                };
                return (
                  <TouchableOpacity
                    key={pref.key}
                    onPress={() => togglePreference(pref.key)}
                    className={`flex-row items-center gap-4 px-5 py-3 rounded-full ${
                      formData?.preferences?.includes(pref.key)
                        ? "bg-primary"
                        : "bg-primary/5"
                    }`}
                  >
                    <Ionicons
                      name={iconMap[pref.key] as any}
                      size={20}
                      color={
                        formData?.preferences?.includes(pref.key)
                          ? "white"
                          : "#2BAA8C"
                      }
                    />
                    <Text
                      className={`text-md ${
                        formData?.preferences?.includes(pref.key)
                          ? "text-white"
                          : "text-primary"
                      }`}
                    >
                      {pref.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 6:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${Platform.OS === "web" ? "p-4" : "p-6"}  border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              Where are you starting from?
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              Your starting location in Mumbai
            </Text>

            <TextInput
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-xl text-gray-900"
              value={formData.startLocation}
              onChangeText={(text) => updateField("startLocation", text)}
              placeholder="e.g., Thane Station"
              placeholderTextColor="#999"
            />

            <View className="flex-row flex-wrap gap-2 mt-4 mb-4">
              {popularStartLocations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => updateField("startLocation", loc)}
                  className={`gap-4 px-5 py-3 rounded-full ${
                    formData.startLocation === loc
                      ? "bg-primary"
                      : "bg-primary/5"
                  }`}
                >
                  <Text
                    className={`text-md ${
                      formData.startLocation === loc
                        ? "text-white"
                        : "text-primary"
                    }`}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 7:
        return (
          <View
            className={`mb-5 bg-white rounded-2xl ${Platform.OS === "web" ? "p-4" : "p-6"}  border border-white/10 shadow-sm`}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              Who are you going with?
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              This helps us pick the right vibe
            </Text>

            <View className="gap-3 mb-4">
              {groupTypes.map((type) => {
                const iconMap: Record<string, string> = {
                  friends: "people-outline",
                  family: "home-outline",
                  date: "heart-outline",
                };
                return (
                  <TouchableOpacity
                    key={type.key}
                    onPress={() => updateField("groupType", type.key)}
                    className={`flex-row items-center gap-4 p-4 rounded-xl ${
                      formData.groupType === type.key
                        ? "bg-primary"
                        : "bg-primary/5"
                    }`}
                  >
                    <Ionicons
                      name={iconMap[type.key] as any}
                      size={28}
                      color={
                        formData.groupType === type.key ? "#fff" : "#2BAA8C"
                      }
                    />
                    <View className="flex-1">
                      <Text
                        className={`text-lg font-semibold ${
                          formData.groupType === type.key
                            ? "text-white"
                            : "text-primary"
                        }`}
                      >
                        {type.label}
                      </Text>
                      <Text
                        className={`text-sm ${formData.groupType === type.key ? "text-white" : "text-gray-600"}  mt-1`}
                      >
                        {type.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const handleTimeChange = (type: "start" | "end", date?: Date) => {
    setShowPicker(null);
    if (!date) return;

    updateField("timeWindow", {
      ...formData.timeWindow,
      [type]: formatTime(date),
    });
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fafafa]">
      <ScrollView
        className={`flex-1 ${Platform.OS == "web" ? "p-4" : "p-6"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-5">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-row items-center gap-2 py-2 rounded-lg"
          >
            <Ionicons name="close" size={24} color="#777" />
            <Text className="text-md font-medium text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-md font-medium text-gray-500 mb-2">
          Step {step} of {TOTAL_STEPS}
        </Text>
        {/* Progress Bar */}
        <View className="h-3 bg-primary/5 rounded-full mb-8 overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </View>

        {/* Question */}
        <View className="mb-8 flex-1">{renderStep()}</View>

        {/* Navigation */}
        <View className="flex-row justify-between gap-3 mt-5 pb-5">
          <TouchableOpacity
            onPress={handleBack}
            disabled={step === 1}
            className={`flex-row items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-black/10 ${
              step === 1 ? "bg-gray-200 opacity-50" : "bg-primary/5"
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={16}
              color={step === 1 ? "#999" : "#2BAA8C"}
            />
            <Text
              className={`text-lg font-semibold ${
                step === 1 ? "text-gray-400" : "text-primary"
              }`}
            >
              Back
            </Text>
          </TouchableOpacity>

          <PrimaryGradient className={`${!canProceed() ? "opacity-50" : ""}`}>
            <TouchableOpacity
              onPress={handleNext}
              disabled={!canProceed()}
              className={`flex-row items-center justify-center gap-2 px-6 py-0 rounded-xl flex-1`}
            >
              {step === TOTAL_STEPS ? (
                <>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                  <Text className="text-md font-semibold text-white">
                    Generate Itinerary
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-lg font-semibold text-white">Next</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </PrimaryGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
