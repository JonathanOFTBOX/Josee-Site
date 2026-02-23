# Fleet Inventory System - Implementation Plan

> **Assigned To:** @Desktop-Dev (Derek) + @Mobile-Dev (Maya for worker menu)
> **Priority:** High
> **Date:** 2026-01-01 | **Updated:** 2026-01-05
> **Status:** 🟡 Phase 2 Done — Gaps Identified (see Phase 2.5)

---

## Feature Overview (User Request - French)

> "Pour l'inventaire je veux voir l'inventaire aussi par camion au même endroit que où les employés sont mais comme une section en bas. On peut créer des camions pis attitrer des employés au camion. Chaque camion peut avoir de l'inventaire."
>
> "Quand on crée des jobs et on ajoute des pièces, ça vérifie quel camion est le plus compatible pour faire la job. Exemple: Camion A a 75% du stock, Camion B a 50%, Camion C a 25%. La logique c'est qu'on dise que la job devrait aller au Camion A car le stock est proche d'être complet donc lui va passer moins de temps à l'entrepôt pour charger son camion."

---

## Business Logic Summary

1. **Truck Management:** Create trucks (vehicles), assign employees to them
2. **Per-Truck Inventory:** Each truck carries its own stock of parts
3. **Compatibility Scoring:** When creating a job with materials, calculate which truck has the most parts available
4. **Smart Recommendation:** Suggest the truck with highest compatibility % to minimize warehouse loading time

---

## Phase 1: Database Schema

### New Tables

```sql
-- Trucks/Vehicles
CREATE TABLE trucks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., "Camion A", "Ford F-150 #1"
    license_plate TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Truck → Employee Assignment (Many-to-Many)
CREATE TABLE truck_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    is_primary BOOLEAN DEFAULT false, -- Primary driver
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(truck_id, employee_id)
);

-- Truck Inventory (Stock per truck)
CREATE TABLE truck_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(truck_id, inventory_item_id)
);

-- RLS Policies
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE truck_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE truck_inventory ENABLE ROW LEVEL SECURITY;

-- Boss can manage trucks
CREATE POLICY "Boss can manage trucks" ON trucks
    FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Boss can manage truck employees" ON truck_employees
    FOR ALL USING (
        EXISTS (SELECT 1 FROM trucks WHERE id = truck_id AND company_id = get_user_company_id())
    );

CREATE POLICY "Boss can manage truck inventory" ON truck_inventory
    FOR ALL USING (
        EXISTS (SELECT 1 FROM trucks WHERE id = truck_id AND company_id = get_user_company_id())
    );
```

---

## Phase 2: Admin UI - Truck Management

### Location
Same page as employees (`admin.tsx`), but in a **new section below the employee grid**.

### UI Components

```tsx
// Section structure in admin.tsx
<Tabs defaultValue="employees">
    <TabsList>
        <TabsTrigger value="employees">{t("admin.employees")}</TabsTrigger>
        <TabsTrigger value="trucks">{t("admin.trucks")}</TabsTrigger>
        <TabsTrigger value="clients">{t("admin.clients")}</TabsTrigger>
    </TabsList>
    
    <TabsContent value="employees">
        {/* Existing employee grid */}
    </TabsContent>
    
    <TabsContent value="trucks">
        <TruckManagement />
    </TabsContent>
    
    <TabsContent value="clients">
        {/* Existing clients */}
    </TabsContent>
</Tabs>
```

### TruckManagement Component

```tsx
// client/src/components/truck-management.tsx
function TruckManagement() {
    const { data: trucks } = useQuery({
        queryKey: ["trucks"],
        queryFn: () => dataProvider.getTrucks(),
    });
    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2>{t("admin.trucks")}</h2>
                <Button onClick={() => setIsAddingTruck(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("admin.addTruck")}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trucks?.map(truck => (
                    <TruckCard key={truck.id} truck={truck} />
                ))}
            </div>
        </div>
    );
}

function TruckCard({ truck }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    {truck.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        {truck.license_plate}
                    </p>
                    
                    {/* Assigned Employees */}
                    <div className="flex flex-wrap gap-1">
                        {truck.employees?.map(emp => (
                            <Badge key={emp.id} variant="secondary">
                                {emp.name}
                            </Badge>
                        ))}
                    </div>
                    
                    {/* Inventory Summary */}
                    <div className="text-xs text-muted-foreground">
                        {truck.inventory_count} items in stock
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
```

---

## Phase 2.5: Missing Features (USER FEEDBACK 2026-01-05)

> ⚠️ **Gaps identified by CEO during testing:**

### Gap 1: Missing Delete Button on Truck Inventory Items
**Problem:** Cannot remove items from truck stock. Only "Add" exists.
**Fix:** Add delete/remove button to each item row in `TruckDetailModal`.

```tsx
// In TruckDetailModal inventory tab
<Button
    variant="ghost"
    size="icon"
    onClick={() => handleRemoveItem(item.id)}
>
    <Trash2 className="w-4 h-4 text-destructive" />
</Button>
```

---

### Gap 2: Worker Inventory Self-Service
**Problem:** Inventory management is ONLY in Admin panel. Workers need to see/manage their assigned truck's inventory FROM the worker menu.

**Expected Behavior:**
1. Worker sees "My Truck" in their sidebar/menu
2. Worker can view what's in their truck
3. Worker can scan items to add (from warehouse or new)
4. Worker can mark items as "used" (deducts stock)

**Files to Create:**
- `client/src/pages/worker/my-truck.tsx` — Worker's truck inventory page
- Update worker navigation to include "My Truck" link

**Assigned To:** @Mobile-Dev (Maya) — This is worker-side mobile UI

---

### Gap 3: Admin Inventory History Dashboard
**Problem:** Admin needs to see audit trail of inventory movements, filtered by:
- **By Truck:** What was added/removed from Truck A?
- **By Employee:** What did Worker X take/use?
- **By Job:** What materials were used for Job #123?

**Existing Data:** `inventory_history` table exists (Derek created migration)
**Missing:** UI to display and filter this data

**UI Design:**
```tsx
// client/src/pages/boss/inventory-history.tsx OR a new tab in inventory page
<Tabs>
    <TabsTrigger value="all">All Activity</TabsTrigger>
    <TabsTrigger value="by-truck">By Truck</TabsTrigger>
    <TabsTrigger value="by-employee">By Employee</TabsTrigger>
</Tabs>

<DataTable
    columns={[
        { header: "Date", accessorKey: "created_at" },
        { header: "Item", accessorKey: "item_name" },
        { header: "Action", accessorKey: "action" }, // added, used, transferred
        { header: "Qty", accessorKey: "quantity" },
        { header: "Truck", accessorKey: "truck_name" },
        { header: "Employee", accessorKey: "employee_name" },
        { header: "Job #", accessorKey: "job_number" },
    ]}
    filterBy={selectedFilter} // truck_id OR employee_id
/>
```

**Assigned To:** @Desktop-Dev (Derek)

---

### Phase 2.5 Files

| File | Action | Agent |
|------|--------|-------|
| `client/src/pages/worker/my-truck.tsx` | NEW | Maya |
| `client/src/components/modals/TruckDetailModal.tsx` | MODIFY - Add delete | Derek |
| `client/src/pages/boss/inventory-history.tsx` | NEW | Derek |
| `client/src/api/SupabaseDataProvider.ts` | MODIFY - getInventoryHistory() | Derek |

---

## Phase 3: Per-Truck Inventory

### Inventory Page Enhancement

In `/boss/inventory`, add a **truck filter** at the top:

```tsx
// client/src/pages/boss/inventory.tsx
<Tabs defaultValue="warehouse">
    <TabsList>
        <TabsTrigger value="warehouse">
            <Warehouse className="w-4 h-4 mr-2" />
            {t("inventory.warehouse")}
        </TabsTrigger>
        {trucks?.map(truck => (
            <TabsTrigger key={truck.id} value={truck.id}>
                <Truck className="w-4 h-4 mr-2" />
                {truck.name}
            </TabsTrigger>
        ))}
    </TabsList>
    
    <TabsContent value="warehouse">
        <InventoryGrid items={warehouseInventory} />
    </TabsContent>
    
    {trucks?.map(truck => (
        <TabsContent key={truck.id} value={truck.id}>
            <InventoryGrid items={truck.inventory} truckId={truck.id} />
        </TabsContent>
    ))}
</Tabs>
```

### Transfer Stock Between Warehouse ↔ Truck

```tsx
function TransferStockModal({ item, trucks }) {
    const [from, setFrom] = useState("warehouse");
    const [to, setTo] = useState("");
    const [quantity, setQuantity] = useState(1);
    
    const handleTransfer = () => {
        // If from warehouse → truck
        if (from === "warehouse") {
            dataProvider.addToTruckInventory(to, item.id, quantity);
            dataProvider.decrementWarehouseStock(item.id, quantity);
        }
        // If from truck → warehouse
        else {
            dataProvider.removeFromTruckInventory(from, item.id, quantity);
            dataProvider.incrementWarehouseStock(item.id, quantity);
        }
    };
    
    return (/* Modal UI */);
}
```

---

## Phase 4: Smart Compatibility Scoring (UPDATED 2026-01-05)

> ⚠️ **CEO Requirements:** The algorithm must be SMARTER than just "does truck have materials for THIS job."

### Business Logic (Critical)

1. **Multi-Job Awareness:** Consider ALL jobs assigned to truck, not just current job
2. **10% Buffer:** Always require 10% more inventory than strictly needed (safety margin)
3. **Depletion Warning:** If taking materials for Job A would deplete stock for Jobs B & C → FLAG IT
4. **Worker View:** Show missing items worker needs to pick from warehouse

### Algorithm

```typescript
// client/src/lib/truck-compatibility.ts

interface JobMaterial {
    inventoryItemId: string;
    quantity: number;
    itemName: string;
}

interface TruckCompatibility {
    truckId: string;
    truckName: string;
    score: number; // 0-100 percentage
    itemsAvailable: number;
    itemsNeeded: number;
    missingItems: Array<{ name: string; needed: number; available: number }>;
    depletionWarning: boolean; // True if this job would starve other jobs
    affectedJobs: string[]; // Job names that would be affected
}

const BUFFER_PERCENTAGE = 0.10; // 10% safety buffer

export function calculateSmartTruckCompatibility(
    newJobMaterials: JobMaterial[],
    trucks: TruckWithInventory[],
    allAssignedJobs: Map<string, Job[]> // truckId -> jobs assigned to that truck
): TruckCompatibility[] {
    
    return trucks.map(truck => {
        const truckJobs = allAssignedJobs.get(truck.id) || [];
        
        // Step 1: Calculate TOTAL materials needed for ALL assigned jobs + new job
        const totalMaterialsNeeded = new Map<string, { name: string; total: number }>();
        
        // Add materials from all existing assigned jobs
        for (const job of truckJobs) {
            for (const material of job.materials || []) {
                const existing = totalMaterialsNeeded.get(material.inventoryItemId);
                if (existing) {
                    existing.total += material.quantity;
                } else {
                    totalMaterialsNeeded.set(material.inventoryItemId, {
                        name: material.itemName,
                        total: material.quantity
                    });
                }
            }
        }
        
        // Add materials from new job being created
        for (const material of newJobMaterials) {
            const existing = totalMaterialsNeeded.get(material.inventoryItemId);
            if (existing) {
                existing.total += material.quantity;
            } else {
                totalMaterialsNeeded.set(material.inventoryItemId, {
                    name: material.itemName,
                    total: material.quantity
                });
            }
        }
        
        // Step 2: Apply 10% buffer
        for (const [id, data] of totalMaterialsNeeded) {
            data.total = Math.ceil(data.total * (1 + BUFFER_PERCENTAGE));
        }
        
        // Step 3: Compare against truck inventory
        let itemsAvailable = 0;
        let itemsNeeded = 0;
        const missingItems: TruckCompatibility["missingItems"] = [];
        const affectedJobs: string[] = [];
        let depletionWarning = false;
        
        for (const [itemId, data] of totalMaterialsNeeded) {
            itemsNeeded += data.total;
            
            const truckStock = truck.inventory.find(
                i => i.inventory_item_id === itemId
            );
            
            const available = truckStock?.quantity || 0;
            const usable = Math.min(available, data.total);
            itemsAvailable += usable;
            
            if (available < data.total) {
                missingItems.push({
                    name: data.name,
                    needed: data.total,
                    available: available,
                });
                
                // Check if this would affect other jobs
                if (truckJobs.length > 0) {
                    depletionWarning = true;
                    // Identify which jobs would be affected
                    for (const job of truckJobs) {
                        if (job.materials?.some(m => m.inventoryItemId === itemId)) {
                            if (!affectedJobs.includes(job.title)) {
                                affectedJobs.push(job.title);
                            }
                        }
                    }
                }
            }
        }
        
        const score = itemsNeeded > 0 
            ? Math.round((itemsAvailable / itemsNeeded) * 100)
            : 100; // No materials needed = 100% compatible
        
        return {
            truckId: truck.id,
            truckName: truck.name,
            score,
            itemsAvailable,
            itemsNeeded,
            missingItems,
            depletionWarning,
            affectedJobs,
        };
    }).sort((a, b) => b.score - a.score); // Best first
}
```

### UI in Job Creation

```tsx
// When adding materials to a job, show truck recommendations
function TruckRecommendation({ jobMaterials }) {
    const compatibility = calculateTruckCompatibility(jobMaterials, trucks);
    const best = compatibility[0];
    
    return (
        <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">
                {t("jobs.recommendedTruck")}
            </h4>
            
            {best && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-medium">{best.truckName}</span>
                    </div>
                    <Badge variant={best.score >= 75 ? "success" : best.score >= 50 ? "warning" : "destructive"}>
                        {best.score}% compatible
                    </Badge>
                </div>
            )}
            
            {best?.missingItems.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                    <p>Missing items (need to pick up from warehouse):</p>
                    <ul className="list-disc list-inside">
                        {best.missingItems.map(item => (
                            <li key={item.name}>
                                {item.name}: {item.needed - item.available} more needed
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Show other trucks */}
            <details className="mt-2">
                <summary className="text-sm cursor-pointer text-muted-foreground">
                    View all trucks
                </summary>
                {compatibility.map(t => (
                    <div key={t.truckId} className="flex justify-between py-1">
                        <span>{t.truckName}</span>
                        <span>{t.score}%</span>
                    </div>
                ))}
            </details>
        </div>
    );
}
```

---

## i18n Keys

```typescript
// client/src/lib/translations.ts
admin: {
    trucks: { en: "Trucks", fr: "Camions" },
    addTruck: { en: "Add Truck", fr: "Ajouter camion" },
    editTruck: { en: "Edit Truck", fr: "Modifier camion" },
    truckName: { en: "Truck Name", fr: "Nom du camion" },
    licensePlate: { en: "License Plate", fr: "Plaque d'immatriculation" },
    assignedEmployees: { en: "Assigned Employees", fr: "Employés assignés" },
    primaryDriver: { en: "Primary Driver", fr: "Conducteur principal" },
},
inventory: {
    warehouse: { en: "Warehouse", fr: "Entrepôt" },
    truckStock: { en: "Truck Stock", fr: "Stock camion" },
    transferStock: { en: "Transfer Stock", fr: "Transférer stock" },
},
jobs: {
    recommendedTruck: { en: "Recommended Truck", fr: "Camion recommandé" },
    truckCompatibility: { en: "Truck Compatibility", fr: "Compatibilité camion" },
    missingItems: { en: "Missing Items", fr: "Items manquants" },
},
```

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `supabase/migrations/fleet_inventory.sql` | NEW - Tables + RLS |
| `client/src/components/truck-management.tsx` | NEW - Admin UI |
| `client/src/components/truck-card.tsx` | NEW - Card component |
| `client/src/components/truck-recommendation.tsx` | NEW - Job compatibility |
| `client/src/lib/truck-compatibility.ts` | NEW - Scoring algorithm |
| `client/src/pages/boss/admin.tsx` | MODIFY - Add trucks tab |
| `client/src/pages/boss/inventory.tsx` | MODIFY - Add truck tabs |
| `client/src/api/SupabaseDataProvider.ts` | MODIFY - Add truck CRUD |
| `client/src/lib/translations.ts` | MODIFY - Add i18n keys |

---

## Verification Plan

### Phase 1 (Schema)
- [ ] Tables created in Supabase
- [ ] RLS policies work correctly
- [ ] No data leakage between companies

### Phase 2 (Truck Management)
- [ ] Can create/edit/delete trucks
- [ ] Can assign employees to trucks
- [ ] UI appears below employees in Admin

### Phase 3 (Per-Truck Inventory)
- [ ] Can view inventory per truck
- [ ] Can transfer stock warehouse ↔ truck
- [ ] Stock quantities update correctly

### Phase 4 (Compatibility)
- [ ] Algorithm calculates correct percentages
- [ ] UI shows recommendations when adding materials to job
- [ ] Best truck highlighted

---

## Model Recommendation

**Gemini 3 Pro High** - This is primarily frontend work (Admin UI, Tabs, Cards) with some backend CRUD. Creative UI work favors Gemini.

---

## Execution Log

> Derek: Update this section as you work.

| Time | Action | Result |
|------|--------|--------|
| | | |
