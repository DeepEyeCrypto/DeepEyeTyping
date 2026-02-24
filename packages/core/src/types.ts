
export type Hand = 'left' | 'right';
export type Finger = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export interface KeyStroke {
    key: string;
    timestamp: number; // For compatibility
    pressTime: number; // Sub-ms start
    releaseTime?: number; // End for Dwell calculation
    isCorrect: boolean;
    expected: string;
}

export interface AdvancedStats {
    wpm: number;
    rawWpm: number; // No error penalty
    accuracy: number;
    consistency: number; // Coefficient of Variation of inter-key latency
    efficiency: number; // (input.length / total_keystrokes)
    weakestKeys: string[];
}

export interface LessonConfig {
    id: string;
    title: string;
    description: string;
    phase: 'foundation' | 'accuracy' | 'speed' | 'flow' | 'exam';
    type: 'practice' | 'exam';
    text: string;
    requirements: {
        minWpm: number;
        minAccuracy: number;
    };
    strictMode?: boolean; // If true, session fails immediately on bad performance
    xpReward: number;
}
export interface TypingSession {
    id: string;
    wpm: number;
    accuracy: number;
    consistency?: number;
    errorCount: number;
    timestamp: any; // Firestore timestamp or numeric
    weakestKeys?: string[];
    neuralMap?: Record<string, { heat: number }>;
}

export interface TemporalMetric {
    avgDwellTime: number; // How long key was held
    avgFlightTime: number; // Gap between keys
    errorRate: number;
}

export interface Fleet {
    id: string;
    name: string;
    ownerId: string;
    description?: string;
    members: string[]; // Array of UIDs
    createdAt: any;
    avgWpm?: number;
    avgAccuracy?: number;
}

export interface FleetMember {
    uid: string;
    displayName: string;
    photoURL?: string;
    role: 'commander' | 'operative';
    joinedAt: any;
    currentSession?: {
        lessonId: string;
        progress: number;
        wpm: number;
    };
}

export interface CustomProtocol extends LessonConfig {
    creatorId: string;
    isPublic: boolean;
    tags: string[];
    createdAt: any;
    version: number;
}
