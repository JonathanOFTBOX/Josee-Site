# Fix: Inventory Reception Logs Not Saving

> **Agent:** @Enforcer (Marcus)
> **Priority:** 🔴 High (Data Integrity)
> **Date:** 2026-01-07
> **Reported By:** CEO

---

## Problem Statement

When receiving inventory via the "Réception" tab, no entries appear in the "Historique" tab. The logs should show each reception with product name, quantity, timestamp, and user.

**Screenshot:** `uploaded_image_1767839066164.png`

---

## Root Cause Analysis (INVESTIGATE)

### Current Flow

1. **ReceivingTab.tsx** (lines 94-103):
   - Calls `dataProvider.createInventoryLog()` with:
     - `productId`: from `item.productId`
     - `orderId`: from `selectedOrder.id`
     - `action`: `"receive"`
     - `quantityChange`: receivedNow
     - `notes`: string

2. **DataProvider.ts** → `SupabaseDataProvider.ts` → `InventoryLogProvider.ts`

3. **InventoryLogProvider.createLog()** (lines 81-111):
   - Maps `action: "receive"` → `action_type: "restocked"`
   - Inserts to `inventory_history` table

### Possible Issues to Check

| Issue | Check |
|-------|-------|
| `item.productId` is null/undefined | Add console.log in ReceivingTab |
| `createLog()` fails silently | Check console for errors |
| `getLogs()` query joins are wrong | Check column names match schema |
| `getInventoryLogs()` not called | Check LogsTab query key |
| RLS policy blocking inserts | Check Supabase policies on `inventory_history` |
| Column name mismatch | `inventory_item_id` vs `product_id` |

---

## Proposed Fix

### Step 1: Add Debug Logging

**File:** `client/src/api/providers/supabase/InventoryLogProvider.ts`

```typescript
// In createLog() before insert
console.log("[InventoryLogProvider] Creating log:", {
    company_id: currentUser.companyId,
    user_id: currentUser.id,
    inventory_item_id: payload.productId,
    action_type: actionType,
    quantity: payload.quantityChange,
});
```

### Step 2: Verify Database Schema

Check `inventory_history` table has these columns:
- `id` (uuid)
- `company_id` (uuid)
- `user_id` (uuid)
- `inventory_item_id` (uuid, nullable)
- `action_type` (text with CHECK constraint)
- `quantity` (numeric)
- `notes` (text, nullable)
- `created_at` (timestamp)

### Step 3: Check RLS Policies

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'inventory_history';

-- If missing, add:
CREATE POLICY "Users can insert logs for their company"
ON inventory_history FOR INSERT
WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view logs for their company"
ON inventory_history FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));
```

### Step 4: Verify getLogs() Query

**File:** `InventoryLogProvider.ts` line 44-53

Check that:
- `inventory_item_id` matches the column used in insert
- `profiles:user_id` join is correct
- `inventory_items:inventory_item_id` join is correct

---

## Verification Plan

### Automated
```powershell
npm run build
npx tsc --noEmit
```

### Manual Test
1. Go to Inventory → Réception tab
2. Select a pending purchase order
3. Confirm reception
4. **Check browser console for log creation message**
5. Go to Historique tab
6. **Verify new log entry appears**

---

## Acceptance Criteria

- [ ] Console shows log creation attempt
- [ ] `inventory_history` table has new row after reception
- [ ] LogsTab displays the new entry
- [ ] User name and product name show correctly

---

## Files to Modify

| File | Action |
|------|--------|
| `InventoryLogProvider.ts` | Add debug logging, verify column names |
| `ReceivingTab.tsx` | Add console.log for productId verification |
| Supabase Dashboard | Verify RLS policies on `inventory_history` |
