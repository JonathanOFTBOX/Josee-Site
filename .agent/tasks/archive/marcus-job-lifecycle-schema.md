# Marcus (Enforcer) - Session Task

> **Current Session:** 2026-01-04 17:14 EST
> **Archived:** 2026-01-04
> **Task:** Phase 1 - Job Lifecycle Database Schema
> **Commits:** `850138a`, `dde0fec`

---

## 🛑🛑🛑 VICTOR STOP AND READ THIS 🛑🛑🛑

### ⚠️ VICTOR REVIEW: Real-Time Task File Updates (CRITICAL PROTOCOL GAP)
> **Logged:** 2026-01-04 by Marcus
> **Priority:** 🔴🔴🔴 ALL AGENTS MUST FOLLOW THIS

**What User Said:** 
> "You always need to update the task when we talk and find stuff so we keep all record. You failed on this."

**What I (Marcus) Missed — FAILURE #1:** 
- User gave feedback about offline sync compatibility mid-session
- I did NOT immediately update my task file with this user feedback
- I continued working instead of documenting the new requirement first

**What I (Marcus) Missed — FAILURE #2:**
- User told me to put VICTOR REVIEW in the TASK file
- I initially put it in DEBUG_HISTORY.md instead
- Had to be corrected TWICE before putting it in the right place

**What I (Marcus) Missed — FAILURE #3:**
- When updating task file, I used `Overwrite: true` and accidentally DELETED existing content
- Lost the detailed column descriptions, Files Modified section, and other info
- User caught this with screenshots showing red deleted lines
- Root cause: Using full file rewrite instead of targeted edits

**Protocol Fix Needed:**
1. When user provides feedback/new requirements MID-SESSION → **STOP**
2. Update task file IMMEDIATELY with the new item
3. VICTOR REVIEW items go in the TASK FILE, not DEBUG_HISTORY
4. **NEVER use `Overwrite: true` on task files** — use `replace_file_content` to add content without deleting existing
5. THEN continue working

**Recommendation:** Add explicit rules to `before-starting.md` for ALL agents:
> 1. "When user provides feedback during a session, IMMEDIATELY update your task file before continuing work."
> 2. "All VICTOR REVIEW items MUST be in the task file."
> 3. "NEVER use `Overwrite: true` on task files. Always use `replace_file_content` or `multi_replace_file_content` to preserve existing content."

---

## Step 0: Initialization ✅
- [x] Create task.md (this file)
- [x] Read before-starting.md (Marcus section: lines 841-944)
- [x] Read job-lifecycle-epic.md (the plan file)
- [x] Read DATABASE_SCHEMA.md

---

## Main Tasks ✅
- [x] Create SQL migration with new columns:
  - `job_number SERIAL` — Auto-generated unique job ID
  - `lifecycle_status TEXT` — Status enum
  - `admin_notes TEXT` — Boss comments
  - `validated_at TIMESTAMPTZ` — When validated
  - `validated_by UUID` — Who validated (references profiles)
- [x] Update TypeScript types for `jobs` table
- [x] Run `npx tsc --noEmit` — **PASSED ✅**
- [x] Run migration in Supabase Dashboard — **VERIFIED ✅** (2026-01-04 17:34)
- [x] Verify columns exist in database — **VERIFIED ✅** (5 jobs with job_number 1-5, lifecycle_status "pending")
- [x] Update DATABASE_SCHEMA.md with new columns
- [x] git commit + push

---

## Files Modified
1. `supabase/migrations/20260104_job_lifecycle_columns.sql` — NEW migration
2. `shared/schema.ts` — Added Drizzle columns
3. `client/src/api/types.ts` — Added `SupabaseJob` fields + converter
4. `client/src/api/mockData.ts` — Added fields to mock jobs
5. `client/src/api/providers/mock/MockJobProvider.ts` — Added fields to createJob
6. `server/storage.ts` — Added fields to mock jobs

---

## 📝 COMPLETE FILE CHANGE LOG

### [NEW] `supabase/migrations/20260104_job_lifecycle_columns.sql`
**Purpose:** SQL migration to add job lifecycle columns
**Contents:**
```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_number SERIAL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS lifecycle_status TEXT DEFAULT 'pending'
  CHECK (lifecycle_status IN ('pending', 'in_progress', 'awaiting_validation', 'needs_return', 'completed', 'archived'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES profiles(id);
```

---

### [MODIFIED] `shared/schema.ts`
**Lines Changed:** 32-56 (jobs table definition)
**What Was Added:**
```typescript
// Job Lifecycle fields (Phase 1 of job-lifecycle-epic)
jobNumber: integer("job_number"), // SERIAL in DB, auto-generated
lifecycleStatus: text("lifecycle_status").default("pending"),
adminNotes: text("admin_notes"),
validatedAt: timestamp("validated_at"),
validatedBy: uuid("validated_by").references(() => users.id),
```

---

### [MODIFIED] `client/src/api/types.ts`
**Lines Changed:** 136-161 (SupabaseJob interface) + 235-261 (converter)
**SupabaseJob interface additions:**
```typescript
job_number: number | null;
lifecycle_status: string | null;
admin_notes: string | null;
validated_at: string | null;
validated_by: string | null;
```
**Converter function additions:**
```typescript
jobNumber: sJob.job_number,
lifecycleStatus: sJob.lifecycle_status || "pending",
adminNotes: sJob.admin_notes,
validatedAt: sJob.validated_at ? new Date(sJob.validated_at) : null,
validatedBy: sJob.validated_by,
```

---

### [MODIFIED] `client/src/api/mockData.ts`
**Lines Changed:** 61-175 (all 5 mock jobs)
**What Was Added to EACH mock job:**
```typescript
jobNumber: 1001, // 1001-1005 for each job
lifecycleStatus: "pending", // or "completed" for job-4
adminNotes: null,
validatedAt: null,
validatedBy: null,
```

---

### [MODIFIED] `client/src/api/providers/mock/MockJobProvider.ts`
**Lines Changed:** 92-101 (createJob function)
**What Was Added:**
```typescript
jobNumber: null, // Will be assigned by DB SERIAL
lifecycleStatus: "pending",
adminNotes: null,
validatedAt: null,
validatedBy: null,
```

---

### [MODIFIED] `server/storage.ts`
**Lines Changed:** 139-214 (3 mock jobs in MemStorage)
**What Was Added to EACH mock job:**
```typescript
jobNumber: 1001, // 1001-1003 for each job
lifecycleStatus: "pending",
adminNotes: null,
validatedAt: null,
validatedBy: null,
```

---

### [MODIFIED] `.agent/DATABASE_SCHEMA.md`
**Lines Changed:** 70-99 (jobs table documentation)
**What Was Added:**
| Column | Type | Default |
|--------|------|---------|
| `job_number` | SERIAL | auto-increment |
| `lifecycle_status` | TEXT | 'pending' |
| `admin_notes` | TEXT | - |
| `validated_at` | TIMESTAMPTZ | - |
| `validated_by` | UUID | FK → profiles |

---

### [MODIFIED] `.agent/DEBUG_HISTORY.md`
**Lines Changed:** 23-55
**What Was Added:**
- VICTOR REVIEW section (now moved to this task file)
- Offline Sync Compatibility issue for Phase 2

---

## ⚠️ CRITICAL FOLLOW-UP: Offline Sync Compatibility

> **Status:** 🔴 NEEDS REVIEW
> **Assigned:** Derek/Maya (Phase 2+)

**Problem:** New lifecycle fields may NOT be included in offline sync logic.

**Required Actions:**
1. [ ] Audit Dexie schema for job-related fields
2. [ ] Ensure lifecycle fields sync correctly offline
3. [ ] Test offline → online sync with lifecycle fields

**Files to Check:**
- `client/src/lib/dexie-sync-queue.ts`
- `client/src/api/providers/supabase/SupabaseJobProvider.ts`

---

## Session End ✅
- [x] Update DEBUG_HISTORY.md with offline sync issue
- [x] git add -A → git commit → git push
- [x] Document all file changes in this task file
