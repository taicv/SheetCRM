# GEMINI.md - Antigravity Project Configuration

## Vibe Builder Project Reference

### ⛔ CONTEXT OVERFLOW RECOVERY
**When context gets full or you feel lost in a long session:**
1. Re-read the vibe-builder skill: `.agent/skills/vibe-builder/SKILL.md`
2. Re-read `IMPLEMENTATION_PLAN.md` to check current progress
3. Re-read `TEST_PLAN.md` (if exists) to check test status
4. Follow the workflow strictly - especially the checkpoints below!

### ⚠️ WORKFLOW CHECKPOINTS (MANDATORY - DO NOT SKIP!)
| After Phase | Action |
| --- | --- |
| Phase 3 (Coding) complete | → Create TEST_PLAN.md → **⛔ STOP for Human review** |
| Phase 4 (Test Plan) approved | → Execute tests autonomously |
| Phase 5 (Testing) complete | → Report results → Enter Phase 6 loop |

**CRITICAL:** After finishing ALL coding tasks, you MUST:
1. Create TEST_PLAN.md
2. **⛔ STOP and wait for Human approval**
3. DO NOT run any tests until Human reviews TEST_PLAN.md!

### Project Summary (from PRD.md)
- **App Type**: Web app (SPA)
- **Tech Stack**: Vite + React + TypeScript + Tailwind CSS (Frontend), Cloudflare Workers (Backend), Google Sheets (Database)
- **Core Features**: 
  - Contact management (CRUD)
  - Company management (CRUD)
  - Notes/Activities timeline
  - Reminders with due dates
  - Dashboard stats
  - Google Sheets dual-mode (web app + direct Sheets editing)
  - **Google OAuth 2.0 user authentication** (Sign in with Google)
- **Infrastructure**: Cloudflare Pages (static hosting) + Cloudflare Workers (API)
- **Auth**: OAuth 2.0 (user signs in with Google, grants Sheets access)

### Current Phase
- **Status**: Phase 6 (Fine-tune & Loop) — OAuth 2.0 migration complete, awaiting TEST_PLAN review
- **Next**: Manual testing with real Google OAuth credentials

### Auth Architecture (OAuth 2.0)
- Backend handles full OAuth flow (login redirect, callback, token exchange)
- Sessions stored in AES-GCM encrypted HttpOnly cookies (stateless)
- Auto token refresh when access token expires
- All data endpoints protected (return 401 if not authenticated)
- Frontend shows login page if unauthenticated

### Primary Documentation
- `PRD.md` - Full product requirements
- `IMPLEMENTATION_PLAN.md` - Task tracking (all complete ✅)
- `TEST_PLAN.md` - OAuth 2.0 test cases + Google Cloud Console setup instructions

### Coding Guidelines
- Follow `IMPLEMENTATION_PLAN.md` for tasks
- Use TypeScript with strict types
- Mark completed tasks with `[x]`
- Keep code minimal and focused
- Use `pnpm` instead of npm (user preference)

### Google Sheet Database
- **Spreadsheet ID**: `1qqciTWousoyZf1ZlIo7HWAQM2i81sJRWdF5nuZr8KN0`
- **Sheets**: contacts, companies, notes, reminders

### Environment Variables (backend/.dev.vars)
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
COOKIE_SECRET=random-string-32-chars-min
```

### Running the Application
```bash
# Backend (Cloudflare Workers)
cd backend && pnpm wrangler dev

# Frontend (Vite)
cd frontend && pnpm dev
```

### Known Issues
1. **TC-04 Reminder Delete**: Automation had trouble with confirm dialog. Manual deletion works.
