// components/ExpandableTips.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { COLORS } from "../theme/colors";

interface ExpandableTipsProps {
    title: string;
    tips: string[];
}

export default function ExpandableTips({ title, tips }: ExpandableTipsProps) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <View style={styles.block}>
            <TouchableOpacity onPress={() => setOpen(!open)}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>

            {open &&
                tips.map((t: string, i: number) => (
                    <Text key={i} style={styles.tip}>
                        • {t}
                    </Text>
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        marginBottom: 12,
    },
    title: {
        fontWeight: "600",
        marginBottom: 6,
    },
    tip: {
        color: COLORS.text,
        lineHeight: 20,
    },
});
