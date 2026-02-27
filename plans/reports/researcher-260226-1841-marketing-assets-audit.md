# SheetCRM Marketing Assets & Digital Presence Audit

## Executive Summary
SheetCRM has foundational marketing infrastructure with a Vietnamese-localized landing page, established design system, and partial social media scaffolding. Assets exist but are incomplete—placeholder social links remain unset.

---

## 1. Brand Assets

### Logos & Identity
- **Primary Logo**: Gradient box (70x70px) with blue-purple gradient (#667eea → #764ba2)
- **SVG Assets**: `vite.svg` (Vite default, not SheetCRM branded)
- **Favicon**: Referenced as `/favicon.svg` (not yet created/committed)
- **Status**: Logo exists in CSS only; no dedicated logo files in assets/

### Colors (Design Tokens)
**Primary Palette** (from index.css + landing.html):
- Primary: `#3B82F6` (Blue - Tailwind Blue 500)
- Secondary: `#60A5FA` (Light Blue - Tailwind Blue 400)
- Accent: `#F97316` (Orange - Tailwind Orange 500)
- Background: `#F8FAFC` (Slate Light) / `#f9fafb`
- Text: `#1E293B` (Slate Dark)
- Dark mode: `#1f2937`, `#374151`

**Login Page Gradient**: `#667eea → #764ba2` (Custom purple blend)

### Typography
- **Heading Font**: Montserrat (wght: 400, 500, 600, 700)
- **Body Font**: Open Sans (wght: 300, 400, 500, 600, 700)
- **Fallback**: Inter (system-ui, sans-serif)

---

## 2. Marketing Collaterals

### Landing Page
- **File**: `frontend/public/landing.html` (48KB)
- **Language**: Vietnamese (vi_VN locale)
- **Status**: Complete HTML file with SEO meta tags
- **Features**:
  - Open Graph / Twitter Card configured
  - og-image.png referenced (not found)
  - Deployment URL: `https://sheetcrm.taicv.workers.dev`

### Social Media Setup
- **Placeholder GitHub Links**:
  ```
  https://github.com/your-repo
  https://github.com/your-repo/issues
  ```
  Status: Needs actual repository URL

- **Meta Tags Present**: Twitter Card, OG tags ready
- **No Active Profiles Found**: No LinkedIn, Twitter, Facebook URLs detected

### Marketing Documents
- Reference files exist in `.claude/skills/`:
  - `domain-marketing.md`
  - `marketing-kpis.md`
  - `marketing-checklist.md`
  - `marketing-workflow.md`
- **Status**: Template/reference only, not production marketing content

---

## 3. Digital Assets

### Public Assets
- `landing.html` (production-ready)
- `manifest.json` (PWA manifest with theme color `#3b82f6`)
- `robots.txt` (SEO configured)
- `vite.svg` (placeholder, needs replacement)
- **Missing**: og-image.png (referenced in landing.html)

### No Dedicated Assets Directory
- `/assets/` directory does not exist
- No brand guidelines document found
- No product screenshots/mockups committed

---

## 4. Current Deployment & Domains

- **Production URL**: `https://sheetcrm.taicv.workers.dev` (Cloudflare Pages)
- **Deployment Platform**: Cloudflare Workers + Cloudflare Pages
- **Status**: Live deployment configured

---

## 5. Analytics & Tracking

- **PostHog Integration**: Optional, configured via `VITE_PUBLIC_POSTHOG_KEY`
- **Google OAuth**: OAuth consent screen configured (requires Google Cloud Console)
- **No Third-Party Analytics Links**: No GA, Mixpanel, or Segment integrations detected

---

## 6. Gap Analysis

| Asset | Status | Priority |
|-------|--------|----------|
| Brand Guidelines Document | Missing | High |
| Favicon.svg | Referenced but missing | Medium |
| OG Image (og-image.png) | Missing | High |
| Logo Files (PNG/SVG) | CSS-only | Medium |
| GitHub Repository URL | Placeholder | Critical |
| Social Media Profiles | None linked | Medium |
| Product Screenshots | Missing | Medium |
| Press Kit / Promotional Materials | Missing | Low |

---

## Key Findings

1. **Design System Established**: Consistent color palette and typography across landing + app
2. **Vietnamese Localization**: Landing page fully translated; targets Vietnam market
3. **Infrastructure Ready**: PWA manifest, meta tags, SEO basics in place
4. **Missing Assets**: No og-image.png, favicon.svg, or dedicated brand assets
5. **Social Links Incomplete**: Placeholder GitHub URL needs real repository link
6. **No Brand Guidelines**: No documented brand voice, imagery style, or usage rules
7. **Analytics Ready**: PostHog integrated but optional/unconfigured by default

---

## Unresolved Questions

1. What is the actual GitHub repository URL to replace placeholders?
2. Should og-image.png be generated/designed? (Recommended: 1200x630px)
3. Are there any existing brand guidelines or design systems?
4. What social media platforms are priority for SheetCRM (Twitter, LinkedIn, Dev.to)?
5. Should a comprehensive brand guidelines document be created?
