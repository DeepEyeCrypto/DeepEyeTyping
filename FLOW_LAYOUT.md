# DeepEyeTyping FLOW LAYOUT Documentation

## Phase: L – LAYOUT

---

## 1. INFORMATION ARCHITECTURE (IA Tree)

### Top-Level Navigation

```
├── Dashboard (Home)
├── Train (Typing Session)
│   ├── Lesson Selector
│   └── Training Page
├── Arena (Multiplayer Racing)
│   ├── Race Lobby
│   └── Race Track
├── Neural Deck (3D Analytics)
├── Foundry (Protocol Architect - Custom Lessons)
├── Fleet HQ (Team Collaboration)
├── Stats (Analytics)
├── Honors (Achievements)
├── Ranking (Leaderboard)
└── Settings
```

### Navigation Structure

- **Desktop**: Left sidebar navigation (80px wide, glass-dock style)
- **Mobile**: Bottom sheet / slide-out drawer with hamburger toggle
- **Keyboard Shortcuts**: `Cmd/Ctrl + K` opens Command Palette for quick navigation

---

## 2. SCREEN-BY-SCREEN LAYOUT SPECS

### 2.1 App Shell (Root Layout)

**Layout Zones:**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌────┐ ┌────────────────────────────────────────────────┐  │
│  │    │ │  TOP BAR (Command Bar)                        │  │
│  │    │ ├────────────────────────────────────────────────┤  │
│  │ S  │ │                                                │  │
│  │ I  │ │                                                │  │
│  │ D  │ │           MAIN CONTENT AREA                    │  │
│  │ E  │ │                                                │  │
│  │ N  │ │                                                │  │
│  │ A  │ │                                                │  │
│  │ V  │ │                                                │  │
│  │    │ └────────────────────────────────────────────────┘  │
│  └────┘                                                   │
└─────────────────────────────────────────────────────────────┘
```

- **Ambient Background**: Cyberpunk gradient orbs (cyan/purple) with blur effects
- **Mobile**: SideNav becomes overlay drawer from left

### 2.2 Dashboard Page

**Layout Zones:**

```
┌────────────────────────────────────────────────────────────────────┐
│  TACTICAL HEADER                                                  │
│  [Greeting + User Status]                    [Initialize Sync Btn]│
├────────────────────────────────────────────────────────────────────┤
│  KPI GRID (4 columns)                                            │
│  [Neural Velocity] [Signal Stability] [Peak Bitrate] [Arena Dom] │
├───────────────────────────────────┬────────────────────────────────┤
│  RECOMMENDED PROTOCOLS           │  STREAK WIDGET                 │
│  [Lesson Card] [Lesson Card]     │  [Current Streak] [Shields]   │
│  [Lesson Card] [Lesson Card]     ├────────────────────────────────┤
│                                   │  MISSION LIST                  │
├───────────────────────────────────┤  [Daily Missions]              │
│  VELOCITY CHART (Area)           ├────────────────────────────────┤
│  [WPM/Accuracy over time]        │  PROFILE BIOMETRIC             │
│                                   │  [Avatar] [Level] [XP Bar]    │
├───────────────────────────────────┤  [Badges]                     │
│                                   ├────────────────────────────────┤
│                                   │  ACTIVITY HEATMAP              │
│                                   ├────────────────────────────────┤
│                                   │  SYSTEM STREAM                 │
└───────────────────────────────────┴────────────────────────────────┘
```

**Wireframe Description:**

- **Left/Center Panel (flex-2.5)**: Main operative hub
  - Tactical Header: User greeting with status badges
  - KPI Grid: 4 metric cards in 2x2 (desktop: 4x1)
  - Training Protocols: Lesson cards grid (2 columns)
  - Velocity Chart: Recharts AreaChart with WPM/Accuracy
- **Right Panel (flex-1)**: Intelligence sidebar
  - Streak + Missions row (2 columns)
  - Profile biometric card (circular XP progress)
  - Recent badges display
  - Activity heatmap (28 days, 7x4 grid)
  - System stream (telemetry logs)

### 2.3 Training Page (Typing Session)

**Layout Zones:**

```
┌─────────────────────────────────────────────────────────────┐
│  LESSON HEADER                                               │
│  [Lesson Title] [Progress Bar] [Timer]    [Exit] [Settings]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TYPING AREA (Focus Zone)                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Current text with highlighted current character       │  │
│  │ Correct: green/cyan | Incorrect: red                 │  │
│  │ Cursor: blinking neon pulse                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  INPUT DISPLAY                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ User input shown here (ghosting optional)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  HUD STRIP                                                  │
│  [WPM] [Accuracy %] [Errors] [Time] [Session Progress]    │
├─────────────────────────────────────────────────────────────┤
│  VIRTUAL KEYBOARD (Optional)                                │
│  [Key visualization with finger position hints]              │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Arena Page (Multiplayer Racing)

**Layout Zones:**

```
┌─────────────────────────────────────────────────────────────┐
│  ARENA HEADER                                               │
│  [Arena Title] [Players Count]              [Create/Join]  │
├─────────────────────────────┬───────────────────────────────┤
│  LOBBY                      │  LEADERBOARD                  │
│  [Room List]                │  [Live Rankings]              │
│  [Create Room]              │  [WPM] [Accuracy]             │
├─────────────────────────────┼───────────────────────────────┤
│  RACE TRACK                 │  COMPETITOR CARDS              │
│  [Track visualization]     │  [Player avatars]             │
│  [Progress lines]           │  [Current WPM]                │
└─────────────────────────────┴───────────────────────────────┘
```

### 2.5 Neural Deck (3D Analytics)

**Layout Zones:**

```
┌─────────────────────────────────────────────────────────────┐
│  DECK HEADER                                                │
│  [Neural Deck] [View Controls: 3D/2D] [Filters]            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  3D BIOMETRIC VISUALIZATION (WebGL/Three.js)               │
│  - Interactive 3D cloud/graph                              │
│  - Performance data mapped to 3D space                     │
│  - Zoom/rotate/pan controls                                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  DATA PANEL                                                 │
│  [Selected Metric Details] [Export Button]                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.6 Fleet HQ (Team Collaboration)

**Layout Zones:**

```
┌─────────────────────────────────────────────────────────────┐
│  FLEET HEADER                                                │
│  [Fleet Name] [Members Count] [Create/Join Fleet]           │
├─────────────────────────────────────────────────────────────┤
│  TEAM OVERVIEW              │  MISSIONS                     │
│  [Member Cards]             │  [Active Team Missions]       │
│  [Team Stats]              │  [Progress Bars]               │
├─────────────────────────────┤                               │
│  SPECTATOR MODE            │                                │
│  [Live Race View]          │                                │
└─────────────────────────────┴───────────────────────────────┘
```

### 2.7 Settings Page

**Layout Zones:**

```
┌─────────────────────────────────────────────────────────────┐
│  SETTINGS HEADER                                            │
│  [Settings Title]                                           │
├─────────────────────────────────────────────────────────────┤
│  CATEGORIES (Vertical Tabs)                                 │
│  ├─ Profile                                                │
│  ├─ Keyboard                                               │
│  ├─ Appearance                                              │
│  ├─ Sound                                                  │
│  ├─ Cloud Sync                                             │
│  └─ About                                                  │
├─────────────────────────────────────────────────────────────┤
│  SETTINGS PANEL                                             │
│  [Dynamic based on selected category]                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. RESPONSIVE BEHAVIOR

### Breakpoints

| Name | Width | Layout Changes |
|------|-------|----------------|
| `xs` | 320px | Single column, collapsed nav |
| `sm` | 480px | Single column, bottom nav |
| `md` | 768px | SideNav overlay drawer |
| `lg` | 1024px | SideNav visible (80px), 2-column dashboard |
| `xl` | 1280px | Full layout, expanded right panel |
| `2xl` | 1440px | Ultra-wide optimizations |
| `3xl` | 1920px | Multi-panel dashboard |

### Responsive Patterns

1. **Dashboard**: Right panel moves below main content on `< lg`
2. **KPI Grid**: 4 columns → 2 columns → 1 column
3. **Navigation**: SideNav → Drawer → Bottom tabs
4. **Typing Area**: Max-width 960px, centered, scales font

---

## 4. COMPONENT HIERARCHY

### Core Layout Components

```
AppShell
├── AmbientBackground
├── SideNav (Desktop)
│   ├── NavButton[] (with tooltips)
│   └── UserAuthButton
├── MobileNavOverlay (Mobile)
│   └── SideNav
├── TopBar (Command Bar)
│   ├── SearchButton (Cmd+K)
│   ├── Breadcrumbs
│   └── ThemeToggle
├── CommandPalette (Modal)
│   └── SearchInput
└── MainContent
    └── [Page Components]
```

### Reusable Glass Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `GlassCard` | Main surface container | `variant`, `size`, `interactive` |
| `GlassButton` | Primary action button | `variant` (primary/secondary), `size` |
| `GlassInput` | Text input field | `type`, `placeholder` |
| `MetricCard` | KPI display | `title`, `value`, `unit`, `color` |
| `NeonTabBar` | Tab navigation | `tabs`, `activeTab` |
| `KpiCard` | Dashboard metrics | `title`, `value`, `unit`, `icon`, `colorClass` |
| `LessonProtocolCard` | Lesson selection | `lesson`, `onSelect` |
| `ActivityHeatmap` | 28-day grid | `sessions` |
| `DashboardChart` | Area chart | `sessions` |
| `SystemStream` | Log display | `logs` |

---

## 5. DESIGN TOKENS (Reference)

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--accent-cyan` | `#00fff2` | Primary accent, success states |
| `--accent-purple` | `#bc13fe` | Secondary accent, XP/level |
| `--accent-green` | `#4ade80` | Success, correct |
| `--accent-orange` | `#fb923c` | Warning |
| `--accent-pink` | `#f973b8` | Highlights |
| `--glass-bg` | `rgba(255, 255, 255, 0.08)` | Card backgrounds |
| `--glass-border` | `rgba(255, 255, 255, 0.2)` | Borders |

### Spacing (Fluid)

- `--space-xs`: `clamp(0.25rem, 0.25rem + 0.25vw, 0.375rem)`
- `--space-sm`: `clamp(0.5rem, 0.5rem + 0.5vw, 0.75rem)`
- `--space-md`: `clamp(1rem, 0.75rem + 1vw, 1.5rem)`
- `--space-lg`: `clamp(1.5rem, 1rem + 1.5vw, 2rem)`

### Typography

- **Headings**: `font-black italic` with `tracking-tighter`
- **Body**: `font-mono` for data, regular sans for content
- **Labels**: `text-[10px] uppercase font-black tracking-[0.3em]`

### Effects

- **Glass**: `backdrop-blur-3xl`, `bg-black/40`, border `white/5`
- **Neon Glow**: `shadow-neon-cyan`, `shadow-neon-purple`
- **Gradients**: Radial backgrounds with cyan/purple orbs

---

## 6. ANIMATION & MOTION

### Duration Tokens

| Name | Duration | Use Case |
|------|----------|----------|
| `fast` | 120ms | Hover states, focus |
| `normal` | 160ms | Interactive elements |
| `slow` | 240ms | Page transitions |
| `spring` | 300ms | Bouncy effects |

### Key Animations

- **Page Enter**: `fadeInUp` with stagger
- **Hover Lift**: `translateY(-4px)` with glow
- **Active Indicator**: `layoutId` slide animation
- **Chart**: Recharts built-in with `animationDuration`

---

## 7. ACCESSIBILITY

- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Focus States**: `focus-visible` with cyan outline
- **Keyboard Nav**: Full tab navigation support
- **Color Contrast**: WCAG AA compliant

---

## 8. EXISTING COMPONENTS (Already Implemented)

| Component | Location | Status |
|-----------|----------|--------|
| `AppShell` | `apps/desktop/src/components/layout/AppShell.tsx` | ✓ |
| `SideNav` | `apps/desktop/src/components/layout/SideNav.tsx` | ✓ |
| `TopBar` | `apps/desktop/src/components/layout/TopBar.tsx` | ✓ |
| `CommandPalette` | `apps/desktop/src/components/layout/CommandPalette.tsx` | ✓ |
| `ThemeToggle` | `apps/desktop/src/components/layout/ThemeToggle.tsx` | ✓ |
| `DashboardPage` | `apps/desktop/src/components/dashboard/DashboardPage.tsx` | ✓ |
| `StreakWidget` | `apps/desktop/src/components/dashboard/StreakWidget.tsx` | ✓ |
| `MissionList` | `apps/desktop/src/components/dashboard/MissionList.tsx` | ✓ |
| `TrainingPage` | `apps/desktop/src/components/typing/TrainingPage.tsx` | ✓ |
| `TypingArea` | `apps/desktop/src/components/typing/TypingArea.tsx` | ✓ |
| `VirtualKeyboard` | `apps/desktop/src/components/typing/VirtualKeyboard.tsx` | ✓ |
| `LessonSelector` | `apps/desktop/src/components/typing/LessonSelector.tsx` | ✓ |
| `ArenaPage` | `apps/desktop/src/components/arena/ArenaPage.tsx` | ✓ |
| `RaceTrack` | `apps/desktop/src/components/arena/RaceTrack.tsx` | ✓ |
| `RacingPage` | `apps/desktop/src/components/arena/RacingPage.tsx` | ✓ |
| `NeuralDeck` | `apps/desktop/src/components/analytics/NeuralDeck.tsx` | ✓ |
| `BiometricCloud` | `apps/desktop/src/components/analytics/BiometricCloud.tsx` | ✓ |
| `FleetHQ` | `apps/desktop/src/components/fleet/FleetHQ.tsx` | ✓ |
| `ProtocolArchitect` | `apps/desktop/src/components/architect/ProtocolArchitect.tsx` | ✓ |
| `AchievementsPage` | `apps/desktop/src/components/achievements/AchievementsPage.tsx` | ✓ |
| `LeaderboardPage` | `apps/desktop/src/components/leaderboard/LeaderboardPage.tsx` | ✓ |
| `StatsPage` | `apps/desktop/src/components/stats/StatsPage.tsx` | ✓ |
| `SettingsPage` | `apps/desktop/src/components/settings/SettingsPage.tsx` | ✓ |

---

## 9. DESIGN SYSTEM FILES

| File | Purpose |
|------|---------|
| `apps/desktop/src/styles/tokens.css` | Design tokens (colors, spacing, typography) |
| `apps/desktop/src/styles/layout.css` | Layout utilities |
| `apps/desktop/src/styles/motion.css` | Animation utilities |
| `apps/desktop/src/styles/components.css` | Component styles |
| `packages/ui/src/theme.css` | Shared theme tokens |

---

Next phase ready? (O → W)
