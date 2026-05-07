# AGENTS.md

## Cursor Cloud specific instructions

### Product overview
Luna is a mental health companion PWA (React + Vite) targeting Belgian/Flemish Dutch users. It relies on **Base44** (BaaS) for auth, database, and serverless functions. There is no self-hosted backend.

### Running the dev server
```
npm run dev
```
The Vite config sets `logLevel: 'error'`, so you won't see the typical "ready in …" banner — verify with `curl http://localhost:5173`.

### Environment variables
A `.env.local` file is required with at least:
```
VITE_BASE44_APP_ID=<app_id>
VITE_BASE44_APP_BASE_URL=<base44_backend_url>
```
Without real Base44 credentials the app still renders, but backend-dependent features (auth, AI chat, data persistence) will fail gracefully.

### Lint / Build
- `npm run lint` — ESLint (flat config). Pre-existing unused-import errors exist in the repo; they do not block the build.
- `npm run build` — Vite production build.

### No automated tests
The repository contains no test framework or test files. Validation is done via lint, build, and manual testing.

### Key gotchas
- The `@base44/vite-plugin` sets up an API proxy (`/api -> <VITE_BASE44_APP_BASE_URL>`). Requests fail silently if the URL is a placeholder.
- Stripe integration is stubbed out (calls `alert()`); no Stripe keys are needed for development.
- All 20 data entities are defined in `base44/entities/` and managed by the Base44 platform, not locally.
