// File: apps/desktop/src/components/typing/VirtualKeyboard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QWERTY_LAYOUT, KeyConfig } from '../../../../../packages/core'; // Relative import for monorepo without build step yet

interface VirtualKeyboardProps {
    activeKey: string | null; // The key code expected next
    pressedKey: string | null; // The key actually being pressed by user
}

export const VirtualKeyboard = ({ activeKey, pressedKey }: VirtualKeyboardProps) => {

    const getKeyColor = (key: KeyConfig) => {
        // 1. If currently pressed by user
        if (pressedKey === key.code) return 'bg-neon-cyan text-black shadow-neon-cyan scale-95';

        // 2. If it is the expected next key (Guide)
        if (activeKey === key.code) return 'bg-glass-300 border-neon-cyan shadow-[0_0_10px_rgba(0,255,242,0.3)] animate-pulse';

        // 3. Default state
        return 'bg-glass-100 border-glass-200 text-white/50 hover:bg-glass-200';
    };

    return (
        <div className="flex flex-col gap-2 p-4 rounded-3xl glass-panel w-full max-w-5xl mx-auto select-none">
            {QWERTY_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                    {row.map((key) => (
                        <motion.div
                            key={key.code}
                            initial={false}
                            className={`
                relative flex items-center justify-center rounded-lg border transition-all duration-100
                ${getKeyColor(key)}
              `}
                            style={{
                                width: `${(key.width || 1) * 3.5}rem`,
                                height: '3.5rem',
                            }}
                        >
                            <span className="font-mono text-lg font-bold">{key.label}</span>

                            {/* Finger Dot Indicator (Only on Active Key) */}
                            {activeKey === key.code && (
                                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-neon-purple shadow-neon-purple" />
                            )}
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
};
