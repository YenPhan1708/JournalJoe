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

export default function Insights() {
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [joeTipsText, setJoeTipsText] = useState<string>("");

    // Fetch journals from Firestore
    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const q = query(collection(db, "journals"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                const fetchedJournals: JournalEntry[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        date: data.createdAt?.toDate().toISOString().split("T")[0] || "",
                        moodScore: data.moodScore,
                        tags: Array.isArray(data.tags) ? data.tags : [data.tags],
                        text: data.text || "",
                        shared: data.shared || false,
                    };
                });

                setJournals(fetchedJournals);
            } catch (err) {
                console.error("Error fetching journals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJournals();
    }, []);

    // Fetch Joe Tips based on raw journal entries
    useEffect(() => {
        if (journals.length === 0) return;

        const fetchJoeTips = async () => {
            try {
                const res = await fetch("http://172.20.10.2:3000/api/joe-tips", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ journals }), // send full journal objects
                });

                const data = await res.json();
                setJoeTipsText(data.tipsText || "");
            } catch (err) {
                console.error("Failed to fetch Joe tips:", err);
                setJoeTipsText("");
            }
        };

        fetchJoeTips();
    }, [journals]);

    if (loading) return <Text style={{ padding: 16 }}>Loading...</Text>;

    // Calculate mood chart data
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
        }));

    const displayedMoodData = moodData.slice(-30);

    // Extract Joe tips
    const lines = joeTipsText.split("\n").map(l => l.trim());
    const extractTips = (sectionTitle: string) => {
        const startIndex = lines.findIndex(l => l.includes(sectionTitle));
        if (startIndex === -1) return [];

        const tips: string[] = [];
        for (let i = startIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes("For ") && line.includes(":")) break;
            if (line.startsWith("• ") && line !== "• —") tips.push(line.slice(2));
            if (tips.length === 4) break;
        }
        return tips;
    };

    const anxietyTips = extractTips("For Anxiety Moments");
    const stressTips = extractTips("For Stress Management");

    // Count tags
    const tagCount = journals
        .flatMap(j => j.tags)
        .reduce<Record<string, number>>((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

    // Correct calculation for Last 7 Days and Shared
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
            <Text style={styles.subHeader}>Here’s what I’ve noticed about your journey</Text>

            <CoachCard />

            <View style={styles.stats}>
                <StatCard icon="journal-outline" value={journals.length} label="Total Entries" />
                <StatCard icon="calendar-outline" value={last7DaysCount} label="Last 7 Days" />
                <StatCard icon="share-social-outline" value={sharedCount} label="Shared" />
            </View>

            <MoodChart data={displayedMoodData} />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>What you’ve been processing 🧠</Text>
                <View style={styles.tagsWrap}>
                    {Object.entries(tagCount).map(([tag, count]) => (
                        <AnimatedTag key={tag} label={`${tag} ×${count}`} />
                    ))}
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Joe’s Tips for You 💜</Text>
                {!joeTipsText ? (
                    <Text style={styles.tipText}>Loading tips...</Text>
                ) : (
                    <>
                        <View style={styles.tipBox}>
                            <Text style={styles.tipTitle}>🌿 For Anxiety Moments:</Text>
                            {anxietyTips.map((tip, i) => (
                                <Text key={i} style={styles.tipText}>• {tip}</Text>
                            ))}
                        </View>

                        <View style={styles.tipBox}>
                            <Text style={styles.tipTitle}>🧘 For Stress Management:</Text>
                            {stressTips.map((tip, i) => (
                                <Text key={i} style={styles.tipText}>• {tip}</Text>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    header: { fontSize: 22, fontWeight: "700" },
    subHeader: { color: COLORS.textMuted, marginBottom: 16 },
    stats: { flexDirection: "row", gap: 8, marginBottom: 16 },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    cardTitle: { fontWeight: "700", marginBottom: 10 },

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

    tipBox: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        marginBottom: 12,
    },
    tipTitle: { fontWeight: "600", marginBottom: 6 },
    tipText: { fontSize: 13, marginLeft: 4, marginBottom: 4 },
});