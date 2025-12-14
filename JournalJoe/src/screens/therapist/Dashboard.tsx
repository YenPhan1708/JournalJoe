import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Dashboard() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Dashboard</Text>

                <View style={styles.row}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>8</Text>
                        <Text style={styles.metricLabel}>Active Patients</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>2</Text>
                        <Text style={styles.metricLabel}>Appointments (this week)</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recent activity</Text>
                    <Text style={styles.cardText}>No recent events in demo data.</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#F9FAFB" },
    container: { flex: 1 },
    title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
    row: { flexDirection: "row", gap: 12, marginBottom: 12 },
    metricCard: { flex: 1, backgroundColor: "white", padding: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" },
    metricValue: { fontSize: 22, fontWeight: "700", color: "#111827" },
    metricLabel: { color: "#6B7280", marginTop: 6, textAlign: "center" },
    card: { backgroundColor: "white", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#F3F4F6" },
    cardTitle: { fontWeight: "700", marginBottom: 8 },
    cardText: { color: "#374151" },
});
