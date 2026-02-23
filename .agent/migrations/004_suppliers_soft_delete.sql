-- Add is_active column to suppliers for soft delete
-- Run this in Supabase SQL Editor

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Set all existing suppliers as active
UPDATE suppliers SET is_active = true WHERE is_active IS NULL;

SELECT 'Soft delete column added!' as message;
