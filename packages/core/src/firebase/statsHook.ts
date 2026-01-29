import { useEffect, useState } from 'react';
import { db, auth } from './config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useStats = () => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to settle
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setSessions([]);
                setLoading(false);
                return;
            }

            // Subscribe to user sessions
            const q = query(
                collection(db, 'users', user.uid, 'sessions'),
                orderBy('timestamp', 'desc'),
                limit(10)
            );

            const unsubFirestore = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSessions(data);
                setLoading(false);
            });

            return () => unsubFirestore();
        });

        return () => unsubAuth();
    }, []);

    return { sessions, loading };
};
