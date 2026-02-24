import React, { useCallback, useState } from 'react';
import { useSettingsStore, useAuthStore } from 'core';
import type { ParticleFrequency, HUDComplexity, ThemeProfile } from 'core';
import { Eye, LogOut, Cpu, Share2, Radio, Terminal, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: React.ElementType<{ size?: number; className?: string }>, title: string, subtitle: string }) => (
    <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-3 text-neon-cyan">
            <Icon size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">{title}</span>
        </div>
        <div className="h-px w-20 bg-gradient-to-r from-neon-cyan to-transparent" />
        <p className="text-white/30 text-[9px] uppercase font-bold tracking-widest">{subtitle}</p>
    </div>
);

const SettingRow = ({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[24px] group hover:border-white/10 transition-all">
        <div className="flex flex-col gap-1">
            <span className="text-sm font-black text-white italic tracking-tight uppercase group-hover:text-neon-cyan transition-colors">{title}</span>
            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">{desc}</span>
        </div>
        <div className="flex items-center gap-2">
            {children}
        </div>
    </div>
);

const SegmentedControl = <T extends string>({ options, active, onChange, colorClass }: {
    options: T[],
    active: T,
    onChange: (val: T) => void,
    colorClass: string
}) => {
    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const val = e.currentTarget.getAttribute('data-value') as T;
        if (val) onChange(val);
    }, [onChange]);

    return (
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 gap-1">
            {options.map((opt) => (
                <button
                    key={opt}
                    data-value={opt}
                    onClick={handleClick}
                    className={`
                        px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                        ${active === opt ? `${colorClass} bg-white/5 shadow-xl` : 'text-white/20 hover:text-white/40'}
                    `}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
};

// --- MAIN COMPONENT ---

const PARTICLE_OPTIONS: ParticleFrequency[] = ['none', 'minimal', 'high', 'ultra'];
const HUD_OPTIONS: HUDComplexity[] = ['minimal', 'standard', 'technical'];
const THEME_OPTIONS: ThemeProfile[] = ['deep_ocean', 'neon_matrix', 'monochrome_ghost'];

const FADE_INIT = { opacity: 0, y: 10 };
const FADE_ANIM = { opacity: 1, y: 0 };
const FADE_EXIT = { opacity: 0, y: -10 };

export const SettingsPage = () => {
    const {
        soundEnabled, toggleSound,
        dynamicPitch, setDynamicPitch,
        visualEffects, toggleVisuals,
        particleFrequency, setParticleFrequency,
        hudComplexity, setHUDComplexity,
        godMode, toggleGodMode,
        themeProfile, setThemeProfile,
        showKeyboard, toggleKeyboard
    } = useSettingsStore();

    const { user, logout, updateUserProfile } = useAuthStore();

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(user?.displayName || '');
    const [tempAvatar, setTempAvatar] = useState(user?.photoURL || '');

    const handleLogout = useCallback(() => logout(), [logout]);
    const handleSaveProfile = useCallback(async () => {
        if (tempName.trim()) {
            await updateUserProfile(tempName, tempAvatar);
            setIsEditing(false);
        }
    }, [tempName, tempAvatar, updateUserProfile]);

    const handleDynamicPitchToggle = useCallback(() => {
        setDynamicPitch(!dynamicPitch);
    }, [dynamicPitch, setDynamicPitch]);

    const handleToggleEditing = useCallback(() => {
        setIsEditing(prev => !prev);
    }, []);

    const handleSelectAvatar = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const url = e.currentTarget.getAttribute('data-url');
        if (url) setTempAvatar(url);
    }, []);

    const handleSegmentChange = useCallback((val: ParticleFrequency) => {
        setParticleFrequency(val);
    }, [setParticleFrequency]);

    const handleHudChange = useCallback((val: HUDComplexity) => {
        setHUDComplexity(val);
    }, [setHUDComplexity]);

    const handleThemeChange = useCallback((val: ThemeProfile) => {
        setThemeProfile(val);
    }, [setThemeProfile]);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTempName(e.target.value);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto py-10 px-6 flex flex-col gap-12 overflow-hidden">

            {/* Header Identity */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 bg-white/2 border border-white/5 p-10 rounded-[48px] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 blur-[120px] -z-10 rounded-full" />

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-neon-cyan">
                        <Settings2 size={24} className="stroke-[2.5px]" />
                        <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-tight pt-1">OS_CONFIG</h2>
                    </div>
                    <p className="text-white/30 text-xs font-mono uppercase tracking-[0.3em] italic">DeepEye Neural Link Shell // Revision_2.4.0</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Node Integrity</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-sm font-black text-green-500 uppercase italic">Optimal</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Protocol Settings Column */}
                <div className="lg:col-span-7 flex flex-col gap-12">

                    {/* Acoustics Section */}
                    <section>
                        <SectionHeader
                            icon={Radio}
                            title="Acoustic Calibration"
                            subtitle="Senses integration and auditory feedback"
                        />
                        <div className="flex flex-col gap-4">
                            <SettingRow title="Haptic Feedback" desc="Toggle mechanical keypress synthesis">
                                <button
                                    onClick={toggleSound}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${soundEnabled ? 'bg-neon-cyan text-black shadow-neon-cyan' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                                >
                                    {soundEnabled ? 'Enabled' : 'Disabled'}
                                </button>
                            </SettingRow>
                            <SettingRow title="Neural Pitch" desc="Scale audio frequency with burst velocity">
                                <button
                                    onClick={handleDynamicPitchToggle}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${dynamicPitch ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                                >
                                    {dynamicPitch ? 'Dynamic' : 'Static'}
                                </button>
                            </SettingRow>
                        </div>
                    </section>

                    {/* Visual Cortex Section */}
                    <section>
                        <SectionHeader
                            icon={Eye}
                            title="Visual Cortex"
                            subtitle="Rendering depth and particle density"
                        />
                        <div className="flex flex-col gap-4">
                            <SettingRow title="Glass Quality" desc="Blur depth and refraction layers">
                                <button
                                    onClick={toggleVisuals}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${visualEffects === 'high' ? 'bg-neon-purple text-white shadow-neon-purple' : 'bg-white/5 text-white/30'}`}
                                >
                                    {visualEffects === 'high' ? 'High Fidelity' : 'Performance'}
                                </button>
                            </SettingRow>
                            <SettingRow title="Neural Exhaust" desc="Particle frequency at high velocity">
                                <SegmentedControl<ParticleFrequency>
                                    options={PARTICLE_OPTIONS}
                                    active={particleFrequency}
                                    onChange={handleSegmentChange}
                                    colorClass="text-neon-purple"
                                />
                            </SettingRow>
                            <SettingRow title="HUD Complexity" desc="HUD depth in arena protocols">
                                <SegmentedControl<HUDComplexity>
                                    options={HUD_OPTIONS}
                                    active={hudComplexity}
                                    onChange={handleHudChange}
                                    colorClass="text-neon-cyan"
                                />
                            </SettingRow>
                        </div>
                    </section>

                    {/* System Layer Section */}
                    <section>
                        <SectionHeader
                            icon={Cpu}
                            title="System Layers"
                            subtitle="Core interface configuration"
                        />
                        <div className="flex flex-col gap-4">
                            <SettingRow title="Virtual Keyboard" desc="Holographic keyboard visualization">
                                <button
                                    onClick={toggleKeyboard}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${showKeyboard ? 'bg-white text-black font-black' : 'bg-white/5 text-white/30'}`}
                                >
                                    {showKeyboard ? 'Visible' : 'Hidden'}
                                </button>
                            </SettingRow>
                            <SettingRow title="Theme Profile" desc="Visual aesthetic preset">
                                <SegmentedControl<ThemeProfile>
                                    options={THEME_OPTIONS}
                                    active={themeProfile}
                                    onChange={handleThemeChange}
                                    colorClass="text-neon-cyan"
                                />
                            </SettingRow>
                            <SettingRow title="God Mode" desc="Recursive biometric visualization">
                                <button
                                    onClick={toggleGodMode}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${godMode ? 'bg-red-500 text-white shadow-red-500 animate-pulse' : 'bg-white/5 text-white/30'}`}
                                >
                                    {godMode ? 'Active' : 'Locked'}
                                </button>
                            </SettingRow>
                        </div>
                    </section>
                </div>

                {/* Account & Identity Column */}
                <div className="lg:col-span-5 flex flex-col gap-12">

                    <section>
                        <SectionHeader
                            icon={Terminal}
                            title="Neural Identity"
                            subtitle="Operative authentication and profile"
                        />

                        <div className="glass-card p-10 bg-black/40 border-white/5 rounded-[40px] flex flex-col gap-10 shadow-3xl">

                            <div className="flex justify-center relative">
                                <div className="relative w-32 h-32 group cursor-pointer" onClick={handleToggleEditing}>
                                    <div className="absolute inset-0 bg-neon-cyan/10 rounded-full blur-[40px] opacity-20 group-hover:opacity-60 transition-opacity" />
                                    <div className="w-full h-full rounded-full border-2 border-neon-cyan/20 p-2 group-hover:border-neon-cyan/50 transition-colors">
                                        <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative">
                                            {(tempAvatar || user?.photoURL) ? (
                                                <img src={tempAvatar || user?.photoURL || ''} alt="Agent" className="w-full h-full object-cover scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-neon-cyan font-black text-3xl italic">D</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Edit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.div
                                        initial={FADE_INIT}
                                        animate={FADE_ANIM}
                                        exit={FADE_EXIT}
                                        className="flex flex-col gap-6"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">Uplink Codename</label>
                                            <input
                                                type="text"
                                                value={tempName}
                                                onChange={handleNameChange}
                                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-black italic tracking-tight focus:border-neon-cyan outline-none transition-all placeholder:text-white/10"
                                                placeholder="ENTER_ID"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">Avatar Hash</label>
                                            <div className="grid grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5].map(i => {
                                                    const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${i}`;
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={handleSelectAvatar}
                                                            data-url={url}
                                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${tempAvatar === url ? 'border-neon-cyan scale-110 shadow-neon-cyan' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                                                        >
                                                            <img src={url} alt="Avatar Opt" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSaveProfile}
                                            className="w-full py-5 bg-neon-cyan text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-neon-cyan hover:bg-white transition-all transform active:scale-95"
                                        >
                                            Update Hash
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={FADE_INIT}
                                        animate={FADE_ANIM}
                                        exit={FADE_EXIT}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{user?.displayName || 'LINK_PENDING'}</h3>
                                        <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.5em] italic">Access Tier: Alpha_V</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center justify-center gap-4 py-8 rounded-[32px] bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon-cyan/5 transition-colors">
                                        <Share2 size={20} className="text-white/20 group-hover:text-neon-cyan" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">Telemetry Export</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex flex-col items-center justify-center gap-4 py-8 rounded-[32px] bg-red-500/[0.03] border border-red-500/10 hover:bg-red-500/[0.08] hover:border-red-500/30 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                                        <LogOut size={20} className="text-red-500/40 group-hover:text-red-500 transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500/40 group-hover:text-red-500 transition-colors">Terminate Link</span>
                                </button>
                            </div>

                        </div>
                    </section>

                    {/* Hardware Manifest */}
                    <div className="glass-card p-10 border border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                        <Terminal size={32} className="text-white/20" />
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em]">Hardware Manifest</span>
                            <span className="text-[11px] font-mono text-neon-cyan/40 uppercase break-all leading-relaxed">
                                NOD_X7-SHA256: 0x9f22...c771<br />
                                LINK_STR: 99.8%_STABLE<br />
                                DRIVER: LQD_GLS_v4
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-white/5 text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">
                <div className="flex items-center gap-8">
                    <span>Build: 2.4.0 (NEURAL_ARENA)</span>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>Kernel: 0xDE7F</span>
                </div>
                <span>DeepEye Systems // Foundry 2026</span>
            </div>

        </div>
    );
};
