# Fieldbox Roadmap

> **Last Updated:** 2026-01-11
> **Rule:** Keep this simple. Only active work goes here.

---

## ✅ Completed Features

| Feature | Date |
|---------|------|
| **Duplicate Detection Enhancement** | 2026-01-11 |
| **Swipe-to-Delete Products (Supplier)** | 2026-01-11 |
| **Delete Product Button (Boss-Only, Qty=0)** | 2026-01-11 |
| **Activity Logging (Unlink/Delete)** | 2026-01-11 |
| **Green Toast Update System** | 2026-01-11 |
| **QR Code Search in Products** | 2026-01-11 |
| **Unit Deletion (Admin Only)** | 2026-01-11 |
| **Version Display in UI** | 2026-01-11 |
| **Scanner Speed Fix** | 2026-01-11 |
| Reception Log Timeline | 2026-01-08 |
| Trial & Payment System (Stripe) | 2026-01-06 |
| Smart Scheduler (Calendar) | 2026-01-01 |
| Fleet Inventory (Trucks) | 2026-01-04 |
| Job Lifecycle (Validation/Completed) | 2026-01-05 |
| Product-From-Supplier (Multi-Supplier) | 2026-01-07 |
| Offline Sync Engine (Dexie) | 2026-01-03 |
| Work Order System | 2026-01-07 |
| Inventory Pro | 2026-01-07 |
| I18N Mobile Polish | 2026-01-07 |
| Mobile Voice Recorder | 2024-12-30 |
| In-App Camera V2 | 2024-12-30 |
| Photo Reliability | done |
| Job Alert Nav | done |
| Team History | done |
| AdminEmployeeDialogs Refactor | done |

---

## 🔴 Active Bugs

| Bug | Severity |
|-----|----------|
| *(none)* | - |

---

## 🟡 In Progress / Ready

| Feature | Status | Notes |
|---------|--------|-------|
| **📋 EPIC: Smart Fleet Inventory** | 🔴 Planning | `smart-fleet-inventory.md` |
| ↳ Phase 1: Reception Timestamps | 🔴 Ready | Marcus — Separate entries with hours |
| ↳ Phase 2: Truck-Employee Link | ⚪ Blocked | Derek — After Phase 1 |
| ↳ Phase 3: Inventory Location Tabs | ⚪ Blocked | Derek — Warehouse + Truck tabs |
| ↳ Phase 4: Smart Job-Truck Match | ⚪ Blocked | Marcus — Suggest best truck |
| ↳ Phase 5: Truck Pickup List | ⚪ Blocked | Derek — Show warehouse needs |
| QR Code Tracking | 🟡 Phase 1 Done | Need: Location tracking, Scanner, Enforcement |
| **↳ QR Phase 2: Full Traceability** | 🔴 Planning | Scan QR → See supplier, PO, job, client chain |
| Mecano Voice-to-JSON | 🔴 Audit | Verify Edge Function security |
| Realtime Job Sync | 🔴 Ready | Live updates across clients |

---

## ⚪ Future (Not Started)

| Feature | Description |
|---------|-------------|
| **Stock Min Calculator Helper** | Toggle "Calculer en pièces" → [30] pièces × 12 = 360 pieds (auto-calc for unitsPerPackage) |
| Offline Sync Update | Sync engine needs update after recent changes |
| Role Permissions | Granular RBAC for admin |
| Push Notifications | Mobile push for alerts |
| Reports/Export | CSV/PDF timesheet exports |
| App Store (iOS/Android) | Native apps |

---

## 📣 Marketing

| Task | Status |
|------|--------|
| Launch Campaign | ⚪ Planned |
| LinkedIn Calendar | ⚪ Planned |
| App Store Optimization | ⚪ Planned |

---

## 🟡 Technical Debt

| Issue | Notes |
|-------|-------|
| God Files (0) | Threshold updated to 1500 lines (2026-01-08) |
| Wouter Query Params | Router 404 workaround in place |
| Material CRUD | Add update/delete for job materials |

---

> **Keep it simple.** Update this when features ship.
