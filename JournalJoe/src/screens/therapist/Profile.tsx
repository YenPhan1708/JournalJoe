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

            {/* Settings */}
            <View style={styles.section}>
                {[
                    { icon: "settings-outline", label: "Account Settings" },
                    { icon: "shield-checkmark-outline", label: "Privacy & Security" },
                    { icon: "document-text-outline", label: "Professional Guidelines" },
                    { icon: "help-circle-outline", label: "Help & Support" },
                ].map(item => (
                    <Pressable key={item.label} style={styles.row}>
                        <Ionicons
                            name={item.icon}
                            size={20}
                            color={COLORS.text}
                        />
                        <Text style={styles.rowText}>{item.label}</Text>
                    </Pressable>
                ))}
            </View>

            {/* AI Ethics */}
            <View style={styles.infoBoxBlue}>
                <Text style={styles.infoTitleBlue}>AI Ethics & Compliance:</Text>
                {[
                    "AI provides supportive insights only",
                    "No diagnoses are generated",
                    "Professional judgment required",
                    "EU AI Act compliant design",
                ].map(line => (
                    <Text key={line} style={styles.infoTextBlue}>• {line}</Text>
                ))}
            </View>

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
   STYLES (UNCHANGED)
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
    section: { marginBottom: 16 },
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
    rowText: { fontSize: 15, fontWeight: "500" },
    infoBoxBlue: {
        backgroundColor: "#F0F6FF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#BFDBFE",
        marginBottom: 16,
    },
    infoTitleBlue: { fontWeight: "700", color: "#1D4ED8", marginBottom: 8 },
    infoTextBlue: { color: "#1E40AF", fontSize: 13, marginBottom: 4 },
    signOut: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
    },
    signOutText: { color: "#DC2626", fontWeight: "600" },
});
