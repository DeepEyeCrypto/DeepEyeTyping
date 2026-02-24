// Mock localStorage for zustand persist middleware in tests
const storage: Record<string, string> = {};

const mockStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(key => delete storage[key]); }
};

Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage,
    writable: true
});
