
export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string; // Icon name (mapped in UI)
    condition: (stats: { wpm: number; accuracy: number; totalSessions: number; maxWpm: number }) => boolean;
    tier: 'C' | 'B' | 'A' | 'S';
}

export const BADGES: Badge[] = [
    // --- TIER C: NOVICE ---
    {
        id: 'init_link',
        title: 'Neural Link Established',
        description: 'Complete your first session.',
        icon: 'Plug',
        tier: 'C',
        condition: (s) => s.totalSessions >= 1
    },
    {
        id: 'steady_hand',
        title: 'Steady Hand',
        description: 'Achieve 98% accuracy in a session.',
        icon: 'Target',
        tier: 'C',
        condition: (s) => s.accuracy >= 98
    },

    // --- TIER B: COMPETENT ---
    {
        id: 'velocity_mk1',
        title: 'Velocity MK-I',
        description: 'Reach 40 WPM.',
        icon: 'Zap',
        tier: 'B',
        condition: (s) => s.maxWpm >= 40
    },
    {
        id: 'marathon',
        title: 'Endurance Model',
        description: 'Complete 50 sessions.',
        icon: 'Activity',
        tier: 'B',
        condition: (s) => s.totalSessions >= 50
    },

    // --- TIER A: EXPERT ---
    {
        id: 'velocity_mk2',
        title: 'Velocity MK-II',
        description: 'Reach 80 WPM.',
        icon: 'Zap',
        tier: 'A',
        condition: (s) => s.maxWpm >= 80
    },
    {
        id: 'precision_engineer',
        title: 'Precision Engineer',
        description: 'Maintain 99% accuracy at >60 WPM.',
        icon: 'Crosshair',
        tier: 'A',
        condition: (s) => s.accuracy >= 99 && s.wpm > 60
    },

    // --- TIER S: MASTER ---
    {
        id: 'god_hand',
        title: 'God Hand',
        description: 'Reach 100 WPM with 100% Accuracy.',
        icon: 'Crown',
        tier: 'S',
        condition: (s) => s.maxWpm >= 100 && s.accuracy === 100
    }
];

export const LEVEL_CURVE = (level: number) => Math.floor(100 * Math.pow(level, 1.5));
