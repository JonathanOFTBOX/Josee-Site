---
description: ALWAYS check this skill before creating new utility functions - reuse existing code
---

# Code Reuse Skill

**IMPORTANT**: Before creating ANY new utility function, helper, or pattern, ALWAYS search for existing implementations first!

## How to Use This Skill

1. **Before writing new code**: Search for existing utilities using `grep_search` with relevant keywords
2. **Check this list**: Review the utilities catalog below
3. **Reuse first**: Use existing functions instead of creating new ones
4. **Update this skill**: When you create a NEW reusable utility, add it to this catalog

---

## Existing Utilities Catalog

### Date & Time Utilities
| Location | Function | Purpose |
|----------|----------|---------|
| `@/lib/schedule-utils.ts` | `parseLocalDate(dateInput)` | **USE THIS** for parsing dates to avoid timezone issues (UTC midnight → local date shift bug) |
| `@/lib/schedule-utils.ts` | `calculateJobSpan(...)` | Calculate multi-day job spans with weekend handling |
| `@/lib/schedule-utils.ts` | `doesJobSpanWeekend(...)` | Check if job spans weekends |
| `date-fns` | `format`, `isSameDay`, `addDays`, etc. | Date manipulation - already imported everywhere |

### Color/Status Logic
| Location | Function | Purpose |
|----------|----------|---------|
| `@/pages/boss/calendar/day-cell.tsx` | `getAllocationColor(alloc, job)` | Determine allocation color based on status (active/overtime/progress/scheduled) |
| `@/pages/boss/calendar/timeline-day-view.tsx` | `renderAllocationBlock(...)` | Render allocation blocks on timeline |

### Toast & Notifications
| Location | Function | Purpose |
|----------|----------|---------|
| `@/hooks/use-toast.ts` | `toast({...})` | Show toast notifications |
| `@/lib/service-worker-registration.ts` | `showUpdateToast(registration)` | Show update available toast |

### API & Data
| Location | Function | Purpose |
|----------|----------|---------|
| `@/api/DataProvider.ts` | `dataProvider.getAssignedJobs()` | Get jobs assigned to current worker (includes allocation data) |
| `@/api/DataProvider.ts` | `dataProvider.getAllocations(...)` | Get job allocations for date range |

### Geolocation
| Location | Function | Purpose |
|----------|----------|---------|
| `@/lib/geo.ts` | `getCurrentPosition()` | Get current GPS position |
| `@/lib/geo.ts` | `calculateHaversineDistance(...)` | Calculate distance between coordinates |

---

## Keywords to Search Before Creating

When working on:
- **Dates/Times**: Search for `parseLocalDate`, `date-fns`, `schedule-utils`
- **Colors/Status**: Search for `getAllocationColor`, `getStatusColor`
- **Job spans**: Search for `calculateJobSpan`, `JobDayInfo`
- **Notifications**: Search for `toast`, `showUpdateToast`
- **Location/GPS**: Search for `geo`, `Haversine`, `getCurrentPosition`

---

## Updating This Skill

When you create a NEW reusable utility:
1. Add it to the appropriate section above
2. Include: Location, Function name, Purpose
3. Update keywords section if needed
