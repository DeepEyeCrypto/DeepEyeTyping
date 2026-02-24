// PERFORMANCE: In-memory cache for Firestore data
const statsCache: { data: TypingSession[] | null; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_TTL = 30000; // 30 seconds cache

import { useEffect, useState, useRef } from 'react';
import { db, auth } from './config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { TypingSession } from '../types';

export const useStats = () => {
    const [sessions, setSessions] = useState<TypingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const cacheKey = useRef<string>('default');

    useEffect(() => {
        let unsubFirestore: (() => void) | undefined;
        const now = Date.now();

        // PERFORMANCE: Check cache first
        if (statsCache.data && now - statsCache.timestamp < CACHE_TTL) {
            setSessions(statsCache.data);
            setLoading(false);
            return;
        }

        const unsubAuth = onAuthStateChanged(auth, (user) => {
            const userId = user?.uid || 'guest';
            cacheKey.current = userId;

            if (!user) {
                const localData = JSON.parse(localStorage.getItem('deepeye_guest_sessions') || '[]');
                const mapped = localData.map((s: any, i: number) => ({
                    id: `local-${i}`,
                    ...s,
                    timestamp: { seconds: Math.floor(s.timestamp / 1000) }
                }));
                // PERFORMANCE: Update cache
                statsCache.data = mapped;
                statsCache.timestamp = now;
                setSessions(mapped);
                setLoading(false);
                return;
            }

            // PERFORMANCE: Reduced limit from 50 to 20 - sufficient for dashboard
            const q = query(
                collection(db, 'users', user.uid, 'sessions'),
                orderBy('timestamp', 'desc'),
                limit(20)
            );

            unsubFirestore = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as TypingSession[];
                // PERFORMANCE: Update cache
                statsCache.data = data;
                statsCache.timestamp = Date.now();
                setSessions(data);
                setLoading(false);
            });
        });

        return () => {
            unsubAuth();
            if (unsubFirestore) unsubFirestore();
        };
    }, []);

    return { sessions, loading };
};
