import Constants from "expo-constants";

export const GROQ_API_KEY =
  Constants.expoConfig?.extra?.GROQ_API_KEY as string;

  
console.log("Groq key exists:", !!GROQ_API_KEY);
