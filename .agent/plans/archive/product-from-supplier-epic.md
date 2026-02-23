# EPIC: Product-From-Supplier System

> **Status:** ✅ COMPLETE
> **Priority:** High
> **Owner:** Derek (Admin UI), Marcus (Backend)
> **Created:** 2026-01-07
> **Archived:** 2026-01-07

---

## Problem Statement

**Current Workflow (Inefficient):**
1. Go to Inventory → Create product
2. Go to Suppliers → Find supplier
3. Select supplier on product → Hope it links
4. Go back to Suppliers → Create order

**Proposed Workflow (Streamlined):**
1. Go to Suppliers → [Provigo] → **"Ajouter Produit"**
2. Product created **automatically linked** to supplier
3. Create order immediately

---

## Features Overview

### Feature 1: Create Product from Supplier
> Add button in SupplierDetailModal → "Ajouter Produit" button
> Opens product creation form with supplier pre-selected
> Auto-creates `product_suppliers` link on save

### Feature 2: Multi-Supplier Support for Products
> Product can be linked to multiple suppliers with different prices
> Dropdown on product card shows all supplier options
> Live price comparison visible on the card

### Feature 3: Default/Preferred Supplier
> Mark one supplier as "⭐ Préféré" per product
> When creating PO, auto-select preferred supplier
> Easy toggle to switch preferred supplier

---

## Phase 1: Create Product from Supplier Page (Derek)

### Files to Modify:
- `client/src/pages/boss/components/SupplierDetailModal.tsx` - Add "Ajouter Produit" button
- `client/src/pages/boss/components/CreateProductFromSupplierModal.tsx` - **NEW** - Product form with supplier context

### Tasks:
- [x] Add "Ajouter Produit" button in SupplierDetailModal (Produits tab)
- [x] Create new modal component for product creation with supplier context
- [x] Form includes: Name, SKU, Description, Cost Price (from supplier), Retail Price
- [x] Auto-create `product_suppliers` entry with supplier ID and cost
- [x] Auto-create `inventory_items` entry
- [x] Show success message and refresh products list

---

## Phase 2: Multi-Supplier Product Linking (Derek + Marcus)

### Database Changes (Marcus):
- Add `is_preferred` column to `product_suppliers` table
- Add constraint: Only one `is_preferred = true` per product_id

### Files to Modify:
- `shared/schema.ts` - Add `isPreferred` field to productSuppliers
- `client/src/api/providers/supabase/SupplierProvider.ts` - Add methods for preferred supplier
- `client/src/pages/boss/inventory.tsx` - Update product form to show multiple suppliers

### Tasks:
- [x] SQL migration for `is_preferred` column
- [x] Update schema.ts with new field
- [x] Add `setPreferredSupplier(productId, supplierId)` API method
- [x] Update product detail view to show all linked suppliers with prices
- [x] Add ⭐ toggle for preferred supplier on each supplier row

---

## Phase 3: Price Comparison UI (Derek)

### Files to Modify:
- `client/src/pages/boss/components/ProductCard.tsx` - Add supplier dropdown with prices
- `client/src/pages/boss/components/ProductDetailModal.tsx` - Show full price comparison

### Tasks:
- [x] Fetch all suppliers for a product on card render
- [x] Show dropdown with supplier names and prices
- [x] Highlight preferred supplier with ⭐
- [x] Show price difference vs. lowest price
- [x] Enable switch preferred directly from dropdown

---

## Phase 4: Integrate with PO Creation (Derek)

### Files to Modify:
- `client/src/pages/boss/components/CreatePurchaseOrderModal.tsx` - Auto-select preferred supplier

### Tasks:
- [x] When adding product to PO, default to preferred supplier
- [x] Show price from that supplier
- [x] Allow switching supplier with price update
- [x] Warn if selecting non-preferred supplier

---

## Success Criteria

1. **UX Test:** Can create a product and order from Supplier page in < 5 clicks
2. **Multi-Supplier:** Same product can have 3+ suppliers with different prices
3. **Default Supplier:** Preferred supplier auto-selected for new orders
4. **Price Visibility:** All prices visible at a glance on product card

---

## Estimation

| Phase | Complexity | Estimated Time |
|-------|------------|----------------|
| Phase 1 | Medium | 1-2 sessions |
| Phase 2 | Medium | 1-2 sessions |
| Phase 3 | Simple | 1 session |
| Phase 4 | Simple | 1 session |

---

## Related Files

- `client/src/pages/boss/components/SupplierDetailModal.tsx`
- `client/src/pages/boss/inventory.tsx`
- `client/src/api/providers/supabase/SupplierProvider.ts`
- `shared/schema.ts` (productSuppliers table)
