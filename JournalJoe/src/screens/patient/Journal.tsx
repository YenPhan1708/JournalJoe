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
} from "react-native";
import { auth, db } from "../../services/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    where,
    Timestamp,
} from "firebase/firestore";

interface JournalEntry {
    id: string;
    text: string;
    createdAt: Timestamp;
    moodScore: number;
    shared: boolean;
    tags: string;
    userId: string;
    userName: string;
}

export default function Journal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newText, setNewText] = useState("");
    const [moodScore, setMoodScore] = useState(3);
    const [shared, setShared] = useState(false);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);

    const user = auth.currentUser;
    const uid = user?.uid;

    const userName =
        user?.displayName ||
        user?.email?.split("@")[0] ||
        "Anonymous";

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
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<JournalEntry, "id">),
            }));

            setEntries(data);
        } catch (err) {
            console.error("Error fetching journal entries:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = async () => {
        if (!uid || !newText.trim()) return;

        try {
            await addDoc(collection(db, "journals"), {
                text: newText.trim(),
                createdAt: serverTimestamp(),
                moodScore,
                shared,
                tags: tags.trim(),
                userId: uid,
                userName, // ✅ STORED HERE
            });

            setNewText("");
            setMoodScore(3);
            setShared(false);
            setTags("");
            setModalVisible(false);

            fetchEntries();
        } catch (err) {
            console.error("Error adding journal entry:", err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [uid]);

    return (
        <View style={styles.screen}>
            <View style={styles.titleSection}>
                <Text style={styles.title}>
                    My Journal <Text style={styles.sparkle}>✨</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Write freely, Joe is here to support you.
                </Text>
            </View>

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
                                : "Just now"}{" "}
                            <Text style={styles.cardMood}>
                                Mood: {item.moodScore}
                            </Text>
                        </Text>

                        <Text style={styles.cardTags}>Tags: {item.tags}</Text>
                        <Text style={styles.cardText}>{item.text}</Text>
                        <Text style={styles.cardShared}>
                            Shared: {item.shared ? "Yes" : "No"}
                        </Text>
                    </View>
                )}
            />

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Journal Entry</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Write your thoughts..."
                            multiline
                            value={newText}
                            onChangeText={setNewText}
                        />

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Tags"
                            value={tags}
                            onChangeText={setTags}
                        />

                        <View style={styles.moodContainer}>
                            <Text>Mood Score (1–5): {moodScore}</Text>
                            <View style={styles.moodButtons}>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[
                                            styles.moodButton,
                                            moodScore === num && {
                                                backgroundColor: "#7C3AED",
                                            },
                                        ]}
                                        onPress={() => setMoodScore(num)}
                                    >
                                        <Text
                                            style={[
                                                styles.moodButtonText,
                                                moodScore === num && { color: "white" },
                                            ]}
                                        >
                                            {num}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.sharedContainer}>
                            <Text>Share with therapist:</Text>
                            <Switch value={shared} onValueChange={setShared} />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#7C3AED" }]}
                                onPress={handleAddEntry}
                            >
                                <Text style={styles.modalButtonText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#E5E7EB" }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: "#111827" }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* STYLES UNCHANGED */
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
    titleSection: { marginBottom: 16 },
    title: { fontSize: 22, fontWeight: "700" },
    sparkle: { color: "#8B5CF6" },
    subtitle: { color: "#6B7280", marginTop: 6 },
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
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cardDate: { fontWeight: "600" },
    cardMood: { color: "#6B7280" },
    cardTags: { fontStyle: "italic", color: "#6B7280" },
    cardText: { marginVertical: 6 },
    cardShared: { fontSize: 12, color: "#6B7280" },
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
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
    modalInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    moodContainer: { marginBottom: 12 },
    moodButtons: { flexDirection: "row", marginTop: 6 },
    moodButton: {
        padding: 8,
        marginRight: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    moodButtonText: { fontWeight: "600" },
    sharedContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    modalButtons: { flexDirection: "row" },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 4,
    },
    modalButtonText: { fontWeight: "600", color: "white" },
});
