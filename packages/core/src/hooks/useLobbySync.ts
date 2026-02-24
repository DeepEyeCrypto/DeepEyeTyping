import { useEffect, useRef } from 'react';
import { ref, onValue, update, set, get, onDisconnect, remove } from 'firebase/database';
import { rtdb } from '../firebase/config';
import { useMultiplayerStore } from '../multiplayerStore';
import type { ArenaPlayer } from '../multiplayerStore';
import { useAuthStore } from '../firebase/authStore';
import { useTypingStore } from '../store';
import { LESSONS } from '../lessons';

export const useLobbySync = () => {
    const { lobbyId, setPlayers, updateMatchStatus, isHost } = useMultiplayerStore();
    const { user } = useAuthStore();
    const wpm = useTypingStore((state) => state.wpm);
    const userInput = useTypingStore((state) => state.userInput);
    const targetText = useTypingStore((state) => state.targetText);
    const setText = useTypingStore((state) => state.setText);
    const activeLessonId = useTypingStore((state) => state.activeLessonId || '');
    const isFinished = useTypingStore((state) => state.isFinished);
    const status = useTypingStore((state) => state.status);
    const progress = targetText.length > 0 ? Math.round((userInput.length / targetText.length) * 100) : 0;

    // 1. Sync Lobby State (Downstream)
    useEffect(() => {
        if (!lobbyId || !rtdb) return;

        const lobbyRef = ref(rtdb, `lobbies/${lobbyId}`);

        const unsubscribe = onValue(lobbyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Sync Match Status
                if (data.status) {
                    updateMatchStatus(data.status);
                }

                // Sync Players
                if (data.players) {
                    setPlayers(data.players);
                }

                // Sync Text (If host changed it)
                if (data.textId && data.textId !== activeLessonId) {
                    const lesson = LESSONS.find(l => l.id === data.textId);
                    if (lesson) {
                        setText(lesson.text, 'practice', lesson.id, true); // Keep isRace: true
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [lobbyId, setPlayers, updateMatchStatus, activeLessonId, setText]);

    // 2a. Presence & Lifecycle (Upstream)
    useEffect(() => {
        if (!lobbyId || !user || !rtdb) return;

        const playerRef = ref(rtdb, `lobbies/${lobbyId}/players/${user.uid}`);

        // Set up onDisconnect to remove player if app crashes
        onDisconnect(playerRef).remove();

        return () => {
            // When leaving lobby (unmount or ID change), remove self
            // Cancel onDisconnect first to avoid double-triggers (optional but clean)
            onDisconnect(playerRef).cancel();
            remove(playerRef);
        };
    }, [lobbyId, user]);

    const lastSyncTime = useRef<number>(0);

    // 2b. Data Sync (Upstream) - Throttled to 250ms for performance
    useEffect(() => {
        if (!lobbyId || !user || !rtdb) return;

        const SYNC_INTERVAL = 250;
        const now = Date.now();

        // Force sync if finished, otherwise respect interval
        if (!isFinished && (now - lastSyncTime.current < SYNC_INTERVAL)) return;

        const playerRef = ref(rtdb, `lobbies/${lobbyId}/players/${user.uid}`);
        const payload: Partial<ArenaPlayer> = {
            uid: user.uid,
            name: user.displayName || 'Operative',
            avatar: user.photoURL || '',
            wpm: wpm,
            progress: progress,
            status: isFinished ? 'FINISHED' : (status === 'running' ? 'RACING' : 'READY'),
        };

        lastSyncTime.current = now;
        update(playerRef, payload).catch(err => console.error("Sync Error:", err));

    }, [lobbyId, user, wpm, progress, isFinished, status]);

    // 3. Host Init (Create lobby if host)
    useEffect(() => {
        if (isHost && lobbyId && user && rtdb) {
            const lobbyRef = ref(rtdb, `lobbies/${lobbyId}`);

            const defaultRaceId = 'p2-l1';

            get(lobbyRef).then((snap) => {
                if (!snap.exists()) {
                    set(lobbyRef, {
                        id: lobbyId,
                        hostId: user.uid,
                        status: 'WAITING',
                        textId: defaultRaceId,
                        createdAt: Date.now(),
                        players: {
                            [user.uid]: {
                                uid: user.uid,
                                name: user.displayName || 'Host',
                                status: 'JOINING',
                                progress: 0,
                                wpm: 0
                            }
                        }
                    });

                    // Host also sets local text immediately
                    const lesson = LESSONS.find(l => l.id === defaultRaceId);
                    if (lesson) {
                        setText(lesson.text, 'practice', lesson.id, true);
                    }
                }
            });
        }
    }, [isHost, lobbyId, user, setText]);
};
