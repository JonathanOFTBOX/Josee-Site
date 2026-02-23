# Offline Sync Engine — Dexie Implementation

> **Author:** Victor (CTO)  
> **Date:** 2026-01-03  
> **Status:** 🟢 Ready for Maya  
> **Priority:** Critical

---

## Problem Statement

Current offline system uses **localStorage** which has limitations:
- Max 5MB storage (not enough for photos)
- No binary blob support (photos stored as base64)
- No transaction guarantees
- Data loss risk on browser clear

**Goal:** Migrate to **Dexie** (IndexedDB wrapper) for robust offline support.

---

## Current State

| File | Purpose | Lines |
|------|---------|-------|
| `client/src/lib/sync-queue.ts` | Queue class with localStorage | 143 |
| `client/src/components/sync-status.tsx` | UI indicator | 95 |
| `client/src/api/providers/supabase/SessionProvider.ts` | Uses queue for punch_in/punch_out | 601 |

**What Already Works:**
- Punch-in/punch-out queued offline
- Job status updates queued
- Retry logic (5 max retries)
- Online/offline detection
- UI indicator showing pending count

**What Needs Improvement:**
- Photo storage (currently base64 in localStorage = OOM risk)
- Storage reliability (IndexedDB > localStorage)
- Transaction support for multi-step operations

---

## ⚠️ Critical Constraints

| Constraint | Reason |
|------------|--------|
| **Feature Flag Required** | `isOfflineV2` — allows rollback |
| **Parallel System** | Keep old queue working alongside new |
| **No Breaking Changes** | Existing online flow must not change |
| **Mobile Memory** | Photos cause OOM — must use blob storage |

---

## Proposed Changes

### Phase 1: Install Dexie + Create Schema

#### [NEW] client/src/lib/offline-db.ts

```typescript
import Dexie, { Table } from 'dexie';

export interface OfflineMutation {
  id: string;
  type: 'punch_in' | 'punch_out' | 'check_in' | 'photo_upload';
  operation: 'INSERT' | 'UPDATE';
  table: string;
  payload: any;
  match?: Record<string, any>;
  timestamp: number;
  retryCount: number;
}

export interface OfflinePhoto {
  id: string;
  sessionId: string | null;
  blob: Blob;          // Store actual blob, not base64
  timestamp: number;
  synced: boolean;
}

class FieldboxOfflineDB extends Dexie {
  mutations!: Table<OfflineMutation, string>;
  photos!: Table<OfflinePhoto, string>;

  constructor() {
    super('fieldbox_offline_v2');
    
    this.version(1).stores({
      mutations: 'id, type, timestamp, retryCount',
      photos: 'id, sessionId, timestamp, synced'
    });
  }
}

export const offlineDb = new FieldboxOfflineDB();
```

---

### Phase 2: Create Feature Flag

#### [MODIFY] client/src/lib/feature-flags.ts (or create if not exists)

```typescript
export const FEATURE_FLAGS = {
  // Offline V2: Use Dexie/IndexedDB instead of localStorage
  isOfflineV2: localStorage.getItem('FF_OFFLINE_V2') === 'true'
};

// Helper for testing
export function enableOfflineV2() {
  localStorage.setItem('FF_OFFLINE_V2', 'true');
  window.location.reload();
}

export function disableOfflineV2() {
  localStorage.removeItem('FF_OFFLINE_V2');
  window.location.reload();
}
```

---

### Phase 3: Create New Sync Queue (Dexie-based)

#### [NEW] client/src/lib/dexie-sync-queue.ts

This mirrors `sync-queue.ts` but uses IndexedDB:
- `addToQueue()` → writes to Dexie instead of localStorage
- `processQueue()` → reads from Dexie
- `storePhoto()` → stores Blob directly (not base64)
- Events for UI updates

**Key difference:** Photos stored as Blob, not base64 strings.

---

### Phase 4: Update SessionProvider

#### [MODIFY] client/src/api/providers/supabase/SessionProvider.ts

```typescript
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { syncQueue } from '@/lib/sync-queue';      // Old
import { dexieSyncQueue } from '@/lib/dexie-sync-queue';  // New

// In startJob() offline branch:
if (!navigator.onLine) {
  const queue = FEATURE_FLAGS.isOfflineV2 ? dexieSyncQueue : syncQueue;
  await queue.addToQueue(...);
}
```

---

### Phase 5: Update SyncStatusIndicator

#### [MODIFY] client/src/components/sync-status.tsx

Use the same feature flag to show count from correct queue:

```typescript
const pendingCount = FEATURE_FLAGS.isOfflineV2 
  ? await dexieSyncQueue.getCount() 
  : syncQueue.getCount();
```

---

## Files To Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `client/src/lib/offline-db.ts` | **[NEW]** | Dexie database schema |
| `client/src/lib/feature-flags.ts` | **[NEW]** | Feature flag system |
| `client/src/lib/dexie-sync-queue.ts` | **[NEW]** | New queue using Dexie |
| `client/src/lib/sync-queue.ts` | **[KEEP]** | Keep as fallback |
| `client/src/api/providers/supabase/SessionProvider.ts` | **[MODIFY]** | Add feature flag branch |
| `client/src/components/sync-status.tsx` | **[MODIFY]** | Use correct queue based on flag |
| `package.json` | **[MODIFY]** | Add `dexie` dependency |

---

## Verification Plan

### 1. Automated — TypeScript Build
```bash
npm run build
npx tsc --noEmit
```

### 2. Manual — Developer Testing

**Test A: Basic Offline Queue (Feature Flag OFF)**
1. Open app in browser (Chrome DevTools)
2. Verify `localStorage.getItem('FF_OFFLINE_V2')` returns null
3. Go offline (DevTools → Network → Offline)
4. Punch in to a job
5. Observe sync-status shows "Offline (1)"
6. Go online
7. Observe "Syncing..." then queue clears
8. **Expected:** Punch appears in Supabase

**Test B: Dexie Queue (Feature Flag ON)**
1. Run in console: `localStorage.setItem('FF_OFFLINE_V2', 'true'); location.reload();`
2. Go offline
3. Punch in to a job
4. Check IndexedDB in DevTools → Application → IndexedDB → fieldbox_offline_v2
5. Observe mutation row exists
6. Go online
7. Observe queue processes
8. **Expected:** Punch appears in Supabase, IndexedDB clears

**Test C: Photo Upload Offline (v2 only)**
1. Enable flag
2. Go offline
3. Punch in WITH photo
4. Check IndexedDB → photos table
5. Observe blob stored (not base64 string)
6. Go online
7. Observe photo syncs
8. **Expected:** Photo URL appears in session record

### 3. Rollback Test
1. Enable flag, add items to queue
2. Run: `localStorage.removeItem('FF_OFFLINE_V2'); location.reload();`
3. Verify old queue (localStorage) still works
4. **Expected:** No crash, fallback works

---

## Rollout Plan

| Phase | Action | Risk |
|-------|--------|------|
| 1 | Deploy with flag OFF | Zero risk — no behavior change |
| 2 | Internal testing with flag ON | Low risk — revertable |
| 3 | Enable for 10% of users | Monitor for errors |
| 4 | Full rollout | - |
| 5 | Remove old localStorage queue | After 1 week stable |

---

## Dependencies

```bash
npm install dexie
```

---

## Dispatch Instruction for Maya

1. **Read** this plan fully
2. **Install Dexie:** `npm install dexie`
3. **Create files in order:** offline-db.ts → feature-flags.ts → dexie-sync-queue.ts
4. **Modify:** SessionProvider.ts (add feature flag branch)
5. **Modify:** sync-status.tsx (add feature flag branch)
6. **Test:** `npm run build` must pass
7. **Test:** Manual tests A, B, C above
8. **Commit:** `feat(offline): Add Dexie-based offline sync (behind feature flag)`

---

## Success Criteria

- [ ] Dexie installed and schema created
- [ ] Feature flag system working
- [ ] New queue works when flag enabled
- [ ] Old queue unbroken when flag disabled
- [ ] Photos stored as blobs (not base64)
- [ ] Build passes
- [ ] Manual tests pass
