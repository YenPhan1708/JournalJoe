import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
    LayoutDashboard,
    Users,
    Calendar as CalIcon,
    User as UserIcon,
    LogOut,
} from "lucide-react-native";

import Dashboard from "./Dashboard";
import PatientsScreen from "./PatientsScreen";
import Calendar from "./Calendar";
import Profile from "./Profile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type ViewName = "dashboard" | "patients" | "calendar" | "profile";
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const ACCENT = "#7C3AED";

export default function TherapistRoot() {
    const navigation = useNavigation<NavProp>();
    const [activeView, setActiveView] = useState<ViewName>("dashboard");

    const renderView = () => {
        switch (activeView) {
            case "dashboard":
                return <Dashboard />;
            case "patients":
                return <PatientsScreen />;
            case "calendar":
                return <Calendar />;
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
                    <Text style={styles.headerTitle}>Journal Joe </Text>
                    <Text style={styles.headerSub}>Dr. Sarah Mitchell</Text>
                </View>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate("Login")}
                >
                    <LogOut size={18} color="#4B5563" />
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>{renderView()}</View>

            {/* BOTTOM NAV */}
            <View style={styles.bottomNav}>
                <NavItem
                    label="Dashboard"
                    icon={<LayoutDashboard size={20} />}
                    active={activeView === "dashboard"}
                    onPress={() => setActiveView("dashboard")}
                />

                <NavItem
                    label="Patients"
                    icon={<Users size={20} />}
                    active={activeView === "patients"}
                    onPress={() => setActiveView("patients")}
                />

                <NavItem
                    label="Calendar"
                    icon={<CalIcon size={20} />}
                    active={activeView === "calendar"}
                    onPress={() => setActiveView("calendar")}
                />

                <NavItem
                    label="Profile"
                    icon={<UserIcon size={20} />}
                    active={activeView === "profile"}
                    onPress={() => setActiveView("profile")}
                />
            </View>
        </View>
    );
}

function NavItem({
                     label,
                     icon,
                     active,
                     onPress,
                 }: {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onPress: () => void;
}) {
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
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
    headerSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    iconBtn: { padding: 6 },

    content: { flex: 1 },

    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingVertical: 10,
    },
    navItem: { alignItems: "center" },
    navText: { fontSize: 12, color: "#6B7280", marginTop: 4 },
    activeText: { color: ACCENT, fontWeight: "600" },
    activeIconBg: { backgroundColor: "#EDE9FE", padding: 6, borderRadius: 999 },
});
