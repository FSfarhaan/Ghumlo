import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import getGroqResult from '../services/groq';
import { GROQ_API_KEY } from "../config/env";
import AsyncStorage from '@react-native-async-storage/async-storage';

type PreferenceType = "travel" | "food" | "games" | "hangout" | "religious" | "romantic";
type GroupTypeKey = "friends" | "family" | "date";

interface TimeWindow {
  start: string;
  end: string;
}

interface ItineraryInput {
  date: string;
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
  id: string;
  stops: ItineraryStop[];
  totalSpendPerPerson: number;
  remainingBuffer: number;
  nearbyAttractions: string[];
}

const loadingMessages = [
  "Exploring Mumbai's hidden gems...",
  "Calculating travel times...",
  "Finding the best local spots...",
  "Optimizing your budget...",
  "Curating your perfect day...",
];

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentMessage, setCurrentMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );

  // Animation values
  const circle1Scale = useRef(new Animated.Value(0.8)).current;
  const circle1Opacity = useRef(new Animated.Value(0.3)).current;
  const circle2Scale = useRef(new Animated.Value(0.8)).current;
  const circle2Opacity = useRef(new Animated.Value(0.3)).current;
  const circle3Scale = useRef(new Animated.Value(0.8)).current;
  const circle3Opacity = useRef(new Animated.Value(0.3)).current;
  const centerRotation = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0.5)).current;
  const progressX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const input: ItineraryInput = JSON.parse(params.input as string);
    
    // Start all animations
    startCircleAnimation(circle1Scale, circle1Opacity, 0);
    startCircleAnimation(circle2Scale, circle2Opacity, 400);
    startCircleAnimation(circle3Scale, circle3Opacity, 800);
    startCenterRotation();
    startTextAnimation();
    startProgressAnimation();

    // Change message periodically
    const messageInterval = setInterval(() => {
      setCurrentMessage(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );
    }, 2000);

    // Generate itinerary
    generateItinerary(input);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  const startCircleAnimation = (
    scale: Animated.Value,
    opacity: Animated.Value,
    delay: number
  ) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  };

  const startCenterRotation = () => {
    Animated.loop(
      Animated.timing(centerRotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startTextAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startProgressAnimation = () => {
    Animated.loop(
      Animated.timing(progressX, {
        toValue: 100,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start(() => {
      progressX.setValue(-100);
    });
  };

  const generateItinerary = async (input: ItineraryInput) => {
    try {
        setTimeout(async () => {
            const id: string = Date.now().toString()
            const destination = input.destination;
            const result = await getGroqResult(input, GROQ_API_KEY);

            const newResponse = { id, destination, ...result}
            console.log(newResponse);
            
            const historyResponse = await AsyncStorage.getItem("groq_response")

            const existingResponse = historyResponse ? JSON.parse(historyResponse) : [];
            const updatedResponse = [...existingResponse, newResponse]

            await AsyncStorage.setItem("groq_response", JSON.stringify(updatedResponse));
            console.log("API Response saved successfully");

            router.replace({
              pathname: "/(flow)/itenary",
              params: {
                input: JSON.stringify(input),
                result: JSON.stringify(newResponse),
              },
            });
        }, 2000);

    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      router.replace("/(flow)/questionnaire");
    }
  };

  const spin = centerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {/* Animated circles */}
        <View className="relative w-32 h-32 mb-8 items-center justify-center">
          {/* Circle 1 */}
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: circle1Scale }],
                opacity: circle1Opacity,
              },
            ]}
            className="absolute w-32 h-32 rounded-full border-2 border-indigo-200"
          />

          {/* Circle 2 */}
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: circle2Scale }],
                opacity: circle2Opacity,
              },
            ]}
            className="absolute w-32 h-32 rounded-full border-2 border-indigo-200"
          />

          {/* Circle 3 */}
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: circle3Scale }],
                opacity: circle3Opacity,
              },
            ]}
            className="absolute w-32 h-32 rounded-full border-2 border-indigo-200"
          />

          {/* Center icon with rotation */}
          <Animated.View
            style={[
              styles.centerIcon,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <View className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
              <Ionicons name="location" size={32} color="#fff" />
            </View>
          </Animated.View>
        </View>

        {/* Animated text */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-3">
            Planning Your Adventure
          </Text>
          <Animated.View style={{ opacity: textOpacity }}>
            <Text className="text-gray-600 text-lg text-center">
              {currentMessage}
            </Text>
          </Animated.View>
        </View>

        {/* Progress bar */}
        <View className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            style={[
              styles.progressBar,
              {
                transform: [
                  {
                    translateX: progressX.interpolate({
                      inputRange: [-100, 100],
                      outputRange: [-256, 256],
                    }),
                  },
                ],
              },
            ]}
            className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
  },
  centerIcon: {
    position: 'absolute',
  },
  progressBar: {
    position: 'absolute',
  },
});