# 📅 Smart Scheduler Epic — Implementation Plan

> **Epic Owner:** @Architect (Victor)  
> **Assigned To:** @Desktop-Dev (Derek)  
> **Model:** Gemini 3 Pro High (UI-focused)  
> **Priority:** Critical  
> **Status:** ✅ APPROVED by User [2025-12-31 15:55]

---

## 🎯 Epic Goal

Create a **Calendar-centric job scheduling system** that allows bosses to:
1. **Create jobs directly from calendar** (click date → form modal)
2. **See worker workload at a glance** (40-hour bars with color coding)
3. **Default Admin view to current week** (with toggle for all jobs)
4. **Plan weeks ahead** with density indicators

---

## 📊 Current State

| File | Status |
|------|--------|
| `calendar.tsx` | Has multi-day job logic, "Day X/Y" badges, weekend skipping ✅ |
| `admin.tsx` | Shows all jobs (no week filter) |
| `schedule-utils.ts` | Calculates job spans with weekend logic ✅ |

---

## Phase 1: Calendar Job Creation Modal

> **Priority:** High | **Status:** 🔴 Ready for Development

### Goal
Click any date on the calendar → Open a modal → Create/edit a job for that date.

### Proposed Changes

#### [NEW] `client/src/components/job-form-modal.tsx`
- Reusable modal component for job CRUD
- Fields: Title, Address, Est. Hours, Workers, Urgent toggle
- Pre-populated `scheduledDate` from clicked calendar date
- i18n support (EN/FR)

#### [MODIFY] `client/src/pages/boss/calendar.tsx`
- Add `onClick` handler to each calendar day cell
- State: `selectedDate`, `isModalOpen`
- Integrate `<JobFormModal />`

#### [MODIFY] `client/src/lib/translations.ts`
| Key | EN | FR |
|-----|----|----|
| `calendar.createJob` | `Create Job` | `Créer un travail` |
| `calendar.editJob` | `Edit Job` | `Modifier le travail` |
| `modal.scheduledFor` | `Scheduled for {date}` | `Prévu pour le {date}` |

### Verification
1. `npm run build` must pass
2. `npx tsc --noEmit` must pass
3. Create `walkthrough.md` with recording
4. **Manual Test:** Click on a date → Modal opens → Fill form → Job appears on calendar

---

## Phase 2: 40-Hour Workload Bars

> **Priority:** High | **Status:** ⚪ Planned (Depends on Phase 1)

### Goal
Show a visual indicator for each worker's scheduled hours per week.
- Green: 0-32h (Under capacity)
- Yellow: 33-40h (Optimal)
- Red: 41+ (Overloaded)

### Proposed Changes

#### [NEW] `client/src/lib/workload-utils.ts`
```typescript
interface WorkerWeekLoad {
  workerId: string;
  workerName: string;
  scheduledHours: number;
  capacity: number; // Default 40
  utilization: number; // 0-100%
  status: 'under' | 'optimal' | 'over';
}

export function calculateWeeklyWorkload(
  jobs: Job[],
  workers: User[],
  weekStart: Date
): WorkerWeekLoad[]
```

#### [NEW] `client/src/components/workload-indicator.tsx`
- Horizontal bar with worker name + hours + color
- Tooltip with job breakdown
- Responsive: Stacks on mobile

#### [MODIFY] `client/src/pages/boss/calendar.tsx`
- Add collapsible "Worker Workload" panel (sidebar on desktop, accordion on mobile)
- Integrate `<WorkloadIndicator />` for each worker

### Verification
1. Build must pass
2. **Manual Test:** Assign jobs to worker → See workload bar update → Red if > 40h

---

## Phase 3: Admin Week Filter

> **Priority:** Medium | **Status:** ⚪ Planned

### Goal
When boss enters Admin page, default view shows only jobs scheduled for the **current week**. Toggle to see all.

### Proposed Changes

#### [MODIFY] `client/src/pages/boss/admin.tsx`
- Add state: `weekFilter: 'thisWeek' | 'all'` (default: 'thisWeek')
- Add toggle UI at top of jobs list
- Filter logic: `job.scheduledDate` within `startOfWeek(today)` to `endOfWeek(today)`

#### [MODIFY] `client/src/lib/translations.ts`
| Key | EN | FR |
|-----|----|----|
| `admin.thisWeek` | `This Week` | `Cette semaine` |
| `admin.allJobs` | `All Jobs` | `Tous les travaux` |

### Verification
1. Build must pass
2. **Manual Test:** Open Admin → Only see this week's jobs → Toggle → See all jobs

---

## Phase 4: Multi-Week Planner View

> **Priority:** Low | **Status:** ⚪ Planned

### Goal
See 4+ weeks at a glance with density indicators (e.g., "Week 1: 85% full").

### Proposed Changes

#### [MODIFY] `client/src/pages/boss/calendar.tsx`
- Add new view mode: `quarter` (4 weeks)
- Each week row shows: Week label + Total hours + Density bar
- Click week → Drill down to weekly view

### Verification
1. Build must pass
2. **Manual Test:** Toggle to Quarter view → See 4 weeks with density

---

## ⚙️ Technical Notes

### Database
- **No schema changes required.** Jobs already have `scheduledDate` and `assignedWorkers`.

### Performance Considerations
- Workload calculation should be memoized (`useMemo`) to avoid recalc on every render.
- Quarter view should lazy-load job counts, not full job objects.

### Mobile ("Dirty Hands" Compliance)
- All tap targets ≥ 48px
- Modal must work in portrait AND landscape
- Workload bars must stack vertically on mobile

---

## 📝 Execution Log (Developer fills after each phase)

> **Instructions:** After completing each phase, update this section.

### Phase 1 Log
**Developer:** _____  
**Date:** _____  
**Status:** ⚪ Not Started  
**Files Modified:** _____  
**Issues:** _____  
**Confidence:** _/10

### Phase 2 Log
**Developer:** _____  
**Date:** _____  
**Status:** ⚪ Not Started

### Phase 3 Log
**Developer:** _____  
**Date:** _____  
**Status:** ⚪ Not Started

### Phase 4 Log
**Developer:** _____  
**Date:** _____  
**Status:** ⚪ Not Started
