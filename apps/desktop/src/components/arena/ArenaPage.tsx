import { useState, useCallback } from 'react';
import { useMultiplayerStore, useLobbySync, rtdb } from 'core';
import { Users, Swords, Crown, ChevronRight, Hash } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { RacingPage } from './RacingPage';

export const ArenaPage = () => {
    useLobbySync(); // Initialize Realtime Sync
    const { lobbyId, setLobby, leaveLobby, matchStatus, isHost, players } = useMultiplayerStore();
    // const { user } = useAuthStore(); // Pending implementation
    const [joinCode, setJoinCode] = useState('');

    const handleHost = useCallback(() => {
        // Mock ID generation for now - ideally this comes from Firebase function return
        const newLobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setLobby(newLobbyId, true);
    }, [setLobby]);

    const handleStartMatch = useCallback(() => {
        if (!lobbyId || !rtdb) return;

        // 1. Set Protocol to Countdown
        update(ref(rtdb, `lobbies/${lobbyId}`), { status: 'COUNTDOWN' });

        // 2. Trigger Racing Phase after delay
        setTimeout(() => {
            update(ref(rtdb, `lobbies/${lobbyId}`), { status: 'RACING' });
        }, 3000);

    }, [lobbyId]);

    const handleJoin = useCallback(() => {
        if (joinCode.length > 0) {
            setLobby(joinCode.toUpperCase(), false);
        }
    }, [joinCode, setLobby]);

    const handleJoinCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setJoinCode(e.target.value);
    }, []);

    const handleLeave = useCallback(() => {
        leaveLobby();
    }, [leaveLobby]);

    if (lobbyId) {
        if (matchStatus === 'COUNTDOWN' || matchStatus === 'RACING' || matchStatus === 'FINISHED') {
            return <RacingPage />;
        }

        return (
            <div className="w-full max-w-5xl flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
                <div className="glass-card p-12 flex flex-col items-center gap-8 mb-8">
                    <div className="w-20 h-20 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(188,19,254,0.3)]">
                        <Swords size={40} className="text-neon-purple" />
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white">
                            Lobby: {lobbyId}
                        </h2>
                        <p className="text-white/40 mt-2">Waiting for neural links...</p>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    <div className="flex gap-4">
                        <button onClick={handleLeave} className="px-8 py-3 rounded-xl border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-widest">
                            Abort Protocol
                        </button>
                    </div>

                    <div className="w-full h-px bg-white/10 my-4" />

                    {/* Player Grid */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        {Array.from(players.values()).map((p) => (
                            <div key={p.uid} className="glass-panel p-4 flex items-center gap-4 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                    {p.avatar ? <img src={p.avatar} alt={p.name} /> : <div className="text-xs font-bold">{p.name?.[0]}</div>}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{p.name}</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">{p.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isHost && (
                        <div className="mt-8">
                            <button
                                className="px-10 py-4 bg-neon-purple text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-neon-purple"
                                onClick={handleStartMatch}
                            >
                                Initiate Sequence
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white">THE ARENA</span>
                </h2>
                <p className="text-white/40 max-w-md mx-auto">
                    Real-time neural synchronization protocols. Compete against other operatives in sub-millisecond latency trials.
                    <span className="block mt-2 text-neon-purple text-xs font-bold uppercase tracking-widest">Experimental Phase</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Host Card */}
                <button
                    onClick={handleHost}
                    className="group relative glass-card p-10 flex flex-col items-center gap-6 hover:bg-neon-purple/5 transition-all text-left overflow-hidden border-neon-purple/20 hover:border-neon-purple/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-neon-purple">
                        <Crown size={32} className="text-neon-purple" />
                    </div>

                    <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-bold italic">Host Protocol</h3>
                        <p className="text-sm text-white/30 mt-2 text-center">Initialize a new secure lobby. Configure difficulty and Invite operatives.</p>
                    </div>

                    <div className="mt-4 px-6 py-2 rounded-full border border-neon-purple/30 text-neon-purple text-[10px] font-bold uppercase tracking-widest group-hover:bg-neon-purple group-hover:text-white transition-colors">
                        Initialize
                    </div>
                </button>

                {/* Join Card */}
                <div className="glass-card p-10 flex flex-col items-center gap-6 border-white/10 hover:border-white/20 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Users size={32} className="text-white/60" />
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <h3 className="text-2xl font-bold italic">Join Protocol</h3>
                        <p className="text-sm text-white/30 mt-2 text-center mb-6">Enter secure frequency code to sync with existing lobby.</p>

                        <div className="flex w-full gap-2">
                            <div className="relative flex-1">
                                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                <input
                                    type="text"
                                    placeholder="LOBBY ID"
                                    value={joinCode}
                                    onChange={handleJoinCodeChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neon-purple/50 transition-colors uppercase"
                                />
                            </div>
                            <button
                                onClick={handleJoin}
                                disabled={!joinCode}
                                className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
