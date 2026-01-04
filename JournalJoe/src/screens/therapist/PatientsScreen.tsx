import React, { useEffect, useMemo, useState } from "react";
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
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp,
    limit,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { RootStackParamList } from "../../../App";

/* =======================
   TYPES
======================= */

type NavProp = NativeStackNavigationProp<
    RootStackParamList,
    "PatientDetail"
>;

interface Patient {
    id: string;
    name: string;
    email: string;
    createdAt?: Timestamp;
}

interface Session {
    id: string;
    patientId: string;
    date: Timestamp;
    status: "accepted" | "pending" | "rejected";
}

/* =======================
   COMPONENT
======================= */

export default function PatientsScreen() {
    const navigation = useNavigation<NavProp>();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [search, setSearch] = useState("");

    // ✅ cache AI results per patient
    const [moodTrends, setMoodTrends] = useState<
        Record<string, string>
    >({});

    /* =======================
       FETCH PATIENTS
    ======================= */

    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "patient")
        );

        const unsub = onSnapshot(q, snap => {
            setPatients(
                snap.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as Omit<Patient, "id">),
                }))
            );
        });

        return unsub;
    }, []);

    /* =======================
       FETCH SESSIONS
    ======================= */

    useEffect(() => {
        const q = query(
            collection(db, "sessions"),
            where("status", "==", "accepted"),
            orderBy("date", "asc")
        );

        const unsub = onSnapshot(q, snap => {
            setSessions(
                snap.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as Omit<Session, "id">),
                }))
            );
        });

        return unsub;
    }, []);

    /* =======================
       HELPERS
    ======================= */

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const getNextSessionDate = (patientId: string) => {
        const s = sessions.find(
            s =>
                s.patientId === patientId &&
                s.date.toDate() >= today
        );

        return s
            ? s.date
                .toDate()
                .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })
            : "—";
    };

    /* =======================
       AI MOOD TREND
    ======================= */

    const getMoodTrendLabel = (patientId: string) => {
        if (moodTrends[patientId]) {
            return moodTrends[patientId];
        }

        const q = query(
            collection(db, "journals"),
            where("userId", "==", patientId),
            orderBy("createdAt", "desc"),
            limit(7)
        );

        onSnapshot(q, async snap => {
            const scores = snap.docs
                .map(d => d.data().moodScore)
                .filter((s: any) => typeof s === "number");

            if (scores.length < 3) {
                setMoodTrends(prev => ({
                    ...prev,
                    [patientId]: "Stable",
                }));
                return;
            }

            try {
                const res = await fetch(
                    "http://172.20.10.2:3000/api/mood-trend",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ scores: scores.reverse() }),
                    }
                );

                const data = await res.json();

                setMoodTrends(prev => ({
                    ...prev,
                    [patientId]: data.label ?? "Stable",
                }));
            } catch {
                setMoodTrends(prev => ({
                    ...prev,
                    [patientId]: "Stable",
                }));
            }
        });

        return "—";
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    /* =======================
       RENDER
    ======================= */

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patients</Text>
            <Text style={styles.subtitle}>
                Manage your patient caseload
            </Text>

            <View style={styles.searchWrapper}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search patients..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredPatients}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("PatientDetail", {
                                patientId: item.id,
                            })
                        }
                    >
                        <View style={styles.cardTop}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.name
                                        .split(" ")
                                        .map(n => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>
                                    {item.name}
                                </Text>
                                <Text style={styles.cardSub}>
                                    Patient since{" "}
                                    {item.createdAt
                                        ? item.createdAt
                                            .toDate()
                                            .toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        : "—"}
                                </Text>
                            </View>

                            <Text style={styles.chevron}>›</Text>
                        </View>

                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.metaLabel}>
                                    Mood Trend
                                </Text>
                                <Text style={styles.metaValue}>
                                    — {getMoodTrendLabel(item.id)}
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.metaLabel}>
                                    Next Session
                                </Text>
                                <Text style={styles.metaValue}>
                                    {getNextSessionDate(item.id)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#FFFFFF",
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        color: "#6B7280",
        marginBottom: 16,
    },

    searchWrapper: {
        marginBottom: 16,
    },
    searchBar: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        marginBottom: 12,
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#EDE9FE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        fontWeight: "700",
        color: "#7C3AED",
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    cardSub: {
        fontSize: 12,
        color: "#6B7280",
    },

    chevron: {
        fontSize: 24,
        color: "#9CA3AF",
    },

    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    metaLabel: {
        fontSize: 12,
        color: "#6B7280",
    },
    metaValue: {
        fontWeight: "600",
        marginTop: 2,
    },
});
