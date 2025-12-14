import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface IconButtonProps {
    icon?: LucideIcon;
    label: string;
}

export default function IconButton({ icon: Icon, label }: IconButtonProps) {
    return (
        <TouchableOpacity className="flex-row items-center gap-2 p-3 bg-blue-600 rounded-lg">
            {Icon && <Icon size={20} color="white" />}
            <Text className="text-white font-semibold">{label}</Text>
        </TouchableOpacity>
    );
}
