import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ArrowLeft } from 'lucide-react-native';
import { mockJournalEntries } from '@/data/mockData';

// Define Mood type
type Mood = 'great' | 'good' | 'okay' | 'low' | 'difficult';

interface Patient {
    id: string;
    name: string;
    startDate: Date;
    nextSession?: Date;
    recentMoodTrend?: 'improving' | 'declining' | 'stable';
}

interface JournalEntry {
    id: string;
    patientId: string;
    date: Date;
    content: string;
    mood: Mood;
    sharedWithTherapist: boolean;
    aiSummary?: string | null;
    aiTopics?: string[];
}

interface PatientDetailViewProps {
    patient: Patient;
    onBack: () => void;
}

// Mood icons and values
const moodIcons: Record<Mood, string> = {
    great: '✨',
    good: '😊',
    okay: '😐',
    low: '😔',
    difficult: '🌧️',
};

const moodValues: Record<Mood, number> = {
    great: 5,
    good: 4,
    okay: 3,
    low: 2,
    difficult: 1,
};

export default function PatientDetailView({ patient, onBack }: PatientDetailViewProps) {
    const entries: JournalEntry[] = mockJournalEntries
        .filter((e) => e.patientId === patient.id && e.sharedWithTherapist)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    const chartData = entries
        .slice(0, 14)
        .reverse()
        .map((entry) => ({
            date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mood: moodValues[entry.mood],
        }));

    const allTopics = entries.flatMap((e) => e.aiTopics || []);
    const topicCounts: Record<string, number> = {};
    allTopics.forEach((topic) => (topicCounts[topic] = (topicCounts[topic] || 0) + 1));
    const commonTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} />
                </Pressable>
                <View>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientSince}>Patient since {formatDate(patient.startDate)}</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Mood Chart */}
                {chartData.length > 0 && (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Mood Trend</Text>
                        <LineChart
                            data={{
                                labels: chartData.map((d) => d.date),
                                datasets: [{ data: chartData.map((d) => d.mood) }],
                            }}
                            width={Dimensions.get('window').width - 32}
                            height={220}
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: '#fff',
                                backgroundGradientFrom: '#f3f0ff',
                                backgroundGradientTo: '#e0d7ff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                            }}
                            style={styles.chartStyle}
                        />
                    </View>
                )}

                {/* Common Topics */}
                {commonTopics.length > 0 && (
                    <View style={styles.topicsContainer}>
                        <Text style={styles.sectionTitle}>Recurring Themes</Text>
                        <View style={styles.topicsRow}>
                            {commonTopics.map(([topic, count]) => (
                                <View key={topic} style={styles.topicBadge}>
                                    <Text style={styles.topicText}>
                                        {topic} ×{count}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Recent Entries */}
                <View style={styles.entriesContainer}>
                    <Text style={styles.sectionTitle}>Recent Journal Entries</Text>
                    {entries.map((entry) => (
                        <View key={entry.id} style={styles.entryBox}>
                            <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                            <Text style={styles.entryMood}>
                                Mood: {moodIcons[entry.mood]} ({entry.mood})
                            </Text>
                            <Text style={styles.entryContent}>{entry.content}</Text>

                            {entry.aiSummary && (
                                <View style={styles.aiSummaryBox}>
                                    <Text style={styles.aiSummaryTitle}>AI Summary</Text>
                                    <Text style={styles.aiSummaryText}>{entry.aiSummary}</Text>
                                    {entry.aiTopics && entry.aiTopics.length > 0 && (
                                        <View style={styles.aiTopicsRow}>
                                            {entry.aiTopics.map((topic) => (
                                                <View key={topic} style={styles.aiTopicBadge}>
                                                    <Text style={styles.aiTopicText}>{topic}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
    backButton: { marginRight: 12 },
    patientName: { fontSize: 18, fontWeight: '600' },
    patientSince: { fontSize: 12, color: '#6b7280' },
    content: { padding: 16 },
    chartContainer: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e5e7eb' },
    chartTitle: { fontSize: 14, marginBottom: 8 },
    chartStyle: { borderRadius: 12 },
    topicsContainer: { marginBottom: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    topicsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    topicBadge: { backgroundColor: '#ede9fe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    topicText: { fontSize: 12, color: '#6b21a8' },
    entriesContainer: { marginBottom: 16 },
    entryBox: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 8 },
    entryDate: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
    entryMood: { fontSize: 12, marginBottom: 4 },
    entryContent: { fontSize: 14, color: '#111827' },
    aiSummaryBox: { marginTop: 8, padding: 8, backgroundColor: '#ede9fe', borderRadius: 8 },
    aiSummaryTitle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    aiSummaryText: { fontSize: 12 },
    aiTopicsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
    aiTopicBadge: { backgroundColor: '#ddd6fe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    aiTopicText: { fontSize: 10, color: '#6b21a8' },
});
