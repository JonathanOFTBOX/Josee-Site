# Enhancement: Reception Verification Workflow

> **Agent:** @Enforcer (Marcus)
> **Priority:** 🟡 Medium
> **Date:** 2026-01-07
> **Requested By:** CEO

---

## Problem Statement

When receptions are done (by workers or warehouse), the boss needs to:
1. **Know** that a reception happened (badge on supplier)
2. **Verify/acknowledge** the reception (mark as checked)
3. **Filter** to see only suppliers with unchecked receptions

---

## Proposed Solution

### Schema Changes

Add verification tracking to `purchase_orders` table:

```sql
ALTER TABLE purchase_orders
ADD COLUMN reception_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN reception_verified_by UUID REFERENCES profiles(id);
```

**Logic:**
- When `status` changes to `received` or `partial`, `reception_verified_at` stays NULL
- Boss clicks "Vérifier" → sets `reception_verified_at` = now(), `reception_verified_by` = current user
- Badge shows when: `status IN ('received', 'partial') AND reception_verified_at IS NULL`

---

## UI Changes

### 1. Supplier Card Badge

```
┌────────────────────────────────────────┐
│ 🏪 Provigo                    ✏️ 🗑️    │
│ 👤 Jonathan Gorce                      │
│ 📞 5146470625                          │
│ 📧 jonathan@oftbox.com                 │
│ 📍 7485 Rue Des Violettes              │
│                                        │
│ 🔔 2 réceptions à vérifier  ← BADGE    │
└────────────────────────────────────────┘
```

### 2. Filter Dropdown

```
[ 🔽 Tous          ▼ ]
    ├── Tous
    ├── À vérifier (2)  ← Only suppliers with pending verifications
    └── Vérifié
```

### 3. Verification Action

In the order detail or reception history, add a "✓ Vérifier" button that marks the reception as acknowledged.

---

## Files to Modify

| File | Action |
|------|--------|
| `supabase/migrations/20260108_reception_verification.sql` | [NEW] Add migration |
| `shared/schema.ts` | Add `receptionVerifiedAt`, `receptionVerifiedBy` to PurchaseOrder |
| `client/src/api/providers/supabase/PurchaseOrderProvider.ts` | Add `verifyReception()` method |
| `client/src/api/providers/supabase/SupplierProvider.ts` | Add query for unverified reception count per supplier |
| `client/src/pages/boss/suppliers.tsx` | Add badge and filter |

---

## Verification Plan

### Manual Test
1. Receive items from a purchase order
2. Go to Fournisseurs page
3. See "🔔 1 réception à vérifier" badge on supplier
4. Use filter to show only suppliers with pending verifications
5. Click verify, badge disappears

---

## Acceptance Criteria

- [ ] Migration adds verification columns
- [ ] Badge shows on supplier card when unchecked receptions exist
- [ ] Filter works to show only suppliers with pending verifications  
- [ ] "Vérifier" button marks reception as checked
- [ ] Badge count updates in real-time after verification
