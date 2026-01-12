import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchHistory } from "../types/itinerary";

export interface LikedItem {
  id: string;
  destination: string;
  imageUrl?: string;
  date: string;
  groupType: "friends" | "family" | "date";
}


interface LikedItemsState {
  likedItems: SearchHistory[];
  toggleLike: (item: LikedItem) => void;
  isLiked: (destination: string) => boolean;
  clearLikes: () => void;
}

export const useLikedItemsStore = create<LikedItemsState>()(
  persist(
    (set, get) => ({
      likedItems: [],

      toggleLike: (item) => {
        const exists = get().likedItems.find(
          (i) => i.destination === item.destination
        );

        set({
          likedItems: exists
            ? get().likedItems.filter(
                (i) => i.destination !== item.destination
              ).slice(0, 10)
            : [...get().likedItems, item].slice(0, 10),
        });
      },

      isLiked: (destination) =>
        !!get().likedItems.find(
          (i) => i.destination === destination
        ),

      clearLikes: () => set({ likedItems: [] }),
    }),
    {
      name: "liked_itenary",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
