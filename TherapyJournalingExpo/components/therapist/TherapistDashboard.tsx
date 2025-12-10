// TherapistDashboard.tsx

import { mockPatients, mockJournalEntries, mockSessions } from '../../data/mockData';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Calendar, FileText } from 'lucide-react';

export function TherapistDashboard() {
    // All patients assigned to this therapist
    const patients = mockPatients.filter((p) => p.therapistId === 'therapist-1');

    // Patients needing attention
    const patientsNeedingAttention = patients.filter(
        (p) => p.riskLevel === 'medium' || p.riskLevel === 'high' || p.recentMoodTrend === 'declining'
    );

    // Upcoming sessions
    const upcomingSessions = mockSessions
        .filter((s) => s.therapistId === 'therapist-1' && s.date > new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3);

    // Recent shared journal entries
    const recentSharedEntries = mockJournalEntries
        .filter((e) => e.sharedWithTherapist)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

    const getTrendIcon = (trend?: 'improving' | 'declining' | 'stable') => {
        switch (trend) {
            case 'improving':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'declining':
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-600" />;
        }
    };

    const getRiskColor = (risk?: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'high':
                return 'border-red-600 bg-red-50';
            case 'medium':
                return 'border-orange-600 bg-orange-50';
            default:
                return 'border-gray-200 bg-white';
        }
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const getPatientName = (patientId: string) => {
        return patients.find((p) => p.id === patientId)?.name || 'Unknown';
    };

    return (
        <div className="p-4">
            <div className="mb-6">
                <h2 className="text-2xl mb-2">Dashboard</h2>
                <p className="text-gray-600 text-sm">Overview of your patients</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-2xl mb-1">{patients.length}</p>
                    <p className="text-xs text-gray-600">Active Patients</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-2xl mb-1">{upcomingSessions.length}</p>
                    <p className="text-xs text-gray-600">Sessions This Week</p>
                </div>
            </div>

            {/* Patients Needing Attention */}
            {patientsNeedingAttention.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <h3 className="text-sm">Needs Attention</h3>
                    </div>
                    <div className="space-y-2">
                        {patientsNeedingAttention.map((patient) => (
                            <div
                                key={patient.id}
                                className={`rounded-xl border-2 p-4 ${getRiskColor(patient.riskLevel)}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm">{patient.name}</p>
                                    {getTrendIcon(patient.recentMoodTrend)}
                                </div>
                                <p className="text-xs text-gray-600">
                                    {patient.recentMoodTrend === 'declining' && 'Mood declining'}
                                    {patient.riskLevel === 'medium' && 'Medium risk level'}
                                    {patient.riskLevel === 'high' && 'High risk level'}
                                </p>
                                {patient.nextSession && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        Next session: {formatDate(patient.nextSession)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Sessions */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm">Upcoming Sessions</h3>
                </div>
                <div className="space-y-2">
                    {upcomingSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-xl border border-gray-200 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm mb-1">{getPatientName(session.patientId)}</p>
                                    <p className="text-xs text-gray-600">
                                        {formatDate(session.date)} at {formatTime(session.date)}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500">{session.duration} min</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Shared Entries */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm">Recent Journal Entries</h3>
                </div>
                <div className="space-y-2">
                    {recentSharedEntries.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-white rounded-xl border border-gray-200 p-4"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-sm">{getPatientName(entry.patientId)}</p>
                                <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                            </div>
                            {entry.aiSummary && (
                                <p className="text-xs text-gray-600 mb-2">{entry.aiSummary}</p>
                            )}
                            {entry.aiTopics && entry.aiTopics.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {entry.aiTopics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                                        >
                      {topic}
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
