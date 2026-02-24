import { useState } from 'react';
import { useTypingStore, useProgressStore } from 'core';
import { LessonSelector } from './LessonSelector';
import { TypingArea } from './TypingArea';
import { SessionTemplateSelector } from '../session/SessionTemplateSelector';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';




const SELECTOR_INIT = { opacity: 0, x: -20 };
const SELECTOR_ANIM = { opacity: 1, x: 0 };
const SELECTOR_EXIT = { opacity: 0, x: -20 };
const ARENA_INIT = { opacity: 0, x: 20 };
const ARENA_ANIM = { opacity: 1, x: 0 };
const ARENA_EXIT = { opacity: 0, x: 20 };

export const TrainingPage = () => {
    const { wpm, accuracy, activeLessonId, setText } = useTypingStore();
    const level = useProgressStore(state => state.level);
    const [showTemplateSelector, setShowTemplateSelector] = useState(true);

    const handleBack = useCallback(() => {
        setText("", "practice", undefined); // Clear lesson to go back
    }, [setText]);

    const handleTemplateSelect = useCallback(() => {
        setShowTemplateSelector(false);
    }, []);

    const handleBackToTemplates = useCallback(() => {
        setShowTemplateSelector(true);
    }, []);

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
                {!activeLessonId ? (
                    <motion.div
                        key="selector"
                        initial={SELECTOR_INIT}
                        animate={SELECTOR_ANIM}
                        exit={SELECTOR_EXIT}
                        className="w-full h-full flex flex-col gap-6"
                    >
                        {/* Header Stats */}
                        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-4 shrink-0">
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                                    <span className="text-neon-cyan">Neural</span> Training
                                </h2>
                                <p className="text-xs font-mono text-neon-cyan/60 uppercase tracking-widest mt-1">
                                    Select protocol to initiate sync
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="glass-panel px-5 py-3 rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center min-w-[100px]">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Velocity</span>
                                    <span className="text-2xl font-black text-neon-cyan italic">{wpm} <span className="text-[10px] text-white/40 not-italic">WPM</span></span>
                                </div>
                                <div className="glass-panel px-5 py-3 rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center min-w-[100px]">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Precision</span>
                                    <span className="text-2xl font-black text-neon-purple italic">{accuracy}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Selector Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide w-full max-w-5xl mx-auto pb-10">
                            {showTemplateSelector ? (
                                <SessionTemplateSelector
                                    userLevel={level}
                                    onSelect={handleTemplateSelect}
                                />
                            ) : (
                                <>
                                    <button
                                        onClick={handleBackToTemplates}
                                        className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft size={14} /> Back to Protocols
                                    </button>
                                    <LessonSelector />
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="arena"
                        initial={ARENA_INIT}
                        animate={ARENA_ANIM}
                        exit={ARENA_EXIT}
                        className="w-full h-full flex flex-col"
                    >
                        {/* Active Session Header */}
                        <div className="w-full flex items-center justify-between py-2 px-4 shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <ArrowLeft size={14} />
                                </div>
                                Abort Protocol
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Live Feed</span>
                            </div>
                        </div>

                        {/* Typing Area - Full Height, No Outer Scroll */}
                        <div className="flex-1 w-full h-full flex flex-col justify-center min-h-0 pt-4">
                            <TypingArea />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

