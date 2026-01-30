
import { useEffect, useState, useRef } from 'react';
import { useTypingStore } from '../store';

export type AdviceType = 'RHYTHM_BREAK' | 'SPEED_TRAP' | 'HESITATION' | 'FLOW_STATE' | null;

interface Advice {
    type: AdviceType;
    message: string;
    triggerTime: number;
}

export const useTypingAnalyzer = () => {
    const { keystrokes, wpm, accuracy, consistency } = useTypingStore();
    const [advice, setAdvice] = useState<Advice | null>(null);
    const lastAdviceTime = useRef<number>(0);

    useEffect(() => {
        if (keystrokes.length < 10) return;

        const now = Date.now();
        // Prevent advice spam (max 1 advice per 3 seconds)
        if (now - lastAdviceTime.current < 3000) return;

        let newAdvice: Advice | null = null;
        // const lastKeystroke = keystrokes[keystrokes.length - 1];

        // 1. Rhythm Check
        // If CV > 0.6, rhythm is very erratic
        if (consistency > 0.6 && wpm > 20) {
            newAdvice = {
                type: 'RHYTHM_BREAK',
                message: 'Rhythm erratic. Slow down to lock in.',
                triggerTime: now
            };
        }

        // 2. Speed Trap (Fast but inaccurate)
        // If speed > 60 but accuracy < 92%
        else if (wpm > 60 && accuracy < 92) {
            newAdvice = {
                type: 'SPEED_TRAP',
                message: 'Accuracy first, speed second.',
                triggerTime: now
            };
        }

        // 3. Hesitation (Long pauses)
        // If last key took > 800ms (and it wasn't the first key)
        else if (keyLatency(keystrokes) > 800 && keystrokes.length > 2) {
            newAdvice = {
                type: 'HESITATION',
                message: 'Read ahead to avoid pausing.',
                triggerTime: now
            };
        }

        // 4. Flow State Reward
        // High speed, great accuracy, tight rhythm
        else if (wpm > 50 && accuracy > 98 && consistency < 0.3) {
            newAdvice = {
                type: 'FLOW_STATE',
                message: 'Flow State Detected. Keep pushing.',
                triggerTime: now
            };
        }

        if (newAdvice) {
            setAdvice(newAdvice);
            lastAdviceTime.current = now;

            // Clear advice after 4 seconds
            setTimeout(() => setAdvice(null), 4000);
        }

    }, [keystrokes, wpm, accuracy, consistency]);

    return advice;
};

// Helper: Get latency of the most recent keystroke
function keyLatency(keystrokes: any[]): number {
    if (keystrokes.length < 2) return 0;
    const last = keystrokes[keystrokes.length - 1];
    const prev = keystrokes[keystrokes.length - 2];
    return last.timestamp - prev.timestamp;
}
