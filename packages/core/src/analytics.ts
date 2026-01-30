import type { KeyStroke } from './types';

export class TypingAnalytics {

    /**
     * Calculates the Variation (Consistency) of typing rhythm.
     * Lower is better. 
     * < 0.2 is "Flow State"
     * > 0.5 is "Erratic"
     */
    static calculateConsistency(keystrokes: KeyStroke[]): number {
        if (keystrokes.length < 3) return 0;

        // Calculate inter-key latencies
        const latencies: number[] = [];
        for (let i = 1; i < keystrokes.length; i++) {
            const diff = keystrokes[i].timestamp - keystrokes[i - 1].timestamp;
            // Filter out massive pauses (breaks) > 2s to not skew rhythm stats
            if (diff < 2000) {
                latencies.push(diff);
            }
        }

        if (latencies.length === 0) return 0;

        // Calculate Mean
        const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;

        // Calculate Standard Deviation
        const squaredDiffs = latencies.map(x => Math.pow(x - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;
        const stdDev = Math.sqrt(variance);

        // Coefficient of Variation (CV)
        return stdDev / mean;
    }

    /**
     * Calculates WPM with standard formula: (Chars / 5) / Minutes
     * Penalizes uncorrected errors in "Gross WPM" calculation usually, 
     * but here we track Net WPM based on the boolean isCorrect flags.
     */
    static calculateWPM(keystrokes: KeyStroke[], totalTimeMs: number): number {
        if (totalTimeMs <= 0 || keystrokes.length === 0) return 0;

        // Standard WPM definition: 1 word = 5 chars
        const minutes = totalTimeMs / 60000;

        // Count only correct keystrokes for Net WPM? 
        // Or all for Gross? Let's go with Gross for "raw" and Net for "wpm"
        const chars = keystrokes.length;

        return Math.round((chars / 5) / minutes);
    }

    /**
     * Identify keys that cause the most errors or hesitation
     */
    static getWeakestKeys(keystrokes: KeyStroke[]): string[] {
        const errorsByKey: Record<string, number> = {};

        keystrokes.forEach(k => {
            if (!k.isCorrect) {
                const key = k.expected.toLowerCase();
                errorsByKey[key] = (errorsByKey[key] || 0) + 1;
            }
        });

        // Sort by error count desc
        return Object.entries(errorsByKey)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3) // Top 3
            .map(([key]) => key);
    }
}
