import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, BarChart2, Award, Globe, Settings, Terminal, ChevronRight } from 'lucide-react';
import { LESSONS, useNavigationStore, useTypingStore, soundManager } from 'core';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

const FADE_INITIAL = { opacity: 0 };
const FADE_ANIMATE = { opacity: 1 };
const PALETTE_INITIAL = { opacity: 0, scale: 0.95, y: -20 };
const PALETTE_ANIMATE = { opacity: 1, scale: 1, y: 0 };
const PALETTE_EXIT = { opacity: 0, scale: 0.95, y: -20 };

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { setView } = useNavigationStore();
    const { setText } = useTypingStore();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);

    // Commands Registry
    const commands = useMemo(() => {
        const primaryNav = [
            { id: 'train', label: 'Protocol Library', icon: Terminal, action: () => setView('train'), category: 'Navigation' },
            { id: 'stats', label: 'Neural Analytics', icon: BarChart2, action: () => setView('stats'), category: 'Navigation' },
            { id: 'leaderboard', label: 'Global Grid', icon: Globe, action: () => setView('leaderboard'), category: 'Navigation' },
            { id: 'achievements', label: 'Qualification Records', icon: Award, action: () => setView('achievements'), category: 'Navigation' },
            { id: 'settings', label: 'System Configuration', icon: Settings, action: () => setView('settings'), category: 'Navigation' },
        ];

        const lessonResults = LESSONS.map(lesson => ({
            id: `lesson-${lesson.id}`,
            label: `Protocol: ${lesson.title}`,
            icon: Zap,
            category: 'Drills',
            action: () => {
                setText(lesson.text, lesson.type, lesson.id);
                setView('train');
            }
        }));

        const all = [...primaryNav, ...lessonResults];

        if (!query) return all;

        return all.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, setView, setText]);

    useEffect(() => {
        if (isOpen) {
            soundManager.playNavigation();
            setTimeout(() => {
                setSelectedIndex(0);
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % commands.length);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + commands.length) % commands.length);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            const selected = commands[selectedIndex];
            if (selected) {
                soundManager.playNavigation();
                selected.action();
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [commands, selectedIndex, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={FADE_INITIAL}
                        animate={FADE_ANIMATE}
                        exit={FADE_INITIAL}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Palette UI */}
                    <motion.div
                        initial={PALETTE_INITIAL}
                        animate={PALETTE_ANIMATE}
                        exit={PALETTE_EXIT}
                        className="relative w-full max-w-2xl bg-glass-heavy border border-white/10 rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        {/* Search Input Area */}
                        <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/2">
                            <Search className="text-neon-cyan" size={20} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={handleQueryChange}
                                onKeyDown={handleKeyDown}
                                placeholder="EXECUTE_COMMAND..."
                                className="bg-transparent border-none outline-none text-xl font-bold italic tracking-tight text-white w-full placeholder:text-white/10 placeholder:italic"
                            />
                            <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black text-white/40 tracking-[0.2em]">ESC_TO_EXIT</div>
                        </div>

                        {/* Results List */}
                        <div className="max-h-[450px] overflow-y-auto p-3 custom-scrollbar">
                            {commands.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    {commands.map((cmd, idx) => (
                                        <CommandItem
                                            key={cmd.id}
                                            command={cmd}
                                            index={idx}
                                            isSelected={idx === selectedIndex}
                                            onHover={setSelectedIndex}
                                            onClose={onClose}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-white/20 gap-4">
                                    <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                                        <Terminal size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">No matching protocols found.</span>
                                </div>
                            )}
                        </div>

                        {/* Footer Hints */}
                        <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5"><ChevronRight size={10} /> Navigate: ↑↓</span>
                                <span className="flex items-center gap-1.5"><ChevronRight size={10} /> Select: Enter</span>
                            </div>
                            <span className="text-neon-cyan opacity-40">DEEPEYE.ENGINE_OVERRIDE</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const CommandItem = React.memo(({
    command,
    isSelected,
    index,
    onHover,
    onClose
}: {
    command: { label: string, category: string, icon: React.ElementType, action: () => void },
    isSelected: boolean,
    index: number,
    onHover: (idx: number) => void,
    onClose: () => void
}) => {
    const Icon = command.icon;

    const handleHover = useCallback(() => onHover(index), [onHover, index]);
    const handleClick = useCallback(() => {
        command.action();
        onClose();
    }, [command, onClose]);

    return (
        <div
            onClick={handleClick}
            onMouseEnter={handleHover}
            className={`
                flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200
                ${isSelected ? 'bg-neon-cyan/10 border border-neon-cyan/20 translate-x-1' : 'bg-transparent border border-transparent'}
            `}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-white/20'}`}>
                    <Icon size={18} />
                </div>
                <div className="flex flex-col">
                    <span className={`font-bold transition-colors ${isSelected ? 'text-white' : 'text-white/40'}`}>{command.label}</span>
                    <span className={`text-[8px] uppercase tracking-widest font-black transition-colors ${isSelected ? 'text-neon-cyan/40' : 'text-white/10'}`}>
                        {command.category}
                    </span>
                </div>
            </div>

            {isSelected && (
                <motion.div layoutId="item-indicator" className="text-neon-cyan opacity-50">
                    <ChevronRight size={16} />
                </motion.div>
            )}
        </div>
    );
});
