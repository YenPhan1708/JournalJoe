// app/therapist/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LayoutDashboard, Users, Calendar, User as UserIcon, LogOut } from "lucide-react-native";
import { TherapistDashboard } from "../../components/therapist/TherapistDashboard";
import { TherapistPatients } from "../../components/therapist/TherapistPatients";
import { TherapistCalendar } from "../../components/therapist/TherapistCalendar";
import { TherapistProfile } from "../../components/therapist/TherapistProfile";

export default function TherapistRoot() {
    type TherapistView = "dashboard" | "patients" | "calendar" | "profile";
    const [activeView, setActiveView] = useState<TherapistView>("dashboard");

    const renderView = () => {
        switch (activeView) {
            case "dashboard":
                return <TherapistDashboard />;
            case "patients":
                return <TherapistPatients />;
            case "calendar":
                return <TherapistCalendar />;
            case "profile":
                return <TherapistProfile />;
            default:
                return <TherapistDashboard />;
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white border-b border-gray-200 px-4 py-3">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg">MindfulPath Pro</Text>
                        <Text className="text-sm text-gray-600">Therapist</Text>
                    </View>
                    <TouchableOpacity className="p-2">
                        <LogOut size={18} color="#4B5563" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 p-4">{renderView()}</View>

            <View className="flex-row items-center justify-around bg-white border-t border-gray-200 px-4 py-2">
                <TouchableOpacity onPress={() => setActiveView("dashboard")} className="items-center">
                    <LayoutDashboard size={20} />
                    <Text className={`text-xs ${activeView === "dashboard" ? "text-purple-600" : "text-gray-500"}`}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView("patients")} className="items-center">
                    <Users size={20} />
                    <Text className={`text-xs ${activeView === "patients" ? "text-purple-600" : "text-gray-500"}`}>Patients</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView("calendar")} className="items-center">
                    <Calendar size={20} />
                    <Text className={`text-xs ${activeView === "calendar" ? "text-purple-600" : "text-gray-500"}`}>Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView("profile")} className="items-center">
                    <UserIcon size={20} />
                    <Text className={`text-xs ${activeView === "profile" ? "text-purple-600" : "text-gray-500"}`}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
