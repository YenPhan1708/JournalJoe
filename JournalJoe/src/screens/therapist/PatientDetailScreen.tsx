import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MoodChart from "../../components/MoodChart";

export default function PatientDetailScreen() {
    const navigation = useNavigation();

    // Mock patient data
    const patient = {
        name: "Emma Wilson",
        since: "Sep 15, 2025",
        nextSession: "Dec 12, 2025",
        moodScore: [
            { label: "Dec 5", entries: 3 },
            { label: "Dec 7", entries: 4 },
            { label: "Dec 8", entries: 4 },
            { label: "Dec 9", entries: 3 },
            { label: "Dec 10", entries: 4 },
        ],
        themes: ["anxiety", "work stress", "coping strategies"],
        journalEntries: [
            {
                date: "Dec 9, 2025 at 8:30 AM",
                mood: "😐",
                text: "Felt anxious about presentation. Used breathing exercises. ✨",
                aiSummary: "Patient engaged well and tried coping strategies. 💡",
                tags: ["anxiety", "coping strategies"],
            },
            {
                date: "Dec 8, 2025 at 7:45 PM",
                mood: "😞",
                text: "Worked on project, felt stressed. 💜",
                aiSummary: "Mood slightly declining, needs attention to work stress. ✨",
                tags: ["work stress"],
            },
        ],
        sessions: [
            {
                date: "Dec 12, 2025",
                duration: "50 min",
                notes: "Discussed coping strategies for work stress.",
            },
            {
                date: "Dec 5, 2025",
                duration: "45 min",
                notes: "Reviewed previous exercises, mood stable.",
            },
        ],
    };

    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backText}>← Back to Patients</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.title}>{patient.name}</Text>
            <Text style={styles.subtitle}>Patient since {patient.since}</Text>

            {/* Summary Tiles */}
            <View style={styles.summaryRow}>
                <View style={styles.tile}>
                    <Text style={styles.tileValue}>—</Text>
                </View>
                <View style={styles.tile}>
                    <Text style={styles.tileValue}>{patient.journalEntries.length}</Text>
                    <Text style={styles.tileLabel}>Entries</Text>
                </View>
                <View style={styles.tile}>
                    <Text style={styles.tileValue}>{patient.sessions.length}</Text>
                    <Text style={styles.tileLabel}>Sessions</Text>
                </View>
            </View>

            {/* Next Session */}
            <View style={styles.nextSessionCard}>
                <Text style={styles.nextSessionLabel}>Next Session</Text>
                <Text style={styles.nextSessionDate}>{patient.nextSession}</Text>
            </View>

            {/* Joe's AI Insights */}
            <View style={styles.aiCard}>
                <Text style={styles.aiHeader}>✨ Joe&apos;s AI Insights (Supportive Only)</Text>
                <View style={styles.aiContent}>
                    <Text>💜 Engagement: Active participation</Text>
                    <Text>🔍 Themes: {patient.themes.join(", ")}</Text>
                    <Text>〰️ Mood: Recent trend stable</Text>
                </View>
                <View style={styles.warningBox}>
                    <Text style={{ fontWeight: "700" }}>Professional Reminder:</Text>
                    <Text>
                        Journal Joe is a supportive tool, not a replacement for professional therapy.
                    </Text>
                </View>
            </View>

            {/* Mood Trend Chart */}
            <MoodChart data={patient.moodScore} />

            {/* Recurring Themes */}
            <Text style={styles.sectionHeader}>Recurring Themes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {patient.themes.map((t) => (
                    <View key={t} style={styles.tag}>
                        <Text style={styles.tagText}>{`${t} x2`}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Recent Journal Entries */}
            <Text style={styles.sectionHeader}>Recent Journal Entries</Text>
            {patient.journalEntries.map((entry, i) => (
                <View key={i} style={styles.entryCard}>
                    <Text style={styles.entryHeader}>{`${entry.mood} ${entry.date}`}</Text>
                    <Text style={styles.entryText}>{entry.text}</Text>
                    <View style={styles.aiSummaryCard}>
                        <Text style={styles.aiSummaryHeader}>AI Summary</Text>
                        <Text style={styles.aiSummaryText}>{entry.aiSummary}</Text>
                    </View>
                    <View style={styles.tagRow}>
                        {entry.tags.map((tag) => (
                            <View key={tag} style={styles.entryTag}>
                                <Text style={styles.entryTagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            {/* Session History */}
            <Text style={styles.sectionHeader}>Session History</Text>
            {patient.sessions.map((session, i) => (
                <View key={i} style={styles.sessionCard}>
                    <Text style={styles.sessionDate}>{session.date}</Text>
                    <Text style={styles.sessionDuration}>{session.duration}</Text>
                    <View style={styles.sessionNotes}>
                        <Text>📄 Your Notes</Text>
                        <Text>{session.notes}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#FFFFFF" },
    backBtn: { marginBottom: 12 },
    backText: { color: "#111827", fontWeight: "600" },
    title: { fontSize: 24, fontWeight: "700" },
    subtitle: { color: "#6B7280", marginBottom: 16 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    tile: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    tileValue: { fontSize: 20, fontWeight: "700" },
    tileLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
    nextSessionCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#8A4EAF",
        padding: 14,
        marginBottom: 16,
    },
    nextSessionLabel: { fontWeight: "700", color: "#111827", marginBottom: 4 },
    nextSessionDate: { fontWeight: "700", fontSize: 16, color: "#111827" },
    aiCard: {
        backgroundColor: "#EEF2FF",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#8A4EAF",
        marginBottom: 16,
    },
    aiHeader: { fontWeight: "700", color: "#8A4EAF", marginBottom: 8 },
    aiContent: { marginBottom: 8 },
    warningBox: {
        backgroundColor: "#FEF3C7",
        borderWidth: 1,
        borderColor: "#F59E0B",
        borderRadius: 10,
        padding: 8,
    },
    sectionHeader: { fontWeight: "700", fontSize: 16, marginBottom: 8, marginTop: 12 },
    tag: { backgroundColor: "#EDE9FE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
    tagText: { color: "#5B21B6", fontWeight: "600" },
    entryCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#F3F4F6" },
    entryHeader: { fontSize: 12, color: "#111827", marginBottom: 4 },
    entryText: { fontSize: 14, color: "#111827", marginBottom: 6 },
    aiSummaryCard: { backgroundColor: "#EEF2FF", borderRadius: 12, padding: 8, marginBottom: 6, borderWidth: 1, borderColor: "#8A4EAF" },
    aiSummaryHeader: { fontWeight: "700", color: "#8A4EAF", marginBottom: 4 },
    aiSummaryText: { color: "#8A4EAF" },
    tagRow: { flexDirection: "row", flexWrap: "wrap" },
    entryTag: { backgroundColor: "#EDE9FE", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginRight: 6, marginBottom: 4 },
    entryTagText: { color: "#5B21B6", fontWeight: "600", fontSize: 12 },
    sessionCard: { backgroundColor: "#DBEAFE", borderRadius: 12, padding: 12, marginBottom: 12 },
    sessionDate: { fontWeight: "700", color: "#111827" },
    sessionDuration: { color: "#6B7280", marginBottom: 6 },
    sessionNotes: { backgroundColor: "#BFDBFE", borderRadius: 8, padding: 8 },
});
