import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AIResponse {
  id: string;
  destination: string;
  stops: any[];
  totalSpendPerPerson: number;
  remainingBuffer: number;
  nearbyAttractions: string[];
}

interface AIResponseState {
  responses: AIResponse[];
  addResponse: (response: AIResponse) => void;
  getResponseByDestination: (destination: string) => AIResponse | undefined;
  clearResponses: () => void;
}

export const useAIResponseStore = create<AIResponseState>()(
  persist(
    (set, get) => ({
      responses: [],

      addResponse: (response) =>
        set({
          responses: [...get().responses, response].slice(0, 10),
        }),

      getResponseByDestination: (destination) =>
        get().responses.find((r) => r.destination === destination),

      clearResponses: () => set({ responses: [] }),
    }),
    {
      name: "groq_response",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
