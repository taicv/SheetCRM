# SheetCRM - Codebase Summary & Architecture Overview

**Last Updated**: February 26, 2026
**Status**: Phase 4 (UI/UX Polish) — ~80% complete

---

## Quick Reference

**Project Type**: Free, open-source CRM using Google Sheets as database

**Tech Stack**:
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers (serverless)
- **Database**: Google Sheets API v4 + Google Drive API
- **Authentication**: Google OAuth 2.0
- **Analytics**: PostHog (optional)

**Repository Structure**:
```
SheetCRM/
├── frontend/                    # React web application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth state management
│   │   ├── pages/              # Page-level components
│   │   ├── services/           # API client
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── package.json            # Dependencies
│
├── backend/                     # Cloudflare Workers API
│   ├── src/
│   │   ├── auth.ts             # Google OAuth 2.0 implementation
│   │   ├── sheets.ts           # Google Sheets CRUD client
│   │   ├── types.ts            # API types
│   │   └── index.ts            # Worker entry point + router
│   ├── wrangler.jsonc          # Cloudflare Workers config
│   ├── wrangler.toml           # Wrangler configuration
│   └── package.json            # Dependencies
│
├── docs/                        # Documentation
│   ├── project-overview-and-product-development-requirements.md
│   ├── marketing-strategy-and-growth-plan.md
│   ├── product-and-marketing-launch-roadmap.md
│   ├── codebase-summary-and-architecture-overview.md
│   └── ...
│
├── README.md                    # Setup and development guide
├── PRD.md                       # Product Requirements Document
├── IMPLEMENTATION_PLAN.md       # Task tracking
├── TEST_PLAN.md                # Test cases and results
├── CLAUDE.md                    # AI project configuration
└── .github/                     # GitHub workflows and config
```

---

## Architecture Overview

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │         React Frontend (Vite)                   │   │
│  │  • Dashboard, Contacts, Companies, Notes, etc. │   │
│  │  • Dark mode, responsive UI                    │   │
│  │  • Error handling, loading states              │   │
│  └──────────────────┬──────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────┘
                      │ HTTP(S) API calls
                      │ JSON payloads
                      │ OAuth tokens in HttpOnly cookie
                      │
┌─────────────────────▼──────────────────────────────────┐
│           Cloudflare Workers (Backend)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Router & Middleware                            │   │
│  │ • Auth verification                            │   │
│  │ • Request validation                           │   │
│  │ • Error handling                               │   │
│  └────────────────────────────────────────────────┘   │
│                      ↓                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ API Endpoints                                  │   │
│  │ • /auth/login, /callback, /logout              │   │
│  │ • /contacts (CRUD)                             │   │
│  │ • /companies (CRUD)                            │   │
│  │ • /notes, /reminders                           │   │
│  │ • /dashboard/stats                             │   │
│  └────────────────────────────────────────────────┘   │
│                      ↓                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Google Sheets Client                           │   │
│  │ • CRUD operations on Sheets                    │   │
│  │ • Sync data to Google Drive                    │   │
│  │ • Handle API quotas and retries                │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────┘
                      │ Google OAuth 2.0
                      │ Google Sheets API v4
                      │ Google Drive API
                      │
┌─────────────────────▼──────────────────────────────────┐
│      Google Cloud (OAuth, Sheets, Drive)                │
│  • User authentication                                  │
│  • Spreadsheet storage ("SheetCRM Data")               │
│  • File storage in user's Google Drive                 │
└──────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Cloudflare Workers for Backend**
   - Serverless, scales automatically
   - Free tier sufficient for MVP
   - No database maintenance needed
   - Deployed globally (low latency)

2. **Google Sheets as Database**
   - Eliminates infrastructure cost
   - User data privacy (stored in their Drive)
   - Implicit backups (Google's infrastructure)
   - Dual-mode: web app + direct Sheets editing

3. **React for Frontend**
   - Component-based architecture
   - Large ecosystem and documentation
   - Strong TypeScript support
   - Fast development velocity

4. **OAuth 2.0 (No Password Storage)**
   - Security: No password management burden
   - UX: Single sign-on with Google
   - Seamless Sheets integration
   - Refresh token handling for long sessions

5. **Tailwind CSS**
   - Rapid UI development
   - Consistent design system
   - Dark mode support (native)
   - Responsive design utilities

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── components/
│   ├── Header.tsx              # Top navigation bar
│   ├── Sidebar.tsx             # Left sidebar navigation
│   ├── Layout.tsx              # Main layout wrapper
│   ├── ContactForm.tsx         # Create/edit contact modal
│   ├── CompanyForm.tsx         # Create/edit company modal
│   ├── NoteForm.tsx            # Add note modal
│   ├── ReminderForm.tsx        # Add reminder modal
│   ├── Toast.tsx               # Notification system
│   ├── DarkModeToggle.tsx      # Theme switcher
│   └── LoadingSpinner.tsx      # Loading indicator
│
├── context/
│   ├── AuthContext.tsx         # Global auth state
│   └── AuthProvider.tsx        # Auth provider wrapper
│
├── pages/
│   ├── Dashboard.tsx           # Main dashboard (stats, recent activity)
│   ├── ContactsPage.tsx        # Contacts list and management
│   ├── CompaniesPage.tsx       # Companies list and management
│   ├── ContactDetail.tsx       # Single contact view (notes, history)
│   ├── CompanyDetail.tsx       # Single company view
│   ├── RemindersPage.tsx       # Reminders list and management
│   ├── ProfilePage.tsx         # User profile page
│   ├── LoginPage.tsx           # OAuth login page
│   └── NotFound.tsx            # 404 page
│
├── services/
│   └── api.ts                  # API client (Axios or Fetch)
│
├── types/
│   └── index.ts                # TypeScript types and interfaces
│
├── App.tsx                     # Main app router
├── index.css                   # Global Tailwind styles
└── main.tsx                    # React entry point
```

### Key Components

#### AuthContext
Manages global authentication state:
- User info (name, email, avatar from Google)
- Tokens (access, refresh)
- Spreadsheet ID
- Login/logout functions
- Token refresh logic

#### API Service
Centralized API client:
- Base URL configuration
- Default headers (auth token, content-type)
- Error handling and retry logic
- Type-safe request/response methods
- Loading state management

#### Page Components
Each page handles:
- Data fetching (useEffect)
- Local state (filters, sorting, pagination)
- CRUD operations (via API service)
- Conditional rendering (loading, error, empty states)
- Toast notifications on success/error

### State Management

**Global State** (AuthContext):
- User authentication
- Session tokens
- User profile data

**Local State** (Component useState):
- Form inputs
- List filters/sorting
- UI toggles (modal open/close)
- Loading states per component

**Data Fetching**:
- Manual useEffect + fetch
- Can be upgraded to React Query/SWR if needed

### Styling

**Tailwind CSS**:
- Utility-first approach
- Dark mode support via `dark:` prefix
- Responsive design (mobile-first)
- Custom config in `tailwind.config.js`

**Color System**:
- Primary: `#3B82F6` (blue)
- Secondary: `#60A5FA` (light blue)
- Accent: `#F97316` (orange)
- Dark mode: Gray-800/700 palette

---

## Backend Architecture

### Directory Structure

```
backend/src/
├── auth.ts                     # Google OAuth 2.0 implementation
├── sheets.ts                   # Google Sheets API wrapper
├── types.ts                    # API request/response types
└── index.ts                    # Worker entry point + router
```

### Core Modules

#### auth.ts: Google OAuth 2.0 Flow

```typescript
// Key functions:
- generateAuthUrl()        // Generate Google consent URL
- handleCallback()         // Exchange code for tokens
- refreshAccessToken()     // Refresh expired token
- verifySession()          // Validate cookie token
- createSession()          // Create encrypted HttpOnly cookie
```

**Flow**:
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen (generated by `generateAuthUrl`)
3. User grants permissions (Sheets API, Drive API)
4. Google redirects to `/api/v1/auth/callback?code=XXX`
5. Backend exchanges code for tokens (`handleCallback`)
6. Backend stores tokens in encrypted HttpOnly cookie
7. All subsequent requests authenticated via cookie

#### sheets.ts: Google Sheets CRUD Client

```typescript
// Key functions:
- createSpreadsheet()      // Create "SheetCRM Data" sheet
- appendRow()              // Add contact/company/note
- updateRow()              // Modify existing record
- deleteRow()              // Remove record
- queryData()              // Read and filter data
- syncSheets()             // Bi-directional sync
```

**Data Organization** (in Google Sheets):
```
Contacts sheet:
  Columns: ID, Name, Email, Phone, Company, Source, Notes, Created, Updated

Companies sheet:
  Columns: ID, Name, Industry, Website, Address, Notes, Created, Updated

Notes sheet:
  Columns: ID, ContactID/CompanyID, Type, Content, Created

Reminders sheet:
  Columns: ID, ContactID, Title, DueDate, Status, Created
```

#### index.ts: Worker Entry Point & Router

```typescript
// Key routes:
GET    /api/v1/auth/login           // Redirect to Google OAuth
GET    /api/v1/auth/callback        // OAuth callback
GET    /api/v1/auth/status          // Check if logged in
POST   /api/v1/auth/logout          // Sign out

GET    /api/v1/contacts             // List all contacts
POST   /api/v1/contacts             // Create contact
GET    /api/v1/contacts/:id         // Get single contact
PUT    /api/v1/contacts/:id         // Update contact
DELETE /api/v1/contacts/:id         // Delete contact

GET    /api/v1/companies            // List all companies
POST   /api/v1/companies            // Create company
GET    /api/v1/companies/:id        // Get single company
PUT    /api/v1/companies/:id        // Update company
DELETE /api/v1/companies/:id        // Delete company

GET    /api/v1/contacts/:id/notes   // Get notes for contact
POST   /api/v1/contacts/:id/notes   // Add note to contact

GET    /api/v1/reminders            // List reminders
POST   /api/v1/reminders            // Create reminder
PUT    /api/v1/reminders/:id        // Update reminder
DELETE /api/v1/reminders/:id        // Delete reminder

GET    /api/v1/dashboard/stats      // Dashboard statistics
```

**Middleware**:
- Request logging
- CORS handling
- Auth verification (all data routes)
- Error handling and normalization

---

## Data Schema

### Contacts Table (Google Sheet)

| Column | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | Unique identifier (UUID) |
| name | string | yes | Contact full name |
| email | string | no | Email address |
| phone | string | no | Phone number |
| company | string | no | Associated company ID or name |
| source | string | no | How contact was acquired |
| notes | string | no | General notes |
| created | ISO8601 | yes | Creation timestamp |
| updated | ISO8601 | yes | Last update timestamp |

### Companies Table (Google Sheet)

| Column | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | Unique identifier (UUID) |
| name | string | yes | Company name |
| industry | string | no | Industry classification |
| website | string | no | Company website URL |
| address | string | no | Physical address |
| notes | string | no | Company notes |
| created | ISO8601 | yes | Creation timestamp |
| updated | ISO8601 | yes | Last update timestamp |

### Notes Table (Google Sheet)

| Column | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | Unique identifier (UUID) |
| entityId | string | yes | Contact or Company ID |
| entityType | string | yes | "contact" or "company" |
| content | string | yes | Note text |
| created | ISO8601 | yes | Creation timestamp |

### Reminders Table (Google Sheet)

| Column | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | Unique identifier (UUID) |
| contactId | string | yes | Associated contact ID |
| title | string | yes | Reminder title |
| dueDate | ISO8601 | yes | When reminder is due |
| status | enum | yes | "pending", "completed", "overdue" |
| created | ISO8601 | yes | Creation timestamp |

---

## Key Features Implementation

### 1. Authentication (OAuth 2.0)
- **File**: `backend/src/auth.ts`
- **Flow**: User → Google → Token → Cookie
- **Security**: HttpOnly cookie (XSS protection), CSRF token verification
- **Refresh**: Auto-refresh when token expires

### 2. Contact Management
- **Frontend**: `frontend/src/pages/ContactsPage.tsx`, `ContactForm.tsx`
- **Backend**: `/api/v1/contacts` endpoints
- **Features**: CRUD, search, filter by company, pagination

### 3. Company Management
- **Frontend**: `frontend/src/pages/CompaniesPage.tsx`, `CompanyForm.tsx`
- **Backend**: `/api/v1/companies` endpoints
- **Features**: CRUD, company → contacts relationship

### 4. Notes & Activities
- **Frontend**: `frontend/src/components/NoteForm.tsx`
- **Backend**: `/api/v1/contacts/:id/notes` endpoints
- **Features**: Timeline view, linked to contacts/companies

### 5. Reminders
- **Frontend**: `frontend/src/pages/RemindersPage.tsx`
- **Backend**: `/api/v1/reminders` endpoints
- **Features**: Due date tracking, status (pending/completed/overdue)

### 6. Dashboard
- **Frontend**: `frontend/src/pages/Dashboard.tsx`
- **Backend**: `/api/v1/dashboard/stats` endpoint
- **Displays**: Total contacts/companies, recent activities, upcoming reminders

### 7. Dark Mode
- **Frontend**: `frontend/src/components/DarkModeToggle.tsx`
- **Implementation**: Tailwind CSS `dark:` variants
- **Persistence**: localStorage (user preference)
- **System Detection**: Respects OS preference on first load

### 8. Google Sheets Sync
- **Backend**: `backend/src/sheets.ts`
- **Bidirectional**: App ↔ Sheets real-time sync
- **Auto-create**: Creates "SheetCRM Data" spreadsheet on first login
- **User editable**: Users can edit Sheets directly; app reflects changes

---

## Security Measures

### Authentication
- ✅ OAuth 2.0 (no password storage)
- ✅ HttpOnly cookies (XSS protection)
- ✅ CSRF token verification
- ✅ Secure token refresh mechanism

### Data Protection
- ✅ HTTPS encryption (Cloudflare standard)
- ✅ Per-user data isolation (via Sheets permissions)
- ✅ No sensitive data in logs
- ✅ Environment variables for secrets (not hardcoded)

### API Security
- ✅ Auth middleware on all data routes
- ✅ Input validation
- ✅ Rate limiting (via Cloudflare)
- ✅ CORS configuration (only allow origin domain)

### Compliance
- ✅ GDPR friendly (data in user's own Google Drive)
- ✅ No data harvesting or tracking (PostHog optional)
- ✅ Privacy by design (no backend database)

---

## Performance Optimization

### Frontend
- ✅ **Code splitting**: Vite automatic chunk splitting
- ✅ **Lazy loading**: React.lazy() for page components
- ✅ **Caching**: Browser cache for static assets
- ✅ **Compression**: Gzip compression (Cloudflare)
- **Target**: Lighthouse score > 85

### Backend
- ✅ **Serverless**: Auto-scaling (Cloudflare Workers)
- ✅ **Caching**: Google Sheets API response caching
- ✅ **Optimization**: Batch operations where possible
- **Target**: API response time < 500ms

### Database
- ✅ **Efficient queries**: Index-like filtering in Sheets
- ✅ **Pagination**: Load data in chunks, not all at once
- ✅ **Compression**: Store minimal data per record
- **Limit**: 5,000+ contacts per user (Sheets cell limit: 5M cells)

---

## Testing Strategy

### Unit Tests
- API endpoint logic
- Auth token handling
- Data validation
- Error handling

### Integration Tests
- OAuth flow (with mock Google)
- CRUD operations end-to-end
- Sheets API interactions
- Error scenarios

### E2E Tests (Playwright)
- User login flow
- Create contact → note → reminder
- Dark mode toggle
- Responsive design (mobile, tablet, desktop)
- See `TEST_PLAN.md` for detailed test cases

### Performance Tests
- Load time (Lighthouse)
- API response time (Cloudflare)
- Sheets API quota usage
- Concurrent user handling

---

## Deployment Architecture

### Production Environment

```
User Request
    ↓
Cloudflare Edge (CDN, cache)
    ↓
Cloudflare Worker (app logic)
    ↓
Google Sheets API (data)
```

### Deployment Process

1. **Frontend Build**: `pnpm build` (creates dist/)
2. **Backend Bundle**: Wrangler bundles with frontend assets
3. **Deploy**: `pnpm wrangler deploy`
4. **Set Secrets**: `wrangler secret put GOOGLE_CLIENT_ID` (etc.)
5. **Verify**: Test login and CRUD operations

### Environment Variables

**Frontend**:
```bash
VITE_PUBLIC_POSTHOG_KEY=xxx      # Optional analytics
VITE_PUBLIC_POSTHOG_HOST=xxx     # Optional analytics
```

**Backend**:
```bash
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
COOKIE_SECRET=<random-32-chars>
```

---

## Development Workflow

### Setup
```bash
# Install dependencies
cd frontend && pnpm install
cd ../backend && pnpm install

# Configure credentials (.dev.vars)
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COOKIE_SECRET

# Build frontend
cd frontend && pnpm build

# Start dev server
cd ../backend && pnpm wrangler dev
# App runs at http://localhost:8787
```

### Development
- **Frontend changes**: Edit files in `frontend/src/`, rebuild with `pnpm build`
- **Backend changes**: Edit files in `backend/src/`, wrangler auto-reloads
- **Styles**: Edit `frontend/src/index.css` or component className
- **API changes**: Update both backend route and frontend service call

### Testing
```bash
# E2E tests (Playwright)
cd frontend && pnpm exec playwright test

# With UI
pnpm exec playwright test --ui

# Headed mode
pnpm exec playwright test --headed
```

### Deployment
```bash
# Build frontend
cd frontend && pnpm build

# Deploy
cd ../backend && pnpm wrangler deploy

# Set production secrets (first time)
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
pnpm wrangler secret put COOKIE_SECRET
```

---

## Dependencies Overview

### Frontend
- **vite**: Fast build tool and dev server
- **react@18**: Component framework
- **typescript**: Type safety
- **tailwindcss**: Utility-first CSS
- **axios** or **fetch**: HTTP client
- **react-router-dom**: Client-side routing
- **date-fns**: Date formatting and manipulation
- **playwright**: E2E testing

### Backend
- **cloudflare**: Workers runtime (built-in)
- **google-auth-library-nodejs**: OAuth client
- **googleapis**: Google Sheets and Drive API clients
- **jose**: JWT handling (session tokens)

---

## Known Limitations & Future Improvements

### Current Limitations
1. **No real-time sync** — App polls Sheets for changes (not WebSocket)
2. **Single user per spreadsheet** — Each user has their own Sheets file
3. **No team collaboration** — No built-in multi-user Sheets editing
4. **Limited mobile UX** — Desktop-first design
5. **Manual refresh** — No automatic push updates (only polling)

### Future Improvements (Phase 2)
1. **Team management** — Share spreadsheets with team members
2. **Advanced reporting** — Charts, dashboards, export
3. **Mobile app** — Native iOS/Android applications
4. **Integrations** — Email sync, Slack integration, Zapier
5. **AI features** — Smart notes, auto-follow-up suggestions
6. **Monetization** — Premium tier for advanced features

---

## Monitoring & Analytics

### Application Monitoring
- **Uptime**: Cloudflare Workers availability dashboard
- **Errors**: Cloudflare Workers logs + optional Sentry
- **Performance**: Cloudflare Analytics + Lighthouse CI

### User Analytics (Optional - PostHog)
- Page views and user flow
- Feature adoption (who uses reminders, notes, etc.)
- Error tracking (JavaScript errors)
- Custom events (CRUD operations)

### Health Checks
- API endpoint response times
- Google Sheets API quota usage
- Database size growth
- User growth metrics

---

## Quick Troubleshooting

### Login Issues
- **Check**: OAuth credentials in wrangler environment
- **Check**: Google Cloud Console redirect URIs match deployment URL
- **Check**: Google API (Sheets, Drive) enabled in project

### Data Not Syncing
- **Check**: User has "SheetCRM Data" spreadsheet in Google Drive
- **Check**: App has access to spreadsheet (permissions)
- **Check**: No quota limits reached (Google Sheets API)

### Deploy Failures
- **Check**: `pnpm build` completes without errors
- **Check**: Wrangler config correct (account_id, zone_id)
- **Check**: Cloudflare API token has correct permissions

### Performance Issues
- **Check**: Lighthouse score in DevTools
- **Check**: API response time in Cloudflare dashboard
- **Check**: User has too many contacts (>5000?)

---

## Useful Resources

- [Vite Documentation](https://vitejs.dev)
- [React 18 Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Playwright Docs](https://playwright.dev)

---

## Contact & Support

For questions about the codebase:
- GitHub Issues: Report bugs and feature requests
- GitHub Discussions: Ask questions and share ideas
- Email: Contact via GitHub profile

---
