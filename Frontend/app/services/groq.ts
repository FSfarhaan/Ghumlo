import ItineraryInput, { ItineraryResult, ItineraryStop } from "../types/itinerary";
// for local dev: http://localhost:3000/api/itinerary
import { BASE_URL } from "../config/env";

export async function getGroqResult(
  input: ItineraryInput
): Promise<ItineraryResult> {

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}` // optional later
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend error: ${error}`);
  }

  const result = (await response.json()) as ItineraryResult;

  // Safety: ensure IDs exist (frontend guard)
  result.stops = result.stops.map((stop: ItineraryStop, index: number) => ({
    ...stop,
    id: stop.id || String(index + 1),
  }));

  return result;
}
