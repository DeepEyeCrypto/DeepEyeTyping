export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    avatarUrl?: string;
    wpm: number;
    accuracy: number;
    league: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    xp: number;
}

export interface SeasonInfo {
    id: string; // e.g., "season_2026_q1"
    name: string;
    endDate: string;
}

export class SocialEngine {
    static getLeague(wpm: number): string {
        if (wpm < 30) return 'Bronze';
        if (wpm < 50) return 'Silver';
        if (wpm < 80) return 'Gold';
        if (wpm < 110) return 'Platinum';
        return 'Diamond';
    }

    static formatRankChange(current: number, previous: number): string {
        const diff = previous - current;
        if (diff > 0) return `▲ ${diff}`;
        if (diff < 0) return `▼ ${Math.abs(diff)}`;
        return '-';
    }
}
