// app/patient/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, TrendingUp, Calendar, User as UserIcon, LogOut } from "lucide-react-native";
import { PatientJournal } from "@/components/patient/PatientJournal";
import { PatientInsights } from "../../components/patient/PatientInsights";
import { PatientSessions } from "../../components/patient/PatientSessions";
import { PatientProfile } from "../../components/patient/PatientProfile";

export default function PatientRoot() {
    type PatientView = "journal" | "insights" | "sessions" | "profile";
    const [activeView, setActiveView] = useState<PatientView>("journal");

    const renderView = () => {
        switch (activeView) {
            case "journal":
                return <PatientJournal />;
            case "insights":
                return <PatientInsights />;
            case "sessions":
                return <PatientSessions />;
            case "profile":
                return <PatientProfile />;
            default:
                return <PatientJournal />;
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-4 py-3">
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg">Hello, Patient</Text>
                    <TouchableOpacity className="p-2">
                        <LogOut size={18} color="#4B5563" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 p-4">{renderView()}</View>

            {/* Bottom Nav */}
            <View className="flex-row items-center justify-around bg-white border-t border-gray-200 px-4 py-2">
                <TouchableOpacity onPress={() => setActiveView("journal")} className="items-center">
                    <BookOpen size={20} />
                    <Text className={`text-xs ${activeView === "journal" ? "text-purple-600" : "text-gray-500"}`}>Journal</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView("insights")} className="items-center">
                    <TrendingUp size={20} />
                    <Text className={`text-xs ${activeView === "insights" ? "text-purple-600" : "text-gray-500"}`}>Insights</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView("sessions")} className="items-center">
                    <Calendar size={20} />
                    <Text className={`text-xs ${activeView === "sessions" ? "text-purple-600" : "text-gray-500"}`}>Sessions</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView("profile")} className="items-center">
                    <UserIcon size={20} />
                    <Text className={`text-xs ${activeView === "profile" ? "text-purple-600" : "text-gray-500"}`}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
