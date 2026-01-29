import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundManager } from './soundManager';

interface SettingsState {
    soundEnabled: boolean;
    musicEnabled: boolean;
    visualEffects: 'low' | 'high';
    toggleSound: () => void;
    toggleVisuals: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            soundEnabled: true,
            musicEnabled: false,
            visualEffects: 'high',

            toggleSound: () => {
                const newState = !get().soundEnabled;
                set({ soundEnabled: newState });
                soundManager.setMuted(!newState);
            },

            toggleVisuals: () => {
                set({ visualEffects: get().visualEffects === 'high' ? 'low' : 'high' });
            },
        }),
        {
            name: 'deepeye-settings',
        }
    )
);
