# SheetCRM — CRM gọn nhẹ chạy trên Google Sheets

Một ứng dụng CRM hiện đại, gọn nhẹ sử dụng **Google Sheets làm cơ sở dữ liệu**. Được xây dựng cho doanh nghiệp nhỏ và freelancer muốn có giao diện CRM chuyên nghiệp mà không cần sự phức tạp hay chi phí cao.

> **🌐 Demo trực tuyến:** [sheetcrm.taicv.workers.dev](https://sheetcrm.taicv.workers.dev/)

---

## ✨ Tại sao chọn SheetCRM?

- **Không tốn chi phí database** — dữ liệu của bạn nằm trong Google Sheets trên chính Google Drive của bạn
- **Chỉnh sửa hai chế độ** — dùng ứng dụng web _hoặc_ chỉnh sửa trực tiếp trên bảng tính
- **Dữ liệu riêng theo người dùng** — mỗi người dùng có bảng tính riêng được tạo tự động
- **Ưu tiên quyền riêng tư** — không lưu trữ dữ liệu bên thứ ba; bạn sở hữu dữ liệu của mình

---

## 📋 Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔐 Google OAuth 2.0 | Đăng nhập bằng Google, tự động tạo bảng tính |
| 👥 Danh bạ | CRUD đầy đủ với tìm kiếm và liên kết công ty |
| 🏢 Công ty | CRUD đầy đủ với danh sách liên hệ liên kết |
| 📝 Ghi chú / Hoạt động | Dòng thời gian tương tác theo từng liên hệ |
| ⏰ Nhắc nhở | Nhắc nhở theo dõi với ngày hạn |
| 📊 Bảng điều khiển | Thống kê tổng quan và hoạt động gần đây |
| 🌙 Chế độ tối | Tự động nhận diện cài đặt hệ thống + chuyển đổi thủ công |
| 🔔 Thông báo Toast | Phản hồi không gây gián đoạn cho mọi thao tác |
| 👤 Hồ sơ người dùng | Thông tin tài khoản, thống kê và liên kết đến Google Sheet |
| 📈 Phân tích | Tích hợp PostHog (tùy chọn) |

---

## 🏗️ Kiến trúc

```
Trình duyệt ──HTTPS──▶ Cloudflare Worker ──Google Sheets API──▶ Google Sheets
                        (API + tài nguyên tĩnh)                  (DB theo người dùng)
```

| Tầng | Công nghệ |
|------|-----------|
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS |
| Backend | Cloudflare Workers |
| Cơ sở dữ liệu | Google Sheets API v4 |
| Xác thực | Google OAuth 2.0 |
| Phân tích | PostHog _(tùy chọn)_ |

---

## 📁 Cấu trúc dự án

```
SheetCRM/
├── frontend/           # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/ # Layout (Header, Sidebar, Toast, v.v.)
│   │   ├── context/    # Auth context (quản lý trạng thái OAuth)
│   │   ├── pages/      # Các trang (Dashboard, Contacts, …)
│   │   ├── services/   # API client
│   │   └── types/      # Định nghĩa kiểu TypeScript
│   └── package.json
├── backend/            # API chạy trên Cloudflare Workers
│   ├── src/
│   │   ├── auth.ts     # Google OAuth 2.0 + session cookies
│   │   ├── sheets.ts   # Thao tác CRUD trên Google Sheets
│   │   └── index.ts    # API router + middleware xác thực
│   └── wrangler.jsonc
└── README.md
```

---

## 🚀 Bắt đầu

### Yêu cầu

- **Node.js** ≥ 18
- **pnpm** (khuyến nghị) hoặc npm
- Một dự án **Google Cloud** đã bật Sheets API

### 1. Clone & cài đặt

```bash
git clone https://github.com/taicv/SheetCRM.git
cd SheetCRM

# Cài đặt dependencies
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 2. Thiết lập Google OAuth 2.0

1. Mở [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Tạo hoặc chọn một dự án
3. Bật **Google Sheets API** (**APIs & Services → Library**)
4. Vào **Credentials → Create Credentials → OAuth 2.0 Client IDs**
   - Loại ứng dụng: **Web application**
   - Authorized redirect URI: `http://localhost:8787/api/v1/auth/callback`
5. Cấu hình **OAuth consent screen** (thêm email của bạn làm test user)
6. Sao chép **Client ID** và **Client Secret**

### 3. Cấu hình biến môi trường

Tạo file `backend/.dev.vars` (xem `.dev.vars.example`):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
COOKIE_SECRET=chuoi-ngau-nhien-it-nhat-32-ky-tu
```

Chỉnh sửa `backend/wrangler.jsonc`:
- Thay `"account_id": "f37f5b565b1143b73c44b1fa319e1814"` bằng account ID của bạn.

### 4. (Tùy chọn) Cấu hình PostHog Analytics

Nếu muốn bật tính năng theo dõi phân tích, tạo file `frontend/.env` (xem `.env.example`):

```env
VITE_PUBLIC_POSTHOG_KEY=your-posthog-api-key
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 5. Chạy dev server

```bash
# Build frontend trước
cd frontend && pnpm build

# Khởi động dev server (phục vụ API + frontend)
cd ../backend && pnpm wrangler dev
# → http://localhost:8787
```

> **Lưu ý:** Wrangler phục vụ frontend đã build từ `frontend/dist/`. Hãy build lại frontend sau khi thay đổi giao diện.

---

## � Luồng xác thực

```
1. Người dùng nhấn "Đăng nhập bằng Google"
2. → Chuyển hướng đến màn hình đồng ý OAuth của Google
3. → Người dùng cấp quyền truy cập Sheets + Drive
4. ← Backend đổi mã xác thực lấy token
5.    Backend tìm hoặc tạo bảng tính "SheetCRM Data"
6.    Phiên được lưu trong cookie HttpOnly mã hóa AES-GCM
7. ← Tất cả API call được xác thực qua cookie (tự động làm mới khi hết hạn)
```

---

## 🚢 Triển khai

Ứng dụng được triển khai dưới dạng **một Cloudflare Worker duy nhất** (API + tài nguyên frontend tĩnh).

### 1. Cấu hình Cloudflare

Tạo file `backend/.env` (xem `.env.example`):

```env
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

Lấy token tại [Cloudflare Dashboard → API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → **Edit Cloudflare Workers**.

### 2. Triển khai

```bash
# Build frontend
cd frontend && pnpm build

# Triển khai lên Cloudflare
cd ../backend && pnpm wrangler deploy

# Thiết lập secrets cho production (chỉ lần đầu)
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
pnpm wrangler secret put COOKIE_SECRET
```

> **Quan trọng:** Cập nhật OAuth redirect URI trong Google Cloud Console cho đúng với URL production:
> `https://sheetcrm.<your-subdomain>.workers.dev/api/v1/auth/callback`

---

## � API Reference

### Xác thực _(công khai)_

| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| `GET` | `/api/v1/auth/login` | Chuyển hướng đến Google OAuth |
| `GET` | `/api/v1/auth/callback` | Xử lý callback OAuth |
| `GET` | `/api/v1/auth/status` | Kiểm tra trạng thái xác thực |
| `POST` | `/api/v1/auth/logout` | Đăng xuất |

### Dữ liệu _(yêu cầu xác thực)_

| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| `GET / POST` | `/api/v1/contacts` | Danh sách / Tạo liên hệ |
| `GET / PUT / DELETE` | `/api/v1/contacts/:id` | Xem / Cập nhật / Xóa liên hệ |
| `GET / POST` | `/api/v1/companies` | Danh sách / Tạo công ty |
| `GET / PUT / DELETE` | `/api/v1/companies/:id` | Xem / Cập nhật / Xóa công ty |
| `GET / POST` | `/api/v1/contacts/:id/notes` | Danh sách / Thêm ghi chú liên hệ |
| `GET / POST` | `/api/v1/reminders` | Danh sách / Tạo nhắc nhở |
| `PUT / DELETE` | `/api/v1/reminders/:id` | Cập nhật / Xóa nhắc nhở |
| `GET` | `/api/v1/dashboard/stats` | Thống kê bảng điều khiển |

---

## 🧪 Kiểm thử

### E2E (Playwright)

```bash
# Cài đặt trình duyệt (chỉ lần đầu)
cd frontend && pnpm exec playwright install

# Chạy kiểm thử
pnpm exec playwright test

# Chế độ UI tương tác
pnpm exec playwright test --ui
```

> Hãy đảm bảo dev server đang chạy trước khi thực hiện kiểm thử.
