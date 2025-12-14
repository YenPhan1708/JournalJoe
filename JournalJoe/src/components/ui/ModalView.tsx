// components/ui/ModalView.tsx
import React from "react";
import { Modal, View, Pressable, Text } from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
};

export default function ModalView({ visible, onClose, children, title }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-2xl p-4">
                    <View className="flex-row justify-between items-center mb-3">
                        {title ? <Text className="text-lg font-medium">{title}</Text> : <View />}
                        <Pressable onPress={onClose} className="p-2">
                            <Text className="text-purple-600">Close</Text>
                        </Pressable>
                    </View>
                    {children}
                </View>
            </View>
        </Modal>
    );
}
