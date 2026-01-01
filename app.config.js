import "dotenv/config";

export default {
  expo: {
    name: "ghumighumi",
    slug: "ghumighumi",
    extra: {
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
  },
};
