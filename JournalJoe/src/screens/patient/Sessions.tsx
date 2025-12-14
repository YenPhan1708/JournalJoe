import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Sessions() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Sessions</Text>

                <View style={styles.card}>
                    <Text style={styles.cardText}>No upcoming sessions.</Text>
                    <Text style={styles.cardSub}>You can schedule a session with your therapist from the Profile page.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Past Sessions</Text>
                    <Text style={styles.cardText}>No past sessions recorded in this demo.</Text>
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
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    cardTitle: { fontWeight: "700", marginBottom: 6 },
    cardText: { color: "#374151", marginBottom: 6 },
    cardSub: { color: "#6B7280", fontSize: 13 },
});
