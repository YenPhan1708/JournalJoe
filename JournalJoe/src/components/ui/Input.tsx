// components/ui/Input.tsx
import React from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

type Props = TextInputProps & {
    label?: string;
    error?: string;
    className?: string;
};

export default function Input({ label, error, className = "", style, ...rest }: Props) {
    return (
        <View className="w-full">
            {label ? <Text className="mb-1 text-sm text-gray-700">{label}</Text> : null}
            <TextInput
                {...rest}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 bg-white ${className}`}
                style={style as any}
                placeholderTextColor="#9CA3AF"
            />
            {error ? <Text className="text-xs text-red-600 mt-1">{error}</Text> : null}
        </View>
    );
}
