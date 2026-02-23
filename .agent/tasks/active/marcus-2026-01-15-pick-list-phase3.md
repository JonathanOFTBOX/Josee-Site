# Marcus (Backend/API) - Session Task

> **Current Session:** 2026-01-15 15:20
> **Focus:** Phase 3: Pick List in Truck View

---

## Step 0: Initialization
- [x] Create task.md (this file)
- [x] Read before-starting.md (Marcus section: lines 841-944)
- [x] Read CODE_PATTERNS.md
- [x] Read PROJECT_CONTEXT.md
- [x] Read CRITICAL_FILES.md
- [x] Read recent task files in tasks/active/
- [x] Read ROADMAP.md

---

## Context Summary

**Session Context from User:**
- v1.0.7.59 is current version
- Phase 1 (Job Materials) ✅ DONE
- Phase 2 (Truck Compatibility) ✅ DONE
- Phase 3 (Pick List in Truck View) NOT STARTED ← **THIS SESSION**

**Key Files Reviewed:**
- `TruckInventoryTab.tsx` (433 lines) - Shows trucks with their inventory units
- `JobMaterialsFields.tsx` (244 lines) - Has TruckCompatibilityPanel showing 🥇🥈🥉
- `TruckProvider.ts` (291 lines) - Has `calculateTruckCompatibility()`
- `schema.ts` - `job_materials` table links jobs → inventory items

---

## Main Tasks

### Phase 3: Pick List in Truck View
- [x] Create implementation_plan.md
- [x] Add toggle in TruckInventoryTab: "📦 Inventaire" | "📋 À ramasser"
- [x] Create PickListView component (jobs needing materials from warehouse)
- [x] Show pick list grouped by Job (job title, materials needed)
- [x] Add checkbox to mark items as "picked"
- [x] Handle i18n for new strings (EN + FR)

---

## Discovered During Session

(To be filled as I work)

---

## Session End
- [ ] Update ROADMAP.md
- [ ] Increment version in version-check.ts + sw.js
- [ ] git add -A → git commit → git push
