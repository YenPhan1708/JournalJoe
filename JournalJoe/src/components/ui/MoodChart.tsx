// components/ui/MoodChart.tsx
import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

type Props = {
    data: number[];
    labels?: string[];
    height?: number;
};

export default function MoodChart({ data, labels = [], height = 220 }: Props) {
    const screenWidth = Math.min(Dimensions.get("window").width, 420);
    const chartData = {
        labels,
        datasets: [{ data }],
    };

    return (
        <View>
            <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={height}
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fbf8ff",
                    backgroundGradientTo: "#f8fbff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#7C3AED" },
                }}
                bezier
                style={{ borderRadius: 16 }}
            />
        </View>
    );
}
