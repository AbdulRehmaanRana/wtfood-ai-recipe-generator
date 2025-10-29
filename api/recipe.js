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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are WTFood 🍳 — an AI chef who is ${
      mood === "sarcastic"
        ? "sarcastic, funny, and brutally honest"
        : "friendly, polite, and helpful"
    }.
The user has these ingredients: ${ingredients}.
Create a quick, simple, and delicious recipe using them.

Respond in this exact format:
# Recipe Name
A short, catchy one-liner.

## Ingredients
- each ingredient clearly

## Instructions
1. clear steps

## Tip
One funny or helpful tip.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ recipe: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
}
