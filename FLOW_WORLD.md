# DeepEyeTyping FLOW WORLD Documentation

## Phase: W – WORLD

---

## 1. REPOSITORY & BRANCH STRATEGY

### Branch Naming Convention

```
main              # Production-ready code
├── develop       # Integration branch
├── feature/*     # New features (e.g., feature/mobile-nav)
├── fix/*        # Bug fixes (e.g., fix/typing-lag)
├── hotfix/*     # Urgent production fixes
└── release/*    # Release preparation
```

### PR Workflow

1. Create feature branch from `develop`
2. Implement changes with passing tests
3. Open PR to `develop` with description
4. CI runs quality gate (lint, typecheck, tests, build)
5. Code review by maintainer
6. Merge to `develop`
7. Release to `main` via PR or tag

---

## 2. CI/CD PIPELINES

### Quality Gate Workflow (`.github/workflows/quality-gate.yml`)

Already implemented with the following jobs:

```yaml
# Triggers
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Jobs:
1. audit:
   - Checkout
   - Setup Node.js 20
   - Install Dependencies (npm install)
   - Type Check (fast)
   - Neural Lint (ESLint)
   - Tests (Vitest - 32 core tests)
   - Build Desktop (Tauri)
   - Build Web (Next.js)
   - Performance Budget Checks
```

### Release Workflow (`.github/workflows/release.yml`)

Builds and publishes Tauri installers:

- macOS `.app` / `.dmg`
- Windows `.exe` / `.msi`
- Linux `.AppImage` / `.deb`

---

## 3. ENVIRONMENT CONFIGURATION

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:5173 | Local dev (Tauri) |
| Staging | `staging.deepeye.systems` | Pre-release testing |
| Production | `deepeye.systems` | Live users |

### Secrets Management

Required secrets (GitHub Secrets):

```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Environment Variables

```bash
# .env.local (Desktop)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...

# .env.production
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 4. DEPLOYMENT

### Desktop (Tauri)

```bash
# Development
npm run tauri dev -w desktop

# Production Build
npm run tauri build -w desktop
```

Output: `apps/desktop/src-tauri/target/release/bundle/`

### Web (Next.js)

```bash
# Development
npm run dev -w web

# Production Build
npm run build -w web

# Deploy to Vercel
vercel --prod
```

---

## 5. TESTING STRATEGY

### Unit Tests (Vitest)

Location: `packages/core/**/*.test.ts`

```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

Current tests:

- `analytics.test.ts`
- `analytics_advanced.test.ts`
- `gamification.test.ts`
- `multiplayerStore.test.ts`
- `progressStore.test.ts`
- `store.test.ts`

### Integration Tests

Location: `apps/desktop/src/**/*.test.tsx` (future)

### Visual Regression Testing

Recommended setup: **Chromatic** or **Playwright**

```bash
# Playwright example
npx playwright test --visual-regression
```

---

## 6. PERFORMANCE BUDGETS

### Bundle Size Limits

| Asset | Limit | Enforced In |
|-------|-------|-------------|
| Main Bundle | < 120KB | CI quality gate |
| React Vendor | < 80KB | CI quality gate |
| Framer Motion | < 60KB | CI quality gate |
| CSS Bundle | < 50KB | CI quality gate |

### Runtime Performance

- Typing FPS: 60 FPS minimum
- Initial Load: < 3 seconds
- Time to Interactive: < 2 seconds

---

## 7. ACCESSIBILITY & UX QA

### Automated Checks

```yaml
# Lighthouse CI (example)
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      http://localhost:3000
    budgetPath: ./lighthouse-budget.json
```

### Manual QA Checklist

#### Visual Consistency

- [ ] Glassmorphism surfaces render correctly
- [ ] Neon glow effects visible
- [ ] Animations smooth at 60FPS
- [ ] Dark/light theme toggle works

#### Responsive

- [ ] Mobile (< 768px): Navigation drawer works
- [ ] Tablet (768-1024px): 2-column layout
- [ ] Desktop (> 1024px): Full layout with sidebar
- [ ] Ultra-wide (> 1440px): No overflow

#### Accessibility

- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus visible indicators
- [ ] Reduced motion respected
- [ ] Color contrast WCAG AA

#### Functional

- [ ] Typing session starts/ends correctly
- [ ] Stats calculate accurately
- [ ] Session saves to Firebase
- [ ] Offline mode works (LocalStorage)
- [ ] Leaderboard loads

---

## 8. MONITORING & TELEMETRY

### Recommended Tools

| Purpose | Tool |
|---------|------|
| Product Analytics | PostHog |
| Error Tracking | Sentry |
| Performance | Vercel Analytics |
| Uptime | UptimeRobot |

### Custom Telemetry

Location: `packages/core/src/telemetry.ts`

Track events:

- Session start/complete
- Page views
- Feature usage
- Errors

---

## 9. BUILD ARTIFACTS

### Desktop Builds

```
apps/desktop/src-tauri/target/release/bundle/
├── macos/
│   ├── DeepEyeTyping.app
│   └── DeepEyeTyping_x.x.x_x64.dmg
├── windows/
│   ├── DeepEyeTyping_x.x.x_x64-setup.exe
│   └── DeepEyeTyping_x.x.x_x64.msi
└── linux/
    ├── deep-eyetyping_x.x.x_amd64.AppImage
    └── deep-eyetyping_x.x.x_amd64.deb
```

### Web Builds

```
apps/web/.next/
├── standalone/     # Optimized for Vercel
├── static/        # Static assets
└── server/       # Server functions
```

---

## 10. DEPLOYMENT COMMANDS

### Quick Start

```bash
# Install
npm install

# Development
npm run tauri dev -w desktop    # Desktop
npm run dev -w web             # Web

# Build
npm run build -w desktop       # Desktop
npm run build -w web           # Web

# Test
npm run test                   # Unit tests
npm run lint                   # ESLint
npm run typecheck              # TypeScript
```

### Release Process

```bash
# 1. Update version in package.json
npm version patch  # or minor/major

# 2. Create git tag
git tag vx.x.x
git push origin main --tags

# 3. CI builds and releases automatically
#    See .github/workflows/release.yml
```

---

## 11. TROUBLESHOOTING

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Node.js version (20+), Rust version |
| Type errors | Run `npm run typecheck` locally |
| Lint errors | Run `npm run lint --fix` |
| Test failures | Check Firebase emulators running |
| Bundle too large | Run `npm run build` and check sizes |

### Debug Mode

```bash
# Enable debug logging
DEBUG=deepeye:* npm run tauri dev

# React DevTools
npm run tauri dev -- --inspect-brk
```

---

## 12. DOCUMENTATION

### Existing Documentation Files

| File | Purpose |
|------|---------|
| `FLOW_FRAME.md` | Product Vision, SOP, Roadmap |
| `FLOW_LAYOUT.md` | IA, Screens, Components |
| `FLOW_ORCHESTRATION.md` | Work Breakdown, API Contracts |
| `FLOW_WORLD.md` | CI/CD, Deployment, QA |
| `UI_STYLE_GUIDE.md` | Design System Reference |
| `DEVELOPER_GUIDE.md` | Developer Setup Guide |
| `README.md` | Project Overview |

---

## 13. ONBOARDING CHECKLIST

For new developers:

- [ ] Clone repository
- [ ] Install Node.js 20+, Rust
- [ ] Run `npm install`
- [ ] Configure Firebase (create project, add `.env`)
- [ ] Run `npm run tauri dev`
- [ ] Read `FLOW_FRAME.md` for context
- [ ] Read `UI_STYLE_GUIDE.md` for design
- [ ] Pick an issue from `FLOW_ORCHESTRATION.md`

---

## 14. FUTURE IMPROVEMENTS

| Improvement | Priority | Description |
|-------------|----------|-------------|
| PWA Support | Medium | Service worker, offline install |
| Mobile Apps | Medium | React Native / Capacitor |
| Storybook | Medium | Component documentation |
| E2E Tests | High | Playwright full tests |
| Lighthouse CI | High | Automated performance audits |

---

## FLOW Complete ✅

All four phases have been documented:

- **F – FRAME**: Product vision, users, roadmap, tech stack
- **L – LAYOUT**: IA, screens, components, responsive specs
- **O – ORCHESTRATION**: Work breakdown, API contracts, sprints
- **W – WORLD**: CI/CD, deployment, QA, monitoring

The DeepEyeTyping project is well-structured with comprehensive tooling in place. The main areas for future improvement are mobile navigation, PWA support, and expanded E2E testing.
