import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const ACCENT = "#7C3AED";
const WARNING_BG = "#FFF7ED";
const WARNING_BORDER = "#FDBA74";

const mockDashboard = {
    activePatients: 4,
    sessionsThisWeek: 0,
    needsAttention: {
        name: "Michael Chen",
        mood: "Mood declining",
        risk: "Medium risk level",
        nextSession: "Dec 10",
    },
    upcomingSessions: [
        { patient: "Emma Wilson", date: "Dec 12", time: "2:00 PM" },
        { patient: "Michael Chen", date: "Dec 10", time: "11:00 AM" },
    ],
};

const mockJournalEntries = [
    {
        patient: "Emma Wilson",
        date: "Dec 9",
        content:
            "Hey, I noticed you were feeling anxious this morning about your presentation. Great job using those breathing exercises! ✨ You're learning to manage those tough moments!",
        tags: ["anxiety", "work stress", "coping strategies"],
    },
    {
        patient: "Michael Chen",
        date: "Dec 9",
        content:
            "ADHD days can be so frustrating. 💜 You still took action by making a to-do list — that counts.",
        tags: ["ADHD", "executive function", "overwhelm"],
    },
];

export default function Dashboard() {
    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            {/* TITLE */}
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Overview of your patients</Text>

            {/* METRICS */}
            <View style={styles.row}>
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {mockDashboard.activePatients}
                    </Text>
                    <Text style={styles.metricLabel}>Active Patients</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>
                        {mockDashboard.sessionsThisWeek}
                    </Text>
                    <Text style={styles.metricLabel}>Sessions This Week</Text>
                </View>
            </View>

            {/* NEEDS ATTENTION */}

            <View style={styles.alertCard}>
                <View style={styles.alertHeaderRow}>
                    <Text style={styles.alertTriangle}>❗</Text>
                    <Text style={styles.alertHeader}>Needs Attention</Text>
                </View>

                <View style={styles.alertContent}>
                    <Text style={styles.alertName}>{mockDashboard.needsAttention.name}</Text>
                    <Text style={styles.alertText}>
                        {mockDashboard.needsAttention.mood} · {mockDashboard.needsAttention.risk}
                    </Text>
                    <Text style={styles.alertText}>
                        Next session: {mockDashboard.needsAttention.nextSession}
                    </Text>
                </View>
            </View>


            {/* UPCOMING SESSIONS */}
            <Text style={styles.sectionTitle}>📅 Upcoming Sessions</Text>
            {mockDashboard.upcomingSessions.map((session, idx) => (
                <View key={idx} style={styles.sessionCard}>
                    <Text style={styles.sessionPatient}>{session.patient}</Text>
                    <Text style={styles.sessionTime}>
                        {session.date} • {session.time}
                    </Text>
                </View>
            ))}

            {/* RECENT JOURNALS */}
            <Text style={styles.sectionTitle}>📄 Recent Journal Entries</Text>
            {mockJournalEntries.map((entry, idx) => (
                <View key={idx} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                        <Text style={styles.entryName}>{entry.patient}</Text>
                        <Text style={styles.entryDate}>{entry.date}</Text>
                    </View>

                    <Text style={styles.entryContent}>{entry.content}</Text>

                    <View style={styles.tags}>
                        {entry.tags.map((tag) => (
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

const styles = StyleSheet.create({
    scroll: {
        padding: 16,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    metricCard: {
        flex: 1,
        backgroundColor: "white",
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },
    metricValue: { fontSize: 24, fontWeight: "700", color: "#111827" },
    metricLabel: { marginTop: 4, color: "#374151" },

    alertCard: {
        backgroundColor: "#FFF7ED", // light orange background
        borderColor: "#F97316", // deep orange border
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
    },
    alertHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    alertTriangle: { fontSize: 18, color: "#DC2626", marginRight: 6 },
    alertHeader: { fontWeight: "700", color: "#DC2626", fontSize: 16 },
    alertContent: { marginLeft: 0 },
    alertName: { fontWeight: "700", color: "#111827", fontSize: 15 },
    alertText: { color: "#6B7280", fontSize: 13, marginTop: 2 },

    sectionTitle: { fontWeight: "700", marginBottom: 8, color: "#111827", marginTop: 16 },

    sessionCard: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 8,
    },
    sessionPatient: { fontWeight: "700", color: "#111827" },
    sessionTime: { color: "#6B7280", fontSize: 13, marginTop: 2 },

    entryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    entryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    entryName: { fontWeight: "700", color: "#111827" },
    entryDate: { fontSize: 12, color: "#9CA3AF" },
    entryContent: { color: "#374151", fontSize: 14, marginBottom: 8 },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 11,
        color: "#374151",
    },
});
