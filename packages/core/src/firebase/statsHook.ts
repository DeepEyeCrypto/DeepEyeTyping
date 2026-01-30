import { useEffect, useState } from 'react';
import { db, auth } from './config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { TypingSession } from '../types';

export const useStats = () => {
    const [sessions, setSessions] = useState<TypingSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to settle
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                const localData = JSON.parse(localStorage.getItem('deepeye_guest_sessions') || '[]');
                setSessions(localData.map((s: any, i: number) => ({
                    id: `local-${i}`,
                    ...s,
                    timestamp: { seconds: Math.floor(s.timestamp / 1000) } // Normalize for UI
                })));
                setLoading(false);
                return;
            }

            // Subscribe to user sessions
            const q = query(
                collection(db, 'users', user.uid, 'sessions'),
                orderBy('timestamp', 'desc'),
                limit(50)
            );

            const unsubFirestore = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as TypingSession[];
                setSessions(data);
                setLoading(false);
            });

            return () => unsubFirestore();
        });

        return () => unsubAuth();
    }, []);

    return { sessions, loading };
};
