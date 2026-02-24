import { type ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface AppShellProps {
    children: ReactNode;
}

const MENU_INIT = { x: -300, opacity: 0 };
const MENU_ANIM = { x: 0, opacity: 1 };
const MENU_EXIT = { x: -300, opacity: 0 };
const MENU_TRANS = { type: 'spring' as const, damping: 25, stiffness: 200 };

const AppShellComponent = ({ children }: AppShellProps) => {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const handlePaletteClose = useCallback(() => setIsPaletteOpen(false), []);
    const handlePaletteOpen = useCallback(() => setIsPaletteOpen(true), []);

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

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
        <div className="flex h-screen w-screen overflow-hidden bg-black text-white relative selection:bg-neon-cyan/50 font-mono">
            <CommandPalette isOpen={isPaletteOpen} onClose={handlePaletteClose} />

            {/* Ambient Background Layer - Cyberpunk Gradients */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
                {/* Floating Neon Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neon-cyan/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-neon-purple/5 rounded-full blur-[100px]" />
            </div>

            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/10 text-white hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobile && isMobileMenuOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        initial={MENU_INIT}
                        animate={MENU_ANIM}
                        exit={MENU_EXIT}
                        transition={MENU_TRANS}
                        className="fixed left-0 top-0 h-full z-40 w-64 pt-16"
                    >
                        <SideNav className="h-full glass-modern w-full flex flex-col items-center py-6 gap-6" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="z-20 my-4 ml-4 hidden md:block">
                    <SideNav className="h-full glass-modern w-20 flex flex-col items-center py-6 gap-6" />
                </div>
            )}

            {/* Main Window Surface */}
            <main className={`flex-1 flex flex-col h-full relative z-10 p-2 md:p-4 overflow-hidden transition-all ${isMobile ? 'pl-12' : ''}`}>
                <div className="flex-1 flex flex-col glass-modern overflow-hidden relative border border-white/5 bg-black/40 shadow-2xl backdrop-blur-3xl">

                    {/* Interior Chrome */}
                    <TopBar onSearchClick={handlePaletteOpen} className="border-b border-white/5 bg-white/2" />

                    <div className="flex-1 overflow-y-auto scrollbar-hide p-3 md:p-6 lg:p-10">
                        <div className="max-w-7xl mx-auto min-h-full flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export const AppShell = AppShellComponent;
