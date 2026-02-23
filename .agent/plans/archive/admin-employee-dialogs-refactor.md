# AdminEmployeeDialogs.tsx Refactor Plan

> **Created:** 2026-01-03 15:57
> **Status:** 🔴 Ready for Dispatch
> **Agent:** @Desktop-Dev (Derek)
> **Model:** Gemini 3 Pro High (Frontend/UI work)

---

## Problem

`AdminEmployeeDialogs.tsx` is **547 lines** — 47 lines over the 500-line limit.

**Location:** `client/src/pages/boss/admin/components/AdminEmployeeDialogs.tsx`

---

## Proposed Split

| New File | Responsibility | Est. Lines |
|----------|----------------|------------|
| `EmployeeCreateDialog.tsx` | Create employee form + validation | ~120 |
| `EmployeeEditDialog.tsx` | Edit employee form + role/permissions | ~150 |
| `EmployeeDeleteDialog.tsx` | Delete confirmation + safety checks | ~80 |
| `EmployeePermissionsPanel.tsx` | Permission toggles (Owner override logic) | ~100 |
| `AdminEmployeeDialogs.tsx` | **Orchestrator** — imports and composes | ~100 |

**Total:** ~550 lines spread across 5 files (all under limit)

---

## Key Logic to Preserve

1. **Owner Check:** `user.isOwner === true` bypasses all permission checks
2. **Closed by Default:** Explicit `=== true` checks for granular permissions
3. **Role Assignment:** Worker/Dispatcher/Admin dropdown
4. **Form Validation:** Email, required fields
5. **i18n:** All strings via `t()` function

---

## Verification Plan

1. `npx tsc --noEmit` — No type errors
2. `npm run build` — Build passes
3. **Manual:** Open Admin panel, test Create/Edit/Delete flows
4. **Regression Check:** Verify Owner still has full access

---

## Pre-Dispatch Checklist

- [ ] Agent reads `CODE_PATTERNS.md` (COPY-PASTE ONLY rule)
- [ ] Agent runs `grep_search` to check for component reuse
- [ ] Agent updates ROADMAP status when complete

---

## Approval

- [ ] **CEO Approval Required** — Proceed with this plan?
