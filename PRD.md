# Product Requirements Document

# MiniCRM - Google Sheets Edition

## 1. Product Overview

**MiniCRM** là một ứng dụng quản lý quan hệ khách hàng (CRM) nhẹ, được thiết kế đặc biệt cho **doanh nghiệp siêu nhỏ và hộ kinh doanh cá nhân** tại Việt Nam.

Điểm độc đáo của MiniCRM là sử dụng **Google Sheets làm database**, cho phép người dùng:

- Sử dụng web app với giao diện hiện đại
- Trực tiếp thao tác trên Google Sheets khi cần
- Không cần setup server database phức tạp
- Chi phí vận hành gần như bằng 0

**Vấn đề giải quyết:**

- Doanh nghiệp nhỏ cần CRM nhưng ngại chi phí/phức tạp của các hệ thống lớn
- Nhiều người đã quen dùng Google Sheets để quản lý khách hàng nhưng thiếu giao diện chuyên nghiệp
- Cần giải pháp có thể vừa dùng app vừa edit trực tiếp trên Sheets

---

## 2. Goals & Objectives

### Primary Goals

- **Đơn giản hóa**: Giao diện dễ sử dụng, không cần training
- **Chi phí thấp**: Chỉ cần tài khoản Google, hosting miễn phí trên Cloudflare
- **Linh hoạt**: Có thể thao tác qua web app hoặc trực tiếp trên Google Sheets

### Success Metrics

- Thời gian onboarding < 5 phút
- Load time < 2 giây
- Hỗ trợ đến 5,000 contacts (phù hợp doanh nghiệp nhỏ)

### Key Differentiators

- **Dual-mode**: Web app + Google Sheets editing
- **Zero infrastructure**: Không cần database server
- **Vietnamese-first**: Giao diện và UX tối ưu cho người Việt

---

## 3. Target Users

### Persona 1: Chủ cửa hàng online

- **Mô tả**: Bán hàng trên Facebook/Instagram, 50-500 khách hàng
- **Nhu cầu**: Ghi chú đơn hàng, lịch sử mua sắm, nhắc nhở follow-up
- **Pain points**: Ghi trên giấy hay Excel offline thường bị mất, khó tìm kiếm

### Persona 2: Freelancer / Tư vấn viên

- **Mô tả**: Cung cấp dịch vụ, 20-200 khách hàng
- **Nhu cầu**: Quản lý thông tin liên hệ, lịch sử tương tác, pipeline deals
- **Pain points**: Thiếu công cụ theo dõi khách hàng tiềm năng

### Persona 3: Sales SME

- **Mô tả**: Nhân viên kinh doanh tại doanh nghiệp nhỏ
- **Nhu cầu**: Danh sách khách hàng, công ty, theo dõi deals
- **Pain points**: Boss yêu cầu dùng Sheets nhưng muốn giao diện CRM

---

## 4. Features & Requirements

### Core Features (MVP)

- [ ] **F1: Quản lý Contacts**
  - Thêm, sửa, xóa contact
  - Thông tin: Tên, Email, Phone, Company, Source, Notes
  - Tìm kiếm và lọc contacts
  - Acceptance: CRUD hoạt động, sync với Google Sheets

- [ ] **F2: Quản lý Companies**
  - Thêm, sửa, xóa công ty
  - Thông tin: Tên công ty, Industry, Website, Address, Notes
  - Liên kết contacts với company
  - Acceptance: CRUD hoạt động, hiển thị contacts liên quan

- [ ] **F3: Notes/Activities**
  - Ghi chú tương tác với contact/company
  - Lịch sử hoạt động timeline
  - Acceptance: Notes được lưu và hiển thị theo thời gian

- [ ] **F4: Reminders**
  - Đặt nhắc nhở follow-up
  - Hiển thị reminders sắp đến hạn
  - Acceptance: Reminders hiển thị đúng thời gian

- [ ] **F5: Dashboard**
  - Tổng quan số liệu: Contacts, Companies, Reminders hôm nay
  - Recent activities
  - Acceptance: Số liệu chính xác, load nhanh

- [ ] **F6: Google Sheets Sync**
  - Real-time sync với Google Sheets
  - User có thể edit trên Sheets, app tự refresh
  - Acceptance: Thay đổi trên Sheets phản ánh trong app (sau refresh)

- [ ] **F9: Feedback Loop (Toast Notifications)**
  - Thay thế `alert()` bằng toast component chuyên nghiệp
  - Toast types: success (xanh), error (đỏ), warning (vàng), info (xanh dương)
  - Auto-dismiss sau 3 giây, có thể close thủ công
  - Position: top-right góc màn hình
  - Show toast khi: tạo/sửa/xóa thành công, có lỗi API
  - Acceptance: Mọi action đều có phản hồi toast rõ ràng

- [ ] **F10: Button Loading States**
  - Buttons show spinner + disabled khi đang call API
  - Submit button trong forms không nhấn được 2 lần
  - Delete button disabled trong lúc xóa
  - Acceptance: Không có double-submit, UX rõ ràng khi chờ

- [ ] **F11: User Profile Page**
  - Trang `/profile` riêng trong app
  - Hiển thị: Avatar (từ Google), Tên, Email (từ OAuth)
  - Thông tin app: Ngày đăng ký, số lượng contacts/companies
  - Link mở Google Sheet cá nhân
  - Acceptance: User thấy và quản lý được thông tin của mình

### Nice-to-have (Điểm cộng - Post-MVP)

- [ ] **B1: Analytics (PostHog)**
  - Track page views, user actions (CRUD events)
  - Tích hợp PostHog (self-hosted hoặc cloud free tier)
  - Không cần dashboard phức tạp, chỉ cần sự kiện cơ bản

- [ ] **B2: SEO Optimization**
  - Open Graph meta tags (og:title, og:description, og:image)
  - Twitter Card meta tags
  - Structured data (JSON-LD) cho app
  - Canonical URL
  - Sitemap cơ bản (chỉ landing/login page vì app cần auth)

- [ ] **B3: PWA (Progressive Web App)**
  - `manifest.json` với icon, name, theme_color
  - Service worker cho offline fallback (chỉ cần shell, data cần network)
  - "Add to Home Screen" prompt
  - Acceptance: App cài được lên màn hình điện thoại

- [ ] **B4: Dark Mode**
  - Toggle sáng/tối trong header hoặc settings
  - Lưu preference vào localStorage
  - Tailwind `dark:` variants cho toàn bộ UI
  - Acceptance: Chuyển mode mượt mà, không flash trắng khi load

---

## 5. User Flows

### Main Flow: Thêm Contact mới

```
[Dashboard] → [Click "Add Contact"] → [Form hiện ra]
                                             ↓
[Điền thông tin] → [Chọn Company (optional)] → [Click Save]
                                                     ↓
[API gọi Google Sheets] → [Thêm row mới] → [Quay về danh sách]
                                                     ↓
                                           [Toast "Contact added!"]
```

### Flow: Tìm kiếm & Xem chi tiết

```
[Contact List] → [Gõ tìm kiếm] → [Kết quả lọc real-time]
                                         ↓
                            [Click vào contact] → [Detail Panel]
                                                        ↓
                                              [Xem/Edit thông tin]
                                              [Xem Notes timeline]
                                              [Thêm Reminder]
```

### Flow: Feedback khi thao tác

```
[User click "Save"] → [Button spinner + disabled]
                              ↓
                     [API call...]
                              ↓
              [Success] → [Toast "Đã lưu thành công!"] → [Auto dismiss 3s]
              [Error]   → [Toast "Lỗi: ..." đỏ]        → [Close thủ công]
```

### Flow: Xem trang Profile

```
[Click Avatar/User menu] → [Chọn "Hồ sơ cá nhân"]
                                    ↓
                           [/profile page]
                           [Hiện: Avatar, Tên, Email]
                           [Stats: X contacts, Y companies]
                           [Link: Mở Google Sheet]
```

### Flow: Sử dụng Google Sheets trực tiếp

```
[User mở Google Sheets] → [Edit/Add data trực tiếp]
                                    ↓
           [Quay lại Web App] → [Click Refresh / Auto-sync]
                                    ↓
                         [Data được cập nhật trên UI]
```

---

## 6. Wireframes

### Screen 1: Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 MiniCRM                        [🔍 Search] [👤 User]    │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Dashboard│   ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│          │   │   125   │ │   23    │ │    5    │           │
│ Contacts │   │Contacts │ │Companies│ │Reminders│           │
│          │   └─────────┘ └─────────┘ └─────────┘           │
│ Companies│                                                  │
│          │   ┌────────────────────────────────────┐        │
│ Reminders│   │ 📋 Recent Activities               │        │
│          │   ├────────────────────────────────────┤        │
│ Settings │   │ • Added contact: Nguyễn Văn A      │        │
│          │   │ • Note added to: Trần Thị B        │        │
│          │   │ • Company updated: ABC Corp        │        │
│          │   └────────────────────────────────────┘        │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Screen 2: Contact List

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 MiniCRM                        [🔍 Search] [👤 User]    │
├──────────┬──────────────────────────────────────────────────┤
│          │   Contacts                    [+ Add Contact]    │
│ Dashboard│   ┌─────────────────────────────────────────┐    │
│          │   │ 🔍 Search contacts...          [Filter] │    │
│ Contacts │   └─────────────────────────────────────────┘    │
│    ★     │                                                  │
│ Companies│   ┌─────────────────────────────────────────┐    │
│          │   │ ○ Nguyễn Văn A    │ ABC Corp │ 09xxxxxxx │   │
│ Reminders│   │ ○ Trần Thị B      │ XYZ Ltd  │ 09xxxxxxx │   │
│          │   │ ○ Lê Văn C        │ -        │ 09xxxxxxx │   │
│ Settings │   │ ○ Phạm Thị D      │ DEF Inc  │ 09xxxxxxx │   │
│          │   └─────────────────────────────────────────┘    │
│          │                                                  │
│          │   [← Prev]  Page 1 of 5  [Next →]                │
└──────────┴──────────────────────────────────────────────────┘
```

### Screen 3: Contact Detail

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 MiniCRM                        [🔍 Search] [👤 User]    │
├──────────┬──────────────────────────────────────────────────┤
│          │   ← Back to Contacts             [Edit] [Delete] │
│ Dashboard│                                                  │
│          │   ┌─────────────────────────────────────────┐    │
│ Contacts │   │  👤 Nguyễn Văn A                        │    │
│    ★     │   │  ────────────────────────────────────── │    │
│ Companies│   │  📧 nguyenvana@email.com                │    │
│          │   │  📱 0912 345 678                        │    │
│ Reminders│   │  🏢 ABC Corporation                     │    │
│          │   │  📍 Source: Facebook                    │    │
│ Settings │   └─────────────────────────────────────────┘    │
│          │                                                  │
│          │   ┌─────────────────────────────────────────┐    │
│          │   │ 📝 Notes                    [+ Add Note]│    │
│          │   ├─────────────────────────────────────────┤    │
│          │   │ 2024-01-15: Gọi điện xác nhận đơn hàng  │    │
│          │   │ 2024-01-10: Gửi báo giá sản phẩm        │    │
│          │   └─────────────────────────────────────────┘    │
│          │                                                  │
│          │   ┌─────────────────────────────────────────┐    │
│          │   │ ⏰ Reminders               [+ Add]      │    │
│          │   │ • 2024-01-20: Follow up báo giá         │    │
│          │   └─────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────┘
```

### Screen 4: Toast Notifications

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 MiniCRM                        [🔍 Search] [👤 User]    │
│                                                             │
│                                   ┌──────────────────────┐ │
│                                   │ ✅ Đã lưu thành công │ │
│                                   │                    ✕  │ │
│                                   └──────────────────────┘ │
│   (main content...)               ┌──────────────────────┐ │
│                                   │ ❌ Lỗi kết nối API   │ │
│                                   │                    ✕  │ │
│                                   └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Screen 5: User Profile Page

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 MiniCRM                        [🔍 Search] [👤 User]    │
├──────────┬──────────────────────────────────────────────────┤
│          │   Hồ sơ cá nhân                                  │
│ Dashboard│                                                  │
│          │   ┌─────────────────────────────────────────┐    │
│ Contacts │   │     [Avatar 80px]                       │    │
│          │   │     Nguyễn Văn A                        │    │
│ Companies│   │     nguyenvana@gmail.com                │    │
│          │   └─────────────────────────────────────────┘    │
│ Reminders│                                                  │
│          │   ┌─────────────────────────────────────────┐    │
│ Profile  │   │ Thống kê                                │    │
│    ★     │   ├─────────────────────────────────────────┤    │
│          │   │  Contacts: 125      Companies: 23       │    │
│          │   │  Reminders: 8       Ngày dùng: 45 ngày  │    │
│          │   └─────────────────────────────────────────┘    │
│          │                                                  │
│          │   [🔗 Mở Google Sheet của tôi]                   │
│          │   [🚪 Đăng xuất]                                 │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 7. Data Models

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│    Companies    │ 1───N │    Contacts     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ name            │       │ name            │
│ industry        │       │ email           │
│ website         │       │ phone           │
│ address         │       │ company_id (FK) │
│ notes           │       │ source          │
│ created_at      │       │ notes           │
│ updated_at      │       │ created_at      │
└─────────────────┘       │ updated_at      │
                          └─────────────────┘
                                  │
                                  │ 1
                                  │
                                  N
                          ┌─────────────────┐
                          │     Notes       │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ contact_id (FK) │
                          │ content         │
                          │ created_at      │
                          └─────────────────┘
                                  
┌─────────────────┐
│   Reminders     │
├─────────────────┤
│ id (PK)         │
│ contact_id (FK) │
│ title           │
│ due_date        │
│ is_done         │
│ created_at      │
└─────────────────┘
```

### Google Sheets Structure

**Sheet 1: `contacts`**

| id | name | email | phone | company_id | source | notes | created_at | updated_at |
|----|------|-------|-------|------------|--------|-------|------------|------------|
| 1  | Nguyễn Văn A | <a@email.com> | 0912345678 | 1 | Facebook | VIP customer | 2024-01-01 | 2024-01-15 |

**Sheet 2: `companies`**

| id | name | industry | website | address | notes | created_at | updated_at |
|----|------|----------|---------|---------|-------|------------|------------|
| 1  | ABC Corp | Retail | abc.com | HCM | Key partner | 2024-01-01 | 2024-01-10 |

**Sheet 3: `notes`**

| id | contact_id | content | created_at |
|----|------------|---------|------------|
| 1  | 1 | Called to confirm order | 2024-01-15 10:30:00 |

**Sheet 4: `reminders`**

| id | contact_id | title | due_date | is_done | created_at |
|----|------------|-------|----------|---------|------------|
| 1  | 1 | Follow up quotation | 2024-01-20 | FALSE | 2024-01-15 |

### User Profile (từ OAuth session - không lưu DB)

```typescript
interface UserProfile {
  name: string;         // Từ Google OAuth
  email: string;        // Từ Google OAuth
  picture: string;      // URL avatar từ Google
  spreadsheetId: string; // ID Google Sheet của user
}
```

---

## 8. Technical Architecture

### System Diagram

```
┌──────────────┐      HTTPS       ┌──────────────────────────────┐
│              │ ───────────────► │     Cloudflare Workers       │
│   Browser    │                  │  ┌────────────────────────┐  │
│              │ ◄─────────────── │  │ Static Assets (React)  │  │
│              │   HTML/JS/CSS    │  │ API Endpoints          │  │
└──────────────┘   JSON + Cookie  │  └────────────────────────┘  │
        │                         └──────────────────────────────┘
        │ OAuth 2.0 Login                     │
        ▼                                     │ Google Sheets API
┌─────────────────┐                           ▼
│                 │                  ┌─────────────────────┐
│ Google OAuth    │                  │                     │
│ (Sign-in)       │                  │   Google Sheets     │
│                 │                  │   (Database)        │
└─────────────────┘                  │                     │
                                     └─────────────────────┘
```

### Deployment Architecture

```
                    ┌─────────────────────────────┐
                    │      Cloudflare Network     │
┌──────────┐        │  ┌───────────────────────┐  │        ┌─────────────┐
│          │        │  │                       │  │        │             │
│  Browser │───────►│  │  Cloudflare Workers   │──│───────►│   Google    │
│          │        │  │  (API + Static Assets) │  │        │   Sheets    │
│          │◄───────│  │                       │  │◄───────│   API       │
└──────────┘        │  │  /api/* → API handler │  │        │             │
                    │  │  /*     → frontend    │  │        └─────────────┘
                    │  └───────────────────────┘  │
                    │                             │
                    └─────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Vite + React + TypeScript | Fast dev experience, type safety |
| **Styling** | Tailwind CSS | Rapid UI development, utility-first |
| **Backend** | Cloudflare Workers | Edge computing, free tier generous |
| **Database** | Google Sheets | User requirement, familiar to users |
| **Auth** | Google OAuth 2.0 | User sign-in, grants Sheets access |

---

## 9. API Design

### Base URL

```
https://api.minicrm.workers.dev/api/v1
```

### Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/contacts` | GET | List all contacts | - | `Contact[]` |
| `/contacts` | POST | Create contact | `Contact` | `Contact` |
| `/contacts/:id` | GET | Get single contact | - | `Contact` |
| `/contacts/:id` | PUT | Update contact | `Contact` | `Contact` |
| `/contacts/:id` | DELETE | Delete contact | - | `{ success: true }` |
| `/companies` | GET | List all companies | - | `Company[]` |
| `/companies` | POST | Create company | `Company` | `Company` |
| `/companies/:id` | GET | Get single company | - | `Company` |
| `/companies/:id` | PUT | Update company | `Company` | `Company` |
| `/companies/:id` | DELETE | Delete company | - | `{ success: true }` |
| `/contacts/:id/notes` | GET | Get contact notes | - | `Note[]` |
| `/contacts/:id/notes` | POST | Add note | `Note` | `Note` |
| `/reminders` | GET | List reminders | `?due_before=date` | `Reminder[]` |
| `/reminders` | POST | Create reminder | `Reminder` | `Reminder` |
| `/reminders/:id` | PUT | Update reminder | `Reminder` | `Reminder` |
| `/reminders/:id` | DELETE | Delete reminder | - | `{ success: true }` |

### Type Definitions

```typescript
interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company_id?: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  contact_id: string;
  content: string;
  created_at: string;
}

interface Reminder {
  id: string;
  contact_id: string;
  title: string;
  due_date: string;
  is_done: boolean;
  created_at: string;
}
```

---

## 10. UI/UX Guidelines

### Color Scheme

```
Primary:    #3B82F6 (Blue-500) - Actions, links
Secondary:  #10B981 (Emerald-500) - Success states
Accent:     #F59E0B (Amber-500) - Warnings, highlights
Neutral:    #374151 (Gray-700) - Text
Background: #F9FAFB (Gray-50) - Page background
Card:       #FFFFFF - Card backgrounds
Border:     #E5E7EB (Gray-200) - Borders
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, Gray-900
- **Body**: Regular, Gray-700
- **Sizes**: 14px base, 16px for inputs

### Design Principles

1. **Clean & Minimal**: Không clutter, focus vào content
2. **Vietnamese-friendly**: Hỗ trợ dấu, tên Việt Nam dài
3. **Mobile-first thinking**: Responsive từ 320px
4. **Consistent spacing**: 4px grid system
5. **Clear CTAs**: Buttons rõ ràng, dễ tap

### Component Library

- Custom components built with Tailwind
- Focus on reusability
- Accessible (ARIA labels, keyboard nav)

---

## 11. Google Sheets Database

**Spreadsheet Name**: `SheetCRM Data` (auto-created per user in their Google Drive)

### Limitations to Consider

- **Cell limit**: 10 million cells max
- **Performance**: Optimal up to ~5,000 rows per sheet
- **API quota**: 300 read requests/min, 60 write requests/min

### Best Practices

- Batch updates when possible
- Implement client-side caching
- Use pagination for large lists
- Index by ID for faster lookups

---

## 12. Security Considerations

### Authentication Flow (OAuth 2.0)

1. User clicks "Sign in with Google" → redirected to Google consent screen
2. User grants permission to access Google Sheets + Drive (app files only)
3. Backend exchanges auth code for access + refresh tokens
4. Backend searches Drive for existing "SheetCRM Data" spreadsheet
5. If not found, creates new spreadsheet with 4 tabs + headers
6. Session (tokens + spreadsheetId) stored in AES-GCM encrypted HttpOnly cookie
7. Access tokens auto-refresh when expired
8. All data endpoints return 401 if not authenticated

### Data Protection

- No user credentials stored on server
- Tokens encrypted in HttpOnly, Secure, SameSite cookies
- HTTPS only
- OAuth Client Secret stored as Cloudflare secret
- Rate limiting on API

### Privacy

- Data stays in user's Google Drive
- No third-party data storage
- User maintains full data ownership
- User can revoke access anytime via Google Account settings

---

## 13. Research Sources

| Source | Key Insight |
|--------|-------------|
| Google Sheets API Docs | OAuth 2.0 user auth, batch updates |
| Cloudflare Workers Docs | TypeScript support, secrets management |
| CRM Best Practices | Contact/Company/Notes data model |
| MiniCRM.io | Feature set for small business |
| Google Sheets Limits | 10M cells, 300 read req/min |
