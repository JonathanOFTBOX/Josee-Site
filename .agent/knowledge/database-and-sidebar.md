# Database Schema & Sidebar Visibility Knowledge

## Multi-Company Environment (RLS)

- **Two companies exist** in production:
  - `48d1acb2-5697-4ec2-aa57-e1efbdb02ab6` → **M. Beaudry Électrique Inc.** (production client)
  - `56eeedd5-44f0-40fd-a15a-01e4c0c211af` → **Out of the box** (dev/test company)
- **User accounts for M. Beaudry**: `jogorce@gmail.com`, `jgorce@mbeaudryelectrique.ca`, `nmorin@mbeaudryelectrique.ca`
- **User accounts for OOTB**: `jonathan@oftbox.com`
- **Supabase RLS** filters ALL queries by `company_id`. If a job has the wrong `company_id`, it becomes **invisible** — no error, just silently filtered out.
- **CRITICAL**: When debugging "missing" data, ALWAYS check `company_id` first!

## Supabase `sessions` Table Schema

| Column       | Type      | Notes                                          |
|-------------|-----------|------------------------------------------------|
| id          | uuid      | Primary key                                    |
| job_id      | uuid      | FK to jobs                                     |
| start_time  | timestamptz | When worker punched in                        |
| end_time    | timestamptz | When worker punched out (NULL = still active) |
| duration    | decimal   | **Hours** (not seconds!) e.g., 1.38 = 1h 23m  |
| ~~worker_id~~ | N/A    | **Does NOT exist** — don't query it            |
| ~~status~~    | N/A    | **Does NOT exist** — don't query it            |

## Sidebar Visibility Logic (UnassignedPoolSidebar)

The sidebar shows jobs from the **Unassigned Pool**. A job appears if ALL conditions are met:

1. **`getAllJobs()`** returns it (must pass RLS = correct `company_id`)
2. **`estimatedHours > 0`** — jobs without estimates are excluded
3. **`remainingHours > 0`** — calculated as: `estimated - MAX(planned, worked)`
   - `planned` = sum of `planned_hours` from `job_allocations`
   - `worked` = sum of `duration` from `sessions` WHERE `end_time IS NOT NULL`
4. **Status NOT in** `["completed", "validated", "invoiced", "paid", "archived"]`

### Common invisibility causes:
- **Wrong `company_id`** → RLS blocks it silently ← MOST COMMON
- **Workers exceeded estimated hours** → `remaining = 0` → hidden
- **Orphaned sessions** (`end_time = NULL`) → NOT counted in worked hours (only completed sessions count)
- **All hours fully planned** → `remaining = 0` → hidden

## Return Job Flow (handleReturnJob)

When a job is returned from validation (v1.0.10.575+):
1. Fetches actual worked hours from sessions
2. If `actualHours >= estimatedHours` → bumps `estimatedHours` to `actualHours + 2h`
3. Resets ALL allocation `plannedHours` to 0
4. Sets `status = 'assigned'`, `lifecycleStatus = 'pending'`
5. Invalidates React Query caches

## React Query Cache & IndexedDB Persistence

- `queryClient.ts` persists these queries to **IndexedDB** for offline-first:
  `inventory`, `jobs`, `clients`, `suppliers`, `workers`, `allocations`, etc.
- **7-day TTL** on persisted cache
- `staleTime: 5 minutes` default (sidebar overrides to 0)
- `refetchOnWindowFocus: true`
- If data looks stale after DB changes, user needs to **clear IndexedDB** (DevTools → Application → Storage → Clear site data)

## Diagnostic SQL Templates

```sql
-- Check job visibility (mirrors sidebar calculation)
SELECT 
    j.id, j.title, j.status, j.lifecycle_status, j.estimated_hours, j.company_id,
    COALESCE(SUM(a.planned_hours), 0) as total_planned,
    (SELECT COALESCE(SUM(s.duration), 0) FROM sessions s WHERE s.job_id = j.id AND s.end_time IS NOT NULL) as total_worked,
    j.estimated_hours - GREATEST(
        COALESCE(SUM(a.planned_hours), 0),
        (SELECT COALESCE(SUM(s.duration), 0) FROM sessions s WHERE s.job_id = j.id AND s.end_time IS NOT NULL)
    ) as remaining_hours
FROM jobs j
LEFT JOIN job_allocations a ON a.job_id = j.id
WHERE j.id = '<JOB_ID>'
GROUP BY j.id;

-- Check company ownership
SELECT j.title, j.company_id, c.name 
FROM jobs j 
LEFT JOIN companies c ON c.id = j.company_id 
WHERE j.title ILIKE '%search%';

-- Find orphaned sessions (never punched out)
SELECT s.id, s.job_id, j.title, s.start_time 
FROM sessions s 
JOIN jobs j ON j.id = s.job_id 
WHERE s.end_time IS NULL;
```
