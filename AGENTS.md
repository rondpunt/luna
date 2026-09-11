# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Luna is a Dutch-language mental health companion web app (React 18 + Vite 6). The entire backend (database, auth, serverless functions, AI/LLM) is hosted on the **Base44 platform** — nothing runs locally except the Vite dev server.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (serves on `http://localhost:5173`) |
| Lint | `npm run lint` (ESLint, scoped to `src/components/` and `src/pages/`) |
| Lint fix | `npm run lint:fix` |
| Build | `npm run build` |
| Preview build | `npm run preview` |

### Important notes

- **No local backend or database is needed.** All 23+ entity types, auth, and serverless functions are managed by Base44's remote BaaS.
- **Base44 credentials** (`VITE_BASE44_APP_ID` and `VITE_BASE44_APP_BASE_URL`) must be set in `.env.local` for the backend proxy to work. Without them, the Vite dev server starts and serves the frontend, but API calls to Base44 will fail. The app will display its onboarding/login UI regardless.
- **No automated test suite exists** in this codebase. There are no test files or test runner configured. Validation is limited to `npm run lint` and `npm run build`.
- **ESLint scope**: Only files in `src/components/` and `src/pages/` are linted (excluding `src/lib/` and `src/components/ui/`). The `--quiet` flag is used by default to suppress warnings.
- **Backend functions** live in `base44/functions/*/entry.ts` (Deno/TypeScript). These are deployed to Base44, not run locally.
- The build warning `[base44] Proxy not enabled (VITE_BASE44_APP_BASE_URL not set)` is expected when Base44 credentials are not configured — the frontend still builds and serves correctly.
