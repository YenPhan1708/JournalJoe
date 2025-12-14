import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Insights() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Insights</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Weekly Mood</Text>
                    <Text style={styles.cardText}>Mostly stable — continue using coping skills and short walks.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sleep Pattern</Text>
                    <Text style={styles.cardText}>Slightly irregular; aim for consistent sleep schedule (±30 minutes).</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Activity</Text>
                    <Text style={styles.cardText}>3 short walks this week — good progress. Try a gentle home stretch routine.</Text>
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
    cardText: { color: "#374151", lineHeight: 20 },
});
