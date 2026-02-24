import { useMemo } from 'react';
import { useProgressStore, BADGES } from 'core';
import type { Badge } from 'core';
import { Award, Lock, CheckCircle2, Trophy, Zap, Target, Activity, Crown, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const RARITY_STYLING = {
    common: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'shadow-blue-400/20', label: 'C' },
    rare: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', glow: 'shadow-green-400/20', label: 'B' },
    epic: { color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20', glow: 'shadow-neon-purple/20', label: 'A' },
    legendary: { color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/20', glow: 'shadow-neon-cyan/50', label: 'S' }
};

const ICON_MAP: Record<string, React.ElementType> = {
    Plug: Search,
    Target: Target,
    Zap: Zap,
    Activity: Activity,
    Crosshair: Target,
    Crown: Crown
};

const BADGE_INITIAL = { opacity: 0, y: 20 };
const BADGE_ANIMATE = { opacity: 1, y: 0 };
const ROTATE_ANIMATE = { rotate: 360 };
const ROTATE_TRANSITION = { duration: 10, repeat: Infinity, ease: 'linear' as const };
const PROGRESS_INITIAL = { width: 0 };
const PROGRESS_TRANSITION = { duration: 1.5, ease: 'easeOut' as const };

const BadgeCard = ({ badge, isUnlocked }: { badge: Badge, isUnlocked: boolean }) => {
    const style = RARITY_STYLING[badge.rarity as keyof typeof RARITY_STYLING] || RARITY_STYLING.common;
    const Icon = ICON_MAP[badge.icon] || Award;

    return (
        <motion.div
            layout
            initial={BADGE_INITIAL}
            animate={BADGE_ANIMATE}
            className={`
                relative glass-card p-6 flex flex-col items-center text-center gap-4 transition-all duration-500 overflow-hidden group
                ${isUnlocked ? `border-white/10 ${style.glow}` : 'opacity-40 grayscale blur-[1px]'}
            `}
        >
            {/* Tier Indicator */}
            <div className={`absolute top-3 right-3 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border ${isUnlocked ? style.border + ' ' + style.color : 'border-white/5 text-white/20'}`}>
                {style.label}
            </div>

            {/* Icon Sphere */}
            <div className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 relative
                ${isUnlocked ? `bg-gradient-to-br from-white/10 to-transparent border ${style.border}` : 'bg-white/5 border border-white/5'}
            `}>
                <Icon size={32} className={isUnlocked ? style.color : 'text-white/20'} />

                {isUnlocked && (
                    <motion.div
                        animate={ROTATE_ANIMATE}
                        transition={ROTATE_TRANSITION}
                        className="absolute inset-0 rounded-full border border-dashed border-white/10"
                    />
                )}
            </div>

            <div className="flex flex-col gap-1">
                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{badge.title}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold leading-tight px-4">
                    {badge.description}
                </p>
            </div>

            {isUnlocked ? (
                <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <CheckCircle2 size={10} className="text-neon-cyan" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-neon-cyan">Synchronized</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 mt-2 px-3 py-1">
                    <Lock size={10} className="text-white/20" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/10">Locked</span>
                </div>
            )}

            {/* Hover Background Glow */}
            {isUnlocked && (
                <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity ${style.bg}`} />
            )}
        </motion.div>
    );
};

export const AchievementsPage = () => {
    const unlockedBadges = useProgressStore((state) => state.badges || []);

    const { unlockedIds, progressPercent, statItems } = useMemo(() => {
        const ids = new Set(unlockedBadges);
        const count = unlockedBadges.length;
        const total = BADGES.length;
        const percent = Math.round((count / total) * 100);

        const items = [
            { label: 'Total Honors', value: total, icon: Award, color: 'text-white' },
            { label: 'Synced', value: count, icon: CheckCircle2, color: 'text-neon-cyan' },
            { label: 'S-Tier Rank', value: BADGES.filter(b => b.rarity === 'legendary' && ids.has(b.id)).length, icon: Crown, color: 'text-neon-purple' },
            { label: 'Unlocking', value: total - count, icon: Lock, color: 'text-white/20' }
        ];

        return { unlockedIds: ids, progressPercent: percent, statItems: items };
    }, [unlockedBadges]);

    return (
        <div className="w-full h-full flex flex-col gap-10">

            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <Trophy size={32} className="text-neon-cyan" />
                        <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase">Neural_Honors</h2>
                    </div>
                    <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Encryption Key Achievements & Operational Milestones</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-neon-cyan">{progressPercent}%</span>
                        <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Completion</span>
                    </div>
                    <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={PROGRESS_INITIAL}
                            animate={useMemo(() => ({ width: `${progressPercent}%` }), [progressPercent])}
                            transition={PROGRESS_TRANSITION}
                            className="h-full bg-neon-cyan shadow-neon-cyan"
                        />
                    </div>
                </div>
            </div>

            {/* Statistics Overlay */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat, i) => (
                    <div key={i} className="glass-card p-4 flex items-center gap-4 bg-white/2 border-white/5">
                        <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                            <stat.icon size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-black tracking-widest text-white/30">{stat.label}</span>
                            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {BADGES.map((badge) => (
                    <BadgeCard
                        key={badge.id}
                        badge={badge}
                        isUnlocked={unlockedIds.has(badge.id)}
                    />
                ))}
            </div>

        </div>
    );
};
