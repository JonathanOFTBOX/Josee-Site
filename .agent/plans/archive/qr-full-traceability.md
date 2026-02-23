# EPIC: QR Code Full Traceability (Phase 2)

> **Created:** 2026-01-08 by Victor (CTO)
> **Status:** 🔴 Planning
> **Depends On:** QR Code Phase 1 (Done), Smart Fleet Inventory

---

## 🎯 Vision

Scan any QR code on a part → See complete lifecycle:

```
Supplier → PO → Reception → Part → Truck/Warehouse → Job → Client
```

**Use Case:** Client calls about defective water heater valve
1. Worker scans QR on the valve
2. Sees: "From Provigo, PO #45, received 2026-01-08 by Jonathan"
3. Sees: "Used in Job #123 at 456 Oak St for Mrs. Johnson"
4. Can: "Mark as Defective" → Supplier notified for warranty

---

## 📋 Features

### Scanner Page
- [ ] Camera-based QR scanner (worker + boss access)
- [ ] Decode QR → lookup `part_tracking` table
- [ ] Display full traceability view

### Part Traceability View
After scanning, show:
- [ ] **Part:** Name, SKU, current quantity
- [ ] **Supplier:** Name, contact, address
- [ ] **Purchase Order:** PO #, date ordered
- [ ] **Reception:** Date received, time, received by (employee)
- [ ] **Location:** Warehouse / Truck A / Used
- [ ] **Job:** Job #, address, client name, date installed
- [ ] **Worker:** Who installed it

### Defect Reporting
- [ ] "Mark as Defective" button
- [ ] Log defect with timestamp + photo
- [ ] Link to supplier for warranty claim
- [ ] Track defect rate per supplier

---

## 🗄️ Schema Changes

```sql
-- Track individual parts from reception through usage
CREATE TABLE part_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code TEXT UNIQUE NOT NULL,
  inventory_item_id UUID REFERENCES inventory_items(id),
  reception_log_id UUID REFERENCES reception_logs(id),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  supplier_id UUID REFERENCES suppliers(id),
  current_location TEXT, -- 'warehouse', 'truck_a', 'used'
  truck_id UUID REFERENCES trucks(id),
  job_id UUID REFERENCES jobs(id), -- If used in a job
  installed_at TIMESTAMPTZ,
  installed_by UUID REFERENCES users(id),
  is_defective BOOLEAN DEFAULT false,
  defect_notes TEXT,
  defect_reported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 📱 Worker Flow

1. At job site, worker uses parts from truck
2. Scans each part QR → "Mark as Used for this Job"
3. Part is now linked to job + client

---

## 🔍 Boss Flow

1. Client reports defect
2. Boss scans QR (or searches by part/job)
3. Sees full history
4. Files warranty claim with supplier

---

## 🚀 Phases

| Phase | What | Agent |
|-------|------|-------|
| 2.1 | Scanner page + part lookup | Derek |
| 2.2 | Traceability view UI | Derek |
| 2.3 | Job-part linking (worker marks usage) | Marcus |
| 2.4 | Defect reporting + supplier notification | Marcus |

---

## 📌 CEO Notes

> "if i place a small qr code on part and a client tell me it defect is it possible to scan qr code to check what shipment it was"
> "can we link job to those part then we will know everything"

---

## 📍 Where Job-Part Logs Show

### PRIMARY: Clients Page (Most Natural Flow)

**Clients → Click Client → Tabs: [Info] [Jobs]**

```
┌─────────────────────────────────────────────────────────────┐
│ 🏢 Maxi                                               ✕     │
│ 📍 7485 des violettes | 📞 simon - 5146470625               │
├─────────────────────────────────────────────────────────────┤
│ [Info]  [Jobs]                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ === INFO TAB ===                                            │
│ 📊 Client Stats:                                            │
│   💰 Revenue: $12,450.00                                    │
│   📉 Costs: $8,200.00 (parts + labor)                       │
│   📈 Profit: $4,250.00 (34% margin)                         │
│   📦 Orders: 8                                              │
│   📅 Last Order: 2026-01-05                                 │
│   🔧 Jobs Completed: 12                                     │
│                                                             │
│ === JOBS TAB ===                                            │
│ 🔍 [Search jobs...]                    ← Filter by # or name│
│                                                             │
│ ▶ Job #123 - Fix Water Heater - 8 janv. 2026               │
│ ▼ Job #124 - Install Sink - 7 janv. 2026                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ ⬛ Valve 1/2" (x2)          [QR]                    │   │
│   │ ⬛ Pipe connector (x4)      [QR]                    │   │
│   │ ⚠️ Tube 1/4 (x1)            --- (not scanned)       │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### SECONDARY: Inventory → Historique (All Jobs View)

**Inventory → Historique tab** (add new section):
```
🔧 Utilisation en chantier

▶ Job #123 - Fix Water Heater - 8 janv. 2026 - par Jonathan
▼ Job #124 - Install Sink - 7 janv. 2026 - par Boby
   ⬛ Valve 1/2" (x2)          [QR]
   ⬛ Pipe connector (x4)      [QR]
   ⚠️ Tube 1/4 (x1)            ---
```

### Clicking [QR] or Part Name Opens Traceability:
```
┌─────────────────────────────────────────┐
│ 🔍 Part Traceability                    │
│ Part: Valve 1/2"                        │
│ QR: ABC-123-XYZ                         │
│ ─────────────────────────────────────── │
│ 📦 Received: 2026-01-05, 14:30          │
│ 👤 By: Jonathan                         │
│ 🏭 Supplier: Provigo                    │
│ 📋 PO: #45                              │
│ ─────────────────────────────────────── │
│ 🔧 Used in: Job #124 - Install Sink    │
│ 📍 Client: Mrs. Johnson, 456 Oak St     │
│ 📅 Installed: 2026-01-07, 10:15         │
└─────────────────────────────────────────┘
```

---

## ⚙️ Mandatory Scan Setting

**Settings → "Scan obligatoire des pièces"**

| Mode | Behavior |
|------|----------|
| **OFF** (default) | Worker can skip scanning, parts show "Not scanned" in logs |
| **ON** (strict) | Worker CANNOT complete job without scanning all parts |

**Use Case:**
- During transition: Keep OFF, let workers adapt
- Full control: Turn ON, enforce 100% traceability

---

> **Next Step:** Complete Smart Fleet Inventory first (provides inventory location foundation)

