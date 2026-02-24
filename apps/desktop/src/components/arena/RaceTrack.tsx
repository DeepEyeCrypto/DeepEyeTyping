import { memo, useMemo } from 'react';
import { useMultiplayerStore, useAuthStore } from 'core';
import type { ArenaPlayer } from 'core';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Zap, Flame, Wind } from 'lucide-react';

const PROGRESS_FILL_TRANSITION = { type: "spring", stiffness: 40, damping: 25, mass: 1 } as const;
const ICON_TRANSITION = { type: "spring", stiffness: 45, damping: 20, mass: 1.2 } as const;
const PROGRESS_INITIAL = { width: 0 };
const ICON_INITIAL = { left: 0 };

const SPARK_1_ANIMATE = { x: [-5, -20], opacity: [1, 0], scale: [1, 0.5] };
const SPARK_1_TRANSITION = { repeat: Infinity, duration: 0.3 };
const SPARK_2_ANIMATE = { x: [-8, -25], opacity: [1, 0], scale: [1, 0.5] };
const SPARK_2_TRANSITION = { repeat: Infinity, duration: 0.4, delay: 0.1 };

const EXHAUST_VARIANTS = {
    animate: {
        x: [-2, -10],
        opacity: [0.6, 0],
        scale: [1, 1.5],
        transition: { repeat: Infinity, duration: 0.5 }
    }
};

const RacerRow = memo(({ p, isSelf }: { p: ArenaPlayer, isSelf: boolean }) => {
    const progressAnimate = useMemo(() => ({ width: `${p.progress}%` }), [p.progress]);
    const iconAnimate = useMemo(() => ({ left: `${p.progress}%` }), [p.progress]);

    const isFast = p.wpm > 70;
    const isElite = p.wpm > 100;

    return (
        <div className={`relative w-full h-14 flex items-center gap-6 group ${isSelf ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
            {/* Avatar HUD */}
            <div className="flex flex-col items-center gap-1 shrink-0 w-12">
                <div className={`w-10 h-10 rounded-xl relative flex items-center justify-center border transition-all ${isSelf ? 'bg-neon-cyan/20 border-neon-cyan shadow-neon-cyan' : 'bg-white/5 border-white/10'}`}>
                    {p.avatar ? (
                        <img src={p.avatar} alt={p.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                        <User size={16} className={isSelf ? 'text-neon-cyan' : 'text-white/20'} />
                    )}
                    {isElite && (
                        <div className="absolute -top-1 -right-1">
                            <Zap size={10} className="text-yellow-400 fill-yellow-400" />
                        </div>
                    )}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-tighter truncate w-full text-center ${isSelf ? 'text-neon-cyan' : 'text-white/40'}`}>
                    {p.name?.split(' ')[0]}
                </span>
            </div>

            {/* Track Lane */}
            <div className="flex-1 relative h-3 bg-white/2 rounded-full border border-white/5 overflow-visible">
                {/* Visual Depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full" />

                {/* Progress Fill */}
                <motion.div
                    className={`absolute top-0 left-0 h-full rounded-full ${isSelf ? 'bg-gradient-to-r from-neon-cyan/80 to-neon-cyan' : 'bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]'}`}
                    initial={PROGRESS_INITIAL}
                    animate={progressAnimate}
                    transition={PROGRESS_FILL_TRANSITION}
                />

                {/* Racer Icon (The "Pod") */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 z-10"
                    initial={ICON_INITIAL}
                    animate={iconAnimate}
                    transition={ICON_TRANSITION}
                >
                    <div className="relative -ml-4">
                        {/* High Velocity Exhaust Sparks */}
                        <AnimatePresence>
                            {isFast && (
                                <>
                                    <motion.div
                                        variants={EXHAUST_VARIANTS}
                                        animate="animate"
                                        className="absolute top-1/2 -left-4 -translate-y-1/2 w-6 h-2 bg-neon-cyan/40 blur-md rounded-full -z-10"
                                    />
                                    <motion.div
                                        animate={SPARK_1_ANIMATE}
                                        transition={SPARK_1_TRANSITION}
                                        className="absolute top-0 -left-6 w-1 h-1 bg-neon-cyan rounded-full"
                                    />
                                    <motion.div
                                        animate={SPARK_2_ANIMATE}
                                        transition={SPARK_2_TRANSITION}
                                        className="absolute bottom-0 -left-8 w-1 h-1 bg-neon-purple rounded-full"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <div className={`
                            p-2 rounded-xl border shadow-2xl transition-all duration-300 transform -rotate-12
                            ${isSelf ? 'bg-neon-cyan border-neon-cyan text-black scale-110' : 'bg-black border-white/20 text-white group-hover:border-white/40'}
                            ${p.progress >= 100 ? 'ring-4 ring-neon-cyan animate-pulse' : ''}
                        `}>
                            {isElite ? <Flame size={14} /> : (isFast ? <Wind size={14} /> : <User size={14} />)}
                        </div>

                        {/* Floating WPM Indicator */}
                        <div className={`
                            absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black italic
                            px-2 py-0.5 rounded-lg border transition-all
                            ${isSelf ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' : 'bg-black/60 border-white/10 text-white/60'}
                        `}>
                            {p.wpm} <span className="text-[7px] opacity-60">WPM</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
});

export const RaceTrack = () => {
    const { players } = useMultiplayerStore();
    const { user } = useAuthStore();

    const sortedPlayers = useMemo(() => {
        return Array.from(players.values()).sort((a, b) => b.progress - a.progress);
    }, [players]);

    return (
        <div className="w-full glass-card p-10 rounded-[40px] border-white/5 bg-black/40 overflow-visible relative">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <ActivityIcon className="text-neon-cyan" size={16} />
                    <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">
                        Neural Stream Telemetry
                    </h3>
                </div>
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{players.size} Nodes Linked</span>
            </div>

            <div className="flex flex-col gap-6">
                {sortedPlayers.map((p) => (
                    <RacerRow
                        key={p.uid}
                        p={p}
                        isSelf={p.uid === user?.uid}
                    />
                ))}
            </div>

            {/* Grid Decorative Lines */}
            <div className="absolute top-0 right-10 bottom-0 w-px bg-white/5 pointer-events-none" />
            <div className="absolute top-0 right-2 w-px bg-white/[0.02] pointer-events-none" />
        </div>
    );
};

const ActivityIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);
