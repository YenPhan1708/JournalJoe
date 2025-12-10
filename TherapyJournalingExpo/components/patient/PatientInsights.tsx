// components/patient/PatientInsights.tsx
import React from "react";
import { View, Text } from "react-native";

export function PatientInsights() {
    return (
        <View className="p-4">
            <Text className="text-2xl mb-2">Insights</Text>
            <Text className="text-sm text-gray-600">AI summaries, trends and mood graphs will appear here.</Text>
        </View>
    );
}
