---
description: Pattern for handling large inventories (35k+ items) without UI freeze
---

# Heavy Inventory Pattern

When working with inventory lists that can have **35,000+ items**, ALWAYS use this pattern to prevent UI freeze.

## Core Principles

1. **NEVER load all items at once** - Use server-side pagination
2. **Use `useDeferredValue`** - Keep input snappy, search has lower priority
3. **Limit rendered items** - Max 50-100 items displayed at once
4. **Server-side search** - Use `searchInventoryPaginated` instead of `getInventory`

## Implementation Pattern

```tsx
import { useState, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";

function InventorySelector() {
    const [searchFilter, setSearchFilter] = useState("");
    
    // 1. Deferred value - input stays instant, search has low priority
    const deferredSearch = useDeferredValue(searchFilter);
    const isSearchPending = searchFilter !== deferredSearch;
    
    // 2. Server-side search with pagination
    const { data: result, isLoading } = useQuery({
        queryKey: ["inventorySearch", deferredSearch],
        queryFn: () => dataProvider.searchInventoryPaginated({ 
            query: deferredSearch, 
            limit: 50, 
            offset: 0 
        }),
        staleTime: 30000, // Cache 30s
    });
    
    const items = result?.items || [];
    const total = result?.total || 0;
    
    return (
        <>
            <Input 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Rechercher..."
            />
            {isSearchPending && <span className="animate-pulse">...</span>}
            
            <div className="text-xs text-muted-foreground">
                {items.length} / {total} résultats
            </div>
            
            {items.map(item => (
                <div key={item.id}>{item.name}</div>
            ))}
        </>
    );
}
```

## API Reference

### `searchInventoryPaginated(options)`
- `query`: Search string (searches name, sku)
- `limit`: Max items to return (50 recommended)
- `offset`: For pagination

Returns: `{ items: InventoryItem[], total: number }`

## When to Apply

Apply this pattern to:
- `JobMaterialsFields.tsx` - Materials selection in job creation
- `JobValidationModal.tsx` - Materials section
- Any inventory selector/picker component
- Any component using `getInventory()` with large datasets

## What NOT to Do

❌ `getInventory()` - Loads ALL items  
❌ Client-side filtering of full dataset  
❌ `inventory.filter(...).slice(...)` on 35k items  
❌ No limit on rendered items  
