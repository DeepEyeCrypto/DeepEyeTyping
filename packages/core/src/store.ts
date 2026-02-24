import { create } from 'zustand';
import { db, auth } from './firebase/config';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { soundManager } from './soundManager';
import type { KeyStroke } from './types';
import { TypingAnalytics } from './analytics';
import { useProgressStore } from './progressStore'; // Gamification

interface TypingState {
    // Input State
    targetText: string;
    activeLessonId: string | null;
    userInput: string;
    currentIndex: number;
    sessionType: 'practice' | 'exam';
    isRace: boolean;

    // Advanced Stats Telemetry
    keystrokes: KeyStroke[];

    // Live Stats
    startTime: number | null;
    wpm: number;
    accuracy: number;
    errorCount: number;
    consistency: number;
    status: 'idle' | 'running' | 'finished' | 'failed';
    isFinished: boolean;

    // Actions
    setText: (text: string, type?: 'practice' | 'exam', lessonId?: string, isRace?: boolean) => void;
    inputChar: (char: string, pressTime?: number) => void;
    releaseChar: (char: string, releaseTime?: number) => void;
    backspace: () => void;
    reset: () => void;
    saveSession: (metadata?: { isRace?: boolean; isWinner?: boolean }) => Promise<void>;
}

let lastStatsUpdate = 0;

export const useTypingStore = create<TypingState>((set, get) => ({
    targetText: "The quick brown fox jumps over the lazy dog.",
    activeLessonId: null,
    userInput: "",
    currentIndex: 0,
    sessionType: 'practice',
    isRace: false,
    startTime: null,
    keystrokes: [],

    wpm: 0,
    accuracy: 100,
    errorCount: 0,
    consistency: 0,
    status: 'idle',
    isFinished: false,

    setText: (text: string, type: 'practice' | 'exam' = 'practice', lessonId?: string, isRace: boolean = false) => {
        get().reset();

        // Reset Rust Engine if available (Tauri)
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
            (window as any).__TAURI__.core.invoke('reset_session', { text }).catch(console.error);
        }

        set({ targetText: text, sessionType: type, activeLessonId: lessonId || null, isRace });
    },

    inputChar: (char: string, pressTime?: number) => {
        const {
            targetText,
            userInput,
            currentIndex,
            startTime,
            keystrokes,
            errorCount,
            isFinished,
            isRace
        } = get();

        if (isFinished) return;

        // --- RUST ENGINE OFFLOAD (Desktop) ---
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
            (window as any).__TAURI__.core.invoke('handle_input', { charCode: char })
                .then((stats: any) => {
                    const newUserInput = userInput + char;
                    const finished = newUserInput.length === targetText.length;

                    set({
                        userInput: newUserInput,
                        currentIndex: currentIndex + 1,
                        wpm: Math.round(stats.wpm),
                        accuracy: Math.round(stats.accuracy),
                        errorCount: userInput.length - Math.floor(stats.accuracy * userInput.length / 100), // Approximate
                        status: finished ? 'finished' : 'running',
                        isFinished: finished
                    });

                    if (finished) {
                        soundManager.playSuccess();
                        if (!isRace) get().saveSession();
                    }
                })
                .catch((err: any) => console.error("Rust Engine Error:", err));

            // Return early to let Rust handle stats. 
            // React just updates the input visual via state.
            return;
        }
        // ---------------------------

        const now = Date.now();
        const newStartTime = startTime || now;

        const newUserInput = userInput + char;
        const expectedChar = targetText[currentIndex];
        const isCorrect = char === expectedChar;

        const currentWpm = get().wpm;
        if (isCorrect) {
            soundManager.playKeypress(currentWpm / 60);
        } else {
            soundManager.playError();
        }

        const pressTimestamp = pressTime || now;
        const newKeystroke: KeyStroke = {
            key: char,
            timestamp: pressTimestamp,
            pressTime: pressTimestamp,
            isCorrect,
            expected: expectedChar
        };
        const newKeystrokes = [...keystrokes, newKeystroke];

        const totalTimeMs = now - newStartTime;
        const newErrors = isCorrect ? errorCount : errorCount + 1;
        const newAccuracy = Math.max(0, 100 - ((newErrors / newUserInput.length) * 100));
        const finished = newUserInput.length === targetText.length;

        // PERFORMANCE FIX: Throttle heavy stats calculations to every 500ms or on finish
        // This prevents expensive array operations on every keystroke
        const shouldUpdateHeavyStats = now - lastStatsUpdate > 500 || finished;

        let newWpm = currentWpm;
        let newConsistency = get().consistency;

        if (shouldUpdateHeavyStats) {
            // Only calculate WPM and consistency when needed (throttled)
            newWpm = TypingAnalytics.calculateWPM(newKeystrokes, totalTimeMs);
            newConsistency = TypingAnalytics.calculateConsistency(newKeystrokes);
            lastStatsUpdate = now;
        }

        const { sessionType } = get();
        let failed = false;
        if (sessionType === 'exam' && newUserInput.length > 20 && newAccuracy < 95) {
            failed = true;
        }

        set({
            userInput: newUserInput,
            currentIndex: currentIndex + 1,
            startTime: newStartTime,
            keystrokes: newKeystrokes,
            wpm: newWpm,
            accuracy: Math.round(newAccuracy),
            errorCount: newErrors,
            consistency: parseFloat(newConsistency.toFixed(2)),
            status: failed ? 'failed' : (finished ? 'finished' : 'running'),
            isFinished: finished || failed
        });

        if (failed) {
            soundManager.playError();
        } else if (finished) {
            soundManager.playSuccess();
            if (!isRace) {
                get().saveSession();
            }
        }
    },

    releaseChar: (char: string, releaseTime?: number) => {
        const { keystrokes, isFinished } = get();
        if (isFinished) return;

        const now = releaseTime || Date.now();
        const reversedKeystrokes = [...keystrokes].reverse();
        const lastIndex = reversedKeystrokes.findIndex(k => k.key === char && !k.releaseTime);

        if (lastIndex !== -1) {
            const actualIndex = keystrokes.length - 1 - lastIndex;
            const newKeystrokes = [...keystrokes];
            newKeystrokes[actualIndex] = {
                ...newKeystrokes[actualIndex],
                releaseTime: now
            };
            set({ keystrokes: newKeystrokes });
        }
    },

    backspace: () => {
        const { userInput, currentIndex, isFinished } = get();
        if (userInput.length === 0 || isFinished) return;

        set({
            userInput: userInput.slice(0, -1),
            currentIndex: Math.max(0, currentIndex - 1)
        });
    },

    reset: () => {
        set({
            userInput: "",
            currentIndex: 0,
            startTime: null,
            keystrokes: [],
            wpm: 0,
            accuracy: 100,
            errorCount: 0,
            consistency: 0,
            status: 'idle',
            isFinished: false
        });
    },

    saveSession: async (metadata?: { isRace?: boolean; isWinner?: boolean }) => {
        const { wpm, accuracy, errorCount, consistency, keystrokes, startTime } = get();
        const user = auth.currentUser;

        // --- GAMIFICATION TRIGGER ---
        const duration = startTime ? (Date.now() - startTime) / 1000 : 0;
        const sessionStats = {
            wpm,
            accuracy,
            duration,
            mistakes: errorCount,
            isPerfect: errorCount === 0 && accuracy === 100
        };

        // Award XP and Check Badges
        useProgressStore.getState().addSession(sessionStats);
        useProgressStore.getState().checkStreak();
        // ----------------------------

        const weakestKeys = TypingAnalytics.getWeakestKeys(keystrokes);

        const sessionData = {
            wpm,
            accuracy,
            errorCount,
            consistency,
            weakestKeys,
            timestamp: Date.now(),
            mode: 'practice',
            ...metadata
        };

        if (typeof localStorage !== 'undefined') {
            const localHistory = JSON.parse(localStorage.getItem('deepeye_local_cache') || '[]');
            localStorage.setItem('deepeye_local_cache', JSON.stringify([sessionData, ...localHistory].slice(0, 100)));

            if (!user) {
                const existing = JSON.parse(localStorage.getItem('deepeye_guest_sessions') || '[]');
                localStorage.setItem('deepeye_guest_sessions', JSON.stringify([sessionData, ...existing].slice(0, 50)));
                return;
            }
        } else if (!user) {
            return;
        }

        try {
            await addDoc(collection(db, 'users', user.uid, 'sessions'), {
                ...sessionData,
                timestamp: serverTimestamp(),
            });

            const leaderboardRef = doc(db, 'leaderboard', user.uid);
            const lbSnap = await getDoc(leaderboardRef);
            const currentLbData = lbSnap.exists() ? lbSnap.data() : null;

            // Get current highestWpm and totalRaces
            const currentHighestWpm = currentLbData?.highestWpm || 0;
            const currentTotalRaces = currentLbData?.totalRaces || 0;
            const isNewPersonalBest = wpm > currentHighestWpm;

            // Update leaderboard with new personal best and race count
            if (!currentLbData || isNewPersonalBest) {
                await setDoc(leaderboardRef, {
                    userId: user.uid,
                    displayName: user.displayName || 'Anonymous Operative',
                    photoURL: user.photoURL,
                    wpm,
                    highestWpm: isNewPersonalBest ? wpm : currentHighestWpm,
                    totalRaces: currentTotalRaces + 1,
                    lastWpm: wpm,
                    accuracy,
                    timestamp: serverTimestamp()
                }, { merge: true });
            } else {
                // Just increment race count for regular sessions
                await setDoc(leaderboardRef, {
                    totalRaces: currentTotalRaces + 1,
                    lastWpm: wpm,
                    wpm: Math.max(wpm, currentHighestWpm), // Keep highest
                    timestamp: serverTimestamp()
                }, { merge: true });
            }
        } catch (e) {
            console.error("Error saving session:", e);
        }
    }
}));
