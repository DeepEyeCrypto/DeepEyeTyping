import type { Badge, LevelThreshold, SessionStats } from './types/gamification';

// --- CONFIGURATION ---

export const LEVEL_CURVE: LevelThreshold[] = Array.from({ length: 100 }, (_, i) => ({
    level: i + 1,
    xpRequired: Math.floor(100 * Math.pow(1.1, i)), // Exponential curve
    title: getTitleForLevel(i + 1)
}));

function getTitleForLevel(level: number): string {
    if (level < 10) return "Initiate";
    if (level < 30) return "Operative";
    if (level < 60) return "Specialist";
    if (level < 90) return "Architect";
    return "Ascendant";
}

// --- 30 BADGES FOR COMPETITIVE TYPISTS ---

export const BADGES: Badge[] = [
    // SPEED BADGES (1-6)
    {
        id: 'speed_10',
        title: 'Speed Starter',
        description: 'Reach 10 WPM in any session',
        icon: 'Zap',
        rarity: 'common',
        condition: (s) => s.wpm >= 10
    },
    {
        id: 'speed_30',
        title: 'Quick Keys',
        description: 'Reach 30 WPM in any session',
        icon: 'Zap',
        rarity: 'common',
        condition: (s) => s.wpm >= 30
    },
    {
        id: 'speed_50',
        title: 'Fifty Club',
        description: 'Reach 50 WPM in any session',
        icon: 'Zap',
        rarity: 'common',
        condition: (s) => s.wpm >= 50
    },
    {
        id: 'speed_70',
        title: 'Fast Fingers',
        description: 'Reach 70 WPM in any session',
        icon: 'Lightning',
        rarity: 'rare',
        condition: (s) => s.wpm >= 70
    },
    {
        id: 'speed_90',
        title: 'Speed Demon',
        description: 'Reach 90 WPM in any session',
        icon: 'Rocket',
        rarity: 'epic',
        condition: (s) => s.wpm >= 90
    },
    {
        id: 'speed_120',
        title: 'Hyper Speed',
        description: 'Reach 120 WPM in any session',
        icon: 'Rocket',
        rarity: 'legendary',
        condition: (s) => s.wpm >= 120
    },

    // ACCURACY BADGES (7-10)
    {
        id: 'acc_90',
        title: 'Sharp Eye',
        description: 'Achieve 90% accuracy in a session',
        icon: 'Target',
        rarity: 'common',
        condition: (s) => s.accuracy >= 90
    },
    {
        id: 'acc_95',
        title: 'Precision',
        description: 'Achieve 95% accuracy in a session',
        icon: 'Crosshair',
        rarity: 'rare',
        condition: (s) => s.accuracy >= 95
    },
    {
        id: 'acc_98',
        title: 'Surgeon',
        description: 'Achieve 98% accuracy in a session',
        icon: 'Activity',
        rarity: 'epic',
        condition: (s) => s.accuracy >= 98
    },
    {
        id: 'acc_100',
        title: 'Perfect',
        description: 'Achieve 100% accuracy in a session',
        icon: 'Award',
        rarity: 'legendary',
        condition: (s) => s.accuracy === 100
    },

    // STREAK BADGES (11-14)
    {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day typing streak',
        icon: 'Flame',
        rarity: 'common',
        condition: (s) => (s.streak ?? 0) >= 7
    },
    {
        id: 'streak_30',
        title: 'Monthly Fire',
        description: 'Maintain a 30-day typing streak',
        icon: 'Flame',
        rarity: 'rare',
        condition: (s) => (s.streak ?? 0) >= 30
    },
    {
        id: 'streak_100',
        title: 'Century',
        description: 'Maintain a 100-day typing streak',
        icon: 'Flame',
        rarity: 'epic',
        condition: (s) => (s.streak ?? 0) >= 100
    },
    {
        id: 'streak_365',
        title: 'Year of Fire',
        description: 'Maintain a 365-day typing streak',
        icon: 'Crown',
        rarity: 'legendary',
        condition: (s) => (s.streak ?? 0) >= 365
    },

    // TIME BADGES (15-18)
    {
        id: 'time_1h',
        title: 'Hour Power',
        description: 'Practice for 1 hour total',
        icon: 'Clock',
        rarity: 'common',
        condition: (s) => s.duration >= 3600
    },
    {
        id: 'time_10h',
        title: 'Dedicated',
        description: 'Practice for 10 hours total',
        icon: 'Clock',
        rarity: 'rare',
        condition: (s) => s.duration >= 36000
    },
    {
        id: 'time_50h',
        title: 'Master Clock',
        description: 'Practice for 50 hours total',
        icon: 'Hourglass',
        rarity: 'epic',
        condition: (s) => s.duration >= 180000
    },
    {
        id: 'time_100h',
        title: 'Time Lord',
        description: 'Practice for 100 hours total',
        icon: 'Hourglass',
        rarity: 'legendary',
        condition: (s) => s.duration >= 360000
    },

    // LEVEL BADGES (19-22)
    {
        id: 'level_10',
        title: 'Rank Up',
        description: 'Reach level 10',
        icon: 'TrendingUp',
        rarity: 'common',
        condition: () => false // Handled separately
    },
    {
        id: 'level_25',
        title: 'Operative',
        description: 'Reach level 25',
        icon: 'Shield',
        rarity: 'rare',
        condition: () => false // Handled separately
    },
    {
        id: 'level_50',
        title: 'Specialist',
        description: 'Reach level 50',
        icon: 'Star',
        rarity: 'epic',
        condition: () => false // Handled separately
    },
    {
        id: 'level_100',
        title: 'Grandmaster',
        description: 'Reach level 100',
        icon: 'Crown',
        rarity: 'legendary',
        condition: () => false // Handled separately
    },

    // BOSS RUN BADGES (23-25)
    {
        id: 'boss_1',
        title: 'First Blood',
        description: 'Clear 1 Boss Run',
        icon: 'Skull',
        rarity: 'common',
        condition: () => false // Tracked separately
    },
    {
        id: 'boss_10',
        title: 'Boss Hunter',
        description: 'Clear 10 Boss Runs',
        icon: 'Skull',
        rarity: 'rare',
        condition: () => false // Tracked separately
    },
    {
        id: 'boss_50',
        title: 'Boss Master',
        description: 'Clear 50 Boss Runs',
        icon: 'Skull',
        rarity: 'epic',
        condition: () => false // Tracked separately
    },

    // COMBO BADGES (26-28)
    {
        id: 'combo_10',
        title: 'Combo Starter',
        description: 'Achieve a 10-key combo',
        icon: 'Zap',
        rarity: 'common',
        condition: (s) => (s.streak ?? 0) >= 10
    },
    {
        id: 'combo_50',
        title: 'Combo King',
        description: 'Achieve a 50-key combo',
        icon: 'Zap',
        rarity: 'rare',
        condition: (s) => (s.streak ?? 0) >= 50
    },
    {
        id: 'combo_100',
        title: 'Combo God',
        description: 'Achieve a 100-key combo',
        icon: 'Zap',
        rarity: 'epic',
        condition: (s) => (s.streak ?? 0) >= 100
    },

    // CONSISTENCY BADGE (29)
    {
        id: 'consistency_90',
        title: 'Steady',
        description: 'Maintain 90% consistency score',
        icon: 'Activity',
        rarity: 'rare',
        condition: () => false // Requires consistency tracking
    },

    // COMEBACK BADGE (30)
    {
        id: 'comeback',
        title: 'Phoenix',
        description: 'Return after 7+ day break',
        icon: 'RefreshCcw',
        rarity: 'epic',
        condition: () => false // Tracked separately
    }
];

// --- LOGIC ---

export class GamificationEngine {
    static calculateLevel(xp: number): LevelThreshold {
        // Find the highest level where xp >= required
        for (let i = LEVEL_CURVE.length - 1; i >= 0; i--) {
            if (xp >= LEVEL_CURVE[i].xpRequired) {
                return LEVEL_CURVE[i];
            }
        }
        return LEVEL_CURVE[0];
    }

    static checkBadges(stats: SessionStats, currentBadges: string[]): Badge[] {
        const newBadges: Badge[] = [];
        for (const badge of BADGES) {
            // Skip badges that are handled separately
            if (badge.condition.toString() === '() => false') continue;
            if (!currentBadges.includes(badge.id) && badge.condition(stats)) {
                newBadges.push(badge);
            }
        }
        return newBadges;
    }

    static calculateSessionXp(stats: SessionStats): number {
        let xp = 0;
        // 1 XP per WPM (Speed Reward)
        xp += stats.wpm;

        // Accuracy Bonus
        if (stats.accuracy >= 98) xp += 20;
        if (stats.accuracy === 100) xp += 50;

        // Time Bonus (10 XP per minute)
        xp += Math.floor(stats.duration / 60) * 10;

        return Math.floor(xp);
    }

    static getXpToNextLevel(currentXp: number): { current: LevelThreshold; next: LevelThreshold | null; xpNeeded: number } {
        const current = this.calculateLevel(currentXp);
        const currentIndex = LEVEL_CURVE.findIndex(l => l.level === current.level);
        const next = currentIndex < LEVEL_CURVE.length - 1 ? LEVEL_CURVE[currentIndex + 1] : null;
        const xpNeeded = next ? next.xpRequired - currentXp : 0;

        return { current, next, xpNeeded };
    }

    static getLevelProgress(currentXp: number): number {
        const { current, next } = this.getXpToNextLevel(currentXp);
        if (!next) return 100;

        const currentLevelXp = current.xpRequired;
        const xpIntoLevel = currentXp - currentLevelXp;
        const xpForLevel = next.xpRequired - currentLevelXp;

        return Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100));
    }
}
