// components/CoachCard.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { COLORS } from "../theme/colors";

export default function CoachCard() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.card}>
            <Text style={styles.title}>Joe says:</Text>
            <Text style={styles.text} numberOfLines={expanded ? undefined : 3}>
                Hey! 👋 I’ve been reviewing your journal entries, and I’m proud of your
                consistency. You’ve been showing up for yourself — let’s look at your
                patterns together.
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
