// components/patient/PatientProfile.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PatientProfileProps {
    user?: { id?: string; name?: string; email?: string };
    onLogout?: () => void;
}

export function PatientProfile({ user, onLogout }: PatientProfileProps) {
    return (
        <View className="p-4">
            <Text className="text-2xl mb-2">Profile</Text>
            <Text className="text-sm text-gray-600 mb-4">Name: {user?.name ?? "Patient"}</Text>

            <TouchableOpacity onPress={onLogout} className="py-3 px-4 bg-red-500 rounded-lg">
                <Text className="text-white">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
