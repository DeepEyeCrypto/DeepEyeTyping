# DeepEyeTyping - Responsive Glass UI Style Guide

## Overview

This guide documents the design system for the DeepEyeTyping responsive glass UI. The system uses CSS custom properties for consistent theming, fluid typography, and motion effects.

---

## Table of Contents

1. [Breakpoints](#breakpoints)
2. [Design Tokens](#design-tokens)
3. [Glass Components](#glass-components)
4. [Motion Guidelines](#motion-guidelines)
5. [Responsive Patterns](#responsive-patterns)
6. [Accessibility](#accessibility)

---

## Breakpoints

The UI uses the following breakpoints:

| Name | Width | Description |
|------|-------|-------------|
| `xs` | 320px | Extra small mobile |
| `sm` | 480px | Small mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1440px | Large desktop |
| `3xl` | 1920px | Ultra-wide |

### CSS Usage

```css
/* Mobile first - base styles */
.my-element { }

/* Tablet and up */
@media (min-width: 768px) {
  .my-element { }
}

/* Tablet only */
@media (min-width: 768px) and (max-width: 1024px) {
  .my-element { }
}

/* Mobile only */
@media (max-width: 768px) {
  .my-element { }
}
```

---

## Design Tokens

### CSS Custom Properties

All tokens are defined in `apps/desktop/src/styles/tokens.css`:

#### Fluid Spacing

```css
--space-xs: clamp(0.25rem, 0.25rem + 0.25vw, 0.375rem);
--space-sm: clamp(0.5rem, 0.5rem + 0.5vw, 0.75rem);
--space-md: clamp(1rem, 0.75rem + 1vw, 1.5rem);
--space-lg: clamp(1.5rem, 1rem + 1.5vw, 2rem);
--space-xl: clamp(2rem, 1.5rem + 2vw, 3rem);
--space-2xl: clamp(3rem, 2rem + 3vw, 4rem);
```

#### Fluid Typography

```css
--font-size-xs: clamp(0.625rem, 0.5rem + 0.25vw, 0.75rem);
--font-size-sm: clamp(0.75rem, 0.625rem + 0.35vw, 0.875rem);
--font-size-base: clamp(0.875rem, 0.75rem + 0.5vw, 1rem);
--font-size-lg: clamp(1rem, 0.875rem + 0.65vw, 1.25rem);
--font-size-xl: clamp(1.25rem, 1rem + 1vw, 1.5rem);
--font-size-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
--font-size-3xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);
--font-size-4xl: clamp(2.25rem, 1.75rem + 2vw, 3rem);
--font-size-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);
```

#### Glass Effects

```css
--glass-bg: rgba(255, 255, 255, 0.08);
--glass-bg-hover: rgba(255, 255, 255, 0.14);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-shadow: 0 18px 45px rgba(15, 23, 42, 0.45);
--blur-lg: 18px;
--radius-xl: 24px;
```

#### Accent Colors

```css
--accent-cyan: #00fff2;
--accent-purple: #bc13fe;
--accent-green: #4ade80;
--accent-orange: #fb923c;
--accent-pink: #f973b8;
```

---

## Glass Components

### Glass Card

```html
<div class="glass-card">
  Content here
</div>

<!-- Interactive variant -->
<button class="glass-card glass-card-interactive">
  Click me
</button>

<!-- Small variant -->
<div class="glass-card glass-card-sm">...</div>

<!-- Large variant -->
<div class="glass-card glass-card-lg">...</div>
```

### Glass Button

```html
<button class="btn-glass">Default</button>
<button class="btn-glass btn-primary">Primary</button>
<button class="btn-glass btn-secondary">Secondary</button>
```

### Glass Input

```html
<input class="input-glass" placeholder="Enter text..." />
```

### Metric Card

```html
<div class="metric-card metric-card-cyan">
  <span class="metric-label">Neural Velocity</span>
  <span class="metric-value">85</span>
  <span class="metric-unit">WPM</span>
</div>
```

---

## Motion Guidelines

### Animation Duration

| Name | Duration | Use Case |
|------|----------|----------|
| `fast` | 120ms | Hover states, focus |
| `normal` | 160ms | Interactive elements |
| `slow` | 240ms | Page transitions |
| `spring` | 300ms | Bouncy effects |

### Motion Utilities

```css
/* Fade in */
<div class="motion-fade-in">...</div>

<!-- Fade in up with delay -->
<div class="motion-fade-in-up motion-delay-2">...</div>

<!-- Staggered children -->
<div class="stagger-children">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Hover lift -->
<div class="hover-lift">Hover me</div>

<!-- Press effect -->
<button class="press-effect">Press me</button>
```

### GPU Acceleration

For smooth animations, use the GPU accelerate hint:

```css
.gpu-accelerate {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

---

## Responsive Patterns

### Auto-Fit Grid

For responsive card grids that automatically adjust:

```css
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
}
```

### Fluid Typography

Always use clamp for responsive text:

```css
.heading {
  font-size: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
}
```

### Responsive Typing Area

```css
.typing-container {
  max-width: 960px;
  padding: clamp(1rem, 3vw, 2rem);
  font-size: clamp(1rem, 0.875rem + 0.5vw, 1.5rem);
}
```

### Responsive Keyboard

```css
.keyboard-grid {
  grid-template-columns: repeat(14, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .keyboard-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .keyboard-grid {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }
}
```

---

## Accessibility

### Reduced Motion

Always respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States

Always include visible focus indicators:

```css
.glass-surface:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 3px;
}
```

### Color Contrast

Ensure text meets WCAG AA standards:

- Primary text: `--text-primary` (#f1f5f9 on dark)
- Secondary text: `--text-secondary` (#94a3b8 on dark)
- Disabled text: `--text-tertiary` (#64748b on dark)

---

## File Structure

```
apps/desktop/src/
├── styles/
│   ├── tokens.css      # Design tokens (CSS custom properties)
│   ├── layout.css      # Responsive layout utilities
│   ├── motion.css      # Animation utilities
│   └── components.css # Component-specific styles
└── index.css           # Main entry (imports all)
```

---

## Theme Support

### Dark Mode (Default)

```css
:root {
  color-scheme: dark;
  --bg-root: radial-gradient(circle at top left, #0f172a, #020617);
  --text-primary: #f1f5f9;
}
```

### Light Mode

```css
[data-theme="light"] {
  --bg-root: radial-gradient(circle at top left, #f8fafc, #e2e8f0);
  --text-primary: #0f172a;
}
```

To toggle themes, add/remove the `data-theme="light"` attribute on the `<html>` element.

---

## Best Practices

1. **Use tokens over hardcoded values** - Always prefer `--space-md` over `1rem`
2. **Mobile first** - Write base styles for mobile, enhance for larger screens
3. **Respect reduced motion** - Always include prefers-reduced-motion support
4. **Use semantic HTML** - `<button>`, `<nav>`, `<main>`, etc.
5. **Test at all breakpoints** - Verify layout at 320px, 480px, 768px, 1024px, 1440px

---

## Related Files

- [DeepEyeTyping Responsive Glass UI "God Prompt"](./DEEPEYETYPING_PROMPT.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Performance Flow](./PERF_FLOW_TODO.md)
