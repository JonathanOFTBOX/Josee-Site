---
name: Realtime Sync Pattern
description: ALWAYS follow this pattern when adding data fetching to ensure multi-device sync
---

# Realtime Sync Pattern

## ✅ CORRECT Pattern: useQuery + staleTime: 0

```typescript
import { useQuery, useQueryClient } from "@tanstack/react-query";

// 1. FETCH with useQuery (NOT useState!)
const { data: items = [], isLoading } = useQuery({
    queryKey: ["entityName"], // e.g. "clients", "jobs", "suppliers"
    queryFn: () => dataProvider.getEntities(),
    staleTime: 0, // CRITICAL: Always refetch when invalidated
});

// 2. MUTATIONS invalidate the query
const queryClient = useQueryClient();

const handleCreate = async (data) => {
    await dataProvider.createEntity(data);
    queryClient.invalidateQueries({ queryKey: ["entityName"] });
};

const handleUpdate = async (id, data) => {
    await dataProvider.updateEntity(id, data);
    queryClient.invalidateQueries({ queryKey: ["entityName"] });
};

const handleDelete = async (id) => {
    await dataProvider.deleteEntity(id);
    queryClient.invalidateQueries({ queryKey: ["entityName"] });
};
```

## ❌ WRONG Pattern: useState + useEffect

```typescript
// DON'T DO THIS - breaks realtime sync!
const [items, setItems] = useState([]);

const fetchData = async () => {
    const data = await dataProvider.getEntities();
    setItems(data); // useState ignores query invalidations!
};

useEffect(() => {
    fetchData();
}, []);

// This won't sync with other devices!
```

## 📋 Checklist for New Entities

1. [ ] Add table to `realtime-provider.tsx` → `TABLE_QUERY_KEYS`
2. [ ] Add query key to `queryClient.ts` → `CACHED_QUERY_KEYS` (for IndexedDB)
3. [ ] Use `useQuery` with `staleTime: 0` in component
4. [ ] Use `invalidateQueries` after all mutations

## 🔧 Files to Update

### realtime-provider.tsx
```typescript
const TABLE_QUERY_KEYS: Record<string, string[]> = {
    inventory: ["inventory"],
    clients: ["clients"],
    suppliers: ["suppliers"],
    workers: ["workers"],
    jobs: ["jobs"],
    job_allocations: ["allocations", "jobs"],
    // ADD YOUR NEW ENTITY HERE:
    new_entity: ["newEntity"],
};
```

### queryClient.ts
```typescript
const CACHED_QUERY_KEYS = [
    "inventory",
    "jobs",
    "clients",
    "suppliers",
    "workers",
    "allocations",
    "allPurchaseOrders",
    // ADD YOUR NEW ENTITY HERE:
    "newEntity",
];
```

## 🎯 Global Defaults (Already Configured)

```typescript
// queryClient.ts - applies to ALL queries
{
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
}
```

## 🔄 How Realtime Works

1. **Supabase Event**: Database change triggers `postgres_changes`
2. **RealtimeProvider**: Receives event, calls `invalidateQueries`
3. **React Query**: Marks query as stale, refetches from server
4. **Component**: Receives new data via `useQuery`, re-renders

## 📝 Example: Adding "Validations" Entity

```typescript
// 1. realtime-provider.tsx
job_validations: ["validations", "jobs"],

// 2. queryClient.ts
CACHED_QUERY_KEYS = [..., "validations"],

// 3. Component
const { data: validations = [] } = useQuery({
    queryKey: ["validations"],
    queryFn: () => dataProvider.getValidations(),
    staleTime: 0,
});
```
