import type { KeyStroke } from './types';

export class TypingAnalytics {

    /**
     * Calculates Neural Resistance (Complexity Index)
     * Scores text based on symbol density, capitalization cycles, and word length.
     */
    static calculateComplexity(text: string) {
        if (!text.length) return { score: 0, level: 'IDLE' };

        const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
        const caps = (text.match(/[A-Z]/g) || []).length;
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const avgWordLen = words.reduce((acc, word) => acc + word.length, 0) / (words.length || 1);

        // Weights: Symbols (5), Caps (2), Word Length (4)
        const rawScore = (symbols * 5) + (caps * 2) + (avgWordLen * 4);
        const normalizedScore = Math.min(100, Math.round(rawScore));

        let level = 'FOUNDATION';
        if (normalizedScore > 80) level = 'FLOW STATE';
        else if (normalizedScore > 60) level = 'SPEED';
        else if (normalizedScore > 35) level = 'ACCURACY';

        return {
            score: normalizedScore,
            level,
            metadata: {
                symbolDensity: parseFloat((symbols / text.length).toFixed(2)),
                capRatio: parseFloat((caps / text.length).toFixed(2)),
                avgWordLength: parseFloat(avgWordLen.toFixed(1))
            }
        };
    }

    /**
     * Calculates the Variation (Consistency) of typing rhythm.
     * Uses Coefficient of Variation (CV) of inter-key latencies.
     */
    static calculateConsistency(keystrokes: KeyStroke[]): number {
        if (keystrokes.length < 5) return 0;

        const latencies: number[] = [];
        for (let i = 1; i < keystrokes.length; i++) {
            const diff = keystrokes[i].timestamp - keystrokes[i - 1].timestamp;
            // Filter out outliers > 1.5s to maintain rhythm focus
            if (diff < 1500) latencies.push(diff);
        }

        if (latencies.length < 3) return 0;

        const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const squaredDiffs = latencies.map(x => Math.pow(x - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;
        const stdDev = Math.sqrt(variance);

        // Lower CV (0 to ~0.5) implies high consistency
        // Transformed to 0-100 score where 100 is perfect rhythm
        const cv = stdDev / mean;
        const score = Math.max(0, 100 - (cv * 150));
        return Math.round(score);
    }

    /**
     * Calculates WPM with standard formula: (Chars / 5) / Minutes
     */
    static calculateWPM(keystrokes: KeyStroke[], totalTimeMs: number): number {
        if (totalTimeMs <= 0 || keystrokes.length === 0) return 0;
        const minutes = totalTimeMs / 60000;
        const chars = keystrokes.length;
        return Math.round((chars / 5) / minutes);
    }

    /**
     * Detects speed spikes within the last window of keystrokes.
     */
    static calculateBurstWPM(keystrokes: KeyStroke[], windowSize: number = 10): number {
        if (keystrokes.length < windowSize) return 0;
        const window = keystrokes.slice(-windowSize);
        const startTime = window[0].timestamp;
        const endTime = window[windowSize - 1].timestamp;
        const durationMs = endTime - startTime;

        if (durationMs <= 0) return 0;
        return this.calculateWPM(window, durationMs);
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

        return Object.entries(errorsByKey)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([key]) => key);
    }

    /**
     * Calculates the detailed temporal map for behavioral biometrics.
     */
    static calculateTemporalMap(keystrokes: any[]): Record<string, any> {
        const map: Record<string, { dwell: number[], flight: number[], errors: number }> = {};

        keystrokes.forEach((ks, i) => {
            const key = ks.expected.toLowerCase();
            if (!map[key]) map[key] = { dwell: [], flight: [], errors: 0 };

            if (ks.releaseTime && ks.pressTime) {
                map[key].dwell.push(ks.releaseTime - ks.pressTime);
            }
            if (!ks.isCorrect) map[key].errors++;

            const prev = keystrokes[i - 1];
            if (prev?.releaseTime) {
                map[key].flight.push(ks.pressTime - prev.releaseTime);
            }
        });

        return Object.keys(map).reduce((acc, key) => {
            const m = map[key];
            acc[key] = {
                avgDwellTime: m.dwell.length ? Math.round(m.dwell.reduce((a, b) => a + b, 0) / m.dwell.length) : 0,
                avgFlightTime: m.flight.length ? Math.round(m.flight.reduce((a, b) => a + b, 0) / m.flight.length) : 0,
                errorRate: m.errors
            };
            return acc;
        }, {} as Record<string, any>);
    }
}
