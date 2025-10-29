import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { ingredients, mood } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: "No ingredients provided." });
    }

    // 🔐 Load your Gemini API key from environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are WTFood 🍳 — an AI chef who is ${mood === "sarcastic" ? "sarcastic, funny, and brutally honest" : "friendly, polite, and helpful"}.
The user has these ingredients: ${ingredients}.
Create a quick, simple, and delicious recipe using them.

Your response MUST follow this format:
# Recipe Name
A short and punchy one-line description.

## Ingredients
- list each ingredient clearly

## Instructions
1. step-by-step instructions

## Tip
Add one fun or useful cooking tip related to the dish.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ recipe: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
}
