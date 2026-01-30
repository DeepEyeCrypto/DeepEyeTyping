import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundManager } from './soundManager';

interface SettingsState {
    soundEnabled: boolean;
    musicEnabled: boolean;
    visualEffects: 'low' | 'high';
    godMode: boolean;
    toggleSound: () => void;
    toggleVisuals: () => void;
    toggleGodMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            soundEnabled: true,
            musicEnabled: false,
            visualEffects: 'high',
            godMode: false,

            toggleSound: () => {
                const newState = !get().soundEnabled;
                set({ soundEnabled: newState });
                soundManager.setMuted(!newState);
            },

            toggleVisuals: () => {
                set({ visualEffects: get().visualEffects === 'high' ? 'low' : 'high' });
            },

            toggleGodMode: () => {
                set({ godMode: !get().godMode });
            },
        }),
        {
            name: 'deepeye-settings',
        }
    )
);
