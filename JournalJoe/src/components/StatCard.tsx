import { Text, StyleSheet, Animated, View, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../theme/colors";
import { useEffect, useRef, useState } from "react";

interface StatCardProps {
    icon: string;
    value: number | string;
    label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
    const scale = useRef(new Animated.Value(0.9)).current;
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    }, []);

    const handlePress = () => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000); // hide after 2s
    };

    return (
        <View style={{ flex: 1, alignItems: "center", margin: 4 }}>
            <Pressable onPress={handlePress}>
                <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                    <Ionicons name={icon} size={20} color={COLORS.primary} style={{ marginBottom: 6 }} />
                    <Text style={styles.value}>{value}</Text>
                    <Text style={styles.label}>{label}</Text>
                </Animated.View>
            </Pressable>
            {showTooltip && (
                <View style={styles.tooltip}>
                    <Text>{`${label}: ${value}`}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    value: { fontSize: 18, fontWeight: "700", color: COLORS.text },
    label: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: "center" },
    tooltip: {
        position: "absolute",
        bottom: "100%",
        backgroundColor: COLORS.card,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 6,
    },
});
