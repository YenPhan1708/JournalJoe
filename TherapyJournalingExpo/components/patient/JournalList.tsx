// components/patient/JournalList.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Lock, Share2, ChevronDown, ChevronUp, Sparkles, Smile, Meh, Frown, CloudRain } from "lucide-react-native";
import { mockJournalEntries } from "@/data/mockData"; // keep or adapt your mock data path

const moodIcons: Record<string, any> = {
    great: Sparkles,
    good: Smile,
    okay: Meh,
    low: Frown,
    difficult: CloudRain,
};

const moodColors: Record<string, string> = {
    great: "text-green-600 bg-green-50",
    good: "text-blue-600 bg-blue-50",
    okay: "text-yellow-600 bg-yellow-50",
    low: "text-orange-600 bg-orange-50",
    difficult: "text-red-600 bg-red-50",
};

export function JournalList() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const entries = mockJournalEntries
        .filter((e) => e.patientId === "patient-1")
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    if (entries.length === 0) {
        return (
            <View className="text-center py-12">
                <Text className="text-gray-500">No journal entries yet.</Text>
                <Text className="text-sm text-gray-400 mt-1">Start writing to track your journey.</Text>
            </View>
        );
    }

    return (
        <View className="space-y-3">
            {entries.map((entry) => {
                const MoodIcon = moodIcons[entry.mood];
                const isExpanded = expandedId === entry.id;
                return (
                    <View key={entry.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <TouchableOpacity
                            onPress={() => setExpandedId(isExpanded ? null : entry.id)}
                            className="w-full p-4"
                        >
                            <View className="flex-row items-start justify-between mb-2">
                                <View className="flex-row items-center gap-2">
                                    <View className={`p-2 rounded-lg ${moodColors[entry.mood]}`}>
                                        <MoodIcon size={14} />
                                    </View>
                                    <View>
                                        <Text className="text-sm">{formatDate(entry.date)}</Text>
                                        <Text className="text-xs text-gray-500">{formatTime(entry.date)}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-2">
                                    {entry.sharedWithTherapist ? <Share2 size={14} color="#7C3AED" /> : <Lock size={14} color="#9CA3AF" />}
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </View>
                            </View>

                            <Text className="text-sm text-gray-600 numberOfLines-2">{entry.content}</Text>
                        </TouchableOpacity>

                        {isExpanded && (
                            <View className="px-4 pb-4 border-t border-gray-100">
                                <Text className="text-sm mt-4">{entry.content}</Text>

                                {entry.sharedWithTherapist && entry.aiSummary && (
                                    <View className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                        <Text className="text-xs text-purple-900 mb-1">AI-Generated Summary</Text>
                                        <Text className="text-xs text-purple-800">{entry.aiSummary}</Text>

                                        {entry.aiTopics && entry.aiTopics.length > 0 && (
                                            <View className="flex-row flex-wrap gap-1 mt-2">
                                                {entry.aiTopics.map((topic: string) => (
                                                    <View key={topic} className="px-2 py-1 bg-purple-100 rounded mr-1">
                                                        <Text className="text-xs text-purple-700">{topic}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
}
