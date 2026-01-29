// File: apps/desktop/src/components/layout/TopBar.tsx
import { Bell, Search, Wifi } from 'lucide-react';

export const TopBar = () => {
    return (
        <header className="h-16 w-full flex items-center justify-between px-8 border-b border-glass-100 z-10 bg-transparent">
            {/* Left: Breadcrumbs or Status */}
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-medium text-white/80">
                    Training <span className="text-white/20 mx-2">/</span> Core Protocol
                </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-100 border border-glass-200">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                    <span className="text-xs font-medium text-neon-cyan">SYSTEM ONLINE</span>
                </div>

                <button className="p-2 rounded-full hover:bg-glass-200 text-white/60 hover:text-white transition-colors">
                    <Search size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-glass-200 text-white/60 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-purple border border-black"></span>
                </button>
            </div>
        </header>
    );
};
