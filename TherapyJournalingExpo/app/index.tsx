// app/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { router } from "expo-router";
import { UserRole } from "../types/UserRole";


const MOCK_USERS = {
    patient: {
        id: "patient-1",
        name: "Emma Wilson",
        email: "emma@example.com",
        role: "patient" as UserRole,
    },
    therapist: {
        id: "therapist-1",
        name: "Dr. Sarah Mitchell",
        email: "dr.mitchell@example.com",
        role: "therapist" as UserRole,
    },
};

export default function LoginScreen() {
    const [selectedRole, setSelectedRole] = useState<"patient" | "therapist">(
        "patient"
    );

    const handleLogin = () => {
        // In a real app: persist user, token, etc.
        // For now navigate to role's root route
        if (selectedRole === "patient") {
            router.replace("/patient");
        } else {
            router.replace("/therapist");
        }
    };

    return (
        <View className="flex-1 bg-blue-50 justify-center items-center p-6">
            <View className="w-full max-w-md">
                <View className="items-center mb-8">
                    <View className="w-16 h-16 bg-purple-600 rounded-full justify-center items-center mb-4">
                        <Heart size={32} color="white" />
                    </View>

                    <Text className="text-3xl font-semibold mb-1">MindfulPath</Text>
                    <Text className="text-gray-600">Therapy-Support Journaling</Text>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-md">
                    <View className="mb-6">
                        <Text className="text-sm mb-3">Login as:</Text>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setSelectedRole("patient")}
                                className={`flex-1 py-3 rounded-lg border-2 items-center ${
                                    selectedRole === "patient"
                                        ? "border-purple-600 bg-purple-50"
                                        : "border-gray-300"
                                }`}
                            >
                                <Text
                                    className={
                                        selectedRole === "patient" ? "text-purple-700" : "text-gray-700"
                                    }
                                >
                                    Patient
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedRole("therapist")}
                                className={`flex-1 py-3 rounded-lg border-2 items-center ${
                                    selectedRole === "therapist"
                                        ? "border-purple-600 bg-purple-50"
                                        : "border-gray-300"
                                }`}
                            >
                                <Text
                                    className={
                                        selectedRole === "therapist"
                                            ? "text-purple-700"
                                            : "text-gray-700"
                                    }
                                >
                                    Therapist
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="bg-gray-50 rounded-lg p-4 mb-4">
                        <Text className="text-sm text-gray-600 mb-2">Demo account:</Text>

                        <Text className="text-sm">
                            <Text className="text-gray-500">Name: </Text>
                            {MOCK_USERS[selectedRole].name}
                        </Text>

                        <Text className="text-sm">
                            <Text className="text-gray-500">Email: </Text>
                            {MOCK_USERS[selectedRole].email}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        className="w-full py-3 bg-purple-600 rounded-lg items-center"
                    >
                        <Text className="text-white font-medium">
                            Continue as {selectedRole === "patient" ? "Patient" : "Therapist"}
                        </Text>
                    </TouchableOpacity>

                    <View className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Text className="text-xs text-yellow-800">
                            <Text className="font-bold">Disclaimer:</Text> Prototype only — not for
                            real patient data or clinical use.
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
