---
name: Gemini Collaboration Protocol
description: How to prepare detailed summaries for asking Gemini for help when debugging complex issues
---

# Gemini Collaboration Protocol

When facing a complex bug or implementation challenge, prepare a detailed summary for Gemini to help debug.

## When to Use This Skill
- Build errors that are hard to diagnose
- Performance issues (like double-fetch, slow loading)
- Architecture decisions (caching strategies, state management)
- When the fix you tried didn't work

---

## Summary Template

### 1. Context Block
```markdown
## 📋 Context
- **App**: [Name] (React + [tech stack])
- **Version**: [current version]
- **Problem**: [One-line description]
```

### 2. What Was Observed
Include console logs, error messages, timing info:
```markdown
## 🔍 Console Logs
```
[Paste relevant logs here]
```

**Key observations:**
- [Observation 1]
- [Observation 2]
```

### 3. What Was Tried (Code Snippets)
```markdown
## 🛠️ What Was Implemented

**File: `path/to/file.ts`**
```typescript
// Relevant code snippet (10-20 lines max)
export function myFunction() {
    // ...
}
```

**Expected behavior:** [What should happen]
**Actual behavior:** [What actually happens]
```

### 4. Key Files List
```markdown
## 📁 Key Files
| File | Purpose |
|------|---------|
| `src/hooks/useMyHook.ts` | The hook that loads data |
| `src/lib/queryClient.ts` | React Query configuration |
| `src/App.tsx` | Provider wrapping |
```

### 5. Hypotheses
```markdown
## 🤔 Hypotheses
1. **Hypothesis A**: [Theory about what's wrong]
2. **Hypothesis B**: [Alternative theory]
```

### 6. Questions for Gemini
```markdown
## ❓ Questions
1. [Specific question 1]?
2. [Specific question 2]?
3. What's the recommended approach for [X]?
```

---

## Example Summary (Inventory Double-Fetch Bug)

```markdown
## 📋 Context
- **App**: Asset Manager (React + Vite + Supabase)
- **Version**: 1.0.10.531
- **Problem**: Inventory takes 5-10s to load instead of instant (35k items)

## 🔍 Console Logs
```
[Inventory] ⚡ Loaded 35132 products in 5.42s (single request)
[Inventory] ⚡ Loaded 35132 products in 10.28s (single request)
```

**Observations:**
- Two network requests happening (double-fetch)
- Log comes from `InventoryProvider.ts:83`, not from `useSmartInventory`
- IndexedDB cache seems to not be used

## 🛠️ What Was Implemented

**File: `useSmartInventory.ts`**
```typescript
queryFn: async () => {
    const cachedItems = await get(CACHE_KEY) || [];
    if (cachedItems.length === 0) {
        const allItems = await fetchPaginated();
        await set(CACHE_KEY, allItems);
        return allItems;
    }
    return cachedItems;
}
```

**Expected:** Instant load from IndexedDB on app restart
**Actual:** Always fetches from network (5-10s delay)

## 📁 Key Files
| File | Purpose |
|------|---------|
| `useSmartInventory.ts` | Hook with manual IDB get/set |
| `InventoryProvider.ts` | Supabase data fetching |
| `queryClient.ts` | React Query config |

## 🤔 Hypotheses
1. **Race Condition**: React Strict Mode mounts twice, both find empty cache
2. **IDB Write Failure**: set() might be failing silently
3. **Provider Conflict**: Old provider auto-fetching alongside new hook

## ❓ Questions
1. Why are `[SmartInventory]` logs not appearing in console?
2. How to avoid double-fetch with React Strict Mode?
3. Should we use `PersistQueryClient` instead of manual IDB handling?
```

---

## After Getting Gemini's Response

1. **Document the solution** in LAST_SESSION.md
2. **Implement the fix** following Gemini's guidance
3. **Verify the build** passes
4. **Test the functionality** 
5. **Update version** and commit

---

## Key Points

- **Be specific**: Include file paths, line numbers, exact error messages
- **Show code**: Paste relevant snippets, not just descriptions
- **State hypotheses**: Shows you've thought about it
- **Ask focused questions**: Not "what's wrong?" but "why does X cause Y?"
