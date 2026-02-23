# Purchase Order Date Fix

## Problem
When selecting a date for a purchase order (e.g., "Expected Date"), the system was saving the date at midnight (00:00:00). Due to timezone differences (e.g., EST being UTC-5), when this date was retrieved and displayed in a different timezone context or processed, it often appeared as the previous day (e.g., 2026-01-30 00:00:00 UTC -> 2026-01-29 19:00:00 EST).

## Solution
1. **Safe Date Parsing**: Implemented a `parseSafeDate` helper in `PurchaseOrdersList.tsx` that ensures string dates (YYYY-MM-DD) are interpreted as local dates by appending `T00:00:00`.
2. **Noon Time Setting**: When saving a new date from the calendar picker, we now explicitly set the time to 12:00:00 (Noon). This provides a 12-hour buffer against timezone shifts in either direction, ensuring the date remains correct regardless of whether the user is in UTC+12 or UTC-12 relative to the server.
3. **Internationalization**: Replaced hardcoded strings ("Date confirmée", "Modifier date") with proper `t('orders.*')` keys in both English and French.

## Changes

### `client/src/pages/boss/components/PurchaseOrdersList.tsx`
- Added `parseSafeDate` function.
- Updated `formatDate` to use safe parsing.
- Updated `onSelect` in Calendar to set hours to 12.
- Replaced hardcoded text with `t()` calls.

### `client/src/lib/translations/*.ts`
- Added new keys:
  - `orders.dateConfirmedBySupplier`
  - `orders.requestedDate`
  - `orders.confirmDate`
  - `orders.editDate`

### Versioning
- Bumped version to **1.0.10.202**.
