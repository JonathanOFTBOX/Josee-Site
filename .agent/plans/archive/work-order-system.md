# Work Order System (Bon de Travail) - Implementation Plan

> **Assigned To:** @Mobile-Dev (Maya) + @Desktop-Dev (Derek) for Phase 4
> **Priority:** 🔴 Critical
> **Date:** 2026-01-01
> **Status:** Planned

---

## Feature Overview (User Request - French)

> "Faire une section bon de travail. Besoin du bon de travail avec les pièces ajoutées pour punch out. Accès à l'inventaire pour ajouter des pièces. Si pas les pièces en inventaire, y'a toujours la note proche du punch out qui existe qu'ils peuvent écrire pour faire son installation."
>
> "Ceci est dans la section des worker punch in / punch out. Ils peuvent pas punch out sans bon de travail."
>
> "Ça prend une section côté admin qui puisse voir les bons de travail pour les jobs car le boss doit valider les bons de travail pour les tourner en soumission ou job à faire."

---

## Business Logic Summary

### Worker Side (Mobile)
1. **Work Order Required:** Worker CANNOT punch out without filling a "bon de travail"
2. **Parts Used:** Worker selects parts from inventory (truck or warehouse)
3. **Notes:** If parts not in system, worker writes in notes field (existing feature)
4. **Work Description:** What was done during the session

### Boss Side (Admin)
1. **View Work Orders:** List of all work orders per job
2. **Validate:** Boss reviews and approves work orders
3. **Convert To:**
   - **Soumission (Quote):** Turn work order into a quote for additional work
   - **Job à faire:** Create a follow-up job based on work order

---

## Phase 1: Database Schema

### New Tables

```sql
-- Work Orders
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    worker_id UUID REFERENCES profiles(id) NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    
    -- Content
    work_description TEXT, -- What was done
    notes TEXT, -- Free-form notes (for items not in inventory)
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'converted')),
    validated_by UUID REFERENCES profiles(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    
    -- Conversion tracking
    converted_to_type TEXT CHECK (converted_to_type IN ('quote', 'job')),
    converted_to_id UUID, -- ID of the quote or job created
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Order Items (Parts Used)
CREATE TABLE work_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE NOT NULL,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    
    -- Item details (copied at time of creation for history)
    item_name TEXT NOT NULL,
    item_sku TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2),
    
    -- Source tracking
    source_type TEXT CHECK (source_type IN ('truck', 'warehouse', 'manual')),
    source_truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_work_orders_session ON work_orders(session_id);
CREATE INDEX idx_work_orders_job ON work_orders(job_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_order_items_work_order ON work_order_items(work_order_id);

-- RLS Policies
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_items ENABLE ROW LEVEL SECURITY;

-- Workers can create/view their own work orders
CREATE POLICY "Workers can manage own work orders" ON work_orders
    FOR ALL USING (
        worker_id = auth.uid() OR 
        company_id = get_user_company_id()
    );

-- Boss can view/validate all company work orders
CREATE POLICY "Boss can manage all company work orders" ON work_orders
    FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Work order items access" ON work_order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM work_orders 
            WHERE id = work_order_id AND company_id = get_user_company_id()
        )
    );
---

## Phase 1.5: Offline Sync Compatibility (CRITICAL)

> **Source:** Marcus Audit (2026-01-04)
> **Reason:** Workers may fill work orders OFFLINE in the field. If offline sync is not planned, data will be lost.

### ⚠️ Problem
Current lifecycle sync is READ-ONLY for workers. Work Orders allow workers to **CREATE** data offline:
- Work description
- Parts used
- Notes

If offline → this data must queue for sync.

### Required Changes

| File | Change | Agent |
|------|--------|-------|
| `client/src/api/types.ts` | Add `work_order_create` to `OfflineMutation.type` enum | Marcus |
| `client/src/offline/offline-db.ts` | Add `pendingWorkOrders` Dexie table | Marcus |
| `client/src/offline/dexie-sync-queue.ts` | Add `work_order_create` handler | Marcus |

### Sync Conflict Resolution
- **Strategy:** Last-write-wins (work orders are per-session, no concurrent edits)
- **Fallback:** If sync fails, retry with exponential backoff
- **Timeout:** Mark as "needs review" if sync fails after 3 attempts

### Verification
- [ ] Create work order offline → comes back online → syncs correctly
- [ ] Parts inventory decrements correctly after sync
- [ ] Boss sees work order in "Pending" tab after sync

---

## Phase 2: Work Order Form (Worker - Mobile)

### Location
Insert BEFORE the punch out confirmation in `punch-out-modal.tsx`.

### Flow
```
1. Worker clicks "Punch Out"
2. Show Work Order Form (NEW)
   - Parts Used (add from inventory)
   - Notes
   - Work Description
3. Worker completes form → clicks "Submit & Punch Out"
4. Work order saved → Session ends
```

### UI Component

```tsx
// client/src/components/work-order-form.tsx

interface WorkOrderFormProps {
    sessionId: string;
    jobId: string;
    onComplete: (workOrderId: string) => void;
}

export function WorkOrderForm({ sessionId, jobId, onComplete }: WorkOrderFormProps) {
    const { t } = useLanguage();
    const [items, setItems] = useState<WorkOrderItem[]>([]);
    const [notes, setNotes] = useState("");
    const [workDescription, setWorkDescription] = useState("");
    const [isAddingItem, setIsAddingItem] = useState(false);
    
    // Get available inventory (truck + warehouse)
    const { data: inventory } = useQuery({
        queryKey: ["worker-inventory"],
        queryFn: () => dataProvider.getWorkerInventory(), // Worker's truck + warehouse
    });
    
    const handleAddItem = (item: InventoryItem, quantity: number, source: 'truck' | 'warehouse') => {
        setItems(prev => [...prev, {
            inventoryItemId: item.id,
            itemName: item.name,
            itemSku: item.sku,
            quantity,
            unitPrice: item.price,
            sourceType: source,
            sourceTruckId: source === 'truck' ? item.truckId : null,
        }]);
        setIsAddingItem(false);
    };
    
    const handleSubmit = async () => {
        const workOrder = await dataProvider.createWorkOrder({
            sessionId,
            jobId,
            workDescription,
            notes,
            items,
        });
        
        // Decrement inventory for used items
        for (const item of items) {
            if (item.sourceType === 'truck') {
                await dataProvider.decrementTruckInventory(item.sourceTruckId, item.inventoryItemId, item.quantity);
            } else if (item.sourceType === 'warehouse') {
                await dataProvider.decrementWarehouseInventory(item.inventoryItemId, item.quantity);
            }
        }
        
        onComplete(workOrder.id);
    };
    
    return (
        <div className="space-y-4 p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                {t("workOrder.title")} {/* "Bon de Travail" */}
            </h2>
            
            {/* Work Description */}
            <div className="space-y-2">
                <Label>{t("workOrder.workDone")}</Label>
                <Textarea
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder={t("workOrder.workDonePlaceholder")}
                    className="min-h-[80px]"
                />
            </div>
            
            {/* Parts Used Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>{t("workOrder.partsUsed")}</Label>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsAddingItem(true)}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        {t("workOrder.addPart")}
                    </Button>
                </div>
                
                {items.length > 0 ? (
                    <div className="space-y-2">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                                <div>
                                    <p className="font-medium">{item.itemName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantity}x • {item.sourceType === 'truck' ? '🚚 Camion' : '🏠 Entrepôt'}
                                    </p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">
                        {t("workOrder.noPartsAdded")}
                    </p>
                )}
            </div>
            
            {/* Notes (for items not in inventory) */}
            <div className="space-y-2">
                <Label>{t("workOrder.notes")}</Label>
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("workOrder.notesPlaceholder")}
                    className="min-h-[60px]"
                />
            </div>
            
            {/* Add Item Modal */}
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("workOrder.addPart")}</DialogTitle>
                    </DialogHeader>
                    <InventoryPicker 
                        inventory={inventory}
                        onSelect={handleAddItem}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
```

---

## Phase 3: Punch Out Gate

### Modify `punch-out-modal.tsx`

```tsx
// client/src/components/punch-out-modal.tsx

function PunchOutModal({ session, onConfirm }) {
    const [step, setStep] = useState<'work-order' | 'confirm'>('work-order');
    const [workOrderId, setWorkOrderId] = useState<string | null>(null);
    
    const handleWorkOrderComplete = (id: string) => {
        setWorkOrderId(id);
        setStep('confirm');
    };
    
    return (
        <Dialog>
            <DialogContent className="max-w-md">
                {step === 'work-order' && (
                    <WorkOrderForm
                        sessionId={session.id}
                        jobId={session.jobId}
                        onComplete={handleWorkOrderComplete}
                    />
                )}
                
                {step === 'confirm' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{t("punchOut.confirm")}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="p-4 bg-green-500/10 rounded-lg">
                            <Check className="w-6 h-6 text-green-500 mx-auto" />
                            <p className="text-center mt-2">
                                {t("workOrder.submitted")}
                            </p>
                        </div>
                        
                        <DialogFooter>
                            <Button onClick={() => onConfirm(workOrderId)}>
                                {t("punchOut.confirmButton")}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
```

---

## Phase 4: Boss Validation (Admin)

### Location
New tab in Admin panel OR new page `/boss/work-orders`.

### UI Component

```tsx
// client/src/pages/boss/work-orders.tsx

export default function BossWorkOrdersPage() {
    const { data: workOrders } = useQuery({
        queryKey: ["work-orders"],
        queryFn: () => dataProvider.getAllWorkOrders(),
    });
    
    const validateMutation = useMutation({
        mutationFn: (id: string) => dataProvider.validateWorkOrder(id),
        onSuccess: () => queryClient.invalidateQueries(["work-orders"]),
    });
    
    const convertToQuoteMutation = useMutation({
        mutationFn: (id: string) => dataProvider.convertWorkOrderToQuote(id),
    });
    
    const convertToJobMutation = useMutation({
        mutationFn: (id: string) => dataProvider.convertWorkOrderToJob(id),
    });
    
    return (
        <div className="space-y-4">
            <h1>{t("workOrders.title")}</h1>
            
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">
                        {t("workOrders.pending")} ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="validated">
                        {t("workOrders.validated")}
                    </TabsTrigger>
                    <TabsTrigger value="converted">
                        {t("workOrders.converted")}
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                    {workOrders?.filter(wo => wo.status === 'pending').map(wo => (
                        <WorkOrderCard 
                            key={wo.id}
                            workOrder={wo}
                            onValidate={() => validateMutation.mutate(wo.id)}
                            onConvertToQuote={() => convertToQuoteMutation.mutate(wo.id)}
                            onConvertToJob={() => convertToJobMutation.mutate(wo.id)}
                        />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function WorkOrderCard({ workOrder, onValidate, onConvertToQuote, onConvertToJob }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{workOrder.job?.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {workOrder.worker?.name} • {format(workOrder.createdAt, "PPp")}
                        </p>
                    </div>
                    <Badge variant={workOrder.status === 'pending' ? 'warning' : 'success'}>
                        {workOrder.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Work Description */}
                <div>
                    <h4 className="font-medium text-sm">{t("workOrder.workDone")}</h4>
                    <p className="text-sm">{workOrder.workDescription || "-"}</p>
                </div>
                
                {/* Parts Used */}
                <div>
                    <h4 className="font-medium text-sm">{t("workOrder.partsUsed")}</h4>
                    {workOrder.items?.length > 0 ? (
                        <ul className="text-sm space-y-1">
                            {workOrder.items.map(item => (
                                <li key={item.id} className="flex justify-between">
                                    <span>{item.itemName} x{item.quantity}</span>
                                    {item.unitPrice && (
                                        <span className="text-muted-foreground">
                                            ${(item.quantity * item.unitPrice).toFixed(2)}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Aucune pièce</p>
                    )}
                </div>
                
                {/* Notes */}
                {workOrder.notes && (
                    <div>
                        <h4 className="font-medium text-sm">{t("workOrder.notes")}</h4>
                        <p className="text-sm">{workOrder.notes}</p>
                    </div>
                )}
                
                {/* Actions */}
                {workOrder.status === 'pending' && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <Button onClick={onValidate} size="sm">
                            <Check className="w-4 h-4 mr-1" />
                            {t("workOrders.validate")}
                        </Button>
                        <Button onClick={onConvertToQuote} size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            {t("workOrders.toQuote")} {/* "Soumission" */}
                        </Button>
                        <Button onClick={onConvertToJob} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            {t("workOrders.toJob")} {/* "Job à faire" */}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
```

---

## i18n Keys

```typescript
workOrder: {
    title: { en: "Work Order", fr: "Bon de Travail" },
    workDone: { en: "Work Performed", fr: "Travail effectué" },
    workDonePlaceholder: { en: "Describe what was done...", fr: "Décrivez ce qui a été fait..." },
    partsUsed: { en: "Parts Used", fr: "Pièces utilisées" },
    addPart: { en: "Add Part", fr: "Ajouter pièce" },
    noPartsAdded: { en: "No parts added yet", fr: "Aucune pièce ajoutée" },
    notes: { en: "Additional Notes", fr: "Notes additionnelles" },
    notesPlaceholder: { en: "Notes for items not in inventory...", fr: "Notes pour items pas en inventaire..." },
    submitted: { en: "Work order submitted!", fr: "Bon de travail soumis!" },
},
workOrders: {
    title: { en: "Work Orders", fr: "Bons de Travail" },
    pending: { en: "Pending", fr: "En attente" },
    validated: { en: "Validated", fr: "Validés" },
    converted: { en: "Converted", fr: "Convertis" },
    validate: { en: "Validate", fr: "Valider" },
    toQuote: { en: "Convert to Quote", fr: "Convertir en soumission" },
    toJob: { en: "Create Follow-up Job", fr: "Créer job à faire" },
},
```

---

## Files to Modify/Create

| File | Action | Agent |
|------|--------|-------|
| `supabase/migrations/work_orders.sql` | NEW - Tables + RLS | Marcus |
| `client/src/components/work-order-form.tsx` | NEW - Worker form | Maya |
| `client/src/components/inventory-picker.tsx` | NEW - Part selector | Maya |
| `client/src/components/punch-out-modal.tsx` | MODIFY - Add work order step | Maya |
| `client/src/pages/boss/work-orders.tsx` | NEW - Admin page | Derek |
| `client/src/components/work-order-card.tsx` | NEW - Card component | Derek |
| `client/src/api/SupabaseDataProvider.ts` | MODIFY - Add work order CRUD | Marcus |
| `client/src/lib/translations.ts` | MODIFY - Add i18n keys | Maya |

---

## Verification Plan

### Phase 1 (Schema)
- [ ] Tables created in Supabase
- [ ] RLS policies work correctly
- [ ] Workers can only see their own work orders

### Phase 2 (Worker Form)
- [ ] Form appears in punch-out flow
- [ ] Can add parts from inventory
- [ ] Can write notes

### Phase 3 (Punch Out Gate)
- [ ] Cannot skip work order
- [ ] Work order saved before session ends
- [ ] Inventory decremented for used parts

### Phase 4 (Boss Validation)
- [ ] Boss can see all pending work orders
- [ ] Boss can validate work orders
- [ ] Can convert to quote (creates new quote record)
- [ ] Can convert to job (creates new job)

---

## Model Recommendation

- **Maya (Phases 1-3):** Gemini 3 Pro High - Mobile UI work
- **Derek (Phase 4):** Gemini 3 Pro High - Admin UI work
- **Marcus (Schema + RLS):** Claude Opus 4.5 - Security-critical database work

---

## Execution Log

> Update this section as you work.

| Time | Agent | Action | Result |
|------|-------|--------|--------|
| | | | |
