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
    const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
    const [openSection, setOpenSection] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                const data = snap.data();
                setProfile({ name: data.name, email: data.email });
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
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Profile</Text>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                </View>

                {/* About Journal Joe */}
                <View style={[styles.card, styles.aboutCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.aboutIcon}>
                            <Ionicons name="chatbubble-outline" size={18} color="white" />
                        </View>
                        <Text style={styles.cardTitle}>About Journal Joe</Text>
                    </View>

                    <Text style={styles.cardText}>
                        Journal Joe is an AI-powered journaling companion designed
                        for self-reflection. It provides supportive, non-clinical
                        insights and does not replace professional care.
                    </Text>

                    <View style={styles.cardFooter}>
                        <Text style={styles.heart}>💜</Text>
                        <Text style={styles.footerText}>
                            Built with responsibility and care
                        </Text>
                    </View>
                </View>

                {/* Therapist */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Your Therapist</Text>
                    <View style={styles.therapistRow}>
                        <View style={styles.therapistAvatar}>
                            <Text style={styles.therapistInitials}>SM</Text>
                        </View>
                        <View>
                            <Text style={styles.therapistName}>Dr. Sarah Mitchell</Text>
                            <Text style={styles.therapistTitle}>Licensed Therapist</Text>
                        </View>
                    </View>
                </View>

                {/* Privacy & Security */}
                <AccordionItem
                    title="Privacy & Security"
                    icon="shield-checkmark-outline"
                    isOpen={openSection === "privacy"}
                    onPress={() =>
                        setOpenSection(openSection === "privacy" ? null : "privacy")
                    }
                >
                    <Text style={styles.accordionText}>
                        Your data is handled in accordance with GDPR and EU AI Act
                        principles.
                    </Text>
                    <Text style={styles.accordionBullet}>• Data minimization by default</Text>
                    <Text style={styles.accordionBullet}>• Secure storage and access control</Text>
                    <Text style={styles.accordionBullet}>• No automated clinical profiling</Text>
                    <Text style={styles.accordionBullet}>• Full user control over data</Text>
                </AccordionItem>

                {/* Terms of Use */}
                <AccordionItem
                    title="Terms of Use"
                    icon="document-text-outline"
                    isOpen={openSection === "terms"}
                    onPress={() =>
                        setOpenSection(openSection === "terms" ? null : "terms")
                    }
                >
                    <Text style={styles.accordionText}>
                        Journal Joe is a non-clinical AI system intended for reflection.
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • AI outputs are informational only
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Not suitable for medical or legal decisions
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Responsibility remains with the user
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Liability limited under applicable EU law
                    </Text>
                </AccordionItem>

                {/* Help & Support */}
                <AccordionItem
                    title="Help & Support"
                    icon="help-circle-outline"
                    isOpen={openSection === "help"}
                    onPress={() =>
                        setOpenSection(openSection === "help" ? null : "help")
                    }
                >
                    <Text style={styles.accordionText}>
                        For questions or issues, please contact the app provider.
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Reach out to the developer or business owner
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Report bugs or unexpected behavior
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Request information about data usage
                    </Text>
                    <Text style={styles.accordionBullet}>
                        • Not intended for emergency support
                    </Text>
                </AccordionItem>

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerTitle}>Important Disclaimer:</Text>
                    <Text style={styles.disclaimerItem}>
                        • Journal Joe does not replace professional therapy
                    </Text>
                    <Text style={styles.disclaimerItem}>
                        • AI feedback is non-clinical and reflective only
                    </Text>
                    <Text style={styles.disclaimerItem}>
                        • In emergencies, contact local emergency services
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

/* ---------------- Accordion Item ---------------- */

function AccordionItem({
                           title,
                           icon,
                           isOpen,
                           onPress,
                           children,
                       }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    isOpen: boolean;
    onPress: () => void;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.accordionContainer}>
            <Pressable style={styles.navItem} onPress={onPress}>
                <Ionicons name={icon} size={20} color={TEXT_PRIMARY} />
                <Text style={styles.navText}>{title}</Text>
                <Ionicons
                    name={isOpen ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color={TEXT_SECONDARY}
                    style={{ marginLeft: "auto" }}
                />
            </Pressable>

            {isOpen && <View style={styles.accordionContent}>{children}</View>}
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "white" },
    scroll: { padding: 16 },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },

    title: { fontSize: 28, fontWeight: "800", color: TEXT_PRIMARY, marginBottom: 20 },

    profileCard: {
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
    avatarText: { color: "white", fontSize: 22, fontWeight: "700" },
    name: { fontSize: 18, fontWeight: "700", color: TEXT_PRIMARY },
    email: { fontSize: 14, color: TEXT_SECONDARY, marginTop: 4 },

    card: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 14,
    },
    aboutCard: { borderColor: "#E9D5FF" },

    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    aboutIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: PURPLE,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: { fontSize: 16, fontWeight: "700", marginLeft: 8 },
    cardText: { fontSize: 14, lineHeight: 20 },
    cardFooter: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    heart: { marginRight: 6 },
    footerText: { fontSize: 13, color: PURPLE, fontWeight: "500" },

    sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 10 },

    therapistRow: { flexDirection: "row", alignItems: "center" },
    therapistAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    therapistInitials: { color: "#2563EB", fontWeight: "700" },
    therapistName: { fontSize: 15, fontWeight: "700" },
    therapistTitle: { fontSize: 13, color: TEXT_SECONDARY },

    accordionContainer: { marginBottom: 10 },

    navItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: "white",
    },
    navText: { marginLeft: 12, fontSize: 15, color: TEXT_PRIMARY },

    accordionContent: {
        padding: 16,
        borderWidth: 1,
        borderColor: BORDER,
        borderTopWidth: 0,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        backgroundColor: "#F9FAFB",
    },
    accordionText: {
        fontSize: 14,
        marginBottom: 6,
        color: TEXT_PRIMARY,
    },
    accordionBullet: {
        fontSize: 13,
        color: TEXT_SECONDARY,
        marginBottom: 4,
    },

    disclaimer: {
        backgroundColor: "#FFFBEB",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FDE68A",
        marginBottom: 16,
    },
    disclaimerTitle: { fontWeight: "700", marginBottom: 6, color: "#92400E" },
    disclaimerItem: { fontSize: 13, color: "#7C2D12", marginBottom: 4 },

    signOut: {
        backgroundColor: "#FEF2F2",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    signOutText: { fontSize: 15, fontWeight: "600", color: "#991B1B" },
    signOutIcon: { position: "absolute", right: 16 },
});
