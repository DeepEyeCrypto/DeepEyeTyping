import { useMemo } from 'react';
import { useLeaderboard, BADGE_STYLES, type BadgeTier } from 'core';
import type { LeaderboardEntry } from 'core';
import { Trophy, Globe, Zap, Target, Crown, Award, User as UserIcon, Diamond, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const CONTAINER_VARIANTS = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const ITEM_VARIANTS = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
};

// Emerald theme glow for top tiers
const getEmeraldGlow = (badge?: BadgeTier) => {
    if (badge === 'emerald' || badge === 'diamond') {
        return 'shadow-[0_0_30px_rgba(80,200,120,0.3)]';
    }
    return '';
};

const getBadgeIcon = (badge?: BadgeTier) => {
    switch (badge) {
        case 'diamond': return <Diamond size={14} />;
        case 'emerald': return <Gem size={14} />;
        default: return null;
    }
};

export const LeaderboardPage = () => {
    const { entries, loading } = useLeaderboard();

    const topThree = useMemo(() => entries.slice(0, 3), [entries]);
    const restOfEntries = useMemo(() => entries.slice(3), [entries]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
                <div className="w-12 h-12 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-black">Syncing Global Rankings...</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col gap-8 pb-10">
            {/* Header Telemetry */}
            <div className="flex justify-between items-end animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Globe size={18} className="text-neon-cyan" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-neon-cyan">Global Grid Protocol</span>
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white">Neural Standing</h2>
                </div>

                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-2 rounded-xl border-white/10 flex flex-col items-center">
                        <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Active Operatives</span>
                        <span className="text-xl font-mono font-bold text-white">{entries.length}</span>
                    </div>
                    <div className="glass-panel px-6 py-2 rounded-xl border-neon-purple/20 flex flex-col items-center bg-neon-purple/5">
                        <span className="text-[8px] text-neon-purple/60 uppercase font-black tracking-widest">Region</span>
                        <span className="text-xl font-mono font-bold text-neon-purple">Earth-01</span>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topThree.map((entry, idx) => (
                    <PodiumCard key={entry.id} entry={entry} rank={idx + 1} />
                ))}
            </div>

            {/* List Table */}
            <div className="glass-card p-0 border-white/5 bg-glass-heavy overflow-hidden">
                <div className="p-4 border-b border-white/5 grid grid-cols-12 text-[10px] font-black tracking-widest uppercase text-white/30 bg-white/2">
                    <div className="col-span-1 pl-4">Rank</div>
                    <div className="col-span-5">Operative Identity</div>
                    <div className="col-span-2 text-center">Velocity (WPM)</div>
                    <div className="col-span-2 text-center">Precision</div>
                    <div className="col-span-2 text-right pr-4">Last Sync</div>
                </div>
                <motion.div
                    variants={CONTAINER_VARIANTS}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col"
                >
                    {restOfEntries.map((entry) => (
                        <LeaderboardRow key={entry.id} entry={entry} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const PodiumCard = ({ entry, rank }: { entry: LeaderboardEntry, rank: number }) => {
    const isGold = rank === 1;
    const isSilver = rank === 2;
    const badge = entry.badge || 'bronze';
    const badgeStyle = BADGE_STYLES[badge];
    const isEmeraldOrAbove = badge === 'emerald' || badge === 'diamond';

    const badgeContainerStyle = useMemo(() => ({
        backgroundColor: badgeStyle.glow,
        color: badgeStyle.color,
        border: `1px solid ${badgeStyle.color}`
    }), [badgeStyle.glow, badgeStyle.color]);

    const borderStyle = useMemo(() => ({ borderColor: badgeStyle.color }), [badgeStyle.color]);
    const colorStyle = useMemo(() => ({ color: badgeStyle.color }), [badgeStyle.color]);

    return (
        <div className={`
            glass-card p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2
            ${isGold ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_50px_rgba(0,255,242,0.1)]' : 'border-white/10'}
            ${isEmeraldOrAbove ? 'shadow-[0_0_30px_rgba(80,200,120,0.2)]' : ''}
        `}>
            {/* Rank Badge */}
            <div className={`
                absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl
                ${isGold ? 'bg-neon-cyan text-black' : isSilver ? 'bg-white/20 text-white' : 'bg-orange-500/20 text-orange-400'}
            `}>
                #{rank}
            </div>

            {/* Badge Tier Indicator */}
            <div
                className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase"
                style={badgeContainerStyle}
            >
                {getBadgeIcon(badge)}
                {badgeStyle.label}
            </div>

            {/* Avatar */}
            <div className="relative mt-8">
                {entry.photoURL ? (
                    <img src={entry.photoURL} alt="" className="w-20 h-20 rounded-full border-2" style={borderStyle} />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border-2" style={borderStyle}>
                        <UserIcon size={32} className="text-white/20" />
                    </div>
                )}
                {isGold && (
                    <div className="absolute -top-4 -right-4 bg-neon-cyan text-black p-1.5 rounded-lg shadow-neon-cyan animate-bounce">
                        <Crown size={16} />
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-black text-xl text-white group-hover:text-neon-cyan transition-colors">{entry.displayName}</h4>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mt-1">Elite Operative</p>
            </div>

            <div className="flex gap-4 w-full mt-4">
                <div className="flex-1 p-3 bg-white/2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase font-black block mb-1">Velocity</span>
                    <div className="flex items-center justify-center gap-1 font-mono font-bold" style={colorStyle}>
                        <Zap size={10} />
                        {entry.wpm}
                    </div>
                </div>
                <div className="flex-1 p-3 bg-white/2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase font-black block mb-1">Precision</span>
                    <div className="flex items-center justify-center gap-1 text-neon-purple font-mono font-bold">
                        <Target size={10} />
                        {entry.accuracy}%
                    </div>
                </div>
            </div>

            {/* Decorative background icon */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:rotate-12 group-hover:scale-125 transition-all duration-700">
                {isGold ? <Trophy size={160} /> : <Award size={160} />}
            </div>
        </div>
    );
};

const LeaderboardRow = ({ entry }: { entry: LeaderboardEntry }) => {
    const badge = entry.badge || 'bronze';
    const badgeStyle = BADGE_STYLES[badge];
    const isEmeraldOrAbove = badge === 'emerald' || badge === 'diamond';

    const borderStyle = useMemo(() => ({ borderColor: badgeStyle.color }), [badgeStyle.color]);
    const colorStyle = useMemo(() => ({ color: badgeStyle.color }), [badgeStyle.color]);

    return (
        <motion.div
            variants={ITEM_VARIANTS}
            className={`px-4 py-4 border-b border-white/5 grid grid-cols-12 items-center hover:bg-white/5 transition-all group ${getEmeraldGlow(badge)}`}
        >
            <div className="col-span-1 pl-4 font-mono font-bold text-white/40 group-hover:text-neon-cyan">#{entry.rank}</div>
            <div className="col-span-4 flex items-center gap-3">
                {entry.photoURL ? (
                    <img src={entry.photoURL} alt="" className="w-8 h-8 rounded-full border" style={borderStyle} />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border" style={borderStyle}>
                        <UserIcon size={14} className="text-white/20" />
                    </div>
                )}
                <span className="font-bold text-white group-hover:translate-x-1 transition-transform">{entry.displayName}</span>
                {isEmeraldOrAbove && (
                    <span className="text-[10px]" style={colorStyle}>
                        {getBadgeIcon(badge)}
                    </span>
                )}
            </div>
            <div className="col-span-3 text-center font-mono font-bold" style={colorStyle}>{entry.wpm}</div>
            <div className="col-span-2 text-center font-mono font-bold text-neon-purple">{entry.accuracy}%</div>
            <div className="col-span-2 text-right pr-4 text-[10px] text-white/20 font-mono">
                {entry.timestamp?.seconds ? new Date(entry.timestamp.seconds * 1000).toLocaleDateString() : 'Awaiting...'}
            </div>
        </motion.div>
    );
};
