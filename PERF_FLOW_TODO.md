# DeepEyeTyping Performance Optimization - TODO

## PERF-FLOW Tracking

### P0 - PROFILE (MEASURE FIRST) ✅ COMPLETED

**Main Pain Point:** Animations / UI smoothness  
**Target Devices:** All (Mac/Windows/Linux)

#### TOP 3 SUSPECTS IDENTIFIED

1. **RENDER: VirtualKeyboard** - `layout` prop on every Key causing expensive layout recalculations + AnimatePresence on each keypress
2. **RENDER: TypingArea** - Character status recalculation on every keystroke + NeuralCursor animations
3. **RENDER: FeedbackAnimations** - Expensive blur filters and box-shadow animations triggering GPU-heavy repaints

---

### P1 - RENDER PERFORMANCE (REACT/UI) ✅ COMPLETED

#### Fixed Issues

1. **VirtualKeyboard.tsx** ✅
   - Removed expensive `layout` prop from motion.div
   - This was causing 50+ key re-layouts on every keystroke

2. **FeedbackAnimations.tsx** ✅
   - LevelUpAnimation: Replaced animated boxShadow with static CSS shadow
   - LevelUpAnimation: Changed blur-3xl to CSS filter (less GPU intensive)
   - BadgeUnlock: Replaced animated boxShadow with static shadow
   - BadgeUnlock: Changed blur-xl to CSS filter

3. **DashboardPage.tsx** ✅
   - SystemStream: Pre-calculate timestamp outside render loop (cached for 1 second)
   - Fixed creating new Date object on every log entry every render

---

### P2 - BUNDLE OPTIMIZATION (JS/CSS/assets) ✅ COMPLETED

- [x] Analyze bundle sizes (Vite/Next stats)
- [x] Implement code splitting
- [x] Optimize asset loading
- [x] Tree-shaking improvements

### P3 - DATA OPTIMIZATION (Firebase/Firestore/API) ✅ COMPLETED

- [x] Analyze Firestore queries
- [x] Optimize read/write patterns (reduced limits)
- [x] Implement caching strategies (30s/60s TTL)
- [x] Reduce index fanout

### P4 - TAURI OPTIMIZATION (Desktop Runtime) ✅ COMPLETED

- [x] Analyze Tauri binary size
- [x] Optimize Rust code (typing_engine.rs) - already optimized
- [x] Configure build optimizations (window size, CSP)
- [x] Reduce runtime overhead

### P5 - MONITOR (Metrics & CI Guards) ✅ COMPLETED

- [x] Set up performance metrics collection
- [x] Add CI performance gates
- [x] Implement Web Vitals tracking
- [x] Add bundle size budgets

---

## Key Files Modified

- ✅ apps/desktop/src/components/typing/VirtualKeyboard.tsx
- ✅ apps/desktop/src/components/session/FeedbackAnimations.tsx
- ✅ apps/desktop/src/components/dashboard/DashboardPage.tsx

---

## Performance Improvements Expected

### VirtualKeyboard

- **Before:** Every keystroke triggered 50+ motion.div `layout` recalculations
- **After:** Using transform-based animations only (no layout trashing)

### FeedbackAnimations

- **Before:** GPU-heavy animated boxShadow + blur-3xl/blur-xl running on main thread
- **After:** Static CSS shadows + CSS filter (runs on compositor thread)

### DashboardPage SystemStream

- **Before:** Created new Date() object for every log entry, every render
- **After:** Timestamp cached for 1 second, reused across all log entries
