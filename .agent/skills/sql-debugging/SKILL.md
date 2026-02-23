---
description: ALWAYS use SQL queries to debug data issues - check real database values
---

# SQL Debugging Skill

When debugging bugs related to **data not displaying correctly** or **values being wrong**, **ALWAYS** check the database first using Supabase SQL Editor.

## Why SQL First?

1. **UI shows symptoms, DB shows truth** - The UI might display wrong data due to many layers (state, cache, transforms). The DB has the actual values.
2. **Faster to narrow down** - One SQL query eliminates hours of code tracing.
3. **Reveals unexpected data** - Like `planned_hours = 0.002` when user expected `8.0`.

## Key Tables to Query

### Jobs & Allocations
```sql
-- See job allocations with planned hours
SELECT 
    ja.id, j.title, ja.scheduled_date, 
    ja.scheduled_start_time, ja.planned_hours, ja.actual_hours, ja.status
FROM job_allocations ja
JOIN jobs j ON ja.job_id = j.id
WHERE ja.scheduled_date >= '2026-02-01'
ORDER BY ja.scheduled_date;
```

### Sessions (Work Time)
```sql
-- See work sessions with duration
SELECT 
    s.id, j.title, s.start_time, s.end_time, s.duration,
    s.punch_in_photo_url, s.notes
FROM sessions s
JOIN jobs j ON s.job_id = j.id
WHERE s.start_time >= '2026-02-01'
ORDER BY s.start_time DESC;
```

### User/Worker Data
```sql
-- See all workers
SELECT id, name, email, role 
FROM profiles 
WHERE role = 'worker';
```

## Example: Debugging "(0m)" Display

**Symptom**: Calendar shows "(0m)" for planned hours
**SQL Query**: Check `planned_hours` in `job_allocations`
**Finding**: `planned_hours = 0.002` (not 0!)
**Root Cause**: Code overwrote user's hours with worked time (seconds as hours)

## Give SQL to User

Always provide the user with a copy-paste ready SQL query they can run in Supabase SQL Editor. This helps them verify the issue too.
