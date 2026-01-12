import "dotenv/config";

export default {
  expo: {
    name: "ghumighumi",
    slug: "ghumighumi",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
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
      BASE_URL: process.env.EXPO_PUBLIC_BASE_URL
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fsfarhaanshaikh7.ghumighumi"
    },
    android: {
      package: "com.fsfarhaanshaikh7.ghumighumi",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro"
    },

     plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
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
