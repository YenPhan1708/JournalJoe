import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { COLORS } from "../theme/colors";
import { auth, db } from "../services/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function CoachCard() {
    const [expanded, setExpanded] = useState(false);
    const [message, setMessage] = useState(
        "Hey! 👋 I’ve been reviewing your journal entries, and I’m proud of your consistency. You’ve been showing up for yourself — let’s look at your patterns together."
    );

    const user = auth.currentUser;
    const uid = user?.uid;

    useEffect(() => {
        const fetchJoeMessage = async () => {
            if (!uid) return;

            try {
                // Fetch recent journal entries
                const q = query(
                    collection(db, "journals"),
                    where("userId", "==", uid),
                    orderBy("createdAt", "desc")
                );

                const snap = await getDocs(q);
                const recentEntries = snap.docs
                    .map((d) => d.data()?.text)
                    .filter(Boolean)
                    .slice(0, 5); // take last 5 entries

                // Call Joe API
                const res = await fetch("http://192.168.1.72:3000/api/joe-message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ previousEntries: recentEntries }),
                });

                const data = await res.json();
                if (data.message) setMessage(data.message);
            } catch (err) {
                console.error("Failed to fetch Joe message:", err);
            }
        };

        fetchJoeMessage();
    }, [uid]);

    return (
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.card}>
            <Text style={styles.title}>Joe says:</Text>
            <Text style={styles.text} numberOfLines={expanded ? undefined : 3}>
                {message}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.primarySoft,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    title: {
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 6,
    },
    text: {
        color: COLORS.text,
        lineHeight: 20,
    },
});
