import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStats, useAuthStore, useProgressStore, BADGES, LESSONS, useTypingStore, useNavigationStore } from 'core';
import type { LessonConfig, TypingSession, Badge } from 'core';
import { Zap, Target, LineChart, Activity, Award, Calendar, ChevronRight, LayoutGrid, Clock, Trophy, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KpiCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ElementType;
    colorClass: string;
}

const KpiCard = ({ title, value, unit, icon: Icon, colorClass }: KpiCardProps) => (
    <div className="glass-card group hover:border-current/30 transition-all duration-500 overflow-hidden relative">
        <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity ${colorClass.replace('text-', 'bg-')}`} />
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-white/40">{title}</span>
                <Icon size={14} className={`${colorClass} opacity-50`} />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold tracking-tighter">{value}</span>
                <span className="text-xs text-white/30 font-medium uppercase">{unit}</span>
            </div>
        </div>
    </div>
);

interface LessonProtocolCardProps {
    lesson: LessonConfig;
    onSelect: (lesson: LessonConfig) => void;
}

const LessonProtocolCard = React.memo(({ lesson, onSelect }: LessonProtocolCardProps) => {
    const handleClick = useCallback(() => onSelect(lesson), [lesson, onSelect]);

    return (
        <div
            onClick={handleClick}
            className="glass-card flex items-center gap-4 p-4 hover:bg-glass-200 cursor-pointer group transition-all"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform ${lesson.type === 'exam' ? 'bg-gradient-to-br from-neon-purple/20 to-red-500/20' : 'bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20'}`}>
                <LayoutGrid size={20} className={lesson.type === 'exam' ? 'text-neon-purple' : 'text-neon-cyan'} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold group-hover:text-neon-cyan transition-colors">{lesson.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Clock size={10} /> 3-5m
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase ${lesson.type === 'exam' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                        {lesson.phase}
                    </span>
                </div>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
    );
});

const CHART_DOMAIN = ['auto', 'auto'] as const;

const ActivityHeatmap = ({ sessions }: { sessions: TypingSession[] }) => {
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
        <div className="grid grid-cols-7 gap-1.5">
            {grid.map((day, i) => (
                <div
                    key={i}
                    className={`aspect-square rounded-[3px] transition-all duration-500 hover:scale-125 cursor-help ${day.count > 5 ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,255,242,0.5)]' :
                        day.count > 2 ? 'bg-neon-cyan/60' :
                            day.count > 0 ? 'bg-neon-cyan/20' :
                                'bg-white/5'
                        }`}
                    title={`${day.date}: ${day.count} Syncs`}
                />
            ))}
        </div>
    );
};

const DASHBOARD_CHART_GRID = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.05)', vertical: false };
const DASHBOARD_TOOLTIP_STYLE = { backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' };
const DASHBOARD_TOOLTIP_ITEM_STYLE = { color: '#00fff2', fontSize: '12px' };
const DASHBOARD_TOOLTIP_LABEL_STYLE = { display: 'none' };

const OPACITY_VARIANTS = { opacity: [0, 1] };
const CURSOR_TRANSITION = { repeat: Infinity, duration: 0.8 };

const SystemStream = ({ logs }: { logs: string[] }) => (
    <div className="glass-card p-4 h-48 flex flex-col gap-3 font-mono">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Terminal size={12} className="text-neon-cyan" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Neural_System_Log</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1.5">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2 text-[9px] leading-relaxed">
                    <span className="text-neon-cyan/40 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
                    <span className="text-white/60 lowercase tracking-tight">{log}</span>
                </div>
            ))}
            <motion.div animate={OPACITY_VARIANTS} transition={CURSOR_TRANSITION} className="w-1 h-3 bg-neon-cyan/40 inline-block" />
        </div>
    </div>
);

const DashboardChart = ({ sessions }: { sessions: TypingSession[] }) => {
    const data = useMemo(() => sessions.slice(0, 7).reverse().map((s, i) => ({
        id: i,
        wpm: s.wpm,
        acc: s.accuracy
    })), [sessions]);

    return (
        <div className="flex-1 glass-card border-none bg-gradient-to-b from-white/2 to-transparent p-0 overflow-hidden relative min-h-[250px] group flex flex-col">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Session Velocity Map</span>
                <div className="flex gap-2">
                    {['7S', '30S'].map(t => (
                        <button key={t} className={`text-[10px] px-2 py-1 rounded transition-colors uppercase font-mono ${t === '7S' ? 'bg-neon-cyan text-black font-bold' : 'bg-white/5 text-white/40'}`}>{t}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full p-4 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00fff2" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#00fff2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid {...DASHBOARD_CHART_GRID} />
                        <XAxis dataKey="id" hide />
                        <YAxis hide domain={CHART_DOMAIN} />
                        <Tooltip
                            contentStyle={DASHBOARD_TOOLTIP_STYLE}
                            itemStyle={DASHBOARD_TOOLTIP_ITEM_STYLE}
                            labelStyle={DASHBOARD_TOOLTIP_LABEL_STYLE}
                        />
                        <Area
                            type="monotone"
                            dataKey="wpm"
                            stroke="#00fff2"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#dashGradient)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const DashboardPage = () => {
    const { user } = useAuthStore();
    const { sessions } = useStats();
    const { level, xp, unlockedBadges } = useProgressStore();
    const { setText } = useTypingStore();
    const { setView } = useNavigationStore();
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const initialLogs = [
            'initializing neural interface...',
            'authenticating operative credentials...',
            'syncing local buffer with cloud grid...',
            'optimizing liquid glass rendering engine...',
            'neural link established.'
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < initialLogs.length) {
                setLogs(prev => [...prev, initialLogs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    // Map badge IDs back to full objects
    const badges = BADGES.filter(b => unlockedBadges.includes(b.id));

    const displayName = user ? user.displayName?.split(' ')[0] : 'Agent';

    const avgWpm = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length) : 0;
    const avgAcc = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) : 0;

    const handleGoToTrain = useCallback(() => setView('train'), [setView]);
    const handleGoToAchievements = useCallback(() => setView('achievements'), [setView]);

    const handleSelectLesson = useCallback((lesson: LessonConfig) => {
        setText(lesson.text, lesson.type, lesson.id);
        setView('train');
    }, [setText, setView]);

    const recommendedLessons = LESSONS.slice(0, 4);

    return (
        <div className="flex gap-8 h-full w-full max-w-7xl mx-auto">

            {/* --- MAIN PANEL (Left/Center) --- */}
            <div className="flex-[2.5] flex flex-col gap-8 pb-10">

                {/* Greeting & Quick Task */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-white italic">
                            HELLO, <span className="text-neon-cyan neon-text uppercase">{displayName}</span>
                        </h2>
                        <p className="text-white/30 mt-1 font-mono text-[10px] uppercase tracking-[0.2em]">OPERATIVE CLEARANCE: LEVEL {level}</p>
                    </div>
                </div>

                {/* Performance Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <KpiCard title="Neural Velocity" value={avgWpm} unit="WPM" icon={Zap} colorClass="text-neon-cyan" />
                    <KpiCard title="Precision Rate" value={avgAcc} unit="%" icon={Target} colorClass="text-neon-purple" />
                    <KpiCard title="Active Protocols" value={sessions.length} unit="Sets" icon={Activity} colorClass="text-white" />
                </div>

                {/* Training Protocols Grid */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-black italic flex items-center gap-2 uppercase tracking-tighter">
                            <LineChart size={18} className="text-neon-cyan" />
                            Queued Protocols
                        </h3>
                        <button
                            onClick={handleGoToTrain}
                            className="text-[10px] uppercase font-bold text-neon-cyan border-b border-neon-cyan/30 pb-0.5 hover:text-white hover:border-white transition-all"
                        >
                            Access Full Library
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedLessons.map(lesson => (
                            <LessonProtocolCard key={lesson.id} lesson={lesson} onSelect={handleSelectLesson} />
                        ))}
                    </div>
                </div>

                {/* Functional Analytics Chart */}
                <DashboardChart sessions={sessions} />
            </div>

            {/* --- INTELLIGENCE SIDEBAR (Right) --- */}
            <div className="flex-1 flex flex-col gap-6">

                {/* Profile Identity Card */}
                <div className="glass-card bg-neon-purple/5 border-neon-purple/20 p-6 flex flex-col items-center gap-4 group">
                    <div className="relative w-24 h-24">
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                            <circle
                                cx="48" cy="48" r="44"
                                stroke="#bc13fe" strokeWidth="6" fill="transparent"
                                strokeDasharray={276}
                                strokeDashoffset={276 - (276 * (xp % 100)) / 100}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border border-neon-purple/30 overflow-hidden shadow-neon-purple/20 shadow-lg">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Agent" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-dark-surface flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white italic">D</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-lg">{user?.displayName || 'DeepEye Agent'}</h3>
                        <div className="text-[10px] text-neon-purple uppercase font-black tracking-[0.3em] mt-1">Tier {level >= 10 ? 'Elite' : 'Operative'}</div>
                    </div>
                    <button
                        onClick={handleGoToAchievements}
                        className="w-full btn-ghost border border-white/5 text-[10px] uppercase tracking-widest font-bold py-2 hover:bg-neon-purple/10"
                    >
                        View Qualifications
                    </button>
                </div>

                {/* Recent Achievements */}
                <div className="glass-card p-5 flex flex-col gap-4">
                    <h4 className="text-xs font-black italic uppercase tracking-widest flex items-center gap-2">
                        <Trophy size={14} className="text-neon-cyan" />
                        SYNCED HONORS
                    </h4>
                    <div className="flex flex-col gap-3">
                        {badges.length > 0 ? badges.slice(0, 2).map((badge: Badge) => (
                            <div key={badge.id} className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                                    <Award size={20} className="text-neon-cyan" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white">{badge.title}</span>
                                    <span className="text-[8px] uppercase text-white/30 tracking-widest">Tier {badge.tier} Synced</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-[10px] text-white/20 italic p-4 text-center border border-dashed border-white/5 rounded-xl">
                                No honors detected in stream...
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Heatmap */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black italic uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-white/40" />
                            Activity Grid
                        </h4>
                    </div>
                    <ActivityHeatmap sessions={sessions} />
                </div>

                {/* System Activity Stream */}
                <SystemStream logs={logs} />

            </div>
        </div>
    );
};
