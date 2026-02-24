// ============================================================
// STREAK WIDGET - DeepEyeTyping Dashboard
// ============================================================

import { motion } from 'framer-motion';
import { Flame, Calendar, Shield } from 'lucide-react';

interface StreakWidgetProps {
    currentStreak: number;
    bestStreak: number;
    graceDaysUsedThisWeek: number;
    shieldsRemaining: number;
}

const SCALE_INIT = { scale: 1.2 };
const SCALE_ANIM = { scale: 1 };
const MILESTONE_INIT = { opacity: 0, y: 10 };
const MILESTONE_ANIM = { opacity: 1, y: 0 };

export function StreakWidget({
    currentStreak,
    bestStreak,
    graceDaysUsedThisWeek,
    shieldsRemaining,
}: StreakWidgetProps) {
    const isOnFire = currentStreak >= 7;
    const isMilestone = currentStreak > 0 && currentStreak % 7 === 0;

    return (
        <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Flame
                        size={20}
                        className={isOnFire ? 'text-orange-500 animate-pulse' : 'text-white/40'}
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">
                        Streak
                    </span>
                </div>
                <span className="text-[10px] text-white/30">Best: {bestStreak}</span>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <motion.span
                    key={currentStreak}
                    initial={SCALE_INIT}
                    animate={SCALE_ANIM}
                    className={`text-4xl font-black italic ${isOnFire ? 'text-orange-500' : 'text-white'
                        }`}
                >
                    {currentStreak}
                </motion.span>
                <span className="text-sm text-white/40 mb-1">days</span>
            </div>

            {isMilestone && (
                <motion.div
                    initial={MILESTONE_INIT}
                    animate={MILESTONE_ANIM}
                    className="mb-3 px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30"
                >
                    <p className="text-[10px] text-orange-400 font-bold">
                        🎉 {currentStreak} Day Streak!
                    </p>
                </motion.div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto text-[10px] text-white/40">
                <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
                    <Calendar size={12} />
                    <span>{1 - graceDaysUsedThisWeek} grace left</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
                    <Shield size={12} />
                    <span>{shieldsRemaining} shields</span>
                </div>
            </div>
        </div>
    );
}
