// components/ui/Button.tsx
import React from "react";
import { Text, Pressable, PressableProps } from "react-native";

type Props = PressableProps & {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
};

export default function Button({ children, variant = "primary", className = "", style, ...rest }: Props) {
    let base = "py-3 px-4 rounded-xl items-center justify-center";
    let variants: Record<string, string> = {
        primary: "bg-purple-600",
        secondary: "bg-gray-200",
        ghost: "bg-transparent",
    };

    let textVariants: Record<string, string> = {
        primary: "text-white font-medium",
        secondary: "text-gray-800 font-medium",
        ghost: "text-purple-600 font-medium",
    };

    return (
        <Pressable
            {...rest}
            className={`${base} ${variants[variant]} ${className}`}
            style={style as any}
        >
            <Text className={textVariants[variant]}>{children}</Text>
        </Pressable>
    );
}
