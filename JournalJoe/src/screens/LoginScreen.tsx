import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { HeartHandshake } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { auth, db } from "../services/firebase";
import { RootStackParamList } from "../../App";

type LoginScreenNavProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login"
>;

interface Props {
    navigation: LoginScreenNavProp;
}

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // For inline error messages

    const handleLogin = async () => {
        if (!email || !password) {
            setError("There is something wrong with the Email or Password");
            return;
        }

        try {
            setLoading(true);
            setError(""); // Clear previous errors

            // 1️⃣ Firebase Auth
            const cred = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            const uid = cred.user.uid;

            // 2️⃣ Fetch user profile from Firestore
            const userRef = doc(db, "users", uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                setError("User profile not found");
                return;
            }

            const userData = snap.data();

            // 3️⃣ Route by role
            if (userData.role === "therapist") {
                navigation.replace("Therapist");
            } else {
                navigation.replace("Patient");
            }
        } catch (error: any) {
            console.log(error.code, error.message);
            setError(error.message); // Show Firebase error in red box
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoCircle}>
                <HeartHandshake size={36} color="white" />
            </View>

            <Text style={styles.title}>Journal Joe</Text>
            <Text style={styles.subtitle}>
                Your therapy-support companion
            </Text>

            {/* Card */}
            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Error Box */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        <Text style={styles.bold}>Disclaimer:</Text> Prototype only.
                        Not for real therapy or patient data.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    logoCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#5B21B6",
    },

    subtitle: {
        color: "#6B7280",
        marginBottom: 20,
    },

    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        elevation: 6,
    },

    label: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 6,
        marginTop: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        marginBottom: 10,
    },

    button: {
        backgroundColor: "#7C3AED",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 15,
    },

    disclaimer: {
        marginTop: 14,
        backgroundColor: "#FEF3C7",
        padding: 12,
        borderRadius: 12,
    },

    disclaimerText: {
        fontSize: 12,
        color: "#92400E",
    },

    bold: {
        fontWeight: "700",
    },

    // Error box styles
    errorBox: {
        backgroundColor: "#FEE2E2",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },

    errorText: {
        color: "#B91C1C",
        fontSize: 13,
    },
});
