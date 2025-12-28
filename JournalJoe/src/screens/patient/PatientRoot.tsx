import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
    BookOpen,
    TrendingUp,
    Calendar,
    User,
    LogOut,

} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

import Journal from "./Journal";
import Insights from "./Insights";
import Sessions from "./Sessions";
import Profile from "./Profile";
import { RootStackParamList } from "../../../App";

type ViewName = "journal" |  "insights" | "sessions" | "profile";
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function PatientRoot() {
    const navigation = useNavigation<NavProp>();
    const auth = getAuth();
    const user = auth.currentUser;

    const [activeView, setActiveView] = useState<ViewName>("journal");
    const [name, setName] = useState("...");

    useEffect(() => {
        if (!user) return;

        const loadUser = async () => {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                setName(snap.data().name);
            }
        };

        loadUser();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        navigation.replace("Login");
    };

    const renderView = () => {
        switch (activeView) {
            case "journal":
                return <Journal />;
            case "insights":
                return <Insights />;
            case "sessions":
                return <Sessions />;
            case "profile":
                return <Profile navigation={navigation} />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Hello, {name} 👋</Text>
                    <Text style={styles.headerSubtitle}>
                        Journal Joe is here to support you
                    </Text>
                </View>

                <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
                    <LogOut size={18} color="#4B5563" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>{renderView()}</View>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <NavItem label="Journal" icon={<BookOpen size={20} />} active={activeView === "journal"} onPress={() => setActiveView("journal")} />
                <NavItem label="Insights" icon={<TrendingUp size={20} />} active={activeView === "insights"} onPress={() => setActiveView("insights")} />
                <NavItem label="Sessions" icon={<Calendar size={20} />} active={activeView === "sessions"} onPress={() => setActiveView("sessions")} />
                <NavItem label="Profile" icon={<User size={20} />} active={activeView === "profile"} onPress={() => setActiveView("profile")} />
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
            {icon}
            <Text style={[styles.navText, active && styles.activeText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },

    header: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: { fontSize: 18, fontWeight: "600" },
    headerSubtitle: { fontSize: 13, color: "#6B7280" },

    /* ✅ FIXED */
    iconBtn: {
        padding: 6,
    },

    content: { flex: 1 },

    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
    navItem: { alignItems: "center" },
    navText: { fontSize: 12, color: "#6B7280" },
    activeText: { color: "#7C3AED", fontWeight: "600" },
});
