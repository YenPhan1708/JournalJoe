import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LayoutDashboard, Users, Calendar as CalIcon, User as UserIcon, LogOut } from 'lucide-react-native';
import Dashboard from './Dashboard';
import Patients from './Patients';
import Calendar from './Calendar';
import Profile from './Profile';

type ViewName = 'dashboard' | 'patients' | 'calendar' | 'profile';

export default function TherapistRoot() {
    const [activeView, setActiveView] = useState<ViewName>('dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard />;
            case 'patients': return <Patients />;
            case 'calendar': return <Calendar />;
            case 'profile': return <Profile />;
            default: return <Dashboard />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>MindfulPath Pro</Text>
                    <Text style={styles.headerSub}>Therapist</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}><LogOut size={18} color="#4B5563" /></TouchableOpacity>
            </View>

            <View style={styles.content}>{renderView()}</View>

            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => setActiveView('dashboard')} style={styles.navItem}>
                    <LayoutDashboard size={20} />
                    <Text style={[styles.navText, activeView==='dashboard' && styles.activeText]}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView('patients')} style={styles.navItem}>
                    <Users size={20} />
                    <Text style={[styles.navText, activeView==='patients' && styles.activeText]}>Patients</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveView('calendar')} style={styles.navItem}>
                    <CalIcon size={20} />
                    <Text style={[styles.navText, activeView==='calendar' && styles.activeText]}>Calendar</Text>
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
    headerTitle: { fontSize: 18, fontWeight: '600' },
    headerSub: { color: '#6B7280' },
    iconBtn: { padding: 6 },
    content: { flex:1, padding: 16 },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', borderTopWidth:1, borderTopColor: '#E5E7EB', paddingVertical: 10 },
    navItem: { alignItems: 'center' },
    navText: { fontSize: 12, color: '#6B7280' },
    activeText: { color: '#7C3AED' },
});
