import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Pressable,
    SafeAreaView,
} from "react-native";

const ACCENT = "#8A4EAF";

const mockMessages = [
    {
        id: "1",
        sender: "Joe",
        text: "Hey there! 👋 I'm Joe, your friendly journaling companion. I'm here to chat, offer encouragement, and help you reflect on your thoughts and feelings.",
        time: "11:02 PM",
    },
    {
        id: "2",
        sender: "Joe",
        text: "How are you doing today?",
        time: "11:02 PM",
    },
    {
        id: "3",
        sender: "User",
        text: "I'm feeling a bit overwhelmed with school work.",
        time: "11:03 PM",
    },
];

export default function ChatWithJoe() {
    const [message, setMessage] = useState("");

    return (
        <SafeAreaView style={styles.safe}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>J</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Chat with Joe</Text>
                    <Text style={styles.headerSubtitle}>
                        Your supportive companion (non-clinical)
                    </Text>
                </View>
            </View>

            {/* CHAT CONTENT */}
            <FlatList
                data={mockMessages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isUser = item.sender === "User";

                    return (
                        <View
                            style={[
                                styles.messageWrapper,
                                isUser ? styles.alignRight : styles.alignLeft,
                            ]}
                        >
                            <View
                                style={[
                                    styles.bubble,
                                    isUser ? styles.userBubble : styles.joeBubble,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        isUser ? styles.userText : styles.joeText,
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            </View>

                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                    );
                }}
            />

            {/* INPUT AREA */}
            <View style={styles.bottomArea}>
                {/* DISCLAIMER */}
                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        ⭐ Remember: Joe provides supportive conversation only. Share clinical
                        concerns with your therapist.
                    </Text>
                </View>

                {/* INPUT */}
                <View style={styles.inputRow}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type your message..."
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                    />

                    <Pressable style={styles.sendButton}>
                        <Text style={styles.sendIcon}>➤</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    /* HEADER */
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "white",
        fontWeight: "700",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },

    /* CHAT */
    chatContainer: {
        padding: 16,
        paddingBottom: 140,
    },
    messageWrapper: {
        marginBottom: 14,
        maxWidth: "85%",
    },
    alignLeft: {
        alignSelf: "flex-start",
    },
    alignRight: {
        alignSelf: "flex-end",
    },
    bubble: {
        borderRadius: 16,
        padding: 12,
    },
    joeBubble: {
        backgroundColor: "#F3F4F6",
    },
    userBubble: {
        backgroundColor: ACCENT,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    joeText: {
        color: "#111827",
    },
    userText: {
        color: "#FFFFFF",
    },
    time: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 4,
    },

    /* BOTTOM */
    bottomArea: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
    },
    disclaimer: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    disclaimerText: {
        fontSize: 11,
        color: ACCENT,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    input: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 14,
        color: "#111827",
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    sendIcon: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
});
