// PERFORMANCE: In-memory cache for leaderboard data
const leaderboardCache: { data: LeaderboardEntry[] | null; timestamp: number } = { data: null, timestamp: 0 };
const LEADERBOARD_CACHE_TTL = 60000; // 60 seconds cache for leaderboard

import { useEffect, useState } from 'react';
import { db } from './config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

import type { LeaderboardEntry } from '../types/engagement';
import { getBadgeForWPM } from '../types/engagement';

export const useLeaderboard = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const now = Date.now();

        // PERFORMANCE: Check cache first
        if (leaderboardCache.data && now - leaderboardCache.timestamp < LEADERBOARD_CACHE_TTL) {
            setEntries(leaderboardCache.data);
            setLoading(false);
            return;
        }

        // PERFORMANCE: Reduced limit from 100 to 50 - sufficient for display
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('wpm', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc, index) => {
                const docData = doc.data();
                const wpm = docData.wpm || 0;
                return {
                    id: doc.id,
                    ...docData,
                    rank: index + 1,
                    badge: getBadgeForWPM(wpm),
                    highestWpm: wpm
                } as LeaderboardEntry;
            });
            // PERFORMANCE: Update cache
            leaderboardCache.data = data;
            leaderboardCache.timestamp = Date.now();
            setEntries(data);
            setLoading(false);
        }, (error) => {
            console.error("Leaderboard subscription error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { entries, loading };
};
