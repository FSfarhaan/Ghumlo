import Constants from "expo-constants";

  export const GOOGLE_WEB_CLIENT_ID = 
  Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID as string;

  export const GOOGLE_IOS_CLIENT_ID = 
  Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID as string;
  
  export const GOOGLE_ANDROID_CLIENT_ID = 
  Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID as string;
  
  export const BASE_URL = 
  Constants.expoConfig?.extra?.BASE_URL as string;
// console.log("Groq key exists:", !!GROQ_API_KEY);
