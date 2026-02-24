import { create } from 'zustand';

type ViewMode = 'dashboard' | 'train' | 'stats' | 'settings' | 'achievements' | 'leaderboard' | 'arena' | 'architect' | 'fleet' | 'deck';

interface NavigationState {
    currentView: ViewMode;
    setView: (view: ViewMode) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    currentView: 'dashboard',
    setView: (view) => set({ currentView: view }),
}));
