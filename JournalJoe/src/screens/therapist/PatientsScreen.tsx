import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Patient">;

const mockPatients = [
    { id: "p1", name: "Emma Wilson", patientSince: "Sep 15", mood: "Stable", nextSession: "Dec 12" },
    { id: "p2", name: "Michael Chen", patientSince: "Oct 1", mood: "Declining", nextSession: "Dec 10" },
    { id: "p3", name: "Sofia Rodriguez", patientSince: "Aug 20", mood: "Improving", nextSession: "Dec 11" },
];

export default function PatientsScreen() {
    const navigation = useNavigation<NavProp>();
    const [search, setSearch] = useState("");

    const renderMood = (mood: string) => {
        switch (mood) {
            case "Stable":
                return <Text style={styles.moodStable}>— Stable</Text>;
            case "Declining":
                return <Text style={styles.moodDeclining}>⚠ Declining</Text>;
            case "Improving":
                return <Text style={styles.moodImproving}>↗ Improving</Text>;
            default:
                return <Text>{mood}</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patients</Text>
            <Text style={styles.subtitle}>Manage your patient caseload</Text>

            <TextInput
                style={styles.searchBar}
                placeholder="🔍 Search patients..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
            />

            <FlatList
                data={mockPatients.filter(p =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("PatientDetail", { patientId: item.id })
                        }
                    >
                        <View style={styles.cardRow}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.name.split(" ").map(n => n[0]).join("")}
                                </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSub}>
                                    Patient since {item.patientSince}
                                </Text>
                                {renderMood(item.mood)}
                            </View>

                            <Text style={styles.nextSession}>{item.nextSession}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
    title: { fontSize: 20, fontWeight: "600" },
    subtitle: { color: "#6B7280", marginBottom: 12 },
    searchBar: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        color: "#111827",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardRow: { flexDirection: "row", alignItems: "center" },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#8A4EAF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: { color: "#FFFFFF", fontWeight: "700" },
    cardTitle: { fontWeight: "700", fontSize: 16 },
    cardSub: { fontSize: 12, color: "#6B7280" },
    moodStable: { color: "#111827", fontSize: 12, marginTop: 2 },
    moodDeclining: { color: "#F97316", fontSize: 12, marginTop: 2 },
    moodImproving: { color: "#10B981", fontSize: 12, marginTop: 2 },
    nextSession: { fontWeight: "700", marginLeft: 8, color: "#111827" },
});
