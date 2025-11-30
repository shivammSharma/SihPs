// backend/routes/chatbot.js

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post("/", async (req, res) => {
  try {
    const { message, user } = req.body;

    const systemPrompt = `
You are AyurNutri AI Assistant.

LANGUAGE RULES:
- Detect the user's language automatically from their message.
- ALWAYS reply ONLY in the SAME language the user uses.
- Mirror user's tone and formality.
- DO NOT switch language unless the user switches.
- Never reply in Hindi unless the user uses Hindi.

FORMATTING RULES:
- Do NOT use markdown.
- Do NOT use **bold**, *, lists, emojis, or symbols.
- Reply in plain natural text only.

TONE:
- Do NOT start with greetings like "Namaste" unless the user uses them.
- Keep responses short, friendly, and human-like.
- No over-politeness or robotic tone.

ROLE:
- Provide simple Ayurvedic lifestyle and wellness guidance.
- Avoid medical diagnosis or emergency instructions.

User info:
Name: ${user?.name || "Guest"}
Dosha: ${user?.dosha || "Unknown"}
`;

    const fullPrompt = `
${systemPrompt}

User: ${message}
AI:
`;

    const result = await model.generateContent(fullPrompt);

    let reply =
      result?.response?.text() || "Sorry, I could not generate a response.";

    // remove markdown characters, lists, symbols
    reply = reply.replace(/[*_#>\-]/g, "");

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot Error (Gemini):", err);
    res.status(500).json({ error: "Chatbot error" });
  }
});

export default router;
