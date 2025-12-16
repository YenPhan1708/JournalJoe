import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Pressable,
    Modal,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../services/firebase";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";

const PURPLE = "#8A4EAF";
const BORDER = "#E5E7EB";

// Status colors
const STATUS_COLORS: Record<string, string> = {
    pending: "#FBBF24",   // yellow
    accepted: "#10B981",  // green
    rejected: "#EF4444",  // red
};

type SessionStatus = "pending" | "accepted" | "rejected";
type SessionType = "Video" | "In-person";

interface Session {
    id: string;
    date: Date;
    duration: number;
    type: SessionType;
    status: SessionStatus;
    therapistName: string;
}

export default function Sessions() {
    const user = getAuth().currentUser;

    const [sessions, setSessions] = useState<Session[]>([]);
    const [bookingOpen, setBookingOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [sessionType, setSessionType] = useState<SessionType>("Video");

    const [therapistId, setTherapistId] = useState<string | null>(null);
    const [therapistName, setTherapistName] = useState<string>("");

    // Load first therapist
    useEffect(() => {
        const loadTherapist = async () => {
            const q = query(
                collection(db, "users"),
                where("role", "==", "therapist"),
                orderBy("name", "asc")
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                setTherapistId(snap.docs[0].id);
                setTherapistName(snap.docs[0].data().name);
            }
        };
        loadTherapist();
    }, []);

    // Load patient sessions
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "sessions"),
            where("patientId", "==", user.uid),
            orderBy("date", "desc")
        );

        return onSnapshot(q, snap => {
            const list: Session[] = [];
            snap.forEach(d => {
                const data = d.data();
                list.push({
                    id: d.id,
                    date: data.date.toDate(),
                    duration: data.duration,
                    type: data.type,
                    status: data.status,
                    therapistName: data.therapistName,
                });
            });
            setSessions(list);
        });
    }, [user]);

    const bookSession = async () => {
        if (!user || !therapistId || !selectedDate) return;

        const [y, m, d] = selectedDate.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        date.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

        await addDoc(collection(db, "sessions"), {
            patientId: user.uid,
            therapistId,
            therapistName,
            date: Timestamp.fromDate(date),
            duration: 50,
            type: sessionType,
            status: "pending",
            createdAt: Timestamp.now(),
        });

        setBookingOpen(false);
        setSelectedDate(null);
        setSelectedTime(new Date());
        setSessionType("Video");
    };

    // Web-friendly time picker
    const renderWebTimePicker = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hh = String(h).padStart(2, "0");
                const mm = String(m).padStart(2, "0");
                options.push(
                    <option key={`${hh}:${mm}`} value={`${hh}:${mm}`}>
                        {hh}:{mm}
                    </option>
                );
            }
        }
        return (
            <select
                value={selectedTime.toTimeString().slice(0, 5)}
                onChange={(e) => {
                    const [h, m] = e.target.value.split(":").map(Number);
                    const newDate = new Date(selectedTime);
                    newDate.setHours(h, m, 0, 0);
                    setSelectedTime(newDate);
                }}
                style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 16,
                    borderRadius: 12,
                    borderColor: BORDER,
                    borderWidth: 1,
                    marginTop: 8,
                }}
            >
                {options}
            </select>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={styles.title}>Your Sessions</Text>

                <Pressable style={styles.bookBtn} onPress={() => setBookingOpen(true)}>
                    <Text style={styles.bookText}>+ Book Session</Text>
                </Pressable>

                {sessions.length === 0 && (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#6B7280" }}>
                        No sessions booked yet
                    </Text>
                )}

                {sessions.map(s => (
                    <View key={s.id} style={styles.card}>
                        <Ionicons
                            name={s.type === "Video" ? "videocam-outline" : "person-outline"}
                            size={22}
                            color={PURPLE}
                        />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.bold}>{s.date.toLocaleString()}</Text>
                            <Text>With {s.therapistName}</Text>
                            <Text
                                style={{
                                    color: STATUS_COLORS[s.status],
                                    fontWeight: "700",
                                }}
                            >
                                {s.status.toUpperCase()}
                            </Text>
                            <Text>{s.type.toUpperCase()}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={bookingOpen} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Select Date</Text>
                            <Calendar
                                onDayPress={(d) => setSelectedDate(d.dateString)}
                                markedDates={
                                    selectedDate
                                        ? { [selectedDate]: { selected: true, selectedColor: PURPLE } }
                                        : {}
                                }
                            />

                            <Text style={styles.modalTitle}>Select Time</Text>

                            {Platform.OS === "web" ? (
                                renderWebTimePicker()
                            ) : (
                                <>
                                    <Pressable
                                        style={styles.timePicker}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        <Text>
                                            {selectedTime.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    </Pressable>

                                    {showTimePicker && (
                                        <DateTimePicker
                                            value={selectedTime}
                                            mode="time"
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            onChange={(event, date) => {
                                                if (date) setSelectedTime(date);
                                                if (Platform.OS === "android") setShowTimePicker(false);
                                            }}
                                        />
                                    )}
                                </>
                            )}

                            <Text style={styles.modalTitle}>Session Type</Text>
                            <View style={{ flexDirection: "row", marginTop: 12 }}>
                                {(["Video", "In-person"] as SessionType[]).map((t) => (
                                    <Pressable
                                        key={t}
                                        style={[styles.typeBtn, sessionType === t && styles.typeActive]}
                                        onPress={() => setSessionType(t)}
                                    >
                                        <Text>{t.toUpperCase()}</Text>
                                    </Pressable>
                                ))}
                            </View>

                            <Pressable style={styles.confirm} onPress={bookSession}>
                                <Text style={styles.confirmText}>Confirm</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setBookingOpen(false)}
                                style={{ marginTop: 12 }}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 26, fontWeight: "800" },
    card: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    bold: { fontWeight: "700" },
    bookBtn: {
        backgroundColor: PURPLE,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 16,
    },
    bookText: { color: "white", fontWeight: "700" },
    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        width: "100%",
        maxWidth: 400,
    },
    modalTitle: { fontWeight: "700", marginBottom: 8, marginTop: 12 },
    timePicker: {
        borderWidth: 1,
        borderColor: BORDER,
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
        alignItems: "center",
    },
    typeBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 12,
        marginHorizontal: 4,
        alignItems: "center",
        borderRadius: 8,
    },
    typeActive: { backgroundColor: "#EDE9FE" },
    confirm: {
        backgroundColor: PURPLE,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 16,
    },
    confirmText: { color: "white", fontWeight: "700" },
    cancelText: { textAlign: "center", color: "#6B7280" },
});
