import "dotenv/config";

export default {
  expo: {
    name: "Ghumlo",
    slug: "ghumighumi",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/appicon.png",
    scheme: "ghumighumi",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      eas: {
        "projectId": "ff90f9e5-7150-4ac2-9822-5e99ad4de5ca"
      },
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
      
      FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fsfarhaanshaikh7.ghumighumi"
    },
    android: {
      package: "com.fsfarhaanshaikh7.ghumighumi",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/appicon.png",
        backgroundColor: "#FFFFFF"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/icon.png",
      bundler: "metro"
    },

     plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon2.png",
          imageWidth: 400,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#ffffff"
          }
        }
      ],
      "@react-native-community/datetimepicker",
      "expo-web-browser"
    ],

    experiments: {
      typedRoutes: true
    }
  },
};
