# Reception Log EPIC - Multi-Reception Tracking

## Problem Statement
Currently, when receiving partial quantities of the same item across multiple days, the system only stores the **last reception date**. For example:
- Jan 7: Received 5/10 of Tuyeau 1/4
- Jan 8: Received 5/10 of Tuyeau 1/4 → **Overwrites** Jan 7 date

**Expected Behavior:** The timeline should show both reception events with exact quantities received on each day.

---

## Solution: `reception_log` Table

### Phase 1: Database Schema

#### New Table: `reception_log`
```sql
CREATE TABLE reception_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_item_id UUID NOT NULL REFERENCES purchase_order_items(id) ON DELETE CASCADE,
    quantity_received INTEGER NOT NULL CHECK (quantity_received > 0),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    receiver_id UUID REFERENCES users(id),
    receiver_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reception_log_item_id ON reception_log(purchase_order_item_id);
CREATE INDEX idx_reception_log_received_at ON reception_log(received_at);

-- RLS Policies
ALTER TABLE reception_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reception logs for their client"
    ON reception_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM purchase_order_items poi
            JOIN purchase_orders po ON poi.purchase_order_id = po.id
            WHERE poi.id = reception_log.purchase_order_item_id
            AND po.client_id = auth.jwt() ->> 'client_id'
        )
    );

CREATE POLICY "Users can insert reception logs"
    ON reception_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM purchase_order_items poi
            JOIN purchase_orders po ON poi.purchase_order_id = po.id
            WHERE poi.id = reception_log.purchase_order_item_id
            AND po.client_id = auth.jwt() ->> 'client_id'
        )
    );
```

#### Migration File
**Path:** `supabase/migrations/YYYYMMDD_add_reception_log.sql`

---

### Phase 2: Schema & Types

#### Update `shared/schema.ts`
```typescript
// Add new table definition
export const receptionLog = pgTable("reception_log", {
    id: uuid("id").primaryKey().defaultRandom(),
    purchaseOrderItemId: uuid("purchase_order_item_id").notNull().references(() => purchaseOrderItems.id, { onDelete: "cascade" }),
    quantityReceived: integer("quantity_received").notNull(),
    receivedAt: timestamp("received_at").notNull().defaultNow(),
    receiverId: uuid("receiver_id").references(() => users.id),
    receiverName: text("receiver_name"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ReceptionLog = typeof receptionLog.$inferSelect;
export type InsertReceptionLog = typeof receptionLog.$inferInsert;
```

---

### Phase 3: Backend Provider

#### New Provider: `ReceptionLogProvider.ts`
**Path:** `client/src/api/providers/supabase/ReceptionLogProvider.ts`

```typescript
interface ReceptionLogProvider {
    // Get all reception logs for an order item
    getReceptionLogs(purchaseOrderItemId: string): Promise<ReceptionLog[]>;
    
    // Get all reception logs for an entire order
    getReceptionLogsForOrder(purchaseOrderId: string): Promise<ReceptionLog[]>;
    
    // Add a new reception log entry
    createReceptionLog(log: InsertReceptionLog): Promise<ReceptionLog>;
}
```

#### Update `PurchaseOrderProvider.ts`
- Modify `receivePurchaseOrderItems()` to:
  1. Create a `reception_log` entry for each item received
  2. Update `purchase_order_items.quantity_received` (cumulative)
  3. Keep `received_at` as the **last** reception date (for backwards compatibility)

---

### Phase 4: API Integration

#### Update `DataProviderFacade.ts`
- Add `receptionLogProvider` 
- Expose `getReceptionLogs()` and `createReceptionLog()`

#### Update `SupabaseDataProvider.ts`
- Integrate new ReceptionLogProvider

---

### Phase 5: UI Updates

#### Update `OrderDetailModal.tsx`
**Current:** Groups items by `item.receivedAt`
**New:** Fetches `reception_log` entries and groups by actual reception dates

```typescript
// Fetch reception logs for this order
const { data: receptionLogs } = useQuery({
    queryKey: ["receptionLogs", order.id],
    queryFn: () => dataProvider.getReceptionLogsForOrder(order.id),
});

// Group by date for timeline
const receptionsByDate = new Map<string, ReceptionLog[]>();
receptionLogs.forEach(log => {
    const dateKey = formatLocalDate(log.receivedAt);
    if (!receptionsByDate.has(dateKey)) {
        receptionsByDate.set(dateKey, []);
    }
    receptionsByDate.get(dateKey)!.push(log);
});
```

#### Update `PurchaseOrdersList.tsx`
- Same changes as OrderDetailModal
- Timeline shows each reception log entry with:
  - Product name
  - Quantity received **on that date** (not cumulative)
  - Receiver name
  - Notes for that specific reception

#### Update `ReceiveItemsModal.tsx` (or equivalent)
- When saving, calls `createReceptionLog()` for each item
- Notes are attached to the specific reception event

---

### Phase 6: Translation Keys

Add to `en.ts` and `fr.ts`:
```typescript
'orders.receivedQuantity': 'Received {qty}',
'orders.totalReceived': 'Total received: {current}/{total}',
```

---

## Testing Checklist

- [ ] Create new order with 2 items
- [ ] Receive partial quantity of item 1 on Day 1
- [ ] Receive more of item 1 on Day 2
- [ ] Verify timeline shows:
  - Day 1: Item 1 - 5 received
  - Day 2: Item 1 - 5 received
- [ ] Verify total shows 10/10 correctly
- [ ] Verify notes are attached to correct dates

---

## Files to Modify/Create

### New Files
| File | Description |
|------|-------------|
| `supabase/migrations/YYYYMMDD_add_reception_log.sql` | Database migration |
| `client/src/api/providers/supabase/ReceptionLogProvider.ts` | New provider |

### Modified Files
| File | Changes |
|------|---------|
| `shared/schema.ts` | Add `receptionLog` table definition |
| `client/src/api/DataProvider.ts` | Add reception log methods |
| `client/src/api/providers/supabase/SupabaseDataProvider.ts` | Integrate provider |
| `client/src/api/providers/supabase/PurchaseOrderProvider.ts` | Update receive logic |
| `client/src/pages/boss/components/OrderDetailModal.tsx` | Use reception logs for timeline |
| `client/src/pages/boss/components/PurchaseOrdersList.tsx` | Use reception logs for timeline |
| `client/src/lib/translations/en.ts` | New translation keys |
| `client/src/lib/translations/fr.ts` | New translation keys |

---

## Estimated Effort
- **Database & Schema:** 30 min
- **Provider & API:** 45 min
- **UI Updates:** 1 hour
- **Testing & Fixes:** 45 min
- **Total:** ~3 hours
