import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
    LayoutDashboard,
    Users,
    Calendar,
    User,
    LogOut,
} from "lucide-react-native";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

import Dashboard from "./Dashboard";
import PatientsScreen from "./PatientsScreen";
import CalendarScreen from "./Calendar";
import Profile from "./Profile";

const ACCENT = "#7C3AED";

export default function TherapistRoot() {
    const [activeView, setActiveView] = useState<
        "dashboard" | "patients" | "calendar" | "profile"
    >("dashboard");

    const [name, setName] = useState("");

    /* =======================
       LOAD THERAPIST
    ======================= */

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        getDoc(doc(db, "users", user.uid)).then(snap => {
            if (snap.exists()) {
                setName(snap.data().name);
            }
        });
    }, []);

    const renderView = () => {
        switch (activeView) {
            case "patients":
                return <PatientsScreen />;
            case "calendar":
                return <CalendarScreen />;
            case "profile":
                return <Profile />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Journal Joe</Text>
                    <Text style={styles.headerSub}>{name}</Text>
                </View>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => auth.signOut()}
                >
                    <LogOut size={18} color="#4B5563" />
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>{renderView()}</View>

            {/* NAV */}
            <View style={styles.bottomNav}>
                <NavItem label="Dashboard" icon={<LayoutDashboard size={20} />} active={activeView === "dashboard"} onPress={() => setActiveView("dashboard")} />
                <NavItem label="Patients" icon={<Users size={20} />} active={activeView === "patients"} onPress={() => setActiveView("patients")} />
                <NavItem label="Calendar" icon={<Calendar size={20} />} active={activeView === "calendar"} onPress={() => setActiveView("calendar")} />
                <NavItem label="Profile" icon={<User size={20} />} active={activeView === "profile"} onPress={() => setActiveView("profile")} />
            </View>
        </View>
    );
}

function NavItem({ label, icon, active, onPress }: any) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.navItem}>
            <View style={active && styles.activeIconBg}>{icon}</View>
            <Text style={[styles.navText, active && styles.activeText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerTitle: { fontSize: 18, fontWeight: "700" },
    headerSub: { fontSize: 13, color: "#6B7280" },
    iconBtn: { padding: 6 },
    content: { flex: 1 },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingVertical: 10,
    },
    navItem: { alignItems: "center" },
    navText: { fontSize: 12, color: "#6B7280", marginTop: 4 },
    activeText: { color: ACCENT, fontWeight: "600" },
    activeIconBg: { backgroundColor: "#EDE9FE", padding: 6, borderRadius: 999 },
});
