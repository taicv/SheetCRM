# CLAUDE.md - Project Configuration

## Vibe Builder Project Reference

### ⛔ CONTEXT OVERFLOW RECOVERY
**When context gets full or you feel lost in a long session:**
1. Re-read the vibe-builder skill: `.claude/skills/vibe-builder/SKILL.md`
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

### Project Summary
- **App Type**: Free open-source CRM using Google Sheets as database
- **Tech Stack**: Vite + React 18 + TypeScript + Tailwind CSS (frontend), Cloudflare Workers (backend), Google Sheets API v4 (database)
- **Core Features**: Google OAuth authentication, Contact/Company CRUD, Notes/Activities timeline, Reminders, Dashboard analytics, Dark mode, PostHog analytics
- **Current Phase**: Phase 4 (UI/UX Polish) - ~80% complete, ready for launch

### Primary Documentation
- `PRD.md` - Full product requirements (lazy-read sections when needed)
- `IMPLEMENTATION_PLAN.md` - Task tracking with checkboxes
- `TEST_PLAN.md` - Test cases and results (created in Phase 4)
- `README.md` - Setup and development guide
- `docs/project-overview-pdr.md` - Product overview and development requirements
- `docs/marketing-overview.md` - Marketing strategy and channel planning
- `docs/project-roadmap.md` - Product and marketing roadmap

### Coding Guidelines
- Follow `IMPLEMENTATION_PLAN.md` for tasks
- Use typed language as specified in PRD.md
- Mark completed tasks with `[x]`
- Keep code minimal and focused

---

## Marketing Context

### Product Information
- **Product Name**: SheetCRM
- **Tagline (Vietnamese)**: CRM ngay trên Google Sheets
- **Tagline (English)**: CRM right on Google Sheets
- **Website**: https://sheetcrm.taicv.workers.dev
- **GitHub Repository**: https://github.com/taicv/SheetCRM
- **Type**: Free open-source CRM

### Marketing Objective
**Product launch** with immediate focus on organic growth through community engagement, SEO, and Vietnamese-language content marketing.

### Target Audience Summary
- **Geography**: Vietnam (primary market)
- **Age Range**: 22-45 years old
- **Profiles**: Freelancers, solopreneurs, small business owners (2-10 staff), sales teams at SMEs
- **Psychographics**: Value simplicity, trust Google ecosystem, budget-conscious, prefer Vietnamese UX

### Key Competitive Advantages
1. Purpose-built CRM UI (not generic tool templates)
2. Completely free (vs. paid Airtable, Notion)
3. Vietnamese-optimized UX (vs. English-only international tools)
4. Data ownership in user's Google Drive (privacy by design)
5. Zero infrastructure cost (Cloudflare Workers free tier)

### Brand Identity
| Element | Value |
| --- | --- |
| Primary Color | #3B82F6 (Blue) |
| Secondary Color | #60A5FA (Light Blue) |
| Accent Color | #F97316 (Orange) |
| Background | #F8FAFC (Light Gray) |
| Dark Mode | Gray-800/700 palette |
| Primary Font | Poppins (headings) |
| Body Font | Open Sans (body text) |

### Marketing Strategy
- **Primary Channels**: SEO, Facebook content, Vietnamese developer/business communities
- **Budget**: $0 — organic content marketing only
- **Timeline**: Immediate launch
- **Focus**: Product-market fit validation in Vietnam market
