# Marcus Task: Fix Inventory Reception Logs

> **Agent:** @Enforcer (Marcus)
> **Date:** 2026-01-07
> **Priority:** 🔴 High

---

## 🎯 Objective

Fix the inventory logs not showing when receiving stock via the Réception tab.

---

## 📋 Tasks

### 1. Fix Inventory Logs Bug
**Plan:** `.agent/plans/fix-inventory-logs.md`

- [x] Add debug logging to InventoryLogProvider ✅
- [x] Fix action type mismatch (DB→UI mapping) ✅
- [x] Add query invalidation for Historique tab ✅
- [ ] Test reception and check console (USER VERIFY)
- [ ] Verify RLS policies on `inventory_history` table (USER VERIFY)
- [ ] Verify logs appear in Historique tab (USER VERIFY)

---

## � Related Files

- `client/src/pages/boss/components/ReceivingTab.tsx`
- `client/src/pages/boss/components/LogsTab.tsx`
- `client/src/api/providers/supabase/InventoryLogProvider.ts`

---

## ✅ Acceptance Criteria

- Reception logs appear in Historique tab
- Shows product name, quantity, user, timestamp
- No console errors

---

## 🚀 Start Command

```powershell
cd c:\Users\jogor\OneDrive\Documents\GitHub\Asset-Manager
npm run dev
```

---

## ✅ Changes Made (Marcus 2026-01-07)

### Root Cause Identified
The inventory logs were being created correctly but not displayed because of an **action type mismatch**:
- DB stores: `restocked`, `used`, `adjusted`, `transferred_out`, `transferred_in`
- UI expected: `receive`, `create`, `delete`, `adjust`, `transfer`

The `createLog()` function correctly mapped `"receive"` → `"restocked"` when inserting, but `getLogs()` was returning the raw DB value without mapping it back.

### Files Modified

#### 1. `InventoryLogProvider.ts`
- Added `mapActionTypeToAction()` helper function in `getLogs()` to reverse-map DB action types to UI-friendly values
- Added debug logging in `createLog()` to diagnose future issues

#### 2. `ReceivingTab.tsx`
- Added `queryClient.invalidateQueries({ queryKey: ["inventoryLogs"] })` in `onSuccess` handler to refresh the Historique tab after receiving stock

### Commit
`8b48d4b` - fix(inventory): fix reception logs not appearing in Historique tab

