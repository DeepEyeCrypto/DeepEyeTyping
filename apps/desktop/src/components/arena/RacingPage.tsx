import { useEffect, useState, memo, useMemo, useRef, useCallback } from 'react';
import { useMultiplayerStore, useTypingStore, soundManager, rtdb, useAuthStore, QWERTY_LAYOUT } from 'core';
import { ref, update } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { RaceTrack } from './RaceTrack';
import { CheckCircle, Trophy, Zap } from 'lucide-react';
import { VirtualKeyboard } from '../typing/VirtualKeyboard';

// --- CONSTANTS & VARIANTS ---

const FADE_VARIANTS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const COUNTDOWN_TEXT_VARIANTS = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1.2, opacity: 1 },
    exit: { scale: 2, opacity: 0 }
};

const CURSOR_TRANSITION = { type: 'spring', stiffness: 500, damping: 35, mass: 0.8 } as const;
const FLOW_ANIMATION = { opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] };
const FLOW_TRANSITION = { duration: 1, repeat: Infinity };
const SPAN_STYLE = { transform: 'translateZ(0)' };
const CURSOR_STYLE = { willChange: 'transform, left, top', transform: 'translateZ(0)' };
const EMPTY_ANIMATION = {};

// --- SUB-COMPONENTS ---

const ArenaHUD = memo(() => {
    const { lobbyId, matchStatus } = useMultiplayerStore();
    const wpm = useTypingStore(state => state.wpm);

    return (
        <div className="flex justify-between items-center mb-6 w-full max-w-5xl">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,242,0.4)]">
                    <Zap size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Arena</span>
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter text-white">
                    LINK: <span className="text-neon-cyan">{lobbyId}</span>
                </h2>
            </div>
            <div className="flex gap-4 items-center">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{matchStatus} PHASE</span>
                    <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-mono font-bold text-neon-cyan shadow-[0_0_15px_rgba(0,255,242,0.1)]">
                        {wpm} <span className="text-[9px] opacity-40">WPM</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

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
        <span className={className} data-active={status === 'current'} style={SPAN_STYLE}>
            {status === 'incorrect' && expected !== ' ' ? expected : char}
        </span>
    );
});

const NeuralCursor = memo(({ cursorRect, isMistake, wpm }: { cursorRect: { x: number; y: number; width: number; height: number; }, isMistake: boolean, wpm: number }) => {
    const cursorAnimate = useMemo(() => ({
        x: cursorRect.x,
        y: cursorRect.y,
        width: cursorRect.width,
        height: cursorRect.height,
        backgroundColor: isMistake ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 255, 242, 0.2)',
        borderColor: isMistake ? 'rgba(239, 68, 68, 1)' : 'rgba(0, 255, 242, 1)',
    }), [cursorRect, isMistake]);

    return (
        <motion.div
            initial={false}
            animate={cursorAnimate}
            transition={CURSOR_TRANSITION}
            className="absolute z-0 rounded-lg border-2 shadow-[0_0_15px_rgba(0,255,242,0.3)] backdrop-blur-[2px] pointer-events-none"
            style={CURSOR_STYLE}
        >
            <motion.div
                animate={wpm > 80 ? FLOW_ANIMATION : EMPTY_ANIMATION}
                transition={FLOW_TRANSITION}
                className="absolute inset-0 bg-neon-cyan/10 rounded-lg"
            />
        </motion.div>
    );
});

// --- MAIN COMPONENT ---

export const RacingPage = () => {
    const { matchStatus, lobbyId, leaveLobby, isHost, getOpponents } = useMultiplayerStore();
    const { user } = useAuthStore();
    const {
        targetText,
        userInput,
        currentIndex,
        inputChar,
        backspace,
        wpm,
        accuracy,
        isFinished,
        reset,
        saveSession,
        errorCount,
        releaseChar
    } = useTypingStore();

    const [countdown, setCountdown] = useState<number | null>(null);
    const [isWinner, setIsWinner] = useState(false);
    const [pressedKey, setPressedKey] = useState<string | null>(null);
    const [cursorRect, setCursorRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [prevError, setPrevError] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const isMistake = errorCount > prevError;

    const handleRestart = useCallback(() => {
        if (lobbyId && rtdb) {
            update(ref(rtdb, `lobbies/${lobbyId}`), { status: 'WAITING' });
            reset();
        }
    }, [lobbyId, reset]);

    useEffect(() => {
        setPrevError(errorCount);
    }, [errorCount]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (matchStatus !== 'RACING' || isFinished) return;
            setPressedKey(e.code);
            if (e.key === 'Backspace') backspace();
            else if (e.key.length === 1) inputChar(e.key, Date.now());
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            setPressedKey(null);
            if (e.key.length === 1) releaseChar(e.key);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [inputChar, releaseChar, backspace, matchStatus, isFinished]);

    useEffect(() => {
        if (isFinished && matchStatus === 'RACING' && user) {
            const opponents = getOpponents(user.uid);
            const alreadyFinished = opponents.some(p => p.status === 'FINISHED');
            const winner = !alreadyFinished;
            setIsWinner(winner);
            saveSession({ isRace: true, isWinner: winner });
        }
    }, [isFinished, matchStatus, user, getOpponents, saveSession]);

    useEffect(() => {
        if (matchStatus === 'COUNTDOWN') {
            setTimeout(() => {
                setCountdown(3);
                soundManager.playNavigation();
            }, 0);
        }
    }, [matchStatus]);

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => (prev !== null && prev > 1 ? prev - 1 : 0));
                soundManager.playNavigation();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

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

    const activeKeyCode = useMemo(() => {
        const char = targetText[currentIndex];
        const config = QWERTY_LAYOUT.flat().find(k => char && (k.label.toLowerCase() === char.toLowerCase() || (char === ' ' && k.code === 'Space')));
        return config?.code || null;
    }, [targetText, currentIndex]);

    // Cleanup on unmount
    useEffect(() => () => { reset(); }, [reset]);

    return (
        <div className="w-full h-full flex flex-col items-center pt-8 px-8 relative overflow-hidden">

            <ArenaHUD />

            <div className="w-full max-w-5xl mb-8">
                <RaceTrack />
            </div>

            <div className="relative w-full max-w-4xl">
                {/* Background Atmosphere */}
                <div className="absolute inset-x-0 -inset-y-20 bg-gradient-to-b from-neon-cyan/5 to-transparent blur-[120px] pointer-events-none opacity-50" />

                <div
                    ref={containerRef}
                    className="w-full glass-card text-3xl font-mono leading-[1.8] p-12 min-h-[280px] flex flex-wrap content-start transition-all duration-500 border-none bg-white/2 relative rounded-[40px] shadow-2xl"
                >
                    <AnimatePresence>
                        {matchStatus === 'COUNTDOWN' && (
                            <motion.div
                                variants={FADE_VARIANTS}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[40px]"
                            >
                                <motion.div
                                    key={countdown}
                                    variants={COUNTDOWN_TEXT_VARIANTS}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="text-9xl font-black italic text-neon-cyan drop-shadow-[0_0_30px_rgba(0,255,242,0.8)]"
                                >
                                    {countdown}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isFinished && matchStatus === 'RACING' && <NeuralCursor cursorRect={cursorRect} isMistake={isMistake} wpm={wpm} />}

                    {targetText.split('').map((char, index) => {
                        let status: 'correct' | 'incorrect' | 'current' | 'pending' | 'buffer' = 'pending';
                        if (index < currentIndex) {
                            status = userInput[index] === char ? 'correct' : 'incorrect';
                        } else if (index === currentIndex) {
                            status = 'current';
                        }
                        return <Character key={index} char={char} status={status} expected={userInput[index]} />;
                    })}
                </div>

                <AnimatePresence>
                    {(isFinished || matchStatus === 'FINISHED') && (
                        <motion.div
                            variants={FADE_VARIANTS}
                            initial="initial"
                            animate="animate"
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-[40px]"
                        >
                            <div className="glass-card w-[90%] max-w-2xl p-0 border-white/20 bg-black/90 shadow-2xl overflow-hidden rounded-[32px]">
                                <div className={`p-10 border-b border-white/10 flex justify-between items-center ${isWinner ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : 'bg-white/5'}`}>
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${isWinner ? 'bg-yellow-500/20 border-yellow-500/50 shadow-yellow-500/20' : 'bg-neon-cyan/20 border-neon-cyan/50 shadow-neon-cyan'}`}>
                                            {isWinner ? <Trophy size={28} className="text-yellow-500 animate-bounce" /> : <CheckCircle size={28} className="text-neon-cyan" />}
                                        </div>
                                        <div>
                                            <h2 className={`text-3xl font-black italic tracking-tighter ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                                                {isWinner ? 'ARENA CHAMPION' : 'SEQUENCE COMPLETE'}
                                            </h2>
                                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em] mt-1 italic">Neural stream synchronized across the grid.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 grid grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-none mb-1">Final Bitrate</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-extrabold text-neon-cyan">{wpm}</span>
                                            <span className="text-xs font-bold text-white/20 uppercase">WPM</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-none mb-1">Signal Stability</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-extrabold text-neon-purple">{accuracy}%</span>
                                            <span className="text-xs font-bold text-white/20 uppercase">ACC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
                                    <button onClick={leaveLobby} className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-widest text-[10px] text-white">
                                        Return to HQ
                                    </button>
                                    {isHost && (
                                        <button
                                            onClick={handleRestart}
                                            className="flex-1 py-5 bg-neon-cyan text-black hover:bg-white rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] shadow-neon-cyan"
                                        >
                                            Restart Protocol
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={`w-full max-w-4xl px-4 mt-auto transition-opacity duration-500 mb-8 ${isFinished ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <VirtualKeyboard activeKey={activeKeyCode} pressedKey={pressedKey} />
            </div>
        </div>
    );
};
