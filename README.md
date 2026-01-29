# DeepEye.Typing

> **Advanced Neural Interface Training Protocol**  
> *Next-Gen Typing Tutor built with React 19, Tauri v2, and Liquid Glass UI.*

![DeepEye Banner](https://via.placeholder.com/1200x400/05050a/00fff2?text=DeepEye.Typing+Protocol)

## 🌟 Core Features

- **Liquid Glass Aesthetic:** Premium cyberpunk visuals with real-time blur and neon glows.
- **Neural Engine:** Custom typing logic with character-level tracking (Zustand).
- **Virtual Keyboard:** Real-time visual feedback with finger-guide indicators.
- **Sound Synthesis:** Procedural WebAudio SFX (no external assets required).
- **Cloud Sync:** Firebase Auth & Firestore integration for cross-device stats.
- **Desktop Native:** Built on Tauri v2 for high-performance desktop experience.

## 🏗 Architecture (Monorepo)

This project uses `pnpm workspaces` to separate concerns:

- `apps/desktop`: The main Tauri + Vite React Application.
- `apps/web`: (Placeholder) Next.js marketing site.
- `packages/core`: Shared Logic (Store, Auth, Config, Sound).
- `packages/ui`: Shared Design Tokens (Tailwind Config).

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Rust (for Tauri builds)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Configure Firebase
# Open packages/core/src/firebase/config.ts and replace placeholder keys.
```

### Development

```bash
# Run the desktop app in dev mode (Browser View)
cd apps/desktop
npm run dev

# Run the Tauri window (Native View)
npm run tauri dev
```

## ⌨️ Controls

- **Lesson Selector:** Top carousel to switch drills.
- **Settings:** Mute audio or toggle "High Performance" visual mode.
- **Auth:** Click "Connect Identity" to sync stats to Cloud.

## 🛠 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4 + Framer Motion
- **State:** Zustand (with Persist)
- **Backend:** Firebase (Auth + Firestore)
- **Container:** Tauri v2

---
*Built by the DeepEye Agentic Engineering Team.*
