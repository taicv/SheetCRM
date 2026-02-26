# Implementation Plan

## Phase 1: Project Setup

- [x] Initialize Vite + React + TypeScript project
- [x] Configure Tailwind CSS
- [x] Setup project structure (components, pages, services, types)
- [x] Configure ESLint and Prettier
- [x] Create Cloudflare Workers project
- [x] Setup wrangler.jsonc configuration

## Phase 2: Core Infrastructure

### Backend (Cloudflare Workers)

- [x] Setup Google OAuth 2.0 authentication (user sign-in, token exchange, encrypted cookies)
- [x] Create Google Sheets service module
- [x] Implement CORS and request handling middleware
- [x] Setup environment secrets (OAuth Client ID, Client Secret, Cookie Secret)

### Frontend

- [x] Setup React Router for navigation
- [x] Create base layout component (Sidebar, Header)
- [x] Setup API client service
- [x] Create TypeScript types matching PRD

## Phase 3: Feature Implementation

### F1: Contact Management

- [x] API endpoints: GET, POST, PUT, DELETE /contacts
- [x] Contact list page with search/filter
- [x] Contact detail page/panel
- [x] Add/Edit contact form modal
- [x] Delete confirmation

### F2: Company Management

- [x] API endpoints: GET, POST, PUT, DELETE /companies
- [x] Company list page
- [x] Company detail with related contacts
- [x] Add/Edit company form modal

### F3: Notes/Activities

- [x] API endpoints: GET, POST /contacts/:id/notes
- [x] Notes timeline component
- [x] Add note form

### F4: Reminders

- [x] API endpoints: GET, POST, PUT, DELETE /reminders
- [x] Reminders list component
- [x] Add/Edit reminder form
- [x] Due date filter

### F5: Dashboard

- [x] Stats cards (Contacts, Companies, Reminders count)
- [x] Recent activities list
- [x] Quick actions

### F6: Google Sheets Sync

- [x] Refresh button to re-fetch data
- [x] Auto-sync indicator
- [x] Error handling for API limits

### F7: Google OAuth 2.0 Authentication

- [x] Backend auth routes (login, callback, status, logout)
- [x] AES-GCM encrypted session cookies (stateless, HttpOnly, Secure)
- [x] Auto token refresh when access token expires
- [x] Route protection middleware (401 for unauthenticated requests)
- [x] Frontend AuthContext/Provider (login state management)
- [x] Login page with "Sign in with Google" button
- [x] App auth gate (loading → login → dashboard)
- [x] Header user profile + logout dropdown
- [x] API client with credentials + 401 redirect

### F8: Per-User Spreadsheet Auto-Creation

- [x] Add `drive.file` scope for Drive search
- [x] Add `findOrCreateSpreadsheet()` to auth module
- [x] Auto-create "SheetCRM Data" spreadsheet with 4 tabs + headers on first login
- [x] Reuse existing spreadsheet on re-login (Drive search by name)
- [x] Store `spreadsheetId` in encrypted session cookie
- [x] Remove hardcoded `SPREADSHEET_ID` from `wrangler.jsonc`
- [x] Dynamic "Open Google Sheet" link in sidebar

## Phase 4: UI/UX Polish

- [x] Apply Tailwind styling per design guidelines
- [x] Responsive design (mobile-first)
- [x] Loading states and skeletons (page-level)
- [x] Error states and empty states
- [ ] Toast notifications (hiện đang dùng `alert()` - cần thay thế)
- [ ] Keyboard navigation (optional enhancement)

## Phase 5: Integration & Testing

- [x] End-to-end API testing
- [x] Frontend component testing
- [x] Google Sheets CRUD verification
- [x] Error handling verification
- [x] Performance optimization

---

## Phase 6: Standard MVP Requirements (Chưa làm)

> Các tính năng bắt buộc theo tiêu chí đánh giá MVP

### F9: Toast Notification System

- [ ] Tạo `Toast.tsx` component (success/error/warning/info types)
- [ ] Tạo `useToast` hook hoặc `ToastContext` để dùng toàn app
- [ ] Tích hợp `ToastContainer` vào `Layout.tsx` hoặc `App.tsx`
- [ ] Thay thế toàn bộ `alert()` trong `ContactsPage.tsx` bằng toast
- [ ] Thay thế toàn bộ `alert()` trong `CompaniesPage.tsx` bằng toast
- [ ] Thay thế toàn bộ `alert()` trong `RemindersPage.tsx` bằng toast
- [ ] Toast success khi tạo/sửa/xóa thành công
- [ ] Toast error khi API thất bại

### F10: Button Loading States

- [ ] Thêm `submitting` state vào các form modal (Contacts, Companies, Reminders)
- [ ] Disable submit button + hiện spinner khi đang gọi API
- [ ] Disable delete button khi đang xóa
- [ ] Prevent double-submit (tất cả forms)

### F11: User Profile Page

- [ ] Thêm `/profile` route vào `App.tsx`
- [ ] Tạo `ProfilePage.tsx` hiển thị avatar, name, email từ AuthContext
- [ ] Thêm stats: số contacts, companies, reminders của user
- [ ] Thêm link "Mở Google Sheet" trong profile page
- [ ] Thêm nút Logout trong profile page
- [ ] Thêm "Profile" vào Sidebar navigation
- [ ] Cập nhật Header dropdown: link đến `/profile` thay vì chỉ logout
- [ ] Thêm backend endpoint `/api/v1/auth/me` trả về user info (name, email, picture, spreadsheetId)

---

## Phase 7: Bonus Features (Điểm cộng)

> Tính năng mở rộng - thực hiện sau khi Phase 6 hoàn tất

### B1: Analytics (PostHog)

- [ ] Tạo tài khoản PostHog (free tier) hoặc dùng Google Analytics 4
- [ ] Cài `posthog-js` vào frontend
- [ ] Tích hợp `posthog.capture()` cho các sự kiện: login, create_contact, create_company, create_reminder, delete_contact
- [ ] Track page views tự động

### B2: SEO Optimization

- [ ] Cập nhật `index.html`: thêm `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Thêm Twitter Card meta tags
- [ ] Thêm `robots.txt`
- [ ] Thêm favicon chuyên nghiệp (thay `vite.svg`)

### B3: PWA (Progressive Web App)

- [ ] Tạo `public/manifest.json` với icon, name, theme_color, display: standalone
- [ ] Cài `vite-plugin-pwa` và cấu hình service worker (Workbox)
- [ ] Tạo các icon sizes (192x192, 512x512) cho manifest
- [ ] Test "Add to Home Screen" trên mobile Chrome

### B4: Dark Mode

- [ ] Bật `darkMode: 'class'` trong `tailwind.config.js`
- [ ] Thêm `ThemeContext` để quản lý light/dark state
- [ ] Lưu preference vào `localStorage`
- [ ] Thêm toggle button trong Header
- [ ] Áp dụng `dark:` variants cho tất cả pages và components
- [ ] Tránh flash trắng khi load (script inline trong `<head>`)

---

## ✅ PHASES 1-5 COMPLETED

OAuth 2.0, per-user spreadsheet, full CRUD, responsive UI - tất cả đã hoàn thành.
Còn lại: Phase 6 (bắt buộc) và Phase 7 (điểm cộng).

---

## Progress Log

| Date       | Phase    | Status      | Notes                         |
| ---------- | -------- | ----------- | ----------------------------- |
| 2026-02-04 | Phase 1  | Complete    | PRD.md created                |
| 2026-02-04 | Phase 2  | Complete    | Human approved plan           |
| 2026-02-04 | Phase 3  | Complete    | All features implemented      |
| 2026-02-04 | Phase 4  | Complete    | TEST_PLAN.md created          |
| 2026-02-04 | Phase 5  | Complete    | Tests executed, 6/7 passed    |
| 2026-02-04 | Phase 6  | Complete | Initial implementation done    |
| 2026-02-13 | Phase 6  | Complete    | OAuth 2.0 migration done      |
| 2026-02-13 | Phase 6  | Complete    | Per-user spreadsheet creation  |
| 2026-02-13 | Phase 6  | Complete    | Unified wrangler deployment (assets config) |
