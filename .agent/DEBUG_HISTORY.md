# Debug History - Active Issues

> **Purpose:** Track ACTIVE problems only. Resolved issues go to `ARCHIVED_FIXES.md`.
> **Last Cleanup:** 2026-01-07

---

## 🔴 Active Bugs

*Nothing currently assigned to Marcus*

### ⚠️ Duplicate Close Button Behind Supplier Modal
> **Logged:** 2026-01-08 by CEO
- **Problem:** A white checkmark close button is visible behind/overlapping the Supplier modal (top right corner).
- **Expected:** Only one close button should be visible (the modal's X button).
- **Root Cause:** Likely a stray button from underlying component not being hidden when modal opens.
- **Files:** `SupplierModal.tsx` or parent component
- **Assigned:** [@Desktop-Dev] Derek
- **Severity:** 🟡 Medium

### ⚠️ Close/Action Buttons Need Orange Styling
> **Logged:** 2026-01-08 by CEO
- **Problem:** Some close/action buttons are white instead of brand orange.
- **Expected:** All primary action buttons (Close, Confirm, Submit) should use orange styling for consistency.
- **Design Rule:** Added to DESIGN_SYSTEM.md
- **Assigned:** [@Desktop-Dev] Derek
- **Severity:** 🟡 Medium

### ⚠️ Truck "Assign Worker" Dropdown Shows Inventory Items
> **Logged:** 2026-01-08 by CEO
- **Problem:** When adding a new truck, the "Assign Worker" dropdown shows inventory items (tube 1/4, corde, etc.) instead of employees.
- **Expected:** Dropdown should show employee names only.
- **Files:** `AddTruckModal.tsx` or equivalent
- **Assigned:** [@Desktop-Dev] Derek
- **Severity:** 🔴 High (broken)

---

## 🟡 Technical Debt

### Code Health (God Files)
- **Problem:** Files exceeding 1500-line limit need refactoring.
- **Threshold:** 1500 lines (updated 2026-01-08)
- **Top 3:** `JobValidationModal.tsx` (821), `PurchaseOrdersList.tsx` (731), `JobHistoryModal.tsx` (718)

### Wouter Router Query Params
- **Problem:** Router throws 404 on `/boss/dashboard?job=123`.
- **Workaround:** `localStorage` handoff in place.

### Material CRUD Backend
- **Problem:** Can add materials to jobs but can't update/delete them.
- **Action:** Add `updateJobMaterial`, `deleteJobMaterial` to API.

---

## ⚪ Pending Verification

### Storage Policies (company-logos)
- Bucket created, RLS policies need verification in Supabase Dashboard.

---

## 📁 EPICs (See ROADMAP.md)

| EPIC | Status |
|------|--------|
| Job Lifecycle | 🟡 Phase 3 Done |
| Fleet Inventory | 🟡 Phase 2 Done |
| Trial & Payment | 🟢 Phase 3 Done |
| Smart Scheduler | 🟡 Phase 1 Done |
| Work Order System | ⚪ Planned |
| Role Permissions | ⚪ Planned |

---

> **Archived 2026-01-07:** All resolved issues moved to `ARCHIVED_FIXES.md`
