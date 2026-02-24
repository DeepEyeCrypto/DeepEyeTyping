import { useEffect, useState, memo, useRef, useCallback, useMemo } from 'react';
import {
    useTypingStore,
    useProgressStore
} from 'core';
import { VirtualKeyboard } from './VirtualKeyboard';
import { AlertTriangle, CheckCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { LevelUpAnimation, XpPopup, BadgeUnlock } from '../session/FeedbackAnimations';

// --- CONSTANTS & VARIANTS ---



const FADE_VARIANTS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
};

const CURSOR_TRANSITION_BASE = { type: 'spring', stiffness: 500, damping: 35, mass: 0.8 } as const;


// --- SUB-COMPONENTS ---

const Character = memo(({
    char,
    status,
    expected
}: {
    char: string,
    status: 'correct' | 'incorrect' | 'current' | 'pending' | 'buffer',
    expected?: string
}) => {
    let className = 'transition-all duration-150 relative inline-block font-medium ';

    if (status === 'correct') {
        className += 'text-text-main'; // Dark grey for correct
    } else if (status === 'incorrect') {
        className += 'text-red-500 bg-red-100 rounded-sm';
    } else if (status === 'current') {
        className += 'text-white z-10';
    } else if (status === 'buffer') {
        className += 'text-text-sub/60';
    } else {
        className += 'text-text-sub/30';
    }

    return (
        <span
            className={className}
            data-active={status === 'current'}
        >
            {status === 'incorrect' && expected !== ' ' ? expected : char}
        </span>
    );
});
Character.displayName = 'Character';

const CURSOR_STYLE = { willChange: 'transform, left, top', transform: 'translateZ(0)' };

// Memoized cursor component - only re-renders when cursor position actually changes
const NeuralCursor = memo(({ cursorRect, isMistake }: { cursorRect: { x: number, y: number, width: number, height: number }, isMistake: boolean }) => {
    const cursorAnimation = useMemo(() => ({
        x: cursorRect.x,
        y: cursorRect.y,
        width: cursorRect.width,
        height: cursorRect.height,
        backgroundColor: isMistake ? 'rgba(239, 68, 68, 0.2)' : 'rgba(204, 224, 255, 0.5)',
        borderColor: isMistake ? 'rgba(239, 68, 68, 0.8)' : 'rgba(51, 102, 255, 0.5)',
    }), [cursorRect.x, cursorRect.y, cursorRect.width, cursorRect.height, isMistake]);

    return (
        <motion.div
            initial={false}
            animate={cursorAnimation}
            transition={CURSOR_TRANSITION_BASE}
            className="absolute top-0 left-0 z-0 rounded-lg border-2 backdrop-blur-[1px] pointer-events-none"
            style={CURSOR_STYLE}
        />
    );
});
NeuralCursor.displayName = 'NeuralCursor';

// Stubs for missing components
const NeuralHUD = () => <div className="text-white/50 text-xs hidden">Neural HUD Active</div>;
const AdviceAdvisor = () => <div className="text-white/50 text-xs hidden">AI Advisor Standby</div>;

export const TypingArea = () => {
    // PERFORMANCE FIX: Use individual selectors instead of subscribing to entire store
    const targetText = useTypingStore(state => state.targetText);
    const userInput = useTypingStore(state => state.userInput);
    const currentIndex = useTypingStore(state => state.currentIndex);
    const wpm = useTypingStore(state => state.wpm);
    const accuracy = useTypingStore(state => state.accuracy);
    const consistency = useTypingStore(state => state.consistency);
    const status = useTypingStore(state => state.status);
    const isFinished = useTypingStore(state => state.isFinished);
    const inputChar = useTypingStore(state => state.inputChar);
    const backspace = useTypingStore(state => state.backspace);
    const reset = useTypingStore(state => state.reset);

    // Progress store for gamification
    const progressStore = useProgressStore();
    const prevLevel = useRef(progressStore.level);

    // Feedback animation states
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showXpPopup, setShowXpPopup] = useState(false);
    const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
    const [newLevel, setNewLevel] = useState(1);
    const [earnedXp, setEarnedXp] = useState(0);
    const [unlockedBadge, setUnlockedBadge] = useState<{ title: string; description: string; rarity: 'common' | 'rare' | 'epic' | 'legendary' } | null>(null);

    // Check for level up and badge unlocks when session finishes
    useEffect(() => {
        if (isFinished && status === 'finished') {
            const currentLevel = progressStore.level;

            setTimeout(() => {
                // Check for level up
                if (currentLevel > prevLevel.current) {
                    setNewLevel(currentLevel);
                    setShowLevelUp(true);
                }

                // Show XP popup
                setEarnedXp(50); // Base XP display
                setShowXpPopup(true);

                // Hide XP popup after animation
                setTimeout(() => setShowXpPopup(false), 2000);
            }, 0);

            // Update previous level ref
            prevLevel.current = currentLevel;
        }
    }, [isFinished, status, progressStore.level]);

    const handleLevelUpComplete = useCallback(() => {
        setShowLevelUp(false);
    }, []);

    const handleBadgeComplete = useCallback(() => {
        setShowBadgeUnlock(false);
        setUnlockedBadge(null);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const [cursorRect, setCursorRect] = useState({ x: 0, y: 0, width: 2, height: 20 });

    // Memoize the mistake calculation
    const isMistake = useMemo(() =>
        userInput.length > 0 && userInput[currentIndex - 1] !== targetText[currentIndex - 1],
        [userInput, currentIndex, targetText]
    );

    // PERFORMANCE FIX: Memoize callback references to prevent useEffect re-subscriptions
    const handleBackspace = useCallback(() => backspace(), [backspace]);
    const handleInput = useCallback((char: string) => inputChar(char), [inputChar]);

    // PERFORMANCE FIX: Stable event handler - doesn't re-bind on every render
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFinished) return;

            if (e.key === 'Backspace') {
                handleBackspace();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                handleInput(e.key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFinished, handleBackspace, handleInput]);

    // Update Cursor Position - only when currentIndex changes
    useEffect(() => {
        if (containerRef.current) {
            const activeChar = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
            if (activeChar) {
                setCursorRect({
                    x: activeChar.offsetLeft,
                    y: activeChar.offsetTop,
                    width: activeChar.offsetWidth,
                    height: activeChar.offsetHeight
                });
            } else if (currentIndex === 0 && containerRef.current.firstElementChild) {
                const firstChar = containerRef.current.firstElementChild as HTMLElement;
                if (firstChar && firstChar.offsetLeft !== undefined) {
                    setCursorRect({
                        x: firstChar.offsetLeft,
                        y: firstChar.offsetTop,
                        width: firstChar.offsetWidth,
                        height: firstChar.offsetHeight
                    });
                }
            }
        }
    }, [currentIndex]);

    // PERFORMANCE FIX: Memoize text splitting to avoid recreating array on every render
    const textCharacters = useMemo(() => targetText.split(''), [targetText]);

    // PERFORMANCE FIX: Pre-calculate character statuses
    const characterStatuses = useMemo(() => {
        return textCharacters.map((char, index) => {
            let charStatus: 'correct' | 'incorrect' | 'current' | 'pending' | 'buffer' = 'pending';
            if (index < currentIndex) {
                charStatus = userInput[index] === char ? 'correct' : 'incorrect';
            } else if (index === currentIndex) {
                charStatus = 'current';
            } else if (index > currentIndex && index < currentIndex + 10) {
                charStatus = 'buffer';
            }
            return { char, charStatus, expected: userInput[index] };
        });
    }, [textCharacters, currentIndex, userInput]);

    // Group characters into words to prevent mid-word wrapping while keeping inline-block metrics
    const words = useMemo(() => {
        const w: (typeof characterStatuses[0] & { index: number })[][] = [];
        let current: (typeof characterStatuses[0] & { index: number })[] = [];

        characterStatuses.forEach((item, i) => {
            current.push({ ...item, index: i });
            if (item.char === ' ' || item.char === '\n') {
                w.push(current);
                current = [];
            }
        });
        if (current.length > 0) w.push(current);
        return w;
    }, [characterStatuses]);

    // Memoize keyboard props
    const activeKey = useMemo(() => targetText[currentIndex]?.toLowerCase(), [targetText, currentIndex]);
    const pressedKey = useMemo(() => userInput[currentIndex - 1]?.toLowerCase(), [userInput, currentIndex]);

    const handleRetry = useCallback(() => reset(), [reset]);
    const handleNextLesson = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <motion.div id="neural-typing-arena" animate={controls} className="flex flex-col items-center gap-4 w-full h-full relative">

            {/* Feedback Animations */}
            <LevelUpAnimation
                isVisible={showLevelUp}
                newLevel={newLevel}
                title="Level Up!"
                onComplete={handleLevelUpComplete}
            />
            <XpPopup xp={earnedXp} isVisible={showXpPopup} />
            {unlockedBadge && (
                <BadgeUnlock
                    badge={unlockedBadge}
                    isVisible={showBadgeUnlock}
                    onComplete={handleBadgeComplete}
                />
            )}

            <NeuralHUD />
            <AdviceAdvisor />

            <div className="flex-1 w-full max-w-5xl px-4 md:px-0 flex flex-col justify-center min-h-0">
                <div
                    ref={containerRef}
                    className="w-full h-full max-h-[35vh] md:max-h-[40vh] glass-modern text-lg sm:text-2xl md:text-3xl lg:text-4xl font-mono leading-[1.6] p-4 md:p-8 block text-left tracking-wide transition-all duration-500 relative overflow-hidden break-words whitespace-pre-wrap overflow-y-auto scrollbar-hide"
                >
                    {!isFinished && <NeuralCursor cursorRect={cursorRect} isMistake={isMistake} />}

                    {words.map((word, wIdx) => (
                        <span key={wIdx} className="inline-block whitespace-nowrap">
                            {word.map((item) => (
                                <Character
                                    key={item.index}
                                    char={item.char}
                                    status={item.charStatus}
                                    expected={item.expected}
                                />
                            ))}
                        </span>
                    ))}
                </div>
            </div>

            <div className="shrink-0 w-full pb-2">
                <VirtualKeyboard
                    activeKey={activeKey}
                    pressedKey={pressedKey}
                />
            </div>

            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        variants={FADE_VARIANTS}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-[30px] backdrop-blur-md p-4"
                    >
                        {/* Result Modal Content - Keep same */}
                        <div className="glass-modern w-full max-w-2xl p-0 shadow-2xl overflow-hidden bg-black/80 border border-white/10">
                            <div className={`p-8 border-b border-white/10 flex justify-between items-center ${status === 'failed' ? 'bg-red-500/10' : 'bg-neon-cyan/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 shadow-sm border border-white/20">
                                        {status === 'failed' ? <AlertTriangle size={24} className="text-red-500" /> : <CheckCircle size={24} className="text-neon-cyan" />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                                            {status === 'failed' ? 'Session Failed' : 'Session Complete'}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-3 gap-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">WPM</span>
                                    <span className="text-4xl font-black text-white">{wpm}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">ACC</span>
                                    <span className="text-4xl font-black text-white">{accuracy}%</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">SYNC</span>
                                    <span className="text-4xl font-black text-white">{Math.round((1 - consistency) * 100)}%</span>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
                                <button onClick={handleRetry} className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-white transition-all">
                                    <RefreshCw size={14} className="inline mr-2" /> Retry
                                </button>
                                <button onClick={handleNextLesson} className="flex-[2] py-3 rounded-xl bg-neon-cyan text-black border border-neon-cyan hover:bg-white hover:text-black hover:border-white text-xs font-black uppercase tracking-widest transition-all">
                                    Next Lesson <ChevronRight size={14} className="inline ml-2" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
