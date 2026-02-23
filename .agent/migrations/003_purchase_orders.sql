-- ============================================
-- PURCHASE ORDERS - Create Tables
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create purchase_orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    order_number INTEGER,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'received')),
    notes TEXT,
    total_cost REAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- 2. Create purchase_order_items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES inventory_items(id),
    quantity_ordered REAL NOT NULL,
    quantity_received REAL DEFAULT 0,
    unit_cost REAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for purchase_orders
CREATE POLICY "Users can view their company purchase orders"
ON purchase_orders FOR SELECT
USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert purchase orders for their company"
ON purchase_orders FOR INSERT
WITH CHECK (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update their company purchase orders"
ON purchase_orders FOR UPDATE
USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can delete their company purchase orders"
ON purchase_orders FOR DELETE
USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

-- 5. Create RLS Policies for purchase_order_items
CREATE POLICY "Users can view purchase order items for their company"
ON purchase_order_items FOR SELECT
USING (
    order_id IN (
        SELECT id FROM purchase_orders 
        WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
    )
);

CREATE POLICY "Users can insert purchase order items for their company"
ON purchase_order_items FOR INSERT
WITH CHECK (
    order_id IN (
        SELECT id FROM purchase_orders 
        WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
    )
);

CREATE POLICY "Users can update purchase order items for their company"
ON purchase_order_items FOR UPDATE
USING (
    order_id IN (
        SELECT id FROM purchase_orders 
        WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
    )
);

CREATE POLICY "Users can delete purchase order items for their company"
ON purchase_order_items FOR DELETE
USING (
    order_id IN (
        SELECT id FROM purchase_orders 
        WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
    )
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchase_orders_company ON purchase_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order ON purchase_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_product ON purchase_order_items(product_id);

-- Done!
SELECT 'Purchase orders tables created successfully!' as message;
