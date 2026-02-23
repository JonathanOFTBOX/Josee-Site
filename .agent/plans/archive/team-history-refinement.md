# Team History Refinement — Implementation Plan

> **Assigned To:** @Desktop-Dev (Derek)
> **Priority:** Medium
> **Status:** 🔴 Ready

---

## 🎯 Goal

Audit the entire codebase and fix:
1. **Decimal durations** → Convert `2.5h` to `2h 30m` format
2. **Click targets** → Ensure all interactive elements are 44px+ on mobile

---

## Problem

Duration displays currently show raw decimals like:
- `2.5 hours` ❌
- `0.75h` ❌

Should display as:
- `2h 30m` ✅
- `45m` ✅

---

## Search Strategy

### Step 1: Find all duration displays
```powershell
# Search for formatting patterns
grep_search "\.toFixed" in client/src/
grep_search "hours" in client/src/
grep_search "duration" in client/src/
grep_search "formatMinutes" in client/src/
```

### Step 2: Check existing utils
There may already be a `formatMinutesToHoursMinutes` function in:
- `admin-utils.ts`
- `utils.ts`
- Other helper files

### Step 3: Fix each location
Replace decimal displays with the proper formatter.

---

## Files to Check

| Area | Files |
|------|-------|
| Admin Panel | `WorkerColumn.tsx`, `AdminJobsSection.tsx` |
| Timesheet | `pages/worker/timesheet/` |
| Dashboard | `pages/boss/dashboard/` |
| Job Cards | `JobCard.tsx`, `MobileJobCard.tsx` |
| History Modal | Any "View History" components |

---

## Click Target Rules

Per CODE_PATTERNS.md:
- Mobile touch targets MUST be 48px minimum
- Check buttons, links, and interactive elements in history views

---

## Verification

1. `npm run build` must pass
2. `npx tsc --noEmit` must pass
3. Search codebase to confirm no decimal hours remain
4. Create walkthrough showing before/after

---

## Acceptance Criteria

- [ ] No decimal durations anywhere in UI (all show `Xh Xm` format)
- [ ] All click targets in history views are 48px+ on mobile
- [ ] Build passes
