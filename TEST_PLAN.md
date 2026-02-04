# MiniCRM Test Plan

## Test Environment
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:8787 (Cloudflare Workers local)
- **Database**: Google Sheets

## Test Cases

### TC-01: Dashboard Load
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to http://localhost:5173 | Dashboard page loads |
| 2 | Wait for data to load | Stats cards show numbers |
| 3 | Check stats cards | Shows Contacts, Companies, Reminders counts |
| 4 | Check recent contacts list | Shows list or "Chưa có contact nào" |
| 5 | Check upcoming reminders | Shows list or "Không có reminders" |

### TC-02: Contact CRUD
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Contacts page | Contacts page loads |
| 2 | Click "+ Thêm Contact" | Modal opens |
| 3 | Fill name: "Test User" | Input accepts text |
| 4 | Fill email: "test@example.com" | Input accepts email |
| 5 | Fill phone: "0912345678" | Input accepts phone |
| 6 | Click "Thêm" button | Modal closes, contact appears in list |
| 7 | Find created contact in list | Contact "Test User" visible |
| 8 | Click "Sửa" on contact | Edit modal opens with data |
| 9 | Change name to "Test User Updated" | Input changes |
| 10 | Click "Cập nhật" | Modal closes, name updated in list |
| 11 | Click "Xóa" on contact | Confirm dialog appears |
| 12 | Confirm deletion | Contact removed from list |

### TC-03: Company CRUD
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Companies page | Companies page loads |
| 2 | Click "+ Thêm Company" | Modal opens |
| 3 | Fill name: "Test Company" | Input accepts text |
| 4 | Fill industry: "Technology" | Input accepts text |
| 5 | Click "Thêm" button | Modal closes, company card appears |
| 6 | Find created company | Company "Test Company" visible |
| 7 | Click "Xóa" on company | Company removed |

### TC-04: Reminder CRUD
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Reminders page | Reminders page loads |
| 2 | Click "+ Thêm Reminder" | Modal opens |
| 3 | Select a contact | Dropdown shows contacts |
| 4 | Fill title: "Follow up call" | Input accepts text |
| 5 | Set due date: tomorrow | Date picker works |
| 6 | Click "Thêm" button | Modal closes, reminder appears |
| 7 | Click checkbox to mark done | Reminder shows as completed |
| 8 | Switch to "Hoàn thành" tab | Completed reminder visible |
| 9 | Delete reminder | Reminder removed |

### TC-05: Navigation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Dashboard" in sidebar | Navigate to / |
| 2 | Click "Contacts" in sidebar | Navigate to /contacts |
| 3 | Click "Companies" in sidebar | Navigate to /companies |
| 4 | Click "Reminders" in sidebar | Navigate to /reminders |
| 5 | Check active state highlighting | Current page highlighted in sidebar |

### TC-06: Search Functionality
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Contacts page | Page loads |
| 2 | Type search term in search box | Results filter as you type |
| 3 | Clear search | All contacts shown again |

### TC-07: Google Sheets Sync
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Đồng bộ" in header | Loading state appears |
| 2 | Wait for sync | Data refreshes |
| 3 | Click "Open Google Sheet" | Google Sheets opens in new tab |

---

## Test Execution Log

| Test ID | Status | Notes |
|---------|--------|-------|
| TC-01 | ✅ PASS | Dashboard loads, stats cards show 0 contacts/companies/reminders |
| TC-02 | ✅ PASS | Contact CREATE, UPDATE, DELETE all working |
| TC-03 | ✅ PASS | Company CREATE and DELETE working |
| TC-04 | ⚠️ PARTIAL | CREATE/TOGGLE PASS, DELETE FAIL (confirm dialog issue) |
| TC-05 | ✅ PASS | All navigation works correctly |
| TC-06 | ✅ PASS | Search filters contacts in real-time |
| TC-07 | ✅ PASS | Sync button refreshes data from Google Sheets |

## Summary
- **Total Tests**: 7
- **Passed**: 6
- **Partial**: 1 (TC-04 - Reminder DELETE)
- **Pass Rate**: 85.7%

## Known Issues
1. **TC-04 Reminder Delete**: Reminder deletion requires confirm dialog which automation had trouble handling. Manual deletion works correctly.
