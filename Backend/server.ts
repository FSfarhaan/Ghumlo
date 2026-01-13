import express, { Request, response, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./src/model/User";
import buildUserPrompt, { SYSTEM_PROMPT } from "./src/constants/systemPrompt";
import { ItineraryResult } from "./src/types/types";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// 🔌 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));



/**
 * 1️⃣ LOGIN / SAVE USER
 */
app.post("/user/login", async (req: Request, res: Response) => {
  try {
    const { name, email, avatar } = req.body;
    console.log("Idhar pe aaya kya?");
  
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
  
    let user = await User.findOne({ email });
  
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Sign in failed");
  }
});

/**
 * 2️⃣ ADD TRIP SEARCH
 */
app.post("/user/add-trip", async (req: Request, res: Response) => {
  try {
    const { email, trip } = req.body;
  
    if (!email || !trip) {
      return res.status(400).json({ message: "Email and trip required" });
    }
  
    await User.findOneAndUpdate(
      { email },
      { $push: { trips: trip } },
      { new: true }
    );
  
    res.status(200).json("Trip added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Adding trips failed");
  }
});

/**
 * 3️⃣ GET USER (optional)
 */
app.get("/user/:email", async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user);
});

app.get("/test", (_, res) => {
  res.status(200).json("Sab changa si")
})


app.post("/grok", async (req: Request, res: Response) => {
  const { input } = req.body;

  const userPrompt = buildUserPrompt({
    destination: input.destination,
    peopleCount: input.peopleCount,
    budgetPerPerson: input.budgetPerPerson,
    timeWindow: input.timeWindow,
    preferences: input.preferences,
    startLocation: input.startLocation,
    groupType: input.groupType,
  });

  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // ✅ backend only
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

  // JSON extraction logic stays EXACTLY SAME
  let jsonString = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1];
  }

  const result = JSON.parse(jsonString.trim()) as ItineraryResult;

  result.stops = result.stops.map((stop, index) => ({
    ...stop,
    id: stop.id || String(index + 1),
  }));

  return res.status(200).json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
