# EPIC: Smart Fleet Inventory

> **Created:** 2026-01-08 by Victor (CTO)
> **Status:** 🔴 Planning
> **Priority:** High

---

## 🎯 Vision

Transform the Fleet and Inventory systems into a unified Smart Fleet Inventory where:
- Trucks are linked to employees visually
- Jobs suggest the best truck based on available stock
- Truck cards show what needs pickup from warehouse
- Inventory page manages ALL stock (warehouse + trucks)

---

## 🏗️ Architecture Changes

### Current State
```
Control Panel → Fleet → Truck → Inventory (inside truck modal)
Inventory Page → Warehouse only
Jobs → No stock consideration
```

### Target State
```
Control Panel → Job Assignment Board
  - Employee cards (with ✏️ edit + History)
  - Truck cards UNDER assigned employee
  
Drag-Drop Flow (NEW):
  🔴 BEFORE: Job → Employee
  🟢 AFTER:  Job → Truck → Employee
  
  1. Drag Truck → Drop on Employee = Assign truck to employee
  2. Drag Job → Drop on Truck = Assign job to truck (inherits employee)
  3. Truck card shows jobs assigned to it
  
Inventory Page → Tabs: [Warehouse] [Truck A] [Truck B] ...
  - Full CRUD for each location
  - Transfer between locations
  - History per location

Job-Truck Matching:
  - "Truck A has 100% materials"
  - "Truck B has 60% - needs pickup from warehouse"
```

---

## 📋 Phases

### Phase 1: Reception Timestamps Fix (Marcus) — ✅ COMPLETE
- [x] Each reception entry = separate row (no grouping by day)
- [x] Full timestamp with hours (HH:mm)
- [x] Apply to OrderDetailModal, SupplierModal, LogsTab

### Phase 2: Simplify Control Panel UI (Derek)
- [ ] **Remove Team section** (it's redundant — employees already shown in Job Assignment Board)
- [ ] Add ✏️ edit pen + History button to employee cards in Job Assignment Board
- [ ] When employee has assigned truck, show **Truck Card UNDER their employee card**
- [ ] Truck card shows: name, driver, item count, mini-inventory preview
- [ ] Click truck opens TruckDetailModal (existing)
- [ ] **Drag-drop truck assignment:** Drag unassigned truck from Fleet → drop onto employee card
- [ ] **Bug fix:** "Assign Worker" dropdown shows inventory items instead of employees

**UI Change:**
```
BEFORE:
  Job Assignment Board → [Jason] [Boby] [Jonathan]
  Team (3) → [Jason ✏️ History] [Boby ✏️ History] [Jonathan ✏️ History]  ← REDUNDANT
  Fleet (1) → [Truck A]

AFTER:
  Job Assignment Board → [Jason ✏️ History] [Boby ✏️ History] [Jonathan ✏️ History]
                              └── [Truck A card]     (if assigned, drag here)
  Fleet (1) → Unassigned trucks only + "+ Add Truck" button
```

### Phase 3: Inventory Page Location Tabs (Derek)
- [ ] Add tabs to Inventory page: [📦 Warehouse] [🚚 Truck A] [🚚 Truck B]
- [ ] Each tab shows filtered inventory by location
- [ ] Add "Transfer" action (move stock between locations)

### Phase 4: Smart Job-Truck Matching (Marcus)
Jobs continue using drag-and-drop, but now show truck material matching:

- [ ] Each job has "required materials" list (existing job_materials)
- [ ] When viewing job or assigning:
  - Calculate % match for each truck: "Truck A: 100%", "Truck B: 60%"
  - **100% = truck has all materials**
  - **<100% = needs pickup from warehouse**
- [ ] Job card shows **assigned truck badge** with % indicator
- [ ] **Temporary truck assignment:** Even if employee usually has Truck A, boss can say "take Truck B for this job"
- [ ] Orders/POs attached to trucks (since orders check truck inventory)

**UI on Job Card:**
```
┌─────────────────────────┐
│ Fix Water Heater        │
│ 📍 123 Main St          │
│ ┌───────────────────┐   │
│ │ 🚚 Truck A: 100%  │   │  ← Green = ready
│ │ 🚚 Truck B: 60%   │   │  ← Yellow = needs pickup
│ └───────────────────┘   │
└─────────────────────────┘
```

### Phase 5: Truck Pickup List (Derek)
- [ ] In TruckCard, show **"Needs from Warehouse"** section
- [ ] Lists items required for assigned jobs but not on truck:
  ```
  🔴 Missing for jobs:
    • 2x Pipe 1/2"  (for Job #45)
    • 1x Valve      (for Job #45)
    • 4x Connector  (for Job #46)
  ```
- [ ] **"Pick Up All" button** = transfer from warehouse to truck
- [ ] After pickup, job shows 100%

### Phase 6: Job-Calendar Integration (Marcus) — 🆕
**Idea:** When viewing the reception calendar popover, show dots on dates where jobs need the parts being ordered.

- [ ] In reception calendar popover, fetch upcoming jobs that require the PO items
- [ ] Show colored dots on calendar dates that have jobs needing those materials
- [ ] If we don't have stock, show red dot; if stock is pending (this PO), show orange dot
- [ ] Click on a date shows list of jobs needing those parts

**Why:** Gives clear visibility into WHY we're ordering parts and WHEN they're needed.

**Example:**
```
📅 January 2026
     Su Mo Tu We Th Fr Sa
              1  2  3  4
      5  6  7 [8] 9• 10 11    ← 9th has orange dot (job needs these parts)
     12 13 14• 15 16 17 18    ← 14th has red dot (job needs parts, out of stock)
```

### Phase 7: Unit Tracking & QR Reprinting (Marcus) — 🆕
**Problem:** If QR sticker is damaged, can't reprint the exact same one with traceability.

**Solution:** Store each unit's QR code in database with unique ID.

- [ ] Create `unit_qr_codes` table:
  ```sql
  unit_id (6-digit unique, e.g., 482957)
  inventory_item_id → product
  reception_log_id → traceability
  qr_data → full JSON (supplier, date, PO, etc.)
  created_at
  ```
- [ ] During reception printing, generate unique 6-digit IDs
- [ ] Print QR + just the unit ID on sticker (no supplier visible)
- [ ] Add search by unit ID in Historique/Inventory
- [ ] "Reprint" button → regenerates exact same QR with same data

**Sticker format:**
```
┌────────────────────┐
│  [QR CODE]         │
│    #482957         │  ← Client sees only this
└────────────────────┘
```

### Phase 8: Supplier Product Linking (Derek) — 🆕
**Problem:** When adding a product to a supplier, it creates a NEW product every time. If the same product exists from another supplier, you get duplicates.

**Solution:** Search existing products first, only create new if not found.

- [ ] In `CreateProductFromSupplierModal`, add searchable product dropdown
- [ ] Search inventory by name/SKU, show matching results
- [ ] If found → Link existing product to this supplier (create `product_supplier` entry)
- [ ] If not found → Show "➕ Create New Product" button
- [ ] This prevents duplicate products across suppliers

**UI Flow:**
```
┌─────────────────────────────────────────────┐
│ 🔍 Rechercher un produit existant...        │
│ ─────────────────────────────────────────── │
│ [Tuyau 1/4] ← Click to link                 │
│ [Tube 1/2] ← Click to link                  │
│ ─────────────────────────────────────────── │
│ ➕ Produit introuvable? Créer nouveau       │
└─────────────────────────────────────────────┘
```

### Phase 9: Multi-Location Inventory Display (Derek) — 🆕
**Problem:** Same product can exist in multiple locations (Warehouse, Truck A, Truck B). Currently no way to see all at once.

**Solution:** Collapsible product rows showing all locations.

- [ ] In inventory list, group products by name/SKU
- [ ] Show main row with total quantity and primary location
- [ ] Click to expand → Shows breakdown by location
- [ ] Most-used location shown first

**UI Example:**
```
│ 📦 Tube 1/4          100 pcs   $0.25    │
│   └─ Entrepôt (80) | Camion A (20)      │  ← Summary
│                                          │
│   ▼ [Expanded view]                      │
│   ├── 📍 Entrepôt: 80 pcs                │
│   ├── 🚚 Camion A: 15 pcs                │
│   └── 🚚 Camion B: 5 pcs                 │
```

### Phase 10: Renverser Réception (Marcus) — 🟡 IN PROGRESS
**Problème:** Si un employé fait une erreur de comptage lors de la réception, impossible d'annuler.

**Solution:** Delete individual QR codes + full reception reversal.

**COMPLETED (2026-01-10):**
- [x] `deleteUnit()` API method in InventoryUnitsProvider
- [x] Decreases stock, updates order item quantity, logs to inventory_history
- [x] Delete button (🗑️) on each QR code in QRCodeList
- [x] Confirmation dialog before delete
- [x] Query invalidation for refresh
- [x] Show delete events (🗑️ -1) in ReceptionTimeline ← VERIFIED 2026-01-11
- [x] OrderDetailModal shows individual receptions (+2, +1, +5) via ReceptionTimeline ← VERIFIED 2026-01-11

**REMAINING:**
- [x] ~~Add "🔄 Annuler cette réception" button for full reception reversal~~ **CANCELLED** - User doesn't need this feature

**UI:**
```
┌─────────────────────────────────────────────┐
│ Reception History                            │
│ ───────────────────────────────────────────  │
│ 🟡 2026-01-09, 14:30 by Jonathan             │
│    • Tuyeau 1/4: +10 unités                  │
│    [🔄 Annuler cette réception]              │
└─────────────────────────────────────────────┘
```

---

## 📂 Files Affected

| Component | File | Changes |
|-----------|------|---------|
| Control Panel | `admin/index.tsx` | Move truck cards under employees |
| Truck Card | `TruckCard.tsx` | Add mini-inventory + pickup preview |
| Inventory Page | `inventory.tsx` | Add location tabs |
| Inventory Provider | `InventoryProvider.ts` | Filter by location |
| Job Form | `JobForm.tsx` | Add truck suggestion |
| Job Provider | `JobProvider.ts` | Calculate material match % |

---

## 🗄️ Schema Changes

```sql
-- Add truck_id to inventory_items for per-truck stock
ALTER TABLE inventory_items ADD COLUMN truck_id UUID REFERENCES trucks(id);

-- Jobs need materials list (may already exist as job_materials)
-- Jobs need assigned_truck_id
ALTER TABLE jobs ADD COLUMN assigned_truck_id UUID REFERENCES trucks(id);
```

---

## ⚠️ Dependencies

1. **Phase 1 must complete first** — Timestamps are UX blocker
2. **Phase 2+3 can run parallel** — UI changes, no overlap
3. **Phase 4 requires Phase 3** — Need location-aware inventory first
4. **Phase 5 requires Phase 4** — Need job-material relationship

---

## 🚀 Dispatch Plan

| Phase | Agent | Model | Est. Sessions |
|-------|-------|-------|---------------|
| 1 | Marcus | Claude Opus 4.5 | 1 |
| 2 | Derek | Gemini 3 Pro High | 1 |
| 3 | Derek | Gemini 3 Pro High | 2 |
| 4 | Marcus | Claude Opus 4.5 | 2 |
| 5 | Derek | Gemini 3 Pro High | 1 |

---

## 📌 CEO Notes

> "when we assign a job the job say truck A B or C the closest one to have the stock to make the job"
> "in the card truck you can see what you need to pick up at the warehouse to make the order fully"

---

> **Next Step:** Approve this plan, then dispatch Marcus for Phase 1 (reception timestamps)
