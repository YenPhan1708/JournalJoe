import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { HeartHandshake } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type LoginScreenNavProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login"
>;

export default function LoginScreen({
                                        navigation,
                                    }: {
    navigation: LoginScreenNavProp;
}) {
    const [selectedRole, setSelectedRole] = useState<
        "patient" | "therapist"
    >("patient");

    const MOCK_USERS = {
        patient: {
            name: "Emma Wilson",
            email: "emma@example.com",
        },
        therapist: {
            name: "Dr. Sarah Mitchell",
            email: "dr.mitchell@example.com",
        },
    };

    const handleLogin = () => {
        navigation.replace(
            selectedRole === "patient" ? "Patient" : "Therapist"
        );
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoCircle}>
                <HeartHandshake size={36} color="white" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Journal Joe</Text>
            <Text style={styles.subtitle}>
                Your friendly therapy-support companion
            </Text>

            {/* Card */}
            <View style={styles.card}>
                <Text style={styles.sectionLabel}>Login as:</Text>

                {/* Role selector */}
                <View style={styles.roleRow}>
                    {["patient", "therapist"].map((role) => {
                        const active = selectedRole === role;
                        return (
                            <TouchableOpacity
                                key={role}
                                onPress={() => setSelectedRole(role as any)}
                                style={[
                                    styles.roleButton,
                                    active && styles.roleButtonActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.roleText,
                                        active && styles.roleTextActive,
                                    ]}
                                >
                                    {role === "patient" ? "Patient" : "Therapist"}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Demo account */}
                <View style={styles.demoBox}>
                    <Text style={styles.demoTitle}>Demo account:</Text>
                    <Text style={styles.demoText}>
                        <Text style={styles.bold}>Name:</Text>{" "}
                        {MOCK_USERS[selectedRole].name}
                    </Text>
                    <Text style={styles.demoText}>
                        <Text style={styles.bold}>Email:</Text>{" "}
                        {MOCK_USERS[selectedRole].email}
                    </Text>
                </View>

                {/* Continue button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.continueText}>
                        Continue as{" "}
                        {selectedRole === "patient" ? "Patient" : "Therapist"}
                    </Text>
                </TouchableOpacity>

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        <Text style={styles.bold}>Disclaimer:</Text> This is a prototype
                        for demonstration purposes only. Not for real patient data or
                        professional therapy.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    logoCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#7C3AED",
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#5B21B6",
    },

    subtitle: {
        color: "#6B7280",
        marginBottom: 20,
        textAlign: "center",
    },

    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
    },

    sectionLabel: {
        color: "#374151",
        marginBottom: 10,
        fontWeight: "500",
    },

    roleRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 14,
    },

    roleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },

    roleButtonActive: {
        borderColor: "#7C3AED",
        backgroundColor: "#F5F3FF",
    },

    roleText: {
        color: "#374151",
        fontWeight: "500",
    },

    roleTextActive: {
        color: "#6D28D9",
        fontWeight: "600",
    },

    demoBox: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },

    demoTitle: {
        color: "#6B7280",
        marginBottom: 6,
    },

    demoText: {
        color: "#111827",
        fontSize: 14,
    },

    bold: {
        fontWeight: "700",
    },

    continueButton: {
        backgroundColor: "#7C3AED",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 14,
    },

    continueText: {
        color: "white",
        fontWeight: "600",
        fontSize: 15,
    },

    disclaimer: {
        backgroundColor: "#FEF3C7",
        borderRadius: 12,
        padding: 12,
    },

    disclaimerText: {
        fontSize: 12,
        color: "#92400E",
        lineHeight: 16,
    },
});
