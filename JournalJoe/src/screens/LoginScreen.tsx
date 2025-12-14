import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: { navigation: LoginScreenNavProp }) {
    const [selectedRole, setSelectedRole] = useState<'patient' | 'therapist'>('patient');

    const MOCK_USERS = {
        patient: {
            id: 'patient-1',
            name: 'Emma Wilson',
            email: 'emma@example.com',
            role: 'patient',
        },
        therapist: {
            id: 'therapist-1',
            name: 'Dr. Sarah Mitchell',
            email: 'dr.mitchell@example.com',
            role: 'therapist',
        },
    };

    const handleLogin = () => {
        if (selectedRole === 'patient') navigation.replace('Patient');
        else navigation.replace('Therapist');
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.logo}>
                    <Heart size={36} color="white" />
                </View>
                <Text style={styles.title}>MindfulPath</Text>
                <Text style={styles.subtitle}>Therapy-Support Journaling</Text>

                <Text style={styles.label}>Login as:</Text>
                <View style={styles.roleRow}>
                    <TouchableOpacity
                        onPress={() => setSelectedRole('patient')}
                        style={[styles.roleBtn, selectedRole === 'patient' && styles.roleActive]}
                    >
                        <Text style={[styles.roleText, selectedRole === 'patient' && styles.roleTextActive]}>Patient</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedRole('therapist')}
                        style={[styles.roleBtn, selectedRole === 'therapist' && styles.roleActive]}
                    >
                        <Text style={[styles.roleText, selectedRole === 'therapist' && styles.roleTextActive]}>Therapist</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.demoBox}>
                    <Text style={styles.demoLabel}>Demo account:</Text>
                    <Text style={styles.demoText}><Text style={styles.bold}>Name: </Text>{MOCK_USERS[selectedRole].name}</Text>
                    <Text style={styles.demoText}><Text style={styles.bold}>Email: </Text>{MOCK_USERS[selectedRole].email}</Text>
                </View>

                <TouchableOpacity onPress={handleLogin} style={styles.continueBtn}>
                    <Text style={styles.continueText}>Continue as {selectedRole === 'patient' ? 'Patient' : 'Therapist'}</Text>
                </TouchableOpacity>

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}><Text style={styles.bold}>Disclaimer:</Text> Prototype only — not for real patient data or clinical use.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 420, backgroundColor: 'white', borderRadius: 18, padding: 20, elevation: 3 },
    logo: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
    subtitle: { textAlign: 'center', color: '#6B7280', marginBottom: 16 },
    label: { marginTop: 8, marginBottom: 8, color: '#374151' },
    roleRow: { flexDirection: 'row', gap: 8 },
    roleBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
    roleActive: { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' },
    roleText: { color: '#374151' },
    roleTextActive: { color: '#6D28D9' },
    demoBox: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginVertical: 12 },
    demoLabel: { color: '#6B7280', marginBottom: 6 },
    demoText: { fontSize: 14, color: '#111827' },
    bold: { fontWeight: '700' },
    continueBtn: { backgroundColor: '#7C3AED', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    continueText: { color: 'white', fontWeight: '600' },
    disclaimer: { marginTop: 12, backgroundColor: '#FEF3C7', borderRadius: 10, padding: 10 },
    disclaimerText: { color: '#92400E', fontSize: 12 },
});
