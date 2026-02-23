# Plan: Dev Footer Cleanup — Remove Leftover Dev Artifact

> **Status:** 🔴 Ready
> **Assigned:** [@Mobile-Dev]
> **Priority:** Quick Fix

---

## Problem Statement

During offline sync testing (2026-01-03), Maya added a dev footer to `login.tsx` showing the app version ("Fieldbox © 2026 v1.0.4"). This was for debugging the feature flag and was never removed before session end.

**Evidence:** [Screenshot](file:///C:/Users/jogor/.gemini/antigravity/brain/4437c472-092f-4ad2-aa55-ea0e4ff76a48/uploaded_image_1767558150073.png)

---

## Current Implementation (To Remove)

### File: `client/src/pages/login.tsx`

**Lines 377-383:**
```tsx
{/* Footer */}
<div className="mt-8 text-center text-sm text-gray-500 relative z-10 p-4">
  <p>Fieldbox &copy; {new Date().getFullYear()}</p>
  <div className="cursor-default select-none inline-block p-2">
    <p className="text-xs mt-1 opacity-50 font-mono">v1.0.4</p>
  </div>
</div>
```

---

## Proposed Solution

### Option A: Remove Entire Footer (Recommended)
Delete lines 377-383 entirely. The login page doesn't need a footer — focus should be on the login form.

### Option B: Keep Copyright, Remove Version
If footer is desired, remove only the version number:
```tsx
{/* Footer */}
<div className="mt-8 text-center text-sm text-gray-500 relative z-10 p-4">
  <p>Fieldbox &copy; {new Date().getFullYear()}</p>
</div>
```

**Victor Recommendation:** Option A (Remove entirely) — cleaner look, less clutter on login.

---

## Verification Plan

### 1. Build Check (Automated)
```powershell
npm run build
npx tsc --noEmit
```
**Expected:** Both pass with no errors.

### 2. Visual Verification (Manual - User)
| Viewport | URL | Expected |
|----------|-----|----------|
| Mobile (375px) | `/login` | No footer visible, layout still correct |
| Desktop (1024px+) | `/login` | No footer visible, page looks clean |

**Test Steps:**
1. Open the live site (or dev server)
2. Navigate to `/login`
3. Scroll to bottom of page (if scrollable)
4. **Verify:** No "Fieldbox © 2026" or "v1.0.4" text visible
5. **Verify:** Page layout is not broken

---

## Files Modifying

| File | Action |
|------|--------|
| `client/src/pages/login.tsx` | DELETE lines 377-383 (footer section) |

---

## Rollback Plan

If removal breaks something, restore lines 377-383 from git history:
```powershell
git checkout HEAD~1 -- client/src/pages/login.tsx
```
