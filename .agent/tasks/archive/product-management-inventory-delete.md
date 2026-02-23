# Task: Product Management Enhancement

> **Created:** 2026-01-11
> **Status:** ✅ Complete
> **Completed:** 2026-01-11 by Claude (session v1.0.0.22)
> **Priority:** Medium

---

## Context

During the 2026-01-11 session, we added delete functionality to the supplier modal. However, the user wants this functionality available from the **main Inventory page** (Products tab) with proper permission checks.

## Requirements

### 1. Delete Product from Inventory Page
- Add ability to delete products from the main **Inventory > Products** tab
- Delete button should only appear when **quantity = 0**
- Only **boss** role OR workers with specific permission can see delete button
- Workers with general "Manage Inventory" permission should **NOT** see delete button

### 2. Permission Check Logic
```tsx
// Suggested logic:
const canDeleteProduct = (user.role === "boss") || 
                         (user.permissions?.includes("delete_products"));
```

### 3. Options to Implement (User to choose)

**Option A: Edit/Delete Column in Table**
- Add an actions column to the Products table
- Show edit/delete icons
- Delete only enabled if qty=0

**Option B: Product Detail Modal**
- Click product row → Opens Product Detail Modal
- Modal shows: product info, all suppliers, edit/delete buttons
- Can also manage multi-supplier preferences here

### 4. Activity Logging
- Already implemented in `InventoryProvider.deleteInventoryItem()`
- Logs to `inventory_logs` with action="delete"

---

## Related Files
- `client/src/pages/boss/Inventory.tsx` - Main inventory page
- `client/src/pages/boss/components/ProduitsTab.tsx` - Products tab (if exists)
- `client/src/api/providers/supabase/InventoryProvider.ts` - Delete already implemented
- `shared/schema.ts` - Permission types

---

## Database Ready
- `inventory_logs` table exists for logging
- `deleteInventoryItem()` validates qty=0 and boss role

---

## Notes
- Multi-supplier UI feature is also pending (see `implementation_plan.md`)
- `product_suppliers` table has `isPreferred` field ready
