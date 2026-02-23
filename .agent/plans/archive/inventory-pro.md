# Inventory Pro (ERP-Grade) - Implementation Plan

> **Assigned To:** @Desktop-Dev (Derek) + @Enforcer (Marcus) for schema/security
> **Priority:** 🔴 Critical
> **Date:** 2026-01-01
> **Status:** Planned

---

## Feature Overview

Transform the basic inventory system into a professional ERP/CRM-compatible system that:
1. **Supports data migration** from other applications (CSV import)
2. **Uses industry-standard schema** for estimation/quoting
3. **Calculates labor costs** automatically
4. **Supports kits/assemblies** for grouped products

---

## Master Template Schema

Based on the user's professional model:

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | `id_interne` | Unique internal code (never changes) | REF-001 |
| B | `categorie` | Category for filtering by trade | Électricité / Câblage |
| C | `description_fr` | French description (for quotes) | Fil de cuivre #12 AWG |
| D | `description_en` | English description | Copper wire #12 AWG |
| E | `unite` | Unit of measure | ft / ea / m / box |
| F | `prix_coutant` | Net purchase cost | 1.45 |
| G | `marge_profit` | Profit margin (decimal) | 0.20 (for 20%) |
| H | `prix_vente` | Final client price | 1.74 |
| I | `temps_mo_unitaire` | Labor time per unit (hours) | 0.05 |
| J | `taux_horaire_mo` | Hourly labor rate | 75.00 |
| K | `fournisseur_principal` | Main supplier | Lumen / Guillevin |
| L | `code_manufacturier` | Manufacturer reference | NMD90-12-2 |
| M | `date_mise_a_jour` | Last update date | 2025-12-31 |
| N | `type_item` | Item type | S = Simple, A = Assembly |
| O | `quantity_in_stock` | Current stock level | 100 |
| P | `min_stock_level` | Reorder threshold | 10 |

---

## Phase 1: Database Schema Overhaul

### Migration SQL

```sql
-- Rename existing table for backup
ALTER TABLE inventory_items RENAME TO inventory_items_v1_backup;

-- Create new professional inventory table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    
    -- Identification
    id_interne TEXT NOT NULL, -- User's internal code (REF-001)
    categorie TEXT, -- Category for filtering
    description_fr TEXT NOT NULL, -- French description
    description_en TEXT, -- English description
    unite TEXT DEFAULT 'ea', -- Unit of measure
    
    -- Pricing
    prix_coutant DECIMAL(10,2) DEFAULT 0, -- Net purchase cost
    marge_profit DECIMAL(5,4) DEFAULT 0.20, -- Profit margin (0.20 = 20%)
    prix_vente DECIMAL(10,2) GENERATED ALWAYS AS (
        prix_coutant * (1 + marge_profit)
    ) STORED, -- Auto-calculated sale price
    
    -- Labor
    temps_mo_unitaire DECIMAL(6,4) DEFAULT 0, -- Labor time per unit (hours)
    taux_horaire_mo DECIMAL(10,2) DEFAULT 75.00, -- Hourly labor rate
    cout_mo_unitaire DECIMAL(10,2) GENERATED ALWAYS AS (
        temps_mo_unitaire * taux_horaire_mo
    ) STORED, -- Auto-calculated labor cost per unit
    
    -- Supply Chain
    fournisseur_principal TEXT, -- Main supplier
    code_manufacturier TEXT, -- Manufacturer part number
    
    -- Stock
    quantity_in_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    
    -- Item Type
    type_item TEXT DEFAULT 'S' CHECK (type_item IN ('S', 'A')), -- S=Simple, A=Assembly
    
    -- Metadata
    date_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    UNIQUE(company_id, id_interne)
);

-- Assembly Items (for kits)
CREATE TABLE inventory_assemblies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
    child_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    
    UNIQUE(parent_item_id, child_item_id)
);

-- Indexes
CREATE INDEX idx_inventory_company ON inventory_items(company_id);
CREATE INDEX idx_inventory_category ON inventory_items(categorie);
CREATE INDEX idx_inventory_type ON inventory_items(type_item);
CREATE INDEX idx_inventory_supplier ON inventory_items(fournisseur_principal);

-- RLS Policies
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_assemblies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company can manage own inventory" ON inventory_items
    FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Company can manage assemblies" ON inventory_assemblies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM inventory_items 
            WHERE id = parent_item_id AND company_id = get_user_company_id()
        )
    );
```

---

## Phase 2: CSV Import Engine

### Import Flow

```
1. User downloads template CSV
2. User fills data in Excel/Google Sheets
3. User uploads CSV file
4. System parses and validates
5. Preview screen shows data + errors
6. User confirms → Data inserted
```

### UI Component

```tsx
// client/src/components/inventory-import.tsx

export function InventoryImportWizard() {
    const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'done'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<ValidationError[]>([]);
    
    // Step 1: Upload
    const handleFileUpload = async (file: File) => {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = parseCSVLine(lines[0]);
        const data = lines.slice(1).map(line => parseCSVLine(line));
        
        setParsedData(data);
        setStep('map');
    };
    
    // Step 2: Map columns
    const requiredColumns = [
        'id_interne', 'description_fr', 'prix_coutant'
    ];
    
    const optionalColumns = [
        'categorie', 'description_en', 'unite', 'marge_profit',
        'temps_mo_unitaire', 'taux_horaire_mo', 'fournisseur_principal',
        'code_manufacturier', 'quantity_in_stock', 'min_stock_level', 'type_item'
    ];
    
    // Step 3: Validate
    const validateData = () => {
        const errors: ValidationError[] = [];
        
        parsedData.forEach((row, idx) => {
            // Check required fields
            if (!row[columnMapping.id_interne]) {
                errors.push({ row: idx + 2, field: 'id_interne', message: 'Required' });
            }
            
            // Validate numbers
            if (row[columnMapping.prix_coutant] && isNaN(parseFloat(row[columnMapping.prix_coutant]))) {
                errors.push({ row: idx + 2, field: 'prix_coutant', message: 'Must be a number (no $ symbol)' });
            }
            
            // Validate margin format (should be 0.20 not 20)
            const margin = parseFloat(row[columnMapping.marge_profit]);
            if (margin > 1) {
                errors.push({ row: idx + 2, field: 'marge_profit', message: 'Use decimal (0.20 not 20)' });
            }
        });
        
        setErrors(errors);
        return errors.length === 0;
    };
    
    return (
        <div className="space-y-6">
            {step === 'upload' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2>{t("inventory.import.title")}</h2>
                        <Button variant="outline" onClick={downloadTemplate}>
                            <Download className="w-4 h-4 mr-2" />
                            {t("inventory.import.downloadTemplate")}
                        </Button>
                    </div>
                    
                    <Dropzone
                        accept={{ 'text/csv': ['.csv'] }}
                        onDrop={files => handleFileUpload(files[0])}
                    >
                        {/* Drag and drop zone */}
                    </Dropzone>
                </div>
            )}
            
            {step === 'map' && (
                <ColumnMapper
                    csvHeaders={Object.keys(parsedData[0] || {})}
                    requiredColumns={requiredColumns}
                    optionalColumns={optionalColumns}
                    mapping={columnMapping}
                    onChange={setColumnMapping}
                    onNext={() => { validateData(); setStep('preview'); }}
                />
            )}
            
            {step === 'preview' && (
                <ImportPreview
                    data={parsedData}
                    mapping={columnMapping}
                    errors={errors}
                    onBack={() => setStep('map')}
                    onConfirm={handleImport}
                />
            )}
        </div>
    );
}
```

### Template Download

```typescript
// Generate empty CSV template
function downloadTemplate() {
    const headers = [
        'ID_Interne', 'Categorie', 'Description_Fr', 'Description_En',
        'Unite', 'Prix_Coutant', 'Marge_Profit', 'Temps_MO_Unitaire',
        'Taux_Horaire_MO', 'Fournisseur_Principal', 'Code_Manufacturier',
        'Quantity_In_Stock', 'Min_Stock_Level', 'Type_Item'
    ];
    
    const exampleRow = [
        'REF-001', 'Électricité', 'Fil de cuivre #12 AWG', 'Copper wire #12 AWG',
        'ft', '1.45', '0.20', '0.05', '75.00', 'Lumen', 'NMD90-12-2',
        '100', '10', 'S'
    ];
    
    const csv = [headers.join(';'), exampleRow.join(';')].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'fieldbox_inventory_template.csv');
}
```

---

## Phase 3: Data Migration Tool

### Onboarding Flow for New Companies

```tsx
// client/src/pages/boss/onboarding/import-inventory.tsx

function OnboardingImportPage() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {t("onboarding.importInventory.title")}
                    {/* "Importer votre inventaire existant" */}
                </CardTitle>
                <CardDescription>
                    {t("onboarding.importInventory.description")}
                    {/* "Migrez vos données depuis votre ancien système" */}
                </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
                {/* Step 1: Download Template */}
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div>
                        <h3 className="font-medium">{t("onboarding.step1.title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("onboarding.step1.desc")}</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={downloadTemplate}>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger le gabarit
                        </Button>
                    </div>
                </div>
                
                {/* Step 2: Fill in Excel */}
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div>
                        <h3 className="font-medium">Remplir dans Excel</h3>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                            <li>N'utilisez jamais le symbole $ dans les prix</li>
                            <li>Marge de profit en décimal (0.20 pour 20%)</li>
                            <li>Enregistrer en CSV (délimité par ;)</li>
                        </ul>
                    </div>
                </div>
                
                {/* Step 3: Upload */}
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div className="flex-1">
                        <h3 className="font-medium">Téléverser votre fichier</h3>
                        <InventoryImportWizard />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
```

---

## Phase 4: Kits/Assemblies

### Assembly Management UI

```tsx
// When type_item = 'A', show child items editor
function AssemblyEditor({ parentItemId }) {
    const { data: components } = useQuery({
        queryKey: ["assembly-components", parentItemId],
        queryFn: () => dataProvider.getAssemblyComponents(parentItemId),
    });
    
    const addComponentMutation = useMutation({
        mutationFn: (data: { childItemId: string; quantity: number }) =>
            dataProvider.addAssemblyComponent(parentItemId, data.childItemId, data.quantity),
    });
    
    return (
        <div className="space-y-4">
            <h3>{t("inventory.assembly.components")}</h3>
            
            {/* List of components */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {components?.map(comp => (
                        <TableRow key={comp.id}>
                            <TableCell>{comp.childItem.description_fr}</TableCell>
                            <TableCell>{comp.quantity}</TableCell>
                            <TableCell>${comp.childItem.prix_vente}</TableCell>
                            <TableCell>${(comp.quantity * comp.childItem.prix_vente).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* Total cost */}
            <div className="flex justify-end font-bold">
                Total Kit: ${components?.reduce((sum, c) => sum + c.quantity * c.childItem.prix_vente, 0).toFixed(2)}
            </div>
            
            {/* Add component button */}
            <Button onClick={() => setIsAddingComponent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Component
            </Button>
        </div>
    );
}
```

---

## Phase 5: Quote Integration

Use the new inventory data to generate professional quotes:

```typescript
// Calculate quote from job materials
function calculateQuote(jobMaterials: JobMaterial[]): QuoteData {
    let materialCost = 0;
    let laborHours = 0;
    let laborCost = 0;
    
    for (const material of jobMaterials) {
        // Material cost
        materialCost += material.item.prix_vente * material.quantity;
        
        // Labor calculation
        laborHours += material.item.temps_mo_unitaire * material.quantity;
        laborCost += material.item.cout_mo_unitaire * material.quantity;
    }
    
    return {
        materialCost,
        laborHours,
        laborCost,
        totalCost: materialCost + laborCost,
        profitMargin: materialCost * 0.20, // Average margin
    };
}
```

---

## i18n Keys

```typescript
inventory: {
    import: {
        title: { en: "Import Inventory", fr: "Importer l'inventaire" },
        downloadTemplate: { en: "Download Template", fr: "Télécharger le gabarit" },
        mapColumns: { en: "Map Columns", fr: "Mapper les colonnes" },
        preview: { en: "Preview", fr: "Aperçu" },
        confirm: { en: "Confirm Import", fr: "Confirmer l'importation" },
        success: { en: "Import successful!", fr: "Importation réussie!" },
        rowsImported: { en: "{n} rows imported", fr: "{n} lignes importées" },
    },
    columns: {
        id_interne: { en: "Internal ID", fr: "ID Interne" },
        categorie: { en: "Category", fr: "Catégorie" },
        description_fr: { en: "Description (FR)", fr: "Description (FR)" },
        prix_coutant: { en: "Cost Price", fr: "Prix Coûtant" },
        marge_profit: { en: "Profit Margin", fr: "Marge de Profit" },
        prix_vente: { en: "Sale Price", fr: "Prix de Vente" },
        temps_mo_unitaire: { en: "Labor Time/Unit", fr: "Temps MO/Unité" },
        taux_horaire_mo: { en: "Hourly Rate", fr: "Taux Horaire MO" },
        fournisseur: { en: "Supplier", fr: "Fournisseur" },
        code_mfr: { en: "Mfr. Code", fr: "Code Manufacturier" },
    },
    assembly: {
        components: { en: "Kit Components", fr: "Composants du kit" },
        totalCost: { en: "Total Kit Cost", fr: "Coût total du kit" },
    },
},
```

---

## Files to Modify/Create

| File | Action | Agent |
|------|--------|-------|
| `supabase/migrations/inventory_pro.sql` | NEW - Schema overhaul | Marcus |
| `client/src/components/inventory-import.tsx` | NEW - Import wizard | Derek |
| `client/src/components/column-mapper.tsx` | NEW - Column mapping UI | Derek |
| `client/src/components/import-preview.tsx` | NEW - Preview with errors | Derek |
| `client/src/components/assembly-editor.tsx` | NEW - Kit management | Derek |
| `client/src/pages/boss/inventory.tsx` | MODIFY - Use new schema | Derek |
| `client/src/pages/boss/onboarding/import.tsx` | NEW - Migration wizard | Derek |
| `client/src/api/SupabaseDataProvider.ts` | MODIFY - New inventory methods | Marcus |
| `client/src/lib/translations.ts` | MODIFY - Add i18n keys | Derek |

---

## Critical Rules (From User)

1. **No $ symbols in CSV** - Numbers only (145.50 not $145.50)
2. **Profit margin as decimal** - 0.20 for 20%, not 20
3. **Semicolon delimiter** - CSV should use ; not ,
4. **No empty rows** - Validate file has no blank lines at start
5. **Labor time separation** - Keep material cost and labor time separate

---

## Verification Plan

### Phase 1 (Schema)
- [ ] New table created with all columns
- [ ] Generated columns (prix_vente, cout_mo_unitaire) work correctly
- [ ] RLS policies in place

### Phase 2 (Import)
- [ ] Template downloads correctly
- [ ] CSV parsing handles semicolon delimiter
- [ ] Column mapping works
- [ ] Validation catches errors
- [ ] Preview shows data correctly
- [ ] Import inserts data

### Phase 3 (Migration)
- [ ] Onboarding wizard accessible
- [ ] Steps are clear
- [ ] Import works for new companies

### Phase 4 (Kits)
- [ ] Can create assembly items
- [ ] Can add components to assemblies
- [ ] Total cost calculated correctly

### Phase 5 (Quotes)
- [ ] Quote uses inventory pricing
- [ ] Labor hours calculated
- [ ] Total cost accurate

---

## Model Recommendation

- **Marcus (Phase 1):** Claude Opus 4.5 - Security-critical schema work
- **Derek (Phases 2-5):** Gemini 3 Pro High - UI-heavy import wizard work

---

## Execution Log

> Update this section as you work.

| Time | Agent | Action | Result |
|------|-------|--------|--------|
| | | | |
