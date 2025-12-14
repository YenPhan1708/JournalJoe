// components/ui/Checkbox.tsx
import React from "react";
import { Pressable, View, Text } from "react-native";
import { Check } from "lucide-react-native";

type Props = {
    label?: string;
    checked: boolean;
    onToggle: () => void;
};

export default function Checkbox({ label, checked, onToggle }: Props) {
    return (
        <Pressable onPress={onToggle} className="flex-row items-center">
            <View className={`w-5 h-5 rounded-md items-center justify-center ${checked ? "bg-purple-600" : "border border-gray-300 bg-white"}`}>
                {checked ? <Check size={14} color="white" /> : null}
            </View>
            {label ? <Text className="ml-3 text-base text-gray-700">{label}</Text> : null}
        </Pressable>
    );
}
