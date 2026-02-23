# Marcus (Enforcer) - Session Task

> **Session:** 2026-01-20 5:05 PM
> **Focus:** Fix unit visibility during job work - only consume on job complete

---

## Pre-Work Checklist
- [x] Read before-starting.md
- [x] Check version (1.0.10.42)
- [x] Analyze codebase for unit consumption logic

---

## Main Tasks
- [ ] Task 1: Fix `SessionProvider.consumeJobMaterials` to ONLY run on job complete (not paused)
  - Currently called unconditionally in endJob() line 296
  - Should check `newJobStatus === "completed"` before calling
- [ ] Task 2: Verify units stay visible during job work with remaining_quantity = 0
  - MaterialConfirmModal already uses skipConsumeStatus=true ✓
  - Query filters to status="available" which is correct ✓

---

## Discovered During Session
- `skipConsumeStatus=true` already correctly prevents marking as consumed during job work
- Issue is `consumeJobMaterials` runs on both pause AND complete

---

## Session End Checklist
- [ ] npm run build passes
- [ ] npx tsc --noEmit passes
- [ ] Update version to 1.0.10.43
- [ ] Update sw.js version
- [ ] git add, commit, push
- [ ] Create walkthrough with proof

---

## Questions/Notes for CEO
- Confirm: Units should stay visible (status="available") during job work, and only be marked "consumed" when the job is completed (not when worker pauses for a return visit)?
