# Marcus (Backend/API) - Session Task

> **Current Session:** 2026-01-15 08:20
> **Focus:** Smart Fleet Inventory v2 — Phase 1 EXECUTION

---

## Step 0: Initialization
- [x] Create task.md (this file)
- [x] Read before-starting.md (Marcus section)
- [x] Read CODE_PATTERNS.md (coding standards)
- [x] Read smart-fleet-inventory.md (old plan — SCRAPPING)
- [x] Read ROADMAP.md (check feature status)
- [x] Read DEBUG_HISTORY.md (check active bugs)

---

## Main Tasks

### 🔄 CEO Direction: SCRAP OLD PLAN
CEO requested creating a NEW plan with flexibility for:
- **QR Mode:** Full traceability with scannable stickers
- **Manual Mode:** Simple quantity tracking without QR

### Exploration Completed
- [x] Read `inventory.tsx` — 5 tabs: Receiving, Trucks, Products, Locations, Logs
- [x] Read `InventoryUnitsProvider.ts` (780 lines) — Full QR tracking
- [x] Read `TruckProvider.ts` — Has `calculateTruckCompatibility()` already!
- [x] Read `shared/schema.ts` — Full DB schema including `inventory_units`, `trucks`
- [x] Read `qr-print-utils.ts` — Multi-size labels, Bluetooth printing

### v2 Plan Created
- [x] Created new `implementation_plan.md` with 5 phases
- [x] Phase 1: QR/Manual Mode Toggle (Marcus)
- [x] Phase 2: Simplify Control Panel (Derek)
- [x] Phase 3: Inventory Location Tabs (Derek)
- [x] Phase 4: Smart Job-Truck Matching (Marcus)
- [x] Phase 5: Truck Pickup List (Derek)

---

## Discovered During Session

### ✅ Already Exists (No Work Needed)
| Component | Status |
|-----------|--------|
| `companies.qr_tracking_required` | Column exists for toggle |
| `TruckProvider.calculateTruckCompatibility()` | Job-truck matching ready |
| Truck cards | `truck-card.tsx` exists |
| QR printing | Full implementation in `qr-print-utils.ts` |

### ❓ Need to Find
- [x] Control Panel file location? → Need to check `pages/boss/` structure

---

## Questions for CEO (in implementation_plan.md)
1. QR Mode Toggle: Per-company or per-product?
2. Priority: Phase 1 (backend) or Phase 2 (UI) first?
3. Timeline for phases?

---

## Next Steps
- [ ] Await CEO approval of implementation_plan.md
- [ ] Archive old smart-fleet-inventory.md to plans/archive/
- [ ] Begin Phase 1 or dispatch Phase 2 to Derek

---

## Session End
- [ ] Update ROADMAP.md with new EPIC status
- [ ] Archive old plan if approved
- [ ] git add -A → git commit → git push
