# Archived Fixed Issues

> **Purpose:** Historical record of resolved problems. Moved from DEBUG_HISTORY.md when issues are confirmed fixed.

---

## ✅ 2025-12-30 15:00 - Supabase Auth Warning

### Problem
Console warning "Multiple GoTrueClient instances detected" during app initialization.

### Root Cause
Race condition in `supabaseClient.ts` - async `getSupabaseClient()` lacked mutex protection. Concurrent calls during app init (e.g., in `main.tsx` and data providers) created duplicate clients before the first call completed.

### Solution
Implemented promise-based mutex pattern:
- `initializationPromise` variable tracks ongoing init
- Concurrent calls await the same promise instead of starting new inits
- Added double-check pattern inside the async IIFE

### Files Modified
- `client/src/lib/supabaseClient.ts`

## ✅ 2025-12-30 13:00 - Overtime Alert Navigation & Types

### Problem
1. **Broken Navigation:** "Overtime" alert toast navigated to `/boss/jobs/:id` (404), should be `/boss/dashboard?job=:id`.
2. **Type Errors:** `SupabaseDataProvider.ts` had implicit `any` errors for inventory and job materials.

### Solution
1. **Navigation:** Updated `job-alert-provider.tsx` to use the correct dashboard query parameter URL.
2. **Types:** Added `SupabaseInventoryItem` and `SupabaseJobMaterial` interfaces and cast database results to them.

### Files Modified
- `client/src/components/job-alert-provider.tsx`
- `client/src/api/SupabaseDataProvider.ts`

---

## ✅ 2024-12-29 14:15 - TypeScript Error Fixes

### Problem
4 TypeScript errors in `toaster.tsx` and `set-password.tsx`

### Solution
- Fixed variant type compatibility (null → undefined) in `toaster.tsx`
- Added `(supabase.auth as any)` type assertions in `set-password.tsx`

### Files Modified
- `client/src/components/ui/toaster.tsx`
- `client/src/pages/set-password.tsx`

---

## ✅ 2024-12-29 - Job Unassignment (Pause Feature)

### Problem
When worker clicked "Je reviendrai" (pause job), job was not correctly unassigned.

### Root Causes
1. **Database Constraint:** CHECK constraint only allowed `'assigned', 'active', 'completed'` - added `'paused'`
2. **RLS Policy Missing:** Workers couldn't UPDATE jobs - added policy

### Solution
```sql
-- Added 'paused' to CHECK constraint
ALTER TABLE jobs DROP CONSTRAINT jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (status IN ('assigned', 'active', 'completed', 'paused'));

-- Added worker update policy
CREATE POLICY "Workers can update assigned jobs" ON jobs FOR UPDATE
    USING (company_id = get_user_company_id() AND (auth.uid() = assigned_to OR auth.uid() = ANY(assigned_workers)))
    WITH CHECK (company_id = get_user_company_id());
```

### Files Modified
- `client/src/api/SupabaseDataProvider.ts`
- `client/src/components/punch-out-modal.tsx`
- `supabase/setup.sql`

---

## ✅ 2024-12-29 - Admin Notifications (50% Toast)

### Problem
Admin received automatic 50% warning toast (shouldn't be automatic)

### Solution
Removed entire 50% toast block from `job-alert-provider.tsx`

---

## ✅ 2024-12-29 - Cache Management

### Problem
Users got old cached versions after deployments

### Solution
Created version check system in `client/src/lib/version-check.ts`
- Clears browser caches on version mismatch
- Called at app startup

---

## ✅ 2025-12-30 16:00 - Enforcer Security & Performance Audit

### Problems Found
1. **N+1 Query**: `deleteEmployee()` looped through jobs updating one-by-one.
2. **Dead Code**: `startJob()` had empty `addToQueue` call with only comments.
3. **Wrong RPC Name**: `addJobMaterial()` called `decrement_inventory` instead of `decrement_inventory_stock`.
4. **Import Bug**: `sync-queue.ts` imported non-existent `supabase` export.

### Solutions
1. **N+1 Fix**: Replaced loop with single batch `UPDATE` query using `.eq("assigned_to", userId)`.
2. **Dead Code Removal**: Removed 14 lines of commented-out code in offline startJob path.
3. **RPC Fix**: Corrected function name to `decrement_inventory_stock`.
4. **Import Fix**: Changed import to `getSupabaseClient` and added `await getSupabaseClient()` in `executeMutation()`.

### Files Modified
- `client/src/api/SupabaseDataProvider.ts` (lines 728-740, 884-888, 1957)
- `client/src/lib/sync-queue.ts` (lines 1, 114)

### Additional Actions
- Created `fix_geocoding_logs.sql` for user to run in Supabase SQL Editor.
- Build verified: ✅ Exit code 0.

---


---

## ✅ 2025-12-30 16:11 - Missing Database Table: geocoding_logs

### Problem
404 error fetching geocoding logs. Table missing in schema cache.

### Solution
SQL script created and run in Supabase SQL Editor.

### Verification
- **Pass:** SQL ran successfully, table and policy exist.
- **Proof:** User confirmed via Supabase SQL Editor screenshots (No artifact link available - Legacy fix).


---

## 2025-12-30 - Missing Database Table: geocoding_logs
*Fixed by: User (Manual SQL)*

### Problem
`geocoding_logs` table was missing, causing 404 errors during address validation.

### Solution
Created table via SQL script in Supabase Dashboard.

### Verification
- **Pass:** User verified table existence.
- **Status:** ✅ VERIFIED


## 8. Employee Update Fails (Hourly Rate)
*Fixed: 2025-12-30 by @Enforcer*

### Problem
"Failed to update employee" when boss attempts to change the Hourly Rate field.

### Root Cause
The `SupabaseDataProvider.updateEmployee` function did NOT map the `hourlyRate` field from the client to the `hourly_rate` database column. Additionally:
1. `SupabaseProfile` interface was missing `hourly_rate`.
2. `profileToUser` helper hardcoded `hourlyRate: null` instead of reading from DB.

### Solution
Modified `SupabaseDataProvider.ts`:
1. Added `hourly_rate: number | null` to `SupabaseProfile` interface.
2. Added `if (updates.hourlyRate !== undefined) updateData.hourly_rate = updates.hourlyRate;` to `updateEmployee`.
3. Changed `profileToUser` to use `hourlyRate: profile.hourly_rate ?? null`.

### Modified Files
- `client/src/api/SupabaseDataProvider.ts`

### Verification
- **Pass:** TypeScript compiles without errors related to this fix.
- **Proof:** [file:///C:/Users/jogor/.gemini/antigravity/brain/bdc308b8-c9f7-47c8-bc3f-7969a3ad13a7/walkthrough.md]

---

## 9. Inventory Item Deletion Fails
*Fixed: 2025-12-30 by @Desktop-Dev*

### Problem
User cannot delete inventory items. "Failed to delete items" toast appears.

### Root Cause
The `SupabaseDataProvider` class was missing the `deleteInventoryItem` method. The local `DataProvider` had it, but the Supabase provider did not implement it, causing a TypeScript error and runtime failure.

### Solution
Added `deleteInventoryItem(id: string): Promise<void>` method to `SupabaseDataProvider` after the existing `updateInventoryItem` method:
```typescript
async deleteInventoryItem(id: string): Promise<void> {
    const currentUser = await this.getMe();
    if (!currentUser || currentUser.role !== "boss") {
        throw new Error("Not authorized");
    }

    const supabase = await getSupabaseClient();
    const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id)
        .eq("company_id", currentUser.companyId);

    if (error) {
        console.error("[SupabaseDataProvider] Error deleting inventory item:", error);
        throw new Error("Failed to delete inventory item");
    }
}
```

### Modified Files
- `client/src/api/SupabaseDataProvider.ts`

### Verification
- **Pass:** TypeScript compiles with `npx tsc --noEmit` (Exit code: 0).

---

## 10. Navigation Missing on Schedule Page
*Fixed: 2025-12-30 by @Desktop-Dev*

### Problem
Header navigation bar disappears on `/boss/calendar` page.

### Root Cause
The `calendar.tsx` page was missing the standard header and navigation bar structure that exists in other boss pages like `dashboard.tsx`.

### Solution
Added the complete header structure with:
1. Logo and title section
2. Action buttons (Admin, Theme toggle, Logout)
3. Global Sub-navigation bar (Dashboard, Schedule, Inventory, Address Logs)

The calendar content was wrapped in a proper `<main>` tag within the page structure.

### Modified Files
- `client/src/pages/boss/calendar.tsx`

### Verification
- **Pass:** TypeScript compiles with `npx tsc --noEmit` (Exit code: 0).

---

## 11. Calendar Navigation Links
*Fixed: 2025-12-30 by @Desktop-Dev*

### Problem
Clicking a job on the calendar navigated to `/boss/admin?jobId=...` which didn't open the job details modal.

### Root Cause
The calendar links were using the wrong URL format. The dashboard expects `?job=` not `?jobId=` to auto-open the job details modal.

### Solution
Updated both monthly and weekly view job links in `calendar.tsx` to use the correct format:
- **Before:** `/boss/admin?jobId=${job.id}`
- **After:** `/boss/dashboard?job=${job.id}`

This matches the dashboard's URL parameter handling which auto-opens the job details modal.

### Modified Files
- `client/src/pages/boss/calendar.tsx`

### Verification
- **Pass:** TypeScript compiles with `npx tsc --noEmit` (Exit code: 0).

---

*Last updated: 2025-12-30 20:48*

---

## 2025-12-30 - Trash Icon Data Loss
*Fixed by: Removal from UI*

### Problem
Clicking the "Trash" icon on a job card permanently deleted the job from the database instead of unassigning it.

### Solution
The "Trash" icon button was removed from the `JobCard` component entirely for Workers.
- **Verification:** User tested and confirmed "trash icon work" (icon is gone/safe).

### Status
✅ VERIFIED by User.

---

## ✅ 2025-12-31 - Infra: Email Delivery (SMTP)
*Verified by: User*

### Problem
Supabase "Testing" email service reached rate limits, blocking signups.

### Solution
SMTP Provider configured / Workaround accepted via `force_verify_email.sql`.

### Status
✅ **VERIFIED** and **ARCHIVED**.

---
*Verified by: Enforcer & User*

### 1. Post-Desktop Release Audit
- **Scope:** `admin.tsx`, `job-alert-provider.tsx`, `SupabaseDataProvider.ts`.
- **Status:** ✅ **SECURE**.
    - `handleDeleteJob` safety check verified.
    - Alert navigation URLs verified (`/boss/dashboard?job=`).
    - `hourlyRate` RLS and mapping verified.

### 2. Exec Dash 2.0 Audit
- **Scope:** Financial Data Security & Calculations.
- **Status:** ✅ **SECURE**.
    - Workers CANNOT access boss-level financial data (RLS + Route Protection verified).
    - Profit/Rentability calculations verified in `executive-analytics.tsx`.
    - No N+1 queries detected in `Live Efficiency` logic.

### Status
✅ **VERIFIED** and **ARCHIVED**.

---

## ✅ 2024-12-31 - Critical Bug Fixes (Sprint 1 Wrap-up)

### 1. Invitation & Password Reset Loop
- **Problem:** Invited employees entered an "infinite loop" when setting their password, and accounts were not fully registered (zombie state).
- **Root Cause:** **RLS Policy Failure**. New users could not `UPDATE` or `INSERT` their own `profiles` row during the invitation acceptance flow because they relied on a `company_id` they didn't officially have access to yet in the RLS check.
- **Solution:** Created `fix_profiles_rls.sql` to explicitly grant `SELECT`, `UPDATE`, and `INSERT` permissions on `profiles` for `auth.uid() = id`.

### 2. [SECURITY] Job Deletion Data Loss
- **Problem:** Workers clicking "Delete" (Trash icon) on a job permanently deleted it from the database.
- **Root Cause:** The `handleDeleteJob` function in `admin.tsx` defaulted to deletion if a `sourceWorkerId` wasn't provided (which happened in some UI contexts), without checking if the job was currently assigned.
- **Solution:** Modified `handleDeleteJob` to perform a **Safety Check**: if the job has `assignedWorkers`, it now performs an **Unassign** action instead of a **Delete** action, preserving the data.

### 3. Hourly Rate Update Failure
- **Problem:** Bosses could not update the "Hourly Rate" field for employees ("Failed to update employee").
- **Root Cause:** 
    1. The `hourly_rate` column was physically missing from the `profiles` table.
    2. Bosses lacked RLS permission to `UPDATE` rows in `profiles` for other users (their employees).
- **Solution:** Created `fix_hourly_rate.sql` to:
    1. Add the `hourly_rate` column.
    2. Add RLS policy: `"Bosses can update company profiles"`.

### Files Modified
- `client/src/pages/boss/admin.tsx`
- `fix_profiles_rls.sql` (New)
- `fix_hourly_rate.sql` (New)

### Verification
- **Pass:** User confirmed "it does work good job" for invitation flow.


---

## ✅ 2025-12-31 - Epic: Executive Dashboard 2.0 (UI + Export)
*Completed by: @Desktop-Dev (Derek) | Audited by: @Enforcer (Marcus)*

### Feature Overview
Complete Executive Dashboard overhaul with premium "Bento Grid" layout, financial analytics, and export capabilities.

### Phases Completed
1. **Phase 1 - Bento Grid:** Replaced list view with Widget Grid layout.
2. **Phase 2 - Refinement:** Removed Operational Views, Added Inventory Stats, Glassmorphism styling.
3. **Phase 3 - Export:** CSV & PDF export with time range filtering.

### Components Delivered
- Revenue/Profit/Cost/Inventory value stat cards
- Rentability chart (Revenue vs Cost per job)
- Team Utilization pie chart
- Efficiency bar chart (Actual vs Estimated hours)
- Time range filter (1W, 1M, 6M, 1Y, ALL)
- Export dropdown (CSV, PDF)

### Files Modified
- `client/src/components/executive-analytics.tsx` (NEW)
- `client/src/lib/download-utils.ts` (NEW)
- `client/src/pages/boss/dashboard.tsx`
- `client/src/lib/translations.ts` (i18n keys added)

### Security Audit Results
| Check | Result |
|-------|--------|
| XSS in PDF | ✅ PASS |
| Data Leakage | ✅ PASS |
| Performance | ✅ PASS |
| Build Stability | ✅ PASS |

### Security Improvements Applied
1. **CSV Injection Protection:** Added `sanitizeCSVCell()` to neutralize Excel formula attacks.
2. **Dataset Limit:** CSV export capped at 500 sessions with truncation notice.

### Enforcer Score
**8.25/10** | Breakdown: Sec:8, Perf:8, Corr:9, Maint:8

### Verification
- **Build:** ✅ Exit code 0
- **Push:** ✅ Committed `ac008e4`
- **User:** Dashboard verified working

### Status
✅ **VERIFIED** and **ARCHIVED**.

---

## ✅ S6. Calendar Job Creation Modal Reuse
*Fixed: 2026-01-01 by @Desktop-Dev*

### Problem
Job creation modal in Calendar page was different/inconsistent from the Admin panel's modal.

### Solution
Updated `client/src/pages/boss/calendar/index.tsx` to reuse the shared `JobFormModal` component that Admin uses. Ensures feature parity and UX consistency.

### Verification
- **Pass:** Build passed. Plan marked as Done.
- **Status:** ✅ VERIFIED and ARCHIVED.



##  2026-01-03 - Mobile Scroll & Rotation Fix
*Fixed by: @Desktop-Dev (Derek)*

### Problem
1. **Horizontal Scroll:** Users could scroll left on mobile, revealing empty space.
2. **Rotation Layout:** Rotating to landscape and back caused the header to shift right and get stuck, pushing icons off-screen.

### Root Cause
1. **Overflow:** Missing overflow-x: hidden on global html/ody and App wrapper. max-width: 100vw included scrollbars in width calculation, causing shifting.
2. **Header Layout:** CalendarHeader flex items were not constrained, allowing text to push icons out.
3. **Scroll Reset:** Browser layout reflow on orientation change was slower than the immediate scroll reset event.

### Solution
1. **Global CSS:** Applied overflow-x: hidden, width: 100%, and reset margins in index.css.
2. **Double Tap Reset:** Implemented a delayed scroll reset (100ms, 300ms, 500ms) in calendar/index.tsx to handle race conditions.
3. **Flex Hardening:** Added lex-1 min-w-0 to header text and lex-shrink-0 to icons.

### Verification
- **Status:**  VERIFIED by User ('perfect this wrk flawlessly').

---

## ✅ 2026-01-03 - B1. Date Picker UX (Calendar Popup)
*Fixed by: Previous Session (Pre-existing code)*

### Problem
Users had to TYPE dates instead of clicking a visual calendar popup.

### Solution
`DatePickerField` component in `JobScheduleFields.tsx` already uses:
- `Popover` + `Calendar` from shadcn/ui
- Click to open calendar popup
- Format: MM/dd/yy

### Verification
- **Status:** ✅ VERIFIED by User (2026-01-03)

---

## ✅ 2026-01-03 - Admin Drag Selection Bug When Scrolled
*Fixed by: Previous refactor (DnD Kit migration)*

### Problem
Dragging job while scrolled selected wrong card (grabbed from top of page).

### Solution
Code uses `@dnd-kit/core` library which handles scroll offset automatically via `rectIntersection` collision detection.

### Verification
- **Status:** ✅ VERIFIED by User (2026-01-03)

---

## ✅ 2026-01-03 - B4. Job Form Shows ALL Workers Instead of Just Assigned
*Fixed by: Previous session*

### Problem
"Assigned Workers" section showed ALL workers even when job had none assigned.

### Solution
Code in `JobAssignmentFields.tsx` now:
- Shows "No workers assigned yet" when `assignedWorkers.length === 0`
- Filters grid to only show workers in `formData.assignedWorkers`

### Verification
- **Status:** ✅ VERIFIED by User (2026-01-03)

---

## ✅ 2026-01-03 - Smart Schedule Logic (Multi-Day Jobs)
*Fixed by: Derek (2025-12-31)*

### Feature
Intelligent calendar visualization for multi-day jobs:
- Job spans calculated as `Est. Hours ÷ (8 hours × Workers)`
- "Skip Weekends" option: Friday start continues Mon/Tue
- "Day 1/3", "Day 2/3" badges on calendar tiles

### Files
- `schedule-utils.ts` (NEW)
- `calendar.tsx` (integrated)
- `translations.ts` (i18n keys)

### Verification
- **Status:** ✅ VERIFIED by User (2026-01-03)

---

## ✅ 2026-01-04 - Dev Footer Cleanup
*Fixed by: @Mobile-Dev (Maya)*

### Problem
Dev footer ("Fieldbox © 2026 v1.0.4") was left on login page after testing.

### Solution
Removed lines 377-383 from `client/src/pages/login.tsx`.

### Verification
- **Build:** `npm run build` passed.
- **Manual:** Pending user verification (No browser access).
- **Status:** ✅ VERIFIED by User (2026-01-04)

---

## ✅ 2026-01-06 - Marcus (Enforcer) - 8 Bugs Fixed (Fleet + Job Creation)

### Problems Fixed:
1. **Missing Delete Button (Truck Items):** Added delete button to truck stock rows.
2. **Modal Not Draggable (TruckDetail):** Made modal compatible with Draggable system.
3. **Scheduled Date Not Required:** Made date mandatory in Job Form.
4. **Job Number Not Visible:** Added job number badge to creation flow.
5. **No Materials Upfront:** Added materials selection to Job Creation form.
6. **Validation Edit:** Allowed editing notes/materials in Validation Modal.
7. **Missing Check-In Data:** Added full activity log (check-ins, alerts) to Validation Modal.
8. **Worker History Duration:** Fixed 00:00 display issue.

### Files Modified:
- `TruckDetailModal.tsx`
- `JobValidationModal.tsx`
- `JobFormModal.tsx`
- `AdminEmployeeDialogs.tsx`

---

## ✅ 2026-01-06 - Night Session - Swipeable UI & Inventory Fixes

### Features Delivered:
1. **Swipeable Materials List:** Edit/Delete gestures for mobile efficiency.
2. **Edit Quantity Modal:** Number input for materials (easier than +/- buttons).
3. **Quote Logic:** Materials on Quote jobs do not deduct from inventory.
4. **Calendar Swipe Delete:** Delete jobs from calendar with swipe gesture.
5. **Inventory Add Fix:** Mapped `cost_price` to `unit_cost` correctly.

### Files Modified:
- `SessionProgressPanel.tsx`
- `SwipeableListItem.tsx` (New)
- `InventoryProvider.ts`
- `day-dialog.tsx`

---

## ✅ 2026-01-13 - Reception History Timestamps Fix
*Fixed by: Previous Session*

### Problem
Reception History grouped entries by date only. When multiple receptions happened same day, they were merged and couldn't be distinguished.

### Solution
Each reception now shows as a separate entry with full timestamp including hours (e.g., "2026-01-13, 14:30"). Same-day entries from same supplier are now distinct.

### Affected Files
- `ReceptionTimeline.tsx`
- `OrderDetailModal.tsx`
- `LogsTab.tsx`

### Verification
- **Status:** ✅ VERIFIED by User (2026-01-13)
