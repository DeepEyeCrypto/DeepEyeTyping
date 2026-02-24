// ============================================================
// FEEDBACK ANIMATIONS - DeepEyeTyping
// PERFORMANCE OPTIMIZED: Reduced GPU-heavy blur/boxShadow animations
// ============================================================

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface LevelUpProps {
    isVisible: boolean;
    newLevel: number;
    title: string;
    onComplete: () => void;
}

// PERFORMANCE FIX: Pre-calculate static styles outside component
const LEVEL_UP_STYLES = {
    container: "fixed inset-0 z-50 flex items-center justify-center bg-black/80",
    wrapper: "relative z-10 text-center",
    card: "relative bg-gradient-to-b from-black/80 to-black/40 border border-neon-cyan/50 rounded-3xl p-12 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,242,0.3)]",
    sparkles: "absolute -top-8 left-1/2 -translate-x-1/2",
    levelText: "text-[120px] font-black italic text-transparent bg-clip-text bg-gradient-to-b from-neon-cyan to-neon-purple leading-none",
    titleText: "text-3xl font-black italic text-white mt-2",
    xpText: "text-neon-cyan text-lg font-bold mt-4 tracking-widest"
};

const CONTAINER_INIT = { opacity: 0 };
const CONTAINER_ANIM = { opacity: 1 };
const CONTAINER_EXIT = { opacity: 0 };
const WRAPPER_INIT = { scale: 0, rotate: -180 };
const WRAPPER_ANIM = { scale: 1, rotate: 0 };
const WRAPPER_TRANS = { type: 'spring' as const, duration: 1 };
const SPARKLES_ANIM = { rotate: 360 };
const SPARKLES_TRANS = { duration: 20, repeat: Infinity, ease: 'linear' as const };
const BLUR_STYLE = { filter: 'blur(20px)' };

export function LevelUpAnimation({ isVisible, newLevel, title, onComplete }: LevelUpProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onComplete, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    // PERFORMANCE FIX: Use static shadow instead of animated boxShadow
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={CONTAINER_INIT}
                    animate={CONTAINER_ANIM}
                    exit={CONTAINER_EXIT}
                    className={LEVEL_UP_STYLES.container}
                >
                    <motion.div
                        initial={WRAPPER_INIT}
                        animate={WRAPPER_ANIM}
                        transition={WRAPPER_TRANS}
                        className={LEVEL_UP_STYLES.wrapper}
                    >
                        {/* PERFORMANCE FIX: Use CSS filter instead of blur-3xl - less GPU intensive */}
                        <div className="absolute inset-0 bg-neon-cyan/20 rounded-full scale-150" style={BLUR_STYLE} />
                        <div className={LEVEL_UP_STYLES.card}>
                            <motion.div
                                animate={SPARKLES_ANIM}
                                transition={SPARKLES_TRANS}
                                className={LEVEL_UP_STYLES.sparkles}
                            >
                                <Sparkles size={48} className="text-yellow-400" />
                            </motion.div>
                            <span className={LEVEL_UP_STYLES.levelText}>{newLevel}</span>
                            <p className={LEVEL_UP_STYLES.titleText}>{title.toUpperCase()}</p>
                            <p className={LEVEL_UP_STYLES.xpText}>LEVEL UP!</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface XpPopupProps {
    xp: number;
    isVisible: boolean;
}

const POPUP_INIT = { opacity: 0, y: 20, scale: 0.8 };
const POPUP_ANIM = { opacity: 1, y: 0, scale: 1 };
const POPUP_EXIT = { opacity: 0, y: -20, scale: 0.8 };

export function XpPopup({ xp, isVisible }: XpPopupProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div initial={POPUP_INIT} animate={POPUP_ANIM} exit={POPUP_EXIT} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="px-6 py-3 bg-black/80 border border-neon-cyan/50 rounded-xl backdrop-blur-md">
                        <span className="text-2xl font-black text-neon-cyan">+{xp} XP</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface BadgeUnlockProps {
    badge: { title: string; description: string; rarity: 'common' | 'rare' | 'epic' | 'legendary'; };
    isVisible: boolean;
    onComplete: () => void;
}

// PERFORMANCE FIX: Move rarityColors outside component
const rarityColors: Record<string, string> = { common: '#CD7F32', rare: '#C0C0C0', epic: '#9B59B6', legendary: '#FFD700' };

// PERFORMANCE FIX: Pre-calculate BadgeUnlock styles
const BADGE_UNLOCK_STYLES = {
    container: "fixed inset-0 z-50 flex items-center justify-center bg-black/60",
    wrapper: "relative",
    card: "relative bg-black/90 border-2 rounded-2xl p-8 min-w-[300px] text-center",
    iconContainer: "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center",
    rarityText: "text-xs font-bold uppercase tracking-widest mb-2",
    title: "text-2xl font-black text-white mb-2",
    description: "text-white/60 text-sm"
};

import { useMemo } from 'react';

const UNLOCK_WRAPPER_TRANS = { type: 'spring' as const, duration: 0.8 };

export function BadgeUnlock({ badge, isVisible, onComplete }: BadgeUnlockProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onComplete, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    const color = rarityColors[badge.rarity];

    const blurStyle = useMemo(() => ({ backgroundColor: `${color}30`, filter: 'blur(20px)' }), [color]);
    const borderStyle = useMemo(() => ({ borderColor: color }), [color]);
    const boxStyle = useMemo(() => ({ backgroundColor: `${color}20`, boxShadow: `0 0 25px ${color}60` }), [color]);
    const colorStyle = useMemo(() => ({ color }), [color]);

    // PERFORMANCE FIX: Use static CSS shadow instead of animated boxShadow
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div initial={CONTAINER_INIT} animate={CONTAINER_ANIM} exit={CONTAINER_EXIT} className={BADGE_UNLOCK_STYLES.container}>
                    <motion.div initial={WRAPPER_INIT} animate={WRAPPER_ANIM} transition={UNLOCK_WRAPPER_TRANS} className={BADGE_UNLOCK_STYLES.wrapper}>
                        {/* PERFORMANCE FIX: Use static filter instead of blur-xl - less GPU intensive */}
                        <div className="absolute inset-0 rounded-3xl" style={blurStyle} />
                        <div className={BADGE_UNLOCK_STYLES.card} style={borderStyle}>
                            {/* PERFORMANCE FIX: Use static shadow instead of animated */}
                            <div className={BADGE_UNLOCK_STYLES.iconContainer} style={boxStyle}>
                                <Trophy size={40} style={colorStyle} />
                            </div>
                            <p className={BADGE_UNLOCK_STYLES.rarityText} style={colorStyle}>{badge.rarity} Badge Unlocked!</p>
                            <h3 className={BADGE_UNLOCK_STYLES.title}>{badge.title}</h3>
                            <p className={BADGE_UNLOCK_STYLES.description}>{badge.description}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
