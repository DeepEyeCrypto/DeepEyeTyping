import { create } from 'zustand';

// --- Types ---

export type MatchStatus = 'IDLE' | 'WAITING' | 'COUNTDOWN' | 'RACING' | 'FINISHED';

export type PlayerStatus = 'JOINING' | 'READY' | 'RACING' | 'FINISHED';

export interface ArenaPlayer {
    uid: string;
    name: string;
    avatar?: string;
    status: PlayerStatus;
    progress: number; // 0-100
    wpm: number;
    rank?: number; // 1st, 2nd, etc. (only when FINISHED)
}

export interface LobbyState {
    id: string;
    hostId: string;
    textId: string;
    status: MatchStatus;
    createdAt: number;
    players: Record<string, ArenaPlayer>;
}

interface MultiplayerState {
    // Local State
    lobbyId: string | null;
    isHost: boolean;
    matchStatus: MatchStatus;

    // Players (including self)
    players: Map<string, ArenaPlayer>;

    // Actions
    setLobby: (id: string, isHost: boolean) => void;
    leaveLobby: () => void;
    updateMatchStatus: (status: MatchStatus) => void;
    updatePlayer: (uid: string, data: Partial<ArenaPlayer>) => void;
    setPlayers: (players: Record<string, ArenaPlayer>) => void;

    // Computed
    getSelf: (uid: string) => ArenaPlayer | undefined;
    getOpponents: (uid: string) => ArenaPlayer[];
}

// --- Store ---

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
    lobbyId: null,
    isHost: false,
    matchStatus: 'IDLE',
    players: new Map(),

    setLobby: (id, isHost) => set({ lobbyId: id, isHost, matchStatus: 'WAITING', players: new Map() }), // Reset players on join

    leaveLobby: () => set({ lobbyId: null, isHost: false, matchStatus: 'IDLE', players: new Map() }),

    updateMatchStatus: (status) => set({ matchStatus: status }),

    updatePlayer: (uid, data) => set((state) => {
        const newPlayers = new Map(state.players);
        const existing = newPlayers.get(uid);

        if (existing) {
            newPlayers.set(uid, { ...existing, ...data });
        } else {
            // If player doesn't exist locally yet, we might want to ignore or add a stub. 
            // For now, let's assume setPlayers handles the bulk entry and this handles updates.
            // But if a new player joins via realtime, we might need to add them.
            if (data.name && data.status) { // Basic check if it's a full player object being added partially
                newPlayers.set(uid, data as ArenaPlayer);
            }
        }
        return { players: newPlayers };
    }),

    setPlayers: (playersDict) => {
        const playerMap = new Map<string, ArenaPlayer>();
        Object.values(playersDict).forEach(p => playerMap.set(p.uid, p));
        set({ players: playerMap });
    },

    getSelf: (uid) => get().players.get(uid),

    getOpponents: (uid) => {
        const players = Array.from(get().players.values());
        return players.filter(p => p.uid !== uid);
    }
}));
