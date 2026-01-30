import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { useSettingsStore } from 'core';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
    children: ReactNode;
}

const DELAY_2S = { animationDelay: '2s' };
const AURA_ANIMATE = { opacity: [0, 0.15, 0] };
const AURA_TRANSITION = { duration: 3, repeat: Infinity, ease: "easeInOut" } as const;
const AURA_INITIAL = { opacity: 0 };
const AURA_EXIT = { opacity: 0 };

export const AppShell = ({ children }: AppShellProps) => {
    const { godMode } = useSettingsStore();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    const handlePaletteClose = useCallback(() => setIsPaletteOpen(false), []);
    const handlePaletteOpen = useCallback(() => setIsPaletteOpen(true), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-white relative selection:bg-neon-cyan/30 font-sans">
            <CommandPalette isOpen={isPaletteOpen} onClose={handlePaletteClose} />

            {/* Ambient Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-neon-purple/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-neon-cyan/5 rounded-full blur-[150px] animate-pulse" style={DELAY_2S} />

                {/* God Mode Aura */}
                <AnimatePresence>
                    {godMode && (
                        <motion.div
                            initial={AURA_INITIAL}
                            animate={AURA_ANIMATE}
                            exit={AURA_EXIT}
                            transition={AURA_TRANSITION}
                            className="absolute inset-0 border-[40px] border-red-500/20 blur-[100px] pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            </div>

            {/* Floating Dock (Left) */}
            <SideNav />

            {/* Main Window Surface */}
            <main className="flex-1 flex flex-col h-full relative z-10 p-4 lg:p-6 ml-20 lg:ml-24 overflow-hidden">
                <div className="flex-1 flex flex-col glass-heavy rounded-[32px] border border-white/5 overflow-hidden shadow-2xl relative">

                    {/* Interior Chrome */}
                    <TopBar onSearchClick={handlePaletteOpen} />

                    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-8">
                        <div className="max-w-6xl mx-auto h-full flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
