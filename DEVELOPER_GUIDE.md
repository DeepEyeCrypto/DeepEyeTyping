# DeepEyeTyping: Developer Protocol Guide

> **Authorized Clearance Level Required.**
> This document details the internal architecture, state management patterns, and build systems for the DeepEye Neural Interface.

---

## 🏗 System Topography (Monorepo)

The project utilizes a strict NPM Workspaces implementation to share business logic and design systems between the Native Client and Web Platform.

### 🌐 `packages/`

These are the building blocks of the ecosystem.

* **`packages/core`**: The **Brain**.
  * **Zustand Stores**: `typingStore` (Engine), `progressStore` (Gamification), `authStore` (Identity), `settingsStore`.
  * **Firebase Hooks**: Custom hooks (`useStats`, `useLeaderboard`) wrapping Firestore snapshots.
  * **Analytics Engine**: `TypingAnalytics` class for calculating WPM, Consistency (Standard Deviation of keystrokes), and Weakest Keys.
  * **Sound Manager**: Procedural audio engine using `Howler` and WebAudio API.
* **`packages/ui`**: The **Skin**.
  * Contains the `theme.css` file with all CSS Variables for the "Liquid Glass" aesthetic.
  * Defines shared Tailwind config presets.

### 🖥 `apps/`

The consumer applications.

* **`apps/desktop`**: (Tauri + Vite + React)
  * The core product. Native desktop app with full system access.
  * Uses `react-router` (or custom view state) for navigation.
  * Implements the "Arena" (Multiplayer) components.
* **`apps/web`**: (Next.js 15)
  * Server-side rendered (SSR) landing page.
  * Marketing funnel and public-facing leaderboards.

---

## 🧠 Core Systems

### 1. The Typing Engine (`useTypingStore`)

The engine is event-driven. It does not use `input` elements but captures global `keydown` events to support custom "Virtual Buffers".

* **Keystroke Logging**: Every keypress is timestamped.
* **Analytics**: WPM and Accuracy are recalculated in real-time on every input.
* **God Mode**: A special state that triggers screen shake effects on errors.

### 2. Cloud Synchronization (Firebase)

* **Auth**: Supports Google & GitHub Providers. Guests are supported with `localStorage` fallback.
* **Firestore Data Model**:
  * `users/{uid}`: Private profile data.
  * `users/{uid}/sessions`: Sub-collection of past typing history.
  * `leaderboard/{uid}`: Public summary document.
* **Realtime Database (Arena & Fleets)**:
  * Used for low-latency multiplayer state and real-time fleet presence.

### 3. The "Liquid Glass" Design System

We avoid standard UI libraries in favor of a custom CSS-first approach for maximum performance and unique aesthetics.

* **Classes**: `.glass-panel`, `.glass-card`, `.neon-text`.
* **Colors**: Semantically mapped to `neon-cyan` (Primary), `neon-purple` (Secondary/Exam), and `dark-bg`.

---

## 🛠 Deployment Protocols

### Desktop (MacOS/Windows/Linux)

Builds a native binary using Tauri.

```bash
npm run tauri build
```

* Artifacts are output to `apps/desktop/src-tauri/target/release`.
* Ensure unique Bundle ID in `tauri.conf.json` before release.

### Web (Vercel/Netlify)

Standard Next.js deployment.

```bash
npm run build -w web
```

---

## 🧪 Testing Protocols

* **Linting**: `npm run lint` (ESLint with React Perf plugins).
* **Type Check**: `npm run typecheck`.

> *End of Briefing. Initialize Code Stream.*
