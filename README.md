# SheetCRM - Google Sheets CRM

A lightweight CRM using Google Sheets as database, built for small businesses and freelancers.

## 📁 Project Structure

```
SheetCRM/
├── frontend/           # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/ # Layout components (Header, Sidebar)
│   │   ├── context/    # Auth context (OAuth state management)
│   │   ├── pages/      # Page components (Dashboard, Contacts, etc.)
│   │   ├── services/   # API client
│   │   └── types/      # TypeScript types
│   └── package.json
├── backend/            # Cloudflare Workers API
│   ├── src/
│   │   ├── auth.ts     # Google OAuth 2.0 + session cookies
│   │   ├── sheets.ts   # Google Sheets CRUD client
│   │   └── index.ts    # API router + auth middleware
│   └── wrangler.jsonc
├── PRD.md              # Product Requirements
├── IMPLEMENTATION_PLAN.md
└── TEST_PLAN.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 2. Setup Google OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or select a project
3. Enable the **Google Sheets API** (APIs & Services → Library)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:8787/api/v1/auth/callback`
7. Configure the **OAuth consent screen** (add your email as test user)
8. Copy the **Client ID** and **Client Secret**

### 3. Configure Backend Environment

Create `backend/.dev.vars` (copy from `.dev.vars.example`):

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
COOKIE_SECRET=any-random-string-at-least-32-characters-long
```

### 4. Run Development Server

```bash
# Build frontend first
cd frontend && pnpm build

# Start dev server (serves both API + frontend)
cd ../backend && pnpm wrangler dev
# App runs at http://localhost:8787
```

> **Note:** Wrangler serves the built frontend from `frontend/dist/`. Rebuild the frontend after making UI changes.

## 🔧 Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers
- **Database**: Google Sheets API v4
- **Auth**: Google OAuth 2.0 (user sign-in with consent)

## 📋 Features

- ✅ Google OAuth 2.0 sign-in (Sign in with Google)
- ✅ Contact management (CRUD)
- ✅ Company management (CRUD)
- ✅ Notes/Activities timeline
- ✅ Reminders with due dates
- ✅ Dashboard with stats
- ✅ Google Sheets sync (web app + direct Sheets editing)
- ✅ Per-user spreadsheet (auto-created on first login)

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

The app is deployed as a single Cloudflare Worker (serves both API and frontend static assets).

```bash
# Build frontend first
cd frontend && pnpm build

# Deploy (API + frontend assets)
cd ../backend && pnpm wrangler deploy

# Set secrets for production (first time only)
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
pnpm wrangler secret put COOKIE_SECRET
```

> **Note:** Update the OAuth redirect URI in Google Cloud Console to match your production URL:
> `https://sheetcrm.<your-subdomain>.workers.dev/api/v1/auth/callback`

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
