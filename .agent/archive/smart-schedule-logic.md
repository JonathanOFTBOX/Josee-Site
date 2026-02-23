# Smart Schedule Logic — Implementation Plan

> **Assigned To:** @Desktop-Dev (Derek)  
> **Model:** Gemini 3 Pro High (UI-focused task)  
> **Priority:** High  
> **Status:** ✅ APPROVED by User

---

## 🎯 Goal

Enhance the calendar to intelligently visualize multi-day jobs based on **Est. Hours ÷ Workers**, with:
1. **Weekend Skipping Logic** — Auto-extend jobs that would span weekends (AUTO-SKIP)
2. **Visual Day Markers** — Show "Day 1/3", "Day 2/3" on ALL tiles
3. **Weekend Warning** — Deferred to later sprint

---

## 📊 Current State

File: `client/src/pages/boss/calendar.tsx` (Lines 57-81)

```typescript
// Already calculates multi-day span, but NO weekend logic:
const hoursPerDay = 8 * Math.max(1, workerCount);
const durationDays = Math.ceil((job.estimatedHours || 1) / hoursPerDay);
```

---

## Proposed Changes

### 1. [NEW] `client/src/lib/schedule-utils.ts`

```typescript
interface JobDayInfo {
  date: Date;
  dayNumber: number;    // 1, 2, 3...
  totalDays: number;    // Total work days
  isWeekend: boolean;
  isSkipped: boolean;
}

export function calculateJobSpan(
  startDate: Date,
  estimatedHours: number,
  workerCount: number,
  skipWeekends: boolean = true
): JobDayInfo[]

export function doesJobSpanWeekend(
  startDate: Date,
  estimatedHours: number,
  workerCount: number
): boolean
```

### 2. [MODIFY] `client/src/pages/boss/calendar.tsx`

1. Import `calculateJobSpan` utility
2. Modify `isJobActiveOnDay` to use weekend-aware calculation
3. Add `getJobDayInfo(job, day)` helper
4. Update job tile: show "Day X/Y" badge, lighter opacity on continuation days

### 3. [MODIFY] `client/src/lib/translations.ts`

| Key | EN | FR |
|-----|----|----|
| `calendar.dayOf` | `Day {n}/{total}` | `Jour {n}/{total}` |
| `calendar.weekendWarning` | `This job will span a weekend` | `Ce travail s'étendra sur un weekend` |
| `calendar.skipWeekends` | `Skip weekends` | `Sauter les weekends` |

---

## Verification

1. `npm run build` must pass
2. Create walkthrough.md artifact
3. Test: Job with Friday start, 24h, 1 worker → shows Fri/Mon/Tue (skips Sat/Sun)

---

---

# 📝 EXECUTION LOG (Developer fills this section)

> **INSTRUCTIONS FOR DEVELOPER:**  
> After completing the task, you MUST update this section with:
> 1. What you actually did (vs what was planned)
> 2. Any corrections or deviations from the plan
> 3. Files you modified (with line numbers)
> 4. Any issues encountered and how you solved them

## Developer: Derek
**Date:** 2025-12-31 15:30

### What I Did
- [x] Created `schedule-utils.ts`
- [x] Modified `calendar.tsx`
- [x] Added i18n keys
- [x] Fixed unrelated build error in `signup.tsx`

### Deviations from Plan
> (List any changes you made that weren't in the original plan, and WHY)
- Found a type mismatch in `calendar.tsx` (Map key was number, needed string for job.id). Fixed it.
- Fixed an unrelated TypeScript error in `signup.tsx` that was blocking the build.

### Files Modified
| File | Lines Changed | Description |
|------|---------------|-------------|
| `schedule-utils.ts` | NEW | Weekend-aware job span calculation |
| `calendar.tsx` | ~30 | Integrated utils, added "Day X/Y" badges |
| `translations.ts` | 6 | Added calendar-specific keys |
| `signup.tsx` | 1 | Fixed TS build error |

### Issues Encountered
> (Any blockers, bugs, or unexpected problems)
- TypeScript error: `Argument of type 'string' is not assignable to parameter of type 'number'` in `calendar.tsx`.
- Solution: Changed `Map<number, ...>` to `Map<string, ...>` because `job.id` is a UUID string.

### Build Status
- [x] `npm run build` passed
- [x] `npx tsc --noEmit` passed

### Confidence Score
**10/10** - Reason: Logic verified via manual walkthrough and strict type checking. Build passes cleanly.
