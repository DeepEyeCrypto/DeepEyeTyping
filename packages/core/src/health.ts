
export interface HealthStatus {
    canPractice: boolean;
    message?: string;
    fatigueLevel: number; // 0-100
}

export class HealthEngine {
    static checkSessionHealth(sessionDurationSec: number, recentAccuracy: number): HealthStatus {
        // Rule 1: Break after 45 mins
        if (sessionDurationSec > 45 * 60) {
            return {
                canPractice: false,
                message: "Neural Overload detected. Ocular rest recommended for 5 minutes.",
                fatigueLevel: 90
            };
        }

        // Rule 2: Fatigue Check (Accuracy Drop)
        if (sessionDurationSec > 10 * 60 && recentAccuracy < 85) {
            return {
                canPractice: true,
                message: "Precision degrading. Your hands are tired. Take a sip of water.",
                fatigueLevel: 60
            };
        }

        return { canPractice: true, fatigueLevel: 0 };
    }
}
