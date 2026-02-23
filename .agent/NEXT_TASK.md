# Next Task: Global Zero-Latency Audit

## Context
Transform the entire application to be "Instant & Offline-First" everywhere possible. Eliminate loading spinners on all reference data, not just inventory.

## Mission: Audit & Architecture Plan

### STEP 1: Complete Audit
Scan all entities that should be cached locally:
- Inventory (35k items) ✅ DONE
- Product Details / Locations
- Dropdowns: Clients, Jobs, Categories, Styles
- Static Data: Settings, Users

### STEP 2: Database Verification
For each entity, check if columns exist:
- `updated_at` (with auto-update trigger)
- `deleted_at` (for soft deletes)

**Deliverable:** List tables needing SQL migration

### STEP 3: Smart Sync Architecture
Design generic `useSmartSync(entityName)` hook:
- How to handle relations (e.g., sync InventoryLocations with Inventory?)
- How to bypass 1000-row Supabase limit for each entity?

### STEP 4: Action Plan
- SQL migrations needed
- Priority order for component refactoring

---

## Key Points to Address

1. **Locations Case:** Should download ALL locations upfront (instant on click), NOT load on-click (which stays slow)

2. **Soft Delete:** Include `deleted_at` for ALL tables, not just inventory

3. **Realistic Complexity:** Don't try to do everything at once - prioritize

---

## DO NOT CODE YET
Just analyze and present the Battle Plan. List all tables to optimize and explain how product locations will load instantly.
