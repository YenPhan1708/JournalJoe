// components/ui/Card.tsx
import React from "react";
import { View, ViewProps } from "react-native";

type Props = ViewProps & {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "", style, ...rest }: Props) {
    return (
        <View
            {...rest}
            className={`bg-white rounded-2xl p-4 shadow-md ${className}`}
            style={[{ elevation: 2 }, style] as any}
        >
            {children}
        </View>
    );
}
