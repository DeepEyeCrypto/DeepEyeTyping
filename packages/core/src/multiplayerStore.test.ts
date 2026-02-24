import { describe, it, expect, beforeEach } from 'vitest';
import { useMultiplayerStore } from './multiplayerStore';

describe('MultiplayerStore', () => {
    beforeEach(() => {
        useMultiplayerStore.setState({
            lobbyId: null,
            isHost: false,
            matchStatus: 'IDLE',
            players: new Map()
        });
    });

    it('should join lobby and set host status', () => {
        const { setLobby } = useMultiplayerStore.getState();
        setLobby('X123', true);

        const state = useMultiplayerStore.getState();
        expect(state.lobbyId).toBe('X123');
        expect(state.isHost).toBe(true);
        expect(state.matchStatus).toBe('WAITING');
    });

    it('should manage player collection', () => {
        const { setPlayers } = useMultiplayerStore.getState();
        const mockPlayers = {
            'u1': { uid: 'u1', name: 'Alpha', status: 'READY', progress: 0, wpm: 0 } as any,
            'u2': { uid: 'u2', name: 'Beta', status: 'READY', progress: 0, wpm: 0 } as any
        };

        setPlayers(mockPlayers);
        const state = useMultiplayerStore.getState();
        expect(state.players.size).toBe(2);
        expect(state.players.get('u1')?.name).toBe('Alpha');
    });

    it('should identify opponents correctly', () => {
        const { setPlayers, getOpponents } = useMultiplayerStore.getState();
        setPlayers({
            'u1': { uid: 'u1', name: 'Alpha', status: 'READY', progress: 0, wpm: 0 } as any,
            'u2': { uid: 'u2', name: 'Beta', status: 'READY', progress: 0, wpm: 0 } as any
        });

        const opponents = getOpponents('u1');
        expect(opponents.length).toBe(1);
        expect(opponents[0].uid).toBe('u2');
    });

    it('should update specific player data', () => {
        const { setPlayers, updatePlayer } = useMultiplayerStore.getState();
        setPlayers({
            'u1': { uid: 'u1', name: 'Alpha', status: 'READY', progress: 0, wpm: 0 } as any
        });

        updatePlayer('u1', { progress: 50, wpm: 80 });
        const player = useMultiplayerStore.getState().players.get('u1');
        expect(player?.progress).toBe(50);
        expect(player?.wpm).toBe(80);
    });

    it('should reset state on leave', () => {
        const { setLobby, leaveLobby } = useMultiplayerStore.getState();
        setLobby('X123', true);
        leaveLobby();

        const state = useMultiplayerStore.getState();
        expect(state.lobbyId).toBeNull();
        expect(state.matchStatus).toBe('IDLE');
        expect(state.players.size).toBe(0);
    });
});
