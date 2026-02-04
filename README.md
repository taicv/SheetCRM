# MiniCRM - Google Sheets Edition

Ứng dụng CRM nhẹ sử dụng Google Sheets làm database, phù hợp cho doanh nghiệp siêu nhỏ và hộ kinh doanh cá nhân.

## 📁 Cấu trúc Project

```
buoi-5/
├── frontend/           # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/ # Layout components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API client
│   │   └── types/      # TypeScript types
│   └── package.json
├── backend/            # Cloudflare Workers API
│   ├── src/
│   │   ├── auth.ts     # Google OAuth JWT signing
│   │   ├── sheets.ts   # Google Sheets CRUD client
│   │   └── index.ts    # API router
│   └── wrangler.toml
├── PRD.md              # Product Requirements
└── IMPLEMENTATION_PLAN.md
```

## 🚀 Quick Start

### 1. Fix npm permissions (nếu gặp lỗi EPERM)

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Setup Google Service Account

1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable **Google Sheets API**
4. Vào **IAM & Admin > Service Accounts**
5. Tạo Service Account mới
6. Tạo Key (JSON format), download file JSON

### 5. Share Google Sheet với Service Account

1. Mở [Google Sheet của bạn](https://docs.google.com/spreadsheets/d/1qqciTWousoyZf1ZlIo7HWAQM2i81sJRWdF5nuZr8KN0)
2. Click **Share**
3. Thêm email của Service Account (từ file JSON: `client_email`)
4. Cấp quyền **Editor**

### 6. Tạo 4 sheets trong Google Spreadsheet

Tạo 4 tab với tên chính xác:
- `contacts`
- `companies`
- `notes`
- `reminders`

### 7. Configure Backend Secrets

```bash
cd backend

# Set service account email
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
# Paste: email từ file JSON

# Set private key
npx wrangler secret put GOOGLE_PRIVATE_KEY
# Paste: private_key từ file JSON (bao gồm cả \n)
```

### 8. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# API runs at http://localhost:8787
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs at http://localhost:5173
```

### 9. Initialize Google Sheets Headers

Sau khi backend chạy, gọi API init một lần:
```bash
curl -X POST http://localhost:8787/api/v1/init
```

## 🔧 Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers
- **Database**: Google Sheets API v4
- **Auth**: Service Account JWT

## 📋 Features

- ✅ Quản lý Contacts (CRUD)
- ✅ Quản lý Companies (CRUD)
- ✅ Notes/Activities timeline
- ✅ Reminders với due dates
- ✅ Dashboard thống kê
- ✅ Google Sheets sync (web app + direct editing)

## 🚢 Deployment

### Frontend (Cloudflare Pages)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Cloudflare Pages
```

### Backend (Cloudflare Workers)
```bash
cd backend
npm run deploy
```

## 📝 API Endpoints

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
