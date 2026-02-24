import { useSettingsStore } from 'core';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = {
    dark: Moon,
    light: Sun,
    system: Monitor,
};

const labels = {
    dark: 'Dark',
    light: 'Light',
    system: 'System',
};
const TAP_ANIM = { scale: 0.95 };

export function ThemeToggle({ className = '' }: { className?: string }) {
    const { colorMode, toggleColorMode } = useSettingsStore();
    const Icon = icons[colorMode];

    return (
        <motion.button
            onClick={toggleColorMode}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl 
                bg-white/5 border border-white/10 text-white/40 hover:text-white 
                hover:bg-white/10 hover:border-white/20 transition-all ${className}`}
            whileTap={TAP_ANIM}
            title={`Current: ${labels[colorMode]} mode. Click to toggle.`}
        >
            <Icon size={18} />

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 
                bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-bold 
                uppercase tracking-wider text-white whitespace-nowrap opacity-0 
                group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                {labels[colorMode]}
            </span>
        </motion.button>
    );
}
