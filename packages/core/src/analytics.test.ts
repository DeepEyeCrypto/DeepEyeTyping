import { describe, it, expect } from 'vitest';
import { TypingAnalytics } from './analytics';
import type { KeyStroke } from './types';

describe('TypingAnalytics', () => {
    describe('calculateWPM', () => {
        it('should calculate correct WPM for standard input', () => {
            const keystrokes: KeyStroke[] = Array(50).fill({ isCorrect: true, key: 'a', expected: 'a', timestamp: 0 });
            // 50 chars = 10 words. 1 minute elapsed. Result should be 10 WPM.
            const totalTimeMs = 60000;
            const wpm = TypingAnalytics.calculateWPM(keystrokes, totalTimeMs);
            expect(wpm).toBe(10);
        });

        it('should return 0 for zero time', () => {
            const keystrokes: KeyStroke[] = [{ isCorrect: true, key: 'a', expected: 'a', timestamp: 0 }];
            const wpm = TypingAnalytics.calculateWPM(keystrokes, 0);
            expect(wpm).toBe(0);
        });

        it('should handle small amounts of chars correctly', () => {
            const keystrokes: KeyStroke[] = Array(5).fill({ isCorrect: true, key: 'a', expected: 'a', timestamp: 0 });
            // 5 chars = 1 word. 6 seconds = 0.1 minutes. Result: 1 / 0.1 = 10 WPM.
            const totalTimeMs = 6000;
            const wpm = TypingAnalytics.calculateWPM(keystrokes, totalTimeMs);
            expect(wpm).toBe(10);
        });
    });

    describe('calculateConsistency', () => {
        it('should return 0 for less than 3 keystrokes', () => {
            const keystrokes: KeyStroke[] = [
                { isCorrect: true, key: 'a', expected: 'a', timestamp: 1000 },
                { isCorrect: true, key: 'b', expected: 'b', timestamp: 1200 }
            ];
            expect(TypingAnalytics.calculateConsistency(keystrokes)).toBe(0);
        });

        it('should return 0 for perfectly consistent typing (stddev = 0)', () => {
            const keystrokes: KeyStroke[] = [
                { isCorrect: true, key: 'a', expected: 'a', timestamp: 1000 },
                { isCorrect: true, key: 'b', expected: 'b', timestamp: 1200 },
                { isCorrect: true, key: 'c', expected: 'c', timestamp: 1400 },
                { isCorrect: true, key: 'd', expected: 'd', timestamp: 1600 }
            ];
            // Latencies are all 200. StdDev = 0. CV = 0.
            expect(TypingAnalytics.calculateConsistency(keystrokes)).toBe(0);
        });

        it('should filter out massive pauses (> 2s)', () => {
            const keystrokes: KeyStroke[] = [
                { isCorrect: true, key: 'a', expected: 'a', timestamp: 0 },
                { isCorrect: true, key: 'b', expected: 'b', timestamp: 200 },
                { isCorrect: true, key: 'c', expected: 'c', timestamp: 4000 }, // 3.8s gap
                { isCorrect: true, key: 'd', expected: 'd', timestamp: 4200 }
            ];
            // Only gaps [200, 200] should be kept.
            expect(TypingAnalytics.calculateConsistency(keystrokes)).toBe(0);
        });
    });

    describe('getWeakestKeys', () => {
        it('should identify keys with most errors', () => {
            const keystrokes: KeyStroke[] = [
                { isCorrect: false, key: 'x', expected: 'a', timestamp: 0 },
                { isCorrect: false, key: 'x', expected: 'a', timestamp: 0 },
                { isCorrect: false, key: 'y', expected: 'b', timestamp: 0 },
                { isCorrect: true, key: 'c', expected: 'c', timestamp: 0 }
            ];
            const weakest = TypingAnalytics.getWeakestKeys(keystrokes);
            expect(weakest).toEqual(['a', 'b']);
        });

        it('should return top 3 keys', () => {
            const keystrokes: KeyStroke[] = [
                { isCorrect: false, key: 'x', expected: 'a', timestamp: 0 },
                { isCorrect: false, key: 'x', expected: 'b', timestamp: 0 },
                { isCorrect: false, key: 'x', expected: 'c', timestamp: 0 },
                { isCorrect: false, key: 'x', expected: 'd', timestamp: 0 },
                { isCorrect: false, key: 'x', expected: 'a', timestamp: 0 }
            ];
            const weakest = TypingAnalytics.getWeakestKeys(keystrokes);
            expect(weakest.length).toBe(3);
            expect(weakest[0]).toBe('a');
        });
    });
});
