import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface MoodPoint {
    label: string;
    entries: number;
}

interface Props {
    data: MoodPoint[];
}

const CHART_HEIGHT = 200;
const AXIS_HEIGHT = 40;
const SVG_HEIGHT = CHART_HEIGHT + AXIS_HEIGHT + 10;
const MARGIN = 32;

export default function MoodChart({ data }: Props) {
    const animation = useRef(new Animated.Value(0)).current;
    const tooltipOpacity = useRef(new Animated.Value(0)).current;

    const [chartWidth, setChartWidth] = useState(0);
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number;
        label: string;
    } | null>(null);

    const maxValue = Math.max(...data.map(d => d.entries), 1);

    /* ---------- Points ---------- */
    const points = useMemo(() => {
        if (!chartWidth || data.length < 1) return [];
        const stepX =
            data.length > 1
                ? (chartWidth - MARGIN * 2) / (data.length - 1)
                : 0;

        return data.map((d, i) => ({
            x: MARGIN + i * stepX,
            y: CHART_HEIGHT - (d.entries / maxValue) * (CHART_HEIGHT - 24),
            ...d,
        }));
    }, [data, maxValue, chartWidth]);

    /* ---------- Smooth Curve (endpoint-safe) ---------- */
    const pathD = useMemo(() => {
        if (points.length < 2) return "";
        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] ?? points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 =
                points[i + 2] ??
                { x: p2.x + (p2.x - p1.x), y: p2.y };

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }, [points]);

    /* ---------- Animate Line (resolution-independent) ---------- */
    useEffect(() => {
        if (!pathD) return;
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
        Animated.timing(tooltipOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();

        setTimeout(() => {
            Animated.timing(tooltipOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start(() => setTooltip(null));
        }, 2000);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Mood Trend</Text>

            <View
                style={{ width: "100%" }}
                onLayout={e => setChartWidth(e.nativeEvent.layout.width)}
            >
                {chartWidth > 0 && (
                    <View style={{ width: "100%", height: SVG_HEIGHT }}>
                        <Svg
                            width="100%"
                            height={SVG_HEIGHT}
                            viewBox={`0 0 ${chartWidth} ${SVG_HEIGHT}`}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Y grid + numbers */}
                            {Array.from({ length: Math.ceil(maxValue) + 1 }).map((_, i) => {
                                const y =
                                    CHART_HEIGHT -
                                    (i / maxValue) * (CHART_HEIGHT - 24);
                                return (
                                    <React.Fragment key={i}>
                                        <Line
                                            x1={MARGIN}
                                            x2={chartWidth - MARGIN}
                                            y1={y}
                                            y2={y}
                                            stroke="#E6E6FF"
                                            strokeDasharray="4"
                                        />
                                        <SvgText
                                            x={MARGIN - 8}
                                            y={y + 4}
                                            fontSize={11}
                                            fill="#666"
                                            textAnchor="end"
                                        >
                                            {i}
                                        </SvgText>
                                    </React.Fragment>
                                );
                            })}

                            {/* X axis */}
                            <Line
                                x1={MARGIN}
                                x2={chartWidth - MARGIN}
                                y1={CHART_HEIGHT}
                                y2={CHART_HEIGHT}
                                stroke="#AAA"
                                strokeWidth={1}
                            />

                            {/* Animated line — GUARANTEED to reach endpoint */}
                            <AnimatedPath
                                d={pathD}
                                stroke="#6C63FF"
                                strokeWidth={3}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                {...({ pathLength: 1 } as any)}
                                strokeDasharray="1"
                                strokeDashoffset={animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0],
                                })}
                            />


                            {/* X labels */}
                            {points.map((p, i) => (
                                <SvgText
                                    key={i}
                                    x={p.x}
                                    y={CHART_HEIGHT + 32}
                                    fontSize={11}
                                    fill="#555"
                                    textAnchor="end"
                                    rotation={-30}
                                    origin={`${p.x}, ${CHART_HEIGHT + 32}`}
                                >
                                    {p.label}
                                </SvgText>
                            ))}
                        </Svg>

                        {/* Dots */}
                        {points.map((p, i) => (
                            <Pressable
                                key={i}
                                onPress={() => showTooltip(p)}
                                style={{
                                    position: "absolute",
                                    left: p.x - 14,
                                    top: p.y - 14,
                                    width: 28,
                                    height: 28,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <View style={styles.dot} />
                            </Pressable>
                        ))}

                        {/* Tooltip */}
                        {tooltip && (
                            <Animated.View
                                style={[
                                    styles.tooltip,
                                    {
                                        opacity: tooltipOpacity,
                                        left: Math.min(
                                            Math.max(tooltip.x - 60, 8),
                                            chartWidth - 120
                                        ),
                                        top: Math.max(tooltip.y - 80, 8),
                                    },
                                ]}
                            >
                                <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                                <Text style={styles.tooltipValue}>
                                    Mood Score: {tooltip.value.toFixed(1)}
                                </Text>
                            </Animated.View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#6C63FF",
        borderWidth: 2,
        borderColor: "#FFF",
    },
    tooltip: {
        position: "absolute",
        width: 120,
        backgroundColor: "#FFF",
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#DDD",
        alignItems: "center",
    },
    tooltipLabel: {
        fontWeight: "600",
        marginBottom: 4,
        color: "#000",
    },
    tooltipValue: {
        fontSize: 12,
        color: "#333",
    },
});
