import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTypingStore } from './store';
import { soundManager } from './soundManager';

// Mock Sound Manager
vi.mock('./soundManager', () => ({
    soundManager: {
        playKeypress: vi.fn(),
        playError: vi.fn(),
        playSuccess: vi.fn(),
        playNavigation: vi.fn(),
    }
}));

// Mock Firebase
vi.mock('./firebase/config', () => ({
    db: {},
    auth: {
        currentUser: { uid: 'test-user', displayName: 'Test Operative' }
    }
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(() => Promise.resolve({ id: 'doc-id' })),
    serverTimestamp: vi.fn(() => 'timestamp'),
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => false }))
}));

describe('TypingStore', () => {
    beforeEach(() => {
        useTypingStore.getState().reset();
    });

    it('should initialize with default state', () => {
        const state = useTypingStore.getState();
        expect(state.userInput).toBe("");
        expect(state.currentIndex).toBe(0);
        expect(state.status).toBe('idle');
    });

    it('should update state on inputChar', () => {
        const { setText, inputChar } = useTypingStore.getState();
        setText("Test");
        inputChar("T");

        const state = useTypingStore.getState();
        expect(state.userInput).toBe("T");
        expect(state.currentIndex).toBe(1);
        expect(state.status).toBe('running');
        expect(soundManager.playKeypress).toHaveBeenCalled();
    });

    it('should handle incorrect characters', () => {
        const { setText, inputChar } = useTypingStore.getState();
        setText("Test");
        inputChar("X");

        const state = useTypingStore.getState();
        expect(state.accuracy).toBeLessThan(100);
        expect(state.errorCount).toBe(1);
        expect(soundManager.playError).toHaveBeenCalled();
    });

    it('should complete session when text is finished', () => {
        const { setText, inputChar } = useTypingStore.getState();
        setText("A");
        inputChar("A");

        const state = useTypingStore.getState();
        expect(state.isFinished).toBe(true);
        expect(state.status).toBe('finished');
        expect(soundManager.playSuccess).toHaveBeenCalled();
    });

    it('should fail in exam mode if accuracy is too low', () => {
        const { setText, inputChar } = useTypingStore.getState();
        // Set long text to trigger buffer check (> 20 chars)
        const longText = "The quick brown fox jumps over the lazy dog.";
        setText(longText, 'exam');

        // Input 21 incorrect chars
        for (let i = 0; i < 21; i++) {
            inputChar("!");
        }

        const state = useTypingStore.getState();
        expect(state.status).toBe('failed');
        expect(state.isFinished).toBe(true);
    });
});
