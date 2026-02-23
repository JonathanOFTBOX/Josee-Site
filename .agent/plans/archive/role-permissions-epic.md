# EPIC: Role Permissions System

> **Goal:** Granular control over permissions (Dashboard, Schedule, Admin, Inventory, Reports) per role and per user.
> **Status:** 🔴 Ready for Development
> **Priority:** 🔵 HIGH (Enterprise Feature)

---

## Requirements
1. **Roles:** `owner` (Super Admin), `dispatcher` (Admin-lite), `worker` (Basic), `boss` (Admin)
2. **Module Access:** Boss can toggle visibility of sections:
   - Dashboard
   - Calendar
   - Admin (Users/Jobs)
   - Inventory
   - Reports
3. **Per-User Override:** Specific users can have custom permissions.
4. **Dynamic Sidebar:** Sidebar hides unauthorized sections.

## Proposed Architecture

### 1. Database Changes
- Add `permissions` jsonb column to `profiles` table.
- Default: `{ "dashboard": true, "calendar": true, "admin": false, ... }`

### 2. Frontend State
- Update `useAuth` to load `permissions`.
- Create `PrivateRoute` guard that checks permission before rendering route.

### 3. UI Changes
- **Sidebar:** Conditionally render links based on `user.permissions`.
- **Boss Settings:** New "Permissions" tab in Admin to toggle checkboxes for each employee.

## Phased Approach
- **Phase 1:** DB Schema + `useAuth` update
- **Phase 2:** Admin UI to edit permissions
- **Phase 3:** Sidebar/Route integration

## Verification Plan
1. `npm run build`
2. **Manual:**
   - Create "Dispatcher" user
   - Give access ONLY to Calendar
   - Login as Dispatcher
   - Verify Sidebar only shows Calendar
   - Try direct URL to `/boss/admin` → Verify Access Denied

## Effort
- Phase 1: 1 session
- Phase 2: 2 sessions
- Phase 3: 1 session
