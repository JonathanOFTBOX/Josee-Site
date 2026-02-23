# Enhancement: Track Reception Details per Item

> **Agent:** @Enforcer (Marcus)
> **Priority:** 🟡 Medium
> **Date:** 2026-01-07
> **Requested By:** CEO

---

## Problem Statement

When viewing purchase order items, users want to see:
- **When** each item was received (date + time)
- **Who** received it (user name)

Currently, `purchase_order_items` only tracks `quantity_received` without timestamp or user attribution.

---

## Proposed Solution

### Schema Changes

Add columns to `purchase_order_items` table:

```sql
ALTER TABLE purchase_order_items
ADD COLUMN received_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN received_by UUID REFERENCES profiles(id);
```

### Migration File

**File:** `supabase/migrations/20260108_reception_tracking.sql`

```sql
-- Add reception tracking to purchase order items
ALTER TABLE purchase_order_items
ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS received_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add index for querying by receiver
CREATE INDEX IF NOT EXISTS idx_poi_received_by ON purchase_order_items(received_by);
```

---

## Files to Modify

| File | Action |
|------|--------|
| `supabase/migrations/20260108_reception_tracking.sql` | [NEW] Add migration |
| `shared/schema.ts` | Add `receivedAt`, `receivedBy` to PurchaseOrderItem type |
| `client/src/api/providers/supabase/PurchaseOrderProvider.ts` | Update `receiveOrderItem()` to set received_at/received_by |
| `client/src/pages/boss/inventory/PurchaseOrdersList.tsx` | Display received date and user per item |

---

## UI Changes

### PurchaseOrdersList - Item Row

**Before:**
```
tube 1/4
$52.50 × 1 pcs                               Reçu: 1/1
```

**After:**
```
tube 1/4
$52.50 × 1 pcs                               Reçu: 1/1
                                             7 janv. 22:00 par John
```

---

## Verification Plan

### Automated
```powershell
npm run build
npx tsc --noEmit
```

### Manual Test
1. Run migration in Supabase
2. Receive items from a purchase order
3. View order in Commandes tab
4. Verify date/time and user name appear on each received item

---

## Acceptance Criteria

- [ ] Migration adds `received_at` and `received_by` columns
- [ ] Receiving an item populates both columns
- [ ] UI shows "7 janv. 22:00 par [User]" under each received item
- [ ] Works for partial receptions (each reception updates the timestamp)
