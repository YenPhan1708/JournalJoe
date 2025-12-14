import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Profile() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Profile</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>Emma Wilson</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>emma@example.com</Text>

                    <Text style={styles.label}>Account type</Text>
                    <Text style={styles.value}>Patient (demo)</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Security</Text>
                    <Text style={styles.cardText}>This is a demo app — no real patient data should be used.</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: "#F9FAFB" },
    container: { flex: 1 },
    title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
    card: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#F3F4F6" },
    label: { color: "#6B7280", fontSize: 13, marginTop: 8 },
    value: { fontSize: 16, color: "#111827", marginTop: 4 },
    cardTitle: { fontWeight: "700", marginBottom: 6 },
    cardText: { color: "#374151" },
});
