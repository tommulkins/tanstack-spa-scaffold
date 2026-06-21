---
name: Scaffold
description: Default greenfield visual identity — dark slate surface, minimal chrome, readable hierarchy.
colors:
  background: '#020617'
  surface: '#0f172a'
  primary: '#f1f5f9'
  secondary: '#94a3b8'
  muted: '#64748b'
  border: '#1e293b'
  accent: '#f1f5f9'
  danger: '#f87171'
typography:
  heading:
    fontFamily: ui-sans-serif
    fontSize: 1.875rem
    fontWeight: '600'
  body:
    fontFamily: ui-sans-serif
    fontSize: 1rem
    lineHeight: '1.5'
  caption:
    fontFamily: ui-sans-serif
    fontSize: 0.875rem
    lineHeight: '1.25'
rounded:
  sm: 4px
  md: 6px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '#0f172a'
    rounded: '{rounded.md}'
    padding: 12px
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.md}'
    padding: 8px
---

## Overview

Dark, restrained UI for agent-assisted greenfield work. The layout should feel like a focused tool — not a marketing site. Prefer clarity and contrast over decoration.

Format: [google-labs-code/design.md](https://github.com/google-labs-code/design.md). Validate with `npx @google/design.md lint DESIGN.md`.

## Colors

- **Background (`#020617`):** Page canvas — slate-950.
- **Surface (`#0f172a`):** Inputs, cards, elevated panels — slate-900.
- **Primary (`#f1f5f9`):** Headlines and primary body text — slate-100.
- **Secondary (`#94a3b8`):** Metadata, helper copy — slate-400.
- **Muted (`#64748b`):** Placeholders, de-emphasized labels — slate-500.
- **Border (`#1e293b`):** Dividers and field outlines — slate-800.
- **Accent (`#f1f5f9`):** Primary actions — light on dark; pair with dark text.
- **Danger (`#f87171`):** Validation errors and destructive emphasis.

## Typography

System sans-serif stack (`ui-sans-serif`). Headings are semibold with tight tracking; body stays at 1rem for readability. Captions at 0.875rem for status lines and form hints.

## Do's and Don'ts

- **Do** use semantic HTML and `getByRole` / `getByLabel` friendly labels.
- **Do** keep one accent treatment for primary actions.
- **Don't** add a second accent color without updating this file.
- **Don't** put feature plans or API specs here — use `PLAN.md`.
