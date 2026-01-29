# DeepEye Developer Guide

## System Architecture

### 1. The "Hex-Core" Logic Pattern

All core logic resides in `packages/core`. The UI layer (`apps/desktop`) is purely a visual renderer.

- **Store:** `zustand` manages the `TypingState`.
- **Inputs:** `TypingArea.tsx` captures keydowns -> calls `store.inputChar()`.
- **Outputs:** Store updates `userInput`, `stats`, `isFinished`.
- **Side Effects:** Store triggers `soundManager.play()` and `firebase.saveSession()`.

### 2. Tailind v4 & Liquid Glass

We use the new Tailwind v4 engine.

- Configuration is in `index.css` under `@theme`.
- **Glass Panel:** A custom utility class combining `backdrop-blur-xl`, `bg-white/5`, and `border-white/10`.
- **Neon Glows:** Uses `drop-shadow` and `box-shadow` with CSS variables `--color-neon-cyan`.

### 3. Firebase Integration

- **Auth:** Uses `onAuthStateChanged` in a `useEffect` inside `SideNav` (or `App`).
- **Data:** Stats are saved to `/users/{uid}/sessions/{sessionId}`.
- **Security:** (TODO) Add Firestore Rules to allow only `request.auth.uid == userId`.

### 4. Sound Engine

We use `window.AudioContext` oscillators.

- **Sine Wave:** Keypress.
- **Sawtooth:** Error.
- **Triangle Arpeggio:** Success.
- *Why?* Zero asset load time, futuristic feeling.

## Common Tasks

### Adding a New Lesson

Edit `packages/core/src/lessons.ts`.

```typescript
{
  id: 'l6',
  title: 'New Drill',
  category: 'Code',
  difficulty: 2,
  text: 'Your text here...'
}
```

### Deploying

1. **Web:** Run `pnpm build` -> Upload `apps/desktop/dist` to Netlify/Vercel.
2. **Desktop:** Run `pnpm tauri build` -> Generates `.dmg` / `.exe`.

## Troubleshooting

- **Tailwind Error:** Ensure `@tailwindcss/postcss` is installed in `apps/desktop`.
- **Sound Not Playing:** User must interact with DOM first (Browser Autoplay Policy).
