# SheetCRM — Lightweight CRM powered by Google Sheets

A modern, lightweight CRM that uses **Google Sheets as its database**. Built for small businesses and freelancers who want a professional CRM interface without the complexity or cost.

> **🌐 Live Demo:** [sheetcrm.taicv.workers.dev](https://sheetcrm.taicv.workers.dev/)

---

## ✨ Why SheetCRM?

- **Zero database cost** — your data lives in Google Sheets on your own Google Drive
- **Dual-mode editing** — use the web app _or_ edit the spreadsheet directly
- **Per-user data** — each user gets their own auto-created spreadsheet
- **Privacy-first** — no third-party data storage; you own your data

---

## 📋 Features

| Feature | Description |
|---------|-------------|
| 🔐 Google OAuth 2.0 | Sign in with Google, auto-provision spreadsheet |
| 👥 Contacts | Full CRUD with search and company linking |
| 🏢 Companies | Full CRUD with linked contacts view |
| 📝 Notes / Activities | Timeline of interactions per contact |
| ⏰ Reminders | Follow-up reminders with due dates |
| 📊 Dashboard | At-a-glance stats and recent activity |
| 🌙 Dark Mode | System preference detection + manual toggle |
| 🔔 Toast Notifications | Non-intrusive feedback for every action |
| 👤 User Profile | Account info, stats, and link to your Google Sheet |
| 📈 Analytics | Optional PostHog integration |

---

## 🏗️ Architecture

```
Browser ──HTTPS──▶ Cloudflare Worker ──Google Sheets API──▶ Google Sheets
                   (API + static assets)                    (per-user DB)
```

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS |
| Backend | Cloudflare Workers |
| Database | Google Sheets API v4 |
| Auth | Google OAuth 2.0 |
| Analytics | PostHog _(optional)_ |

---

## 📁 Project Structure

```
SheetCRM/
├── frontend/           # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/ # Layout (Header, Sidebar, Toast, etc.)
│   │   ├── context/    # Auth context (OAuth state management)
│   │   ├── pages/      # Page components (Dashboard, Contacts, …)
│   │   ├── services/   # API client
│   │   └── types/      # TypeScript type definitions
│   └── package.json
├── backend/            # Cloudflare Workers API
│   ├── src/
│   │   ├── auth.ts     # Google OAuth 2.0 + session cookies
│   │   ├── sheets.ts   # Google Sheets CRUD operations
│   │   └── index.ts    # API router + auth middleware
│   └── wrangler.jsonc
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm
- A **Google Cloud** project with Sheets API enabled

### 1. Clone & install

```bash
git clone https://github.com/taicv/SheetCRM.git
cd SheetCRM

# Install dependencies
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 2. Set up Google OAuth 2.0

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create or select a project
3. Enable the **Google Sheets API** (**APIs & Services → Library**)
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:8787/api/v1/auth/callback`
5. Configure the **OAuth consent screen** (add your email as a test user)
6. Copy the **Client ID** and **Client Secret**

### 3. Configure environment variables

1. Create `backend/.dev.vars` (copy from `.dev.vars.example`):
Create `backend/.dev.vars` (see `.dev.vars.example`):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
COOKIE_SECRET=any-random-string-at-least-32-characters-long
```

2. Edit `backend/wrangler.jsonc` 
    - change `"account_id": "f37f5b565b1143b73c44b1fa319e1814"` to your account id.

### 4. (Optional) Configure PostHog Analytics

If you want to enable analytics tracking, create `frontend/.env` (copy from `.env.example`):
_(Optional)_ Create `frontend/.env` for analytics (see `.env.example`):

```env
VITE_PUBLIC_POSTHOG_KEY=your-posthog-api-key
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 4. Run the dev server

```bash
# Build frontend first
cd frontend && pnpm build

# Start dev server (serves API + frontend)
cd ../backend && pnpm wrangler dev
# → http://localhost:8787
```

> **Note:** Wrangler serves the built frontend from `frontend/dist/`. Rebuild the frontend after making UI changes.

## 🔧 Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers
- **Database**: Google Sheets API v4
- **Auth**: Google OAuth 2.0 (user sign-in with consent)
- **Analytics**: PostHog (optional)
- **Testing**: Playwright E2E tests

## 📋 Features

- ✅ Google OAuth 2.0 sign-in (Sign in with Google)
- ✅ Contact management (CRUD)
- ✅ Company management (CRUD)
- ✅ Notes/Activities timeline
- ✅ Reminders with due dates
- ✅ Dashboard with stats
- ✅ Google Sheets sync (web app + direct Sheets editing)
- ✅ Per-user spreadsheet (auto-created on first login)
- ✅ Dark mode with system preference detection
- ✅ Toast notification system
- ✅ Button loading states
- ✅ User profile page
- ✅ PostHog analytics integration (optional)

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. User grants Sheets + Drive access permission
4. Backend exchanges auth code for tokens
5. Backend finds or creates "SheetCRM Data" spreadsheet in user's Drive
6. Session (tokens + spreadsheetId) stored in encrypted HttpOnly cookie
7. All API calls authenticated via cookie
8. Tokens auto-refresh when expired

## 🚢 Deployment

The app deploys as a **single Cloudflare Worker** (API + static frontend assets).

### 1. Configure Cloudflare

Create `backend/.env` (see `.env.example`):

```env
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

Get a token from [Cloudflare Dashboard → API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → **Edit Cloudflare Workers**.

### 2. Deploy

```bash
# Build frontend
cd frontend && pnpm build

# Deploy to Cloudflare
cd ../backend && pnpm wrangler deploy

# Set production secrets (first time only)
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
pnpm wrangler secret put COOKIE_SECRET
```

> **Important:** Update the OAuth redirect URI in Google Cloud Console to match your production URL:
> `https://sheetcrm.<your-subdomain>.workers.dev/api/v1/auth/callback`

---

## 🔐 Authentication Flow

```
1. User clicks "Sign in with Google"
2. → Redirect to Google OAuth consent screen
3. → User grants Sheets + Drive access
4. ← Backend exchanges auth code for tokens
5.    Backend finds or creates "SheetCRM Data" spreadsheet
6.    Session stored in AES-GCM encrypted HttpOnly cookie
7. ← All API calls authenticated via cookie (auto-refresh on expiry)
```

---

## 📝 API Reference

### Auth _(public)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/auth/login` | Redirect to Google OAuth |
| `GET` | `/api/v1/auth/callback` | OAuth callback handler |
| `GET` | `/api/v1/auth/status` | Check auth status |
| `POST` | `/api/v1/auth/logout` | Sign out |

### Data _(authenticated)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET / POST` | `/api/v1/contacts` | List / Create contacts |
| `GET / PUT / DELETE` | `/api/v1/contacts/:id` | Read / Update / Delete contact |
| `GET / POST` | `/api/v1/companies` | List / Create companies |
| `GET / PUT / DELETE` | `/api/v1/companies/:id` | Read / Update / Delete company |
| `GET / POST` | `/api/v1/contacts/:id/notes` | List / Add contact notes |
| `GET / POST` | `/api/v1/reminders` | List / Create reminders |
| `PUT / DELETE` | `/api/v1/reminders/:id` | Update / Delete reminder |
| `GET` | `/api/v1/dashboard/stats` | Dashboard statistics |

---

## 🧪 Testing

### E2E (Playwright)

```bash
# Install browsers (first time)
cd frontend && pnpm exec playwright install

# Run tests
pnpm exec playwright test

# Interactive UI mode
pnpm exec playwright test --ui
```

> Make sure the dev server is running before executing tests.

## 📝 API Endpoints

### Auth (public)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | GET | Redirect to Google OAuth |
| `/api/v1/auth/callback` | GET | OAuth callback handler |
| `/api/v1/auth/status` | GET | Check auth status |
| `/api/v1/auth/logout` | POST | Sign out |

### Data (authenticated)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/contacts` | GET, POST | List/Create contacts |
| `/api/v1/contacts/:id` | GET, PUT, DELETE | CRUD contact |
| `/api/v1/companies` | GET, POST | List/Create companies |
| `/api/v1/companies/:id` | GET, PUT, DELETE | CRUD company |
| `/api/v1/contacts/:id/notes` | GET, POST | Contact notes |
| `/api/v1/reminders` | GET, POST | Reminders |
| `/api/v1/reminders/:id` | PUT, DELETE | Update/Delete reminder |
| `/api/v1/dashboard/stats` | GET | Dashboard statistics |
