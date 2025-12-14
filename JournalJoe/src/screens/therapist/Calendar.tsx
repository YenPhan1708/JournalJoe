import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Calendar() {
    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Calendar</Text>

                <View style={styles.card}>
                    <Text style={styles.cardText}>No scheduled appointments in demo data.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Availability</Text>
                    <Text style={styles.cardText}>Set your weekly availability in the real app.</Text>
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
    cardTitle: { fontWeight: "700", marginBottom: 6 },
    cardText: { color: "#374151" },
});
