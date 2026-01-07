export type GroupType = "friends" | "family" | "date";

export type Preference = 
  | "travel" 
  | "food" 
  | "games" 
  | "hangout" 
  | "religious" 
  | "romantic";

export interface TimeWindow {
  start: string;
  end: string;
}

export default interface ItineraryInput {
  destination: string;
  peopleCount: number;
  budgetPerPerson: number;
  timeWindow: TimeWindow;
  preferences: string[];
  startLocation: string;
  groupType: string;
}

export interface ItineraryStop {
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

export interface ItineraryResult {
  stops: ItineraryStop[];
  totalSpendPerPerson: number;
  remainingBuffer: number;
  nearbyAttractions: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface SearchHistory {
  id: string;
  destination: string;
  date: string;
  groupType: GroupType;
  imageUrl?: string;
}

export interface RecommendedPlace {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating?: number;
}
