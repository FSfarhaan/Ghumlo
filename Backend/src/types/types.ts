interface TimeWindow {
  start: string;
  end: string;
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

export interface ItineraryInput {
  destination: string;
  peopleCount: number;
  budgetPerPerson: number;
  timeWindow: TimeWindow;
  preferences: string[];
  startLocation: string;
  groupType: string;
}