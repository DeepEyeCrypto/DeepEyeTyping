import { create } from 'zustand';
import { db, auth } from './firebase/config';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { soundManager } from './soundManager';
import type { KeyStroke } from './types';
import { TypingAnalytics } from './analytics';
import { useProgressStore } from './progressStore';

interface TypingState {
    // Input State
    targetText: string;
    activeLessonId: string | null;
    userInput: string;
    currentIndex: number;
    sessionType: 'practice' | 'exam';

    // Advanced Stats Telemetry
    keystrokes: KeyStroke[];

    // Live Stats
    startTime: number | null;
    wpm: number;
    accuracy: number;
    errorCount: number;
    consistency: number; // New: Rhythm metric
    isFinished: boolean;

    // Actions
    setText: (text: string, type?: 'practice' | 'exam', lessonId?: string) => void;
    inputChar: (char: string) => void;
    backspace: () => void;
    reset: () => void;
    saveSession: () => Promise<void>;
}

export const useTypingStore = create<TypingState>((set, get) => ({
    targetText: "The quick brown fox jumps over the lazy dog.",
    activeLessonId: null,
    userInput: "",
    currentIndex: 0,
    sessionType: 'practice',
    startTime: null,
    keystrokes: [],

    wpm: 0,
    accuracy: 100,
    errorCount: 0,
    consistency: 0,
    isFinished: false,

    setText: (text, type = 'practice', lessonId) => {
        get().reset();
        set({ targetText: text, sessionType: type, activeLessonId: lessonId || null });
    },

    inputChar: (char) => {
        const {
            targetText,
            userInput,
            currentIndex,
            startTime,
            keystrokes,
            errorCount,
            isFinished
        } = get();

        if (isFinished) return;

        const now = Date.now();
        // Start timer on first input
        const newStartTime = startTime || now;

        const newUserInput = userInput + char;
        const expectedChar = targetText[currentIndex];
        const isCorrect = char === expectedChar;

        // Sound FX
        if (isCorrect) {
            soundManager.playKeypress();
        } else {
            soundManager.playError();
        }

        // Log Keystroke
        const newKeystroke: KeyStroke = {
            key: char,
            timestamp: now,
            isCorrect,
            expected: expectedChar
        };
        const newKeystrokes = [...keystrokes, newKeystroke];

        // Calculate Stats using Analytics Engine
        const totalTimeMs = now - newStartTime;
        const newWpm = TypingAnalytics.calculateWPM(newKeystrokes, totalTimeMs);
        const consistency = TypingAnalytics.calculateConsistency(newKeystrokes);

        const newErrors = isCorrect ? errorCount : errorCount + 1;
        const newAccuracy = Math.max(0, 100 - ((newErrors / newUserInput.length) * 100));

        // --- STRICT MODE CHECK ---
        // For now, we hardcode the threshold or get it from active lesson state if available.
        // Since store doesn't explicitly track "Active Lesson Config" (only targetText), 
        // we might need to rely on a passed prop or context? 
        // Actually, let's assume strict logic based on a flag in store or derived.
        // But for this MVC step, let's just use strict logic if the text is long and accuracy < 90?
        // No, better: Let's assume the component handles the "Stop" if validation fails?
        // Ideally the store should handle it.
        // Let's defer "Strict Mode Failure" to the UI side or handle it in specific Exam store later?
        // Actually, let's just add a simple check: if errorCount > 10, fail?
        // The requirement was "Exam Mode".
        // Let's Update the store to accept `mode` in `setText` or `startSession`.

        // REVISION: We need to know if we are in exam mode.
        // I will add `sessionType` to the store state.


        // Check Completion
        const finished = newUserInput.length === targetText.length;

        // EXAM MODE: Fail if accuracy check fails (with buffer)
        const { sessionType } = get();
        let failed = false;
        if (sessionType === 'exam' && newUserInput.length > 20 && newAccuracy < 95) {
            failed = true;
            // Early termination logic
            console.log("EXAM FAILED: Accuracy dropped below 95%");
        }

        set({
            userInput: newUserInput,
            currentIndex: currentIndex + 1,
            startTime: newStartTime,
            keystrokes: newKeystrokes,
            wpm: newWpm,
            accuracy: Math.round(newAccuracy),
            errorCount: newErrors,
            consistency: parseFloat(consistency.toFixed(2)),
            isFinished: finished || failed
        });

        if (failed) {
            soundManager.playError();
            // Maybe set a 'status' field to 'failed'? 
            // For now, isFinished=true with incomplete text acts as 'gave up/failed'.
        } else if (finished) {
            soundManager.playSuccess();
            get().saveSession();
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
            isFinished: false
        });
        return undefined;
    },

    saveSession: async () => {
        const { wpm, accuracy, errorCount, consistency, keystrokes } = get();
        const user = auth.currentUser;

        // --- GAMIFICATION TRIGGER ---
        const { addXp, checkBadges } = useProgressStore.getState();

        // Base XP for finishing a lesson
        let earnedXp = 50;
        // Bonus for accuracy
        if (accuracy >= 98) earnedXp += 20;
        // Bonus for speed
        if (wpm > 40) earnedXp += 10;

        addXp(earnedXp);

        // Check for new badges
        const unlocked = checkBadges({ wpm, accuracy });
        if (unlocked.length > 0) {
            console.log("NEW BADGES UNLOCKED:", unlocked.map(b => b.title));
            // In future: Trigger UI Toast
            soundManager.playSuccess(); // Extra sound
        }
        // ----------------------------

        const weakestKeys = TypingAnalytics.getWeakestKeys(keystrokes);

        const sessionData = {
            wpm,
            accuracy,
            errorCount,
            consistency,
            weakestKeys,
            timestamp: Date.now(),
            mode: 'practice'
        };

        if (!user) {
            // Save to localStorage for guests
            const existing = JSON.parse(localStorage.getItem('deepeye_guest_sessions') || '[]');
            localStorage.setItem('deepeye_guest_sessions', JSON.stringify([sessionData, ...existing].slice(0, 50)));
            console.log("Guest Session Saved Locally!");
            return;
        }

        try {
            // 1. Save Session Detail
            await addDoc(collection(db, 'users', user.uid, 'sessions'), {
                ...sessionData,
                timestamp: serverTimestamp(),
            });

            // 2. Update Leaderboard if this is a personal best
            const leaderboardRef = doc(db, 'leaderboard', user.uid);
            const lbSnap = await getDoc(leaderboardRef);
            const currentLbData = lbSnap.exists() ? lbSnap.data() : null;

            if (!currentLbData || wpm > currentLbData.wpm) {
                await setDoc(leaderboardRef, {
                    userId: user.uid,
                    displayName: user.displayName || 'Anonymous Operative',
                    photoURL: user.photoURL,
                    wpm,
                    accuracy,
                    timestamp: serverTimestamp()
                }, { merge: true });
                console.log("Leaderboard Record Updated!");
            }

            console.log("Cloud Session Saved!");
        } catch (e) {
            console.error("Error saving session:", e);
        }
    }
}));


