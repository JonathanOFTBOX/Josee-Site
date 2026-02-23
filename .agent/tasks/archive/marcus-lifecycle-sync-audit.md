# Marcus - Job Lifecycle Sync Audit
> **Session:** 2026-01-04
> **Archived:** 2026-01-04
> **Focus:** Verify offline sync includes lifecycle fields

---

## Pre-Work (6 Files)
- [x] Created this task file
- [x] Read before-starting.md (Marcus section: lines 1194-1315)
- [x] Read job-lifecycle-epic.md (Phase 1 schema confirmed)
- [x] Read DATABASE_SCHEMA.md (5 lifecycle fields: job_number, lifecycle_status, admin_notes, validated_at, validated_by)
- [x] Read CODE_PATTERNS.md
- [x] Read DEBUG_HISTORY.md (saw lifecycle sync issue logged at line 56)

---

## Audit Findings

| File | Has Lifecycle Fields? | Action Needed |
|------|----------------------|---------------|
| `shared/schema.ts` (lines 51-56) | ✅ YES | None |
| `api/types.ts` → `SupabaseJob` (lines 156-161) | ✅ YES | None |
| `api/types.ts` → `supabaseJobToJob()` (lines 255-260) | ✅ YES | None |
| `SupabaseJobProvider.ts` → `.select("*")` | ✅ YES | None |
| `offline-db.ts` → `CachedJob.data: any` | ✅ YES (stores raw) | None |
| `dexie-sync-queue.ts` | ⚠️ N/A | Workers don't modify lifecycle |

### Conclusion: ✅ COMPATIBLE

**Why no changes needed:**
1. `SupabaseJobProvider` uses `.select("*")` → fetches ALL DB columns
2. `SupabaseJob` interface already has all 5 lifecycle fields
3. `supabaseJobToJob()` converter maps all 5 fields to camelCase
4. `CachedJob.data: any` stores the ENTIRE Supabase row (no field filtering)
5. Dexie sync only handles sessions/photos — workers never modify lifecycle fields offline

---

## Code Changes Made
- [x] **None required** — System already compatible

---

## Verification
- [x] npm run build passed ✅
- [x] npx tsc --noEmit passed ✅
- [x] git commit + push ✅ (`0efdb53`)

---

## Discovered During Session

### ⚠️ Future Work: Bon de Travail (Work Order) Integration
> **User Feedback (2026-01-04):** When "Bon de Travail" is added to Job Lifecycle, sync will need updates.

**Why this matters:**
- Current lifecycle is READ-ONLY for workers (fetched from server, cached locally)
- Work Orders may allow workers to UPDATE status or add items OFFLINE
- If workers can modify lifecycle-related data offline → Dexie sync queue will need new mutation types

**Recommendation:** When implementing Work Order EPIC, require:
1. New mutation types in `OfflineMutation.type` enum
2. New Dexie table(s) for work order data
3. Sync conflict resolution strategy

---

## Session End
- [x] Updated task file with summary
- [x] git add -A → git commit → git push
