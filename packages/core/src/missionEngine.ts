// ============================================================
// MISSION ENGINE - DeepEyeTyping
// ============================================================

import type { Mission, MissionType, WeeklyChallenge } from './types/engagement';

const DAILY_MISSION_TEMPLATES: Omit<Mission, 'current' | 'completed' | 'expiresAt'>[] = [
    {
        id: 'daily_warmup',
        title: 'Warm-up Burst',
        description: 'Complete 1 warm-up burst session',
        target: 1,
        type: 'sessions',
        xpReward: 30,
        frequency: 'daily',
    },
    {
        id: 'daily_velocity',
        title: 'Velocity Goal',
        description: 'Reach 60 WPM in any session',
        target: 60,
        type: 'wpm',
        xpReward: 75,
        frequency: 'daily',
    },
    {
        id: 'daily_precision',
        title: 'Precision Master',
        description: 'Achieve 95% accuracy',
        target: 95,
        type: 'accuracy',
        xpReward: 50,
        frequency: 'daily',
    },
    {
        id: 'daily_chars',
        title: 'Character Crusher',
        description: 'Type 1,000 characters total',
        target: 1000,
        type: 'chars',
        xpReward: 60,
        frequency: 'daily',
    },
    {
        id: 'daily_drills',
        title: 'Drill Master',
        description: 'Complete 3 focused drills',
        target: 3,
        type: 'sessions',
        xpReward: 100,
        frequency: 'daily',
    },
];

const WEEKLY_CHALLENGE_TEMPLATES: Omit<WeeklyChallenge, 'current' | 'completed'>[] = [
    {
        id: 'weekly_speed',
        title: 'Speed Week',
        description: 'Reach 80 WPM once this week',
        target: 80,
        type: 'wpm',
        xpReward: 500,
        startedAt: '',
        endedAt: '',
    },
    {
        id: 'weekly_accuracy',
        title: 'Accuracy Week',
        description: '5 sessions at 98%+ accuracy',
        target: 5,
        type: 'accuracy',
        xpReward: 400,
        startedAt: '',
        endedAt: '',
    },
    {
        id: 'weekly_volume',
        title: 'Volume Week',
        description: 'Practice for 3 hours total',
        target: 10800,
        type: 'time',
        xpReward: 600,
        startedAt: '',
        endedAt: '',
    },
    {
        id: 'weekly_boss',
        title: 'Boss Slayer',
        description: 'Clear 10 Boss Runs',
        target: 10,
        type: 'sessions',
        xpReward: 750,
        startedAt: '',
        endedAt: '',
    },
    {
        id: 'weekly_streak',
        title: 'Streak Keeper',
        description: 'Practice 6 out of 7 days',
        target: 6,
        type: 'sessions',
        xpReward: 300,
        startedAt: '',
        endedAt: '',
    },
];

export function generateDailyMissions(): Mission[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Select 3 random missions
    const shuffled = [...DAILY_MISSION_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    return selected.map((template) => ({
        ...template,
        current: 0,
        completed: false,
        expiresAt: tomorrow.toISOString(),
    }));
}

export function generateWeeklyChallenge(): WeeklyChallenge {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const template = WEEKLY_CHALLENGE_TEMPLATES[Math.floor(Math.random() * WEEKLY_CHALLENGE_TEMPLATES.length)];

    return {
        ...template,
        current: 0,
        completed: false,
        startedAt: now.toISOString(),
        endedAt: nextWeek.toISOString(),
    };
}

export function updateMissionProgress(mission: Mission, session: { wpm: number; accuracy: number; chars: number; duration: number }): Mission {
    if (mission.completed) return mission;

    let newCurrent = mission.current;

    switch (mission.type) {
        case 'wpm':
            if (session.wpm >= mission.target) {
                newCurrent = mission.target;
            }
            break;
        case 'accuracy':
            if (session.accuracy >= mission.target) {
                newCurrent = session.accuracy;
            }
            break;
        case 'chars':
            newCurrent = Math.min(mission.current + session.chars, mission.target);
            break;
        case 'sessions':
            newCurrent = mission.current + 1;
            break;
        case 'time':
            newCurrent = Math.min(mission.current + session.duration, mission.target);
            break;
    }

    return {
        ...mission,
        current: newCurrent,
        completed: newCurrent >= mission.target,
    };
}

export function getMissionProgressPercent(mission: Mission): number {
    if (mission.target === 0) return 0;
    return Math.min(100, Math.round((mission.current / mission.target) * 100));
}
