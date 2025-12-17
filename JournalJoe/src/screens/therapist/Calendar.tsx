import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import {
    collection,
    query,
    where,
    onSnapshot,
    Timestamp,
    updateDoc,
    doc,
    orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../services/firebase";
import { format } from "date-fns";

/* =====================================================
   🔑 UTC-SAFE DATE HELPERS (CRITICAL FIX)
   ===================================================== */

// UTC start of day
const utcStartOfDay = (d: Date) =>
    new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

// UTC start of week (Sunday)
const utcStartOfWeek = (d: Date) => {
    const day = new Date(d);
    const diff = day.getDate() - day.getDay();
    return utcStartOfDay(new Date(day.setDate(diff)));
};

// Add days in UTC
const utcAddDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setUTCDate(x.getUTCDate() + n);
    return x;
};

/* ===================================================== */

export default function TherapistCalendar() {
    const user = getAuth().currentUser;

    const [week, setWeek] = useState<Date>(utcStartOfWeek(new Date()));
    const [sessions, setSessions] = useState<any[]>([]);
    const [pending, setPending] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const start = utcStartOfWeek(week);
        const end = utcAddDays(start, 7);

        console.log(
            "UTC QUERY RANGE:",
            start.toISOString(),
            "→",
            end.toISOString()
        );

        /* ---------- THIS WEEK SESSIONS ---------- */
        const sessionsQ = query(
            collection(db, "sessions"),
            where("therapistId", "==", user.uid),
            where("date", ">=", Timestamp.fromDate(start)),
            where("date", "<", Timestamp.fromDate(end)),
            orderBy("date", "asc")
        );

        const unsubscribeSessions = onSnapshot(
            sessionsQ,
            snap => {
                const list: any[] = [];
                snap.forEach(d => {
                    const data = d.data();
                    if (!data.date) return;
                    list.push({
                        id: d.id,
                        ...data,
                        date: data.date.toDate(), // convert only for UI
                    });
                });
                setSessions(list);
            },
            err => console.error("Firestore sessions error:", err)
        );

        /* ---------- PENDING REQUESTS ---------- */
        const pendingQ = query(
            collection(db, "sessions"),
            where("therapistId", "==", user.uid),
            where("status", "==", "pending"),
            orderBy("date", "asc")
        );

        const unsubscribePending = onSnapshot(
            pendingQ,
            snap => {
                const list: any[] = [];
                snap.forEach(d => {
                    const data = d.data();
                    if (!data.date) return;
                    list.push({
                        id: d.id,
                        ...data,
                        date: data.date.toDate(),
                    });
                });
                setPending(list);
            },
            err => console.error("Firestore pending error:", err)
        );

        return () => {
            unsubscribeSessions();
            unsubscribePending();
        };
    }, [week, user]);

    const setStatus = (id: string, status: "accepted" | "rejected") =>
        updateDoc(doc(db, "sessions", id), { status });

    /* ---------- CALENDAR MARKING ---------- */
    const markedDates: Record<string, any> = {};

    sessions.forEach(s => {
        const key = s.date.toISOString().split("T")[0];
        markedDates[key] = { marked: true, dotColor: "#8A4EAF" };
    });

    const weekDates: Record<string, any> = {};
    for (let i = 0; i < 7; i++) {
        const d = utcAddDays(week, i).toISOString().split("T")[0];
        weekDates[d] = {
            ...(markedDates[d] || {}),
            selected: true,
            selectedColor: "#EDE9FE",
        };
    }

    const weekRange = `${format(week, "MMM d")} – ${format(
        utcAddDays(week, 6),
        "MMM d"
    )}`;

    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={styles.title}>Therapist Calendar</Text>


            {/* Calendar */}
            <Calendar
                current={week.toISOString().split("T")[0]}
                markedDates={weekDates}
                onDayPress={day => console.log("Selected day", day.dateString)}
            />

            {/* Pending Requests */}
            <Text style={styles.section}>Pending Requests</Text>
            {pending.length === 0 && <Text>No pending requests</Text>}
            {pending.map(s => (
                <View key={s.id} style={styles.card}>
                    <Text style={styles.sessionPatient}>{s.patientName}</Text>
                    <Text style={styles.sessionTime}>
                        {s.date.toLocaleString()}
                    </Text>
                    <View style={styles.row}>
                        <Pressable onPress={() => setStatus(s.id, "accepted")}>
                            <Text style={styles.accept}>ACCEPT</Text>
                        </Pressable>
                        <Pressable onPress={() => setStatus(s.id, "rejected")}>
                            <Text style={styles.reject}>REJECT</Text>
                        </Pressable>
                    </View>
                </View>
            ))}

            {/* Week Navigation */}
            <View style={styles.nav}>
                <Pressable onPress={() => setWeek(utcAddDays(week, -7))}>
                    <Ionicons name="chevron-back" size={22} />
                </Pressable>
                <Text style={{ fontWeight: "700" }}>{weekRange}</Text>
                <Pressable onPress={() => setWeek(utcAddDays(week, 7))}>
                    <Ionicons name="chevron-forward" size={22} />
                </Pressable>
            </View>

            {/* Sessions This Week */}
            <Text style={styles.section}>Sessions This Week</Text>
            {sessions.length === 0 && <Text>No sessions this week</Text>}
            {sessions.map(s => (
                <View key={s.id} style={styles.card}>
                    <Text style={styles.sessionTime}>
                        {s.date.toLocaleDateString()}{" "}
                        {s.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    <Text style={styles.sessionPatient}>{s.patientName}</Text>
                    <Text
                        style={{
                            fontWeight: "700",
                            color:
                                s.status === "accepted"
                                    ? "#10B981"
                                    : s.status === "rejected"
                                        ? "#EF4444"
                                        : "#FBBF24",
                        }}
                    >
                        {s.status.toUpperCase()}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    title: { fontSize: 22, fontWeight: "800" },
    section: { marginTop: 20, fontWeight: "700", fontSize: 18 },
    card: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    accept: { color: "#10B981", fontWeight: "700" },
    reject: { color: "#EF4444", fontWeight: "700" },
    nav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 20,
    },
    sessionTime: { fontWeight: "700" },
    sessionPatient: { fontSize: 16, marginTop: 4 },
});
