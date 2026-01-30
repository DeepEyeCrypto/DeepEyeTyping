import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BADGES, LEVEL_CURVE } from './gamification';
import type { Badge } from './gamification';

interface UserProgress {
    xp: number;
    level: number;
    unlockedBadges: string[];
    lifetimeStats: {
        totalSessions: number;
        totalKeystrokes: number;
        maxWpm: number;
    };

    // Actions
    addXp: (amount: number) => void;
    checkBadges: (sessionStats: { wpm: number; accuracy: number }) => Badge[];
    setProgress: (data: Partial<Omit<UserProgress, 'addXp' | 'checkBadges' | 'setProgress'>>) => void;
}

export const useProgressStore = create<UserProgress>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            unlockedBadges: [],
            lifetimeStats: {
                totalSessions: 0,
                totalKeystrokes: 0,
                maxWpm: 0
            },

            addXp: (amount) => {
                const { xp, level } = get();
                const newXp = xp + amount;

                // Check against centralized curve
                const nextLevelReq = LEVEL_CURVE(level);
                let newLevel = level;

                if (newXp >= nextLevelReq) {
                    newLevel = level + 1;
                    // Trigger Level Up Event (could be specific action or just state change)
                }

                set({ xp: newXp, level: newLevel });
            },

            checkBadges: (sessionStats) => {
                const { unlockedBadges, lifetimeStats } = get();
                const newBadges: Badge[] = [];

                const currentStats = {
                    wpm: sessionStats.wpm,
                    accuracy: sessionStats.accuracy,
                    totalSessions: lifetimeStats.totalSessions + 1, // Anticipating the save
                    maxWpm: Math.max(lifetimeStats.maxWpm, sessionStats.wpm)
                };

                BADGES.forEach(badge => {
                    if (!unlockedBadges.includes(badge.id)) {
                        if (badge.condition(currentStats)) {
                            newBadges.push(badge);
                        }
                    }
                });

                if (newBadges.length > 0) {
                    set({
                        unlockedBadges: [...unlockedBadges, ...newBadges.map(b => b.id)],
                        lifetimeStats: {
                            ...lifetimeStats,
                            totalSessions: currentStats.totalSessions,
                            maxWpm: currentStats.maxWpm
                        }
                    });
                } else {
                    // Still update stats even if no badge
                    set({
                        lifetimeStats: {
                            ...lifetimeStats,
                            totalSessions: currentStats.totalSessions,
                            maxWpm: currentStats.maxWpm
                        }
                    });
                }

                return newBadges;
            },

            setProgress: (data) => {
                set((state) => ({ ...state, ...data }));
            }
        }),
        {
            name: 'deepeye-progress', // LocalStorage key
        }
    )
);
