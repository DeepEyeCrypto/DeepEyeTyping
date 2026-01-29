import { create } from 'zustand';
import { User, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;

    initialize: () => () => void; // Returns unsubscribe
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    error: null,

    initialize: () => {
        return onAuthStateChanged(auth, (user) => {
            set({ user, loading: false });
        });
    },

    signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // State updated by onAuthStateChanged
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    signInWithGithub: async () => {
        set({ loading: true, error: null });
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (err: any) {
            set({ error: err.message });
        }
    }
}));
