# Implementation Plan - Mobile Inventory Optimization

## Goal
Optimize the Inventory Management "Products" tab and associated modals for mobile devices, ensuring a vertical layout and adherence to the mobile-first "Dirty Hands" UI pattern. Extract the large "Products" tab logic into a separate component to reduce `inventory.tsx` size.

## User Review Required
> [!IMPORTANT]
> - The "Products" tab table will be replaced by a **Card List** on mobile devices.
> - `inventory.tsx` will be significantly refactored (extraction).

## Proposed Changes

### Mobile Optimization
#### [Modify] [ScannerModal.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/components/ScannerModal.tsx)
- Verify `DraggableDialogContent` usage.
- Ensure `max-w-[95vw]` is explicit if needed (it currently uses `sm:max-w-md`).

#### [Modify] [ProductUnitsModal.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/components/ProductUnitsModal.tsx)
- Add `max-w-[95vw] w-full` to `DraggableDialogContent` className to ensure it fills mobile width.
- Ensure buttons (especially delete) have adequate touch targets where possible, or keep as icon buttons but ensure spacing.

#### [Modify] [BufferZoneModal.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/components/BufferZoneModal.tsx)
- Remove `overflow-y-auto` from the outer `DraggableDialogContent`.
- Ensure inner `ScrollArea` or container handles the scrolling to prevent double scrollbars.
- Add `max-w-[95vw]` for mobile width.

### Refactoring & Responsive Design
#### [NEW] [ProductsTab.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/components/ProductsTab.tsx)
- **Extract** the entire "Products" tab logic from `inventory.tsx`.
- **State Migration**: Move all product-related state (search, modals, editing, mutations) to this new component.
- **Responsive Layout**:
    - **Desktop**: Retain the existing `Table` view.
    - **Mobile**: Implement a `Card` based view (`md:hidden`). Each product becomes a card showing:
        - Image (left)
        - Name & SKU (top right)
        - Quantity & Status (bottom right)
        - Actions (Manage Units) easily accessible.

#### [Modify] [inventory.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/inventory.tsx)
- Import `ProductsTab`.
- Remove extracted logic.
- Render `<ProductsTab />` inside the relevant `TabsContent`.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure type safety after extraction.

### Manual Verification
- **Mobile Viewport (375x812)**:
    - Open "Produits" tab. Verify it shows a vertical list of cards, not a squashed table.
    - Open "Scanner" modal. Verify full width and no scroll issues.
    - Open "Product Units" (QR icon). Verify full width and sticky header/footer.
    - Open "Buffer Zone" modal. Verify scrolling works correctly (single scroll).
- **Desktop Viewport (1280x800)**:
    - Verify Table view still exists and functions correctly.
    - Verify Modals are constrained to `sm:max-w-md` or similar.
