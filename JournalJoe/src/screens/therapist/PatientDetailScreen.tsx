import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import MoodChart from "../../components/MoodChart";

/* =======================
   TYPES
======================= */

interface Patient {
    id: string;
    name: string;
    email: string;
}

interface Session {
    id: string;
    date: Timestamp;
    duration: number;
    status: "accepted" | "rejected" | "pending";
}

interface Journal {
    id: string;
    text: string;
    createdAt: Timestamp;
    moodScore: number;
    tags: string[];
    insight?: string;
    conclusion?: string;
}

/* =======================
   HELPERS
======================= */

const moodIcon = (score: number) => {
    if (score >= 4) return "😊";
    if (score === 3) return "😐";
    return "😞";
};

const getSessionStatusStyle = (
    status: "accepted" | "rejected" | "pending"
) => ({
    fontWeight: "700" as const,
    color:
        status === "accepted"
            ? "#10B981"
            : status === "rejected"
                ? "#EF4444"
                : "#F59E0B",
});

/* =======================
   COMPONENT
======================= */

export default function PatientDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const patientId = route.params?.patientId;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [journals, setJournals] = useState<Journal[]>([]);

    /* =======================
       FETCH DATA
    ======================= */

    useEffect(() => {
        getDoc(doc(db, "users", patientId)).then(d => {
            if (d.exists()) {
                setPatient({
                    id: d.id,
                    ...(d.data() as Omit<Patient, "id">),
                });
            }
        });

        const sQ = query(
            collection(db, "sessions"),
            where("patientId", "==", patientId),
            orderBy("date", "asc")
        );

        const unsubSessions = onSnapshot(sQ, snap => {
            setSessions(
                snap.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as Omit<Session, "id">),
                }))
            );
        });

        const jQ = query(
            collection(db, "journals"),
            where("userId", "==", patientId),
            where("shared", "==", true),
            orderBy("createdAt", "asc")
        );

        const unsubJournals = onSnapshot(jQ, snap => {
            setJournals(
                snap.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        text: data.text,
                        createdAt: data.createdAt,
                        moodScore: data.moodScore,
                        tags: Array.isArray(data.tags)
                            ? data.tags
                            : [data.tags],
                        insight: undefined,
                        conclusion: undefined,
                    };
                })
            );
        });

        return () => {
            unsubSessions();
            unsubJournals();
        };
    }, [patientId]);

    /* =======================
       AI ANALYSIS
    ======================= */

    useEffect(() => {
        if (journals.length === 0) return;

        const toAnalyze = journals.filter(
            j => !j.insight || !j.conclusion
        );

        toAnalyze.forEach(async j => {
            try {
                const res = await fetch(
                    "http://172.20.10.2:3000/api/journal-analysis",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: j.text }),
                    }
                );

                const data = await res.json();

                setJournals(prev =>
                    prev.map(journal =>
                        journal.id === j.id
                            ? {
                                ...journal,
                                insight: data.insight,
                                conclusion: data.conclusion,
                            }
                            : journal
                    )
                );
            } catch (err) {
                console.error("Journal AI error:", err);
            }
        });
    }, [journals]);

    /* =======================
       DERIVED DATA
    ======================= */

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const upcomingSessions = useMemo(
        () =>
            sessions.filter(
                s =>
                    s.status === "accepted" &&
                    s.date.toDate() >= today
            ),
        [sessions, today]
    );

    const pastSessions = useMemo(
        () => sessions.filter(s => s.date.toDate() < today),
        [sessions, today]
    );

    /* =======================
       MOOD TREND (DAILY AVG)
    ======================= */

    const moodChartData = useMemo(() => {
        const grouped: Record<
            string,
            { total: number; count: number }
        > = {};

        journals.forEach(j => {
            const dateKey = j.createdAt
                .toDate()
                .toISOString()
                .split("T")[0]; // YYYY-MM-DD

            if (!grouped[dateKey]) {
                grouped[dateKey] = { total: 0, count: 0 };
            }

            grouped[dateKey].total += j.moodScore;
            grouped[dateKey].count += 1;
        });

        return Object.entries(grouped)
            .map(([date, value]) => ({
                label: new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                entries: Number(
                    (value.total / value.count).toFixed(1)
                ),
            }))
            .sort(
                (a, b) =>
                    new Date(a.label).getTime() -
                    new Date(b.label).getTime()
            );
    }, [journals]);

    if (!patient) return null;

    /* =======================
       UI
    ======================= */

    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                {patient.name.toUpperCase()}
            </Text>
            <Text style={styles.subtitle}>{patient.email}</Text>

            <Text style={styles.section}>📅 Upcoming Sessions</Text>
            {upcomingSessions.length === 0 ? (
                <Text style={styles.empty}>No upcoming sessions</Text>
            ) : (
                upcomingSessions.map(s => (
                    <View
                        key={s.id}
                        style={styles.sessionCardUpcoming}
                    >
                        <Text>
                            {s.date.toDate().toLocaleString()} •{" "}
                            {s.duration} min
                        </Text>
                        <Text
                            style={getSessionStatusStyle(s.status)}
                        >
                            {s.status.toUpperCase()}
                        </Text>
                    </View>
                ))
            )}

            {moodChartData.length < 2 ? (
                <Text style={styles.empty}>
                    Not enough data to show mood trend.
                </Text>
            ) : (
                <MoodChart data={moodChartData} />
            )}

            <Text style={styles.section}>
                📝 Recent Journal Entries
            </Text>

            {journals.map(j => (
                <View key={j.id} style={styles.entryCard}>
                    <Text style={styles.entryHeader}>
                        {moodIcon(j.moodScore)}{" "}
                        {j.createdAt.toDate().toLocaleString()}
                    </Text>

                    <Text style={styles.entryText}>{j.text}</Text>

                    <View style={styles.aiPlaceholder}>
                        <Text style={styles.aiTitle}>AI Insight</Text>

                        {j.insight ? (
                            <Text style={styles.aiText}>
                                {j.insight}
                            </Text>
                        ) : (
                            <Text style={styles.aiText}>
                                Analyzing...
                            </Text>
                        )}

                        {j.conclusion && (
                            <Text
                                style={[
                                    styles.aiText,
                                    { marginTop: 6 },
                                ]}
                            >
                                {j.conclusion}
                            </Text>
                        )}
                    </View>
                </View>
            ))}

            <Text style={styles.section}>Session History</Text>
            {pastSessions.length === 0 ? (
                <Text style={styles.empty}>No past sessions</Text>
            ) : (
                pastSessions.map(s => (
                    <View
                        key={s.id}
                        style={styles.sessionCardPast}
                    >
                        <Text>
                            {s.date
                                .toDate()
                                .toLocaleDateString()}{" "}
                            • {s.duration} min
                        </Text>
                        <Text
                            style={getSessionStatusStyle(s.status)}
                        >
                            {s.status.toUpperCase()}
                        </Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#FFFFFF" },
    back: { fontWeight: "600", marginBottom: 8 },

    title: { fontSize: 24, fontWeight: "700" },
    subtitle: { color: "#6B7280", marginBottom: 16 },

    section: {
        fontSize: 16,
        fontWeight: "700",
        marginVertical: 12,
    },
    empty: { color: "#6B7280", fontSize: 12 },

    sessionCardUpcoming: {
        backgroundColor: "#ECFEFF",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#67E8F9",
    },

    sessionCardPast: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },

    entryCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
    },
    entryHeader: { fontSize: 12, marginBottom: 6 },
    entryText: { marginBottom: 10 },

    aiPlaceholder: {
        backgroundColor: "#EEF2FF",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#C7D2FE",
    },
    aiTitle: {
        fontWeight: "700",
        color: "#4338CA",
        marginBottom: 4,
    },
    aiText: { fontSize: 12, color: "#3730A3" },
});
