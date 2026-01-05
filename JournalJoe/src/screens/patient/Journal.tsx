import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Switch,
    ActivityIndicator,
} from "react-native";
import { auth, db } from "../../services/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    where,
    serverTimestamp,
    Timestamp,
    updateDoc,
    doc,
} from "firebase/firestore";

interface JournalEntry {
    id: string;
    text: string;
    createdAt: Timestamp;
    moodScore: number | null;
    shared: boolean;
    tags: string;
    userId: string;
    userName: string;
}

const API_BASE_URL = "http://172.20.10.2:3000/api";

const TAGS = [
    { label: "Happy", icon: "😄" },
    { label: "Sad", icon: "😢" },
    { label: "Anxious", icon: "😰" },
    { label: "Excited", icon: "🤩" },
    { label: "Tired", icon: "😴" },
];

export default function Journal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newText, setNewText] = useState("");
    const [shared, setShared] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [joeMessage, setJoeMessage] = useState<string>("");
    const [joeLoading, setJoeLoading] = useState(false);

    const user = auth.currentUser;
    const uid = user?.uid;
    const userName =
        user?.displayName || user?.email?.split("@")[0] || "Anonymous";

    /* ------------------------------------------------------------------ */
    /* Fetch entries                                                       */
    /* ------------------------------------------------------------------ */

    const fetchEntries = async () => {
        if (!uid) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, "journals"),
                where("userId", "==", uid),
                orderBy("createdAt", "desc")
            );

            const snap = await getDocs(q);
            const data = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<JournalEntry, "id">),
            }));

            setEntries(data);
        } catch (err) {
            console.error("Fetch journals error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ------------------------------------------------------------------ */
    /* Joe message                                                         */
    /* ------------------------------------------------------------------ */

    const fetchJoeMessage = async () => {
        if (!entries.length) return;

        setJoeLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/joe-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    previousEntries: entries.slice(0, 5).map((e) => e.text),
                }),
            });

            const data = await response.json();
            setJoeMessage(data.message);
        } catch (err) {
            console.error("Joe message error:", err);
            setJoeMessage(
                "I’m here with you. Take your time and write honestly."
            );
        } finally {
            setJoeLoading(false);
        }
    };

    /* ------------------------------------------------------------------ */
    /* Mood analysis (SAFE)                                                */
    /* ------------------------------------------------------------------ */

    const analyzeMoodAsync = async (
        entryId: string,
        text: string,
        selectedTags: string[]
    ) => {
        try {
            const response = await fetch(`${API_BASE_URL}/analyze-mood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, tags: selectedTags }),
            });

            if (!response.ok) {
                throw new Error("Mood API failed");
            }

            const data = await response.json();
            const moodScore =
                typeof data?.moodScore === "number" ? data.moodScore : 3;

            await updateDoc(doc(db, "journals", entryId), {
                moodScore,
            });

            setEntries((prev) =>
                prev.map((e) =>
                    e.id === entryId ? { ...e, moodScore } : e
                )
            );
        } catch (err) {
            console.error("Mood analysis failed:", err);

            // Fallback to neutral mood
            await updateDoc(doc(db, "journals", entryId), {
                moodScore: 3,
            });

            setEntries((prev) =>
                prev.map((e) =>
                    e.id === entryId ? { ...e, moodScore: 3 } : e
                )
            );
        }
    };

    /* ------------------------------------------------------------------ */
    /* Add entry                                                           */
    /* ------------------------------------------------------------------ */

    const handleAddEntry = async () => {
        if (!uid || !newText.trim() || !tags.length) return;

        try {
            const ref = await addDoc(collection(db, "journals"), {
                text: newText.trim(),
                createdAt: serverTimestamp(),
                moodScore: null,
                shared,
                tags: tags.join(", "),
                userId: uid,
                userName,
            });

            await analyzeMoodAsync(ref.id, newText.trim(), tags);

            setNewText("");
            setTags([]);
            setShared(false);
            setModalVisible(false);

            fetchEntries();
        } catch (err) {
            console.error("Add journal error:", err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [uid]);

    useEffect(() => {
        if (modalVisible) {
            fetchJoeMessage();
        }
    }, [modalVisible]);

    const toggleTag = (label: string) => {
        setTags((prev) =>
            prev.includes(label)
                ? prev.filter((t) => t !== label)
                : [...prev, label]
        );
    };

    /* ------------------------------------------------------------------ */
    /* UI                                                                  */
    /* ------------------------------------------------------------------ */

    return (
        <View style={styles.screen}>
            <TouchableOpacity
                style={styles.newEntryButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.newEntryText}>＋ New Journal Entry</Text>
            </TouchableOpacity>

            <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                refreshing={loading}
                onRefresh={fetchEntries}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardDate}>
                            {item.createdAt?.toDate
                                ? item.createdAt
                                    .toDate()
                                    .toLocaleDateString()
                                : "Just now"}
                        </Text>

                        <Text style={styles.cardMood}>
                            Mood: {item.moodScore ?? "Analyzing…"}
                        </Text>

                        <Text style={styles.cardText}>{item.text}</Text>
                        <Text style={styles.cardTags}>Tags: {item.tags}</Text>
                    </View>
                )}
            />

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Joe says:</Text>

                        {joeLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <Text style={styles.joeText}>{joeMessage}</Text>
                        )}

                        <TextInput
                            style={styles.modalInput}
                            placeholder="How are you feeling right now?"
                            multiline
                            value={newText}
                            onChangeText={setNewText}
                        />

                        <Text style={styles.tagsTitle}>
                            How are you feeling today?
                        </Text>

                        <View style={styles.tagsContainer}>
                            {TAGS.map((t) => (
                                <TouchableOpacity
                                    key={t.label}
                                    style={[
                                        styles.tagButton,
                                        tags.includes(t.label) &&
                                        styles.tagSelected,
                                    ]}
                                    onPress={() => toggleTag(t.label)}
                                >
                                    <Text style={styles.tagText}>
                                        {t.icon} {t.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.sharedContainer}>
                            <Text>Share with therapist:</Text>
                            <Switch value={shared} onValueChange={setShared} />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleAddEntry}
                            >
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
    newEntryButton: {
        backgroundColor: "#7C3AED",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 20,
    },
    newEntryText: { color: "white", fontWeight: "600" },
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
    },
    cardDate: { fontWeight: "600" },
    cardMood: { color: "#6B7280", marginTop: 4 },
    cardText: { marginTop: 6 },
    cardTags: { fontStyle: "italic", color: "#6B7280", marginTop: 4 },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        width: "90%",
    },
    modalTitle: { fontSize: 18, fontWeight: "700" },
    joeText: { marginVertical: 10, color: "#374151" },
    modalInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    tagsTitle: { fontWeight: "700", marginBottom: 8 },
    tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
    tagButton: {
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginRight: 8,
        marginBottom: 8,
    },
    tagSelected: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
    tagText: { fontWeight: "600", color: "#111827" },
    sharedContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    modalButtons: { flexDirection: "row" },
    saveButton: {
        flex: 1,
        backgroundColor: "#7C3AED",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        marginRight: 4,
    },
    saveText: { color: "white", fontWeight: "600" },
    cancelButton: {
        flex: 1,
        backgroundColor: "#E5E7EB",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        marginLeft: 4,
    },
});
