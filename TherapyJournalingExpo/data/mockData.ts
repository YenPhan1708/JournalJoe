// mockData.ts

export type Mood = 'great' | 'good' | 'okay' | 'low' | 'difficult';
export type SessionType = 'video' | 'phone' | 'in-person';
export type MoodTrend = 'improving' | 'declining' | 'stable';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Patient {
    id: string;
    name: string;
    startDate: Date;
    therapistId?: string;
    nextSession?: Date;
    recentMoodTrend?: MoodTrend;
    riskLevel?: RiskLevel;
}

export interface JournalEntry {
    id: string;
    patientId: string;
    date: Date;
    content: string;
    mood: Mood;
    sharedWithTherapist: boolean;
    aiSummary?: string | null;
    aiTopics?: string[];
}

export interface Session {
    id: string;
    patientId: string;
    therapistId: string;
    date: Date;
    duration: number;
    type: SessionType;
    therapistNotes?: string;
}

// Existing journal entries
export const mockJournalEntries: JournalEntry[] = [
    {
        id: "entry-1",
        patientId: "patient-1",
        date: new Date("2025-01-21T09:24:00"),
        content: "Feeling overwhelmed today, but trying to stay grounded. Went for a walk which helped.",
        mood: "low",
        sharedWithTherapist: true,
        aiSummary: "Patient felt overwhelmed but used coping strategies effectively.",
        aiTopics: ["stress", "self-care", "grounding"],
    },
    {
        id: "entry-2",
        patientId: "patient-1",
        date: new Date("2025-01-20T15:12:00"),
        content: "Had a productive day. Worked on personal goals and completed important tasks.",
        mood: "good",
        sharedWithTherapist: false,
        aiSummary: null,
        aiTopics: [],
    },
    {
        id: "entry-3",
        patientId: "patient-1",
        date: new Date("2025-01-19T20:44:00"),
        content: "Struggled with motivation today. Tried journaling and it helped a bit.",
        mood: "okay",
        sharedWithTherapist: true,
        aiSummary: "Patient struggled with motivation but found partial relief through journaling.",
        aiTopics: ["motivation", "journaling"],
    },
];

// Mock patients
export const mockPatients: Patient[] = [
    {
        id: 'patient-1',
        name: 'John Doe',
        startDate: new Date('2025-01-01'),
        therapistId: 'therapist-1',
        nextSession: new Date('2025-12-10T10:00:00'),
        recentMoodTrend: 'declining',
        riskLevel: 'medium',
    },
    {
        id: 'patient-2',
        name: 'Jane Smith',
        startDate: new Date('2025-02-15'),
        therapistId: 'therapist-1',
        nextSession: new Date('2025-12-11T14:00:00'),
        recentMoodTrend: 'improving',
        riskLevel: 'low',
    },
];

// Mock sessions
export const mockSessions: Session[] = [
    {
        id: 'session-1',
        patientId: 'patient-1',
        therapistId: 'therapist-1',
        date: new Date('2025-12-10T10:00:00'),
        duration: 50,
        type: 'video',
    },
    {
        id: 'session-2',
        patientId: 'patient-2',
        therapistId: 'therapist-1',
        date: new Date('2025-12-11T14:00:00'),
        duration: 60,
        type: 'in-person',
    },
];
