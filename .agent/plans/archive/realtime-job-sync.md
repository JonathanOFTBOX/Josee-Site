# Real-Time Job Sync (Live Updates)

> **Goal:** Jobs created/edited by Admin instantly appear for all company users without refresh.

## User Review Required

> [!IMPORTANT]
> **Supabase Costs:** Realtime subscriptions add ~$0.01 per 1000 messages. With ~10 users, this is negligible.
> **RLS Applied:** All realtime queries respect Row-Level Security (company isolation preserved).

---

## Proposed Changes

### Phase 1: Backend Setup (Marcus)

#### [MODIFY] Supabase Realtime Configuration

Enable realtime on `jobs` table in Supabase Dashboard:
1. Go to Database → Replication
2. Enable `supabase_realtime` publication for `jobs` table
3. Verify RLS policies prevent cross-company access

**Migration not needed** — Realtime is enabled via dashboard, not SQL.

---

### Phase 2: Admin/Calendar Sync (Derek)

#### [MODIFY] [calendar/index.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/calendar/index.tsx)

Add Supabase realtime subscription:
```typescript
// Subscribe to jobs changes for this company
useEffect(() => {
  const channel = supabase
    .channel('jobs-realtime')
    .on('postgres_changes', {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'jobs',
      filter: `company_id=eq.${user.companyId}`
    }, (payload) => {
      // Invalidate React Query cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [user.companyId]);
```

#### [MODIFY] [admin/index.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/admin/index.tsx)

Same subscription pattern as Calendar.

---

### Phase 3: Worker Jobs Sync (Derek/Maya)

#### [MODIFY] [jobs.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/worker/jobs.tsx)

Subscribe only to jobs where worker is assigned:
```typescript
useEffect(() => {
  const channel = supabase
    .channel('my-jobs-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'jobs',
      filter: `assigned_workers=cs.{${user.id}}`
    }, (payload) => {
      // Check if this is a NEW assignment
      if (payload.eventType === 'UPDATE' && 
          payload.new.assigned_workers?.includes(user.id) &&
          !payload.old.assigned_workers?.includes(user.id)) {
        // Mark as NEW
        setNewJobIds(prev => [...prev, payload.new.id]);
      }
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [user.id]);
```

#### [NEW] "NEW" Badge Component

Add badge to job cards for newly assigned jobs:
```tsx
{newJobIds.includes(job.id) && (
  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
    NEW
  </span>
)}
```

**Badge Behavior (User Confirmed):**
- Badge disappears when worker clicks on the job
- Store clicked job IDs in localStorage to persist across refreshes

#### [NEW] Notification Sound

Play subtle notification sound when new job is assigned:
```typescript
// In the realtime subscription callback
if (isNewAssignment) {
  const audio = new Audio('/notification.mp3');
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Ignore if autoplay blocked
}
```

> [!TIP]
> Use a short, professional notification sound (< 1 second). Consider using Web Audio API for better mobile support.

---

## Verification Plan

### Manual Verification
1. **Admin Test:** Open Calendar in 2 browser tabs → Create job in Tab 1 → Verify Tab 2 updates instantly
2. **Worker Test:** Assign job to worker → Worker's "My Jobs" shows new job with "NEW" badge
3. **Multi-Tenancy:** Login as different company → Verify no cross-company data leakage

### Automated Tests
None required — this is a UX enhancement.

---

## Dispatch Order

| # | Agent | Task | Model |
|---|-------|------|-------|
| 1 | Marcus | Enable Realtime on `jobs` table, verify RLS | Claude Opus 4.5 |
| 2 | Derek | Add subscriptions to Calendar + Admin | Gemini 3 Pro High |
| 3 | Derek/Maya | Add subscription to Worker Jobs + NEW badge | Gemini 3 Pro High |

---

## Screenshots Reference

Calendar View (Admin):
![Calendar](C:/Users/jogor/.gemini/antigravity/brain/978c7ccd-cb91-4f3f-bf34-7f6d2afdf533/uploaded_image_0_1767464329367.png)

Worker Jobs View:
![Worker Jobs](C:/Users/jogor/.gemini/antigravity/brain/978c7ccd-cb91-4f3f-bf34-7f6d2afdf533/uploaded_image_1_1767464329367.png)
