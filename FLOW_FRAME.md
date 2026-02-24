# DeepEyeTyping FLOW FRAME Documentation

## 1. PRODUCT VISION

**One-paragraph vision:**

DeepEyeTyping is a **futuristic, high-focus, glassmorphism-driven neural interface typing trainer** that looks like it belongs in 2030 while maintaining usability and performance. It combines precision typing training with gamification, multiplayer racing, team collaboration (Fleet HQ), and deep biometric analytics (Neural Deck) — all wrapped in a Vision Pro-inspired liquid glass aesthetic with 60FPS animations and ambient neural grid backgrounds. The product targets developers, gamers, students, and professionals seeking to master touch-typing through an immersive, data-driven interface that works across desktop (Tauri), web, and mobile platforms.

---

## 2. USER ARCHETYPES (Personas)

| # | Archetype | Demographics | Goals | Pain Points |
|---|-----------|--------------|-------|-------------|
| 1 | **The Speed Demon** | Gamers, 18-35, competitive | Achieve top WPM rankings, compete in Arena races | Frustrated by boring drills; wants instant gratification |
| 2 | **The Professional** | Developers, 22-45 | Improve coding efficiency, reduce typos | Needs technical vocabulary training (snake_case, camelCase, brackets) |
| 3 | **The Student** | 16-24, learners | Academic typing speed for notes, essays | Gets bored easily; needs gamified progression |
| 4 | **The Team Lead** | 28-50, enterprise | Onboard team members, track fleet progress | Needs visibility into team analytics |
| 5 | **The Data Nerd** | 25-45, analysts | Deep dive into metrics, Biometric Cloud trends | Wants granular WPM/accuracy breakdowns per session |

---

## 3. PRIMARY USER JOURNEYS

| Journey ID | Journey Name | Steps | Success Metric |
|------------|--------------|-------|----------------|
| **J1** | **First-Time Onboarding** | Landing → Create Account → Keyboard Layout Selection → First Typing Lesson → Dashboard | Completes first 60-second session |
| **J2** | **Daily Training Run** | Open Dashboard → View Streak/Missions → Select Lesson/Training → Typing Session → Results/Feedback → Close | Session completes with positive feedback |
| **J3** | **Arena Race** | Navigate to Arena → Join/Host Race → Race Session → Leaderboard Update | Race finishes, position displayed |
| **J4** | **Fleet HQ Team Play** | Fleet HQ → Create/Join Fleet → Assign Missions → Spectate/Compete → Team Leaderboard | Team completes mission |
| **J5** | **Deep Analytics Dive** | Stats → Neural Deck (3D) → Filter by Date/Lesson → Biometric Cloud → Export Report | User views detailed breakdown |

---

## 4. SOP (Standard Operating Procedure)

### Design-to-Delivery Pipeline

```
Concept → Low-Fi Wireframe → Hi-Fi Design → Design Tokens → Dev Handoff → QA → Release
```

### Agent Ownership Matrix

| Phase | Owner Agent | Responsibilities |
|-------|-------------|------------------|
| Research & Discovery | Product Manager | User interviews, competitive analysis |
| UX/IA | UX Agent | Wireframes, user flows, accessibility |
| Visual Design | Design Agent | Figma hi-fi, design tokens, animations |
| Design System | Design Engineer | Tokens, Storybook, component library |
| Frontend (React/Next) | FE Agent | Component implementation, styling, animations |
| Backend (Firebase/Rust) | BE Agent | API design, Firestore schema, Rust typing engine |
| Testing | QA Agent | Unit tests, integration, visual regression |
| Analytics/Metrics | DevOps Agent | PostHog events, performance budgets |

### Feedback Loops

- **Design Reviews**: Weekly sync (Design ↔ Product)
- **UX Testing**: Bi-weekly playtests with 3-5 users
- **A/B Tests**: For major UI/feature changes (e.g., new feedback animations)
- **Code Reviews**: Required for all PRs (lint + typecheck gates)

---

## 5. FEATURE ROADMAP

### Phase 1: MVP Experience (0-3 months)

- [ ] Core typing session with real-time WPM/accuracy
- [ ] Basic lesson library (lessons.ts already exists)
- [ ] Dashboard with streak widget
- [ ] Glassmorphism UI foundation (tokens.css, components.css)
- [ ] LocalStorage offline persistence
- [ ] Basic settings (theme toggle, keyboard layout)

### Phase 2: Engagement (3-6 months)

- [ ] Gamification: Achievements, badges, XP system
- [ ] Mission Engine: Daily/weekly missions
- [ ] Leaderboard (global)
- [ ] Multiplayer Arena racing (live)
- [ ] Fleet HQ: Team creation, missions, spectating
- [ ] Protocol Architect: Custom lesson builder

### Phase 3: Ecosystem (6-12 months)

- [ ] Neural Deck (3D WebGL biometric visualization)
- [ ] Biometric Cloud: Advanced analytics
- [ ] Mobile app (iOS/Android)
- [ ] API for third-party integrations
- [ ] Advanced dashboards for enterprise/Fleet admins

---

## 6. TECH STACK OUTLINE

### UI Technology

| Layer | Technology | Notes |
|-------|------------|-------|
| Desktop Framework | **Tauri v2** | Rust backend, WebView2/WebKit |
| Web Framework | **Next.js 15** | App Router, server components |
| UI Library | **React 19** | Concurrent features |
| Styling | **Tailwind CSS v4** + CSS Modules | Design tokens via CSS custom properties |
| Animation | **Framer Motion** | 60FPS transitions |
| State Management | **Zustand** | Global state in packages/core |
| 3D/Visualization | **Three.js / React Three Fiber** | Neural Deck |

### Design System Tools

- **Figma Tokens**: Exported to `packages/ui` as CSS custom properties
- **Storybook**: Component documentation (to be set up)
- **Tokens Location**: `apps/desktop/src/styles/tokens.css`

### Analytics & Metrics

| Purpose | Tool |
|---------|------|
| Product Analytics | **PostHog** (or Plausible for privacy) |
| Error Tracking | Sentry (optional) |
| Custom Events | Firebase Analytics + custom hook |
| Performance | Lighthouse CI, Vercel Analytics |

### Testing & Monitoring

| Layer | Tool |
|-------|------|
| Unit Tests | **Vitest** (packages/core already configured) |
| Integration | React Testing Library |
| Visual Regression | Chromatic (Storybook) or Playwright |
| Linting | ESLint + custom rules for glassmorphism |
| Typecheck | TypeScript strict mode |

### Deployment

| Platform | Target |
|----------|--------|
| Desktop | Tauri → macOS .app, Windows .exe, Linux .AppImage |
| Web | Vercel (Next.js) or Netlify |
| CI/CD | GitHub Actions |

---

## 7. CONSTRAINTS & NON-FUNCTIONAL REQUIREMENTS

- **Performance Budget**: Typing area must maintain 60FPS; bundle < 200KB initial
- **Accessibility**: `prefers-reduced-motion` support required; keyboard navigation first-class
- **Offline-First**: LocalStorage failover for sessions (already implemented)
- **Privacy**: No login wall for basic training; Firebase Auth optional for cloud sync

---

## 8. BRAND PERSONALITY

- **Vibe**: Futuristic control room / cockpit HUD / neural interface
- **Keywords**: Glass, Holographic, Neural grid, Ambient glow, Minimal chrome, Zero clutter
- **Tone**: Professional yet aspirational — "Master your interface. Conquer the neural link."

---

## 9. EXISTING CODEBASE STATUS

The project already has significant implementation:

### Apps

- **apps/desktop**: Tauri + Vite + React 19 desktop app with glassmorphism UI
- **apps/web**: Next.js 15 marketing platform

### Core Packages

- **packages/core**: Zustand stores, Firebase hooks, analytics, gamification, mission engine, lessons
- **packages/ui**: Design tokens and theme CSS

### Implemented Features

- Typing session with real-time WPM/accuracy
- Dashboard with streak widget and mission list
- Achievements, leaderboard, arena racing
- Fleet HQ for team collaboration
- Protocol Architect for custom lessons
- Settings page with theme toggle
- Rust typing engine for performance
- Glassmorphism design tokens and components

### CI/CD

- GitHub Actions workflows for quality gate and releases
