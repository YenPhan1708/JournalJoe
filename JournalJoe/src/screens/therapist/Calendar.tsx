import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function startOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export default function Calendar() {
    const [currentWeek, setCurrentWeek] = useState<Date>(
        startOfWeek(new Date("2025-12-22"))
    );

    const weekDays = Array.from({ length: 7 }).map((_, i) =>
        addDays(currentWeek, i)
    );

    const monthLabel = currentWeek.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const weekLabel = `Week of ${currentWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })}`;

    return (
        <ScrollView
            style={{ backgroundColor: "#F9FAFB" }}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <Text style={styles.title}>Calendar</Text>
            <Text style={styles.subtitle}>Your session schedule</Text>

            {/* Week Selector */}
            <View style={styles.weekCard}>
                <View style={styles.weekHeader}>
                    <Pressable
                        onPress={() =>
                            setCurrentWeek(addDays(currentWeek, -7))
                        }
                        style={styles.arrowBtn}
                    >
                        <Ionicons name="chevron-back" size={22} />
                    </Pressable>

                    <View style={styles.weekCenter}>
                        <Text style={styles.monthText}>{monthLabel}</Text>
                        <Text style={styles.weekText}>{weekLabel}</Text>
                    </View>

                    <Pressable
                        onPress={() =>
                            setCurrentWeek(addDays(currentWeek, 7))
                        }
                        style={styles.arrowBtn}
                    >
                        <Ionicons name="chevron-forward" size={22} />
                    </Pressable>
                </View>

                <Pressable
                    style={styles.todayBtn}
                    onPress={() =>
                        setCurrentWeek(startOfWeek(new Date()))
                    }
                >
                    <Text style={styles.todayText}>Today</Text>
                </Pressable>
            </View>

            {/* Days List */}
            {weekDays.map(date => {
                const dayName = DAYS[date.getDay()];
                const dateLabel = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });

                return (
                    <View key={date.toISOString()} style={styles.dayCard}>
                        <Text style={styles.dayName}>{dayName}</Text>
                        <Text style={styles.dayDate}>{dateLabel}</Text>
                        <Text style={styles.dayStatus}>
                            No sessions scheduled
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    scroll: {
        padding: 16,
        paddingBottom: 24,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        color: "#6B7280",
        marginBottom: 16,
    },

    weekCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 16,
    },

    weekHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    arrowBtn: {
        padding: 6,
    },

    weekCenter: {
        alignItems: "center",
    },

    monthText: {
        fontWeight: "700",
        fontSize: 16,
    },

    weekText: {
        color: "#6B7280",
        fontSize: 13,
        marginTop: 2,
    },

    todayBtn: {
        backgroundColor: "#7C3AED",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
    },

    todayText: {
        color: "white",
        fontWeight: "600",
    },

    dayCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 12,
    },

    dayName: {
        fontWeight: "700",
        fontSize: 16,
    },

    dayDate: {
        color: "#6B7280",
        marginBottom: 8,
    },

    dayStatus: {
        color: "#9CA3AF",
    },
});
