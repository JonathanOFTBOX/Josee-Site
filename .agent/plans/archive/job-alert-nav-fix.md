# Plan: Job Alert Nav — Fix 404 on Toast Click

> **Status:** 🟡 In Progress
> **Assigned:** [@Desktop-Dev]
> **Priority:** High

---

## Problem Statement

User reports 404 error when clicking on overtime/progress toast notifications. The toast currently tries to navigate to `/boss/dashboard?job=ID`. This likely causes `wouter` to fail matching the `/boss/dashboard` route due to strict path matching or trailing slash issues with query parameters.

---

## Current Implementation Analysis

### job-alert-provider.tsx
- Currently uses `setLocation('/boss/dashboard?job=${job.id}')`.
- This relies on `wouter` correctly ignoring the query string during path matching, which can be flaky or version-dependent.

### dashboard/index.tsx
- Handles `?job=` query param correctly for deep links.
- Handles `openJobModal` event for same-page clicks.

---

## Proposed Solution: LocalStorage Handoff

To eliminate the risk of Router 404s entirely for internal navigation, we will use `localStorage` to pass the `jobId` and navigate to the clean `/boss/dashboard` path.

### 1. Update `job-alert-provider.tsx`
- **Change:** In `onClick` handlers (75% and 100%):
  - Set `localStorage.setItem('pendingJobId', job.id)`
  - Call `setLocation('/boss/dashboard')` (Cleaner, guaranteed route match)

### 2. Update `dashboard/index.tsx`
- **Change:** Add `useEffect` checks:
  - Check `localStorage.getItem('pendingJobId')`
  - If found:
    - Call `handleOpenJobDetails(id)`
    - Clear `localStorage.removeItem('pendingJobId')`
  - **Preserve:** Keep existing URL param logic for external deep links.

---

## Verification Plan

1.  **Automated Checks:**
    - `npm run build` — must pass
    - `npx tsc --noEmit` — must pass

2.  **Manual Verification (User):**
    - **Test 1: Internal Navigation**
        - Navigate to `/boss/calendar`
        - Trigger toast (or wait for one)
        - Click toast
        - **Expect:** Navigates to `/boss/dashboard` (no 404) AND opens Modal.
    - **Test 2: Deep Link (External)**
        - User manually enters `/boss/dashboard?job=EXISTING_ID`
        - **Expect:** Opens Modal.

---

## Files Modifying

- `client/src/components/job-alert-provider.tsx`
- `client/src/pages/boss/dashboard/index.tsx`
