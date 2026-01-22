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
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
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

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

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

interface TagItem {
    label: string;
    icon: string;
}

interface TagGroup {
    category: string;
    items: TagItem[];
}

/* ------------------------------------------------------------------ */

const API_BASE_URL = "http://172.20.10.2:3000/api";

/* ------------------------------------------------------------------ */
/* Tags                                                               */
/* ------------------------------------------------------------------ */

const TAGS: TagGroup[] = [{ category: "Joy / Positive", items: [ { label: "Happy", icon: "😄" }, { label: "Content", icon: "🙂" }, { label: "Grateful", icon: "🙏" }, { label: "Hopeful", icon: "🌱" }, { label: "Proud", icon: "🏆" }, { label: "Relieved", icon: "😌" }, { label: "Loved", icon: "❤️" }, { label: "Peaceful", icon: "🕊️" }, ], }, { category: "Sadness", items: [ { label: "Sad", icon: "😢" }, { label: "Lonely", icon: "🥀" }, { label: "Hopeless", icon: "🌧️" }, { label: "Empty", icon: "🕳️" }, { label: "Disappointed", icon: "😞" }, { label: "Grieving", icon: "🖤" }, { label: "Hurt", icon: "💔" }, ], }, { category: "Anxiety / Fear", items: [ { label: "Anxious", icon: "😰" }, { label: "Overwhelmed", icon: "🌪️" }, { label: "Stressed", icon: "🧠" }, { label: "Worried", icon: "💭" }, { label: "Panicked", icon: "🚨" }, { label: "Insecure", icon: "🫥" }, { label: "Nervous", icon: "😬" }, ], }, { category: "Anger / Frustration", items: [ { label: "Angry", icon: "😠" }, { label: "Irritated", icon: "😤" }, { label: "Frustrated", icon: "🧱" }, { label: "Annoyed", icon: "🙄" }, { label: "Resentful", icon: "🧊" }, { label: "Bitter", icon: "🧂" }, ], }, { category: "Low Energy / Burnout", items: [ { label: "Tired", icon: "😴" }, { label: "Exhausted", icon: "🛌" }, { label: "Drained", icon: "🔋" }, { label: "Burned out", icon: "🔥" }, { label: "Unmotivated", icon: "🐌" }, { label: "Foggy", icon: "🌫️" }, ], }, { category: "High Energy", items: [ { label: "Excited", icon: "🤩" }, { label: "Energized", icon: "⚡" }, { label: "Motivated", icon: "🚀" }, { label: "Inspired", icon: "💡" }, { label: "Focused", icon: "🎯" }, { label: "Restless", icon: "🏃" }, ], }, { category: "Calm / Regulation", items: [ { label: "Calm", icon: "🧘" }, { label: "Grounded", icon: "🌍" }, { label: "Centered", icon: "🧭" }, { label: "Safe", icon: "🛡️" }, { label: "Relaxed", icon: "🛀" }, ], }, { category: "Self-worth / Identity", items: [ { label: "Confident", icon: "💪" }, { label: "Guilty", icon: "⚖️" }, { label: "Ashamed", icon: "🙈" }, { label: "Self-critical", icon: "🪞" }, { label: "Accepted", icon: "🤍" }, { label: "Worthy", icon: "🌟" }, ], },];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function Journal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newText, setNewText] = useState("");
    const [shared, setShared] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [joeMessage, setJoeMessage] = useState("");
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
            const res = await fetch(`${API_BASE_URL}/joe-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    previousEntries: entries.slice(0, 5).map((e) => e.text),
                }),
            });

            const data = await res.json();
            setJoeMessage(data.message);
        } catch {
            setJoeMessage("I’m here with you. Take your time.");
        } finally {
            setJoeLoading(false);
        }
    };

    /* ------------------------------------------------------------------ */
    /* Mood analysis (NON-BLOCKING)                                        */
    /* ------------------------------------------------------------------ */

    const analyzeMoodAsync = async (
        entryId: string,
        text: string,
        selectedTags: string[]
    ) => {
        try {
            const res = await fetch(`${API_BASE_URL}/analyze-mood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            const data = await res.json();
            const moodScore =
                typeof data?.moodScore === "number" ? data.moodScore : 3;

            await updateDoc(doc(db, "journals", entryId), { moodScore });

            setEntries((prev) =>
                prev.map((e) =>
                    e.id === entryId ? { ...e, moodScore } : e
                )
            );
        } catch {
            await updateDoc(doc(db, "journals", entryId), { moodScore: 3 });
        }
    };

    /* ------------------------------------------------------------------ */
    /* Add entry                                                           */
    /* ------------------------------------------------------------------ */

    const handleAddEntry = async () => {
        if (!uid) return Alert.alert("Error", "User not authenticated");
        if (!newText.trim())
            return Alert.alert("Missing text", "Write something first");
        if (!tags.length)
            return Alert.alert("Missing tags", "Select at least one tag");

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

            analyzeMoodAsync(ref.id, newText.trim(), tags);

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
        if (modalVisible) fetchJoeMessage();
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
                                ? item.createdAt.toDate().toLocaleDateString()
                                : "Just now"}
                        </Text>

                        <Text style={styles.cardMood}>
                            Mood:{" "}
                            {item.moodScore === null
                                ? "Analyzing…"
                                : item.moodScore}
                        </Text>

                        <Text style={styles.cardText}>{item.text}</Text>
                        <Text style={styles.cardTags}>Tags: {item.tags}</Text>
                    </View>
                )}
            />

            {/* ================= MODAL (FIXED) ================= */}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalScroll}
                        >
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

                            {TAGS.map((group) => (
                                <View key={group.category}>
                                    <Text style={styles.tagsCategory}>
                                        {group.category}
                                    </Text>

                                    <View style={styles.tagsContainer}>
                                        {group.items.map((item) => (
                                            <TouchableOpacity
                                                key={item.label}
                                                style={[
                                                    styles.tagButton,
                                                    tags.includes(item.label) &&
                                                    styles.tagSelected,
                                                ]}
                                                onPress={() =>
                                                    toggleTag(item.label)
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.tagText,
                                                        tags.includes(
                                                            item.label
                                                        ) && { color: "white" },
                                                    ]}
                                                >
                                                    {item.icon} {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}

                            <View style={styles.sharedContainer}>
                                <Text>Share with therapist:</Text>
                                <Switch
                                    value={shared}
                                    onValueChange={setShared}
                                />
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
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

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
        borderRadius: 20,
        width: "90%",
        maxHeight: "90%",
    },
    modalScroll: {
        padding: 20,
        paddingBottom: 30,
    },

    modalTitle: { fontSize: 18, fontWeight: "700" },
    joeText: { marginVertical: 10, color: "#374151" },

    modalInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        minHeight: 80,
    },

    tagsCategory: { fontWeight: "700", marginVertical: 6 },

    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
    },

    tagButton: {
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginRight: 8,
        marginBottom: 8,
    },

    tagSelected: {
        backgroundColor: "#7C3AED",
        borderColor: "#7C3AED",
    },

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
