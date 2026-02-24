import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useStats, useAuthStore, useProgressStore, BADGES, LESSONS, useTypingStore, useNavigationStore } from 'core';
import type { LessonConfig, TypingSession } from 'core';
import { Zap, Target, Award, Calendar, ChevronRight, LayoutGrid, Clock, Trophy, Terminal, Activity, Cpu, Shield, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StreakWidget } from './StreakWidget';
import { MissionList } from './MissionList';

// --- CONSTANTS & VARIANTS ---

const FADE_IN_UP = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const CHART_GRID_CONFIG = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.03)', vertical: false };
const TOOLTIP_CONFIG = {
    contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(0,255,242,0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 20px rgba(0, 255, 242, 0.1)'
    },
    itemStyle: { color: '#00fff2', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as const },
    labelStyle: { display: 'none' }
};

const HOVER_ANIM = { y: -4 };
const CURSOR_ANIM = { opacity: [0, 1] };
const CURSOR_TRANS = { repeat: Infinity, duration: 0.8 };
const CHART_MARGIN = { top: 10, right: 10, left: 0, bottom: 0 };
const CHART_DOMAIN = ['dataMin - 10', 'dataMax + 10'];
const INIT_WIDTH = { width: 0 };
const EXP_TRANS = { duration: 1.5, ease: "circOut" };
const STROKE_INIT = { strokeDashoffset: 364 };
const STROKE_TRANS = { duration: 2, ease: "circOut" };

// --- SUB-COMPONENTS ---

const KpiCard = memo(({ title, value, unit, icon: Icon, colorClass, delay = 0 }: {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ElementType;
    colorClass: string;
    delay?: number;
}) => {
    const transition = useMemo(() => ({ delay, duration: 0.5 }), [delay]);
    return (
        <motion.div
            variants={FADE_IN_UP}
            initial="initial"
            animate="animate"
            transition={transition}
            className="glass-card group hover:border-white/20 transition-all duration-500 overflow-hidden relative bg-white/2 border-white/5 p-6 rounded-[32px]"
        >
            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${colorClass.replace('text-', 'bg-')}`} />

            <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">{title}</span>
                    <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${colorClass}`}>
                        <Icon size={14} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter text-white italic">{value}</span>
                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{unit}</span>
                </div>
            </div>
        </motion.div>
    )
});

const LessonProtocolCard = memo(({ lesson, onSelect }: { lesson: LessonConfig; onSelect: (lesson: LessonConfig) => void }) => {
    const handleClick = useCallback(() => onSelect(lesson), [lesson, onSelect]);

    return (
        <motion.div
            whileHover={HOVER_ANIM}
            onClick={handleClick}
            className="glass-card flex items-center gap-5 p-5 hover:bg-white/5 cursor-pointer group transition-all bg-white/2 border-white/5 rounded-[32px] overflow-hidden"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${lesson.type === 'exam' ? 'bg-neon-purple/10 border-neon-purple/30' : 'bg-neon-cyan/10 border-neon-cyan/30'}`}>
                <LayoutGrid size={22} className={lesson.type === 'exam' ? 'text-neon-purple' : 'text-neon-cyan'} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-black text-white/90 group-hover:text-neon-cyan transition-colors tracking-tight uppercase">{lesson.title}</h4>
                <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={10} className="text-white/20" /> 3.5m Sync
                    </span>
                    <div className={`h-1 w-1 rounded-full bg-white/10`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${lesson.type === 'exam' ? 'text-neon-purple' : 'text-neon-cyan'}`}>
                        {lesson.phase} Phase
                    </span>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ChevronRight size={16} className="text-white/20 group-hover:text-white" />
            </div>
        </motion.div>
    );
});

const ActivityHeatmap = memo(({ sessions }: { sessions: TypingSession[] }) => {
    const grid = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 28 }).map((_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (27 - i));
            const dayKey = d.toDateString();
            const count = sessions.filter(s => {
                const ts = s.timestamp;
                const timestamp = (typeof ts === 'object' && ts !== null && 'seconds' in ts)
                    ? (ts as { seconds: number }).seconds * 1000
                    : Number(ts);
                const sd = new Date(timestamp);
                return sd.toDateString() === dayKey;
            }).length;
            return { count, date: dayKey };
        });
    }, [sessions]);

    return (
        <div className="grid grid-cols-7 gap-2">
            {grid.map((day, i) => (
                <div
                    key={i}
                    className={`aspect-square rounded-lg transition-all duration-300 hover:scale-110 cursor-help border border-white/5 ${day.count > 5 ? 'bg-neon-cyan shadow-[0_0_15px_rgba(0,255,242,0.4)] border-neon-cyan/50' :
                        day.count > 2 ? 'bg-neon-cyan/40' :
                            day.count > 0 ? 'bg-neon-cyan/10' :
                                'bg-white/2'
                        }`}
                    title={`${day.date}: ${day.count} Syncs`}
                />
            ))}
        </div>
    );
});

// PERFORMANCE FIX: Pre-calculate timestamp outside the render loop
const getFormattedTime = (() => {
    let cachedTime = '';
    let lastUpdate = 0;
    return () => {
        const now = Date.now();
        if (now - lastUpdate > 1000) { // Cache for 1 second
            cachedTime = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
            lastUpdate = now;
        }
        return cachedTime;
    };
})();

const SystemStream = memo(({ logs }: { logs: string[] }) => {
    // PERFORMANCE FIX: Get timestamp once per render instead of per log entry
    const timestamp = getFormattedTime();

    return (
        <div className="glass-card p-6 h-56 flex flex-col gap-4 font-mono bg-black/60 border-white/5 rounded-[32px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-neon-cyan" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Neural_Telemetry_Stream</span>
                </div>
                <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse shadow-neon-cyan" />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-[10px] leading-relaxed group">
                        <span className="text-neon-cyan/20 shrink-0 font-bold group-hover:text-neon-cyan/40 transition-colors">[{timestamp}]</span>
                        <span className="text-white/40 group-hover:text-white/70 transition-colors lowercase tracking-tight italic">{log}</span>
                    </div>
                ))}
                <motion.div
                    animate={CURSOR_ANIM}
                    transition={CURSOR_TRANS}
                    className="w-1.5 h-4 bg-neon-cyan/30 inline-block mt-1"
                />
            </div>
        </div>
    );
});

const DashboardChart = memo(({ sessions }: { sessions: TypingSession[] }) => {
    const data = useMemo(() => sessions.slice(0, 10).reverse().map((s, i) => ({
        id: i,
        wpm: s.wpm,
        acc: s.accuracy,
        name: new Date(typeof s.timestamp === 'number' ? s.timestamp : (s.timestamp as { seconds: number }).seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })), [sessions]);

    return (
        <motion.div
            variants={FADE_IN_UP}
            className="flex-1 glass-card border-white/5 bg-black/40 p-0 overflow-hidden relative min-h-[300px] flex flex-col rounded-[40px] shadow-2xl"
        >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <div className="flex items-center gap-3">
                    <Activity size={16} className="text-neon-cyan" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Temporal Velocity Profile</span>
                </div>
                <div className="flex gap-3">
                    {['Last 10 Syncs'].map(t => (
                        <div key={t} className="text-[9px] px-3 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan font-black uppercase tracking-widest">{t}</div>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full p-8 pb-4 pl-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={CHART_MARGIN}>
                        <defs>
                            <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00fff2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00fff2" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#bc13fe" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid {...CHART_GRID_CONFIG} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={CHART_DOMAIN} />
                        <Tooltip {...TOOLTIP_CONFIG} />
                        <Area
                            type="monotone"
                            dataKey="wpm"
                            stroke="#00fff2"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#dashGradient)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="acc"
                            stroke="#bc13fe"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#accGradient)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
});

const NeuralExperience = memo(({ level, xp }: { level: number, xp: number }) => {
    const progress = xp % 100;
    const animateWidth = useMemo(() => ({ width: `${progress}%` }), [progress]);

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Protocol Rank</span>
                    <span className="text-2xl font-black text-white italic">Tier {level}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neon-purple">Neural Load</span>
                    <span className="text-sm font-mono font-bold text-white/60">{progress}/100 <span className="text-[9px] opacity-40">XP</span></span>
                </div>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                <motion.div
                    initial={INIT_WIDTH}
                    animate={animateWidth}
                    transition={EXP_TRANS}
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full relative"
                >
                    <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm" />
                </motion.div>
            </div>
        </div>
    );
});

// --- MAIN COMPONENT ---

export const DashboardPage = () => {
    const { user } = useAuthStore();
    const { sessions } = useStats();
    // Fix: badges is the store property, unlockedBadges was undefined. lifetimeStats is also missing in store, defaulting it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { level, xp, badges: unlockedBadges = [], lifetimeStats = { maxWpm: 0, raceWins: 0 } } = useProgressStore() as any;
    const { setText } = useTypingStore();
    const { setView } = useNavigationStore();
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const initialLogs = [
            'initiating neural bridge...',
            'syncing biometric signatures...',
            'validating operative clearance tier ' + level,
            'mapping temporal velocity grid...',
            'link operational.'
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < initialLogs.length) {
                setLogs(prev => [...prev.slice(-15), initialLogs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [level]);

    const badges = useMemo(() => BADGES.filter(b => unlockedBadges.includes(b.id)), [unlockedBadges]);
    const displayName = useMemo(() => user?.displayName?.split(' ')[0].toUpperCase() || 'ANONYMOUS', [user]);

    const avgWpm = useMemo(() => sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length) : 0, [sessions]);
    const avgAcc = useMemo(() => sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) : 0, [sessions]);

    const handleGoToTrain = useCallback(() => setView('train'), [setView]);
    const handleGoToAchievements = useCallback(() => setView('achievements'), [setView]);
    const handleSelectLesson = useCallback((lesson: LessonConfig) => {
        setText(lesson.text, lesson.type, lesson.id);
        setView('train');
    }, [setText, setView]);

    const strokeAnim = useMemo(() => ({ strokeDashoffset: 364 - (364 * (xp % 100)) / 100 }), [xp]);

    const recommendedLessons = useMemo(() => LESSONS.slice(0, 4), []);

    return (
        <div className="flex flex-col xl:flex-row gap-10 min-h-full w-full max-w-7xl mx-auto py-8">

            {/* --- MAIN OPERATIVE HUB (Left/Center) --- */}
            <div className="w-full xl:flex-[2.5] flex flex-col gap-10 pb-10">

                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white/2 p-10 rounded-[48px] border border-white/5 relative overflow-hidden shadow-2xl shrink-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 blur-[120px] -z-10 rounded-full" />
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <div className="flex items-center gap-3 text-neon-cyan">
                            <Shield size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic truncate">DeepEye.Operative_Dashboard</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white italic leading-tight break-words">
                            HELLO, <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,242,0.4)]">{displayName}</span>
                        </h2>
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-black tracking-widest text-white/30">Local Node</span>
                                <span className="text-xs font-mono text-white/60">SYD_CRTX_09</span>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-black tracking-widest text-white/30">Uplink Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Optimized</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleGoToTrain}
                        className="px-8 md:px-10 py-5 bg-neon-cyan text-black rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-neon-cyan hover:bg-white transition-all group shrink-0"
                    >
                        Initialize Sync
                        <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>

                {/* Neural Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title="Neural Velocity" value={avgWpm} unit="WPM" icon={Zap} colorClass="text-neon-cyan" delay={0.1} />
                    <KpiCard title="Signal Stability" value={avgAcc} unit="%" icon={Target} colorClass="text-neon-purple" delay={0.2} />
                    <KpiCard title="Peak Bitrate" value={lifetimeStats.maxWpm} unit="WPM" icon={Award} colorClass="text-white" delay={0.3} />
                    <KpiCard title="Arena Dominance" value={lifetimeStats.raceWins} unit="Wins" icon={Trophy} colorClass="text-neon-cyan" delay={0.4} />
                </div>

                {/* Training Protocols Forge */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[14px] bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                                <Cpu size={18} className="text-neon-cyan" />
                            </div>
                            <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-white">
                                Recommended Protocols
                            </h3>
                        </div>
                        <button
                            onClick={handleGoToTrain}
                            className="text-[9px] uppercase font-black text-neon-cyan hover:text-white transition-all tracking-[0.3em]"
                        >
                            Grid Registry
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedLessons.map(lesson => (
                            <LessonProtocolCard key={lesson.id} lesson={lesson} onSelect={handleSelectLesson} />
                        ))}
                    </div>
                </div>

                {/* Velocity Visualization */}
                <DashboardChart sessions={sessions} />
            </div>

            {/* --- INTELLIGENCE & IDENTITY (Right) --- */}
            <div className="w-full xl:flex-1 flex flex-col gap-8">

                {/* Streak & Missions */}
                <div className="flex flex-col gap-4">
                    <StreakWidget
                        currentStreak={useProgressStore(state => state.currentStreak) || 0}
                        bestStreak={useProgressStore(state => state.bestStreak) || 0}
                        graceDaysUsedThisWeek={0}
                        shieldsRemaining={3}
                    />
                    <MissionList missions={(useProgressStore(state => state.dailyMissions) || []).map(m => ({
                        ...m,
                        description: m.title,
                        expiresAt: new Date().toISOString(),
                        frequency: 'daily'
                    }))} />
                </div>

                {/* Profile Biometric Profile */}
                <div className="glass-card bg-black/40 border-white/10 p-10 flex flex-col items-center gap-8 group rounded-[48px] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 blur-[60px] -z-10 rounded-full" />

                    <div className="relative w-32 h-32">
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                            <motion.circle
                                cx="64" cy="64" r="58"
                                stroke="#bc13fe" strokeWidth="8" fill="transparent"
                                strokeDasharray={364}
                                initial={STROKE_INIT}
                                animate={strokeAnim}
                                transition={STROKE_TRANS}
                                className="shadow-neon-purple"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="w-full h-full rounded-full border-2 border-neon-purple/20 overflow-hidden shadow-2xl group-hover:border-neon-purple/50 transition-colors">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Agent" className="w-full h-full object-cover scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <UsersIcon className="text-white/20" size={32} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center flex flex-col gap-1">
                        <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em]">Operative Profile</span>
                        <h3 className="font-black text-2xl text-white italic tracking-tight">{user?.displayName || 'LINK_PENDING'}</h3>
                    </div>

                    <NeuralExperience level={level} xp={xp} />

                    <button
                        onClick={handleGoToAchievements}
                        className="w-full py-4 glass-card bg-white/2 border-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-2xl"
                    >
                        Registry Honors
                    </button>
                </div>

                {/* Recent Neural Signatures (Badges) */}
                <div className="glass-card p-8 flex flex-col gap-6 bg-white/2 border-white/5 rounded-[40px] shrink-0">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-5">
                        <Trophy size={16} className="text-neon-cyan" />
                        <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] text-white/60">
                            Recent Merit Gains
                        </h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {badges.length > 0 ? badges.slice(0, 2).map((badge: any) => (
                            <div key={badge.id} className="flex items-center gap-4 p-4 bg-white/2 rounded-[24px] border border-white/5 group hover:border-neon-cyan/20 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-neon-cyan/5 border border-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/10 transition-colors">
                                    <Award size={22} className="text-neon-cyan" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-black text-white uppercase tracking-tight">{badge.title}</span>
                                    <span className="text-[9px] uppercase text-white/20 font-bold tracking-widest italic">Tier {badge.tier} Sync</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-[10px] text-white/10 font-black uppercase tracking-[0.2em] p-10 text-center border-2 border-dashed border-white/5 rounded-[32px] italic">
                                Scouring registry...
                            </div>
                        )}
                    </div>
                </div>

                {/* Temporal Activity Heatmap */}
                <div className="glass-card p-8 bg-black/40 border-white/5 rounded-[40px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-white/30" />
                            <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] text-white/50">
                                Activity Pulse
                            </h4>
                        </div>
                    </div>
                    <ActivityHeatmap sessions={sessions} />
                </div>

                {/* System Activity Stream */}
                <SystemStream logs={logs} />

            </div>
        </div>
    );
};

const UsersIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
