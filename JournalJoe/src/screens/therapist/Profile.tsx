import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../theme/colors";

export default function Profile() {
    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.pageTitle}>Profile</Text>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>DSM</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>Dr. Sarah Mitchell</Text>
                    <Text style={styles.email}>dr.mitchell@example.com</Text>
                    <Text style={styles.role}>Licensed Therapist</Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>4</Text>
                    <Text style={styles.statLabel}>Active Patients</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statValue}>127</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
                </View>
            </View>

            {/* Settings */}
            <View style={styles.section}>
                {[
                    { icon: "settings-outline", label: "Account Settings" },
                    { icon: "shield-checkmark-outline", label: "Privacy & Security" },
                    { icon: "document-text-outline", label: "Professional Guidelines" },
                    { icon: "help-circle-outline", label: "Help & Support" },
                ].map(item => (
                    <Pressable
                        key={item.label}
                        style={({ pressed }) => [
                            styles.row,
                            pressed && styles.rowPressed,
                        ]}
                        onPress={() => {}}
                    >
                        <Ionicons name={item.icon} size={20} color={COLORS.text} />
                        <Text style={styles.rowText}>{item.label}</Text>
                    </Pressable>
                ))}
            </View>

            {/* AI Ethics */}
            <View style={styles.infoBoxBlue}>
                <Text style={styles.infoTitleBlue}>AI Ethics & Compliance:</Text>
                {[
                    "AI provides supportive insights only, not diagnoses",
                    "All AI outputs are non-clinical and reflective",
                    "Professional judgment must guide all decisions",
                    "System complies with EU AI Act requirements",
                ].map(line => (
                    <Text key={line} style={styles.infoTextBlue}>• {line}</Text>
                ))}
            </View>

            {/* Important */}
            <View style={styles.infoBoxYellow}>
                <Text style={styles.infoTitleYellow}>Important:</Text>
                {[
                    "This is a prototype for demonstration purposes only",
                    "Not for use with real patient data or PII",
                    "Production use requires proper security certification",
                    "HIPAA/GDPR compliance needed for clinical deployment",
                ].map(line => (
                    <Text key={line} style={styles.infoTextYellow}>• {line}</Text>
                ))}
            </View>

            {/* Sign Out */}
            <Pressable
                style={({ pressed }) => [
                    styles.signOut,
                    pressed && styles.signOutPressed,
                ]}
                onPress={() => {}}
            >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        padding: 16,
        backgroundColor: COLORS.bg,
    },

    pageTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 16,
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#EDE9FE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    avatarText: {
        fontWeight: "700",
        color: COLORS.primary,
        fontSize: 18,
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
    },

    email: {
        color: COLORS.textMuted,
        marginTop: 2,
    },

    role: {
        color: COLORS.primary,
        marginTop: 4,
        fontWeight: "500",
    },

    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },

    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    statValue: {
        fontSize: 22,
        fontWeight: "700",
    },

    statLabel: {
        color: COLORS.textMuted,
        marginTop: 4,
    },

    section: {
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 10,
    },

    rowPressed: {
        opacity: 0.85,
    },

    rowText: {
        fontSize: 15,
        fontWeight: "500",
    },

    infoBoxBlue: {
        backgroundColor: "#F0F6FF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#BFDBFE",
        marginBottom: 16,
    },

    infoTitleBlue: {
        fontWeight: "700",
        color: "#1D4ED8",
        marginBottom: 8,
    },

    infoTextBlue: {
        color: "#1E40AF",
        fontSize: 13,
        marginBottom: 4,
    },

    infoBoxYellow: {
        backgroundColor: "#FEFCE8",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FACC15",
        marginBottom: 20,
    },

    infoTitleYellow: {
        fontWeight: "700",
        color: "#92400E",
        marginBottom: 8,
    },

    infoTextYellow: {
        color: "#92400E",
        fontSize: 13,
        marginBottom: 4,
    },

    signOut: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
        marginBottom: 40,
    },

    signOutPressed: {
        opacity: 0.85,
    },

    signOutText: {
        color: "#DC2626",
        fontWeight: "600",
    },
});
