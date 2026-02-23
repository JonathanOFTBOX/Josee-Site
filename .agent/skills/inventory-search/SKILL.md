---
name: Inventory Search Pattern
description: Standard pattern for searching inventory items - ensures consistent behavior across all search components
---

# Inventory Search Pattern

## Critical Rule: ALL Inventory Searches MUST Use the Shared Hook

Every component that searches inventory MUST use:
1. **Same cache**: `useSmartInventory()` or `queryClient.getQueryData(["inventory"])`
2. **Same search logic**: `useInventorySearch` hook or `searchInventory` function
3. **SKU-first scoring**: SKU exact > SKU starts-with > SKU contains > name > description
4. **Natural sort**: sizes like 1/4, 1/2, 3/4, 1, 2, 2 1/2 sort correctly

---

## Standard Search Implementation (React Hook)

```typescript
import { useSmartInventory } from "@/hooks/useSmartInventory";
import { useInventorySearch } from "@/hooks/useInventorySearch";

// In component:
const { data: allInventory = [] } = useSmartInventory();
const { results: inventory, totalCount } = useInventorySearch(allInventory, searchTerm);
```

## Standalone Search (for useEffect / callbacks)

```typescript
import { searchInventory } from "@/hooks/useInventorySearch";

// Read from cache
const cachedItems = queryClient.getQueryData<InventoryItem[]>(["inventory"]);
const results = searchInventory(cachedItems || [], searchQuery, 50);
```

---

## Scoring Algorithm

| Priority | Field | Match Type | Score |
|----------|-------|------------|-------|
| 1 | SKU | Exact | 100 |
| 2 | SKU | Starts-with | 80 |
| 3 | SKU | Contains | 60 |
| 4 | Name | Contains | 40 |
| 5 | Manufacturer Code | Contains | 30 |
| 6 | Description | Contains | 20 |

- **AND logic**: ALL search words must match (uses `.every()`)
- **Natural sort**: After score-based ranking, items with same score are sorted by SKU using fraction-aware comparison (1/4 = 0.25 < 1/2 = 0.5 < 3/4 = 0.75 < 1 < 2)

---

## Standard Dropdown Styling (SelectContent)

```tsx
<SelectContent
    className="max-h-[60vh] min-h-[300px] w-[min(95vw,600px)]"
    position="popper"
    sideOffset={5}
>
```

---

## Files Using This Pattern

| File | Method | Status |
|------|--------|--------|
| `ProductsTab.tsx` | `useInventorySearch` hook | ✅ |
| `JobMaterialsFields.tsx` | `useInventorySearch` hook | ✅ |
| `ManualUsageButton.tsx` | `searchInventory` function | ✅ |

---

## Key Points

1. **SKU-first**: SKU matches always rank above name/description matches
2. **AND logic**: `words.every()` - ALL search words must match
3. **Natural sort**: Electrician sizes sort correctly (1/4, 1/2, 3/4, 1, 2, 2 1/2)
4. **Shared cache**: Use `["inventory"]` queryKey - never create separate cache
5. **Single source**: `useInventorySearch.ts` is the ONLY file with search logic
