import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundManager } from './soundManager';

export type ParticleFrequency = 'none' | 'minimal' | 'high' | 'ultra';
export type HUDComplexity = 'minimal' | 'standard' | 'technical';
export type ThemeProfile = 'deep_ocean' | 'neon_matrix' | 'monochrome_ghost';
export type ColorMode = 'dark' | 'light' | 'system';

interface SettingsState {
    // Audio
    soundEnabled: boolean;
    musicEnabled: boolean;
    dynamicPitch: boolean;
    masterVolume: number;

    // Visuals
    visualEffects: 'low' | 'high';
    particleFrequency: ParticleFrequency;
    hudComplexity: HUDComplexity;
    showKeyboard: boolean;

    // Theme
    colorMode: ColorMode;

    // Advanced
    godMode: boolean;
    themeProfile: ThemeProfile;

    // Actions
    toggleSound: () => void;
    setDynamicPitch: (enabled: boolean) => void;
    setParticleFrequency: (freq: ParticleFrequency) => void;
    setHUDComplexity: (comp: HUDComplexity) => void;
    setThemeProfile: (profile: ThemeProfile) => void;
    setColorMode: (mode: ColorMode) => void;
    toggleColorMode: () => void;
    setVolume: (vol: number) => void;
    toggleVisuals: () => void;
    toggleGodMode: () => void;
    toggleKeyboard: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            soundEnabled: true,
            musicEnabled: false,
            dynamicPitch: true,
            masterVolume: 80,

            visualEffects: 'high',
            particleFrequency: 'high',
            hudComplexity: 'technical',
            showKeyboard: true,

            colorMode: 'dark',

            godMode: false,
            themeProfile: 'deep_ocean',

            toggleSound: () => {
                const newState = !get().soundEnabled;
                set({ soundEnabled: newState });
                soundManager.setMuted(!newState);
            },

            setDynamicPitch: (enabled) => set({ dynamicPitch: enabled }),
            setParticleFrequency: (freq) => set({ particleFrequency: freq }),
            setHUDComplexity: (comp) => set({ hudComplexity: comp }),
            setThemeProfile: (profile) => set({ themeProfile: profile }),

            setColorMode: (mode) => {
                set({ colorMode: mode });
                applyColorMode(mode);
            },

            toggleColorMode: () => {
                const modes: ColorMode[] = ['dark', 'light', 'system'];
                const currentIndex = modes.indexOf(get().colorMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                const nextMode = modes[nextIndex];
                set({ colorMode: nextMode });
                applyColorMode(nextMode);
            },

            setVolume: (vol) => set({ masterVolume: vol }),

            toggleVisuals: () => {
                set({ visualEffects: get().visualEffects === 'high' ? 'low' : 'high' });
            },

            toggleKeyboard: () => set({ showKeyboard: !get().showKeyboard }),

            toggleGodMode: () => {
                set({ godMode: !get().godMode });
            },
        }),
        {
            name: 'deepeye-settings-v2',
        }
    )
);

// Helper function to apply color mode to document
function applyColorMode(mode: ColorMode) {
    const html = document.documentElement;

    if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', 'light');
        }
    } else if (mode === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.removeAttribute('data-theme');
    }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const store = useSettingsStore.getState();
        if (store.colorMode === 'system') {
            applyColorMode('system');
        }
    });
}
