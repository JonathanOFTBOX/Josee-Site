# Boss Work Mode

> **Goal:** Allow Boss (role=boss) to use Worker features (punch in/out, photos, timesheet) without logout.
> **Approach:** Simple menu link — NO new pages, NO new modals. Reuse existing Worker module.
> **Status:** ✅ COMPLETE

---

## User Requirements (2026-01-02)

| Requirement | Decision |
|-------------|----------|
| New pages? | ❌ NO — Reuse existing `/worker/*` pages |
| New modals? | ❌ NO — Worker modals already work |
| New layouts? | ❌ NO — Worker layout is fine |
| Boss works as? | ✅ **Their own name** (not impersonating another worker) |
| Menu location? | ✅ **Sidebar Footer** (toggle/link near profile) |

---

## Proposed Changes

### 1. [MODIFY] Boss Sidebar — Add Work Mode Link

**File:** `client/src/pages/boss/dashboard/index.tsx` (or wherever sidebar is rendered for Boss)

**Change:**
- Add "🔧 Work Mode" button in sidebar footer
- On click → Navigate to `/worker/jobs`
- Style: Secondary button or toggle appearance

**Example UI:**
```
┌─────────────────────┐
│ Dashboard           │
│ Calendar            │
│ Admin               │
│ Reports             │
│─────────────────────│
│                     │
│ 🔧 Work Mode        │  ← NEW (footer area)
│ ⚙️ Settings         │
│ 👤 Jonathan V.      │
└─────────────────────┘
```

---

### 2. [VERIFY] Worker Pages Accept Boss Role

**Files to check:**
- `client/src/pages/worker/jobs.tsx`
- `client/src/pages/worker/job-detail.tsx`
- `client/src/pages/worker/active-session/index.tsx`
- `client/src/pages/worker/timesheet.tsx`

**Expected:** These pages should work for any authenticated user. Verify they don't have `role === 'worker'` guards that would block Boss.

**If blocked:** Update route guards to allow `role === 'boss'` access.

---

### 3. [VERIFY] Worker Bottom Nav Returns to Boss Pages

**File:** `client/src/components/bottom-nav.tsx`

**Issue:** When Boss is on Worker pages, the bottom nav might not have a "Back to Admin" option.

**Solution Options:**
1. Add "Admin" icon to bottom nav when user role is `boss`
2. Add "Exit Work Mode" button that returns to `/boss/dashboard`

---

### 4. [OPTIONAL] Visual Indicator for Work Mode

When Boss is in Worker pages, show a small indicator:
- Top banner: "Working as: Jonathan Villeneuve"
- Or colored badge on profile

**Purpose:** Remind Boss they're in Work Mode, not Admin Mode.

---

## Verification Plan

### Static Verification
```powershell
npm run build
npx tsc --noEmit
```

### Manual Verification (User)
1. Login as Boss (`jonathan@oftbox.com`)
2. Click "Work Mode" in sidebar
3. Verify redirect to `/worker/jobs`
4. Verify can see jobs assigned to Boss
5. Click a job → Verify punch-in flow works
6. Punch out → Verify session recorded under Boss's name
7. Navigate back to Admin → Verify everything still works

---

## Files to Modify

| File | Change |
|------|--------|
| Sidebar component | Add "Work Mode" link in footer |
| Worker route guards | Verify Boss can access (if any guards exist) |
| Bottom nav | Add "Admin" or "Exit" option for Boss users |

---

## Effort Estimate

| Task | Effort |
|------|--------|
| Add sidebar link | 15 min |
| Verify/fix route guards | 30 min |
| Bottom nav update | 20 min |
| Testing | 15 min |
| **Total** | **~1 hour** |

---

## Assigned To
**Agent:** @Desktop-Dev (Derek)
**Model:** Gemini 3 Pro High (UI work)
**Priority:** 🟠 Medium

---

## Approval

- [ ] CTO Approved (Victor)
- [ ] User Approved (John)
