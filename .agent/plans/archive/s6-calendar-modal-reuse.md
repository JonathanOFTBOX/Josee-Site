# Calendar Job Creation Modal Fix (S6)

> **Goal:** Reuse Admin's Job Creation Modal in the Calendar view (instead of using a different/inconsistent one).
> **Status:** ✅ Done
> **Value:** High - Consistent UX across Admin/Calendar
> **Priority:** 🟠 Major

---

## Problem
- **Logged:** 2026-01-01 01:12 (Bug S6)
- **Issue:** Job creation modal in Calendar is different from Admin.
- **Requirement:** Reuse `JobFormModal.tsx` (the Admin one) in Calendar.
- **Protocol:** Enforces COMPONENT REUSE.

## Proposed Solution

### 1. [MODIFY] `client/src/pages/boss/calendar/index.tsx`
- **Import:** `JobFormModal` from `@/components/modals/job-form/JobFormModal`
- **Replace:** Existing modal logic with `JobFormModal`
- **Props:** Pass necessary props (clients, workers, onSubmit) reusing the same data hooks as Admin

### 2. [VERIFY] Data Consistency
- Ensure creating a job from Calendar works exactly like Admin
- Verify `onSuccess` callback refreshes the calendar

## Verification Plan
1. `npm run build`
2. **User Manual Test:**
   - Go to Calendar
   - Click a day to add job
   - Verify modal is the "Admin" modal (with tabs, proper fields)
   - Create job
   - Verify it appears on Calendar immediately

## Effort
- ~30 mins (Import & Wiring)
