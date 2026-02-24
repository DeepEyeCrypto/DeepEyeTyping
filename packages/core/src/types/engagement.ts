// ============================================================
// ENGAGEMENT TYPES - DeepEyeTyping Engagement System
// ============================================================

// ------------------------------------------------------------
// SESSION TEMPLATES
// ------------------------------------------------------------

export type SessionTemplateId = 'warmup' | 'focused' | 'boss_run' | 'zen' | 'sprint';

export interface SessionTemplate {
    id: SessionTemplateId;
    name: string;
    description: string;
    duration: { min: number; max: number }; // seconds
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    emotion: 'flow' | 'challenge' | 'relaxation' | 'intensity';
    ui: {
        showWpm: 'large' | 'small' | 'hidden';
        showAccuracy: 'large' | 'small' | 'hidden';
        showCombo: boolean;
        showTimer: boolean;
        showWeakKeys: boolean;
        showLeaderboard: boolean;
    };
    xp: {
        base: number;
        wpmBonus: number;
        accuracyBonus: number;
    };
}

// ------------------------------------------------------------
// STREAK SYSTEM
// ------------------------------------------------------------

export interface StreakState {
    current: number;
    best: number;
    lastPracticeDate: string; // ISO date string
    graceDaysUsedThisWeek: number;
    shieldsRemaining: number;
    shieldsUsedThisMonth: number;
}

export interface StreakConfig {
    graceDaysPerWeek: number;
    shieldsPerMonth: number;
    minSessionSeconds: number;
    minWpmForStreak: number;
}

// ------------------------------------------------------------
// MISSIONS SYSTEM
// ------------------------------------------------------------

export type MissionType = 'chars' | 'wpm' | 'accuracy' | 'sessions' | 'time';
export type MissionFrequency = 'daily' | 'weekly' | 'dynamic';

export interface Mission {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    type: MissionType;
    xpReward: number;
    completed: boolean;
    expiresAt: string; // ISO timestamp
    frequency: MissionFrequency;
    isDynamic?: boolean;
    dynamicReason?: string;
}

export interface WeeklyChallenge {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    type: MissionType;
    xpReward: number;
    completed: boolean;
    startedAt: string;
    endedAt: string;
    bonusBadgeId?: string;
}

// ------------------------------------------------------------
// SKILL PROFILING
// ------------------------------------------------------------

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface WeakKey {
    char: string;
    errorRate: number;
    avgLatency: number;
}

export interface FingerStats {
    wpm: number;
    accuracy: number;
}

export interface HandStats {
    wpm: number;
    accuracy: number;
}

export interface SkillProfile {
    userId: string;
    currentWpm: number;
    currentAccuracy: number;
    currentConsistency: number;
    avgWpm: number;
    avgAccuracy: number;
    avgConsistency: number;
    bestWpm: number;
    bestAccuracy: number;
    weakKeys: WeakKey[];
    fingerStats: Record<string, FingerStats>; // finger name -> stats
    handStats: Record<string, HandStats>; // hand name -> stats
    preferredTimeOfDay: TimeOfDay;
    avgSessionDuration: number; // seconds
    sessionsPerWeek: number;
    level: number;
    totalPracticeTime: number; // seconds
    streak: number;
}

// ------------------------------------------------------------
// AI COACH
// ------------------------------------------------------------

export interface CoachRecommendation {
    insight: string;
    suggestedLessonId: string;
    focusKeys: string[];
}

export interface PreSessionRecommendation {
    template: SessionTemplateId;
    lessonId: string;
    reason: string;
}

export interface PostSessionInsight {
    type: 'improvement' | 'warning' | 'achievement' | 'tip';
    message: string;
    metric?: string;
}

export interface WeeklyReview {
    week: string;
    wpmImprovement: number;
    accuracyTrend: number;
    daysPracticed: number;
    badgesEarned: number;
    levelProgress: number;
    message: string;
}

export type SignalType = 'fatigue' | 'boredom' | 'on_fire' | 'returning' | 'plateau';

export interface UserSignals {
    fatigueRisk: number; // 0-1
    boredomRisk: number;
    isOnFire: boolean;
    isReturning: boolean;
    isPlateauing: boolean;
}

// ------------------------------------------------------------
// REWARDS & FEEDBACK
// ------------------------------------------------------------

export type FeedbackIntensity = 'low' | 'medium' | 'high';

export interface FeedbackEvent {
    event: string;
    visual: string;
    sound: string;
    intensity: FeedbackIntensity;
    duration: number;
}

export interface FocusModeSettings {
    enabled: boolean;
    autoTriggerMinutes: number; // 0 = disabled
    reduceAnimations: boolean;
    muteSounds: boolean;
    hideWeakKeys: boolean;
    hideLeaderboard: boolean;
}

// ------------------------------------------------------------
// ENGAGEMENT POLICY (Safety)
// ------------------------------------------------------------

export interface EngagementPolicy {
    maxSessionMinutes: number;
    maxContinuousMinutes: number;
    mandatoryBreakMinutes: number;
    maxSessionsPerDay: number;
    maxXpPerDay: number;
    quietHoursStart: number; // 22 = 10 PM
    quietHoursEnd: number; // 6 = 6 AM
    enableStreakNotifications: boolean;
    enableGoalNotifications: boolean;
    maxNotificationsPerDay: number;
    enableBreakPrompts: boolean;
    enableHealthyDashboard: boolean;
    enableFocusContract: boolean;
    graceDaysPerWeek: number;
    streakShieldsPerMonth: number;
    allowFeatureFlags: boolean;
    allowAbTests: boolean;
}

export const DEFAULT_ENGAGEMENT_POLICY: EngagementPolicy = {
    maxSessionMinutes: 60,
    maxContinuousMinutes: 45,
    mandatoryBreakMinutes: 5,
    maxSessionsPerDay: 5,
    maxXpPerDay: 1000,
    quietHoursStart: 22,
    quietHoursEnd: 6,
    enableStreakNotifications: true,
    enableGoalNotifications: true,
    maxNotificationsPerDay: 5,
    enableBreakPrompts: true,
    enableHealthyDashboard: true,
    enableFocusContract: true,
    graceDaysPerWeek: 1,
    streakShieldsPerMonth: 3,
    allowFeatureFlags: true,
    allowAbTests: true,
};

// ------------------------------------------------------------
// EXPERIMENTS / A/B TESTS
// ------------------------------------------------------------

export type ExperimentVariant = 'control' | 'treatment_a' | 'treatment_b';

export interface ABTest {
    id: string;
    name: string;
    description: string;
    hypothesis: string;
    variants: {
        control: { weight: number; config: Record<string, unknown> };
        treatment_a: { weight: number; config: Record<string, unknown> };
        treatment_b?: { weight: number; config: Record<string, unknown> };
    };
    targeting: {
        minLevel?: number;
        maxLevel?: number;
        device?: ('desktop' | 'web')[];
        minSessions?: number;
    };
    primaryMetric: string;
    secondaryMetrics: string[];
    startDate: string;
    endDate: string;
    minSampleSize: number;
    status: 'draft' | 'running' | 'paused' | 'completed';
}

// ------------------------------------------------------------
// LEADERBOARD
// ------------------------------------------------------------

export type LeaderboardType = 'global' | 'friends' | 'regional' | 'similar' | 'weekly' | 'streak';

export interface LeaderboardEntry {
    id: string;
    userId?: string;
    displayName: string;
    photoURL?: string;
    wpm: number;
    highestWpm?: number;
    accuracy: number;
    rank: number;
    badge?: BadgeTier;
    timestamp: any;
    streak?: number;
    xpThisWeek?: number;
    region?: string;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond';

export const getBadgeForWPM = (wpm: number): BadgeTier => {
    if (wpm >= 150) return 'diamond';
    if (wpm >= 120) return 'emerald';
    if (wpm >= 90) return 'gold';
    if (wpm >= 60) return 'silver';
    return 'bronze';
};

export const BADGE_STYLES: Record<BadgeTier, { label: string; color: string; glow: string }> = {
    bronze: { label: 'Bronze', color: '#CD7F32', glow: 'rgba(205, 127, 50, 0.4)' },
    silver: { label: 'Silver', color: '#C0C0C0', glow: 'rgba(192, 192, 192, 0.4)' },
    gold: { label: 'Gold', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' },
    emerald: { label: 'Emerald', color: '#50C878', glow: 'rgba(80, 200, 120, 0.5)' },
    diamond: { label: 'Diamond', color: '#B9F2FF', glow: 'rgba(185, 242, 255, 0.6)' },
};

// ------------------------------------------------------------
// GHOST RUNS
// ------------------------------------------------------------

export interface GhostRun {
    id: string;
    userId: string;
    sessionId: string;
    keystrokes: GhostKeystroke[];
    finalWpm: number;
    finalAccuracy: number;
    visibility: 'private' | 'friends' | 'public';
    createdAt: string;
}

export interface GhostKeystroke {
    char: string;
    timestamp: number;
    wpmAtPoint: number;
}

// ------------------------------------------------------------
// SEASONS / EVENTS
// ------------------------------------------------------------

export interface Season {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    rewardBadgeId: string;
    top3RewardBadgeIds: string[];
    leaderboardType: LeaderboardType;
}
