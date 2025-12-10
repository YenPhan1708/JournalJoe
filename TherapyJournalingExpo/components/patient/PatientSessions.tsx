// components/patient/PatientSessions.tsx
import React from "react";
import { View, Text } from "react-native";

export function PatientSessions() {
    return (
        <View className="p-4">
            <Text className="text-2xl mb-2">Sessions</Text>
            <Text className="text-sm text-gray-600">Upcoming and past sessions are listed here.</Text>
        </View>
    );
}
