# LUNA — Development Guide

## Overview

LUNA is a Belgian-Dutch digital companion app for people with BPD and ADHD, built around DBT (Dialectical Behavior Therapy). It's a React/Vite single-page application using the Base44 platform SDK for backend services.

## Cursor Cloud specific instructions

### Quick Reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Preview | `npm run preview` |

### Environment Variables

The app requires `VITE_BASE44_APP_ID` and `VITE_BASE44_APP_BASE_URL` in a `.env.local` file to connect to the Base44 backend. Without these, the app runs but cannot perform authentication or data operations.

### Architecture

- **Frontend**: React 18 + Vite 6 + Tailwind CSS 3 + Framer Motion
- **Backend**: Base44 platform (via `@base44/sdk` and `@base44/vite-plugin`)
- **Routing**: React Router DOM v6
- **State**: TanStack React Query for server state
- **UI Components**: Radix UI primitives + custom components
- **Styling**: Dark-only theme with warm amber accent (`#E8834A`) on near-black (`#0B0B14`)

### Key Notes

- The `@base44/vite-plugin` handles proxy configuration, HMR notifications, and analytics. It shows a warning `[base44] Proxy not enabled` when env vars are missing — this is non-blocking for development.
- ESLint is configured only for `src/components/` and `src/pages/` (ignores `src/lib/` and `src/components/ui/`). Run `npm run lint` to check.
- The existing codebase has 10 pre-existing unused-import lint errors. These are in the existing code and can be fixed with `npm run lint:fix`.
- Fonts are loaded via Google Fonts CDN in `index.html`: Instrument Serif (italic display) and Geist (body/UI).
- No git hooks or pre-commit checks are configured.
- Node.js 22+ is used (the repo works with the system Node).
