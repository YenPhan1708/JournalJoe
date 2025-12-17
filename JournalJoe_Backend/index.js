import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 3000;

/**
 * Joe message – GPT
 */
app.post("/api/joe-message", async (req, res) => {
    try {
        const { previousEntries } = req.body;

        const prompt = `
You are Joe, a calm and supportive journaling companion.

Based on the user's recent journal entries, write ONE short,
warm, encouraging sentence inviting them to reflect.

Entries:
${previousEntries?.join("\n---\n") || "No previous entries"}
        `;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        res.json({
            message: completion.choices[0].message.content,
        });
    } catch (err) {
        console.error("Joe error:", err);
        res.status(500).json({ error: "Joe failed" });
    }
});

/**
 * Mood analysis – GPT-based 1–5 score
 */
app.post("/api/analyze-mood", async (req, res) => {
    try {
        const { text, tags } = req.body;

        const prompt = `
You are an AI that rates the user's mood based on their journal entry and selected tags.

Journal entry:
"${text}"

Tags: ${tags.join(", ") || "None"}

Assign a single integer mood score from 1 to 5:
1 = very negative / anxious / sad
2 = negative / low energy
3 = neutral
4 = positive / happy
5 = very positive / excited

Rules:
- Only return a number 1, 2, 3, 4, or 5.
- Do NOT skip numbers.
- Do NOT include text, explanations, or punctuation.

Mood score:
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // faster than GPT-4
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });
        console.log("GPT response:", completion.choices[0].message.content);

        const moodText = completion.choices[0].message.content.trim();
        const moodScore = parseInt(moodText, 10);

        if (![1,2,3,4,5].includes(moodScore)) {
            throw new Error(`Invalid mood score returned: ${moodText}`);
        }

        res.json({ moodScore });
    } catch (err) {
        console.error("Mood analysis failed:", err);
        res.status(500).json({ error: "Mood analysis failed" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on http://localhost:${PORT}`);
});
