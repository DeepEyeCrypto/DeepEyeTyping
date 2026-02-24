import { describe, it, expect } from 'vitest';
import { TypingAnalytics } from './analytics';

describe('TypingAnalytics - Advanced Edge Cases', () => {
    describe('Consistency Boundary Conditions', () => {
        it('should identify "Flow State" (high consistency score)', () => {
            // Need at least 5 keystrokes for the function to calculate
            const keystrokes = [
                { timestamp: 1000, isCorrect: true, key: 'a', expected: 'a' },
                { timestamp: 1100, isCorrect: true, key: 'b', expected: 'b' },
                { timestamp: 1205, isCorrect: true, key: 'c', expected: 'c' },
                { timestamp: 1302, isCorrect: true, key: 'd', expected: 'd' },
                { timestamp: 1400, isCorrect: true, key: 'e', expected: 'e' }
            ] as any[];
            // Mean ~100ms. StdDev is very low, resulting in high consistency score
            const consistency = TypingAnalytics.calculateConsistency(keystrokes);
            // High consistency (steady rhythm) should result in high score
            expect(consistency).toBeGreaterThan(80);
        });

        it('should identify "Erratic" rhythm (low consistency score)', () => {
            const keystrokes = [
                { timestamp: 1000, isCorrect: true, key: 'a', expected: 'a' },
                { timestamp: 1050, isCorrect: true, key: 'b', expected: 'b' }, // 50ms
                { timestamp: 1250, isCorrect: true, key: 'c', expected: 'c' }, // 200ms
                { timestamp: 1270, isCorrect: true, key: 'd', expected: 'd' }  // 20ms
            ] as any[];
            // Mean = (50+200+20)/3 = 90.
            // StdDev will be high relative to 90, resulting in low consistency score
            const consistency = TypingAnalytics.calculateConsistency(keystrokes);
            // High variance (erratic typing) should result in low consistency score
            expect(consistency).toBeLessThan(30);
        });
    });

    describe('WPM Stress Tests', () => {
        it('should handle extremely high speed (Super-human)', () => {
            // 60,000 chars in 1 minute = 12,000 WPM
            const keystrokes = Array(60000).fill({ isCorrect: true, key: 'a', expected: 'a', timestamp: 0 });
            const wpm = TypingAnalytics.calculateWPM(keystrokes, 60000);
            expect(wpm).toBe(12000);
        });

        it('should handle zero keystrokes', () => {
            expect(TypingAnalytics.calculateWPM([], 1000)).toBe(0);
        });
    });
});
