import type { KeyStroke } from './types';
import { LESSONS } from './lessons';

export interface WeakKey {
    char: string;
    errorRate: number;
    avgLatency: number;
}

export interface CoachRecommendation {
    insight: string;
    suggestedLessonId: string;
    focusKeys: string[];
}

export class AiCoach {
    static analyzeWeaknesses(history: KeyStroke[]): WeakKey[] {
        const keyMap = new Map<string, { total: number, errors: number, latencySum: number }>();

        history.forEach((k, i) => {
            const char = k.expected.toLowerCase();
            if (!keyMap.has(char)) {
                keyMap.set(char, { total: 0, errors: 0, latencySum: 0 });
            }
            const data = keyMap.get(char)!;
            data.total++;
            if (!k.isCorrect) data.errors++;

            // Latency = press time - previous release time (or start)
            // Simplified: press time - previous press time
            if (i > 0) {
                const latency = k.pressTime - history[i - 1].pressTime;
                if (latency < 2000) data.latencySum += latency; // Ignore huge pauses
            }
        });

        const weaknesses: WeakKey[] = [];
        keyMap.forEach((val, key) => {
            if (val.total < 5) return; // Need sample size
            const errorRate = val.errors / val.total;
            const avgLatency = val.latencySum / val.total;

            if (errorRate > 0.1 || avgLatency > 300) { // Thresholds
                weaknesses.push({ char: key, errorRate, avgLatency });
            }
        });

        return weaknesses.sort((a, b) => b.errorRate - a.errorRate); // Worst first
    }

    static getRecommendation(weaknesses: WeakKey[]): CoachRecommendation {
        if (weaknesses.length === 0) {
            return {
                insight: "Your neural synchronization is optimal. Push for speed.",
                suggestedLessonId: 'sprint_1',
                focusKeys: []
            };
        }

        const worstKey = weaknesses[0].char;
        const focusKeys = weaknesses.slice(0, 3).map(w => w.char);

        // Find a lesson containing these keys
        const lesson = LESSONS.find(l => l.text.toLowerCase().includes(worstKey));

        return {
            insight: `Detected signal degradation on key '${worstKey.toUpperCase()}'. Rerouting power to precision drills.`,
            suggestedLessonId: lesson ? lesson.id : 'basic_home_row',
            focusKeys
        };
    }
}
