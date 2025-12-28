import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface MoodPoint {
    label: string;
    entries: number;
}

interface Props {
    data: MoodPoint[];
}

const { width } = Dimensions.get("window");

const CHART_HEIGHT = 200;
const AXIS_HEIGHT = 40;
const SVG_HEIGHT = CHART_HEIGHT + AXIS_HEIGHT + 10;
const CHART_WIDTH = width - 32;
const MARGIN = 32;

export default function MoodChart({ data }: Props) {
    const animation = useRef(new Animated.Value(0)).current;
    const tooltipOpacity = useRef(new Animated.Value(0)).current;
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number;
        label: string;
    } | null>(null);

    const maxValue = Math.max(...data.map(d => d.entries), 1);

    /* ---------- Points ---------- */
    const points = useMemo(() => {
        if (data.length < 1) return [];
        const stepX = data.length > 1 ? (CHART_WIDTH - MARGIN * 2) / (data.length - 1) : 0;
        return data.map((d, i) => ({
            x: MARGIN + i * stepX,
            y: CHART_HEIGHT - (d.entries / maxValue) * (CHART_HEIGHT - 24),
            ...d,
        }));
    }, [data, maxValue]);

    /* ---------- Smooth Curve ---------- */
    const pathD = useMemo(() => {
        if (points.length < 2) return "";
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] ?? points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] ?? p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }, [points]);

    /* ---------- Animate Line ---------- */
    useEffect(() => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: 900,
            useNativeDriver: false,
        }).start();
    }, [pathD]);

    /* ---------- Tooltip ---------- */
    const showTooltip = (p: typeof points[number]) => {
        setTooltip({ x: p.x, y: p.y, value: p.entries, label: p.label });
        tooltipOpacity.setValue(0);
        Animated.timing(tooltipOpacity, { toValue: 1, duration: 150, useNativeDriver: false }).start();
        setTimeout(() => {
            Animated.timing(tooltipOpacity, { toValue: 0, duration: 150, useNativeDriver: false }).start(() => setTooltip(null));
        }, 2000);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Mood Trend</Text>

            <View style={{ width: CHART_WIDTH, height: SVG_HEIGHT, overflow: "visible" }}>
                <Svg width={CHART_WIDTH} height={SVG_HEIGHT}>
                    {/* Y grid + numbers */}
                    {Array.from({ length: Math.ceil(maxValue) + 1 }).map((_, i) => {
                        const y = CHART_HEIGHT - (i / maxValue) * (CHART_HEIGHT - 24);
                        return (
                            <React.Fragment key={i}>
                                <Line x1={MARGIN} x2={CHART_WIDTH - MARGIN} y1={y} y2={y} stroke="#E6E6FF" strokeDasharray="4" />
                                <SvgText x={MARGIN - 8} y={y + 4} fontSize={11} fill="#666" textAnchor="end">{i}</SvgText>
                            </React.Fragment>
                        );
                    })}

                    {/* X axis */}
                    <Line x1={MARGIN} x2={CHART_WIDTH - MARGIN} y1={CHART_HEIGHT} y2={CHART_HEIGHT} stroke="#AAA" strokeWidth={1} />

                    {/* Animated line */}
                    <AnimatedPath d={pathD} stroke="#6C63FF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round"
                                  strokeDasharray={1000}
                                  strokeDashoffset={animation.interpolate({ inputRange: [0, 1], outputRange: [1000, 0] })}
                    />

                    {/* X labels */}
                    {points.map((p, i) => (
                        <SvgText key={i} x={p.x} y={CHART_HEIGHT + 26} fontSize={11} fill="#555" textAnchor="middle">{p.label}</SvgText>
                    ))}
                </Svg>

                {/* Dots */}
                {points.map((p, i) => (
                    <Pressable key={i} onPress={() => showTooltip(p)} style={{ position: "absolute", left: p.x - 14, top: p.y - 14, width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
                        <View style={styles.dot} />
                    </Pressable>
                ))}

                {/* Tooltip */}
                {tooltip && (
                    <Animated.View style={[styles.tooltip, {
                        opacity: tooltipOpacity,
                        left: Math.min(Math.max(tooltip.x - 50, 0), CHART_WIDTH - 100),
                        top: Math.max(tooltip.y - 70, 0),
                    }]}>
                        <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                        <Text style={styles.tooltipValue}>Mood Score: {tooltip.value.toFixed(1)}</Text>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16 },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#6C63FF" },
    tooltip: { position: "absolute", width: 100, backgroundColor: "#FFF", padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "#DDD", alignItems: "center" },
    tooltipLabel: { fontWeight: "600", marginBottom: 4, color: "#000" },
    tooltipValue: { fontSize: 12, color: "#333" },
});
