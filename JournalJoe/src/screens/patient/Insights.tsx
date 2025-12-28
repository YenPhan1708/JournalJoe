import React, { useEffect, useState, useRef } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
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
    shared?: boolean;
}

/* ---------------- Animated Tag ---------------- */
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

/* ---------------- Main Screen ---------------- */
export default function Insights() {
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <Text style={{ padding: 16 }}>Loading...</Text>;

    /* ------------------ Average Mood Per Day ------------------ */
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
            label: new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            entries: total / count,
        }));

    /* Limit displayed days to 30 for cleaner chart */
    const displayedMoodData = moodData.slice(-30);

    /* ------------------ Tag Count ------------------ */
    const processedTags = journals.flatMap(j => j.tags);
    const tagCount = processedTags.reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});

    return (
        <ScrollView style={{ backgroundColor: COLORS.bg }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Your Insights 📊</Text>
            <Text style={styles.subHeader}>Here’s what I’ve noticed about your journey</Text>

            <CoachCard />

            <View style={styles.stats}>
                <StatCard icon="journal-outline" value={journals.length} label="Total Entries" />
                <StatCard icon="calendar-outline" value="7" label="Last 7 Days" />
                <StatCard icon="share-social-outline" value={journals.filter(j => j.shared).length} label="Shared" />
            </View>

            {/* 📈 Mood Chart */}
            <MoodChart data={displayedMoodData} />

            {/* 🧠 Tags */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>What you’ve been processing 🧠</Text>
                <View style={styles.tagsWrap}>
                    {Object.entries(tagCount).map(([tag, count]) => (
                        <AnimatedTag key={tag} label={`${tag} ×${count}`} />
                    ))}
                </View>
            </View>

            {/* 💜 Joe’s Tips */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Joe’s Tips for You 💜</Text>

                <View style={styles.tipBox}>
                    <Ionicons name="heart-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.tipTitle}>For Anxiety Moments</Text>
                    {["Ground yourself using 5-4-3-2-1", "Slow breathing for 5 minutes", "Name what you’re feeling", "Check in with your body"].map(tip => (
                        <Text key={tip} style={styles.tipText}>• {tip}</Text>
                    ))}
                </View>

                <View style={styles.tipBox}>
                    <Ionicons name="fitness-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.tipTitle}>For Stress Management</Text>
                    {["Break tasks into steps", "Take short screen breaks", "Avoid multitasking", "Notice early stress signs"].map(tip => (
                        <Text key={tip} style={styles.tipText}>• {tip}</Text>
                    ))}
                </View>

                <View style={styles.reminderBox}>
                    <Text style={styles.reminderText}>
                        Remember: These are friendly suggestions from Joe, not medical advice.
                        Your therapist is the expert 💙
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

/* ---------------- Styles ---------------- */
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
    tipTitle: { fontWeight: "600", marginVertical: 6 },
    tipText: { fontSize: 13, marginLeft: 4 },

    reminderBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: COLORS.primarySoft,
        borderRadius: 12,
    },
    reminderText: { fontSize: 12, color: COLORS.primary },
});
