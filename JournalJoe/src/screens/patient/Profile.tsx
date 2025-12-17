import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const PURPLE = "#6D28D9";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const BORDER = "#E5E7EB";

export default function Profile({ navigation }: any) {
    const auth = getAuth();
    const user = auth.currentUser;

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<{
        name: string;
        email: string;
    } | null>(null);

    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                const data = snap.data();
                setProfile({
                    name: data.name,
                    email: data.email,
                });
            }
            setLoading(false);
        };

        loadProfile();
    }, [user]);

    const handleSignOut = async () => {
        await signOut(auth);
        navigation.replace("Login");
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={PURPLE} />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.loader}>
                <Text>Profile not found</Text>
            </View>
        );
    }

    const initials = profile.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text style={styles.title}>Profile</Text>

                {/* User Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>

                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                </View>

                {/* About Journal Joe — MATCH DESIGN */}
                <View style={[styles.card, styles.aboutCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.aboutIcon}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={18}
                                color="white"
                            />
                        </View>
                        <Text style={styles.cardTitle}>About Journal Joe</Text>
                    </View>

                    <Text style={styles.cardText}>
                        Joe is your AI companion for journaling and
                        self-reflection. He provides supportive, non-clinical
                        feedback to help you process your thoughts and feelings.
                    </Text>

                    <View style={styles.cardFooter}>
                        <Text style={styles.heart}>💜</Text>
                        <Text style={styles.footerText}>
                            Always here to listen, never judgmental
                        </Text>
                    </View>
                </View>

                {/* Therapist Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Your Therapist</Text>

                    <View style={styles.therapistRow}>
                        <View style={styles.therapistAvatar}>
                            <Text style={styles.therapistInitials}>SM</Text>
                        </View>

                        <View>
                            <Text style={styles.therapistName}>
                                Dr. Sarah Mitchell
                            </Text>
                            <Text style={styles.therapistTitle}>
                                Licensed Therapist
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Navigation Items (placeholders) */}
                <NavItem icon="shield-checkmark-outline" text="Privacy & Security" />
                <NavItem icon="document-text-outline" text="Terms of Use" />
                <NavItem icon="help-circle-outline" text="Help & Support" />

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerTitle}>
                        Important Disclaimer:
                    </Text>

                    <Text style={styles.disclaimerItem}>
                        • Journal Joe is a supportive tool, not a replacement for
                        professional therapy
                    </Text>
                    <Text style={styles.disclaimerItem}>
                        • Joe&apos;s AI feedback is non-clinical and for reflection purposes only
                    </Text>

                    <Text style={styles.disclaimerItem}>
                        • In case of emergency, contact emergency services
                        immediately
                    </Text>
                    <Text style={styles.disclaimerItem}>
                        • All AI outputs comply with EU AI Act as non-clinical
                        support only
                    </Text>
                </View>

                {/* Sign Out */}
                <Pressable style={styles.signOut} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                    <Ionicons
                        name="log-out-outline"
                        size={18}
                        color="#991B1B"
                        style={styles.signOutIcon}
                    />
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

/* ---------------- Nav Item ---------------- */

function NavItem({
                     icon,
                     text,
                 }: {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
}) {
    return (
        <Pressable style={styles.navItem}>
            <Ionicons name={icon} size={20} color={TEXT_PRIMARY} />
            <Text style={styles.navText}>{text}</Text>
        </Pressable>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "white" },
    scroll: { padding: 16 },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: TEXT_PRIMARY,
        marginBottom: 20,
    },

    profileCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EDE9FE",
        marginBottom: 20,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: PURPLE,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatarText: {
        color: "white",
        fontSize: 22,
        fontWeight: "700",
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: TEXT_PRIMARY,
    },
    email: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        marginTop: 4,
    },

    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 14,
    },

    aboutCard: {
        borderColor: "#E9D5FF",
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    aboutIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: PURPLE,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
        color: TEXT_PRIMARY,
    },
    cardText: {
        fontSize: 14,
        color: TEXT_PRIMARY,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    heart: { marginRight: 6 },
    footerText: {
        fontSize: 13,
        color: PURPLE,
        fontWeight: "500",
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 10,
        color: TEXT_PRIMARY,
    },

    therapistRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    therapistAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    therapistInitials: {
        color: "#2563EB",
        fontWeight: "700",
    },
    therapistName: {
        fontSize: 15,
        fontWeight: "700",
        color: TEXT_PRIMARY,
    },
    therapistTitle: {
        fontSize: 13,
        color: TEXT_SECONDARY,
    },

    navItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 10,
    },
    navText: {
        marginLeft: 12,
        fontSize: 15,
        color: TEXT_PRIMARY,
    },

    disclaimer: {
        backgroundColor: "#FFFBEB",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FDE68A",
        marginTop: 10,
        marginBottom: 16,
    },
    disclaimerTitle: {
        fontWeight: "700",
        marginBottom: 6,
        color: "#92400E",
    },
    disclaimerItem: {
        fontSize: 13,
        color: "#7C2D12",
        marginBottom: 4,
    },

    signOut: {
        backgroundColor: "#FEF2F2",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    signOutText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#991B1B",
    },
    signOutIcon: {
        position: "absolute",
        right: 16,
    },
});
