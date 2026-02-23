# Testing Guide
> ⚠️ **CRITICAL:** AGENTS MUST NOT RUN BROWSER TESTS. RE-READ `COMMUNICATION_PROTOCOL.md`.
> ALL VERIFICATION MUST BE DONE VIA STATIC ANALYSIS OR USER SCREENSHOTS.

## 1. End-to-End Tests (Playwright)

**Source:** `docs/E2E_TESTS.md`

### Prerequisites
- Install dependencies: `npm install`
- Install Playwright binary: `npx playwright install --with-deps chromium`
- Unset Supabase env vars to run in "demo auth mode".

### Running Locally
- **Run Suite:** `npm run test:e2e` (Starts dev server on port 5000)
- **Debug UI:** `npm run test:e2e:ui`

## 2. Live Testing (Manual & Agent)

**URL:** `https://asset-manager1.pages.dev/`

### Test Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin (Boss)** | `jonathan@oftbox.com` | `Gorce8514@` |
| **Worker** | `cfisynergie@gmail.com` | `Sunder66@` |

> **⚠️ IMPORTANT:** Workers require GPS to punch in.
> To test without real GPS (e.g., in **User Browser**), you must enable **Dev Mode**.
> 
> **📍 QA Bypass Protocol:** Automating? Missing Hardware?
> **Enable Mock Mode** via Console:
> ```javascript
> localStorage.setItem('QA_MOCK_CAMERA', 'true');
> localStorage.setItem('DEV_MODE_MOCK_GPS', 'true');
> // Reload page after setting
> ```

### Credentials (Demo Mode - Local)
- **Worker:** `john.worker` / `password123`
- **Override:** Set `E2E_EMAIL` and `E2E_PASSWORD` env vars.

---

## 2. Backend Test Checklist (Multi-Tenant)

**Source:** `docs/BACKEND_TEST_CHECKLIST.md`

Use this checklist to validate multi-tenant isolation.

### Setup
- Create 2 companies (Company A, Company B).
- Create 1 Admin and 1 Worker for each.

### Validation Steps
- [ ] **Data Isolation:** Admin A cannot see Job B. Worker A cannot see Job B.
- [ ] **Role Access:** Worker cannot create jobs. Admin can.
- [ ] **Storage:** Worker A cannot upload to Company B's folder.
- [ ] **Invites:** Admin creates invite -> Worker claims -> Status `accepted`.
- [ ] **Session Logic:** Worker cannot start session on unassigned job.
