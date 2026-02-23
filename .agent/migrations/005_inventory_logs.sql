-- Migration: Add inventory_logs table for tracking all inventory activities
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID REFERENCES inventory_items(id),
    order_id UUID REFERENCES purchase_orders(id),
    action TEXT NOT NULL, -- 'receive', 'adjust', 'transfer', 'create', 'delete'
    quantity_change REAL,
    previous_quantity REAL,
    new_quantity REAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_inventory_logs_company ON inventory_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_user ON inventory_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created ON inventory_logs(created_at DESC);

-- Enable RLS
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can only see logs from their company
CREATE POLICY "Users can view company inventory logs" ON inventory_logs
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- RLS policy: users can insert logs for their company
CREATE POLICY "Users can insert company inventory logs" ON inventory_logs
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );
