# SheetCRM Project Research Report

## Product Overview

**Product Name:** SheetCRM
**Tagline:** A lightweight CRM using Google Sheets as database, built for small businesses and freelancers.
**Status:** Post-MVP phase (Core features complete, polish & nice-to-have features in progress)

---

## Core Features

✅ **Implemented:**
- Google OAuth 2.0 sign-in (Sign in with Google)
- Contact management (CRUD, search, filter)
- Company management (CRUD)
- Notes/Activities timeline
- Reminders with due dates
- Dashboard with stats (contacts, companies, reminders count, recent activities)
- Google Sheets sync (web app + direct Sheets editing, per-user spreadsheets)
- Dark mode with system preference detection
- User profile page (Avatar, name, email, stats, link to Google Sheet)
- Button loading states
- PostHog analytics integration (optional)
- Cloudflare Workers deployment-ready
- E2E testing with Playwright

⚠️ **In Progress:**
- Toast notifications (currently using alert() - needs Tailwind implementation)
- Keyboard navigation (optional enhancement)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Vite + React 18 + TypeScript + Tailwind CSS | Latest |
| **Backend** | Cloudflare Workers + Wrangler | v4.68.1 |
| **Database** | Google Sheets API v4 | Cloud-hosted |
| **Auth** | Google OAuth 2.0 | Standard flow |
| **Analytics** | PostHog (optional) | v1.354.4 |
| **Testing** | Playwright | v1.58.1 |
| **Styling** | Tailwind CSS + Autoprefixer | v3.4.4 |

---

## Target Audience

**Personas:**
1. **Small shop owners** (50-500 customers) - E-commerce on Facebook/Instagram
2. **Freelancers/Consultants** (20-200 clients) - Service providers needing CRM
3. **Small business sales staff** - Using Sheets but wanting CRM UI

**Problem Solved:**
- No expensive CRM infrastructure needed
- Data stays in user's Google Drive (privacy-first)
- Dual-mode: professional web interface + direct Sheets editing
- Vietnamese-optimized UX (supports diacriticals, long names)
- Zero setup complexity (just Google OAuth)

---

## Pricing Model

**Free/Open** - No commercial pricing model found. Deployed as self-hosted Cloudflare Worker with free tier support (generous API quotas for small businesses).

---

## Project Phase & Progress

**Current Phase:** Phase 4 - UI/UX Polish

**Completion Status:**
- Core infrastructure: 100% (Backend auth, API routes, Google Sheets integration)
- Feature implementation: 100% (All 8 features complete)
- UI/UX polish: ~80% (Responsive design, loading/error states done; toast notifications partially complete)
- Testing: Playwright E2E tests available

**Next Steps:**
- Complete toast notification system (replace alert() with Tailwind-styled toasts)
- Optional: Add keyboard navigation
- Deploy to production

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Google Sheets as DB** | User familiarity, zero infrastructure, data ownership |
| **Cloudflare Workers** | Edge computing, free tier, TypeScript support, easy deploy |
| **Per-user spreadsheets** | Data isolation, privacy, automatic creation on first login |
| **AES-GCM encrypted cookies** | Stateless auth, HttpOnly/Secure for token storage |
| **React Router + Context API** | Simple routing, lightweight auth state management |
| **Tailwind CSS** | Rapid UI development, utility-first approach |

---

## Deployment

Single Cloudflare Worker deployment:
- Serves both API (/api/v1/*) and frontend static assets (/)
- Frontend pre-built as static assets (Vite SPA)
- Environment secrets: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COOKIE_SECRET
- OAuth redirect: {production-url}/api/v1/auth/callback

---

## Data Model

**Sheets Structure (per user):**
- `contacts` - Name, email, phone, company_id, source, notes, timestamps
- `companies` - Name, industry, website, address, notes, timestamps
- `notes` - Contact ID, content, created_at (activity log)
- `reminders` - Contact ID, title, due_date, is_done, created_at

**Limitations:**
- 5,000 rows optimal per sheet
- 300 read requests/min, 60 write requests/min (API quota)
- 10 million cells max per spreadsheet

---

## Current Issues (From Git Status)

Uncommitted changes detected:
- `backend/wrangler.jsonc` - Modified
- `frontend/public/landing.html` - Added (new landing page in progress)
- `frontend/src/index.css` - Modified
- `frontend/src/pages/LoginPage.tsx` - Modified

---

## Summary

SheetCRM is a **production-ready, lightweight CRM** targeting Vietnamese small businesses. It's architecturally sound, feature-complete, and nearing polish phase. Key differentiator: **Google Sheets as primary database** eliminates infrastructure complexity while preserving user data ownership. Ideal for businesses already using Sheets but needing professional UI/UX layer.
