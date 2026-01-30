import { useEffect, useState } from 'react';
import { db } from './config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export interface LeaderboardEntry {
    id: string;
    userId: string;
    displayName: string;
    photoURL?: string;
    wpm: number;
    accuracy: number;
    timestamp: any;
    rank?: number;
}

export const useLeaderboard = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('wpm', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                rank: index + 1
            })) as LeaderboardEntry[];
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
