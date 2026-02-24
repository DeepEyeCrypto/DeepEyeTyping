import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GamificationEngine } from './gamification';
import type { DailyMission, SessionStats, UserProgress } from './types/gamification';

interface ProgressState extends UserProgress {
    dailyMissions: DailyMission[];
    lifetimeStats: { maxWpm: number; raceWins: number };

    // Actions
    addSession: (stats: SessionStats) => void;
    checkStreak: () => void;
    setProgress: (state: Partial<ProgressState>) => void;
}

const INITIAL_MISSIONS: DailyMission[] = [
    { id: 'daily_warmup', title: 'Type 500 Characters', target: 500, current: 0, type: 'chars', xpReward: 50, completed: false },
    { id: 'daily_precision', title: '98% Accuracy Run', target: 1, current: 0, type: 'accuracy', xpReward: 100, completed: false }
];

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            currentStreak: 0,
            bestStreak: 0,
            lastPracticeDate: new Date().toISOString(),
            badges: [],
            dailyXp: 0,
            dailyMissions: INITIAL_MISSIONS,
            lifetimeStats: { maxWpm: 0, raceWins: 0 },

            setProgress: (newState) => set(newState),

            addSession: (stats: SessionStats) => {
                const { xp, badges, dailyXp, dailyMissions } = get();

                // 1. Calculate XP
                const sessionXp = GamificationEngine.calculateSessionXp(stats);
                const newXp = xp + sessionXp;
                const newDailyXp = dailyXp + sessionXp;

                // 2. Check Level Up
                const newLevelInfo = GamificationEngine.calculateLevel(newXp);

                // 3. Check Badges
                const unlockedBadges = GamificationEngine.checkBadges(stats, badges);
                const newBadges = [...badges, ...unlockedBadges.map(b => b.id)];

                // 4. Update Missions
                const newMissions = dailyMissions.map(m => {
                    if (m.completed) return m;
                    let progress = 0;
                    if (m.type === 'wpm' && stats.wpm >= m.target) progress = 1;
                    if (m.type === 'accuracy' && stats.accuracy >= 98) progress = 1;
                    // For accumulating types like 'chars', we need the char count from stats
                    // Assuming stats has 'chars' or we pass it. For now, WPM/Acc missions logic.

                    if (progress >= m.target) {
                        return { ...m, current: m.target, completed: true };
                    }
                    return m;
                });

                set({
                    xp: newXp,
                    level: newLevelInfo.level,
                    badges: newBadges,
                    dailyXp: newDailyXp,
                    dailyMissions: newMissions
                });
            },

            checkStreak: () => {
                const { lastPracticeDate, currentStreak } = get();
                const last = new Date(lastPracticeDate);
                const now = new Date();

                // Reset time to midnight for comparison
                last.setHours(0, 0, 0, 0);
                const today = new Date(now);
                today.setHours(0, 0, 0, 0);

                const diffDays = (today.getTime() - last.getTime()) / (1000 * 3600 * 24);

                if (diffDays === 1) {
                    // Streak continued
                    set({ currentStreak: currentStreak + 1, lastPracticeDate: now.toISOString() });
                } else if (diffDays > 1) {
                    // Streak broken
                    set({ currentStreak: 1, lastPracticeDate: now.toISOString() });
                } else {
                    // Same day, just update time
                    set({ lastPracticeDate: now.toISOString() });
                }
            }
        }),
        {
            name: 'deepeye-progress-storage'
        }
    )
);
