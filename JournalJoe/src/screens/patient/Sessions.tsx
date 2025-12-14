import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PURPLE = "#8A4EAF";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const BORDER = "#E5E7EB";

export default function Sessions() {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >


                {/* Page Title */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Sessions</Text>
                    <Text style={styles.pageSubtitle}>
                        Your therapy appointments
                    </Text>
                </View>

                {/* Section Label */}
                <Text style={styles.sectionLabel}>PAST SESSIONS</Text>

                {/* Session Card */}
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Ionicons
                            name="videocam-outline"
                            size={22}
                            color={TEXT_PRIMARY}
                            style={styles.cardIcon}
                        />

                        <View style={styles.cardContent}>
                            <Text style={styles.date}>
                                Friday, December 5, 2025
                            </Text>
                            <Text style={styles.time}>
                                2:00 PM • 50 min
                            </Text>
                            <Text style={styles.type}>Video Call</Text>
                        </View>
                    </View>

                    {/* Therapist Notes */}
                    <View style={styles.notesBox}>
                        <View style={styles.notesHeader}>
                            <Ionicons
                                name="document-text-outline"
                                size={16}
                                color="#4338CA"
                            />
                            <Text style={styles.notesLabel}>
                                Therapist Notes
                            </Text>
                        </View>

                        <Text style={styles.notesText}>
                            Good progress on anxiety management. Introduced grounding
                            techniques. Patient is responsive to CBT approaches.
                            Continue monitoring work-related stress.
                        </Text>
                    </View>
                </View>

                {/* Spacer for bottom nav */}
                <View style={{ height: 90 }} />
            </ScrollView>

        </SafeAreaView>
    );
}

function NavItem({
                     icon,
                     label,
                     active = false,
                 }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    active?: boolean;
}) {
    return (
        <View style={styles.navItem}>
            <View
                style={[
                    styles.navIconWrapper,
                    active && styles.navIconActive,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={active ? PURPLE : TEXT_SECONDARY}
                />
            </View>
            <Text
                style={[
                    styles.navLabel,
                    active && { color: PURPLE },
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "white",
    },
    scroll: {
        padding: 16,
        backgroundColor: "white",
    },

    /* Header */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    greeting: {
        fontSize: 20,
        fontWeight: "700",
        color: TEXT_PRIMARY,
    },
    subtitle: {
        fontSize: 13,
        color: TEXT_SECONDARY,
        marginTop: 2,
    },

    /* Page Header */
    pageHeader: {
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: TEXT_PRIMARY,
    },
    pageSubtitle: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        marginTop: 4,
    },

    /* Section */
    sectionLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: TEXT_PRIMARY,
        marginBottom: 12,
        letterSpacing: 0.5,
    },

    /* Card */
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardRow: {
        flexDirection: "row",
    },
    cardIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    cardContent: {
        flex: 1,
    },
    date: {
        fontSize: 15,
        fontWeight: "600",
        color: TEXT_PRIMARY,
    },
    time: {
        fontSize: 13,
        color: TEXT_PRIMARY,
        marginTop: 4,
    },
    type: {
        fontSize: 12,
        color: TEXT_SECONDARY,
        marginTop: 2,
    },

    /* Notes */
    notesBox: {
        backgroundColor: "#EEF2FF",
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
    },
    notesHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4338CA",
        marginLeft: 6,
    },
    notesText: {
        fontSize: 13,
        color: "#3730A3",
        lineHeight: 18,
    },

    /* Bottom Nav */
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: BORDER,
    },
    navItem: {
        alignItems: "center",
    },
    navIconWrapper: {
        padding: 8,
        borderRadius: 20,
    },
    navIconActive: {
        backgroundColor: "#F3E8FF",
    },
    navLabel: {
        fontSize: 11,
        color: TEXT_SECONDARY,
        marginTop: 2,
    },
});
