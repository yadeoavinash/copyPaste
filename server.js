import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/generate-message", async (req, res) => {
    try {
        const {
            businessName = "$",
            category = "dental clinic",
            situation = "no official website",
        } = req.body;

        const prompt = `
You are writing a short WhatsApp outreach message TO a business owner.

Sender:
- A freelance web developer named Avinash
- Offers modern, mobile-friendly websites

Receiver:
- Business name: ${businessName}
- Business type: ${category}
- Situation: ${situation}

Goal:
- Start a conversation, not hard-sell
- Grab attention politely
- Sound human, not spammy
- Ask permission before sending a demo link

Message requirements:
- 30 to 50 words only
- Simple Indian business English
- Professional, friendly tone
- Mention the business name naturally
- Mention ONE clear benefit of a website
- End with a soft question
- No emojis
- No links
- No pricing
- No hashtags
- No bullet points
- Do not say "I am AI"
- Do not explain anything
- Output only the final WhatsApp message

Avoid:
- "Dear Sir/Madam"
- "Best website"
- "Guaranteed results"
- "Limited time offer"
- "Cheap price"
- Pushy sales language
- Long paragraphs

Example style:
Hello, I came across ${businessName} while searching online. A modern website can help patients learn about your services and contact your clinic more easily. I recently created a demo for ${category} businesses. Would you like me to share it?

Now write a different message.
`;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const message = result.text.trim();

        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Gemini API failed",
        });
    }
});

app.get("/", (req, res) => {
    res.send("Gemini backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});