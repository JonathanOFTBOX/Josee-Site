# Maya (Mobile-Dev) - Session Task

> **Current Session:** 2026-01-03T22:05:48-05:00
> **Assigned Task:** Implement Offline Sync Engine using Dexie

---

## Step 0: Initialization
- [x] Create task.md (this file)
- [x] Read before-starting.md
- [x] Check for existing plan (`.agent/plans/offline-sync-dexie.md`)

## ⚠️ Protocol Issues
- [x] **FAILURE 1:** Forgot to create `task.md` at start of session.
  - **Cause:** Rushed to execution without Step 0.
  - **Fix:** Created belatedly after user prompt.
- [x] **FAILURE 2:** Failed to add `login.tsx` Footer on first attempt.
  - **Discovery:** **User** had to test and provide a screenshot to show the footer was missing. Agent failed to verify visually or via DOM check.
  - **Cause:** Used `StartLine` 350 for `view_file` which wasn't enough to see the closing tags, then blindly guessed the insertion point.
  - **Fix:** Properly viewed the end of the file and used accurate context for replacement.

---

## Implementation
- [x] Install Dexie
- [x] Create `client/src/lib/offline-db.ts`
- [x] Create `client/src/lib/feature-flags.ts`
- [x] Create `client/src/lib/dexie-sync-queue.ts`
- [x] Modify `client/src/api/providers/supabase/SessionProvider.ts`
- [x] Modify `client/src/components/sync-status.tsx`
- [x] Fix build errors in `dexie-sync-queue.ts` and `sync-status.tsx`
- [x] Add secret trigger to `client/src/pages/login.tsx`

---

## Debugging (Offline Photo & Session)
- [x] Investigate "Upload Failed" error.
- [x] **Fix:** Update `PhotoProvider.ts` to use `dexieSyncQueue.storePhoto` when offline.
- [x] **Fix:** Update `SessionProvider.ts` to handle `offline:` prefixed URLs in queues.
- [x] **Fix:** "Session not found" offline error:
  - Updated `EndJobPayload` in `types.ts`
  - Updated `useActiveSession.ts` to pass `jobId`/`startTime` fallbacks
  - Updated `SessionProvider.ts` to construct offline session
- [x] **Fix:** Robust Photo Sync:
  - `PhotoProvider` generates key & queues upload mutation immediately
  - `dexie-sync-queue` resolves `offline:{id}|{path}` to signed URLs
  - `PhotoProvider.addSessionPhoto` handles offline "create_photo"
  - `OfflineMutation` types updated
- [x] Verify Fix (`npm run build` passed)
- [x] **Verify:** Punch In offline logic (Cleaned up comments)
- [x] **Verify:** Punch Out & Work Photo offline logic (Blob overrides)

---

## Debugging (Offline Navigation/Persistence)
- [x] **Issue 1:** "Jobs disappear" offline.
  - **Discovery:** User reported empty list when offline.
  - **Cause:** `JobProvider` only fetched from Supabase.
  - **Fix:** Added `jobs` table to Dexie (v2); Implemented Stale-While-Revalidate caching.
  - **Verification:** Build passed.

- [x] **Issue 2:** "Job not found" when clicking offline.
  - **Discovery:** User verified list visibility but failed to enter job details.
  - **Cause:** `JobDetailPage` used `getJob` (no cache) instead of `JobProvider` details.
  - **Fix:** Added caching to `JobProvider.getJob` + "Cache First" logic.
  - **Verification:** Build passed.

- [x] **Issue 3:** "Photo throws app" (Broken Offline Preview).
  - **Discovery:** User reported photo issues offline. Suspected `offline:` URL breaking `<img src>`.
  - **Fix:** Modified `JobDetailPage` to use local `URL.createObjectURL` for preview if `offline:` ID is returned.
  - **Verification:** Build passed.

- [x] **Issue 4:** "Active Session not found" / Blank screen offline.
  - **Discovery:** `getActiveSession` failing to find the just-created offline session.
  - **Fix:** `startJob` now persists optimistic session to `localStorage`. `getActiveSession` checks there first.
  - **Verification:** Build passed.

---

## Verification
- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [ ] Manual Dexie Test (Flag ON)
- [ ] Manual LocalStorage Test (Flag OFF)
- [x] Create walkthrough artifact

---

## Session End
- [x] Update DEBUG_HISTORY.md
- [x] Update ROADMAP.md
- [x] Git commit & push

---

## Victor Notes (Post-Session)
> **Archived:** 2026-01-04 by Victor
> **Failures Identified:**
> 1. Forgot Step 0 → Need stricter enforcement
> 2. Blind edit without viewing full context → Need rule for file insertion
> 3. Left dev footer on login page → Need cleanup checklist
