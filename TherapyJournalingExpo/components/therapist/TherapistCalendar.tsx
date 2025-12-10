import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Video, Phone, MapPin } from 'lucide-react-native';
import { mockSessions, mockPatients } from '../../data/mockData';

// Types
export type SessionType = 'video' | 'phone' | 'in-person';

export interface Patient {
    id: string;
    name: string;
}

export interface Session {
    id: string;
    patientId: string;
    therapistId: string;
    date: Date;
    duration: number;
    type: SessionType;
}

export function TherapistCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const sessions: Session[] = mockSessions.filter((s) => s.therapistId === 'therapist-1');

    // Calendar navigation
    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get week days
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
        startOfWeek.setDate(diff);

        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getWeekDays();

    const getSessionsForDay = (date: Date) => {
        return sessions.filter(
            (session) => new Date(session.date).toDateString() === date.toDateString()
        );
    };

    const getPatientName = (patientId: string) => {
        return mockPatients.find((p) => p.id === patientId)?.name || 'Unknown';
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const getSessionIcon = (type: SessionType) => {
        switch (type) {
            case 'video':
                return Video;
            case 'phone':
                return Phone;
            case 'in-person':
                return MapPin;
            default:
                return Video;
        }
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Calendar</Text>
                <Text style={styles.subtitle}>Your session schedule</Text>
            </View>

            {/* Calendar Controls */}
            <View style={styles.controls}>
                <View style={styles.navRow}>
                    <Pressable onPress={goToPreviousWeek} style={styles.navButton}>
                        <ChevronLeft size={24} />
                    </Pressable>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.monthText}>
                            {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </Text>
                        <Text style={styles.weekText}>
                            Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                    </View>
                    <Pressable onPress={goToNextWeek} style={styles.navButton}>
                        <ChevronRight size={24} />
                    </Pressable>
                </View>
                <Pressable onPress={goToToday} style={styles.todayButton}>
                    <Text style={styles.todayButtonText}>Today</Text>
                </Pressable>
            </View>

            {/* Week View */}
            <View style={styles.weekView}>
                {weekDays.map((day, index) => {
                    const daySessions = getSessionsForDay(day);
                    const todayFlag = isToday(day);

                    return (
                        <View
                            key={index}
                            style={[
                                styles.dayBox,
                                { borderColor: todayFlag ? '#9333ea' : '#d1d5db', borderWidth: todayFlag ? 2 : 1 },
                            ]}
                        >
                            <View style={styles.dayHeader}>
                                <Text style={[styles.dayText, todayFlag && { color: '#9333ea' }]}>
                                    {day.toLocaleDateString('en-US', { weekday: 'long' })}
                                </Text>
                                <Text style={styles.dateText}>
                                    {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Text>
                            </View>

                            {daySessions.length > 0 ? (
                                <View>
                                    {daySessions
                                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                                        .map((session) => {
                                            const Icon = getSessionIcon(session.type);
                                            return (
                                                <View key={session.id} style={styles.sessionBox}>
                                                    <View style={styles.sessionRow}>
                                                        <Icon size={16} color="#9333ea" style={{ marginTop: 2 }} />
                                                        <View style={{ flex: 1, marginLeft: 8 }}>
                                                            <Text style={styles.patientName}>{getPatientName(session.patientId)}</Text>
                                                            <Text style={styles.sessionTime}>
                                                                {formatTime(session.date)} • {session.duration} min
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                </View>
                            ) : (
                                <Text style={styles.noSessionText}>No sessions scheduled</Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
    header: { marginBottom: 16 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#6b7280' },
    controls: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e5e7eb' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    navButton: { padding: 8 },
    monthText: { fontSize: 14 },
    weekText: { fontSize: 12, color: '#6b7280' },
    todayButton: { backgroundColor: '#9333ea', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    todayButtonText: { color: '#fff', fontSize: 12 },
    weekView: { flexDirection: 'column', gap: 12 },
    dayBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
    dayHeader: { marginBottom: 8 },
    dayText: { fontSize: 14, fontWeight: '600' },
    dateText: { fontSize: 12, color: '#6b7280' },
    sessionBox: { backgroundColor: '#ede9fe', borderRadius: 8, padding: 8, marginBottom: 4 },
    sessionRow: { flexDirection: 'row', alignItems: 'center' },
    patientName: { fontSize: 12, fontWeight: '600' },
    sessionTime: { fontSize: 10, color: '#4b5563' },
    noSessionText: { fontSize: 10, color: '#9ca3af' },
});
