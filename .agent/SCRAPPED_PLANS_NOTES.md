# Scrapped Plans - Reference Notes

> **Date:** 2026-01-07
> **Purpose:** Track what was done in scrapped plans for future reference

---

## 1. fleet-inventory.md (P2 Done)
**What was implemented:**
- Phase 1: Truck management (create trucks, assign workers) ✅
- Phase 2: Per-truck inventory ✅
- `TruckProvider.ts` — Full CRUD for trucks and truck inventory
- `TruckDetailModal.tsx` — View/manage truck inventory
- Database tables: `trucks`, `truck_inventory`

**What's left (if resuming):**
- Phase 3: Truck compatibility scoring for jobs
- Phase 4: Smart truck assignment recommendations

---

## 2. job-lifecycle-epic.md (P3 Done)
**What was implemented:**
- Phase 1: Schema (lifecycle_status, validated_at, invoiced_at, paid_at) ✅
- Phase 2: "To Validate" tab in Admin ✅
- Phase 3: "Completed Jobs" section with payment tracking ✅
- `CompletedJobs.tsx` — Filter by validated/invoiced/paid
- `JobValidationModal.tsx` — Admin reviews and validates jobs

**What's left (if resuming):**
- Phase 4: Worker-side job history view
- Phase 5: Clickable timesheet jobs

---

## 3. smart-scheduler-epic.md (P1 Done)
**What was implemented:**
- Phase 1: Multi-day job spans with weekend skipping ✅
- `schedule-utils.ts` — calculateJobSpan() function
- Calendar shows "Day 1/3", "Day 2/3" badges

**What's left (if resuming):**
- Phase 2: 40-hour workload bars per worker
- Phase 3: Admin week filter (default to "This Week")
- Phase 4: Multi-week planner view

---

## 4. inventory-pro.md (Active)
**What was implemented:**
- Basic inventory CRUD
- Supplier management
- Purchase orders with auto-email

**What's left (if resuming):**
- CSV import
- Kits/assemblies
- Auto-pricing for quotes

---

## 5. work-order-system.md (Planned)
**What was implemented:**
- Nothing yet (was planned only)

**What's needed:**
- Worker must complete work order form before punch out
- Parts used, notes, work description
- Admin validation of work orders

---

## 6. admin-employee-dialogs-refactor.md (Ready)
**What was implemented:**
- Nothing yet (file is 547 lines, needs split)

**What's needed:**
- Split into: EmployeeCreateDialog, EmployeeEditDialog, EmployeeDeleteDialog, EmployeePermissionsPanel

---

## 7. job-lifecycle-phase-2-implementation.md (Reference)
**Purpose:** Detailed implementation notes for Phase 2
**Status:** Was reference doc, Phase 2 is done

---

> **Note:** Check actual code before resuming any of these features.
