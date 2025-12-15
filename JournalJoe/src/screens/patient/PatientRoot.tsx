import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookOpen, TrendingUp, Calendar as CalIcon, User as UserIcon, LogOut, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Journal from './Journal';
import Insights from './Insights';
import Sessions from './Sessions';
import Profile from './Profile';
import ChatWithJoe from "./ChatWithJoe";

import { RootStackParamList } from '../../../App';

type ViewName = 'journal' | 'chat' | 'insights' | 'sessions' | 'profile';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function PatientRoot() {
    const navigation = useNavigation<NavProp>();
    const [activeView, setActiveView] = useState<ViewName>('journal');

    // 🔹 Replace later with real user data
    const patientName = 'Emma';

    const renderView = () => {
        switch (activeView) {
            case 'journal': return <Journal />;
            case 'chat':
                return <ChatWithJoe />;

            case 'insights': return <Insights />;
            case 'sessions': return <Sessions />;
            case 'profile': return <Profile />;
            default: return <Journal />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Hello, {patientName} 👋</Text>
                    <Text style={styles.headerSubtitle}>
                        Journal Joe is here to support you
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate('Login')}
                >
                    <LogOut size={18} color="#4B5563" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>{renderView()}</View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <NavItem
                    label="Journal"
                    icon={<BookOpen size={20} />}
                    active={activeView === 'journal'}
                    onPress={() => setActiveView('journal')}
                />

                <NavItem
                    label="Chat Joe"
                    icon={<MessageCircle size={20} />}
                    active={activeView === 'chat'}
                    onPress={() => setActiveView('chat')}
                />

                <NavItem
                    label="Insights"
                    icon={<TrendingUp size={20} />}
                    active={activeView === 'insights'}
                    onPress={() => setActiveView('insights')}
                />

                <NavItem
                    label="Sessions"
                    icon={<CalIcon size={20} />}
                    active={activeView === 'sessions'}
                    onPress={() => setActiveView('sessions')}
                />

                <NavItem
                    label="Profile"
                    icon={<UserIcon size={20} />}
                    active={activeView === 'profile'}
                    onPress={() => setActiveView('profile')}
                />
            </View>
        </View>
    );
}

/* ---------------- Reusable Bottom Nav Item ---------------- */

function NavItem({
                     label,
                     icon,
                     active,
                     onPress,
                 }: {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.navItem}>
            {icon}
            <Text style={[styles.navText, active && styles.activeText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    /* Header */
    header: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    iconBtn: {
        padding: 6,
    },

    /* Content */
    content: {
        flex: 1,
    },

    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#6B7280',
        fontSize: 14,
    },

    /* Bottom Nav */
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingVertical: 10,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    activeText: {
        color: '#7C3AED',
        fontWeight: '600',
    },
});
