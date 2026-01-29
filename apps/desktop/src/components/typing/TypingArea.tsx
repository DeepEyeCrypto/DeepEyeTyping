// File: apps/desktop/src/components/typing/TypingArea.tsx
import { useEffect, useState } from 'react';
import { useTypingStore, QWERTY_LAYOUT } from '../../../../../packages/core'; // Relative import
import { VirtualKeyboard } from './VirtualKeyboard';

export const TypingArea = () => {
    const { targetText, userInput, currentIndex, inputChar, backspace } = useTypingStore();
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    // Derive active expected key
    const activeChar = targetText[currentIndex];
    const activeKeyConfig = QWERTY_LAYOUT.flat().find(k => activeChar && (k.label.toLowerCase() === activeChar.toLowerCase() || (activeChar === ' ' && k.code === 'Space')));
    const activeKeyCode = activeKeyConfig?.code || null;

    // Handle Keyboard Events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setPressedKey(e.code);

            if (e.key === 'Backspace') {
                backspace();
            } else if (e.key.length === 1) {
                inputChar(e.key);
            }
        };

        const handleKeyUp = () => {
            setPressedKey(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [inputChar, backspace]);

    return (
        <div className="flex flex-col items-center gap-12 w-full">

            {/* Text Display */}
            <div className="w-full max-w-4xl glass-card text-3xl font-mono leading-relaxed p-8 min-h-[200px] flex flex-wrap content-start">
                {targetText.split('').map((char, index) => {
                    let stateClass = 'text-white/30'; // Future
                    if (index < currentIndex) {
                        stateClass = userInput[index] === char ? 'text-neon-cyan shadow-neon-cyan' : 'text-red-500 bg-red-500/10';
                    } else if (index === currentIndex) {
                        stateClass = 'text-white bg-white/10 animate-pulse rounded'; // Cursor
                    }

                    return (
                        <span key={index} className={`px-0.5 transition-colors duration-100 ${stateClass}`}>
                            {char}
                        </span>
                    );
                })}
            </div>

            {/* Virtual Keyboard */}
            <VirtualKeyboard activeKey={activeKeyCode} pressedKey={pressedKey} />

        </div>
    );
};
