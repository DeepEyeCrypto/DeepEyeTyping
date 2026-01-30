# DeepEye Developer Guide

## System Architecture

### 1. The "Hex-Core" Logic Pattern

This is a monorepo managed with npm workspaces:

- `apps/desktop`: The main Tauri + Vite React Application.
- `apps/web`: Next.js marketing site with Liquid Glass UI.
- `packages/core`: Pure TypeScript logic (Zustand stores, Firebase sync, Sound engine).
- `packages/ui`: Shared design tokens and CSS utilities.

All core logic resides in `packages/core`. The UI layers are purely visual renderers.

- **Store:** `zustand` manages the `TypingState`.
- **Inputs:** `TypingArea.tsx` captures keydowns -> calls `store.inputChar()`.
- **Outputs:** Store updates `userInput`, `stats`, `isFinished`.
- **Side Effects:** Store triggers `soundManager.play()` and `firebase.saveSession()`.

### 2. Tailwind v4 & Liquid Glass

We use the new Tailwind v4 engine across all projects.

- **Shared Tokens:** Defined in `packages/ui/src/theme.css`.
- **Glass Panel:** A custom utility class combining `backdrop-blur-xl`, `bg-white/5`, and `border-white/10`.
- **Neon Glows:** Uses `drop-shadow` and `box-shadow` with CSS variables like `--color-neon-cyan`.

### 3. Firebase & Security

- **Auth:** Uses `onAuthStateChanged` in a `useEffect` inside `SideNav`.
- **Data:**
  - Sessions: `/users/{uid}/sessions/{sessionId}`
  - Progress: `/users/{uid}/progress/main` (Single document for XP/Badges)
- **Security:** Firestore Rules configured in `firestore.rules` to strictly enforce `request.auth.uid == userId`.

### 4. Sound Engine v2

We use `window.AudioContext` for real-time synthesis:

- **Layered Oscillators:** Keypresses combine high-freq sine transients with low-freq triangle thuds for mechanical depth.
- **Noise Synthesis:** Errors use sawtooth sweeps mixed with white noise bursts.
- **Navigation Hooks:** A custom `playNavigation` sweep provides audible feedback for UI transitions.
- *Why?* Instant response, zero asset load, and a cohesive "Cyber-Acoustic" brand identity.

### 5. Command Palette (The Shell)

The system features a global command palette triggered by `⌘K` or the Search Bar:

- **Registry:** Managed in `CommandPalette.tsx`.
- **Search:** Fuzzy matching across `LESSONS` and `NavigationStore` views.
- **UX:** Full keyboard accessibility (↑/↓/Enter/Esc).

### 6. Environmental Visuals (FX)

To enhance the immersion "Vision Pro" feeling:

- **God Mode Aura:** When `godMode` is active in `SettingsStore`, `AppShell` renders a subtle, pulsating red border glow.
- **System Stream:** The Dashboard includes a `SystemStream` component that simulates neural link logs during initialization.
- **Grainy Textures:** A global SVG noise overlay (`packages/ui/src/theme.css`) is filtered across glass surfaces to prevent clinical gradients.

### 6. Progression Engine

- **Store:** `progressStore.ts` manages XP, Level, and Badges separately from session state.
- **Sync:** `useProgressSync.ts` hook handles bi-directional syncing (Local <-> Cloud).
- **Gamification:** `gamification.ts` defines Badge logic and Level Curves.
- **Exams:** `lessons.ts` includes `strictMode` flag which triggers immediate failure in `store.ts` if accuracy drops below threshold.

### 7. Performance & Quality Control

To maintain a "0ms perceived lag" environment, we enforce strict performance rules:

- **Linting:** We use `eslint-plugin-react-perf` to prevent inline object/function creation in JSX props which kills memoization.
  - Run `npm run lint` to check for regressions.
- **Bundle Analysis:** `rollup-plugin-visualizer` generates `stats.html` on every build.
  - We target a **< 500kB** initial load.
  - Dependencies are split: React, Motion, and Firebase live in separate vendor chunks.
- **CI/CD:** GitHub Actions run a "Quality Gate" that fails if:
  - Linting fails.
  - The main application logic chunk exceeds **50kB**.
- **Pre-commit:** Husky runs `npm run lint` locally before every commit.

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

### Build & Audit

1. **Lint:** `npm run lint` (All workspaces).
2. **Build Desktop:** `npm run build --workspace=desktop`.
3. **Audit Size:** Open `apps/desktop/stats.html` after build.
4. **Desktop App:** Run `npm run tauri build` to generate binaries.

## Troubleshooting

- **Tailwind Error:** Ensure `@tailwindcss/postcss` is installed in `apps/desktop`.
- **Sound Not Playing:** User must interact with DOM first (Browser Autoplay Policy).
