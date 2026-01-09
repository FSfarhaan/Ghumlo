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
      GROQ_API_KEY: process.env.EXPO_PUBLIC_GROQ_API_KEY,
    },

    ios: {
      supportsTablet: true
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
      "@react-native-community/datetimepicker"
    ],

    experiments: {
      typedRoutes: true
    }
  },
};
