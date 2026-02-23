-- Add required_by_date column to purchase_orders
-- Run this in Supabase SQL Editor

ALTER TABLE purchase_orders 
ADD COLUMN IF NOT EXISTS required_by_date TIMESTAMP WITH TIME ZONE;

SELECT 'Column required_by_date added!' as message;
