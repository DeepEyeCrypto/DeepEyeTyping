import { useCallback } from 'react';
import { useSettingsStore, useAuthStore } from 'core';
import { Volume2, Eye, LogOut, ShieldAlert, Cpu, Share2, Flame } from 'lucide-react';

interface SettingToggleProps {
    title: string;
    desc: string;
    icon: React.ElementType;
    active: boolean;
    onClick: () => void;
    colorClass: string;
}

const SettingToggle = ({ title, desc, icon: Icon, active, onClick, colorClass }: SettingToggleProps) => (
    <div className="flex justify-between items-center p-6 border-b border-white/5 last:border-none group">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${active ? colorClass.replace('text-', 'bg-') + '/20' : 'bg-white/5'} transition-colors`}>
                <Icon size={20} className={active ? colorClass : 'text-white/20'} />
            </div>
            <div>
                <span className="block text-white font-bold tracking-tight">{title}</span>
                <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">{desc}</span>
            </div>
        </div>
        <button
            onClick={onClick}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-500 relative ${active ? colorClass.replace('text-', 'bg-') : 'bg-white/10'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-xl transform transition-transform duration-500 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
            {active && <div className="absolute inset-0 rounded-full animate-pulse ring-2 ring-current opacity-20" />}
        </button>
    </div>
);

export const SettingsPage = () => {
    const { soundEnabled, visualEffects, toggleSound, toggleVisuals, godMode, toggleGodMode } = useSettingsStore();
    const { user, logout } = useAuthStore();

    const handleLogout = useCallback(() => logout(), [logout]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Cpu size={24} className="text-neon-cyan" />
                    <h2 className="text-4xl font-black text-white tracking-tighter">OS_CONFIG</h2>
                </div>
                <p className="text-white/40 text-sm font-mono tracking-widest uppercase">DeepEye Neural Link Shell • v1.0.4</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Protocol Layers */}
                <div className="flex flex-col gap-6">
                    <section className="glass-card p-0 overflow-hidden bg-glass-heavy border-none shadow-2xl">
                        <div className="p-4 bg-white/5 border-b border-white/5">
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Peripheral Audio</h3>
                        </div>
                        <SettingToggle
                            title="Feedback Oscillators"
                            desc="Real-time keypress synthesis"
                            icon={Volume2}
                            active={soundEnabled}
                            onClick={toggleSound}
                            colorClass="text-neon-cyan"
                        />
                    </section>

                    <section className="glass-card p-0 overflow-hidden bg-glass-heavy border-none shadow-2xl">
                        <div className="p-4 bg-white/5 border-b border-white/5">
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Visual Cortex</h3>
                        </div>
                        <SettingToggle
                            title="Refraction Quality"
                            desc="High glass-blur depth"
                            icon={Eye}
                            active={visualEffects === 'high'}
                            onClick={toggleVisuals}
                            colorClass="text-neon-purple"
                        />
                        <div className="p-4 px-6 bg-yellow-500/5 border-t border-white/5 flex items-center gap-3">
                            <ShieldAlert size={14} className="text-yellow-500/40" />
                            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Low-latency rendering recommended for competitive protocols</span>
                        </div>
                    </section>

                    <section className="glass-card p-0 overflow-hidden bg-glass-heavy border-none shadow-2xl">
                        <div className="p-4 bg-white/5 border-b border-white/5">
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Neural Overclock</h3>
                        </div>
                        <SettingToggle
                            title="God Mode"
                            desc="Recursive visual feedback"
                            icon={Flame}
                            active={godMode}
                            onClick={toggleGodMode}
                            colorClass="text-red-500"
                        />
                    </section>
                </div>

                {/* Account & Transmission */}
                <div className="flex flex-col gap-6">
                    <section className="glass-card p-6 bg-glass-heavy border-none shadow-2xl flex flex-col gap-6">
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Neural Identity</h3>

                        <div className="flex items-center gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 rounded-full border border-neon-cyan/30 overflow-hidden">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Agent" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-dark-surface flex items-center justify-center text-neon-cyan font-bold">A</div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold">{user?.displayName || 'DeepEye Agent'}</span>
                                <span className="text-[9px] text-neon-cyan uppercase font-black tracking-widest">Clearance: Level 1</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors group">
                                <Share2 size={18} className="text-white/20 group-hover:text-neon-cyan" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Export Stats</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors group"
                            >
                                <LogOut size={18} className="text-red-500/40 group-hover:text-red-500" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-red-500/40 group-hover:text-red-500">Disconnect</span>
                            </button>
                        </div>
                    </section>

                    <div className="glass-card p-6 border-dashed border-white/10 bg-transparent flex items-center justify-center text-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">Hardware Hash</span>
                            <span className="text-[10px] font-mono text-white/10 uppercase break-all">DE7F-99XA-0012-K78B-PRO_LINK</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/10 font-bold uppercase tracking-[0.3em] pt-10 border-t border-white/5">
                <span>Core.Engine: Alpha_2.4.0</span>
                <span>System Status: Optimal</span>
                <span>© 2026 DeepEye Labs</span>
            </div>

        </div>
    );
};
