import { useSettingsStore, useAuthStore } from '../../../../../packages/core';
import { Volume2, VolumeX, Eye, Zap, Monitor, LogOut } from 'lucide-react';

export const SettingsPage = () => {
    const { soundEnabled, visualEffects, toggleSound, toggleVisuals } = useSettingsStore();
    const { user, logout } = useAuthStore();

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">

            <div className="mb-4">
                <h2 className="text-3xl font-bold text-white">System Config</h2>
                <p className="text-white/50">Adjust neural interface parameters.</p>
            </div>

            {/* Audio Section */}
            <section className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
                    <Volume2 size={20} /> Audio Protocol
                </h3>

                <div className="flex justify-between items-center">
                    <div>
                        <span className="block text-white font-medium">Feedback Sounds</span>
                        <span className="text-sm text-white/50">Keypress oscillators and synths</span>
                    </div>
                    <button
                        onClick={toggleSound}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${soundEnabled ? 'bg-neon-cyan' : 'bg-white/10'}`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </section>

            {/* Visuals Section */}
            <section className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-neon-purple mb-6 flex items-center gap-2">
                    <Eye size={20} /> Visual Cortex
                </h3>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="block text-white font-medium">Glass Blur Quality</span>
                        <span className="text-sm text-white/50">High reduces performance on older rigs</span>
                    </div>
                    <button
                        onClick={toggleVisuals}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${visualEffects === 'high' ? 'bg-neon-purple' : 'bg-white/10'}`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${visualEffects === 'high' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </section>

            {/* Account Section */}
            {user && (
                <section className="glass-panel p-6 rounded-2xl border-red-500/30">
                    <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                        <Zap size={20} /> Danger Zone
                    </h3>
                    <button
                        onClick={() => logout()}
                        className="btn-ghost text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                    >
                        <LogOut size={16} /> Disconnect Logic
                    </button>
                </section>
            )}

            <div className="text-center text-white/20 text-xs mt-10">
                DeepEye OS v1.0.0 • Build 2404
            </div>

        </div>
    );
};
