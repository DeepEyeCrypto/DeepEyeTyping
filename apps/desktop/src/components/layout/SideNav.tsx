// File: apps/desktop/src/components/layout/SideNav.tsx
import { useEffect } from 'react';
import { Home, Keyboard, BarChart2, Settings, User, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore, useNavigationStore } from '../../../../../packages/core'; // Relative import

const navItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Keyboard, label: 'Train', id: 'train' },
    { icon: BarChart2, label: 'Stats', id: 'stats' },
    { icon: Settings, label: 'Settings', id: 'settings' },
] as const;

export const SideNav = () => {
    const { user, initialize, signInWithGoogle, logout, loading } = useAuthStore();
    const { currentView, setView } = useNavigationStore();

    // Init Auth Listener
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-20 lg:w-64 h-full glass-panel border-r border-glass-200 flex flex-col items-center lg:items-start py-8 z-20"
        >
            {/* Logo Area */}
            <div className="mb-10 px-0 lg:px-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/50 shadow-neon-cyan">
                    <span className="text-neon-cyan font-bold text-xl">D</span>
                </div>
                <span className="hidden lg:block font-bold text-xl tracking-wider text-white">
                    DeepEye
                </span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 w-full flex flex-col gap-2 px-2 lg:px-4">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as any)}
                            className={`
                relative w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group
                hover:bg-glass-200 hover:shadow-lg
                ${isActive ? 'bg-glass-200 border border-neon-cyan/30' : 'text-white/60'}
              `}
                        >
                            <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-neon-cyan' : 'group-hover:text-white'}`} />
                            <span className={`hidden lg:block font-medium ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                                {item.label}
                            </span>

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute left-0 w-1 h-8 bg-neon-cyan rounded-r-full"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="mt-auto px-2 lg:px-4 w-full">
                {user ? (
                    // Logged In State
                    <div className="flex flex-col gap-2">
                        <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-glass-200 border border-glass-300">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-neon-cyan" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center">
                                    <span className="text-xs font-bold">{user.email?.[0].toUpperCase()}</span>
                                </div>
                            )}
                            <div className="hidden lg:flex flex-col items-start overflow-hidden">
                                <span className="text-sm font-bold text-white truncate max-w-[100px]">{user.displayName || 'Agent'}</span>
                                <span className="text-xs text-neon-cyan">Online</span>
                            </div>
                        </div>

                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all text-xs"
                        >
                            <LogOut size={14} />
                            <span className="hidden lg:inline">Disconnect Signal</span>
                        </button>
                    </div>
                ) : (
                    // Guest State
                    <button
                        onClick={() => signInWithGoogle()}
                        disabled={loading}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neon-cyan/20 border border-transparent hover:border-neon-cyan/50 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-glass-200 flex items-center justify-center group-hover:bg-neon-cyan/20 group-hover:text-neon-cyan transition-colors">
                            <LogIn size={16} />
                        </div>
                        <div className="hidden lg:flex flex-col items-start">
                            <span className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                                {loading ? 'Initializing...' : 'Connect Identity'}
                            </span>
                            <span className="text-xs text-white/50">Google / GitHub</span>
                        </div>
                    </button>
                )}
            </div>
        </motion.aside>
    );
};
