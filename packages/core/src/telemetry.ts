export type EventType = 'session_start' | 'session_end' | 'level_up' | 'badge_earned' | 'streak_extended';

export interface TelemetryEvent {
    type: EventType;
    timestamp: number;
    payload: any;
}

export class TelemetryEngine {
    private static events: TelemetryEvent[] = [];

    static track(type: EventType, payload: any = {}) {
        const event: TelemetryEvent = {
            type,
            timestamp: Date.now(),
            payload
        };
        this.events.push(event);

        // Log to console in dev mode
        // @ts-ignore
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Telemetry] ${type}`, payload);
        }

        // TODO: Sync to Cloud / Firebase Analytics
    }

    static getSessionDuration(): number {
        const start = this.events.slice().reverse().find(e => e.type === 'session_start');
        if (!start) return 0;
        return (Date.now() - start.timestamp) / 1000;
    }
}
