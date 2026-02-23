-- ============================================================================
-- IMPORT INVENTORY DATA FOR JONATHAN@OFTBOX.COM
-- ============================================================================
-- Generated from: basededonne.csv
-- Run this in Supabase SQL Editor AFTER running the reset script
-- ============================================================================

DO $$
DECLARE
    v_company_id UUID;
    v_supplier_lumen UUID;
    v_supplier_wolseley UUID;
    v_supplier_napa UUID;
    v_supplier_master UUID;
BEGIN
    -- Get company ID for jonathan@oftbox.com
    SELECT company_id INTO v_company_id 
    FROM profiles 
    WHERE email = 'jonathan@oftbox.com';
    
    IF v_company_id IS NULL THEN
        RAISE EXCEPTION 'User jonathan@oftbox.com not found!';
    END IF;
    
    RAISE NOTICE 'Importing to company: %', v_company_id;
    
    -- =========================================================================
    -- CREATE SUPPLIERS
    -- =========================================================================
    
    INSERT INTO suppliers (company_id, name, is_active) 
    VALUES (v_company_id, 'Lumen', true)
    RETURNING id INTO v_supplier_lumen;
    
    INSERT INTO suppliers (company_id, name, is_active) 
    VALUES (v_company_id, 'Wolseley', true)
    RETURNING id INTO v_supplier_wolseley;
    
    INSERT INTO suppliers (company_id, name, is_active) 
    VALUES (v_company_id, 'UAP / NAPA', true)
    RETURNING id INTO v_supplier_napa;
    
    INSERT INTO suppliers (company_id, name, is_active) 
    VALUES (v_company_id, 'Le Groupe Master', true)
    RETURNING id INTO v_supplier_master;
    
    RAISE NOTICE 'Created 4 suppliers';
    
    -- =========================================================================
    -- CREATE PRODUCTS (grouped by supplier for product_suppliers linking)
    -- =========================================================================
    
    -- -------------------------------------------------------------------------
    -- ÉLECTRICIEN - LUMEN (5 products)
    -- -------------------------------------------------------------------------
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Marrettes #33', 'Connecteur org/bleu (Pot de 500)', 'MAR-33-J', 45.00, 89.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_lumen, 'MAR-33-J', 45.00, 89.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Boîte Octogonale', '4po métal pour luminaire', 'IBER-54151', 2.10, 4.50, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_lumen, 'IBER-54151', 2.10, 4.50, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Cable NMD90 14/2', 'Rouleau 75m Blanc (Résidentiel)', 'NMD14-2-75', 98.00, 145.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_lumen, 'NMD14-2-75', 98.00, 145.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Prise Décora', '15A 125V Blanche (Boîte de 10)', 'LEV-5325-W', 18.50, 35.00, 0, 'box')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_lumen, 'LEV-5325-W', 18.50, 35.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Tape électrique', 'Scotch Super 33+ (Rouleau)', '3M-33-PLUS', 4.95, 8.50, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_lumen, '3M-33-PLUS', 4.95, 8.50, true FROM new_product;
    
    RAISE NOTICE 'Created 5 Lumen products';
    
    -- -------------------------------------------------------------------------
    -- PLOMBIER - WOLSELEY (5 products)
    -- -------------------------------------------------------------------------
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Coude PEX 1/2"', 'Laiton (Brass) Insert (Sac de 25)', 'PX-EL-050', 15.00, 32.00, 0, 'box')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_wolseley, 'PX-EL-050', 15.00, 32.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Colle ABS', 'Ciment Jaune 473ml', 'OATEY-3112', 8.50, 14.99, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_wolseley, 'OATEY-3112', 8.50, 14.99, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit, units_per_package)
        VALUES (v_company_id, 'Tuyau Cuivre L', '3/4" x 12 pieds', 'CU-L-075-12', 68.00, 95.00, 0, 'pcs', 12)
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_wolseley, 'CU-L-075-12', 68.00, 95.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Valve à bille', '1/2" Soudée (Ball Valve)', 'KITZ-58-12', 12.00, 22.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_wolseley, 'KITZ-58-12', 12.00, 22.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Anneau de cire', 'Pour toilette (Avec boulons)', 'WAX-RING-KIT', 2.50, 6.99, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_wolseley, 'WAX-RING-KIT', 2.50, 6.99, true FROM new_product;
    
    RAISE NOTICE 'Created 5 Wolseley products';
    
    -- -------------------------------------------------------------------------
    -- MÉCANICIEN - UAP / NAPA (5 products)
    -- -------------------------------------------------------------------------
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Filtre à l''huile', 'Gold Filter (Standard V8)', 'FIL-1069', 7.45, 14.95, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_napa, 'FIL-1069', 7.45, 14.95, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Huile 5W30', 'Synthétique (Bidon 5L)', 'OIL-5W30-SYN', 28.00, 55.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_napa, 'OIL-5W30-SYN', 28.00, 55.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Brake Cleaner', 'Nettoyant freins (Caisse de 12)', 'BRK-CLN-CS', 42.00, 72.00, 0, 'box')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_napa, 'BRK-CLN-CS', 42.00, 72.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Fusibles Mini', 'Kit assortiment (ATM)', 'FUS-ATM-KIT', 12.00, 24.99, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_napa, 'FUS-ATM-KIT', 12.00, 24.99, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Dégrippant', 'PB Blaster Pénétrant', 'PB-BLAST-16', 8.99, 16.50, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_napa, 'PB-BLAST-16', 8.99, 16.50, true FROM new_product;
    
    RAISE NOTICE 'Created 5 UAP/NAPA products';
    
    -- -------------------------------------------------------------------------
    -- FRIGORISTE - LE GROUPE MASTER (5 products)
    -- -------------------------------------------------------------------------
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Réfrigérant R410A', 'Bonbonne 25 lbs (Rose)', 'REF-R410A', 380.00, 650.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_master, 'REF-R410A', 380.00, 650.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Contacteur', '2 Pôles 30A 24V Coil', 'CON-2P-30A', 14.50, 38.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_master, 'CON-2P-30A', 14.50, 38.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Capaciteur', 'Run Cap 35/5 uF 370V', 'CAP-35-5-R', 12.00, 32.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_master, 'CAP-35-5-R', 12.00, 32.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Armaflex 7/8', 'Isolant tuyau 6 pieds x 1/2 épais', 'ARMA-78-12', 6.50, 12.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_master, 'ARMA-78-12', 6.50, 12.00, true FROM new_product;
    
    WITH new_product AS (
        INSERT INTO inventory_items (company_id, name, description, sku, unit_cost, retail_price, quantity, unit)
        VALUES (v_company_id, 'Thermostat', 'Honeywell Pro 3000 (Non-prog)', 'TH3110D', 45.00, 85.00, 0, 'pcs')
        RETURNING id
    )
    INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, retail_price, is_preferred)
    SELECT id, v_supplier_master, 'TH3110D', 45.00, 85.00, true FROM new_product;
    
    RAISE NOTICE 'Created 5 Le Groupe Master products';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'IMPORT COMPLETE!';
    RAISE NOTICE 'Created: 4 suppliers, 20 products';
    RAISE NOTICE '========================================';
    
END $$;

-- Verify the import
SELECT 
    (SELECT COUNT(*) FROM suppliers WHERE company_id = (SELECT company_id FROM profiles WHERE email = 'jonathan@oftbox.com')) as suppliers,
    (SELECT COUNT(*) FROM inventory_items WHERE company_id = (SELECT company_id FROM profiles WHERE email = 'jonathan@oftbox.com')) as products,
    (SELECT COUNT(*) FROM product_suppliers WHERE product_id IN (SELECT id FROM inventory_items WHERE company_id = (SELECT company_id FROM profiles WHERE email = 'jonathan@oftbox.com'))) as product_supplier_links;
