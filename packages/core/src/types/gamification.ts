export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name
    rarity: BadgeRarity;
    condition: (stats: SessionStats) => boolean;
}

export interface SessionStats {
    wpm: number;
    accuracy: number;
    duration: number; // Seconds
    mistakes: number;
    isPerfect: boolean;
    streak?: number;
}

export interface UserProgress {
    xp: number;
    level: number;
    currentStreak: number;
    bestStreak: number;
    lastPracticeDate: string; // ISO Date
    badges: string[]; // Badge IDs
    dailyXp: number;
}

export interface LevelThreshold {
    level: number;
    xpRequired: number;
    title: string;
}

export interface DailyMission {
    id: string;
    title: string;
    target: number; // e.g. 500 chars, 5 mins
    current: number;
    type: 'chars' | 'time' | 'wpm' | 'accuracy';
    xpReward: number;
    completed: boolean;
}
