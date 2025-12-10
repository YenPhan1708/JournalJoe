// components/patient/PatientJournal.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { JournalList } from "./JournalList";
import { JournalEditor } from "./JournalEditor";

export function PatientJournal() {
    const [isWriting, setIsWriting] = useState(false);

    if (isWriting) {
        return <JournalEditor onClose={() => setIsWriting(false)} />;
    }

    return (
        <View className="p-4">
            <View className="mb-6">
                <Text className="text-2xl mb-2">My Journal</Text>
                <Text className="text-sm text-gray-600">Write, reflect and share with your therapist as needed.</Text>
            </View>

            <TouchableOpacity
                onPress={() => setIsWriting(true)}
                className="w-full py-4 mb-6 bg-purple-600 text-white rounded-lg flex-row items-center justify-center gap-2"
            >
                <Plus size={16} color="white" />
                <Text className="text-white font-medium">New Entry</Text>
            </TouchableOpacity>

            <JournalList />
        </View>
    );
}
