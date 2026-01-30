import { useState, useCallback, useMemo } from 'react';
import { LESSONS } from 'core';
import type { LessonConfig } from 'core';
import { Zap, Shield, Skull, ChevronRight, LayoutGrid } from 'lucide-react';
import { useTypingStore } from 'core';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_VARIANTS = {
    initial: { opacity: 0, scale: 0.9, x: 20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.9, x: -20 }
};

export const LessonSelector = () => {
    const { setText } = useTypingStore();
    const [activeTab, setActiveTab] = useState<'practice' | 'exam'>('practice');

    const handleSelect = useCallback((lesson: LessonConfig) => {
        setText(lesson.text, lesson.type, lesson.id);
    }, [setText]);

    const handleTabPractice = useCallback(() => setActiveTab('practice'), []);
    const handleTabExam = useCallback(() => setActiveTab('exam'), []);

    const filteredLessons = useMemo(() => LESSONS.filter(l => (l.type || 'practice') === activeTab), [activeTab]);

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutGrid size={18} className="text-neon-cyan" />
                    <h2 className="text-xl font-bold tracking-tight">Protocol Library</h2>
                </div>

                {/* Immersive Tab Controller */}
                <div className="flex p-1 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
                    <button
                        onClick={handleTabPractice}
                        className={`px-6 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'practice' ? 'bg-neon-cyan text-black shadow-neon-cyan' : 'text-white/40 hover:text-white'}`}
                    >
                        Training
                    </button>
                    <button
                        onClick={handleTabExam}
                        className={`px-6 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'exam' ? 'bg-neon-purple text-white shadow-neon-purple' : 'text-white/40 hover:text-white'}`}
                    >
                        Certifications
                    </button>
                </div>
            </div>

            {/* Scrollable Protocol Grid */}
            <div className="w-full relative">
                <div className="flex gap-5 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x">
                    <AnimatePresence mode="popLayout">
                        {filteredLessons.map((lesson) => (
                            <motion.div
                                key={lesson.id}
                                layout
                                variants={GRID_VARIANTS}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="snap-start"
                            >
                                <LessonCard lesson={lesson} onSelect={handleSelect} />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredLessons.length === 0 && (
                        <div className="min-h-[180px] flex items-center justify-center w-full text-white/20 text-xs italic border border-dashed border-white/5 rounded-2xl">
                            Awaiting clearance level synchronization...
                        </div>
                    )}
                </div>

                {/* Edge Fades */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-dark-bg/0 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-dark-bg to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

const LessonCard = ({ lesson, onSelect }: { lesson: LessonConfig, onSelect: (l: LessonConfig) => void }) => {
    const handleClick = useCallback(() => onSelect(lesson), [lesson, onSelect]);

    const isExam = lesson.type === 'exam';

    return (
        <button
            onClick={handleClick}
            className={`
                relative glass-card min-w-[260px] max-w-[260px] p-0 rounded-[28px] flex flex-col transition-all text-left group overflow-hidden border-white/5 hover:border-white/20
                ${isExam ? 'hover:shadow-[0_0_40px_rgba(188,19,254,0.1)]' : 'hover:shadow-[0_0_40px_rgba(0,255,242,0.1)]'}
            `}
        >
            <div className="p-6 h-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${isExam ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                        Phase {lesson.phase}
                    </div>
                    {lesson.strictMode && <Skull size={14} className="text-red-500 animate-pulse" />}
                </div>

                <h3 className="font-bold text-white text-lg leading-tight mt-1 group-hover:text-neon-cyan transition-colors">
                    {lesson.title}
                </h3>

                <p className="text-[10px] text-white/30 line-clamp-2 min-h-[30px]">
                    {lesson.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Reward</span>
                        <div className={`flex items-center gap-1 text-xs font-black ${isExam ? 'text-neon-purple' : 'text-neon-cyan'}`}>
                            {isExam ? <Shield size={10} /> : <Zap size={10} />}
                            {lesson.xpReward} XP
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isExam ? 'bg-neon-purple text-white shadow-neon-purple' : 'bg-neon-cyan text-black shadow-neon-cyan'}`}>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle background glow */}
            <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity ${isExam ? 'bg-neon-purple' : 'bg-neon-cyan'}`} />
        </button>
    );
};
