import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookOpen, TrendingUp, Calendar as CalIcon, User as UserIcon, LogOut } from 'lucide-react-native';
import Journal from './Journal';
import Insights from './Insights';
import Sessions from './Sessions';
import Profile from './Profile';

type ViewName = 'journal' | 'insights' | 'sessions' | 'profile';

export default function PatientRoot() {
    const [activeView, setActiveView] = useState<ViewName>('journal');

    const renderView = () => {
        switch (activeView) {
            case 'journal': return <Journal />;
            case 'insights': return <Insights />;
            case 'sessions': return <Sessions />;
            case 'profile': return <Profile />;
            default: return <Journal />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Hello, Patient</Text>
                <TouchableOpacity style={styles.iconBtn}><LogOut size={18} color="#4B5563" /></TouchableOpacity>
            </View>

            <View style={styles.content}>{renderView()}</View>

            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => setActiveView('journal')} style={styles.navItem}>
                    <BookOpen size={20} />
                    <Text style={[styles.navText, activeView==='journal' && styles.activeText]}>Journal</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView('insights')} style={styles.navItem}>
                    <TrendingUp size={20} />
                    <Text style={[styles.navText, activeView==='insights' && styles.activeText]}>Insights</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView('sessions')} style={styles.navItem}>
                    <CalIcon size={20} />
                    <Text style={[styles.navText, activeView==='sessions' && styles.activeText]}>Sessions</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView('profile')} style={styles.navItem}>
                    <UserIcon size={20} />
                    <Text style={[styles.navText, activeView==='profile' && styles.activeText]}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex:1, backgroundColor: '#F9FAFB' },
    header: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerText: { fontSize: 18 },
    iconBtn: { padding: 6 },
    content: { flex:1, padding: 16 },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', borderTopWidth:1, borderTopColor: '#E5E7EB', paddingVertical: 10 },
    navItem: { alignItems: 'center' },
    navText: { fontSize: 12, color: '#6B7280' },
    activeText: { color: '#7C3AED' },
});
