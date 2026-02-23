# QR Code Tracking - Phase 2 & 3 Implementation

> **Status:** 🔴 NOT STARTED
> **Prerequisites:** Phase 1 complete (2026-01-08)
> **Assigned:** Unassigned

---

## Overview

Phase 1 (QR generation + print) is complete. The following phases need implementation:

1. **Location Tracking** - Assign units to warehouse/rack/truck
2. **QR Scanner** - Scan to assign/move units
3. **Enforcement** - Block reception if QR not printed (when setting is ON)

---

## Phase 2: Location Tracking

### Database
- `inventory_units.location_type` - 'warehouse' | 'rack' | 'truck'
- `inventory_units.location_id` - UUID of location
- `inventory_units.location_name` - Human-readable name

> Fields already exist in schema, just unused

### UI Components Needed

1. **LocationSelector.tsx** - Dropdown to select location type + specific location
2. **Update Inventory page** - Show unit locations, filter by location
3. **UnitLocationBadge.tsx** - Display location on inventory items

### Files to Modify
- `client/src/pages/boss/inventory.tsx`
- `client/src/api/providers/supabase/InventoryUnitsProvider.ts`
- `shared/schema.ts` (if fields missing)

---

## Phase 3: QR Scanner

### Dependencies
- `html5-qrcode` or `@yudiel/react-qr-scanner`

### UI Components Needed
1. **QRScanner.tsx** - Camera interface for scanning
2. **ScanResultModal.tsx** - Show unit info after scan, allow location assignment

### Flow
1. User clicks "📷 Scanner" button
2. Camera opens, scans QR code
3. Lookup unit by `qr_code`
4. Show unit info + current location
5. Allow user to update location
6. Save and show confirmation

---

## Phase 4: Enforcement

### When `companies.qr_tracking_required = true`:
- After reception confirmation, if QR codes not printed → block/warn
- Log QR print events for audit

### Files to Modify
- `client/src/pages/boss/components/ReceivingTab.tsx`
- Add `qrCodesPrinted` state tracking

---

## Testing Checklist
- [ ] Receive item → assign location
- [ ] Scan QR → see unit info
- [ ] Move unit between locations
- [ ] Filter inventory by location
- [ ] Enforcement when setting is ON
