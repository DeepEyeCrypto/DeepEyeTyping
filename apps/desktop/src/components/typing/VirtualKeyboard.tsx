import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QWERTY_LAYOUT } from 'core';
import type { KeyConfig, FingerMapping } from 'core';

interface VirtualKeyboardProps {
    activeKey: string | null; // The key code expected next
    pressedKey: string | null; // The key actually being pressed by user
    heatMap?: Record<string, number>; // Performance heatmap
}

const FINGER_COLORS: Record<FingerMapping, string> = {
    'L_PINKY': 'rgba(255, 0, 153, 0.4)',  // Magenta
    'L_RING': 'rgba(255, 102, 0, 0.4)',   // Orange
    'L_MIDDLE': 'rgba(255, 255, 0, 0.4)', // Yellow
    'L_INDEX': 'rgba(0, 255, 0, 0.4)',    // Green
    'L_THUMB': 'rgba(0, 255, 255, 0.4)',  // Cyan
    'R_THUMB': 'rgba(0, 255, 255, 0.4)',  // Cyan
    'R_INDEX': 'rgba(0, 51, 255, 0.4)',   // Blue
    'R_MIDDLE': 'rgba(153, 0, 255, 0.4)', // Purple
    'R_RING': 'rgba(255, 0, 255, 0.4)',   // Pink
    'R_PINKY': 'rgba(255, 255, 255, 0.4)' // White/Silver
};

const KEY_VARIANTS = {
    active: { y: -5, scale: 1.05, transition: { type: 'spring' as const, stiffness: 400, damping: 10 } },
    pressed: { y: 2, scale: 0.95, transition: { duration: 0.05 } },
    idle: { y: 0, scale: 1 }
};

const OPACITY_ANIMATE = { opacity: [0.2, 0.4, 0.2] };
const RIPPLE_INITIAL = { scale: 0, opacity: 1 };
const RIPPLE_ANIMATE = { scale: 2, opacity: 0 };
const FADE_INITIAL = { opacity: 0 };
const FADE_ANIMATE = { opacity: 1 };
const FADE_EXIT = { opacity: 0 };
const GLOW_TRANSITION = { duration: 1.5, repeat: Infinity };

const Key = React.memo(({ k, isActive, isPressed, heatValue }: { k: KeyConfig, isActive: boolean, isPressed: boolean, heatValue: number }) => {
    const fingerColor = FINGER_COLORS[k.finger];

    const style = useMemo(() => ({
        width: `${(k.width || 1) * 3.2}rem`,
        height: '3.2rem',
        backgroundColor: heatValue > 0 ? `rgba(239, 68, 68, ${Math.min(0.6, heatValue * 0.4)})` : undefined,
        borderColor: heatValue > 0 ? `rgba(239, 68, 68, ${Math.min(1, heatValue)})` : undefined,
    }), [k.width, heatValue]);

    const indicatorStyle = useMemo(() => ({ backgroundColor: fingerColor, boxShadow: `0 0 8px ${fingerColor}` }), [fingerColor]);
    const targetGlowStyle = useMemo(() => ({
        boxShadow: `inset 0 0 15px ${fingerColor}`,
        border: `1px solid ${fingerColor}`
    }), [fingerColor]);
    const targetBarStyle = useMemo(() => ({ backgroundColor: fingerColor }), [fingerColor]);

    return (
        <motion.div
            layout
            variants={KEY_VARIANTS}
            animate={isPressed ? 'pressed' : isActive ? 'active' : 'idle'}
            className={`
                relative flex items-center justify-center rounded-xl border transition-all duration-150 backdrop-blur-sm
                ${isPressed
                    ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_30px_rgba(0,255,242,0.6)]'
                    : isActive
                        ? 'bg-white/10 border-white/40 shadow-xl'
                        : 'bg-white/2 border-white/5 text-white/30'
                }
            `}
            style={style}
        >
            <span className={`font-mono text-[11px] font-black tracking-widest ${isActive || isPressed ? 'text-white' : ''}`}>
                {k.label}
            </span>

            {/* Finger Indicator Dot */}
            <div
                className="absolute bottom-1.5 w-1 h-1 rounded-full opacity-60"
                style={indicatorStyle}
            />

            {/* Target Glow */}
            <AnimatePresence>
                {isActive && !isPressed && (
                    <motion.div
                        initial={FADE_INITIAL}
                        animate={FADE_ANIMATE}
                        exit={FADE_EXIT}
                        className="absolute inset-0 rounded-xl"
                        style={targetGlowStyle}
                    >
                        <motion.div
                            animate={OPACITY_ANIMATE}
                            transition={GLOW_TRANSITION}
                            className="absolute inset-x-0 -bottom-2 h-0.5 bg-current"
                            style={targetBarStyle}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pressed Ripple */}
            {isPressed && (
                <motion.div
                    initial={RIPPLE_INITIAL}
                    animate={RIPPLE_ANIMATE}
                    className="absolute inset-0 bg-white/40 rounded-xl pointer-events-none"
                />
            )}
        </motion.div>
    );
});

export const VirtualKeyboard = ({ activeKey, pressedKey, heatMap = {} }: VirtualKeyboardProps) => {
    return (
        <div className="flex flex-col gap-3 p-8 rounded-[40px] bg-black/40 backdrop-blur-3xl border border-white/5 w-full max-w-5xl mx-auto shadow-2xl relative">
            {/* Ambient Background Light */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full h-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

            {/* Grid Rendering */}
            {QWERTY_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-3 justify-center">
                    {row.map((key) => (
                        <Key
                            key={key.code}
                            k={key}
                            isActive={activeKey === key.code}
                            isPressed={pressedKey === key.code}
                            heatValue={heatMap[key.label.toLowerCase()] || 0}
                        />
                    ))}
                </div>
            ))}

            {/* Finger Guide Legend */}
            <div className="mt-8 flex justify-center gap-8 border-t border-white/5 pt-6 opacity-40">
                <div className="flex items-center gap-6">
                    <LegendItem label="Pinky" color={FINGER_COLORS.L_PINKY} />
                    <LegendItem label="Ring" color={FINGER_COLORS.L_RING} />
                    <LegendItem label="Middle" color={FINGER_COLORS.L_MIDDLE} />
                    <LegendItem label="Index" color={FINGER_COLORS.L_INDEX} />
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-6">
                    <LegendItem label="Index" color={FINGER_COLORS.R_INDEX} />
                    <LegendItem label="Middle" color={FINGER_COLORS.R_MIDDLE} />
                    <LegendItem label="Ring" color={FINGER_COLORS.R_RING} />
                    <LegendItem label="Pinky" color={FINGER_COLORS.R_PINKY} />
                </div>
            </div>

            <div className="absolute bottom-4 right-8">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10">Neural Input Surface v2</span>
            </div>
        </div>
    );
};

const LegendItem = ({ label, color }: { label: string, color: string }) => {
    const style = useMemo(() => ({ backgroundColor: color, boxShadow: `0 0 5px ${color}` }), [color]);
    return (
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={style} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{label}</span>
        </div>
    );
};
