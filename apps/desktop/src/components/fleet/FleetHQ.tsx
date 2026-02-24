import { useState, useEffect, useCallback } from 'react';
import { useFleetStore } from 'core';
import { Users, UserPlus, Shield, Activity, BarChart3, ChevronRight, Zap } from 'lucide-react';

export const FleetHQ = () => {
    const { currentFleet, members, loading, syncPresence, createFleet, joinFleet } = useFleetStore();
    const [fleetName, setFleetName] = useState("");
    const [joinId, setJoinId] = useState("");

    useEffect(() => {
        if (currentFleet) {
            syncPresence(currentFleet.id);
        }
    }, [currentFleet, syncPresence]);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setFleetName(e.target.value), []);
    const handleJoinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setJoinId(e.target.value), []);

    const handleCreate = async () => {
        if (!fleetName.trim()) return;
        await createFleet(fleetName);
    };

    const handleJoin = async () => {
        if (!joinId.trim()) return;
        await joinFleet(joinId);
    };

    if (!currentFleet) {
        return (
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-8 text-center py-24">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                    <Users size={40} className="text-white/20" />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">No Fleet Affiliation</h2>
                    <p className="text-white/40 text-sm font-mono uppercase tracking-[0.2em]">Operative is currently detached from the grid network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Create Section */}
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="NEW_FLEET_IDENTIFIER"
                            value={fleetName}
                            onChange={handleNameChange}
                            className="bg-white/5 border border-white/10 rounded-[24px] px-8 py-4 text-xs font-bold text-center text-white outline-none focus:border-neon-cyan/50 transition-colors uppercase tracking-[0.2em] placeholder:text-white/10"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={loading || !fleetName}
                            className="btn-primary py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-neon-cyan disabled:opacity-50"
                        >
                            Establish Fleet
                        </button>
                    </div>

                    {/* Join Section */}
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="GRID_ACCESS_CODE"
                            value={joinId}
                            onChange={handleJoinChange}
                            className="bg-white/5 border border-white/10 rounded-[24px] px-8 py-4 text-xs font-bold text-center text-white outline-none focus:border-neon-purple/50 transition-colors uppercase tracking-[0.2em] placeholder:text-white/10"
                        />
                        <button
                            onClick={handleJoin}
                            disabled={loading || !joinId}
                            className="glass-card py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] border-white/10 hover:border-neon-purple/50 disabled:opacity-50"
                        >
                            Join Mission
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto py-12 px-4">
            {/* Fleet Header */}
            <div className="flex justify-between items-center bg-white/2 border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] -z-10 rounded-full" />

                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-white/10 flex items-center justify-center shadow-neon-cyan/10">
                        <Users size={32} className="text-neon-cyan" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">{currentFleet.name}</h1>
                            <div className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full text-[9px] font-black text-neon-cyan uppercase tracking-widest">Active Grid</div>
                        </div>
                        <p className="text-white/30 text-xs font-mono tracking-widest uppercase italic">{currentFleet.id} // SECURE_FLEET_COMMS</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-6 border-r border-white/5">
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Fleet Power</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-mono text-white font-bold">{currentFleet.avgWpm || 0}</span>
                            <span className="text-[10px] text-white/20 uppercase font-black">Avg Wpm</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end pl-2">
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Stability</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-mono text-neon-cyan font-bold">{currentFleet.avgAccuracy || 0}%</span>
                            <span className="text-[10px] text-white/20 uppercase font-black">Fleet Acc</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Operative Grid */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-neon-cyan" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Neural Hub</h3>
                        </div>
                        <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">{members.length} Active Connections</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {members.map((member) => (
                            <div key={member.uid} className="glass-card flex items-center gap-4 hover:border-white/20 group transition-all cursor-pointer bg-white/2 border-white/5 p-5">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-neon-cyan/30">
                                        {member.photoURL ? <img src={member.photoURL} alt={member.displayName} /> : <Users size={20} className="text-white/20" />}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-bg" />
                                </div>

                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">{member.displayName}</span>
                                        {member.role === 'commander' && <Shield size={12} className="text-neon-purple shadow-neon-purple" />}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Zap size={10} className="text-neon-cyan" />
                                            <span className="text-[10px] font-mono font-bold text-white/40 uppercase">Ready</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                            </div>
                        ))}

                        <button className="glass-card border-dashed border-white/10 flex items-center justify-center h-[88px] hover:border-neon-cyan/50 hover:bg-neon-cyan/5 group transition-all">
                            <div className="flex items-center gap-3">
                                <UserPlus size={18} className="text-white/20 group-hover:text-neon-cyan transition-colors" />
                                <span className="text-[10px] font-black uppercase text-white/20 tracking-widest group-hover:text-white">Request Reinforcements</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Fleet Comms / Stats */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card bg-white/2 border-white/5 flex flex-col gap-6">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                            <BarChart3 size={16} className="text-neon-purple" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Fleet Telemetry</h3>
                        </div>

                        <div className="flex flex-col gap-4 text-[11px] font-mono text-white/60">
                            <div className="flex justify-between items-center">
                                <span className="uppercase italic">Sync Stability</span>
                                <span className="text-neon-cyan font-bold leading-none">Optimal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="uppercase italic">Encryption Node</span>
                                <span className="text-white leading-none">AES-256-DE</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                                <span className="uppercase italic">Status Index</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-neon-cyan" />
                                    <span className="text-neon-cyan font-bold leading-none uppercase">Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-neon-purple/5 border-neon-purple/20 p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Shield size={16} className="text-neon-purple" />
                            <span className="text-[10px] font-black uppercase text-neon-purple tracking-widest">Fleet Protocol</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed italic">
                            Commanders can enforce <span className="text-neon-purple font-bold">Strict Protocol</span> sessions for all members to ensure fleet-wide accuracy standards are maintained.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
