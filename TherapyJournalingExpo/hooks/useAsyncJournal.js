import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TJ_JOURNAL_V1';
const SETTINGS_KEY = 'TJ_SETTINGS_V1';

export function useJournal() {
    const [entries, setEntries] = useState([]);
    const [settings, setSettings] = useState({ remindersEnabled: false });

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                const arr = raw ? JSON.parse(raw) : [];
                setEntries(arr);
                const sRaw = await AsyncStorage.getItem(SETTINGS_KEY);
                setSettings(sRaw ? JSON.parse(sRaw) : { remindersEnabled: false });
            } catch (e) {
                console.warn('Failed to load entries', e);
            }
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries)).catch(() => {});
    }, [entries]);

    useEffect(() => {
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)).catch(() => {});
    }, [settings]);

    const addEntry = useCallback(async ({ title, text }) => {
        const newEntry = { id: Date.now().toString(), title, text, date: new Date().toISOString() };
        setEntries((prev) => [newEntry, ...prev]);
        return newEntry;
    }, []);

    const getEntryById = useCallback((id) => entries.find((e) => e.id === id), [entries]);

    const removeEntry = useCallback(async (id) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const setRemindersEnabled = useCallback((val) => {
        setSettings((s) => ({ ...s, remindersEnabled: val }));
    }, []);

    return {
        entries,
        addEntry,
        getEntryById,
        removeEntry,
        remindersEnabled: settings.remindersEnabled,
        setRemindersEnabled,
    };
}
