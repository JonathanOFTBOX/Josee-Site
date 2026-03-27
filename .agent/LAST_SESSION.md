# Last Session Summary
**Date:** 2026-03-27 10:48
**Version:** 0.0.0

## [FEAT-MENU-001] Mise à jour complète du menu et des extras
- **UPDATE**: Modification et ajout de soins podologiques (110$, 100$, 90$) selon directives exactes avec durées (2h30-3h, 2h-2h30).
- **NEW**: Ajout "Soin des mains avec retrait de vernis gel" (30$, 1h-1h30) en manucure.
- **UX**: Suppression globale de l'extra "Correction".
- **UX**: Logique de filtrage implémentée : "Bain exfoliant" et "Sel marin" ne s'affichent plus si seule la catégorie Manucure est sélectionnée.

---

## [FEAT-PODO-001] Ajout Soin Podologique avec vernis gel
- **NEW**: Ajout de l'option "Soin podologique avec application de vernis gel" dans `src/pages/BookingPage.tsx` sous la catégorie "Soins podologiques".
- Utilisation de valeurs de prix (100$) et de durée (2h à 2h30) temporaires à confirmer par l'utilisateur.
- Pas de modification nécessaire dans `src/components/Services.tsx` car la description était déjà générique et incluait l'option vernis.

---

## Previous Session (2026-02-16)## v738 — Employee costRate for job profitability + fix server/storage.ts
- **NEW**: Added `cost_rate` field to employees — separates "cost to company" from payroll `hourly_rate`
  - DB: `costRate: real("cost_rate").default(0)` in shared/schema.ts
  - API: `SupabaseProfile.cost_rate`, `profileToUser()` mapping, `CreateEmployeePayload.costRate`
  - Providers: `UserProvider.createEmployee/updateEmployee`, `SessionProvider.getBossDashboard` SELECT
  - UI: Cost Rate input in Create/Edit employee dialogs (`AdminEmployeeDialogs.tsx`)
  - Logic: `JobValidationModal.tsx` prioritizes `costRate` over `hourlyRate` for labor cost calc
  - i18n: `admin.costRate` / `admin.costRateHint` in en.ts + fr.ts
  - State: `useAdminWorkers.ts` handles costRate in create/edit/update flows
  - Mock: All mock data updated with costRate across mockData.ts, MockUserProvider, auth/utils
- **BUGFIX**: Restored corrupted `server/storage.ts` — mock jobs/sessions had broken indentation and missing braces
- **BUGFIX**: Fixed pre-existing `startNum` type error in `getNextJobNumber()` — cast to `Number()`
- **⚠️ PENDING**: SQL migration needed: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cost_rate real DEFAULT 0;`

---

## v737 — Fix PDF column alignment
- **BUGFIX**: Long material names in PDF invoice were pushing QTÉ/HRS, TAUX, MONTANT numbers out of alignment
- Added `table-layout: fixed` to all 3 table definitions in `invoice-pdf.ts`
- Added `word-wrap: break-word` on description cells
- This forces columns to respect their declared widths (80px QTÉ, 100px TAUX, 100px MONTANT) regardless of description length
- File changed: `invoice-pdf.ts`

---

## v736 — Flag no-profit materials + collapse visits by default
- **NEW**: Materials with profit ≤ $0 now flagged in completed job Admin tab:
  - Red border + background (vs green for profitable materials)
  - ⚠️ AlertTriangle icon + red "$0" badge on material name row
  - Works on both mobile stacked view and desktop grid view
  - Tooltip on hover: "No profit on this material — selling at cost or at a loss"
- **UX**: Visits in Admin tab now **start collapsed by default** for cleaner view
  - Removed auto-expand-all logic (was populating `expandedVisits` with all session IDs)
  - Users click individual visits to expand details
- Added i18n keys `noProfitFlag` / `noProfitTooltip` to both `en.ts` and `fr.ts`
- Files changed: `JobHistoryModal.tsx`, `en.ts`, `fr.ts`

---

## v735 — Filter removed materials from all completed/billing views
- **BUGFIX**: Materials with `removed=true` were still showing in completed job views, PDF invoices, calendar modal, and worker detail
- Added `!removed` filter to 4 files (6 locations total):
  - `invoice-pdf.ts` (line 385) — PDF material list
  - `JobHistoryModal.tsx` (lines 298-299) — completed view + cost calculations
  - `job-detail-dialog.tsx` (2 places: left column line 271, right column line 510) — calendar modal
  - `WorkerDetailInline.tsx` (2 places: lines 169, 217) — worker calendar detail
- **NOT changed**: `JobValidationModal.tsx` — validation module left untouched (needs to show all materials for pickup approval flow)
- **Data analysis**: DB has 14 job_material rows for test job, only 7 have `quantity_used > 0` and `removed != true` — these are the ones that should appear everywhere for billing

---

## v734 — Auto-assign job_number on quote-to-job conversion + footer fix
- **BUGFIX**: Jobs converted from quotes were not getting sequential `job_number` assigned
- Added auto-assign logic in `JobProvider.ts` `updateJob()`: when `convertedFromQuote: true` and `jobType: "work"`, calls `getNextJobNumber()` and assigns result to `job_number`
- **BUGFIX**: PDF footer text was getting clipped at page bottom — added 8px bottom padding to section container style
- **Files changed**: `JobProvider.ts`, `invoice-pdf.ts`, version files

---


## v731 — Fix ALL page breaks: section-by-section rendering everywhere
- **BUGFIX**: Main invoice content (visits, materials) was being cut between pages just like photos were
- **Complete rewrite** of rendering procedure: now the ENTIRE invoice uses `addSectionToPdf()` — not just the appendix
- **Sections rendered individually**: header+clientInfo → table header → each visit (row + notes + materials) → summary → footer → timesheet → photos
- **Height-tracking**: each section checks remaining page space; if it won't fit, a new page starts
- **No content is ever cut between pages again** — visits, materials, summary, footer, photos all render as atomic blocks
- **Files changed**: `invoice-pdf.ts`, version files

---


## v730 — Fix PDF page breaks: photos never cut between pages
- **BUGFIX**: Photos were being cut in half at page boundaries because the appendix was rendered as one huge canvas then sliced at fixed 297mm intervals
- **New approach**: Section-by-section rendering — each photo pair (row of 2) is rendered as its own canvas
- **Height-tracking algorithm**: `addSectionToPdf()` tracks remaining space on current page; if a section won't fit, it starts a new page first
- **Sections rendered individually**: timesheet table → photos header → each photo row
- **Files changed**: `invoice-pdf.ts`, version files

---


## v729 — PDF layout polish: professional design
- **IMPROVEMENT**: Complete visual overhaul of PDF invoice layout
- **Accent color bar** at top (dark navy for invoices, orange for quotes)
- **Client info box** with rounded corners and gray `#f8f9fb` background
- **Summary box** with rounded corners, subtle border, and light background
- **Footer** with accent-colored top border, matching header design
- **Typography**: Segoe UI font stack, refined font weights (700/800), uppercase headers with letter-spacing
- **Bilingual filename**: PDF now saves as `Facture-xxx.pdf` or `Invoice-xxx.pdf` based on language
- **Tax numbers** consolidated to single line with bullet separators in header
- **Files changed**: `invoice-pdf.ts`, version files

---


## v728 — Bilingual PDF (FR/EN) — all strings use pdfLabels map
- **IMPROVEMENT**: PDF was hardcoded French-only. Added `pdfLabels` translation map (FR + EN) with 30+ label keys
- Added `language` field to `InvoiceData` interface (optional, defaults to `detectLanguage()` via `localStorage`)
- `detectLanguage()` reads `preferred_language` from localStorage, defaults to `'fr'`
- All hardcoded strings replaced with `l.xxx` references: header, client info, table headers, summary labels, footer, timesheet, photo captions
- `formatTerms()` now accepts `lang` parameter
- **Files changed**: `invoice-pdf.ts`, version files

---

## v727 — Fix price input: focus stays + reset works
- **BUGFIX**: v726 broke reset button by switching to onBlur. Proper fix: added `priceResetCounters` state
- **Key uses reset counter** (`mat.id-r${counter}`) — only changes when ↺ reset is clicked, NOT on typing
- `onChange` restored for live price updates
- Reset ↺ increments counter → forces input remount with correct `defaultValue`
- **Files changed**: `JobHistoryModal.tsx`

---

## v726 — Fix price input focus loss in materials
- **BUGFIX**: Price input in admin tab materials section lost focus after first keystroke
- **Root cause**: Dynamic `key` prop changed from `'default'` to `'custom'` when `setCustomPrices` was called in `onChange`, causing React to destroy/recreate the input
- **Fix**: Switched both mobile and desktop inputs to `onBlur` (saves when clicking away), removed dynamic `key`
- **Files changed**: `JobHistoryModal.tsx`

---

## v725 — PDF cleanup: no description, inline notes, compact layout
- **Removed** `job.description` from PDF — internal work order details (vendor IDs, phone numbers) must never appear on client invoices
- **Inline visit notes** — worker notes (📝) now appear inside each visit row, not as a separate section
- **Compact layout** — reduced margins to prevent unnecessary 2nd page
- **Files changed**: `invoice-pdf.ts`

---

## v724 — Per-visit PDF breakdown + language crash fix
- **BUGFIX**: Fixed `ReferenceError: language is not defined` in `job-detail-dialog.tsx` — crash when opening completed/archived jobs in calendar. `language` was used but never destructured from `useLanguage()`.
- **PDF**: Restructured invoice table to show per-visit rows (Visit #1, #2, etc.) with worker name, hours, rate, amount. Materials grouped per visit via `sessionId`.
- **Admin Tab**: Materials now shown inside each visit collapsible (per-visit material list)
- **Files changed**: `job-detail-dialog.tsx`, `invoice-pdf.ts`, `JobHistoryModal.tsx`

---

## v723 — Admin & Payment per-visit details + invoice options
- **Admin Tab**: Replaced flat session list with per-visit Collapsible components showing Visit #N badge, worker name, duration×rate, cost, date/time, and **editable notes** (reuses existing `editingNoteId` logic)
- **Invoice Options**: Added `showAdminNotes` and `showVisitNotes` toggle checkboxes to control PDF content
- **PDF**: Job description now shows `(X visites)` when multi-visit; admin notes and visit notes conditionally render based on invoice options
- **i18n**: Added `adminNotesOption` + `visitNotesOption` keys to both `en.ts` and `fr.ts`
- **Files changed**: `JobHistoryModal.tsx`, `invoice-pdf.ts`, `en.ts`, `fr.ts`

---

## v722 — Fix search dropdown click-outside
- **Problem:** In `CreateProductFromSupplierModal`, the suggestions dropdown stayed open when clicking outside
- **Fix:** Replaced fragile `setTimeout(200)` onBlur with robust `document.addEventListener("mousedown")` click-outside handler (same pattern as `MaterialSearchInput.tsx`). Added `suggestionsRef` + `nameInputRef` refs, guarded dropdown render with `showSuggestions` state.
- **File changed:** `client/src/pages/boss/components/CreateProductFromSupplierModal.tsx`

---

## ✅ Deployed This Session

### v1.0.10.719 - Fix product delete 409 + missing DialogDescription
- `InventoryProvider.ts` — Changed `deleteInventoryItem` from hard DELETE to soft-delete (`deleted_at = NOW()`). Fixes 409 FK conflict errors when product has references in `job_materials`, `inventory_units`. Also cleans up `product_suppliers` and `truck_inventory` links before soft-delete.
- `SupplierDetailModal.tsx` — Added missing `DialogDescription` to fix accessibility warning.

### v1.0.10.720 - Editable visit notes + visit notes on invoice PDF
- `SessionProvider.ts` — Added `updateSessionNotes()` method
- `SupabaseDataProvider.ts` + `DataProvider.ts` — Wired facade methods
- `JobHistoryModal.tsx` — Inline note editing: pencil icon reveals textarea with save/cancel, "+ Add note" button for empty notes
- `invoice-pdf.ts` — New "Visit Notes" section on invoice showing date, worker, and note text per visit
- `en.ts` + `fr.ts` — Added `jobHistory.editNote`, `addNote`, `noteSaved`, `visitNotes` keys

### v1.0.10.721 - Replace browser confirm() with in-app AlertDialog
- `EditProductFromSupplierModal.tsx` — Replaced `confirm()` with AlertDialog for permanent product delete. Added `DialogDescription` for accessibility. Fixed pre-existing TS error (`updateProductMutation` → `handleSave()`).
- `SupplierDetailModal.tsx` — Replaced `confirm()` with AlertDialog for swipe-to-remove product-supplier link.
- `en.ts` + `fr.ts` — Added `deleteConfirmTitle`, `deleteConfirmDesc`, `removeConfirmTitle` keys.

---

## ✅ Deployed This Session

### v1.0.10.714 - Add TPS/TVQ/RBQ fields to settings + invoice PDF
- `CompanySettings.tsx` — Added 3 input fields (TPS number, TVQ number, RBQ license) in Invoice Configuration section. Fields load from and save to `companies` table. Also shown in invoice preview card.
- `invoice-pdf.ts` — Extended `InvoiceData` interface. Tax numbers appear below company address in PDF header (11px gray) and in footer line.
- `JobHistoryModal.tsx` — Extended `.select()` query to fetch `tps_number`, `tvq_number`, `rbq_license`. Passes to `generateInvoicePDF()`.
- `SKILL.md` — Updated database schema reference with 3 new columns.
- ⚠️ **DB migration required:** `ALTER TABLE companies ADD COLUMN tps_number text NULL, ADD COLUMN tvq_number text NULL, ADD COLUMN rbq_license text NULL;`

### v1.0.10.713 - Replace browser prompt/confirm with in-app dialogs
- `ProductsTab.tsx` — Replaced 2x `prompt()` and 2x `confirm()` with proper `Dialog` and `AlertDialog` components. Added adjust quantity dialog with number input + save/cancel, and delete confirmation AlertDialog.

### v1.0.10.712 - Supplier products: show first 100 + Load More
- `SupplierDetailModal.tsx` — Products now display first 100 by default (no search required). Added "Load X more items" button. Replaced hardcoded French text with i18n keys. Added `supplierDetail.searchProducts` and `supplierDetail.noSearchResults` keys.

### v1.0.10.711 - Admin adjust quantity button
- `ProductsTab.tsx` — Added `adjustQuantityMutation` and "Ajuster Qté" button on both desktop and mobile. Admin can set any quantity via prompt (later replaced with dialog in v713). Added 5 new i18n keys.

### v1.0.10.710 - Load 100 more items button + admin delete always visible
- `ProductsTab.tsx` — Added `displayLimit` state (starts at 100, increments by 100). "Load X more items" button at bottom of both desktop table and mobile card list. Admin delete no longer restricted to qty=0. Added delete in desktop expanded row. Fixed hardcoded French in product count indicator.

---

## Previous Sessions

**Date:** 2026-02-13 08:50
**Version:** 1.0.10.701

---

## ✅ Deployed This Session

### v1.0.10.701 - Fix inventory list re-sort/refresh bug
**Root Cause:** Race condition — `usePrefetch` and `useSmartInventory` both wrote to `["inventory"]` cache key with different ORDER BY (name vs created_at DESC), causing the list to visibly re-sort 5-10s after page load and resetting search/scroll.

**Files Modified:**
- `hooks/usePrefetch.ts` — Removed boss inventory prefetch (redundant with useSmartInventory's IDB hydration)
- `api/providers/supabase/InventoryProvider.ts` — Changed `bulkFetchPage` sort from `.order("created_at", desc)` to `.order("name").order("id")` to align with `getInventory()`. Added `.order("id")` tie-breaker to both functions for stable pagination.
- `hooks/useSmartInventory.ts` — Changed `refetchOnMount: "always"` → `true` (respects staleTime). Added `{ updatedAt: 0 }` to IDB hydration so cache is marked stale for proper stale-while-revalidate.

---


## 🐛 STILL BROKEN — Supplier Display in ProductsTab

**Problem:** Products in the inventory list show "Aucun fournisseur lié" even though 35,132 product-supplier links exist and load successfully (`[SupplierProvider] ⚡ Loaded 35132 product-supplier links`).

**What we know:**
- The `getAllProductSuppliers()` query WORKS — it returns 35,132 rows
- Parallel batch fetching (10 pages at a time) is implemented and fast
- Data arrives in `ProductsTab.tsx` via `useQuery(["allProductSuppliers"])`
- The `useMemo` groups by `productId` into `suppliersByProduct`
- **UI still shows "Aucun fournisseur lié"** — the data may not be reaching the component correctly

**Where to investigate next:**
1. Check if the `suppliersByProduct` memo is producing the correct grouping
2. Check if `item.id` in the product list matches `productId` from product_suppliers
3. Possible that the bulk query returns data AFTER the component renders, and React Query doesn't trigger a re-render
4. Check the `mapProductSupplier` function — it may not map `product_id → productId` correctly with the lean select
5. Debug with console.log in `ProductSuppliersDisplay` to see what `productSuppliers` prop receives

**Related files:**
- `client/src/api/providers/supabase/SupplierProvider.ts` — `getAllProductSuppliers()` with parallel fetching
- `client/src/pages/boss/components/ProductsTab.tsx` — `ProductSuppliersDisplay` component + `suppliersByProduct` memo
- `client/src/api/SupabaseDataProvider.ts` — delegates to SupplierProvider
- `client/src/api/DataProvider.ts` — facade routing

## ✅ Deployed This Session

### v1.0.10.695 - Parallel batch fetching for suppliers + locations
- `SupplierProvider.ts` — `getAllProductSuppliers()` now fires 10 pages simultaneously (was sequential). Removed ORDER BY. ~35s → ~3-5s.
- `InventoryUnitsProvider.ts` — `getAllLocationBreakdowns()` same parallel pattern.

### v1.0.10.694 - Remove expensive JOIN from supplier query
- `SupplierProvider.ts` — Removed `inventory_items!inner(company_id)` JOIN that caused statement timeout (57014). Now lean `select` with only needed columns. Company isolation via client-side filtering.

### v1.0.10.693 - Paginate supplier + location bulk queries
- `SupplierProvider.ts` — Added pagination (1000/page while loop) to `getAllProductSuppliers()`.
- `InventoryUnitsProvider.ts` — Added pagination to `getAllLocationBreakdowns()`.

### v1.0.10.692 - Bulk location breakdowns + bulk suppliers in ProductsTab
- `InventoryUnitsProvider.ts` — NEW `getAllLocationBreakdowns()` fetches ALL product locations in 2-3 queries (was N+1 per product).
- `ProductsTab.tsx` — `ProductLocationBreakdown` now receives bulk data as props. `ProductSuppliersDisplay` also converted to bulk data props. Added `useQuery(["allLocationBreakdowns"])` and `useQuery(["allProductSuppliers"])` with `useMemo` grouping.
- `realtime-provider.tsx` — Added `allLocationBreakdowns` to `inventory_units` and `truck_inventory` mappings. Added `allProductSuppliers` to `product_suppliers` mapping.
- `useSmartInventory.ts` — Added IDB cache corruption guard (never overwrite with empty array).

### v1.0.10.691 - IDB cache corruption guard
- `useSmartInventory.ts` — Added safety guard to prevent writing `[]` to IDB cache when Supabase returns transient 500 errors.
### v1.0.10.688 - Fix material usage deduction: truck→warehouse fallback
**Files Modified:**
- `api/providers/supabase/InventoryProvider.ts` - `recordMaterialUsage()` now does smart deduction: if truck has partial stock, deducts what's available from truck then remainder from warehouse. If item not in truck at all (or qty=0), deducts full amount from warehouse. Warehouse allows negative quantities. Improved `inventory_history` log notes to distinguish "from truck", "from warehouse", or "split between both".
### v1.0.10.686 - Fix cross-device realtime sync + speed optimization
**Files Modified:**
- `components/realtime-provider.tsx` - **ROOT CAUSE:** Single Supabase channel had 16 tables, exceeding per-channel filter limit. Tables after #10 (including `truck_inventory`) were silently dropped. **FIX:** Split into 2 channels of 8 tables each. All tables now receive realtime events.
- `pages/boss/components/AddTruckStockModal.tsx` - Rewrote `handleManualConfirm` with `Promise.all` for parallel processing. Was sequential `for` loop = 4 DB calls per item × N items. Now all items process in parallel. Cart clears immediately for snappy UX.
- `pages/worker/truck.tsx` - Set `staleTime: 0` on truck inventory/picklist queries. Removed 80 lines of redundant local realtime subscriptions (global provider now handles).

### v1.0.10.685 - Truck inventory realtime sync across devices
**Files Modified:**
- `components/realtime-provider.tsx` - Added `workerTruckInventory` and `workerTruckPickList` to `truck_inventory` and `inventory_units` table mappings in `TABLE_QUERY_KEYS`. Without this, changes from AddTruckStockModal didn't trigger refetches on other devices.
- `pages/worker/truck.tsx` - Set `staleTime: 0` on both truck inventory and pick list queries (was 5min/2min). Removed 80-line redundant local realtime subscription block (global RealtimeProvider now handles it).
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.685

### v1.0.10.684 - Fix AddTruckStockModal visibility on mobile
**Files Modified:**
- `pages/boss/components/AddTruckStockModal.tsx` - Replaced `DraggableDialogContent` with standard `DialogContent`. Applied modal-patterns skill layout: `h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden p-0`. Removed broken `!top-[5%]` hack that conflicted with DraggableDialogContent's `translate(-50%,-50%)` inline style.
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.684

### v1.0.10.683 - Modal top-aligned on mobile + QR setting dev-only
**Files Modified:**
- `pages/boss/components/AddTruckStockModal.tsx` - Modal now uses `!top-[5%]` on mobile to sit at top of screen (keyboard doesn't cover content). Centered on desktop with `sm:!top-[50%]`. Default input mode changed from "gun" to "manual". Mode toggle buttons (Camera/Pistolet/Manuel) hidden when in manual mode.
- `pages/boss/admin/CompanySettings.tsx` - QR tracking setting now only visible to `jonathan@oftbox.com` (isDev gate). Added `useAuth` import.
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.683

### v1.0.10.681 - Fix manual mode mutation to use truck_inventory upsert
**Files Modified:**
- `pages/boss/components/AddTruckStockModal.tsx` - Fixed mutation: now uses `truck_inventory` upsert (same as worker pickup flow) so items always persist, plus also moves `inventory_units` if they exist. Previously only looked for `inventory_units` which most products don't have.
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.681

### v1.0.10.680 - Redesign manual mode in AddTruckStockModal
**Files Modified:**
- `pages/boss/components/AddTruckStockModal.tsx` - Rewrote manual mode to search-first flow: search bar → instant results from useSmartInventory cache → cart with qty +/- → confirm button. Camera/Pistolet modes untouched.
- `lib/translations/en.ts` - Added truckStock.cart, truckStock.searchToAdd, truckStock.items keys
- `lib/translations/fr.ts` - Added matching French keys
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.680
**Files Modified:**
- `api/providers/supabase/TruckProvider.ts` - Rewrote `getPickListForTruck`: reduced from 7+ sequential queries to 5 batched queries using `Promise.all`. Removed debug ALL-materials query running in production. Batched warehouse location lookups into single query (was N+1 per material). Removed all console.log noise.
- `pages/worker/truck.tsx` - Removed `refetchOnMount: 'always'` from all 3 queries (was defeating staleTime caching). Added IDB persistence (`idb-keyval`) for truck inventory + pick list data for instant load on reconnect. Made pick list query independent of truckData to break waterfall. Adjusted staleTime: inventory 5min, picklist 2min.
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.678
**Files Modified:**
- `pages/boss/calendar/components/WorkerDetailInline.tsx` - Added `useQuery` to fetch session photos via `getSessionPhotos()`, wired `progressPhotos` from fetched data (was hardcoded `[]` with TODO), added photo grid + notes rendering in visit cards with FileImage/MessageSquare icons
- `components/modals/job-validation/JobValidationModal.tsx` - Fixed hardcoded English text ("Worker Notes", "No photos", "No notes") to use i18n keys
- `lib/translations/en.ts` - Added `workerDetail.jobPhotos`
- `lib/translations/fr.ts` - Added `workerDetail.jobPhotos`
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.677

### v1.0.10.676 - Group materials by visit in validation + remove auto-approval for pickup
**Files Modified:**
- `components/modals/job-validation/JobValidationModal.tsx` - Refactored Materials tab to group materials by visit (session) with worker name + date headers. Each visit shows used (green) and shortage/pending (orange) sub-sections. Added approval badges per material.
- `api/providers/supabase/InventoryProvider.ts` - Removed auto-approval of `approved_for_pickup` for ALL materials (online + offline paths). Materials now always require explicit admin approval.
- `api/providers/supabase/JobProvider.ts` - Removed auto-approval in both `createJob` and `updateJob` material insert paths.
- `lib/translations/en.ts` - Added `validation.adminPlanned`, `validation.noResults`
- `lib/translations/fr.ts` - Added matching French keys
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.676

### v1.0.10.675 - Filter used materials from worker session
**Files Modified:**
- `pages/worker/active-session/components/SessionProgressPanel.tsx` - Hide materials already fully used in previous sessions from the general "Matériaux utilisés" section

---

## Previous Sessions


## ✅ Deployed This Session

### v1.0.10.664 - QuoteDetailModal: Add/Delete Materials + Retail Price Fix + Pencil Edit UX
**Files Modified:**
- `components/modals/QuoteDetailModal.tsx` - Added `MaterialSearchInput` for adding materials, Trash2 delete buttons, `Pencil` icon on editable prices (dashed border), switched all pricing from `costPrice` to `retailPrice` for client-facing quotes
- `lib/invoice-pdf.ts` - Updated comment on quote pricing to clarify retail vs cost approach
- `lib/translations/en.ts` - Added `quoteDetail.addMaterial`, `materialAdded`, `materialDeleted`
- `lib/translations/fr.ts` - Added matching French keys
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.664

### v1.0.10.663 - QuoteDetailModal: Dedicated View with Editable Prices
**Files Created:**
- `components/modals/QuoteDetailModal.tsx` - New modal showing all quote info, materials table, and convert-to-job button

**Files Modified:**
- `api/providers/supabase/InventoryProvider.ts` - Extended `updateJobMaterial` to support `costAtTime`
- `api/SupabaseDataProvider.ts`, `api/DataProvider.ts` - Matching API updates
- `pages/boss/quotes/index.tsx` - "Voir" button opens `QuoteDetailModal`
- `lib/translations/en.ts`, `lib/translations/fr.ts` - Added 12 `quoteDetail.*` keys

---

## Previous Sessions

### v1.0.10.662 - Quote "Voir" Button Opens Edit Modal
**Files Modified:**
- `pages/boss/quotes/index.tsx` - "Voir" button now opens `JobFormModal` (edit mode) for pending quotes, allowing users to add materials/parts before converting. Converted quotes still show read-only view. Removed redundant "Modifier" button.
- `lib/translations/en.ts` - Added `quotes.viewAndEdit`: "View / Edit"
- `lib/translations/fr.ts` - Added `quotes.viewAndEdit`: "Voir / Modifier"
- `version-check.ts`, `sw.js`, `package.json` - Version bump to 1.0.10.662

### v1.0.10.661 - Quote Badge Label + Search by # and Description
**Files Modified:**
- `pages/boss/quotes/index.tsx` - Badge now shows "Soumission #" / "Quote #" label prefix; search expanded to filter by `quoteNumber` and `description`
- `lib/translations/en.ts` - Added `quotes.quoteNumberLabel`, updated `quotes.searchPlaceholder`
- `lib/translations/fr.ts` - Added `quotes.quoteNumberLabel`, updated `quotes.searchPlaceholder`
- `.agent/skills/database-schema/SKILL.md` - Added missing `quote_number` and `converted_from_quote` columns to jobs table
- `GEMINI.md` (project root) - Created project-level rules file

---

## 🔴 CRITICAL — HARDCODED RULES PATCH (TEST REQUIRED)

### What was done:
We patched the Antigravity IDE core file to hardcode the "Global Architect Rules" directly into the agent's code. This was done to enforce rules on EVERY turn, not just at conversation start.

### Patch details:
- **File patched:** `C:\Users\jogor\AppData\Local\Programs\Antigravity\resources\app\out\jetskiAgent\main.js`
- **Backup:** `C:\Users\jogor\AppData\Local\Programs\Antigravity\resources\app\out\jetskiAgent\main.js.bak`
- **Re-patch script:** `C:\Users\jogor\Desktop\patch-antigravity.ps1`
- **Injection point:** `instructions=""` in class `U0a` (MCP Server State)
- **Injected content:** HARDCODED RULES including Data Path Verification, i18n rules, version control rules
- **Done by:** OpenClaw agent (the other AI agent)

### HOW TO TEST IF THE PATCH WORKS:
The user will send this exact prompt in a new conversation:
> "Add a new field called `priority_level` to jobs so we can mark jobs as low/medium/high priority. Show it on the job card."

**If the patch works**, the agent (me) should:
1. ✅ Read LAST_SESSION.md FIRST
2. ✅ Read .agent/workflows/before-starting.md
3. ✅ Check .agent/skills/database-schema/SKILL.md to verify if `priority_level` column exists
4. ✅ Do the full 6-step Data Path Verification BEFORE writing any code
5. ✅ NEVER hardcode text — use t('key')
6. ✅ Plan all 6 steps explicitly before touching any file

**If the patch DOES NOT work**, the agent will:
- ❌ Jump straight to coding without checking the database schema
- ❌ Skip the Data Path Verification
- ❌ This means the GEMINI.md approach is still the only enforcement (which also works, but loads at conversation start only)

### Recovery if IDE breaks:
1. Close Antigravity
2. Go to `C:\Users\jogor\AppData\Local\Programs\Antigravity\resources\app\out\jetskiAgent\`
3. Delete `main.js`
4. Rename `main.js.bak` → `main.js`
5. Reopen Antigravity

---

## ⚠️ PRIORITY FOR NEXT SESSION

1. **Verify quote edit + convert flow** — Open a quote with "Voir / Modifier", add parts, then convert to travail
2. **Test that converted quotes show read-only** — Already converted quotes should show "Voir" with read-only dialog

---

## 📁 Rules Enforcement Setup (3 layers)

| Layer | Location | Scope |
|-------|----------|-------|
| 1. Core patch (hardcoded) | `jetskiAgent/main.js` | Every API call |
| 2. Global GEMINI.md | `~/.gemini/GEMINI.md` | Every conversation start |
| 3. Project GEMINI.md | `Asset-Manager/GEMINI.md` | Every conversation in this project |
