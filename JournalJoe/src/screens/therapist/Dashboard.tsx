import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../services/firebase";

/* =======================
   TYPES
======================= */

interface Journal {
    id: string;
    userId: string;
    userName?: string;
    text: string;
    tags: string;
    shared: boolean;
    createdAt: Timestamp;
}

interface Session {
    id: string;
    date: Timestamp;
    duration: number;
    patientId: string;
    therapistId: string;
    status: string;
    type: string;
}

/* =======================
   DATE HELPERS (LOCAL)
======================= */

const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const getCurrentWeekRange = () => {
    const today = startOfDay(new Date());

    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { start: monday, end: sunday };
};

const formatName = (name?: string) =>
    name ? name.toUpperCase() : "UNKNOWN PATIENT";

const sessionIcon = (type: string) => {
    if (type === "video") return "📹";
    if (type === "in-person") return "🪑";
    return "🗓️";
};

/* =======================
   COMPONENT
======================= */

export default function Dashboard() {
    const user = getAuth().currentUser;

    const [activePatients, setActivePatients] = useState(0);
    const [sessionsThisWeek, setSessionsThisWeek] = useState(0);
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [journals, setJournals] = useState<Journal[]>([]);

    useEffect(() => {
        if (!user) return;

        /* =======================
           SHARED JOURNALS
        ======================= */

        const journalQ = query(
            collection(db, "journals"),
            where("shared", "==", true),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubJournals = onSnapshot(journalQ, snap => {
            const list: Journal[] = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Journal, "id">),
            }));

            setJournals(list);
            setActivePatients(new Set(list.map(j => j.userId)).size);
        });

        /* =======================
           ACCEPTED SESSIONS ONLY
        ======================= */

        const sessionQ = query(
            collection(db, "sessions"),
            where("therapistId", "==", user.uid),
            where("status", "==", "accepted"),
            orderBy("date", "asc")
        );

        const { start, end } = getCurrentWeekRange();
        const today = startOfDay(new Date());

        const unsubSessions = onSnapshot(sessionQ, snap => {
            const sessions: Session[] = snap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<Session, "id">),
            }));

            /* ---------- UPCOMING (TODAY → FUTURE) ---------- */
            setUpcomingSessions(
                sessions.filter(s => s.date.toDate() >= today)
            );

            /* ---------- THIS WEEK (MON → SUN ONLY) ---------- */
            const countThisWeek = sessions.filter(s => {
                const d = s.date.toDate();
                return d >= start && d <= end;
            }).length;

            setSessionsThisWeek(countThisWeek);
        });

        return () => {
            unsubJournals();
            unsubSessions();
        };
    }, [user]);

    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Weekly overview</Text>

            {/* METRICS */}
            <View style={styles.row}>
                <Metric
                    icon="👥"
                    label="Active Patients"
                    value={activePatients}
                    color="#7C3AED"
                />
                <Metric
                    icon="🗓️"
                    label="Sessions This Week"
                    value={sessionsThisWeek}
                    color="#059669"
                />
            </View>

            {/* UPCOMING SESSIONS */}
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            {upcomingSessions.length === 0 && (
                <Text style={{ color: "#6B7280" }}>
                    No upcoming sessions
                </Text>
            )}

            {upcomingSessions.map(s => (
                <View key={s.id} style={styles.sessionCard}>
                    <Text style={styles.sessionTitle}>
                        {sessionIcon(s.type)} {s.type.toUpperCase()}
                    </Text>
                    <Text style={styles.sessionDate}>
                        {s.date.toDate().toLocaleString()}
                    </Text>
                    <Text style={styles.sessionMeta}>
                        Duration: {s.duration} min
                    </Text>
                </View>
            ))}

            {/* SHARED JOURNALS */}
            <Text style={styles.sectionTitle}>Shared Journal Entries</Text>
            {journals.map(j => (
                <View key={j.id} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                        <Text style={styles.entryName}>
                            {formatName(j.userName)}
                        </Text>
                        <Text style={styles.entryDate}>
                            {j.createdAt.toDate().toLocaleDateString()}
                        </Text>
                    </View>

                    <Text style={styles.entryContent}>{j.text}</Text>

                    <View style={styles.tags}>
                        {j.tags
                            ?.split(",")
                            .map(t => t.trim())
                            .filter(Boolean)
                            .map(tag => (
                                <Text key={tag} style={styles.tag}>
                                    {tag}
                                </Text>
                            ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

/* =======================
   METRIC
======================= */

const Metric = ({
                    icon,
                    label,
                    value,
                    color,
                }: {
    icon: string;
    label: string;
    value: number;
    color: string;
}) => (
    <View style={[styles.metricCard, { borderColor: color }]}>
        <Text style={styles.metricIcon}>{icon}</Text>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </View>
);

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#FFFFFF" },
    title: { fontSize: 22, fontWeight: "700", color: "#111827" },
    subtitle: { color: "#6B7280", marginBottom: 16 },

    row: { flexDirection: "row", gap: 12, marginBottom: 20 },

    metricCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: "#F9FAFB",
        alignItems: "center",
    },
    metricIcon: { fontSize: 22, marginBottom: 4 },
    metricValue: { fontSize: 26, fontWeight: "700" },
    metricLabel: { fontSize: 13, color: "#6B7280" },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 24,
        marginBottom: 10,
    },

    sessionCard: {
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#EEF2FF",
        marginBottom: 10,
    },
    sessionTitle: { fontWeight: "700", color: "#3730A3" },
    sessionDate: { color: "#1F2937", marginTop: 2 },
    sessionMeta: { color: "#4B5563", marginTop: 2 },

    entryCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
    },
    entryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    entryName: { fontWeight: "700", color: "#111827" },
    entryDate: { fontSize: 12, color: "#9CA3AF" },
    entryContent: { marginBottom: 8, color: "#374151" },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: {
        backgroundColor: "#E0E7FF",
        color: "#3730A3",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 11,
    },
});
