import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";

const mockNotes = [
    { id: "1", date: "2025-05-10", text: "Today I felt calmer after the walk." },
    { id: "2", date: "2025-05-09", text: "Had a stressful meeting but coped." },
    { id: "3", date: "2025-05-08", text: "Tried breathing exercises — helped a bit." },
];

export default function Journal() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Journal</Text>

                <FlatList
                    data={mockNotes}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardDate}>{item.date}</Text>
                            <Text style={styles.cardText}>{item.text}</Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    scrollEnabled={false} // FlatList inside ScrollView — disable its own scroll
                />

                <View style={styles.addHint}>
                    <Text style={styles.addHintText}>Tap the "+" (not implemented) to add a new entry.</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#F9FAFB" },
    container: { flex: 1 },
    title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
    card: {
        backgroundColor: "white",
        padding: 14,
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    cardDate: { color: "#6B7280", fontSize: 12, marginBottom: 6 },
    cardText: { color: "#111827", fontSize: 15, lineHeight: 20 },
    addHint: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: "#EFF6FF" },
    addHintText: { color: "#374151", fontSize: 13 },
});
