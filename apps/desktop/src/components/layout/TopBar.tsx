import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
    onSearchClick: () => void;
    className?: string;
}

export const TopBar = ({ onSearchClick, className = '' }: TopBarProps) => {
    return (
        <header className={`h-14 w-full flex items-center justify-between px-4 md:px-10 border-b border-white/5 z-20 bg-white/2 backdrop-blur-md ${className}`}>
            {/* Navigation / Window Spacer */}
            <div className="flex items-center gap-6 w-10">
                {/* Reserved for future nav controls or window drag region */}
            </div>

            {/* Neural URL Bar */}
            <div className="flex-1 max-w-xl mx-4">
                <div
                    onClick={onSearchClick}
                    className="h-8 w-full bg-black/40 rounded-full border border-white/5 flex items-center px-4 gap-3 group hover:border-neon-cyan/40 transition-all cursor-text relative overflow-hidden active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Search size={14} className="text-white/20 group-hover:text-neon-cyan transition-colors" />
                    <span className="hidden sm:inline text-[10px] text-white/20 font-mono tracking-widest uppercase truncate select-none">
                        Execute Command or Search Protocols...
                    </span>
                    <div className="hidden md:flex ml-auto gap-1 items-center opacity-20 group-hover:opacity-60 transition-opacity">
                        <span className="px-1.5 py-0.5 rounded border border-white/20 text-[8px] font-black">⌘</span>
                        <span className="px-1.5 py-0.5 rounded border border-white/20 text-[8px] font-black">K</span>
                    </div>
                </div>
            </div>

            {/* System Telemetry */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-neon-cyan"></div>
                    <span className="hidden sm:inline text-[10px] font-bold text-neon-cyan tracking-[0.2em] uppercase">Status: Sync</span>
                </div>

                <button className="relative group">
                    <Bell size={18} className="text-white/40 group-hover:text-white transition-colors" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
                </button>
            </div>
        </header>
    );
};
