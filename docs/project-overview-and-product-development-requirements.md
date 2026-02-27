# SheetCRM - Product Overview & Development Requirements

**Last Updated**: February 26, 2026
**Status**: Phase 4 (UI/UX Polish) — ~80% complete, ready for launch

---

## Executive Summary

SheetCRM is a **free, open-source CRM application** that uses Google Sheets as its database, designed specifically for Vietnamese small businesses, freelancers, and SME sales teams. The product combines a modern web interface with the flexibility of direct Google Sheets editing, eliminating the need for complex database infrastructure while keeping costs at zero.

**Key Value Proposition**: Professional CRM management without infrastructure complexity, monthly costs, or vendor lock-in.

---

## Product Description

### What is SheetCRM?

SheetCRM is a lightweight CRM system that stores data in Google Sheets while providing a user-friendly web interface for customer relationship management. Users can manage contacts, companies, activities, and reminders through both the web app and direct Sheets editing.

### Why Google Sheets?

1. **No infrastructure cost** — Sheets is free for users with Google accounts
2. **Privacy by design** — Data remains in user's own Google Drive
3. **Familiar to users** — Most Vietnamese SMEs already use Google Sheets
4. **Dual-mode workflow** — Professional app UI + raw Sheets access when needed
5. **Zero vendor lock-in** — Data is standard Sheets format, always portable

### Target Market

- **Geography**: Vietnam (primary), Southeast Asia (secondary)
- **Company Size**: 1-50 employees (solopreneurs to small SMEs)
- **Job Roles**:
  - Freelancers and consultants managing client relationships
  - E-commerce store owners (Shopee, Facebook Commerce)
  - Sales teams at small companies
  - Business development managers
  - Support/customer success teams

---

## User Personas

### Persona 1: Chủ cửa hàng online (E-commerce Store Owner)

**Profile**: Sells products on Facebook Marketplace, Instagram, or Shopee with 50-500 customers

**Pain Points**:
- Customers saved in phone or scattered across messaging apps
- No organized follow-up system
- Difficult to track purchase history and customer preferences
- No reminder system for follow-ups

**Needs**:
- Simple contact storage with notes about each customer
- Order history and purchase tracking
- Follow-up reminders for repeat sales
- Works offline (Google Sheets can be downloaded)

**Success Metric**: Increases repeat purchases by 20% through better customer tracking

---

### Persona 2: Freelancer / Tư vấn viên (Freelance Consultant)

**Profile**: Independent consultant managing 20-200 client relationships

**Pain Points**:
- Client info scattered across emails and notes
- Difficult to track project history with each client
- No organized pipeline for potential deals
- Struggles to follow up consistently

**Needs**:
- Centralized client database with contact details
- Project/engagement history timeline
- Deal pipeline tracking (prospecting → proposal → closed)
- Simple, doesn't require learning new tools

**Success Metric**: Closes deals 30% faster with better prospect tracking

---

### Persona 3: Sales Team Member (SME Sales Rep)

**Profile**: Sales representative at small company (2-10 person team) with 100+ accounts

**Pain Points**:
- Manager requires team to use Google Sheets for reporting
- Lacks professional CRM interface
- Difficult to collaborate on customer information
- Can't track team activities effectively

**Needs**:
- Professional CRM interface but stores data in Sheets (for manager visibility)
- Multi-user access with activity tracking
- Company-wide dashboard
- Easy onboarding (minimal training)

**Success Metric**: Team closes 25% more deals with organized pipeline visibility

---

## Core Features

| Feature | Description | Priority | Status |
| --- | --- | --- | --- |
| **Google OAuth Authentication** | Secure sign-in with Google account | P0 | ✅ Complete |
| **Contact Management** | Create, read, update, delete contacts with email, phone, company | P0 | ✅ Complete |
| **Company Management** | Organize contacts by company, track company details | P0 | ✅ Complete |
| **Notes & Activities** | Timeline of interactions with contacts/companies | P0 | ✅ Complete |
| **Reminders** | Set follow-up reminders with due dates | P0 | ✅ Complete |
| **Dashboard** | Overview with stats, recent activities, upcoming reminders | P0 | ✅ Complete |
| **Google Sheets Sync** | Real-time two-way sync with Google Sheets | P0 | ✅ Complete |
| **Dark Mode** | System preference detection + toggle | P1 | ✅ Complete |
| **User Profile** | View user info, see stats, access Sheets directly | P1 | ✅ Complete |
| **Toast Notifications** | Feedback for all user actions | P1 | ✅ Complete |
| **Analytics (PostHog)** | Track usage patterns and feature adoption | P1 | ✅ Complete |

---

## Marketing Objectives

### Primary Objective
Launch SheetCRM as a free, Vietnamese-first CRM solution and establish product-market fit within Vietnamese SME community.

### Secondary Objectives
1. Build initial user base of 500+ active users within 3 months
2. Establish thought leadership in "simple CRM for SMEs" space
3. Create community of advocates who recommend the product
4. Generate organic SEO traffic for key Vietnamese search terms
5. Gather user feedback to inform Phase 2 feature prioritization

### Key Performance Indicators (KPIs)

| Metric | Target | Timeline |
| --- | --- | --- |
| GitHub Stars | 100+ | 3 months |
| Active Users | 500+ | 3 months |
| Contacts Created (across all users) | 50,000+ | 3 months |
| Website Visitors | 10,000+ unique/month | Month 2 |
| Community Posts/Mentions | 50+ | 3 months |
| Email Subscribers | 200+ | 3 months |

---

## Brand Guidelines Summary

### Visual Identity

**Color Palette**:
- Primary: #3B82F6 (Blue) — Trust, professionalism
- Secondary: #60A5FA (Light Blue) — Accessibility, lightness
- Accent: #F97316 (Orange) — Action, energy
- Background: #F8FAFC (Light Gray) — Cleanliness
- Dark Mode: Gray-800/700 — User comfort

**Typography**:
- Headings: Montserrat (Google Fonts) — Modern, friendly
- Body: Open Sans (Google Fonts) — Readable, universal
- Monospace: JetBrains Mono (code examples)

### Brand Tone

- **Professional but approachable** — Business tool but not corporate jargon
- **Vietnamese-first** — Content and UX optimized for Vietnamese users
- **Simple and clear** — Avoid unnecessary complexity
- **Action-oriented** — Focus on business results and time savings

### Logo
CSS-only gradient badge (no SVG file yet) — can be rendered dynamically in web app

---

## Competitive Analysis

### Direct Competitors

| Competitor | Strengths | Weaknesses | Our Advantage |
| --- | --- | --- | --- |
| **Notion CRM Templates** | Popular, flexible | Generic, steep learning curve | Purpose-built CRM UI |
| **Airtable** | Powerful, visual | Expensive ($20+/month), complex | Completely free, simpler |
| **Manual Google Sheets** | Free, familiar | No UI, labor-intensive | Professional UI + Sheets |

### Market Position
**The Free, Simple Alternative**
- For teams unwilling or unable to pay for Airtable/Salesforce
- For users who already live in Google ecosystem
- For Vietnamese market where payment friction is high

### Competitive Advantages
1. **Zero cost** — Free forever, no hidden fees
2. **Data ownership** — Stays in user's Google Drive
3. **Vietnamese UX** — Language, examples, community
4. **Dual workflow** — App + Sheets, not one or the other
5. **Privacy-first** — No vendor data harvesting
6. **Quick implementation** — 5 minutes from signup to first contact

---

## Success Metrics

### Product Metrics

| Metric | Success Target | How We Measure |
| --- | --- | --- |
| Feature completion | 100% of MVP features | Internal tracking |
| App load time | < 2 seconds | Lighthouse audit, monitoring |
| Error rate | < 0.1% | Error tracking (Sentry/Cloudflare logs) |
| Uptime | 99.9% | Cloudflare Workers availability |
| Contact limit per user | 5,000+ contacts | Load testing |

### Market Metrics

| Metric | Success Target | How We Measure |
| --- | --- | --- |
| Onboarding time | < 5 minutes signup-to-first-contact | User testing |
| Feature adoption | 80% users create contacts within week 1 | PostHog analytics |
| Retention (Month 1) | > 40% return rate | User login tracking |
| NPS (Net Promoter Score) | > 50 | User survey |
| Monthly active users | 500+ by Month 3 | Application logs |

### Business Metrics

| Metric | Success Target | How We Measure |
| --- | --- | --- |
| GitHub stars | 100+ | GitHub API |
| Community mentions | 50+ | Google Alerts, Facebook monitoring |
| Email newsletter subscribers | 200+ | Email platform analytics |
| Content reach | 50,000+ impressions/month | Social/SEO analytics |

---

## Non-Functional Requirements

### Performance
- Page load time: < 2 seconds (Lighthouse score > 85)
- API response time: < 500ms
- Support 5,000+ contacts per user
- Handle 100+ concurrent users

### Reliability
- Uptime: 99.9% (Cloudflare Workers SLA)
- Auto-recovery from transient failures
- Data backup via Google Sheets (implicit)
- Graceful degradation on network loss

### Security
- OAuth 2.0 authentication (no password storage)
- HttpOnly session cookies
- HTTPS encryption (Cloudflare standard)
- XSS and CSRF protection via Vite + React defaults
- No sensitive data in logs

### Scalability
- Horizontal scaling via Cloudflare Workers auto-scale
- No database size limits (Google Sheets allows 5M cells per sheet)
- CDN caching for static assets

### Accessibility
- WCAG 2.1 AA compliance (keyboard navigation, color contrast)
- Screen reader support (semantic HTML, ARIA labels)
- Mobile responsive (iOS Safari, Android Chrome)

### Localization
- Vietnamese primary language
- English translation for international users
- Date/number formatting per locale
- RTL support for future Arabic/Hebrew

---

## Technical Architecture Summary

### Tech Stack
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers (serverless)
- **Database**: Google Sheets API v4 + Google Drive API
- **Authentication**: Google OAuth 2.0
- **Analytics**: PostHog (optional)
- **Testing**: Playwright E2E + vitest (unit tests)

### Key Design Decisions

1. **Cloudflare Workers** — Zero server management, free tier sufficient for MVP, auto-scaling
2. **Google Sheets** — Eliminates database infrastructure, provides implicit backups
3. **React** — Component-based, large community, good TypeScript support
4. **Tailwind CSS** — Rapid UI development, consistent design system
5. **OAuth 2.0** — No password management, integrates with Google Sheets naturally

### Data Flow

```
User → Login (OAuth) → Session (HttpOnly Cookie)
  → API Requests (Cloudflare Worker)
  → Google Sheets API (CRUD operations)
  → Google Drive (data storage)
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Google API quota limits | Low | High | Implement caching, rate limiting, quota monitoring |
| User confusion (Sheets vs app) | Medium | Medium | Clear documentation, UI hints, video tutorial |
| Data sync conflicts | Low | Medium | Last-write-wins, conflict logging, user notification |
| Cloudflare Workers limits | Low | Medium | Monitor usage, optimize code, fallback to paid tier if needed |
| Vietnamese market saturation | Low | Medium | Focus on niche (freelancers), build community first |

---

## Roadmap

### Phase 1: Launch Preparation (Week 1-2)
- [ ] Final QA and bug fixes
- [ ] Create marketing assets (landing page, screenshots)
- [ ] Set up social media accounts (Facebook)
- [ ] Write launch blog post
- [ ] Deploy to production

### Phase 2: Soft Launch (Week 3-4)
- [ ] Launch to Vietnamese developer communities (Reddit, Facebook groups)
- [ ] Gather initial user feedback
- [ ] Fix critical issues from early users
- [ ] Publish tutorial videos
- [ ] Create FAQ documentation

### Phase 3: Growth (Month 2-3)
- [ ] Expand SEO content (blog posts)
- [ ] Partner with Vietnamese tech bloggers for reviews
- [ ] Launch referral program (encourage user sharing)
- [ ] Analyze feature usage, plan Phase 2 features
- [ ] Build community (Discord or Facebook group)

### Phase 4: Scale (Month 4-6)
- [ ] Implement top requested features
- [ ] Explore monetization (optional paid tier for advanced features)
- [ ] Expand to English-speaking markets
- [ ] Build integration partnerships

---

## Next Steps

1. **Final QA**: Execute comprehensive testing plan
2. **Launch**: Deploy to production environment
3. **Announce**: Publish launch post on GitHub, social media
4. **Monitor**: Track analytics, user feedback, error rates
5. **Iterate**: Weekly feedback review, bug fixes, quick wins
