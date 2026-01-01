import ItineraryInput, { ItineraryResult, ItineraryStop } from "../types/itinerary";
import buildUserPrompt, { SYSTEM_PROMPT } from "../constants/systemPrompt";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function getGroqResult(
  input: ItineraryInput,
  apiKey: string
): Promise<ItineraryResult> {
  const userPrompt = buildUserPrompt({
    destination: input.destination,
    peopleCount: input.peopleCount,
    budgetPerPerson: input.budgetPerPerson,
    timeWindow: input.timeWindow,
    preferences: input.preferences,
    startLocation: input.startLocation,
    groupType: input.groupType,
  });

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content in response");
  }

  try {
    // Extract JSON from the response (handle markdown code blocks)
    let jsonString = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }
    
    const result = JSON.parse(jsonString.trim()) as ItineraryResult;
    
    // Validate and ensure IDs exist
    result.stops = result.stops.map((stop: ItineraryStop, index: number) => ({
      ...stop,
      id: stop.id || String(index + 1),
    }));
    
    return result;
  } catch (parseError) {
    console.error("Failed to parse itinerary response:", content);
    throw new Error("Failed to parse itinerary from AI response");
  }
}
