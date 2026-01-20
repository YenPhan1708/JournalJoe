import React, { useEffect, useState, useRef } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
} from "react-native";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import CoachCard from "../../components/CoachCard";
import StatCard from "../../components/StatCard";
import MoodChart from "../../components/MoodChart";
import { COLORS } from "../../theme/colors";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface JournalEntry {
    id: string;
    date: string;
    moodScore: number;
    tags: string[];
    text: string;
    shared?: boolean;
}

interface AnimatedTagProps {
    label: string;
}

/* ------------------------------------------------------------------ */
/* Static Tips (FROM PDF)                                              */
/* ------------------------------------------------------------------ */

const STATIC_TIPS = [
    {
        title: "📔 Using Journaling Effectively",
        items: [
            "Write honestly without worrying about grammar or structure.",
            "Short, consistent entries are more helpful than rare long ones.",
            "Use tags to notice emotional patterns over time.",
            "Your journal is a judgment-free space.",
            "Focus on expressing emotions, not solving them immediately.",
        ],
    },
    {
        title: "🆘 When to Seek Human Support",
        items: [
            "If distress feels overwhelming or unsafe.",
            "When thoughts of self-harm appear.",
            "If emotional patterns feel stuck or repetitive.",
            "When you want deeper discussion with a therapist.",
        ],
    },
    {
        title: "🧠 Emotional Awareness",
        items: [
            "Name emotions precisely (e.g. frustrated vs overwhelmed).",
            "Notice physical sensations connected to emotions.",
            "Allow emotions without trying to fix them immediately.",
            "Track emotional changes across days or weeks.",
        ],
    },
    {
        title: "⚡ Stress & Overwhelm",
        items: [
            "Break large tasks into smaller steps.",
            "Schedule short recovery breaks.",
            "Reduce cognitive load by writing things down.",
            "Ask for support when stress persists.",
        ],
    },
    {
        title: "🌿 Anxiety & Grounding",
        items: [
            "Use box breathing (4–4–4–4).",
            "Try the 5–4–3–2–1 grounding technique.",
            "Progressively tense and relax muscles.",
            "Anchor attention using a physical object.",
        ],
    },
    {
        title: "🧱 Boundaries & Expectations",
        items: [
            "Recognize what drains vs energizes you.",
            "Communicate boundaries clearly and calmly.",
            "Protect rest time without guilt.",
            "Boundaries support long-term mental health.",
        ],
    },
    {
        title: "🔥 Motivation & Burnout",
        items: [
            "Watch for exhaustion lasting more than two weeks.",
            "Lower expectations on low-energy days.",
            "Focus on progress, not productivity.",
            "Rest is a requirement, not a reward.",
        ],
    },
    {
        title: "💜 Self-Compassion",
        items: [
            "Speak to yourself like a close friend.",
            "Replace self-criticism with curiosity.",
            "Acknowledge effort, not just outcomes.",
            "Growth comes from kindness, not pressure.",
        ],
    },
    {
        title: "🌅 Balance & Recovery",
        items: [
            "Create simple morning and evening routines.",
            "Prioritize sleep, hydration, and movement.",
            "Schedule one restorative activity daily.",
        ],
    },
];

/* ------------------------------------------------------------------ */
/* Animated Tag                                                        */
/* ------------------------------------------------------------------ */

const AnimatedTag: React.FC<AnimatedTagProps> = ({ label }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
        Animated.parallel([
            Animated.timing(scale, { toValue: 0.95, duration: 120, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.85, duration: 120, useNativeDriver: true }),
        ]).start();
    };

    const pressOut = () => {
        Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
    };

    return (
        <Pressable onPressIn={pressIn} onPressOut={pressOut}>
            <Animated.View style={[styles.tag, { transform: [{ scale }], opacity }]}>
                <Text style={styles.tagText}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
};

/* ------------------------------------------------------------------ */
/* Tip Accordion                                                       */
/* ------------------------------------------------------------------ */

const TipSection = ({ title, items }: { title: string; items: string[] }) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.tipSection}>
            <Pressable onPress={() => setOpen(!open)} style={styles.tipHeader}>
                <Text style={styles.tipHeaderText}>{title}</Text>
                <Text style={styles.tipChevron}>{open ? "−" : "+"}</Text>
            </Pressable>

            {open && (
                <View style={styles.tipContent}>
                    {items.map((tip, i) => (
                        <Text key={i} style={styles.tipItem}>
                            • {tip}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                             */
/* ------------------------------------------------------------------ */

export default function Insights() {
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const q = query(collection(db, "journals"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                const fetched: JournalEntry[] = snapshot.docs.map(doc => {
                    const d = doc.data();
                    return {
                        id: doc.id,
                        date: d.createdAt?.toDate().toISOString().split("T")[0] || "",
                        moodScore: d.moodScore,
                        tags: Array.isArray(d.tags) ? d.tags : [d.tags],
                        text: d.text || "",
                        shared: d.shared || false,
                    };
                });

                setJournals(fetched);
            } catch (err) {
                console.error("Fetch journals error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJournals();
    }, []);

    if (loading) return <Text style={{ padding: 16 }}>Loading...</Text>;

    /* ---------------- Mood Chart ---------------- */

    const moodByDate: Record<string, { total: number; count: number }> = {};
    journals.forEach(j => {
        if (!j.moodScore) return;
        if (!moodByDate[j.date]) moodByDate[j.date] = { total: 0, count: 0 };
        moodByDate[j.date].total += j.moodScore;
        moodByDate[j.date].count += 1;
    });

    const moodData = Object.entries(moodByDate)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, { total, count }]) => ({
            label: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            entries: total / count,
        }))
        .slice(-30);

    /* ---------------- Stats ---------------- */

    const tagCount = journals
        .flatMap(j => j.tags)
        .reduce<Record<string, number>>((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

    const today = new Date();
    const last7DaysCount = journals.filter(j => {
        const entryDate = new Date(j.date);
        const diffDays = (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
    }).length;

    const sharedCount = journals.filter(j => j.shared).length;

    return (
        <ScrollView
            style={{ backgroundColor: COLORS.bg }}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.header}>Your Insights 📊</Text>
            <Text style={styles.subHeader}>
                Patterns, progress, and gentle guidance based on your journaling
            </Text>

            <CoachCard />

            <View style={styles.stats}>
                <StatCard icon="journal-outline" value={journals.length} label="Total Entries" />
                <StatCard icon="calendar-outline" value={last7DaysCount} label="Last 7 Days" />
                <StatCard icon="share-social-outline" value={sharedCount} label="Shared" />
            </View>

            <MoodChart data={moodData} />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>How your mood score works 🙂</Text>

                <Text style={styles.moodExplain}>
                    Each journal entry is gently analyzed to understand the emotional tone of
                    what you wrote. Scores range from 1 (very low) to 5 (very positive).
                    This isn’t about judging your feelings — it’s about noticing patterns over time.
                </Text>

                <View style={styles.moodScale}>
                    <Text style={styles.moodItem}>😞 <Text style={styles.bold}>1</Text> — Very low / overwhelmed</Text>
                    <Text style={styles.moodItem}>😕 <Text style={styles.bold}>2</Text> — Low / struggling</Text>
                    <Text style={styles.moodItem}>😐 <Text style={styles.bold}>3</Text> — Neutral / mixed</Text>
                    <Text style={styles.moodItem}>🙂 <Text style={styles.bold}>4</Text> — Positive / coping well</Text>
                    <Text style={styles.moodItem}>😊 <Text style={styles.bold}>5</Text> — Very positive / thriving</Text>
                </View>

                <Text style={styles.moodNote}>
                    Focus on trends, not individual numbers. Emotional ups and downs are normal.
                </Text>
            </View>


            <View style={styles.card}>
                <Text style={styles.cardTitle}>What you’ve been processing 🧠</Text>
                <View style={styles.tagsWrap}>
                    {Object.entries(tagCount).map(([tag, count]) => (
                        <AnimatedTag key={tag} label={`${tag} ×${count}`} />
                    ))}
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Joe’s Guidance 💜</Text>
                <Text style={styles.cardSub}>
                    Tap a section to expand — take what resonates, leave the rest.
                </Text>

                {STATIC_TIPS.map(section => (
                    <TipSection
                        key={section.title}
                        title={section.title}
                        items={section.items}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
    container: { padding: 16 },

    header: { fontSize: 22, fontWeight: "700" },
    subHeader: {
        color: COLORS.textMuted,
        marginBottom: 16,
    },

    stats: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },

    cardTitle: {
        fontWeight: "700",
        marginBottom: 6,
    },

    cardSub: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 12,
    },

    tagsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    tag: {
        backgroundColor: COLORS.primarySoft,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    tagText: {
        fontSize: 12,
        fontWeight: "500",
        color: COLORS.primary,
    },

    /* ---------- Tips Accordion ---------- */

    tipSection: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 10,
        overflow: "hidden",
    },

    tipHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: COLORS.primarySoft,
    },

    tipHeaderText: {
        fontWeight: "600",
        color: COLORS.primary,
        fontSize: 13,
    },

    tipChevron: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.primary,
    },

    tipContent: {
        padding: 12,
        backgroundColor: COLORS.card,
    },

    tipItem: {
        fontSize: 13,
        marginBottom: 6,
        color: COLORS.text,
    },

    moodExplain: {
        fontSize: 13,
        color: COLORS.text,
        marginBottom: 10,
        lineHeight: 18,
    },

    moodScale: {
        marginBottom: 8,
    },

    moodItem: {
        fontSize: 13,
        marginBottom: 4,
        color: COLORS.text,
    },

    bold: {
        fontWeight: "700",
    },

    moodNote: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 6,
    },

});

