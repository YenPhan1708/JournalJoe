import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ------------------------------------------------------------------ */
/* Hugging Face config                                                 */
/* ------------------------------------------------------------------ */

const HF_MODEL = "SamLowe/roberta-base-go_emotions";
const HF_API_URL =
    `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

/* ------------------------------------------------------------------ */
/* OpenAI (UNCHANGED – Joe still uses GPT)                             */
/* ------------------------------------------------------------------ */

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------------------------------------------------------ */
/* Emotion → Mood mapping (GoEmotions → 1–5 score)                     */
/* ------------------------------------------------------------------ */

const EMOTION_TO_MOOD = {
    sadness: 1,
    grief: 1,
    remorse: 1,

    fear: 2,
    nervousness: 2,
    embarrassment: 2,
    disappointment: 2,
    anger: 2,
    annoyance: 2,
    disgust: 2,
    disapproval: 2,

    neutral: 3,
    confusion: 3,
    realization: 3,
    curiosity: 3,

    optimism: 4,
    approval: 4,
    caring: 4,
    relief: 4,
    desire: 4,

    joy: 5,
    excitement: 5,
    love: 5,
    gratitude: 5,
    pride: 5,
    admiration: 5,
};

function emotionScoresToMood(emotions = []) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const e of emotions) {
        const mood = EMOTION_TO_MOOD[e.label];
        if (!mood || typeof e.score !== "number") continue;

        weightedSum += mood * e.score;
        totalWeight += e.score;
    }

    if (totalWeight === 0) return 3;
    return Math.round(weightedSum / totalWeight);
}

/* ------------------------------------------------------------------ */
/* Joe message – GPT (UNCHANGED)                                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Mood analysis – Hugging Face GoEmotions                             */
/* ------------------------------------------------------------------ */

app.post("/api/analyze-mood", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.json({ moodScore: 3 });
        }

        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: text,
                options: { wait_for_model: true },
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("HF error:", errText);
            return res.json({ moodScore: 3 });
        }

        const data = await response.json();

        // Expected shape: [ [ { label, score }, ... ] ]
        const emotions = Array.isArray(data?.[0]) ? data[0] : [];

        const moodScore = emotionScoresToMood(emotions);

        res.json({ moodScore });
    } catch (err) {
        console.error("Mood analysis failed:", err);
        res.json({ moodScore: 3 });
    }
});

/* ------------------------------------------------------------------ */

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on http://localhost:${PORT}`);
});
