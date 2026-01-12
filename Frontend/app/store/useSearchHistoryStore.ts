import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type GroupTypeKey = "friends" | "family" | "date";

export interface SearchHistory {
  id: string;
  destination: string;
  date: string;
  imageUrl?: string;
  groupType: GroupTypeKey;
  peopleCount: number;
  budgetPerPerson: number;
  timeWindow: any;
  preferences: string[];
  startLocation: string;
}

interface SearchHistoryState {
  searchHistory: SearchHistory[];
  saveToHistory: (input: any) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      searchHistory: [],

      saveToHistory: (input) => {
        const newItem: SearchHistory = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          imageUrl: input.destination,
          ...input,
        };

        const filtered = get().searchHistory.filter(
          (h) => h.destination !== input.destination
        );

        set({
          searchHistory: [newItem, ...filtered].slice(0, 10),
        });
      },

      deleteHistory: (id) =>
        set({
          searchHistory: get().searchHistory.filter(
            (item) => item.id !== id
          ),
        }),

      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "search_history",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
