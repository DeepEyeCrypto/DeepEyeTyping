// ============================================================
// SESSION TEMPLATES - DeepEyeTyping
// ============================================================

import type { SessionTemplate, SessionTemplateId } from './types/engagement';

export const SESSION_TEMPLATES: Record<SessionTemplateId, SessionTemplate> = {
    warmup: {
        id: 'warmup',
        name: 'Warm-up Burst',
        description: 'Quick burst to get fingers firing',
        duration: { min: 60, max: 90 },
        difficulty: 'easy',
        emotion: 'flow',
        ui: {
            showWpm: 'large',
            showAccuracy: 'small',
            showCombo: false,
            showTimer: true,
            showWeakKeys: false,
            showLeaderboard: false,
        },
        xp: {
            base: 25,
            wpmBonus: 0.5,
            accuracyBonus: 10,
        },
    },
    focused: {
        id: 'focused',
        name: 'Focused Drill',
        description: '2-4 minute drill to build skill',
        duration: { min: 120, max: 240 },
        difficulty: 'medium',
        emotion: 'challenge',
        ui: {
            showWpm: 'large',
            showAccuracy: 'large',
            showCombo: true,
            showTimer: true,
            showWeakKeys: true,
            showLeaderboard: false,
        },
        xp: {
            base: 50,
            wpmBonus: 1,
            accuracyBonus: 20,
        },
    },
    boss_run: {
        id: 'boss_run',
        name: 'Boss Run',
        description: 'Push your limits with mixed text',
        duration: { min: 300, max: 600 },
        difficulty: 'hard',
        emotion: 'challenge',
        ui: {
            showWpm: 'large',
            showAccuracy: 'large',
            showCombo: true,
            showTimer: true,
            showWeakKeys: true,
            showLeaderboard: true,
        },
        xp: {
            base: 100,
            wpmBonus: 1.5,
            accuracyBonus: 30,
        },
    },
    zen: {
        id: 'zen',
        name: 'Zen Mode',
        description: 'Calm, low-pressure typing',
        duration: { min: 300, max: 900 },
        difficulty: 'easy',
        emotion: 'relaxation',
        ui: {
            showWpm: 'small',
            showAccuracy: 'small',
            showCombo: false,
            showTimer: false,
            showWeakKeys: false,
            showLeaderboard: false,
        },
        xp: {
            base: 30,
            wpmBonus: 0.25,
            accuracyBonus: 5,
        },
    },
    sprint: {
        id: 'sprint',
        name: 'Sprint',
        description: 'Pure speed, 60 seconds',
        duration: { min: 30, max: 60 },
        difficulty: 'medium',
        emotion: 'intensity',
        ui: {
            showWpm: 'large',
            showAccuracy: 'hidden',
            showCombo: false,
            showTimer: true,
            showWeakKeys: false,
            showLeaderboard: false,
        },
        xp: {
            base: 20,
            wpmBonus: 1,
            accuracyBonus: 15,
        },
    },
};

export function getTemplate(id: SessionTemplateId): SessionTemplate {
    return SESSION_TEMPLATES[id];
}

export function getTemplatesForLevel(level: number): SessionTemplateId[] {
    const base: SessionTemplateId[] = ['warmup', 'focused'];

    if (level >= 5) {
        base.push('sprint');
    }

    if (level >= 10) {
        base.push('boss_run');
    }

    if (level >= 15) {
        base.push('zen');
    }

    return base;
}
