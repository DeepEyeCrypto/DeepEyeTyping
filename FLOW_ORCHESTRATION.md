# DeepEyeTyping FLOW ORCHESTRATION Documentation

## Phase: O – ORCHESTRATION

---

## 1. WORK BREAKDOWN STRUCTURE

### Overview

The project is already well-implemented with significant progress on both Frontend and Backend. This orchestration document identifies completed work and remaining tasks for future development.

### Repository Structure

```
DeepEyeTyping/
├── apps/
│   ├── desktop/          # Tauri + Vite + React 19 (Primary)
│   └── web/              # Next.js 15 (Marketing)
├── packages/
│   ├── core/             # Zustand stores, Firebase hooks, analytics
│   └── ui/               # Design tokens
└── .github/workflows/    # CI/CD pipelines
```

---

## 2. FRONTEND AGENT TASKS

### Completed Components

| Task ID | Component | Location | Status |
|---------|-----------|----------|--------|
| **FE-01** | AppShell | `apps/desktop/src/components/layout/AppShell.tsx` | ✅ |
| **FE-02** | SideNav | `apps/desktop/src/components/layout/SideNav.tsx` | ✅ |
| **FE-03** | TopBar | `apps/desktop/src/components/layout/TopBar.tsx` | ✅ |
| **FE-04** | CommandPalette | `apps/desktop/src/components/layout/CommandPalette.tsx` | ✅ |
| **FE-05** | ThemeToggle | `apps/desktop/src/components/layout/ThemeToggle.tsx` | ✅ |
| **FE-06** | DashboardPage | `apps/desktop/src/components/dashboard/DashboardPage.tsx` | ✅ |
| **FE-07** | StreakWidget | `apps/desktop/src/components/dashboard/StreakWidget.tsx` | ✅ |
| **FE-08** | MissionList | `apps/desktop/src/components/dashboard/MissionList.tsx` | ✅ |
| **FE-09** | TrainingPage | `apps/desktop/src/components/typing/TrainingPage.tsx` | ✅ |
| **FE-10** | TypingArea | `apps/desktop/src/components/typing/TypingArea.tsx` | ✅ |
| **FE-11** | VirtualKeyboard | `apps/desktop/src/components/typing/VirtualKeyboard.tsx` | ✅ |
| **FE-12** | LessonSelector | `apps/desktop/src/components/typing/LessonSelector.tsx` | ✅ |
| **FE-13** | ArenaPage | `apps/desktop/src/components/arena/ArenaPage.tsx` | ✅ |
| **FE-14** | RaceTrack | `apps/desktop/src/components/arena/RaceTrack.tsx` | ✅ |
| **FE-15** | RacingPage | `apps/desktop/src/components/arena/RacingPage.tsx` | ✅ |
| **FE-16** | NeuralDeck | `apps/desktop/src/components/analytics/NeuralDeck.tsx` | ✅ |
| **FE-17** | BiometricCloud | `apps/desktop/src/components/analytics/BiometricCloud.tsx` | ✅ |
| **FE-18** | FleetHQ | `apps/desktop/src/components/fleet/FleetHQ.tsx` | ✅ |
| **FE-19** | ProtocolArchitect | `apps/desktop/src/components/architect/ProtocolArchitect.tsx` | ✅ |
| **FE-20** | AchievementsPage | `apps/desktop/src/components/achievements/AchievementsPage.tsx` | ✅ |
| **FE-21** | LeaderboardPage | `apps/desktop/src/components/leaderboard/LeaderboardPage.tsx` | ✅ |
| **FE-22** | StatsPage | `apps/desktop/src/components/stats/StatsPage.tsx` | ✅ |
| **FE-23** | SettingsPage | `apps/desktop/src/components/settings/SettingsPage.tsx` | ✅ |

### Remaining Frontend Tasks (Future)

| Task ID | Feature | Priority | Description |
|---------|---------|---------|-------------|
| **FE-24** | Mobile App Shell | Medium | Mobile-optimized navigation (bottom tabs) |
| **FE-25** | Storybook Setup | Medium | Component documentation and visual testing |
| **FE-26** | PWA Support | Medium | Service worker, offline install |
| **FE-27** | Touch Gestures | Low | Swipe gestures for mobile typing |
| **FE-28** | Accessibility Audit | High | Screen reader support, ARIA labels |

---

## 3. BACKEND AGENT TASKS

### Firebase Schema (Firestore)

#### Collections

```
users/{userId}
├── profile: { displayName, photoURL, createdAt }
├── settings: { theme, keyboardLayout, soundEnabled }
└── sessions/{sessionId}
    ├── wpm: number
    ├── accuracy: number
    ├── errorCount: number
    ├── consistency: number
    ├── timestamp: serverTimestamp
    ├── mode: 'practice' | 'exam'
    └── weakestKeys: string[]

leaderboard/{userId}
├── userId: string
├── displayName: string
├── photoURL: string
├── wpm: number (current)
├── highestWpm: number
├── totalRaces: number
├── accuracy: number
└── timestamp: serverTimestamp

fleets/{fleetId}
├── name: string
├── ownerId: string
├── members: string[]
├── missions: Mission[]
└── createdAt: serverTimestamp
```

### Completed Backend Work

| Task ID | Feature | Location | Status |
|---------|---------|----------|--------|
| **BE-01** | Firebase Auth | `packages/core/src/firebase/authStore.ts` | ✅ |
| **BE-02** | Session Storage | `packages/core/src/store.ts` (saveSession) | ✅ |
| **BE-03** | Leaderboard Hook | `packages/core/src/firebase/leaderboardHook.ts` | ✅ |
| **BE-04** | Stats Hook | `packages/core/src/firebase/statsHook.ts` | ✅ |
| **BE-05** | Progress Store | `packages/core/src/progressStore.ts` | ✅ |
| **BE-06** | Gamification | `packages/core/src/gamification.ts` | ✅ |
| **BE-07** | Mission Engine | `packages/core/src/missionEngine.ts` | ✅ |
| **BE-08** | Streak Manager | `packages/core/src/streakManager.ts` | ✅ |
| **BE-09** | Multiplayer Store | `packages/core/src/multiplayerStore.ts` | ✅ |
| **BE-10** | Fleet Store | `packages/core/src/fleetStore.ts` | ✅ |
| **BE-11** | Rust Typing Engine | `apps/desktop/src-tauri/src/typing_engine.rs` | ✅ |

### Remaining Backend Tasks (Future)

| Task ID | Feature | Priority | Description |
|---------|---------|---------|-------------|
| **BE-12** | Fleet Missions API | High | Team missions with real-time sync |
| **BE-13** | Real-time Race Sync | High | WebSocket/Firestore live updates |
| **BE-14** | Analytics Pipeline | Medium | Aggregated stats, trends |
| **BE-15** | Export API | Low | PDF/CSV report generation |

---

## 4. API CONTRACTS

### Frontend → Backend Data Contracts

#### Session Save Request

```typescript
interface SessionSaveRequest {
  wpm: number;
  accuracy: number;
  errorCount: number;
  consistency: number;
  weakestKeys: string[];
  timestamp: number;
  mode: 'practice' | 'exam';
  metadata?: {
    isRace?: boolean;
    isWinner?: boolean;
  };
}
```

#### Leaderboard Entry

```typescript
interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string | null;
  wpm: number;
  highestWpm: number;
  totalRaces: number;
  accuracy: number;
  lastWpm: number;
  timestamp: any; // Firestore timestamp
}
```

#### User Profile

```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  settings: UserSettings;
}

interface UserSettings {
  theme: 'dark' | 'light';
  keyboardLayout: 'qwerty' | 'colemak' | 'dvorak';
  soundEnabled: boolean;
  showVirtualKeyboard: boolean;
}
```

---

## 5. IMPLEMENTATION ORDER

### Sprint 1: Core Experience (Completed)

1. AppShell + Navigation
2. Typing Session + Real-time Stats
3. Dashboard with KPI Cards
4. Basic Settings

### Sprint 2: Engagement (Completed)

1. Achievements System
2. Streak & Missions
3. Leaderboard
4. Arena Racing

### Sprint 3: Multiplayer & Teams (Completed)

1. Multiplayer Store
2. Race Track Visualization
3. Fleet HQ
4. Protocol Architect

### Sprint 4: Analytics (Completed)

1. Stats Page
2. Neural Deck (3D)
3. Biometric Cloud

### Sprint 5: Polish & Mobile (Future)

1. Mobile Navigation
2. Storybook Setup
3. PWA Support
4. Accessibility Audit
5. Performance Optimization

---

## 6. TECHNICAL CONSTRAINTS

### Performance Budgets

| Metric | Target | Current |
|--------|--------|---------|
| Main Bundle | < 120KB | ✅ Monitored in CI |
| React Vendor | < 80KB | ✅ |
| Framer Motion | < 60KB | ✅ |
| CSS Bundle | < 50KB | ✅ |
| Typing FPS | 60 FPS | ✅ |

### Non-Functional Requirements

- **Accessibility**: Keyboard navigation, ARIA labels, reduced motion support
- **Offline**: LocalStorage fallback for sessions
- **Privacy**: No login wall for basic training
- **Responsive**: Mobile-first, 7 breakpoints

---

## 7. CI/CD PIPELINE

### Quality Gate Workflow

The project already has comprehensive CI/CD (`.github/workflows/quality-gate.yml`):

1. **Type Check** - TypeScript validation
2. **Lint** - ESLint with custom glassmorphism rules
3. **Tests** - Vitest unit tests (32 core tests)
4. **Build Desktop** - Tauri production build
5. **Build Web** - Next.js production build
6. **Performance Budget** - Bundle size verification

### Release Workflow

Existing at `.github/workflows/release.yml`:

- Builds Tauri installers for macOS/Windows
- Publishes to GitHub Releases

---

## 8. FILE REFERENCE

### Key Source Files

| Category | File | Purpose |
|----------|------|---------|
| **Stores** | `packages/core/src/store.ts` | Typing state & session logic |
| | `packages/core/src/progressStore.ts` | XP, badges, level |
| | `packages/core/src/settingsStore.ts` | User preferences |
| | `packages/core/src/navigationStore.ts` | View routing |
| **Firebase** | `packages/core/src/firebase/authStore.ts` | Authentication |
| | `packages/core/src/firebase/statsHook.ts` | Session queries |
| | `packages/core/src/firebase/leaderboardHook.ts` | Rankings |
| **Engine** | `apps/desktop/src-tauri/src/typing_engine.rs` | Rust performance |
| **Styles** | `apps/desktop/src/styles/tokens.css` | Design tokens |
| | `apps/desktop/src/styles/components.css` | Component styles |

---

Next phase ready? (W)
