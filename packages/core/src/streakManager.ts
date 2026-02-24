// ============================================================
// STREAK MANAGER - DeepEyeTyping
// ============================================================

import type { StreakState, StreakConfig } from './types/engagement';

export const DEFAULT_STREAK_CONFIG: StreakConfig = {
    graceDaysPerWeek: 1,
    shieldsPerMonth: 3,
    minSessionSeconds: 30,
    minWpmForStreak: 50,
};

export function createInitialStreakState(): StreakState {
    const now = new Date();
    return {
        current: 0,
        best: 0,
        lastPracticeDate: now.toISOString(),
        graceDaysUsedThisWeek: 0,
        shieldsRemaining: DEFAULT_STREAK_CONFIG.shieldsPerMonth,
        shieldsUsedThisMonth: 0,
    };
}

export function calculateStreak(
    state: StreakState,
    sessionDuration: number,
    sessionWpm: number,
    config: StreakConfig = DEFAULT_STREAK_CONFIG
): StreakState {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDate = new Date(state.lastPracticeDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    // Check if session qualifies for streak
    if (sessionDuration < config.minSessionSeconds || sessionWpm < config.minWpmForStreak) {
        return state;
    }

    // Check if it's the same day
    if (diffDays === 0) {
        return {
            ...state,
            lastPracticeDate: now.toISOString(),
        };
    }

    // Check if streak continues (within 1 day)
    if (diffDays === 1) {
        const newStreak = state.current + 1;
        return {
            current: newStreak,
            best: Math.max(state.best, newStreak),
            lastPracticeDate: now.toISOString(),
            graceDaysUsedThisWeek: getWeekOfYear(now) !== getWeekOfYear(lastDate) ? 0 : state.graceDaysUsedThisWeek,
            shieldsRemaining: getMonthOfYear(now) !== getMonthOfYear(lastDate) ? DEFAULT_STREAK_CONFIG.shieldsPerMonth : state.shieldsRemaining,
            shieldsUsedThisMonth: getMonthOfYear(now) !== getMonthOfYear(lastDate) ? 0 : state.shieldsUsedThisMonth,
        };
    }

    // Check grace day
    if (diffDays === 2 && state.graceDaysUsedThisWeek < DEFAULT_STREAK_CONFIG.graceDaysPerWeek) {
        const newStreak = state.current + 1;
        return {
            current: newStreak,
            best: Math.max(state.best, newStreak),
            lastPracticeDate: now.toISOString(),
            graceDaysUsedThisWeek: state.graceDaysUsedThisWeek + 1,
            shieldsRemaining: state.shieldsRemaining,
            shieldsUsedThisMonth: state.shieldsUsedThisMonth,
        };
    }

    // Check shield
    if (diffDays <= 7 && state.shieldsRemaining > 0) {
        const newStreak = state.current + 1;
        return {
            current: newStreak,
            best: Math.max(state.best, newStreak),
            lastPracticeDate: now.toISOString(),
            graceDaysUsedThisWeek: state.graceDaysUsedThisWeek,
            shieldsRemaining: state.shieldsRemaining - 1,
            shieldsUsedThisMonth: state.shieldsUsedThisMonth + 1,
        };
    }

    // Streak broken - start fresh
    return {
        current: 1,
        best: Math.max(state.best, 1),
        lastPracticeDate: now.toISOString(),
        graceDaysUsedThisWeek: 0,
        shieldsRemaining: state.shieldsRemaining,
        shieldsUsedThisMonth: state.shieldsUsedThisMonth,
    };
}

function getWeekOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
}

function getMonthOfYear(date: Date): number {
    return date.getMonth();
}

export function getStreakMessage(state: StreakState): string {
    if (state.current === 0) {
        return "Start your streak today!";
    }
    if (state.current < 7) {
        return `Day ${state.current}! Keep it going!`;
    }
    if (state.current < 30) {
        return `${state.current} day streak! You're on fire!`;
    }
    if (state.current < 100) {
        return `${state.current} days! Incredible dedication!`;
    }
    return `${state.current} days! You're a typing legend!`;
}
