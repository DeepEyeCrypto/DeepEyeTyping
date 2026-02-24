import { useEffect } from 'react';
import { useAuthStore } from '../firebase/authStore';
import { useProgressStore } from '../progressStore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useProgressSync = () => {
    const { user } = useAuthStore();
    const { setProgress } = useProgressStore();

    useEffect(() => {
        if (!user || user.isAnonymous) return;

        let unsubscribed = false;

        const syncProgress = async () => {
            try {
                const docRef = doc(db, 'users', user.uid, 'progress', 'main');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && !unsubscribed) {
                    console.log("[Sync] Loaded remote progress");
                    setProgress(docSnap.data() as any);
                } else {
                    // Start fresh or Push local? 
                    // Strategy: If remote is empty, assume this is first sync from local -> remote
                    console.log("[Sync] No remote progress found. Initializing...");
                    const localState = useProgressStore.getState();
                    // Strip functions
                    const { xp, level, badges, lifetimeStats } = localState;
                    await setDoc(docRef, { xp, level, badges, lifetimeStats });
                }
            } catch (err) {
                console.error("[Sync] Error loading progress:", err);
            }
        };

        syncProgress();

        // Push updates to cloud
        const unsubStore = useProgressStore.subscribe((state, prevState) => {
            if (state.xp !== prevState.xp || state.badges.length !== prevState.badges.length) {
                // Debounce simple: just fire and maybe throttle firebase logic?
                // For now, simple write.
                const docRef = doc(db, 'users', user.uid, 'progress', 'main');
                const { xp, level, badges, lifetimeStats } = state;
                setDoc(docRef, { xp, level, badges, lifetimeStats }, { merge: true })
                    .catch(e => console.error("[Sync] Push failed", e));
            }
        });

        return () => {
            unsubscribed = true;
            unsubStore();
        };
    }, [user, setProgress]);
};
