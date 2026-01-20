import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ================= HF SETUP =================
const HF_MODEL = "SamLowe/roberta-base-go_emotions";
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;
const HF_API_KEY = process.env.HF_API_KEY;

// ================= EMOTION MAP =================
const EMOTION_TO_SCORE = {
    joy: 5,
    love: 5,
    relief: 4,
    optimism: 4,
    pride: 4,
    amusement: 4,
    surprise: 3,
    neutral: 3,
    sadness: 1,
    disgust: 1,
    anger: 0,
    fear: 0,
    embarrassment: 2,
    shame: 1,
    guilt: 1,
    longing: 2,
    nostalgia: 3,
    disappointment: 1,
    frustration: 1,
};

// ================= REQUEST LOGGING =================
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    if (req.method === "POST" || req.method === "PUT") {
        console.log("[BODY]", JSON.stringify(req.body, null, 2));
    }
    next();
});

// ================= TEST ROUTE =================
app.get("/test", (req, res) => {
    res.json({ ok: true });
});



// ================= JOE-MESSAGE =================
app.post("/api/joe-message", async (req, res) => {
    try {
        const { previousEntries } = req.body;

        if (!previousEntries || previousEntries.length === 0) {
            return res.json({ message: "I'm here for you. Take your time." });
        }

        const prompt = `
You are Joe, a supportive journal companion.
Write 1–2 short sentences encouraging the user.
Do not give advice.

Entries:
${previousEntries.slice(-3).join("\n---\n")}
`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        res.json({ message: completion.choices[0].message.content.trim() });
    } catch (err) {
        console.error("Error in /api/joe-message:", err);
        res.status(500).json({ error: "Joe message failed" });
    }
});

// ================= ANALYZE MOOD =================
app.post("/api/analyze-mood", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "No text provided" });

        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
        });

        const raw = await response.json();
        const emotions = Array.isArray(raw[0]) ? raw[0] : raw;

        let totalScore = 0;
        let totalWeight = 0;

        for (const { label, score } of emotions) {
            const mapped = EMOTION_TO_SCORE[label.toLowerCase()] ?? 3;
            totalScore += mapped * score;
            totalWeight += score;
        }

        const moodScore = totalWeight
            ? +(totalScore / totalWeight).toFixed(2)
            : 3;

        res.json({ moodScore });
    } catch (err) {
        console.error("Error in /api/analyze-mood:", err);
        res.status(500).json({ error: "Mood analysis failed" });
    }
});

// ================= JOURNAL ANALYSIS (COMBINED) =================
app.post("/api/journal-analysis", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "No journal text provided" });
        }

        // ---- Emotion Insight (HF) ----
        const hfRes = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
        });

        const hfRaw = await hfRes.json();
        const emotions = Array.isArray(hfRaw[0]) ? hfRaw[0] : hfRaw;

        const sorted = emotions.sort((a, b) => b.score - a.score);
        const primary = sorted[0]?.label.replace("_", " ") ?? "neutral";
        const secondary = sorted[1]?.label.replace("_", " ") ?? null;

        const insight = secondary
            ? `Recent entries show dominant ${primary} with some ${secondary}.`
            : `Recent entries are primarily ${primary}.`;

        // ---- Conclusion (OpenAI) ----
        const conclusionPrompt = `
Write one short reflective conclusion (1–2 sentences).
Do not give advice. Do not mention emotions explicitly.

Entry:
${text}
`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: conclusionPrompt }],
            temperature: 0.5,
        });

        const conclusion =
            completion.choices[0].message.content.trim();

        res.json({ insight, conclusion });
    } catch (err) {
        console.error("Error in /api/journal-analysis:", err);
        res.status(500).json({ error: "Journal analysis failed" });
    }
});

// ================= MOOD TREND (AI) =================
app.post("/api/mood-trend", async (req, res) => {
    try {
        const { scores } = req.body;

        if (!scores || scores.length < 3) {
            return res.json({ label: "Stable" });
        }

        const prompt = `
You are a clinical assistant.
Based on the following mood scores over time (earliest → latest),
classify the overall trend as ONE of:
Improving, Stable, Declining.

Scores:
${scores.join(", ")}

Respond with ONLY the label.
`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });

        const label =
            completion.choices[0].message.content.trim();

        res.json({ label });
    } catch (err) {
        console.error("Error in /api/mood-trend:", err);
        res.status(500).json({ label: "Stable" });
    }
});


// ================= UNMATCHED ROUTES =================
app.use((req, res) => {
    console.warn(`[WARN] No route matched: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Route not found" });
});


// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API running on port ${PORT}`);
});
