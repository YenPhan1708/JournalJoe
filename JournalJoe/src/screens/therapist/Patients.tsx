import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";

const mockPatients = [
    { id: "p1", name: "Emma Wilson", lastSession: "2025-05-10" },
    { id: "p2", name: "Liam Brown", lastSession: "2025-05-05" },
    { id: "p3", name: "Olivia Smith", lastSession: "2025-04-28" },
];

export default function Patients() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Patients</Text>

                <FlatList
                    data={mockPatients}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>Last session: {item.lastSession}</Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    scrollEnabled={false}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#F9FAFB" },
    container: { flex: 1 },
    title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
    card: { backgroundColor: "white", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#F3F4F6" },
    cardTitle: { fontWeight: "700", marginBottom: 6 },
    cardText: { color: "#6B7280" },
});
