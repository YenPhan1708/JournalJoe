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
/* OpenAI (Joe GPT)                                                    */
/* ------------------------------------------------------------------ */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ------------------------------------------------------------------ */
/* Joe tips – now using raw journal entries                             */
/* ------------------------------------------------------------------ */
app.post("/api/joe-tips", async (req, res) => {
    try {
        const { journals } = req.body;

        console.log("────────────────────────────────────");
        console.log("🧠 /api/joe-tips called");
        console.log("📥 journals received:");
        console.log(JSON.stringify(journals, null, 2));
        console.log("────────────────────────────────────");

        if (!journals || journals.length === 0) {
            console.warn("⚠️ No journal data — returning fallback tips");
            return res.json({
                tipsText:
                    `Joe’s Tips for You 💜
Based on what you’ve been sharing, here are some gentle reminders and techniques that might help:

🌿 For Anxiety Moments:
• Not enough journal data yet to personalize anxiety tips
• —
• —

🧘 For Stress Management:
• Keep journaling so I can learn your patterns
• —
• —`
            });
        }

        const prompt = `
You are Joe, a calm and supportive journaling companion.

CRITICAL RULES:
- NEVER explain journal data.
- Always generate 3-4 short, plain, concise bullets per section.
- Use the journal entries provided below to create personalized tips.
- Only use fallback bullets if there is zero data.

JOURNAL ENTRIES (RAW):
${JSON.stringify(journals, null, 2)}

OUTPUT FORMAT (PLAIN TEXT ONLY):

Joe’s Tips for You 💜
Based on what you’ve been sharing, here are some gentle reminders and techniques that might help:

🌿 For Anxiety Moments:
• bullet 1
• bullet 2
• bullet 3

🧘 For Stress Management:
• bullet 1
• bullet 2
• bullet 3
`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        const tipsText = completion.choices?.[0]?.message?.content;

        if (!tipsText) throw new Error("OpenAI returned empty tipsText");

        res.json({ tipsText: tipsText.trim() });

    } catch (err) {
        console.error("❌ Joe tips error:", err.message || err);
        res.status(500).json({ error: "Joe tips generation failed" });
    }
});

/* ------------------------------------------------------------------ */
/* Joe message – unchanged                                              */
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

        res.json({ message: completion.choices[0].message.content });
    } catch (err) {
        console.error("Joe error:", err);
        res.status(500).json({ error: "Joe failed" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API running on http://172.20.10.2:${PORT}`);
});
