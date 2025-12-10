// components/patient/JournalEditor.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { X, Lock, Share2, Smile, Meh, Frown, CloudRain, Sparkles } from "lucide-react-native";

interface JournalEditorProps {
    onClose: () => void;
}

type Mood = "great" | "good" | "okay" | "low" | "difficult";

const moodOptions: { value: Mood; label: string; icon: any }[] = [
    { value: "great", label: "Great", icon: Sparkles },
    { value: "good", label: "Good", icon: Smile },
    { value: "okay", label: "Okay", icon: Meh },
    { value: "low", label: "Low", icon: Frown },
    { value: "difficult", label: "Difficult", icon: CloudRain },
];

export function JournalEditor({ onClose }: JournalEditorProps) {
    const [content, setContent] = useState("");
    const [mood, setMood] = useState<Mood>("okay");
    const [sharedWithTherapist, setSharedWithTherapist] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 500);
    };

    const canSave = content.trim().length > 0;

    return (
        <View className="flex-1 bg-white">
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={onClose} className="p-2">
                    <X size={18} />
                </TouchableOpacity>
                <Text className="text-sm text-gray-600">New Entry</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!canSave || isSaving}
                    className="px-4 py-2 bg-purple-600 rounded-lg"
                >
                    <Text className="text-white text-sm">{isSaving ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-sm mb-3">How are you feeling?</Text>
                    <View className="flex-row justify-between">
                        {moodOptions.map((option) => {
                            const Icon = option.icon;
                            const selected = mood === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => setMood(option.value)}
                                    className={`flex-1 items-center py-3 mx-1 rounded-lg border ${selected ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
                                >
                                    <Icon size={20} color={selected ? "#7C3AED" : "#111827"} />
                                    <Text className="text-xs mt-1">{option.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm mb-2">What's on your mind?</Text>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="Write your thoughts here... You're in a safe space."
                        multiline
                        numberOfLines={12}
                        className="w-full p-4 border border-gray-300 rounded-lg text-base"
                    />
                    <Text className="text-xs text-gray-500 mt-2">{content.length} characters</Text>
                </View>

                <View className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <TouchableOpacity onPress={() => setSharedWithTherapist((s) => !s)} className="w-full flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            {sharedWithTherapist ? (
                                <Share2 size={18} color="#7C3AED" />
                            ) : (
                                <Lock size={18} color="#9CA3AF" />
                            )}
                            <View>
                                <Text className="text-sm">{sharedWithTherapist ? "Shared with therapist" : "Private entry"}</Text>
                                <Text className="text-xs text-gray-500">{sharedWithTherapist ? "Your therapist can view this entry" : "Only you can see this entry"}</Text>
                            </View>
                        </View>
                        <View className={`w-12 h-6 rounded-full ${sharedWithTherapist ? "bg-purple-600" : "bg-gray-300"}`} />
                    </TouchableOpacity>
                </View>

                <View className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Text className="text-xs text-blue-800">
                        <Text className="font-bold">Remember:</Text> This journal is a tool for self-reflection and communication with your therapist. It does not replace professional care or emergency services.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
