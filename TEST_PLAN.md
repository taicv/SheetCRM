# TEST_PLAN.md - OAuth 2.0 Migration

## Prerequisites (Manual Setup Required)

Before testing, you need to create Google OAuth 2.0 credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or select a project
3. Enable the **Google Sheets API** (APIs & Services → Library)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:8787/api/v1/auth/callback`
7. Copy the **Client ID** and **Client Secret**
8. Create `backend/.dev.vars` (copy from `.dev.vars.example`):
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   COOKIE_SECRET=any-random-string-at-least-32-characters-long
   ```
9. Also configure the **OAuth consent screen** (add your email as test user)

## Test Cases

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| TC-01 | Login Page Display | Start frontend + backend, open `http://localhost:5173` | See login page with gradient background, SheetCRM logo, "Sign in with Google" button | ✅ |
| TC-02 | OAuth Login Flow | Click "Sign in with Google" | Redirects to Google consent screen (incl. Sheets + Drive scope), after approval redirects back to dashboard | ✅ |
| TC-03 | Spreadsheet Auto-Creation | After first login, check Google Drive | A new "SheetCRM Data" spreadsheet is created with 4 tabs (contacts, companies, notes, reminders) + headers | ✅ |
| TC-04 | Session Persistence | After login, refresh the page | Still logged in, dashboard loads | ✅ |
| TC-05 | User Profile in Header | After login, look at header | User's Google profile picture, name displayed. Click → dropdown with email + "Sign Out" | ✅ |
| TC-06 | Contact CRUD | Create, edit, delete a contact | All operations succeed using user's OAuth token and auto-created spreadsheet | ✅ |
| TC-07 | Open Google Sheet Link | Click "Open Google Sheet" in sidebar | Opens the correct per-user spreadsheet (not a hardcoded one) | ✅ |
| TC-08 | Spreadsheet Reuse on Re-login | Logout, then login again | Same spreadsheet is reused (no duplicate created) | ✅ |
| TC-09 | API Auth Protection | Open `http://localhost:8787/api/v1/contacts` in new incognito tab | Returns 401 Unauthorized | ✅ |
| TC-10 | Logout Flow | Click "Sign Out" in header dropdown | Returns to login page. Refresh stays on login page | ✅ |

## How to Run

```bash
# Terminal 1 - Backend
cd backend && pnpm wrangler dev

# Terminal 2 - Frontend  
cd frontend && pnpm dev
```

Open `http://localhost:5173` in your browser.
