import { useMemo } from 'react';
import { useStats } from 'core';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Zap, Target, BarChart2, AlertTriangle, Activity, Brain } from 'lucide-react';
import { VirtualKeyboard } from '../typing/VirtualKeyboard';
import { motion } from 'framer-motion';

const CHART_GRID_CONFIG = {
    strokeDasharray: '3 3',
    stroke: 'rgba(255,255,255,0.05)',
    vertical: false
};

const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(5, 5, 10, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};
const ITEM_STYLE = { fontSize: '12px', fontWeight: 'bold' };
const LABEL_STYLE = { color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };

const X_AXIS_TICK = { fill: 'rgba(255,255,255,0.3)', fontSize: 10 };
const Y_AXIS_TICK = { fill: 'rgba(255,255,255,0.3)', fontSize: 10 };
const ACTIVE_DOT_STYLE = { r: 6, stroke: '#00fff2', strokeWidth: 4, fill: '#000' };
const BAR_RADIUS = [4, 4, 0, 0] as [number, number, number, number];
const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 5 };
const CHART_DOMAIN = ['auto', 'auto'] as const;
const PERCENTAGE_DOMAIN = [0, 100] as const;

const FADE_VARIANTS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
};

interface StatCardProps {
    title: string;
    value: string | number;
    unit: string;
    colorClass: string;
    trend: string;
}

const StatCard = ({ title, value, unit, colorClass, trend }: StatCardProps) => (
    <div className="glass-card p-6 flex flex-col gap-1 hover:bg-glass-200 transition-all group overflow-hidden relative">
        <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.replace('text-', 'bg-')}`} />
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">{title}</span>
        <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-extrabold tracking-tighter text-white">{value}</span>
            <span className={`text-xs font-bold uppercase ${colorClass}`}>{unit}</span>
        </div>
        <div className="text-[10px] text-white/20 mt-2 flex items-center gap-2">
            <span className={`w-1 h-1 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
            {trend}
        </div>
    </div>
);



export const StatsPage = () => {
    const { sessions, loading } = useStats();

    const chartData = useMemo(() => sessions.slice().reverse().map((s, i) => ({
        id: i + 1,
        wpm: s.wpm,
        acc: s.accuracy,
        con: Math.round((1 - (s.consistency || 0)) * 100),
        err: s.errorCount,
        date: s.timestamp?.seconds
            ? new Date(s.timestamp.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : '#'
    })), [sessions]);

    const { peakWpm, avgAcc, avgCon } = useMemo(() => {
        if (sessions.length === 0) return { peakWpm: 0, avgAcc: 0, avgCon: 0 };
        return {
            peakWpm: Math.max(...sessions.map(s => s.wpm)),
            avgAcc: Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length),
            avgCon: Math.round(sessions.reduce((acc, s) => acc + (1 - (s.consistency || 0)), 0) / sessions.length * 100)
        };
    }, [sessions]);

    // Calculate aggregated weakest keys
    const { keyErrorMap, toplineWeakKeys } = useMemo(() => {
        const errorMap: Record<string, number> = {};
        sessions.forEach(s => {
            (s.weakestKeys || []).forEach((k: string) => {
                errorMap[k] = (errorMap[k] || 0) + 1;
            });
        });
        const weakKeys = Object.entries(errorMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([k]) => k);
        return { keyErrorMap: errorMap, toplineWeakKeys: weakKeys };
    }, [sessions]);

    const heatMapData = useMemo(() => {
        const aggregate: Record<string, number> = {};
        const keyCounts: Record<string, number> = {};

        sessions.forEach(s => {
            if (s.neuralMap) {
                Object.entries(s.neuralMap as Record<string, { heat: number }>).forEach(([key, stats]) => {
                    aggregate[key] = (aggregate[key] || 0) + stats.heat;
                    keyCounts[key] = (keyCounts[key] || 0) + 1;
                });
            }
        });

        // Normalize
        Object.keys(aggregate).forEach(key => {
            aggregate[key] = aggregate[key] / keyCounts[key];
        });

        return aggregate;
    }, [sessions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                <motion.div
                    variants={FADE_VARIANTS}
                    initial="initial"
                    animate="animate"
                    className="w-20 h-20 rounded-3xl bg-glass-100 flex items-center justify-center border border-white/5 animate-float"
                >
                    <TrendingUp size={32} className="text-white/20" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-bold">No Neural Telemetry</h2>
                    <p className="text-white/30 text-sm mt-2">Finish a drill to generate performance data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col gap-10">

            {/* Header Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Peak Velocity" value={peakWpm} unit="WPM" colorClass="text-neon-cyan" trend="Top 1% Neural Sync" />
                <StatCard title="Precision Avg" value={avgAcc} unit="%" colorClass="text-neon-purple" trend="Stable Connection" />
                <StatCard title="Rhythm Sync" value={avgCon} unit="%" colorClass="text-white" trend="Efficiency Baseline" />
                <StatCard title="Neural Rank" value="V-01" unit="Tier" colorClass="text-neon-blue" trend="Elite Operative" />
            </div>

            {/* Velocity & Rhythm Waveform */}
            <div className="glass-card p-0 overflow-hidden border-none bg-glass-heavy flex flex-col min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                            <Zap size={16} className="text-neon-cyan" />
                        </div>
                        <h3 className="font-bold text-lg">Bandwidth & Consistency Timeline</h3>
                    </div>
                    <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest font-black">
                        <span className="flex items-center gap-1.5 text-neon-cyan"><span className="w-2 h-2 rounded-full bg-neon-cyan" /> Velocity (WPM)</span>
                        <span className="flex items-center gap-1.5 text-white/40"><span className="w-2 h-2 rounded-full bg-white/40" /> Rhythm (%)</span>
                    </div>
                </div>
                <div className="flex-1 p-6 pl-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={CHART_MARGIN}>
                            <defs>
                                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00fff2" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00fff2" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="conGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05} />
                                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...CHART_GRID_CONFIG} />
                            <XAxis dataKey="date" {...X_AXIS_TICK} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" domain={CHART_DOMAIN} {...Y_AXIS_TICK} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" domain={PERCENTAGE_DOMAIN} {...Y_AXIS_TICK} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={ITEM_STYLE} labelStyle={LABEL_STYLE} />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="wpm"
                                stroke="#00fff2"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorWpm)"
                                animationDuration={1500}
                                activeDot={ACTIVE_DOT_STYLE}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="con"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#conGradient)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Neural Topology Heatmap */}
            <div className="glass-card p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Brain size={20} className="text-neon-cyan" />
                        <h3 className="font-bold text-lg">Neural Field Topology</h3>
                    </div>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest text-right">
                        Aggregated from last {sessions.length} syncs
                    </p>
                </div>

                <div className="relative">
                    <VirtualKeyboard
                        activeKey={null}
                        pressedKey={null}
                        heatMap={heatMapData}
                    />
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pb-10">
                {/* Precision Mapping */}
                <div className="glass-card p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <Target size={20} className="text-neon-purple" />
                        <h3 className="font-bold">Precision Map</h3>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.slice(-15)}>
                                <CartesianGrid {...CHART_GRID_CONFIG} />
                                <XAxis hide dataKey="id" />
                                <YAxis domain={PERCENTAGE_DOMAIN} hide />
                                <Bar dataKey="acc" radius={BAR_RADIUS}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.acc > 95 ? '#bc13fe' : '#ffffff20'} />
                                    ))}
                                </Bar>
                                <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={ITEM_STYLE} labelStyle={LABEL_STYLE} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Neural Anomaly Analysis (Weak Keys) */}
                <div className="glass-card p-6 flex flex-col gap-6 lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={20} className="text-red-500" />
                        <h3 className="font-bold">Neural Anomalies</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest leading-relaxed">
                            Detected recurring interference in the following key-clusters:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {toplineWeakKeys.length > 0 ? toplineWeakKeys.map(key => (
                                <div key={key} className="group relative">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center transition-all hover:bg-red-500/20 hover:scale-110 active:scale-95 shadow-lg shadow-red-500/5">
                                        <span className="text-red-500 font-mono text-xl font-bold uppercase">{key === ' ' ? '␣' : key}</span>
                                        <span className="text-[8px] text-red-500/40 font-black mt-0.5">{keyErrorMap[key]}X</span>
                                    </div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                                        Sub-optimal latency
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full py-10 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/2">
                                    <Activity size={24} className="text-white/10 mb-2" />
                                    <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest italic">Signal is crystal clear</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Engagement Efficiency */}
                <div className="glass-card p-6 flex flex-col gap-6 lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <TrendingUp size={20} className="text-white" />
                        <h3 className="font-bold">Engagement Status</h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-8 border border-white/5 bg-white/2 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <BarChart2 size={40} className="text-white/10 mb-2 group-hover:scale-110 group-hover:text-neon-cyan transition-all duration-500" />
                        <span className="text-4xl font-black text-white">{sessions.length}</span>
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">Successful Neural Syncs</span>
                        <div className="mt-6 w-full flex justify-between text-[8px] font-black tracking-tighter text-white/20 uppercase">
                            <span>Last Sync: {sessions[0]?.timestamp?.seconds ? new Date(sessions[0].timestamp.seconds * 1000).toLocaleTimeString() : 'NOW'}</span>
                            <span>Region: GLOBAL_01</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
