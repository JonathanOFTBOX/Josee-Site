# Plan: TSC Failure Fix — DataProvider Type Mismatch

> **Status:** ✅ Done (2026-01-04)
> **Assigned:** [@Enforcer]
> **Priority:** Medium (Type Safety)

---

## Problem Statement

`npx tsc --noEmit` fails with type errors. The issue is a mismatch between `undefined` (from payload) and `null` (expected by Session type).

**Discovered by:** Maya during Dev Footer Cleanup session (2026-01-04)

---

## Root Cause Analysis

### The Error
`endLatitude` and `endLongitude` in MockSessionProvider.ts are assigned from `payload.latitude` which can be `undefined`, but the `Session` type expects `number | null`.

### File: `client/src/api/providers/mock/MockSessionProvider.ts`

**Lines 84-85:**
```typescript
endLatitude: payload.latitude,    // payload.latitude is number | undefined
endLongitude: payload.longitude,  // Session expects number | null
```

### The Type Definition (EndJobPayload)
Check `client/src/api/types.ts` for `EndJobPayload` type — likely has optional `latitude?: number` which becomes `undefined` when not provided.

---

## Proposed Solution

**Option A: Nullish Coalescing (Recommended)**
```typescript
endLatitude: payload.latitude ?? null,
endLongitude: payload.longitude ?? null,
```

**Option B: Update EndJobPayload type**
Change `latitude?: number` to `latitude?: number | null` — but this might have cascading effects.

---

## Files to Check/Modify

| File | Action |
|------|--------|
| `client/src/api/providers/mock/MockSessionProvider.ts` | Fix lines 84-85 |
| `client/src/api/providers/supabase/SessionProvider.ts` | Check for same issue |
| `client/src/api/DataProvider.ts` | Check for same issue |
| `client/src/api/types.ts` | Review EndJobPayload type |

---

## Verification Plan

1. **After Fix:**
   ```powershell
   npx tsc --noEmit
   ```
   **Expected:** No errors, exit code 0

2. **Build Check:**
   ```powershell
   npm run build
   ```
   **Expected:** Build succeeds

---

## Rollback

If fix breaks something:
```powershell
git checkout HEAD~1 -- client/src/api/providers/mock/MockSessionProvider.ts
```
