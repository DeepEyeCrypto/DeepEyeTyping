import { create } from 'zustand';
import { db, auth } from './firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { soundManager } from './soundManager';

interface TypingState {
    // Input State
    targetText: string;
    userInput: string;
    currentIndex: number;

    // Stats
    startTime: number | null;
    wpm: number;
    accuracy: number;
    errorCount: number;
    isFinished: boolean;

    // Actions
    setText: (text: string) => void;
    inputChar: (char: string) => void;
    backspace: () => void;
    reset: () => void;
    saveSession: () => Promise<void>;
}

export const useTypingStore = create<TypingState>((set, get) => ({
    targetText: "The quick brown fox jumps over the lazy dog.",
    userInput: "",
    currentIndex: 0,
    startTime: null,
    wpm: 0,
    accuracy: 100,
    errorCount: 0,
    isFinished: false,

    setText: (text) => set({ targetText: text, reset: get().reset() }),

    inputChar: (char) => {
        const { targetText, userInput, currentIndex, startTime, errorCount, isFinished } = get();

        if (isFinished) return;

        // Start timer on first input
        const newStartTime = startTime || Date.now();

        const newUserInput = userInput + char;
        const isCorrect = char === targetText[currentIndex];

        // Sound FX
        if (isCorrect) {
            soundManager.playKeypress();
        } else {
            soundManager.playError();
        }

        // Calculate Stats
        const elapsedMinutes = (Date.now() - newStartTime) / 60000;
        const wordsTyped = newUserInput.length / 5;
        const newWpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
        const newErrors = isCorrect ? errorCount : errorCount + 1;
        const newAccuracy = Math.max(0, 100 - ((newErrors / newUserInput.length) * 100));

        // Check Completion
        const finished = newUserInput.length === targetText.length;

        set({
            userInput: newUserInput,
            currentIndex: currentIndex + 1,
            startTime: newStartTime,
            wpm: newWpm,
            accuracy: Math.round(newAccuracy),
            errorCount: newErrors,
            isFinished: finished
        });

        if (finished) {
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
            wpm: 0,
            accuracy: 100,
            errorCount: 0,
            isFinished: false
        });
        return undefined;
    },

    saveSession: async () => {
        const { wpm, accuracy, errorCount } = get();
        const user = auth.currentUser;

        if (!user) return; // Don't save for guests yet

        try {
            await addDoc(collection(db, 'users', user.uid, 'sessions'), {
                wpm,
                accuracy,
                errorCount,
                timestamp: serverTimestamp(),
                mode: 'practice'
            });
            console.log("Session Saved!");
        } catch (e) {
            console.error("Error saving session:", e);
        }
    }
}));
