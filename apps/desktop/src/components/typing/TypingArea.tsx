import { useEffect, useState, memo, useRef, useCallback, useMemo } from 'react';
import {
    useTypingStore,
    QWERTY_LAYOUT,
    useSettingsStore,
    TypingAnalytics,
    useProgressStore,
    useNavigationStore,
    LESSONS,
    useTypingAnalyzer
} from 'core';
import type { AdviceType } from 'core';
import { VirtualKeyboard } from './VirtualKeyboard';
import { AlertTriangle, Zap, Wind, Timer, Cpu, Activity as ActivityIcon, CheckCircle, RefreshCw, ChevronRight, Trophy, Flame, Target } from 'lucide-react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Memoized Character Component 
const Character = memo(({
    char,
    status,
    expected
}: {
    char: string,
    status: 'correct' | 'incorrect' | 'current' | 'pending' | 'buffer',
    expected?: string
}) => {
    let className = 'px-0.5 transition-all duration-150 relative inline-block ';

    if (status === 'correct') {
        className += 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,242,0.4)]';
    } else if (status === 'incorrect') {
        className += 'text-red-500 bg-red-500/10 rounded-sm scale-110';
    } else if (status === 'current') {
        className += 'text-white scale-125 mx-1.5';
    } else if (status === 'buffer') {
        className += 'text-white/40';
    } else {
        className += 'text-white/10';
    }

    return (
        <span id={`char-${char}-${status}`} className={className} data-active={status === 'current'}>
            {status === 'incorrect' && expected !== ' ' ? expected : char}
        </span>
    );
});

const COACH_VARIANTS = {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -10 }
};

const OVERLAY_VARIANTS = {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, backdropFilter: 'blur(20px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' }
};

const CARD_VARIANTS = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.4, ease: "backOut" } }
} as const;

const XP_WIDTH_TRANSITION = { duration: 1.5, ease: "circOut", delay: 0.2 } as const;
const INITIAL_OPACITY_0 = { width: '0%' };

const MISTAKE_ANIMATION = { opacity: [0, 0.1, 0] };
const CURSOR_TRANSITION_BASE = { type: 'spring', stiffness: 500, damping: 35, mass: 0.8 } as const;
const FLOW_ANIMATION = { opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] };
const FLOW_TRANSITION = { duration: 1, repeat: Infinity };
const MISTAKE_TRANSITION = { duration: 0.3 };
const EMPTY_OBJ = {};

const LiveWaveform = memo(({ wpm }: { wpm: number }) => {
    const [data, setData] = useState<{ v: number; id: number }[]>([]);

    useEffect(() => {
        Promise.resolve().then(() => {
            setData(prev => [...prev.slice(-19), { v: wpm, id: Date.now() }]);
        });
    }, [wpm]);

    return (
        <div className="h-12 w-32 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00fff2" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00fff2" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#00fff2"
                        strokeWidth={2}
                        fill="url(#waveGradient)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
});

export const TypingArea = () => {
    const {
        targetText,
        userInput,
        currentIndex,
        inputChar,
        backspace,
        sessionType,
        wpm,
        accuracy,
        errorCount,
        isFinished,
        consistency,
        keystrokes,
        activeLessonId,
        setText,
        reset
    } = useTypingStore();

    const { setView } = useNavigationStore();
    const { godMode } = useSettingsStore();
    const [pressedKey, setPressedKey] = useState<string | null>(null);
    const [cursorRect, setCursorRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const controls = useAnimation();
    const { level, xp } = useProgressStore();
    const advice = useTypingAnalyzer();
    const containerRef = useRef<HTMLDivElement>(null);
    const [errorSync, setErrorSync] = useState({ prev: errorCount, current: errorCount });

    if (errorSync.current !== errorCount) {
        setErrorSync({ prev: errorSync.current, current: errorCount });
    }

    const isMistake = errorSync.current > errorSync.prev;

    const cursorAnimation = useMemo(() => ({
        x: cursorRect.x,
        y: cursorRect.y,
        width: cursorRect.width,
        height: cursorRect.height,
        backgroundColor: isMistake ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 255, 242, 0.2)',
        borderColor: isMistake ? 'rgba(239, 68, 68, 1)' : 'rgba(0, 255, 242, 1)',
    }), [cursorRect, isMistake]);

    const xpWidthStyle = useMemo(() => ({ width: `${xp % 100}%` }), [xp]);

    const { activeKeyCode } = useMemo(() => {
        const char = targetText[currentIndex];
        const config = QWERTY_LAYOUT.flat().find(k => char && (k.label.toLowerCase() === char.toLowerCase() || (char === ' ' && k.code === 'Space')));
        return { activeKeyCode: config?.code || null };
    }, [targetText, currentIndex]);

    const shakeAnimation = useMemo(() => ({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.2 }
    }), []);

    useEffect(() => {
        if (godMode && isMistake) {
            controls.start(shakeAnimation);
        }
    }, [godMode, controls, shakeAnimation, isMistake]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFinished) return;
            setPressedKey(e.code);
            if (e.key === 'Backspace') backspace();
            else if (e.key.length === 1) inputChar(e.key);
        };
        const handleKeyUp = () => setPressedKey(null);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [inputChar, backspace, isFinished]);

    // Update Neural Cursor Position
    useEffect(() => {
        const updateCursor = () => {
            if (!containerRef.current) return;
            const activeNode = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
            if (activeNode) {
                setCursorRect({
                    x: activeNode.offsetLeft,
                    y: activeNode.offsetTop,
                    width: activeNode.offsetWidth,
                    height: activeNode.offsetHeight
                });
            }
        };

        updateCursor();
        window.addEventListener('resize', updateCursor);
        return () => window.removeEventListener('resize', updateCursor);
    }, [currentIndex, targetText]);

    const getAdviceIcon = (type: AdviceType) => {
        switch (type) {
            case 'RHYTHM_BREAK': return <Zap className="text-orange-400" size={16} />;
            case 'SPEED_TRAP': return <AlertTriangle className="text-red-400" size={16} />;
            case 'FLOW_STATE': return <Wind className="text-neon-cyan" size={16} />;
            case 'HESITATION': return <Timer className="text-yellow-400" size={16} />;
            default: return null;
        }
    };

    const handleNextLesson = useCallback(() => {
        if (!activeLessonId) {
            setView('dashboard');
            return;
        }

        const currentIndex = LESSONS.findIndex(l => l.id === activeLessonId);
        const nextLesson = LESSONS[currentIndex + 1];

        if (nextLesson) {
            setText(nextLesson.text, nextLesson.type, nextLesson.id);
        } else {
            setView('dashboard');
        }
    }, [activeLessonId, setText, setView]);

    const handleRetry = useCallback(() => {
        reset();
        if (activeLessonId) {
            const lesson = LESSONS.find(l => l.id === activeLessonId);
            if (lesson) setText(lesson.text, lesson.type, lesson.id);
        } else {
            setText(targetText, sessionType, activeLessonId || undefined);
        }
    }, [reset, activeLessonId, setText, targetText, sessionType]);

    const weakestKeys = useMemo(() => TypingAnalytics.getWeakestKeys(keystrokes), [keystrokes]);

    return (
        <motion.div animate={controls} className="flex flex-col items-center gap-12 w-full h-full pt-10 relative">

            {/* Neural Statistics HUD */}
            <div className="w-full max-w-4xl flex justify-between items-center px-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Bitrate</span>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-mono text-neon-cyan font-bold">{wpm} <span className="text-[10px] text-white/20">WPM</span></span>
                            <LiveWaveform wpm={wpm} />
                        </div>
                    </div>
                    <div className="flex flex-col border-l border-white/5 pl-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Signal</span>
                        <span className="text-xl font-mono text-neon-purple font-bold">{accuracy}% <span className="text-[10px] text-white/20">ACC</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border-neon-cyan/20">
                    <Cpu size={14} className="text-neon-cyan animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-neon-cyan uppercase font-bold">
                        {sessionType === 'exam' ? 'Protocol: Strict' : 'Protocol: Training'}
                    </span>
                </div>
            </div>

            {/* Dynamic AI Advisor */}
            <div className="h-10">
                <AnimatePresence mode="wait">
                    {advice && !isFinished && (
                        <motion.div
                            key={advice.type}
                            variants={COACH_VARIANTS}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="bg-black/60 backdrop-blur-xl border border-white/5 px-6 py-2 rounded-full flex items-center gap-4 shadow-2xl"
                        >
                            {getAdviceIcon(advice.type)}
                            <span className="text-xs font-bold text-white/90 font-mono tracking-widest uppercase italic">
                                {advice.message}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Neural Buffer (Typing Field) */}
            <div className="relative w-full max-w-4xl">
                {/* Immersion Background Glow */}
                <div className="absolute inset-x-0 -inset-y-20 bg-gradient-to-b from-neon-cyan/5 to-transparent blur-[120px] pointer-events-none opacity-50" />

                <div
                    ref={containerRef}
                    className={`
                        w-full glass-card text-4xl font-mono leading-[1.8] p-12 min-h-[280px] 
                        flex flex-wrap content-start transition-all duration-500 border-none
                        bg-white/2 relative rounded-[40px]
                        ${sessionType === 'exam' ? 'shadow-[0_0_50px_rgba(255,0,0,0.1)]' : 'shadow-2xl'}
                    `}
                >
                    {/* Neural Cursor Overlay */}
                    <AnimatePresence>
                        {!isFinished && (
                            <motion.div
                                initial={false}
                                animate={cursorAnimation}
                                transition={CURSOR_TRANSITION_BASE}
                                className="absolute z-0 rounded-lg border-2 shadow-[0_0_15px_rgba(0,255,242,0.3)] backdrop-blur-[2px] pointer-events-none"
                            >
                                <motion.div
                                    animate={wpm > 80 ? FLOW_ANIMATION : EMPTY_OBJ}
                                    transition={FLOW_TRANSITION}
                                    className="absolute inset-0 bg-neon-cyan/10 rounded-lg"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {targetText.split('').map((char, index) => {
                        let status: 'correct' | 'incorrect' | 'current' | 'pending' | 'buffer' = 'pending';
                        if (index < currentIndex) {
                            status = userInput[index] === char ? 'correct' : 'incorrect';
                        } else if (index === currentIndex) {
                            status = 'current';
                        } else if (index > currentIndex && index < currentIndex + 10) {
                            status = 'buffer';
                        }

                        return (
                            <Character
                                key={index}
                                char={char}
                                status={status}
                                expected={userInput[index]}
                            />
                        );
                    })}
                </div>

                {/* Mistake Flare Overlay */}
                <AnimatePresence>
                    {godMode && errorCount > 0 && !isFinished && (
                        <motion.div
                            initial={INITIAL_OPACITY_0}
                            animate={MISTAKE_ANIMATION}
                            transition={MISTAKE_TRANSITION}
                            className="absolute inset-0 bg-red-500 rounded-[40px] pointer-events-none z-10"
                        />
                    )}
                </AnimatePresence>

                {/* Results Overlay */}
                <AnimatePresence>
                    {isFinished && (
                        <motion.div
                            variants={OVERLAY_VARIANTS}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-[40px] overflow-hidden"
                        >
                            <motion.div
                                variants={CARD_VARIANTS}
                                className="glass-card w-[90%] max-w-2xl p-0 border-white/20 bg-black/80 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
                            >
                                {/* Results Header */}
                                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/50 shadow-neon-cyan">
                                            <CheckCircle size={24} className="text-neon-cyan" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black italic tracking-tighter">PROTOCOL_COMPLETE</h3>
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">Neural stream synchronized successfully</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[8px] text-white/30 uppercase font-black mb-1">Clearance</span>
                                        <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono text-neon-cyan font-bold">LVL {level}</div>
                                    </div>
                                </div>

                                {/* Body Stats */}
                                <div className="p-8 grid grid-cols-3 gap-8">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Flame size={12} className="text-neon-cyan" />
                                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest block">Final Velocity</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-extrabold text-neon-cyan">{wpm}</span>
                                            <span className="text-xs font-bold text-white/20 uppercase">WPM</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Target size={12} className="text-neon-purple" />
                                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest block">Signal Stability</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-extrabold text-neon-purple">{accuracy}%</span>
                                            <span className="text-xs font-bold text-white/20 uppercase">ACC</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Trophy size={12} className="text-white" />
                                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest block">Rhythm Sync</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-extrabold text-white">{Math.round((1 - consistency) * 100)}</span>
                                            <span className="text-xs font-bold text-white/20 uppercase">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Telemetry (Weakest Keys & Gained XP) */}
                                <div className="px-8 pb-8 flex justify-between items-end gap-12">
                                    <div className="flex-1 p-4 bg-white/2 rounded-2xl border border-white/5">
                                        <span className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-3 block">Weakest Neural Fragments</span>
                                        <div className="flex gap-2">
                                            {weakestKeys.length > 0 ? weakestKeys.map((key: string) => (
                                                <div key={key} className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-mono text-sm font-bold uppercase transition-all hover:scale-110 active:scale-95 shadow-red-500/10">
                                                    {key === ' ' ? '␣' : key}
                                                </div>
                                            )) : (
                                                <span className="text-[10px] text-white/20 italic">No anomalies detected.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] text-neon-cyan uppercase font-black tracking-widest">Experience Gain</span>
                                            <span className="text-xs font-mono text-white/60">+{xp % 100}/100 XP</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                            <motion.div
                                                initial={INITIAL_OPACITY_0}
                                                animate={xpWidthStyle}
                                                transition={XP_WIDTH_TRANSITION}
                                                className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-[0_0_10px_rgba(0,255,242,0.5)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="p-4 bg-white/5 border-t border-white/10 flex gap-4 text-white">
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all group font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        <RefreshCw size={14} className="text-white/40 group-hover:rotate-180 transition-transform duration-500" />
                                        Initialize Retrial
                                    </button>
                                    <button
                                        onClick={handleNextLesson}
                                        className="flex-[2] py-4 bg-neon-cyan text-black hover:bg-white rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] shadow-neon-cyan"
                                    >
                                        Proceed to Next Sync
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 opacity-20 pointer-events-none">
                    <ActivityIcon size={96} />
                </div>
            </div>

            {/* Specialized Input Surface (Keyboard) */}
            <div className={`w-full max-w-4xl px-4 mt-auto transition-opacity duration-500 ${isFinished ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <VirtualKeyboard activeKey={activeKeyCode} pressedKey={pressedKey} />
            </div>

        </motion.div >
    );
};
