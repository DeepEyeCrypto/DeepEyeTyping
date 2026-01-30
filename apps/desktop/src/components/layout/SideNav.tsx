import React, { useEffect, useCallback, memo } from 'react';
import { Home, Keyboard, BarChart2, Settings, Trophy, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore, useNavigationStore, soundManager } from 'core';

const navItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Keyboard, label: 'Train', id: 'train' },
    { icon: BarChart2, label: 'Stats', id: 'stats' },
    { icon: Trophy, label: 'Honors', id: 'achievements' },
    { icon: Globe, label: 'Ranking', id: 'leaderboard' },
    { icon: Settings, label: 'Settings', id: 'settings' },
] as const;

type NavItemId = typeof navItems[number]['id'];

const SIDEBAR_VARIANTS = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
};

const NavButton = memo(({ item, isActive, onClick }: {
    item: { icon: React.ElementType, label: string, id: NavItemId },
    isActive: boolean,
    onClick: (id: NavItemId) => void
}) => {
    const handleClick = useCallback(() => onClick(item.id), [item.id, onClick]);

    return (
        <button
            onClick={handleClick}
            className={`
                relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group
                hover:bg-glass-200 hover:shadow-lg
                ${isActive ? 'bg-glass-200 border border-neon-cyan/30' : 'text-white/40'}
            `}
        >
            <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-neon-cyan' : 'group-hover:text-white'}`} />

            <div className="absolute left-16 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[10px] uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
            </div>

            {/* Active Indicator */}
            {isActive && (
                <motion.div
                    layoutId="active-nav"
                    className="absolute -left-1 w-1 h-6 bg-neon-cyan rounded-r-full shadow-neon-cyan"
                />
            )}
        </button>
    );
});

export const SideNav = () => {
    const { user, initialize, signInWithGoogle, logout, loading } = useAuthStore();
    const { currentView, setView } = useNavigationStore();

    // Init Auth Listener
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    const handleGoogleLogin = useCallback(() => signInWithGoogle(), [signInWithGoogle]);
    const handleLogout = useCallback(() => logout(), [logout]);
    const handleSetView = useCallback((id: NavItemId) => {
        soundManager.playNavigation();
        setView(id);
    }, [setView]);

    return (
        <motion.aside
            initial="hidden"
            animate="visible"
            variants={SIDEBAR_VARIANTS}
            className="fixed left-6 top-1/2 -translate-y-1/2 w-16 glass-dock flex flex-col items-center gap-8 z-50 py-10 overflow-visible"
        >
            {/* Neural Logo */}
            <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/50 shadow-neon-cyan cursor-pointer hover:scale-110 transition-transform">
                <span className="text-neon-cyan font-bold text-xl">D</span>
            </div>

            {/* Nav Symbols */}
            <nav className="flex-1 w-full flex flex-col gap-6 items-center">
                {navItems.map((item) => (
                    <NavButton
                        key={item.id}
                        item={item}
                        isActive={currentView === item.id}
                        onClick={handleSetView}
                    />
                ))}
            </nav>

            {/* User Access Terminal */}
            <div className="mt-auto flex flex-col items-center gap-4">
                {user && !user.isAnonymous ? (
                    <div className="relative group">
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-red-500/50 transition-colors"
                        >
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            )}
                        </button>
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 uppercase tracking-widest">
                            Terminate Session
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all font-mono text-[10px] font-bold"
                    >
                        AUTH
                    </button>
                )}
            </div>
        </motion.aside>
    );
};
