import { create } from 'zustand';
import { 
    type User, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider, 
    signInAnonymously as firebaseSignInAnonymously, 
    signOut, 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './config';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;

    initialize: () => () => void;
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
    signInWithEmail: (e: string, p: string) => Promise<void>; // New
    signUpWithEmail: (e: string, p: string) => Promise<void>; // New
    signInAnonymously: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
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
            // Check if running in Tauri
            if (typeof window !== 'undefined' && (window as any).__TAURI__) {
                throw new Error("Social Login not supported in Desktop App yet. Please use Email/Password.");
            }
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    signInWithGithub: async () => {
        set({ loading: true, error: null });
        try {
            if (typeof window !== 'undefined' && (window as any).__TAURI__) {
                throw new Error("Social Login not supported in Desktop App yet. Please use Email/Password.");
            }
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    signInWithEmail: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    signUpWithEmail: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    signInAnonymously: async () => {
        set({ loading: true, error: null });
        try {
            await firebaseSignInAnonymously(auth);
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },
    // ... (rest remains same)

    logout: async () => {
        try {
            await signOut(auth);
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    updateUserProfile: async (displayName: string, photoURL?: string) => {
        if (!auth.currentUser) return;
        try {
            await import('firebase/auth').then(({ updateProfile }) =>
                updateProfile(auth.currentUser!, { displayName, photoURL })
            );
            // Force state update since onAuthStateChanged might not trigger on profile update alone
            set({ user: { ...auth.currentUser, displayName, photoURL } });
        } catch (err: any) {
            set({ error: err.message });
        }
    }
}));
