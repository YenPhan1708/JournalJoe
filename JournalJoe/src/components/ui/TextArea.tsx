// components/ui/TextArea.tsx
import React from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

type Props = TextInputProps & {
    label?: string;
    rows?: number;
    className?: string;
};

export default function TextArea({ label, rows = 4, className = "", style, ...rest }: Props) {
    return (
        <View className="w-full">
            {label ? <Text className="mb-1 text-sm text-gray-700">{label}</Text> : null}
            <TextInput
                {...rest}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 bg-white ${className}`}
                multiline
                numberOfLines={rows}
                textAlignVertical="top"
                style={[{ minHeight: rows * 20 }, style] as any}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );
}
