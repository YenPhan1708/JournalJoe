import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// 👉 Update this type if your stack param list is elsewhere
type RootStackParamList = {
    Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const mockNotes = [
    {
        id: "1",
        date: "Dec 9",
        time: "8:30 AM",
        text:
            "Today I woke up feeling anxious about the presentation at work. My chest felt tight and I couldn't focus...",
    },
    {
        id: "2",
        date: "Dec 8",
        time: "8:15 PM",
        text:
            "Had a good day overall. Managed to complete my tasks without procrastinating too much...",
    },
    {
        id: "3",
        date: "Dec 7",
        time: "10:00 AM",
        text:
            "Feeling a bit low today. Not sure why. Everything feels harder than it should be...",
    },
];

export default function Journal() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.screen}>

            {/* Title */}
            <View style={styles.titleSection}>
                <Text style={styles.title}>
                    My Journal <Text style={styles.sparkle}>✨</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Write freely, Joe is here to support you. You choose what to share with
                    your therapist.
                </Text>
            </View>

            {/* New Entry Button */}
            <TouchableOpacity style={styles.newEntryButton}>
                <Text style={styles.newEntryText}>＋ New Journal Entry</Text>
            </TouchableOpacity>

            {/* Journal Entries */}
            <FlatList
                data={mockNotes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardDate}>
                            {item.date}{" "}
                            <Text style={styles.cardTime}>{item.time}</Text>
                        </Text>
                        <Text style={styles.cardText} numberOfLines={3}>
                            {item.text}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    greeting: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },

    subGreeting: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    titleSection: {
        marginBottom: 16,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },

    sparkle: {
        color: "#8B5CF6",
    },

    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 6,
        lineHeight: 20,
    },

    newEntryButton: {
        backgroundColor: "#7C3AED",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 20,
    },

    newEntryText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
    },

    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    cardDate: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
    },

    cardTime: {
        fontWeight: "400",
        color: "#6B7280",
    },

    cardText: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
});
