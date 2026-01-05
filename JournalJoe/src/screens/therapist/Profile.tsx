import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../theme/colors";
import { auth, db } from "../../services/firebase";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

/* =======================
   TYPES
======================= */

interface Therapist {
    name: string;
    email: string;
    role: string;
}

export default function Profile() {
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [activePatients, setActivePatients] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [openSection, setOpenSection] = useState<string | null>(null);

    const user = auth.currentUser;

    /* =======================
       FETCH THERAPIST
    ======================= */

    useEffect(() => {
        if (!user) return;

        const ref = doc(db, "users", user.uid);
        getDoc(ref).then(snap => {
            if (snap.exists()) {
                setTherapist(snap.data() as Therapist);
            }
        });
    }, [user]);

    /* =======================
       FETCH STATS
    ======================= */

    useEffect(() => {
        if (!user) return;

        const sessionsQ = query(
            collection(db, "sessions"),
            where("therapistId", "==", user.uid)
        );

        const unsub = onSnapshot(sessionsQ, snap => {
            setTotalSessions(snap.size);

            const uniquePatients = new Set(
                snap.docs.map(d => d.data().patientId)
            );

            setActivePatients(uniquePatients.size);
        });

        return unsub;
    }, [user]);

    if (!therapist) return null;

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.pageTitle}>Profile</Text>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {therapist.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")
                            .toUpperCase()}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{therapist.name}</Text>
                    <Text style={styles.email}>{therapist.email}</Text>
                    <Text style={styles.role}>
                        {therapist.role === "therapist"
                            ? "Licensed Therapist"
                            : therapist.role}
                    </Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{activePatients}</Text>
                    <Text style={styles.statLabel}>Active Patients</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{totalSessions}</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
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
                    Patient data is processed in accordance with GDPR and
                    professional confidentiality obligations.
                </Text>
                <Text style={styles.accordionBullet}>
                    • Secure access control and authentication
                </Text>
                <Text style={styles.accordionBullet}>
                    • No secondary use of patient data
                </Text>
                <Text style={styles.accordionBullet}>
                    • Data minimization and purpose limitation
                </Text>
                <Text style={styles.accordionBullet}>
                    • Therapist accountability for data handling
                </Text>
            </AccordionItem>

            {/* Professional Guidelines */}
            <AccordionItem
                title="Professional Guidelines"
                icon="document-text-outline"
                isOpen={openSection === "guidelines"}
                onPress={() =>
                    setOpenSection(
                        openSection === "guidelines" ? null : "guidelines"
                    )
                }
            >
                <Text style={styles.accordionText}>
                    This platform supports — but does not replace —
                    professional clinical judgment.
                </Text>
                <Text style={styles.accordionBullet}>
                    • Therapists retain full decision authority
                </Text>
                <Text style={styles.accordionBullet}>
                    • AI insights must be critically assessed
                </Text>
                <Text style={styles.accordionBullet}>
                    • Use aligns with ethical therapy standards
                </Text>
                <Text style={styles.accordionBullet}>
                    • Not intended for autonomous care decisions
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
                    For technical or operational support, contact the platform
                    provider.
                </Text>
                <Text style={styles.accordionBullet}>
                    • Report bugs or system issues
                </Text>
                <Text style={styles.accordionBullet}>
                    • Request clarification on platform behavior
                </Text>
                <Text style={styles.accordionBullet}>
                    • Contact the business owner or developer
                </Text>
                <Text style={styles.accordionBullet}>
                    • Not intended for clinical escalation
                </Text>
            </AccordionItem>

            {/* AI Ethics & Compliance */}
            <AccordionItem
                title="AI Ethics & Compliance"
                icon="sparkles-outline"
                isOpen={openSection === "ai"}
                onPress={() =>
                    setOpenSection(openSection === "ai" ? null : "ai")
                }
            >
                <Text style={styles.accordionText}>
                    The AI system is designed in line with EU AI Act
                    requirements for limited-risk systems.
                </Text>
                <Text style={styles.accordionBullet}>
                    • AI provides supportive insights only
                </Text>
                <Text style={styles.accordionBullet}>
                    • No diagnoses or treatment plans generated
                </Text>
                <Text style={styles.accordionBullet}>
                    • Human oversight is mandatory
                </Text>
                <Text style={styles.accordionBullet}>
                    • Transparency and explainability prioritized
                </Text>
            </AccordionItem>

            {/* Sign Out */}
            <Pressable
                style={styles.signOut}
                onPress={() => auth.signOut()}
            >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
        </ScrollView>
    );
}

/* =======================
   ACCORDION ITEM
======================= */

function AccordionItem({
                           title,
                           icon,
                           isOpen,
                           onPress,
                           children,
                       }: {
    title: string;
    icon: string;
    isOpen: boolean;
    onPress: () => void;
    children: React.ReactNode;
}) {
    return (
        <View style={{ marginBottom: 10 }}>
            <Pressable style={styles.row} onPress={onPress}>
                <Ionicons name={icon} size={20} color={COLORS.text} />
                <Text style={styles.rowText}>{title}</Text>
                <Ionicons
                    name={isOpen ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color={COLORS.textMuted}
                    style={{ marginLeft: "auto" }}
                />
            </Pressable>

            {isOpen && (
                <View style={styles.accordionContent}>
                    {children}
                </View>
            )}
        </View>
    );
}

/* =======================
   STYLES (EXTENDED ONLY)
======================= */

const styles = StyleSheet.create({
    scroll: { padding: 16, backgroundColor: COLORS.bg },
    pageTitle: { fontSize: 22, fontWeight: "700", marginBottom: 16 },

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
    avatarText: { fontWeight: "700", color: COLORS.primary, fontSize: 18 },
    name: { fontSize: 16, fontWeight: "600" },
    email: { color: COLORS.textMuted, marginTop: 2 },
    role: { color: COLORS.primary, marginTop: 4, fontWeight: "500" },

    statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: { fontSize: 22, fontWeight: "700" },
    statLabel: { color: COLORS.textMuted, marginTop: 4 },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    rowText: { fontSize: 15, fontWeight: "500" },

    accordionContent: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderTopWidth: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 16,
    },
    accordionText: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 6,
    },
    accordionBullet: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 4,
    },

    signOut: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
        marginTop: 16,
    },
    signOutText: { color: "#DC2626", fontWeight: "600" },
});
